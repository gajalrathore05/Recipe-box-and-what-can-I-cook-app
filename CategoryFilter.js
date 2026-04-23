'use client';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat === 'All' ? '' : cat)}
          className={`btn btn-sm ${(active === cat || (!active && cat === 'All')) ? '' : 'btn-secondary'}`}
          style={(active === cat || (!active && cat === 'All')) ? {
            background: 'var(--gradient-warm)', color: '#fff',
          } : {}}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
