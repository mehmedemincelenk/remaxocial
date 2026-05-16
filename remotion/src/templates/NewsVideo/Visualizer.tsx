import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import React from "react";

export const Visualizer: React.FC<{ audioSrc: string }> = ({ audioSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: audioSrc,
    frame,
    fps,
    windowInSeconds: 2,
  });

  if (!audioData) return null;

  // Son 5 karenin ortalamasını alarak 'Sıvı' pürüzsüzlüğü elde ediyoruz
  const getEnergyAtFrame = (f: number) => {
    const data = visualizeAudio({
      fps,
      frame: Math.max(0, f),
      audioData,
      numberOfSamples: 16,
      dataOffsetInSeconds,
    });
    return data[0] || 0;
  };

  const currentEnergy = getEnergyAtFrame(frame);
  const prevEnergy1 = getEnergyAtFrame(frame - 1);
  const prevEnergy2 = getEnergyAtFrame(frame - 2);
  const prevEnergy3 = getEnergyAtFrame(frame - 3);
  const prevEnergy4 = getEnergyAtFrame(frame - 4);
  const prevEnergy5 = getEnergyAtFrame(frame - 5);
  
  // Daha geniş bir pencerede ortalama alarak aşırı yumuşaklık sağlıyoruz
  const smoothedRawEnergy = (currentEnergy + prevEnergy1 + prevEnergy2 + prevEnergy3 + prevEnergy4 + prevEnergy5) / 6;

  const energy = spring({
    frame,
    fps,
    from: 0,
    to: smoothedRawEnergy,
    config: { damping: 80, stiffness: 10 } // Maksimum yumuşaklık, minimum sertlik
  });

  // Hipnotik yavaş salınım
  const t = frame / 45;
  const driftX = Math.sin(t) * 20;
  const driftY = Math.cos(t * 0.7) * 20;

  return (
    <div style={{ 
      position: "relative", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      overflow: "visible",
      filter: "contrast(1.4) saturate(1.3)"
    }}>
      <div style={{
        position: "absolute",
        filter: "blur(55px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible"
      }}>
        {/* RED LAYER */}
        <div style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          backgroundColor: "#E11B22",
          borderRadius: "50%",
          transform: `translate(${driftX}px, ${driftY}px) scale(${1 + energy * 0.4})`,
          opacity: 0.5,
          mixBlendMode: "screen"
        }} />

        {/* TURQUOISE LAYER */}
        <div style={{
          position: "absolute",
          width: "350px",
          height: "300px",
          backgroundColor: "#40E0D0",
          borderRadius: "50%",
          transform: `translate(${-driftX * 1.5}px, ${-driftY}px) scale(${1 + energy * 0.6})`,
          opacity: 0.6,
          mixBlendMode: "screen"
        }} />

        {/* WHITE CORE - Kar Beyazı */}
        <div style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          backgroundColor: "white",
          borderRadius: "50%",
          transform: `scale(${0.8 + energy * 0.35})`,
          opacity: 0.9,
          mixBlendMode: "screen"
        }} />
      </div>
    </div>
  );
};
