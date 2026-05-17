import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';
import storyIcerikleri from '../../../../data/storyIcerikleri.json';

export default function Step7_StoryAnket({ sessionId, memberId, onComplete, onPrev }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentStory = storyIcerikleri[currentIndex];

  const handleRefresh = () => {
    const nextIndex = Math.floor(Math.random() * storyIcerikleri.length);
    setCurrentIndex(storyIcerikleri.length > 1 && nextIndex === currentIndex ? (currentIndex + 1) % storyIcerikleri.length : nextIndex);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      const { error } = await supabase.from('test_story_onaylari').insert([{
        session_id: sessionId,
        member_id: memberId,
        story_id: currentStory.id,
        ay
      }]);
      if (error) throw error;
      onComplete('story_anket');
    } catch {
      onComplete('story_anket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePoll = currentStory.anket1; // Display exactly 1 single poll monthly

  return (
    <GlassCard padding="1.1rem" borderRadius="18px" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative' }}>
      {onPrev && (
        <button 
          onClick={onPrev} 
          style={{ 
            position: 'absolute', 
            top: '12px', 
            left: '12px', 
            background: 'transparent', 
            border: 'none', 
            color: '#aaa', 
            cursor: 'pointer',
            transition: 'color 0.2s',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; }}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 2px 0', color: '#fff', fontSize: '1.15rem' }}>📲 İnteraktif Story Planı</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.75rem' }}>Bu ay paylaşılacak satıcı odaklı Story anketiniz.</p>
      </div>

      {/* Real Instagram Story Simulator Box */}
      <div style={storySimStyle}>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex} 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            transition={{ duration: 0.2 }}
            style={{ width: '85%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 2 }}
          >
            {/* Real Instagram Poll Sticker Box */}
            <div style={pollStickerStyle}>
              <div style={{ color: '#000', fontSize: '0.75rem', fontWeight: '800', lineHeight: '1.3', textAlign: 'center', marginBottom: '0.5rem' }}>
                {activePoll.soru}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {activePoll.secenekler.map((opt, idx) => (
                  <div key={idx} style={pollOptionStyle}>
                    <span style={{ fontWeight: '700', fontSize: '0.7rem' }}>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <button onClick={handleRefresh} style={secStyle} title="Değiştir"><RotateCw size={16} /></button>
        <button onClick={handleSave} disabled={isSubmitting} style={primStyle}>
          {isSubmitting ? '...' : 'Onayla ve İlerle'} <ChevronRight size={18} />
        </button>
      </div>
    </GlassCard>
  );
}

const storySimStyle = {
  background: 'linear-gradient(135deg, #2c3e50, #fd746c, #f5af19)',
  minHeight: '190px',
  borderRadius: '16px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem',
  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
  overflow: 'hidden'
};

const storyHeaderStyle = {
  position: 'absolute',
  top: '12px',
  left: '0',
  right: '0',
  display: 'flex',
  justifyContent: 'center',
  padding: '0 15px',
  zIndex: 3
};

const badgeStyle = {
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(4px)',
  padding: '4px 10px',
  borderRadius: '20px',
  color: 'var(--color-accent)',
  fontSize: '0.65rem',
  fontWeight: 'bold',
  letterSpacing: '0.5px'
};

const pollStickerStyle = {
  background: '#ffffff',
  borderRadius: '14px',
  padding: '0.75rem',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
};

const pollOptionStyle = {
  background: '#f2f2f2',
  border: '1px solid #e0e0e0',
  padding: '0.4rem 0.6rem',
  borderRadius: '10px',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const secStyle = { width: '42px', height: '42px', background: 'transparent', border: '1px solid #444', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 };
const primStyle = { flex: 1, height: '42px', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' };
