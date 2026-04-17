import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedPlus() {
  const wrapperRef = useRef(null);
  const hBarRef = useRef(null);
  const vBarRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const hBar = hBarRef.current;
    const vBar = vBarRef.current;

    const tl = gsap.timeline({ repeat: -1, yoyo: false });

    tl
      .fromTo(
        wrapper,
        { scale: 0, rotation: -90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" }
      )
      .to(wrapper, { rotation: 45, duration: 0.5, ease: "power2.inOut" }, "+=0.3")
      .to(wrapper, { rotation: 90, duration: 0.5, ease: "power2.inOut" }, "+=0.2")
      .to([hBar, vBar], { scaleX: 1.3, duration: 0.25, ease: "power1.out", stagger: 0.05 }, "-=0.1")
      .to([hBar, vBar], { scaleX: 1, duration: 0.25, ease: "power1.in", stagger: 0.05 })
      .to(wrapper, { rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }, "+=0.2")
      .to(wrapper, { scale: 1.2, duration: 0.2, ease: "power2.out" })
      .to(wrapper, { scale: 1, duration: 0.3, ease: "bounce.out" })
      .to(hBar, { scaleY: 0, duration: 0.3, ease: "power2.in" }, "+=0.3")
      .to(vBar, { scaleX: 0, duration: 0.3, ease: "power2.in" }, "-=0.2")
      .to([hBar, vBar], { scaleY: 1, scaleX: 1, duration: 0 })
      .to(wrapper, { opacity: 0, scale: 0, duration: 0.4, ease: "power2.in" })
      .to(wrapper, { opacity: 1, scale: 1, rotation: 0, duration: 0 })
      .to(wrapper, { duration: 0.5 });

    return () => tl.kill();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        background: "#fff",
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          width: "120px",
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Horizontal bar */}
        <div
          ref={hBarRef}
          style={{
            position: "absolute",
            width: "120px",
            height: "2px",
            background: "#1A0A14",
            borderRadius: "4px",
          }}
        />
        {/* Vertical bar */}
        <div
          ref={vBarRef}
          style={{
            position: "absolute",
            width: "2px",
            height: "120px",
            background: "#1A0A14",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
}