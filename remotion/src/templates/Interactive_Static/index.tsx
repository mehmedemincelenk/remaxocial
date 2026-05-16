import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: inter } = loadInter("normal", { weights: ["400", "700", "900"] });

export interface InteractiveStaticProps {
  question: string;
  type: 'quiz' | 'poll' | 'input' | 'slider';
  category?: string;
}

export const Interactive_Static: React.FC<InteractiveStaticProps> = ({
  question,
  type,
  category = "SENİ TANIYALIM"
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#8B0000', fontFamily: inter, color: '#fff', overflow: 'hidden' }}>
      {/* 1. Architectural White Grid Pattern (Perfect Squares) */}
      <AbsoluteFill style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
          linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        zIndex: 1
      }} />

      {/* 2. Visual Depth (Subtle Central Glow) */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
        zIndex: 2
      }} />

      {/* 3. Content Layout (Fixed Top-Weighted) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '300px 80px 0 80px',
        height: '100%',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        
        {/* Fixed Category Badge */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '12px 35px',
          borderRadius: '50px',
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: '4px',
          marginBottom: '60px',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          color: 'rgba(255,255,255,0.8)'
        }}>
          HEPSİ SENİN İÇİN
        </div>

        {/* Fixed Question Starting Point */}
        <div style={{
          fontSize: '68px',
          lineHeight: '1.2',
          fontWeight: '900',
          textShadow: '0 10px 30px rgba(0,0,0,0.5)',
          maxWidth: '900px',
          marginBottom: '80px'
        }}>
          {question}
        </div>

      </div>
    </AbsoluteFill>
  );
};
