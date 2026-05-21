'use client'

import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'uf-theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && (localStorage.getItem(STORAGE_KEY) as Theme | null)) || 'dark'
    setTheme(saved)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* private mode */ }
  }, [theme, hydrated])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle, hydrated }
}
