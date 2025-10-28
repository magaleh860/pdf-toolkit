import React from 'react'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="landing-page">
      <div className="feature-grid">
        <Link to="/merge" className="feature-card">
          <h2>Merge PDFs</h2>
          <p>Combine multiple PDF files into a single document</p>
          <div className="feature-icon">📄</div>
        </Link>
        <Link to="/split" className="feature-card">
          <h2>Split PDF</h2>
          <p>Extract specific pages from a PDF document</p>
          <div className="feature-icon">✂️</div>
        </Link>
      </div>
    </div>
  )
}