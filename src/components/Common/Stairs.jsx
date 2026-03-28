import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

// ── Stair columns, each splits into top + bottom curtain ──────────────────────
const COLS = 14

const Stairs = (props) => {
  const currentPath = useLocation().pathname
  const curtainRef = useRef(null)
  const pageRef = useRef(null)

  useGSAP(
    () => {
      const ease = 'power4.inOut'
      const tl = gsap.timeline({ defaults: { ease } })

      // Make curtain visible
      tl.set(curtainRef.current, { display: 'flex' })

      // Reset positions before animation
      tl.set('.stair-top', { y: '-101%', scaleY: 1 })
      tl.set('.stair-bottom', { y: '101%', scaleY: 1 })
      tl.set(pageRef.current, { opacity: 0 })

      // ── IN: curtains slide to center from top & bottom ──
      tl.to('.stair-top', {
        y: '0%',
        duration: 1.2,
        stagger: { amount: 0.4, from: 'end' },
      })
      tl.to(
        '.stair-bottom',
        {
          y: '0%',
          duration: 1.2,
          stagger: { amount: 0.4, from: 'end' },
        },
        '<',
      )

      // ── Brief hold + label flash ──
      tl.to('.stair-label', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.05')

      // ── OUT: curtains slide away ──
      tl.to('.stair-top', {
        y: '-101%',
        duration: 1.3,
        stagger: { amount: 0.45, from: 'end' },
        delay: 0.35,
      })
      tl.to(
        '.stair-bottom',
        {
          y: '101%',
          duration: 1.3,
          stagger: { amount: 0.45, from: 'end' },
        },
        '<',
      )
      tl.to(
        '.stair-label',
        { opacity: 0, duration: 0.45 },
        '<',
      )

      // Hide curtain after out
      tl.set(curtainRef.current, { display: 'none' })

      // ── Page reveal ──
      tl.to(
        pageRef.current,
        {
          opacity: 1,
          duration: 0.95,
          ease: 'power2.out',
        },
        '-=0.55',
      )
    },
    { dependencies: [currentPath] },
  )

  const logoText = 'MK'

  return (
    <div>
      {/* ── Curtain overlay ── */}
      <div
        ref={curtainRef}
        className='pointer-events-none fixed inset-0 z-100 hidden'
        style={{ display: 'none' }}
      >
        {/* Each column: stair-top (upper half) + stair-bottom (lower half) stacked */}
        {Array.from({ length: COLS }).map((_, i) => (
          <div
            key={i}
            className='relative flex h-full flex-1 flex-col'
          >
            {/* Top curtain — slides down from above */}
            <div
              className='stair-top absolute left-0 right-0 top-0 h-[51%]'
              style={{
                background: i % 2 === 0 ? '#2f3138' : '#e6e3de',
                transform: 'translateY(-101%)',
                transformOrigin: 'top',
              }}
            />

            {/* Bottom curtain — slides up from below */}
            <div
              className='stair-bottom absolute bottom-0 left-0 right-0 h-[51%]'
              style={{
                background: i % 2 === 0 ? '#2f3138' : '#e6e3de',
                transform: 'translateY(101%)',
                transformOrigin: 'bottom',
              }}
            />

          </div>
        ))}

        {/* Center logo */}
        <div className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center'>
          <p
            className='stair-label text-center font-["Germania_One"] text-7xl tracking-[0.12em] text-[#e6e3de]'
            style={{
              opacity: 0,
              transform: 'translateY(6px)',
              textShadow: '0 0 14px rgba(0,0,0,0.35)',
            }}
          >
            <span style={{ color: '#e6e3de' }}>M</span>
            <span style={{ color: '#2f3138' }}>K</span>
          </p>
        </div>

      </div>

      {/* ── Page content ── */}
      <div ref={pageRef} style={{ opacity: 0 }}>
        {props.children}
      </div>
    </div>
  )
}

export default Stairs