import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import workLandingImage from '../../assets/worklanding.jpg'

gsap.registerPlugin(ScrollTrigger)

export default function WorkLanding() {
	const sectionRef = useRef(null)
	const pinWrapRef = useRef(null)
	const frameRef = useRef(null)
	const imageRef = useRef(null)
	const titleRef = useRef(null)
	const captionRef = useRef(null)

	useGSAP(
		() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top top',
					end: '+=180%',
					scrub: 0.9,
					pin: pinWrapRef.current,
					anticipatePin: 1,
				},
			})

			// Initial look: centered frame with title below.

			tl.to(
				frameRef.current,
				{
					width: '100vw',
					height: '100vh',
					minWidth: 0,
					maxWidth: 'none',
					borderWidth: 0,
					borderRadius: 0,
					boxShadow: 'none',
					duration: 1,
					ease: 'none',
				},
				0,
			)

			tl.to(
				imageRef.current,
				{
					scale: 1.55,
					duration: 1,
					ease: 'none',
					transformOrigin: 'center center',
				},
				0,
			)

			tl.to(
				titleRef.current,
				{
					yPercent: 55,
					opacity: 0,
					duration: 0.45,
					ease: 'none',
				},
				0,
			)

			tl.to(
				captionRef.current,
				{
					opacity: 0,
					y: 24,
					duration: 0.35,
					ease: 'none',
				},
				0,
			)

		},
		{ dependencies: [] },
	)

	return (
		<section ref={sectionRef} className='relative h-[280vh] bg-[#f6ead8]'>
			<div ref={pinWrapRef} className='relative flex h-screen items-center justify-center overflow-hidden'>
				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.55),rgba(0,0,0,0)_60%)]' />

				<div
					ref={frameRef}
					className='relative h-[35vh] w-[28vw] overflow-hidden border-4 border-[#f3eee3] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.12)]'
					style={{ minWidth: '200px', maxWidth: '100px' }}
				>
					<img
						ref={imageRef}
						src={workLandingImage}
						alt='Work interior preview'
						className='h-full w-full  object-cover'
					/>
				</div>

				<h1
					ref={titleRef}
					className='absolute bottom-[11vh] left-1/2 -translate-x-1/2 font-["GermaniaOne"] text-[clamp(56px,14vw,150px)] leading-[0.82] tracking-tight text-[#11131a]'
				>
					WORK
				</h1>

				<p
					ref={captionRef}
					className='absolute bottom-[6vh] left-1/2 max-w-xl -translate-x-1/2 px-6 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#31291f]/70'
				>
					each project starts with an intention. spaces balanced, timeless and practical.
				</p>
			</div>
		</section>
	)
}
