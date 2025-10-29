import React from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { MergePage } from './pages/MergePage'
import { SplitPage } from './pages/SplitPage'
import { EditPage } from './pages/EditPage'
import { LandingPage } from './pages/LandingPage'
import { ThemeToggle } from './components/ThemeToggle'
import { Footer } from './components/Footer'
import './styles/landing.css'
import './styles/edit.css'

// Set worker source to the bundled worker
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

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
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>PDF Toolkit</h1>
          <ThemeToggle />
        </header>
        <Navigation />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="/split" element={<SplitPage />} />
          <Route path="/edit" element={<EditPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  )
}