import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../ortak/GlassCard';

import cgptLogo from '../../../assets/icons/cgpt_logo.svg';
import claudeLogo from '../../../assets/icons/claude_logo.svg';
import geminiLogo from '../../../assets/icons/gemini_logo.svg';

const PromptCard = ({ id, title, desc, icon, isSelected, onIconClick, onCardClick, isSurgical, multiIcons }) => {
  const [copied, setCopied] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const timerRef = useRef(null);

  const isCardSelected = typeof isSelected === 'boolean'
    ? isSelected
    : (Array.isArray(isSelected) && Array.isArray(multiIcons) && isSelected.some(id => multiIcons.some(m => m.id === id)));

  const handleLocalCardClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onCardClick();
    setCopied(true);
    setIsFlashing(true);
    timerRef.current = setTimeout(() => { setCopied(false); setIsFlashing(false); }, 3000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
      {!multiIcons ? (
        <>
          <GlassCard
            onClick={handleLocalCardClick} isMotion={true} whileTap={{ scale: 0.98 }} padding="0.75rem 1.25rem" borderRadius="20px"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer',
              border: (isCardSelected || copied) ? '1px solid #fff' : '1px solid var(--color-border)',
              boxShadow: (isCardSelected || copied) ? '0 0 15px rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.03)'
            }}
          >
            <div style={{ textAlign: 'left', width: '100%', opacity: copied ? 0.2 : 1, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', margin: 0, color: isSurgical ? '#ff4d4d' : 'inherit' }}>{title}</h4>
              {desc && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '2px', fontWeight: '500' }}>{desc}</p>}
            </div>
            <AnimatePresence>
              {copied && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', zIndex: 100 }}
                >
                  <button onClick={(e) => { e.stopPropagation(); window.open('https://chat.openai.com', '_blank'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <img src={cgptLogo} style={{ width: '28px', height: '28px' }} alt="GPT" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); window.open('https://gemini.google.com', '_blank'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <img src={geminiLogo} style={{ width: '28px', height: '28px' }} alt="Gemini" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); window.open('https://claude.ai', '_blank'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <img src={claudeLogo} style={{ width: '28px', height: '28px' }} alt="Claude" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onIconClick(id)}
              style={{ width: '40px', height: '40px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'all 0.3s ease', opacity: (isSelected || isFlashing) ? 1 : 0.35, transform: (isSelected || isFlashing) ? 'scale(1.15)' : 'scale(1)', filter: (isSelected || isFlashing) ? `drop-shadow(0 0 8px ${isSurgical ? 'rgba(255,77,77,0.4)' : 'rgba(255,255,255,0.4)'})` : 'none' }}
            >
              {icon}
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
          <div style={{ width: '100%', height: '1px', background: 'var(--border)', marginBottom: '1rem', opacity: 0.6 }} />
          {title && <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>{title}</span>}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            {multiIcons.map(m => (
              <button key={m.id} onClick={() => onIconClick(m.id)}
                style={{
                  width: '42px', height: '42px', background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: (Array.isArray(isSelected) && isSelected.includes(m.id)) ? 1 : 0.15,
                  transform: (Array.isArray(isSelected) && isSelected.includes(m.id)) ? 'scale(1.3)' : 'scale(1)',
                  filter: (Array.isArray(isSelected) && isSelected.includes(m.id)) ? 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' : 'none'
                }}
                title={m.label}
              >
                {m.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptCard;