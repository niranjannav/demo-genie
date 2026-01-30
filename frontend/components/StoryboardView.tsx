'use client'

import { Clock, Download, Film } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import SceneCard from './SceneCard'

export default function StoryboardView() {
  const { storyboard } = useAppStore()

  if (!storyboard) {
    return null
  }

  const handleExportJson = () => {
    const json = JSON.stringify(storyboard, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `storyboard-${storyboard.title.toLowerCase().replace(/\s+/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{storyboard.title}</h2>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Film className="w-4 h-4" />
              {storyboard.scenes.length} scenes
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {storyboard.total_duration}s total
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium capitalize">
              {storyboard.style}
            </span>
          </div>
          {storyboard.target_audience && (
            <p className="text-sm text-gray-500 mt-1">
              Target: {storyboard.target_audience}
            </p>
          )}
        </div>
        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>

      {/* Scene Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {storyboard.scenes.map((scene) => (
          <SceneCard key={scene.scene_number} scene={scene} />
        ))}
      </div>
    </div>
  )
}
