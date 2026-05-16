import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from 'lucide-react';

const { fontFamily } = loadFont('normal', {
  weights: [400, 700, 900],
});

export interface QuickInsightProps {
  topic: string;        // Konu: EMLAK ENDEKSİ, DOLAR/TL, HAFTALIK ÖZET
  title: string;        // Ana Başlık: Fiyatlar Artıyor mu?, Yeni Rekor Geldi!
  value?: string;       // Vurgulanan Rakam: %25, 42.000 TL, 12 Yıl (Opsiyonel)
  status: 'up' | 'down' | 'neutral'; // Gidişat
  description: string;  // Detaylı Açıklama
}

const PHOTO_POOL = [
  "1564013799919", "1512917774080", "1600585157083", "1600047509807", "1580587767511",
  "1600210492486", "1512915920307", "1600566753190", "1484154218962", "1502672260266",
  "1600566752355", "1600607687920", "1600566753086", "1600607687644", "1613490493576"
];

export const QuickInsight: React.FC<QuickInsightProps> = ({
  topic, title, value, status, description
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic Background Selection (Real Estate Only)
  const seed = (topic + title + (value || "")).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedId = PHOTO_POOL[seed % PHOTO_POOL.length];
  const imageUrl = `https://images.unsplash.com/photo-${selectedId}?q=80&w=1080&auto=format&fit=crop`;

  // Animations
  const entrance = spring({ frame, fps, config: { damping: 12 } });
  const contentEntrance = spring({ frame: frame - 15, fps, config: { stiffness: 100 } });
  const float = Math.sin(frame / 15) * 8;

  const themes = {
    up: { bg: '#064e3b', accent: '#10b981', icon: TrendingUp },
    down: { bg: '#450a0a', accent: '#ef4444', icon: TrendingDown },
    neutral: { bg: '#1e3a8a', accent: '#3b82f6', icon: Minus },
  };

  const theme = themes[status];
  const StatusIcon = theme.icon;

  const hasValue = Boolean(value);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily, color: 'white', padding: '80px', overflow: 'hidden' }}>
      
      {/* Background with subtle movement */}
      <AbsoluteFill style={{ 
        transform: `scale(${interpolate(frame, [0, 300], [1.2, 1.1])})`, 
        filter: 'blur(70px)' 
      }}>
        <Img src={imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
      </AbsoluteFill>

      {/* Background Gradient Overlay */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 30%, ${theme.accent}22 0%, transparent 70%)` }} />

      {/* Main Container */}
      <AbsoluteFill style={{ justifyContent: 'center', padding: '100px', zIndex: 10 }}>
        
        {/* TOPIC TAG */}
        <div style={{
          opacity: entrance,
          transform: `translateY(${interpolate(entrance, [0, 1], [20, 0])}px)`,
          fontSize: '24px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '5px',
          color: theme.accent,
          marginBottom: '20px'
        }}>{topic}</div>

        {/* TITLE + ICON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: hasValue ? '30px' : '60px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: hasValue ? '64px' : '90px', 
            fontWeight: 900, 
            lineHeight: 1.1, 
            opacity: entrance,
            maxWidth: '800px'
          }}>{title}</h1>
          <div style={{ 
            opacity: contentEntrance, 
            transform: `scale(${contentEntrance}) translateY(${float}px)`,
            color: theme.accent
          }}>
            <StatusIcon size={hasValue ? 70 : 100} strokeWidth={3} />
          </div>
        </div>

        {/* BIG VALUE */}
        {hasValue && (
          <div style={{
            opacity: contentEntrance,
            transform: `scale(${interpolate(contentEntrance, [0, 1], [0.8, 1])})`,
            fontSize: '240px',
            fontWeight: 900,
            lineHeight: 0.9,
            marginBottom: '40px',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
          }}>{value}</div>
        )}

        {/* DESCRIPTION */}
        <p style={{
          opacity: contentEntrance,
          fontSize: hasValue ? '34px' : '42px',
          lineHeight: 1.4,
          color: 'rgba(255,255,255,0.85)',
          maxWidth: hasValue ? '750px' : '850px',
          borderLeft: `5px solid ${theme.accent}`,
          paddingLeft: '35px',
          margin: 0
        }}>{description}</p>

      </AbsoluteFill>

    </AbsoluteFill>
  );
};
