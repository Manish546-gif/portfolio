/**
 * LOADING SCREEN — Manish Kumar Portfolio
 * White bg · Name center · % counter bottom-right
 * Diagonal polygon wipe open/close
 */

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EXPO = [0.76, 0, 0.24, 1]
const DARK = [0.32, 0, 0.15, 1]
const INK  = '#0a0a0a'

/* ── Letter reveal ───────────────────────────────────────────────── */
function NameRow({ text, serif = false, startDelay = 0 }) {
  return (
    <div style={{ display: 'flex', overflow: 'hidden', lineHeight: 0.95 }} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          style={{
            display: 'inline-block',
            color: INK,
            fontFamily: serif
              ? "'Cormorant Garamond','Georgia',serif"
              : "'DM Sans','Inter',sans-serif",
            fontSize: 'clamp(52px, 11vw, 104px)',
            fontWeight: serif ? 300 : 700,
            fontStyle: serif ? 'italic' : 'normal',
            letterSpacing: serif ? '-0.02em' : '-0.04em',
            lineHeight: 0.95,
          }}
          initial={{ y: '115%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: startDelay + i * 0.058, duration: 0.75, ease: EXPO }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
export default function LoadingScreen({ onComplete, shouldClose = false }) {
  const [pct, setPct]     = useState(0)
  const [done, setDone]   = useState(false)
  const [gone, setGone]   = useState(false)
  const rafRef             = useRef(null)
  const startRef           = useRef(null)

  useEffect(() => {
    const TOTAL = 4500
    const tick = (now) => {
      if (!startRef.current) startRef.current = now
      const el = now - startRef.current
      let p
      if (el < TOTAL * 0.7) {
        p = Math.min(85, Math.round((el / (TOTAL * 0.7)) * 85))
      } else {
        const ph2 = el - TOTAL * 0.7
        p = Math.min(100, 85 + Math.round((ph2 / (TOTAL * 0.3)) * 15))
      }
      setPct(p)
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Trigger exit when 100% is reached AND shouldClose is true
  useEffect(() => {
    if (pct === 100 && shouldClose) {
      setDone(true)
    }
  }, [pct, shouldClose])

  const handleExitComplete = () => {
    setGone(true)
    onComplete?.()
  }

  if (gone) return null

  const CORNER = {
    position: 'absolute',
    fontFamily: "'DM Sans',sans-serif",
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(10,10,10,0.22)',
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!done && (
        <motion.div
          key="loading-screen"
          style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#ffffff', overflow: 'hidden' }}
          initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          transition={{ duration: 0.75, ease: DARK }}
        >
          {/* vertical edge lines */}
          {['left', 'right'].map(side => (
            <motion.div
              key={side}
              style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width: '1px', backgroundColor: 'rgba(10,10,10,0.06)', transformOrigin: 'top' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3, duration: 0.9, ease: EXPO }}
            />
          ))}

          {/* corners */}
          <motion.span style={{ ...CORNER, top: '32px', left: '40px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42, duration: 0.5 }}>Manish Kumar</motion.span>
          <motion.span style={{ ...CORNER, top: '32px', right: '40px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.46, duration: 0.5 }}>2025</motion.span>
          <motion.span style={{ ...CORNER, bottom: '38px', left: '40px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48, duration: 0.5 }}>Portfolio</motion.span>

          {/* CENTER NAME */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }}>
            <NameRow text="Manish" serif={false} startDelay={0.38} />
            <NameRow text="Kumar"  serif={true}  startDelay={0.55} />

            <motion.div
              style={{ height: '1px', backgroundColor: 'rgba(10,10,10,0.1)', marginTop: '22px' }}
              initial={{ width: 0 }}
              animate={{ width: '180px' }}
              transition={{ delay: 1.0, duration: 1.0, ease: EXPO }}
            />

            <motion.span
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.28)', marginTop: '12px' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.28, duration: 0.55, ease: EXPO }}
            >
              © 2025
            </motion.span>
          </div>

          {/* COUNTER — bottom right */}
          <div style={{ position: 'absolute', bottom: '36px', right: '40px', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond','Georgia',serif", fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(64px, 12vw, 110px)', letterSpacing: '-0.04em', lineHeight: 1, color: INK, minWidth: '2.2ch', textAlign: 'right' }}>
              {String(pct).padStart(2, '0')}
            </span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(14px, 2.5vw, 22px)', fontWeight: 400, color: 'rgba(10,10,10,0.28)', marginBottom: '8px' }}>%</span>
          </div>

          {/* PROGRESS LINE */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', backgroundColor: 'rgba(10,10,10,0.06)' }}>
            <motion.div
              style={{ height: '100%', backgroundColor: INK, transformOrigin: '0% 50%' }}
              animate={{ scaleX: pct / 100 }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
