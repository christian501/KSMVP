import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageWrapper from '../components/PageWrapper';
import RevealSection from '../components/RevealSection';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { useFunnelStore } from '../store/funnelStore';
import BorderGlow from '../components/BorderGlow/BorderGlow';

const VAULT_ITEMS = [
  { n: 1,  title: 'VIP Bonus Hour — Live Claude Business Planning Workshop',
    desc:  'Kevin runs a live Claude business planning session on screen. Watch a real agency problem solved in real time.',
    value: 497 },
  { n: 2,  title: 'Lifetime Summit Recordings',
    desc:  'Every session from June 25th, yours forever. Watch at your pace, share with your team.',
    value: 197 },
  { n: 3,  title: '30-Day Implementation Q&A Channel',
    desc:  '30 days of post-summit access to Kevin\'s private Q&A channel. Get answers as you implement.',
    value: 297 },
  { n: 4,  title: 'The Claude User Guide for Insurance Agents',
    desc:  'Step-by-step guide to using Claude as a daily business planning partner. Built for P&C agencies.',
    value: 197 },
  { n: 5,  title: 'The VA Beginner\'s Guide for Insurance Agencies',
    desc:  'How to hire, onboard, train, and manage your first virtual assistant. SOPs, scripts, role definitions.',
    value: 197 },
  { n: 6,  title: 'The GHL Starter Guide for Agents',
    desc:  'Kevin\'s exact GHL setup. Workflows, pipelines, automations, and templates for insurance agencies.',
    value: 147 },
  { n: 7,  title: 'Social Media Mastery: The Art of Selling One to Many',
    desc:  'Build a hyperlocal social presence that generates referrals without paying for leads.',
    value: 147 },
  { n: 8,  title: 'The AI Compliance Guide',
    desc:  'Navigate AI use in an Allstate-compliant way. What you can and can\'t do. Stay protected while moving fast.',
    value: 197 },
  { n: 9,  title: 'The Hyperlocal Playbook',
    desc:  'Own your zip code. The positioning and content strategy that makes you the obvious agent.',
    value: 147 },
  { n: 10, title: '"Get AI or Die Trying" — Digital Copy',
    desc:  'Kevin\'s e-book on the mindset shift required to lead an AI-first agency.',
    value: 27 },
];
const STACK_TOTAL = VAULT_ITEMS.reduce((s, i) => s + i.value, 0);

