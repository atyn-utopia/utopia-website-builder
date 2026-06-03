'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { waRedirect } from '@/lib/waRedirect'

// Sticky urgency banner with live ticking countdown.
// - Red gradient background (--gradient-emergency)
// - Auto-rotating message every 8s
// - Countdown ticks down to end-of-day
// - WhatsApp CTA opens via /redirect-whatsapp-1 (tracked + leads routed)
export default function FomoBanner() {
  const locale = useLocale()
  const t = useTranslations('fomoBanner')
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [textIdx, setTextIdx] = useState(0)

  useEffect(() => {
    const getEndOfDay = () => { const end = new Date(); end.setHours(23, 59, 59, 999); return end }
    const updateTimer = () => {
      const diff = getEndOfDay().getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    updateTimer()
    const iv = setInterval(updateTimer, 1000)
    const tv = setInterval(() => setTextIdx((i) => (i + 1) % 3), 8000)
    return () => { clearInterval(iv); clearInterval(tv) }
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const texts: string[] = [t('texts.0'), t('texts.1'), t('texts.2')]

  return (
    <div style={{ background: 'var(--gradient-emergency)' }}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-white text-xs sm:text-sm">
        <span className="fomo-dot w-2 h-2 rounded-full bg-white shrink-0" />
        <span className="font-medium">{texts[textIdx]}</span>
        <span
          className="font-mono font-semibold px-2 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,0.25)' }}
          aria-live="polite"
        >
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
        <a
          href={waRedirect(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:no-underline shrink-0"
          onClick={() => {
            if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
              window.uwc('click', { label: 'whatsapp-fomo' })
            }
          }}
        >
          {t('bookNow')} &rarr;
        </a>
      </div>
    </div>
  )
}
