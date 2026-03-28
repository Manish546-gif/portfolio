import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import project1 from '../../assets/project1.png'
import project2 from '../../assets/project2.png'
import project3 from '../../assets/project3.png'
import project4 from '../../assets/project4.png'
import project1Video from '../../assets/project1.mp4'
import project2Video from '../../assets/project2.mp4'
import project3Video from '../../assets/project3.mp4'
import project4Video from '../../assets/project4.mp4'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: '01',
    title: 'One Earth Properties',
    tag: 'React',
    name: 'One Earth Properties',
    category: 'React',
    tags: ['UI/UX', 'Animations', 'Development'],
    link: '#',
    image: project1,
    video: project1Video,
  },
  {
    id: '02',
    title: 'ET',
    tag: 'UI/UX & Development',
    name: 'ET',
    category: 'UI/UX & Development',
    tags: ['Rendering', 'Textures', 'UI/UX'],
    link: '#',
    image: project2,
    video: project2Video,
  },
  {
    id: '03',
    title: 'Learnkins',
    tag: 'Learning Platform',
    name: 'Learnkins',
    category: 'Learning Platform',
    tags: ['React', 'Motion', 'gsap'],
    link: '#',
    image: project3,
    video: project3Video,
  },
  {
    id: '04',
    title: '3D Wolf',
    tag: 'Three.js & WebGL',
    name: '3D Wolf',
    category: 'Three.js & WebGL',
    tags: ['Webflow', 'UI/UX', 'Animation'],
    link: '#',
    image: project4,
    video: project4Video,
  },
]

