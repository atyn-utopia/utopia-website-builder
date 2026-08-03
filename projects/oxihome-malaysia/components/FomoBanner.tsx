'use client'

// Top FOMO urgency banner for oxihome-malaysia.
//
// Sticky red strip at the very top of every page with a LIVE countdown timer
// (ticking hours:minutes:seconds, resets at midnight) + a WhatsApp CTA.
// CLAUDE.md requires the countdown to be mandatory and the background to be an
// urgency colour (red/black, never the brand teal).

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'

const WA_GREEN = '#25D366'

function secondsUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(23, 59, 59, 0)
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
}

const pad = (n: number) => String(n).padStart(2, '0')

const COPY: Record<string, { eyebrow: string; body: string; cta: string }> = {
  en: { eyebrow: 'TODAY ONLY', body: 'Free same-day delivery + free oximeter — offer ends in', cta: 'Claim now' },
  ms: { eyebrow: 'HARI INI SAHAJA', body: 'Penghantaran hari sama percuma + oksimeter percuma — tawaran tamat dalam', cta: 'Tuntut sekarang' },
  zh: { eyebrow: '仅限今天', body: '免费当日送货 + 免费血氧仪 — 优惠倒计时', cta: '立即领取' },
}

export default function FomoBanner() {
  const locale = useLocale()
  const [secs, setSecs] = useState<number | null>(null)

  useEffect(() => {
    setSecs(secondsUntilMidnight())
    const id = setInterval(() => setSecs(secondsUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [])

  const copy = COPY[locale] ?? COPY.en
  const h = secs === null ? '00' : pad(Math.floor(secs / 3600))
  const m = secs === null ? '00' : pad(Math.floor((secs % 3600) / 60))
  const s = secs === null ? '00' : pad(secs % 60)

  return (
    <div
      /* Positioning is owned by the sticky stack wrapper in [locale]/layout.tsx
         that holds this banner + the header. Do NOT re-add `sticky top-0` here:
         two separately-sticky siblings both pin to 0px and overlap. */
      className="w-full flex items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-white text-xs sm:text-sm font-semibold flex-wrap text-center"
      style={{ background: '#C0392B' }}
    >
      <span className="font-bold uppercase tracking-wide">{copy.eyebrow}</span>
      <span className="opacity-90">{copy.body}</span>

      {/* Live countdown — ticks every second */}
      <span aria-live="polite" className="flex items-center gap-1 font-mono font-bold text-sm sm:text-base">
        <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.28)' }}>{h}</span>
        <span className="opacity-75">:</span>
        <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.28)' }}>{m}</span>
        <span className="opacity-75">:</span>
        <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.28)' }}>{s}</span>
      </span>

      <a
        href={`/${locale}/redirect-whatsapp-1`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-opacity hover:opacity-90"
        style={{ background: WA_GREEN, color: 'white' }}
      >
        {copy.cta} →
      </a>
    </div>
  )
}
