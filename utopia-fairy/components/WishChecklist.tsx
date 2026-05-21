'use client'

import { useEffect, useState } from 'react'

interface CheckItem {
  id: string
  name: string
  status: 'pass' | 'fail' | 'skip'
  detail?: string
}

interface CheckGroup {
  name: string
  items: CheckItem[]
}

interface ChecklistData {
  slug: string
  domain: string | null
  productSlug: string | null
  deployUrl: string | null
  passed: number
  total: number
  failedCount: number
  groups: CheckGroup[]
  ranAt: string
}

const COLORS = {
  perfect: { bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.35)', fg: '#4ade80' },
  partial: { bg: 'rgba(249, 169, 106, 0.10)', border: 'rgba(249, 169, 106, 0.30)', fg: '#F9A96A' },
  failing: { bg: 'rgba(248, 113, 113, 0.10)', border: 'rgba(248, 113, 113, 0.30)', fg: '#f87171' },
  empty:   { bg: 'rgba(96, 112, 128, 0.08)', border: 'rgba(96, 112, 128, 0.25)', fg: '#7a8ea3' },
} as const

function tierOf(passed: number, total: number): keyof typeof COLORS {
  if (total === 0) return 'empty'
  const r = passed / total
  if (r >= 1) return 'perfect'
  if (r >= 0.6) return 'partial'
  return 'failing'
}

