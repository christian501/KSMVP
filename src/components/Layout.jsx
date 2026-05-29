import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

export default function Layout() {
  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(7, 16, 56, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(26,123,255,0.18)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '56px',
      }}>
        <Link to="/" style={{
          fontFamily: 'Space Mono', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
          background: 'linear-gradient(90deg, var(--orange) 0%, var(--orange-h) 50%, var(--blue) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          Future Proof Agent Summit
        </Link>
        <CountdownTimer />
        <Link to="/register" style={{
          fontFamily: 'Space Mono', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
          color: 'var(--white)',
          background: 'linear-gradient(90deg, var(--orange) 0%, var(--orange-h) 100%)',
          padding: '9px 18px', borderRadius: '4px',
          boxShadow: '0 0 24px rgba(255,102,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 0 32px rgba(255,102,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 0 24px rgba(255,102,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)';
        }}>
          Reserve My Free Seat
        </Link>
      </header>
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, var(--orange) 0%, var(--blue) 100%)',
        zIndex: 200,
        pointerEvents: 'none',
      }} />
    </>
  );
}
