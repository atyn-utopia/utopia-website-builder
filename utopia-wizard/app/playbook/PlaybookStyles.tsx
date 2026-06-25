/* Shared playbook styles (pb- prefix; uses the wizard's design tokens).
   Used by the system playbook (/playbook) and per-user playbooks (/playbooks). */
export default function PlaybookStyles() {
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

      .pb-purpose { font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.5; white-space: pre-wrap; }

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
