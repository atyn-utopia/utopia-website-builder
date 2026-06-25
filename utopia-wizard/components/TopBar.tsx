'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import UniversalSearch from './UniversalSearch'
import AccountSwitcher from './AccountSwitcher'
import { useTheme } from '@/lib/useTheme'

const TABS = [
  { href: '/', label: 'Monitor', match: (p: string) => p === '/' },
  { href: '/repos', label: 'Repos', match: (p: string) => p.startsWith('/repos') },
  { href: '/playbooks', label: 'Playbooks', match: (p: string) => p.startsWith('/playbooks') },
  { href: '/checklist-rules', label: 'Checklist', match: (p: string) => p.startsWith('/checklist-rules') },
]

function Divider() {
  return <span aria-hidden style={{ width: 1, alignSelf: 'stretch', minHeight: 26, background: 'var(--border-soft)', flexShrink: 0 }} />
}

export default function TopBar() {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const { theme, toggle, hydrated } = useTheme()

  // Hide only on the login screen.
  if (pathname.startsWith('/login')) return null

  return (
    <nav
      aria-label="Primary"
      style={{
        width: '100%', maxWidth: 1400, margin: '0 auto 18px',
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}
    >
      {/* Brand */}
      <Link href="/" aria-label="Home" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/utopia-wizard-logo.png" alt="Utopia Wizard" style={{ width: 34, height: 34 }} />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Utopia Wizard</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Website Builder &amp; Monitor</span>
        </span>
      </Link>

      <Divider />

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {TABS.map((tab) => {
          const active = tab.match(pathname)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '7px 14px',
                borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 600,
                fontFamily: 'var(--font-sans)', lineHeight: 1.2, textDecoration: 'none',
                whiteSpace: 'nowrap',
                border: `1px solid ${active ? 'var(--brand-border)' : 'transparent'}`,
                background: active ? 'var(--brand-bg)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'all var(--transition-snap)',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      <Divider />

      {/* Universal search (grows to fill) */}
      <UniversalSearch />

      <Divider />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => router.push('/new')}
          className="uf-btn-brand"
          style={{ padding: '8px 16px', fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap' }}
        >
          ✦ New
        </button>
        <AccountSwitcher />
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          style={{
            width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: '1px solid var(--border-soft)', borderRadius: '50%',
            color: 'var(--text-muted)', fontSize: 15, cursor: 'pointer', flexShrink: 0,
            opacity: hydrated ? 1 : 0, transition: 'all var(--transition-snap)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  )
}
