'use client'

import { Clock, Image, ArrowRight } from 'lucide-react'
import type { Scene } from '@/lib/types'

interface SceneCardProps {
  scene: Scene
}

const VISUAL_TYPE_LABELS: Record<string, string> = {
  kinetic_title: 'Kinetic Title',
  split_screen: 'Split Screen',
  bullet_list: 'Bullet List',
  image_focus: 'Image Focus',
  text_overlay: 'Text Overlay',
  diagram: 'Diagram',
}

const VISUAL_TYPE_COLORS: Record<string, string> = {
  kinetic_title: 'bg-purple-100 text-purple-700',
  split_screen: 'bg-blue-100 text-blue-700',
  bullet_list: 'bg-green-100 text-green-700',
  image_focus: 'bg-orange-100 text-orange-700',
  text_overlay: 'bg-gray-100 text-gray-700',
  diagram: 'bg-pink-100 text-pink-700',
}

const TRANSITION_ICONS: Record<string, string> = {
  fade: 'Fade',
  slide: 'Slide',
  zoom: 'Zoom',
  cut: 'Cut',
  wipe: 'Wipe',
}

export default function SceneCard({ scene }: SceneCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
            {scene.scene_number}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              VISUAL_TYPE_COLORS[scene.visual_type] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {VISUAL_TYPE_LABELS[scene.visual_type] || scene.visual_type}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{scene.duration_seconds}s</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Script */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Script
          </p>
          <p className="text-sm text-gray-700 line-clamp-3">{scene.script}</p>
        </div>

        {/* Visual Prompt */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Visual
          </p>
          <div className="flex items-start gap-2">
            <Image className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 italic line-clamp-2">
              {scene.visual_prompt}
            </p>
          </div>
        </div>

        {/* Key Points */}
        {scene.key_points && scene.key_points.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Key Points
            </p>
            <ul className="text-xs text-gray-600 space-y-0.5">
              {scene.key_points.slice(0, 3).map((point, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-primary-500">•</span>
                  <span className="line-clamp-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <ArrowRight className="w-3 h-3" />
          <span>{TRANSITION_ICONS[scene.transition] || scene.transition}</span>
        </div>
      </div>
    </div>
  )
}
