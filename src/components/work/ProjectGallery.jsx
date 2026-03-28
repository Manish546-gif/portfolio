import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import project1 from '../../assets/project1.png'
import project2 from '../../assets/project2.png'
import project3 from '../../assets/project3.png'
import project4 from '../../assets/project4.png'
import project5 from '../../assets/project5.png'
import project6 from '../../assets/project6.png'
import project7 from '../../assets/project7.png'
import project8 from '../../assets/project8.png'
gsap.registerPlugin(ScrollTrigger)
const PROJECTS = [
  { id: '01', title: 'One Earth Properties',                    tag: 'React', image: project1 },
  { id: '02', title: 'ET', tag: 'UI/UX & Development',      image: project2 },
  { id: '03', title: 'Learnkins',                   tag: 'Learning Platform', image: project3 },
  { id: '04', title: '3D Wolf',                   tag: 'Three.js & WebGL', image: project4 },
  { id: '05', title: 'Refokus',                    tag: 'Gsap & ScrollTrigger',      image: project5 },
  { id: '06', title: 'CivicNexus',                   tag: 'Community Platform', image: project6 },
  { id: '07', title: 'ExoApe',                    tag: 'Showcase', image: project7 },
  { id: '08', title: 'HaritSetu',                    tag: 'P2P Carbon Credit Platform', image: project8 },
]
const GAP = 8
/* ═══════════════════════════════════════════════════════════
   STRIP LAYOUT – Cards flush to bottom in a horizontal row
   ═══════════════════════════════════════════════════════════ */
function getStripLayout(count, W, H) {
  const cardH  = Math.round(H * 0.26)
  const cardW  = Math.round((W - GAP * (count - 1)) / count)
  const startX = 0
  const y      = H - cardH - 20 // slight margin from bottom
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * (cardW + GAP),
    y,
    width:  cardW,
    height: cardH,
  }))
}
/* ═══════════════════════════════════════════════════════════
   GRID LAYOUT – Refined masonry-style grid
   Row 1: 3 large cards
   Row 2: 4 medium cards
   Card 8 stays hidden off-screen
   ═══════════════════════════════════════════════════════════ */
function getGridLayout(W, H) {
  const g = GAP
  
  // Top row - 3 larger cards with better proportions
  const topW = Math.round((W - g * 2) / 3)
  const topH = Math.round(H * 0.70)
  const topY = Math.round(H * 0.4)
  // Bottom row - 4 cards
  const bottomW = Math.round((W - g * 3) / 4)
  const bottomH = Math.round(H * 0.56)
  const bottomY = topY + topH + Math.round(H * 0.1)
  return [
    // Top row (3 cards)
    { x: 0,                   y: topY, width: topW, height: topH },
    { x: topW + g,            y: topY, width: topW, height: topH },
    { x: (topW + g) * 2,      y: topY, width: topW, height: topH },
    
    // Bottom row (4 cards)
    { x: 0,                   y: bottomY, width: bottomW, height: bottomH },
    { x: bottomW + g,         y: bottomY, width: bottomW, height: bottomH },
    { x: (bottomW + g) * 2,   y: bottomY, width: bottomW, height: bottomH },
    { x: (bottomW + g) * 3,   y: bottomY, width: bottomW, height: bottomH },
    
    // Card 8 - hidden off-screen
    { x: W + 160, y: bottomY, width: bottomW, height: bottomH },
  ]
}
/* ═══════════════════════════════════════════════════════════
   MOBILE LAYOUT – 2-column stacked grid
   ═══════════════════════════════════════════════════════════ */
