import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageWrapper from '../components/PageWrapper';
import RevealSection from '../components/RevealSection';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { splitIntoWords } from '../utils/splitText';
import Aurora from '../components/Aurora/Aurora';
import BorderGlow from '../components/BorderGlow/BorderGlow';

const IMG = {
  hero:          '/hero-bg.png',
  heroAbstract:  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80',
  problem:       'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
  audAllstate:   'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
  audIndependent:'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
  audGrowth:     'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
  pillarAI:      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80',
  pillarVA:      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
  pillarTech:    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
  pillarSocial:  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1400&q=80',
  pillarRet:     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
  agendaBg:      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=80',
  kevin:         '/kevin.png',
  test1:         'https://images.unsplash.com/photo-1494790108377-fcf48f1e2a40?auto=format&fit=crop&w=400&q=80',
  test2:         'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  test3:         'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  finalBg:       'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80',
};

const PILLARS = [
  { n: '01', tag: 'AI Integration',
    title: 'Claude as your daily business partner.',
    body: 'Stop using AI for grammar fixes. Start using it as a strategic operator that helps you plan the day, draft renewal calls, and analyze every line of your book.',
    points: [
      'Build a Claude Project for every agency function — sales, service, retention.',
      'Drop your YTD numbers in, get back a strategy brief in 90 seconds.',
      'Use Claude to draft your hardest client conversations before you have them.',
      'Replace passive "thinking time" with structured AI working sessions.',
    ],
    stat: { value: '12 hrs', label: 'reclaimed per week by agents running Claude as a daily operator' },
    img: IMG.pillarAI },
  { n: '02', tag: 'VA Leverage',
    title: 'Build a global team for the cost of one local hire.',
    body: 'Define the roles. Hire the talent. Hand off the work that\'s eating your week. Inside the system: SOPs, scripts, and the exact onboarding sequence Kevin uses.',
    points: [
      'The 4 VA roles every P&C agency needs — and the 1 role you should never delegate.',
      'Where to find pre-vetted insurance-trained VAs in 14 days or less.',
      'The 30-day onboarding sequence that makes a new VA self-sufficient.',
      'The "two-week leash" framework — when to extend trust, when to pull back.',
    ],
    stat: { value: '$2,400/mo', label: 'average cost of a full-time insurance VA running Kevin\'s playbook' },
    img: IMG.pillarVA },
  { n: '03', tag: 'Tech Stack',
    title: 'A CRM that does the follow-up while you sleep.',
    body: 'GHL workflows, automated quoting handoffs, multi-touch nurture. The plumbing that turns 40 leads a week into 400 conversations.',
    points: [
      'The exact GHL pipeline structure for new business, renewals, and cross-sell.',
      'Automated quote handoff — lead form to quoted policy in under 5 minutes.',
      'Multi-touch nurture sequences that warm a cold lead in 7 days.',
      'Integrating ALLIE and SIDEKICK without doubling your data entry.',
    ],
    stat: { value: '10×', label: 'lead-to-conversation rate vs. the average agent\'s manual follow-up' },
    img: IMG.pillarTech },
  { n: '04', tag: 'Social & Hyperlocal',
    title: 'Own your zip code before someone else does.',
    body: 'Content that compounds. Hyperlocal positioning that makes you the obvious agent. A repeatable playbook for selling one to many.',
    points: [
      'The 5-post weekly framework — one creator, five platforms, zero burnout.',
      'Hyperlocal SEO moves that put you in the top 3 for "[city] insurance agent."',
      'Lead-generating content that doesn\'t rely on paid ads or referrals.',
      'How Kevin turned a 9,000-person town into a $3M book of business.',
    ],
    stat: { value: 'Top 3', label: 'local search position held in 11 zip codes after 90 days of execution' },
    img: IMG.pillarSocial },
  { n: '05', tag: 'Retention Strategy',
    title: 'Push retention above 92% — and keep it there.',
    body: 'Automated renewal touchpoints. The RAC conversation framework. Retention-tied commission logic that compounds for the next decade.',
    points: [
      'The 90-day pre-renewal touch sequence — the one nobody runs.',
      'The RAC conversation script — what to say when the rate goes up.',
      'Cross-sell triggers that surface during retention calls, not after.',
      'Tying staff commissions to retention without breaking SOP compliance.',
    ],
    stat: { value: '94.3%', label: 'retention rate in Kevin\'s agency the year he installed this system' },
    img: IMG.pillarRet },
];

