'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const OAUTH_ERRORS: Record<string, string> = {
  not_allowed: 'That GitHub account is not on the team allowlist.',
  bad_state: 'Sign-in expired or was tampered with — please try again.',
  exchange_failed: 'GitHub did not return a token — try again.',
  user_fetch_failed: 'Could not read your GitHub profile — try again.',
  oauth_unconfigured: 'GitHub sign-in is not configured on this server.',
}

export default function LoginForm() {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const from = sp.get('from') || '/'
  const oauthError = sp.get('error')
  const githubHref = `/api/auth/github?from=${encodeURIComponent(from)}`

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
            Sign in with GitHub to see your projects.
          </p>
        </header>

        {oauthError && (
          <p style={{ color: 'var(--status-fail)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            {OAUTH_ERRORS[oauthError] ?? 'Sign-in failed — please try again.'}
          </p>
        )}

        {/* Primary: GitHub OAuth — official GitHub black */}
        <a
          href={githubHref}
          style={{
            padding: '11px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            textDecoration: 'none',
            background: '#24292f',
            color: '#fff',
            border: '1px solid #1b1f23',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background var(--transition-snap)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1b1f23' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#24292f' }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          Sign in with GitHub
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
          <span style={{ color: 'var(--text-quiet)', fontSize: 11 }}>or passcode</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
        </div>

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
