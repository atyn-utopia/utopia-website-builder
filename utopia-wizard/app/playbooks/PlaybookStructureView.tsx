'use client'

import PlaybookStyles from '../playbook/PlaybookStyles'

interface Doc { label: string; url: string }
interface Unit { name: string; owner?: string; purpose: string; docs: Doc[]; maturity?: number }
interface Layer { title: string; intro: string; units: Unit[]; phase?: string }
export interface Structure {
  title: string
  repo: string
  sourcePath: string
  layers: Layer[]
  filesRead: string[]
}

const clamp = (t: string, n: number) => { const s = (t || '').replace(/\n+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s }

type Band = 'mature' | 'partial' | 'gap'
const band = (v: number): Band => (v >= 75 ? 'mature' : v >= 45 ? 'partial' : 'gap')
const BAND: Record<Band, { fg: string; emoji: string }> = {
  mature: { fg: 'var(--status-pass)', emoji: '🟢' },
  partial: { fg: 'var(--status-warn)', emoji: '🟡' },
  gap: { fg: 'var(--status-fail)', emoji: '🔴' },
}

function MaturityBar({ value }: { value: number }) {
  return <div className="pb-bar" title={`${value}% maturity`}><div className="pb-bar-fill" style={{ width: `${value}%`, background: BAND[band(value)].fg }} /></div>
}

function DocPill({ doc }: { doc: Doc }) {
  return <a className="pb-doc" href={doc.url} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> {doc.label}</a>
}

export default function PlaybookStructureView({ structure, owner }: { structure: Structure; owner: string }) {
  const { title, repo, sourcePath, layers, filesRead } = structure
  const allUnits = layers.flatMap((l) => l.units)
  const totalUnits = allUnits.length
  const mats = allUnits.map((u) => u.maturity).filter((m): m is number => typeof m === 'number')
  const hasMaturity = mats.length > 0
  const avg = hasMaturity ? Math.round(mats.reduce((a, m) => a + m, 0) / mats.length) : 0
  const counts = { mature: 0, partial: 0, gap: 0 } as Record<Band, number>
  for (const m of mats) counts[band(m)]++
  const fileUrl = `https://github.com/${repo}/blob/HEAD/${sourcePath}`

  return (
    <div data-playbook-root>
      <PlaybookStyles />

      <header className="pb-header">
        <div>
          <h1 className="pb-title">📘 {title || repo}</h1>
          <p className="pb-tagline">
            Assembled from <code style={{ fontFamily: 'var(--font-mono)' }}>{sourcePath}</code> + {filesRead.length - 1} referenced files ·
            {' '}{layers.length} layers · {totalUnits} units.
          </p>
          <div className="pb-source">
            <a className="pb-doc" href={fileUrl} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> {repo}/{sourcePath}</a>
            <a className="pb-doc" href={`https://github.com/${owner}`} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> @{owner}</a>
          </div>
        </div>

        {hasMaturity && (
          <div className="pb-overview">
            <div className="pb-bigscore">
              <span className="pb-bigscore-num">{avg}%</span>
              <span className="pb-bigscore-lbl">avg maturity</span>
            </div>
            <div className="pb-counts">
              <div className="pb-count" style={{ color: BAND.mature.fg }}><strong>{counts.mature}</strong> 🟢 mature</div>
              <div className="pb-count" style={{ color: BAND.partial.fg }}><strong>{counts.partial}</strong> 🟡 partial</div>
              <div className="pb-count" style={{ color: BAND.gap.fg }}><strong>{counts.gap}</strong> 🔴 gap</div>
            </div>
          </div>
        )}
      </header>

      {hasMaturity && (
        <div className="pb-legend">
          <span className="pb-legend-lbl">Maturity bands</span>
          <span><b style={{ color: BAND.mature.fg }}>🟢 Mature</b> ≥ 75%</span>
          <span><b style={{ color: BAND.partial.fg }}>🟡 Partial</b> 45–74%</span>
          <span><b style={{ color: BAND.gap.fg }}>🔴 Gap</b> &lt; 45%</span>
        </div>
      )}

      {layers.map((layer, i) => {
        const mats = layer.units.map((u) => u.maturity).filter((m): m is number => typeof m === 'number')
        const lavg = mats.length ? Math.round(mats.reduce((a, m) => a + m, 0) / mats.length) : null
        return (
          <section className="pb-layer" key={i}>
            <div className="pb-layer-head">
              <div className="pb-layer-id">L{i + 1}</div>
              <div className="pb-layer-meta">
                <div className="pb-layer-titlerow">
                  <h2 className="pb-layer-name">{layer.title}</h2>
                  {layer.phase && <span className="pb-phase" style={{ color: 'var(--brand-glow, var(--brand))', borderColor: 'var(--brand-border)' }}>{layer.phase}</span>}
                  <span className="pb-layer-count">{layer.units.length} unit{layer.units.length === 1 ? '' : 's'}</span>
                </div>
                {layer.intro && <p className="pb-layer-sub">{clamp(layer.intro, 180)}</p>}
              </div>
              {lavg != null && (
                <div className="pb-layer-score">
                  <span className="pb-layer-pct" style={{ color: BAND[band(lavg)].fg }}>{lavg}%</span>
                  <MaturityBar value={lavg} />
                </div>
              )}
            </div>
            <div className="pb-grid">
              {layer.units.map((u, j) => {
                const c = typeof u.maturity === 'number' ? BAND[band(u.maturity)] : null
                return (
                  <div className="pb-unit" key={j}>
                    <div className="pb-unit-top">
                      <div className="pb-unit-head">
                        <span className="pb-dot" style={{ background: c ? c.fg : 'var(--brand-glow, var(--brand))' }} aria-hidden="true" />
                        <h3 className="pb-unit-name">{u.name}</h3>
                      </div>
                      {u.owner && <span className="pb-owner" title={`Owner: ${u.owner}`}>{u.owner}</span>}
                    </div>
                    {typeof u.maturity === 'number' && c && (
                      <div className="pb-unit-meter">
                        <MaturityBar value={u.maturity} />
                        <span className="pb-pct" style={{ color: c.fg }}>{c.emoji} {u.maturity}%</span>
                      </div>
                    )}
                    {u.purpose && <p className="pb-purpose">{clamp(u.purpose, 160)}</p>}
                    {u.docs.length > 0 && (
                      <div className="pb-docs">
                        {u.docs.slice(0, 6).map((d, di) => <DocPill key={di} doc={d} />)}
                      </div>
                    )}
                    {u.purpose && u.purpose.length > 160 && (
                      <details className="pb-details">
                        <summary className="pb-summary">More</summary>
                        <p className="pb-purpose" style={{ marginTop: 6 }}>{u.purpose}</p>
                      </details>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
