import React from 'react'

export function PageThumbnails({ pages, selectedPages, onTogglePage, busy }) {
  return (
    <div className="split-pages-checkboxes">
      {pages.map((thumb, i) => (
        <label key={i} className="split-page-checkbox" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 160}}>
          <input
            type="checkbox"
            checked={selectedPages.includes(i)}
            onChange={() => onTogglePage(i)}
            disabled={busy}
          />
          <span style={{fontSize: 13}}>Page {i + 1}</span>
          {thumb && (
            <img 
              src={thumb} 
              alt={`Page ${i+1}`} 
              style={{
                marginTop: 4, 
                width: 140, 
                height: 'auto', 
                border: '1px solid #e5e7eb', 
                borderRadius: 3, 
                background: '#fff'
              }} 
            />
          )}
        </label>
      ))}
    </div>
  )
}