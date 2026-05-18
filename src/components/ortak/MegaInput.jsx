import { motion } from 'framer-motion';

export default function MegaInput({ 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  style = {} 
}) {
  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      {Icon && (
        <Icon 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            opacity: 0.4,
            color: '#fff'
          }} 
        />
      )}
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ 
          width: '100%', 
          padding: `0.75rem 1rem 0.75rem ${Icon ? '2.8rem' : '1rem'}`, 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', 
          color: '#fff', 
          fontSize: '0.85rem',
          outline: 'none',
          transition: 'all 0.3s ease',
        }}
        onFocus={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.06)';
          e.target.style.border = '1px solid rgba(255,255,255,0.2)';
        }}
        onBlur={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.03)';
          e.target.style.border = '1px solid rgba(255,255,255,0.1)';
        }}
      />
    </div>
  );
}
