'use client'

// Live FOMO countdown — ticks hours:minutes:seconds down to the end of the
// current day so the "order before cutoff" urgency is always real and visibly
// moving. Mandatory per CLAUDE.md (Frontend Design Rules → FOMO Banner).
import { useEffect, useState } from 'react'

function timeLeftToEndOfDay(): { hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  )
  const ms = Math.max(0, end.getTime() - now.getTime())
  return {
    hours: Math.floor(ms / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function FomoCountdown() {
  // null until mounted so the server-rendered markup matches the first client
  // render (avoids hydration drift); a hidden placeholder reserves the width.
  const [left, setLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)

  useEffect(() => {
    const tick = () => setLeft(timeLeftToEndOfDay())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      aria-live="polite"
      className="inline-flex shrink-0 items-center gap-1 font-mono text-[12px] font-bold tabular-nums text-[#FDD835] sm:text-[13px]"
    >
      {left ? (
        <>
          <span>{pad(left.hours)}</span>
          <span className="opacity-60">:</span>
          <span>{pad(left.minutes)}</span>
          <span className="opacity-60">:</span>
          <span>{pad(left.seconds)}</span>
        </>
      ) : (
        <span style={{ visibility: 'hidden' }}>00:00:00</span>
      )}
    </span>
  )
}
