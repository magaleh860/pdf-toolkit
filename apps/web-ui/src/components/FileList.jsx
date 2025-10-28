import React from 'react'

export function FileList({ files, onMove, onRemove }) {
  return (
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
                onClick={() => onMove(i, -1)}
                className="icon-button"
                title="Move up"
              >
                ↑
              </button>
            )}
            {i < files.length - 1 && (
              <button
                onClick={() => onMove(i, 1)}
                className="icon-button"
                title="Move down"
              >
                ↓
              </button>
            )}
            <button
              onClick={() => onRemove(i)}
              className="icon-button remove"
              title="Remove"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}