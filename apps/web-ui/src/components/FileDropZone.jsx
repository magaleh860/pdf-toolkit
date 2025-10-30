import React, { useRef, useState, useCallback } from 'react'

// Universal file drop zone for PDFs with optional browse button.
// Props:
// - onFiles: (File[]) => void  // called with selected/dropped files
// - multiple?: boolean         // allow multiple selection (default true)
// - accept?: string            // input accept attribute (default 'application/pdf')
// - label?: string             // main instruction text
// - helpText?: string          // secondary helper text
// - children?: ReactNode       // optional custom inner UI (advanced)
export function FileDropZone({
  onFiles,
  multiple = true,
  accept = 'application/pdf',
  label,
  helpText,
  children,
}) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const filterByAccept = useCallback((files) => {
    if (!accept) return files
    // Basic filtering for 'application/pdf' and other mime patterns
    return files.filter(f => {
      if (accept.includes('application/pdf')) return f.type === 'application/pdf'
      // fallback: no strict filtering
      return true
    })
  }, [accept])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer?.files || [])
    const filtered = filterByAccept(files)
    if (filtered.length && onFiles) onFiles(multiple ? filtered : filtered.slice(0, 1))
  }, [filterByAccept, multiple, onFiles])

  const handleBrowseClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    const filtered = filterByAccept(files)
    if (filtered.length && onFiles) onFiles(multiple ? filtered : filtered.slice(0, 1))
    // reset the input so selecting the same file again will trigger change
    e.target.value = ''
  }, [filterByAccept, multiple, onFiles])

  const defaultLabel = label ?? (multiple ? 'Drop PDF files here or' : 'Drop a PDF file here or')

  return (
    <div
      className={`drop-zone ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {children ? (
        children
      ) : (
        <>
          <p>
            {defaultLabel} {' '}
            <button type="button" className="file-input-label" onClick={handleBrowseClick}>
              browse
            </button>
          </p>
          {helpText && <p className="help-text">{helpText}</p>}
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="file-input"
      />
    </div>
  )
}