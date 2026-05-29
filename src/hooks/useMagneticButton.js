import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function useMagneticButton(strength = 0.28) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const onMove = (e) => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * strength;
      const dy = (e.clientY - (r.top  + r.height / 2)) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    };

    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return ref;
}