export default function ProjectShowcase() {
  const sectionRef    = useRef(null)
  const pinRef        = useRef(null)
  const circleRef     = useRef(null)
  const circleBorderRef = useRef(null)
  const slideRefs     = useRef([])
  const nameRef       = useRef(null)
  const counterRef    = useRef(null)
  const categoryRef   = useRef(null)
  const tagRefs       = useRef([])
  const lastIndexRef  = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // ── Circle mouse parallax ────────────────────────────────────────────────
  useEffect(() => {
    const pin = pinRef.current
    if (!pin) return

    let cx = 0, cy = 0, tx = 0, ty = 0, raf

    const loop = () => {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      gsap.set(circleRef.current, { x: cx, y: cy })
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      const { left, top, width, height } = pin.getBoundingClientRect()
      tx = (e.clientX - left - width  / 2) * 0.04
      ty = (e.clientY - top  - height / 2) * 0.04
    }

    pin.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      pin.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  // ── Main scroll sequence ─────────────────────────────────────────────────
  useGSAP(() => {
    const total = PROJECTS.length
    const transitions = total - 1
    const ringCircumference = 2 * Math.PI * 165

    // Stack all slides — first one visible, rest below
    gsap.set(slideRefs.current, { yPercent: (i) => i === 0 ? 0 : 100 })
    if (circleBorderRef.current) {
      circleBorderRef.current.style.strokeDasharray = `${ringCircumference}`
      circleBorderRef.current.style.strokeDashoffset = `${ringCircumference}`
    }

    // Pin and drive all transitions from one continuous progress value.
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${transitions * window.innerHeight}`,
      pin: pinRef.current,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress
        const raw = p * transitions

        slideRefs.current.forEach((slide, i) => {
          if (!slide || i === 0) return
          const y = gsap.utils.clamp(0, 100, (i - raw) * 100)
          gsap.set(slide, { yPercent: y })
        })

        if (circleBorderRef.current) {
          circleBorderRef.current.style.strokeDashoffset = `${ringCircumference * (1 - p)}`
        }

        const nextIndex = Math.min(total - 1, Math.floor(raw + 0.5))
        if (nextIndex !== lastIndexRef.current) {
          lastIndexRef.current = nextIndex
          setActiveIndex(nextIndex)
          animateText(nextIndex)
        }
      },
    })

    // Initial text entrance
    animateText(0, true)

  }, { dependencies: [] })

  const animateText = (i, initial = false) => {
    const dur = initial ? 0.9 : 0.55
    const ease = 'power4.out'

    gsap.fromTo(nameRef.current,
      { yPercent: initial ? 40 : 60, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: dur, ease },
    )
    gsap.fromTo(categoryRef.current,
      { yPercent: initial ? 30 : 40, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: dur * 0.85, ease, delay: 0.07 },
    )
    gsap.fromTo(counterRef.current,
      { autoAlpha: 0, x: -8 },
      { autoAlpha: 1, x: 0, duration: dur * 0.7, ease, delay: 0.04 },
    )
    if (tagRefs.current.length) {
      gsap.fromTo(tagRefs.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease, stagger: 0.06, delay: 0.12 },
      )
    }
  }

  const handleProjectClick = () => {
    const link = PROJECTS[activeIndex]?.link
    if (!link || link === '#') return

    if (/^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener,noreferrer')
      return
    }

    window.location.href = link
  }

  const proj = PROJECTS[activeIndex]
  const isFourthProject = activeIndex === 3
  const primaryTextColor = isFourthProject ? '#ffffff' : '#000000'
  const softTextColor = isFourthProject ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)'
  const subtleTextColor = isFourthProject ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)'
  const ringBaseColor = isFourthProject ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.25)'
  const ringActiveColor = isFourthProject ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
  const tickColor = isFourthProject ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'

  return (
    <section
      ref={sectionRef}
      style={{ height: `${PROJECTS.length * 100}vh`, background: '#0d0d0d' }}
    >
      <div
        ref={pinRef}
        className='relative flex h-screen w-full items-center justify-center overflow-hidden'
        style={{ background: '#0d0d0d' }}
      >

        {/* ── Project image slides ── */}
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => { if (el) slideRefs.current[i] = el }}
            className='absolute inset-0'
            style={{ zIndex: i + 1 }}
          >
            <img
              src={p.image}
              alt={p.name}
              className='h-full w-full object-cover'
              style={{ filter: 'brightness(1)' }}
            />
          </div>
        ))}

        {/* ── Noise grain overlay ── */}
        <div
          className='pointer-events-none absolute inset-0'
          style={{
            zIndex: 20,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
            opacity: 0.045,
          }}
        />

        {/* ── Center circle ── */}
        <div
          ref={circleRef}
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          style={{ zIndex: 30, width: 340, height: 340 }}
        >
          {/* SVG ring — border grows on scroll */}
          <svg
            viewBox='0 0 340 340'
            className='absolute inset-0 h-full w-full -rotate-90'
            style={{ overflow: 'visible' }}
          >
            {/* Static dim ring */}
            <circle
              cx='170' cy='170' r='165'
              fill='none'
              stroke={ringBaseColor}
              strokeWidth='1'
            />
            {/* Animated progress ring */}
            <circle
              ref={circleBorderRef}
              cx='170' cy='170' r='165'
              fill='none'
              stroke={ringActiveColor}
              strokeWidth='1'
              strokeDasharray='314 1036'
              strokeDashoffset='314'
              strokeLinecap='round'
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          </svg>

          {/* Circle video mask */}
          <div
            className='absolute inset-[18px] overflow-hidden rounded-full'
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.7) inset' }}
          >
            {PROJECTS.map((p, i) => (
              <video
                key={p.id}
                src={p.video}
                className='absolute inset-0 h-full w-full object-cover transition-opacity duration-700'
                autoPlay
                muted
                loop
                playsInline
                preload='metadata'
                poster={p.image}
                style={{
                  opacity: i === activeIndex ? 1 : 0,
                  filter: 'brightness(1)',
                  transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            ))}
          </div>

          {/* Scroll label bottom */}
          <p
            className='absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] tracking-[0.2em] uppercase'
            style={{ fontFamily: 'DM Sans, sans-serif', color: softTextColor }}
          >
            Scroll
          </p>

          {/* Counter left */}
          <p
            className='absolute left-[-4rem] top-1/2 -translate-y-1/2 text-[12px] tracking-[0.12em]'
            style={{ fontFamily: 'DM Sans, sans-serif', color: primaryTextColor, fontSize: '14px' }}
          >
            / {String(activeIndex + 1).padStart(2, '0')}
          </p>

          {/* Counter right */}
          <p
            className='absolute right-[-4rem] top-1/2 -translate-y-1/2 text-[12px] tracking-[0.12em]'
            style={{ fontFamily: 'DM Sans, sans-serif', color: primaryTextColor, fontSize: '14px' }}
          >
            / {String(PROJECTS.length).padStart(2, '0')}
          </p>

          {/* Tick marks at 90° points */}
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className='absolute left-1/2 top-1/2 origin-center'
              style={{
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-170px)`,
                width: 1,
                height: 8,
                background: tickColor,
              }}
            />
          ))}
        </div>

        {/* ── Project name — bottom left ── */}
        <div
          className='absolute bottom-[12vh] left-[5vw] overflow-hidden'
          style={{ zIndex: 30 }}
        >
          <h2
            ref={nameRef}
            className=''
            style={{
              fontFamily: '"Germania One", serif',
              fontSize: 'clamp(32px, 5vw, 72px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: primaryTextColor,
            }}
          >
            {proj.name}
          </h2>
          <p
            ref={categoryRef}
            className='mt-2'
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: softTextColor,
            }}
          >
            {proj.category}
          </p>
        </div>

        {/* ── Counter / index — top left ── */}
        <div
          className='absolute left-[5vw] top-[8vh]'
          style={{ zIndex: 30 }}
        >
          <p
            ref={counterRef}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: primaryTextColor,
              textTransform: 'uppercase',
            }}
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')} &nbsp;·&nbsp; Featured Work
          </p>
        </div>

        {/* ── Tags — top right ── */}
        <div
          className='absolute right-[5vw] top-[8vh] flex flex-col items-end gap-2'
          style={{ zIndex: 30 }}
        >
          {proj.tags.map((tag, i) => (
            <span
              key={tag}
              ref={(el) => { if (el) tagRefs.current[i] = el }}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: primaryTextColor,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Vignette edges ── */}
        <div
          className='pointer-events-none absolute inset-0'
          style={{
            zIndex: 25,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        <button
          type='button'
          onClick={handleProjectClick}
          className='absolute bottom-[5vh] right-[5vw] rounded-full border px-6 py-3 text-[11px] tracking-[0.16em] uppercase transition-all duration-300 hover:scale-[1.03]'
          style={{
            zIndex: 40,
            fontFamily: 'DM Sans, sans-serif',
            color: primaryTextColor,
            borderColor: isFourthProject ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            background: isFourthProject ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            backdropFilter: 'blur(4px)',
          }}
        >
          Visit
        </button>

      </div>
    </section>
  )
}