import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PILLAR_LABELS = [
  'Pillar 1: AI Integration',
  'Pillar 1: AI Integration',
  'Pillar 1: AI Integration',
  'Pillar 2: VA Leverage',
  'Pillar 2: VA Leverage',
  'Pillar 3: Tech Stack',
  'Pillar 3: Tech Stack',
  'Pillar 4: Social & Hyperlocal',
  'Pillar 4: Social & Hyperlocal',
  'Pillar 5: Retention',
  'Pillar 5: Retention',
  'Pillar 5: Retention',
];

export default function ProgressBar({ current, total = 12 }) {
  const fillRef = useRef(null);

  useEffect(() => {
    gsap.to(fillRef.current, {
      width: `${((current + 1) / total) * 100}%`,
      duration: 0.6, ease: 'power2.out',
    });
  }, [current]);

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {PILLAR_LABELS[current]}
        </span>
        <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-2)' }}>
          {current + 1} of {total}
        </span>
      </div>
      <div style={{ height: '2px', background: 'var(--navy-4)', borderRadius: '1px', overflow: 'hidden' }}>
        <div ref={fillRef} style={{ height: '100%', background: 'var(--orange)', width: '0%', borderRadius: '1px' }} />
      </div>
    </div>
  );
}
