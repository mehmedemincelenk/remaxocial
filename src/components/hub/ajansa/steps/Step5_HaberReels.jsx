import { useState, useEffect } from 'react';
import { Mic, RotateCw, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';
import { useAppContext } from '../../../../context/AppContext';
import haberler from '../../../../data/haberler.json';

export default function Step5_HaberReels({ sessionId, memberId, onComplete, onPrev }) {
  const { notify } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioFiles, setAudioFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStories, setSelectedStories] = useState(() => haberler.slice(0, 4));
  const currentHaber = selectedStories[currentIndex];

  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => () => clearInterval(timer), [timer]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = e => chunks.push(e.data);
      rec.onstop = () => {
        setAudioFiles(p => ({ ...p, [currentHaber.id]: new File([new Blob(chunks, { type: 'audio/webm' })], `${currentHaber.id}.webm`, { type: 'audio/webm' }) }));
        stream.getTracks().forEach(t => t.stop());
      };
      rec.start();
      setRecorder(rec);
      setIsRecording(true);
      setSeconds(0);
      setTimer(setInterval(() => setSeconds(s => s + 1), 1000));
    } catch { notify('Mikrofon erişilemedi.', 'error'); }
  };

  const stopRec = () => {
    recorder?.stop();
    setIsRecording(false);
    clearInterval(timer);
  };

  const discardRec = () => {
    if (isRecording) stopRec();
    setAudioFiles(p => {
      const copy = { ...p };
      delete copy[currentHaber.id];
      return copy;
    });
  };

  const handleRefresh = () => {
    discardRec();
    const pool = haberler.filter(h => !selectedStories.some(s => s.id === h.id));
    if (!pool.length) return notify('Başka haber kalmadı.', 'info');
    setSelectedStories(prev => {
      const copy = [...prev];
      copy[currentIndex] = pool[Math.floor(Math.random() * pool.length)];
      return copy;
    });
  };

  const handleSave = async () => {
    if (Object.keys(audioFiles).length < 4) return notify('Lütfen tüm haberleri seslendirin.', 'error');
    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      for (const story of selectedStories) {
        const file = audioFiles[story.id];
        const filePath = `${ay}/${memberId}-${story.id}-${Date.now()}.webm`;
        await supabase.storage.from('test-haber-ses').upload(filePath, file);
        const { data: { publicUrl } } = supabase.storage.from('test-haber-ses').getPublicUrl(filePath);
        await supabase.from('test_haber_ses_kayitlari').insert([{ session_id: sessionId, member_id: memberId, haber_id: story.id, ses_url: publicUrl, ay }]);
      }
      onComplete('haber_video');
    } catch { notify('Gönderim başarısız.', 'error'); } finally { setIsSubmitting(false); }
  };

  const currentAudio = audioFiles[currentHaber.id];

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
        <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.15rem' }}>📰 Haber Reels</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.75rem' }}>4 haber reels içeriğini seslendirin.</p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '12px', position: 'relative', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>{currentIndex + 1} / 4</div>
        <h4 style={{ color: 'var(--color-accent)', margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>{currentHaber.baslik}</h4>
        <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>🗣️ OKUNACAK KONUŞMA METNİ</div>
        <p style={{ color: '#fff', fontSize: '0.76rem', lineHeight: '1.4', margin: 0 }}>"{currentHaber.metin}"</p>
      </div>

      <div style={boxStyle}>
        {isRecording ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <button onClick={stopRec} style={recordBtnStyle} className="animate-pulse">
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#fff' }} />
            </button>
            <span style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '0.75rem' }}>🔴 {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>
          </div>
        ) : currentAudio ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', width: '100%' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.78rem' }}>🎉 Ses Kaydı Hazır!</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => new Audio(URL.createObjectURL(currentAudio)).play()} style={actStyle}>🔊 Dinle</button>
              <button onClick={discardRec} style={delStyle}>🗑️ Sil</button>
              <button onClick={() => currentIndex < 3 ? setCurrentIndex(p => p + 1) : handleSave()} style={confStyle}>Onayla</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <button onClick={startRec} style={micStyle}><Mic size={20} color="#000" /></button>
            <span style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 'bold' }}>Kayıt Başlat</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
        <button 
          onClick={() => onComplete('haber_video_skipped')} 
          style={{ width: '60px', height: '42px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#aaa', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', flexShrink: 0 }}
        >
          Atla
        </button>
        <button onClick={handleRefresh} style={secStyle}><RotateCw size={16} /></button>
        <button onClick={() => currentAudio ? (currentIndex < 3 ? setCurrentIndex(p => p + 1) : handleSave()) : notify('Kayıt yapmalısınız.', 'error')} disabled={isSubmitting} style={primStyle}>
          {currentIndex < 3 ? 'Sonraki' : (isSubmitting ? '...' : 'Gönder')}
        </button>
      </div>
    </GlassCard>
  );
}

const boxStyle = { width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.75rem', justifyContent: 'center', minHeight: '90px' };
const micStyle = { width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 10px rgba(6,182,212,0.25)' };
const recordBtnStyle = { width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: '#ff4d4d', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 10px rgba(255,77,77,0.3)' };
const actStyle = { padding: '5px 12px', borderRadius: '10px', border: '1px solid var(--color-accent)', background: 'rgba(6,182,212,0.1)', color: 'var(--color-accent)', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' };
const delStyle = { ...actStyle, background: 'rgba(255,77,77,0.15)', borderColor: '#ff4d4d', color: '#ff4d4d' };
const confStyle = { ...actStyle, background: 'var(--color-accent)', color: '#000', borderColor: 'transparent' };
const secStyle = { width: '42px', height: '42px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' };
const primStyle = { flex: 1, height: '42px', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' };
