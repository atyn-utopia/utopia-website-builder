'use client'

import { useEffect, useState, useCallback } from 'react'
import PlaybookDocView from './PlaybookDocView'
import PlaybookStructureView, { type Structure } from './PlaybookStructureView'

interface PlaybookMeta {
  github_login: string
  repo_full_name: string
  source_path: string
  title: string | null
  generated_at: string
}
interface GithubRepo { full_name: string; id: number }

function ago(iso: string): string {
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return ''
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days < 1) return 'today'; if (days < 2) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PlaybooksClient() {
  const [viewer, setViewer] = useState<string | null>(null)
  const [list, setList] = useState<PlaybookMeta[]>([])
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [selectedRepo, setSelectedRepo] = useState('')
  const [generating, setGenerating] = useState(false)
  const [mode, setMode] = useState<'ai' | 'parse'>('ai')
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null) // login whose playbook is shown
  const [content, setContent] = useState<{ title: string | null; repo: string; source: string; md: string; structure: Structure | null } | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)

  const loadList = useCallback(async () => {
    try {
      const res = await fetch('/api/playbooks', { cache: 'no-store' })
      const body = await res.json()
      setViewer(body.viewer ?? null)
      setList(body.playbooks ?? [])
    } catch { setError('Failed to load playbooks.') }
  }, [])

  useEffect(() => {
    loadList()
    fetch('/api/github/repos', { cache: 'no-store' })
      .then((r) => r.json())
      .then((b) => { if (b.ok) setRepos(b.repos ?? []) })
      .catch(() => {})
  }, [loadList])

  const generate = async () => {
    if (!selectedRepo) { setError('Pick a repo first.'); return }
    setGenerating(true); setError(null); setNotice(null)
    try {
      const res = await fetch('/api/playbooks/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_full_name: selectedRepo, mode }),
      })
      const body = await res.json()
      if (!res.ok) { setError(body.error ?? 'Generation failed.'); return }
      setNotice(`Playbook generated from ${body.repo_full_name} (${body.source_path}) · ${body.mode === 'ai' ? 'AI' : 'structured'} · ${body.files_read} files.`)
      await loadList()
      view(viewer as string)
    } catch { setError('Network error.') }
    finally { setGenerating(false) }
  }

  const remove = async () => {
    if (!viewer) return
    if (!window.confirm('Delete your playbook? You can regenerate it anytime.')) return
    setError(null); setNotice(null)
    try {
      const res = await fetch(`/api/playbooks/${encodeURIComponent(viewer)}`, { method: 'DELETE' })
      if (!res.ok) { const b = await res.json().catch(() => ({})); setError(b.error ?? 'Could not delete.'); return }
      if (open === viewer) { setOpen(null); setContent(null) }
      setNotice('Your playbook was deleted.')
      await loadList()
    } catch { setError('Network error.') }
  }

  const view = async (login: string) => {
    setOpen(login); setLoadingContent(true); setContent(null)
    try {
      const res = await fetch(`/api/playbooks/${encodeURIComponent(login)}`, { cache: 'no-store' })
      const body = await res.json()
      if (res.ok) setContent({ title: body.playbook.title, repo: body.playbook.repo_full_name, source: body.playbook.source_path, md: body.playbook.content ?? '', structure: body.playbook.structure ?? null })
    } finally { setLoadingContent(false) }
  }

  const myPlaybook = list.find((p) => p.github_login === viewer)
  const q = search.trim().toLowerCase()
  const filtered = q
    ? list.filter((p) =>
        p.github_login.toLowerCase().includes(q) ||
        (p.title ?? '').toLowerCase().includes(q) ||
        p.repo_full_name.toLowerCase().includes(q))
    : list

  return (
    <>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Team Playbooks</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          Generate your playbook from a repo&apos;s <code style={{ fontFamily: 'var(--font-mono)' }}>CLAUDE.md</code>. Everyone on the team can view each other&apos;s.
        </p>
      </header>

      {error && <div className="uf-card" style={{ padding: '12px 16px', color: 'var(--status-fail)', fontSize: 13 }}>{error}</div>}
      {notice && <div className="uf-card" style={{ padding: '12px 16px', color: 'var(--status-pass)', fontSize: 13 }}>{notice}</div>}

      {/* Generate */}
      {viewer && viewer !== '*' && (
        <section className="uf-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="uf-eyebrow">Your playbook</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              style={{
                flex: 1, minWidth: 220, background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-pill)', padding: '9px 38px 9px 16px', color: 'var(--text-primary)',
                fontSize: 13, fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none',
                appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2.5 4.5l3.5 3.5 3.5-3.5' fill='none' stroke='%238a8a93' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '12px',
              }}
            >
              <option value="">{repos.length ? 'Select a repo…' : 'No repos (token needs repo access)'}</option>
              {repos.map((r) => <option key={r.id} value={r.full_name}>{r.full_name}</option>)}
            </select>
            <div role="group" aria-label="Generation mode" style={{ display: 'inline-flex', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
              {([{ k: 'ai', l: 'AI' }, { k: 'parse', l: 'Structured' }] as const).map(({ k, l }) => (
                <button key={k} onClick={() => setMode(k)} title={k === 'ai' ? 'OpenAI reads the files (owners, maturity)' : 'Deterministic parse (no AI)'}
                  style={{ background: mode === k ? 'var(--surface-hover)' : 'transparent', color: mode === k ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none', padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={generate} disabled={generating || !selectedRepo} className="uf-btn-brand" style={{ padding: '9px 18px', fontSize: 13 }}>
              {generating ? (mode === 'ai' ? 'Generating (AI)…' : 'Generating…') : myPlaybook ? 'Regenerate' : 'Generate'}
            </button>
          </div>
          {myPlaybook && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-quiet)' }}>
                Current: <strong style={{ color: 'var(--text-secondary)' }}>{myPlaybook.title}</strong> · {myPlaybook.repo_full_name}/{myPlaybook.source_path} · {ago(myPlaybook.generated_at)}
              </p>
              <button onClick={remove} style={{ background: 'transparent', border: '1px solid var(--status-fail-border)', color: 'var(--status-fail)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Delete
              </button>
            </div>
          )}
        </section>
      )}

      {/* Team list */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span className="uf-eyebrow">All playbooks ({filtered.length}{q && filtered.length !== list.length ? ` of ${list.length}` : ''})</span>
          {list.length > 0 && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search owner, title, repo…"
              style={{ flex: 1, minWidth: 200, maxWidth: 320, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'var(--font-sans)' }}
            />
          )}
        </div>
        {list.length === 0 ? (
          <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>No playbooks yet — generate one above.</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>No playbooks match &ldquo;{search}&rdquo;.</p>
        ) : filtered.map((p) => {
          const mine = p.github_login === viewer
          return (
            <button key={p.github_login} onClick={() => view(p.github_login)} className="uf-card uf-card--clickable" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, textAlign: 'left', cursor: 'pointer', border: open === p.github_login ? '1px solid var(--brand)' : undefined }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{p.title || p.repo_full_name}</span>
                  {mine && <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand)', border: '1px solid var(--border-soft)', borderRadius: 5, padding: '1px 5px' }}>Yours</span>}
                </div>
                <span style={{ color: 'var(--text-quiet)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>{p.repo_full_name}/{p.source_path}</span>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>@{p.github_login}</div>
                <div style={{ color: 'var(--text-quiet)', fontSize: 11 }}>{ago(p.generated_at)}</div>
              </div>
            </button>
          )
        })}
      </section>

      {/* Viewer */}
      {open && (
        <section className="uf-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <span className="uf-eyebrow">Playbook · @{open}</span>
            <button onClick={() => { setOpen(null); setContent(null) }} style={{ background: 'transparent', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>Close</button>
          </div>
          {loadingContent ? <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>Loading…</p>
            : content?.structure ? <PlaybookStructureView structure={content.structure} owner={open} />
            : content ? <PlaybookDocView md={content.md} owner={open} repo={content.repo} source={content.source} title={content.title} />
            : <p style={{ color: 'var(--status-fail)', fontSize: 13 }}>Could not load this playbook.</p>}
        </section>
      )}
    </>
  )
}
