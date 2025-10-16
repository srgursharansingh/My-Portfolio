import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger if not already registered globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates two words on scroll using GSAP ScrollTrigger with scrubbing.
 *
 * @param {string} word1 - The first word (e.g., "CREATIVE").
 * @param {string} word2 - The second word (e.g., "DEVELOPER").
 */
const ScrubRevealText = ({ word1 = "CREATIVE", word2 = "DEVELOPER" }) => {
  const creativeRefs = useRef([]);
  const developerRefs = useRef([]); // Renamed from designerRefs for clarity
  const arrowRef = useRef(null); 
  const containerRef = useRef(null); // Ref for the H1 wrapper

  useEffect(() => {
    if (!containerRef.current) return;

    const arrow = arrowRef.current;
    const container = containerRef.current;
    
    // --- 1. Set up timeline and ScrollTrigger (with scrubbing)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        // Start when the center of the trigger hits 80% down the viewport
        start: "center 80%", 
        // End when the center of the trigger hits 20% down the viewport
        end: "center 20%",
        scrub: true, // Link the timeline progress to scroll position
        // markers: true, // Uncomment for debugging the trigger points
      },
    });

    // --- 2. Arrow Hover Effects (Retained for component completeness)
    let enter, leave;
    if (arrow) {
        gsap.set(arrow, { rotate: 90 });
        enter = () => {
          gsap.to(arrow, { rotate: 135, duration: 0.3, ease: "power3.out" });
        };
        leave = () => {
          gsap.to(arrow, { rotate: 90, duration: 0.3, ease: "power3.out" });
        };

        container.addEventListener("mouseenter", enter);
        container.addEventListener("mouseleave", leave);
    }

    // --- 3. Animation Logic

    // Animate word1 (right to left — reversed)
    // Moves from y: -100% (initial state in JSX) to y: 0 (final state)
    tl.to([...creativeRefs.current].reverse(), {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.6, // Duration is now a proportion of the scroll distance
      ease: "power3.out",
    }, 0); // The 0 positions this animation at the start of the timeline

    // Animate word2 simultaneously
    tl.to(developerRefs.current, {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    }, 0); // The 0 positions this animation at the start of the timeline

    // NOTE: External selectors like ".hero-based" have been removed
    // to keep the component isolated and reusable.

    // Cleanup function
    return () => {
      tl.kill(); 
      if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
      }
      if (arrow && container) {
        container.removeEventListener("mouseenter", enter);
        container.removeEventListener("mouseleave", leave);
      }
    };
  }, [word1, word2]);

  return (
    // The main container includes the title text
    <h1 
        ref={containerRef} // Attach ref to the main element
        // Added a minimum height to ensure a large-enough trigger area
        className="flex flex-wrap justify-center text-[8rem] md:text-[11.5rem] font-bold uppercase overflow-hidden text-center mx-auto my-auto  h-auto" 
    >
      <div className="flex">
        {word1.split("").map((char, i) => (
          <span
            key={`word1-${i}`}
            ref={(el) => (creativeRefs.current[i] = el)}
            // Initial state set here in JSX/Tailwind
            className="inline-block transform -translate-y-full opacity-0 text-amber-100 tracking-[-0.1em]"
          >
            {char}
          </span>
        ))}
      </div>

      <div className="flex ml-4 md:ml-8 mr-4">
        {word2.split("").map((char, i) => (
          <span
            key={`word2-${i}`}
            ref={(el) => (developerRefs.current[i] = el)}
            // Initial state set here in JSX/Tailwind
            className="inline-block transform -translate-y-full opacity-0 text-amber-100 tracking-[-0.1em]"
          >
            {char}
          </span>
        ))}
      </div>
      
      {/* Placeholder for the arrow if it exists globally and needs a ref */}
      <div ref={arrowRef} style={{ display: 'none' }}></div> 
    </h1>
  );
};

export default ScrubRevealText;