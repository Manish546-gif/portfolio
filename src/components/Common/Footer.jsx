import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROUTE_ITEMS = [
  { id: '01', label: 'Home', to: '/' },
  { id: '02', label: 'About', to: '/about' },
  { id: '03', label: 'Work', to: '/work' },
  { id: '04', label: 'Contact', to: '/contact' },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/manish-kumar-765745317/' },
  { label: 'GitHub', href: 'https://github.com/Manish546-gif' },
]

function MagLink({ href, to, children, className, target, rel }) {
  const ref = useRef(null)
  const isExternal = Boolean(href)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * 0.35
    const y = (e.clientY - top - height / 2) * 0.35
    gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' })
  }

  const onLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
  }

  const Tag = isExternal ? 'a' : NavLink
  const props = isExternal ? { href, target, rel } : { to, end: to === '/' }

  return (
    <Tag ref={ref} {...props} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </Tag>
  )
}

function SlideLink({ item }) {
  return (
    <MagLink
      to={item.to}
      className='group relative flex w-full items-center gap-5 overflow-hidden border-b border-[#d3d0ca] px-8 py-7 transition-none'
    >
      <span className='absolute inset-0 origin-top scale-y-0 bg-[#cdc4b7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100' />

      <span className='relative z-10 font-mono text-[11px] tracking-[0.14em] text-[#a19485] transition-colors duration-300 group-hover:text-[#6b6660]'>
        {item.id}
      </span>

      <span className='relative z-10 block h-[1.05em] overflow-hidden text-[clamp(28px,4vw,48px)] leading-none tracking-[-0.02em] text-[#2f3138] transition-colors duration-300 group-hover:text-[#e6e3de]'>
        <span className='block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full'>
          {item.label}
        </span>
        <span className='absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full'>
          {item.label}
        </span>
      </span>

      <span className='relative z-10 ml-auto block overflow-hidden text-[clamp(22px,3vw,36px)] leading-none text-[#a19485] group-hover:text-[#e6e3de]'>
        <span className='block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full group-hover:translate-x-1'>↗</span>
        <span className='absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full group-hover:translate-x-1'>↗</span>
      </span>
    </MagLink>
  )
}

