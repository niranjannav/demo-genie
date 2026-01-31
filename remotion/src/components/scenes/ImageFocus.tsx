import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { Scene } from "../../types/storyboard";
import { AnimatedText } from "../common/AnimatedText";

interface ImageFocusProps {
  scene: Scene;
  imagePath?: string | null;
}

export const ImageFocus: React.FC<ImageFocusProps> = ({ scene, imagePath }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ken Burns effect - slow pan and zoom
  const imageScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.12],
    { extrapolateRight: "clamp" }
  );

  const imagePanX = interpolate(
    frame,
    [0, durationInFrames],
    [0, -20],
    { extrapolateRight: "clamp" }
  );

  // Caption animation
  const captionOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const captionY = interpolate(frame, [15, 30], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Full-screen image with Ken Burns */}
      {imagePath ? (
        <AbsoluteFill
          style={{
            transform: `scale(${imageScale}) translateX(${imagePanX}px)`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={imagePath}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          }}
        />
      )}

      {/* Vignette effect */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Bottom gradient for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)",
        }}
      />

      {/* Caption/Script text at bottom */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 120,
          paddingLeft: 50,
          paddingRight: 50,
        }}
      >
        <div
          style={{
            opacity: captionOpacity,
            transform: `translateY(${captionY}px)`,
          }}
        >
          <AnimatedText
            text={scene.script}
            style={{
              color: "white",
              fontSize: 42,
              fontWeight: 600,
              textAlign: "center",
              lineHeight: 1.4,
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              maxWidth: 900,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Key points badges (if present) */}
      {scene.key_points && scene.key_points.length > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            padding: 60,
            paddingTop: 100,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {scene.key_points.map((point, index) => {
              const pointDelay = 30 + index * 10;
              const pointOpacity = interpolate(
                frame,
                [pointDelay, pointDelay + 10],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              return (
                <div
                  key={index}
                  style={{
                    opacity: pointOpacity,
                    backgroundColor: "rgba(99, 102, 241, 0.9)",
                    padding: "10px 20px",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: 24,
                      fontWeight: 600,
                    }}
                  >
                    {point}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
