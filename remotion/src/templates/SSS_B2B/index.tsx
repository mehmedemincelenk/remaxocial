import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';

const { fontFamily: inter } = loadFont('normal', {
  weights: [400, 500, 700, 900],
});

const { fontFamily: playfair } = loadPlayfair('normal', {
  weights: [400, 700, 900],
});

export interface SSSB2BProps {
  question: string;
  answer: string;
  variant?: 
    | 'minimal' | 'executive' | 'glass-card' 
    | 'apple-classic' | 'apple-dark' | 'apple-glass' | 'apple-pro' | 'apple-night'
    | 'estate-luxury' | 'estate-urban';
}

const ESTATE_PHOTOS = {
  luxury: "1600047509807-ba51f9f6b6c4",
  urban: "1600607687920-4e2a12cf6a57",
};

export const SSS_B2B: React.FC<SSSB2BProps> = ({ 
  question, 
  answer, 
  variant = 'minimal' 
}) => {
  
  // Helper to render the actual Q&A content in the required layout
  const renderLayout = (config: {
    qColor?: string;
    aColor?: string;
    qFontSize?: string;
    aFontSize?: string;
    qFontWeight?: number | string;
    aFontWeight?: number | string;
    qFontFamily?: string;
    aFontFamily?: string;
    gap?: string;
    qLetterSpacing?: string;
    aLineHeight?: number | string;
    cardStyle?: React.CSSProperties;
    bgPhotoId?: string;
    backgroundElement?: React.ReactNode;
    mainBgColor?: string;
  }) => {
    const {
      qColor = '#000',
      aColor = '#4b5563',
      qFontSize = '64px',
      aFontSize = '38px',
      qFontWeight = 900,
      aFontWeight = 500,
      qFontFamily = inter,
      aFontFamily = inter,
      gap = '100px',
      qLetterSpacing = 'normal',
      aLineHeight = 1.5,
      cardStyle = {},
      bgPhotoId,
      backgroundElement,
      mainBgColor = '#fff'
    } = config;

    const hasCard = Object.keys(cardStyle).length > 0;

    return (
      <AbsoluteFill style={{ backgroundColor: mainBgColor, overflow: 'hidden', fontFamily: inter }}>
        {/* 1. Background Layers */}
        {bgPhotoId && (
          <AbsoluteFill style={{ filter: 'blur(40px)', transform: 'scale(1.1)' }}>
            <Img 
              src={`https://images.unsplash.com/photo-${bgPhotoId}?q=80&w=1080&auto=format&fit=crop`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
            />
            <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />
          </AbsoluteFill>
        )}
        {backgroundElement}

        {/* 2. Content Centering Wrapper */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: hasCard ? '100px' : '0',
            zIndex: 10,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            ...cardStyle
          }}>
            {/* Question: Top-Right */}
            <div style={{ textAlign: 'right', marginBottom: gap, alignSelf: 'flex-end', maxWidth: '95%' }}>
              <h2 style={{ 
                fontSize: qFontSize, 
                fontWeight: qFontWeight, 
                lineHeight: 1.1, 
                margin: 0, 
                color: qColor, 
                fontFamily: qFontFamily,
                letterSpacing: qLetterSpacing,
                textShadow: bgPhotoId ? '0 10px 40px rgba(0,0,0,0.5)' : 'none'
              }}>{question}</h2>
            </div>
            {/* Answer: Bottom-Left */}
            <div style={{ textAlign: 'left', alignSelf: 'flex-start', maxWidth: '95%' }}>
              <p style={{ 
                fontSize: aFontSize, 
                fontWeight: aFontWeight, 
                lineHeight: aLineHeight, 
                color: aColor, 
                margin: 0, 
                fontFamily: aFontFamily,
                textShadow: bgPhotoId ? '0 5px 20px rgba(0,0,0,0.3)' : 'none'
              }}>{answer}</p>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };

  if (variant === 'minimal') return renderLayout({ qColor: '#000', aColor: '#4b5563', qFontSize: '68px', mainBgColor: '#fff' });
  
  if (variant === 'executive') return renderLayout({ 
    qColor: '#ffffff', aColor: '#a1a1a6', qFontFamily: playfair, qFontSize: '80px', mainBgColor: '#050505',
    backgroundElement: <div style={{ position: 'absolute', top: '10%', right: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, #1a1a1a 0%, transparent 70%)', filter: 'blur(80px)' }} />,
    cardStyle: { backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.05)' }
  });

  if (variant === 'glass-card') return renderLayout({ 
    qColor: '#1d1d1f', aColor: '#424245', mainBgColor: '#e2e2e7',
    backgroundElement: <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '600px', height: '600px', background: 'linear-gradient(135deg, #a5b4fc 0%, #ddd6fe 100%)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.5 }} />,
    cardStyle: { backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(50px)', borderRadius: '60px', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }
  });

  if (variant === 'apple-classic') return renderLayout({ 
    qColor: '#1d1d1f', aColor: '#1d1d1f', qFontSize: '76px', mainBgColor: '#f2f2f7',
    cardStyle: { backgroundColor: '#ffffff', borderRadius: '54px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }
  });

  if (variant === 'apple-dark') return renderLayout({ 
    qColor: '#fff', aColor: '#86868b', qFontSize: '82px', mainBgColor: '#000',
    backgroundElement: <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, #111 0%, #000 100%)' }} />
  });

  if (variant === 'apple-glass') return renderLayout({ 
    qColor: '#fff', aColor: '#a1a1a6', mainBgColor: '#000',
    backgroundElement: <div style={{ position: 'absolute', top: '15%', left: '15%', width: '700px', height: '700px', background: 'radial-gradient(circle, #2c2c2e 0%, transparent 70%)', filter: 'blur(100px)' }} />,
    cardStyle: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(40px)', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.1)' }
  });

  if (variant === 'apple-pro') return renderLayout({ 
    qColor: '#ffffff', aColor: '#a1a1a6', qFontSize: '90px', mainBgColor: '#000',
    cardStyle: { backgroundColor: 'rgba(28, 28, 30, 0.8)', backdropFilter: 'blur(30px)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }
  });

  if (variant === 'apple-night') return renderLayout({ 
    qColor: '#fff', aColor: '#d1d1d6', mainBgColor: '#000',
    backgroundElement: <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '500px', height: '500px', background: '#1e1b4b', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.6 }} />,
    cardStyle: { backgroundColor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(60px)', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)' }
  });

  if (variant === 'estate-luxury') return renderLayout({ bgPhotoId: ESTATE_PHOTOS.luxury, qColor: '#ffffff', aColor: '#d1d1d6', qFontFamily: playfair, cardStyle: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(35px)', borderRadius: '0px', borderLeft: '10px solid #fff' } });
  
  if (variant === 'estate-urban') return renderLayout({ bgPhotoId: ESTATE_PHOTOS.urban, qColor: '#fff', aColor: '#a1a1a6', cardStyle: { backgroundColor: 'rgba(28, 28, 30, 0.9)', backdropFilter: 'blur(60px)', borderRadius: '12px' } });

  // Fallback for unknown variants
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', fontFamily: inter }}>
      <h1 style={{ fontSize: '40px' }}>Bilinmeyen Varyant: {variant}</h1>
    </AbsoluteFill>
  );
};
