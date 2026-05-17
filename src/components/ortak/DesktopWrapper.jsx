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
          <h1 className="mockup-title">
            RE/MAX <span className="gradient-text">SOCIAL</span>
          </h1>
          <p className="mockup-subtitle">
            Yapay zeka gücüyle gayrimenkul danışmanları için otomatik içerik üretim ve yönetim stüdyosu.
          </p>
          <div className="qr-box">
            <div className="qr-icon-container">
              <span style={{ fontSize: '1.5rem' }}>📱</span>
            </div>
            <div className="qr-text">
              <h3>Mobil Uyumlu Deneyim</h3>
              <p>Telefonunuzdan QR kodu taratarak veya bu pencereyi daraltarak mobil cihazınızda anında test edebilirsiniz.</p>
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
