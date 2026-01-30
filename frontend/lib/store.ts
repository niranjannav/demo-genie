import { create } from 'zustand'
import type { Storyboard, VideoStyle } from './types'

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

  reset: () => set(initialState),
}))
