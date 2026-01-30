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
