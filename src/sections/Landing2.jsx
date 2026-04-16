import React from "react";
import star from "../assets/star.svg";
import { motion } from "framer-motion";
import img from "../assets/img4.jpg";

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
    <div className="w-full bg-white pb-20">
      {/* Top Section */}
      <div className="h-340 w-full">
        <div className="h-110 w-full flex">
          {/* Left Text */}
          <div className="h-110 w-1/3 flex justify-center items-center px-6">
            <p
              className="text-black text-lg leading-relaxed text-center"
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
          <div className="h-110 w-1/3 flex justify-center items-center">
            <div className="h-45 border-1 border-black gap-17 w-120 rounded-full flex justify-center items-center">
              <img className="h-9 w-9 rotate-star" src={star} alt="" />
              <h1
                className="text-black text-[6rem] mr-4"
                style={{ fontFamily: "FleurDeLeah" }}
              >
                MK
              </h1>
              <img className="h-9 w-9 rotate-star" src={star} alt="" />
            </div>
          </div>

          {/* Right Text */}
          <div className="h-110 w-1/3 flex justify-center items-center px-6">
            <p
              className="text-black text-lg leading-relaxed text-center"
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
        <div className="h-210 w-full">
          {/* About Label */}
          <div className="w-full h-10 flex items-center justify-center">
            <div className="h-4 w-40 bg-black pl-3 pr-3 flex items-center justify-center">
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
          <div className="h-190 w-full mt-16 flex justify-center items-center">
            <div className="h-full w-1/4 "></div>

            {/* Center Content */}
            <div className="h-full w-1/2">
              {/* Top Heading */}
              <div className="w-full h-1/4 flex items-center justify-center">
                <p
                  style={{
                    fontFamily: "PPEditorialNew",
                    letterSpacing: "0.08em",
                  }}
                  className="text-white text-[2.4rem] leading-none text-center"
                >
                  <span className="italic text-gray-500">
                    I am a  website developer
                    <br /> specializing in scalable architectures
                  </span>
                  <span className="text-black">
                    {" "}
                    driven <br /> by performance and precision
                  </span>
                </p>
              </div>

              {/* Image Section */}
              <div className="w-full h-1/2 relative flex justify-center items-center">
                <div className="h-[1px] w-[90%] bg-gray-400 absolute top-[50%] rotate-155 z-1 left-[5%]"></div>
                <div className="h-75 w-2/7 z-2 ">
                  <img
                    className="h-full w-full object-cover"
                    src={img}
                    alt="profile"
                  />
                </div>
              </div>

              {/* Bottom Heading */}
              <div className="w-full h-1/4 flex items-center justify-center px-8">
                <p
                  style={{
                    fontFamily: "PPEditorialNew",
                    letterSpacing: "0.08em",
                  }}
                  className="text-white text-[2.4rem] leading-none text-center"
                >
                  <span className="italic text-gray-500">
                    crafting seamless digital experiences
                  </span>
                  <span className="text-black">
                    <br /> that balance usability, speed, and scalability
                  </span>
                </p>
              </div>
            </div>

            <div className="h-full w-1/4 e"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing2;