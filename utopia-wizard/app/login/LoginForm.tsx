'use client'

import { useSearchParams } from 'next/navigation'

const OAUTH_ERRORS: Record<string, string> = {
  not_allowed: 'That GitHub account isn’t on the team allowlist.',
  bad_state: 'Your sign-in expired — please try again.',
  exchange_failed: 'GitHub didn’t return a token — try again.',
  user_fetch_failed: 'Couldn’t read your GitHub profile — try again.',
  oauth_unconfigured: 'GitHub sign-in isn’t configured on this server.',
}

export default function LoginForm() {
  const sp = useSearchParams()
  const from = sp.get('from') || '/'
  const oauthError = sp.get('error')
  const githubHref = `/api/auth/github?from=${encodeURIComponent(from)}`

  return (
    <main style={{
      width: '100%',
      maxWidth: 400,
      margin: '0 auto',
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 26,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/utopia-wizard-logo.png" alt="Utopia Wizard" className="uf-logo" style={{ width: 72, height: 72 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
            Utopia Wizard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.3 }}>
            Website Builder &amp; Monitor
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="uf-card" style={{
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        width: '100%',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            Sign in with GitHub to access your projects.
          </p>
        </div>

        {oauthError && (
          <div style={{
            color: 'var(--status-fail)', background: 'var(--status-fail-bg)',
            border: '1px solid var(--status-fail-border)', borderRadius: 'var(--radius-md)',
            padding: '9px 12px', fontSize: 12.5, lineHeight: 1.5,
          }}>
            {OAUTH_ERRORS[oauthError] ?? 'Sign-in failed — please try again.'}
          </div>
        )}

        {/* GitHub sign-in — official black */}
        <a
          href={githubHref}
          style={{
            padding: '12px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            textDecoration: 'none',
            background: '#24292f',
            color: '#fff',
            border: '1px solid #1b1f23',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-sans)',
            fontSize: 14.5,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
            transition: 'background var(--transition-snap), transform var(--transition-snap)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1b1f23'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#24292f'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <svg width="19" height="19" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          Continue with GitHub
        </a>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: 'var(--text-quiet)', fontSize: 11.5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Access is limited to the Utopia team
        </div>
      </div>

      <p style={{ color: 'var(--text-quiet)', fontSize: 11, margin: 0, textAlign: 'center' }}>
        © Utopia · Website Builder &amp; Monitor
      </p>
    </main>
  )
}
