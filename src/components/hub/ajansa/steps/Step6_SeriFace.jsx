import { useState } from 'react';
import { Video, RotateCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';
import { useAppContext } from '../../../../context/AppContext';
import seriIcerikleri from '../../../../data/seriIcerikleri.json';

export default function Step6_SeriFace({ sessionId, memberId, onComplete, onPrev }) {
  const { notify } = useAppContext();
  const [selectedIds, setSelectedIds] = useState(seriIcerikleri.slice(0, 5).map(item => item.id));
  const [activeSlot, setActiveSlot] = useState(0);
  const [videoFiles, setVideoFiles] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSeri = seriIcerikleri.find(s => s.id === selectedIds[activeSlot]);

  const handleRefresh = () => {
    const unusedItems = seriIcerikleri.filter(item => !selectedIds.includes(item.id));
    if (unusedItems.length === 0) return notify('Tüm konuşma metinleri zaten seçili.', 'info');
    const randomUnused = unusedItems[Math.floor(Math.random() * unusedItems.length)];
    setSelectedIds(prev => {
      const copy = [...prev];
      copy[activeSlot] = randomUnused.id;
      return copy;
    });
  };

  const handleNext = async () => {
    const file = videoFiles[currentSeri.id];
    if (!file && !uploadedUrls[currentSeri.id]) {
      return notify('Lütfen bu metin için videonuzu çekin veya yükleyin.', 'error');
    }

    setIsSubmitting(true);
    try {
      let publicUrl = uploadedUrls[currentSeri.id];
      if (file) {
        const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        const filePath = `${ay}/${memberId}-${currentSeri.id}-${Date.now()}.mp4`;
        const { error: upError } = await supabase.storage.from('test-seri-face').upload(filePath, file);
        if (upError) throw upError;
        const { data } = supabase.storage.from('test-seri-face').getPublicUrl(filePath);
        publicUrl = data.publicUrl;
        setUploadedUrls(prev => ({ ...prev, [currentSeri.id]: publicUrl }));
      }

      if (activeSlot < 4) {
        setActiveSlot(prev => prev + 1);
      } else {
        const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        const insertData = selectedIds.map(id => ({
          session_id: sessionId,
          member_id: memberId,
          icerik_id: id,
          video_url: id === currentSeri.id ? publicUrl : uploadedUrls[id],
          ay
        }));
        await supabase.from('test_seri_face_uploads').insert(insertData);
        onComplete('seri_face');
      }
    } catch {
      notify('Video yüklenemedi. Lütfen tekrar deneyin.', 'error');
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
        <h3 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '1.15rem' }}>🎬 Seri Face Reels</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.75rem' }}>Ayda 5 adet konuşan kafa reels videonuzu çekin.</p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '12px', position: 'relative', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
          Video {activeSlot + 1} / 5
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          🗣️ OKUNACAK KONUŞMA METNİ
        </div>
        <p style={{ color: '#fff', fontSize: '0.76rem', lineHeight: '1.4', margin: 0, fontStyle: 'italic' }}>
          "{currentSeri.icerik}"
        </p>
      </div>

      <div style={upStyle}>
        <input 
          type="file" 
          accept="video/*" 
          capture="user" 
          onChange={e => setVideoFiles(p => ({ ...p, [currentSeri.id]: e.target.files[0] }))} 
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 5 }} 
        />
        <Video size={20} color={videoFiles[currentSeri.id] || uploadedUrls[currentSeri.id] ? 'var(--color-accent)' : '#444'} />
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: videoFiles[currentSeri.id] || uploadedUrls[currentSeri.id] ? '#fff' : '#888' }}>
          {videoFiles[currentSeri.id] || uploadedUrls[currentSeri.id] ? 'Video Hazır (Değiştir)' : 'Videoyu Çek veya Yükle'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', width: '100%' }}>
        <button onClick={handleRefresh} style={secStyle} title="Metni Değiştir"><RotateCw size={16} /></button>
        <button onClick={handleNext} disabled={isSubmitting} style={primStyle}>
          {isSubmitting ? '...' : (activeSlot === 4 ? 'Gönder ve Oturumu Tamamla' : `Onayla ve ${activeSlot + 2}. Videoya Geç`)} <ChevronRight size={18} />
        </button>
      </div>
    </GlassCard>
  );
}

const upStyle = { position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.8rem', cursor: 'pointer', color: '#888', fontSize: '0.8rem', gap: '0.4rem' };
const secStyle = { width: '42px', height: '42px', background: 'transparent', border: '1px solid #444', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 };
const primStyle = { flex: 1, height: '42px', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' };
