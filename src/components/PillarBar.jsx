import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function PillarBar({ label, score, max, delay = 0 }) {
  const fillRef = useRef(null);
  const pct = Math.round((score / max) * 100);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(fillRef.current, {
        scaleX: 0,
        duration: 0.9, delay, ease: 'power2.out',
        scrollTrigger: { trigger: fillRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-1)' }}>{label}</span>
        <span style={{ fontFamily: 'Space Mono', fontSize: '12px', color: 'var(--blue-light)' }}>{pct}%</span>
      </div>
      <div style={{ height: '3px', background: 'var(--navy-4)', borderRadius: '2px', overflow: 'hidden' }}>
        <div ref={fillRef} className="pillar-fill" style={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--blue), var(--blue-light))',
          borderRadius: '2px',
        }} />
      </div>
    </div>
  );
}
