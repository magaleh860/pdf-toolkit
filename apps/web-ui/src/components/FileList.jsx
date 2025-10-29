import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons'

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
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            )}
            {i < files.length - 1 && (
              <button
                onClick={() => onMove(i, 1)}
                className="icon-button"
                title="Move down"
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            )}
            <button
              onClick={() => onRemove(i)}
              className="icon-button remove"
              title="Remove"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}