import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const EXPO = [0.22, 1, 0.36, 1]

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

export default function PlayTetris() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden px-6 py-20"
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-2xl">
        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EXPO }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            <AnimatedLetters text="Ready for a Challenge?" delay={0.1} />
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Test your skills with a modern twist on a classic game. Experience rhythm, timing, and pure fun.
          </p>
        </motion.div>

        {/* Play Button */}
        <motion.button
          onClick={() => navigate('/tetris')}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="px-8 md:px-12 py-4 md:py-6 mt-6 font-semibold text-lg tracking-wide uppercase border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EXPO }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Tetris Now
        </motion.button>

        {/* Decorative text */}
        <motion.p
          className="text-sm text-gray-400 mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EXPO }}
          viewport={{ once: true }}
        >
          Combine your portfolio skills with interactive fun
        </motion.p>
      </div>
    </section>
  )
}
