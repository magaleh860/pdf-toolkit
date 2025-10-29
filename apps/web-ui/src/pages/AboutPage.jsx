import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faShieldAlt, faLock, faEye, faServer, faCode, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About PDF Toolkit</h1>
        <p className="about-subtitle">
          A privacy-first, open-source PDF manipulation tool that runs entirely in your browser
        </p>
      </div>

      <section className="about-section">
        <h2>
          <FontAwesomeIcon icon={faShieldAlt} /> Why Privacy Matters
        </h2>
        <p>
          When you upload PDFs to online services, you're trusting them with potentially sensitive information:
        </p>
        <ul className="privacy-concerns">
          <li><FontAwesomeIcon icon={faEye} /> Your documents may contain personal, financial, or confidential business data</li>
          <li><FontAwesomeIcon icon={faServer} /> Files are uploaded to remote servers where they can be stored, analyzed, or accessed by third parties</li>
          <li><FontAwesomeIcon icon={faLock} /> Even with "privacy guarantees," you have no way to verify what happens to your data</li>
          <li><FontAwesomeIcon icon={faEye} /> Metadata and document contents could be used for analytics, advertising, or AI training</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>How We're Different</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>PDF Toolkit</th>
                <th>Traditional Online Tools</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>File Processing</td>
                <td><FontAwesomeIcon icon={faCheckCircle} className="check" /> 100% client-side in your browser</td>
                <td><FontAwesomeIcon icon={faTimesCircle} className="cross" /> Uploaded to remote servers</td>
              </tr>
              <tr>
                <td>Privacy</td>
                <td><FontAwesomeIcon icon={faCheckCircle} className="check" /> Your files never leave your device</td>
                <td><FontAwesomeIcon icon={faTimesCircle} className="cross" /> Files are stored on third-party servers</td>
              </tr>
              <tr>
                <td>Offline Usage</td>
                <td><FontAwesomeIcon icon={faCheckCircle} className="check" /> Works completely offline</td>
                <td><FontAwesomeIcon icon={faTimesCircle} className="cross" /> Requires internet connection</td>
              </tr>
              <tr>
                <td>Data Collection</td>
                <td><FontAwesomeIcon icon={faCheckCircle} className="check" /> Zero tracking, cookies, or analytics</td>
                <td><FontAwesomeIcon icon={faTimesCircle} className="cross" /> Often tracks usage and collects data</td>
              </tr>
              <tr>
                <td>Cost</td>
                <td><FontAwesomeIcon icon={faCheckCircle} className="check" /> Free, no limits</td>
                <td><FontAwesomeIcon icon={faTimesCircle} className="cross" /> Often requires subscriptions for full features</td>
              </tr>
              <tr>
                <td>Open Source</td>
                <td><FontAwesomeIcon icon={faCheckCircle} className="check" /> Fully open source and auditable</td>
                <td><FontAwesomeIcon icon={faTimesCircle} className="cross" /> Proprietary, closed source</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="about-section">
        <h2>
          <FontAwesomeIcon icon={faCode} /> Open Source & Transparent
        </h2>
        <p>
          PDF Toolkit is completely open source. This means you can:
        </p>
        <ul>
          <li>Review the source code to verify our privacy claims</li>
          <li>Audit the code for security vulnerabilities</li>
          <li>Contribute improvements and new features</li>
          <li>Run your own instance if you prefer</li>
          <li>Learn from the code and build your own tools</li>
        </ul>
        <div className="github-cta">
          <a 
            href="https://github.com/magaleh860/pdf-toolkit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-button"
          >
            <FontAwesomeIcon icon={faGithub} /> View Source on GitHub
          </a>
        </div>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <p>
          PDF Toolkit uses modern web technologies to process your PDFs entirely within your browser:
        </p>
        <ul>
          <li><strong>React</strong> for the user interface</li>
          <li><strong>PDF-lib</strong> for PDF creation and manipulation</li>
          <li><strong>PDF.js</strong> for rendering and previewing pages</li>
        </ul>
        <p>
          When you load a PDF file, it stays in your browser's memory. All operations—merging, splitting, 
          rotating, or deleting pages—happen locally on your device. The processed PDF is then downloaded 
          directly to your computer. Nothing is ever sent to a server.
        </p>
      </section>

      <div className="about-footer">
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </div>
  )
}
