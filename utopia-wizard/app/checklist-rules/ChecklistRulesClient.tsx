'use client'

import { useEffect, useState, useCallback } from 'react'

interface ChecklistMeta { github_login: string; repo_full_name: string; source_path: string; generated_at: string }
interface GithubRepo { full_name: string; id: number }
interface CheckItem { id: string; group: string; name: string; description: string; severity: 'blocking' | 'warning' | 'info' }

const SEV: Record<CheckItem['severity'], { label: string; color: string }> = {
  blocking: { label: 'Blocking', color: 'var(--status-fail)' },
  warning: { label: 'Warning', color: 'var(--status-warn)' },
  info: { label: 'Info', color: 'var(--text-muted)' },
}

function ago(iso: string): string {
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return ''
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days < 1) return 'today'; if (days < 2) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ChecklistRulesClient() {
  const [viewer, setViewer] = useState<string | null>(null)
  const [list, setList] = useState<ChecklistMeta[]>([])
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [selectedRepo, setSelectedRepo] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [items, setItems] = useState<CheckItem[] | null>(null)
  const [meta, setMeta] = useState<{ repo: string; source: string } | null>(null)
  const [loadingItems, setLoadingItems] = useState(false)
  const [mode, setMode] = useState<'default' | 'generated'>('default')

  const loadList = useCallback(async () => {
    try {
      const res = await fetch('/api/checklists', { cache: 'no-store' })
      const body = await res.json()
      setViewer(body.viewer ?? null)
      setList(body.checklists ?? [])
    } catch { setError('Failed to load checklists.') }
  }, [])

  useEffect(() => {
    loadList()
    fetch('/api/github/repos', { cache: 'no-store' }).then((r) => r.json()).then((b) => { if (b.ok) setRepos(b.repos ?? []) }).catch(() => {})
    fetch('/api/checklists/mode', { cache: 'no-store' }).then((r) => r.json()).then((b) => setMode(b.mode === 'generated' ? 'generated' : 'default')).catch(() => {})
  }, [loadList])

  const changeMode = async (m: 'default' | 'generated') => {
    if (m === mode) return
    setMode(m); setError(null); setNotice(null)
    try {
      const res = await fetch('/api/checklists/mode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: m }) })
      const body = await res.json()
      if (!res.ok) { setError(body.error ?? 'Could not change mode.'); setMode(m === 'generated' ? 'default' : 'generated'); return }
      setNotice(m === 'generated' ? 'Switched to your generated checklist.' : 'Switched back to the default checklist.')
    } catch { setError('Network error.'); setMode(m === 'generated' ? 'default' : 'generated') }
  }

  const generate = async () => {
    if (!selectedRepo) { setError('Pick a repo first.'); return }
    setBusy(true); setError(null); setNotice(null)
    try {
      const res = await fetch('/api/checklists/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repo_full_name: selectedRepo }) })
      const body = await res.json()
      if (!res.ok) { setError(body.error ?? 'Generation failed.'); return }
      setNotice(`Checklist generated from ${body.repo_full_name} (${body.source_path}) · ${body.count} checks.`)
      await loadList()
      if (viewer) view(viewer)
    } catch { setError('Network error.') } finally { setBusy(false) }
  }

  const view = async (login: string) => {
    setOpen(login); setLoadingItems(true); setItems(null)
    try {
      const res = await fetch(`/api/checklists/${encodeURIComponent(login)}`, { cache: 'no-store' })
      const body = await res.json()
      if (res.ok) { setItems(body.checklist.items); setMeta({ repo: body.checklist.repo_full_name, source: body.checklist.source_path }) }
    } finally { setLoadingItems(false) }
  }

  const remove = async () => {
    if (!viewer || !window.confirm('Delete your checklist?')) return
    setError(null); setNotice(null)
    try {
      const res = await fetch(`/api/checklists/${encodeURIComponent(viewer)}`, { method: 'DELETE' })
      if (!res.ok) { const b = await res.json().catch(() => ({})); setError(b.error ?? 'Could not delete.'); return }
      if (open === viewer) { setOpen(null); setItems(null) }
      setNotice('Your checklist was deleted.'); await loadList()
    } catch { setError('Network error.') }
  }

  const mine = list.find((c) => c.github_login === viewer)
  const groups = items ? [...new Set(items.map((i) => i.group))] : []

  return (
    <>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Checklist Rules</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          AI derives your QA checklist from a repo&apos;s <code style={{ fontFamily: 'var(--font-mono)' }}>CLAUDE.md</code>. Each teammate has their own rules.
        </p>
      </header>

      {error && <div className="uf-card" style={{ padding: '12px 16px', color: 'var(--status-fail)', fontSize: 13 }}>{error}</div>}
      {notice && <div className="uf-card" style={{ padding: '12px 16px', color: 'var(--status-pass)', fontSize: 13 }}>{notice}</div>}

      {viewer && viewer !== '*' && (
        <section className="uf-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="uf-eyebrow">Active checklist</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div role="group" aria-label="Active checklist" style={{ display: 'inline-flex', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
              {([{ k: 'default', l: 'Default (built-in)' }, { k: 'generated', l: 'My generated' }] as const).map(({ k, l }) => (
                <button key={k} onClick={() => changeMode(k)} disabled={k === 'generated' && !mine}
                  title={k === 'generated' && !mine ? 'Generate your checklist first (below)' : undefined}
                  style={{ background: mode === k ? 'var(--surface-hover)' : 'transparent', color: mode === k ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none', padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: (k === 'generated' && !mine) ? 'not-allowed' : 'pointer', opacity: (k === 'generated' && !mine) ? 0.5 : 1, fontFamily: 'var(--font-sans)' }}>
                  {l}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-quiet)' }}>
              {mode === 'generated' ? 'Your projects use your AI-derived rules.' : 'Your projects use the standard Utopia checklist.'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-quiet)', lineHeight: 1.5 }}>
            Note: switching to “My generated” takes effect once AI evaluation runs against your rules (coming with on-demand scoring). The default checklist scores your projects today.
          </p>
        </section>
      )}

      {viewer && viewer !== '*' && (
        <section className="uf-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="uf-eyebrow">Your generated checklist</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={selectedRepo} onChange={(e) => setSelectedRepo(e.target.value)} style={selectStyle}>
              <option value="">{repos.length ? 'Select a repo…' : 'No repos (token needs repo access)'}</option>
              {repos.map((r) => <option key={r.id} value={r.full_name}>{r.full_name}</option>)}
            </select>
            <button onClick={generate} disabled={busy || !selectedRepo} className="uf-btn-brand" style={{ padding: '9px 18px', fontSize: 13 }}>
              {busy ? 'Generating (AI)…' : mine ? 'Regenerate' : 'Generate'}
            </button>
          </div>
          {mine && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-quiet)' }}>Current: {mine.repo_full_name}/{mine.source_path} · {ago(mine.generated_at)}</p>
              <button onClick={remove} style={{ background: 'transparent', border: '1px solid var(--status-fail-border)', color: 'var(--status-fail)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          )}
        </section>
      )}

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="uf-eyebrow">All checklists ({list.length})</span>
        {list.length === 0 ? <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>No checklists yet — generate one above.</p>
          : list.map((c) => (
            <button key={c.github_login} onClick={() => view(c.github_login)} className="uf-card uf-card--clickable" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, textAlign: 'left', cursor: 'pointer', border: open === c.github_login ? '1px solid var(--brand)' : undefined }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>@{c.github_login}</span>
                  {c.github_login === viewer && <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand)', border: '1px solid var(--border-soft)', borderRadius: 5, padding: '1px 5px' }}>Yours</span>}
                </div>
                <span style={{ color: 'var(--text-quiet)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>{c.repo_full_name}/{c.source_path}</span>
              </div>
              <span style={{ color: 'var(--text-quiet)', fontSize: 11 }}>{ago(c.generated_at)}</span>
            </button>
          ))}
      </section>

      {open && (
        <section className="uf-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div>
              <span className="uf-eyebrow">Checklist · @{open}</span>
              {meta && <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--text-quiet)', fontFamily: 'var(--font-mono)' }}>{meta.repo}/{meta.source}{items ? ` · ${items.length} checks` : ''}</p>}
            </div>
            <button onClick={() => { setOpen(null); setItems(null) }} style={{ background: 'transparent', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>Close</button>
          </div>
          {loadingItems ? <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>Loading…</p>
            : !items ? <p style={{ color: 'var(--status-fail)', fontSize: 13 }}>Could not load.</p>
            : groups.map((g) => (
              <div key={g} style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--text-secondary)', margin: '0 0 8px', paddingBottom: 5, borderBottom: '1px solid var(--border-soft)' }}>{g}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.filter((i) => i.group === g).map((i) => (
                    <div key={i.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' }}>
                      <span style={{ flexShrink: 0, marginTop: 2, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', color: SEV[i.severity].color, border: '1px solid var(--border-soft)', borderRadius: 4, padding: '1px 5px', minWidth: 56, textAlign: 'center' }}>{SEV[i.severity].label}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 600 }}>{i.name}</div>
                        {i.description && <div style={{ color: 'var(--text-muted)', fontSize: 12.5, lineHeight: 1.5, marginTop: 1 }}>{i.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}
    </>
  )
}

const selectStyle: React.CSSProperties = {
  flex: 1, minWidth: 220, background: 'var(--input-bg)', border: '1px solid var(--input-border)',
  borderRadius: 'var(--radius-pill)', padding: '9px 38px 9px 16px', color: 'var(--text-primary)',
  fontSize: 13, fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none',
  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2.5 4.5l3.5 3.5 3.5-3.5' fill='none' stroke='%238a8a93' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '12px',
}
