import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger if not already registered globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates two words on load or on a ScrollTrigger event.
 *
 * @param {string} word1 - The first word (e.g., "ABOUT").
 * @param {string} word2 - The second word (e.g., "ME").
 * @param {React.RefObject<HTMLElement>} [trigger] - Ref to the element that triggers the animation.
 */
const Title = ({ word1, word2, trigger = null }) => {
  const creativeRefs = useRef([]);
  const designerRefs = useRef([]);
  const arrowRef = useRef(null); 
  const containerRef = useRef(null); // Ref for the H1 wrapper

  // Extract the DOM element from the Ref if provided
  const triggerElement = trigger?.current;

  useEffect(() => {
    if (!containerRef.current) return;

    const arrow = arrowRef.current;
    const container = containerRef.current;
    
    // --- 1. Set up timeline and ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: triggerElement
        ? {
            trigger: triggerElement,
            start: "bottom 90%", 
            end: "top 10%", 
            scrub: true, 
          }
        : {
            // Fallback for no trigger (e.g., load-in animation) - Scrubbing doesn't apply well here, so we keep the delay
            delay: 0.3,
          },
    });

    // --- 2. Arrow Hover Effects (Keeping this logic, assuming external elements)
    // NOTE: Hover effects are usually independent of a scrubbing timeline.
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
    // Note: Scrubbing requires the initial state to be defined in CSS/JSX 
    // and the final state in the GSAP .to() call.
    tl.to([...creativeRefs.current].reverse(), {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      // Duration is now a *timing within the timeline* not an *absolute time*
      duration: 0.6, 
      ease: "power3.out",
    }, 0);

    // Animate word2 simultaneously
    tl.to(designerRefs.current, {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    }, 0);

    // This block may target elements outside the component; it's retained as-is.
    tl.to(
      [".hero-based", ".hero-description", ".hero-collab", ".hero-boxes"],
      {
        opacity: 1,
        duration: 0.6,
        stagger: 0.25,
        ease: "power2.out",
      },
      "-=0.2"
    );

    // Cleanup function
    return () => {
      // Killing the timeline automatically cleans up the ScrollTrigger
      tl.kill(); 
      // Ensure element-based listeners are removed if arrow exists
      if (arrow && container) {
        container.removeEventListener("mouseenter", enter);
        container.removeEventListener("mouseleave", leave);
      }
    };
  }, [word1, word2, triggerElement]); 

  return (
    // The main container includes the title text
    <h2 
        ref={containerRef} // Attach ref to the main element
        className="flex flex-wrap justify-center text-[8rem] md:text-[11.5rem] font-bold uppercase overflow-hidden text-center mx-auto -top-20"
    >
      <div className="flex">
        {word1.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => (creativeRefs.current[i] = el)}
            // The initial state for the animation
            className="inline-block transform -translate-y-full opacity-0 text-amber-100 tracking-[-0.1em]"
          >
            {char}
          </span>
        ))}
      </div>

      <div className="flex ml-4 md:ml-8 mr-4">
        {word2.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => (designerRefs.current[i] = el)}
            // The initial state for the animation
            className="inline-block transform -translate-y-full opacity-0 text-amber-100 tracking-[-0.1em]"
          >
            {char}
          </span>
        ))}
      </div>
      
      {/* Placeholder for the arrow if it exists globally and needs a ref */}
      <div ref={arrowRef} style={{ display: 'none' }}></div> 
    </h2>
  );
};

export default Title;
