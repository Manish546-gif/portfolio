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

    // Detect mobile device
    const isMobile = window.innerWidth < 768

    // Use shorter duration on mobile for better performance
    const duration = isMobile ? 0.8 : 1.8
    const wheelMultiplier = isMobile ? 1.0 : 0.6

    const lenis = new Lenis({
      duration: duration,
      easing: defaultEasing,
      smoothWheel: true, // Enable smooth wheel scrolling on all devices
      syncTouch: true,
      touchMultiplier: isMobile ? 1.2 : 1.0, // Faster touch scrolling on mobile
      wheelMultiplier: wheelMultiplier,
      autoRaf: false,
    })

    window.__lenis = lenis

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    // Simple performance stabilization
    gsap.ticker.lagSmoothing(0)
    gsap.config({ force3D: true })
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
