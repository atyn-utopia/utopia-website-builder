'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PorcelainEntry {
  status: string
  path: string
}

interface SyncPreview {
  available: boolean
  source?: 'local' | 'remote'
  branch?: string | null
  count?: number
  changes?: PorcelainEntry[]
  reason?: string
  hint?: string
  daemonAgeSeconds?: number
  stale?: boolean
}

interface SyncResult {
  ok: boolean
  mode?: 'pr' | 'main' | 'queued'
  requestId?: string
  commitSha?: string
  filesCommitted?: number
  message?: string
  branch?: string
  prUrl?: string | null
  error?: string
  hint?: string
}

interface QueuedRequest {
  id: string
  status: 'pending' | 'running' | 'done' | 'error'
  mode: 'pr' | 'main'
  result: SyncResult | null
}

type SyncState = 'idle' | 'syncing' | 'queued' | 'success' | 'error'

function pillStyle(variant: 'warn' | 'pass' | 'quiet'): React.CSSProperties {
  const bg = variant === 'pass' ? 'var(--status-pass-bg)'
    : variant === 'quiet' ? 'transparent'
    : 'var(--status-warn-bg)'
  const fg = variant === 'pass' ? 'var(--status-pass)'
    : variant === 'quiet' ? 'var(--text-quiet)'
    : 'var(--status-warn)'
  const border = variant === 'pass' ? 'var(--status-pass-border)'
    : variant === 'quiet' ? 'var(--border-soft)'
    : 'var(--status-warn-border)'
  return {
    background: bg,
    color: fg,
    border: `1px solid ${border}`,
    borderRadius: 'var(--radius-pill)',
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.2,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    whiteSpace: 'nowrap',
    transition: 'all var(--transition-snap)',
  }
}

function dotStyle(color: string): React.CSSProperties {
  return {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: color,
  }
}

export default function SyncButton() {
  const [preview, setPreview] = useState<SyncPreview | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const refresh = async () => {
    try {
      const res = await fetch('/api/sync-projects', { cache: 'no-store' })
      const json = await res.json()
      setPreview(json)
    } catch {
      setPreview({ available: false, reason: 'fetch-error' })
    }
  }

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 30_000)
    return () => clearInterval(t)
  }, [])

  // Hide entirely if we can't determine state OR if remote daemon hasn't
  // reported in. (For remote, show a help-state button so the user knows why
  // sync isn't working.)
  if (!preview) return null
  if (preview.source === 'local' && !preview.count) return null
  if (preview.source === 'remote' && !preview.available) {
    return (
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        style={pillStyle('quiet')}
        title={preview.hint ?? 'No sync daemon reporting'}
      >
        <span style={dotStyle('var(--text-quiet)')} />
        Sync (offline)
        {modalOpen && mounted && (
          <SyncModal
            preview={preview}
            onClose={() => setModalOpen(false)}
            onSynced={() => { setModalOpen(false); refresh() }}
          />
        )}
      </button>
    )
  }

  const count = preview.count ?? 0
  const noWork = count === 0
  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        style={pillStyle(noWork ? 'pass' : 'warn')}
        title={
          noWork
            ? 'No changes to sync — local working tree is clean'
            : `${count} change${count === 1 ? '' : 's'} under projects/ not yet on GitHub`
        }
      >
        <span style={dotStyle(noWork ? 'var(--status-pass)' : 'var(--status-warn)')} />
        {noWork ? 'Sync (0)' : `Sync (${count})`}
      </button>

      {modalOpen && mounted && (
        <SyncModal
          preview={preview}
          onClose={() => setModalOpen(false)}
          onSynced={() => { setModalOpen(false); refresh() }}
        />
      )}
    </>
  )
}

