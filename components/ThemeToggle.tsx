'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('yc_theme') as Theme | null
    const preferredTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const nextTheme = storedTheme ?? preferredTheme
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
  }, [])

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    window.localStorage.setItem('yc_theme', nextTheme)
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle dark mode">
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
