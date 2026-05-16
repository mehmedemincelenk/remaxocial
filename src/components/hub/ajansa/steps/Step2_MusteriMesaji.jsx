import { useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import GlassCard from '../../../ortak/GlassCard';
import { Check, MessageSquare } from 'lucide-react';

export default function Step2_MusteriMesaji({ sessionId, memberId, onComplete }) {
  const [musteriAdi, setMusteriAdi] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [iletisim, setIletisim] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!mesaj) {
      alert('Lütfen bir mesaj yazın.');
      return;
    }

    setIsSubmitting(true);
    try {
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const { error } = await supabase
        .from('test_musteri_memnuniyeti')
        .insert([{
          session_id: sessionId,
          member_id: memberId,
          musteri_adi: musteriAdi,
          mesaj: mesaj + (iletisim ? `\n\nİletişim: ${iletisim}` : ''),
          ay
        }]);

      if (error) throw error;
      onComplete('musteri_mesaji');
    } catch (e) {
      console.error('Error in Step2:', e);
      alert('Kaydedilirken hata oluştu.');
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard padding="1.5rem" borderRadius="20px" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem' }}>💬 Müşteri Mesajı</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Müşterinizden gelen yazılı teşekkürü ekleyin.</p>
      </div>

      <input 
        placeholder="Müşteri Adı" 
        value={musteriAdi}
        onChange={(e) => setMusteriAdi(e.target.value)}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
      />

      <textarea 
        placeholder="Mesaj içeriği..." 
        value={mesaj}
        onChange={(e) => setMesaj(e.target.value)}
        rows={4}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none', resize: 'none' }}
      />

      <input 
        placeholder="İletişim (İsteğe bağlı: WhatsApp, Instagram vb.)" 
        value={iletisim}
        onChange={(e) => setIletisim(e.target.value)}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
      />

      <button 
        onClick={handleSave}
        disabled={isSubmitting}
        style={{ marginTop: '0.5rem', padding: '0.8rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
      >
        {isSubmitting ? 'Kaydediliyor...' : 'Kaydet ve İlerle'} <Check size={18} />
      </button>
    </GlassCard>
  );
}
