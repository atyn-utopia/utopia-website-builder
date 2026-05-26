'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  ms: 'BM',
  zh: '中文',
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()

  function switchLocale(next: string) {
    // Replace the current locale prefix in the pathname
    const segments = pathname.split('/')
    // segments[0] = '', segments[1] = locale
    segments[1] = next
    router.push(segments.join('/'))
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
            loc === currentLocale
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
