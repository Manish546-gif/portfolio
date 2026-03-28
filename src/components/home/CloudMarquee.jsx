import { motion } from 'framer-motion'
import cloud2 from '../../assets/clouds_2.webp'
import cloud3 from '../../assets/clouds_3.png'

export default function CloudMarquee() {
	return (
		<div className='w-full h-[140vh] bg-gradient-to-b from-sky-200 to-sky-100 flex items-center overflow-hidden'>
			{/* Base cloud marquee - clouds_2 */}
			<motion.div
				className='flex gap-0 whitespace-nowrap absolute inset-0'
				animate={{ x: ['0%', '-100%'] }}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: 'linear',
				}}
			>
				{Array(14)
					.fill(0)
					.map((_, i) => (
						<img key={`cloud2-${i}`} src={cloud2} alt='cloud' className='h-120 flex-shrink-0' />
					))}
			</motion.div>

			{/* Duplicate set for seamless loop - clouds_2 */}
			<motion.div
				className='flex gap-0 whitespace-nowrap absolute inset-0'
				animate={{ x: ['0%', '-100%'] }}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: 'linear',
				}}
			>
				{Array(14)
					.fill(0)
					.map((_, i) => (
						<img key={`cloud2-dup-${i}`} src={cloud2} alt='cloud' className='h-120 flex-shrink-0' />
					))}
			</motion.div>

			{/* Overlay marquee - clouds_3 */}
			<motion.div
				className='flex gap-0 whitespace-nowrap absolute inset-0 opacity-60 pointer-events-none'
				animate={{ x: ['0%', '-100%'] }}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: 'linear',
				}}
			>
				{Array(14)
					.fill(0)
					.map((_, i) => (
						<img key={`cloud3-${i}`} src={cloud3} alt='cloud-overlay' className='h-120 flex-shrink-0' />
					))}
			</motion.div>

			{/* Duplicate set for seamless loop - clouds_3 */}
			<motion.div
				className='flex gap-0 whitespace-nowrap absolute inset-0 opacity-60 pointer-events-none'
				animate={{ x: ['0%', '-100%'] }}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: 'linear',
				}}
			>
				{Array(14)
					.fill(0)
					.map((_, i) => (
						<img key={`cloud3-dup-${i}`} src={cloud3} alt='cloud-overlay' className='h-120 flex-shrink-0' />
					))}
			</motion.div>
		</div>
	)
}
