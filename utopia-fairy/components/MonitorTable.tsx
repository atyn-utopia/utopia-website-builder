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
  company: string | null
  projectCreatedAt: string | null
  passed: number
  total: number
  failedCount: number
  groups: GroupSummary[]
  createdAt: string
}

type SortKey = 'slug' | 'company' | 'domain' | 'created' | 'status' | 'score'
type SortDir = 'asc' | 'desc'

const STATUS_RANK: Record<DeployStatus, number> = {
  live: 3,
  issue: 2,
  building: 1,
  down: 0,
}

function formatCreated(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const diffMs = Date.now() - d.getTime()
  const day = 24 * 60 * 60 * 1000
  const days = Math.floor(diffMs / day)
  if (days < 1) return 'today'
  if (days < 2) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return d.toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })
}

function sortProjects(rows: ProjectRow[], key: SortKey, dir: SortDir): ProjectRow[] {
  const sign = dir === 'asc' ? 1 : -1
  const cmp = (a: ProjectRow, b: ProjectRow): number => {
    switch (key) {
      case 'slug':    return a.slug.localeCompare(b.slug) * sign
      case 'company': return (a.company ?? '').localeCompare(b.company ?? '') * sign
      case 'domain':  return (a.domain ?? '').localeCompare(b.domain ?? '') * sign
      case 'created': {
        const ta = new Date(a.projectCreatedAt ?? a.createdAt).getTime()
        const tb = new Date(b.projectCreatedAt ?? b.createdAt).getTime()
        return (ta - tb) * sign
      }
      case 'status': {
        const sa = STATUS_RANK[deployStatusOf(a).status]
        const sb = STATUS_RANK[deployStatusOf(b).status]
        return (sa - sb) * sign
      }
      case 'score': {
        const ra = a.total === 0 ? 0 : a.passed / a.total
        const rb = b.total === 0 ? 0 : b.passed / b.total
        return (ra - rb) * sign
      }
    }
  }
  return [...rows].sort(cmp)
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

type DeployStatus = 'live' | 'issue' | 'down' | 'building'

interface DeployStatusInfo {
  status: DeployStatus
  label: string
  color: 'pass' | 'warn' | 'fail' | 'skip'
}

function deployStatusOf(p: ProjectRow): DeployStatusInfo {
  // Derive purely from the Deployment group so it works under snapshot mode
  // (where deployUrl can be null because .vercel/project.json is gitignored
  // and not present on the CI scanner). The Deployment group's checks
  // already probe the live URL + live DB connection.
  const deploy = p.groups.find((g) => g.name === 'Deployment')
  if (!deploy || deploy.total === 0) {
    return { status: 'building', label: 'Building', color: 'skip' }
  }
  if (deploy.passed === deploy.total) {
    return { status: 'live', label: 'Live', color: 'pass' }
  }
  if (deploy.passed === 0) {
    return { status: 'building', label: 'Building', color: 'skip' }
  }
  // At least one Deployment check passes but not all — usually means the
  // live site is up but reading from the config fallback instead of the DB.
  return { status: 'issue', label: 'Issue', color: 'warn' }
}

export default function MonitorTable() {
  const [data, setData] = useState<MonitorPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('created')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const router = useRouter()
  const isMobile = useIsMobile()

  const toggleSort = (key: SortKey) => {
    setSortKey((prev) => {
      if (prev !== key) {
        // Switch to a sensible default direction for the new column
        setSortDir(key === 'slug' || key === 'company' || key === 'domain' ? 'asc' : 'desc')
        return key
      }
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      return prev
    })
  }

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

  const projectCount = data?.projects.length ?? 0
  const liveCount = (data?.projects ?? []).filter((p) => deployStatusOf(p).status === 'live').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%' }}>
      {/* Header — brand mark + name + stats + CTA */}
      <header style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: 16,
        paddingBottom: 20,
        borderBottom: '1px solid var(--border-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/utopia-wizard-logo.png"
            alt="Utopia Wizard"
            className="uf-logo"
            style={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <h1 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: isMobile ? 22 : 26,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.1,
            }}>
              Utopia Wizard
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 12.5,
              margin: 0,
              lineHeight: 1.3,
            }}>
              Website Builder &amp; Monitor
            </p>
            <p style={{
              color: 'var(--text-quiet)',
              fontSize: 11.5,
              margin: '4px 0 0',
              lineHeight: 1.4,
            }}>
              {loading
                ? 'Reading every project under projects/…'
                : `${projectCount} project${projectCount === 1 ? '' : 's'} · ${liveCount} live · ${data?.totalChecks ?? 0} checks per project`}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/new')}
          className="uf-btn-brand"
        >
          ✦ New project
        </button>
      </header>

      {error && (
        <div className="uf-card" style={{ padding: '12px 16px', color: 'var(--status-fail)', fontSize: 13 }}>
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
      <div className="uf-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            minWidth: 980,
          }}>
            <thead>
              <tr style={{
                background: 'var(--brand)',
                borderBottom: '1px solid var(--brand-deep)',
              }}>
                <Th onBrand onSort={() => toggleSort('slug')} sortDir={sortKey === 'slug' ? sortDir : null}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/utopia-wizard-bg.png"
                      alt=""
                      style={{ width: 16, height: 16, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                    />
                    Project
                  </span>
                </Th>
                <Th onBrand onSort={() => toggleSort('company')} sortDir={sortKey === 'company' ? sortDir : null}>Company</Th>
                <Th onBrand onSort={() => toggleSort('domain')} sortDir={sortKey === 'domain' ? sortDir : null}>Domain</Th>
                <Th onBrand onSort={() => toggleSort('created')} sortDir={sortKey === 'created' ? sortDir : null}>Created</Th>
                <Th onBrand align="center" onSort={() => toggleSort('status')} sortDir={sortKey === 'status' ? sortDir : null}>Status</Th>
                {groupNames.map((g) => <Th key={g} compact onBrand align="center">{g}</Th>)}
                <Th onBrand align="center" onSort={() => toggleSort('score')} sortDir={sortKey === 'score' ? sortDir : null}>Score</Th>
              </tr>
            </thead>
            <tbody>
              {sortProjects(data?.projects ?? [], sortKey, sortDir).map((p) => {
                const tier = tierOf(p)
                const scoreClass = tier === 'perfect' ? 'uf-score--pass'
                  : tier === 'partial' ? 'uf-score--warn'
                  : tier === 'failing' ? 'uf-score--fail'
                  : 'uf-score--neutral'
                return (
                  <tr
                    key={p.slug}
                    onClick={() => router.push(`/wish/${p.slug}`)}
                    style={{
                      borderTop: '1px solid var(--border-soft)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-snap)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }}>{p.slug}</span>
                        {p.deployUrl && (
                          <span style={{ color: 'var(--text-quiet)', fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>
                            {new URL(p.deployUrl).host}
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span style={{ color: p.company ? 'var(--text-secondary)' : 'var(--text-quiet)', fontSize: 12 }}>
                        {p.company ?? '—'}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                        {p.domain ?? '—'}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCreated(p.projectCreatedAt ?? p.createdAt)}
                      </span>
                    </Td>
                    <Td align="center">
                      <StatusPill info={deployStatusOf(p)} />
                    </Td>
                    {p.groups.map((g) => (
                      <Td key={g.name} compact align="center">
                        <GroupChip passed={g.passed} total={g.total} />
                      </Td>
                    ))}
                    <Td align="center">
                      <span className={`uf-score ${scoreClass}`} style={{ fontSize: 12, padding: '5px 12px' }}>
                        {p.passed} / {p.total}
                      </span>
                    </Td>
                  </tr>
                )
              })}

              {!loading && data && data.projects.length === 0 && (
                <tr>
                  <td colSpan={5 + groupNames.length + 1} style={{
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
                  <td colSpan={5 + groupNames.length + 1} style={{
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
        color: 'var(--text-quiet)',
        fontSize: 12,
        margin: 0,
        textAlign: 'center',
      }}>
        Click any project for the full breakdown and what's still to implement.
      </p>
    </div>
  )
}

function Th({
  children,
  align = 'left',
  compact = false,
  onBrand = false,
  onSort,
  sortDir = null,
}: {
  children: React.ReactNode
  align?: 'left' | 'right' | 'center'
  compact?: boolean
  onBrand?: boolean
  onSort?: () => void
  sortDir?: 'asc' | 'desc' | null
}) {
  const clickable = typeof onSort === 'function'
  return (
    <th
      onClick={clickable ? onSort : undefined}
      style={{
        textAlign: align,
        padding: compact ? '11px 8px' : '12px 14px',
        color: onBrand ? 'rgba(255, 255, 255, 0.92)' : 'var(--text-muted)',
        fontSize: 10.5,
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: clickable ? 'pointer' : 'default',
        userSelect: clickable ? 'none' : 'auto',
      }}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        opacity: !clickable || sortDir ? 1 : 0.92,
      }}>
        {children}
        {clickable && (
          <span style={{
            fontSize: 9,
            lineHeight: 1,
            opacity: sortDir ? 1 : 0.45,
            color: 'inherit',
          }}>
            {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </span>
    </th>
  )
}

function Td({ children, align = 'left', compact = false }: { children: React.ReactNode; align?: 'left' | 'right' | 'center'; compact?: boolean }) {
  return (
    <td style={{
      textAlign: align,
      padding: compact ? '12px 8px' : '12px 14px',
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
      <div className="uf-card" style={{
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
      <div className="uf-card" style={{
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {projects.map((p) => {
        const tier = tierOf(p)
        const scoreClass = tier === 'perfect' ? 'uf-score--pass'
          : tier === 'partial' ? 'uf-score--warn'
          : tier === 'failing' ? 'uf-score--fail'
          : 'uf-score--neutral'
        return (
          <button
            key={p.slug}
            onClick={() => onOpen(p.slug)}
            className="uf-card uf-card--clickable"
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              textAlign: 'left',
              color: 'inherit',
              fontFamily: 'inherit',
              width: '100%',
              border: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
                <span style={{
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {p.slug}
                </span>
                {p.company && (
                  <span style={{
                    color: 'var(--text-secondary)',
                    fontSize: 11.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.company}
                  </span>
                )}
                {p.domain && (
                  <span style={{
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.domain}
                  </span>
                )}
                <span style={{
                  color: 'var(--text-quiet)',
                  fontSize: 10.5,
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 2,
                }}>
                  created {formatCreated(p.projectCreatedAt ?? p.createdAt)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
                <span className={`uf-score ${scoreClass}`}>
                  {p.passed} / {p.total}
                </span>
                <StatusPill info={deployStatusOf(p)} />
              </div>
            </div>
            <StatusBar groups={p.groups} />
          </button>
        )
      })}
    </div>
  )
}

function StatusPill({ info }: { info: DeployStatusInfo }) {
  const glyph = info.color === 'pass' ? '●' : info.color === 'warn' ? '◐' : info.color === 'fail' ? '○' : '✦'
  return (
    <span className={`uf-pill uf-pill--${info.color === 'pass' ? 'pass' : info.color === 'warn' ? 'warn' : info.color === 'fail' ? 'fail' : 'neutral'}`}>
      <span style={{ fontSize: 8, lineHeight: 1 }}>{glyph}</span>
      {info.label}
    </span>
  )
}

function StatusBar({ groups }: { groups: GroupSummary[] }) {
  // Find the highest-priority failing groups (worst ratio first) to surface
  // as a tiny inline summary above the bar. Caps at 3 to keep the card tight.
  const ranked = groups
    .map((g) => ({ ...g, ratio: g.total > 0 ? g.passed / g.total : 1 }))
    .sort((a, b) => a.ratio - b.ratio)
  const failing = ranked.filter((g) => g.ratio < 0.6 && g.total > 0).slice(0, 3)
  const warning = ranked.filter((g) => g.ratio >= 0.6 && g.ratio < 1).slice(0, 3 - failing.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${groups.length}, 1fr)`,
        gap: 3,
        height: 6,
      }} aria-label="group statuses">
        {groups.map((g) => {
          const r = g.total > 0 ? g.passed / g.total : 0
          const bg = g.total === 0 ? 'var(--status-skip-bg)'
            : r >= 1 ? 'var(--status-pass)'
            : r >= 0.6 ? 'var(--status-warn)'
            : 'var(--status-fail)'
          const fade = g.total === 0 ? 0.25
            : r >= 1 ? 0.75
            : r >= 0.6 ? 0.85
            : 0.9
          return (
            <span
              key={g.name}
              title={`${g.name} · ${g.total === 0 ? '—' : `${g.passed}/${g.total}`}`}
              style={{
                background: bg,
                opacity: fade,
                borderRadius: 2,
              }}
            />
          )
        })}
      </div>
      {(failing.length > 0 || warning.length > 0) && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          fontSize: 10.5,
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.3px',
        }}>
          {failing.map((g) => (
            <span key={g.name} style={{
              color: 'var(--status-fail)',
              background: 'var(--status-fail-bg)',
              border: '1px solid var(--status-fail-border)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              whiteSpace: 'nowrap',
            }}>
              {g.name.toLowerCase()} {g.passed}/{g.total}
            </span>
          ))}
          {warning.map((g) => (
            <span key={g.name} style={{
              color: 'var(--status-warn)',
              background: 'var(--status-warn-bg)',
              border: '1px solid var(--status-warn-border)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              whiteSpace: 'nowrap',
            }}>
              {g.name.toLowerCase()} {g.passed}/{g.total}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function GroupChip({ passed, total }: { passed: number; total: number }) {
  if (total === 0) {
    return <span style={{ color: 'var(--text-quiet)', fontSize: 11 }}>—</span>
  }
  const ratio = passed / total
  const color = ratio >= 1
    ? 'var(--status-pass)'
    : ratio >= 0.6
      ? 'var(--status-warn)'
      : 'var(--status-fail)'
  return (
    <span style={{
      color,
      fontVariantNumeric: 'tabular-nums',
      fontSize: 12.5,
      fontWeight: 700,
      fontFamily: 'var(--font-sans)',
      letterSpacing: '0.2px',
    }}>
      {passed}/{total}
    </span>
  )
}
