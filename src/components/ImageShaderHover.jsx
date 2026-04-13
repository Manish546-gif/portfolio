import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main(){
    v_uv = a_pos*0.5+0.5;
    gl_Position = vec4(a_pos,0.,1.);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_tex;
  uniform vec2 u_mouse;
  uniform float u_hover;
  uniform float u_time;
  uniform float u_intensity;
  uniform float u_blocksize;
  uniform float u_aspect;
  uniform float u_effect;   // 0=blockGlitch  1=pixelSort  2=displacement

  float rand(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

  vec2 blockGlitch(vec2 uv, vec2 m){
    float bs = u_blocksize * 0.06;
    vec2 d = uv - m; d.x *= u_aspect;
    float dist = length(d);
    float distF = exp(-dist/0.25) * u_hover;
    vec2 cell = floor(uv/bs);
    float r  = rand(cell + floor(u_time*4.0)*0.1);
    float r2 = rand(cell*1.3 + floor(u_time*3.0)*0.13);
    float jx = (r -0.5)*2.0 * u_intensity * 0.18 * distF;
    float jy = (r2-0.5)*2.0 * u_intensity * 0.10 * distF;
    return uv + vec2(jx, jy);
  }

  vec2 pixelSort(vec2 uv, vec2 m){
    float bs = u_blocksize * 0.05;
    vec2 d = uv - m; d.x *= u_aspect;
    float dist = length(d);
    float falloff = exp(-dist/0.22) * u_hover;
    vec2 cell = floor(uv/bs);
    float r = rand(cell + floor(u_time*2.0)*0.07);
    float slide = (r-0.5) * u_intensity * 0.22 * falloff;
    return uv + vec2(slide, 0.0);
  }

  vec2 displacement3D(vec2 uv, vec2 m){
    float bs = u_blocksize * 0.07;
    vec2 d = uv - m; d.x *= u_aspect;
    float dist = length(d);
    float falloff = exp(-dist*dist/(0.15*0.15)) * u_hover;
    vec2 cell = floor(uv/bs);
    float r  = rand(cell + 0.3);
    float r2 = rand(cell*2.1 + 0.7);
    float extrudeX = (r *2.0-1.0) * u_intensity * 0.12 * falloff;
    float extrudeY = -(r2)        * u_intensity * 0.14 * falloff;
    return uv + vec2(extrudeX, extrudeY);
  }

  void main(){
    int e = int(u_effect+0.5);
    vec2 w;
    if(e==0)      w = blockGlitch   (v_uv, u_mouse);
    else if(e==1) w = pixelSort     (v_uv, u_mouse);
    else          w = displacement3D(v_uv, u_mouse);

    /* chromatic aberration */
    vec2 cd = v_uv - u_mouse; cd.x *= u_aspect;
    float cr = length(cd);
    float cf = exp(-cr/0.22) * u_hover;
    float bs = u_blocksize * 0.06;
    vec2 cell = floor(v_uv/bs);
    float rCell = rand(cell + floor(u_time*4.)*0.1);
    float caShift = 0.006 * u_intensity * cf;

    vec2 rUV = clamp(w + vec2(caShift*rCell, 0.), 0., 1.);
    vec2 gUV = clamp(w,                           0., 1.);
    vec2 bUV = clamp(w - vec2(caShift*rCell, 0.), 0., 1.);

    float r = texture2D(u_tex, rUV).r;
    float g = texture2D(u_tex, gUV).g;
    float b = texture2D(u_tex, bUV).b;

    float bright = 1.0 + cf * 0.08;
    gl_FragColor = vec4(vec3(r,g,b)*bright, 1.0);
  }
`;

function createShader(gl, src, type) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error("Shader error:", gl.getShaderInfoLog(s));
  return s;
}

function createProgram(gl) {
  const prog = gl.createProgram();
  gl.attachShader(prog, createShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER));
  gl.attachShader(prog, createShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER));
  gl.linkProgram(prog);
  return prog;
}

/**
 * ImageShaderHover
 *
 * Props:
 *   src          – image URL
 *   fallbackSrc  – backup URL if src fails
 *   effect       – "blockGlitch" | "pixelSort" | "displacement"  (default "blockGlitch")
 *   intensity    – 0..1   (default 0.7)
 *   blockSize    – 0..1   (default 0.5)
 *   width        – CSS dimension (default "100%")
 *   height       – CSS dimension (default "460px")
 *   className    – extra wrapper classes
 */
export default function ImageShaderHover({
  src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
  fallbackSrc = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
  effect = "blockGlitch",
  intensity = 0.7,
  blockSize = 0.5,
  width = "100%",
  height = "460px",
  className = "",
}) {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const glRef     = useRef(null);
  const uniforms  = useRef({});
  const state     = useRef({
    mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5,
    hov: 0, hovT: 0, rafId: null, t0: 0,
  });

  const effectIndex = { blockGlitch: 0, pixelSort: 1, displacement: 2 }[effect] ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    glRef.current = gl;

    const prog = createProgram(gl);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = uniforms.current;
    ["u_mouse","u_hover","u_time","u_intensity","u_blocksize","u_aspect","u_effect","u_tex"]
      .forEach(n => { U[n] = gl.getUniformLocation(prog, n); });

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([15, 18, 28, 255]));

    const loadImg = (url, onErr) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      };
      if (onErr) img.onerror = onErr;
      img.src = url;
    };
    loadImg(src, () => loadImg(fallbackSrc));

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const lerp = (a, b, t) => a + (b - a) * t;
    state.current.t0 = performance.now();

    const frame = () => {
      const s = state.current;
      s.mx  = lerp(s.mx,  s.tx,   0.07);
      s.my  = lerp(s.my,  s.ty,   0.07);
      s.hov = lerp(s.hov, s.hovT, 0.055);
      const t   = (performance.now() - s.t0) / 1000;
      const asp = canvas.width / canvas.height;
      const U   = uniforms.current;
      gl.uniform2f(U.u_mouse,    s.mx, s.my);
      gl.uniform1f(U.u_hover,    s.hov);
      gl.uniform1f(U.u_time,     t);
      gl.uniform1f(U.u_intensity, s.intensity  ?? intensity);
      gl.uniform1f(U.u_blocksize, s.blockSize  ?? blockSize);
      gl.uniform1f(U.u_effect,    s.effect     ?? effectIndex);
      gl.uniform1f(U.u_aspect,    asp);
      gl.uniform1i(U.u_tex,       0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      s.rafId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(state.current.rafId);
    };
  }, []); // eslint-disable-line

  useEffect(() => { state.current.intensity = intensity; }, [intensity]);
  useEffect(() => { state.current.blockSize = blockSize;  }, [blockSize]);
  useEffect(() => { state.current.effect    = effectIndex; }, [effectIndex]);

  const onMove = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const s = state.current;
    s.tx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    s.ty = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
    if (cursorRef.current) {
      cursorRef.current.style.left = (e.clientX - r.left) + "px";
      cursorRef.current.style.top  = (e.clientY - r.top)  + "px";
    }
  };
  const onEnter = () => {
    state.current.hovT = 1;
    if (cursorRef.current) cursorRef.current.style.opacity = "1";
  };
  const onLeave = () => {
    state.current.hovT = 0;
    state.current.tx   = 0.5;
    state.current.ty   = 0.5;
    if (cursorRef.current) cursorRef.current.style.opacity = "0";
  };

  return (
    <div style={{ position: "relative", width, height }} className={className}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%", cursor: "none", borderRadius: 12 }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      />
      <div
        ref={cursorRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: 22, height: 22,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.75)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.2s ease",
          mixBlendMode: "difference",
        }}
      />
    </div>
  );
}