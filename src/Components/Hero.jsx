import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import DecryptedText from "../Animation/DecryptedText";
import { GoArrowUpRight } from "react-icons/go";

// Assuming PixelBlastBg.jsx is your wrapper component for the shader logic
import PixelBlast from "../Animation/PixelBlastBg"; 

const Hero = () => {
  const creativeRefs = useRef([]);
  const designerRefs = useRef([]);
  const arrowRef = useRef(null);
  const containerRef = useRef(null);
  


  useEffect(() => {
    const arrow = arrowRef.current;
    const container = containerRef.current;

    const tl = gsap.timeline({ delay: 0.3 });

    // Set initial arrow state
    gsap.set(arrow, { rotate: 90 });

    // --- Hover Animation for the Email Link ---
    const enter = () => {
      gsap.to(arrow, { rotate: 135, duration: 0.3, ease: "power3.out" });
    };

    const leave = () => {
      gsap.to(arrow, { rotate: 90, duration: 0.3, ease: "power3.out" });
    };

    if (container) {
      container.addEventListener("mouseenter", enter);
      container.addEventListener("mouseleave", leave);
    }

    // --- GSAP Intro Timeline ---
    
    // Animate CREATIVE (right to left — reversed)
    tl.to([...creativeRefs.current].reverse(), {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    }, 0);

    // Animate DEVELOPER simultaneously
    tl.to(designerRefs.current, {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    }, 0);

    // Reveal the lower section (based, description, boxes, etc.)
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

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", enter);
        container.removeEventListener("mouseleave", leave);
      }
    };
  }, []);

  return (
    // PARENT: Set 'relative' and 'overflow-hidden' for background containment
    <section 
      id="home" 
      className="relative flex flex-col min-h-screen w-full bg-[#00000033]  top-20 text-white overflow-hidden pt-20 pb-10"
    >
      
     
      <PixelBlast 
        className="absolute flex top-0 left-0 w-full h-full opacity-55"
        pixelSize={8}   color="#fef3c6"    patternScale={3}       pixelSizeJitter={0.2}     speed={0.3}   noiseAmount={0} patternDensity={1.0} liquid={false}
      />

      {/* CREATIVE DEVELOPER Heading */}
      {/* z-10 ensures content is OVER the background */}
      <div className="absolute top-0 left-0 w-full h-full bg-transparent">
      <h1 className="flex flex-wrap justify-center text-[8rem] md:text-[11.5rem] font-bold uppercase overflow-hidden text-center mx-auto relative z-10">
        <div className="flex">
          {"CREATIVE".split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => (creativeRefs.current[i] = el)}
              className="inline-block transform -translate-y-full opacity-0 text-amber-100 tracking-[-0.1em]"
            >
              {char}
            </span>
          ))}
        </div>

        <div className="flex ml-4 md:ml-8 mr-4">
          {"DEVELOPER".split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => (designerRefs.current[i] = el)}
              className="inline-block transform -translate-y-full opacity-0 text-amber-100 tracking-[-0.1em]"
            >
              {char}
            </span>
          ))}
        </div>
      </h1>

      <div className="flex flex-col items-end mr-12 relative z-10">
        <div className="hero-based flex gap-4 -mt-8 opacity-0">
          {["based", "in", "india"].map((t, i) => (
            <span
              key={i}
              className="font-bold uppercase tracking-[0.8em] text-sm md:text-lg"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* PROFILE IMAGE & SKILLS BOXES */}
      <div className="hero-boxes flex flex-col md:flex-row items-center justify-center -mt-14 opacity-0 relative">
         <div className="bg-zinc-900 px-8 pt-38 pb-6 rounded-sm shadow-lg max-w-xs text-left bottom-0 mt-auto">
          
          <p className="text-gray-300 text-2xl font-semibold mt-auto">
            /UI/UX  <br/>
            /WEB DEVELOPER <br/>
            /APP DEVELOPER <br/>
            /SOFTWARE DEVELOPER 
          </p>
        </div>        
        <div className="w-88 h-88 md:w-76 md:h-96 bg-zinc-900 rounded-sm overflow-hidden shadow-lg flex items-center justify-center">
          <img
            src="/your-image.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="hero-description text-center uppercase font-light text-gray-200 w-[28rem] mt-6 opacity-0 mx-auto relative z-10">
        
        <DecryptedText
          text="im a creative developer crafting immersive digital experiences."
          animateOn="view"
          revealDirection="center"
          speed={100}
          maxIterations={10}
          characters="ABCD1234!?"
          className="revealed"
          parentClassName="all-letters"
          encryptedClassName="encrypted"
        />
      </p>

      {/* COLLABORATION/EMAIL LINK */}
      <a
        ref={containerRef}
        href="mailto:sr.gursharansingh@gmail.com"
        // Restored original classes: opacity-0 for GSAP, relative z-10 for stacking
        className="hero-collab mt-8 text-center opacity-0 transition-all duration-500  ml-auto flex flex-col z-10"
      >
        <span className=" font-light uppercase mb-2 text-lg flex items-center align-middle mx-auto" >
          Available for Collaboration
          <GoArrowUpRight ref={arrowRef} className="text-white stroke-0 justify-center my-auto ml-0.5" size={23} />
        </span>
        
        <span className="relative font-semibold text-2xl lowercase after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-auto after:transition-all after:duration-700">
          sr.gursharansingh@gmail.com
        </span>
      </a>
      </div>
    </section>
  );
};

export default Hero;