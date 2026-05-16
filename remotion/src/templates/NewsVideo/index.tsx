import { AbsoluteFill, staticFile, Img, Audio, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import React from "react";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { Visualizer } from "./Visualizer";

const { fontFamily: inter } = loadInter("normal", { weights: ["400", "900"] });
const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["900"] });

interface NewsProps {
  title: string;
  summary: string;
  category: string;
  script?: string;
  audioSrc?: string;
}

export const NewsVideo: React.FC<NewsProps> = ({ title, summary, category, script, audioSrc }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = 1.2; 
  const moveX = 0;
  const moveY = 0;

  const [voiceAsset, setVoiceAsset] = React.useState(staticFile("news-voice-real.mp3"));
  
  React.useEffect(() => {
    if (!audioSrc) return;
    
    // Check if the specific audio recording exists
    fetch(staticFile(audioSrc), { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          setVoiceAsset(staticFile(audioSrc));
        } else {
          setVoiceAsset(staticFile("news-voice-real.mp3"));
        }
      })
      .catch(() => {
        setVoiceAsset(staticFile("news-voice-real.mp3"));
      });
  }, [audioSrc]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", fontFamily: inter }}>
      {/* 1. Dynamic Background with 30-Image High-End Pool */}
      {(() => {
        const photoIds = [
          "1600585157083-0605a6598c4d", "1600047509807-ba51f9f6b6c4", "1613490493576-7fde63acd811",
          "1512917774080-9991f1c4c750", "1580587767511-20942555541e", "1600210492486-724fe5c67fb0",
          "1600607687920-4e2a12cf6a57", "1600566753190-197d21c8785e", "1600566753086-00f18fb6c321",
          "1600607687644-c7171b42498b", "1600566752355-3579af9ac45d", "1600047509358-9dc75a572710",
          "1600566752311-667746f33221", "1600566752300-1f3e07ee5397", "1600566752150-163457597f74",
          "1564013799919-ab600027ffc6", "1568605114967-8130f3a36994", "1592595825556-98006cfce396",
          "1513584684032-29f1593e27df", "1576941089067-2de3c901e126", "1572120360610-d971b9d7767c",
          "1570129477492-45c003edd2be", "1523217582562-09d0def993a6", "1512915920307-44ff521da1ee",
          "1502672260266-1c1ef2d93688", "1484154218962-a197022b5858", "1449844908441-8829872d2607",
          "1516156008625-3a9d6067fab5", "1493809842364-78817add7ffb", "1501183638710-841dd1904471"
        ];
        
        // Use title as seed for consistent "random" background
        const bgIndex = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % photoIds.length;
        const selectedId = photoIds[bgIndex];
        const imageUrl = `https://images.unsplash.com/photo-${selectedId}?q=80&w=1080&auto=format&fit=crop`;

        return (
          <AbsoluteFill style={{ 
            transform: `scale(${scale})`, 
            filter: 'blur(40px)' 
          }}>
            <Img 
              src={imageUrl} 
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} 
            />
            {/* Dark Overlay for Text Readability */}
            <AbsoluteFill style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />
          </AbsoluteFill>
        );
      })()}

      {/* 2. Central Content: Stacked with Zero-Height Visualizer for Perfect Title Centering */}
      {/* 2. Central Content: Title-Centered Layout */}
      {/* 2. Instagram Avatar Glow (Top-Left Adjusted) */}
      <div style={{ 
        position: "absolute", 
        top: "-10px", 
        left: "90px", // Biraz daha sağa aldık
        zIndex: 5,
        opacity: 0.8,
        transform: 'scale(1.4)', 
        transformOrigin: 'left center',
        // Aura Glow
        background: 'radial-gradient(circle, rgba(0,84,165,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        padding: '20px'
      }}>
        <Visualizer audioSrc={voiceAsset} />
      </div>

      {/* 3. Central Content: Title-Centered Layout */}
      <AbsoluteFill style={{
        zIndex: 20,
        justifyContent: "center",
        alignItems: "flex-start",
        textAlign: 'left',
        transform: `translateY(${-130 + (1 - entrance) * 20}px)`, // Giriş animasyonu ile süzülme
        opacity: entrance // Giriş animasyonu ile belirme
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          padding: "0 220px 0 140px"
        }}>
          {/* Category Chip - Glassmorphism Pill */}
          <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(20px)",
            padding: "10px 24px",
            borderRadius: "12px", // Orta yol: Yumuşatılmış kare
            fontSize: "20px",
            fontWeight: "900",
            color: "white",
            textTransform: "uppercase",
            marginBottom: "20px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            letterSpacing: "2px",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)"
          }}>
            {category}
          </div>

          {/* Title */}
          <div style={{
            fontSize: "80px",
            fontWeight: "900",
            fontFamily: playfair,
            color: "white",
            lineHeight: 1.1,
            textShadow: "0 10px 40px rgba(0,0,0,0.5)",
            marginBottom: "35px", 
            maxWidth: "650px",
            textTransform: "uppercase" 
          }}>
            {title}
          </div>

          {/* Script / Subtitle - Her cümle yeni paragraf */}
          {(script || summary) ? (
            <div style={{
              fontSize: "32px",
              fontWeight: "400",
              color: "white",
              lineHeight: 1.4,
              maxWidth: "650px",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
              fontFamily: inter,
              opacity: 1,
              textAlign: "left"
            }}>
              {(script || summary).split(/(?<=[.!?])\s+/).map((sentence, sIdx) => (
                <div key={sIdx} style={{ marginBottom: "1.5rem" }}>
                  {sentence.split(' ').map((word, wIdx) => (
                    <span key={wIdx}>
                      <strong style={{ fontWeight: "900" }}>{word.slice(0, 2)}</strong>
                      {word.slice(2)}{' '}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      {/* 4. Footer: Logo */}

      <Audio src={voiceAsset} />
    </AbsoluteFill>
  );
};
