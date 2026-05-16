import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const Title: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(entrance, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ 
      justifyContent: "flex-start", 
      alignItems: "center",
      zIndex: 20,
      paddingTop: "300px"
    }}>
      <div style={{
        fontFamily,
        fontSize: "110px",
        color: "white",
        textAlign: "center",
        padding: "0 100px",
        lineHeight: 1.1,
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: "0 20px 80px rgba(0,0,0,0.5)",
        maxWidth: "900px"
      }}>
        {text}
      </div>
      
      {/* Sub-line decoration */}
      <div style={{
        marginTop: "40px",
        width: interpolate(entrance, [0.5, 1], [0, 150]),
        height: "2px",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        opacity: interpolate(entrance, [0.8, 1], [0, 1])
      }} />
    </AbsoluteFill>
  );
};