export default function VaultPage() {
  const navigate = useNavigate();
  const { isRegistered, setVIP } = useFunnelStore();
  const [founderLeft, setFounderLeft] = useState(34);
  const ctaRef = useMagneticButton(0.2);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  useEffect(() => {
    const id = setInterval(() => {
      setFounderLeft((n) => (n > 20 ? n - 1 : n));
    }, 12000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.vault-item');
      const track = document.querySelector('.vault-track');
      const totalWidth = track ? track.scrollWidth : 0;

      gsap.to('.vault-track', {
        x: -(totalWidth - window.innerWidth + 96),
        ease: 'none',
        scrollTrigger: {
          id: 'vault-scrub',
          trigger: '.vault-horizontal-wrapper',
          pin: true,
          scrub: 1,
          snap: { snapTo: 1 / (items.length - 1), duration: { min: 0.2, max: 0.4 }, ease: 'power1.inOut' },
          end: () => `+=${totalWidth}`,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const ctx = gsap.context(() => {
      gsap.from('.vault-item', {
        opacity: 0, y: 28, duration: 0.6, ease: 'power2.out', stagger: 0.07,
        scrollTrigger: { trigger: '.vault-grid', start: 'top 75%' },
      });
    });
    return () => ctx.revert();
  }, []);

  const handlePurchase = () => {
    setVIP();
    navigate('/confirm');
  };

  const handleSkip = () => navigate('/confirm');

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', paddingTop: '56px' }}>

        {isRegistered && (
          <div style={{ background: 'rgba(47,106,79,0.25)', borderBottom: '0.5px solid var(--green-light)',
            padding: '12px 32px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Poppins', fontSize: '14px', color: 'var(--green-light)' }}>
              ✓ Your free summit seat is confirmed. Check your email for details.
            </span>
          </div>
        )}

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '72px 32px 0' }}>

          <RevealSection>
            <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              display: 'block', marginBottom: '16px' }}>One more thing</span>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 400,
              color: 'var(--white)', lineHeight: 0.93, letterSpacing: '0.02em',
              marginBottom: '20px' }}>
              Before June 25th, you'll need everything in this room.
            </h1>
            <p style={{ fontFamily: 'Poppins', fontSize: '18px', color: 'var(--gray-1)',
              maxWidth: '640px', lineHeight: 1.65 }}>
              The Summit gives you the what and the why. The Future Proof Vault gives
              you the how. Every guide, every playbook, every tool spec —
              pre-loaded for implementation the week after.
            </p>
          </RevealSection>

          <hr className="rule-orange" style={{ margin: '48px 0' }} />
        </div>

        {!isMobile && (
          <div className="vault-horizontal-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
            <div className="vault-track" style={{ display: 'flex', gap: '20px',
              width: 'max-content', padding: '20px 48px 60px' }}>
              {VAULT_ITEMS.map((item) => (
                <BorderGlow
                  key={item.n}
                  className="vault-item"
                  backgroundColor="var(--navy-3)"
                  borderRadius={8}
                  glowRadius={28}
                  glowIntensity={0.95}
                  edgeSensitivity={26}
                  glowColor="24 100 55"
                  colors={['#FF6600', '#1A7BFF', '#FF7A1A']}
                >
                  <div style={{
                    width: '320px', flexShrink: 0,
                    padding: '28px 24px',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    height: '100%',
                  }}>
                    <span style={{ fontFamily: 'Space Mono', fontSize: '28px',
                      fontWeight: 500, color: 'rgba(255,102,0,0.2)' }}>
                      {String(item.n).padStart(2, '0')}
                    </span>
                    <p style={{ fontFamily: 'Poppins', fontSize: '15px', fontWeight: 500,
                      color: 'var(--cream)', lineHeight: 1.4 }}>{item.title}</p>
                    <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-1)',
                      lineHeight: 1.55, flex: 1 }}>{item.desc}</p>
                    <p style={{ fontFamily: 'Space Mono', fontSize: '13px', color: 'var(--orange)',
                      marginTop: 'auto' }}>Value: ${item.value.toLocaleString()}</p>
                  </div>
                </BorderGlow>
              ))}
            </div>
          </div>
        )}

        {isMobile && (
          <div className="vault-grid" style={{ maxWidth: '600px', margin: '0 auto',
            padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {VAULT_ITEMS.map((item) => (
              <BorderGlow
                key={item.n}
                className="vault-item"
                backgroundColor="var(--navy-3)"
                borderRadius={8}
                glowRadius={24}
                glowIntensity={0.9}
                edgeSensitivity={28}
                glowColor="24 100 55"
                colors={['#FF6600', '#1A7BFF', '#FF7A1A']}
              >
                <div style={{
                  padding: '20px',
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                }}>
                  <span style={{ fontFamily: 'Space Mono', fontSize: '20px',
                    color: 'rgba(255,102,0,0.3)', flexShrink: 0, minWidth: '32px' }}>
                    {String(item.n).padStart(2, '0')}
                  </span>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500,
                      color: 'var(--cream)', marginBottom: '6px' }}>{item.title}</p>
                    <p style={{ fontFamily: 'Poppins', fontSize: '13px',
                      color: 'var(--gray-1)', marginBottom: '8px', lineHeight: 1.5 }}>{item.desc}</p>
                    <p style={{ fontFamily: 'Space Mono', fontSize: '12px',
                      color: 'var(--orange)' }}>${item.value.toLocaleString()}</p>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        )}

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '64px 32px 100px', textAlign: 'center' }}>
          <RevealSection>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px',
                alignItems: 'baseline', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Space Mono', fontSize: '14px', color: 'var(--gray-2)',
                    textDecoration: 'line-through', marginBottom: '4px' }}>
                    ${STACK_TOTAL.toLocaleString()} total value
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Space Mono', fontSize: '13px',
                    color: 'var(--gray-2)', marginBottom: '4px' }}>Your investment</p>
                  <p style={{ fontFamily: 'Space Mono', fontSize: '64px',
                    fontWeight: 500, color: 'var(--orange)', lineHeight: 1 }}>$37</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Space Mono', fontSize: '13px',
                    color: 'var(--gray-2)', marginBottom: '4px' }}>You save</p>
                  <p style={{ fontFamily: 'Space Mono', fontSize: '20px',
                    color: 'var(--green-light)' }}>
                    ${(STACK_TOTAL - 37).toLocaleString()} (98% off)
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,102,0,0.08)',
              border: '0.5px solid rgba(255,102,0,0.3)',
              borderRadius: '4px', padding: '16px 24px', marginBottom: '32px' }}>
              <p style={{ fontFamily: 'Poppins', fontSize: '14px', color: 'var(--gray-1)' }}>
                <strong style={{ color: 'var(--cream)' }}>Founder rate:</strong> First 100 Vault purchases at $27.
                Then $37 for the rest of the launch.{' '}
                <span style={{ fontFamily: 'Space Mono', color: 'var(--orange)' }}>
                  {founderLeft} founder slots remaining.
                </span>
              </p>
            </div>

            <p style={{ fontFamily: 'Space Mono', fontSize: '12px', color: 'var(--gray-2)',
              marginBottom: '28px', letterSpacing: '0.04em' }}>
              7-day friction-free guarantee. No awkward call. No questions asked.
            </p>

            <button ref={ctaRef} onClick={handlePurchase} style={{
              width: '100%', maxWidth: '480px',
              padding: '18px 32px',
              background: 'var(--orange)', color: 'var(--navy)',
              border: 'none', borderRadius: '4px',
              fontFamily: 'Poppins', fontSize: '18px', fontWeight: 600,
              cursor: 'pointer', marginBottom: '16px',
            }}>
              Add the Future Proof Vault — $37 →
            </button>

            <button onClick={handleSkip} style={{
              background: 'none', border: 'none',
              fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-2)',
              cursor: 'pointer', textDecoration: 'underline', display: 'block', margin: '0 auto',
            }}>
              Continue to my confirmation without the Vault
            </button>
          </RevealSection>
        </div>
      </div>
    </PageWrapper>
  );
}
