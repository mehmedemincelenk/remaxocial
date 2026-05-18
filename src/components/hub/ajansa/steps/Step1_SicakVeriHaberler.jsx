import { useState } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';

export default function Step1_SicakVeriHaberler({ sessionId, memberId, onComplete, onPrev }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      const { error } = await supabase.from('test_altin_bilgi_onaylari').insert([{
        session_id: sessionId,
        member_id: memberId,
        bilgi_ids: [999], // Dynamic content stream master consent ID
        ay
      }]);
      if (error) throw error;
      onComplete('altin_bilgi');
    } catch {
      onComplete('altin_bilgi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard padding="1rem" borderRadius="18px" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', position: 'relative' }}>
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

      <div style={{ fontSize: '2.5rem' }}>📊</div>
      <div>
        <h3 style={{ margin: '0 0 0.4rem 0', color: '#fff', fontSize: '1.15rem', fontWeight: 'bold' }}>Sıcak Veri & Haberler</h3>
        <p style={{ margin: 0, color: '#ccc', fontSize: '0.78rem', lineHeight: '1.5' }}>
          Bu ay gayrimenkul piyasasındaki en güncel sıcak gelişmeleri, analizleri ve emlak terminolojisinden bazı kelimelerin anlamlarını ("amortisman süresi", "kat irtifakı" gibi) hap bilgi içeriği olarak anlık karuseller halinde sizin adınıza paylaşacağız.
        </p>
      </div>

      <div style={{ display: 'flex', width: '100%' }}>
        <button onClick={handleApprove} disabled={isSubmitting} style={{ ...primStyle, flex: 1 }}>
          {isSubmitting ? '...' : 'Tamam'} <Check size={18} />
        </button>
      </div>
    </GlassCard>
  );
}

const primStyle = { width: '100%', height: '42px', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap' };
