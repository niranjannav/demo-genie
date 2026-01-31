import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import type { VideoProps } from "./types/storyboard";

const FPS = 30;
const DEFAULT_DURATION_SECONDS = 60;

// Default props for Remotion Studio preview
const defaultProps: VideoProps = {
  storyboard: {
    title: "Sample Video",
    style: "explainer",
    total_duration: 60,
    target_audience: "General audience",
    scenes: [
      {
        scene_number: 1,
        duration_seconds: 10,
        script: "Welcome to this sample video. This is a demonstration of the NeuroReel video generation system.",
        visual_type: "kinetic_title",
        visual_prompt: "Modern title card with 'Sample Video' text",
        transition: "fade",
        key_points: null,
      },
      {
        scene_number: 2,
        duration_seconds: 15,
        script: "Our platform can transform your documents into engaging short-form video content automatically.",
        visual_type: "split_screen",
        visual_prompt: "Document on left, video player on right",
        transition: "slide",
        key_points: null,
      },
      {
        scene_number: 3,
        duration_seconds: 15,
        script: "Key features include automatic image generation, text-to-speech narration, and professional transitions.",
        visual_type: "bullet_list",
        visual_prompt: "Feature list with icons",
        transition: "fade",
        key_points: [
          "AI Image Generation",
          "Natural Voice Narration",
          "Professional Transitions",
        ],
      },
      {
        scene_number: 4,
        duration_seconds: 10,
        script: "Upload your content today and create stunning videos in minutes.",
        visual_type: "image_focus",
        visual_prompt: "Person using laptop with video creation interface",
        transition: "zoom",
        key_points: null,
      },
      {
        scene_number: 5,
        duration_seconds: 10,
        script: "Start creating with NeuroReel Studio now.",
        visual_type: "kinetic_title",
        visual_prompt: "Call to action with NeuroReel logo",
        transition: "fade",
        key_points: null,
      },
    ],
  },
  sceneAssets: [],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NeuroReelVideo"
        component={Video}
        durationInFrames={DEFAULT_DURATION_SECONDS * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
