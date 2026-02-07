import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wasabi-landing-theme')
      if (stored === 'dark' || stored === 'light') return stored
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('wasabi-landing-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, isDark: theme === 'dark', toggleTheme, setTheme: setThemeState }
}
