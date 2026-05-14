import { motion } from 'framer-motion';

/**
 * Marquee - Shared Diamond-Standard Scrolling Component
 * High-performance animation for showcasing lists (reviews, logos, etc.)
 */
const Marquee = ({ items, dir = 'x', dur = 25, children, gap = '1.5rem' }) => (
  <div 
    style={{ 
      position: 'relative', 
      width: '100%', 
      height: dir === 'y' ? '320px' : 'auto', 
      overflow: 'hidden', 
      maskImage: `linear-gradient(to ${dir === 'x' ? 'right' : 'bottom'}, transparent, black 15%, black 85%, transparent)`, 
      WebkitMaskImage: `linear-gradient(to ${dir === 'x' ? 'right' : 'bottom'}, transparent, black 15%, black 85%, transparent)` 
    }}
  >
    <motion.div 
      animate={{ [dir]: dir === 'x' ? [0, -1000] : [0, -2000] }} 
      transition={{ duration: dur, repeat: Infinity, ease: 'linear' }} 
      style={{ 
        display: 'flex', 
        flexDirection: dir === 'x' ? 'row' : 'column', 
        gap, 
        padding: '1rem 0', 
        alignItems: 'center' 
      }}
    >
      {items.map(children)}
      {/* Duplicate for seamless loop if needed, but the -1000 logic usually handles simple cases */}
      {items.map(children)}
    </motion.div>
  </div>
);

export default Marquee;
