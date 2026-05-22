'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import TrashIcon from './icons/TrashIcon'

interface DeleteProjectModalProps {
  slug: string
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

type DeleteState = 'idle' | 'deleting' | 'success' | 'error'

export default function DeleteProjectModal({ slug, open, onClose, onDeleted }: DeleteProjectModalProps) {
  const [typed, setTyped] = useState('')
  const [state, setState] = useState<DeleteState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [result, setResult] = useState<{ folderDeleted: boolean; snapshotDeleted: boolean; folderError: string | null; snapshotError: string | null } | null>(null)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mount guard for the portal: createPortal must target a real DOM node, and
  // document is undefined during SSR. Render nothing on the server pass.
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (open) {
      setTyped('')
      setState('idle')
      setErrorMsg(null)
      setResult(null)
      // Autofocus the input so the keyboard is ready immediately
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, slug])

  // ESC to close (only when not mid-delete)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state !== 'deleting') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, state, onClose])

  if (!open || !mounted) return null

  const matches = typed.trim() === slug
  const canDelete = matches && state !== 'deleting' && state !== 'success'

  const submit = async () => {
    if (!canDelete) return
    setState('deleting')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/delete-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, confirm: typed.trim() }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setState('error')
        setErrorMsg(json.error ?? `HTTP ${res.status}`)
        return
      }
      setResult({
        folderDeleted: json.folderDeleted,
        snapshotDeleted: json.snapshotDeleted,
        folderError: json.folderError,
        snapshotError: json.snapshotError,
      })
      setState('success')
      // Brief pause so the user sees the success state, then notify parent.
      setTimeout(() => onDeleted(), 900)
    } catch (e) {
      setState('error')
      setErrorMsg(e instanceof Error ? e.message : 'Failed to reach server')
    }
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && state !== 'deleting') onClose()
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
          maxWidth: 460,
          width: '100%',
          padding: 24,
          background: 'var(--bg-elevated)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.25), 0 0 0 1px var(--status-fail-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="uf-eyebrow" style={{ color: 'var(--status-fail)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <TrashIcon size={13} strokeWidth={2} />
            Delete Project
          </span>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            This will remove <code style={{
              background: 'var(--bg-input)',
              padding: '2px 8px',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              color: 'var(--status-fail)',
            }}>{slug}</code>
          </h2>
        </div>

        <ul style={{
          margin: 0,
          padding: '12px 14px',
          listStyle: 'none',
          background: 'var(--status-fail-bg)',
          border: '1px solid var(--status-fail-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 12.5,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          <li>• Removes <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>projects/{slug}/</code> from disk</li>
          <li>• Removes the row in <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>monitor_snapshots</code></li>
          <li style={{ color: 'var(--text-muted)' }}>• Phones / products / blog posts in Supabase are kept</li>
        </ul>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{
            color: 'var(--text-muted)',
            fontSize: 11.5,
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}>
            Type the slug to confirm
          </label>
          <input
            ref={inputRef}
            className="fairy-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && canDelete) submit() }}
            placeholder={slug}
            style={{ padding: '10px 16px', fontSize: 14, borderRadius: 10 }}
            disabled={state === 'deleting' || state === 'success'}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {state === 'error' && errorMsg && (
          <div style={{
            color: 'var(--status-fail)',
            background: 'var(--status-fail-bg)',
            border: '1px solid var(--status-fail-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            fontSize: 12.5,
            lineHeight: 1.5,
          }}>
            {errorMsg}
          </div>
        )}

        {state === 'success' && result && (
          <div style={{
            color: 'var(--status-pass)',
            background: 'var(--status-pass-bg)',
            border: '1px solid var(--status-pass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            fontSize: 12.5,
            lineHeight: 1.5,
          }}>
            ✓ Folder {result.folderDeleted ? 'deleted' : 'not present'} · Snapshot {result.snapshotDeleted ? 'deleted' : 'not present'}
            {(result.folderError || result.snapshotError) && (
              <div style={{ marginTop: 6, color: 'var(--status-warn)' }}>
                {result.folderError && <div>Folder warning: {result.folderError}</div>}
                {result.snapshotError && <div>Snapshot warning: {result.snapshotError}</div>}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button
            onClick={onClose}
            disabled={state === 'deleting'}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-pill)',
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: state === 'deleting' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.2,
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canDelete}
            style={{
              background: canDelete ? 'var(--status-fail)' : 'var(--surface-hover)',
              color: canDelete ? '#fff' : 'var(--text-quiet)',
              border: `1px solid ${canDelete ? 'var(--status-fail)' : 'var(--border-soft)'}`,
              borderRadius: 'var(--radius-pill)',
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: canDelete ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.2,
              transition: 'all var(--transition-snap)',
            }}
          >
            {state === 'deleting' ? 'Deleting…'
              : state === 'success' ? '✓ Deleted'
              : 'Delete Forever'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
