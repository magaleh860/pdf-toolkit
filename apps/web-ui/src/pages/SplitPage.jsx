import React, { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs'
import { PageThumbnails } from '../components/PageThumbnails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FileDropZone } from '../components/FileDropZone'

export function SplitPage() {
  const [busy, setBusy] = useState(false)
  const [splitFile, setSplitFile] = useState(null)
  const [splitPageCount, setSplitPageCount] = useState(0)
  const [splitSelectedPages, setSplitSelectedPages] = useState([])
  const [splitPageThumbs, setSplitPageThumbs] = useState([])

  function clearSplitFile() {
    setSplitFile(null)
    setSplitPageCount(0)
    setSplitSelectedPages([])
    setSplitPageThumbs([])
  }

  function processSplitFile(file) {
    setSplitFile(file)
    setSplitPageCount(0)
    setSplitSelectedPages([])
    setSplitPageThumbs([])
    if (file) {
      // Load page count and thumbnails
      file.arrayBuffer().then(async (bytes) => {
        try {
          // Get page count with pdf-lib
          const pdf = await PDFDocument.load(bytes)
          const pageCount = pdf.getPageCount()
          setSplitPageCount(pageCount)
          setSplitSelectedPages(Array.from({ length: pageCount }, (_, i) => i)) // default: all selected

          // Render thumbnails with pdfjs-dist
          const loadingTask = pdfjsLib.getDocument({ data: bytes })
          const pdfjsDoc = await loadingTask.promise
          const thumbs = []
          for (let i = 1; i <= pageCount; ++i) {
            const page = await pdfjsDoc.getPage(i)
            const viewport = page.getViewport({ scale: 0.4 }) // larger preview
            const canvas = document.createElement('canvas')
            canvas.width = viewport.width
            canvas.height = viewport.height
            const ctx = canvas.getContext('2d')
            await page.render({ canvasContext: ctx, viewport }).promise
            thumbs.push(canvas.toDataURL())
          }
          setSplitPageThumbs(thumbs)
        } catch {
          setSplitPageCount(0)
          setSplitSelectedPages([])
          setSplitPageThumbs([])
        }
      })
    }
  }

  function toggleSplitPage(idx) {
    setSplitSelectedPages(prev => prev.includes(idx)
      ? prev.filter(i => i !== idx)
      : [...prev, idx].sort((a, b) => a - b)
    )
  }

  async function split() {
    if (!splitFile || !splitSelectedPages.length) return
    setBusy(true)
    try {
      const bytes = await splitFile.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const pageIndices = splitSelectedPages
      if (!pageIndices.length) throw new Error('No valid pages selected')
      const outPdf = await PDFDocument.create()
      const pages = await outPdf.copyPages(src, pageIndices)
      pages.forEach(p => outPdf.addPage(p))
      const outBytes = await outPdf.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'split.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Error splitting PDF: ' + (err.message || err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="split-section">
      <div className="split-upload">
        <FileDropZone
          onFiles={(files) => processSplitFile(files[0])}
          multiple={false}
          accept="application/pdf"
          helpText="Select a single PDF to split into pages"
        />
        {splitFile && (
          <div className="file-item">
            <div className="file-info">
              <span className="file-name">{splitFile.name}</span>
              <span className="file-size">{(splitFile.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
            <div className="file-actions">
              <button
                onClick={clearSplitFile}
                className="icon-button remove"
                title="Remove file"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        )}
      </div>

      {splitFile && splitPageCount > 0 && (
        <div className="split-pages-list">
          <div style={{marginBottom: 8, color: '#374151', fontWeight: 500}}>
            Select pages to extract:
          </div>
          <PageThumbnails
            pages={splitPageThumbs}
            selectedPages={splitSelectedPages}
            onTogglePage={toggleSplitPage}
            busy={busy}
          />
        </div>
      )}

      {splitFile && (
        <div className="actions">
          <button
            onClick={split}
            disabled={!splitSelectedPages.length || busy}
            className="merge-button"
          >
            {busy ? 'Splitting...' : 'Split PDF'}
          </button>
        </div>
      )}
    </div>
  )
}