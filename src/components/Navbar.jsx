/**
 * NAVBAR — Manish Kumar Portfolio
 * White bg, black text. Panel: white.
 * Headings: outlined pink (background) + solid pink fill (overlay) — stacked.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

const EXPO = [0.76, 0, 0.24, 1]
const CIRC = [0.85, 0, 0.15, 1]
const PINK = '#000000'          // main pink accent
const PINK_DARK = '#000000'     // darker pink for hover states

/* ── Split hover text ─────────────────────────────────────────────────────── */
function SplitText({ text, isHovered, baseDelay = 0, className = '' }) {
  const chars = text.split('')
  return (
    <span className={`inline-flex ${className}`} aria-label={text}>
      {chars.map((char, i) => {
        const enter = baseDelay + i * 0.02
        const exit  = baseDelay + (chars.length - 1 - i) * 0.013
        return (
          <span key={i} className="inline-flex flex-col overflow-hidden" style={{ height: '1.06em' }}>
            <motion.span
              className="inline-block leading-[1.06em]"
              animate={{ y: isHovered ? '-100%' : '0%' }}
              transition={{ duration: 0.36, ease: EXPO, delay: isHovered ? enter : exit }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
            <motion.span
              className="inline-block leading-[1.06em]"
              aria-hidden
              animate={{ y: isHovered ? '-100%' : '0%' }}
              transition={{ duration: 0.36, ease: EXPO, delay: isHovered ? enter : exit }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

/* ── Char reveal (mount) ─────────────────────────────────────────────────── */
function CharReveal({ text, delay = 0, className = '' }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ height: '1.1em' }}>
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: delay + i * 0.038, duration: 0.6, ease: EXPO }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ── Magnetic ────────────────────────────────────────────────────────────── */
function Magnetic({ children, strength = 0.22 }) {
  const ref = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 15 })
  const sy = useSpring(y, { stiffness: 160, damping: 15 })
  const onMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }, [x, y, strength])
  const onLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  )
}

/* ── Big nav link ────────────────────────────────────────────────────────── */
function BigLink({ index, label, sub, onClick, delay }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="relative flex items-center justify-between border-b cursor-pointer group"
      style={{ borderColor: 'rgba(0,0,0,0.08)', paddingTop: '14px', paddingBottom: '14px' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: EXPO }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={onClick}
      whileTap={{ x: 8 }}
    >
      {/* Left: index + stacked heading */}
      <div className="flex items-baseline gap-5">
        <motion.span
          className="font-mono tabular-nums select-none flex-shrink-0"
          style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.25)' }}
          animate={{ color: hov ? PINK_DARK : 'rgba(0,0,0,0.25)' }}
          transition={{ duration: 0.25 }}
        >
          {index}
        </motion.span>

        {/* Stacked heading: outline behind, filled overlay on top */}
        <div className="relative select-none leading-none" style={{ lineHeight: 0.9 }}>
          {/* Background layer: pink outline / stroke text */}
          <span
            style={{
              fontFamily: "'Cormorant Garamond','Georgia',serif",
              fontSize: 'clamp(42px, 7vw, 96px)',
              fontWeight: 700,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              color: 'transparent',
              WebkitTextStroke: `1.5px ${PINK}`,
              display: 'block',
              userSelect: 'none',
              lineHeight: 0.92,
            }}
          >
            {label}
          </span>

          {/* Overlay layer: solid pink fill, clips in on hover */}
          <motion.span
            aria-hidden
            style={{
              fontFamily: "'Cormorant Garamond','Georgia',serif",
              fontSize: 'clamp(42px, 7vw, 96px)',
              fontWeight: 700,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              color: PINK,
              display: 'block',
              userSelect: 'none',
              lineHeight: 0.92,
              position: 'absolute',
              top: 0,
              left: 0,
              clipPath: hov ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: `clip-path 0.55s cubic-bezier(0.76,0,0.24,1) ${delay * 0.1}s`,
            }}
          >
            {label}
          </motion.span>
        </div>
      </div>

      {/* Right: sub label + arrow */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <motion.span
          className="hidden md:block font-medium uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.35)' }}
          animate={{ x: hov ? 0 : 6, opacity: hov ? 0.8 : 0 }}
          transition={{ duration: 0.3, ease: EXPO }}
        >
          {sub}
        </motion.span>
        <motion.span
          style={{ fontSize: '20px', lineHeight: 1, color: PINK }}
          animate={{ x: hov ? 0 : -10, opacity: hov ? 1 : 0, rotate: hov ? 0 : -20 }}
          transition={{ duration: 0.3, ease: EXPO }}
        >
          ↗
        </motion.span>
      </div>

      {/* Hover fill bar */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: `${PINK}08`, originX: 0 }}
        initial={false}
        animate={{ scaleX: hov ? 1 : 0, transformOrigin: '0% 50%' }}
        transition={{ duration: 0.4, ease: EXPO }}
      />
    </motion.div>
  )
}

