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

/* ── Styles (scoped by pb- prefix; uses the wizard's design tokens) ───────── */
function PlaybookStyles() {
  return (
    <style>{`
      .pb-header {
        display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start;
        justify-content: space-between;
        padding-bottom: 22px; margin-bottom: 18px;
        border-bottom: 1px solid var(--border-soft);
      }
      .pb-title {
        font-family: var(--font-sans); font-size: 28px; font-weight: 800;
        letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 6px;
        line-height: 1.1;
      }
      .pb-tagline { color: var(--text-secondary); font-size: 13.5px; margin: 0 0 12px; max-width: 640px; line-height: 1.5; }
      .pb-source { display: flex; flex-wrap: wrap; gap: 6px; }

      .pb-overview {
        display: flex; align-items: center; gap: 20px;
        background: var(--bg-elevated); border: 1px solid var(--border-soft);
        border-radius: var(--radius-lg); padding: 16px 20px;
      }
      .pb-bigscore { display: flex; flex-direction: column; align-items: center; padding-right: 18px; border-right: 1px solid var(--border-soft); }
      .pb-bigscore-num { font-family: var(--font-mono); font-size: 34px; font-weight: 600; color: var(--text-primary); line-height: 1; }
      .pb-bigscore-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
      .pb-counts { display: flex; flex-direction: column; gap: 6px; }
      .pb-count { font-size: 13px; }
      .pb-count strong { font-family: var(--font-mono); font-size: 15px; }

      .pb-legend {
        display: flex; flex-wrap: wrap; align-items: center; gap: 14px;
        font-size: 12.5px; color: var(--text-muted);
        margin-bottom: 26px;
      }
      .pb-legend-lbl { text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; color: var(--text-quiet); }
      .pb-legend-sep { color: var(--text-quiet); }

      .pb-layer { margin-bottom: 30px; }
      .pb-layer-head {
        display: flex; align-items: center; gap: 16px; margin-bottom: 14px;
      }
      .pb-layer-id {
        flex-shrink: 0; width: 46px; height: 46px; border-radius: var(--radius-md);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-mono); font-weight: 600; font-size: 16px;
        color: var(--text-primary);
        background: var(--brand-bg-soft); border: 1px solid var(--brand-border);
      }
      .pb-layer-meta { flex: 1; min-width: 0; }
      .pb-layer-titlerow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
      .pb-layer-name { font-family: var(--font-sans); font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: -0.01em; }
      .pb-phase {
        font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
        padding: 2px 7px; border-radius: var(--radius-pill); border: 1px solid;
      }
      .pb-layer-count { font-size: 12px; color: var(--text-muted); }
      .pb-layer-sub { font-size: 12.5px; color: var(--text-muted); margin: 3px 0 0; }
      .pb-layer-score { flex-shrink: 0; width: 110px; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
      .pb-layer-pct { font-family: var(--font-mono); font-size: 15px; font-weight: 600; }

      .pb-grid {
        display: grid; gap: 12px;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }

      .pb-unit {
        background: var(--bg-elevated); border: 1px solid var(--border-soft);
        border-radius: var(--radius-lg); padding: 14px 15px;
        display: flex; flex-direction: column; gap: 9px;
        transition: border-color var(--transition-snap), box-shadow var(--transition-snap);
      }
      .pb-unit:hover { border-color: var(--border-strong); box-shadow: var(--shadow-card); }
      .pb-unit-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
      .pb-unit-head { display: flex; align-items: center; gap: 8px; min-width: 0; }
      .pb-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .pb-unit-name { font-family: var(--font-sans); font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0; line-height: 1.3; }
      .pb-owner {
        flex-shrink: 0; font-size: 11px; font-weight: 600; color: var(--text-secondary);
        text-decoration: none; padding: 2px 9px; border-radius: var(--radius-pill);
        border: 1px solid var(--border-soft); background: var(--bg-base);
        transition: all var(--transition-snap); white-space: nowrap;
      }
      .pb-owner:hover { color: var(--text-primary); border-color: var(--brand-border); background: var(--brand-bg-soft); }

      .pb-unit-meter { display: flex; align-items: center; gap: 9px; }
      .pb-bar { flex: 1; height: 6px; border-radius: var(--radius-pill); background: var(--bg-hover); overflow: hidden; }
      .pb-bar-fill { height: 100%; border-radius: var(--radius-pill); }
      .pb-pct { font-family: var(--font-mono); font-size: 11.5px; font-weight: 600; white-space: nowrap; }

      .pb-purpose { font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.5; }

      .pb-docs { display: flex; flex-wrap: wrap; gap: 5px; }
      .pb-doc {
        font-size: 11px; font-weight: 500; color: var(--text-muted);
        text-decoration: none; padding: 2px 8px; border-radius: var(--radius-sm);
        border: 1px solid var(--border-soft); background: var(--bg-base);
        transition: all var(--transition-snap); white-space: nowrap;
      }
      .pb-doc:hover { color: var(--brand-glow); border-color: var(--brand-border); }
      .pb-doc span { opacity: 0.6; }

      .pb-details { margin-top: 2px; }
      .pb-summary {
        cursor: pointer; font-size: 11.5px; font-weight: 600; color: var(--text-muted);
        list-style: none; padding: 5px 0; user-select: none;
        display: inline-flex; align-items: center; gap: 6px;
        transition: color var(--transition-snap);
      }
      .pb-summary:hover { color: var(--text-secondary); }
      .pb-summary::-webkit-details-marker { display: none; }
      .pb-summary::before { content: '▸'; font-size: 10px; transition: transform var(--transition-snap); }
      .pb-details[open] .pb-summary::before { transform: rotate(90deg); }

      .pb-spec {
        margin: 6px 0 2px; padding: 10px 12px;
        background: var(--bg-base); border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        display: grid; gap: 7px;
      }
      .pb-spec-row { display: grid; grid-template-columns: 92px 1fr; gap: 10px; align-items: baseline; }
      .pb-spec-row dt { font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-quiet); }
      .pb-spec-row dd { font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.45; }

      .pb-footer {
        margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border-soft);
        font-size: 12px; color: var(--text-muted); line-height: 1.6;
      }
      .pb-footer a { color: var(--text-secondary); }

      @media (max-width: 720px) {
        .pb-overview { width: 100%; }
        .pb-layer-score { width: 84px; }
        .pb-layer-head { flex-wrap: wrap; }
        .pb-spec-row { grid-template-columns: 80px 1fr; }
      }
    `}</style>
  )
}
