import React, { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import { FileDropZone } from '../components/FileDropZone'
import { FileList } from '../components/FileList'

export function MergePage() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  function onChange(e) {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles.filter(f => !prev.find(p => p.name === f.name))])
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    if (newFiles.length) {
      setFiles(prev => [...prev, ...newFiles.filter(f => !prev.find(p => p.name === f.name))])
    }
  }, [])

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
      <FileDropZone
        dragActive={dragActive}
        handleDrag={handleDrag}
        onFilesDrop={handleDrop}
      >
        <p>
          Drop PDF files here or{' '}
          <label className="file-input-label">
            browse
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={onChange}
              className="file-input"
            />
          </label>
        </p>
        <p className="help-text">Select multiple files to merge them in order</p>
      </FileDropZone>

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