import { useEffect, useRef, useState } from "react";
import icon from '../assets/aster.svg'

/* ─── constants ─────────────────────────────────── */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const QUOTE =
  "I combine timeless design principles with cutting-edge technology to craft award-winning websites that resonate with a global audience.";

/* ─── scramble util ──────────────────────────────── */
function scramble(el, finalText, duration = 900) {
  if (!el) return;
  let frame = 0;
  const totalFrames = Math.round(duration / 16);
  const chars = finalText.split("");
  const id = setInterval(() => {
    el.textContent = chars
      .map((ch, i) => {
        if (ch === " ") return " ";
        const revealed = Math.floor((frame / totalFrames) * chars.length);
        return i < revealed
          ? ch
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join("");
    frame++;
    if (frame > totalFrames) { el.textContent = finalText; clearInterval(id); }
  }, 16);
}

/* ─── component ─────────────────────────────────── */
export default function About() {
  const sectionRef   = useRef(null);
  const cursorRef    = useRef(null);
  const cursorDotRef = useRef(null);
  const btnRef       = useRef(null);
  const caption1Ref  = useRef(null);
  const caption2Ref  = useRef(null);
  const rafCursor    = useRef(null);
  const mouse        = useRef({ x: 0, y: 0 });
  const smooth       = useRef({ x: 0, y: 0 });
  const [entered, setEntered] = useState(false);

  /* ── inject CSS ── */
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "phil-anim-styles";
    s.innerHTML = `
      .phil-root { cursor: none !important; }
      .phil-root * { box-sizing: border-box; }

      /* cursor */
      .ph-cursor {
        position: fixed; width: 36px; height: 36px;
        border: 1px solid rgba(26,10,20,0.5); border-radius: 50%;
        pointer-events: none; z-index: 9999;
        transform: translate(-50%,-50%);
        transition: width .3s, height .3s, border-color .3s, background .3s;
        mix-blend-mode: multiply;
      }
      .ph-cursor.big { width: 68px; height: 68px; background: rgba(212,96,122,.12); border-color: #d4607a; }
      .ph-dot {
        position: fixed; width: 5px; height: 5px;
        background: #1a0a14; border-radius: 50%;
        pointer-events: none; z-index: 10000;
        transform: translate(-50%,-50%);
        transition: transform .05s;
      }

      /* noise flicker */
      @keyframes noise-flicker {
        0%,100%{ opacity:.55; background-position:0 0; }
        25%    { opacity:.45; background-position:40px 20px; }
        50%    { opacity:.5;  background-position:-20px 40px; }
        75%    { opacity:.48; background-position:30px -15px; }
      }
      .ph-noise {
        position: absolute; inset:0; pointer-events:none; z-index:1;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        animation: noise-flicker .08s steps(1) infinite;
      }



      /* char stagger */
      .ph-char {
        display: inline-block;
        opacity: 0;
        transform: translateY(64px) skewX(6deg);
        transition:
          opacity  .6s cubic-bezier(.22,1,.36,1) calc(var(--ci) * 30ms),
          transform .6s cubic-bezier(.22,1,.36,1) calc(var(--ci) * 30ms);
      }
      .ph-chars-go .ph-char,
      .ph-char.go { opacity:1; transform:none; }

      /* italic clip reveal */
      .ph-italic-clip {
        clip-path: inset(0 100% 0 0);
        transition: clip-path 1.1s cubic-bezier(.77,0,.18,1);
      }
      .ph-italic-go { clip-path: inset(0 0% 0 0) !important; }



      /* fade-up */
      .ph-fade { opacity:0; transform:translateY(26px); transition: opacity .7s ease, transform .7s ease; }
      .ph-fade.go { opacity:1; transform:none; }

      /* divider scale */
      .ph-divider { width:1px; background:rgba(26,10,20,.2); transform:scaleY(0); transform-origin:top; transition:transform 1.2s cubic-bezier(.77,0,.18,1) .2s; }
      .ph-divider.go { transform:scaleY(1); }

      /* quote word reveal */
      .ph-qword {
        display:inline-block; margin-right:.22em;
        opacity:0; transform:translateY(20px);
        transition: opacity .5s ease calc(var(--wi) * 38ms), transform .5s ease calc(var(--wi) * 38ms);
      }
      .ph-quote-go .ph-qword,
      .ph-qword.go { opacity:1; transform:none; }



      /* arrow btn */
      .ph-btn {
        width:52px; height:52px; border-radius:50%; background:#1a0a14;
        display:flex; align-items:center; justify-content:center;
        flex-shrink:0; cursor:none;
        transition: transform .4s cubic-bezier(.34,1.56,.64,1), background .2s;
      }
      .ph-btn:hover { background:#3a1a28; transform: scale(1.15) rotate(-45deg) !important; }

      /* ── Mobile responsive ── */
      @media (max-width: 768px) {
        .ph-root {
          cursor: auto !important;
        }
        .ph-cursor,
        .ph-dot {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById("phil-anim-styles"); if (el) el.remove(); };
  }, []);

  /* ── smooth cursor ── */
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Skip cursor tracking on mobile

    const onMv = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMv);
    const loop = () => {
      const lerp = (a, b, t) => a + (b - a) * t;
      smooth.current.x = lerp(smooth.current.x, mouse.current.x, 0.11);
      smooth.current.y = lerp(smooth.current.y, mouse.current.y, 0.11);
      if (cursorRef.current) {
        cursorRef.current.style.left = smooth.current.x + "px";
        cursorRef.current.style.top  = smooth.current.y + "px";
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = mouse.current.x + "px";
        cursorDotRef.current.style.top  = mouse.current.y + "px";
      }
      rafCursor.current = requestAnimationFrame(loop);
    };
    rafCursor.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMv); cancelAnimationFrame(rafCursor.current); };
  }, []);

  /* ── magnetic btn ── */
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const btn = btnRef.current;
    if (!btn || isMobile) return; // Skip magnetic effect on mobile

    const onMv = (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < 90) {
        const p = (1 - dist / 90) * 0.5;
        btn.style.transform = `translate(${dx * p}px,${dy * p}px)`;
        cursorRef.current?.classList.add("big");
      } else {
        btn.style.transform = "";
        cursorRef.current?.classList.remove("big");
      }
    };
    window.addEventListener("mousemove", onMv);
    return () => window.removeEventListener("mousemove", onMv);
  }, []);

  /* ── parallax on mouse ── */
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const root = sectionRef.current;
    if (!root || isMobile) return; // Skip parallax on mobile

    const onMv = (e) => {
      const { width, height, left, top } = root.getBoundingClientRect();
      const rx = ((e.clientX - left) / width  - 0.5) * 2;
      const ry = ((e.clientY - top)  / height - 0.5) * 2;
      root.querySelectorAll("[data-depth]").forEach((el) => {
        const d = parseFloat(el.dataset.depth);
        el.style.transform = `translate(${rx * d * 20}px,${ry * d * 13}px)`;
      });
    };
    root.addEventListener("mousemove", onMv);
    return () => root.removeEventListener("mousemove", onMv);
  }, []);

  /* ── intersection → trigger ── */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Mobile: trigger immediately on mount
      setTimeout(() => {
        setEntered(true);
        // Force all animated elements to show
        root?.querySelectorAll('.ph-char').forEach(el => el.classList.add('go'));
        root?.querySelectorAll('.ph-italic-clip').forEach(el => el.classList.add('ph-italic-go'));
        root?.querySelectorAll('.ph-fade').forEach(el => el.classList.add('go'));
        root?.querySelectorAll('.ph-divider').forEach(el => el.classList.add('go'));
        root?.querySelectorAll('.ph-qword').forEach(el => el.classList.add('go'));
        
        scramble(caption1Ref.current, "I HAVE MADE MULTIPLE WEBSITES FOR DIFFERENT ORGANIZATIONS.", 900);
        scramble(caption2Ref.current, "MY FORTE LIES IN TECH, BEAUTY, FASHION, FOOD, CRYPTO AND SAAS", 900);
      }, 50);
    } else {
      // Desktop: use IntersectionObserver
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setEntered(true);
          root?.querySelectorAll('.ph-char').forEach(el => el.classList.add('go'));
          root?.querySelectorAll('.ph-italic-clip').forEach(el => el.classList.add('ph-italic-go'));
          root?.querySelectorAll('.ph-fade').forEach(el => el.classList.add('go'));
          root?.querySelectorAll('.ph-divider').forEach(el => el.classList.add('go'));
          root?.querySelectorAll('.ph-qword').forEach(el => el.classList.add('go'));
          setTimeout(() => scramble(caption1Ref.current, "I HAVE MAD MULTIPLE WEBSITES FOR DIFFERENT ORGANIZATIONS.", 900), 650);
          setTimeout(() => scramble(caption2Ref.current, "MY FORTE LIES IN TECH, BEAUTY, FASHION, FOOD, CRYPTO AND SAAS", 900), 820);
          obs.disconnect();
        }
      }, { threshold: 0.12 });
      obs.observe(root);
      return () => obs.disconnect();
    }
  }, []);

  /* ── split chars helper ── */
  const splitChars = (text, offset = 0) =>
    text.split("").map((ch, i) => (
      <span key={i} className="ph-char" style={{ "--ci": i + offset }}>
        {ch}
      </span>
    ));

  const quoteWords = QUOTE.split(" ");

  return (
    <>
      <div ref={cursorRef} className="ph-cursor" />
      <div ref={cursorDotRef} className="ph-dot" />

      <section
        id="about"
        ref={sectionRef}
        className="ph-root border-b-2 border-[#1A0A14]"
        style={{
          backgroundColor: "#FFFFFF",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,
          minHeight: "110vh",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="ph-noise" />

        {/* Two columns - responsive layout */}
        <div className="flex flex-col md:flex-row flex-1 w-full relative z-2 md:min-h-screen">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-8 md:gap-7.5 w-full md:w-[55%] px-4 md:px-16 py-8 md:py-10">

            {/* CRAFTING */}
            <div style={{ lineHeight:"0.88", userSelect:"none" }}>
              <div className="relative" data-depth="0.2" style={{ position:"relative", display:"inline-block", width:"100%" }}>
                <div
                  className={`ph-chars-wrap ${entered ? "ph-chars-go" : ""}`}
                  style={{ fontFamily:"Compacta", color:"#1a0a14", fontSize:"clamp(100px,12vw,260px)", lineHeight:0.88, display:"block" ,fontWeight:700}}
                >
                  {splitChars("CRAFTING", 0)}
                </div>
                <div 
                  className={`ph-italic-clip ${entered ? "ph-italic-go" : ""}`}
                  style={{
                    fontFamily:"FleurDeLeah", fontStyle:"italic", fontWeight:400,height:180, color:"#d4607a",paddingLeft:10,paddingRight:14,
                    fontSize:"clamp(55px,10vw,106px)", position:"absolute", top:"24%", left:"7%",
                     pointerEvents:"none", transitionDelay: "0.3s",
                  }}
                >
                  for Visionary
                </div>
              </div>

              {/* LEGACIES */}
              <div data-depth="0.35" style={{ position:"relative", display:"inline-block", width:"100%", marginTop:"-0.04em" }}>
                <div
                  className={`${entered ? "ph-chars-go" : ""}`}
                  style={{ fontFamily:"Compacta", color:"#1a0a14", fontSize:"clamp(100px,14vw,220px)", lineHeight:0.88, display:"block" ,fontWeight:600 }}
                >
                  {splitChars("LEGACIES", 8)}
                </div>
                <div
                  className={`ph-italic-clip ${entered ? "ph-italic-go" : ""}`}
                  style={{
                    fontFamily:"FleurDeLeah", fontStyle:"italic", fontWeight:400,height:180, color:"#d4607a",paddingLeft:10,paddingRight:14,
                    fontSize:"clamp(68px,14vw,146px)", position:"absolute", top:"20%", left:"7%",
                     pointerEvents:"none", transitionDelay: "0.3s",
                  }}
                >
                  brands
                </div>
              </div>
            </div>

            {/* Captions */}
            <div
              className={`ph-fade ${entered ? "go" : ""}`}
              style={{ display:"flex", gap:64, marginTop:24, transitionDelay:"0.9s" }}
            >
              <p ref={caption1Ref} className="ph-small" style={{ fontFamily: "PPEditorialNew", letterSpacing:"0.1em", color:"#1a0a14", fontSize:11, lineHeight:1.5, width:160, minHeight:48 }} />
              <p ref={caption2Ref} className="ph-small" style={{fontFamily: "PPEditorialNew", letterSpacing:"0.1em", color:"#1a0a14", fontSize:11, lineHeight:1.5, width:192, minHeight:48 }} />
            </div>

            <div style={{ flex:1 }} />

            {/* MY PHILOSOPHY row */}
            <div
              className={`ph-fade flex items-center justify-between px-8 py-6 border-t border-gray-300/40 ${entered ? "go" : ""}`}
              style={{ transitionDelay:"1.15s" }}
            >
              <span style={{ fontFamily: "PPEditorialNew", letterSpacing:"0.15em", fontSize:13, color:"#1a0a14", fontWeight:500 }}>
                MY PHILOSOPHY
              </span>
              <button 
                ref={btnRef} 
                onClick={() => {
                  const el = document.getElementById("philosophy");
                  if (el) window.__lenis?.scrollTo(el, { offset: 0, duration: 1.5 });
                }}
                className="ph-btn flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 shrink-0 transition-all duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 5v14M12 19l-7-7M12 19l7-7"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Divider */}
          {/* <div className={`ph-divider ${entered ? "go" : ""}`} style={{ margin:"40px 0" }} /> */}

          {/* ── RIGHT ── */}
          <div className="flex flex-col justify-start w-full md:w-[45%] px-4 md:px-12 md:pl-10 py-8 md:py-10 relative border-t md:border-t-0 md:border-l border-gray-300/40">
             <div className="h-32 md:h-80 w-full md:pr-26">
              <div className="h-20 md:h-30 w-full gap-2 md:gap-5 flex justify-start md:justify-end">
                <img className="h-[90%] w-auto rounded-lg" src={icon} alt="" />
                <img className="h-[90%] w-auto rounded-lg" src={icon} alt="" />
                <img className="h-[90%] w-auto rounded-lg" src={icon} alt="" />
              </div>
             </div>
            {/* WHAT I DO */}
            <div
              className={`ph-fade flex items-center gap-3 md:gap-12 mb-16 md:mb-8 ml-35 md:ml-52 ${entered ? "go" : ""}`}
              style={{ transitionDelay:"0.5s" }}
            >
              <span style={{ fontSize: "11px", color:"#1a0a14", opacity:0.4, fontFamily: "PPEditorialNew" }}>◀</span>
              <span style={{ fontFamily: "PPEditorialNew", letterSpacing:"0.25em", color:"#1a0a14", fontSize: "11px" }}>WHAT I DO</span>
              <span style={{ fontSize: "11px", color:"#1a0a14", opacity:0.4, fontFamily: "PPEditorialNew" }}>▶</span>
            </div>

            {/* Quote */}
            <blockquote
              className={entered ? "ph-quote-go" : ""}
              style={{ fontFamily: "PPEditorialNew", fontStyle:"italic",textAlign:'center', fontWeight:400, color:"#1a0a14", lineHeight:1.2, fontSize:"clamp(30px,5vw,44px)", maxWidth: window.innerWidth < 768 ? "100%" : 520, margin:0 }}
            >
              {quoteWords.map((w, i) => (
                <span key={i} className="ph-qword" style={{ "--wi": i }}>{w}</span>
              ))}
            </blockquote>


          </div>
        </div>


      </section>
    </>
  );
}