import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Send, RefreshCw, Download, Loader2 } from 'lucide-react';
import PageLayout from '../../components/ortak/PageLayout';

export default function SelfieStudio() {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorder = useRef(null);
  const chunksRef = useRef([]); 
  const [countdown, setCountdown] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const timerRef = useRef(null);
  
  const script = "Gayrimenkul dünyasında fark yaratmaya hazır mısınız? Bugün sizlere özel portföylerimizden ve piyasa analizlerimizden bahsedeceğim. Hayalinizdeki eve giden yolda birlikte yürüyelim. Takipte kalın, fırsatları kaçırmayın!";

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async (mode = facingMode) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      return mediaStream;
    } catch (err) {
      console.error("Kamera erişim hatası:", err);
      alert("Kameraya erişilemedi. Lütfen izinleri kontrol edin.");
    }
  };

  const toggleCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  const startRecording = () => {
    setCountdown(4);
  };

  const actualStartRecording = () => {
    chunksRef.current = [];
    setPreviewUrl(null);
    setDuration(0);
    
    // MimeType desteği için daha güvenli kontrol
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ];
    const selectedType = types.find(t => MediaRecorder.isTypeSupported(t)) || '';

    try {
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: selectedType });
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        // Blob oluşturulurken kaydedilen tipi kullan
        const blob = new Blob(chunksRef.current, { type: selectedType });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        stopCamera();
      };

      mediaRecorder.current.start(100);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Recorder hatası:", err);
    }
  };

  useEffect(() => {
    if (countdown === 4) {
      if (!stream) startCamera();
    }
    if (countdown === 0) {
      setCountdown(null);
      actualStartRecording();
    } else if (countdown !== null) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const handleRedo = () => {
    setPreviewUrl(null);
    setDuration(0);
    chunksRef.current = [];
    startCamera();
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `remax-video-${Date.now()}.webm`;
    a.click();
  };

  const handleSave = async () => {
    if (!previewUrl) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Video başarıyla aktarıldı!");
    }, 2000);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <PageLayout padding="0" withBottomNav={false}>
      <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#000', overflow: 'hidden' }}>
        
        {/* Önizleme Modu */}
        {previewUrl && (
          <video 
            key={previewUrl}
            src={previewUrl} 
            controls 
            autoPlay
            loop
            muted={false}
            playsInline
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              zIndex: 10, 
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' 
            }} 
          />
        )}

        {/* Canlı Kamera Modu */}
        {!previewUrl && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' 
            }} 
          />
        )}

        {/* Süre Göstergesi */}
        {(isRecording || previewUrl) && (
          <div style={{
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '5px 15px',
            borderRadius: '20px',
            color: '#fff',
            fontWeight: '800',
            fontSize: '0.9rem',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {isRecording && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1s infinite' }} />}
            {formatDuration(duration)}
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 300, pointerEvents: 'none' }}>
            <motion.div key={countdown} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: '12rem', fontWeight: '900', color: '#fff' }}>
              {countdown}
            </motion.div>
          </div>
        )}

        {/* Yüz Kılavuzu Maskesi */}
        {!isRecording && stream && !previewUrl && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '160px', height: '210px', border: '2px dashed rgba(255,255,255,0.5)', borderRadius: '50% 50% 45% 45%', marginTop: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
              <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: '600', opacity: 0.6 }}>Yüzünüzü Buraya Hizalayın</span>
            </div>
          </div>
        )}

        {/* Teleprompter */}
        {stream && !previewUrl && (
          <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '600px', height: '160px', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(20px) saturate(180%)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', zIndex: 100, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ padding: '0 25px', width: '100%' }}>
              <motion.div animate={isRecording ? { y: [180, -350] } : { y: 0 }} transition={{ duration: 30, ease: "linear", repeat: isRecording ? Infinity : 0 }} style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '300', lineHeight: '1.4' }}>
                {script.split(/(?<=[.!?])\s+/).map((sentence, sIdx) => (
                  <div key={sIdx} style={{ marginBottom: '8px' }}>
                    {sentence.split(' ').map((word, wIdx) => {
                      const boldLen = Math.max(1, Math.floor(word.length * 0.5));
                      return (
                        <span key={wIdx} style={{ color: '#fff' }}>
                          <strong style={{ fontWeight: '800', color: '#fff' }}>{word.slice(0, boldLen)}</strong>
                          {word.slice(boldLen)}{' '}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* Kontroller */}
        <div style={{ position: 'absolute', bottom: '30px', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
          {previewUrl ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button onClick={handleRedo} disabled={isSaving} style={iconBtnStyle('rgba(255,255,255,0.1)', '#fff')}><RotateCcw size={24} /></button>
              <button onClick={handleDownload} disabled={isSaving} style={iconBtnStyle('rgba(255,255,255,0.1)', '#fff')}><Download size={24} /></button>
              <button onClick={handleSave} disabled={isSaving} style={iconBtnStyle('#22c55e', '#fff')}>
                {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
          ) : stream && (
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={toggleCamera} style={{ position: 'absolute', left: '40px', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <RefreshCw size={24} color="#fff" />
              </button>

              {!isRecording ? (
                <button onClick={startRecording} style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'transparent', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                </button>
              ) : (
                <button onClick={stopRecording} style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'transparent', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: '#ef4444' }} />
                </button>
              )}
              
              {!isRecording && (
                <button onClick={stopCamera} style={{ position: 'absolute', right: '40px', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={24} color="#fff" />
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </PageLayout>
  );
}

const iconBtnStyle = (bg, color) => ({
  width: '65px',
  height: '65px',
  borderRadius: '50%',
  border: 'none',
  background: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  transition: '0.3s'
});