function SyncModal({ preview, onClose, onSynced }: {
  preview: SyncPreview
  onClose: () => void
  onSynced: () => void
}) {
  const [mode, setMode] = useState<'pr' | 'main'>('pr')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<SyncState>('idle')
  const [result, setResult] = useState<SyncResult | null>(null)

  const submit = async () => {
    if (state === 'syncing' || state === 'queued') return
    setState('syncing')
    setResult(null)
    try {
      const res = await fetch('/api/sync-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, message: message.trim() || undefined }),
      })
      const json: SyncResult = await res.json()

      // Snapshot mode → response is a queued request. Poll until the daemon
      // completes it, then surface the final result.
      if (json.ok && json.mode === 'queued' && json.requestId) {
        setState('queued')
        setResult(json)
        const id = json.requestId
        const deadline = Date.now() + 90_000 // 90s
        const tick = async (): Promise<void> => {
          if (Date.now() > deadline) {
            setState('error')
            setResult({ ok: false, error: 'Timed out — is the sync-listener daemon running on your Mac?' })
            return
          }
          try {
            const sr = await fetch(`/api/sync-projects/status/${id}`, { cache: 'no-store' })
            const sb = (await sr.json()) as { ok: boolean; request?: QueuedRequest }
            if (sb.ok && sb.request) {
              if (sb.request.status === 'done') {
                const r = (sb.request.result ?? {}) as Partial<SyncResult>
                setResult({ ok: true, ...r })
                setState('success')
                setTimeout(onSynced, 2200)
                return
              }
              if (sb.request.status === 'error') {
                const r = (sb.request.result ?? {}) as { error?: string }
                setResult({ ok: false, error: r.error ?? 'Daemon reported an error' })
                setState('error')
                return
              }
            }
          } catch { /* keep polling */ }
          setTimeout(tick, 2000)
        }
        setTimeout(tick, 1500)
        return
      }

      setResult(json)
      setState(json.ok ? 'success' : 'error')
      if (json.ok) {
        setTimeout(onSynced, 2000)
      }
    } catch (e) {
      setState('error')
      setResult({ ok: false, error: e instanceof Error ? e.message : 'Network error' })
    }
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && state !== 'syncing') onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="uf-card"
        style={{
          maxWidth: 520,
          width: '100%',
          padding: 24,
          background: 'var(--bg-elevated)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.25), 0 0 0 1px var(--status-warn-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="uf-eyebrow" style={{ color: 'var(--status-warn)' }}>
            Sync Projects to GitHub
          </span>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {preview.count} change{preview.count === 1 ? '' : 's'} under <code style={{
              background: 'var(--bg-input)',
              padding: '2px 8px',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
            }}>projects/</code>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
            Branch: <code style={{ fontFamily: 'var(--font-mono)' }}>{preview.branch ?? '—'}</code>. Only files under <code style={{ fontFamily: 'var(--font-mono)' }}>projects/</code> are touched — utopia-wizard and root are left alone.
          </p>
          {preview.source === 'remote' && (
            <div style={{
              background: preview.stale ? 'var(--status-warn-bg)' : 'var(--brand-bg)',
              border: `1px solid ${preview.stale ? 'var(--status-warn-border)' : 'var(--brand-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: 11.5,
              color: preview.stale ? 'var(--status-warn)' : 'var(--brand)',
              marginTop: 8,
            }}>
              {preview.available
                ? <>● Remote mode — daemon reported {preview.daemonAgeSeconds}s ago{preview.stale ? ' (stale)' : ''}. Clicking submit queues the request; your local daemon will run it.</>
                : <>○ Remote mode — no sync-listener daemon has reported in. Start it on your Mac with <code style={{ background: 'var(--bg-input)', padding: '1px 5px', borderRadius: 4 }}>cd utopia-wizard && npm run sync-listener</code>.</>}
            </div>
          )}
        </div>

        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11.5,
          lineHeight: 1.5,
          color: 'var(--text-secondary)',
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          {(preview.changes ?? []).map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, whiteSpace: 'pre' }}>
              <span style={{
                color: c.status.includes('?') ? 'var(--status-warn)'
                  : c.status.includes('A') ? 'var(--status-pass)'
                  : c.status.includes('D') ? 'var(--status-fail)'
                  : 'var(--text-muted)',
                fontWeight: 600,
                minWidth: 22,
              }}>
                {c.status}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.path}</span>
            </div>
          ))}
          {preview.count && preview.count > (preview.changes?.length ?? 0) && (
            <div style={{ color: 'var(--text-quiet)', marginTop: 6 }}>
              … and {preview.count - (preview.changes?.length ?? 0)} more
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{
            color: 'var(--text-muted)',
            fontSize: 11.5,
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}>
            Commit message (optional)
          </label>
          <input
            className="fairy-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`sync: update projects/ from local working tree (${preview.count} file${preview.count === 1 ? '' : 's'})`}
            style={{ padding: '10px 16px', fontSize: 13, borderRadius: 10 }}
            disabled={state === 'syncing' || state === 'success'}
            spellCheck={false}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{
            color: 'var(--text-muted)',
            fontSize: 11.5,
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}>
            How to ship
          </span>
          <ModeRadio
            value="pr"
            selected={mode}
            onClick={() => setMode('pr')}
            title="Open a PR (review before merge)"
            description="Commits, pushes to a new sync/projects-… branch, opens a PR you can review and merge."
            disabled={state === 'syncing'}
          />
          <ModeRadio
            value="main"
            selected={mode}
            onClick={() => setMode('main')}
            title="Push straight to main"
            description="Commits and pushes directly. No PR. Cron picks it up on the next scan. Only works if you're already on main."
            disabled={state === 'syncing'}
            danger
          />
        </div>

        {result && !result.ok && (
          <div style={{
            color: 'var(--status-fail)',
            background: 'var(--status-fail-bg)',
            border: '1px solid var(--status-fail-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            fontSize: 12.5,
            lineHeight: 1.5,
          }}>
            {result.error}
          </div>
        )}

        {state === 'queued' && (
          <div style={{
            color: 'var(--brand)',
            background: 'var(--brand-bg)',
            border: '1px solid var(--brand-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            fontSize: 12.5,
            lineHeight: 1.55,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{
              display: 'inline-block',
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--brand)',
              animation: 'pulseDot 1.4s ease-in-out infinite',
            }} />
            Queued. Waiting on the local daemon to commit and push…
          </div>
        )}

        {result && result.ok && state === 'success' && (
          <div style={{
            color: 'var(--status-pass)',
            background: 'var(--status-pass-bg)',
            border: '1px solid var(--status-pass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            fontSize: 12.5,
            lineHeight: 1.55,
          }}>
            ✓ Synced {result.filesCommitted} file{result.filesCommitted === 1 ? '' : 's'} · commit <code style={{ fontFamily: 'var(--font-mono)' }}>{result.commitSha}</code>
            {result.mode === 'pr' && result.prUrl && (
              <div style={{ marginTop: 6 }}>
                <a href={result.prUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--status-pass)', fontWeight: 600 }}>
                  Open PR →
                </a>
              </div>
            )}
            {result.mode === 'pr' && !result.prUrl && result.branch && (
              <div style={{ marginTop: 6, color: 'var(--text-muted)' }}>
                Branch <code style={{ fontFamily: 'var(--font-mono)' }}>{result.branch}</code> pushed. gh CLI wasn't available, so open the PR manually on GitHub.
              </div>
            )}
            {result.mode === 'main' && (
              <div style={{ marginTop: 6, color: 'var(--text-muted)' }}>
                Pushed to main. Click Rescan Now (or wait for cron) to see the new state.
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            onClick={onClose}
            disabled={state === 'syncing'}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-pill)',
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: state === 'syncing' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.2,
            }}
          >
            {state === 'success' ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={submit}
            disabled={state === 'syncing' || state === 'queued' || state === 'success' || (preview.count ?? 0) === 0 || (preview.source === 'remote' && !preview.available)}
            style={{
              background: mode === 'main' ? 'var(--status-fail)' : 'var(--brand)',
              color: '#fff',
              border: `1px solid ${mode === 'main' ? 'var(--status-fail)' : 'var(--brand)'}`,
              borderRadius: 'var(--radius-pill)',
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: (state === 'syncing' || state === 'queued') ? 'wait' : 'pointer',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.2,
              transition: 'all var(--transition-snap)',
              opacity: (preview.count ?? 0) === 0 ? 0.5 : 1,
            }}
          >
            {state === 'queued' ? 'Waiting…'
              : state === 'syncing' ? 'Syncing…'
              : state === 'success' ? '✓ Synced'
              : mode === 'main' ? 'Push to Main'
              : 'Open Sync PR'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function ModeRadio({ value, selected, onClick, title, description, disabled, danger }: {
  value: 'pr' | 'main'
  selected: 'pr' | 'main'
  onClick: () => void
  title: string
  description: string
  disabled?: boolean
  danger?: boolean
}) {
  const active = selected === value
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: active
          ? danger ? 'var(--status-fail-bg)' : 'var(--brand-bg)'
          : 'transparent',
        border: `1px solid ${active
          ? danger ? 'var(--status-fail-border)' : 'var(--brand-border)'
          : 'var(--border-soft)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        cursor: disabled ? 'wait' : 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        transition: 'all var(--transition-snap)',
      }}
    >
      <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: active
          ? danger ? 'var(--status-fail)' : 'var(--brand)'
          : 'var(--text-primary)',
      }}>
        {title}
      </span>
      <span style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {description}
      </span>
    </button>
  )
}
