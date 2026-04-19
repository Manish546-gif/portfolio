import { useEffect, useRef, useState } from "react";

/* ─── data ───────────────────────────────────────── */
const PILLARS = [
  {
    number: "01",
    title: "ELEGANCE",
    text: "Every pixel serves purpose. Simplicity is not the absence of complexity — it's the mastery of hiding it.",
    tag: "Aesthetic Clarity",
  },
  {
    number: "02",
    title: "INNOVATION",
    text: "Tomorrow's technology crafted with timeless principles. I build at the edge where tradition meets disruption.",
    tag: "Forward Thinking",
  },
  {
    number: "03",
    title: "AUTHENTICITY",
    text: "Design rooted in truth. Every choice I make resonates with purpose — nothing arbitrary, everything intentional.",
    tag: "Genuine Craft",
  },
  {
    number: "04",
    title: "HARMONY",
    text: "Form and function dance in perfect balance. The best experiences feel inevitable — as if they could not have been any other way.",
    tag: "Unified Vision",
  },
];

const STATS = [
  { value: "6+", label: "Years of Craft" },
  { value: "120+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "3×", label: "Award Finalist" },
];

const PROCESS_STEPS = [
  { step: "DISCOVER", desc: "Deep-dive into your world, audience, and ambitions." },
  { step: "DEFINE", desc: "Crystallise the problem into a sharp design brief." },
  { step: "DESIGN", desc: "Craft solutions with intentional beauty and purpose." },
  { step: "DELIVER", desc: "Ship pixel-perfect work that performs in the wild." },
];

const CORE_BELIEF =
  "I craft experiences where beauty and purpose become inseparable. Design is the silent language between intention and emotion — spoken not in words, but in light, space, and form.";

/* ─── component ─────────────────────────────────── */
export default function MyPhilosophy() {
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [hoveredPillar, setHoveredPillar] = useState(null);
  const pillarsRef = useRef(null);
  const beliefRef = useRef(null);
  const statsRef = useRef(null);
  const processRef = useRef(null);

  /* ── inject CSS ── */
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "philosophy-anim-styles-v3";
    s.innerHTML = `
      .phil-root-v3 { }
      .phil-root-v3 * { box-sizing: border-box; }

      /* ── noise ── */
      @keyframes phv3-noise {
        0%,100%{ opacity:.5; background-position:0 0; }
        25%    { opacity:.42; background-position:40px 20px; }
        50%    { opacity:.48; background-position:-20px 40px; }
        75%    { opacity:.44; background-position:30px -15px; }
      }
      .phv3-noise {
        position: absolute; inset:0; pointer-events:none; z-index:1;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        animation: phv3-noise .1s steps(1) infinite;
      }

      /* ── char drop ── */
      .phv3-char {
        display: inline-block;
        opacity: 0;
        transform: translateY(-50px) rotateX(80deg);
        transition: opacity .55s cubic-bezier(.22,1,.36,1) calc(var(--ci) * 22ms),
                    transform .55s cubic-bezier(.22,1,.36,1) calc(var(--ci) * 22ms);
      }
      .phv3-entered .phv3-char { opacity:1; transform:none; }

      /* ── clip reveal ── */
      .phv3-clip {
        clip-path: inset(0 100% 0 0);
        transition: clip-path 1.1s cubic-bezier(.77,0,.18,1);
      }
      .phv3-entered .phv3-clip { clip-path: inset(0 0% 0 0); }

      /* ── fade-up elements ── */
      .phv3-fadeup {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity .6s ease calc(var(--delay, 0) * 1ms),
                    transform .6s ease calc(var(--delay, 0) * 1ms);
      }
      .phv3-entered .phv3-fadeup { opacity:1; transform:none; }

      /* ── pillar items ── */
      .phv3-pillar {
        position: relative;
        padding: 20px 0 20px 0;
        border-bottom: 1px solid rgba(26,10,20,0.08);
        display: flex; align-items: flex-start; gap: 20px;
        cursor: default;
        opacity: 0;
        transform: translateX(-20px);
        transition:
          opacity .5s ease calc(var(--di) * 90ms),
          transform .5s ease calc(var(--di) * 90ms),
          background .3s;
      }
      .phv3-entered .phv3-pillar { opacity:1; transform:none; }

      .phv3-pillar:first-child { border-top: 1px solid rgba(26,10,20,0.08); }

      .phv3-pillar-bar {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 2px;
        background: #d4607a;
        transform: scaleY(0);
        transform-origin: top;
        transition: transform .35s cubic-bezier(.22,1,.36,1);
      }
      .phv3-pillar:hover .phv3-pillar-bar { transform: scaleY(1); }
      .phv3-pillar:hover { background: rgba(212,96,122,.03); }

      .phv3-pillar-num {
        fontFamily: PPEditorialNew;
        font-size: 11px;
        color: rgba(26,10,20,0.3);
        letter-spacing: 0.06em;
        padding-top: 3px;
        min-width: 22px;
      }

      .phv3-pillar-body { flex: 1; }

      .phv3-pillar-top {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 6px;
      }

      .phv3-pillar-title {
        fontFamily: PPEditorialNew;
        font-size: 17px;
        letter-spacing: 0.14em;
        color: #1a0a14;
      }

      .phv3-pillar-tag {
        fontFamily: PPEditorialNew;
        font-size: 9px;
        letter-spacing: 0.1em;
        color: #d4607a;
        border: 1px solid rgba(212,96,122,.35);
        padding: 2px 6px;
        border-radius: 2px;
        opacity: 0;
        transform: translateX(8px);
        transition: opacity .3s, transform .3s;
      }
      .phv3-pillar:hover .phv3-pillar-tag { opacity:1; transform:none; }

      .phv3-pillar-desc {
        fontFamily: PPEditorialNew;
        font-size: 13px;
        line-height: 1.65;
        color: rgba(26,10,20,0.6);
        margin: 0;
      }

      /* ── stat items ── */
      .phv3-stat {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity .5s ease calc(var(--si) * 80ms),
                    transform .5s ease calc(var(--si) * 80ms);
      }
      .phv3-stats-visible .phv3-stat { opacity:1; transform:none; }

      .phv3-stat-val {
        fontFamily: PPEditorialNew;
        font-size: 38px;
        letter-spacing: 0.02em;
        color: #1a0a14;
        line-height: 1;
      }
      .phv3-stat-label {
        fontFamily: PPEditorialNew;
        font-size: 10px;
        letter-spacing: 0.1em;
        color: rgba(26,10,20,0.45);
        margin-top: 4px;
        text-transform: uppercase;
      }

      /* ── process step ── */
      .phv3-step {
        display: flex; align-items: flex-start; gap: 14px;
        opacity: 0;
        transform: translateX(16px);
        transition: opacity .5s ease calc(var(--pi) * 75ms),
                    transform .5s ease calc(var(--pi) * 75ms);
      }
      .phv3-process-visible .phv3-step { opacity:1; transform:none; }

      .phv3-step-arrow {
        fontFamily: PPEditorialNew;
        font-size: 11px;
        color: #d4607a;
        margin-top: 2px;
        flex-shrink: 0;
      }

      .phv3-step-title {
        fontFamily: PPEditorialNew;
        font-size: 13px;
        letter-spacing: 0.14em;
        color: #1a0a14;
        line-height: 1.4;
      }

      .phv3-step-desc {
        fontFamily: PPEditorialNew;
        font-size: 12px;
        line-height: 1.55;
        color: rgba(26,10,20,0.55);
        margin: 0;
      }

      /* ── belief word reveal ── */
      .phv3-word {
        display: inline-block;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity .45s ease calc(var(--wi) * 30ms),
                    transform .45s ease calc(var(--wi) * 30ms);
      }
      .phv3-belief-visible .phv3-word { opacity:1; transform:none; }

      /* ── divider line ── */
      .phv3-line {
        width: 100%; height: 1px;
        background: rgba(26,10,20,0.09);
      }

      /* ── signature flourish ── */
      @keyframes phv3-draw {
        from { stroke-dashoffset: 600; }
        to   { stroke-dashoffset: 0; }
      }
      .phv3-sig-path {
        stroke-dasharray: 600;
        stroke-dashoffset: 600;
      }
      .phv3-entered .phv3-sig-path {
        animation: phv3-draw 2.2s cubic-bezier(.4,0,.2,1) 0.8s forwards;
      }

      /* ── marquee ── */
      @keyframes phv3-marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      /* ── section label ── */
      .phv3-label {
        fontFamily: PPEditorialNew;
        font-size: 10px;
        letter-spacing: 0.2em;
        color: rgba(26,10,20,0.4);
        text-transform: uppercase;
        margin-bottom: 24px;
        display: flex; align-items: center; gap: 10px;
      }
      .phv3-label::before {
        content: '';
        display: block; width: 20px; height: 1px;
        background: rgba(26,10,20,0.3);
        flex-shrink: 0;
      }

      /* ── scrolling badge ── */

      /* ── Mobile responsive ── */
      @media (max-width: 768px) {
        .phv3-pillar {
          gap: 12px;
          padding: 16px 0;
        }
        .phv3-pillar-title {
          font-size: 14px;
        }
        .phv3-pillar-desc {
          font-size: 12px;
        }
        .phv3-stat-val {
          font-size: 28px;
        }
        .phv3-step {
          gap: 10px;
        }
        .phv3-step-title {
          font-size: 12px;
        }
        .phv3-step-desc {
          font-size: 11px;
        }
        .phv3-label {
          margin-bottom: 16px;
          font-size: 9px;
        }
        .phv3-line {
          margin-bottom: 24px !important;
        }
      }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById("philosophy-anim-styles-v3")?.remove(); };
  }, []);

  /* ── intersection observers ── */
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const root = sectionRef.current;
    
    if (isMobile) {
      // Mobile: trigger animations immediately on mount
      setTimeout(() => {
        setEntered(true);
        
        // Force all animated elements to show
        root?.querySelectorAll('.phv3-char').forEach(el => el.classList.add('phv3-entered'));
        root?.querySelectorAll('.phv3-clip').forEach(el => el.classList.add('phv3-entered'));
        root?.querySelectorAll('.phv3-fadeup').forEach(el => el.classList.add('phv3-entered'));
        root?.querySelectorAll('.phv3-pillar').forEach(el => el.classList.add('phv3-entered'));
        root?.querySelectorAll('.phv3-stat').forEach(el => el.classList.add('phv3-stats-visible'));
        root?.querySelectorAll('.phv3-step').forEach(el => el.classList.add('phv3-process-visible'));
        
        if (statsRef.current) statsRef.current.classList.add("phv3-stats-visible");
        if (processRef.current) processRef.current.classList.add("phv3-process-visible");
        if (beliefRef.current) beliefRef.current.classList.add("phv3-belief-visible");
      }, 50);
    } else {
      // Desktop: use IntersectionObserver
      const observe = (ref, className) => {
        if (!ref) return;
        const obs = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { ref.classList.add(className); obs.disconnect(); }
        }, { threshold: 0.12 });
        obs.observe(ref);
        return obs;
      };

      if (root) {
        const obs = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
        }, { threshold: 0.08 });
        obs.observe(root);
      }

      const o1 = observe(statsRef.current, "phv3-stats-visible");
      const o2 = observe(processRef.current, "phv3-process-visible");
      const o3 = observe(beliefRef.current, "phv3-belief-visible");
      return () => { [o1,o2,o3].forEach(o => o?.disconnect()); };
    }
  }, []);

  /* ── char helpers ── */
  const splitChars = (text) =>
    text.split("").map((ch, i) => (
      <span key={i} className="phv3-char" style={{ "--ci": i }}>
        {ch === " " ? "\u00a0" : ch}
      </span>
    ));

  const splitWords = (text) =>
    text.split(" ").map((w, i) => (
      <span key={i} className="phv3-word" style={{ "--wi": i }}>
        {w}&nbsp;
      </span>
    ));

  return (
    <>
      <section
        id="philosophy"
        ref={sectionRef}
        className={`phil-root-v3${entered ? " phv3-entered" : ""}`}
        style={{
          backgroundColor: "#FFFFFF",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.042'/%3E%3C/svg%3E")`,
          minHeight: "100vh",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div className="phv3-noise" />

        {/* ── decorative vertical rule (hidden on mobile) ── */}
        <div style={{
          position: "absolute", left: "53%", top: 0, bottom: 0, width: "1px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(26,10,20,0.08) 20%, rgba(26,10,20,0.08) 80%, transparent 100%)",
          zIndex: 2, pointerEvents: "none",
          display: window.innerWidth < 768 ? "none" : "block"
        }} />

        {/* ── main two-column body (stacks on mobile) ── */}
        <div style={{
          display: "flex", 
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          width: "100%", 
          position: "relative", 
          zIndex: 2 
        }}>

          {/* ══ LEFT COLUMN ══ */}
          <div style={{ 
            width: window.innerWidth < 768 ? "100%" : "53%", 
            paddingLeft: window.innerWidth < 768 ? 16 : 64, 
            paddingRight: window.innerWidth < 768 ? 16 : 56, 
            paddingTop: window.innerWidth < 768 ? 32 : 56, 
            paddingBottom: window.innerWidth < 768 ? 32 : 64, 
            display: "flex", 
            flexDirection: "column", 
            gap: 0 
          }}>

            {/* Big heading */}
            <div style={{ lineHeight: 0.88, userSelect: "none", marginBottom: 48 }}>
              {/* MY */}
              <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                <div style={{
                  fontFamily: "Compacta",
                  color: "#1a0a14",
                  fontSize: "clamp(120px,13vw,180px)",
                  lineHeight: 0.88,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}>
                  {splitChars("MY")}
                </div>
              
              </div>

              {/* PHILOSOPHY */}
              <div style={{ position: "relative", display: "inline-block", width: "100%", marginTop: "-0.04em" }}>
                <div style={{
                  fontFamily: "Compacta",
                  color: "#1a0a14",
                  fontSize: "clamp(75px,9vw,180px)",
                  lineHeight: 0.9,
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                }}>
                  {splitChars("PHILOSOPHY")}
                </div>
               
              </div>
            </div>

            {/* ── pillars ── */}
            <div className="phv3-label" style={{ "--delay": 300 }}>Core Pillars</div>

            <div ref={pillarsRef}>
              {PILLARS.map((p, i) => (
                <div
                  key={i}
                  className="phv3-pillar"
                  style={{ "--di": i, paddingLeft: 16 }}
                  onMouseEnter={() => setHoveredPillar(i)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <div className="phv3-pillar-bar" />
                  <div className="phv3-pillar-num">{p.number}</div>
                  <div className="phv3-pillar-body">
                    <div className="phv3-pillar-top">
                      <div className="phv3-pillar-title">{p.title}</div>
                      <div className="phv3-pillar-tag">{p.tag}</div>
                    </div>
                    <p className="phv3-pillar-desc">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>


            {/* ── svg signature flourish ── */}
           
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div style={{ 
            width: window.innerWidth < 768 ? "100%" : "47%", 
            paddingLeft: window.innerWidth < 768 ? 16 : 56, 
            paddingRight: window.innerWidth < 768 ? 16 : 64, 
            paddingTop: window.innerWidth < 768 ? 32 : 56, 
            paddingBottom: window.innerWidth < 768 ? 32 : 64, 
            display: "flex", 
            flexDirection: "column", 
            gap: 0 
          }}>

            {/* ── core belief quote ── */}
            <div style={{ marginBottom: 56 }}>
              <div className="phv3-label">Manifesto</div>

              {/* large opening quote mark */}
              <div style={{
                fontFamily: 'PPEditorialNew',
                fontSize: 80,
                color: "rgba(212,96,122,0.15)",
                lineHeight: 1,
                marginBottom: -24,
                userSelect: "none",
              }}>
                "
              </div>

              <div
                ref={beliefRef}
                style={{
                  fontFamily: 'PPEditorialNew',
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#1a0a14",
                  lineHeight: 1.55,
                  fontSize: "clamp(15px,1.8vw,52px)",
                  maxWidth: 420,
                }}
              >
                {splitWords(CORE_BELIEF)}
              </div>

              <div style={{
                marginTop: 20,
                fontFamily: 'PPEditorialNew',
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "rgba(26,10,20,0.35)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 24, height: 1, background: "#d4607a" }} />
                PERSONAL CREDO
              </div>
            </div>

            <div className="phv3-line" style={{ marginBottom: 48 }} />

            {/* ── process steps ── */}
            <div style={{ marginBottom: 48 }}>
              <div className="phv3-label">My Process</div>
              <div
                ref={processRef}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {PROCESS_STEPS.map((p, i) => (
                  <div key={i} className="phv3-step" style={{ "--pi": i }}>
                    <div className="phv3-step-arrow">→</div>
                    <div>
                      <div className="phv3-step-title">{p.step}</div>
                      <p className="phv3-step-desc">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="phv3-line" style={{ marginBottom: 48 }} />

          </div>
        </div>

        {/* ── bottom accent bar ── */}
        <div style={{
          borderTop: "1px solid rgba(26,10,20,0.08)",
          display: "flex", 
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          alignItems: "center", 
          justifyContent: window.innerWidth < 768 ? "center" : "space-between",
          padding: window.innerWidth < 768 ? "12px 16px" : "14px 64px",
          position: "relative", 
          zIndex: 3,
          gap: window.innerWidth < 768 ? 8 : 0,
        }}>
          <span style={{ fontFamily: 'PPEditorialNew', fontSize: 10, letterSpacing: "0.15em", color: "rgba(26,10,20,0.28)" }}>
            DESIGN × CRAFT × PURPOSE
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                width: hoveredPillar === i ? 20 : 6,
                height: 2,
                background: hoveredPillar === i ? "#d4607a" : "rgba(26,10,20,0.18)",
                borderRadius: 2,
                transition: "all .3s ease",
              }} />
            ))}
          </div>
          <span style={{ fontFamily: 'PPEditorialNew', fontSize: 10, letterSpacing: "0.15em", color: "rgba(26,10,20,0.28)" }}>
            ©{new Date().getFullYear()}
          </span>
        </div>
      </section>
    </>
  );
}
