import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'hello@yourportfolio.dev',
    href: 'mailto:hello@yourportfolio.dev',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/yourprofile',
    href: 'https://linkedin.com',
  },
  {
    label: 'GitHub',
    value: 'github.com/yourprofile',
    href: 'https://github.com',
  },
]

export default function Contact() {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.contact-orb', {
        scale: 0.65,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
      })
        .from(
          '.contact-kicker',
          {
            opacity: 0,
            y: 18,
            duration: 0.6,
          },
          '-=0.7',
        )
        .from(
          '.contact-word',
          {
            yPercent: 115,
            rotate: 4,
            opacity: 0,
            duration: 0.95,
            stagger: 0.08,
            ease: 'expo.out',
          },
          '-=0.4',
        )
        .from(
          '.contact-sub',
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          '-=0.55',
        )
        .from(
          '.shader-panel',
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          '-=0.5',
        )
        .from(
          '.contact-card',
          {
            opacity: 0,
            y: 36,
            duration: 0.8,
            stagger: 0.1,
          },
          '-=0.35',
        )
        .from(
          '.contact-form-wrap',
          {
            opacity: 0,
            x: 46,
            duration: 0.9,
          },
          '-=0.7',
        )
        .from(
          '.contact-marquee',
          {
            opacity: 0,
            y: 14,
            duration: 0.6,
          },
          '-=0.45',
        )

      gsap.to('.contact-orb-1', {
        x: 28,
        y: -20,
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.contact-orb-2', {
        x: -24,
        y: 18,
        duration: 7.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.contact-orb-3', {
        x: 14,
        y: 24,
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.shader-glow-a', {
        rotate: 360,
        duration: 16,
        repeat: -1,
        ease: 'none',
      })
      gsap.to('.shader-glow-b', {
        rotate: -360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.contact-chip', {
        y: -8,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: 'random',
        },
      })

      gsap.to('.marquee-track', {
        xPercent: -50,
        duration: 18,
        repeat: -1,
        ease: 'none',
      })

      const magneticItems = gsap.utils.toArray('.magnetic')
      const handlers = magneticItems.map((el) => {
        const onMove = (event) => {
          const bounds = el.getBoundingClientRect()
          const x = event.clientX - bounds.left - bounds.width / 2
          const y = event.clientY - bounds.top - bounds.height / 2
          gsap.to(el, {
            x: x * 0.16,
            y: y * 0.22,
            duration: 0.35,
            ease: 'power2.out',
          })
        }
        const onLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.45,
            ease: 'elastic.out(1, 0.5)',
          })
        }

        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        return { el, onMove, onLeave }
      })

      return () => {
        handlers.forEach(({ el, onMove, onLeave }) => {
          el.removeEventListener('mousemove', onMove)
          el.removeEventListener('mouseleave', onLeave)
        })
      }
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      className='relative min-h-screen overflow-hidden bg-[#f6ead8] px-6 pb-14 pt-28 md:px-12 lg:px-20'
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.22]'
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(47,49,56,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,49,56,0.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          maskImage: 'radial-gradient(circle at 50% 30%, black 30%, transparent 82%)',
        }}
      />
      <div className='contact-orb contact-orb-1 pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full bg-[#d8ab7f]/35 blur-3xl' />
      <div className='contact-orb contact-orb-2 pointer-events-none absolute right-10 top-12 h-64 w-64 rounded-full bg-[#ac4e2d]/20 blur-3xl' />
      <div className='contact-orb contact-orb-3 pointer-events-none absolute -bottom-8 left-1/3 h-52 w-52 rounded-full bg-[#2f3138]/15 blur-3xl' />
      <div className='shader-glow-a pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full border border-[#2f3138]/20' />
      <div className='shader-glow-b pointer-events-none absolute -left-24 bottom-16 h-80 w-80 rounded-full border border-[#ac4e2d]/20' />

      <div className='relative mx-auto max-w-7xl'>
        <p className='contact-kicker text-xs font-semibold uppercase tracking-[0.26em] text-[#5a3b1f]/75'>
          Contact
        </p>

        <h1 className='mt-4 overflow-hidden font-["GermaniaOne"] leading-[0.9] text-[#2f3138]'>
          <span className='contact-word inline-block text-[clamp(42px,8vw,120px)]'>
            Let&apos;s Build
          </span>
          <br />
          <span className='contact-word inline-block text-[clamp(42px,8vw,120px)]'>
            Something
          </span>
          <br />
          <span className='contact-word inline-block text-[clamp(42px,8vw,120px)] text-[#ac4e2d]'>
            Unforgettable
          </span>
        </h1>

        <p className='contact-sub mt-5 max-w-2xl text-base leading-relaxed text-[#5a3b1f]/80 md:text-lg'>
          I build premium frontend websites with cinematic motion and immersive 3D.
          My workflow combines React, Three.js, and custom GLSL shaders to create
          interactive experiences that feel alive, performant, and brand-specific.
        </p>

        <div className='shader-panel mt-7 rounded-2xl border border-[#2f3138]/20 bg-[#fff7eb]/75 p-5 backdrop-blur-sm'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5a3b1f]/55'>
            3D Capability
          </p>
          <p className='mt-2 max-w-3xl text-sm leading-relaxed text-[#2f3138]/85 md:text-base'>
            Available for interactive hero sections, WebGL product showcases, fluid shader backgrounds,
            scroll-driven 3D storytelling, and high-end portfolio experiences.
          </p>
        </div>

        <div className='mt-7 flex flex-wrap gap-3'>
          {['Frontend Developer', 'Three.js + R3F', 'Custom GLSL Shaders', 'GSAP Motion Systems'].map((item) => (
            <span
              key={item}
              className='contact-chip rounded-full border border-[#5a3b1f]/25 bg-[#efe2cf]/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5a3b1f]'
            >
              {item}
            </span>
          ))}
        </div>

        <div className='mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]'>
          <div className='space-y-4'>
            {CONTACT_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className='contact-card magnetic group block rounded-2xl border border-[#5a3b1f]/20 bg-[#fff8ec]/70 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-[#fff3df]'
              >
                <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5a3b1f]/55'>
                  {item.label}
                </p>
                <div className='mt-3 flex items-center justify-between gap-3'>
                  <p className='text-base font-semibold text-[#2f3138] md:text-lg'>
                    {item.value}
                  </p>
                  <span className='text-sm font-semibold text-[#ac4e2d] transition-transform duration-300 group-hover:translate-x-1'>
                    Visit
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className='contact-form-wrap rounded-[28px] border border-[#5a3b1f]/20 bg-[#fffaf2]/78 p-6 shadow-[0_20px_80px_rgba(90,59,31,0.08)] backdrop-blur-sm md:p-8'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5a3b1f]/55'>
              Start A Project
            </p>
            <form className='mt-6 space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <input
                  type='text'
                  placeholder='Your Name'
                  className='rounded-xl border border-[#5a3b1f]/20 bg-[#fffdfa] px-4 py-3 text-sm text-[#2f3138] outline-none transition-colors focus:border-[#ac4e2d]/60'
                />
                <input
                  type='email'
                  placeholder='Email Address'
                  className='rounded-xl border border-[#5a3b1f]/20 bg-[#fffdfa] px-4 py-3 text-sm text-[#2f3138] outline-none transition-colors focus:border-[#ac4e2d]/60'
                />
              </div>
              <input
                type='text'
                placeholder='Project Type (Website, 3D Experience, Landing Page...)'
                className='w-full rounded-xl border border-[#5a3b1f]/20 bg-[#fffdfa] px-4 py-3 text-sm text-[#2f3138] outline-none transition-colors focus:border-[#ac4e2d]/60'
              />
              <textarea
                rows={6}
                placeholder='Tell me about your vision, timeline, and whether you want Three.js / shader-based interactions...'
                className='w-full resize-none rounded-xl border border-[#5a3b1f]/20 bg-[#fffdfa] px-4 py-3 text-sm text-[#2f3138] outline-none transition-colors focus:border-[#ac4e2d]/60'
              />
              <button
                type='button'
                className='magnetic inline-flex items-center gap-2 rounded-full bg-[#2f3138] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f6ead8] transition-transform duration-300 hover:scale-[1.03]'
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>

        <div className='contact-marquee mt-12 overflow-hidden rounded-full border border-[#5a3b1f]/20 bg-[#efe2cf]/60 py-3'>
          <div className='marquee-track flex w-[200%] whitespace-nowrap'>
            <p className='w-1/2 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#5a3b1f]/75'>
              Frontend Developer   Three.js   WebGL   Custom GLSL Shaders   GSAP   Interactive Experiences
            </p>
            <p className='w-1/2 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#5a3b1f]/75'>
              Frontend Developer   Three.js   WebGL   Custom GLSL Shaders   GSAP   Interactive Experiences
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
