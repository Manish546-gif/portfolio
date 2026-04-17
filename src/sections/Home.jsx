import React from 'react'
import { motion } from 'framer-motion'
import GridDistortion from '../components/GridDistortion'
import bg23 from '../assets/24.jpg'

const EXPO = [0.22, 1, 0.36, 1]

// Animated letters component for hero text
const AnimatedLetters = ({
  text,
  delay = 0,
  staggerDelay = 0.045,
  rotateFrom = 90,
}) => {
  const letters = text.split("")
  return (
    <span style={{ display: "inline-block" }}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
            transformOrigin: "bottom center",
          }}
          initial={{ opacity: 0, rotateX: rotateFrom, y: 20 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{
            duration: 0.55,
            delay: delay + i * staggerDelay,
            ease: EXPO,
          }}
          viewport={{ once: true }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

// Shuffle letters component - letters bounce left and right
const ShuffleLetters = ({
  text,
  delay = 0,
  staggerDelay = 0.045,
}) => {
  const letters = text.split("")
  return (
    <span style={{ display: "inline-block" }}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
          initial={{ opacity: 0, rotateX: 90, y: 20 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          animate={{
            x: [0, -15, 0],
          }}
          transition={{
            rotateX: {
              duration: 0.55,
              delay: delay + i * staggerDelay,
              ease: EXPO,
            },
            opacity: {
              duration: 0.55,
              delay: delay + i * staggerDelay,
              ease: EXPO,
            },
            y: {
              duration: 0.55,
              delay: delay + i * staggerDelay,
              ease: EXPO,
            },
            x: {
              delay: delay + i * staggerDelay + 1.5 + Math.random() * 0.3,
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 1,
              ease: "easeInOut",
            },
          }}
          viewport={{ once: false }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

const Home = () => {
  return (
    <div id='home' className='w-full'>
      {/* Hero Section with Grid Distortion */}
      <div style={{ width: '100%', minHeight: 'min(100vh, 600px)', height: '100vh', position: 'relative', overflow: 'hidden' }} className='max-sm:h-screen'>
        <GridDistortion
          imageSrc={bg23}
          grid={70}
          mouse={0.08}
          strength={0.12}
          relaxation={0.9}
          className="custom-class"
        />
        
        {/* Dark overlay */}
       

        {/* Hero Text Overlay */}
        <div className='absolute inset-0 flex flex-col justify-between z-10 p-6 md:p-12 lg:p-16 pointer-events-none'>
          {/* Top Stats */}
         
          {/* Main Content - Centered */}
          <div className='flex-1 flex items-center'>
            <div className='w-full'>
              {/* Left circular element */}
              <div className='flex items-start gap-8 md:gap-16'>
                
                
                {/* Main heading */}
                <motion.div className='w-full'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: EXPO }}
                  viewport={{ once: true }}
                >
                  <h1 style={{ fontFamily: 'Compacta', letterSpacing: '0.001em' }} className='text-white text-4xl sm:text-5xl md:text-7xl lg:text-[10vw] xl:text-[12vw] font-[#1A0A14] leading-none mb-2'>
                    <span>
                      <AnimatedLetters text="I BUILD MODERN " delay={0} staggerDelay={0.04} rotateFrom={90} />
                    </span>
                    <br />
                    
                    <span className='text-[#1A0A14] ml-0 md:ml-140'>
                      <AnimatedLetters text="WEBSITES" delay={0.4} staggerDelay={0.04} rotateFrom={90} />
                    </span>
                    <br />
                    <span className='flex justify-end items-center underline'>
                      <AnimatedLetters  text="THAT WORK" delay={0.7} staggerDelay={0.04} rotateFrom={90} />
                    </span>
                  </h1>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom - About Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: EXPO }}
            viewport={{ once: true }}
            className='flex flex-col md:flex-row items-end justify-between gap-4 md:gap-0'
          >
            <div>
              <h3 style={{ fontFamily: 'PPEditorialNew', letterSpacing: '0.1em' }} className='text-white text-xs md:text-sm uppercase tracking-widest mb-4'>
                About
              </h3>
              <p style={{ fontFamily: 'PPEditorialNew', letterSpacing: '0.02em' }} className='text-white/70 text-xs md:text-sm max-w-xs md:max-w-md leading-relaxed'>
                I'm a web developer focused on building modern, fast, and reliable websites. I care not only about how a site looks, but also about how it performs, scales, and feels. I make sure every project is built with attention to detail and long-term quality in mind.
              </p>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                style={{ fontFamily: 'PPEditorialNew', letterSpacing: '0.08em' }}
                className='text-green-400 text-xs md:text-sm tracking-widest inline-block mt-6 hover:text-green-300 transition-colors pointer-events-auto'
              >
                Learn more ↗
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home
