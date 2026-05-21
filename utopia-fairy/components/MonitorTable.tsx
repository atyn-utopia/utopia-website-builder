'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/lib/useMediaQuery'

interface GroupSummary {
  name: string
  passed: number
  total: number
}

interface ProjectRow {
  slug: string
  domain: string | null
  productSlug: string | null
  deployUrl: string | null
  passed: number
  total: number
  failedCount: number
  groups: GroupSummary[]
  createdAt: string
}

interface MonitorPayload {
  projects: ProjectRow[]
  totalChecks: number
}

const STATE_COLORS = {
  perfect: { bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.35)', fg: '#4ade80' },
  partial: { bg: 'rgba(249, 169, 106, 0.10)', border: 'rgba(249, 169, 106, 0.30)', fg: '#F9A96A' },
  failing: { bg: 'rgba(248, 113, 113, 0.10)', border: 'rgba(248, 113, 113, 0.30)', fg: '#f87171' },
  empty:   { bg: 'rgba(96, 112, 128, 0.08)', border: 'rgba(96, 112, 128, 0.25)', fg: '#7a8ea3' },
} as const

function tierOf(p: ProjectRow): keyof typeof STATE_COLORS {
  if (p.total === 0) return 'empty'
  const ratio = p.passed / p.total
  if (ratio >= 1) return 'perfect'
  if (ratio >= 0.6) return 'partial'
  return 'failing'
}

