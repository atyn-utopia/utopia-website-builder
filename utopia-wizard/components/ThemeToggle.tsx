'use client'

import { useTheme } from '@/lib/useTheme'

export default function ThemeToggle() {
  const { theme, toggle, hydrated } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
      style={{
        position: 'fixed',
        top: 'calc(18px + env(safe-area-inset-top, 0px))',
        right: 'calc(18px + env(safe-area-inset-right, 0px))',
        zIndex: 1000,
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-soft)',
        borderRadius: '50%',
        color: 'var(--text-muted)',
        fontSize: 16,
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--shadow-card)',
        transition: 'all var(--transition-snap)',
        opacity: hydrated ? 1 : 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
