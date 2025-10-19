
import React, { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'

export default function App() {
  const [tab, setTab] = useState('merge') // 'merge' or 'split'
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  // Split state
  const [splitFile, setSplitFile] = useState(null)
  const [splitRange, setSplitRange] = useState('')


  function onChange(e) {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles.filter(f => !prev.find(p => p.name === f.name))])
  }

  function onSplitFileChange(e) {
    setSplitFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)
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

  // Parse a range string like "1,3-5" into an array of 0-based page indices
  function parsePageRange(range, pageCount) {
    const result = []
    const parts = (range || '').split(',').map(s => s.trim()).filter(Boolean)
    for (const part of parts) {
      if (/^\d+$/.test(part)) {
        const idx = parseInt(part, 10) - 1
        if (idx >= 0 && idx < pageCount) result.push(idx)
      } else if (/^(\d+)-(\d+)$/.test(part)) {
        const [, start, end] = part.match(/(\d+)-(\d+)/)
        let s = parseInt(start, 10) - 1
        let e = parseInt(end, 10) - 1
        if (s > e) [s, e] = [e, s]
        for (let i = s; i <= e; ++i) {
          if (i >= 0 && i < pageCount) result.push(i)
        }
      }
    }
    // Remove duplicates and sort
    return Array.from(new Set(result)).sort((a, b) => a - b)
  }

  async function split() {
    if (!splitFile || !splitRange) return
    setBusy(true)
    try {
      const bytes = await splitFile.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const pageIndices = parsePageRange(splitRange, src.getPageCount())
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
    <div className="app">
      <h1>PDF Toolkit — Web UI</h1>
      <div className="tabs">
        <button className={tab === 'merge' ? 'tab active' : 'tab'} onClick={() => setTab('merge')}>Merge PDFs</button>
        <button className={tab === 'split' ? 'tab active' : 'tab'} onClick={() => setTab('split')}>Split PDF</button>
      </div>

      {tab === 'merge' && (
        <>
          <div 
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
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
          </div>

          <div className="files">
            {files.length > 0 && (
              <div className="files-header">
                {files.length} PDF file{files.length !== 1 ? 's' : ''} selected
              </div>
            )}
            {files.map((f, i) => (
              <div key={i} className="file-item">
                <div className="file-info">
                  <span className="file-name">{f.name}</span>
                  <span className="file-size">
                    {(f.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <div className="file-actions">
                  {i > 0 && (
                    <button
                      onClick={() => moveFile(i, -1)}
                      className="icon-button"
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  {i < files.length - 1 && (
                    <button
                      onClick={() => moveFile(i, 1)}
                      className="icon-button"
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(i)}
                    className="icon-button remove"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

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
        </>
      )}

      {tab === 'split' && (
        <div className="split-section">
          <div className="split-upload">
            <label className="file-input-label">
              Choose PDF to split
              <input
                type="file"
                accept="application/pdf"
                onChange={onSplitFileChange}
                className="file-input"
              />
            </label>
            {splitFile && (
              <div className="file-item">
                <div className="file-info">
                  <span className="file-name">{splitFile.name}</span>
                  <span className="file-size">{(splitFile.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              </div>
            )}
          </div>
          <div className="split-range">
            <label>
              Pages to extract (e.g. 1,3-5):
              <input
                type="text"
                value={splitRange}
                onChange={e => setSplitRange(e.target.value)}
                placeholder="e.g. 1,3-5"
                className="split-range-input"
                disabled={!splitFile || busy}
              />
            </label>
          </div>
          <div className="actions">
            <button
              onClick={split}
              disabled={!splitFile || !splitRange || busy}
              className="merge-button"
            >
              {busy ? 'Splitting...' : 'Split PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
