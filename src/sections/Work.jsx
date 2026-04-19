import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import fl from "../assets/1.avif";
import fl1 from "../assets/3.avif";
import fl2 from "../assets/2.avif";

import img1 from "../assets/project1img1.png";
import img2 from "../assets/project1img2.png";
import img3 from "../assets/project1img3.png";
import img4 from "../assets/project2img1.png";
import img5 from "../assets/project2img2.png";
import img6 from "../assets/project3img1.png";
import img7 from "../assets/project3img2.png";
import img8 from "../assets/24.jpg";
import img9 from "../assets/project3img3.png";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import GridDistortion from "../components/GridDistortion";

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

// ─── Bullet paragraph ──────────────────────────────────────────────────────────
const BulletParagraph = ({ children, delay = 0 }) => (
  <motion.p
    initial={{ x: -30, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="leading-relaxed flex items-start gap-3"
    style={{ fontFamily: 'PPEditorialNew', letterSpacing: '0.08em' }}
  >
    <span className="inline-block mt-2 h-2 w-4 shrink-0 bg-[#1A0A14]" />
    <span>{children}</span>
  </motion.p>
);

// ─── Image with View button on hover ───────────────────────────────────────────
const ImageWithViewButton = ({ imageSrc, projectUrl, className = "" }) => {
  return (
    <button
      onClick={() => {
        if (projectUrl) window.open(projectUrl, "_blank");
      }}
      className={`relative overflow-hidden group cursor-pointer bg-none border-none p-0 w-full h-full rounded-lg ${className}`}
      style={{ pointerEvents: "auto" }}
      aria-label="View project"
    >
      <GridDistortion
        imageSrc={imageSrc}
        grid={70}
        mouse={0.08}
        strength={0.12}
        relaxation={0.9}
        className="h-full w-full object-cover"
      />
    </button>
  );
};

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
const MobileProjectCard = ({ indicator, title, desc1, desc2, images, projectUrls = [], overlayWord, overlayScript }) => (
  <div className="mb-16 px-4">
    {/* Overlay heading on mobile */}
    <div className="relative mb-6 overflow-hidden">
      <h2
        style={{ fontFamily: "Compacta" }}
        className="text-[4.5rem] leading-none text-[#1A0A14] font-extrabold"
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
        <div key={i} className="flex-1 aspect-3/4 overflow-hidden rounded-sm">
          <ImageWithViewButton
            imageSrc={src}
            projectUrl={projectUrls[i] || projectUrls[0] || "#"}
            className="h-full w-full"
          />
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
        className="h-10 w-10 rounded-full shrink-0"
      >
        <img className="w-full h-full object-cover rounded-full" src={indicator} alt="" />
      </motion.div>
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl font-serif text-[#1A0A14]"
      >
        {title}
      </motion.h3>
    </div>

    <div className="space-y-3 text-sm text-[#1A0A14]">
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
      <section id="work" className="bg-white border-b border-[#1A0A14]">
        {/* Mobile hero heading */}
        <div className="px-6 pt-16 pb-12">
          <motion.h1
            style={{ fontFamily: "Compacta" }}
            className="text-5xl leading-tight text-[#1A0A14] font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <AnimatedLetters text="Featured Work" delay={0} staggerDelay={0.055} rotateFrom={90} />
          </motion.h1>
          
          {/* Divider line */}
          <motion.div
            className="h-0.5 bg-gray-300 w-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            viewport={{ once: true }}
          />
        </div>

        {/* Project 1 — 1Earth Properties */}
        <div className="border-t border-gray-200 py-12">
          <div className="px-6">
            {/* Project number and title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p style={{ fontFamily: 'PPEditorialNew' }} className="text-xs uppercase tracking-widest text-gray-500 mb-3">Project 01</p>
              <h2 style={{ fontFamily: "Compacta" }} className="text-3xl font-bold text-[#1A0A14] mb-2">
                1Earth Properties
              </h2>
              <p className="text-sm text-gray-600">Modern Real Estate Platform</p>
            </motion.div>

            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6 overflow-hidden rounded-lg aspect-video bg-gray-100"
            >
              <ImageWithViewButton
                imageSrc={img1}
                projectUrl="https://oneearthproperties.co.in/"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4 mb-8"
            >
              <p className="text-sm leading-relaxed text-gray-700">
                1Earth Properties is designed as a modern real estate platform that brings clarity and elegance to property discovery. The experience is crafted to feel intuitive, allowing users to explore spaces with ease and confidence.
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                Every interaction is thoughtfully refined to create a seamless journey, combining smooth transitions and structured design to deliver a polished and engaging browsing experience.
              </p>
            </motion.div>

            {/* Secondary images */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-lg aspect-square bg-gray-100"
              >
                <ImageWithViewButton
                  imageSrc={img2}
                  projectUrl="https://oneearthproperties.co.in/"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-lg aspect-square bg-gray-100"
              >
                <ImageWithViewButton
                  imageSrc={img3}
                  projectUrl="https://oneearthproperties.co.in/"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://oneearthproperties.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 bg-[#1A0A14] text-white text-center font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Project
            </motion.a>
          </div>
        </div>

        {/* Project 2 — Auremont */}
        <div className="border-t border-gray-200 py-12">
          <div className="px-6">
            {/* Project number and title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p style={{ fontFamily: 'PPEditorialNew' }} className="text-xs uppercase tracking-widest text-gray-500 mb-3">Project 02</p>
              <h2 style={{ fontFamily: "Compacta" }} className="text-3xl font-bold text-[#1A0A14] mb-2">
                Auremont
              </h2>
              <p className="text-sm text-gray-600">Narrative-Driven Real Estate</p>
            </motion.div>

            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6 overflow-hidden rounded-lg aspect-video bg-gray-100"
            >
              <ImageWithViewButton
                imageSrc={img4}
                projectUrl="https://auremont.vercel.app/"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4 mb-8"
            >
              <p className="text-sm leading-relaxed text-gray-700">
                Auremont is shaped as a narrative-driven real estate platform, where each project is presented as a story rather than just a listing. It invites users to explore developments through a more immersive and meaningful perspective.
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                The experience focuses on highlighting the vision behind each property, blending storytelling with structured presentation to create a refined and engaging journey through the company's portfolio.
              </p>
            </motion.div>

            {/* Secondary image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
              className="mb-8 overflow-hidden rounded-lg aspect-video bg-gray-100"
            >
              <ImageWithViewButton
                imageSrc={img5}
                projectUrl="https://auremont.vercel.app/"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* CTA Button */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://auremont.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 bg-[#1A0A14] text-white text-center font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Project
            </motion.a>
          </div>
        </div>

        {/* Project 3 — Learnkins */}
        <div className="border-t border-gray-200 py-12">
          <div className="px-6">
            {/* Project number and title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p style={{ fontFamily: 'PPEditorialNew' }} className="text-xs uppercase tracking-widest text-gray-500 mb-3">Project 03</p>
              <h2 style={{ fontFamily: "Compacta" }} className="text-3xl font-bold text-[#1A0A14] mb-2">
                Learnkins
              </h2>
              <p className="text-sm text-gray-600">Interactive Learning Platform</p>
            </motion.div>

            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6 overflow-hidden rounded-lg aspect-video bg-gray-100"
            >
              <ImageWithViewButton
                imageSrc={img6}
                projectUrl="https://learnkins.com/"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4 mb-8"
            >
              <p className="text-sm leading-relaxed text-gray-700">
                Learnkins is an innovative learning platform designed for students to study through interactive games and engaging activities while maintaining detailed progress records and achievement tracking throughout their learning journey.
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                Features include comprehensive admin panel for educators, robust parental control system for guardians, detailed analytics, and all essential tools required for effective learning management and student engagement.
              </p>
            </motion.div>

            {/* Secondary images */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-lg aspect-square bg-gray-100"
              >
                <ImageWithViewButton
                  imageSrc={img7}
                  projectUrl="https://learnkins.com/"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-lg aspect-square bg-gray-100"
              >
                <ImageWithViewButton
                  imageSrc={img9}
                  projectUrl="https://learnkins.com/"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://learnkins.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 bg-[#1A0A14] text-white text-center font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Project
            </motion.a>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-12" />
      </section>
    );
  }

  // ── DESKTOP LAYOUT (original structure, enhanced animations) ───────────────
  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative h-screen border-b border-b-[#1A0A14] overflow-hidden bg-white"
    >
      <div
        ref={trackRef}
        className="relative flex h-full"
        style={{ width: `${PANEL_COUNT * 100}vw` }}
      >
        <article
          className="relative h-screen shrink-0 bg-white pl-10 flex items-center justify-between"
          style={{ width: "400vw" }}
        >
          <div className="bg-gray-500 z-10 opacity-70 ml-140 h-px w-full absolute" />

          <div className="flex justify-between gap-30 pl-10 items-center">

            {/* ── PANEL 1: "Featured Work" heading ── */}
            <div className="leading-50 w-lg">
              {/* Perspective wrapper for 3D letter rotation */}
              <div style={{ perspective: "800px" }}>
                <h1
                  style={{ fontFamily: "Compacta" }}
                  className="text-[10rem] text-[#1A0A14] font-extrabold"
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
                  className="text-[10rem] text-[#1A0A14] font-extrabold ml-35"
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
            <div className="flex-1 min-w-md mt-75 z-12 text-[#1A0A14]">
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
                <div className="h-140 w-lg overflow-hidden rounded-lg">
                  <ImageWithViewButton
                    imageSrc={img1}
                    projectUrl="https://oneearthproperties.co.in/"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pt-2">
                  <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Modern real estate platform interface with intuitive navigation</p>
                </div>
                <div className="overflow-hidden" style={{marginTop: '1.5rem'}}>
                  <motion.h2
                    className="font-sans text-gray-500 leading-relaxed"
                    initial={{ y: "100%", opacity: 0 }}
                    whileInView={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                   
                  </motion.h2>
                </div>
              </div>
              <div className="w-full h-full pl-10 pt-17">
                <div className="w-full h-1/2">
                  <div className="w-80 min-h-64 overflow-hidden rounded-lg">
                    <ImageWithViewButton
                      imageSrc={img2}
                      projectUrl="https://oneearthproperties.co.in/"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="pt-2">
                    <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Property discovery experience enhanced with smooth visual transitions</p>
                  </div>
                </div>
                <div className="w-full h-1/2">
                  <div className="w-80 min-h-64 overflow-hidden rounded-lg">
                    <ImageWithViewButton
                      imageSrc={img3}
                      projectUrl="https://oneearthproperties.co.in/"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="pt-2">
                    <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Detailed property showcase with comprehensive information layout design</p>
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
                  className="text-[#1A0A14] font-extrabold text-[13rem]"
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
                  className="text-[#d4607a] absolute z-10 text-[10rem] ml-40"
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
                <div className="flex-1 max-w-md z-12 text-[#1A0A14]">
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
                <div className="h-4/5 w-full overflow-hidden rounded-lg">
                  <ImageWithViewButton
                    imageSrc={img4}
                    projectUrl="https://auremont.vercel.app/"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pt-4">
                  <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Narrative-driven property presentation telling compelling development stories</p>
                </div>
              </div>
              <div className="h-full w-1/2 pt-17">
                <div className="h-5/6 w-full overflow-hidden rounded-lg">
                  <ImageWithViewButton
                    imageSrc={img5}
                    projectUrl="https://auremont.vercel.app/"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pt-4">
                  <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Immersive journey through architectural vision and project excellence</p>
                </div>
              </div>
            </div>

            {/* ── PANEL 3: INTERACTIVE / Design — layered heading ── */}
            <div className="h-170 w-5xl">
              <div className="h-3/7 relative w-full items-center flex" style={{ perspective: "800px" }}>
                {/* Bottom layer first */}
                <h1
                  style={{ fontFamily: "Compacta" }}
                  className="text-[#1A0A14] font-extrabold text-[13rem]"
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
                  className="text-[#d4607a] absolute z-10 text-[10rem] ml-40"
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
                <div className="flex-1 max-w-md z-12 text-[#1A0A14]">
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
                    Learnkins
                  </motion.h2>
                  <div className="space-y-4">
                    <BulletParagraph delay={0.2}>
                      Learnkins is an innovative learning platform designed for students to study
                      through interactive games and engaging activities while maintaining detailed
                      progress records and achievement tracking throughout their learning journey.
                    </BulletParagraph>
                    <BulletParagraph delay={0.4}>
                      Features include comprehensive admin panel for educators, robust parental control
                      system for guardians, detailed analytics, and all essential tools required for
                      effective learning management and student engagement.
                    </BulletParagraph>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Project 3 images ── */}
            <div className="w-5xl h-170 z-20 flex items-center">
              <div className="h-full w-4/7">
                <div className="h-105 w-full">
                  <div className="h-70 w-full overflow-hidden rounded-lg">
                    <ImageWithViewButton
                      imageSrc={img6}
                      projectUrl="https://learnkins.com/"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="w-full pt-3">
                    <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Game-based learning interface where students play and progress together</p>
                  </div>
                </div>
                <div className="w-full h-65">
                  <div className="h-50 w-5/8 ml-54 overflow-hidden rounded-lg">
                    <ImageWithViewButton
                      imageSrc={img9}
                      projectUrl="https://learnkins.com/"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="w-full ml-54 pt-3">
                    <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Admin panel dashboard with student progress tracking and analytics</p>
                  </div>
                </div>
              </div>
              <div className="h-full w-2/6 pt-60 ml-5">
                <div className="min-h-[150px] w-full overflow-hidden rounded-lg">
                  <ImageWithViewButton
                    imageSrc={img7}
                    projectUrl="https://learnkins.com/"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pt-4">
                  <p style={{ fontFamily: 'PPEditorialNew' }} className="text-sm text-[#1A0A14]">Parental control system for monitoring student learning and achievements</p>
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