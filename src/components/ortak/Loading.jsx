import { motion } from 'framer-motion';

const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.05)', borderTopColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }} />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', inset: '15px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
    </div>
  </div>
);

export default Loading;
