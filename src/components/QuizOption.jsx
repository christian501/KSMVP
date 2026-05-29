export default function QuizOption({ value, label, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`quiz-option ${selected ? 'selected' : ''}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        width: '100%', textAlign: 'left', padding: '16px 20px',
        background: selected ? 'rgba(255,102,0,0.10)' : 'rgba(255,255,255,0.04)',
        border: `0.5px solid ${selected ? 'rgba(255,102,0,0.5)' : 'rgba(255,102,0,0.18)'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        color: 'var(--cream)',
        fontFamily: 'Poppins',
        fontSize: '15px',
        marginBottom: '10px',
        transition: 'all 0.2s',
        minHeight: '56px',
      }}>
      <span style={{
        fontFamily: 'Space Mono', fontSize: '13px',
        color: selected ? 'var(--orange)' : 'var(--cream)',
        minWidth: '24px', fontWeight: 500,
      }}>
        {value}
      </span>
      <span style={{ color: 'var(--cream)' }}>{label}</span>
      {selected && (
        <span style={{ marginLeft: 'auto', color: 'var(--orange)', fontSize: '18px' }}>→</span>
      )}
    </button>
  );
}
