import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'HOME' },
  { to: '/work', label: 'WORK' },
  { to: '/about', label: 'ABOUT' },
  { to: '/contact', label: 'CONTACT' },
]

const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/manish-kumar-765745317/',
  github: 'https://github.com/Manish546-gif',
}

function AnimatedLabel({ text }) {
  return (
    <span className='inline-flex'>
      {text.split('').map((char, index) => (
        <span
          key={`${text}-${index}`}
          className='relative inline-block h-[1.3em] overflow-hidden align-top'
        >
          <span
            className='block transition-transform duration-300 ease-out group-hover:-translate-y-full'
            style={{ transitionDelay: `${index * 35}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
          <span
            className='absolute left-0 top-full block transition-transform duration-300 ease-out group-hover:-translate-y-full'
            style={{ transitionDelay: `${index * 35}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  )
}

export default function Navbar() {
  return (
    <nav className='fixed left-0 right-0 top-0 z-40 border-b border-transparent bg-transparent'>
      <div className='mx-auto flex h-14 w-full max-w-9xl items-center justify-between px-4 sm:px-8'>
        <NavLink
          to='/'
          className='font-["GermaniaOne"] text-3xl leading-[0.8] text-[#1f2024]'
          aria-label='Go to home'
        >
          MK
        </NavLink>

        <div className='flex items-center gap-3 sm:gap-5'>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group text-[8px] sm:text-[9px] font-semibold tracking-[0.12em] transition-colors duration-200 ${
                  isActive ? 'text-[#2a1d10]' : 'text-[#9f8d75] hover:text-[#2a1d10]'
                }`
              }
            >
              <AnimatedLabel text={item.label} />
            </NavLink>
          ))}

          <span className='mx-1 h-3 w-px bg-[#bba98f]' />

          <a
            href={SOCIAL_LINKS.linkedin}
            target='_blank'
            rel='noreferrer'
            className='group text-[8px] sm:text-[9px] font-semibold tracking-[0.12em] text-[#9f8d75] transition-colors duration-200 hover:text-[#2a1d10]'
            aria-label='Open LinkedIn profile'
          >
            <AnimatedLabel text='LINKEDIN' />
          </a>

          <a
            href={SOCIAL_LINKS.github}
            target='_blank'
            rel='noreferrer'
            className='group text-[8px] sm:text-[9px] font-semibold tracking-[0.12em] text-[#9f8d75] transition-colors duration-200 hover:text-[#2a1d10]'
            aria-label='Open GitHub profile'
          >
            <AnimatedLabel text='GITHUB' />
          </a>
        </div>
      </div>
    </nav>
  )
}
