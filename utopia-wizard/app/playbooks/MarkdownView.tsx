'use client'

import React from 'react'

/** Minimal inline markdown: **bold**, `code`. Returns React nodes. */
function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Split on `code` and **bold** while keeping delimiters.
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('`')) {
      nodes.push(
        <code key={`${keyPrefix}-c${i}`} style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-input)', padding: '1px 5px', borderRadius: 4, fontSize: '0.88em' }}>
          {tok.slice(1, -1)}
        </code>,
      )
    } else {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{tok.slice(2, -2)}</strong>)
    }
    last = m.index + tok.length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const H_SIZE: Record<number, number> = { 1: 26, 2: 21, 3: 17, 4: 15, 5: 13.5, 6: 12.5 }

/**
 * Lightweight markdown renderer for the playbook outline — headings, lists,
 * code fences, blockquotes, paragraphs, and basic inline. No external deps.
 */
export default function MarkdownView({ md }: { md: string }) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out: React.ReactNode[] = []
  let i = 0
  let key = 0
  const k = () => `md-${key++}`

  while (i < lines.length) {
    const line = lines[i]

    // Code fence
    if (line.trimStart().startsWith('```')) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) { buf.push(lines[i]); i++ }
      i++ // closing fence
      out.push(
        <pre key={k()} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-soft)', borderRadius: 8, padding: '12px 14px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.5, margin: '8px 0' }}>
          {buf.join('\n')}
        </pre>,
      )
      continue
    }

    // Heading
    const h = line.match(/^(#{1,6})\s+(.+?)\s*$/)
    if (h) {
      const level = h[1].length
      out.push(
        <div key={k()} id={`h-${h[2].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{
          fontSize: H_SIZE[level], fontWeight: level <= 2 ? 700 : 600,
          color: level <= 2 ? 'var(--text-primary)' : 'var(--text-secondary)',
          lineHeight: 1.2, margin: level <= 2 ? '22px 0 8px' : '16px 0 6px',
          paddingBottom: level <= 2 ? 6 : 0,
          borderBottom: level <= 2 ? '1px solid var(--border-soft)' : 'none',
        }}>
          {inline(h[2], k())}
        </div>,
      )
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('>')) {
      const buf: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) { buf.push(lines[i].replace(/^>\s?/, '')); i++ }
      out.push(
        <blockquote key={k()} style={{ borderLeft: '3px solid var(--border-soft)', paddingLeft: 12, margin: '8px 0', color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.5 }}>
          {inline(buf.join(' '), k())}
        </blockquote>,
      )
      continue
    }

    // Unordered / ordered list
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const items: string[] = []
      const ordered = /^\s*\d+\.\s+/.test(line)
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, '')); i++
      }
      const ListTag = ordered ? 'ol' : 'ul'
      out.push(
        <ListTag key={k()} style={{ margin: '6px 0', paddingLeft: 22, color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.55 }}>
          {items.map((it, idx) => <li key={idx} style={{ marginBottom: 3 }}>{inline(it, `${k()}-${idx}`)}</li>)}
        </ListTag>,
      )
      continue
    }

    // Blank line
    if (line.trim() === '') { i++; continue }

    // Paragraph (gather until blank / structural line)
    const buf: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|>|\s*([-*]|\d+\.)\s|```)/.test(lines[i])) {
      buf.push(lines[i]); i++
    }
    out.push(
      <p key={k()} style={{ margin: '6px 0', color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6 }}>
        {inline(buf.join(' '), k())}
      </p>,
    )
  }

  return <div>{out}</div>
}
