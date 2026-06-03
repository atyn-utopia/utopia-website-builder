'use client'

// Sticky urgency banner — live HH:MM:SS countdown to end of day, slot count
// that drifts down through the day, pulsing white dot. Server-rendered text
// comes from `home.fomo.*`.
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'

function waRedirect(locale: string) {
  return `/${locale}/redirect-whatsapp-1`
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export default function FomoBanner({ locale }: { locale: Locale }) {
  const t = useTranslations('home.fomo')
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  const [slots, setSlots] = useState(3)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)
      const diff = end.getTime() - now.getTime()
      if (diff <= 0) {
        setTime({ h: 0, m: 0, s: 0 })
        return
      }
      setTime({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)

    // Slots drift down through the day so the banner feels alive.
    const hour = new Date().getHours()
    if (hour < 10) setSlots(5)
    else if (hour < 14) setSlots(3)
    else if (hour < 18) setSlots(2)
    else setSlots(1)

    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="fomo-banner"
      style={{
        background: 'linear-gradient(90deg, #B71C1C 0%, #DC2626 50%, #B71C1C 100%)',
        color: '#fff',
        boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.18)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-xs sm:text-sm font-semibold">
        <span
          className="fomo-dot inline-block rounded-full"
          aria-hidden="true"
          style={{ width: 8, height: 8, background: '#FFD23F', boxShadow: '0 0 0 0 rgba(255, 210, 63, 0.7)' }}
        />
        <span className="hidden sm:inline" style={{ letterSpacing: 0.2 }}>{t('promo')}</span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block rounded-md px-2 py-0.5 font-extrabold"
            style={{ background: '#FFD23F', color: '#1F2A6B', letterSpacing: 0.4 }}
          >
            {t('slotsLeft', { slots })}
          </span>
        </span>
        <span className="hidden sm:inline opacity-90">·</span>
        <span className="inline-flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span className="font-mono font-extrabold tracking-wider tabular-nums" style={{ background: 'rgba(0,0,0,0.28)', padding: '2px 6px', borderRadius: 4 }}>
            {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
          </span>
        </span>
        <a
          href={waRedirect(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline"
          style={{ color: '#FFD23F', fontWeight: 800 }}
        >
          {t('bookNow')} <span aria-hidden="true">→</span>
        </a>
      </div>
      <style jsx>{`
        :global(.fomo-dot) {
          animation: fomoPulse 1.6s ease-out infinite;
        }
        @keyframes fomoPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255, 210, 63, 0.85); }
          70%  { box-shadow: 0 0 0 8px rgba(255, 210, 63, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 210, 63, 0); }
        }
      `}</style>
    </div>
  )
}
