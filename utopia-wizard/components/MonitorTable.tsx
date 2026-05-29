'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/lib/useMediaQuery'
import DeleteProjectModal from './DeleteProjectModal'
import TrashIcon from './icons/TrashIcon'
import SyncButton from './SyncButton'

interface GroupSummary {
  name: string
  passed: number
  total: number
  // Surfaced by the API so the UI can colour each group "passed-aware" —
  // i.e. green when nothing is failing even if some checks are skipped.
  // Optional for backwards compatibility with cached snapshot responses.
  failed?: number
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

// Only completed rows get colour. Partial/failing/empty stay neutral so the
// green stands out — the score pill + group dots still signal the failure mode
// individually, but the row chrome doesn't compete for attention.
const ROW_TINT = {
  perfect: 'rgba(74, 222, 128, 0.08)',
  partial: 'transparent',
  failing: 'transparent',
  empty:   'transparent',
} as const
const ROW_HOVER = {
  perfect: 'rgba(74, 222, 128, 0.14)',
  partial: 'var(--surface-hover)',
  failing: 'var(--surface-hover)',
  empty:   'var(--surface-hover)',
} as const

// Same "failed-aware" logic as tierOf() but for a single group — skipped
// items don't drag the colour into orange/red. Used by GroupChip + StatusBar.
function groupTier(g: GroupSummary): 'perfect' | 'partial' | 'failing' | 'empty' {
  if (g.total === 0) return 'empty'
  // Fall back to the old `passed/total` ratio if `failed` isn't in the payload
  // (older API responses or stale caches).
  if (g.failed == null) {
    const r = g.passed / g.total
    if (r >= 1) return 'perfect'
    if (r >= 0.6) return 'partial'
    return 'failing'
  }
  if (g.failed === 0) return 'perfect'
  const denom = g.passed + g.failed
  if (denom === 0) return 'empty'
  const ratio = g.passed / denom
  if (ratio >= 0.6) return 'partial'
  return 'failing'
}

function tierOf(p: ProjectRow): keyof typeof STATE_COLORS {
  if (p.total === 0) return 'empty'
  // Skipped checks (Supabase env missing, no CircleFlag, no price keys, etc.)
  // shouldn't dilute the score — they're "not applicable", not "broken". If
  // nothing is actually failing, the row is green even when passed < total.
  if (p.failedCount === 0) return 'perfect'
  const denom = p.passed + p.failedCount
  if (denom === 0) return 'empty'
  const ratio = p.passed / denom
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

type RescanState = 'idle' | 'triggering' | 'running' | 'success' | 'error'

export default function MonitorTable() {
  const [data, setData] = useState<MonitorPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('created')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [rescan, setRescan] = useState<RescanState>('idle')
  const [rescanMsg, setRescanMsg] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
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

  const refetch = async () => {
    try {
      const res = await fetch('/api/checklist', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: MonitorPayload = await res.json()
      setData(json)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load')
    }
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/checklist', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: MonitorPayload = await res.json()
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
  }, [])

  const triggerRescan = async () => {
    if (rescan === 'triggering' || rescan === 'running') return
    setRescan('triggering')
    setRescanMsg('Triggering GitHub Actions…')
    try {
      const res = await fetch('/api/rescan', { method: 'POST' })
      const body = await res.json()
      if (!res.ok || !body.ok) {
        setRescan('error')
        setRescanMsg(body.error ?? `HTTP ${res.status}`)
        return
      }
      setRescan('running')
      setRescanMsg('Scan running on GitHub Actions…')

      // Poll the latest workflow run status. Scans typically finish in ~60-90s.
      const startedAt = Date.now()
      const deadline = startedAt + 5 * 60 * 1000 // give up after 5 min
      const poll = async () => {
        if (Date.now() > deadline) {
          setRescan('error')
          setRescanMsg('Timed out waiting for the scan to finish. Check Actions tab.')
          return
        }
        try {
          const sr = await fetch('/api/rescan', { cache: 'no-store' })
          const sb = await sr.json()
          if (sb?.run?.status === 'completed') {
            if (sb.run.conclusion === 'success') {
              setRescan('success')
              setRescanMsg('Scan complete — table updated.')
              await refetch()
              setTimeout(() => setRescan('idle'), 4000)
              return
            }
            setRescan('error')
            setRescanMsg(`Scan ${sb.run.conclusion ?? 'finished'} — check Actions tab.`)
            return
          }
        } catch { /* swallow and keep polling */ }
        setTimeout(poll, 4000)
      }
      setTimeout(poll, 5000)
    } catch (e) {
      setRescan('error')
      setRescanMsg(e instanceof Error ? e.message : 'failed')
    }
  }

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
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
          // On mobile we span the full header width and use `order` to flip
          // New Project ahead of Rescan so the primary action sits on the
          // left, closer to the thumb.
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'flex-start' : 'flex-end',
        }}>
          <SyncButton />
          <button
            onClick={triggerRescan}
            disabled={rescan === 'triggering' || rescan === 'running'}
            style={{
              background: 'transparent',
              color: rescan === 'error' ? 'var(--status-fail)'
                : rescan === 'success' ? 'var(--status-pass)'
                : 'var(--text-secondary)',
              border: `1px solid ${
                rescan === 'error' ? 'var(--status-fail-border)'
                : rescan === 'success' ? 'var(--status-pass-border)'
                : 'var(--border-soft)'
              }`,
              borderRadius: 'var(--radius-pill)',
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.2,
              cursor: rescan === 'triggering' || rescan === 'running' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition-snap)',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              order: isMobile ? 2 : 1,
            }}
            title={rescanMsg ?? 'Trigger an immediate GitHub Actions scan'}
          >
            <span style={{
              display: 'inline-block',
              width: 6, height: 6, borderRadius: '50%',
              background: rescan === 'running' ? 'var(--status-warn)'
                : rescan === 'success' ? 'var(--status-pass)'
                : rescan === 'error' ? 'var(--status-fail)'
                : 'var(--text-quiet)',
              animation: rescan === 'running' || rescan === 'triggering' ? 'pulseDot 1.6s ease-in-out infinite' : 'none',
            }} />
            {rescan === 'triggering' ? 'Triggering…'
              : rescan === 'running'    ? 'Scanning…'
              : rescan === 'success'    ? 'Scan Complete'
              : rescan === 'error'      ? 'Rescan Failed'
              : 'Rescan Now'}
          </button>
          <button
            onClick={() => router.push('/new')}
            className="uf-btn-brand"
            style={{ lineHeight: 1.2, order: isMobile ? 1 : 2 }}
          >
            ✦ New Project
          </button>
        </div>
      </header>
      <style jsx>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>

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
          onDelete={(slug) => setDeleteTarget(slug)}
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
                <Th onBrand align="right" compact>#</Th>
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
                <Th onBrand onSort={() => toggleSort('created')} sortDir={sortKey === 'created' ? sortDir : null}>Created</Th>
                <Th onBrand align="center" onSort={() => toggleSort('status')} sortDir={sortKey === 'status' ? sortDir : null}>Status</Th>
                {groupNames.map((g) => <Th key={g} compact onBrand align="center">{g}</Th>)}
                <Th onBrand align="center" onSort={() => toggleSort('score')} sortDir={sortKey === 'score' ? sortDir : null}>Score</Th>
                <Th onBrand align="center" compact><span style={{ opacity: 0 }}>Del</span></Th>
              </tr>
            </thead>
            <tbody>
              {sortProjects(data?.projects ?? [], sortKey, sortDir).map((p, idx) => {
                const tier = tierOf(p)
                const scoreClass = tier === 'perfect' ? 'uf-score--pass'
                  : tier === 'partial' ? 'uf-score--warn'
                  : tier === 'failing' ? 'uf-score--fail'
                  : 'uf-score--neutral'
                const rowBg = ROW_TINT[tier]
                const rowHover = ROW_HOVER[tier]
                return (
                  <tr
                    key={p.slug}
                    onClick={() => router.push(`/wish/${p.slug}`)}
                    style={{
                      borderTop: '1px solid var(--border-soft)',
                      cursor: 'pointer',
                      background: rowBg,
                      transition: 'background var(--transition-snap)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = rowHover }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = rowBg }}
                  >
                    <Td align="right" compact>
                      <span style={{
                        color: 'var(--text-quiet)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11.5,
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {idx + 1}
                      </span>
                    </Td>
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
                      <span style={{ color: 'var(--text-muted)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCreated(p.projectCreatedAt ?? p.createdAt)}
                      </span>
                    </Td>
                    <Td align="center">
                      <StatusPill info={deployStatusOf(p)} />
                    </Td>
                    {p.groups.map((g) => (
                      <Td key={g.name} compact align="center">
                        <GroupChip group={g} />
                      </Td>
                    ))}
                    <Td align="center">
                      <span className={`uf-score ${scoreClass}`} style={{ fontSize: 12, padding: '5px 12px' }}>
                        {p.passed} / {p.total}
                      </span>
                    </Td>
                    <Td align="center" compact>
                      <button
                        type="button"
                        title={`Delete ${p.slug}`}
                        aria-label={`Delete ${p.slug}`}
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(p.slug) }}
                        style={{
                          background: 'transparent',
                          border: '1px solid transparent',
                          borderRadius: 'var(--radius-pill)',
                          width: 28,
                          height: 28,
                          padding: 0,
                          color: 'var(--text-quiet)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          lineHeight: 1,
                          transition: 'all var(--transition-snap)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--status-fail)'
                          e.currentTarget.style.borderColor = 'var(--status-fail-border)'
                          e.currentTarget.style.background = 'var(--status-fail-bg)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-quiet)'
                          e.currentTarget.style.borderColor = 'transparent'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </Td>
                  </tr>
                )
              })}

              {!loading && data && data.projects.length === 0 && (
                <tr>
                  <td colSpan={5 + groupNames.length + 2} style={{
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
                  <td colSpan={5 + groupNames.length + 2} style={{
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

      {deleteTarget && (
        <DeleteProjectModal
          slug={deleteTarget}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => { setDeleteTarget(null); refetch() }}
        />
      )}
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
        gap: 6,
      }}>
        {children}
        {clickable && (
          <span aria-hidden="true" style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 10,
            lineHeight: 1,
            letterSpacing: 0,
            fontFamily: 'var(--font-sans)',
          }}>
            <span style={{
              opacity: sortDir === 'asc' ? 1 : 0.32,
              fontWeight: sortDir === 'asc' ? 700 : 400,
              color: 'inherit',
            }}>↑</span>
            <span style={{
              opacity: sortDir === 'desc' ? 1 : 0.32,
              fontWeight: sortDir === 'desc' ? 700 : 400,
              color: 'inherit',
              marginLeft: -1,
            }}>↓</span>
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

function MobileCards({ projects, loading, onOpen, onDelete }: {
  projects: ProjectRow[]
  loading: boolean
  onOpen: (slug: string) => void
  onDelete: (slug: string) => void
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
        const cardTint = ROW_TINT[tier]
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
              background: cardTint !== 'transparent' ? cardTint : undefined,
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
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Delete ${p.slug}`}
                  title={`Delete ${p.slug}`}
                  onClick={(e) => { e.stopPropagation(); onDelete(p.slug) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      onDelete(p.slug)
                    }
                  }}
                  style={{
                    color: 'var(--text-quiet)',
                    background: 'transparent',
                    border: '1px solid var(--border-soft)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px 10px',
                    fontSize: 11,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <TrashIcon size={12} />
                  delete
                </span>
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
  // Use failed-aware tiers so a group with skips but 0 failures isn't flagged
  // as warning/failing.
  const ranked = groups.map((g) => ({ g, tier: groupTier(g) }))
  const failing = ranked.filter((r) => r.tier === 'failing').slice(0, 3)
  const warning = ranked.filter((r) => r.tier === 'partial').slice(0, 3 - failing.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${groups.length}, 1fr)`,
        gap: 3,
        height: 6,
      }} aria-label="group statuses">
        {groups.map((g) => {
          const tier = groupTier(g)
          const bg = tier === 'empty' ? 'var(--status-skip-bg)'
            : tier === 'perfect' ? 'var(--status-pass)'
            : tier === 'partial' ? 'var(--status-warn)'
            : 'var(--status-fail)'
          const fade = tier === 'empty' ? 0.25
            : tier === 'perfect' ? 0.75
            : tier === 'partial' ? 0.85
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
          {failing.map(({ g }) => (
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
          {warning.map(({ g }) => (
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

function GroupChip({ group }: { group: GroupSummary }) {
  if (group.total === 0) {
    return <span style={{ color: 'var(--text-quiet)', fontSize: 11 }}>—</span>
  }
  const tier = groupTier(group)
  const color = tier === 'perfect' ? 'var(--status-pass)'
    : tier === 'partial' ? 'var(--status-warn)'
    : tier === 'failing' ? 'var(--status-fail)'
    : 'var(--text-quiet)'
  return (
    <span style={{
      color,
      fontVariantNumeric: 'tabular-nums',
      fontSize: 12.5,
      fontWeight: 700,
      fontFamily: 'var(--font-sans)',
      letterSpacing: '0.2px',
    }}>
      {group.passed}/{group.total}
    </span>
  )
}
