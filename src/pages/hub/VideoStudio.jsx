import { useState, useEffect, useRef } from 'react';
import GlassCard from '../../components/ortak/GlassCard';
import { Mic, Play, Square, RefreshCcw, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const VideoStudio = () => {
  const { notify } = useAppContext();
  const [news, setNews] = useState([]);
  const [recordingState, setRecordingState] = useState({}); // { index: 'idle' | 'recording' | 'review' | 'syncing' | 'done' }
  const [audioUrls, setAudioUrls] = useState({});
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    fetch('/api/news.json') 
      .then(res => res.json())
      .then(data => setNews(Array.isArray(data) ? data : [])); 
  }, []);

  const startRecording = async (index) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];
    
    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      setAudioUrls(prev => ({ ...prev, [index]: url }));
      setRecordingState(prev => ({ ...prev, [index]: 'review' }));
    };

    mediaRecorder.current.start();
    setRecordingState(prev => ({ ...prev, [index]: 'recording' }));
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
  };

  const handleConfirm = async (index) => {
    setRecordingState(prev => ({ ...prev, [index]: 'syncing' }));
    
    try {
      const response = await fetch(audioUrls[index]);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('newsId', index + 1); // Önce metin alanı
      formData.append('audio', blob); // Sonra dosya alanı

      const serverRes = await fetch('http://localhost:5000/api/save-audio', {
        method: 'POST',
        body: formData
      });

      if (serverRes.ok) {
        setRecordingState(prev => ({ ...prev, [index]: 'done' }));
      } else {
        throw new Error('Sunucu hatası');
      }
    } catch (error) {
      console.error('❌ Kayıt gönderilemedi:', error);
      notify('Kayıt kaydedilirken bir hata oluştu.', 'error');
      setRecordingState(prev => ({ ...prev, [index]: 'review' }));
    }
  };

  const handleRetry = (index) => {
    setAudioUrls(prev => ({ ...prev, [index]: null }));
    setRecordingState(prev => ({ ...prev, [index]: 'idle' }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px', paddingBottom: '120px' }}>
      <header style={{ marginBottom: '40px', maxWidth: '1200px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '40px', height: '3px', backgroundColor: '#0054a5' }} />
          <span style={{ color: '#0054a5', fontWeight: '900', fontSize: '12px', letterSpacing: '2px' }}>STUDIO</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '700', margin: '0 0 10px 0', lineHeight: '1' }}>
          Vibe <span style={{ opacity: 0.2 }}>Studio</span>
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.5, fontWeight: '400' }}>Kaydet, Dinle ve Onayla. Gerisini Yapay Zekaya Bırak.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', 
        gap: '25px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {news.map((item, index) => {
          const state = recordingState[index] || 'idle';
          const audioUrl = audioUrls[index];

          return (
            <GlassCard key={index} style={{ display: 'flex', flexDirection: 'column', padding: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '9px', fontWeight: '600', opacity: 0.6, letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '8px' }}>
                    {item.category}
                  </span>
                  <div style={{ 
                    width: '8px', height: '8px', borderRadius: '50%', 
                    backgroundColor: state === 'done' ? '#22c55e' : (state === 'recording' ? '#ef4444' : '#0054a5'),
                    boxShadow: state === 'recording' ? '0 0 10px #ef4444' : 'none'
                  }} />
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', lineHeight: '1.2' }}>{item.title}</h3>
                
                <div style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.6', 
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {(item.script || item.summary).split(/(?<=[.!?])\s+/).map((sentence, sIdx) => (
                    <div key={sIdx} style={{ marginBottom: '8px' }}>
                      {sentence.split(' ').map((word, wIdx) => {
                        const boldLen = Math.max(1, Math.floor(word.length * 0.5));
                        return (
                          <span key={wIdx}>
                            <strong style={{ fontWeight: '700', color: '#fff' }}>{word.slice(0, boldLen)}</strong>
                            {word.slice(boldLen)}{' '}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Recording Controls */}
                {state === 'idle' && (
                  <button onClick={() => startRecording(index)} style={btnStyle('#0054a5', true)}>
                    <Mic size={24} color="white" />
                  </button>
                )}

                {state === 'recording' && (
                  <button onClick={stopRecording} style={btnStyle('#ef4444', true, true)}>
                    <Square fill="white" size={20} />
                  </button>
                )}

                {state === 'review' && (
                  <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'space-between' }}>
                    <button onClick={() => new Audio(audioUrl).play()} style={btnStyle('rgba(255,255,255,0.1)')}>
                      <Play size={20} color="white" />
                    </button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleRetry(index)} style={btnStyle('rgba(239,68,68,0.1)')}>
                        <RefreshCcw size={20} color="#ef4444" />
                      </button>
                      <button onClick={() => handleConfirm(index)} style={btnStyle('#22c55e')}>
                        <Check size={20} color="white" />
                      </button>
                    </div>
                  </div>
                )}

                {state === 'syncing' && (
                  <div style={{ width: '100%', textAlign: 'center', color: '#0054a5', fontWeight: '900', fontSize: '12px' }}>
                    AI SENKRONİZASYONU YAPILIYOR...
                  </div>
                )}

                {state === 'done' && (
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#22c55e', fontWeight: '900' }}>
                    <Check size={20} /> VİDEO HAZIR!
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

const btnStyle = (bg, isLarge = false, pulse = false) => ({
  width: isLarge ? '65px' : '50px',
  height: isLarge ? '65px' : '50px',
  borderRadius: '18px',
  border: 'none',
  backgroundColor: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s',
  animation: pulse ? 'pulse 1.5s infinite' : 'none'
});

export default VideoStudio;
