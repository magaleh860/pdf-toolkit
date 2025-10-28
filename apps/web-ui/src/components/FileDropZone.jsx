import React from 'react'

export function FileDropZone({ onFilesDrop, dragActive, handleDrag, children }) {
  return (
    <div 
      className={`drop-zone ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={onFilesDrop}
    >
      {children}
    </div>
  )
}