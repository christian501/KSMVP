import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnelStore } from '../store/funnelStore';

const CATS = [
  { id:'ldr', title:'Leadership & AI Mindset', items:[
    'Leadership understands AI use in insurance',
    'Owner personally uses AI weekly',
    'AI is viewed as a strategic advantage',
    'Clear 12-month AI vision exists',
  ]},
  { id:'stf', title:'Staffing & Capacity', items:[
    'Roles and responsibilities are documented',
    'Low-value tasks are automated or delegated',
    'Growth does not require immediate hiring',
    'Backup systems exist when staff is unavailable',
  ]},
  { id:'sal', title:'Sales & Service Operations', items:[
    'Leads receive immediate or automated responses',
    'After-hours calls are handled intelligently',
    'Follow-ups are automated and tracked',
    'Opportunities do not fall through cracks',
  ]},
  { id:'dat', title:'Data, Dashboards & Decisions', items:[
    'KPIs are reviewed weekly',
    'Reports are easy to access and analyze',
    'Decisions are data-driven, not gut-driven',
    'AI is used to identify trends or risks',
  ]},
  { id:'mkt', title:'Marketing & Lead Generation', items:[
    'Content is planned and consistent',
    'Social comments and DMs are responded to automatically',
    'Leads are nurtured without manual chasing',
    'Old leads are systematically reactivated',
  ]},
  { id:'ret', title:'Retention & Client Experience', items:[
    'At-risk clients are identified early',
    'Renewals are proactive, not reactive',
    'Clients receive ongoing education',
    'Retention strategy is documented',
  ]},
  { id:'cmp', title:'Compliance & AI Governance', items:[
    'Clear AI usage policies exist',
    'Approved AI tools and prompts are documented',
    'Staff trained on compliant AI usage',
    'Leadership confident in AI risk management',
  ]},
];

const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/oMzGSeUOwLmwHY8dRldd/webhook-trigger/c55ca01e-6d78-4ad8-a84e-7832f51a4c0c';

function tierOf(idxStr) {
  const n = parseFloat(idxStr);
  if (n >= 9) return { label:'AI-FIRST',    color:'#16A34A', bg:'rgba(22,163,74,.25)' };
  if (n >= 7) return { label:'AI-ENABLED',  color:'#2563EB', bg:'rgba(37,99,235,.25)' };
  if (n >= 4) return { label:'AI-AWARE',    color:'#F4831F', bg:'rgba(244,131,31,.25)' };
  return         { label:'AI-EXPOSED',  color:'#DC2626', bg:'rgba(220,38,38,.25)' };
}
function scoreColor(v) { return v >= 8 ? '#16A34A' : v >= 5 ? '#F4831F' : '#DC2626'; }
function barColor(pct) {
  return pct >= 80 ? '#16A34A' : pct >= 60 ? '#2563EB' : pct >= 40 ? '#F4831F' : '#DC2626';
}

const REQUIRED = [
  ['agencyName', 'Agency Name'],
  ['ownerName',  'Owner / Principal Name'],
  ['email',      'Email Address'],
  ['phone',      'Phone Number'],
  ['location',   'Location (City, State)'],
];

const initialScores = (() => {
  const o = {};
  CATS.forEach(c => c.items.forEach((_, i) => { o[`${c.id}-${i}`] = 5; }));
  return o;
})();

