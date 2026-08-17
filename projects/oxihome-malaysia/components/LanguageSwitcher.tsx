'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  ms: 'BM',
  zh: '中文',
}

export function LanguageSwitcher({ currentLocale }: { currentLocale?: string } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const activeLocale = currentLocale ?? locale

  function switchLocale(next: string) {
    // localePrefix is 'as-needed', so the default locale (ms) has NO prefix in
    // the URL. Strip a leading segment only when it really is a locale, then
    // re-prefix only for non-default locales — otherwise switching from an
    // unprefixed page like /oxygen-machine/kuala-lumpur would eat the product
    // segment instead of adding a locale.
    const segments = pathname.split('/') // segments[0] is always ''
    const known = routing.locales as readonly string[]
    const rest = known.includes(segments[1]) ? segments.slice(2) : segments.slice(1)
    const path = rest.join('/')
    const prefix = next === routing.defaultLocale ? '' : `/${next}`
    router.push(`${prefix}/${path}`.replace(/\/+$/, '') || '/')
  }

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map((loc, i) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          aria-label={`Switch to ${loc}`}
          className={[
            'px-2 py-1 text-xs font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400',
            i > 0 ? 'border-l border-slate-200' : '',
            loc === activeLocale
              ? 'text-teal-700'
              : 'text-slate-500 hover:text-teal-600',
          ].join(' ')}
        >
          {LANG_LABELS[loc]}
        </button>
      ))}
    </div>
  )
}

// Default export so the shared SiteHeader (which imports LanguageSwitcher
// as default) keeps compiling. The named export is what the restored
// pre-migration layout.tsx imports.
export default LanguageSwitcher
