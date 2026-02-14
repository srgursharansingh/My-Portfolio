import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import ScrubRevealText from '../Animation/ScrubRevealText';

// Assuming these imports point to your components/logic:
import './About.scss'; 
import useTitleAnimation from '../Animation/useTitleAnimation'; // Custom hook for global setup
import Title from '../Animation/TitleAnimation'; // The Title component that accepts the trigger prop

gsap.registerPlugin(ScrollTrigger);

// Utility function (kept for reference, though not directly used in useEffect)
const smoothScrollToId = (id) => {
  const scroller =
    window.innerWidth < 1100
      ? document.querySelector('.scroll-container')
      : window;

  const target = document.getElementById(id);
  if (!target) return;

  const headerEl = document.querySelector('.header');
  const offsetY = headerEl ? headerEl.offsetHeight : 0;

  gsap.to(scroller, {
    duration: 0.8,
    ease: 'power3.out',
    scrollTo: { y: target, offsetY, autoKill: true },
    overwrite: 'auto',
  });
};

const About = () => {
  // Refs must be defined inside the component
  let wrapperRef = useRef(null); // Ref for the inner content wrapper (NEW PIN TARGET)
  const sectionRef = useRef(null); // Ref for the main <section> (Title Trigger)
  useTitleAnimation(); // Assuming this runs some global setup if needed

  useEffect(() => {
    // 1. Scroller Setup
    const scrollContainer = document.querySelector(".scroll-container");
    // Use the custom scroller if screen is small AND the container element exists
    const scroller = window.innerWidth < 1100 && scrollContainer ? scrollContainer : null;
    
    // Get the DOM elements from the Refs
    const wrapperElement = wrapperRef.current; // THE NEW PIN TARGET
    const sectionElement = sectionRef.current; // Used only for Title trigger
    
    // Guard clause: Exit if the main elements are not yet mounted
    if (!wrapperElement || !sectionElement) return;

    // Set up scroller proxy for custom scrolling containers
    if (scroller) {
      ScrollTrigger.scrollerProxy(scroller, {
        scrollTop(value) {
          return arguments.length ? (scroller.scrollTop = value) : scroller.scrollTop;
        },
        // Must return the viewport size for correct ScrollTrigger calculations
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
      });
    }

    // --- ENHANCED ANIMATION LOGIC ---
    
    // The previous pinTrigger (A) is REMOVED.
    // The pinning now happens directly on the content timeline trigger (B).

    // B. Animation Timeline for Content Reveal while pinning the content wrapper
    const contentTL = gsap.timeline({
        scrollTrigger: {
            trigger: wrapperElement, // PIN TARGET: The inner content wrapper
            start: 'top top', 
            end: '+=100%', // Increased pin duration for a longer "stuck" effect
            scrub: 1, // Smoothly link animation to scroll progress
            pin: true, // PINNING the wrapper element here
            scroller: scroller || window,
           
        }
    });

    // 1. Initial Content Reveal (Top Text/Image)
    contentTL.to('.about-second__top>h4>span', {
      y: 0, // Reveal the "about me" heading
    }, 0) 

    .to('.text-first__img>img', {
      y: 0, // Remove translate
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', // Reveal the image
      scale: 1, // Reset scale
    }, 0) 

    const firstLines = gsap.utils.toArray('.text-first__text-wrapper > span');
    contentTL.to(firstLines.reverse(), {
      y: 0,
      rotate: 0,
      stagger: 0.1,
      ease: 'power2.out',
    }, 0.2) // Staggered reveal of "Hello! I'm Olha..."

    // 2. Introduce the Second Block (My Experience)
    // Delayed animation to happen later in the pinned scroll
    contentTL.to('.text-second h3', {
      opacity: 1,
      y: 0,
    }, 0.5) // Start later in the timeline (around 40% scroll)

    const secondLines = gsap.utils.toArray('.text-second__text-wrapper > span');

    contentTL.to(secondLines.reverse(), {
      y: 0,
      rotate: 0,
      stagger: 0.1,
      opacity: 1,
      ease: 'power2.out',
    }, 0.9) // Staggered reveal of experience lines

    // C. Mobile-specific animation
    if (window.innerWidth < 1100) {
      contentTL.to('.about-mobile-text', {
        opacity: 1,
      }, 1.6); // Reveal mobile text late in the pinned scroll
    }
    
    // --- End of Enhanced Animation Logic ---

    ScrollTrigger.refresh();
    
    // Cleanup function: kill all ScrollTriggers on unmount
    return () => {
      if (scroller) {
        ScrollTrigger.scrollerProxy(scroller, null);
      }
      // Only need to kill the main content timeline/pin trigger
      contentTL.scrollTrigger.kill(); 
      // We will rely on the Title component's internal cleanup for its trigger
    };
  }, []); 

  return (
    <>
      <section  className='about'  id='about'>
        <ScrubRevealText word1='ABOUT' word2='ME'/>
        
        <div
          className='about__wrapper'
          ref={wrapperRef}> {/* THIS ELEMENT IS NOW PINNED */}
          <div className='container'>
            <div className='about-second__wrapper'>
              <div className='about-second__top'>
                <h4>
                  {/* INITIAL STATE: Moved down */}
                  <span style={{ transform: 'translateY(100%)', display: 'block' }}>about me</span> 
                </h4>
                <div className='flex'>
                <div className='about-second-text text-first'>
                  <div className='text-first__img'>
                    <img
                      src='./img/olha3.jpg'
                      alt='Gursharan Singh'
                      // INITIAL STATE: Scaled up, Y-translated, and clipped
                      style={{ transform: 'scale(1.2) translateY(50px)', clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }} 
                    />
                  </div>
                  <p className='text-first__text'>
                    <span className='text-first__text-wrapper' style={{ display: 'block', overflow: 'hidden' }}>
                      {/* INITIAL STATE: Moved down and slightly rotated */}
                      <span style={{ display: 'block', transform: 'translateY(100%) rotate(5deg)' }}>Hello!</span> 
                    </span>
                    <span className='text-first__text-wrapper' style={{ display: 'block', overflow: 'hidden' }}>
                      <span style={{ display: 'block', transform: 'translateY(100%) rotate(5deg)' }}>I’m Gursharan Singh</span>
                    </span>
                  </p>
                </div>

                <div className=' text-second left-0' ref={sectionRef} >
                  <h3 style={{ opacity: 0, transform: 'translateY(20px)' }}>
                    my experience
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='21'
                      height='21'
                      viewBox='0 0 21 21'
                      fill='none'>
                      <path
                        d='M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104'
                        stroke='#aaaaaa'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </h3>
                  <div className='text-second__text '>
                    {window.innerWidth > 1100 ? (
                      <>
                        <span className='text-second__text-wrapper' style={{ display: 'block', overflow: 'hidden' }}>
                          <span style={{ display: 'block', transform: 'translateY(100%) rotate(5deg)',opacity: 0 }}>I am currently a 2nd-year CSE student interning at Redox Fusion Technologies,</span>
                        </span>
                        <span className='text-second__text-wrapper' style={{ display: 'block', overflow: 'hidden' }}>
                          <span style={{ display: 'block', transform: 'translateY(100%) rotate(5deg)' ,opacity: 0 }}>where I work across software development, web development, and app development.</span>
                        </span>
                        <span className='text-second__text-wrapper' style={{ display: 'block', overflow: 'hidden' }}>
                          <span style={{ display: 'block', transform: 'translateY(100%) rotate(5deg)' ,opacity: 0 }}>I also contribute to the service segment, gaining hands-on experience in full-stack solutions and real-world project workflows.</span>
                        </span>
                      </>
                    ) : (
                      <p className='about-mobile-text' style={{ opacity: 0 }}>
                        I am currently a 2nd-year CSE student interning at Redox Fusion Technologies, where I work across software development, web development, and app development. I also contribute to the service segment, gaining hands-on experience in full-stack solutions and real-world project workflows.                           </p>
                    )}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
