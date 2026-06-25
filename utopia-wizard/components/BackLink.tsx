'use client'

import Link from 'next/link'

/** Consistent, understated back control used across secondary pages. */
export default function BackLink({ href = '/', label = 'Back' }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
        color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
        padding: '7px 14px 7px 11px', borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--border-soft)', background: 'transparent',
        fontFamily: 'var(--font-sans)', transition: 'all var(--transition-snap)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>←</span> {label}
    </Link>
  )
}
