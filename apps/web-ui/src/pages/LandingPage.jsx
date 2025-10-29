import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faScissors, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-intro">
        <h2>Privacy-First PDF Tools</h2>
        <p className="landing-description">
          A powerful, <strong>100% client-side</strong> PDF toolkit that runs entirely in your browser. 
          Your files never leave your device, ensuring complete privacy and security. After the initial 
          page load, you can even use it <strong>offline</strong> — no internet connection required, 
          no server uploads, no tracking.
        </p>
        <div className="privacy-badges">
          <span className="badge">🔒 Privacy First</span>
          <span className="badge">📡 Works Offline</span>
          <span className="badge">⚡ Lightning Fast</span>
          <span className="badge">🆓 Completely Free</span>
        </div>
      </div>

      <div className="feature-grid">
        <Link to="/merge" className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faFileLines} />
          </div>
          <h2>Merge PDFs</h2>
          <p>Combine multiple PDF files into a single document</p>
        </Link>
        <Link to="/split" className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faScissors} />
          </div>
          <h2>Split PDF</h2>
          <p>Extract specific pages from a PDF document</p>
        </Link>
        <Link to="/edit" className="feature-card">
          <div className="feature-icon">
            <FontAwesomeIcon icon={faPenToSquare} />
          </div>
          <h2>Edit PDF</h2>
          <p>Rotate, delete, and rearrange PDF pages</p>
        </Link>
      </div>
    </div>
  )
}