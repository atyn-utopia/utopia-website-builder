'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PorcelainEntry {
  status: string
  path: string
}

interface SyncPreview {
  available: boolean
  branch?: string
  count?: number
  changes?: PorcelainEntry[]
  reason?: string
}

interface SyncResult {
  ok: boolean
  mode?: 'pr' | 'main'
  commitSha?: string
  filesCommitted?: number
  message?: string
  branch?: string
  prUrl?: string | null
  error?: string
}

type SyncState = 'idle' | 'syncing' | 'success' | 'error'

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

  // Hidden when wizard is in snapshot mode (no filesystem) or when projects/
  // is clean.
  if (!preview || !preview.available || !preview.count) return null

  const count = preview.count
  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        style={{
          background: 'var(--status-warn-bg)',
          color: 'var(--status-warn)',
          border: '1px solid var(--status-warn-border)',
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
        }}
        title={`${count} change${count === 1 ? '' : 's'} under projects/ not yet on GitHub`}
      >
        <span style={{
          display: 'inline-block',
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--status-warn)',
        }} />
        Sync ({count})
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
    if (state === 'syncing') return
    setState('syncing')
    setResult(null)
    try {
      const res = await fetch('/api/sync-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, message: message.trim() || undefined }),
      })
      const json: SyncResult = await res.json()
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
            Branch: <code style={{ fontFamily: 'var(--font-mono)' }}>{preview.branch}</code>. Only files under <code style={{ fontFamily: 'var(--font-mono)' }}>projects/</code> are touched — utopia-fairy and root are left alone.
          </p>
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

        {result && result.ok && (
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
            disabled={state === 'syncing' || state === 'success'}
            style={{
              background: mode === 'main' ? 'var(--status-fail)' : 'var(--brand)',
              color: '#fff',
              border: `1px solid ${mode === 'main' ? 'var(--status-fail)' : 'var(--brand)'}`,
              borderRadius: 'var(--radius-pill)',
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: state === 'syncing' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.2,
              transition: 'all var(--transition-snap)',
            }}
          >
            {state === 'syncing' ? 'Syncing…'
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
