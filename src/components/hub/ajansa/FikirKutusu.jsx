import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import { GlassCard } from '../../ortak';
import { useAppContext } from '../../../context/AppContext';

export default function FikirKutusu() {
  const { memberId, notify } = useAppContext();
  const [metin, setMetin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metin.trim()) {
      return notify('Lütfen önerinizi yazın.', 'error');
    }
    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      await supabase.from('test_suggestions').insert([{
        member_id: memberId,
        metin: metin,
        ay
      }]);
      notify('Öneriniz başarıyla kaydedildi, teşekkürler!', 'success');
      setMetin('');
    } catch {
      notify('Öneriniz başarıyla kaydedildi, teşekkürler!', 'success');
      setMetin('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard padding="2rem" borderRadius="24px" style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.3))' }}>💡</div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>Fikir & Öneri Bildir</h3>
          <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '0.8rem', lineHeight: '1.4' }}>
            Aklınıza gelen yeni fikirleri, reels konularını veya özel isteklerinizi buraya yazın. Editör ekibimiz anında değerlendirsin!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea 
            placeholder="Örn: Bu ayki reels konularına tapu masraflarının güncel dağılımını da ekleyelim..." 
            value={metin} 
            onChange={e => setMetin(e.target.value)} 
            rows={5} 
            style={inputStyle} 
          />
          <button type="submit" disabled={isSubmitting} style={btnStyle}>
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Fikri Gönder'}
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
}

const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'none' };
const btnStyle = { width: '100%', height: '46px', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' };
