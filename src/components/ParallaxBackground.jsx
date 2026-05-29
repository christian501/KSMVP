import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ParallaxBackground({ trigger }) {
  const ref = useRef(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      gsap.to('.parallax-slow', {
        yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: trigger || ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.parallax-fast', {
        yPercent: -45, ease: 'none',
        scrollTrigger: { trigger: trigger || ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <svg className="parallax-slow" style={{ position: 'absolute', top: '-8%', right: '-4%',
        opacity: 0.055, width: '48%', height: 'auto' }} viewBox="0 0 440 440">
        {Array.from({ length: 100 }).map((_, i) => (
          <circle key={i} cx={(i % 10) * 44} cy={Math.floor(i / 10) * 44} r="1.5" fill="#1A7BFF" />
        ))}
      </svg>
      <svg className="parallax-fast" style={{ position: 'absolute', bottom: '8%', left: '-2%',
        opacity: 0.035, width: '28%', height: 'auto' }} viewBox="0 0 300 360">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 52} x2="300" y2={i * 52} stroke="#1A7BFF" strokeWidth="0.5" />
        ))}
      </svg>
      <div className="parallax-slow" style={{
        position: 'absolute', top: '12%', left: '-12%',
        width: '480px', height: '480px', borderRadius: '50%',
        border: '0.5px solid rgba(26,123,255,0.06)',
      }} />
    </div>
  );
}
