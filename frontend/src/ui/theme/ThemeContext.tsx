import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }){
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('theme')
      if(stored === 'dark' || stored === 'light') return stored
    } catch {}
    if(typeof window !== 'undefined' && window.matchMedia){
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  const setTheme = (next: Theme) => setThemeState(next)
  const toggleTheme = () => setThemeState(t => t === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    const root = document.documentElement
    if(theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem('theme')
        if(!stored) setThemeState(e.matches ? 'dark' : 'light')
      } catch { setThemeState(e.matches ? 'dark' : 'light') }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(){
  const ctx = useContext(ThemeContext)
  if(!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}


