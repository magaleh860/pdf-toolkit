import React, { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { FileDropZone } from '../components/FileDropZone'
import { FileList } from '../components/FileList'

export function MergePage() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  
  function onAddFiles(newFiles) {
    setFiles(prev => {
      const deduped = newFiles.filter(f => !prev.find(p => p.name === f.name && p.size === f.size))
      return [...prev, ...deduped]
    })
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  function moveFile(index, direction) {
    setFiles(prev => {
      const newFiles = [...prev]
      const temp = newFiles[index]
      newFiles[index] = newFiles[index + direction]
      newFiles[index + direction] = temp
      return newFiles
    })
  }

  async function merge() {
    if (!files.length) return
    setBusy(true)
    try {
      const mergedPdf = await PDFDocument.create()
      for (const f of files) {
        const bytes = await f.arrayBuffer()
        const src = await PDFDocument.load(bytes)
        const pages = await mergedPdf.copyPages(src, src.getPageIndices())
        pages.forEach(p => mergedPdf.addPage(p))
      }
      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Error merging PDFs: ' + (err.message || err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="split-section">
        <FileDropZone
          onFiles={onAddFiles}
          multiple
          accept="application/pdf"
          helpText="Select multiple files to merge them in order"
        />
      </div>

      <FileList 
        files={files}
        onMove={moveFile}
        onRemove={removeFile}
      />

      {files.length > 0 && (
        <div className="actions">
          <button 
            onClick={merge} 
            disabled={busy} 
            className="merge-button"
          >
            {busy ? 'Merging...' : `Merge ${files.length} PDF file${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}