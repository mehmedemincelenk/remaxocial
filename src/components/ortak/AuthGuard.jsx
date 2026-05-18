import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GlassCard, MegaInput, MegaButton, Loading } from './index';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '../../utils/supabaseClient';
import { checkWhitelist } from '../../utils/auth';

export default function AuthGuard({ children }) {
  const { loading, isAuthenticated, notify } = useAppContext();
  const [authView, setAuthView] = useState('login'); // 'login' | 'check_email'
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    const { allowed } = await checkWhitelist(email);
    if (!allowed) {
      notify("Bu e-posta adresi yetkili danışman listemizde bulunamadı.", "error");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });

    if (error) notify(error.message, "error");
    else {
      setAuthView('check_email');
      notify("Giriş bağlantısı gönderildi!", "success");
    }
    setIsSubmitting(false);
  };

  if (loading) return <Loading />;
  if (isAuthenticated) return children;

  return (
    <div style={containerStyle}>
      <AnimatePresence mode="wait">
        <motion.div key={authView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          <GlassCard padding="1.5rem" borderRadius="24px" style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <div style={iconBoxStyle}><ShieldCheck size={24} color="var(--color-accent)" /></div>
            
            {authView === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <h2 style={h2Style}>Danışman Girişi</h2>
                  <p style={pStyle}>Bu bölüme sadece yetkili Remaxocial danışmanları erişebilir.</p>
                </div>
                <MegaInput icon={Mail} type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <MegaButton type="submit" isLoading={isSubmitting}>Bağlantı Gönder</MegaButton>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ ...iconBoxStyle, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}><CheckCircle2 size={24} color="#22c55e" /></div>
                <div>
                  <h2 style={h2Style}>E-postanızı Kontrol Edin</h2>
                  <p style={pStyle}><b>{email}</b> adresine bir giriş bağlantısı gönderdik. Gelen kutunuzu kontrol edin.</p>
                </div>
                <MegaButton variant="secondary" onClick={() => setAuthView('login')}>Geri Dön</MegaButton>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const containerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '1rem' };
const iconBoxStyle = { width: '50px', height: '50px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' };
const h2Style = { color: '#fff', fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em' };
const pStyle = { color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.75rem', lineHeight: '1.5' };
