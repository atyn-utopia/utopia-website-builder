import {
  LAYERS,
  STATS,
  SPEC_FIELDS,
  AGENT_SUMMARY,
  band,
  layerAvg,
  GH_BASE,
  type Band,
  type Layer,
  type Unit,
  type DocLink,
} from '@/lib/playbookData'
import AgentFilter from '@/components/AgentFilter'
import PlaybookStyles from './PlaybookStyles'

export const metadata = {
  title: 'Build Playbook · Utopia Wizard',
  description:
    'The website-builder system decomposed into layers, units, owners and maturity — traceable to the source markdown.',
}

const BAND_COLOR: Record<Band, { fg: string; bg: string; border: string; emoji: string; label: string }> = {
  mature: { fg: 'var(--status-pass)', bg: 'var(--status-pass-bg)', border: 'var(--status-pass-border)', emoji: '🟢', label: 'Mature' },
  partial: { fg: 'var(--status-warn)', bg: 'var(--status-warn-bg)', border: 'var(--status-warn-border)', emoji: '🟡', label: 'Partial' },
  gap: { fg: 'var(--status-fail)', bg: 'var(--status-fail-bg)', border: 'var(--status-fail-border)', emoji: '🔴', label: 'Gap' },
}

const PHASE_COLOR: Record<Layer['phase'], string> = {
  BUILD: 'var(--brand-glow)',
  DATA: 'var(--gold)',
  SHIP: 'var(--status-pass)',
}

function DocPill({ doc }: { doc: DocLink }) {
  return (
    <a className="pb-doc" href={GH_BASE + doc.path} target="_blank" rel="noopener noreferrer">
      <span aria-hidden="true">↗</span> {doc.label}
    </a>
  )
}

function MaturityBar({ value }: { value: number }) {
  const c = BAND_COLOR[band(value)].fg
  return (
    <div className="pb-bar" title={`${value}% maturity`}>
      <div className="pb-bar-fill" style={{ width: `${value}%`, background: c }} />
    </div>
  )
}

