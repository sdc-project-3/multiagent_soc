import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true,
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('sentinelx_theme')
      return saved === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('sentinelx_theme', theme)
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e)
    }

    const root = document.documentElement
    const body = document.body

    root.setAttribute('data-theme', theme)
    if (body) {
      body.setAttribute('data-theme', theme)
    }

    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
      if (body) {
        body.classList.add('light')
        body.classList.remove('dark')
      }
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
      if (body) {
        body.classList.add('dark')
        body.classList.remove('light')
      }
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
