'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteProjectModal from './DeleteProjectModal'
import TrashIcon from './icons/TrashIcon'

export default function WishDangerZone({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <section
      className="uf-card"
      style={{
        padding: '20px 22px',
        background: 'var(--status-fail-bg)',
        boxShadow: '0 0 0 1px var(--status-fail-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div>
        <span className="uf-eyebrow" style={{ color: 'var(--status-fail)' }}>
          Danger Zone
        </span>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 13,
          margin: '6px 0 0',
          lineHeight: 1.55,
          fontFamily: 'var(--font-sans)',
        }}>
          Removes <code style={{
            background: 'var(--bg-input)',
            padding: '1px 6px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
          }}>projects/{slug}/</code> from disk and clears the row in <code style={{
            background: 'var(--bg-input)',
            padding: '1px 6px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
          }}>monitor_snapshots</code>. Phones, products, and blog rows in Supabase are kept.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          background: 'transparent',
          color: 'var(--status-fail)',
          border: '1px solid var(--status-fail-border)',
          borderRadius: 'var(--radius-pill)',
          padding: '9px 18px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1.2,
          alignSelf: 'flex-start',
          transition: 'all var(--transition-snap)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--status-fail)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--status-fail)'
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <TrashIcon size={14} />
          Delete Project
        </span>
      </button>

      <DeleteProjectModal
        slug={slug}
        open={open}
        onClose={() => setOpen(false)}
        onDeleted={() => router.push('/')}
      />
    </section>
  )
}
