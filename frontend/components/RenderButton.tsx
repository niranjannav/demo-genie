'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Loader2, Check, AlertCircle, Video } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'

export default function RenderButton() {
  const {
    storyboard,
    renderId,
    renderStatus,
    renderProgress,
    renderDetailedProgress,
    isRendering,
    videoUrl,
    renderError,
    startRender,
    updateRenderStatus,
    setRenderError,
    resetRender,
  } = useAppStore()

  const [polling, setPolling] = useState(false)

  const handleStartRender = async () => {
    if (!storyboard || isRendering) return

    try {
      resetRender()
      const response = await api.startRender(storyboard, true)
      startRender(response.render_id)
      setPolling(true)
    } catch (error) {
      setRenderError(
        error instanceof Error ? error.message : 'Failed to start render'
      )
    }
  }

  // Poll for render status
  useEffect(() => {
    if (!polling || !renderId) return

    const pollInterval = setInterval(async () => {
      try {
        const status = await api.getRenderStatus(renderId)
        updateRenderStatus(
          status.status,
          status.progress,
          status.video_url,
          status.detailed_progress
        )

        if (status.status === 'completed' || status.status === 'failed') {
          setPolling(false)
          if (status.error) {
            setRenderError(status.error)
          }
        }
      } catch (error) {
        console.error('Failed to poll render status:', error)
        // Don't stop polling on transient errors
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [polling, renderId, updateRenderStatus, setRenderError])

  if (!storyboard) return null

  const getStatusMessage = () => {
    if (renderDetailedProgress?.phase) {
      return renderDetailedProgress.phase
    }

    switch (renderStatus) {
      case 'pending':
        return 'Starting...'
      case 'generating_images':
        return `Generating images (${renderDetailedProgress?.images_completed || 0}/${renderDetailedProgress?.images_total || storyboard.scenes.length})`
      case 'generating_audio':
        return `Generating audio (${renderDetailedProgress?.audio_completed || 0}/${renderDetailedProgress?.audio_total || storyboard.scenes.length})`
      case 'rendering_video':
        return 'Composing video...'
      case 'completed':
        return 'Render complete!'
      case 'failed':
        return renderError || 'Render failed'
      default:
        return ''
    }
  }

  const getButtonContent = () => {
    if (renderStatus === 'completed' && videoUrl) {
      return (
        <>
          <Check className="w-4 h-4" />
          View Video
        </>
      )
    }

    if (renderStatus === 'failed') {
      return (
        <>
          <AlertCircle className="w-4 h-4" />
          Retry Render
        </>
      )
    }

    if (isRendering) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{Math.round(renderProgress)}%</span>
        </>
      )
    }

    return (
      <>
        <Video className="w-4 h-4" />
        Render Video
      </>
    )
  }

  const handleClick = () => {
    if (renderStatus === 'completed' && videoUrl) {
      // Scroll to video player or open in modal
      const videoElement = document.getElementById('video-player')
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      handleStartRender()
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleClick}
        disabled={isRendering && renderStatus !== 'failed'}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${
            renderStatus === 'completed'
              ? 'bg-green-500 text-white hover:bg-green-600'
              : renderStatus === 'failed'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : isRendering
              ? 'bg-gray-100 text-gray-500 cursor-wait'
              : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {getButtonContent()}
      </button>

      {/* Status message */}
      {(isRendering || renderStatus === 'failed') && (
        <span
          className={`text-sm ${
            renderStatus === 'failed' ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {getStatusMessage()}
        </span>
      )}

      {/* Progress bar */}
      {isRendering && (
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${renderProgress}%` }}
          />
        </div>
      )}
    </div>
  )
}
