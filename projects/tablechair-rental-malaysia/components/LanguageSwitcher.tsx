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
  ms: 'MS',
  zh: 'ZH',
}

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as (typeof routing.locales)[number]
  const pathname = usePathname() || '/'

  const segments = pathname.split('/').filter(Boolean)
  const rest = routing.locales.includes(
    segments[0] as (typeof routing.locales)[number],
  )
    ? '/' + segments.slice(1).join('/')
    : pathname
  const cleanRest = rest === '/' ? '' : rest

  return (
    <div className="relative group">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#FDD835]/30 bg-white/80 px-3 py-1.5 text-sm font-medium text-[#111111] hover:border-[#FDD835] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDD835] min-h-[44px]"
        style={{ transition: 'transform 200ms ease, border-color 200ms ease' }}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 0 20" />
          <path d="M12 2a15.3 15.3 0 0 0 0 20" />
        </svg>
        <span>{SHORT[currentLocale]}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ul
        role="listbox"
        className="invisible absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-[#FDD835]/25 bg-white opacity-0 shadow-[0_12px_30px_-12px_rgba(232,181,71,0.45)] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
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
                  'block px-4 py-2.5 text-sm min-h-[44px] flex items-center ' +
                  (isActive
                    ? 'bg-[#FDD835] font-semibold text-[#111111]'
                    : 'text-[#111111] hover:bg-[#FFFEF8]')
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
