import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const configs = {
    success: { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
    error: { icon: AlertCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
    info: { icon: Info, color: 'var(--color-accent)', bg: 'rgba(255, 255, 255, 0.05)' }
  };

  const config = configs[type] || configs.info;

  return (
    <div style={{
      position: 'absolute',
      bottom: '90px',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 9999,
      padding: '0 16px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          minWidth: '260px',
          maxWidth: '100%',
          padding: '10px 14px',
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '14px',
          border: `1px solid ${config.color}33`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${config.color}11`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#fff',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <config.icon size={16} color={config.color} />
        </div>
        <div style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500', lineHeight: '1.3' }}>{message}</div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={14} />
        </button>
      </motion.div>
    </div>
  );
}
