'use client'

import { useEffect, useState } from 'react'

const WA_GREEN = '#25D366'

function getSecondsUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(23, 59, 59, 0)
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
}

export function CountdownStrip({ waLink, label }: { waLink: string; label: string }) {
  const [secs, setSecs] = useState<number | null>(null)

  useEffect(() => {
    setSecs(getSecondsUntilMidnight())
    const id = setInterval(() => setSecs(getSecondsUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [])

  if (secs === null) return null

  const h = String(Math.floor(secs / 3600)).padStart(2, '0')
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')

  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-white text-sm font-semibold flex-wrap"
      style={{ background: '#C0392B' }}
    >
<span>{label}</span>

      {/* Countdown blocks */}
      <div className="flex items-center gap-1 font-mono font-bold text-base">
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>{h}</span>
        <span className="opacity-75">:</span>
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>{m}</span>
        <span className="opacity-75">:</span>
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>{s}</span>
      </div>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-opacity hover:opacity-90"
        style={{ background: WA_GREEN, color: 'white' }}
      >
        Claim Now →
      </a>
    </div>
  )
}