export default function QuizPage() {
  const navigate = useNavigate();
  const setLead = useFunnelStore(s => s.setLead);
  const setScore = useFunnelStore(s => s.setScore);
  const setRegistered = useFunnelStore(s => s.setRegistered);

  const [form, setForm] = useState({
    agencyName: '', ownerName: '', email: '', phone: '', location: '', years: '',
    totalTeam: '', st1: '', st2: '', st3: '', st4: '', st5: '',
    bigBreak: '', aiTime: '',
  });
  const [pills, setPills] = useState({
    bookSize: '', newBiz: '', vol: '', hire: '', ppl: '', conf: '',
    workPile: [],
  });
  const [scores, setScores] = useState(initialScores);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, state: 'success' });
  const lastPayloadRef = useRef(null);
  const errorFieldsRef = useRef(new Set());

  const catTotals = useMemo(() => CATS.map(c => {
    const sum = c.items.reduce((s, _, i) => s + (scores[`${c.id}-${i}`] || 5), 0);
    return { id: c.id, title: c.title, sum, pct: Math.round((sum/40)*100) };
  }), [scores]);

  const grand = catTotals.reduce((s, c) => s + c.sum, 0);
  const idx = (grand / 28).toFixed(1);
  const gPct = (grand / 280) * 100;
  const t = tierOf(idx);

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const setPill = (group, val) => setPills(prev => ({ ...prev, [group]: val }));
  const togglePill = (group, val) => setPills(prev => {
    const arr = prev[group];
    return { ...prev, [group]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });
  const setSlider = (catId, i, val) => setScores(prev => ({ ...prev, [`${catId}-${i}`]: parseInt(val, 10) }));

  const validate = () => {
    const missing = [];
    const bad = new Set();
    REQUIRED.forEach(([k, label]) => {
      if (!form[k].trim()) { missing.push(label); bad.add(k); }
    });
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      missing.push('Email Address (please enter a valid email)');
      bad.add('email');
    }
    errorFieldsRef.current = bad;
    setErrors(missing);
    if (missing.length) {
      requestAnimationFrame(() => {
        const first = [...bad][0];
        const el = document.getElementById(`ks-${first}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return false;
    }
    return true;
  };

  const buildPayload = () => {
    const owner = form.ownerName.trim();
    const [firstName, ...rest] = owner.split(' ');
    const catScores = {};
    CATS.forEach(c => {
      const sum = c.items.reduce((s, _, i) => s + scores[`${c.id}-${i}`], 0);
      catScores[c.title] = `${sum}/40`;
      c.items.forEach((item, i) => {
        catScores[`${c.title} - ${item}`] = `${scores[`${c.id}-${i}`]}/10`;
      });
    });
    let summary = 'AI READINESS SCORECARD\n========================================\n';
    summary += `Total Score:  ${grand} / 280\nIndex:        ${idx} / 10\nTier:         ${t.label}\n----------------------------------------\n\nCATEGORY BREAKDOWN\n----------------------------------------\n`;
    CATS.forEach(c => {
      const sum = c.items.reduce((s, _, i) => s + scores[`${c.id}-${i}`], 0);
      const pct = Math.round((sum/40)*100);
      summary += `${c.title}: ${sum}/40  (${pct}%)\n`;
      c.items.forEach((item, i) => { summary += `  ${scores[`${c.id}-${i}`]}/10  ${item}\n`; });
      summary += '\n';
    });
    return {
      firstName: firstName || owner,
      lastName: rest.join(' '),
      email: form.email.trim(),
      phone: form.phone.trim() || '(not provided)',
      ai_audit_agency_name: form.agencyName.trim() || '(not provided)',
      ai_audit_location: form.location.trim() || '(not provided)',
      years_in_business: form.years.trim() || '(not provided)',
      book_size: pills.bookSize || '(not selected)',
      monthly_new_business: pills.newBiz || '(not selected)',
      total_team_members: form.totalTeam.trim() || '(not provided)',
      staff__licensed_sales: form.st1.trim() || '(not provided)',
      staff__serviceretention: form.st2.trim() || '(not provided)',
      staff__hybrid: form.st3.trim() || '(not provided)',
      staff__managementops: form.st4.trim() || '(not provided)',
      staff__virtualremote: form.st5.trim() || '(not provided)',
      work_piles_up_at: pills.workPile.join(', ') || '(not selected)',
      biggest_break_point: form.bigBreak.trim() || '(not provided)',
      volume_increase_ready: pills.vol || '(not selected)',
      hiring_status: pills.hire || '(not selected)',
      people_challenge: pills.ppl || '(not selected)',
      ai_confidence_110: pills.conf || '(not selected)',
      ai_time_reinvest: form.aiTime.trim() || '(not provided)',
      ai_readiness_index: idx,
      ai_readiness_tier: t.label,
      total_audit_score: grand,
      audit_submitted_at: new Date().toISOString(),
      scorecard_summary: summary,
      tags: `AI Audit Submitted, Tier: ${t.label}`,
      source: 'AI-First Agency Audit — Summit Funnel',
    };
  };

  const sendWebhook = async (payload) => {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (e) { return false; }
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const payload = buildPayload();
    lastPayloadRef.current = payload;
    setLead({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      agencyName: form.agencyName.trim(),
    });
    const pillarScores = {};
    catTotals.forEach(c => { pillarScores[c.id] = c.sum; });
    setScore(grand, pillarScores, t.label);
    setRegistered();
    const ok = await sendWebhook(payload);
    setSubmitting(false);
    setModal({ open: true, state: ok ? 'success' : 'error' });
  };

  const onRetry = async () => {
    setModal({ open: false, state: 'success' });
    if (!lastPayloadRef.current) return;
    setSubmitting(true);
    const ok = await sendWebhook(lastPayloadRef.current);
    setSubmitting(false);
    setModal({ open: true, state: ok ? 'success' : 'error' });
  };

  const closeModal = () => {
    setModal({ open: false, state: 'success' });
    navigate('/vault');
  };

  const errStyle = (key) => errorFieldsRef.current.has(key)
    ? { borderColor: '#DC2626' } : null;

  // ---------- render helpers ----------
  const Pill = ({ group, label, multi }) => {
    const active = multi ? pills[group].includes(label) : pills[group] === label;
    return (
      <div className={`pill ${active ? 'active' : ''}`}
        onClick={() => multi ? togglePill(group, label) : setPill(group, label)}>
        {label}
      </div>
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ks-audit">
        <header className="kh">
          <div className="kh-bar" />
          <div className="kh-inner">
            <div className="kh-brand">
              <div className="eyebrow">KEVIN SPANN · WE MAKE AI EASY</div>
              <h1><span>AI-FIRST</span> AGENCY AUDIT</h1>
              <p className="sub">Complete all sections · Receive your free AI Readiness Analysis</p>
            </div>
            <div className="kh-badge">
              <strong>kevinspann.com</strong>
              AI First Bootcamp<br />Certified AI Consultant
            </div>
          </div>
        </header>

        <div className="ks-strip">
          <div className="ks-strip-inner">
            <span className="ks-strip-label">AI READINESS</span>
            <div className="ks-bar-wrap">
              <div className="ks-bar-fill" style={{ width: `${gPct}%`, background: t.color }} />
            </div>
            <span className="ks-idx" style={{ color: t.color }}>{idx}</span>
            <span className="ks-tier" style={{ color: t.color, background: t.bg }}>{t.label}</span>
          </div>
        </div>

        <main className="km">

          {/* PART 1: AGENCY SNAPSHOT */}
          <div className="kc">
            <div className="kc-label">PART 1 OF 2 · AGENCY SNAPSHOT</div>
            <div className="kc-head">Tell Us About Your Agency</div>
            <p className="kc-sub">Reviewed personally by Kevin Spann before your strategy session.</p>

            <div className="g2">
              <div className="fg">
                <label className="fl" htmlFor="ks-agencyName">Agency Name</label>
                <input id="ks-agencyName" type="text" placeholder="e.g. Smith Insurance Agency"
                  autoComplete="organization" value={form.agencyName} style={errStyle('agencyName')}
                  onChange={e => setField('agencyName', e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="ks-ownerName">Owner / Principal Name</label>
                <input id="ks-ownerName" type="text" placeholder="Your full name"
                  autoComplete="name" value={form.ownerName} style={errStyle('ownerName')}
                  onChange={e => setField('ownerName', e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="ks-email">Email Address</label>
                <input id="ks-email" type="email" placeholder="your@email.com"
                  autoComplete="email" value={form.email} style={errStyle('email')}
                  onChange={e => setField('email', e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="ks-phone">Phone Number</label>
                <input id="ks-phone" type="tel" placeholder="(555) 000-0000"
                  autoComplete="tel" value={form.phone} style={errStyle('phone')}
                  onChange={e => setField('phone', e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="ks-location">Location (City, State)</label>
                <input id="ks-location" type="text" placeholder="Chicago, IL"
                  value={form.location} style={errStyle('location')}
                  onChange={e => setField('location', e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="ks-years">Years in Business</label>
                <input id="ks-years" type="number" placeholder="e.g. 12" min="0"
                  value={form.years} onChange={e => setField('years', e.target.value)} />
              </div>
            </div>

            <div className="fg" style={{ marginTop: 12 }}>
              <label className="fl">Approximate Book Size</label>
              <div className="pg">
                {['Under $2M','$2M–$5M','$5M–$10M','$10M+'].map(v => <Pill key={v} group="bookSize" label={v} />)}
              </div>
            </div>

            <div className="fg">
              <label className="fl">Average Monthly New Business Items</label>
              <div className="pg">
                {['Under 25','25–50','50–100','100+'].map(v => <Pill key={v} group="newBiz" label={v} />)}
              </div>
            </div>

            <div className="fg" style={{ marginTop: 12 }}>
              <label className="fl" htmlFor="ks-totalTeam">Total Team Members</label>
              <input id="ks-totalTeam" type="number" placeholder="0" className="narrow" min="0"
                value={form.totalTeam} onChange={e => setField('totalTeam', e.target.value)} />
            </div>

            <div className="fg" style={{ marginTop: 12 }}>
              <label className="fl">Staff Breakdown by Role</label>
              <table className="st">
                <thead>
                  <tr><th>Role Type</th><th style={{ textAlign: 'center' }}># of Staff</th></tr>
                </thead>
                <tbody>
                  {[
                    ['st1','Licensed Sales'],
                    ['st2','Service / Retention'],
                    ['st3','Hybrid (Sales + Service)'],
                    ['st4','Management / Ops'],
                    ['st5','Virtual / Remote'],
                  ].map(([k, label]) => (
                    <tr key={k}>
                      <td>{label}</td>
                      <td><input type="number" placeholder="0" min="0"
                        value={form[k]} onChange={e => setField(k, e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CAPACITY & OPERATIONS */}
          <div className="kc">
            <div className="kc-label">CAPACITY &amp; OPERATIONS</div>

            <div className="fg">
              <label className="fl">Where does work pile up most often? (select all that apply)</label>
              <div className="pg">
                {['Follow-ups','Endorsements','Quoting','Renewals','Marketing / Admin'].map(v => (
                  <Pill key={v} group="workPile" label={v} multi />
                ))}
              </div>
            </div>

            <div className="fg">
              <label className="fl" htmlFor="ks-bigBreak">If one key team member were unavailable, what would break first?</label>
              <input id="ks-bigBreak" type="text" placeholder="Your single biggest point of failure..."
                value={form.bigBreak} onChange={e => setField('bigBreak', e.target.value)} />
            </div>

            <div className="g3" style={{ marginTop: 4 }}>
              <div className="fg">
                <label className="fl">Handle 20% volume increase?</label>
                <div className="pg">
                  {['Yes','Maybe','No'].map(v => <Pill key={v} group="vol" label={v} />)}
                </div>
              </div>
              <div className="fg">
                <label className="fl">Hiring status</label>
                <div className="pg">
                  {['Hiring','Considering','Avoiding'].map(v => <Pill key={v} group="hire" label={v} />)}
                </div>
              </div>
              <div className="fg">
                <label className="fl">Biggest people challenge</label>
                <div className="pg">
                  {['Finding Talent','Training','Retention','Cost'].map(v => <Pill key={v} group="ppl" label={v} />)}
                </div>
              </div>
            </div>

            <div className="fg">
              <label className="fl">AI Confidence Level &nbsp;·&nbsp; 1 = None &nbsp;·&nbsp; 10 = Expert</label>
              <div className="pg">
                {['1','2','3','4','5','6','7','8','9','10'].map(v => <Pill key={v} group="conf" label={v} />)}
              </div>
            </div>

            <div className="fg">
              <label className="fl" htmlFor="ks-aiTime">If AI gave you 10 hours/week back, where would you reinvest that time?</label>
              <textarea id="ks-aiTime" placeholder="e.g. Prospecting, coaching my team, building new revenue streams..."
                value={form.aiTime} onChange={e => setField('aiTime', e.target.value)} />
            </div>
          </div>

          {/* PART 2: SCORECARD */}
          <div className="kc">
            <div className="kc-label">PART 2 OF 2 · AI READINESS SCORECARD</div>
            <div className="kc-head">Score Your Agency</div>
            <p className="kc-sub">1 = Manual / No System &nbsp;·&nbsp; 10 = Fully AI-Enabled &nbsp;·&nbsp; Go with your gut.</p>

            <div>
              {CATS.map((cat, ci) => {
                const sum = cat.items.reduce((s, _, i) => s + scores[`${cat.id}-${i}`], 0);
                return (
                  <div className="ss" key={cat.id}>
                    <div className="ss-hd">
                      <div className="ss-hd-left">
                        <div className="sn">CATEGORY {ci + 1} OF {CATS.length}</div>
                        <div className="st2">{cat.title}</div>
                      </div>
                      <div className="ss-sub">{sum}<span style={{ fontSize: 11, opacity: .6 }}>/40</span></div>
                    </div>
                    <div className="ss-bd">
                      {cat.items.map((item, i) => {
                        const v = scores[`${cat.id}-${i}`];
                        const c = scoreColor(v);
                        return (
                          <div className="sr" key={i}>
                            <div className="sr-top">
                              <span className="sr-lbl">{item}</span>
                              <span className="sr-val" style={{ color: c }}>{v}</span>
                            </div>
                            <input type="range" min="1" max="10" step="1" value={v}
                              style={{ accentColor: c }}
                              onChange={e => setSlider(cat.id, i, e.target.value)} />
                            <div className="rl"><span>1 · Manual</span><span>10 · AI-Enabled</span></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RESULTS */}
          <div className="rb">
            <div className="rb-inner">
              <div className="rb-score">
                <div className="rb-eyebrow">AI READINESS INDEX</div>
                <div className="rb-big" style={{ color: t.color }}>{idx}</div>
                <div className="rb-pts">out of 10.0 &nbsp;·&nbsp; <span>{grand}</span>/280 pts</div>
                <div className="rb-badge" style={{ background: t.bg, color: t.color }}>{t.label}</div>
              </div>
              <div className="rb-cats">
                <div className="rb-cats-label">CATEGORY BREAKDOWN</div>
                <div>
                  {catTotals.map(c => (
                    <div className="cbr" key={c.id}>
                      <div className="cbr-top"><span>{c.title}</span><strong>{c.sum}/40</strong></div>
                      <div className="cbr-track">
                        <div className="cbr-fill" style={{ width: `${c.pct}%`, background: barColor(c.pct) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rb-divider">
              1–3: AI-Exposed &nbsp;·&nbsp; 4–6: AI-Aware &nbsp;·&nbsp; 7–8: AI-Enabled &nbsp;·&nbsp; 9–10: AI-First
            </div>
          </div>

          {/* SUBMIT */}
          <div className="kc">
            <div className="kc-label">SUBMIT YOUR AUDIT</div>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 1.6 }}>
              Kevin will personally review your results and reach out within 24–48 hours to schedule your
              complimentary AI Strategy Session — a focused look at your top gaps and your fastest path to
              becoming AI-First.
            </p>
            <button className="sub-btn" disabled={submitting} onClick={onSubmit}>
              {submitting ? 'Submitting...' : 'SUBMIT MY AUDIT & BOOK MY STRATEGY SESSION →'}
            </button>
            {errors.length > 0 && (
              <div style={{
                marginTop: 14, padding: '12px 16px', background: '#FFF5F0',
                border: '1px solid #FFCAB4', borderRadius: 8, fontSize: 13,
                color: '#991B1B', lineHeight: 1.7,
              }}>
                <strong>Please complete the following required fields in Part 1:</strong><br />
                {errors.map(e => <div key={e}>&nbsp;&nbsp;· {e}</div>)}
              </div>
            )}
            <p className="sub-note">
              Clicking submit sends your results to Kevin and continues to your seat confirmation.
              You'll automatically receive a copy at the email address you entered above.
            </p>
          </div>
        </main>

        <footer className="kf">
          <strong>Kevin Spann · We Make AI Easy</strong> &nbsp;·&nbsp;
          kevinspann.com &nbsp;·&nbsp; AI First Bootcamp &nbsp;·&nbsp;
          Certified AI Consultant in the Allstate Network
        </footer>

        {modal.open && (
          <div className="ks-modal-overlay" onClick={(e) => { if (e.target.classList.contains('ks-modal-overlay')) closeModal(); }}>
            <div className="ks-modal-card">
              {modal.state === 'success' ? (
                <>
                  <div className="ks-modal-icon" style={{ background: '#16A34A' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="ks-modal-title">Audit Submitted!</div>
                  <div className="ks-modal-body">
                    Kevin has received your results and will personally review your AI Readiness Index before reaching out.
                  </div>
                  <div className="ks-modal-steps">
                    {[
                      ['1','Check your inbox','— a confirmation copy of your results is on its way to the email you provided.'],
                      ['2','Kevin will reach out within ','24–48 hours to schedule your complimentary AI Strategy Session.'],
                      ['3','In the meantime — continue to', 'reserve your free seat at the Future Proof Agent Summit.'],
                    ].map(([n, head, tail], i) => (
                      <div key={n} className="ks-step">
                        <div className="ks-step-num" style={{
                          background: i === 2 ? '#F4831F' : '#1C2E5E',
                          color: i === 2 ? '#fff' : '#F4831F',
                        }}>{n}</div>
                        <div className="ks-step-text">
                          <strong>{head}</strong> {tail}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="ks-modal-btn" onClick={closeModal}>Continue →</button>
                </>
              ) : (
                <>
                  <div className="ks-modal-icon" style={{ background: '#DC2626' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="ks-modal-title">Something went wrong</div>
                  <div className="ks-modal-body">
                    Your submission did not go through. Please try again — your answers are still saved.
                  </div>
                  <button className="ks-modal-btn" onClick={onRetry}>Try submitting again</button>
                  <button className="ks-modal-btn-secondary" onClick={closeModal}>Continue anyway</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.ks-audit *,.ks-audit *::before,.ks-audit *::after{box-sizing:border-box;margin:0;padding:0}
.ks-audit{
  --navy:#1C2E5E;--navy-deep:#111D3C;--orange:#F4831F;--white:#FFFFFF;
  --off-white:#F7F8FC;--border:#DDE3F0;--gray-1:#2D3748;--gray-2:#64748B;--gray-3:#94A3B8;
  --fh:'Barlow Condensed','Arial Narrow',Arial,sans-serif;
  --fb:'Barlow','Segoe UI',Arial,sans-serif;
  font-family:var(--fb);font-size:15px;line-height:1.5;color:var(--gray-1);
  background:var(--off-white);min-height:100vh;
}
.ks-audit .kh{background:var(--navy)}
.ks-audit .kh-bar{height:5px;background:var(--orange)}
.ks-audit .kh-inner{max-width:780px;margin:0 auto;padding:20px 20px 16px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.ks-audit .kh-brand .eyebrow{font-family:var(--fh);font-size:10px;letter-spacing:3px;color:var(--orange);font-weight:700;margin-bottom:4px}
.ks-audit .kh-brand h1{font-family:var(--fh);font-size:clamp(22px,5vw,30px);font-weight:900;color:var(--white);line-height:1.1}
.ks-audit .kh-brand h1 span{color:var(--orange)}
.ks-audit .kh-brand .sub{font-size:12px;color:#8AA8D4;margin-top:4px}
.ks-audit .kh-badge{text-align:right;color:#8AA8D4;font-size:11px;line-height:1.6;white-space:nowrap;flex-shrink:0}
.ks-audit .kh-badge strong{color:var(--orange);display:block;font-size:13px}

.ks-audit .ks-strip{background:var(--navy-deep);padding:10px 20px;border-bottom:3px solid var(--orange);position:sticky;top:0;z-index:999}
.ks-audit .ks-strip-inner{max-width:780px;margin:0 auto;display:flex;align-items:center;gap:12px}
.ks-audit .ks-strip-label{font-family:var(--fh);font-size:10px;letter-spacing:2px;color:#8AA8D4;font-weight:700;white-space:nowrap}
.ks-audit .ks-bar-wrap{flex:1;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden}
.ks-audit .ks-bar-fill{height:100%;border-radius:4px;background:var(--orange);width:50%;transition:width .3s ease,background .3s ease}
.ks-audit .ks-idx{font-family:var(--fh);font-size:22px;font-weight:900;color:var(--orange);min-width:44px;text-align:right;transition:color .3s}
.ks-audit .ks-tier{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:1.5px;padding:3px 9px;border-radius:12px;white-space:nowrap;background:rgba(244,131,31,0.2);color:var(--orange);transition:background .3s,color .3s}

.ks-audit .km{max-width:780px;margin:0 auto;padding:20px 16px 48px}
.ks-audit .kc{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px}
.ks-audit .kc-label{font-family:var(--fh);font-size:11px;font-weight:700;letter-spacing:2px;color:var(--orange);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.ks-audit .kc-label::after{content:'';flex:1;height:1px;background:var(--border)}
.ks-audit .kc-head{font-family:var(--fh);font-size:20px;font-weight:800;color:var(--navy);margin-bottom:4px}
.ks-audit .kc-sub{font-size:12px;color:var(--gray-2);margin-bottom:18px}

.ks-audit .fg{margin-bottom:14px}
.ks-audit .fl{display:block;font-size:12px;font-weight:600;color:var(--gray-2);margin-bottom:5px;letter-spacing:.3px}
.ks-audit input[type="text"],.ks-audit input[type="email"],.ks-audit input[type="tel"],.ks-audit input[type="number"],.ks-audit textarea{
  width:100%;padding:10px 13px;border:1px solid var(--border);border-radius:7px;font-family:var(--fb);font-size:14px;
  color:var(--gray-1);background:var(--white);transition:border-color .15s,box-shadow .15s;outline:none;-webkit-appearance:none;appearance:none;
}
.ks-audit input:focus,.ks-audit textarea:focus{border-color:var(--navy);box-shadow:0 0 0 3px rgba(28,46,94,.09)}
.ks-audit textarea{resize:vertical;min-height:80px}
.ks-audit .narrow{width:120px !important}

.ks-audit .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ks-audit .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media (max-width:560px){.ks-audit .g2,.ks-audit .g3{grid-template-columns:1fr}}

.ks-audit .pg{display:flex;flex-wrap:wrap;gap:7px;margin-top:6px}
.ks-audit .pill{padding:7px 15px;border-radius:20px;border:1px solid var(--border);background:var(--white);font-family:var(--fb);font-size:13px;cursor:pointer;color:var(--gray-1);transition:all .15s;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;line-height:1.3}
.ks-audit .pill:hover{border-color:var(--orange);color:var(--orange)}
.ks-audit .pill.active{background:rgba(244,131,31,.12);border-color:var(--orange);color:var(--orange);font-weight:600}

.ks-audit .st{width:100%;border-collapse:collapse;margin-top:8px}
.ks-audit .st th{text-align:left;font-size:11px;font-weight:600;color:var(--gray-2);letter-spacing:.5px;padding:6px 8px;border-bottom:1px solid var(--border)}
.ks-audit .st td{padding:8px 8px;border-bottom:1px solid #F0F4FA;font-size:13px}
.ks-audit .st td:last-child{width:100px}
.ks-audit .st td input{width:80px;text-align:center}
.ks-audit .st tr:last-child td{border-bottom:none}

.ks-audit .ss{margin-bottom:10px}
.ks-audit .ss-hd{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--navy);border-radius:8px 8px 0 0}
.ks-audit .ss-hd-left .sn{font-size:10px;color:var(--orange);font-weight:600;letter-spacing:1px;margin-bottom:1px}
.ks-audit .ss-hd-left .st2{font-family:var(--fh);font-size:15px;font-weight:700;color:var(--white);letter-spacing:.5px}
.ks-audit .ss-sub{font-family:var(--fh);font-size:17px;font-weight:700;color:var(--orange)}
.ks-audit .ss-bd{border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:14px 16px;background:var(--white)}
.ks-audit .sr{margin-bottom:16px}
.ks-audit .sr:last-child{margin-bottom:0}
.ks-audit .sr-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px}
.ks-audit .sr-lbl{font-size:13px;color:var(--gray-1);flex:1;line-height:1.4}
.ks-audit .sr-val{font-family:var(--fh);font-size:20px;font-weight:800;min-width:28px;text-align:right;transition:color .2s;flex-shrink:0}

.ks-audit input[type="range"]{width:100%;height:6px;-webkit-appearance:none;appearance:none;background:var(--border);border-radius:3px;outline:none;cursor:pointer;border:none;box-shadow:none;padding:0}
.ks-audit input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:var(--navy);cursor:pointer;border:2px solid var(--white);box-shadow:0 1px 5px rgba(0,0,0,.22);transition:background .2s}
.ks-audit input[type="range"]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--navy);cursor:pointer;border:2px solid var(--white);box-shadow:0 1px 5px rgba(0,0,0,.22)}
.ks-audit .rl{display:flex;justify-content:space-between;font-size:10px;color:var(--gray-3);margin-top:4px}

.ks-audit .rb{background:var(--navy);border-radius:10px;padding:22px;margin-bottom:16px;color:var(--white)}
.ks-audit .rb-inner{display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap;margin-bottom:18px}
.ks-audit .rb-score{min-width:140px}
.ks-audit .rb-eyebrow{font-family:var(--fh);font-size:10px;letter-spacing:2px;color:#8AA8D4;margin-bottom:4px}
.ks-audit .rb-big{font-family:var(--fh);font-size:clamp(52px,10vw,70px);font-weight:900;color:var(--orange);line-height:1;transition:color .3s}
.ks-audit .rb-pts{font-size:12px;color:#8AA8D4;margin-top:2px}
.ks-audit .rb-badge{display:inline-block;font-family:var(--fh);font-size:13px;font-weight:700;letter-spacing:1.5px;padding:5px 16px;border-radius:20px;margin-top:8px;transition:background .3s,color .3s}
.ks-audit .rb-cats{flex:1;min-width:200px}
.ks-audit .rb-cats-label{font-family:var(--fh);font-size:10px;letter-spacing:2px;color:#8AA8D4;margin-bottom:10px}
.ks-audit .rb-divider{font-size:11px;color:#8AA8D4;border-top:1px solid rgba(255,255,255,.1);padding-top:12px;line-height:1.8}
.ks-audit .cbr{margin-bottom:9px}
.ks-audit .cbr-top{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;color:#CBD5E1}
.ks-audit .cbr-top strong{color:var(--white)}
.ks-audit .cbr-track{height:6px;background:rgba(255,255,255,.12);border-radius:3px}
.ks-audit .cbr-fill{height:100%;border-radius:3px;transition:width .4s ease,background .3s}

.ks-audit .sub-btn{width:100%;padding:17px 20px;background:var(--orange);color:var(--white);border:none;border-radius:8px;font-family:var(--fh);font-size:clamp(16px,4vw,20px);font-weight:700;letter-spacing:.8px;cursor:pointer;transition:background .15s,transform .1s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.ks-audit .sub-btn:hover{background:#E07518;transform:translateY(-1px)}
.ks-audit .sub-btn:active{transform:translateY(0)}
.ks-audit .sub-btn:disabled{opacity:.65;cursor:not-allowed;transform:none}
.ks-audit .sub-note{font-size:12px;color:var(--gray-2);text-align:center;margin-top:10px;line-height:1.5}

.ks-audit .kf{background:var(--navy);color:#8AA8D4;text-align:center;padding:16px 20px;font-size:12px;border-top:3px solid var(--orange);line-height:1.7}
.ks-audit .kf strong{color:var(--orange)}

@media (max-width:480px){
  .ks-audit .kh-badge{display:none}
  .ks-audit .ks-strip-label{display:none}
  .ks-audit .km{padding:14px 12px 40px}
  .ks-audit .kc{padding:16px}
  .ks-audit .rb-inner{flex-direction:column;gap:16px}
  .ks-audit .rb-cats{min-width:unset;width:100%}
  .ks-audit .rb-divider{font-size:10px}
  .ks-audit .ss-hd{padding:10px 14px}
  .ks-audit .ss-bd{padding:12px 14px}
  .ks-audit .st th,.ks-audit .st td{padding:6px 5px;font-size:12px}
  .ks-audit .pill{padding:8px 12px;font-size:13px}
}

.ks-audit .ks-modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(17,29,60,0.75);display:flex;align-items:center;justify-content:center;padding:20px}
.ks-audit .ks-modal-card{background:#fff;border-radius:14px;max-width:440px;width:100%;padding:32px 28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
.ks-audit .ks-modal-icon{width:64px;height:64px;border-radius:50%;margin:0 auto 18px;display:flex;align-items:center;justify-content:center}
.ks-audit .ks-modal-title{font-family:var(--fh);font-size:24px;font-weight:800;color:#1C2E5E;margin-bottom:8px}
.ks-audit .ks-modal-body{font-size:14px;color:#64748B;margin-bottom:20px;line-height:1.7}
.ks-audit .ks-modal-steps{text-align:left;margin-bottom:24px}
.ks-audit .ks-step{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
.ks-audit .ks-step-num{width:26px;height:26px;border-radius:50%;font-family:var(--fh);font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ks-audit .ks-step-text{font-size:13px;color:#2D3748;padding-top:4px}
.ks-audit .ks-modal-btn{width:100%;padding:13px;background:#F4831F;color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:var(--fh);font-size:17px;font-weight:700;letter-spacing:.5px;margin-bottom:10px}
.ks-audit .ks-modal-btn-secondary{width:100%;padding:10px;background:transparent;border:1px solid #DDE3F0;border-radius:8px;cursor:pointer;font-size:13px;color:#64748B}
`;
