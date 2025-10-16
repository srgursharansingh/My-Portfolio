import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RevealLines = ({ lines = [], className = '' }) => {
  const innerRefs = useRef([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (innerRefs.current.length === 0) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: innerRefs.current[0]?.parentNode?.parentNode,
            start: 'top -250%',
            end: 'top -290%',
            scrub: 2,
            scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
          },
        });

        const reversed = [...innerRefs.current].reverse();

        tl.fromTo(
          reversed,
          { yPercent: -220 },
          { yPercent: 0, stagger: 0.1, ease: 'power2.out' }
        );
      });

      ScrollTrigger.refresh();

      return () => ctx.revert();
    });

    return () => cancelAnimationFrame(id);
  }, [lines]);

  return (
    <>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`reveal-line ${className}`}
          style={{
            display: 'block',
            overflow: 'hidden',
            whiteSpace: 'normal',
          }}>
          <span
            ref={(el) => {
              if (el) innerRefs.current[i] = el;
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
            {line}
          </span>
        </span>
      ))}
    </>
  );
};

export default RevealLines;
