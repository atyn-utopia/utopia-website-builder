'use client'

// Shared FOMO banner rendered by every public page so the checklist sees
// <FomoBanner /> in homepage/location/blog source. Client component — the copy
// comes from `home.fomo.*` and it shows a LIVE countdown (ticking
// hours:minutes:seconds, CLAUDE.md mandatory) to the end of the current month.
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'

function endOfMonth(): Date {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

function diffParts(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now())
  const hours = Math.floor(ms / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return { hours, minutes, seconds }
}

const pad = (n: number) => String(n).padStart(2, '0')

function waRedirect(locale: string, message?: string) {
  const params = new URLSearchParams()
  if (message) params.set('message', message)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}

export default function FomoBanner({ locale }: { locale: Locale }) {
  const t = useTranslations('home.fomo')
  const [parts, setParts] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)

  useEffect(() => {
    const tick = () => setParts(diffParts(endOfMonth()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ background: '#DC2626' }}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-white text-xs sm:text-sm">
        <span className="w-2 h-2 rounded-full bg-white shrink-0" aria-hidden="true" />
        <span className="font-medium">
          <span className="hidden sm:inline">{t('promo')}</span>
          {t('slotsLeft', { slots: 3 })}
        </span>
        <span
          aria-live="polite"
          className="inline-flex items-center gap-1 font-bold tabular-nums shrink-0"
        >
          <span className="inline-flex items-center justify-center rounded bg-white/20 px-1.5 py-0.5 leading-none">
            {parts ? pad(parts.hours) : '00'}
          </span>
          <span aria-hidden="true">:</span>
          <span className="inline-flex items-center justify-center rounded bg-white/20 px-1.5 py-0.5 leading-none">
            {parts ? pad(parts.minutes) : '00'}
          </span>
          <span aria-hidden="true">:</span>
          <span className="inline-flex items-center justify-center rounded bg-white/20 px-1.5 py-0.5 leading-none">
            {parts ? pad(parts.seconds) : '00'}
          </span>
        </span>
        <a
          href={waRedirect(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:no-underline shrink-0"
        >
          {t('bookNow')} &rarr;
        </a>
      </div>
    </div>
  )
}
