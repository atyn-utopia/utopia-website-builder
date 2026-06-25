'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult { type: 'project' | 'repo' | 'playbook'; label: string; sub: string; href: string }

const TYPE_BADGE: Record<SearchResult['type'], { label: string; color: string }> = {
  project: { label: 'Project', color: 'var(--brand-glow, var(--brand))' },
  repo: { label: 'Repo', color: 'var(--status-warn)' },
  playbook: { label: 'Playbook', color: 'var(--status-pass)' },
}

export default function UniversalSearch() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced fetch.
  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { cache: 'no-store' })
        const body = await res.json()
        setResults(body.results ?? [])
        setActive(0)
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 220)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (r: SearchResult) => { setOpen(false); setQ(''); router.push(r.href) }

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 140, maxWidth: 420 }}>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder="Search projects, repos, playbooks…"
        aria-label="Universal search"
        style={{
          width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)',
          borderRadius: 'var(--radius-pill)', padding: '8px 16px', color: 'var(--text-primary)',
          fontSize: 13, outline: 'none', fontFamily: 'var(--font-sans)',
        }}
      />
      {open && q.trim().length >= 2 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 'calc(100% + 6px)', zIndex: 60,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 12,
          boxShadow: '0 12px 32px -12px rgba(0,0,0,0.4)', overflow: 'hidden', maxHeight: 360, overflowY: 'auto',
        }}>
          {loading && results.length === 0 ? (
            <div style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--text-quiet)' }}>Searching…</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--text-quiet)' }}>No matches.</div>
          ) : results.map((r, i) => {
            const badge = TYPE_BADGE[r.type]
            return (
              <button
                key={`${r.type}-${r.label}-${i}`}
                onClick={() => go(r)}
                onMouseEnter={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  background: i === active ? 'var(--surface-hover)' : 'transparent', border: 'none',
                  padding: '9px 14px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: badge.color, border: '1px solid var(--border-soft)', borderRadius: 5, padding: '2px 6px', flexShrink: 0, minWidth: 58, textAlign: 'center' }}>{badge.label}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
                  <span style={{ display: 'block', color: 'var(--text-quiet)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.sub}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
