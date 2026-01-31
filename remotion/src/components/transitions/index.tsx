import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import type { TransitionType } from "../../types/storyboard";

const TRANSITION_FRAMES = 15; // 0.5 seconds at 30fps

interface TransitionWrapperProps {
  children: React.ReactNode;
  transition: TransitionType;
  durationFrames: number;
  isLastScene?: boolean;
}

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  transition,
  durationFrames,
  isLastScene = false,
}) => {
  const frame = useCurrentFrame();

  // Entrance animation (first TRANSITION_FRAMES frames)
  const enterProgress = interpolate(
    frame,
    [0, TRANSITION_FRAMES],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Exit animation (last TRANSITION_FRAMES frames) - skip for last scene
  const exitProgress = isLastScene
    ? 1
    : interpolate(
        frame,
        [durationFrames - TRANSITION_FRAMES, durationFrames],
        [1, 0],
        { extrapolateLeft: "clamp" }
      );

  const getTransitionStyle = (): React.CSSProperties => {
    const isEntering = frame < TRANSITION_FRAMES;
    const isExiting = frame >= durationFrames - TRANSITION_FRAMES && !isLastScene;

    switch (transition) {
      case "fade":
        return {
          opacity: Math.min(enterProgress, exitProgress),
        };

      case "slide": {
        const enterX = interpolate(enterProgress, [0, 1], [100, 0]);
        const exitX = interpolate(exitProgress, [1, 0], [0, -100]);
        const translateX = isEntering ? enterX : isExiting ? exitX : 0;
        return {
          transform: `translateX(${translateX}%)`,
          opacity: 1,
        };
      }

      case "zoom": {
        const enterScale = interpolate(enterProgress, [0, 1], [0.8, 1]);
        const exitScale = interpolate(exitProgress, [1, 0], [1, 1.2]);
        const scale = isEntering ? enterScale : isExiting ? exitScale : 1;
        return {
          transform: `scale(${scale})`,
          opacity: Math.min(enterProgress, exitProgress),
        };
      }

      case "wipe": {
        const enterClip = interpolate(enterProgress, [0, 1], [100, 0]);
        const exitClip = interpolate(exitProgress, [1, 0], [0, 100]);
        const clipValue = isEntering ? enterClip : isExiting ? exitClip : 0;
        return {
          clipPath: `inset(0 ${clipValue}% 0 0)`,
        };
      }

      case "cut":
      default:
        // Instant cut - just show/hide
        return {
          opacity: frame < durationFrames ? 1 : 0,
        };
    }
  };

  return (
    <AbsoluteFill style={getTransitionStyle()}>
      {children}
    </AbsoluteFill>
  );
};
