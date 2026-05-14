import React from 'react';
import { AbsoluteFill, Video, Sequence, useVideoConfig, staticFile, interpolate, useCurrentFrame } from 'remotion';

interface VibeMontageProps {
  clips: string[];
  title?: string;
}

export const VibeMontage: React.FC<VibeMontageProps> = ({ clips, title = "MAHALLE VIBES" }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const clipDuration = 2 * fps; // Her klip 2 saniye sürsün (Dinamik/Vibe)

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {clips.map((clip, index) => (
        <Sequence
          key={clip}
          from={index * clipDuration}
          durationInFrames={clipDuration + 15} // 15 karelik geçiş payı
        >
          <VibeClip 
            src={clip} 
            isFirst={index === 0}
            clipDuration={clipDuration}
          />
        </Sequence>
      ))}

      {/* Modern Başlık Katmanı */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{
          color: 'white',
          fontSize: '80px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '900',
          letterSpacing: '10px',
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
          opacity: interpolate(frame, [0, 30, 90, 120], [0, 1, 1, 0], { extrapolateRight: 'clamp' })
        }}>
          {title}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const VibeClip: React.FC<{ src: string; isFirst: boolean; clipDuration: number }> = ({ src, isFirst, clipDuration }) => {
  const frame = useCurrentFrame();
  
  // Subtle Zoom Animation
  const scale = interpolate(frame, [0, clipDuration], [1, 1.1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 10, clipDuration - 10, clipDuration], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      <Video 
        src={staticFile(src)} 
        startFrom={0}
        endAt={clipDuration}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </AbsoluteFill>
  );
};