export default function WishChecklist({ slug }: { slug: string }) {
  const [data, setData] = useState<ChecklistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch(`/api/checklist/${slug}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: ChecklistData = await res.json()
        if (mounted) { setData(json); setError(null) }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 30_000)
    return () => { mounted = false; clearInterval(t) }
  }, [slug])

  if (loading && !data) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
        ✦ Running checklist…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{
        background: 'rgba(248, 113, 113, 0.08)',
        border: '1px solid rgba(248, 113, 113, 0.25)',
        borderRadius: 10,
        padding: '12px 16px',
        color: '#f87171',
        fontSize: 13,
      }}>
        Could not load checklist: {error ?? 'unknown error'}
      </div>
    )
  }

  const tier = tierOf(data.passed, data.total)
  const failed = data.groups.flatMap((g) => g.items.filter((i) => i.status === 'fail').map((i) => ({ group: g.name, item: i })))

  const scoreClass = tier === 'perfect' ? 'uf-score--pass'
    : tier === 'partial' ? 'uf-score--warn'
    : tier === 'failing' ? 'uf-score--fail'
    : 'uf-score--neutral'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {/* Score header */}
      <div className="uf-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        padding: '18px 20px',
        background: 'var(--brand-bg)',
        boxShadow: '0 0 0 1px var(--brand-border)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="uf-eyebrow" style={{ color: 'var(--brand)' }}>Checklist</span>
          <span style={{
            color: 'var(--text-primary)',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
          }}>
            {failed.length === 0
              ? 'Everything is passing.'
              : `${failed.length} item${failed.length === 1 ? '' : 's'} still to fix.`}
          </span>
        </div>
        <div className={`uf-score ${scoreClass}`} style={{ padding: '6px 14px', fontSize: 14 }}>
          <span style={{ fontSize: 20 }}>{data.passed}</span>
          <span style={{ opacity: 0.5, fontSize: 13, marginLeft: 2 }}>/ {data.total}</span>
        </div>
      </div>

      {/* Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.groups.map((g) => {
          const passed = g.items.filter((i) => i.status === 'pass').length
          const total = g.items.length
          const ratio = total > 0 ? passed / total : 0
          const grpColor = total === 0 ? 'var(--text-quiet)'
            : ratio >= 1 ? 'var(--status-pass)'
            : ratio >= 0.6 ? 'var(--status-warn)'
            : 'var(--status-fail)'
          return (
            <div key={g.name} className="uf-card" style={{ padding: '16px 18px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <span className="uf-eyebrow">
                  {g.name}
                </span>
                <span style={{
                  color: grpColor,
                  fontSize: 12,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.2px',
                }}>
                  {passed}/{total}
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.items.map((i) => (
                  <li key={i.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                  }}>
                    <StatusDot status={i.status} />
                    <span style={{
                      color: i.status === 'fail' ? 'var(--status-fail)' : i.status === 'skip' ? 'var(--text-muted)' : 'var(--text-primary)',
                      flex: 1,
                    }}>
                      {i.name}
                      {i.detail && (
                        <span style={{
                          color: 'var(--text-quiet)',
                          fontSize: 11,
                          marginLeft: 6,
                        }}>
                          — {i.detail}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* To-implement list */}
      {failed.length > 0 && (
        <ToImplementSection slug={data.slug} failed={failed} />
      )}
    </div>
  )
}

function buildSinglePrompt(slug: string, group: string, item: CheckItem): string {
  return `Fix this checklist failure in projects/${slug}:

[${group}] ${item.name}${item.detail ? `\nDetail: ${item.detail}` : ''}

Reference docs/full-website-setup.md and CLAUDE.md (in repo root) for the canonical implementation pattern.`
}

function buildBatchPrompt(slug: string, failed: { group: string; item: CheckItem }[]): string {
  const lines = failed.map((f, i) =>
    `${i + 1}. [${f.group}] ${f.item.name}${f.item.detail ? `\n   ${f.item.detail}` : ''}`,
  )
  return `Fix the following checklist failures in projects/${slug}:

${lines.join('\n')}

Reference docs/full-website-setup.md and CLAUDE.md (in repo root) for the canonical implementation patterns. Work through each item, then re-run the monitor to confirm.`
}

function ToImplementSection({ slug, failed }: { slug: string; failed: { group: string; item: CheckItem }[] }) {
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyAll = async () => {
    await navigator.clipboard.writeText(buildBatchPrompt(slug, failed))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1800)
  }
  const copyOne = async (id: string, group: string, item: CheckItem) => {
    await navigator.clipboard.writeText(buildSinglePrompt(slug, group, item))
    setCopiedId(id)
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800)
  }

  return (
    <div className="uf-card" style={{
      padding: '18px 20px',
      background: 'var(--status-fail-bg)',
      boxShadow: '0 0 0 1px var(--status-fail-border)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 14,
      }}>
        <span className="uf-eyebrow" style={{ color: 'var(--status-fail)' }}>
          ✕ To implement ({failed.length})
        </span>
        <button
          onClick={copyAll}
          style={{
            background: copiedAll ? 'var(--status-pass-bg)' : 'rgba(248, 113, 113, 0.14)',
            border: `1px solid ${copiedAll ? 'var(--status-pass-border)' : 'var(--status-fail-border)'}`,
            borderRadius: 'var(--radius-pill)',
            padding: '7px 16px',
            color: copiedAll ? 'var(--status-pass)' : 'var(--status-fail)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-snap)',
          }}
        >
          {copiedAll ? '✓ Copied' : '📋 Copy all as Claude prompt'}
        </button>
      </div>
      <ol style={{ paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
        {failed.map(({ group, item }, idx) => {
          const just = copiedId === item.id
          return (
            <li key={item.id} style={{
              color: 'var(--text-primary)',
              fontSize: 13,
              lineHeight: 1.55,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <span style={{
                color: 'var(--text-quiet)',
                fontSize: 11,
                fontVariantNumeric: 'tabular-nums',
                paddingTop: 2,
                minWidth: 18,
              }}>{idx + 1}.</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 10.5, marginRight: 6, letterSpacing: '0.5px' }}>[{group}]</span>
                {item.name}
                {item.detail && (
                  <span style={{ color: 'var(--text-quiet)', fontSize: 11.5, display: 'block', marginTop: 3 }}>
                    {item.detail}
                  </span>
                )}
              </div>
              <button
                onClick={() => copyOne(item.id, group, item)}
                title="Copy this item as a Claude prompt"
                style={{
                  background: just ? 'var(--status-pass-bg)' : 'transparent',
                  border: `1px solid ${just ? 'var(--status-pass-border)' : 'var(--border-soft)'}`,
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 12px',
                  color: just ? 'var(--status-pass)' : 'var(--text-muted)',
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all var(--transition-snap)',
                }}
              >
                {just ? '✓ copied' : 'copy'}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function StatusDot({ status }: { status: 'pass' | 'fail' | 'skip' }) {
  const glyph = status === 'pass' ? '✓' : status === 'fail' ? '✕' : '–'
  return (
    <span className={`uf-dot uf-dot--${status}`} style={{ marginTop: 1 }}>
      {glyph}
    </span>
  )
}
