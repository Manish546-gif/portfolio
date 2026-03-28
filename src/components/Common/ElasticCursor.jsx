

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

// Gsap Ticker Function
function useTicker(callback, paused) {
  useEffect(() => {
    if (!paused && callback) {
      gsap.ticker.add(callback);
    }
    return () => {
      gsap.ticker.remove(callback);
    };
  }, [callback, paused]);
}

const EMPTY = {};
function useInstance(value = {}) {
  const ref = useRef(EMPTY);
  if (ref.current === EMPTY) {
    ref.current = typeof value === "function" ? value() : value;
  }
  return ref.current;
}

// Function for Mouse Move Scale Change
function getScale(diffX, diffY) {
  const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  return Math.min(distance / 735, 0.35);
}

// Function For Mouse Movement Angle in Degrees
function getAngle(diffX, diffY) {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI;
}

function getRekt(el) {
  if (el.classList.contains("cursor-can-hover"))
    return el.getBoundingClientRect();
  else if (el.parentElement?.classList.contains("cursor-can-hover"))
    return el.parentElement.getBoundingClientRect();
  else if (
    el.parentElement?.parentElement?.classList.contains("cursor-can-hover")
  )
    return el.parentElement.parentElement.getBoundingClientRect();
  return null;
}

const CURSOR_DIAMETER = 36;

function ElasticCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // React Refs for Jelly Blob and Text
  const jellyRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Save pos and velocity Objects
  const pos = useInstance(() => ({ x: 0, y: 0 }));
  const vel = useInstance(() => ({ x: 0, y: 0 }));
  const set = useInstance();

  // Set GSAP quick setter Values on useLayoutEffect Update
  useLayoutEffect(() => {
    set.x = gsap.quickSetter(jellyRef.current, "x", "px");
    set.y = gsap.quickSetter(jellyRef.current, "y", "px");
    set.r = gsap.quickSetter(jellyRef.current, "rotate", "deg");
    set.sx = gsap.quickSetter(jellyRef.current, "scaleX");
    set.sy = gsap.quickSetter(jellyRef.current, "scaleY");
    set.width = gsap.quickSetter(jellyRef.current, "width", "px");
    set.height = gsap.quickSetter(jellyRef.current, "height", "px");
    set.opacity = gsap.quickSetter([jellyRef.current, dotRef.current], "opacity");
  }, []);

  // Start Animation loop
  const loop = useCallback(() => {
    if (!set.width || !set.sx || !set.sy || !set.r) return;
    // Calculate angle and scale based on velocity
    var rotation = getAngle(+vel.x, +vel.y); // Mouse Move Angle
    var scale = getScale(+vel.x, +vel.y); // Blob Squeeze Amount

    // Set GSAP quick setter Values on Loop Function
    if (!isHovering) {
      set.x(pos.x);
      set.y(pos.y);
      set.width(50 + scale * 300);
      set.r(rotation);
      set.sx(1 + scale);
      set.sy(1 - scale * 2);
    } else {
      set.r(0);
    }

    if (isHidden) {
      set.opacity?.(0);
    } else {
      set.opacity?.(1);
    }
  }, [isHovering, isHidden, pos.x, pos.y, set, vel.x, vel.y]);

  const [cursorMoved, setCursorMoved] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Run on Mouse Move
  useLayoutEffect(() => {
    if (isMobile) return;
    // Caluclate Everything Function
    const setFromEvent = (e) => {
      if (!jellyRef.current) return;
      if (!cursorMoved) {
        setCursorMoved(true);
      }
      if (!(e.target instanceof HTMLElement)) return;
      const el = e.target;
      const hoverElemRect = getRekt(el);
      if (hoverElemRect) {
        const rect = el.getBoundingClientRect();
        setIsHovering(true);
        gsap.to(jellyRef.current, {
          rotate: 0,
          duration: 0,
        });
        gsap.to(jellyRef.current, {
          width: el.offsetWidth + 20,
          height: el.offsetHeight + 20,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          borderRadius: 10,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
        });

        // return;
      } else {
        gsap.to(jellyRef.current, {
          borderRadius: 50,
          width: CURSOR_DIAMETER,
          height: CURSOR_DIAMETER,
        });
        setIsHovering(false);
      }

      // Check for hide flag
      const shouldHide = !!el.closest('[data-no-custom-cursor="true"]');
      setIsHidden(shouldHide);

      // Update body cursor style to ensure default cursor shows up when custom is hidden
      if (shouldHide) {
        document.body.style.cursor = 'auto';
      } else {
        document.body.style.cursor = 'none';
      }

      // Mouse X and Y
      const x = e.clientX;
      const y = e.clientY;
      setMousePos({ x, y });

      // Animate Position and calculate Velocity with GSAP
      gsap.to(pos, {
        x: x,
        y: y,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        onUpdate: () => {
          vel.x = (x - pos.x) * 1.2;
          vel.y = (y - pos.y) * 1.2;
        },
      });

      loop();
    };

    window.addEventListener("mousemove", setFromEvent);
    return () => {
      window.removeEventListener("mousemove", setFromEvent);
      document.body.style.cursor = "";
    };
  }, [cursorMoved, isMobile, loop, pos, vel]);

  useTicker(loop, !cursorMoved || isMobile);

  useEffect(() => {
    if (isMobile) {
      document.body.style.cursor = '';
      return;
    }

    if (isHidden) {
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.cursor = 'none';
    }

    return () => {
      document.body.style.cursor = '';
    };
  }, [isHidden, isMobile]);

  if (isMobile) return null;

  // Return UI
  return (
    <>
      <div
        ref={jellyRef}
        id={"jelly-id"}
        className="jelly-blob fixed left-0 top-0 pointer-events-none"
        style={{
          width: CURSOR_DIAMETER,
          height: CURSOR_DIAMETER,
          border: "1.5px solid rgba(255, 255, 255, 0.95)",
          backgroundColor: "transparent",
          borderRadius: "9999px",
          transform: "translate(-50%, -50%)",
          willChange: "transform",
          mixBlendMode: "difference",
          zIndex: 100,
        }}
      ></div>
      <div
        ref={dotRef}
        className="fixed pointer-events-none"
        style={{
          width: 10,
          height: 10,
          backgroundColor: "#ffffff",
          borderRadius: "9999px",
          transform: "translate(-50%, -50%)",
          top: mousePos.y,
          left: mousePos.x,
          mixBlendMode: "difference",
          zIndex: 101,
        }}
      ></div>
    </>
  );
}

export default ElasticCursor;