import React from 'react'
import { HashRouter, Routes, Route, NavLink, useLocation, Link } from 'react-router-dom'
import { MergePage } from './pages/MergePage'
import { SplitPage } from './pages/SplitPage'
import { EditPage } from './pages/EditPage'
import { LandingPage } from './pages/LandingPage'
import { AboutPage } from './pages/AboutPage'
import { ThemeToggle } from './components/ThemeToggle'
import { Footer } from './components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import './styles/landing.css'
import './styles/edit.css'
import './styles/about.css'

// Set worker source to the bundled worker
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.js`

// Navigation component
function Navigation() {
  const location = useLocation()
  // Don't show navigation on landing page
  if (location.pathname === '/') return null

  return (
    <nav className="tabs">
      <NavLink 
        to="/merge" 
        className={({ isActive }) => isActive ? 'tab active' : 'tab'}
      >
        Merge PDFs
      </NavLink>
      <NavLink 
        to="/split" 
        className={({ isActive }) => isActive ? 'tab active' : 'tab'}
      >
        Split PDF
      </NavLink>
      <NavLink 
        to="/edit" 
        className={({ isActive }) => isActive ? 'tab active' : 'tab'}
      >
        Edit PDF
      </NavLink>
    </nav>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="app-header">
          <Link to="/" className="header-title">
            <h1>PDF Toolkit</h1>
          </Link>
          <div className="header-actions">
            <Link to="/about" className="about-nav-link">
              <FontAwesomeIcon icon={faInfoCircle} /> About
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <Navigation />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="/split" element={<SplitPage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        <Footer />
      </div>
    </HashRouter>
  )
}