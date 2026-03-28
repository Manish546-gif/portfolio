import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const defaultEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

const useLenisSmoothScroll = (enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.35,
      easing: defaultEasing,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.75,
      autoRaf: false,
    })

    window.__lenis = lenis

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.lagSmoothing(0)
    gsap.ticker.add(update)

    const handleRefresh = () => {
      lenis.resize()
    }

    ScrollTrigger.addEventListener('refresh', handleRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener('refresh', handleRefresh)
      gsap.ticker.remove(update)
      lenis.destroy()

      if (window.__lenis === lenis) {
        window.__lenis = undefined
      }
    }
  }, [enabled])
}

export default useLenisSmoothScroll
