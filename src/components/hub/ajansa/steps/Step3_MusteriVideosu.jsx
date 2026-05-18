import { useState } from 'react';
import { UploadCloud, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';
import { useAppContext } from '../../../../context/AppContext';

export default function Step3_MusteriVideosu({ sessionId, memberId, onComplete, onPrev }) {
  const { notify } = useAppContext();
  const [file, setFile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddVideo = () => {
    if (!file) return;
    setVideos(prev => [...prev, { id: Date.now(), file }]);
    setFile(null);
  };

  const handleSave = async () => {
    let listToUpload = [...videos];
    if (file) {
      listToUpload.push({ id: Date.now(), file });
    }

    if (listToUpload.length === 0) {
      return onComplete('musteri_video_skipped');
    }

    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      for (const item of listToUpload) {
        const fileName = `${memberId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${item.file.name.split('.').pop()}`;
        const filePath = `${ay}/${fileName}`;
        const { error: upErr } = await supabase.storage.from('test-musteri-video').upload(filePath, item.file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('test-musteri-video').getPublicUrl(filePath);
        await supabase.from('test_musteri_memnuniyeti').insert([{ session_id: sessionId, member_id: memberId, video_url: publicUrl, ay }]);
      }
      onComplete('musteri_video');
    } catch (e) { 
      notify('Yükleme hatası.', 'error'); 
    } finally { 
      setIsSubmitting(false); 
    }
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
        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>🎥 Müşteri Videosu</h3>
        <p style={{ color: '#aaa', fontSize: '0.78rem', margin: '4px 0 0 0' }}>Varsa yükleyin (Opsiyonel).</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
        <div style={{ ...uploadBoxStyle, flex: 1 }}>
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={fileInputStyle} />
          <UploadCloud size={24} color={file ? 'var(--color-accent)' : '#444'} />
          <span style={{ color: file ? '#fff' : '#888', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
            {file ? file.name : 'Video Seçin'}
          </span>
        </div>
        {file && (
          <button 
            onClick={handleAddVideo}
            style={{
              width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-accent)', border: 'none',
              color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              fontSize: '1.2rem', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 0 10px rgba(6,182,212,0.3)'
            }}
          >
            +
          </button>
        )}
      </div>

      {videos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '10px', maxHeight: '110px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 'bold' }}>EKLENEN VİDEOLAR ({videos.length})</div>
          {videos.map((v) => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '6px', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🎥 {v.file.name}
              </span>
              <button 
                onClick={() => setVideos(prev => prev.filter(x => x.id !== v.id))} 
                style={{ background: 'rgba(255,77,77,0.15)', border: 'none', borderRadius: '6px', color: '#ff4d4d', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '0.65rem' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button onClick={() => onComplete('musteri_video_skipped')} style={secondaryBtnStyle}>Atla</button>
        <button onClick={handleSave} disabled={isSubmitting} style={primaryBtnStyle}>
          {isSubmitting ? '...' : (videos.length > 0 || file ? `Gönder (${videos.length + (file ? 1 : 0)})` : 'İlerle')}
        </button>
      </div>
    </GlassCard>
  );
}

const uploadBoxStyle = { position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.8rem', cursor: 'pointer', color: '#888', fontSize: '0.8rem', gap: '0.4rem' };
const fileInputStyle = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' };
const secondaryBtnStyle = { flex: 1, padding: '0.65rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#aaa', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap' };
const primaryBtnStyle = { flex: 2, padding: '0.65rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' };
