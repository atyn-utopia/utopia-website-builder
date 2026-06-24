'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface ConnectedRepo {
  repo_full_name: string
  project_slug: string
  html_url: string | null
  default_branch: string
  connected_at: string
}

interface GithubRepo {
  full_name: string
  id: number
  default_branch: string
  html_url: string
  private: boolean
  updated_at: string
}

export default function ReposClient() {
  const [connected, setConnected] = useState<ConnectedRepo[]>([])
  const [available, setAvailable] = useState<GithubRepo[]>([])
  const [query, setQuery] = useState('')
  const [loadingConnected, setLoadingConnected] = useState(true)
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [loadedRepos, setLoadedRepos] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadConnected = useCallback(async () => {
    try {
      const res = await fetch('/api/user-repos', { cache: 'no-store' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
      setConnected(body.repos ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load connected repos.')
    } finally {
      setLoadingConnected(false)
    }
  }, [])

  const loadAvailable = useCallback(async () => {
    setLoadingRepos(true)
    setError(null)
    try {
      const res = await fetch('/api/github/repos', { cache: 'no-store' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
      setAvailable(body.repos ?? [])
      setLoadedRepos(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to list GitHub repos.')
      setLoadedRepos(true)
    } finally {
      setLoadingRepos(false)
    }
  }, [])

  // Auto-load both lists on open.
  useEffect(() => { loadConnected(); loadAvailable() }, [loadConnected, loadAvailable])

  const connectedNames = new Set(connected.map((r) => r.repo_full_name))

  const connect = async (r: GithubRepo) => {
    setBusy(r.full_name)
    setError(null)
    try {
      const res = await fetch('/api/user-repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_full_name: r.full_name,
          repo_id: r.id,
          default_branch: r.default_branch,
          html_url: r.html_url,
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
      await loadConnected()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not connect repo.')
    } finally {
      setBusy(null)
    }
  }

  const disconnect = async (repoFullName: string) => {
    if (!window.confirm(`Disconnect ${repoFullName}? Its project will stop being tracked.`)) return
    setBusy(repoFullName)
    setError(null)
    try {
      const res = await fetch(`/api/user-repos?repo=${encodeURIComponent(repoFullName)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await loadConnected()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not disconnect.')
    } finally {
      setBusy(null)
    }
  }

  const filtered = available.filter(
    (r) => !query || r.full_name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main style={{ width: '100%', maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Link href="/" style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, alignSelf: 'flex-start' }}>
        ← Back to dashboard
      </Link>

      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Connect your repos
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          Each connected repo is tracked as one Utopia project. The slug defaults to the repo name.
        </p>
      </header>

      {error && (
        <div className="uf-card" style={{ padding: '12px 16px', color: 'var(--status-fail)', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Connected */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="uf-eyebrow">Connected ({connected.length})</span>
        {loadingConnected ? (
          <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>Loading…</p>
        ) : connected.length === 0 ? (
          <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>No repos connected yet — pick one below.</p>
        ) : (
          connected.map((r) => (
            <div key={r.repo_full_name} className="uf-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{r.repo_full_name}</span>
                <span style={{ color: 'var(--text-quiet)', fontSize: 11.5 }}>slug: {r.project_slug} · {r.default_branch}</span>
              </div>
              <button
                onClick={() => disconnect(r.repo_full_name)}
                disabled={busy === r.repo_full_name}
                style={{ background: 'transparent', border: '1px solid var(--status-fail-border)', color: 'var(--status-fail)', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {busy === r.repo_full_name ? '…' : 'Disconnect'}
              </button>
            </div>
          ))
        )}
      </section>

      {/* Picker */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span className="uf-eyebrow">Your GitHub repos</span>
          <button onClick={loadAvailable} disabled={loadingRepos} style={{ background: 'transparent', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-pill)', padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {loadingRepos ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {available.length > 0 && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter repos…"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-pill)', padding: '9px 16px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', width: '100%', fontFamily: 'var(--font-sans)' }}
          />
        )}

        {loadingRepos && available.length === 0 && (
          <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>Loading your repos…</p>
        )}

        {loadedRepos && !loadingRepos && available.length === 0 && !error && (
          <div className="uf-card" style={{ padding: '14px 16px', fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>No repositories returned.</strong> Your GitHub
            token likely has no repository access. Re-create it with{' '}
            <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>a fine-grained token</a>{' '}
            granting <em>Repository access → All repositories</em> (or select the ones you want) and{' '}
            <em>Repository permissions → Metadata: Read</em> (Contents: Read too, for scanning), then add the
            account again via the switcher and refresh. A classic token with the <em>repo</em> scope also works.
          </div>
        )}

        {filtered.map((r) => {
          const isConnected = connectedNames.has(r.full_name)
          return (
            <div key={r.id} className="uf-card" style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.full_name}</span>
                {r.private && <span className="uf-pill uf-pill--neutral" style={{ fontSize: 10 }}>private</span>}
              </div>
              <button
                onClick={() => connect(r)}
                disabled={isConnected || busy === r.full_name}
                style={{
                  background: isConnected ? 'transparent' : 'var(--brand)',
                  border: isConnected ? '1px solid var(--border-soft)' : 'none',
                  color: isConnected ? 'var(--text-quiet)' : '#fff',
                  borderRadius: 'var(--radius-pill)', padding: '6px 16px', fontSize: 12, fontWeight: 600,
                  cursor: isConnected ? 'default' : 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {isConnected ? 'Connected' : busy === r.full_name ? '…' : 'Connect'}
              </button>
            </div>
          )
        })}
      </section>
    </main>
  )
}
