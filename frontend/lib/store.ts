import { create } from 'zustand'
import type { Storyboard, VideoStyle, RenderStatus, RenderProgress } from './types'

interface UploadedFile {
  file: File
  fileId: string | null
  processed: boolean
  chunksCount: number | null
}

interface AppState {
  // File state
  uploadedFile: UploadedFile | null
  isUploading: boolean
  uploadError: string | null

  // Form state
  prompt: string
  style: VideoStyle

  // Generation state
  storyboard: Storyboard | null
  isGenerating: boolean
  generateError: string | null

  // Render state
  renderId: string | null
  renderStatus: RenderStatus | null
  renderProgress: number
  renderDetailedProgress: RenderProgress | null
  videoUrl: string | null
  isRendering: boolean
  renderError: string | null

  // Actions
  setUploadedFile: (file: File, fileId: string) => void
  setFileProcessed: (chunksCount: number) => void
  setUploading: (isUploading: boolean) => void
  setUploadError: (error: string | null) => void
  setPrompt: (prompt: string) => void
  setStyle: (style: VideoStyle) => void
  setStoryboard: (storyboard: Storyboard) => void
  setGenerating: (isGenerating: boolean) => void
  setGenerateError: (error: string | null) => void
  startRender: (renderId: string) => void
  updateRenderStatus: (
    status: RenderStatus,
    progress: number,
    videoUrl?: string | null,
    detailedProgress?: RenderProgress | null
  ) => void
  setRenderError: (error: string) => void
  resetRender: () => void
  reset: () => void
}

const initialState = {
  uploadedFile: null,
  isUploading: false,
  uploadError: null,
  prompt: '',
  style: 'explainer' as VideoStyle,
  storyboard: null,
  isGenerating: false,
  generateError: null,
  // Render state
  renderId: null,
  renderStatus: null,
  renderProgress: 0,
  renderDetailedProgress: null,
  videoUrl: null,
  isRendering: false,
  renderError: null,
}

const initialRenderState = {
  renderId: null,
  renderStatus: null,
  renderProgress: 0,
  renderDetailedProgress: null,
  videoUrl: null,
  isRendering: false,
  renderError: null,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setUploadedFile: (file, fileId) =>
    set({
      uploadedFile: {
        file,
        fileId,
        processed: false,
        chunksCount: null,
      },
      uploadError: null,
      storyboard: null,
    }),

  setFileProcessed: (chunksCount) =>
    set((state) => ({
      uploadedFile: state.uploadedFile
        ? { ...state.uploadedFile, processed: true, chunksCount }
        : null,
    })),

  setUploading: (isUploading) => set({ isUploading }),

  setUploadError: (uploadError) => set({ uploadError, isUploading: false }),

  setPrompt: (prompt) => set({ prompt }),

  setStyle: (style) => set({ style }),

  setStoryboard: (storyboard) =>
    set({ storyboard, generateError: null, isGenerating: false }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setGenerateError: (generateError) =>
    set({ generateError, isGenerating: false }),

  startRender: (renderId) =>
    set({
      renderId,
      renderStatus: 'pending',
      renderProgress: 0,
      renderDetailedProgress: null,
      videoUrl: null,
      isRendering: true,
      renderError: null,
    }),

  updateRenderStatus: (status, progress, videoUrl, detailedProgress) =>
    set({
      renderStatus: status,
      renderProgress: progress,
      videoUrl: videoUrl ?? null,
      renderDetailedProgress: detailedProgress ?? null,
      isRendering: status !== 'completed' && status !== 'failed',
    }),

  setRenderError: (error) =>
    set({
      renderStatus: 'failed',
      renderError: error,
      isRendering: false,
    }),

  resetRender: () => set(initialRenderState),

  reset: () => set(initialState),
}))