function getMobileLayout(count, W, H) {
  const cardW = Math.round((W - GAP) / 2)
  const cardH = Math.round(cardW * 1.15) // Better aspect ratio
  const startY = Math.round(H * 0.18)
  return Array.from({ length: count }, (_, i) => ({
    x:      i % 2 === 0 ? 0 : cardW + GAP,
    y:      startY + Math.floor(i / 2) * (cardH + GAP),
    width:  cardW,
    height: cardH,
  }))
}
export default function ProjectGallery() {
  const sectionRef  = useRef(null)
  const stageRef    = useRef(null)
  const titleRef    = useRef(null)
  const subtitleRef = useRef(null)
  const hintRef     = useRef(null)
  const cardRefs    = useRef([])
  const metaRefs    = useRef([])
  const imgRefs     = useRef([])

  const getMonogram = (title) => {
    const parts = title
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0]?.toUpperCase())
      .filter(Boolean)

    if (parts.length === 0) return 'PR'
    if (parts.length === 1) return `${parts[0]}${parts[0]}`
    return `${parts[0]}${parts[1]}`
  }
  useGSAP(() => {
    const stage = stageRef.current
    const cards = cardRefs.current.filter(Boolean)
    const metas = metaRefs.current.filter(Boolean)
    const imgs  = imgRefs.current.filter(Boolean)
    if (!stage || !cards.length) return
    /* ═══ Initial hidden state ═══ */
    gsap.set([titleRef.current, subtitleRef.current], { 
      opacity: 0, 
      y: 48 
    })
    gsap.set(hintRef.current, { opacity: 0, y: 20 })
    gsap.set(metas, { autoAlpha: 0, y: 16 })
    gsap.set(cards, { opacity: 0 })
    /* ═══ Entrance animation ═══ */
    const intro = gsap.timeline({ 
      defaults: { ease: 'power3.out' } 
    })
    
    intro
      .to(titleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 1.2,
        ease: 'power4.out'
      })
      .to(subtitleRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.9 
      }, '-=0.7')
      .to(hintRef.current, { 
        opacity: 1, 
        y: 0,
        duration: 0.6 
      }, '-=0.4')
    /* Hint line breathing animation */
    gsap.to('.hint-line', {
      scaleY: 1.5, 
      opacity: 0.25,
      duration: 1.8, 
      repeat: -1, 
      yoyo: true, 
      ease: 'sine.inOut',
    })
    const mm = gsap.matchMedia()
    /* ═══════════════════════════════════════════════════════════
       DESKTOP ANIMATION
       ═══════════════════════════════════════════════════════════ */
    mm.add('(min-width: 900px)', () => {
      const build = () => {
        const { width: W, height: H } = stage.getBoundingClientRect()
        return { 
          strip: getStripLayout(cards.length, W, H), 
          grid: getGridLayout(W, H) 
        }
      }
      let L = build()
      const visibleMetas = metas.slice(0, 7)
      /* Set initial strip positions */
      gsap.set(cards, {
        x:            i => L.strip[i].x,
        y:            i => L.strip[i].y,
        width:        i => L.strip[i].width,
        height:       i => L.strip[i].height,
        borderRadius: 0,
        opacity:      0,
      })
      /* Stagger cards in during intro */
      intro.to(cards, {
        opacity: 1,
        stagger: { 
          each: 0.05, 
          from: 'start',
          ease: 'power2.out'
        },
        duration: 0.7,
        ease: 'power2.out',
      }, 0.6)
      /* ═══ Scroll-triggered animation ═══ */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:      sectionRef.current,
          start:        'top top',
          end:          '+=150%',
          scrub:        2,
          pin:          stage,
          pinSpacing:   true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            L = build()
            gsap.set(cards, {
              x:      i => L.strip[i].x,
              y:      i => L.strip[i].y,
              width:  i => L.strip[i].width,
              height: i => L.strip[i].height,
            })
          },
        },
      })
      /* ─── Phase 0: Fade out hint, compact header ─── */
      tl.to(hintRef.current, { 
        autoAlpha: 0, 
        y: -20,
        duration: 0.1 
      }, 0)
      
      tl.to(titleRef.current, { 
        y: -60, 
        scale: 0.88, 
        transformOrigin: 'center top', 
        ease: 'power2.inOut',
        duration: 0.3
      }, 0)
      
      tl.to(subtitleRef.current, { 
        autoAlpha: 0, 
        y: -20, 
        ease: 'power2.in',
        duration: 0.15
      }, 0)
      /* ─── Phase 1: Cards transform from strip → grid (with overshoot) ─── */
      tl.to(cards, {
        x:      i => L.grid[i].x,
        y:      i => L.grid[i].y + 40, // overshoot for bounce effect
        width:  i => L.grid[i].width,
        height: i => L.grid[i].height,
        borderRadius: 0,
        ease:   'power3.inOut',
        stagger: { 
          each: 0.035, 
          from: 'center',
          ease: 'power1.inOut'
        },
        duration: 0.5
      }, 0.12)
      /* ─── Phase 2: Settle cards to final position ─── */
      tl.to(cards, {
        y: i => L.grid[i].y,
        ease: 'elastic.out(1, 0.6)',
        stagger: { 
          each: 0.028, 
          from: 'center' 
        },
        duration: 0.4
      }, 0.72)
      /* Fade out 8th card */
      tl.to(cards[7], {
        autoAlpha: 0,
        x: '+=60',
        ease: 'power2.out',
        duration: 0.3
      }, 0.42)
      /* ─── Phase 3: Image zoom during transition ─── */
      tl.to(imgs, {
        scale: 1.08, 
        ease: 'power2.out',
        stagger: { 
          each: 0.03, 
          from: 'center' 
        },
        duration: 0.35
      }, 0.15)
      
      tl.to(imgs, {
        scale: 1, 
        ease: 'power3.out',
        stagger: { 
          each: 0.025, 
          from: 'center' 
        },
        duration: 0.4
      }, 0.75)
      /* ─── Phase 4: Reveal metadata labels ─── */
      tl.to(visibleMetas, {
        autoAlpha: 1, 
        y: 0, 
        ease: 'power3.out',
        stagger: { 
          each: 0.03, 
          from: 'center' 
        },
        duration: 0.35
      }, 0.68)
    })
    /* ═══════════════════════════════════════════════════════════
       MOBILE ANIMATION
       ═══════════════════════════════════════════════════════════ */
    mm.add('(max-width: 899px)', () => {
      const build = () => {
        const { width: W, height: H } = stage.getBoundingClientRect()
        return getMobileLayout(cards.length, W, H)
      }
      let L = build()
      gsap.set(cards, {
        x:      i => L[i].x,
        y:      i => L[i].y + 80,
        width:  i => L[i].width,
        height: i => L[i].height,
        opacity: 0,
        borderRadius: 0,
      })
      intro.to(cards, {
        opacity: 1,
        y: i => L[i].y,
        stagger: { 
          each: 0.1, 
          from: 'start',
          ease: 'power2.out'
        },
        duration: 0.8,
        ease: 'power3.out',
      }, 0.5)
      gsap.to(metas, {
        autoAlpha: 1, 
        y: 0,
        delay: 1.4, 
        stagger: 0.08, 
        ease: 'power3.out',
        duration: 0.6
      })
    })
  }, [])
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,700;9..40,900&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
        
        /* Smooth rendering optimizations */
        .gallery-card {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }
        
        .gallery-card img {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .hover-info-panel {
          background-color: #AC4E2D;
        }
      `}</style>
      <section ref={sectionRef} className="relative z-20 px-5 h-[330vh] bg-[#f6ead8]">
        <div
          ref={stageRef}
          className="relative z-20 h-screen w-full "
          style={{ perspective: '2400px' }}
        >
          {/* ══════════════════════════════════════════════════════════
              HEADER SECTION
              ══════════════════════════════════════════════════════════ */}
          <div className="pointer-events-none absolute inset-x-0 top-[7vh] z-30 flex flex-col items-center px-6">
            <h2
              ref={titleRef}
              className="mx-auto max-w-[980px] text-center uppercase text-[#181818]"
              style={{
                fontFamily:    'sans-serif',
                fontWeight:    700,
                fontSize:      'clamp(32px, 5.2vw, 86px)',
                lineHeight:    0.92,
                letterSpacing: '-0.035em',
              }}
            >
              Quietly Crafted Interfaces <br/>
Shaped By Real Experiences
            </h2>
            <p
              ref={subtitleRef}
              className="mt-6 max-w-[420px] text-center text-[#7a736c]"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle:  'italic',
                fontWeight: 300,
                fontSize:   'clamp(15px, 1.35vw, 19px)',
                lineHeight: 1.65,
              }}
            >
             Every interface carries the quiet weight of experiences crafted beautifully.
            </p>
          </div>
          {/* ══════════════════════════════════════════════════════════
              PROJECT CARDS
              ══════════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 z-10">
            {PROJECTS.map((project, i) => (
              <div
                key={project.id}
                ref={el => { if (el) cardRefs.current[i] = el }}
                className="gallery-card group absolute left-0 top-0 overflow-hidden bg-[#cac5bb] cursor-pointer select-none shadow-lg"
                style={{
                  willChange: 'transform, opacity',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <img
                  ref={el => { if (el) imgRefs.current[i] = el }}
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                  style={{ 
                    transformOrigin: 'center center', 
                    willChange: 'transform',
                    filter: 'brightness(0.96) contrast(1.02)'
                  }}
                />
                {/* Project number badge */}
                <span
                  className="absolute left-4 top-4 text-white/45 pointer-events-none"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontStyle:  'italic',
                    fontWeight: 300,
                    fontSize:   'clamp(11px, 1.1vw, 14px)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  {project.id}
                </span>
                {/* Metadata overlay */}
                <div
                  ref={el => { if (el) metaRefs.current[i] = el }}
                  className="hover-info-panel m-6 pointer-events-none absolute inset-x-0 bottom-0 h-0 overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-[23%]"
                  style={{
                    backgroundColor: ['#AC4E2D', '#69806D', '#B0AD9F', '#9A9882'][i % 4],
                  }}
                >
                  <div
                    className="absolute inset-0"
                  style={{
                    padding:    'clamp(16px, 1.8vw, 22px) clamp(12px, 1.5vw, 18px)',
                  }}
                >
                  <div className="flex h-full w-full items-end justify-between gap-4">
                    <div className="flex flex-col justify-between">
                      <span
                        className="pr-4 text-[#121212]"
                        style={{
                          fontFamily: 'sans-serif',
                          fontWeight: 300,
                          fontSize: 'clamp(18px,1.8vw,40px)',
                          lineHeight: 1,
                        }}
                      >
                        {project.title}
                      </span>
                      <span
                        className="mt-4 text-[#121212]/90"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: 600,
                          fontSize: 'clamp(11px,0.8vw,14px)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {project.tag}
                      </span>
                    </div>

                    <span
                      className="select-none mt-10 text-[clamp(44px,6vw,120px)] font-black leading-none text-[#d6885e]"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        textShadow: 'inset 0 0 0 rgba(0,0,0,0.25)',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {getMonogram(project.title)}
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* ══════════════════════════════════════════════════════════
              SCROLL HINT
              ══════════════════════════════════════════════════════════ */}
          <div
            ref={hintRef}
            className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
          >
            <span
              className="text-[#9c9690] uppercase tracking-widest"
              style={{
                fontFamily:    'DM Sans, sans-serif',
                fontWeight:    700,
                fontSize:      9,
                letterSpacing: '0.24em',
              }}
            >
              Scroll
            </span>
            <div
              className="hint-line w-px bg-[#9c9690]/70 origin-top"
              style={{ height: 52 }}
            />
          </div>
        </div>
      </section>
    </>
  )
}