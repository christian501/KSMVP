import RevealSection from './RevealSection';

const SESSIONS = [
  { time: '11:00 AM', hour: 'Hour 1', title: 'The Future Ready Reality',
    desc: 'The landscape, what\'s coming, and why 2026 is the decision year for every agent in the Allstate network.' },
  { time: '12:00 PM', hour: 'Hour 2', title: 'AI-First New Business',
    desc: 'Lead generation with ALLIE, SIDEKICK, and automated quoting workflows. From 40 client contacts to 400.' },
  { time: '1:00 PM',  hour: 'Hour 3', title: 'AI-First Retention',
    desc: 'Automated renewal touchpoints, retention-tied commission strategy, and how to push above 92% retention.' },
  { time: '2:00 PM',  hour: 'Hour 4', title: 'The Future Proof Formula',
    desc: 'The complete AI + VA + GHL + Social + Hyperlocal system demonstrated live. Implementation plan included.' },
  { time: '3:00 PM',  hour: 'VIP Bonus Hour', title: 'Live Claude Business Planning Workshop',
    desc: 'Kevin runs a live Claude business planning session on screen. Watch the process in real time. VIP only.' },
];

export default function SessionTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {SESSIONS.map((s, i) => (
        <RevealSection key={i} delay={i * 0.08}>
          <div style={{ display: 'flex', gap: '20px', paddingBottom: '24px', position: 'relative' }}>
            {i < SESSIONS.length - 1 && (
              <div style={{ position: 'absolute', left: '35px', top: '28px', bottom: 0,
                width: '1px', background: 'var(--border)' }} />
            )}
            <div style={{ flexShrink: 0, width: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%',
                background: s.hour.includes('VIP') ? 'var(--orange)' : 'var(--navy-4)',
                border: '2px solid var(--orange)', marginTop: '5px' }} />
              <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: 'var(--gray-2)',
                textAlign: 'center', lineHeight: 1.3 }}>{s.time}</span>
            </div>
            <div style={{ paddingTop: '2px' }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '10px', color: 'var(--orange)',
                letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.hour}</span>
              <p style={{ fontFamily: 'Poppins', fontSize: '15px', fontWeight: 500,
                color: 'var(--cream)', margin: '3px 0 4px' }}>{s.title}</p>
              <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-1)',
                lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        </RevealSection>
      ))}
    </div>
  );
}