export default function Footer() {
  const footerRef = useRef(null)
  const logoRef = useRef(null)
  const logoTextRef = useRef(null)
  const bottomRef = useRef(null)
  const emailRef = useRef(null)
  const inputRef = useRef(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoTextRef.current, {
        yPercent: 105,
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: logoRef.current,
          start: 'top 88%',
        },
      })

      gsap.from('.footer-nav-item', {
        x: -24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer-nav-item',
          start: 'top 90%',
        },
      })

      gsap.from('.footer-bottom-cell', {
        y: 20,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bottomRef.current,
          start: 'top 92%',
        },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  const scrambleEmail = () => {
    const el = emailRef.current
    if (!el) return
    const final = 'info@madeinuxstudio.com'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@.'
    let iter = 0
    const interval = setInterval(() => {
      el.textContent = final
        .split('')
        .map((_, i) => (i < iter ? final[i] : chars[Math.floor(Math.random() * chars.length)]))
        .join('')
      if (iter >= final.length) clearInterval(interval)
      iter += 1.4
    }, 28)
  }

  return (
    <footer ref={footerRef} className='border-t mt-10 border-[#d3d0ca] bg-[#f6ead8] text-[#2f3138]' style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className='grid grid-cols-1 border-b border-[#d3d0ca] lg:grid-cols-[2fr_1.6fr]' style={{ height: '56vh' }}>
        <div ref={logoRef} className='flex items-center justify-center border-b border-[#d3d0ca] p-16 lg:border-b-0 lg:border-r'>
          <div className='overflow-hidden'>
            <p
              ref={logoTextRef}
              className='select-none text-center leading-[0.82] tracking-[-0.03em] text-[#2f3138]'
              style={{ fontFamily: '"Germania One", serif', fontSize: 'clamp(54px, 10vw, 140px)' }}
            >
              Manish<br />Kumar
            </p>
          </div>
        </div>

        <nav className='flex flex-col'>
          {ROUTE_ITEMS.map((item) => (
            <div key={item.to} className='footer-nav-item'>
              <SlideLink item={item} />
            </div>
          ))}
        </nav>
      </div>

      <div ref={bottomRef} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='footer-bottom-cell flex flex-col justify-between  border-r border-[#d3d0ca] p-8' style={{ minHeight: '130px' }}>
          <p className='text-[14px] leading-none text-[#9aa1a9]'>. Contact</p>
          <a
            ref={emailRef}
            href='mailto:info@madeinuxstudio.com'
            className='mt-auto block text-[25px] leading-none text-[#2f3138] transition-colors hover:text-[#a19485] sm:text-[19px]'
            onMouseEnter={scrambleEmail}
          >
            manishkumar925657@gmail.com
          </a>
        </div>

        <div className='footer-bottom-cell flex flex-col justify-between  border-r border-[#d3d0ca] p-8' style={{ minHeight: '150px' }}>
          <p className='text-[17px] leading-none text-[#9aa1a9]'>. Subscribe</p>
          <div className='mt-10 flex items-center gap-4 border-b border-[#9aa1a9] pb-3'>
            <input
              ref={inputRef}
              type='email'
              placeholder='Enter your email'
              className='flex-1 bg-transparent text-[20px] leading-none text-[#6f7680] outline-none placeholder:text-[#6f7680] sm:text-[20px]'
            />
            <button
              onClick={() => gsap.from(inputRef.current, { x: -6, duration: 0.3, ease: 'power2.out' })}
              className='text-[30px] leading-none text-[#2f3138] transition-transform hover:translate-x-0.5 hover:-translate-y-0.5'
            >
              →
            </button>
          </div>
        </div>

        <div className='footer-bottom-cell flex flex-col justify-between border-b border-r border-[#d3d0ca] p-8' style={{ minHeight: '250px' }}>
          <p className='text-[20px] leading-none text-[#9aa1a9]'>. Connect</p>
          <div className='mt-16 flex flex-col gap-2'>
            {SOCIALS.map((s) => (
              <MagLink
                key={s.label}
                href={s.href}
                target='_blank'
                rel='noreferrer'
                className='group inline-flex w-fit items-center gap-2 text-[20px] leading-none text-[#2f3138] sm:text-[20px]'
              >
                <span className='relative block overflow-hidden'>
                  <span className='block transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full'>
                    {s.label}
                  </span>
                  <span className='absolute left-0 top-full block text-[#a19485] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full'>
                    {s.label}
                  </span>
                </span>
                <span className='text-[14px] text-[#a19485] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>↗</span>
              </MagLink>
            ))}
          </div>
        </div>

        <div className='footer-bottom-cell flex flex-col justify-between border-b border-[#d3d0ca] p-8' style={{ minHeight: '250px' }}>
          <p className='text-[20px] leading-none text-[#9aa1a9]'>. Others</p>
          <div className='mt-16 flex items-end justify-between gap-6'>
            <a href='/privacy' className='text-[20px] leading-none hover:text-[#a19485] sm:text-[20px]'>
              Privacy Policy
            </a>
            <p className='text-[20px] leading-none text-[#606775] sm:text-[20px]'>2026 Made By Manish Kumar</p>
          </div>
        </div>
      </div>

      <div className='overflow-hidden border-t border-[#d3d0ca] py-4'>
        <div className='flex gap-12 whitespace-nowrap' style={{ animation: 'marquee 22s linear infinite', width: 'max-content' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className='text-[11px] uppercase tracking-[0.22em] text-[#a19485]'>
              React · Next.js · Tailwind CSS · Framer Motion · GSAP · Three.js · TypeScript · Responsive Design ·
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
      `}</style>
    </footer>
  )
}