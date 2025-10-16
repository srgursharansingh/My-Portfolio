import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useLocation, useNavigate } from 'react-router-dom';
 import AnimatedLink from '../Animation/AnimatedLink'; // Re-integrate if needed
// import { useCopy } from '../Animation/CopyContext'; // Re-integrate if needed
// import './Footer.scss'; // Ensure your custom line animation CSS is here

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Helper component for the social link (Requires custom CSS for the line effect)
const SocialLink = ({ href, text }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='link-line relative w-max font-mono font-normal text-xl lg:text-3xl uppercase mr-8 xl:mr-28 pb-0.5' 
  >
    {text}
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='21'
      height='21'
      viewBox='0 0 21 21'
      fill='none'
      className='inline-block ml-2 w-4 h-4 lg:w-5 lg:h-5'
    >
      <path
        d='M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104'
        stroke='#101010'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  </a>
);

const NAME_CHARS = "GURSHARAN SINGH".split('');

const Footer = () => {
  // const copyContext = useCopy();
  // const copy = copyContext?.copy || (() => {});
  const location = useLocation();
  const navigate = useNavigate();
  const footerRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
     copy('olha.lazarieva.0304@gmail.com', e);
    console.log('Email clicked - should copy to clipboard!');
  };

  // Re-integrate your smoothScrollToId and handleAnchor functions here if needed
  
  useEffect(() => {
    if (!footerRef.current) return;
    
    // NOTE: Replace '.page-container' with the class/ID of your main scrolling element,
    // which MUST have an initial black background.
    const pageContainer = document.querySelector('.page-container') || document.body;

    // --- 1. BACKGROUND COLOR TRANSITION (Black to Light) ---
    gsap.to(pageContainer, {
        backgroundColor: '#f8f8f8', // Using a light grey/off-white color
        ease: 'none',
        scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',    // Start when the footer enters the viewport
            end: 'top center',      // Finish when the footer reaches the center
            scrub: 1,               // Smoothly link the color change to the scroll
        },
    });
    
    // --- 2. TITLE REVEAL ANIMATION (OLHA LAZARIEVA) ---
    const nameSpans = footerRef.current.querySelectorAll('.footer-title-char');
    gsap.fromTo(
      nameSpans,
      { yPercent: 150 }, 
      {
        yPercent: 0, 
        ease: 'power2.out',
        stagger: { each: 0.03, from: 'center' },
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%', // Start animation when footer hits 80% of viewport
          end: 'bottom bottom',
          scrub: 2, 
          // scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
        },
      }
    );

    // --- 3. OPACITY FADE-IN ANIMATION (Copyright/Reserved Text) ---
    const reservedText = footerRef.current.querySelector('.footer-reserved');
    gsap.fromTo(reservedText,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        delay: 0.8,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          // scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
        },
      }
    );

    // Cleanup function for ScrollTrigger and GSAP on unmount
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };

  }, []);

  return (
    <footer
      ref={footerRef}
      className='bg-amber-100 text-black pt-18 pb-10 xl:pt-38 xl:pb-5' // Footer itself is light bg
      id='footer'
    >
      <div className='container mx-auto px-4'>
        <div className='flex flex-col'> 
          
          {/* PHONE & EMAIL */}
          <div className='flex flex-col items-end md:order-none order-2'>
            <a
              href='tel:+8076586299'
              className='footer-line-animation font-extrabold text-4xl sm:text-5xl lg:text-7xl lowercase tracking-wider mb-2 lg:mb-4 w-max ml-auto'
            >
          +91 80765 86299
            </a>
            <a
              href='mailto:sr.gursharansingh@gmail.com'
              className='footer-line-animation font-extrabold text-3xl sm:text-4xl lg:text-7xl lowercase tracking-wider mb-8 sm:mb-12 w-max ml-auto'
              onClick={handleClick}
            >
             sr.gursharansingh@gmail.com
            </a>
          </div>
          
          {/* SOCIAL LINKS */}
          <div className='flex justify-end mt-10 md:mt-16 mb-12 md:order-none order-4 md:flex-row flex-col items-center'>
            <SocialLink href='https://www.instagram.com/...' text='instagram' />
            <SocialLink href='https://t.me/...' text='telegram' />
            <SocialLink href='https://www.facebook.com/...' text='facebook' />
          </div>

          {/* PAGES & LOCATION */}
          <div className='flex justify-between items-end mb-8 md:order-none order-5 md:flex-row flex-col-reverse md:mt-0 mt-10 text-center md:text-left'>
            <div className='flex flex-col font-mono text-2xl items-start md:mt-0 mt-8 md:flex-col sm:flex-row sm:justify-between sm:w-full md:w-max'>
            <AnimatedLink text="HOME" targetId='home' />           
            <AnimatedLink text="ABOUT" targetId="about"/>
            <AnimatedLink text="PROJECTS" targetId="project" />
            </div>
      
           
          </div>
          
          <div className='mt-5 md:mt-10 overflow-hidden md:order-none -mx-10'>
            <h1 className='footer-title font-display font-bold text-[14vw] sm:text-[15vw] lg:text-[10rem] flex-wrap leading-none tracking-super-tight text-center sm:text-left'>
              {NAME_CHARS.map((char, index) => (
                <span
                  key={index}
                  className='footer-title-char inline-block'
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          <div className='footer-reserved flex justify-between items-center mt-4 md:mt-8 md:order-none order-7 opacity-0'>
            <div className='font-mono text-xs lg:text-sm text-gray-500 text-right'>
              © All right reserved.
              <br />
              2025 GursharanSingh
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;