'use client'

import { useAppStore } from '@/lib/store'

const MAX_CHARS = 500

export default function PromptInput() {
  const { prompt, setPrompt, uploadedFile, isGenerating } = useAppStore()

  const isDisabled = !uploadedFile?.processed || isGenerating

  return (
    <div className="w-full">
      <label
        htmlFor="prompt"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Describe the video you want to create
      </label>
      <div className="relative">
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
          disabled={isDisabled}
          placeholder={
            uploadedFile?.processed
              ? "e.g., Create a 60-second explainer video highlighting the key concepts and main takeaways from this document..."
              : "Upload and process a document first..."
          }
          rows={3}
          className={`
            w-full px-4 py-3 rounded-lg border transition-colors
            resize-none
            ${isDisabled
              ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }
          `}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {prompt.length}/{MAX_CHARS}
        </div>
      </div>
    </div>
  )
}
