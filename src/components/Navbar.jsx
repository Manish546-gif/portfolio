/**
 * NAVBAR — Manish Kumar Portfolio
 * Redesigned: smaller links, vertical image marquee (right panel), new clip animation
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

const EXPO = [0.76, 0, 0.24, 1]
const DARK = [0.32, 0, 0.15, 1]
const INK = '#0a0a0a'
const INK_MID = 'rgba(10,10,10,0.4)'
const INK_FAINT = 'rgba(10,10,10,0.07)'

/* ─── placeholder image urls (Unsplash — design / code themed) ──────────── */
const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80',
]

/* ── Split hover text ─────────────────────────────────────────────────────── */
function SplitText({ text, isHovered, baseDelay = 0, className = '' }) {
  const chars = text.split('')
  return (
    <span className={`inline-flex ${className}`} aria-label={text}>
      {chars.map((char, i) => {
        const enter = baseDelay + i * 0.018
        const exit  = baseDelay + (chars.length - 1 - i) * 0.012
        return (
          <span key={i} className="inline-flex flex-col overflow-hidden" style={{ height: '1.1em' }}>
            <motion.span
              className="inline-block leading-[1.1em]"
              animate={{ y: isHovered ? '-100%' : '0%' }}
              transition={{ duration: 0.34, ease: EXPO, delay: isHovered ? enter : exit }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
            <motion.span
              className="inline-block leading-[1.1em]"
              aria-hidden
              animate={{ y: isHovered ? '-100%' : '0%' }}
              transition={{ duration: 0.34, ease: EXPO, delay: isHovered ? enter : exit }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        )
      })}
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

/* ── Vertical auto-scrolling image marquee ───────────────────────────────── */
function VerticalMarquee({ images }) {
  /* duplicate for seamless loop */
  const doubled = [...images, ...images]
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to bottom, #fff 0%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to top, #fff 0%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '5px' }}
        animate={{ y: [0, -(images.length * 170)] }}
        transition={{
          duration: images.length * 3.2,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="rounded-lg"
            style={{
              width: '100%',
              height: '155px',
              overflow: 'hidden',
              flexShrink: 0,
              border: `1px solid ${INK_FAINT}`,
            }}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="rounded-lg"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(30%)' }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Nav link ────────────────────────────────────────────────────────────── */
function NavLink({ index, label, sub, onClick, delay, isOpen }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="relative flex items-center justify-between cursor-pointer border-b group"
      style={{ borderColor: INK_FAINT, paddingTop: '13px', paddingBottom: '13px' }}
      initial={{ opacity: 0, x: -30 }}
      animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ delay, duration: 0.55, ease: EXPO }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={onClick}
      whileTap={{ x: 6 }}
    >
      {/* index */}
      <span
        className="font-mono tabular-nums select-none shrink-0 mr-5"
        style={{ fontSize: '10px', letterSpacing: '0.18em', color: INK_MID }}
      >
        {index}
      </span>

      {/* label */}
      <motion.span
        className="flex-1"
        style={{
          fontFamily: "'Compacta', sans-serif",
          fontSize: 'clamp(40px, 6vw, 78px)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          lineHeight: 1,
          color: INK,
        }}
        animate={{ opacity: hov ? 0.45 : 1 }}
        transition={{ duration: 0.22 }}
      >
        {label}
      </motion.span>

      {/* sub + arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <motion.span
          className="hidden md:block font-medium uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.28em', color: INK_MID }}
          animate={{ x: hov ? 0 : 8, opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.28, ease: EXPO }}
        >
          {sub}
        </motion.span>
        <motion.span
          style={{ fontSize: '18px', lineHeight: 1, color: INK }}
          animate={{ x: hov ? 0 : -8, opacity: hov ? 1 : 0, rotate: hov ? 0 : -20 }}
          transition={{ duration: 0.28, ease: EXPO }}
        >
          ↗
        </motion.span>
      </div>
    </motion.div>
  )
}

/* ── Social link ─────────────────────────────────────────────────────────── */
function SocialLink({ label, href, delay, isOpen }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-block pb-0.5 cursor-pointer"
      style={{ color: INK, fontSize: '9px', letterSpacing: '0.22em' }}
      initial={{ opacity: 0, y: 10 }}
      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ delay, duration: 0.45, ease: EXPO }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      <SplitText text={label} isHovered={hov} className="font-bold uppercase tracking-[0.16em]" />
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full"
        style={{ backgroundColor: INK }}
        animate={hov
          ? { scaleX: 1, transformOrigin: '0% 50%' }
          : { scaleX: 0, transformOrigin: '100% 50%' }}
        transition={{ duration: 0.32, ease: EXPO }}
      />
    </motion.a>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const cy = window.scrollY
      if (cy < lastScrollY || cy < 100) setIsHidden(false)
      else if (cy > lastScrollY && cy > 100) setIsHidden(true)
      setLastScrollY(cy)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

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
      {/* ══ TOP BAR ══════════════════════════════════════════════ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-100"
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: isHidden ? '-100%' : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.45, ease: EXPO }}
      >
        {/* thin top line */}
        <div style={{ height: '1px', backgroundColor: INK_FAINT }} />

        <div
          className="flex items-center justify-between px-6 md:px-10 py-4"
          style={{ backgroundColor: 'rgba(255,255,255,0)', backdropFilter: 'blur(12px)' }}
        >
          {/* Logo */}
          <Magnetic strength={0.18}>
            <button
              className="cursor-pointer bg-transparent border-none p-0 select-none"
              onClick={() => scrollTo('home')}
              aria-label="Home"
            >
              <span
                style={{
                  fontFamily: "'PPEditorialNew', sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: INK,
                  textTransform: 'uppercase',
                }}
              >
                Manish<span style={{ fontStyle: 'italic', fontWeight: 400, marginLeft: 6 }}>Kumar</span>
              </span>
            </button>
          </Magnetic>

          {/* Centre tag */}
          <span
            className="hidden md:block font-medium uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.32em', color: INK_MID }}
          >
            Designer &amp; Developer
          </span>

          {/* Menu trigger */}
          <Magnetic strength={0.28}>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
              style={{ color: INK }}
            >
              <span
                className="font-bold uppercase hidden sm:block"
                style={{ fontSize: '9px', letterSpacing: '0.28em', color: INK }}
              >
                {isOpen ? 'Close' : 'Menu'}
              </span>

              {/* Animated hamburger */}
              <div className="flex flex-col gap-1.25 w-6">
                <motion.span className="block h-px w-full bg-current"
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6.5 : 0 }}
                  transition={{ duration: 0.4, ease: EXPO }} />
                <motion.span className="block h-px bg-current" style={{ width: '60%' }}
                  animate={{ scaleX: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.2, ease: EXPO }} />
                <motion.span className="block h-px w-full bg-current"
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6.5 : 0 }}
                  transition={{ duration: 0.4, ease: EXPO }} />
              </div>
            </motion.button>
          </Magnetic>
        </div>

        {/* thin bottom border */}
        <div style={{ height: '1px', backgroundColor: INK_FAINT }} />
      </motion.header>

      {/* ══ FULL-SCREEN PANEL ════════════════════════════════════ */}
      {/*
          New open/close animation:
          - Opens: diagonal wipe from top-left corner outward
          - Closes: diagonal wipe collapsing to bottom-right
      */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-99"
            style={{ backgroundColor: '#ffffff' }}
            initial={{ clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
            transition={{ duration: 0.72, ease: DARK }}
          >
            {/* ── subtle grid pattern background ──────────────── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(${INK_FAINT} 1px, transparent 1px),
                  linear-gradient(90deg, ${INK_FAINT} 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px',
              }}
            />

            {/* ── large decorative number ─────────────────────── */}
            <div
              className="absolute pointer-events-none select-none"
              style={{
                right: '0',
                bottom: '-40px',
                fontFamily: "'Compacta', sans-serif",
                fontSize: 'clamp(180px, 28vw, 380px)',
                fontWeight: 800,
                color: 'transparent',
                WebkitTextStroke: `1px rgba(10,10,10,0.05)`,
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
              aria-hidden
            >
              MK
            </div>

            {/* ── divider under top bar ────────────────────────── */}
            <div style={{ height: '57px' }} /> {/* spacer for header */}
            <div style={{ height: '1px', backgroundColor: INK_FAINT }} />

            {/* ── BODY: left nav + right marquee ───────────────── */}
            <div
              className="flex"
              style={{ height: 'calc(100vh - 58px)', overflow: 'hidden' }}
            >
              {/* LEFT — nav links + footer */}
              <div
                className="flex flex-col flex-1 px-6 md:px-12 lg:px-16 pt-10 pb-10"
                style={{ overflowY: 'auto' }}
              >
                {/* LINKS */}
                <div className="flex flex-col flex-1 justify-center">
                  {LINKS.map((l, i) => (
                    <NavLink
                      key={l.id}
                      index={l.index}
                      label={l.label}
                      sub={l.sub}
                      onClick={() => scrollTo(l.id)}
                      delay={0.1 + i * 0.06}
                      isOpen={isOpen}
                    />
                  ))}
                </div>

                {/* FOOTER row */}
                <motion.div
                  className="flex items-end justify-between mt-10 flex-wrap gap-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.5, ease: EXPO }}
                >
                  {/* status + email */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="rounded-full shrink-0"
                        style={{ width: '7px', height: '7px', backgroundColor: '#22c55e' }}
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <span className="font-bold uppercase" style={{ fontSize: '9px', letterSpacing: '0.24em', color: INK }}>
                        Available for work
                      </span>
                    </div>
                    <a
                      href="mailto:manishkumar925657@gmail.com"
                      style={{ fontSize: '11px', color: INK_MID, letterSpacing: '0.08em' }}
                    >
                      manishkumar925657@gmail.com
                    </a>
                  </div>

                  {/* socials */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold uppercase" style={{ fontSize: '8px', letterSpacing: '0.21em', color: INK_MID }}>
                      Follow
                    </span>
                    <div className="flex gap-5">
                      <SocialLink label="Twitter"  href="https://x.com/manishkuma56415"                          delay={0.46} isOpen={isOpen} />
                      <SocialLink label="LinkedIn" href="https://www.linkedin.com/in/manish-kumar-765745317/"    delay={0.50} isOpen={isOpen} />
                      <SocialLink label="GitHub"   href="https://github.com/Manish546-gif"                       delay={0.54} isOpen={isOpen} />
                    </div>
                  </div>

                  {/* tetris */}
                  <motion.button
                    onClick={() => { navigate('/tetris'); setIsOpen(false) }}
                    className="font-bold uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.24em',
                      color: '#fff',
                      backgroundColor: INK,
                      border: `1px solid ${INK}`,
                      padding: '9px 20px',
                      cursor: 'pointer',
                    }}
                    whileHover={{ backgroundColor: '#fff', color: INK }}
                    transition={{ duration: 0.2 }}
                  >
                    Play Tetris
                  </motion.button>
                </motion.div>
              </div>

              {/* RIGHT — vertical image marquee */}
              <motion.div
                className="hidden md:flex"
                style={{
                  width: '200px',
                  borderLeft: `1px solid ${INK_FAINT}`,
                  padding: '0 12px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.6, ease: EXPO }}
              >
                <VerticalMarquee images={MARQUEE_IMAGES} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}