/* ── Social pill ─────────────────────────────────────────────────────────── */
function SocialLink({ label, href, delay }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-block pb-[2px] cursor-pointer"
      style={{ color: 'rgba(0,0,0,0.4)', fontSize: '10px', letterSpacing: '0.16em' }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: EXPO }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ color: PINK_DARK }}
    >
      <SplitText text={label} isHovered={hov} className="font-bold uppercase tracking-[0.16em]" />
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full"
        style={{ backgroundColor: PINK }}
        initial={false}
        animate={hov ? { scaleX: 1, transformOrigin: '0% 50%' } : { scaleX: 0, transformOrigin: '100% 50%' }}
        transition={{ duration: 0.35, ease: EXPO }}
      />
    </motion.a>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [time, setTime] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setTime(n.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) window.__lenis?.scrollTo(el, { offset: 0, duration: 1.5 })
    setIsOpen(false)
  }

  const LINKS = [
    { index: '01', label: 'Home',    sub: 'Start here',        id: 'home'    },
    { index: '02', label: 'About',   sub: 'Who I am',          id: 'about'   },
    { index: '03', label: 'Works',   sub: 'Selected projects', id: 'work'    },
    { index: '04', label: 'Contact', sub: "Let's talk",        id: 'contact' },
  ]

  return (
    <>
      {/* ════════════════════════════════════════════════
          TOP BAR — white bg, black text
      ════════════════════════════════════════════════ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          backgroundColor: scrolled && !isOpen ? 'rgba(255,255,255,0.92)' : 'transparent',
          backdropFilter: scrolled && !isOpen ? 'blur(12px)' : 'none',
          borderBottom: scrolled && !isOpen ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
          transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-5">

          {/* Logo */}
          <Magnetic strength={0.18}>
            <button
              className="flex flex-col leading-none cursor-pointer bg-transparent border-none p-0 select-none"
              onClick={() => scrollTo('home')}
              aria-label="Home"
            >
              <div className="overflow-hidden" style={{ height: '1.1em' }}>
                <motion.span
                  className="block font-black uppercase"
                  style={{
                    fontFamily: "'Cormorant Garamond','Georgia',serif",
                    fontSize: '22px',
                    letterSpacing: '0.06em',
                    color: scrolled ? '#111' : '#fff',
                    fontWeight: 700,
                    transition: 'color 0.4s ease',
                  }}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: EXPO }}
                >
                  Manish
                </motion.span>
              </div>
              <div className="overflow-hidden" style={{ height: '1.1em' }}>
                <motion.span
                  className="block font-black uppercase ml-3"
                  style={{
                    fontFamily: "'Cormorant Garamond','Georgia',serif",
                    fontSize: '22px',
                    letterSpacing: '0.06em',
                    color: PINK,
                    fontWeight: 700,
                    fontStyle: 'italic',
                  }}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.32, duration: 0.6, ease: EXPO }}
                >
                  Kumar
                </motion.span>
              </div>
            </button>
          </Magnetic>

          {/* Centre role tag */}
          <motion.span
            className="hidden md:block font-medium uppercase"
            style={{ 
              fontSize: '9px', 
              letterSpacing: '0.24em', 
              color: scrolled ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', 
              fontFamily: "'DM Sans','Inter',sans-serif",
              transition: 'color 0.4s ease',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Designer &amp; Developer
          </motion.span>

          {/* Menu trigger */}
          <Magnetic strength={0.28}>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
              whileTap={{ scale: 0.88 }}
              aria-label="Toggle menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ color: scrolled ? '#111' : '#fff', transition: 'color 0.4s ease' }}
            >
              <motion.span
                className="font-bold uppercase hidden sm:block"
                style={{ fontSize: '10px', letterSpacing: '0.2em', fontFamily: "'DM Sans','Inter',sans-serif", color: scrolled ? '#111' : '#fff', transition: 'color 0.4s ease' }}
                animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? 6 : 0 }}
                transition={{ duration: 0.22, ease: EXPO }}
              >
                {isOpen ? 'Close' : 'Menu'}
              </motion.span>
              <div className="flex flex-col gap-[5px] w-[26px]">
                <motion.span className="block h-px w-full" style={{ backgroundColor: '#111' }}
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }}
                  transition={{ duration: 0.38, ease: EXPO }} />
                <motion.span className="block h-px" style={{ backgroundColor: '#111', width: '62%' }}
                  animate={{ scaleX: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.22, ease: EXPO }} />
                <motion.span className="block h-px w-full" style={{ backgroundColor: '#111' }}
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }}
                  transition={{ duration: 0.38, ease: EXPO }} />
              </div>
            </motion.button>
          </Magnetic>
        </div>
      </motion.header>

      {/* ════════════════════════════════════════════════
          FULL-SCREEN PANEL — pure white
      ════════════════════════════════════════════════ */}
      <motion.div
        className="fixed inset-0 z-[99] flex flex-col"
        style={{ backgroundColor: '#ffffff' }}
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={{ clipPath: isOpen ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }}
        transition={{ duration: 0.78, ease: CIRC }}
      >
        {/* Large pink background text — decorative */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-end pr-8 md:pr-16"
          aria-hidden
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond','Georgia',serif",
              fontSize: 'clamp(120px, 20vw, 260px)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'transparent',
              WebkitTextStroke: `1px ${PINK}22`,
              letterSpacing: '-0.04em',
              userSelect: 'none',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            
          </span>
        </div>

        {/* Divider under top bar */}
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ top: '72px', backgroundColor: 'rgba(0,0,0,0.07)' }}
          initial={{ scaleX: 0, transformOrigin: '0% 50%' }}
          animate={{ scaleX: isOpen ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EXPO }}
        />

        {/* ── PANEL BODY: two-column grid ───────────────────────── */}
        <div
          className="flex-1 grid pt-[88px] overflow-hidden"
          style={{ gridTemplateColumns: '1fr auto', gridTemplateRows: '1fr' }}
        >
          {/* LEFT — big nav links */}
          <div className="flex flex-col justify-center px-6 md:px-14 overflow-hidden">
            {isOpen && LINKS.map((l, i) => (
              <BigLink
                key={l.id}
                index={l.index}
                label={l.label}
                sub={l.sub}
                onClick={() => scrollTo(l.id)}
                delay={0.08 + i * 0.07}
              />
            ))}
          </div>

          {/* RIGHT — meta column (desktop only) */}
          <div
            className="hidden lg:flex flex-col justify-between py-10 pr-14 pl-10 w-[260px] xl:w-[300px]"
            style={{ borderLeft: '1px solid rgba(0,0,0,0.07)' }}
          >
            {/* Top: tagline */}
            {isOpen && (
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: EXPO }}
              >
                <span className="font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(0,0,0,0.3)', fontFamily: "'DM Sans',sans-serif" }}>
                  Currently
                </span>
                <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(0,0,0,0.5)', fontWeight: 400, letterSpacing: '0.02em', fontFamily: "'DM Sans',sans-serif" }}>
                  Open to freelance,<br />collaborations &amp; full-time roles.
                </p>
              </motion.div>
            )}

            {/* Middle: availability + email */}
            {isOpen && (
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.6, ease: EXPO }}
              >
                {/* Dot + status */}
                <div className="flex items-center gap-2">
                  <motion.span
                    className="rounded-full flex-shrink-0"
                    style={{ width: '7px', height: '7px', backgroundColor: '#4ade80' }}
                    animate={{ scale: [1, 1.55, 1], opacity: [1, 0.45, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span className="font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(0,0,0,0.5)', fontFamily: "'DM Sans',sans-serif" }}>
                    Available for projects
                  </span>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <span className="font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.25)', fontFamily: "'DM Sans',sans-serif" }}>
                    Reach out
                  </span>
                  <motion.a
                    href="mailto:manishkumar925657@gmail.com"
                    style={{ fontSize: '11px', color: 'rgba(0,0,0,0.45)', letterSpacing: '0.03em', wordBreak: 'break-all', fontFamily: "'DM Sans',sans-serif" }}
                    whileHover={{ color: PINK_DARK }}
                    transition={{ duration: 0.2 }}
                  >
                    manishkumar925657@gmail.com
                  </motion.a>
                </div>

                {/* Clock */}
                <div className="flex flex-col gap-1">
                  <span className="font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.25)', fontFamily: "'DM Sans',sans-serif" }}>
                    Local time
                  </span>
                  <span className="font-mono tabular-nums" style={{ fontSize: '13px', color: 'rgba(0,0,0,0.35)', letterSpacing: '0.08em' }}>
                    {time} <span style={{ fontSize: '9px', opacity: 0.5 }}>IST</span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* Bottom: socials */}
            {isOpen && (
              <div className="flex flex-col gap-3">
                <span className="font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.25)', fontFamily: "'DM Sans',sans-serif" }}>
                  Socials
                </span>
                <div className="flex flex-col gap-[10px]">
                  <SocialLink label="Instagram" href="#" delay={0.42} />
                  <SocialLink label="LinkedIn"  href="#" delay={0.46} />
                  <SocialLink label="Behance"   href="#" delay={0.50} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── PANEL FOOTER (mobile socials) ──────────────────────── */}
        <div
          className="lg:hidden px-6 pb-8 pt-5 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
        >
          {isOpen && (
            <>
              <div className="flex items-center gap-7">
                <SocialLink label="Instagram" href="#" delay={0.4} />
                <SocialLink label="LinkedIn"  href="#" delay={0.44} />
                <SocialLink label="Behance"   href="#" delay={0.48} />
              </div>
              <motion.span
                className="font-mono tabular-nums"
                style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {time}
              </motion.span>
            </>
          )}
        </div>
      </motion.div>
    </>
  )
}