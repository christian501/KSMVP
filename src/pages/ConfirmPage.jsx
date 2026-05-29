import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import PageWrapper from '../components/PageWrapper';
import RevealSection from '../components/RevealSection';
import { useFunnelStore } from '../store/funnelStore';

const BRAND_COLORS = ['#FF6600','#FF7A1A','#1A7BFF','#4DA3FF','#FFFFFF','#071038'];

function fireConfetti() {
  confetti({ particleCount: 80, spread: 70, origin: { x: 0.5, y: 0.5 },
    colors: BRAND_COLORS, ticks: 320, gravity: 1.2, scalar: 1.1 });
  setTimeout(() =>
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0.1, y: 0.55 },
      colors: BRAND_COLORS, ticks: 220 }), 320);
  setTimeout(() =>
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 0.9, y: 0.55 },
      colors: BRAND_COLORS, ticks: 220 }), 550);
}

function makeGoogleCalLink() {
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=The+Future+Proof+Agent+Summit+%E2%80%94+AI-First+or+Fall+Behind' +
    '&dates=20260625T150000Z/20260625T190000Z' +
    '&details=Your+free+virtual+summit+seat.+Hosted+by+Kevin+Spann.+Zoom+link+in+your+email.' +
    '&location=Virtual+%28Zoom%29';
}

const NEXT_STEPS = [
  { label: 'Today',    text: 'Check your email. Confirm receipt of your registration.' },
  { label: '1 wk out', text: 'Pre-summit prep kit arrives — 3 things to do before June 25th to get 10x the value.' },
  { label: 'June 24',  text: 'Zoom link delivered. Tech check reminder sent.' },
  { label: 'June 25',  text: '11:00 AM ET — we go live. Be in the room 5 minutes early.' },
  { label: 'June 26',  text: 'Recording + implementation guide delivered. (VIP only for recordings.)' },
];

export default function ConfirmPage() {
  const { email, isVIP } = useFunnelStore();
  const checkRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(fireConfetti, 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!checkRef.current) return;
    const path = checkRef.current.querySelector('path');
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, duration: 0.9, delay: 0.4, ease: 'power2.out' });
  }, []);

  const btnStyle = {
    padding: '10px 18px',
    background: 'none',
    border: '0.5px solid var(--border)',
    borderRadius: '4px',
    color: 'var(--gray-1)',
    fontFamily: 'Space Mono',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', paddingTop: '56px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 32px 100px', textAlign: 'center' }}>

          <div ref={checkRef} style={{ marginBottom: '32px' }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="34" fill="none" stroke="rgba(255,102,0,0.2)" strokeWidth="1.5" />
              <path d="M20 37 L31 48 L52 26"
                fill="none" stroke="var(--orange)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <RevealSection>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(52px, 9vw, 100px)', fontWeight: 400,
              color: 'var(--white)', lineHeight: 0.93, letterSpacing: '0.02em',
              marginBottom: '16px' }}>
              You're in. See you June 25th.
            </h1>
            <p style={{ fontFamily: 'Poppins', fontSize: '17px', color: 'var(--gray-1)',
              lineHeight: 1.65, marginBottom: '8px' }}>
              Check your email — your summit confirmation and session guide are on their way
              {email ? ` to ${email}` : ''}.
            </p>
          </RevealSection>

          {isVIP && (
            <RevealSection delay={0.1}>
              <div style={{ margin: '24px 0',
                background: 'rgba(47,106,79,0.2)',
                border: '0.5px solid var(--green-light)',
                borderRadius: '4px', padding: '16px 24px' }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '12px', color: 'var(--green-light)',
                  letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Future Proof Vault — Activated
                </span>
                <p style={{ fontFamily: 'Poppins', fontSize: '14px', color: 'var(--gray-1)',
                  marginTop: '8px' }}>
                  Vault access delivered to your email within 24 hours. The 30-day Q&A channel opens June 26th.
                </p>
              </div>
            </RevealSection>
          )}

          <hr className="rule-orange" style={{ margin: '40px 0' }} />

          <RevealSection delay={0.15}>
            <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-2)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Add to your calendar
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={makeGoogleCalLink()} target="_blank" rel="noreferrer" style={btnStyle}>
                + Google Calendar
              </a>
              <button style={btnStyle}>+ Apple Calendar</button>
              <button style={btnStyle}>+ Outlook</button>
            </div>
          </RevealSection>

          <hr className="rule-orange" style={{ margin: '40px 0' }} />

          <RevealSection delay={0.2}>
            <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px' }}>
              What happens next
            </p>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {NEXT_STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px',
                  paddingBottom: i < NEXT_STEPS.length - 1 ? '20px' : 0,
                  borderBottom: i < NEXT_STEPS.length - 1 ? '0.5px solid var(--border)' : 'none',
                  marginBottom: i < NEXT_STEPS.length - 1 ? '20px' : 0 }}>
                  <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
                    minWidth: '64px', paddingTop: '3px', flexShrink: 0 }}>{s.label}</span>
                  <span style={{ fontFamily: 'Poppins', fontSize: '14px',
                    color: 'var(--gray-1)', lineHeight: 1.55 }}>{s.text}</span>
                </div>
              ))}
            </div>
          </RevealSection>

          <hr className="rule-orange" style={{ margin: '40px 0' }} />

          <RevealSection delay={0.25}>
            <p style={{ fontFamily: 'Poppins', fontSize: '16px', color: 'var(--gray-1)',
              marginBottom: '16px' }}>Know another agent who needs to be in this room?</p>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--border)',
              borderRadius: '4px', padding: '16px 20px', marginBottom: '12px', textAlign: 'left' }}>
              <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-1)',
                fontStyle: 'italic', lineHeight: 1.6 }}>
                "I just registered for The Future Proof Agent Summit — June 25th, free virtual event
                for insurance agents. Kevin Spann is teaching the AI + VA + GHL system that's
                changing the game. Grab a seat before it fills up."
              </p>
            </div>
            <button onClick={() => navigator.clipboard.writeText('https://kevinspanninsurance.com/summit')}
              style={{ ...btnStyle, borderColor: 'rgba(255,102,0,0.4)', color: 'var(--orange)' }}>
              Copy share text
            </button>
          </RevealSection>

          <hr className="rule-orange" style={{ margin: '40px 0' }} />

          <RevealSection delay={0.3}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--navy-4)', border: '2px solid var(--orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Mono', fontSize: '13px', color: 'var(--orange)' }}>KS</div>
              <div>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px',
                  fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.7, marginBottom: '10px' }}>
                  "I'll see you on June 25th. Come ready to work. This isn't a webinar you watch from
                  the background — it's a planning session. Bring your questions, bring your challenges,
                  and bring the mindset that this is the moment your agency's next chapter starts."
                </p>
                <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
                  letterSpacing: '0.06em' }}>— Kevin</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </PageWrapper>
  );
}
