'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  ms: 'BM',
  zh: '中文',
}

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className="px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer"
          style={{
            color: loc === locale ? 'var(--brand-yellow)' : 'rgba(255,255,255,0.5)',
            background: loc === locale ? 'rgba(255,229,0,0.15)' : 'transparent',
          }}
        >
          {LANG_LABELS[loc]}
        </button>
      ))}
    </div>
  )
}
