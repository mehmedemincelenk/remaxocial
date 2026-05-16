import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "600", "700", "900"] });

export interface SSSStaticProps {
  question: string;
  answer: string;
  followUpQuestion?: string;
  followUpAnswer?: string;
  closingEmoji?: string;
}

export const SSS_Static: React.FC<SSSStaticProps> = ({
  question, answer, followUpQuestion, followUpAnswer, closingEmoji
}) => {
  // Smart Thread logic: Filter only existing messages
  const thread = [
    { text: question, type: 'client' },
    { text: answer, type: 'consultant', weight: 600 },
    { text: followUpQuestion, type: 'client' },
    { text: followUpAnswer, type: 'consultant', weight: 700 },
    { text: closingEmoji, type: 'consultant', isEmoji: true }
  ].filter(m => m.text);

  return (
    <AbsoluteFill style={{ backgroundColor: '#002147', fontFamily: inter, color: '#fff' }}>
      {/* 1. Background Layer */}
      <AbsoluteFill style={{ opacity: 0.4 }}>
        <Img src={staticFile('assets/doodle_bg.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 122, 255, 0.2) 0%, transparent 80%)', zIndex: 2 }} />

      {/* 2. Optimized Message Mapping */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '35px', padding: '0 50px', height: '100%', position: 'relative', zIndex: 10 }}>
        {thread.map((msg, i) => {
          const isClient = msg.type === 'client';
          return (
            <div key={i} style={{ alignSelf: isClient ? 'flex-end' : 'flex-start', maxWidth: msg.isEmoji ? 'auto' : isClient ? '82%' : '85%' }}>
              <div style={{
                backgroundColor: isClient ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.12)',
                backdropFilter: `blur(${isClient ? 20 : 25}px)`,
                padding: msg.isEmoji ? '20px 35px' : isClient ? '25px 35px' : '28px 38px',
                borderRadius: msg.isEmoji ? '35px' : isClient ? '35px' : '38px',
                fontSize: msg.isEmoji ? '60px' : isClient ? '32px' : '34px',
                lineHeight: '1.4',
                fontWeight: msg.weight || 400,
                color: '#fff',
                position: 'relative',
                border: `1px solid rgba(255, 255, 255, ${isClient ? 0.1 : 0.25})`,
                boxShadow: `0 15px 40px rgba(0,0,0,${isClient ? 0.3 : 0.4})`,
                [isClient ? 'borderBottomRightRadius' : 'borderBottomLeftRadius']: '5px'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
