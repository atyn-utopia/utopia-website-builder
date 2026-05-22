'use client'

import { useEffect, useState } from 'react'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'

interface Props {
  eyebrow: string
  line: string
  countdownLabel: string
  ctaLabel: string
  waHref: string
  phone: string
}

// Promo countdown — 14 days from current load.
function getDeadline(): number {
  const now = Date.now()
  return now + 14 * 24 * 60 * 60 * 1000
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function FomoBanner({
  eyebrow,
  line,
  countdownLabel,
  ctaLabel,
  waHref,
  phone,
}: Props) {
  const [deadline] = useState<number>(() => getDeadline())
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = Math.max(0, deadline - now)
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

  return (
    <div className="sticky top-0 z-50 w-full bg-[var(--sambal)] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[12px] sm:text-[13px]">
        <p className="hidden font-semibold uppercase tracking-[0.14em] sm:inline-block">
          {eyebrow}
        </p>
        <div className="flex flex-1 items-center justify-center gap-2 text-center">
          <span className="hidden font-medium sm:inline">{line}</span>
          <span className="font-bold tabular-nums">
            <span className="opacity-80 mr-2 hidden sm:inline">
              {countdownLabel}
            </span>
            {days > 0 ? `${days}d ` : ''}
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </span>
        </div>
        <WhatsAppClickTracker phone={phone}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/20"
            style={{ transition: 'background-color 180ms ease' }}
          >
            {ctaLabel}
          </a>
        </WhatsAppClickTracker>
      </div>
    </div>
  )
}
