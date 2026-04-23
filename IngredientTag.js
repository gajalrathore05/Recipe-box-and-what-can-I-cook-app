'use client';
import { X } from 'lucide-react';

export default function IngredientTag({ name, onRemove, variant = 'default' }) {
  const variantClass = variant === 'matched' ? 'badge-green' : variant === 'missing' ? 'badge-red' : '';
  return (
    <span className={`tag ${variantClass}`}>
      {name}
      {onRemove && (
        <button className="tag-remove" onClick={onRemove} aria-label={`Remove ${name}`}>
          <X size={14} />
        </button>
      )}
    </span>
  );
}
