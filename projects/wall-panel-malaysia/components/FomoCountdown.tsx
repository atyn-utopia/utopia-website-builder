'use client'

import { useEffect, useState } from 'react'

// Live countdown that ticks down to the next midnight (resets daily so the
// promo always feels fresh). Mono digits stay readable on the red banner.
export default function FomoCountdown() {
  const [time, setTime] = useState<string>('--:--:--')

  useEffect(() => {
    function tick() {
      const now = new Date()
      const target = new Date(now)
      target.setHours(23, 59, 59, 999)
      const diff = target.getTime() - now.getTime()
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1000)
      const pad = (n: number) => String(n).padStart(2, '0')
      setTime(`${pad(h)}:${pad(m)}:${pad(s)}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className="font-mono tabular-nums"
      style={{
        fontFamily: 'var(--font-jetbrains), ui-monospace, monospace',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {time}
    </span>
  )
}
