import { useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import GlassCard from '../../../ortak/GlassCard';
import { UploadCloud, Check, Video, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step3_MusteriVideosu({ sessionId, memberId, onComplete }) {
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!videoFile) {
      onComplete('musteri_videosu_skipped');
      return;
    }

    setIsSubmitting(true);
    try {
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      setUploadProgress(10);
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${memberId}-${Date.now()}.${fileExt}`;
      const filePath = `${ay}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('test-musteri-video')
        .upload(filePath, videoFile);

      if (uploadError) throw uploadError;
      setUploadProgress(60);

      const { data: { publicUrl } } = supabase.storage
        .from('test-musteri-video')
        .getPublicUrl(filePath);

      const { error } = await supabase
        .from('test_musteri_memnuniyeti')
        .insert([{
          session_id: sessionId,
          member_id: memberId,
          video_url: publicUrl,
          ay
        }]);

      if (error) throw error;
      setUploadProgress(100);
      setTimeout(() => onComplete('musteri_videosu'), 500);

    } catch (e) {
      console.error('Error in Step3:', e);
      alert('Yükleme hatası.');
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard padding="1.5rem" borderRadius="20px" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem' }}>🎥 Müşteri Videosu</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Varsa müşteri videonuzu yükleyin (Opsiyonel).</p>
      </div>

      <div style={{ position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', cursor: 'pointer' }}>
        <input type="file" accept="video/*" onChange={handleVideoChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
        {videoFile ? (
          <>
            <Video size={32} color="var(--color-accent)" />
            <span style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.5rem' }}>{videoFile.name}</span>
          </>
        ) : (
          <>
            <UploadCloud size={32} color="#444" />
            <span style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' }}>Video Seçin</span>
          </>
        )}
      </div>

      {isSubmitting && (
        <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${uploadProgress}%` }} style={{ height: '100%', background: 'var(--color-accent)' }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        {!videoFile && (
          <button onClick={() => onComplete('skipped')} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #444', borderRadius: '12px', color: '#aaa', cursor: 'pointer' }}>
            Atla
          </button>
        )}
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          style={{ flex: 2, padding: '0.8rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          {isSubmitting ? 'Yükleniyor...' : (videoFile ? 'Yükle ve İlerle' : 'İlerle')} <ChevronRight size={18} />
        </button>
      </div>
    </GlassCard>
  );
}
