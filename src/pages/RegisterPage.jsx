import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageWrapper from '../components/PageWrapper';
import RevealSection from '../components/RevealSection';
import SessionTimeline from '../components/SessionTimeline';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { useFunnelStore } from '../store/funnelStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { firstName, lastName, email, phone, setRegistered } = useFunnelStore();
  const ctaRef = useMagneticButton(0.2);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { firstName, lastName, email, phone },
  });

  const onSubmit = async (data) => {
    setRegistered();
    navigate('/vault');
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid var(--border)', borderRadius: '4px',
    color: 'var(--cream)', fontFamily: 'Poppins', fontSize: '15px',
    outline: 'none', marginBottom: '16px',
  };

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>

          <RevealSection>
            <div style={{ marginBottom: '56px' }}>
              <h1 style={{ fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 400,
                color: 'var(--white)', lineHeight: 0.93, letterSpacing: '0.02em' }}>
                You're almost in the room.
              </h1>
            </div>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '72px', alignItems: 'start' }}>

            <RevealSection delay={0.1}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--gray-2)',
                letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                Reserve your free seat
              </span>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input {...register('firstName')} style={inputStyle} placeholder="First name" />
                  <input {...register('lastName')} style={inputStyle} placeholder="Last name" />
                </div>
                <input {...register('email')} type="email" style={inputStyle} placeholder="Email address" />
                <input {...register('phone')} type="tel" style={inputStyle} placeholder="Phone number" />

                <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-2)',
                  marginBottom: '24px', lineHeight: 1.5 }}>
                  By registering you'll receive summit updates, your personalized session guide,
                  and the pre-summit resource kit via email.
                </p>

                <button ref={ctaRef} type="submit" disabled={isSubmitting} style={{
                  width: '100%', padding: '16px 24px',
                  background: 'var(--orange)', color: 'var(--navy)',
                  border: 'none', borderRadius: '4px',
                  fontFamily: 'Poppins', fontSize: '16px', fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  {isSubmitting ? 'Reserving...' : 'Reserve My Seat — June 25, 2026 →'}
                </button>
              </form>
            </RevealSection>

            <div>
              <RevealSection delay={0.15}>
                <div style={{ marginBottom: '40px',
                  padding: '24px 28px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '0.5px solid var(--border)',
                  borderTop: '2px solid var(--orange)',
                  borderRadius: '4px' }}>
                  <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Summit details
                  </p>
                  {[
                    ['Event',  'The Future Proof Agent Summit: AI-First or Fall Behind'],
                    ['Date',   'Thursday, June 25, 2026'],
                    ['Time',   '11:00 AM – 3:00 PM Eastern Time'],
                    ['Format', 'Live virtual via Zoom · Zoom link emailed 48 hrs before'],
                    ['Cost',   'Free general admission · $37 VIP upgrade available'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '16px',
                      borderBottom: '0.5px solid var(--border)', padding: '10px 0' }}>
                      <span style={{ fontFamily: 'Space Mono', fontSize: '12px',
                        color: 'var(--gray-2)', minWidth: '60px' }}>{k}</span>
                      <span style={{ fontFamily: 'Poppins', fontSize: '14px',
                        color: 'var(--gray-1)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </RevealSection>

              <RevealSection delay={0.2}>
                <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
                  What's inside
                </p>
                <SessionTimeline />
              </RevealSection>

              <RevealSection delay={0.3}>
                <div style={{ marginTop: '32px', display: 'flex', gap: '16px',
                  alignItems: 'flex-start', padding: '20px',
                  border: '0.5px solid var(--border)', borderRadius: '4px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%',
                    background: 'var(--navy-4)', border: '2px solid var(--orange)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Mono', fontSize: '14px', color: 'var(--orange)', flexShrink: 0 }}>KS</div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500,
                      color: 'var(--cream)', marginBottom: '2px' }}>Kevin Spann</p>
                    <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--orange)',
                      marginBottom: '8px' }}>Allstate Agent · 40 Years · kevinspanninsurance.com</p>
                    <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'var(--gray-1)',
                      fontStyle: 'italic', lineHeight: 1.5 }}>
                      "I built a $15M book the old way. I rebuilt it the new way. June 25th is where I teach both."
                    </p>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
