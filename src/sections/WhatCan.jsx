import { useEffect, useRef } from 'react';

const SERVICES = [
  { label: "WEB-DESIGN",    size: "clamp(62px,10.8vw,140px)" },
  { label: "DEVELOPMENT",    size: "clamp(62px,10.8vw,140px)" },
  { label: "DATABASE DESIGN",    size: "clamp(62px,10.8vw,140px)" },
  { label: "ASSETS", size: "clamp(62px,10.8vw,140px)"  },
  { label: "APP-DESIGN",     size: "clamp(62px,10.8vw,140px)" },

];

export default function WhatICanDo() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "wicdo-anim-styles";
    s.innerHTML = `
      /* char stagger */
      .wicdo-char {
        display: inline-block;
        opacity: 0;
        transform: translateY(64px) skewX(6deg);
        transition:
          opacity  .6s cubic-bezier(.22,1,.36,1) calc(var(--ci) * 30ms),
          transform .6s cubic-bezier(.22,1,.36,1) calc(var(--ci) * 30ms);
      }
      .wicdo-chars-go .wicdo-char { opacity:1; transform:none; }

      /* italic clip reveal */
      .wicdo-italic-clip {
        clip-path: inset(0 100% 0 0);
        transition: clip-path 1.1s cubic-bezier(.77,0,.18,1);
      }
      .wicdo-italic-go { clip-path: inset(0 0% 0 0) !important; }

      /* fade-up */
      .wicdo-fade { opacity:0; transform:translateY(26px); transition: opacity .7s ease, transform .7s ease; }
      .wicdo-fade.go { opacity:1; transform:none; }

      /* rotating reveal for service words */
      .wicdo-word-rotate {
        opacity: 0;
        transform: rotateX(90deg) scale(0.8);
        transform-origin: center;
        transition: opacity 1.5s cubic-bezier(.22,1,.36,1), transform 1.5s cubic-bezier(.22,1,.36,1);
      }
      .wicdo-word-rotate.go {
        opacity: 1;
        transform: rotateX(0deg) scale(1);
      }

      @media (max-width: 768px) {
        .wicdo-char {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
        .wicdo-word {
          opacity: 1 !important;
          transform: none !important;
        }
        .wicdo-word-rotate {
          font-size: clamp(54px, 14vw, 120px) !important;
          margin-bottom: 16px;
          opacity: 1 !important;
          transform: rotateX(0deg) scale(1) !important;
          transition: none !important;
        }
        .wicdo-fade {
          font-size: 16px !important;
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
        .wicdo-italic {
          display: block !important;
          position: static !important;
          font-size: clamp(32px, 7vw, 56px) !important;
          top: auto !important;
          left: auto !important;
          right: auto !important;
          z-index: 1 !important;
          margin-bottom: 24px;
          text-align: center;
          white-space: normal;
          pointer-events: auto;
          opacity: 1 !important;
          clip-path: inset(0 0% 0 0) !important;
          transition: none !important;
        }
        .wicdo-italic-left {
          margin-bottom: 12px;
        }
        .wicdo-italic-right {
          display: none;
        }
        .wicdo-label {
          font-size: 11px !important;
        }
        .wicdo-root {
          min-height: 60vh !important;
        }
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById("wicdo-anim-styles"); if (el) el.remove(); };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    // For mobile, trigger animations immediately
    if (isMobile) {
      const timer = setTimeout(() => {
        const labelEl = sectionRef.current?.querySelector('.wicdo-label');
        if (labelEl) {
          labelEl.classList.add('wicdo-chars-go');
          labelEl.querySelectorAll('span[style*="opacity"]').forEach(el => {
            el.classList.add('wicdo-fade', 'go');
          });
        }
        
        const italicEls = sectionRef.current?.querySelectorAll('.wicdo-italic-clip');
        italicEls?.forEach(el => el.classList.add('wicdo-italic-go'));
        
        const serviceWords = sectionRef.current?.querySelectorAll('.wicdo-word-rotate');
        serviceWords?.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('go');
          }, index * 100);
        });
        
        const fadeEls = sectionRef.current?.querySelectorAll('.wicdo-fade:not(.wicdo-ticker-text *)');
        fadeEls?.forEach(el => {
          if (!el.closest('.wicdo-ticker-text')) {
            el.classList.add('go');
          }
        });
      }, 50);
      
      return () => clearTimeout(timer);
    }
    
    // For desktop, use IntersectionObserver
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const labelEl = sectionRef.current?.querySelector('.wicdo-label');
        if (labelEl) {
          labelEl.classList.add('wicdo-chars-go');
          labelEl.querySelectorAll('span[style*="opacity"]').forEach(el => {
            el.classList.add('wicdo-fade', 'go');
          });
        }
        
        const italicEls = sectionRef.current?.querySelectorAll('.wicdo-italic-clip');
        italicEls?.forEach(el => el.classList.add('wicdo-italic-go'));
        
        const serviceWords = sectionRef.current?.querySelectorAll('.wicdo-word-rotate');
        serviceWords?.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('go');
          }, index * 250);
        });
        
        const fadeEls = sectionRef.current?.querySelectorAll('.wicdo-fade:not(.wicdo-ticker-text *)');
        fadeEls?.forEach(el => {
          if (!el.closest('.wicdo-ticker-text')) {
            el.classList.add('go');
          }
        });
        
        observer.unobserve(sectionRef.current);
      }
    }, { threshold: 0.1 });

    const timer = setTimeout(() => {
      if (sectionRef.current) observer.observe(sectionRef.current);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        .wicdo-root * { box-sizing: border-box; }

        .wicdo-label {
          font-family: PPEditorialNew;
          letter-spacing: 0.22em;
          font-size: 12px;
          color: #1a0a14;
        }

        .wicdo-italic {
          font-family: PPEditorialNew;
          font-style: italic;
          font-weight: 400;
          color: #d4607a;
          white-space: nowrap;
          pointer-events: none;
          position: absolute;
          top: 0;
          z-index: 10;
          font-size: clamp(54px, 5.2vw, 76px);
        }
        .wicdo-italic-left  { left: 2vw; }
        .wicdo-italic-right { right: 2vw; }

        .wicdo-word {
          display: block;
          font-family:compacta;
          color: #1a0a14;
          line-height: 0.88;
          letter-spacing: -0.015em;
          user-select: none;
        }

        .wicdo-hline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 100%;
          background: rgba(26,10,20,0.1);
        }

        .wicdo-ticker-text {
          font-family: PPEditorialNew;
          font-size: 11px;
          letter-spacing: 0.22em;
          color: #1a0a14;
          opacity: 0.3;
          display: inline-block;
          white-space: nowrap;
          animation: ticker-scroll linear infinite;
          cursor: pointer;
        }

        .wicdo-ticker-text:hover {
          animation-play-state: paused;
        }

        @keyframes ticker-scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }

        /* Desktop: very slow scroll */
        @media (min-width: 769px) {
          .wicdo-ticker-text {
            animation-duration: 80s;
          }
        }

        /* Mobile: very slow scroll */
        @media (max-width: 768px) {
          .wicdo-ticker-text {
            animation-duration: 100s;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="wicdo-root w-full bg-white relative overflow-hidden flex flex-col"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          minHeight: window.innerWidth < 768 ? "60vh" : "100vh",
        }}
      >
        {/* TOP LABEL */}
        <div
          className={`wicdo-label flex items-center justify-center gap-2 md:gap-4 z-20 relative ${window.innerWidth < 768 ? 'pt-6 pb-4 px-4' : 'pt-11 pb-5'}`}
          ref={titleRef}
        >
          <span className="wicdo-fade" style={{ opacity: 0.3 }}>◀</span>
          {'WHAT I CAN DO FOR YOU'.split('').map((char, i) => (
            <span key={i} className="wicdo-char spacing-none" style={{ '--ci': i }}>
              {char}
            </span>
          ))}
          <span className="wicdo-fade" style={{ opacity: 0.3 }}>▶</span>
        </div>

        {/* MAIN WORDS AREA */}
        <div className={`relative z-20 ${window.innerWidth < 768 ? 'px-[1vw] py-8' : 'px-[4vw]'}`}>

          <div className="wicdo-italic wicdo-italic-left wicdo-italic-clip">Services</div>
          <div className="wicdo-italic wicdo-italic-right wicdo-italic-clip">Provided</div>

          {SERVICES.map((svc, i) => (
            <div
              key={svc.label}
              className={`relative text-center ${window.innerWidth < 768 ? '-mb-[0.02em]' : '-mb-[0.05em]'}`}
            >
              <div className="overflow-hidden block leading-none">
                <div className="wicdo-word wicdo-word-rotate" style={{ fontSize: svc.size }}>
                  {svc.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TICKER — scrolling marquee */}
        <div
          className={`border-t border-[rgba(26,10,20,0.1)] overflow-hidden flex items-center relative z-20 ${window.innerWidth < 768 ? 'h-8 mt-5 px-4' : 'h-[38px] mt-8'}`}
        >
          <span className="wicdo-ticker-text pl-10" style={{ fontSize: window.innerWidth < 768 ? "9px" : "11px" }}>
            I HAVE THE CONNECTIONS &amp; SKILLS TO UNDERSTAND YOUR VISION ✳ LET'S COLLABORATE AND SHIP YOUR PRODUCT TOGETHER ✳ WHETHER IT'S A STARTUP OR AN ENTERPRISE — I'LL MAKE IT WORK ✳ REACH OUT AND LET'S BUILD SOMETHING EXTRAORDINARY ✳ I HAVE THE CONNECTIONS &amp; SKILLS TO UNDERSTAND YOUR VISION ✳ LET'S COLLABORATE AND SHIP YOUR PRODUCT TOGETHER ✳ WHETHER IT'S A STARTUP OR AN ENTERPRISE — I'LL MAKE IT WORK ✳ REACH OUT AND LET'S BUILD SOMETHING EXTRAORDINARY ✳ I HAVE THE CONNECTIONS &amp; SKILLS TO UNDERSTAND YOUR VISION ✳ LET'S COLLABORATE AND SHIP YOUR PRODUCT TOGETHER ✳ WHETHER IT'S A STARTUP OR AN ENTERPRISE — I'LL MAKE IT WORK ✳ REACH OUT AND LET'S BUILD SOMETHING EXTRAORDINARY ✳
          </span>
        </div>
      </section>
    </>
  );
}