const SESSIONS = [
  { time: '11:00 AM', hour: 'Hour 1', title: 'The Future Ready Reality',
    desc: 'The landscape, what\'s coming, and why 2026 is the decision year for every agent in the Allstate network. The trends, the timeline, and what\'s already non-negotiable.' },
  { time: '12:00 PM', hour: 'Hour 2', title: 'AI-First New Business',
    desc: 'Lead generation with ALLIE, SIDEKICK, and automated quoting workflows. The exact stack and play-by-play that turns 40 client contacts into 400.' },
  { time: '1:00 PM',  hour: 'Hour 3', title: 'AI-First Retention',
    desc: 'Automated renewal touchpoints, retention-tied commission strategy, and how to push above 92% retention without burning out your service team.' },
  { time: '2:00 PM',  hour: 'Hour 4', title: 'The Future Proof Formula',
    desc: 'The complete AI + VA + GHL + Social + Hyperlocal system demonstrated live on screen. You leave with the full implementation plan in hand.' },
  { time: '3:00 PM',  hour: 'VIP Bonus Hour', title: 'Live Claude Business Planning Workshop',
    desc: 'Kevin runs a live Claude business planning session on screen, working real agency problems in real time. Open Q&A. VIP attendees only.', vip: true },
];

const TESTIMONIALS = [
  { name: 'Sarah M.',     role: 'Allstate Agency · Florida',         img: IMG.test1,
    quote: 'I went to the NYC summit in January thinking it was another AI fluff session. I came home and rebuilt my entire onboarding workflow in a weekend. Q1 was the biggest quarter we\'ve ever had.' },
  { name: 'Marcus T.',    role: 'Independent · Texas',              img: IMG.test2,
    quote: 'Kevin is the only person teaching this who actually runs a real agency. Every tactic he showed us, I watched him use on stage. No theory.' },
  { name: 'Priya R.',     role: 'Allstate Agency · New Jersey',      img: IMG.test3,
    quote: 'The VA module alone was worth the flight to New York. We\'re saving 22 hours a week and our 12-month retention is finally above 91%.' },
];

const FAQS = [
  { q: 'Is the summit really free?',
    a: 'Yes. Free general admission. The optional Future Proof Vault upgrade is $37 if you want the recordings, bonus session, and implementation library.' },
  { q: 'Do I need to be an Allstate captive agent?',
    a: 'No. The system works for any P&C agent — Allstate, independent, or otherwise. Allstate-specific tools (ALLIE, SIDEKICK) are covered in one segment; the other 3+ hours apply to every agency.' },
  { q: 'What if I can\'t attend live on June 25?',
    a: 'The free seat is live-only. Recordings are part of the $37 Vault upgrade, available after registration.' },
  { q: 'Will this be salesy?',
    a: 'There\'s one $37 offer at the end. The 4 hours of training stand on their own. If you\'re looking for an 8-hour pitchfest, this is not it.' },
  { q: 'What if I\'m already AI-savvy?',
    a: 'Take the 5-minute audit. If you score in the AI-First tier, the VIP Bonus Hour is built specifically for you — that\'s where Kevin runs a live Claude business planning session.' },
];

function Counter({ to, duration = 2000, suffix = '', active }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, duration]);
  return <>{val}{suffix}</>;
}

function GradientOrb({ style }) {
  return (
    <div style={{
      position: 'absolute', borderRadius: '50%', filter: 'blur(80px)',
      pointerEvents: 'none', ...style,
    }} />
  );
}

