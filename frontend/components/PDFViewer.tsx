'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Image } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export default function PDFViewer() {
  const { uploadedFile } = useAppStore()
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)

  if (!uploadedFile || !uploadedFile.fileId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Upload a document to preview</p>
        </div>
      </div>
    )
  }

  const fileUrl = api.getFileDownloadUrl(uploadedFile.fileId)
  const isPdf = uploadedFile.file.type === 'application/pdf'
  const isImage = uploadedFile.file.type.startsWith('image/')

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(1, prev - 1))
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1))

  const zoomIn = () => setScale((prev) => Math.min(2.0, prev + 0.1))
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.1))

  // For images, show a simple image viewer
  if (isImage) {
    return (
      <div className="h-full flex flex-col bg-gray-100 rounded-lg overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <img
            src={fileUrl}
            alt={uploadedFile.file.name}
            className="max-w-full max-h-full object-contain shadow-lg rounded"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
        <div className="flex items-center justify-center gap-2 p-2 bg-white border-t">
          <button
            onClick={zoomOut}
            className="p-2 rounded hover:bg-gray-100"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 rounded hover:bg-gray-100"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // For PDFs, use react-pdf
  if (isPdf) {
    return (
      <div className="h-full flex flex-col bg-gray-100 rounded-lg overflow-hidden">
        <div className="flex-1 overflow-auto flex items-start justify-center p-4">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-500">Loading PDF...</div>
              </div>
            }
            error={
              <div className="text-red-500 text-center">
                Failed to load PDF. Please try again.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-2 bg-white border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              className="p-2 rounded hover:bg-gray-100"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 rounded hover:bg-gray-100"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              Page {pageNumber} of {numPages || '...'}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // For other file types (PPTX, DOCX), show a placeholder
  return (
    <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center text-gray-600">
        <FileText className="w-16 h-16 mx-auto mb-3 text-primary-500" />
        <p className="font-medium">{uploadedFile.file.name}</p>
        <p className="text-sm text-gray-500 mt-1">
          Preview not available for this file type
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Document has been processed and is ready for storyboard generation
        </p>
      </div>
    </div>
  )
}
