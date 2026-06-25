'use client'

import PlaybookStyles from '../playbook/PlaybookStyles'

interface Section { level: number; title: string; body: string }
interface PUnit { name: string; body: string }
interface PLayer { title: string; intro: string; units: PUnit[] }

function sections(md: string): Section[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const secs: Section[] = []
  let droppedTitle = false
  let cur: Section | null = null
  let inFence = false
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) inFence = !inFence
    const h = !inFence ? line.match(/^(#{1,6})\s+(.+?)\s*$/) : null
    if (h) {
      const level = h[1].length
      const title = h[2].trim()
      if (!droppedTitle && level === 1 && secs.length === 0) { droppedTitle = true; continue }
      cur = { level, title, body: '' }
      secs.push(cur)
    } else if (cur) {
      cur.body += (cur.body ? '\n' : '') + line
    }
  }
  return secs.map((s) => ({ ...s, body: s.body.trim() }))
}

function toLayers(secs: Section[]): PLayer[] {
  if (secs.length === 0) return []
  const levels = secs.map((s) => s.level)
  const layerLevel = Math.min(...levels)
  const deeper = levels.filter((l) => l > layerLevel)
  const unitLevel = deeper.length ? Math.min(...deeper) : layerLevel

  const layers: PLayer[] = []
  const newLayer = (title: string, intro = ''): PLayer => { const l: PLayer = { title, intro, units: [] }; layers.push(l); return l }
  let layer: PLayer = newLayer('Overview')
  let unit: PUnit | null = null
  let hasContent = false

  for (const s of secs) {
    if (s.level === layerLevel && unitLevel !== layerLevel) {
      layer = newLayer(s.title, s.body); unit = null; hasContent = true
    } else if (s.level === unitLevel) {
      unit = { name: s.title, body: s.body }; layer.units.push(unit); hasContent = true
    } else {
      const block = `**${s.title}**\n${s.body}`
      if (unit) unit.body += (unit.body ? '\n\n' : '') + block
      else layer.intro += (layer.intro ? '\n\n' : '') + block
      hasContent = true
    }
  }
  if (!hasContent) return []
  for (const l of layers) {
    if (l.units.length === 0 && l.intro) { l.units.push({ name: 'Details', body: l.intro }); l.intro = '' }
  }
  return layers.filter((l) => l.units.length > 0 || l.intro)
}

const clamp = (t: string, n: number) => { const s = t.replace(/\n+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s }

export default function PlaybookDocView({ md, owner, repo, source, title }: { md: string; owner: string; repo: string; source: string; title: string | null }) {
  const layers = toLayers(sections(md))
  if (layers.length === 0) {
    return <p style={{ color: 'var(--text-quiet)', fontSize: 13 }}>This document has no headings to map into a playbook.</p>
  }
  const total = layers.reduce((a, l) => a + l.units.length, 0)
  const fileUrl = `https://github.com/${repo}/blob/HEAD/${source}`

  return (
    <div data-playbook-root>
      <PlaybookStyles />

      <header className="pb-header">
        <div>
          <h1 className="pb-title">📘 {title || repo}</h1>
          <p className="pb-tagline">
            Generated from <code style={{ fontFamily: 'var(--font-mono)' }}>{source}</code> · {layers.length} layers · {total} units.
          </p>
          <div className="pb-source">
            <a className="pb-doc" href={fileUrl} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> {repo}/{source}</a>
            <a className="pb-doc" href={`https://github.com/${owner}`} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> @{owner}</a>
          </div>
        </div>
      </header>

      {layers.map((layer, i) => (
        <section className="pb-layer" key={i}>
          <div className="pb-layer-head">
            <div className="pb-layer-id">L{i + 1}</div>
            <div className="pb-layer-meta">
              <div className="pb-layer-titlerow">
                <h2 className="pb-layer-name">{layer.title}</h2>
                <span className="pb-layer-count">{layer.units.length} unit{layer.units.length === 1 ? '' : 's'}</span>
              </div>
              {layer.intro && <p className="pb-layer-sub">{clamp(layer.intro, 180)}</p>}
            </div>
          </div>
          <div className="pb-grid">
            {layer.units.map((u, j) => (
              <div className="pb-unit" key={j}>
                <div className="pb-unit-top">
                  <div className="pb-unit-head">
                    <span className="pb-dot" style={{ background: 'var(--brand-glow, var(--brand))' }} aria-hidden="true" />
                    <h3 className="pb-unit-name">{u.name}</h3>
                  </div>
                </div>
                {u.body && <p className="pb-purpose">{clamp(u.body, 150)}</p>}
                {u.body && u.body.length > 150 && (
                  <details className="pb-details">
                    <summary className="pb-summary">Full section</summary>
                    <p className="pb-purpose" style={{ marginTop: 6 }}>{u.body}</p>
                  </details>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
