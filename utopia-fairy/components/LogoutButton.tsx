'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function LogoutButton() {
  const [busy, setBusy] = useState(false)
  const pathname = usePathname()

  // Don't render on the login page itself
  if (pathname === '/login') return null

  const logout = async () => {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/logout', { method: 'POST' })
    } catch { /* ignore */ }
    window.location.href = '/login'
  }

  return (
    <button
      onClick={logout}
      title="Sign out"
      aria-label="Sign out"
      disabled={busy}
      style={{
        position: 'fixed',
        top: 18,
        right: 70,
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
        opacity: busy ? 0.5 : 1,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
    >
      ⏻
    </button>
  )
}
