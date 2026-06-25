'use client'

import { useEffect, useRef, useState } from 'react'

interface AccountsPayload {
  active: string | null
  accounts: string[]
}

/**
 * Account chip + dropdown in the header. Lists every GitHub account authed in
 * this browser (the signed roster), lets the user switch between them without
 * re-OAuth, add another, or sign out.
 *
 * Hidden for passcode/open sessions (active `*` or null) — nothing to switch.
 */
export default function AccountSwitcher() {
  const [data, setData] = useState<AccountsPayload | null>(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [tokenMode, setTokenMode] = useState(false)
  const [tokenVal, setTokenVal] = useState('')
  const [tokenErr, setTokenErr] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/accounts', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const active = data?.active ?? null
  if (!active || active === '*') return null

  const accounts = data?.accounts ?? []
  // The first account ever added in this browser is the "main" login.
  const mainLogin = accounts[0] ?? null

  const switchTo = async (login: string) => {
    if (login === active) return
    setBusy(true)
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login }),
      })
      if (res.ok) { window.location.reload(); return }
    } finally {
      setBusy(false)
    }
  }

  const removeAccount = async (login: string) => {
    if (!window.confirm(`Remove @${login} from this device's account list?`)) return
    setBusy(true)
    try {
      const res = await fetch('/api/auth/remove-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok) {
        if (body.signedOut) { window.location.href = '/login'; return }
        window.location.reload(); return
      }
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const connectToken = async () => {
    const t = tokenVal.trim()
    if (!t) return
    setBusy(true)
    setTokenErr(null)
    try {
      const res = await fetch('/api/auth/token-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t }),
      })
      const body = await res.json()
      if (res.ok) { window.location.reload(); return }
      setTokenErr(body.error ?? 'Could not add account.')
    } catch {
      setTokenErr('Network error.')
    } finally {
      setBusy(false)
    }
  }

  const itemStyle: React.CSSProperties = {
    display: 'block', width: '100%', textAlign: 'left', background: 'transparent',
    border: 'none', padding: '9px 14px', fontSize: 13, color: 'var(--text-secondary)',
    cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'none',
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'transparent', border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-pill)', padding: '7px 14px',
          fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
          cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
        }}
        title="Switch account"
      >
        <span style={{
          width: 18, height: 18, borderRadius: '50%', background: 'var(--brand)',
          color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase',
        }}>
          {active.slice(0, 1)}
        </span>
        @{active}
        <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 50,
          minWidth: 200, background: 'var(--surface, #fff)',
          border: '1px solid var(--border-soft)', borderRadius: 12,
          boxShadow: '0 12px 32px -12px rgba(0,0,0,0.35)', overflow: 'hidden',
          padding: '6px 0',
        }}>
          <div style={{ padding: '6px 14px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--text-quiet)' }}>
            Accounts
          </div>
          {accounts.map((a) => {
            const isActive = a === active
            const isMain = a === mainLogin
            return (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px 7px 14px' }}>
                <button
                  onClick={() => switchTo(a)}
                  disabled={busy || isActive}
                  title={isActive ? 'Current account' : `Switch to @${a}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 7, minWidth: 0,
                    background: 'transparent', border: 'none', padding: 0, textAlign: 'left',
                    cursor: isActive ? 'default' : 'pointer', fontFamily: 'var(--font-sans)',
                    fontSize: 13, color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--status-pass)' : 'var(--text-quiet)', width: 12, display: 'inline-block' }}>{isActive ? '✓' : ''}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>@{a}</span>
                  {isMain && <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--brand)', border: '1px solid var(--border-soft)', borderRadius: 5, padding: '1px 5px' }}>Main</span>}
                </button>
                {/* Main account can't be removed (it's the primary identity). */}
                {!isMain && (
                  <button
                    onClick={() => removeAccount(a)}
                    disabled={busy}
                    title={`Remove @${a}`}
                    aria-label={`Remove @${a}`}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-quiet)', cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: '0 4px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--status-fail)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-quiet)' }}
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
          <div style={{ height: 1, background: 'var(--border-soft)', margin: '6px 0' }} />
          <div style={{ padding: '6px 14px 2px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--text-quiet)' }}>
            Add account
          </div>
          {!tokenMode ? (
            <button onClick={() => { setTokenMode(true); setTokenErr(null) }} style={itemStyle}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              🔑 Add account with token
            </button>
          ) : (
            <div style={{ padding: '6px 14px 10px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <input
                type="password"
                value={tokenVal}
                onChange={(e) => setTokenVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') connectToken() }}
                placeholder="Paste a GitHub token"
                autoFocus
                style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 12, outline: 'none', width: '100%', fontFamily: 'var(--font-mono)' }}
              />
              {tokenErr && <span style={{ color: 'var(--status-fail)', fontSize: 11, lineHeight: 1.4 }}>{tokenErr}</span>}
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={connectToken} disabled={busy || !tokenVal.trim()} className="uf-btn-brand" style={{ flex: 1, padding: '7px 10px', fontSize: 12 }}>
                  {busy ? 'Adding…' : 'Add account'}
                </button>
                <button onClick={() => { setTokenMode(false); setTokenVal(''); setTokenErr(null) }} style={{ background: 'transparent', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-pill)', padding: '7px 12px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
              <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: 'var(--text-quiet)', textDecoration: 'underline' }}>
                Create a fine-grained token →
              </a>
            </div>
          )}
          <button onClick={signOut} style={{ ...itemStyle, color: 'var(--status-fail)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
