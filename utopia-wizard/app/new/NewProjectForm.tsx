'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

let pasteCounter = 0

interface Result {
  slug: string
  repoFullName: string
  htmlUrl: string
  cloneUrl: string
  seededClaude: boolean
  assets: number
  prompt: string
}

export default function NewProjectForm() {
  const [name, setName] = useState('')
  const [brief, setBrief] = useState('')
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const slug = name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)

  const addFiles = (incoming: File[]) => {
    if (incoming.length) setFiles((prev) => [...prev, ...incoming])
  }
  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx))

  // Capture images pasted into the brief (clipboard screenshots/logos).
  const onPaste = (e: React.ClipboardEvent) => {
    const imgs: File[] = []
    for (const item of Array.from(e.clipboardData?.items ?? [])) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile()
        if (blob) {
          const ext = (item.type.split('/')[1] || 'png').replace('jpeg', 'jpg')
          imgs.push(new File([blob], `pasted-${Date.now()}-${pasteCounter++}.${ext}`, { type: item.type }))
        }
      }
    }
    if (imgs.length) { e.preventDefault(); addFiles(imgs) }
  }

  // Object-URL previews for image files (revoked on change/unmount).
  const previews = useMemo(
    () => files.map((f) => ({ file: f, url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null })),
    [files],
  )
  useEffect(() => () => { previews.forEach((p) => p.url && URL.revokeObjectURL(p.url)) }, [previews])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || !slug || !brief.trim()) return
    setBusy(true); setError(null)
    try {
      const fd = new FormData()
      fd.set('name', name)
      fd.set('slug', slug)
      fd.set('brief', brief)
      fd.set('visibility', visibility)
      for (const f of files) fd.append('files', f)
      const res = await fetch('/api/projects/create', { method: 'POST', body: fd })
      const body = await res.json()
      if (!res.ok) { setError(body.error ?? 'Could not create project.'); return }
      setResult(body)
    } catch {
      setError('Network error.')
    } finally {
      setBusy(false)
    }
  }

  const copyPrompt = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.prompt).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--text-secondary)' }
  const input: React.CSSProperties = { background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%' }

  // ── Result view ────────────────────────────────────────────────────────
  if (result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="uf-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="uf-eyebrow" style={{ color: 'var(--status-pass)' }}>Project created ✓</span>
          <div>
            <a href={result.htmlUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-mono)' }}>{result.repoFullName} ↗</a>
            <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--text-muted)' }}>
              Seeded inputs.md{result.seededClaude ? ' + CLAUDE.md' : ''}{result.assets ? ` + ${result.assets} brand asset(s)` : ''} · connected to your dashboard.
            </p>
          </div>
        </div>

        <div className="uf-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span className="uf-eyebrow">Copy this into your terminal / Claude</span>
            <button onClick={copyPrompt} className="uf-btn-brand" style={{ padding: '6px 14px', fontSize: 12 }}>{copied ? 'Copied ✓' : 'Copy'}</button>
          </div>
          <pre style={{ margin: 0, background: 'var(--bg-input)', border: '1px solid var(--border-soft)', borderRadius: 8, padding: '12px 14px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{result.prompt}</pre>
        </div>

        <button onClick={() => { setResult(null); setName(''); setBrief(''); setFiles([]) }} style={{ ...input, width: 'auto', alignSelf: 'flex-start', cursor: 'pointer', fontWeight: 600 }}>
          + Create another
        </button>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && <div className="uf-card" style={{ padding: '12px 16px', color: 'var(--status-fail)', fontSize: 13 }}>{error}</div>}

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={label}>Project name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aircond Service Penang" style={input} autoFocus />
        {slug && <span style={{ fontSize: 11.5, color: 'var(--text-quiet)' }}>repo + slug: <code style={{ fontFamily: 'var(--font-mono)' }}>{slug}</code></span>}
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={label}>Brief / prompt</span>
        <textarea value={brief} onChange={(e) => setBrief(e.target.value)} onPaste={onPaste} rows={7} placeholder="Describe the website: product/service, target locations, tone, key pages… You can paste images (screenshots, logos) right here." style={{ ...input, resize: 'vertical', lineHeight: 1.5 }} />
        <span style={{ fontSize: 11, color: 'var(--text-quiet)' }}>Tip: paste an image (⌘/Ctrl+V) to attach it as a brand asset.</span>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={label}>Brand assets (optional)</span>
        <input ref={fileRef} type="file" multiple onChange={(e) => { addFiles(Array.from(e.target.files ?? [])); e.target.value = '' }} style={{ ...input, padding: '8px 12px' }} />
        {previews.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {previews.map((p, i) => (
              <div key={i} style={{ position: 'relative', border: '1px solid var(--border-soft)', borderRadius: 8, padding: p.url ? 0 : '6px 10px', background: 'var(--bg-input)', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.url
                  ? <img src={p.url} alt={p.file.name} style={{ width: 56, height: 56, objectFit: 'cover', display: 'block' }} />
                  : <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.file.name}</span>}
                <button type="button" onClick={() => removeFile(i)} aria-label="Remove" title="Remove" style={{ position: p.url ? 'absolute' : 'static', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, lineHeight: 1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={label}>Visibility</span>
        <div role="group" style={{ display: 'inline-flex', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', alignSelf: 'flex-start' }}>
          {(['private', 'public'] as const).map((v) => (
            <button key={v} type="button" onClick={() => setVisibility(v)} style={{ background: visibility === v ? 'var(--surface-hover)' : 'transparent', color: visibility === v ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none', padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-sans)' }}>{v}</button>
          ))}
        </div>
      </label>

      <button type="submit" disabled={busy || !slug || !brief.trim()} className="uf-btn-brand" style={{ padding: '11px 16px', marginTop: 4 }}>
        {busy ? 'Creating repo…' : '✦ Create project repo'}
      </button>
      <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-quiet)', lineHeight: 1.5 }}>
        Creates a {visibility} GitHub repo under your account, commits the brief + assets + CLAUDE.md, and connects it to your dashboard. Nothing is written to disk.
      </p>
    </form>
  )
}
