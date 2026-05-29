import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { intervalToDuration } from 'date-fns';

const TARGET = new Date('2026-06-25T11:00:00-04:00');

export default function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const secRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      if (now >= TARGET) return;
      const dur = intervalToDuration({ start: now, end: TARGET });
      setTime({
        days: (dur.days || 0) + (dur.months || 0) * 30,
        hours: dur.hours || 0,
        minutes: dur.minutes || 0,
        seconds: dur.seconds || 0,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!secRef.current) return;
    gsap.from(secRef.current, { scale: 1.2, duration: 0.25, ease: 'power2.out' });
  }, [time.seconds]);

  const fmt = (n) => String(n).padStart(2, '0');

  return (
    <div style={{ fontFamily: 'Space Mono', fontSize: '15px', fontWeight: 700,
      color: 'var(--gray-1)', display: 'flex', alignItems: 'center', gap: '8px',
      letterSpacing: '0.04em' }}>
      <span style={{ color: 'var(--orange)' }}>{fmt(time.days)}d</span>
      <span>{fmt(time.hours)}h</span>
      <span>{fmt(time.minutes)}m</span>
      <span ref={secRef}>{fmt(time.seconds)}s</span>
    </div>
  );
}
