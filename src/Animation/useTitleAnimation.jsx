import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useTitleAnimation = () => {
  useEffect(() => {
    const titles = document.querySelectorAll('.animation-title');

    titles.forEach((title) => {
      if (!title.dataset.animated) {
        const words = title.textContent.split(' ');
        title.textContent = '';
        words.forEach((word, i) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          word.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('letter');
            wordSpan.appendChild(span);
          });
          title.appendChild(wordSpan);
          if (i < words.length - 1) title.append(' ');
        });
        title.dataset.animated = 'true';
      }

      const letters = title.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        { y: -120 + '%' },
        {
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: { each: 0.05, from: 'center' },
          scrollTrigger: {
            trigger: title,
            start: 'top 100%',
            end: 'bottom 30%',
            scrub: 1,
            scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
          },
        }
      );
    });
  }, []);
};

export default useTitleAnimation;
