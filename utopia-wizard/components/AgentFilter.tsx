'use client'

import { useEffect, useState } from 'react'
import { GH_BASE, type AgentSummary } from '@/lib/playbookData'

const ALL = '__all__'

export default function AgentFilter({
  agents,
  totalUnits,
}: {
  agents: AgentSummary[]
  totalUnits: number
}) {
  const [active, setActive] = useState<string>(ALL)

  // Filter the server-rendered cards in place — no re-render of the (static)
  // content, just show/hide by data-owner, then hide any layer left empty.
  useEffect(() => {
    const root = document.querySelector('[data-playbook-root]')
    if (!root) return

    root.querySelectorAll<HTMLElement>('.pb-unit').forEach((u) => {
      const owner = u.getAttribute('data-owner')
      u.style.display = active === ALL || owner === active ? '' : 'none'
    })
    root.querySelectorAll<HTMLElement>('.pb-layer').forEach((layer) => {
      const anyVisible = Array.from(
        layer.querySelectorAll<HTMLElement>('.pb-unit'),
      ).some((u) => u.style.display !== 'none')
      layer.style.display = anyVisible ? '' : 'none'
    })
  }, [active])

  const current = agents.find((a) => a.name === active)

  return (
    <div className="pb-agentbar">
      <div className="pb-agentbar-row">
        <span className="pb-agentbar-lbl">View as</span>
        <button
          className={`pb-agent-chip${active === ALL ? ' is-active' : ''}`}
          aria-pressed={active === ALL}
          onClick={() => setActive(ALL)}
        >
          All agents
          <span className="pb-agent-n">{totalUnits}</span>
        </button>
        {agents.map((a) => (
          <button
            key={a.name}
            className={`pb-agent-chip${active === a.name ? ' is-active' : ''}`}
            aria-pressed={active === a.name}
            onClick={() => setActive(a.name)}
            title={`${a.name} — ${a.role}`}
          >
            {a.name}
            <span className="pb-agent-n">{a.count}</span>
          </button>
        ))}
      </div>

      {current && (
        <div className="pb-agent-banner">
          <div>
            <strong>{current.name}</strong>
            <span className="pb-agent-role"> · {current.role}</span>
            <span className="pb-agent-stat">
              {' '}owns {current.count} unit{current.count === 1 ? '' : 's'} · avg {current.avg}%
            </span>
          </div>
          <a
            className="pb-agent-link"
            href={GH_BASE + current.path}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open definition ↗
          </a>
        </div>
      )}

      <style>{`
        .pb-agentbar { margin: 2px 0 24px; }
        .pb-agentbar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }
        .pb-agentbar-lbl {
          text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px;
          color: var(--text-quiet); margin-right: 4px;
        }
        .pb-agent-chip {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 12px; border-radius: var(--radius-pill);
          font-family: var(--font-sans); font-size: 12.5px; font-weight: 600;
          color: var(--text-secondary);
          background: transparent; border: 1px solid var(--border-soft);
          cursor: pointer; transition: all var(--transition-snap);
        }
        .pb-agent-chip:hover { color: var(--text-primary); border-color: var(--border-strong); }
        .pb-agent-chip.is-active {
          color: var(--text-primary); background: var(--brand-bg);
          border-color: var(--brand-border);
        }
        .pb-agent-n {
          font-family: var(--font-mono); font-size: 10.5px; font-weight: 600;
          color: var(--text-muted); background: var(--bg-base);
          padding: 1px 6px; border-radius: var(--radius-pill);
        }
        .pb-agent-chip.is-active .pb-agent-n { color: var(--brand-glow); }
        .pb-agent-banner {
          display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
          justify-content: space-between;
          margin-top: 12px; padding: 11px 15px;
          background: var(--brand-bg-soft); border: 1px solid var(--brand-border);
          border-radius: var(--radius-md); font-size: 13px; color: var(--text-secondary);
        }
        .pb-agent-banner strong { color: var(--text-primary); font-size: 14px; }
        .pb-agent-role { color: var(--text-secondary); }
        .pb-agent-stat { color: var(--text-muted); font-size: 12px; }
        .pb-agent-link {
          font-size: 12px; font-weight: 600; color: var(--brand-glow);
          text-decoration: none; white-space: nowrap;
        }
        .pb-agent-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
