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

interface TextOverlayProps {
  scene: Scene;
  imagePath?: string | null;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  scene,
  imagePath,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Background Ken Burns
  const imageScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.1],
    { extrapolateRight: "clamp" }
  );

  // Text card animation
  const cardOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const cardY = interpolate(frame, [10, 25], [50, 0], {
    extrapolateRight: "clamp",
  });

  const cardScale = interpolate(frame, [10, 25], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Background Image */}
      {imagePath ? (
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
              filter: "brightness(0.6) saturate(1.1)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(135deg, #1e1e30 0%, #0f0f1a 50%, #1a1a2e 100%)",
          }}
        />
      )}

      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Text card container */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 40px",
        }}
      >
        <div
          style={{
            opacity: cardOpacity,
            transform: `translateY(${cardY}px) scale(${cardScale})`,
            backgroundColor: "rgba(15, 15, 26, 0.85)",
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: "50px 40px",
            maxWidth: 900,
            border: "1px solid rgba(99, 102, 241, 0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Optional label/badge */}
          {scene.visual_type === "diagram" && (
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#6366f1",
                padding: "6px 16px",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Key Insight
              </span>
            </div>
          )}

          {/* Main text */}
          <AnimatedText
            text={scene.script}
            delay={15}
            style={{
              color: "white",
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          />

          {/* Key points as tags below */}
          {scene.key_points && scene.key_points.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              {scene.key_points.map((point, index) => {
                const tagDelay = 35 + index * 6;
                const tagOpacity = interpolate(
                  frame,
                  [tagDelay, tagDelay + 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const tagScale = interpolate(
                  frame,
                  [tagDelay, tagDelay + 10],
                  [0.8, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                  <div
                    key={index}
                    style={{
                      opacity: tagOpacity,
                      transform: `scale(${tagScale})`,
                      backgroundColor: "rgba(99, 102, 241, 0.15)",
                      border: "1px solid rgba(99, 102, 241, 0.4)",
                      padding: "10px 20px",
                      borderRadius: 12,
                    }}
                  >
                    <span
                      style={{
                        color: "#c7d2fe",
                        fontSize: 22,
                        fontWeight: 500,
                      }}
                    >
                      {point}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Decorative elements */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* Top-left accent */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 40,
            width: 80,
            height: 4,
            background: "#6366f1",
            borderRadius: 2,
            opacity: interpolate(frame, [5, 20], [0, 0.6], {
              extrapolateRight: "clamp",
            }),
          }}
        />
        {/* Bottom-right accent */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 40,
            width: 80,
            height: 4,
            background: "#6366f1",
            borderRadius: 2,
            opacity: interpolate(frame, [5, 20], [0, 0.6], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
