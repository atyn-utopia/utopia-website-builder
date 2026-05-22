'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const from = sp.get('from') || '/'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setError(body.error ?? 'Wrong passcode.')
        setLoading(false)
        return
      }
      // Hard refresh so the middleware sees the new cookie immediately.
      window.location.href = from
    } catch {
      setError('Network error — try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{
      width: '100%',
      maxWidth: 380,
      margin: '0 auto',
      paddingTop: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/utopia-wizard-logo.png"
          alt="Utopia Wizard"
          className="uf-logo"
          style={{
            width: 88,
            height: 88,
            marginBottom: -8,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Utopia Wizard
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 12.5,
          margin: 0,
          lineHeight: 1.3,
        }}>
          Website Builder &amp; Monitor
        </p>
        </div>
      </div>

      <div className="uf-card" style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
      }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="uf-eyebrow">Sign in</span>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 13,
            margin: 0,
            lineHeight: 1.5,
          }}>
            Enter the shared passcode to continue.
          </p>
        </header>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
              color: 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
            }}>
              Passcode
            </span>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={loading}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-pill)',
                padding: '10px 18px',
                color: 'var(--text-primary)',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                width: '100%',
                transition: 'border-color var(--transition-snap)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--input-border-focus)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--input-border)' }}
            />
          </label>

          {error && (
            <p style={{
              color: 'var(--status-fail)',
              fontSize: 12,
              margin: 0,
              lineHeight: 1.5,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!passcode || loading}
            className="uf-btn-brand"
            style={{ padding: '10px 14px' }}
          >
            {loading ? 'Checking…' : 'Continue →'}
          </button>
        </form>
      </div>
    </main>
  )
}