export default function MonitorTable() {
  const [data, setData] = useState<MonitorPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/checklist', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: MonitorPayload = await res.json()
        if (mounted) {
          setData(json)
          setError(null)
        }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 30_000)
    return () => { mounted = false; clearInterval(t) }
  }, [])

  const groupNames = data?.projects[0]?.groups.map((g) => g.name) ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Header — fairy gif → title → subtitle → CTA, centered on mobile */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: isMobile ? 'center' : 'flex-start',
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div className="fairy-container fade-in" style={{ marginBottom: 2 }}>
          <div className="fairy-glow" />
          <img
            src="/fairy.gif"
            alt="Utopia Fairy"
            style={{
              width: isMobile ? 64 : 72,
              height: isMobile ? 64 : 72,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(79, 195, 247, 0.4))',
            }}
          />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 30 : 38,
          fontWeight: 400,
          color: 'var(--accent-fairy)',
          letterSpacing: isMobile ? '2px' : '3px',
          margin: 0,
          textShadow: '0 0 30px rgba(129, 212, 250, 0.3)',
        }}>
          Utopia Monitor
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: isMobile ? 12 : 13,
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.3px',
          margin: 0,
          maxWidth: 560,
        }}>
          {loading
            ? 'Reading every project under projects/…'
            : `${data?.projects.length ?? 0} project${(data?.projects.length ?? 0) === 1 ? '' : 's'} · ${data?.totalChecks ?? 0} checks per project · auto-refresh every 30s`}
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => router.push('/new')}
            style={{
              background: 'linear-gradient(135deg, var(--accent-deep), var(--accent-glow))',
              border: 'none',
              borderRadius: 10,
              padding: '10px 22px',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 15px rgba(79, 195, 247, 0.25)',
            }}
          >
            ✦ New Wish
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(248, 113, 113, 0.08)',
          border: '1px solid rgba(248, 113, 113, 0.25)',
          borderRadius: 10,
          padding: '12px 16px',
          color: '#f87171',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Desktop: data table. Mobile: card list. */}
      {isMobile ? (
        <MobileCards
          projects={data?.projects ?? []}
          loading={loading}
          onOpen={(slug) => router.push(`/wish/${slug}`)}
        />
      ) : (
      <div style={{
        background: 'rgba(10, 22, 40, 0.55)',
        border: '1px solid var(--input-border)',
        borderRadius: 14,
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            minWidth: 980,
          }}>
            <thead>
              <tr style={{
                background: 'rgba(79, 195, 247, 0.05)',
                borderBottom: '1px solid var(--input-border)',
              }}>
                <Th>Project</Th>
                <Th>Domain</Th>
                {groupNames.map((g) => <Th key={g} compact>{g}</Th>)}
                <Th align="right">Score</Th>
              </tr>
            </thead>
            <tbody>
              {(data?.projects ?? []).map((p) => {
                const tier = tierOf(p)
                const c = STATE_COLORS[tier]
                return (
                  <tr
                    key={p.slug}
                    onClick={() => router.push(`/wish/${p.slug}`)}
                    style={{
                      borderTop: '1px solid var(--input-border)',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(79, 195, 247, 0.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.slug}</span>
                        {p.deployUrl && (
                          <span style={{ color: 'var(--text-muted)', fontSize: 10, opacity: 0.7 }}>
                            {new URL(p.deployUrl).host}
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 11 }}>
                        {p.domain ?? '—'}
                      </span>
                    </Td>
                    {p.groups.map((g) => (
                      <Td key={g.name} compact align="center">
                        <GroupChip passed={g.passed} total={g.total} />
                      </Td>
                    ))}
                    <Td align="right">
                      <span style={{
                        background: c.bg,
                        border: `1px solid ${c.border}`,
                        color: c.fg,
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.3px',
                        display: 'inline-block',
                        minWidth: 60,
                        textAlign: 'center',
                      }}>
                        {p.passed} / {p.total}
                      </span>
                    </Td>
                  </tr>
                )
              })}

              {!loading && data && data.projects.length === 0 && (
                <tr>
                  <td colSpan={2 + groupNames.length + 1} style={{
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    textAlign: 'center',
                    padding: '32px 16px',
                    opacity: 0.6,
                  }}>
                    No projects with inputs.md found under projects/
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={2 + 1} style={{
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    textAlign: 'center',
                    padding: '32px 16px',
                    opacity: 0.6,
                  }}>
                    ✦ Running checks…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      <p style={{
        color: 'var(--text-muted)',
        fontSize: 11,
        opacity: 0.55,
        fontFamily: 'var(--font-body)',
        margin: 0,
      }}>
        Tip: click any row to see the full breakdown and the list of items still to implement.
      </p>
    </div>
  )
}

function Th({ children, align = 'left', compact = false }: { children: React.ReactNode; align?: 'left' | 'right' | 'center'; compact?: boolean }) {
  return (
    <th style={{
      textAlign: align,
      padding: compact ? '10px 8px' : '12px 14px',
      color: 'var(--text-secondary)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  )
}

function Td({ children, align = 'left', compact = false }: { children: React.ReactNode; align?: 'left' | 'right' | 'center'; compact?: boolean }) {
  return (
    <td style={{
      textAlign: align,
      padding: compact ? '10px 8px' : '12px 14px',
      verticalAlign: 'middle',
    }}>
      {children}
    </td>
  )
}

function MobileCards({ projects, loading, onOpen }: {
  projects: ProjectRow[]
  loading: boolean
  onOpen: (slug: string) => void
}) {
  if (loading && projects.length === 0) {
    return (
      <div style={{
        background: 'rgba(10, 22, 40, 0.55)',
        border: '1px solid var(--input-border)',
        borderRadius: 14,
        padding: '32px 16px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
      }}>
        ✦ Running checks…
      </div>
    )
  }
  if (!loading && projects.length === 0) {
    return (
      <div style={{
        background: 'rgba(10, 22, 40, 0.55)',
        border: '1px solid var(--input-border)',
        borderRadius: 14,
        padding: '32px 16px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
      }}>
        No projects with inputs.md found under projects/
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {projects.map((p) => {
        const tier = tierOf(p)
        const c = STATE_COLORS[tier]
        return (
          <button
            key={p.slug}
            onClick={() => onOpen(p.slug)}
            style={{
              background: 'rgba(10, 22, 40, 0.55)',
              border: '1px solid var(--input-border)',
              borderRadius: 12,
              padding: '14px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
              fontFamily: 'inherit',
              backdropFilter: 'blur(8px)',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
                <span style={{
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {p.slug}
                </span>
                {p.domain && (
                  <span style={{
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.domain}
                  </span>
                )}
              </div>
              <span style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.fg,
                padding: '5px 11px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {p.passed} / {p.total}
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: 6,
            }}>
              {p.groups.map((g) => {
                const r = g.total > 0 ? g.passed / g.total : 0
                const fg = g.total === 0 ? 'var(--text-muted)'
                  : r >= 1 ? '#4ade80'
                  : r >= 0.6 ? '#F9A96A'
                  : '#f87171'
                return (
                  <div key={g.name} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    padding: '6px 8px',
                    background: 'rgba(79, 195, 247, 0.04)',
                    borderRadius: 6,
                  }}>
                    <span style={{
                      color: 'var(--text-muted)',
                      fontSize: 9,
                      letterSpacing: '0.4px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {g.name}
                    </span>
                    <span style={{ color: fg, fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {g.total === 0 ? '—' : `${g.passed}/${g.total}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function GroupChip({ passed, total }: { passed: number; total: number }) {
  if (total === 0) {
    return <span style={{ color: 'var(--text-muted)', opacity: 0.4, fontSize: 11 }}>—</span>
  }
  const ratio = passed / total
  const color = ratio >= 1
    ? '#4ade80'
    : ratio >= 0.6
      ? '#F9A96A'
      : '#f87171'
  return (
    <span style={{
      color,
      fontVariantNumeric: 'tabular-nums',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'var(--font-body)',
    }}>
      {passed}/{total}
    </span>
  )
}
