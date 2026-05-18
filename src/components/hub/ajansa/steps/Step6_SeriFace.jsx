import { useState } from 'react';
import { RotateCw, ChevronRight, ChevronLeft, UploadCloud } from 'lucide-react';
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
      return notify('Lütfen bu metin için videonuzu yükleyin.', 'error');
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
    <GlassCard padding="1.1rem" borderRadius="18px" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative', overflow: 'hidden' }}>
      
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
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.75rem' }}>Ayda 5 adet konuşan kafa reels videonuzu yükleyin.</p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '12px', position: 'relative', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: '8px', right: '12px', fontSize: '0.62rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
          Video {activeSlot + 1} / 5
        </div>
        <div style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          🗣️ KONUŞMA METNİ
        </div>
        <p style={{ color: '#fff', fontSize: '0.75rem', lineHeight: '1.4', margin: 0, fontStyle: 'italic' }}>
          "{currentSeri?.icerik}"
        </p>
      </div>

      {/* Spacious Direct Upload Zone */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '140px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '2px dashed rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          cursor: 'pointer', 
          transition: 'all 0.25s ease' 
        }}
        onMouseEnter={e => { 
          e.currentTarget.style.borderColor = 'var(--color-accent)'; 
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; 
        }}
        onMouseLeave={e => { 
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; 
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; 
        }}
      >
        <input 
          type="file" 
          accept="video/*" 
          onChange={e => setVideoFiles(p => ({ ...p, [currentSeri.id]: e.target.files[0] }))} 
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 5 }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', color: '#aaa', textAlign: 'center', padding: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <UploadCloud size={24} color="var(--color-accent)" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#fff', fontWeight: '700' }}>Video Seç veya Sürükle</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.65rem', color: '#666' }}>Maksimum 50MB, MP4 veya MOV</p>
          </div>
        </div>
      </div>

      {/* Success Indicator for selected/recorded video */}
      {currentSeri && (videoFiles[currentSeri.id] || uploadedUrls[currentSeri.id]) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', padding: '0.5rem 0.8rem', borderRadius: '10px' }}>
          <span style={{ color: 'var(--color-accent)', fontSize: '0.78rem' }}>✅</span>
          <span style={{ fontSize: '0.72rem', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {videoFiles[currentSeri.id] ? videoFiles[currentSeri.id].name : 'Yüklenen Video Hazır'}
          </span>
          <button 
            onClick={() => {
              setVideoFiles(p => { const copy = { ...p }; delete copy[currentSeri.id]; return copy; });
              setUploadedUrls(p => { const copy = { ...p }; delete copy[currentSeri.id]; return copy; });
            }}
            style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 'bold' }}
          >
            Sil
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.6rem', width: '100%', marginTop: '0.4rem' }}>
        <button onClick={handleRefresh} style={secStyle} title="Metni Değiştir"><RotateCw size={16} /></button>
        <button onClick={handleNext} disabled={isSubmitting} style={primStyle}>
          {isSubmitting ? '...' : (activeSlot === 4 ? 'Gönder' : 'Onayla')} <ChevronRight size={18} />
        </button>
      </div>
    </GlassCard>
  );
}

const secStyle = { width: '42px', height: '42px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' };
const primStyle = { flex: 1, height: '42px', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' };
