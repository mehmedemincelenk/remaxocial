import { useState, useEffect } from 'react';

export default function DesktopWrapper({ children }) {
  const [isM, setIsM] = useState(window.innerWidth <= 1024);
  useEffect(() => {
    const r = () => setIsM(window.innerWidth <= 1024);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  if (isM) return <div className="mobile-view">{children}</div>;

  return (
    <div className="desktop-mockup-container" style={{ justifyContent: 'center', background: '#050505' }}>
      <div className="mockup-phone-section" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="phone-frame">
          <div className="phone-bezel-highlight" />
          <div className="phone-notch"><div className="speaker" /><div className="camera" /></div>
          <div className="phone-screen">{children}</div>
          <div className="phone-buttons-container"><div className="hw-btn vol-up" /><div className="hw-btn vol-down" /><div className="hw-btn power" /></div>
        </div>
      </div>
    </div>
  );
}
