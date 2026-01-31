import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import type { VideoProps, Scene, SceneAsset } from "./types/storyboard";

// Scene components
import { KineticTitle } from "./components/scenes/KineticTitle";
import { SplitScreen } from "./components/scenes/SplitScreen";
import { BulletList } from "./components/scenes/BulletList";
import { ImageFocus } from "./components/scenes/ImageFocus";
import { TextOverlay } from "./components/scenes/TextOverlay";

// Transitions
import { TransitionWrapper } from "./components/transitions";

const FPS = 30;

// Map visual types to scene components
const SCENE_COMPONENTS: Record<string, React.FC<any>> = {
  kinetic_title: KineticTitle,
  split_screen: SplitScreen,
  bullet_list: BulletList,
  image_focus: ImageFocus,
  text_overlay: TextOverlay,
  diagram: TextOverlay, // Fallback to TextOverlay
};

interface SceneWithFrames {
  scene: Scene;
  startFrame: number;
  durationFrames: number;
  asset?: SceneAsset;
}

export const Video: React.FC<VideoProps> = ({ storyboard, sceneAssets }) => {
  // Calculate frame positions for each scene
  const scenesWithFrames: SceneWithFrames[] = [];
  let currentFrame = 0;

  for (const scene of storyboard.scenes) {
    const durationFrames = Math.round(scene.duration_seconds * FPS);
    const asset = sceneAssets.find((a) => a.scene_number === scene.scene_number);

    scenesWithFrames.push({
      scene,
      startFrame: currentFrame,
      durationFrames,
      asset,
    });

    currentFrame += durationFrames;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f1a",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {scenesWithFrames.map(({ scene, startFrame, durationFrames, asset }, index) => {
        const SceneComponent = SCENE_COMPONENTS[scene.visual_type] || TextOverlay;
        const isLastScene = index === scenesWithFrames.length - 1;

        return (
          <Sequence
            key={scene.scene_number}
            from={startFrame}
            durationInFrames={durationFrames}
            name={`Scene ${scene.scene_number}: ${scene.visual_type}`}
          >
            {/* Scene content with transition */}
            <TransitionWrapper
              transition={scene.transition}
              durationFrames={durationFrames}
              isLastScene={isLastScene}
            >
              <SceneComponent
                scene={scene}
                imagePath={asset?.image_path}
              />
            </TransitionWrapper>

            {/* Audio for this scene */}
            {asset?.audio_path && (
              <Audio
                src={asset.audio_path}
                volume={1}
              />
            )}
          </Sequence>
        );
      })}

      {/* Gradient overlays for polish */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.3) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
