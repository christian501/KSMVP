import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TIERS = {
  resistant: { label: 'AI-Resistant',  sub: 'Critical Risk',         color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  aware:     { label: 'AI-Aware',      sub: 'Moderate Risk',         color: '#FF6600', bg: 'rgba(255,102,0,0.10)' },
  adopting:  { label: 'AI-Adopting',   sub: 'Accelerate or Plateau', color: '#4DA3FF', bg: 'rgba(77,163,255,0.10)' },
  first:     { label: 'AI-First',      sub: 'Lead the Field',        color: '#FF6600', bg: 'rgba(255,102,0,0.10)' },
};

export default function TierBadge({ tier }) {
  const ref = useRef(null);
  const t = TIERS[tier] || TIERS.aware;

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      scale: 0.72, opacity: 0, y: -16,
      duration: 0.7, ease: 'back.out(1.8)', delay: 0.1,
    });
    if (tier === 'first') {
      gsap.to(ref.current, {
        boxShadow: `0 0 28px ${t.color}44`,
        repeat: 3, yoyo: true, duration: 0.6, delay: 0.8,
      });
    }
  }, []);

  return (
    <div ref={ref} className="tier-badge" style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      gap: '4px', padding: '12px 28px',
      background: t.bg,
      border: `1px solid ${t.color}55`,
      borderRadius: '4px',
    }}>
      <span style={{ fontFamily: 'Space Mono', fontSize: '13px', fontWeight: 500,
        color: t.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {t.label}
      </span>
      <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'var(--gray-1)' }}>
        {t.sub}
      </span>
    </div>
  );
}
