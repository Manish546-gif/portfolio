import React, { useState } from "react";
import { motion } from "framer-motion";
import contactfSvg from "../assets/contactf.svg";

/* ─── Wavy scalloped badge ──────────────────────────────────────────────────── */
const WavyBadge = ({ size = 130, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const id = `wavy-${delay}-${size}`;

  return (
    <motion.div
      className="relative cursor-pointer flex-shrink-0"
      style={{ width: size, height: size }}
      initial={{ scale: 0.7, opacity: 0, rotate: -15 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* contactf SVG background with blob colors */}
      <motion.img
        src={contactfSvg}
        alt="contact blob"
        className="absolute inset-0 w-full h-full"
        style={{
          filter: hovered 
            ? "drop-shadow(0 12px 30px rgba(251,191,36,0.3)) invert(76%) sepia(80%) saturate(200%) hue-rotate(2deg) brightness(112%)" 
            : "drop-shadow(0 12px 30px rgba(251,191,36,0.2)) invert(69%) sepia(66%) saturate(300%) hue-rotate(2deg) brightness(105%)",
        }}
        animate={{
          filter: hovered 
            ? "drop-shadow(0 12px 30px rgba(251,191,36,0.3)) invert(76%) sepia(80%) saturate(200%) hue-rotate(2deg) brightness(112%)" 
            : "drop-shadow(0 12px 30px rgba(251,191,36,0.2)) invert(69%) sepia(66%) saturate(300%) hue-rotate(2deg) brightness(105%)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* rotating text ring */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <path id={`circle-${id}`} d="M50,50 m-28,0 a28,28 0 1,1 56,0 a28,28 0 1,1 -56,0" />
          </defs>
          <text fontSize="7.2" fill="white" letterSpacing="3" fontFamily="sans-serif">
            <textPath href={`#circle-${id}`} startOffset="0%">
              • REACH OUT • REACH OUT • REACH OUT •
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* mail icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          style={{ width: size * 0.28, height: size * 0.28 }}
          viewBox="0 0 24 24" fill="none"
          animate={{ scale: hovered ? 1.2 : 1, y: hovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="#fff" strokeWidth="1.6" />
          <path d="M2 7l10 7 10-7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </motion.svg>
      </div>
    </motion.div>
  );
};

/* ─── Marquee ───────────────────────────────────────────────────────────────── */
const ITEMS = [
  { block: "SEND AN EMAIL", italic: "hear from you" },
  { block: "SEND AN EMAIL", italic: "I'm eager to" },
  { block: "SEND AN EMAIL", italic: "hear from you" },
];

const MarqueeStrip = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="overflow-hidden  border-b border-gray-200 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="flex items-center whitespace-nowrap will-change-transform gap-12 px-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: hovered ? 40 : 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Repeating marquee items */}
        {[0, 1,2,3].map((key) => (
          <div key={key} className="flex items-center gap-12 flex-shrink-0">
            {/* Left badge */}
           
            
            {/* Main text content */}
            <div className="relative flex items-center gap-2">
              <span style={{ fontFamily: "Compacta" }} className="text-white text-[10rem] font-bold leading-none">
                SEND AN EMAIL
              </span>
              
              {/* Italic overlay text */}
              <motion.span
                style={{fontFamily:"FleurDeLeah" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-[8rem] pointer-events-none"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {key % 2 === 0 ? "here for you" : "I'm eager to"}
              </motion.span>
            </div>
            
            {/* Right badge */}
            <WavyBadge size={180} delay={0.2} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ─── Fill button ───────────────────────────────────────────────────────────── */
const FillButton = ({ children, href = "#", arrow = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      className="relative inline-flex items-center gap-2 px-6 py-3 border border-white rounded-full overflow-hidden cursor-pointer no-underline font-medium text-xs uppercase tracking-widest transition-colors z-10 flex-shrink-0"
      style={{ color: hovered ? "#1a1a1a" : "#fff", fontFamily: "'DM Sans', sans-serif" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full -z-10"
        style={{ background: "#fff", transformOrigin: "left center" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="relative z-20">{children}</span>
      {arrow && (
        <motion.span
          className="relative z-20 inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors"
          style={{ background: hovered ? "#1a1a1a" : "#fff" }}
          animate={{ x: hovered ? 3 : 0 }}
          transition={{ duration: 0.3 }}
        >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 5.5h9M6.5 2l3.5 3.5L6.5 9" stroke={hovered ? "#fff" : "#1a1a1a"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      )}
    </motion.a>
  );
};

/* ─── Social link ────────────────────────────────────────────────────────────── */
const SocialLink = ({ num, label, href = "#", delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="flex items-center gap-2 no-underline text-xs uppercase tracking-widest transition-colors cursor-pointer"
      style={{ color: hovered ? "#fbbf24" : "#d1d5db", fontFamily: "'DM Sans', sans-serif" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-all flex-shrink-0 text-[0.58rem]"
        style={{
          borderColor: hovered ? "#fbbf24" : "#6b7280",
          color: hovered ? "#fbbf24" : "#9ca3af",
        }}>
        {num}
      </span>
      <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.22 }}>
        {label}
      </motion.span>
    </motion.a>
  );
};

/* ─── Scroll to top ─────────────────────────────────────────────────────────── */
const ScrollTopBtn = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      className="w-[42px] h-[42px] rounded-full cursor-pointer flex items-center justify-center border transition-all"
      style={{
        background: hovered ? "#fff" : "transparent",
        borderColor: hovered ? "#fff" : "#6b7280",
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <motion.svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        animate={{ y: hovered ? -2 : 0 }}
        transition={{ duration: 0.28 }}
      >
        <path d="M7 12V2M3 6l4-4 4 4" stroke={hovered ? "#1a1a1a" : "#9ca3af"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.button>
  );
};

/* ─── Sparkle ────────────────────────────────────────────────────────────────── */
const Sparkle = ({ style: s = {} }) => (
  <motion.svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={s}
    animate={{ rotate: 360, scale: [1, 1.25, 1] }}
    transition={{ rotate: { duration: 5, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}>
    <path d="M7 0L8.2 5.8 14 7l-5.8 1.2L7 14 5.8 8.2 0 7l5.8-1.2z" fill="#fbbf24" />
  </motion.svg>
);

/* ─── FOOTER ─────────────────────────────────────────────────────────────────── */
const Footer = () => (
  <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital@1&family=DM+Sans:wght@400;500&display=swap');`}</style>

    <footer className="bg-gradient-to-r pt-10 from-purple-950 via-purple-900 to-purple-950">

      {/* ── MARQUEE ── */}
      <MarqueeStrip />

      {/* ── MIDDLE ROW ── */}
      <div className="flex flex-wrap items-center justify-between gap-8 py-8  px-5 md:px-[clamp(20px,5vw,60px)] ">
        {/* Socials */}
        <div className="flex gap-[clamp(24px,5vw,60px)]">
          <div className="flex flex-col gap-4">
            <SocialLink num={1} label="Instagram" delay={0.1} />
            <SocialLink num={2} label="Linked In" delay={0.15} />
            <SocialLink num={3} label="Behance" delay={0.2} />
          </div>
          <div className="flex flex-col gap-3">
            <SocialLink num={4} label="Twitter" delay={0.2} />
            <SocialLink num={5} label="Awwwards" delay={0.25} />
            <SocialLink num={6} label="Dribbble" delay={0.3} />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <FillButton href="mailto:hello@manishkumar.com">Send a project inquiry</FillButton>
          <FillButton href="#" arrow>Scroll back to top</FillButton>
          <ScrollTopBtn />
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-6 py-8 px-5 md:px-[clamp(20px,5vw,60px)]">
        {/* Left */}
        <p className="text-[0.75rem] uppercase tracking-widest text-gray-400 leading-relaxed m-0" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          © 2025 Manish Kumar, All Rights Reserved<br />
          <motion.a href="#" className="text-gray-400 underline hover:text-amber-400" style={{ textUnderlineOffset: 3 }} whileHover={{ color: "#fbbf24" }}>Old Folio</motion.a>
        </p>

        {/* Centre badge */}
        <div className="flex flex-col items-center gap-1">
          <svg width="150" height="45" viewBox="0 0 120 36" style={{ overflow: "visible" }}>
            <defs><path id="arc-mk" d="M 10,34 A 55,55 0 0,1 110,34" /></defs>
            <text fontSize="7" fill="#9ca3af" letterSpacing="2.2" fontFamily="sans-serif" textAnchor="middle">
              <textPath href="#arc-mk" startOffset="50%">DESIGNED AND CODED BY</textPath>
            </text>
          </svg>
          <Sparkle style={{ marginTop: 0, transform: "scale(1.3)" }} />
          <p className="text-[2.2rem] uppercase tracking-wider text-white m-0 leading-tight" style={{ fontFamily: "'Bebas Neue',sans-serif" }}>
            MANISH KUMAR
          </p>
          <svg width="160" height="12" viewBox="0 0 130 10" fill="none" style={{ marginTop: 4 }}>
            <path d="M0 5 Q22 0 44 5 Q66 10 88 5 Q110 0 130 5" stroke="#4b5563" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Right */}
        <p className="text-[0.75rem] uppercase tracking-widest text-gray-400 leading-relaxed m-0 text-right" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          Purely Hand–Coded, With Love &amp; Passion<br />
          <motion.a href="#" className="text-gray-400 underline hover:text-amber-400" style={{ textUnderlineOffset: 3 }} whileHover={{ color: "#fbbf24" }}>Play Tetris</motion.a>
        </p>
      </div>

    </footer>
  </>
);

export default Footer;