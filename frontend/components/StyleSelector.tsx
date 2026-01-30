'use client'

import { useAppStore } from '@/lib/store'
import type { VideoStyle } from '@/lib/types'

const STYLES: { value: VideoStyle; label: string; description: string }[] = [
  {
    value: 'explainer',
    label: 'Explainer',
    description: 'Clear, educational breakdown of concepts',
  },
  {
    value: 'tutorial',
    label: 'Tutorial',
    description: 'Step-by-step instructional content',
  },
  {
    value: 'summary',
    label: 'Summary',
    description: 'Quick overview of key points',
  },
]

export default function StyleSelector() {
  const { style, setStyle, uploadedFile, isGenerating } = useAppStore()

  const isDisabled = !uploadedFile?.processed || isGenerating

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Video Style
      </label>
      <div className="grid grid-cols-3 gap-3">
        {STYLES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStyle(s.value)}
            disabled={isDisabled}
            className={`
              p-3 rounded-lg border text-left transition-all
              ${isDisabled
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                : style === s.value
                ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-200'
                : 'bg-white border-gray-300 hover:border-primary-300'
              }
            `}
          >
            <p
              className={`font-medium ${
                style === s.value ? 'text-primary-700' : 'text-gray-900'
              }`}
            >
              {s.label}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
