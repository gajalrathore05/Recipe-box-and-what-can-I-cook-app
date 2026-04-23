'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import IngredientTag from './IngredientTag';

const COMMON_INGREDIENTS = [
  'Chicken', 'Rice', 'Pasta', 'Onion', 'Garlic', 'Tomato', 'Potato', 'Egg',
  'Milk', 'Butter', 'Cheese', 'Olive Oil', 'Salt', 'Pepper', 'Sugar', 'Flour',
  'Carrot', 'Bell Pepper', 'Ginger', 'Lemon', 'Soy Sauce', 'Cream', 'Bread',
  'Spinach', 'Mushroom', 'Broccoli', 'Beef', 'Shrimp', 'Tofu', 'Coconut Milk',
];

export default function FridgeInput({ ingredients = [], onAdd, onRemove }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (val) => {
    setInput(val);
    if (val.length > 0) {
      const filtered = COMMON_INGREDIENTS.filter(i =>
        i.toLowerCase().includes(val.toLowerCase()) &&
        !ingredients.some(ing => ing.name.toLowerCase() === i.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addIngredient = (name) => {
    if (!name.trim()) return;
    if (ingredients.some(i => i.name.toLowerCase() === name.toLowerCase())) return;
    onAdd({ name: name.trim(), quantity: '', unit: '' });
    setInput('');
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(input);
    }
  };

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient..."
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary btn-sm" onClick={() => addIngredient(input)}>
            <Plus size={18} /> Add
          </button>
        </div>
        {suggestions.length > 0 && (
          <div style={dropdownStyle}>
            {suggestions.map(s => (
              <button key={s} onClick={() => addIngredient(s)} style={suggestionStyle}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="tag-list">
        {ingredients.map((ing, i) => (
          <IngredientTag key={i} name={ing.name} onRemove={() => onRemove(i)} />
        ))}
      </div>
    </div>
  );
}

const dropdownStyle = {
  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
  marginTop: 4, background: 'var(--bg-secondary)',
  border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)',
  overflow: 'hidden',
};
const suggestionStyle = {
  display: 'block', width: '100%', padding: '10px 16px',
  background: 'none', border: 'none', borderBottom: '1px solid var(--border-glass)',
  color: 'var(--text-primary)', fontSize: '0.9rem', textAlign: 'left',
  cursor: 'pointer',
};
