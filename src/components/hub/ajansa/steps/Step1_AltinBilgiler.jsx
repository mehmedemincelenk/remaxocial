import { useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import GlassCard from '../../../ortak/GlassCard';
import altinBilgiler from '../../../../data/altinBilgiler.json';
import { Check, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step1_AltinBilgiler({ sessionId, memberId, onComplete }) {
  // Select 10 random or sequential items for this month. We have 10, so just use them all.
  const [selectedIds, setSelectedIds] = useState(altinBilgiler.map(item => item.id).slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentBilgi = altinBilgiler.find(b => b.id === selectedIds[currentIndex]);

  const handleNext = () => {
    if (currentIndex < selectedIds.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleApproveAll();
    }
  };

  const handleApproveAll = async () => {
    setIsSubmitting(true);
    try {
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const { error } = await supabase
        .from('TEST_altin_bilgi_onaylari')
        .insert([{
          session_id: sessionId,
          member_id: memberId,
          bilgi_ids: selectedIds,
          ay: ay
        }]);

      if (error) throw error;
      onComplete('altin_bilgi');
    } catch (e) {
      console.error('Error saving altin bilgiler:', e);
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeCurrent = () => {
    // Just a dummy swap for MVP to show interaction
    // In a real scenario, pick a random one from the remaining pool
    alert('Bunun yerine başka bir bilgi getirildi (Simülasyon)');
  };

  return (
    <GlassCard padding="1.5rem" borderRadius="20px" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem' }}>💎 Altın Bilgiler</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Bu ay paylaşılacak içerikleri onaylayın.</p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', position: 'relative', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '0.7rem', color: 'var(--color-accent)' }}>
          {currentIndex + 1} / {selectedIds.length}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBilgi.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
              "{currentBilgi.bilgi}"
            </p>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
              {currentBilgi.aciklama}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={handleChangeCurrent}
          style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #444', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Değiştir
        </button>
        <button 
          onClick={handleNext}
          disabled={isSubmitting}
          style={{ flex: 2, padding: '0.8rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          {currentIndex === selectedIds.length - 1 ? (
            <>{isSubmitting ? 'Kaydediliyor...' : 'Hepsini Onayla'} <Check size={18} /></>
          ) : (
            <>Onayla ve Geç <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
