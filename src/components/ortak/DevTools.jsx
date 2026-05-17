import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, Sparkles, LogOut, Check, Play, Monitor } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import GlassCard from './GlassCard';

export default function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated, user } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle DevTools visibility with Alt + Shift + D OR Ctrl + Alt + D
      const isAltShiftD = e.altKey && e.shiftKey && e.key.toLowerCase() === 'd';
      const isCtrlAltD = e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd';
      if (isAltShiftD || isCtrlAltD) {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    let lastClickTime = 0;
    let clickCount = 0;

    const handleGlobalClick = (e) => {
      // Detect 5 rapid clicks/taps in the top-left 50px of the screen
      if (e.clientX <= 50 && e.clientY <= 50) {
        const currentTime = Date.now();
        if (currentTime - lastClickTime < 400) {
          clickCount++;
        } else {
          clickCount = 1;
        }
        lastClickTime = currentTime;

        if (clickCount >= 5) {
          setIsVisible(prev => !prev);
          clickCount = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const isAjansa = location.pathname === '/ajansa';

  const handleDevLogin = () => {
    window.dispatchEvent(new CustomEvent('dev-login-bypass'));
  };

  const handleDevLogout = () => {
    window.dispatchEvent(new CustomEvent('dev-logout-bypass'));
  };

  const triggerStepChange = (stepNum) => {
    window.dispatchEvent(new CustomEvent('dev-step-change', { detail: { step: stepNum } }));
  };

  if (!isVisible || location.pathname === '/sunum') return null;

  return (
    <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 999999, pointerEvents: 'none' }}>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: '36px', height: '36px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.8)', color: '#4ADE80', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          pointerEvents: 'all'
        }}
        title="Developer Tools"
      >
        <Terminal size={16} />
      </motion.button>

      {/* Expanded Controls Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: 'all', marginTop: '8px' }}
          >
            <GlassCard padding="1rem" borderRadius="16px" style={{ width: '220px', border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                <ShieldAlert size={14} color="#4ADE80" />
                <span style={{ fontSize: '0.65rem', fontWeight: '900', color: '#4ADE80', letterSpacing: '1px', textTransform: 'uppercase' }}>DEV MODE SHORTCUTS</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!isAuthenticated ? (
                  <button
                    onClick={handleDevLogin}
                    style={{
                      width: '100%', height: '36px', borderRadius: '10px', border: '1px solid #4ADE80',
                      background: 'rgba(74,222,128,0.1)', color: '#4ADE80', fontSize: '0.7rem',
                      fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '6px', transition: '0.2s'
                    }}
                  >
                    <Sparkles size={12} /> GİRİŞİ GEÇ (DEV BYPASS)
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={10} color="#4ADE80" /> Aktif Oturum: <b>{user?.email}</b>
                    </div>
                    <button
                      onClick={handleDevLogout}
                      style={{
                        width: '100%', height: '36px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)', color: '#ff4d4d', fontSize: '0.7rem',
                        fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '6px', transition: '0.2s'
                      }}
                    >
                      <LogOut size={12} /> OTURUMU SIFIRLA
                    </button>
                  </div>
                )}

                {/* Ajansa-Specific Step Shortcuts */}
                {isAjansa && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#4ADE80', letterSpacing: '0.5px' }}>İÇERİK GÜNÜ ADIMI GEÇ</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                          key={num}
                          onClick={() => triggerStepChange(num)}
                          style={{
                            height: '24px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.3)',
                            background: 'rgba(74,222,128,0.05)', color: '#4ADE80', fontSize: '0.65rem',
                            fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', transition: '0.2s'
                          }}
                        >
                          {num === 9 ? 'Son' : num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
