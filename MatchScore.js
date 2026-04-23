export default function MatchScore({ score, size = 'md' }) {
  let category = 'partial';
  let label = 'Worth a Trip';
  if (score === 100) { category = 'perfect'; label = 'Perfect Match!'; }
  else if (score >= 80) { category = 'almost'; label = 'Almost There'; }

  const barHeight = size === 'lg' ? 10 : 8;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 6,
      }}>
        <span style={{
          fontSize: size === 'lg' ? '0.95rem' : '0.8rem',
          fontWeight: 600,
          color: score === 100 ? 'var(--accent-green)' : score >= 80 ? 'var(--accent-amber)' : 'var(--accent-red)',
        }}>{label}</span>
        <span style={{
          fontSize: size === 'lg' ? '1.1rem' : '0.85rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>{score}%</span>
      </div>
      <div className="match-bar-container" style={{ height: barHeight }}>
        <div className={`match-bar ${category}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
