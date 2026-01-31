import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { Scene } from "../../types/storyboard";
import { AnimatedText } from "../common/AnimatedText";

interface KineticTitleProps {
  scene: Scene;
  imagePath?: string | null;
}

export const KineticTitle: React.FC<KineticTitleProps> = ({
  scene,
  imagePath,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title entrance animation
  const titleScale = spring({
    frame,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 12 },
  });

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background Ken Burns effect (slow zoom)
  const imageScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.15],
    { extrapolateRight: "clamp" }
  );

  // Glow effect pulsing
  const glowIntensity = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [0.3, 0.6]
  );

  return (
    <AbsoluteFill>
      {/* Background Image with Ken Burns */}
      {imagePath && (
        <AbsoluteFill
          style={{
            transform: `scale(${imageScale})`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={imagePath}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.5) saturate(1.2)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Gradient overlay */}
      <AbsoluteFill
        style={{
          background: imagePath
            ? "linear-gradient(to bottom, rgba(15,15,26,0.4) 0%, rgba(15,15,26,0.8) 100%)"
            : "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0f0f1a 100%)",
        }}
      />

      {/* Animated glow behind text */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(99,102,241,${glowIntensity}) 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </AbsoluteFill>

      {/* Title Text */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          padding: "0 60px",
        }}
      >
        <AnimatedText
          text={scene.script}
          wordByWord
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            letterSpacing: "-0.02em",
          }}
        />
      </AbsoluteFill>

      {/* Decorative line */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            width: interpolate(frame, [20, 40], [0, 200], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 4,
            background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
