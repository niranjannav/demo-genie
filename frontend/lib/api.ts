import type {
  UploadResponse,
  ProcessResponse,
  GenerateResponse,
  VideoStyle,
  Storyboard,
  RenderResponse,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to upload file')
    }

    return response.json()
  }

  async processFile(fileId: string): Promise<ProcessResponse> {
    const response = await fetch(`${this.baseUrl}/api/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id: fileId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to process file')
    }

    return response.json()
  }

  async generateStoryboard(
    fileId: string,
    prompt: string,
    style: VideoStyle
  ): Promise<GenerateResponse> {
    const response = await fetch(`${this.baseUrl}/api/generate-storyboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
        prompt,
        style,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to generate storyboard')
    }

    return response.json()
  }

  getFileDownloadUrl(fileId: string): string {
    return `${this.baseUrl}/api/files/${fileId}/download`
  }

  async startRender(
    storyboard: Storyboard,
    includeAudio: boolean = true
  ): Promise<RenderResponse> {
    const response = await fetch(`${this.baseUrl}/api/render-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyboard,
        include_audio: includeAudio,
        quality: 'high',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to start render')
    }

    return response.json()
  }

  async getRenderStatus(renderId: string): Promise<RenderResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/render-status/${renderId}`
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to get render status')
    }

    return response.json()
  }

  getVideoUrl(renderId: string): string {
    return `${this.baseUrl}/api/videos/${renderId}.mp4`
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

export const api = new ApiClient(API_URL)
