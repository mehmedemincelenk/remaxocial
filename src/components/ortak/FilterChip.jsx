import { CheckSquare, Square } from 'lucide-react';



/**
 * FilterChip - Shared Category/Filter Chip Component
 * Used across the app to filter lists and categories with a consistent "Diamond Standard" style.
 */
const FilterChip = ({
  label,
  active,
  onClick,
  showCheckbox = false,
  color = 'var(--color-accent)',
  style = {}
}) => {
  // If label is "Seçtiklerim", we might want to force the checkbox logic
  const isCheckboxMode = showCheckbox || label === 'Seçtiklerim';

  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '14px',
        border: `1px solid ${active ? color : 'var(--color-border)'}`,
        background: active ? `color-mix(in srgb, ${color} 15%, transparent)` : 'rgba(255,255,255,0.02)',
        color: active ? color : 'var(--color-text-muted)',
        fontSize: '0.65rem',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: '0.3s',
        ...style
      }}
    >
      {isCheckboxMode && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {active ? <CheckSquare size={12} /> : <Square size={12} />}
        </span>
      )}
      {label.toUpperCase()}
    </button>
  );
};

export default FilterChip;
