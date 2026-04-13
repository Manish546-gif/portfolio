import { useEffect, useRef } from 'react';

/**
 * VideoWithGlitch - GPU-accelerated video hover effect
 * 
 * Usage:
 * <VideoWithGlitch src="video.mp4" />
 * <VideoWithGlitch src="video.mp4" effect="displacement" intensity={0.7} blockSize={0.5} />
 * 
 * Props:
 * - src: Video URL (required)
 * - effect: "blockGlitch" | "pixelSort" | "displacement" (default: "displacement")
 * - intensity: 0-1 (default: 0.7)
 * - blockSize: 0-1 (default: 0.5)
 * - width: CSS width (default: "100%")
 * - height: CSS height (default: "100%")
 * - autoplay: auto play video (default: true)
 * - loop: loop video (default: true)
 * - muted: mute video (default: true)
 * - className: additional CSS classes
 */
export default function VideoWithGlitch({
  src,
  effect = 'displacement',
  intensity = 0.7,
  blockSize = 0.5,
  width = '100%',
  height = '100%',
  autoplay = true,
  loop = true,
  muted = true,
  className = '',
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const glRef = useRef(null);
  const stateRef = useRef({
    mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5,
    hov: 0, hovT: 0, rafId: null, t0: 0,
  });

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

    float rand(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

    vec2 displacement3D(vec2 uv, vec2 m){
      float bs = u_blocksize * 0.07;
      vec2 d = uv - m; d.x *= u_aspect;
      float dist = length(d);
      float falloff = exp(-dist*dist/(0.08*0.08)) * u_hover;
      vec2 cell = floor(uv/bs);
      float r  = rand(cell + 0.3);
      float r2 = rand(cell*2.1 + 0.7);
      float extrudeX = (r *2.0-1.0) * u_intensity * 0.12 * falloff;
      float extrudeY = -(r2)        * u_intensity * 0.14 * falloff;
      return uv + vec2(extrudeX, extrudeY);
    }

    void main(){
      // Flip Y for video texture coordinates
      vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
      vec2 m = vec2(u_mouse.x, u_mouse.y);
      
      vec2 w = displacement3D(uv, m);

      /* chromatic aberration */
      vec2 cd = uv - m; cd.x *= u_aspect;
      float cr = length(cd);
      float cf = exp(-cr/(0.15)) * u_hover;
      float bs = u_blocksize * 0.06;
      vec2 cell = floor(uv/bs);
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
      console.error('Shader error:', gl.getShaderInfoLog(s));
    return s;
  }

  function createProgram(gl) {
    const prog = gl.createProgram();
    gl.attachShader(prog, createShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER));
    gl.attachShader(prog, createShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    return prog;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    glRef.current = gl;

    const prog = createProgram(gl);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      u_mouse: gl.getUniformLocation(prog, 'u_mouse'),
      u_hover: gl.getUniformLocation(prog, 'u_hover'),
      u_time: gl.getUniformLocation(prog, 'u_time'),
      u_intensity: gl.getUniformLocation(prog, 'u_intensity'),
      u_blocksize: gl.getUniformLocation(prog, 'u_blocksize'),
      u_aspect: gl.getUniformLocation(prog, 'u_aspect'),
      u_tex: gl.getUniformLocation(prog, 'u_tex'),
    };

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const lerp = (a, b, t) => a + (b - a) * t;
    const state = stateRef.current;
    state.t0 = performance.now();

    const frame = () => {
      const s = state;
      s.mx = lerp(s.mx, s.tx, 0.07);
      s.my = lerp(s.my, s.ty, 0.07);
      s.hov = lerp(s.hov, s.hovT, 0.055);

      const t = (performance.now() - s.t0) / 1000;
      const asp = canvas.width / canvas.height;

      // Update texture from video with better error handling
      try {
        if (video && video.readyState >= 2) { // HAVE_CURRENT_DATA or better
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        }
      } catch (e) {
        console.error('Texture update error:', e);
      }

      gl.uniform2f(uniforms.u_mouse, s.mx, s.my);
      gl.uniform1f(uniforms.u_hover, s.hov);
      gl.uniform1f(uniforms.u_time, t);
      gl.uniform1f(uniforms.u_intensity, intensity);
      gl.uniform1f(uniforms.u_blocksize, blockSize);
      gl.uniform1f(uniforms.u_aspect, asp);
      gl.uniform1i(uniforms.u_tex, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      s.rafId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(state.rafId);
    };
  }, [intensity, blockSize]);

  const onMove = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const s = stateRef.current;
    s.tx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    s.ty = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
  };

  const onEnter = () => {
    stateRef.current.hovT = 1;
  };

  const onLeave = () => {
    stateRef.current.hovT = 0;
    stateRef.current.tx = 0.5;
    stateRef.current.ty = 0.5;
  };

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
        }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      />
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        style={{ display: 'none' }}
        crossOrigin="anonymous"
        onError={(e) => console.error('Video error:', e)}
        onLoadedMetadata={() => {
          videoRef.current?.play().catch(err => console.error('Play error:', err));
        }}
      />
    </div>
  );
}
