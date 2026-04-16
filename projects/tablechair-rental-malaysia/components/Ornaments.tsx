// Decorative SVG ornaments — draped fabric arch, bunga manggar, bunting.

export function DrapedFabricArch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="drape-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFEE58" />
        </linearGradient>
      </defs>
      <path
        d="M0,0 L0,24 C60,58 120,58 150,28 C180,58 240,58 300,28 C360,58 420,58 450,28 C480,58 540,58 600,28 C660,58 720,58 750,28 C780,58 840,58 900,28 C960,58 1020,58 1050,28 C1080,58 1140,58 1200,24 L1200,0 Z"
        fill="url(#drape-fill)"
        stroke="#FDD835"
        strokeWidth="1"
        strokeOpacity="0.4"
      />
    </svg>
  )
}

export function DrapedFabricArchInverted({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0,48 L0,24 C60,-10 120,-10 150,20 C180,-10 240,-10 300,20 C360,-10 420,-10 450,20 C480,-10 540,-10 600,20 C660,-10 720,-10 750,20 C780,-10 840,-10 900,20 C960,-10 1020,-10 1050,20 C1080,-10 1140,-10 1200,24 L1200,48 Z"
        fill="#FFFEF8"
      />
    </svg>
  )
}

export function BungaManggar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <g stroke="#FDD835" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M24 6 L24 42" />
        <path d="M24 14 Q14 14 10 22" />
        <path d="M24 14 Q34 14 38 22" />
        <path d="M24 22 Q12 22 6 32" />
        <path d="M24 22 Q36 22 42 32" />
        <path d="M24 30 Q14 30 10 40" />
        <path d="M24 30 Q34 30 38 40" />
      </g>
      <circle cx="24" cy="6" r="2.5" fill="#FDD835" />
      <circle cx="10" cy="22" r="1.8" fill="#F9A825" />
      <circle cx="38" cy="22" r="1.8" fill="#F9A825" />
      <circle cx="6" cy="32" r="1.8" fill="#FDD835" />
      <circle cx="42" cy="32" r="1.8" fill="#FDD835" />
      <circle cx="10" cy="40" r="1.8" fill="#F9A825" />
      <circle cx="38" cy="40" r="1.8" fill="#F9A825" />
    </svg>
  )
}

// Kak Kenduri canopy tent icon — side-view pitched tent with scalloped valance.
// Reads clearly at 36-48px in the header.
export function KKMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="kk-canopy-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDD835" />
          <stop offset="100%" stopColor="#F9A825" />
        </linearGradient>
      </defs>
      {/* Canopy roof — tall peaked tent shape */}
      <path
        d="M24 4 L6 28 L42 28 Z"
        fill="url(#kk-canopy-fill)"
      />
      {/* White stripe on roof for depth */}
      <path
        d="M24 10 L14 28 L34 28 Z"
        fill="#FFFFFF"
        opacity="0.3"
      />
      {/* Center pole line */}
      <line x1="24" y1="4" x2="24" y2="44" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
      {/* Scalloped valance along bottom of roof */}
      <path
        d="M6 28 C9 33, 13 33, 16 28 C19 33, 23 33, 26 28 C29 33, 33 33, 36 28 C39 33, 43 33, 42 28"
        fill="none"
        stroke="#F9A825"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Left support pole */}
      <line x1="10" y1="28" x2="8" y2="44" stroke="#111111" strokeWidth="1.6" strokeLinecap="round" />
      {/* Right support pole */}
      <line x1="38" y1="28" x2="40" y2="44" stroke="#111111" strokeWidth="1.6" strokeLinecap="round" />
      {/* Ground line */}
      <line x1="4" y1="44" x2="44" y2="44" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}

export function BuntingStrip({ className }: { className?: string }) {
  const flags = Array.from({ length: 24 })
  const colors = ['#FDD835', '#F9A825', '#FFF9C4']
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M0,6 Q600,18 1200,6" stroke="#FDD835" strokeWidth="1" fill="none" opacity="0.7" />
      {flags.map((_, i) => {
        const x = (i + 0.5) * (1200 / flags.length)
        const color = colors[i % 3]
        const dip = Math.sin((i / flags.length) * Math.PI) * 4
        return (
          <polygon
            key={i}
            points={`${x - 16},${8 + dip} ${x + 16},${8 + dip} ${x},${32 + dip}`}
            fill={color}
            opacity="0.9"
          />
        )
      })}
    </svg>
  )
}
