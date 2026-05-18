import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function DesktopWrapper({ children }) {
  const [isM, setIsM] = useState(window.innerWidth <= 1024);
  const location = useLocation();

  useEffect(() => {
    const r = () => setIsM(window.innerWidth <= 1024);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  const isPresentation = location.pathname === '/sunum';

  // 1. Presentation Mode (100% full screen, no phone mockup, no left info pane)
  if (isPresentation) {
    return <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>{children}</div>;
  }

  // 2. Mobile View Fallback
  if (isM) {
    return <div className="mobile-view">{children}</div>;
  }

  // 3. Premium Desktop Split Screen View (Info Pane on Left, Centered Phone Frame on Right)
  return (
    <div className="desktop-mockup-container" style={{ background: '#050505' }}>
      {/* Left Info Pane */}
      <div className="mockup-info-section">
        <div className="info-content">
          <h1 className="mockup-title" style={{
            fontSize: '3.6rem',
            fontWeight: '900',
            lineHeight: '1.05',
            letterSpacing: '-0.04em',
            margin: '0 0 1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            textTransform: 'uppercase'
          }}>
            <span style={{ color: '#ffffff' }}>RSOCIAL</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>MOBİL DENEYİM.</span>
          </h1>
          <p className="mockup-subtitle" style={{
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: '0.98rem',
            lineHeight: '1.6',
            marginBottom: '3rem',
            maxWidth: '420px'
          }}>
            En yüksek performans ve konfor için bu uygulama mobil cihazlar için optimize edilmiştir.
          </p>
          <div className="qr-box" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '1.25rem',
            maxWidth: '440px'
          }}>
            <div style={{
              background: '#ffffff',
              padding: '8px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.origin)}&color=000000&bgcolor=ffffff`}
                alt="RSOCIAL QR Code"
                style={{ width: '80px', height: '80px', borderRadius: '4px', display: 'block' }}
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: '800',
                margin: '0 0 4px 0',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                QR KODU OKUTUN
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.35)',
                fontSize: '0.74rem',
                lineHeight: '1.4',
                margin: 0
              }}>
                Kameranızı açın ve uygulamaya doğrudan cebinizden ulaşın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Phone Mockup Pane */}
      <div className="mockup-phone-section">
        <div className="phone-frame">
          <div className="phone-bezel-highlight" />
          <div className="phone-notch">
            <div className="speaker" />
            <div className="camera" />
          </div>
          <div className="phone-screen">{children}</div>
          <div className="phone-buttons-container">
            <div className="hw-btn vol-up" />
            <div className="hw-btn vol-down" />
            <div className="hw-btn power" />
          </div>
        </div>
      </div>
    </div>
  );
}
