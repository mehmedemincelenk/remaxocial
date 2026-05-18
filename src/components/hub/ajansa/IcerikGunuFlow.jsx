import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { GlassCard, MegaInput, MegaButton } from '../../ortak';
import useIcerikGunu from '../../../hooks/useIcerikGunu';
import * as Steps from './steps/FlowSteps';

export default function IcerikGunuFlow() {
  const h = useIcerikGunu();
  const stepList = [
    Steps.Step1_SicakVeriHaberler,
    Steps.Step7_StoryAnket,
    Steps.Step8_SatildiKiralandi, // 3. Adım: Satıldı / Kiralandı Başarı İlanı
    Steps.Step2_MusteriMesaji,
    Steps.Step3_MusteriVideosu,
    Steps.Step4_BusinessVibe,
    Steps.Step6_SeriFace
  ];
  const ActiveStep = h.step > 0 && h.step <= 7 ? stepList[h.step - 1] : null;

  if (h.loading && h.step === 0) return <div style={centerStyle}><Loader2 className="animate-spin" color="#fff" /></div>;

  if (h.step === 0) return (
    <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
      <GlassCard padding="1.8rem" borderRadius="24px" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✉️</div>
        {h.authView === 'login' ? (
          <>
            <h2 style={h2Style}>Giriş Yap</h2>
            <MegaInput type="email" placeholder="ornek@remax.com" value={h.email} onChange={e => h.update({ email: e.target.value })} icon={Mail} style={{ marginBottom: '1rem' }} />
            <MegaButton onClick={() => h.login(h.email)} isLoading={h.loading}>Giriş Bağlantısı Gönder</MegaButton>
          </>
        ) : (
          <>
            <h2 style={h2Style}>Kontrol Edin</h2>
            <p style={pStyle}><b>{h.email}</b> adresine giriş bağlantısı gönderdik.</p>
            <MegaButton variant="secondary" onClick={() => h.update({ authView: 'login' })}>Geri Dön</MegaButton>
          </>
        )}
      </GlassCard>
    </div>
  );

  if (h.step === 8) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={centerStyle}>
      <GlassCard padding="3rem" borderRadius="30px" style={{ textAlign: 'center' }}>
        <CheckCircle2 size={64} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={h2Style}>Harika İş!</h2>
        <p style={pStyle}>İçerik günü oturumunu tamamladınız. Editörlerimiz işe koyuldu bile!</p>
      </GlassCard>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        <motion.div key={h.step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {ActiveStep && (
            <ActiveStep 
              sessionId={h.session} 
              memberId={h.memberId} 
              onComplete={h.complete} 
              onPrev={h.step > 1 ? h.prevStep : null}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const centerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' };
const h2Style = { color: '#fff', marginBottom: '0.8rem', fontSize: '1.1rem' };
const pStyle = { color: '#aaa', fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '1.5rem' };
