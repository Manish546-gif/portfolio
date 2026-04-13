
import { useState, useEffect, useRef } from 'react'

export default function Cursor() {
  const [coords, setCoords] = useState({ x: '—', y: '—' })
  const [hintOpacity, setHintOpacity] = useState(1)
  const [linePos, setLinePos] = useState({ cx: null, cy: null })

  const sceneRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ cx: null, cy: null, tx: null, ty: null })

  const lerp = (a, b, t) => a + (b - a) * t

  const tick = () => {
    const state = stateRef.current
    if (state.tx === null || state.ty === null) return

    state.cx = lerp(state.cx, state.tx, 0.5)
    state.cy = lerp(state.cy, state.ty, 0.5)

    setLinePos({ cx: state.cx, cy: state.cy })

    if (Math.abs(state.tx - state.cx) > 0.1 || Math.abs(state.ty - state.cy) > 0.1) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      rafRef.current = null
    }
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      stateRef.current.tx = e.clientX
      stateRef.current.ty = e.clientY

      if (stateRef.current.cx === null) {
        stateRef.current.cx = stateRef.current.tx
        stateRef.current.cy = stateRef.current.ty
      }

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const handleMouseLeave = () => {
      stateRef.current = { cx: null, cy: null, tx: null, ty: null }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={sceneRef}
      className="fixed inset-0 pointer-events-none cursor-none z-50"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        {/* Horizontal line */}
        <div
          className="absolute left-0 w-full h-px bg-[rgba(200,180,255,0.18)]"
          style={{
            top: linePos.cy !== null ? `${linePos.cy}px` : '50%',
            transform: 'translateY(-50%)',
          }}
        />

        {/* Vertical line */}
        <div
          className="absolute top-0 h-full w-px bg-[rgba(200,180,255,0.18)]"
          style={{
            left: linePos.cx !== null ? `${linePos.cx}px` : '50%',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Plus horizontal */}
        <div
          className="absolute w-[26px] h-[1px] bg-[rgba(220,200,255,0.85)]"
          style={{
            top: linePos.cy !== null ? `${linePos.cy}px` : '50%',
            left: linePos.cx !== null ? `${linePos.cx}px` : '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Plus vertical */}
        <div
          className="absolute w-[1px] h-[26px] bg-[rgba(220,200,255,0.85)]"
          style={{
            top: linePos.cy !== null ? `${linePos.cy}px` : '50%',
            left: linePos.cx !== null ? `${linePos.cx}px` : '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  )
}
