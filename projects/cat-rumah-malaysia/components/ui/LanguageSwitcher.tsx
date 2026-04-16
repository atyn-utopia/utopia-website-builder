'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const options = [
  { code: 'ms', short: 'BM' },
  { code: 'en', short: 'EN' },
  { code: 'zh', short: '中文' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const pathname = usePathname() || '/'

  const hrefFor = (target: string) => {
    // pathname starts with /ms, /en or /zh
    const parts = pathname.split('/')
    if (parts.length > 1 && ['ms', 'en', 'zh'].includes(parts[1])) {
      parts[1] = target
      return parts.join('/') || `/${target}`
    }
    return `/${target}${pathname}`
  }

  const current = options.find((o) => o.code === locale) ?? options[0]

  return (
    <div className="lang-switcher" aria-label={t('label')}>
      <button type="button" className="lang-trigger">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{current.short}</span>
      </button>
      <ul className="lang-menu">
        {options.map((o) => (
          <li key={o.code}>
            <Link href={hrefFor(o.code)} aria-current={o.code === locale ? 'page' : undefined}>
              {t(o.code)}
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .lang-switcher {
          position: relative;
          display: inline-block;
        }
        .lang-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 999px;
          background: var(--brand-jade-soft);
          color: var(--brand-jade-dark);
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease-out;
        }
        .lang-trigger:hover { background: #c5e8de; }
        .lang-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: #fff;
          list-style: none;
          padding: 8px;
          margin: 0;
          border-radius: 14px;
          border: 1px solid var(--brand-border);
          box-shadow: 0 16px 40px -18px rgba(30,36,48,0.24);
          min-width: 160px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-4px);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out;
          z-index: 50;
        }
        .lang-switcher:hover .lang-menu,
        .lang-switcher:focus-within .lang-menu {
          opacity: 1; pointer-events: auto; transform: translateY(0);
        }
        .lang-menu :global(a) {
          display: block;
          padding: 10px 14px;
          border-radius: 10px;
          color: var(--brand-charcoal);
          font-size: 14px;
        }
        .lang-menu :global(a:hover) { background: var(--brand-jade-wash); }
        .lang-menu :global(a[aria-current="page"]) { background: var(--brand-jade-soft); color: var(--brand-jade-dark); font-weight: 700; }
      `}</style>
    </div>
  )
}
