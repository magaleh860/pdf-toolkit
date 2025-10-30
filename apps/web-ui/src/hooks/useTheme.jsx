import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('pdf-toolkit-theme')
    return savedTheme || 'light'
  })

  useEffect(() => {
    // Apply theme immediately on mount
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem('pdf-toolkit-theme', theme)
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
    console.log('Theme changed to:', theme) // Debug log
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}