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

interface SplitScreenProps {
  scene: Scene;
  imagePath?: string | null;
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  scene,
  imagePath,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Staggered panel animations
  const leftPanelX = interpolate(frame, [0, 20], [-100, 0], {
    extrapolateRight: "clamp",
  });
  const rightPanelX = interpolate(frame, [5, 25], [100, 0], {
    extrapolateRight: "clamp",
  });

  const leftPanelOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const rightPanelOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Divider animation
  const dividerHeight = interpolate(frame, [15, 35], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle Ken Burns on image
  const imageScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.08],
    { extrapolateRight: "clamp" }
  );

  // Caption animation
  const captionOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
        }}
      />

      {/* Split container - horizontal split for vertical video */}
      <AbsoluteFill
        style={{
          flexDirection: "column",
        }}
      >
        {/* Top panel - Image */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            opacity: leftPanelOpacity,
            transform: `translateY(${leftPanelX}px)`,
          }}
        >
          {imagePath ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${imageScale})`,
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
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 20,
                  background: "rgba(99, 102, 241, 0.3)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            </div>
          )}

          {/* Gradient fade at bottom of image */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              background: "linear-gradient(to top, #0f0f1a, transparent)",
            }}
          />
        </div>

        {/* Center divider */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${dividerHeight}%`,
            height: 4,
            background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
            borderRadius: 2,
            zIndex: 10,
          }}
        />

        {/* Bottom panel - Text content */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 50px",
            opacity: rightPanelOpacity,
            transform: `translateY(${rightPanelX}px)`,
          }}
        >
          {/* Main script text */}
          <div
            style={{
              opacity: captionOpacity,
              textAlign: "center",
            }}
          >
            <AnimatedText
              text={scene.script}
              delay={25}
              style={{
                color: "white",
                fontSize: 38,
                fontWeight: 600,
                lineHeight: 1.4,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Key points if present */}
          {scene.key_points && scene.key_points.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              {scene.key_points.map((point, index) => {
                const tagDelay = 45 + index * 8;
                const tagOpacity = interpolate(
                  frame,
                  [tagDelay, tagDelay + 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                  <div
                    key={index}
                    style={{
                      opacity: tagOpacity,
                      backgroundColor: "rgba(99, 102, 241, 0.2)",
                      border: "1px solid rgba(99, 102, 241, 0.5)",
                      padding: "8px 16px",
                      borderRadius: 20,
                    }}
                  >
                    <span
                      style={{
                        color: "#a5b4fc",
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
    </AbsoluteFill>
  );
};
