import React from "react";
import star from "../assets/star.svg";
import { motion } from "framer-motion";
import img from "../assets/img4.jpg";
import AnimatedPlus from "../components/animatedplus";

const EXPO = [0.22, 1, 0.36, 1];

// Animated letters component (kept for future use if needed)
const AnimatedLetters = ({
  text,
  delay = 0,
  staggerDelay = 0.045,
  rotateFrom = 90,
}) => {
  const letters = text.split("");
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
  );
};

const Landing2 = () => {
  return (
    <div className="w-full bg-white pb-12 md:pb-20">
      {/* Top Section */}
      <div className="min-h-96 md:h-340 w-full">
        <div className="min-h-32 md:h-110 w-full flex flex-col md:flex-row">
          {/* Left Text */}
          <div className="min-h-32 md:h-110 w-full md:w-1/3 flex justify-center items-center px-4 md:px-6 py-8 md:py-0">
            <p
              className="text-[#1A0A14] text-sm md:text-base lg:text-lg leading-relaxed text-center"
              style={{
                fontFamily: "PPEditorialNew",
                letterSpacing: "0.08em",
              }}
            >
              ENGINEERING SCALABLE, HIGH-PERFORMANCE FRONTEND SYSTEMS WITH MODERN
              WEB TECHNOLOGIES.
            </p>
          </div>

          {/* Center Logo */}
          <div className="min-h-32 md:h-110 w-full md:w-1/3 flex justify-center items-center py-8 md:py-0">
            <div className="h-32 md:h-45 border-1 border-[#1A0A14] gap-4 md:gap-17 w-40 md:w-120 rounded-full flex justify-center items-center">
              <img className="h-6 md:h-9 w-6 md:w-9 rotate-star" src={star} alt="" />
              <h1
                className="text-[#1A0A14] text-2xl sm:text-3xl md:text-[6rem]"
                style={{ fontFamily: "FleurDeLeah" }}
              >
                MK
              </h1>
              <img className="h-6 md:h-9 w-6 md:w-9 rotate-star" src={star} alt="" />
            </div>
          </div>

          {/* Right Text */}
          <div className="min-h-32 md:h-110 w-full md:w-1/3 flex justify-center items-center px-4 md:px-6 py-8 md:py-0">
            <p
              className="text-[#1A0A14] text-sm md:text-base lg:text-lg leading-relaxed text-center"
              style={{
                fontFamily: "PPEditorialNew",
                letterSpacing: "0.08em",
              }}
            >
              I BUILD ROBUST, USER-CENTRIC INTERFACES THAT DRIVE BUSINESS IMPACT
              AND GLOBAL REACH.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="min-h-[420px] md:h-210 w-full">
          {/* About Label */}
          <div className="w-full h-10 flex items-center justify-center">
            <div className="h-4 w-40 bg-[#1A0A14] pl-3 pr-3 flex items-center justify-center">
              <div className="h-4 w-full flex items-center justify-center rounded-full bg-white">
                <h2
                  style={{ fontFamily: "PPEditorialNew" }}
                  className="text-gray-900 text-sm font-medium"
                >
                  About me
                </h2>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[360px] md:h-190 w-full mt-8 md:mt-16 flex flex-col md:flex-row justify-center items-center">
            {/* Left Plus - Hidden on mobile */}
            <div className="hidden md:flex h-full w-1/4 justify-center items-center">
              <AnimatedPlus />
            </div>

            {/* Center Content */}
            <div className="h-full w-full md:w-1/2 px-4 md:px-0">
              {/* Top Heading */}
              <div className="w-full md:h-1/4 flex items-center justify-center py-4 md:py-0">
                <p
                  style={{
                   fontFamily:"'Playfair Display',serif", fontStyle:"italic",
                    letterSpacing: "0.08em",
                  }}
                  className="text-white text-[1.5rem] sm:text-[2rem] md:text-[2.4rem] leading-none text-center"
                >
                  <span className="italic text-gray-500">
                    I am a developer specializing
                    <br />in scalable architectures
                  </span>
                  <span className="text-[#1A0A14]">
                    {" "}
                    driven <br /> by performance and precision
                  </span>
                </p>
              </div>

              {/* Image Section */}
              <div className="w-full md:h-1/2 relative flex justify-center items-center py-6 md:py-0">
                <div className="h-[1px] w-[90%] bg-gray-400 absolute top-[50%] rotate-155 z-1 left-[5%]"></div>
                <div className="h-40 sm:h-56 md:h-75 w-1/2 sm:w-2/5 md:w-2/7 z-2">
                  <img
                    className="h-full w-full object-cover"
                    src={img}
                    alt="profile"
                  />
                </div>
              </div>

              {/* Bottom Heading */}
              <div className="w-full md:h-1/4 flex items-center justify-center px-4 md:px-8 py-4 md:py-0">
                <p
                  style={{
                    fontFamily:"'Playfair Display',serif", fontStyle:"italic",
                    letterSpacing: "0.08em",
                    fontWeight:'500'
                  }}
                  className="text-white text-[1.5rem] sm:text-[2rem] md:text-[2.4rem] leading-none text-center"
                >
                  <span className="italic text-gray-500">
                    crafting seamless digital experiences
                  </span>
                  <span className="text-[#1A0A14]">
                    <br /> that balance usability, speed, and scalability
                  </span>
                </p>
              </div>
            </div>

            {/* Right Plus - Hidden on mobile */}
            <div className="hidden md:flex h-full w-1/4 justify-center items-center">
              <AnimatedPlus />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing2;