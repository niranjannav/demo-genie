/**
 * Type definitions matching the backend Storyboard schema.
 */

export type VisualType =
  | "kinetic_title"
  | "split_screen"
  | "bullet_list"
  | "image_focus"
  | "text_overlay"
  | "diagram";

export type TransitionType = "fade" | "slide" | "zoom" | "cut" | "wipe";

export interface Scene {
  scene_number: number;
  duration_seconds: number;
  script: string;
  visual_type: VisualType;
  visual_prompt: string;
  transition: TransitionType;
  key_points?: string[] | null;
}

export interface Storyboard {
  title: string;
  style: "explainer" | "tutorial" | "summary";
  total_duration: number;
  target_audience?: string | null;
  scenes: Scene[];
}

export interface SceneAsset {
  scene_number: number;
  image_path?: string | null;
  audio_path?: string | null;
  audio_duration_ms?: number | null;
}

export interface VideoProps {
  storyboard: Storyboard;
  sceneAssets: SceneAsset[];
}

export interface RenderRequest {
  render_id: string;
  storyboard: Storyboard;
  scene_assets: SceneAsset[];
  output_path: string;
  fps?: number;
  width?: number;
  height?: number;
}
