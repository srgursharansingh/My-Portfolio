import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import AnimatedLink from "../Animation/AnimatedLink";
import { GoArrowUpRight } from "react-icons/go";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import DecryptedText from "../Animation/DecryptedText";

gsap.registerPlugin(ScrollToPlugin);

const Header = () => {
  const headerRef = useRef(null);
  const nameRef = useRef(null);
  const navLinksRef = useRef([]);
  const contactRef = useRef(null);
  const textRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3, defaults: { ease: "power3.out" } });

    // Animate the header dropping down
    tl.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
    })

      // Animate the name (GURSHARAN SINGH)
      .from(
        nameRef.current.children,
        {
          x: -40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.5,
        },
        "-=0.3"
      )

      // Animate each nav link
      .from(
        navLinksRef.current,
        {
          y: 20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.5,
        },
        "-=0.4"
      )

      // Animate the contact text + arrow
      .from(
        contactRef.current,
        {
          x: 40,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.3"
      );
  }, []);

  useEffect(() => {
    const container = contactRef.current;
    const text = textRef.current;
    const arrow = arrowRef.current;

    gsap.set(arrow, { rotate: 0 });

    const enter = () => {
      gsap.to(text, { scale: 1.05, duration: 0.2, ease: "power3.out" });
      gsap.to(arrow, { rotate: 45, duration: 0.3, ease: "power3.out" });
    };

    const leave = () => {
      gsap.to(text, { scale: 1, duration: 0.2, ease: "power3.out" });
      gsap.to(arrow, { rotate: 0, duration: 0.3, ease: "power3.out" });
    };

    container.addEventListener("mouseenter", enter);
    container.addEventListener("mouseleave", leave);

    return () => {
      container.removeEventListener("mouseenter", enter);
      container.removeEventListener("mouseleave", leave);
    };
  }, []);

  const handleClick = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: footer, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  return (
    <div
      ref={headerRef}
      className="text-black bg-amber-100 w-screen grid grid-cols-3 fixed top-0 left-0 z-100 py-2"
    >
      {/* Left: Name */}
      <div ref={nameRef} className="text-2xl font-extrabold text-left flex flex-col my-4 ml-6">
         <DecryptedText
           text="GURSHARAN"
          animateOn="hover"
          revealDirection="left"
          speed={100}
           maxIterations={10}
              characters="ABCD1234!?"
              className="revealed"
              parentClassName="all-letters"
              encryptedClassName="encrypted"
           />
        <div className="mt-[-10px]">
         <DecryptedText
           text="SINGH"
          animateOn="hover"
          revealDirection="left"
          speed={100}
           maxIterations={10}
              characters="ABCD1234!?"
              className="revealed"
              parentClassName="all-letters"
              encryptedClassName="encrypted"
           />
           </div>
      </div>

      {/* Center: Navigation */}
      <nav className="flex justify-center relative text-center m-auto">
        <ul className="flex justify-center relative text-center m-auto">
          {["HOME", "ABOUT", "PROJECT"].map((text, i) => (
            <li
              key={i}
              className="mx-3"
              ref={(el) => (navLinksRef.current[i] = el)}
            >
              <AnimatedLink text={text} targetId={text.toLowerCase()} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Right: Contact */}
      <div
        ref={contactRef}
        onClick={handleClick}
        className="text-xl font-bold flex flex-col justify-end my-auto mr-4 cursor-pointer items-end"
      >
        <div className="inline-flex items-center gap-2 relative">
          <span ref={textRef} className="text-2xl font-extrabold text-black">
            CONTACT ME
          </span>
          <GoArrowUpRight ref={arrowRef} className="text-black stroke-1" size={29} />
        </div>
      </div>
    </div>
  );
};

export default Header;
