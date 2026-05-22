'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

const LABELS: Record<(typeof routing.locales)[number], string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
  zh: '中文',
}

const SHORT: Record<(typeof routing.locales)[number], string> = {
  en: 'EN',
  ms: 'BM',
  zh: '中文',
}

export default function LanguageSwitcher({
  variant = 'light',
}: {
  variant?: 'light' | 'dark'
}) {
  const currentLocale = useLocale() as (typeof routing.locales)[number]
  const pathname = usePathname() || '/'

  const segments = pathname.split('/').filter(Boolean)
  const rest = routing.locales.includes(
    segments[0] as (typeof routing.locales)[number],
  )
    ? '/' + segments.slice(1).join('/')
    : pathname
  const cleanRest = rest === '/' ? '' : rest

  const triggerClass =
    variant === 'dark'
      ? 'border-white/30 bg-white/10 text-white hover:border-[#C8A45C]'
      : 'border-[#DCD3C3] bg-white/80 text-[#13204C] hover:border-[#C8A45C]'

  return (
    <div className="relative group">
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A45C] ${triggerClass}`}
        style={{ transition: 'border-color 200ms ease, background-color 200ms ease' }}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 0 20" />
          <path d="M12 2a15.3 15.3 0 0 0 0 20" />
        </svg>
        <span>{SHORT[currentLocale]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-3 w-3 opacity-70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ul
        role="listbox"
        className="invisible absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-[#DCD3C3] bg-white opacity-0 shadow-[0_18px_40px_-12px_rgba(11,21,58,0.25)] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        style={{ transition: 'opacity 200ms ease' }}
      >
        {routing.locales.map((l) => {
          const isActive = l === currentLocale
          return (
            <li key={l}>
              <Link
                href={`/${l}${cleanRest}`}
                lang={l}
                className={
                  'flex items-center px-4 py-2.5 text-sm min-h-[44px] ' +
                  (isActive
                    ? 'bg-[#13204C] font-semibold text-[#FBF7EF]'
                    : 'text-[#13204C] hover:bg-[#F5EFE6]')
                }
                style={{ transition: 'background-color 150ms ease' }}
              >
                {LABELS[l]}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
