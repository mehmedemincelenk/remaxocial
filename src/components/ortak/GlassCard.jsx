import { motion } from 'framer-motion';

/**
 * GlassCard - Shared Glassmorphism Component
 * Standardizes the "Diamond Standard" glass effect across the app.
 */
const GlassCard = ({
  children,
  padding = '1.5rem',
  borderRadius = '24px',
  style = {},
  onClick,
  isMotion = false, // Set to true to use motion.div instead
  layout = false,
  ...props
}) => {
  const baseStyle = {
    background: 'var(--color-glass)',
    borderRadius,
    padding,
    border: '1px solid var(--color-border)',
    backdropFilter: 'blur(20px)',
    ...style
  };

  if (isMotion) {
    return (
      <motion.div layout={layout} onClick={onClick} style={baseStyle} {...props}>
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} style={baseStyle} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
