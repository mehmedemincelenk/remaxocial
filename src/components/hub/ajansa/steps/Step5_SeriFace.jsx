import { useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import GlassCard from '../../../ortak/GlassCard';
import seriIcerikleri from '../../../../data/seriIcerikleri.json';
import { UploadCloud, Check, Video, RefreshCw, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step5_SeriFace({ sessionId, memberId, onComplete }) {
  // Select up to 4 items initially
  const [selectedIds, setSelectedIds] = useState(seriIcerikleri.map(s => s.id).slice(0, 4));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoFiles, setVideoFiles] = useState({}); // { id: file }
  const [customTexts, setCustomTexts] = useState({}); // { id: text }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const currentSeri = seriIcerikleri.find(s => s.id === selectedIds[currentIndex]);
  const currentText = customTexts[currentSeri?.id] !== undefined ? customTexts[currentSeri.id] : currentSeri?.icerik;
  const currentVideo = videoFiles[currentSeri?.id];

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFiles(prev => ({
        ...prev,
        [currentSeri.id]: e.target.files[0]
      }));
    }
  };

  const removeVideo = (id) => {
    setVideoFiles(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleTextChange = (e) => {
    setCustomTexts(prev => ({
      ...prev,
      [currentSeri.id]: e.target.value
    }));
  };

  const handleChangeCurrent = () => {
    // Basic rotation for MVP
    alert('İçerik değiştirildi (Simülasyon)');
  };

  const handleNext = () => {
    if (currentIndex < selectedIds.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSaveAll();
    }
  };

  const handleSaveAll = async () => {
    const idsWithVideo = Object.keys(videoFiles);
    if (idsWithVideo.length === 0) {
      alert('Lütfen en az bir içerik için video yükleyin.');
      return;
    }

    setIsSubmitting(true);
    try {
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const insertData = [];

      for (let i = 0; i < idsWithVideo.length; i++) {
        const sId = parseInt(idsWithVideo[i]);
        const file = videoFiles[sId];
        const finalMetin = customTexts[sId] !== undefined ? customTexts[sId] : seriIcerikleri.find(s => s.id === sId).icerik;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${memberId}-${sId}-${Date.now()}.${fileExt}`;
        const filePath = `${ay}/${fileName}`;

        setUploadProgress(Math.floor((i / idsWithVideo.length) * 100));

        const { error: uploadError } = await supabase.storage
          .from('test-seri-face')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('test-seri-face')
          .getPublicUrl(filePath);

        insertData.push({
          session_id: sessionId,
          member_id: memberId,
          icerik_id: sId,
          icerik_metni: finalMetin,
          video_url: publicUrl,
          ay
        });
      }

      setUploadProgress(90);

      const { error } = await supabase
        .from('TEST_seri_face_uploads')
        .insert(insertData);

      if (error) throw error;
      
      setUploadProgress(100);
      setTimeout(() => onComplete('seri_face'), 500);

    } catch (e) {
      console.error('Error saving seri face files:', e);
      alert('Yükleme sırasında hata oluştu.');
      setIsSubmitting(false);
    }
  };

  if (!currentSeri) return null;

  return (
    <GlassCard padding="1.5rem" borderRadius="20px" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem' }}>🎬 Seri Face Reel</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Metni okuyarak kendi videonuzu çekin.</p>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '0', fontSize: '0.7rem', color: 'var(--color-accent)' }}>
          {currentIndex + 1} / {selectedIds.length}
        </div>
        
        <textarea 
          value={currentText}
          onChange={handleTextChange}
          rows={6}
          style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', lineHeight: 1.5, resize: 'vertical', outline: 'none' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button onClick={handleChangeCurrent} style={{ background: 'transparent', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Başka Metin Getir
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', cursor: 'pointer' }}>
        <input 
          type="file" 
          accept="video/*" 
          capture="user"
          onChange={handleVideoChange} 
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        {currentVideo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
            <Video size={24} color="var(--color-accent)" />
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>{currentVideo.name}</span>
            <button onClick={(e) => { e.preventDefault(); removeVideo(currentSeri.id); }} style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', marginLeft: '1rem' }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={24} color="#888" style={{ marginBottom: '0.5rem' }} />
            <span style={{ color: '#888', fontSize: '0.85rem' }}>Videoyu yüklemek / çekmek için dokunun</span>
          </>
        )}
      </div>

      {isSubmitting && uploadProgress > 0 && (
        <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
            style={{ height: '100%', background: 'var(--color-accent)' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button 
          onClick={handleNext}
          disabled={isSubmitting}
          style={{ flex: 1, padding: '0.8rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          {currentIndex === selectedIds.length - 1 ? (
            <>{isSubmitting ? 'Tamamlanıyor...' : 'Gönder ve Bitir'} <Check size={18} /></>
          ) : (
            <>Sonraki Video <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
