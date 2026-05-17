import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Send, RefreshCw, Download, Loader2, Mail } from 'lucide-react';
import PageLayout from '../../components/ortak/PageLayout';
import useCameraRecorder from '../../hooks/useCameraRecorder';
import { useAppContext } from '../../context/AppContext';

export default function SelfieStudio() {
  const h = useCameraRecorder();
  const { notify } = useAppContext();
  const script = "Gayrimenkul dünyasında fark yaratmaya hazır mısınız? Bugün sizlere özel portföylerimizden ve piyasa analizlerimizden bahsedeceğim. Hayalinizdeki eve giden yolda birlikte yürüyelim. Takipte kalın, fırsatları kaçırmayın!";

  useEffect(() => { h.startCamera(); return () => h.stopCamera(); }, []);

  const handleSave = () => {
    h.setIsSaving(true);
    setTimeout(() => { h.setIsSaving(false); notify("Video başarıyla aktarıldı!", "success"); }, 2000);
  };

  const actions = [
    { icon: RotateCcw, onClick: () => { h.setPreviewUrl(null); h.startCamera(); }, show: !!h.previewUrl },
    { icon: Download, onClick: () => { const a = document.createElement('a'); a.href = h.previewUrl; a.download = 'video.webm'; a.click(); }, show: !!h.previewUrl },
    { icon: h.isSaving ? Loader2 : Send, onClick: handleSave, bg: '#22c55e', show: !!h.previewUrl },
    { icon: RefreshCw, onClick: h.toggleCamera, show: !h.previewUrl && !!h.stream, pos: 'left' },
    { icon: X, onClick: h.stopCamera, show: !h.previewUrl && !!h.stream && !h.isRecording, pos: 'right' }
  ];

  return (
    <PageLayout padding="0" withBottomNav={false}>
      <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#000', overflow: 'hidden' }}>
        {h.previewUrl ? <video src={h.previewUrl} controls autoPlay loop style={vStyle(h.facingMode)} /> : <video ref={h.videoRef} autoPlay playsInline muted style={vStyle(h.facingMode)} />}
        
        {(h.isRecording || h.previewUrl) && <div style={timerStyle}>{h.isRecording && <div style={dotStyle} />}{Math.floor(h.duration/60)}:{(h.duration%60).toString().padStart(2,'0')}</div>}

        {h.countdown !== null && <div style={overlayStyle}><motion.div key={h.countdown} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: '10rem', fontWeight: '900', color: '#fff' }}>{h.countdown}</motion.div></div>}

        {!h.isRecording && h.stream && !h.previewUrl && <div style={overlayStyle}><div style={guideStyle}><span style={{ opacity: 0.6, fontSize: '0.7rem' }}>Hizala</span></div></div>}

        {h.stream && !h.previewUrl && <div style={teleStyle}><motion.div animate={h.isRecording ? { y: [150, -300] } : { y: 0 }} transition={{ duration: 25, ease: "linear", repeat: h.isRecording ? Infinity : 0 }} style={{ color: '#fff', fontSize: '0.9rem' }}>{script}</motion.div></div>}

        <div style={ctrlStyle}>
          {h.previewUrl ? actions.filter(a => a.show && !a.pos).map((a, i) => <button key={i} onClick={a.onClick} style={btnStyle(a.bg || 'rgba(255,255,255,0.1)')}><a.icon size={24} className={a.icon === Loader2 ? 'animate-spin' : ''} /></button>) : h.stream && (
            <>
              {actions.filter(a => a.show && a.pos).map((a, i) => <button key={i} onClick={a.onClick} style={{ ...btnStyle('rgba(255,255,255,0.1)'), position: 'absolute', [a.pos]: '40px', width: '50px', height: '50px' }}><a.icon size={24} color="#fff" /></button>)}
              <button onClick={() => h.isRecording ? h.stopRecording() : h.setCountdown(4)} style={recBtnStyle}><div style={h.isRecording ? { width: '30px', height: '30px', borderRadius: '4px', background: '#ef4444' } : { width: '60px', height: '60px', borderRadius: '50%', background: '#ef4444' }} /></button>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

const vStyle = (fm) => ({ width: '100%', height: '100%', objectFit: 'cover', transform: fm === 'user' ? 'scaleX(-1)' : 'none' });
const timerStyle = { position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '20px', color: '#fff', zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px' };
const dotStyle = { width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' };
const overlayStyle = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, pointerEvents: 'none' };
const guideStyle = { width: '160px', height: '210px', border: '2px dashed rgba(255,255,255,0.5)', borderRadius: '50% 50% 45% 45%', marginTop: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' };
const teleStyle = { position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '90%', height: '140px', background: 'rgba(0,0,0,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', overflow: 'hidden', zIndex: 100 };
const ctrlStyle = { position: 'absolute', bottom: '30px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '20px', zIndex: 200 };
const btnStyle = (bg) => ({ width: '65px', height: '65px', borderRadius: '50%', border: 'none', background: bg, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' });
const recBtnStyle = { width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #fff', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
