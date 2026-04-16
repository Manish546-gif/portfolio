import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import fl from "../assets/1.avif";
import fl1 from "../assets/3.avif";
import fl2 from "../assets/2.avif";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";
import img7 from "../assets/img7.jpg";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.jpg";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const PANEL_COUNT = 4;

// ─── Hook: tilt all images based on scroll direction ─────────────────────────
const useScrollTilt = (isMobile) => {
  useEffect(() => {
    let lastX = window.scrollX;
    let lastY = window.scrollY;
    let tiltTarget = 0;
    let tiltCurrent = 0;
    let rafId = null;

    const imgs = document.querySelectorAll("[data-tilt-img]");

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      tiltCurrent = lerp(tiltCurrent, tiltTarget, 0.06);
      imgs.forEach((img) => {
        gsap.set(img, { rotateZ: tiltCurrent, rotateY: tiltCurrent * 0.4 });
      });
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const dx = window.scrollX - lastX;
      const dy = window.scrollY - lastY;
      // horizontal scroll dominates on desktop (pinned section), vertical on mobile
      const delta = isMobile ? dy : dx;
      tiltTarget = Math.max(-6, Math.min(6, delta * 0.35));
      // decay back to 0
      clearTimeout(onScroll._decay);
      onScroll._decay = setTimeout(() => { tiltTarget = 0; }, 80);
      lastX = window.scrollX;
      lastY = window.scrollY;
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);
};
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionA = motion.a;

// ─── Utility: split text into animated letter spans ───────────────────────────
const AnimatedLetters = ({
  text,
  className,
  style,
  delay = 0,
  staggerDelay = 0.045,
  rotateFrom = 90,
  once = true,
}) => {
  const letters = text.split("");
  return (
    <span className={className} style={{ ...style, display: "inline-block" }}>
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
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// ─── Layered Heading: bottom layer comes first, then top ─────────────────────
const LayeredHeading = ({
  bottomText,
  topText,
  bottomClass,
  topClass,
  bottomStyle,
  topStyle,
  containerClass = "",
}) => {
  return (
    <div className={`relative ${containerClass}`}>
      {/* Bottom layer — animates first */}
      <AnimatedLetters
        text={bottomText}
        className={bottomClass}
        style={bottomStyle}
        delay={0}
        staggerDelay={0.04}
        rotateFrom={80}
      />
      {/* Top layer — animates second with extra delay */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 10,
          ...(topStyle || {}),
        }}
        className={topClass}
      >
        <AnimatedLetters
          text={topText}
          style={topStyle}
          delay={0.5}
          staggerDelay={0.04}
          rotateFrom={-80}
        />
      </span>
    </div>
  );
};

// ─── Hover image with subtle scale/brightness + scroll tilt via data attr ─────
const HoverImg = ({ src, alt, className }) => (
  <motion.img
    src={src}
    alt={alt}
    className={className}
    data-tilt-img="true"
    whileHover={{ scale: 1.04, filter: "brightness(1.08)" }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    style={{ willChange: "transform" }}
  />
);

// ─── Bullet paragraph with hover line expand ──────────────────────────────────
const BulletParagraph = ({ children, delay = 0 }) => (
  <motion.p
    initial={{ x: -30, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="leading-relaxed group flex items-start gap-3"
    style={{ fontFamily: 'PPEditorialNew', letterSpacing: '0.08em' }}
  >
    <span className="inline-block mt-2 h-2 w-4 flex-shrink-0 bg-black transition-all duration-300 group-hover:w-6 group-hover:bg-orange-500" />
    <span>{children}</span>
  </motion.p>
);

// ─── Rotating indicator circle ────────────────────────────────────────────────
const RotatingIndicator = ({ src, isHovering, onEnter, onLeave }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    animate={{ rotate: isHovering ? 0 : 360 }}
    transition={{
      scale: { duration: 0.5 },
      opacity: { duration: 0.5 },
      rotate: { duration: 5, repeat: Infinity, ease: "linear" },
    }}
    viewport={{ once: true }}
    className="h-14 w-14 rounded-full cursor-pointer"
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
  >
    <img className="w-full h-full object-cover rounded-full" src={src} alt="work" />
  </motion.div>
);

// ─── Project card for mobile view ─────────────────────────────────────────────
const MobileProjectCard = ({ indicator, title, desc1, desc2, images, overlayWord, overlayScript }) => (
  <div className="mb-16 px-4">
    {/* Overlay heading on mobile */}
    <div className="relative mb-6 overflow-hidden">
      <h2
        style={{ fontFamily: "Compacta" }}
        className="text-[4.5rem] leading-none text-black font-extrabold"
      >
        <AnimatedLetters text={overlayWord} delay={0} staggerDelay={0.06} rotateFrom={90} />
      </h2>
      <span
        style={{ fontFamily: "FleurDeLeah", color: "#ec4899" }}
        className="absolute bottom-0 left-6 text-[3rem] z-10"
      >
        <AnimatedLetters text={overlayScript} delay={0.4} staggerDelay={0.07} rotateFrom={-70} />
      </span>
    </div>

    {/* Images */}
    <div className="flex gap-3 mb-6">
      {images.map((src, i) => (
        <div key={i} className="flex-1 aspect-[3/4] overflow-hidden rounded-sm">
          <HoverImg src={src} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>

    {/* Text content */}
    <div className="flex gap-3 items-start mb-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        animate={{ rotate: 360 }}
        transition={{
          scale: { duration: 0.5 },
          rotate: { duration: 5, repeat: Infinity, ease: "linear" },
        }}
        viewport={{ once: true }}
        className="h-10 w-10 rounded-full flex-shrink-0"
      >
        <img className="w-full h-full object-cover rounded-full" src={indicator} alt="" />
      </motion.div>
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl font-serif text-black"
      >
        {title}
      </motion.h3>
    </div>

    <div className="space-y-3 text-sm text-black">
      <BulletParagraph delay={0.1}>{desc1}</BulletParagraph>
      <BulletParagraph delay={0.25}>{desc2}</BulletParagraph>
    </div>
  </div>
);

// ─── Main Work Component ───────────────────────────────────────────────────────
const Work = ({ isReady = true }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll-direction tilt on all images
  useScrollTilt(isMobile);

  // Desktop horizontal scroll
  useLayoutEffect(() => {
    if (isMobile) return;
    if (!sectionRef.current || !trackRef.current) return undefined;

    const ctx = gsap.context(() => {
      const travelDistance = () => {
        if (!trackRef.current) return 0;
        return trackRef.current.scrollWidth - window.innerWidth;
      };

      gsap.to(trackRef.current, {
        x: () => -travelDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${travelDistance()}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section id="work" className="bg-white border-b border-black">
        {/* Mobile hero heading */}
        <div className="px-4 pt-12 pb-8">
          <div className="overflow-hidden perspective-[600px]">
            <h1
              style={{ fontFamily: "Compacta" }}
              className="text-[5.5rem] leading-none text-black font-extrabold"
            >
              <AnimatedLetters text="Featured" delay={0} staggerDelay={0.055} rotateFrom={90} />
            </h1>
            <h1
              style={{ fontFamily: "Compacta" }}
              className="text-[5.5rem] leading-none text-black font-extrabold ml-10"
            >
              <AnimatedLetters text="Work" delay={0.5} staggerDelay={0.07} rotateFrom={90} />
            </h1>
          </div>
          {/* Divider line */}
          <motion.div
            className="h-px bg-gray-400 mt-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            viewport={{ once: true }}
          />
        </div>

        {/* Project 1 — 1Earth Properties */}
        <MobileProjectCard
          indicator={fl}
          title="1Earth Properties"
          overlayWord="INTERFACE"
          overlayScript="Craft"
          images={[img1, img2, img3]}
          desc1="1Earth Properties is designed as a modern real estate platform that brings clarity and elegance to property discovery. The experience is crafted to feel intuitive."
          desc2="Every interaction is thoughtfully refined to create a seamless journey, combining smooth transitions and structured design to deliver a polished browsing experience."
        />

        {/* Project 2 — Auremont */}
        <MobileProjectCard
          indicator={fl1}
          title="Auremont"
          overlayWord="INTERACTIVE"
          overlayScript="Design"
          images={[img4, img5]}
          desc1="Auremont is shaped as a narrative-driven real estate platform, where each project is presented as a story rather than just a listing."
          desc2="The experience focuses on highlighting the vision behind each property, blending storytelling with structured presentation to create a refined journey."
        />

        {/* Project 3 — third entry */}
        <div className="px-4 mb-16">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="aspect-[3/4] overflow-hidden">
              <HoverImg src={img6} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex-1 overflow-hidden">
                <HoverImg src={img7} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <HoverImg src={img9} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              animate={{ rotate: 360 }}
              transition={{ scale: { duration: 0.5 }, rotate: { duration: 5, repeat: Infinity, ease: "linear" } }}
              viewport={{ once: true }}
              className="h-10 w-10 rounded-full flex-shrink-0"
            >
              <img className="w-full h-full object-cover rounded-full" src={fl2} alt="" />
            </motion.div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl font-serif text-black"
            >
              Auremont
            </motion.h3>
          </div>
          <div className="space-y-3 text-sm">
            <BulletParagraph delay={0.1}>
              Auremont is shaped as a narrative-driven real estate platform, where each project is presented as a story rather than just a listing.
            </BulletParagraph>
            <BulletParagraph delay={0.25}>
              The experience focuses on highlighting the vision behind each property, blending storytelling with structured presentation.
            </BulletParagraph>
          </div>
        </div>
      </section>
    );
  }

  // ── DESKTOP LAYOUT (original structure, enhanced animations) ───────────────
  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative h-screen border-b-1 border-b-black overflow-hidden bg-white"
    >
      <div
        ref={trackRef}
        className="relative flex h-full"
        style={{ width: `${PANEL_COUNT * 110}vw` }}
      >
        <article
          className="relative h-screen shrink-0 bg-white pl-10 flex items-center justify-between"
          style={{ width: "440vw" }}
        >
          <div className="bg-gray-500 z-10 opacity-70 ml-140 h-px w-full absolute" />

          <div className="flex justify-between gap-30 pl-10 items-center">

            {/* ── PANEL 1: "Featured Work" heading ── */}
            <div className="leading-50 ">
              {/* Perspective wrapper for 3D letter rotation */}
              <div style={{ perspective: "800px" }}>
                <h1
                  style={{ fontFamily: "Compacta" }}
                  className="text-[11rem] text-black font-extrabold"
                >
                  <AnimatedLetters
                    text="Featured"
                    delay={0.1}
                    staggerDelay={0.055}
                    rotateFrom={90}
                  />
                </h1>
                <h1
                  style={{ fontFamily: "Compacta" }}
                  className="text-[11rem] text-black font-extrabold ml-45"
                >
                  <AnimatedLetters
                    text="Work"
                    delay={0.65}
                    staggerDelay={0.075}
                    rotateFrom={90}
                  />
                </h1>
              </div>
            </div>

            {/* ── Project 1 text block ── */}
            <div className="flex-1 min-w-md mt-75 z-12 text-black">
              <RotatingIndicator
                src={fl}
                isHovering={isHovering}
                onEnter={() => setIsHovering(true)}
                onLeave={() => setIsHovering(false)}
              />
              <motion.h2
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl mt-4 font-serif mb-6"
              >
                1Earth Properties
              </motion.h2>
              <div className="space-y-4">
                <BulletParagraph delay={0.2}>
                  1Earth Properties is designed as a modern real estate platform that brings clarity
                  and elegance to property discovery. The experience is crafted to feel intuitive,
                  allowing users to explore spaces with ease and confidence.
                </BulletParagraph>
                <BulletParagraph delay={0.4}>
                  Every interaction is thoughtfully refined to create a seamless journey, combining
                  smooth transitions and structured design to deliver a polished and engaging
                  browsing experience.
                </BulletParagraph>
              </div>
            </div>

            {/* ── Project 1 images ── */}
            <div className="h-160 flex items-center w-4xl z-20">
              <div>
                <div className="h-140 w-lg overflow-hidden">
                  <HoverImg className="h-full w-full object-cover" src={img1} alt="" />
                </div>
                <div className="overflow-hidden">
                  <motion.h2
                    className="font-sans text-gray-500 leading-relaxed"
                    initial={{ y: "100%", opacity: 0 }}
                    whileInView={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    error in perception <br />
                    not everything is meant to be understood
                  </motion.h2>
                </div>
              </div>
              <div className="w-full h-full pl-10 pt-17">
                <div className="w-full h-1/2">
                  <div className="w-full h-[85%] overflow-hidden">
                    <HoverImg src={img2} className="h-full w-full object-cover" alt="" />
                  </div>
                  <div className="pt-2">
                    <h2 className="text-md text-gray-700">Parallel states drifting without direction</h2>
                  </div>
                </div>
                <div className="w-full h-1/2">
                  <div className="w-full h-[85%] overflow-hidden">
                    <HoverImg src={img3} className="h-full w-full scale-120 object-cover" alt="" />
                  </div>
                  <div className="pt-2">
                    <h2 className="text-md text-gray-700">Something almost real</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PANEL 2: INTERFACE / Craft — layered heading ── */}
            <div className="h-170 w-5xl">
              <div className="h-3/7 relative w-full items-center flex" style={{ perspective: "800px" }}>
                {/* Bottom layer first */}
                <h1
                  style={{ fontFamily: "Compacta" }}
                  className="text-black font-extrabold text-[15rem]"
                >
                  <AnimatedLetters
                    text="INTERFACE"
                    delay={0}
                    staggerDelay={0.04}
                    rotateFrom={80}
                  />
                </h1>
                {/* Top layer second */}
                <h1
                  style={{ fontFamily: "FleurDeLeah" }}
                  className="text-pink-600 absolute z-10 text-[10rem] ml-40"
                >
                  <AnimatedLetters
                    text="Craft"
                    delay={0.55}
                    staggerDelay={0.06}
                    rotateFrom={-80}
                  />
                </h1>
              </div>
              <div className="h-4/7 flex pt-5 justify-end w-full">
                <div className="flex-1 max-w-md z-12 text-black">
                  <RotatingIndicator
                    src={fl1}
                    isHovering={isHovering}
                    onEnter={() => setIsHovering(true)}
                    onLeave={() => setIsHovering(false)}
                  />
                  <motion.h2
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl mt-4 font-serif mb-6"
                  >
                    Auremont
                  </motion.h2>
                  <div className="space-y-4">
                    <BulletParagraph delay={0.2}>
                      Auremont is shaped as a narrative-driven real estate platform, where each
                      project is presented as a story rather than just a listing. It invites users
                      to explore developments through a more immersive and meaningful perspective.
                    </BulletParagraph>
                    <BulletParagraph delay={0.4}>
                      The experience focuses on highlighting the vision behind each property,
                      blending storytelling with structured presentation to create a refined and
                      engaging journey through the company's portfolio.
                    </BulletParagraph>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Project 2 images ── */}
            <div className="gap-10 flex h-160 z-20 w-5xl">
              <div className="h-full w-1/2">
                <div className="h-[85%] w-full overflow-hidden">
                  <HoverImg className="h-full w-full object-cover" src={img4} alt="" />
                </div>
                <div className="pt-4">
                  <h2 className="text-black">manish</h2>
                </div>
              </div>
              <div className="h-full w-1/2 pt-17">
                <div className="h-[90%] w-full overflow-hidden">
                  <HoverImg className="h-full w-full object-cover" src={img5} alt="" />
                </div>
                <div className="pt-4">
                  <h2 className="text-black">manish</h2>
                </div>
              </div>
            </div>

            {/* ── PANEL 3: INTERACTIVE / Design — layered heading ── */}
            <div className="h-170 w-5xl">
              <div className="h-3/7 relative w-full items-center flex" style={{ perspective: "800px" }}>
                {/* Bottom layer first */}
                <h1
                  style={{ fontFamily: "Compacta" }}
                  className="text-black font-extrabold text-[15rem]"
                >
                  <AnimatedLetters
                    text="INTERACTIVE"
                    delay={0}
                    staggerDelay={0.035}
                    rotateFrom={80}
                  />
                </h1>
                {/* Top layer second */}
                <h1
                  style={{ fontFamily: "FleurDeLeah" }}
                  className="text-pink-600 absolute z-10 text-[10rem] ml-40"
                >
                  <AnimatedLetters
                    text="Design"
                    delay={0.6}
                    staggerDelay={0.06}
                    rotateFrom={-80}
                  />
                </h1>
              </div>
              <div className="h-4/7 flex pt-5 justify-end w-full">
                <div className="flex-1 max-w-md z-12 text-black">
                  <RotatingIndicator
                    src={fl2}
                    isHovering={isHovering}
                    onEnter={() => setIsHovering(true)}
                    onLeave={() => setIsHovering(false)}
                  />
                  <motion.h2
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl mt-4 font-serif mb-6"
                  >
                    Auremont
                  </motion.h2>
                  <div className="space-y-4">
                    <BulletParagraph delay={0.2}>
                      Auremont is shaped as a narrative-driven real estate platform, where each
                      project is presented as a story rather than just a listing. It invites users
                      to explore developments through a more immersive and meaningful perspective.
                    </BulletParagraph>
                    <BulletParagraph delay={0.4}>
                      The experience focuses on highlighting the vision behind each property,
                      blending storytelling with structured presentation to create a refined and
                      engaging journey through the company's portfolio.
                    </BulletParagraph>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Project 3 images ── */}
            <div className="w-5xl h-170 z-20 flex items-center">
              <div className="h-full w-4/7">
                <div className="h-105 w-full">
                  <div className="h-[87%] w-full overflow-hidden">
                    <HoverImg className="h-full w-full object-cover" src={img6} alt="" />
                  </div>
                  <div className="w-full pt-3">manish</div>
                </div>
                <div className="w-full h-65">
                  <div className="h-[87%] w-5/8 ml-54 overflow-hidden">
                    <HoverImg src={img9} className="h-full w-full object-cover" alt="" />
                  </div>
                </div>
              </div>
              <div className="h-full w-2/6 pt-60 ml-5">
                <div className="h-60 w-full overflow-hidden">
                  <HoverImg src={img7} className="h-full w-full object-cover" alt="" />
                </div>
              </div>
            </div>

          </div>
        </article>
      </div>
    </section>
  );
};

export default Work;