export default function IntroPage() {
  const navigate = useNavigate();
  const heroBgRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const descRef = useRef(null);
  const preRef = useRef(null);
  const ctasRef = useRef(null);
  const ctaPrimaryRef = useMagneticButton(0.22);
  const ctaSecondaryRef = useMagneticButton(0.22);
  const ctaFinalPrimaryRef = useMagneticButton(0.22);
  const ctaFinalSecondaryRef = useMagneticButton(0.22);

  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const words = splitIntoWords(headlineRef.current);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(preRef.current, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' })
        .from(words, { y: '110%', opacity: 0, duration: 0.85, ease: 'power4.out', stagger: 0.055 }, 0.15)
        .from(subRef.current, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, 0.95)
        .from(descRef.current, { opacity: 0, y: 18, duration: 0.65, ease: 'power3.out' }, 1.15)
        .from(ctasRef.current, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' }, 1.4);

      if (!window.matchMedia('(max-width: 768px)').matches && heroBgRef.current) {
        gsap.to(heroBgRef.current, {
          yPercent: 25, ease: 'none',
          scrollTrigger: { trigger: heroBgRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      // Agenda — horizontal-scrub timeline: pin the section, translate
      // the track left as the user scrolls vertically. Desktop only.
      if (!window.matchMedia('(max-width: 900px)').matches) {
        const track = document.querySelector('.agenda-track');
        const wrapper = document.querySelector('.agenda-horizontal-wrapper');
        if (track && wrapper) {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
          gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              pin: true,
              scrub: 1,
              start: 'center center',
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // Pillar pinned-scroll: swap the sticky-left visual as each
      // right-side text block crosses the viewport center.
      const visuals = gsap.utils.toArray('.pillar-visual');
      gsap.utils.toArray('.pillar-text').forEach((textBlock, i) => {
        ScrollTrigger.create({
          trigger: textBlock,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (!self.isActive) return;
            visuals.forEach((vis, j) => {
              gsap.to(vis, {
                opacity: i === j ? 1 : 0,
                duration: 0.55, ease: 'power2.out',
              });
            });
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const goQuiz = () => navigate('/quiz');
  const goRegister = () => navigate('/register');

  const sectionPad = { padding: 'clamp(80px, 12vh, 140px) 32px' };
  const containerStyle = { maxWidth: '1200px', margin: '0 auto' };
  const eyebrow = { fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
    letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block' };
  const sectionH = { fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 400,
    color: 'var(--white)', lineHeight: 0.95, letterSpacing: '0.03em' };

  return (
    <PageWrapper>
      {/* ===================== HERO ===================== */}
      <section style={{ position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '56px' }}>

        {/* Background image — base layer */}
        <div ref={heroBgRef} style={{
          position: 'absolute', inset: '-10% 0 -20% 0',
          backgroundImage: `url(${IMG.hero})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 1,
        }} />

        {/* Aurora — animated WebGL layer over the image */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.75 }}>
          <Aurora
            colorStops={['#3B82F6', '#F97316', '#3B82F6', '#F97316', '#3B82F6']}
            amplitude={2.1}
            blend={0.6}
          />
        </div>

        {/* Legibility overlay — gentle left-to-right fade so headline copy on the left stays readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(7,16,56,0.80) 0%, rgba(7,16,56,0.45) 45%, rgba(7,16,56,0.05) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(7,16,56,0) 55%, rgba(7,16,56,0.70) 90%, var(--navy) 100%)',
        }} />

        {/* Abstract gradient orbs */}
        <GradientOrb style={{ width: 520, height: 520, background: 'rgba(255,102,0,0.18)',
          top: '-10%', right: '-10%' }} />
        <GradientOrb style={{ width: 380, height: 380, background: 'rgba(14,32,96,0.6)',
          bottom: '-8%', left: '-8%' }} />

        <div style={{ ...containerStyle, position: 'relative', zIndex: 2,
          padding: '120px 32px 80px', width: '100%' }}>

          <div ref={preRef} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ width: '32px', height: '1px', background: 'var(--orange)' }} />
            <span style={eyebrow}>
              June 25, 2026 · Virtual · Free · 11 AM–3 PM ET
            </span>
          </div>

          <h1 ref={headlineRef} className="bebas-headline-glow" style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(64px, 11vw, 132px)',
            fontWeight: 400, lineHeight: 0.93,
            color: 'var(--white)',
            maxWidth: '1100px', marginBottom: '24px',
            letterSpacing: '0.02em',
          }}>
            The Future Proof Agent Summit
          </h1>

          <p ref={subRef} style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(22px, 2.6vw, 34px)',
            fontWeight: 400, fontStyle: 'italic',
            color: 'var(--cream)', maxWidth: '720px',
            lineHeight: 1.3, marginBottom: '28px',
            letterSpacing: '-0.005em',
          }}>
            AI-First or Fall Behind.
          </p>

          <p ref={descRef} style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(16px, 1.4vw, 19px)',
            fontWeight: 400, color: 'var(--gray-1)',
            maxWidth: '640px', lineHeight: 1.6,
            marginBottom: '48px',
          }}>
            A free four-hour virtual summit for insurance agents who refuse to be replaced.
            The complete AI&nbsp;+&nbsp;VA&nbsp;+&nbsp;automation system, taught by an agent who's
            built a $15M book the new way.
          </p>

          <div ref={ctasRef}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button ref={ctaPrimaryRef} onClick={goQuiz} style={{
                padding: '18px 32px',
                background: 'var(--orange)', color: 'var(--navy)',
                border: 'none', borderRadius: '4px',
                fontFamily: 'Poppins', fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.01em',
              }}>
                Take the Free 5-Min Audit →
              </button>
              <button ref={ctaSecondaryRef} onClick={goRegister} style={{
                padding: '18px 32px',
                background: 'transparent', color: 'var(--cream)',
                border: '1px solid rgba(255,102,0,0.5)', borderRadius: '4px',
                fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500,
                cursor: 'pointer', letterSpacing: '0.01em',
              }}>
                Reserve My Free Seat
              </button>
            </div>

            {/* Centered below CTAs: assurance line + scroll cue */}
            <div style={{ marginTop: '32px', width: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '8px', opacity: 0.5 }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: 'var(--gray-1)',
                  letterSpacing: '0.2em' }}>SCROLL</span>
                <div style={{ width: '1px', height: '40px',
                  background: 'linear-gradient(180deg, var(--orange), transparent)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== THE GAP ===================== */}
      <section style={{ ...sectionPad, position: 'relative', background: 'var(--navy-2)' }}>
        <div style={{ ...containerStyle, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '80px', alignItems: 'center' }}>

          <RevealSection>
            <span style={eyebrow}>The Gap</span>
            <h2 style={{ ...sectionH, marginTop: '16px', marginBottom: '28px' }}>
              The average agent makes 40 client contacts a week.
            </h2>
            <p style={{ fontFamily: 'Poppins', fontSize: '18px', color: 'var(--gray-1)',
              lineHeight: 1.7, marginBottom: '32px' }}>
              Agents running the Future Proof Formula make&nbsp;
              <strong style={{ color: 'var(--orange)' }}>400</strong>. Same hours. Same book size.
              Completely different trajectory. The difference is not effort — it's leverage.
            </p>

            <div ref={statsRef} style={{ display: 'flex', gap: '40px',
              flexWrap: 'wrap', marginTop: '40px' }}>
              <div>
                <p style={{ fontFamily: 'Space Mono', fontSize: '56px', fontWeight: 500,
                  color: 'var(--orange)', lineHeight: 1 }}>
                  <Counter to={400} duration={2400} active={statsInView} />
                </p>
                <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-1)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '8px' }}>
                  Weekly contacts — Future Proof
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'Space Mono', fontSize: '56px', fontWeight: 500,
                  color: 'var(--gray-2)', lineHeight: 1, textDecoration: 'line-through' }}>
                  40
                </p>
                <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-2)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '8px' }}>
                  Weekly contacts — Average
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'Space Mono', fontSize: '56px', fontWeight: 500,
                  color: 'var(--orange)', lineHeight: 1 }}>
                  <Counter to={10} duration={1800} suffix="×" active={statsInView} />
                </p>
                <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-1)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '8px' }}>
                  Output multiplier
                </p>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={0.15}>
            <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden',
              border: '0.5px solid var(--border)' }}>
              <img src={IMG.problem} alt="Agency operations" loading="lazy"
                style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, transparent 40%, rgba(7,16,56,0.85) 100%)' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px',
                  fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.5 }}>
                  "I rebuilt my agency in 90 days. Not because I worked harder. Because I finally let
                  the machines do the work that wasn't mine to do."
                </p>
                <p style={{ ...eyebrow, marginTop: '12px' }}>— Kevin Spann</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===================== WHO THIS IS FOR ===================== */}
      <section style={{ ...sectionPad, position: 'relative' }}>
        <div style={containerStyle}>
          <RevealSection>
            <span style={eyebrow}>Who this is for</span>
            <h2 style={{ ...sectionH, marginTop: '16px', marginBottom: '24px', maxWidth: '720px' }}>
              Three rooms. One conversation. Built for the agents already feeling the shift.
            </h2>
          </RevealSection>

          <div style={{ display: 'grid', gap: '24px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '56px' }}>
            {[
              { img: IMG.audAllstate, tag: 'Allstate Captive',
                title: 'The agent staring down ALLIE, SIDEKICK, and a new commission structure.',
                body: 'You\'re hearing words like "Future Ready" in every team meeting. You know the floor is moving. This is where you stop reacting and start leading.' },
              { img: IMG.audIndependent, tag: 'Independent',
                title: 'The owner-operator who can\'t hire their way out of the bottleneck.',
                body: 'You\'re the bottleneck. The system is. The same playbook that built mid-market captive agencies works on your book — at a fraction of the headcount.' },
              { img: IMG.audGrowth, tag: 'Multi-State / Multi-Office',
                title: 'The principal scaling past the ceiling local labor markets imposed.',
                body: 'You\'ve hit the wall every agency hits at 4–8 offices. AI + VA is how you blow past it — without doubling W-2 payroll or losing the customer experience.' },
            ].map((c, i) => (
              <RevealSection key={c.tag} delay={i * 0.12}>
                <BorderGlow
                  backgroundColor="var(--navy-2)"
                  borderRadius={8}
                  glowRadius={36}
                  glowIntensity={1}
                  edgeSensitivity={25}
                  glowColor="24 100 55"
                  colors={['#FF6600', '#1A7BFF', '#FF7A1A']}
                  className="audience-card"
                >
                  <div style={{ height: '260px', overflow: 'hidden',
                    borderTopLeftRadius: 8, borderTopRightRadius: 8, position: 'relative' }}>
                    <img src={c.img} alt={c.tag} loading="lazy" style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      filter: 'grayscale(0.2) brightness(0.85)',
                    }} />
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(11,26,80,0.95) 100%)' }} />
                  </div>
                  <div style={{ padding: '28px' }}>
                    <span style={eyebrow}>{c.tag}</span>
                    <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px',
                      fontWeight: 400, color: 'var(--white)', lineHeight: 0.97, letterSpacing: '0.03em',
                      marginTop: '12px', marginBottom: '14px' }}>
                      {c.title}
                    </h3>
                    <p style={{ fontFamily: 'Poppins', fontSize: '14px',
                      color: 'var(--gray-1)', lineHeight: 1.65 }}>{c.body}</p>
                  </div>
                </BorderGlow>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 5 PILLARS ===================== */}
      <section style={{ ...sectionPad, background: 'var(--navy-2)' }}>
        <div style={containerStyle}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span style={eyebrow}>The 5 Pillars</span>
              <h2 style={{ ...sectionH, marginTop: '16px', maxWidth: '820px', margin: '16px auto 0' }}>
                The complete Future Proof Formula — taught in four hours.
              </h2>
            </div>
          </RevealSection>

          {/* Sticky-left + scrolling-right pillar experience (Twilio-style) */}
          <div className="pillar-scroll-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '72px',
            alignItems: 'start',
          }}>
            {/* LEFT — sticky stack: image, big number, stat callout */}
            <div className="pillar-sticky-col" style={{
              position: 'sticky', top: '96px',
              height: 'calc(100vh - 140px)',
              minHeight: '560px',
            }}>
              {PILLARS.map((p, i) => (
                <div key={p.n} className="pillar-visual" data-pillar-index={i} style={{
                  position: 'absolute', inset: 0,
                  opacity: i === 0 ? 1 : 0,
                  display: 'flex', flexDirection: 'column',
                  borderRadius: '8px', overflow: 'hidden',
                  border: '0.5px solid var(--border)',
                }}>
                  <img src={p.img} alt={p.tag} loading="lazy" style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%', objectFit: 'cover',
                  }} />
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'linear-gradient(160deg, rgba(7,16,56,0.45) 0%, rgba(7,16,56,0.85) 100%)' }} />

                  {/* Overlaid number + tag */}
                  <div style={{ position: 'relative', padding: '32px', zIndex: 1 }}>
                    <span style={{
                      fontFamily: 'Space Mono, monospace', fontSize: 'clamp(56px, 6vw, 88px)',
                      fontWeight: 700, color: 'var(--orange)', lineHeight: 1,
                      display: 'block', textShadow: '0 0 40px rgba(255,102,0,0.35)',
                    }}>{p.n}</span>
                    <span style={{
                      fontFamily: 'Space Mono, monospace', fontSize: '11px',
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'var(--cream)', marginTop: '12px', display: 'block',
                    }}>{p.tag}</span>
                  </div>

                  <div style={{ flex: 1 }} />

                  {/* Stat callout */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '24px 32px 32px' }}>
                    <div style={{
                      background: 'rgba(7,16,56,0.85)', backdropFilter: 'blur(8px)',
                      border: '0.5px solid rgba(255,102,0,0.35)', borderRadius: '6px',
                      padding: '18px 22px',
                    }}>
                      <p style={{
                        fontFamily: 'Space Mono, monospace', fontWeight: 700,
                        fontSize: 'clamp(28px, 3.4vw, 42px)',
                        color: 'var(--orange)', lineHeight: 1, marginBottom: '8px',
                      }}>{p.stat.value}</p>
                      <p style={{
                        fontFamily: 'Poppins, sans-serif', fontSize: '12px',
                        color: 'var(--gray-1)', lineHeight: 1.55,
                      }}>{p.stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — tall column of pillar text frames */}
            <div>
              {PILLARS.map((p, i) => (
                <div key={p.n} className="pillar-text" data-pillar-index={i} style={{
                  minHeight: '95vh', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', paddingTop: '48px', paddingBottom: '48px',
                }}>
                  <span style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '11px',
                    color: 'var(--orange)', letterSpacing: '0.14em',
                    textTransform: 'uppercase', display: 'block', marginBottom: '12px',
                  }}>Pillar {p.n} · {p.tag}</span>
                  <h3 style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 400,
                    color: 'var(--white)', lineHeight: 0.95, letterSpacing: '0.02em',
                    marginBottom: '24px',
                  }}>{p.title}</h3>
                  <p style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: '17px',
                    color: 'var(--gray-1)', lineHeight: 1.7, marginBottom: '36px',
                  }}>{p.body}</p>

                  <ul style={{
                    listStyle: 'none', padding: 0, marginBottom: '40px',
                    display: 'flex', flexDirection: 'column', gap: '16px',
                    borderLeft: '1px solid rgba(255,102,0,0.25)',
                    paddingLeft: '24px',
                  }}>
                    {p.points.map((pt, k) => (
                      <li key={k} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <span style={{
                          fontFamily: 'Space Mono, monospace', fontSize: '11px',
                          fontWeight: 700, color: 'var(--orange)', paddingTop: '5px',
                          minWidth: '26px',
                        }}>0{k + 1}</span>
                        <span style={{
                          fontFamily: 'Poppins, sans-serif', fontSize: '15px',
                          color: 'var(--cream)', lineHeight: 1.65,
                        }}>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '10px',
                    color: 'var(--gray-2)', letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}>{p.n} / 05</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== AGENDA — horizontal timeline scrub ===================== */}
      <section style={{ position: 'relative', overflow: 'hidden',
        paddingTop: 'clamp(80px, 12vh, 140px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG.agendaBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.08,
        }} />

        {/* Section header (constrained width) */}
        <div style={{ ...containerStyle, position: 'relative', zIndex: 1,
          maxWidth: '780px', padding: '0 32px', marginBottom: '72px' }}>
          <RevealSection>
            <span style={eyebrow}>The Day · June 25, 2026</span>
            <h2 style={{ ...sectionH, marginTop: '16px' }}>
              Four hours. Five sessions. One implementation plan.
            </h2>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '17px',
              color: 'var(--gray-1)', lineHeight: 1.65, marginTop: '20px', maxWidth: '620px' }}>
              Scroll through the day. Every hour stacks on the last — the morning sets the stakes,
              the afternoon hands you the system, and the bonus hour gets you in the room with Kevin live.
            </p>
          </RevealSection>
        </div>

        {/* Horizontal scroll track */}
        <div className="agenda-horizontal-wrapper" style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          {/* The connecting timeline rail — fixed behind the cards */}
          <div className="agenda-rail" style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,102,0,0.5) 8%, rgba(255,102,0,0.5) 92%, transparent 100%)',
            transform: 'translateY(-50%)', zIndex: 0,
          }} />

          <div className="agenda-track" style={{
            display: 'flex', gap: '32px',
            width: 'max-content',
            padding: '40px 64px 80px',
            alignItems: 'center', position: 'relative', zIndex: 1,
          }}>
            {SESSIONS.map((s, i) => (
              <div key={i} className="agenda-card" style={{
                width: '440px', flexShrink: 0,
                display: 'flex', flexDirection: 'column', gap: '20px',
              }}>
                {/* Time + hour label */}
                <div>
                  <p style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '14px',
                    fontWeight: 700, color: 'var(--orange)', letterSpacing: '0.06em',
                  }}>{s.time} ET</p>
                  <p style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '10px',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: s.vip ? 'var(--orange)' : 'var(--gray-1)',
                    marginTop: '4px',
                  }}>{s.hour}</p>
                </div>

                {/* Timeline dot sitting on the rail */}
                <div style={{
                  position: 'relative', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                }}>
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: s.vip ? 'var(--orange)' : 'var(--navy-3)',
                    border: '2px solid var(--orange)',
                    boxShadow: s.vip
                      ? '0 0 20px rgba(255,102,0,0.6)'
                      : '0 0 12px rgba(255,102,0,0.25)',
                  }} />
                </div>

                {/* Card body */}
                <div style={{
                  background: 'rgba(11,26,80,0.6)', backdropFilter: 'blur(8px)',
                  border: `0.5px solid ${s.vip ? 'rgba(255,102,0,0.5)' : 'var(--border)'}`,
                  borderRadius: '8px', padding: '28px 28px 32px',
                  borderTop: s.vip ? '2px solid var(--orange)' : '0.5px solid var(--border)',
                }}>
                  <div style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '10px',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--gray-2)', marginBottom: '12px',
                  }}>{String(i + 1).padStart(2, '0')} of {SESSIONS.length}</div>
                  <h3 style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(28px, 3.4vw, 38px)', fontWeight: 400,
                    color: 'var(--white)', lineHeight: 0.97, letterSpacing: '0.02em',
                    marginBottom: '16px',
                  }}>{s.title}</h3>
                  <p style={{
                    fontFamily: 'Poppins, sans-serif', fontSize: '14px',
                    color: 'var(--gray-1)', lineHeight: 1.65,
                  }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="agenda-hint" style={{
          textAlign: 'center', marginTop: '20px',
          fontFamily: 'Space Mono, monospace', fontSize: '10px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--gray-2)', opacity: 0.7,
        }}>← scroll →</div>
      </section>

      {/* ===================== KEVIN ===================== */}
      <section style={{ ...sectionPad, background: 'var(--navy-2)' }}>
        <div style={{ ...containerStyle, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>

          <RevealSection>
            <div className="kevin-cutout-wrap" style={{
              position: 'relative', paddingTop: '120px', overflow: 'visible',
            }}>
              <BorderGlow
                backgroundColor="var(--navy-2)"
                borderRadius={10}
                glowRadius={50}
                glowIntensity={1.2}
                edgeSensitivity={20}
                glowColor="24 100 55"
                colors={['#FF6600', '#1A7BFF', '#FF7A1A']}
                className="kevin-portrait"
              >
                <div style={{
                  position: 'relative', borderRadius: 10, overflow: 'hidden',
                  height: '460px',
                  background: `
                    radial-gradient(circle at 30% 0%, rgba(255,102,0,0.18) 0%, transparent 55%),
                    radial-gradient(circle at 80% 100%, rgba(26,123,255,0.22) 0%, transparent 60%),
                    linear-gradient(180deg, var(--navy-3) 0%, var(--navy) 100%)
                  `,
                }}>
                  {/* Subtle pattern lines */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.06,
                    backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 24px, rgba(255,255,255,0.4) 24px 25px)',
                  }} />
                  {/* Name plate at bottom */}
                  <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px' }}>
                    <span style={eyebrow}>Your Host</span>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px',
                      fontWeight: 400, color: 'var(--white)', lineHeight: 1, letterSpacing: '0.02em',
                      marginTop: '8px' }}>
                      Kevin Spann
                    </p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px',
                      color: 'var(--orange)', letterSpacing: '0.18em', textTransform: 'uppercase',
                      marginTop: '10px' }}>
                      Allstate Agent · 40 Years
                    </p>
                  </div>
                </div>
              </BorderGlow>
              {/* Cutout portrait — overlaps the frame */}
              <img
                src={IMG.kevin}
                alt="Kevin Spann"
                loading="lazy"
                className="kevin-cutout-img"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  height: '480px',
                  width: 'auto',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.55)) drop-shadow(0 0 60px rgba(255,102,0,0.18))',
                  zIndex: 2,
                }}
              />
            </div>
          </RevealSection>

          <RevealSection delay={0.15}>
            <span style={eyebrow}>The Host</span>
            <h2 style={{ ...sectionH, marginTop: '16px', marginBottom: '24px' }}>
              The agent who built it both ways.
            </h2>
            <p style={{ fontFamily: 'Poppins', fontSize: '17px', color: 'var(--gray-1)',
              lineHeight: 1.75, marginBottom: '20px' }}>
              Kevin has been an Allstate agent for 40 years. He built a $15M book the old way —
              cold calls, referrals, the same playbook every captive agent runs.
            </p>
            <p style={{ fontFamily: 'Poppins', fontSize: '17px', color: 'var(--gray-1)',
              lineHeight: 1.75, marginBottom: '20px' }}>
              Then in 2024, he rebuilt the entire operation around Claude, a multi-VA team,
              GHL automation, and a hyperlocal social system. The result: same revenue, half the
              hours, and a 92%+ retention rate his competitors can't touch.
            </p>
            <p style={{ fontFamily: 'Poppins', fontSize: '17px', color: 'var(--gray-1)',
              lineHeight: 1.75, marginBottom: '32px' }}>
              In January 2026, 40 agents flew to New York to learn the system in person.
              This June, he's opening the room to 400.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[['40', 'Years as an agent'],['$15M', 'Book size'],['92%+', 'Retention']].map(([n, l]) => (
                <div key={n}>
                  <p style={{ fontFamily: 'Space Mono', fontSize: '32px', fontWeight: 500,
                    color: 'var(--orange)', lineHeight: 1 }}>{n}</p>
                  <p style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'var(--gray-1)',
                    marginTop: '6px', lineHeight: 1.4 }}>{l}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section style={{ ...sectionPad, position: 'relative' }}>
        <div style={containerStyle}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span style={eyebrow}>From the January Room</span>
              <h2 style={{ ...sectionH, marginTop: '16px', maxWidth: '720px', margin: '16px auto 0' }}>
                What agents said after the NYC session.
              </h2>
            </div>
          </RevealSection>

          <div style={{ display: 'grid', gap: '24px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {TESTIMONIALS.map((t, i) => (
              <RevealSection key={t.name} delay={i * 0.12} style={{ height: '100%' }}>
                <BorderGlow
                  backgroundColor="var(--navy-2)"
                  borderRadius={8}
                  glowRadius={32}
                  glowIntensity={0.9}
                  edgeSensitivity={28}
                  glowColor="24 100 55"
                  colors={['#FF6600', '#1A7BFF', '#FF7A1A']}
                  className="testimonial-card"
                >
                  <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '380px' }}>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '48px', fontWeight: 700,
                      color: 'var(--orange)', lineHeight: 0.5, marginBottom: '20px',
                      display: 'block', fontStyle: 'italic' }}>"</span>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '17px',
                      fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.6, flex: 1,
                      marginBottom: '24px' }}>
                      {t.quote}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px',
                      paddingTop: '20px', borderTop: '0.5px solid var(--border)' }}>
                      <img src={t.img} alt={t.name} loading="lazy" style={{
                        width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover',
                        border: '1px solid rgba(255,102,0,0.3)',
                      }} />
                      <div>
                        <p style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500,
                          color: 'var(--cream)' }}>{t.name}</p>
                        <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
                          marginTop: '2px' }}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </BorderGlow>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section style={{ ...sectionPad, background: 'var(--navy-2)' }}>
        <div style={{ ...containerStyle, maxWidth: '820px' }}>
          <RevealSection>
            <span style={eyebrow}>Questions, answered</span>
            <h2 style={{ ...sectionH, marginTop: '16px', marginBottom: '48px' }}>
              The things you're already wondering.
            </h2>
          </RevealSection>

          {FAQS.map((f, i) => (
            <RevealSection key={i} delay={i * 0.06}>
              <div style={{ borderTop: '0.5px solid var(--border)',
                borderBottom: i === FAQS.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '24px 0', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', cursor: 'pointer', textAlign: 'left',
                    color: 'var(--white)',
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px',
                    fontWeight: 400, letterSpacing: '0.03em', lineHeight: 1,
                  }}>
                  <span>{f.q}</span>
                  <span style={{ fontFamily: 'Space Mono', fontSize: '20px', color: 'var(--orange)',
                    marginLeft: '20px', flexShrink: 0,
                    transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease' }}>+</span>
                </button>
                <div style={{
                  maxHeight: openFaq === i ? '300px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease, padding 0.3s ease',
                  paddingBottom: openFaq === i ? '24px' : '0',
                }}>
                  <p style={{ fontFamily: 'Poppins', fontSize: '16px',
                    color: 'var(--gray-1)', lineHeight: 1.7, maxWidth: '720px' }}>
                    {f.a}
                  </p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section style={{ position: 'relative', overflow: 'hidden',
        padding: 'clamp(100px, 16vh, 180px) 32px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG.finalBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.18, filter: 'blur(2px)',
        }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(14,32,96,0.4) 0%, var(--navy) 70%)' }} />
        <GradientOrb style={{ width: 600, height: 600, background: 'rgba(255,102,0,0.12)',
          top: '-15%', left: '50%', transform: 'translateX(-50%)' }} />

        <div style={{ ...containerStyle, position: 'relative', zIndex: 1,
          maxWidth: '820px', textAlign: 'center' }}>
          <RevealSection>
            <span style={eyebrow}>June 25, 2026 · 11 AM ET</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 400,
              color: 'var(--white)', lineHeight: 0.95, letterSpacing: '0.02em',
              marginTop: '20px', marginBottom: '28px' }}>
              The room is open. The clock is not.
            </h2>
            <p style={{ fontFamily: 'Poppins', fontSize: '18px', color: 'var(--gray-1)',
              lineHeight: 1.65, maxWidth: '620px', margin: '0 auto 48px' }}>
              Take the 5-minute audit to see exactly which session is built for your tier —
              or skip straight to claiming a seat. Both routes are free.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center',
              flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
              <button ref={ctaFinalPrimaryRef} onClick={goQuiz} style={{
                padding: '20px 36px',
                background: 'var(--orange)', color: 'var(--navy)',
                border: 'none', borderRadius: '4px',
                fontFamily: 'Poppins', fontSize: '17px', fontWeight: 600,
                cursor: 'pointer',
              }}>
                Start the 5-Minute Audit →
              </button>
              <button ref={ctaFinalSecondaryRef} onClick={goRegister} style={{
                padding: '20px 36px',
                background: 'transparent', color: 'var(--cream)',
                border: '1px solid rgba(255,102,0,0.5)', borderRadius: '4px',
                fontFamily: 'Poppins', fontSize: '17px', fontWeight: 500,
                cursor: 'pointer',
              }}>
                Reserve My Free Seat
              </button>
            </div>

            <p style={{ fontFamily: 'Space Mono', fontSize: '12px', color: 'var(--gray-2)',
              letterSpacing: '0.06em' }}>
              Free general admission · No credit card required
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ padding: '40px 32px', borderTop: '0.5px solid var(--border)',
        background: 'var(--navy)' }}>
        <div style={{ ...containerStyle, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
            letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Future Proof Agent Summit · 2026
          </span>
          <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-2)' }}>
            Hosted by Kevin Spann · kevinspanninsurance.com
          </span>
        </div>
      </footer>
    </PageWrapper>
  );
}
