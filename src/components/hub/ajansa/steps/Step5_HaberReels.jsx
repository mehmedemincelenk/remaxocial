import { useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import GlassCard from '../../../ortak/GlassCard';
import haberler from '../../../../data/haberler.json';
import { UploadCloud, Check, Mic, Play, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step5_HaberReels({ sessionId, memberId, onComplete }) {
  const [selectedIds] = useState(haberler.map(h => h.id).slice(0, 5)); // Limit to 5 for MVP
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioFiles, setAudioFiles] = useState({}); // { haberId: file }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const currentHaber = haberler.find(h => h.id === selectedIds[currentIndex]);

  const handleAudioChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFiles(prev => ({
        ...prev,
        [currentHaber.id]: e.target.files[0]
      }));
    }
  };

  const removeAudio = (id) => {
    setAudioFiles(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleNext = () => {
    if (currentIndex < selectedIds.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSaveAll();
    }
  };

  const handleSaveAll = async () => {
    const idsWithAudio = Object.keys(audioFiles);
    if (idsWithAudio.length === 0) {
      alert('Lütfen en az bir haber için ses kaydı yükleyin.');
      return;
    }

    setIsSubmitting(true);
    try {
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const insertData = [];

      for (let i = 0; i < idsWithAudio.length; i++) {
        const hId = parseInt(idsWithAudio[i]);
        const file = audioFiles[hId];
        const haber = haberler.find(h => h.id === hId);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${memberId}-${hId}-${Date.now()}.${fileExt}`;
        const filePath = `${ay}/${fileName}`;

        setUploadProgress(Math.floor((i / idsWithAudio.length) * 100));

        const { error: uploadError } = await supabase.storage
          .from('test-haber-ses')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('test-haber-ses')
          .getPublicUrl(filePath);

        insertData.push({
          session_id: sessionId,
          member_id: memberId,
          haber_id: hId,
          haber_basligi: haber.baslik,
          ses_url: publicUrl,
          ay
        });
      }

      setUploadProgress(90);

      const { error } = await supabase
        .from('test_haber_ses_kayitlari')
        .insert(insertData);

      if (error) throw error;
      
      setUploadProgress(100);
      setTimeout(() => onComplete('haber_video'), 500);

    } catch (e) {
      console.error('Error saving audio files:', e);
      alert('Yükleme sırasında hata oluştu.');
      setIsSubmitting(false);
    }
  };

  const currentAudio = audioFiles[currentHaber.id];

  return (
    <GlassCard padding="1.5rem" borderRadius="20px" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem' }}>📰 Haber Reels</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Haber metinlerini okuyun ve ses kaydınızı yükleyin.</p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', position: 'relative', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '0.7rem', color: 'var(--color-accent)' }}>
          {currentIndex + 1} / {selectedIds.length}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHaber.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h4 style={{ color: 'var(--color-accent)', margin: '0 0 0.5rem 0' }}>{currentHaber.baslik}</h4>
            <p style={{ color: '#fff', fontSize: '1rem', margin: 0, lineHeight: 1.5 }}>
              {currentHaber.metin}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', cursor: 'pointer' }}>
        <input 
          type="file" 
          accept="audio/*" 
          capture="microphone"
          onChange={handleAudioChange} 
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        {currentAudio ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
            <Mic size={24} color="var(--color-accent)" />
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>{currentAudio.name}</span>
            <button onClick={(e) => { e.preventDefault(); removeAudio(currentHaber.id); }} style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', marginLeft: '1rem' }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Mic size={24} color="#888" style={{ marginBottom: '0.5rem' }} />
            <span style={{ color: '#888', fontSize: '0.85rem' }}>Ses kaydı yüklemek / kaydetmek için dokunun</span>
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
            <>{isSubmitting ? 'Kaydediliyor...' : 'Gönder ve İlerle'} <Check size={18} /></>
          ) : (
            <>Sonraki Haber <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
