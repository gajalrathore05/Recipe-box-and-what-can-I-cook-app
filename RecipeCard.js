'use client';
import Link from 'next/link';
import { Clock, Users, ChefHat, Heart } from 'lucide-react';

export default function RecipeCard({ recipe, style: extraStyle }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Link href={`/recipes/${recipe._id}`} style={{ textDecoration: 'none' }}>
      <div className="glass-card" style={{ ...cardStyles.card, ...extraStyle }}>
        <div style={cardStyles.imageWrap}>
          <div style={{
            ...cardStyles.imagePlaceholder,
            background: getCategoryGradient(recipe.category),
          }}>
            <ChefHat size={40} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </div>
          <div style={cardStyles.badges}>
            <span className="badge badge-amber">{recipe.category}</span>
            {recipe.difficulty && <span className="badge">{recipe.difficulty}</span>}
          </div>
          {recipe.isFavorite && (
            <Heart size={18} fill="var(--accent-red)" color="var(--accent-red)"
              style={{ position: 'absolute', top: 12, right: 12 }} />
          )}
        </div>
        <div style={cardStyles.body}>
          <h3 style={cardStyles.title}>{recipe.title}</h3>
          {recipe.description && (
            <p style={cardStyles.desc}>{recipe.description.slice(0, 80)}...</p>
          )}
          <div style={cardStyles.meta}>
            {totalTime > 0 && (
              <span style={cardStyles.metaItem}>
                <Clock size={14} /> {totalTime} min
              </span>
            )}
            {recipe.servings && (
              <span style={cardStyles.metaItem}>
                <Users size={14} /> {recipe.servings} servings
              </span>
            )}
            {recipe.cuisine && (
              <span style={cardStyles.metaItem}>{recipe.cuisine}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function getCategoryGradient(cat) {
  const gradients = {
    Breakfast: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    Lunch: 'linear-gradient(135deg, #22c55e, #4ade80)',
    Dinner: 'linear-gradient(135deg, #ef4444, #f97316)',
    Snack: 'linear-gradient(135deg, #a855f7, #ec4899)',
    Dessert: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  };
  return gradients[cat] || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
}

const cardStyles = {
  card: { padding: 0, overflow: 'hidden', cursor: 'pointer' },
  imageWrap: { position: 'relative', width: '100%', height: 180 },
  imagePlaceholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  badges: {
    position: 'absolute', bottom: 12, left: 12,
    display: 'flex', gap: 6,
  },
  body: { padding: '16px 20px 20px' },
  title: {
    fontSize: '1.15rem', fontWeight: 600, marginBottom: 6,
    color: 'var(--text-primary)', fontFamily: 'var(--font-heading)',
  },
  desc: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 },
  meta: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  metaItem: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: '0.8rem', color: 'var(--text-secondary)',
  },
};
