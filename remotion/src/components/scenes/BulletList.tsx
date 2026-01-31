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

interface BulletListProps {
  scene: Scene;
  imagePath?: string | null;
}

export const BulletList: React.FC<BulletListProps> = ({ scene, imagePath }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Get bullet points (from key_points or extract from script)
  const bulletPoints = scene.key_points && scene.key_points.length > 0
    ? scene.key_points
    : scene.script.split(". ").filter((s) => s.trim().length > 0);

  // Header animation
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background subtle animation
  const bgScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.05],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* Background Image */}
      {imagePath ? (
        <AbsoluteFill
          style={{
            transform: `scale(${bgScale})`,
          }}
        >
          <Img
            src={imagePath}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.3) blur(2px)",
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
          }}
        />
      )}

      {/* Overlay gradient */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(15,15,26,0.7) 0%, rgba(15,15,26,0.9) 100%)",
        }}
      />

      {/* Content container */}
      <AbsoluteFill
        style={{
          padding: "100px 60px",
          justifyContent: "center",
        }}
      >
        {/* Header/Title - show first part of script if key_points exist */}
        {scene.key_points && scene.key_points.length > 0 && (
          <div
            style={{
              opacity: headerOpacity,
              marginBottom: 60,
            }}
          >
            <AnimatedText
              text={scene.script.split(".")[0] + "."}
              style={{
                color: "white",
                fontSize: 42,
                fontWeight: 600,
                lineHeight: 1.3,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        )}

        {/* Bullet points */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          {bulletPoints.slice(0, 5).map((point, index) => {
            const bulletDelay = 20 + index * 15;

            const bulletOpacity = interpolate(
              frame,
              [bulletDelay, bulletDelay + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const bulletX = interpolate(
              frame,
              [bulletDelay, bulletDelay + 15],
              [-50, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const checkScale = spring({
              frame: Math.max(0, frame - bulletDelay - 5),
              fps,
              from: 0,
              to: 1,
              config: { damping: 10 },
            });

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  opacity: bulletOpacity,
                  transform: `translateX(${bulletX}px)`,
                }}
              >
                {/* Animated checkmark/bullet */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#6366f1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: `scale(${checkScale})`,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                {/* Bullet text */}
                <span
                  style={{
                    color: "white",
                    fontSize: 36,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {point.trim()}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Decorative accent */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: "15%",
          bottom: "15%",
          width: 4,
          background: "linear-gradient(to bottom, transparent, #6366f1, transparent)",
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
