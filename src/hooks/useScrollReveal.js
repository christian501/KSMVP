import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity:  0,
        y:        options.y        ?? 40,
        duration: options.duration ?? 0.9,
        ease:     options.ease     ?? 'power3.out',
        delay:    options.delay    ?? 0,
        scrollTrigger: {
          trigger:       ref.current,
          start:         options.start ?? 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return ref;
}
