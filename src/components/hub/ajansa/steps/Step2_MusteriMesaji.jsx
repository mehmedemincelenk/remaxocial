import { useState } from 'react';
import { Trash2, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';
import { useAppContext } from '../../../../context/AppContext';

export default function Step2_MusteriMesaji({ sessionId, memberId, onComplete, onPrev }) {
  const { notify } = useAppContext();
  const [form, setForm] = useState({ adi: '', mesaj: '', iletisim: '' });
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasInput = form.mesaj.trim().length > 0;

  const handleAdd = () => {
    if (!form.mesaj) return notify('Lütfen mesaj alanını doldurun.', 'error');
    setReviews(p => [...p, { ...form, id: Date.now() }]);
    setForm({ adi: '', mesaj: '', iletisim: '' });
  };

  const handleRemove = (id) => {
    setReviews(p => p.filter(r => r.id !== id));
  };

  const handleSave = async () => {
    if (reviews.length === 0) return notify('Lütfen en az 1 yorum ekleyin.', 'error');
    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      const payload = reviews.map(r => ({
        session_id: sessionId,
        member_id: memberId,
        musteri_adi: r.adi,
        mesaj: r.mesaj + (r.iletisim ? `\n\nİletişim: ${r.iletisim}` : ''),
        ay
      }));
      const { error } = await supabase.from('test_musteri_memnuniyeti').insert(payload);
      if (error) throw error;
      onComplete('musteri_mesaji');
    } catch { notify('Hata oluştu.', 'error'); } finally { setIsSubmitting(false); }
  };

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
        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem' }}>💬 Müşteri Yorumları</h3>
        <p style={{ color: '#aaa', fontSize: '0.78rem', margin: '4px 0 0 0' }}>Müşterilerinizin teşekkürlerini ekleyin.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input placeholder="Müşteri Adı" value={form.adi} onChange={e => setForm(p => ({ ...p, adi: e.target.value }))} style={inputStyle} />
        <textarea placeholder="Mesaj..." value={form.mesaj} onChange={e => setForm(p => ({ ...p, mesaj: e.target.value }))} rows={2} style={inputStyle} />
        <input placeholder="İletişim (İsteğe bağlı)" value={form.iletisim} onChange={e => setForm(p => ({ ...p, iletisim: e.target.value }))} style={inputStyle} />
      </div>

      {reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '10px', maxHeight: '110px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 'bold' }}>EKLENEN YORUMLAR ({reviews.length})</div>
          {reviews.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '6px', gap: '6px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.adi || 'İsimsiz Müşteri'}</div>
                <div style={{ fontSize: '0.65rem', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.mesaj}</div>
              </div>
              <button onClick={() => handleRemove(r.id)} style={delBtnStyle}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {hasInput ? (
        <button onClick={handleAdd} style={btnStyle}>Listeye Ekle</button>
      ) : (
        <button onClick={handleSave} disabled={isSubmitting || reviews.length === 0} style={{ ...btnStyle, opacity: reviews.length === 0 ? 0.5 : 1 }}>
          {isSubmitting ? '...' : `Tamamla ve İlerle (${reviews.length})`}
        </button>
      )}
    </GlassCard>
  );
}

const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 0.8rem', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '0.8rem' };
const delBtnStyle = { background: 'rgba(255,77,77,0.15)', border: 'none', borderRadius: '6px', color: '#ff4d4d', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 };
const btnStyle = { width: '100%', padding: '0.65rem', background: 'var(--color-accent)', border: 'none', borderRadius: '10px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' };
