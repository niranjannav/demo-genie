import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface AnimatedTextProps {
  text: string;
  style?: React.CSSProperties;
  delay?: number;
  wordByWord?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  style = {},
  delay = 0,
  wordByWord = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (wordByWord) {
    const words = text.split(" ");

    return (
      <span style={style}>
        {words.map((word, index) => {
          const wordDelay = delay + index * 3; // 3 frames between words
          const opacity = interpolate(
            frame,
            [wordDelay, wordDelay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const translateY = interpolate(
            frame,
            [wordDelay, wordDelay + 10],
            [20, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                opacity,
                transform: `translateY(${translateY}px)`,
                marginRight: "0.3em",
              }}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  }

  // Simple fade-in animation
  const opacity = interpolate(
    frame,
    [delay, delay + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 15 },
  });

  return (
    <span
      style={{
        ...style,
        opacity,
        transform: `scale(${scale})`,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
};
