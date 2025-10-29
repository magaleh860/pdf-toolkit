import React, { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faRotateRight, faTrash, faRotate } from '@fortawesome/free-solid-svg-icons'
import { FileDropZone } from '../components/FileDropZone'

export function EditPage() {
  const [busy, setBusy] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageThumbs, setPageThumbs] = useState([])
  const [pageRotations, setPageRotations] = useState({}) // tracks rotation degrees per page
  const [deletedPages, setDeletedPages] = useState(new Set()) // tracks pages marked for deletion

  function clearFile() {
    setPdfFile(null)
    setPageCount(0)
    setPageThumbs([])
    setPageRotations({})
    setDeletedPages(new Set())
  }

  function processFile(file) {
    setPdfFile(file)
    setPageCount(0)
    setPageThumbs([])
    setPageRotations({})
    setDeletedPages(new Set())

    if (file) {
      file.arrayBuffer().then(async (bytes) => {
        try {
          // Get page count with pdf-lib
          const pdf = await PDFDocument.load(bytes)
          const count = pdf.getPageCount()
          setPageCount(count)

          // Render thumbnails with pdfjs-dist
          const loadingTask = pdfjsLib.getDocument({ data: bytes })
          const pdfjsDoc = await loadingTask.promise
          const thumbs = []
          for (let i = 1; i <= count; ++i) {
            const page = await pdfjsDoc.getPage(i)
            const viewport = page.getViewport({ scale: 0.4 })
            const canvas = document.createElement('canvas')
            canvas.width = viewport.width
            canvas.height = viewport.height
            const ctx = canvas.getContext('2d')
            await page.render({ canvasContext: ctx, viewport }).promise
            thumbs.push(canvas.toDataURL())
          }
          setPageThumbs(thumbs)
        } catch (err) {
          console.error(err)
          clearFile()
        }
      })
    }
  }

  function rotatePage(pageIndex, direction) {
    setPageRotations(prev => ({
      ...prev,
      [pageIndex]: ((prev[pageIndex] || 0) + (direction === 'left' ? -90 : 90)) % 360
    }))
  }

  function togglePageDeletion(pageIndex) {
    setDeletedPages(prev => {
      const next = new Set(prev)
      if (next.has(pageIndex)) {
        next.delete(pageIndex)
      } else {
        next.add(pageIndex)
      }
      return next
    })
  }

  async function saveChanges() {
    if (!pdfFile) return;
    setBusy(true);
    try {
      const bytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      // Apply rotations
      for (const [pageIdxStr, rotation] of Object.entries(pageRotations)) {
        const pageIdx = parseInt(pageIdxStr, 10);
        const page = pdfDoc.getPage(pageIdx);
        // Normalize rotation to 0, 90, 180, or 270
        const normalized = ((rotation % 360) + 360) % 360;
        page.setRotation(degrees(normalized));
      }

      // Remove pages (reverse order)
      const pagesToDelete = Array.from(deletedPages).sort((a, b) => b - a);
      for (const idx of pagesToDelete) {
        pdfDoc.removePage(idx);
      }

      // Save & download
      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name.replace(/\.pdf$/i, '_edited.pdf');
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Clear modifications
      setPageRotations({});
      setDeletedPages(new Set());
    } catch (err) {
      console.error(err);
      alert('Error saving PDF: ' + (err.message || String(err)));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="edit-section">
      <div className="split-section edit-upload">
        <FileDropZone
          onFiles={(files) => processFile(files[0])}
          multiple={false}
          accept="application/pdf"
          helpText="Select a single PDF to edit its pages"
        />
        {pdfFile && (
          <div className="file-item">
            <div className="file-info">
              <span className="file-name">{pdfFile.name}</span>
              <span className="file-size">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
            <div className="file-actions">
              <button
                onClick={clearFile}
                className="icon-button remove"
                title="Remove file"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        )}
      </div>

      {pdfFile && pageCount > 0 && (
        <div className="edit-pages-list">
          <div style={{marginBottom: 8, color: '#374151', fontWeight: 500}}>
            Edit pages:
          </div>
          <div className="edit-pages-grid">
            {Array.from({ length: pageCount }, (_, i) => (
              <div key={i} className="edit-page-item" style={{
                opacity: deletedPages.has(i) ? 0.5 : 1
              }}>
                <div className="edit-page-header">
                  <span>Page {i + 1}</span>
                  <div className="edit-page-actions">
                    <button
                      onClick={() => rotatePage(i, 'left')}
                      className="icon-button"
                      title="Rotate left"
                      disabled={busy}
                    >
                      <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                    <button
                      onClick={() => rotatePage(i, 'right')}
                      className="icon-button"
                      title="Rotate right"
                      disabled={busy}
                    >
                      <FontAwesomeIcon icon={faRotateRight} />
                    </button>
                    <button
                      onClick={() => togglePageDeletion(i)}
                      className={`icon-button ${deletedPages.has(i) ? 'active' : ''}`}
                      title={deletedPages.has(i) ? "Restore page" : "Delete page"}
                      style={{ color: deletedPages.has(i) ? '#16a34a' : '#dc2626' }}
                      disabled={busy}
                    >
                      <FontAwesomeIcon icon={deletedPages.has(i) ? faRotate : faTrash} />
                    </button>
                  </div>
                </div>
                <div className="edit-page-preview" style={{
                  transform: `rotate(${pageRotations[i] || 0}deg)`,
                  transition: 'transform 0.3s ease'
                }}>
                  {pageThumbs[i] && (
                    <img 
                      src={pageThumbs[i]} 
                      alt={`Page ${i+1}`} 
                      style={{
                        width: '100%',
                        height: 'auto',
                        border: '1px solid #e5e7eb',
                        borderRadius: 3,
                        background: '#fff'
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pdfFile && (Object.keys(pageRotations).length > 0 || deletedPages.size > 0) && (
        <div className="actions">
          <button
            onClick={saveChanges}
            disabled={busy}
            className="merge-button"
          >
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}