import { useState } from 'react';
import { UploadCloud, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';
import { useAppContext } from '../../../../context/AppContext';

export default function Step4_BusinessVibe({ sessionId, memberId, onComplete, onPrev }) {
  const { notify } = useAppContext();
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (files.length === 0) return notify('En az 1 video seçmelisiniz.', 'error');
    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      for (const file of files) {
        const fileName = `${memberId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${file.name.split('.').pop()}`;
        const filePath = `${ay}/${fileName}`;
        await supabase.storage.from('test-business-vibe').upload(filePath, file);
        const { data: { publicUrl } } = supabase.storage.from('test-business-vibe').getPublicUrl(filePath);
        await supabase.from('test_business_vibe_uploads').insert([{ session_id: sessionId, member_id: memberId, video_url: publicUrl, ay }]);
      }
      onComplete('business_vibe');
    } catch (e) { notify('Yükleme sırasında hata oluştu.', 'error'); } finally { setIsSubmitting(false); }
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

      <div style={{ textAlign: 'center' }}><h3 style={{ margin: 0, fontSize: '1.15rem' }}>🎥 Business Vibe</h3><p style={{ color: '#aaa', fontSize: '0.78rem', margin: '4px 0 0 0' }}>Saha/ofis videoları.</p></div>
      <div style={uploadBoxStyle}>
        <input type="file" multiple accept="video/*" onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files)])} style={fileInputStyle} />
        <UploadCloud size={28} color="var(--color-accent)" />
        <span style={{ fontSize: '0.8rem' }}>{files.length > 0 ? `${files.length} Video Seçildi` : 'Videoları Seçin'}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', width: '100%', marginTop: '0.25rem' }}>
        <button 
          onClick={() => onComplete('business_vibe_skipped')} 
          style={{ flex: 1, padding: '0.65rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#aaa', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
        >
          Atla
        </button>
        <button onClick={handleSave} disabled={isSubmitting} style={{ ...btnStyle, flex: 2, marginTop: 0 }}>
          {isSubmitting ? '...' : 'Gönder'}
        </button>
      </div>
    </GlassCard>
  );
}

const uploadBoxStyle = { position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', cursor: 'pointer', color: '#888', fontSize: '0.8rem', gap: '0.4rem' };
const fileInputStyle = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' };
const btnStyle = { width: '100%', marginTop: '0.25rem', padding: '0.65rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' };
