'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MonitorIcon from '@/components/icons/MonitorIcon'
import BookIcon from '@/components/icons/BookIcon'

const TABS = [
  { href: '/', label: 'Monitor', Icon: MonitorIcon, match: (p: string) => p === '/' },
  {
    href: '/playbook',
    label: 'Playbook',
    Icon: BookIcon,
    match: (p: string) => p.startsWith('/playbook'),
  },
]

export default function TabNav() {
  const pathname = usePathname() || '/'

  // Hide the tab bar on auth + the new-project wizard so they stay focused.
  if (pathname.startsWith('/login') || pathname.startsWith('/new')) return null

  return (
    <nav
      aria-label="Primary"
      style={{
        width: '100%',
        maxWidth: 1400,
        margin: '0 auto 18px',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
      }}
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 13.5,
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.2,
              textDecoration: 'none',
              border: `1px solid ${active ? 'var(--brand-border)' : 'var(--border-soft)'}`,
              background: active ? 'var(--brand-bg)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'all var(--transition-snap)',
            }}
          >
            <tab.Icon size={15} />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