function UnitCard({ unit }: { unit: Unit }) {
  const b = band(unit.maturity)
  const c = BAND_COLOR[b]
  return (
    <div className="pb-unit" data-owner={unit.owner}>
      <div className="pb-unit-top">
        <div className="pb-unit-head">
          <span className="pb-dot" style={{ background: c.fg }} aria-hidden="true" />
          <h3 className="pb-unit-name">{unit.name}</h3>
        </div>
        <a
          className="pb-owner"
          href={GH_BASE + unit.ownerPath}
          target="_blank"
          rel="noopener noreferrer"
          title={`${unit.owner} — open agent definition`}
        >
          {unit.owner}
        </a>
      </div>

      <div className="pb-unit-meter">
        <MaturityBar value={unit.maturity} />
        <span className="pb-pct" style={{ color: c.fg }}>
          {c.emoji} {unit.maturity}%
        </span>
      </div>

      <p className="pb-purpose">{unit.spec.purpose}</p>

      <div className="pb-docs">
        {unit.docs.map((d) => (
          <DocPill key={d.label + d.path} doc={d} />
        ))}
      </div>

      <details className="pb-details">
        <summary className="pb-summary">Full 12-field spec</summary>
        <dl className="pb-spec">
          {SPEC_FIELDS.map((f) => (
            <div className="pb-spec-row" key={f.key}>
              <dt>{f.label}</dt>
              <dd>{unit.spec[f.key] || '—'}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}

function LayerSection({ layer }: { layer: Layer }) {
  const avg = layerAvg(layer)
  const c = BAND_COLOR[band(avg)]
  return (
    <section className="pb-layer">
      <div className="pb-layer-head">
        <div className="pb-layer-id">L{layer.id}</div>
        <div className="pb-layer-meta">
          <div className="pb-layer-titlerow">
            <h2 className="pb-layer-name">{layer.name}</h2>
            <span className="pb-phase" style={{ color: PHASE_COLOR[layer.phase], borderColor: PHASE_COLOR[layer.phase] }}>
              {layer.phase}
            </span>
            <span className="pb-layer-count">{layer.units.length} units</span>
          </div>
          <p className="pb-layer-sub">{layer.subtitle}</p>
        </div>
        <div className="pb-layer-score">
          <span className="pb-layer-pct" style={{ color: c.fg }}>{avg}%</span>
          <MaturityBar value={avg} />
        </div>
      </div>
      <div className="pb-grid">
        {layer.units.map((u) => (
          <UnitCard key={u.name} unit={u} />
        ))}
      </div>
    </section>
  )
}

export default function PlaybookPage() {
  return (
    <main className="fade-in" data-playbook-root style={{ width: '100%', maxWidth: 1400, margin: '0 auto' }}>
      <PlaybookStyles />

      {/* Header */}
      <header className="pb-header">
        <div>
          <h1 className="pb-title">📘 Build Playbook</h1>
          <p className="pb-tagline">
            The Utopia website-builder system as {STATS.totalLayers} layers · {STATS.totalUnits} units —
            each with an owner, a maturity score, and a link to its source markdown.
          </p>
          <div className="pb-source">
            <DocPill doc={{ label: 'CLAUDE.md', path: 'CLAUDE.md' }} />
            <DocPill doc={{ label: 'Build flow', path: 'docs/website-building-flow.md' }} />
            <DocPill doc={{ label: 'Full setup', path: 'docs/full-website-setup.md' }} />
            <DocPill doc={{ label: 'Guardrails (101)', path: 'docs/guardrails.html' }} />
          </div>
        </div>

        <div className="pb-overview">
          <div className="pb-bigscore">
            <span className="pb-bigscore-num">{STATS.avg}%</span>
            <span className="pb-bigscore-lbl">avg maturity</span>
          </div>
          <div className="pb-counts">
            <div className="pb-count" style={{ color: BAND_COLOR.mature.fg }}>
              <strong>{STATS.mature}</strong> 🟢 mature
            </div>
            <div className="pb-count" style={{ color: BAND_COLOR.partial.fg }}>
              <strong>{STATS.partial}</strong> 🟡 partial
            </div>
            <div className="pb-count" style={{ color: BAND_COLOR.gap.fg }}>
              <strong>{STATS.gap}</strong> 🔴 gap
            </div>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="pb-legend">
        <span className="pb-legend-lbl">Maturity bands</span>
        <span><b style={{ color: BAND_COLOR.mature.fg }}>🟢 Mature</b> ≥ 75%</span>
        <span><b style={{ color: BAND_COLOR.partial.fg }}>🟡 Partial</b> 45–74%</span>
        <span><b style={{ color: BAND_COLOR.gap.fg }}>🔴 Gap</b> &lt; 45%</span>
        <span className="pb-legend-sep">·</span>
        <span>Phases: <b style={{ color: PHASE_COLOR.BUILD }}>BUILD</b> → <b style={{ color: PHASE_COLOR.DATA }}>DATA</b> → <b style={{ color: PHASE_COLOR.SHIP }}>SHIP</b></span>
      </div>

      {/* Per-agent view filter */}
      <AgentFilter agents={AGENT_SUMMARY} totalUnits={STATS.totalUnits} />

      {/* Layers */}
      {LAYERS.map((layer) => (
        <LayerSection key={layer.id} layer={layer} />
      ))}

      <footer className="pb-footer">
        Two human gates (design + content); the machine owns the 101 mechanical rules.
        Maturity is a snapshot judgement, not a live metric — edit{' '}
        <a href={GH_BASE + 'utopia-wizard/lib/playbookData.ts'} target="_blank" rel="noopener noreferrer">lib/playbookData.ts</a>{' '}
        to update it.
      </footer>
    </main>
  )
}
