import React from 'react';
import { AbsoluteFill, Img, staticFile, Series, useCurrentFrame } from 'remotion';

export type VictoryCardProps = {
  location: string;
  details: string;
  images: string[];
  type: 'SATILDI' | 'KİRALANDI';
  accentColor?: string;
  variant?: 'stamp-frame' | 'stamp-text' | 'stamp-bg' | 'stamp-aura';
  note?: string;
};

export const VictoryCard: React.FC<VictoryCardProps> = ({
  location,
  details,
  images,
  type,
  accentColor = '#2ecc71', // Diamond Emerald Green
  variant = 'stamp-frame',
  note
}) => {
  const frame = useCurrentFrame();

  let activeIndex = 0;
  let accumulatedFrames = 0;
  const slideDuration = 42;
  const finalDuration = 120;

  for (let i = 0; i < images.length; i++) {
    const duration = i === images.length - 1 ? finalDuration : slideDuration;
    if (frame >= accumulatedFrames && frame < accumulatedFrames + duration) {
      activeIndex = i;
      break;
    }
    accumulatedFrames += duration;
  }

  const bgImage = images[images.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Inter, sans-serif' }}>
      {/* 1. Background Blur Layer */}
      <AbsoluteFill style={{ opacity: 0.4, filter: 'blur(50px)' }}>
        <Img
          src={bgImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 2. Main Content Wrapper */}
      <AbsoluteFill style={{ padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* 4. Property Image Frame with Custom Sliding Slideshow */}
        <div style={{
          width: '100%',
          height: '60%',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          backgroundColor: '#111'
        }}>
          {images.map((img, i) => (
            <AbsoluteFill key={i} style={{
              transform: `translateX(${(i - activeIndex) * 100}%)`,
              transition: 'transform 0.25s cubic-bezier(0.45, 0, 0.55, 1)'
            }}>
              <Img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </AbsoluteFill>
          ))}

          {/* 4. Victory Stamp (Targeted Green Effects) */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-5deg)',
            backgroundColor: variant === 'stamp-bg' ? accentColor : 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(25px)',
            padding: '25px 70px',
            borderRadius: '12px',
            border: variant === 'stamp-frame' ? `3px solid #b4fcd1` : '2px solid rgba(255,255,255,0.3)',
            boxShadow: variant === 'stamp-frame' ? `0 0 20px #b4fcd1aa` : (variant === 'stamp-aura' ? `0 0 50px ${accentColor}` : '0 20px 40px rgba(0,0,0,0.6)'),
            zIndex: 100
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '85px',
              fontWeight: '900',
              color: variant === 'stamp-text' ? accentColor : '#fff',
              letterSpacing: '8px',
              textShadow: '0 5px 15px rgba(0,0,0,0.4)'
            }}>
              {type}
            </h2>
          </div>
          {/* Pagination Dots */}
          <div style={{ position: 'absolute', bottom: '30px', width: '100%', display: 'flex', justifyContent: 'center', gap: '12px', zIndex: 110 }}>
            {images.map((_, i) => (
              <div key={i} style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                opacity: activeIndex === i ? 1 : 0.3,
                transition: 'opacity 0.3s ease',
                boxShadow: activeIndex === i ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
              }} />
            ))}
          </div>
        </div>

        {/* 6. Note Section (Outside Bottom Left) */}
        {note && (
          <div style={{ marginTop: '60px', textAlign: 'left', width: '100%', paddingLeft: '20px' }}>
            <p style={{
              margin: 0,
              fontSize: '38px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '1px',
              fontFamily: 'Inter, sans-serif'
            }}>
              {note}
            </p>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
