import { useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import GlassCard from '../../../ortak/GlassCard';
import { UploadCloud, Check, Video, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step3_BusinessVibe({ sessionId, memberId, onComplete }) {
  const [videoFiles, setVideoFiles] = useState([]);
  const [aciklama, setAciklama] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setVideoFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeVideo = (index) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (videoFiles.length === 0) {
      alert('Lütfen en az 1 adet video yükleyin.');
      return;
    }

    setIsSubmitting(true);
    try {
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const insertData = [];

      for (let i = 0; i < videoFiles.length; i++) {
        const file = videoFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${memberId}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `${ay}/${fileName}`;

        // Upload progress (dummy approximation)
        setUploadProgress(Math.floor((i / videoFiles.length) * 100));

        const { error: uploadError } = await supabase.storage
          .from('test-business-vibe')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('test-business-vibe')
          .getPublicUrl(filePath);

        insertData.push({
          session_id: sessionId,
          member_id: memberId,
          video_url: publicUrl,
          aciklama: i === 0 ? aciklama : null, // Sadece ilk videoya notu ekleyelim veya ayrı ayrı
          ay
        });
      }

      setUploadProgress(90);

      const { error } = await supabase
        .from('TEST_business_vibe_uploads')
        .insert(insertData);

      if (error) throw error;
      
      setUploadProgress(100);
      setTimeout(() => onComplete('business_vibe'), 500);

    } catch (e) {
      console.error('Error in Step3:', e);
      alert('Yükleme sırasında hata oluştu.');
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard padding="1.5rem" borderRadius="20px" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem' }}>🎥 Business Vibe</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Saha, ofis veya günlük hayatınızdan kısa klipler yükleyin.</p>
      </div>

      <div style={{ position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', cursor: 'pointer' }}>
        <input 
          type="file" 
          accept="video/*" 
          multiple
          onChange={handleVideoChange} 
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        <UploadCloud size={32} color="var(--color-accent)" style={{ marginBottom: '0.5rem' }} />
        <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>Videoları Seçin</span>
        <span style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.25rem' }}>Birden fazla seçebilirsiniz</span>
      </div>

      {videoFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
          <AnimatePresence>
            {videoFiles.map((file, i) => (
              <motion.div 
                key={file.name + i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.8rem', borderRadius: '8px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  <Video size={16} color="var(--color-accent)" />
                  <span style={{ color: '#fff', fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{file.name}</span>
                </div>
                <button onClick={() => removeVideo(i)} style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', padding: '0.2rem' }}>
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <textarea 
        placeholder="Eklemek istediğiniz notlar? (Opsiyonel)" 
        value={aciklama}
        onChange={(e) => setAciklama(e.target.value)}
        rows={2}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none', resize: 'none' }}
      />

      {isSubmitting && uploadProgress > 0 && (
        <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
            style={{ height: '100%', background: 'var(--color-accent)' }}
          />
        </div>
      )}

      <button 
        onClick={handleSave}
        disabled={isSubmitting}
        style={{ marginTop: '0.5rem', padding: '0.8rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
      >
        {isSubmitting ? 'Videolar Yükleniyor...' : 'Gönder ve İlerle'} <Check size={18} />
      </button>
    </GlassCard>
  );
}
