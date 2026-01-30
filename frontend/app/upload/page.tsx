'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import FileUploader from '@/components/FileUploader'
import PDFViewer from '@/components/PDFViewer'
import PromptInput from '@/components/PromptInput'
import StyleSelector from '@/components/StyleSelector'
import StoryboardView from '@/components/StoryboardView'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'

export default function UploadPage() {
  const {
    uploadedFile,
    prompt,
    style,
    storyboard,
    isGenerating,
    generateError,
    setStoryboard,
    setGenerating,
    setGenerateError,
  } = useAppStore()

  const canGenerate =
    uploadedFile?.processed &&
    uploadedFile?.fileId &&
    prompt.trim().length >= 10 &&
    !isGenerating

  const handleGenerate = async () => {
    if (!canGenerate || !uploadedFile?.fileId) return

    setGenerating(true)
    setGenerateError(null)

    try {
      const response = await api.generateStoryboard(
        uploadedFile.fileId,
        prompt,
        style
      )
      setStoryboard(response.storyboard)
    } catch (error) {
      setGenerateError(
        error instanceof Error ? error.message : 'Failed to generate storyboard'
      )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Upload Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            1. Upload your document
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Uploader */}
            <div>
              <FileUploader />
            </div>

            {/* PDF Viewer */}
            <div className="h-[400px]">
              <PDFViewer />
            </div>
          </div>
        </section>

        {/* Prompt Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            2. Describe your video
          </h2>
          <div className="space-y-4">
            <PromptInput />
            <StyleSelector />
          </div>
        </section>

        {/* Generate Button */}
        <section>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-lg
              flex items-center justify-center gap-2
              transition-all duration-200
              ${canGenerate
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Storyboard...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Storyboard
              </>
            )}
          </button>

          {generateError && (
            <p className="mt-2 text-sm text-red-600 text-center">
              {generateError}
            </p>
          )}

          {!uploadedFile?.processed && (
            <p className="mt-2 text-sm text-gray-500 text-center">
              Upload and process a document to get started
            </p>
          )}

          {uploadedFile?.processed && prompt.trim().length < 10 && (
            <p className="mt-2 text-sm text-gray-500 text-center">
              Enter a prompt with at least 10 characters
            </p>
          )}
        </section>

        {/* Storyboard Output */}
        {storyboard && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              3. Your Storyboard
            </h2>
            <StoryboardView />
          </section>
        )}
      </div>
    </div>
  )
}
