// API response types

export type VideoStyle = 'explainer' | 'tutorial' | 'summary'

export type VisualType =
  | 'kinetic_title'
  | 'split_screen'
  | 'bullet_list'
  | 'image_focus'
  | 'text_overlay'
  | 'diagram'

export type Transition = 'fade' | 'slide' | 'zoom' | 'cut' | 'wipe'

export interface Scene {
  scene_number: number
  duration_seconds: number
  script: string
  visual_type: VisualType
  visual_prompt: string
  transition: Transition
  key_points?: string[]
}

export interface Storyboard {
  title: string
  style: VideoStyle
  total_duration: number
  target_audience?: string
  scenes: Scene[]
}

export interface UploadResponse {
  file_id: string
  filename: string
  file_type: string
  size_bytes: number
  message: string
}

export interface ProcessResponse {
  file_id: string
  chunks_count: number
  total_characters: number
  message: string
}

export interface GenerateResponse {
  file_id: string
  storyboard: Storyboard
  context_chunks_used: number
  message: string
}

export interface FileInfo {
  file_id: string
  filename: string
  file_type: string
  size_bytes: number
  processed: boolean
  chunks_count?: number
}

// Render types
export type RenderStatus =
  | 'pending'
  | 'generating_images'
  | 'generating_audio'
  | 'rendering_video'
  | 'completed'
  | 'failed'

export interface SceneAsset {
  scene_number: number
  image_path?: string | null
  audio_path?: string | null
  audio_duration_ms?: number | null
}

export interface RenderProgress {
  phase: string
  images_completed: number
  images_total: number
  audio_completed: number
  audio_total: number
  video_progress: number
}

export interface RenderResponse {
  render_id: string
  status: RenderStatus
  progress: number
  message: string
  video_url?: string | null
  scene_assets?: SceneAsset[] | null
  detailed_progress?: RenderProgress | null
  error?: string | null
}
