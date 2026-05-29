import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function RevealSection({ children, delay = 0, y = 36, className = '', style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0, y,
        duration: 0.85, delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 82%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={className} style={style}>{children}</div>;
}
