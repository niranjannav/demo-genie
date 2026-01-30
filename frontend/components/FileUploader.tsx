'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
}

export default function FileUploader() {
  const {
    uploadedFile,
    isUploading,
    uploadError,
    setUploadedFile,
    setFileProcessed,
    setUploading,
    setUploadError,
    reset,
  } = useAppStore()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setUploading(true)
      setUploadError(null)

      try {
        // Upload the file
        const uploadResponse = await api.uploadFile(file)
        setUploadedFile(file, uploadResponse.file_id)

        // Automatically process the file
        const processResponse = await api.processFile(uploadResponse.file_id)
        setFileProcessed(processResponse.chunks_count)
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : 'Failed to upload file'
        )
      } finally {
        setUploading(false)
      }
    },
    [setUploadedFile, setFileProcessed, setUploading, setUploadError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleRemove = () => {
    reset()
  }

  // If file is uploaded, show file info
  if (uploadedFile) {
    return (
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <File className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {uploadedFile.file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                {uploadedFile.processed && uploadedFile.chunksCount && (
                  <span className="ml-2 text-green-600">
                    • {uploadedFile.chunksCount} chunks ready
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {uploadedFile.processed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            )}
            <button
              onClick={handleRemove}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 bg-white'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400" />
          )}

          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragActive
                ? 'Drop your file here'
                : isUploading
                ? 'Uploading and processing...'
                : 'Drag & drop your document'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Supports PDF, PPTX, DOCX, PNG, JPG (max 50MB)
          </p>
        </div>
      </div>

      {uploadError && (
        <p className="mt-2 text-sm text-red-600">{uploadError}</p>
      )}
    </div>
  )
}
