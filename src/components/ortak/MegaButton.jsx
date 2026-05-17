import { motion } from 'framer-motion';

export default function MegaButton({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  isLoading = false,
  style = {} 
}) {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={isLoading}
      style={{ 
        width: '100%',
        padding: '0.9rem', 
        background: isPrimary ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)', 
        border: isPrimary ? 'none' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px', 
        color: isPrimary ? '#000' : '#fff', 
        fontWeight: '700', 
        fontSize: '0.95rem',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style
      }}
    >
      {isLoading ? (
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ 
            width: '18px', 
            height: '18px', 
            border: `2px solid ${isPrimary ? '#000' : '#fff'}`, 
            borderTopColor: 'transparent', 
            borderRadius: '50%' 
          }}
        />
      ) : children}
    </motion.button>
  );
}
