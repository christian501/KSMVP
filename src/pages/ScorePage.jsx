import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { gsap } from 'gsap';
import PageWrapper from '../components/PageWrapper';
import ParallaxBackground from '../components/ParallaxBackground';
import TierBadge from '../components/TierBadge';
import PillarBar from '../components/PillarBar';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { useFunnelStore } from '../store/funnelStore';

const TIER_CONTENT = {
  resistant: {
    headline: 'The window is closing. But it\'s still open.',
    body: 'You\'re exactly the agent the Future Ready agenda will leave behind — not because you\'re not capable, but because the system is moving faster than you are right now. The good news: you can close 80% of this gap in 90 days. The bad news: most agents in your position wait one quarter too long. The June 25th Summit is the workshop built specifically for where you\'re standing today. Four hours. A complete action plan. No fluff. Reserve your free seat.',
    track: 'You qualify for the AI-Resistant Fast-Track session.',
  },
  aware: {
    headline: 'You see it. You just haven\'t moved yet.',
    body: 'You know what\'s coming. You\'ve read about ALLIE. You\'ve seen the Future Ready announcements. You\'ve probably told your team "we need to figure this out." Your score tells me you haven\'t moved yet — and that\'s actually the most expensive position in the network right now. Awareness without action is how good agents get caught flat-footed when commission structures shift. The Summit gives you the execution plan. June 25th is where you stop knowing and start doing.',
    track: 'Sessions 2 and 3 are built for your tier.',
  },
  adopting: {
    headline: 'You\'re moving. But the next 90 days will decide everything.',
    body: 'Your score puts you ahead of 70% of the Allstate network. But here\'s what I see in agents at your level all the time: months 1–3, explosive progress. You added Claude. Hired a VA. Got GHL running. Then months 4–6, you hit the plateau. Tools without strategy is just expensive busywork. The agents who break through do one thing differently — they stop using AI as a task tool and start using it as a strategic partner. That\'s the entire premise of the June 25th Summit. Come ready to break through.',
    track: 'The VIP Bonus Hour is specifically built for your tier.',
  },
  first: {
    headline: 'You\'re already where 95% of agents need to be. Now leverage it.',
    body: 'You\'re in the top 5% of the entire Allstate network. This isn\'t going to sell you on the basics — you\'re past that. What I want to talk about is leverage. You have a 12–18 month window before the rest of the field catches up. The question is what you do with that lead. The VIP Bonus Hour on June 25th is where I run a live Claude business planning session for agents in your tier — and where I\'m identifying who I want to bring into closer conversations about certification, regional leadership, and what comes next.',
    track: 'VIP access is the play for your tier.',
  },
};

const PILLAR_LABELS = ['AI Integration','VA Leverage','Tech Stack & Automation','Social & Hyperlocal','Retention Strategy'];
const PILLAR_KEYS   = ['ai','va','tech','social','retention'];
const PILLAR_MAX    = { ai: 12, va: 8, tech: 8, social: 8, retention: 12 };

export default function ScorePage() {
  const navigate = useNavigate();
  const { totalScore, pillarScores, tier } = useFunnelStore();
  const [startCount, setStartCount] = useState(false);
  const ctaRef = useMagneticButton(0.22);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!totalScore) navigate('/');
  }, []);

  useEffect(() => {
    if (!totalScore) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(containerRef.current, { opacity: 0, duration: 0.5 })
        .add(() => setStartCount(true), 0.3)
        .from('.score-label', { opacity: 0, y: 10, duration: 0.5 }, 0.5)
        .from('.tier-badge', { opacity: 0, scale: 0.72, y: -18,
          duration: 0.65, ease: 'back.out(1.8)' }, 1.8)
        .from('.pillars-section', { opacity: 0, y: 20, duration: 0.6 }, 2.1)
        .from('.tier-message', { opacity: 0, y: 22, duration: 0.7 }, 2.7)
        .from('.score-cta-section', { opacity: 0, y: 18, scale: 0.97, duration: 0.65 }, 3.3);
    }, containerRef);

    return () => ctx.revert();
  }, [totalScore]);

  if (!totalScore) return null;

  const tc = TIER_CONTENT[tier];

  return (
    <PageWrapper>
      <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '56px', overflow: 'hidden' }}>
        <ParallaxBackground />

        <div ref={containerRef} style={{ position: 'relative', zIndex: 1,
          maxWidth: '800px', margin: '0 auto', padding: '80px 32px 100px', textAlign: 'center' }}>

          <p className="score-label" style={{ fontFamily: 'Space Mono', fontSize: '11px',
            color: 'var(--gray-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Your Future Ready Score
          </p>

          <div className="orange-glow" style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(72px, 14vw, 120px)',
            fontWeight: 700, color: 'var(--orange)', lineHeight: 1, marginBottom: '8px' }}>
            {startCount ? (
              <CountUp start={0} end={totalScore} duration={2.2} delay={0}
                useEasing easingFn={(t,b,c,d) => { t/=d/2; if(t<1) return c/2*t*t+b; t--; return -c/2*(t*(t-2)-1)+b; }} />
            ) : '0'}
          </div>
          <p className="score-label" style={{ fontFamily: 'Space Mono', fontSize: '13px',
            color: 'var(--gray-2)', marginBottom: '32px' }}>out of 48</p>

          <div style={{ marginBottom: '48px' }}>
            <TierBadge tier={tier} />
          </div>

          <div className="pillars-section" style={{ textAlign: 'left', marginBottom: '56px',
            background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--border)',
            borderRadius: '6px', padding: '28px 32px' }}>
            <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Pillar breakdown
            </p>
            {PILLAR_KEYS.map((key, i) => (
              <PillarBar key={key} label={PILLAR_LABELS[i]}
                score={pillarScores[key]} max={PILLAR_MAX[key]} delay={i * 0.08} />
            ))}
          </div>

          <div className="tier-message" style={{ textAlign: 'left', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400,
              color: 'var(--white)', lineHeight: 0.95, letterSpacing: '0.02em',
              marginBottom: '20px' }}>
              {tc.headline}
            </h2>
            <p style={{ fontFamily: 'Poppins', fontSize: '17px', color: 'var(--gray-1)',
              lineHeight: 1.7, marginBottom: '16px' }}>
              {tc.body}
            </p>
            <p style={{ fontFamily: 'Space Mono', fontSize: '12px', color: 'var(--orange)',
              letterSpacing: '0.06em' }}>{tc.track}</p>
          </div>

          <div className="score-cta-section">
            <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-2)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              11:00 AM–3:00 PM ET · Virtual · Free
            </p>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400,
              color: 'var(--white)', letterSpacing: '0.03em', lineHeight: 0.97,
              marginBottom: '24px' }}>
              Reserve Your Free Seat — June 25, 2026
            </h3>
            <button ref={ctaRef} onClick={() => navigate('/register')} style={{
              background: 'var(--orange)', color: 'var(--navy)',
              border: 'none', padding: '18px 40px', borderRadius: '4px',
              fontFamily: 'Poppins', fontSize: '17px', fontWeight: 600,
              cursor: 'pointer', display: 'inline-block',
            }}>
              Claim My Free Seat →
            </button>
            <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-2)',
              marginTop: '12px' }}>
              Free registration. No credit card required. Seat confirmed instantly.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
