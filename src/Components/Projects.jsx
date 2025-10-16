import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrubRevealText from '../Animation/ScrubRevealText';
import eIMIS_vid from '/eIMIS_demo.mp4';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsShowcase() {
  const rootRef = useRef(null);
  const auroraRef = useRef(null);
  const auroraTitleRef = useRef(null);
  const auroraMainRef = useRef(null);
  const auroraSmallRef = useRef(null);
  const auroraInfoRef = useRef(null);
  const auroraBorderRef = useRef(null);

  // Border configuration
  const borderConfig = {
    color: "#fef3c6 ", // amber
    thickness: 4,
    radius: '1rem',
    marginX: 20,
    marginY: 20,
    marginT: 110,
    glow: '0 0 25px 8px rgba(251,191,36,0.6)',
  };

  useEffect(() => {
    if (!rootRef.current) return;

    // Aurora timeline
    const auroraTl = gsap.timeline({
      scrollTrigger: {
        trigger: auroraRef.current,
        start: 'top top',
        end: '+=160%',
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
    });

    // Initial states
    gsap.set(auroraTitleRef.current, { y: 40, opacity: 0 });
    gsap.set(auroraMainRef.current, { clipPath: 'inset(100% 0 0 0)', willChange: 'clip-path' });
    gsap.set(auroraSmallRef.current, { clipPath: 'inset(100% 0 0 0)', willChange: 'clip-path' });
    gsap.set(auroraInfoRef.current, { y: 40, opacity: 0 });
    gsap.set(auroraBorderRef.current, { clipPath: 'inset(100% 100% 0 0)' });

    // Aurora content animations
    auroraTl.to(auroraTitleRef.current, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0);
    auroraTl.to(auroraMainRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power2.inOut' }, '<0.2');
    auroraTl.to(auroraSmallRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power2.inOut' }, '<0.15');
    auroraTl.to(auroraInfoRef.current, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, '<0.25');
    auroraTl.fromTo(auroraSmallRef.current, { scale: 0.98 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' }, '<0.1');

    // Border scroll-scrub animation
    gsap.to(auroraBorderRef.current, {
      clipPath: 'inset(0% 0% 0 0)',
      scrollTrigger: {
        trigger: auroraRef.current,
        start: 'top top+=50', // after ScrubRevealText
        end: '+=160%',
        scrub: true,
      },
      ease: 'none',
    });

    return () => {
      auroraTl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={rootRef} id='project' className="w-full min-h-screen overflow-hidden bg-black">
      <ScrubRevealText word1="PROJECTS" word2="" />

      <section ref={auroraRef} className="relative min-h-screen bg-black text-amber-100 flex items-center px-5">
        {/* Glowing border with shine */}
        <div
          ref={auroraBorderRef}
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: borderConfig.marginT,
            left: borderConfig.marginX,
            right: borderConfig.marginX,
            bottom: borderConfig.marginY,
            border: `${borderConfig.thickness}px solid ${borderConfig.color}`,
            borderRadius: borderConfig.radius,
            clipPath: 'inset(100% 100% 0 0)',
            boxShadow: borderConfig.glow,
          }}
        >
          
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
          <div className="relative">
            <div ref={auroraMainRef} className="main-image w-full h-auto rounded-2xl overflow-hidden bg-gray-900">
              <video
      src={eIMIS_vid}
      autoPlay
      loop
      muted
      
      className=" object-cover"
    />
              
            </div>
            <div
              ref={auroraSmallRef}
              className="small-image absolute -left-8 -bottom-10 w-50 h-32 rounded-xl overflow-hidden shadow-xl bg-gray-700"
            >
              <img
                src="/eIMIS.png"
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 ref={auroraTitleRef} className="project-title text-3xl md:text-5xl font-bold mb-4">
              eIMIS Login Page
            </h2>
            <div ref={auroraInfoRef} className="project-info text-gray-200/90 leading-relaxed text-xl">
              <p className="mb-4">
                The eIMIS login page, used by Redox Fusion Technologies for their online ERP system, is built with React
                for seamless functionality. Tailwind CSS provides a clean, responsive design, while GSAP adds smooth
                animations and interactive feedback, creating a modern and user-friendly login experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes shine {
            0% { transform: translateX(0) rotate(45deg); }
            100% { transform: translateX(150%) rotate(45deg); }
          }
        `}
      </style>
    </div>
  );
}
