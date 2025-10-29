import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faShieldAlt } from '@fortawesome/free-solid-svg-icons'

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>PDF Toolkit</h4>
          <p>Your privacy-first PDF solution</p>
        </div>
        
        <div className="footer-section">
          <h4>Privacy</h4>
          <p>
            <FontAwesomeIcon icon={faShieldAlt} /> All processing happens locally in your browser
          </p>
          <p>No data is sent to any server</p>
          <p>No cookies, no tracking, no analytics</p>
        </div>
        
        <div className="footer-section">
          <h4>Open Source</h4>
          <p>
            <FontAwesomeIcon icon={faGithub} /> Built with open-source technologies
          </p>
          <p>React • PDF-lib • PDF.js</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>
          Made with <FontAwesomeIcon icon={faHeart} style={{ color: '#ef4444' }} /> for privacy-conscious users
        </p>
        <p className="footer-year">© {new Date().getFullYear()} PDF Toolkit</p>
      </div>
    </footer>
  )
}