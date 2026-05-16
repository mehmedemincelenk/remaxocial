import { useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import GlassCard from '../../../ortak/GlassCard';
import { UploadCloud, Check, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Step2_MusteriMemnuniyeti({ sessionId, memberId, onComplete }) {
  const [musteriAdi, setMusteriAdi] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!mesaj && !videoFile) {
      alert('Lütfen bir mesaj yazın veya video yükleyin.');
      return;
    }

    setIsSubmitting(true);
    try {
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      let video_url = null;

      if (videoFile) {
        setUploadProgress(10);
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${memberId}-${Date.now()}.${fileExt}`;
        const filePath = `${ay}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('test-musteri-video')
          .upload(filePath, videoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        setUploadProgress(50);

        const { data: { publicUrl } } = supabase.storage
          .from('test-musteri-video')
          .getPublicUrl(filePath);

        video_url = publicUrl;
        setUploadProgress(80);
      }

      const { error } = await supabase
        .from('TEST_musteri_memnuniyeti')
        .insert([{
          session_id: sessionId,
          member_id: memberId,
          musteri_adi: musteriAdi,
          mesaj,
          video_url,
          ay
        }]);

      if (error) throw error;
      setUploadProgress(100);
      
      // Delay slightly for UX
      setTimeout(() => {
        onComplete('musteri_memnuniyeti');
      }, 500);

    } catch (e) {
      console.error('Error in Step2:', e);
      alert('Yükleme sırasında hata oluştu.');
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard padding="1.5rem" borderRadius="20px" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem' }}>💬 Müşteri Memnuniyeti</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Müşterilerinizden gelen mesajları veya videoları ekleyin.</p>
      </div>

      <input 
        placeholder="Müşteri Adı (Opsiyonel)" 
        value={musteriAdi}
        onChange={(e) => setMusteriAdi(e.target.value)}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none' }}
      />

      <textarea 
        placeholder="Müşterinin size yazdığı mesajı buraya yapıştırın..." 
        value={mesaj}
        onChange={(e) => setMesaj(e.target.value)}
        rows={4}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none', resize: 'none' }}
      />

      <div style={{ position: 'relative', width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', cursor: 'pointer' }}>
        <input 
          type="file" 
          accept="video/*" 
          onChange={handleVideoChange} 
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        {videoFile ? (
          <>
            <Video size={24} color="var(--color-accent)" style={{ marginBottom: '0.5rem' }} />
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>{videoFile.name}</span>
          </>
        ) : (
          <>
            <UploadCloud size={24} color="#888" style={{ marginBottom: '0.5rem' }} />
            <span style={{ color: '#888', fontSize: '0.85rem' }}>Müşteri videosu yükle (Opsiyonel)</span>
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

      <button 
        onClick={handleSave}
        disabled={isSubmitting}
        style={{ marginTop: '0.5rem', padding: '0.8rem', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Kaydet ve İlerle'} <Check size={18} />
      </button>
    </GlassCard>
  );
}
