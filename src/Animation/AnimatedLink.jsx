import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const AnimatedText = ({ text, className = "", targetId }) => {
  const textRef = useRef(null);
  const leftBracket = useRef(null);
  const rightBracket = useRef(null);

  useEffect(() => {
    const el = textRef.current.parentElement;
    const topSpans = textRef.current.querySelectorAll(".original span");
    const bottomSpans = textRef.current.querySelectorAll(".clone span");

    gsap.set(bottomSpans, { yPercent: 100 });

    const isLargeScreen = () => window.innerWidth > 1100;

    const enter = () => {
      if (!isLargeScreen()) return;
      gsap.to(topSpans, { yPercent: -100, stagger: 0.02, duration: 0.5 });
      gsap.to(bottomSpans, { yPercent: 0, stagger: 0.02, duration: 0.5 });
      gsap.to(leftBracket.current, { x: -15, duration: 0.3, ease: "power3.out" });
      gsap.to(rightBracket.current, { x: 15, duration: 0.3, ease: "power3.out" });
    };

    const leave = () => {
      if (!isLargeScreen()) return;
      gsap.to(topSpans, { yPercent: 0, stagger: 0.02, duration: 0.5 });
      gsap.to(bottomSpans, { yPercent: 100, stagger: 0.02, duration: 0.5 });
      gsap.to(leftBracket.current, { x: 0, duration: 0.3, ease: "power3.out" });
      gsap.to(rightBracket.current, { x: 0, duration: 0.3, ease: "power3.out" });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  // 👉 Smooth scroll on click
  const handleClick = () => {
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (target) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  const letters = text.split("");

  return (
    <span
      onClick={handleClick}
      className={`relative inline-flex items-center cursor-pointer font-bold text-xl select-none ${className}`}
    >
      <span ref={leftBracket} className="text-current inline-block ml-1">
        [
      </span>

      {/* Animated Text */}
      <span ref={textRef} className="inline-block relative mx-1 overflow-hidden">
        <span className="original inline-block whitespace-nowrap">
          {letters.map((c, i) => (
            <span key={`t-${i}`} className="inline-block">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </span>
        <span
          className="clone absolute top-0 left-0 inline-block whitespace-nowrap pointer-events-none"
          aria-hidden="true"
        >
          {letters.map((c, i) => (
            <span key={`b-${i}`} className="inline-block">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </span>
      </span>

      <span ref={rightBracket} className="text-current inline-block mr-1">
        ]
      </span>
    </span>
  );
};

export default AnimatedText;
