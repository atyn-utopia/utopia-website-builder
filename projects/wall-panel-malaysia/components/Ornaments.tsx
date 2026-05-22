// Decorative SVG ornaments — four-stroke fluted slats W mark used as the
// brand mark and favicon, plus a subtle horizontal panel-slat background.

// Four-stroke fluted slats forming a W silhouette. Doubles as the brand
// mark in the header logo and as the favicon. Sizing controlled by the
// className passed in.
export function FlutedMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="7" fill="#13204C" />
      {/* Four vertical fluted slats — outer tall, inner shorter (W silhouette) */}
      <rect x="6.5" y="6" width="3" height="17" rx="1" fill="#FBF7EF" />
      <rect x="11" y="9" width="3" height="14" rx="1" fill="#FBF7EF" />
      <rect x="15.5" y="9" width="3" height="14" rx="1" fill="#FBF7EF" />
      <rect x="20" y="6" width="3" height="17" rx="1" fill="#FBF7EF" />
      {/* Gold baseline tying the slats together */}
      <rect x="5" y="24.5" width="20" height="1.6" rx="0.8" fill="#C8A45C" />
    </svg>
  )
}

// On dark backgrounds (hero overlay, footer) — cream slats only, no nav bg.
export function FlutedMarkLight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x="6.5" y="6" width="3" height="17" rx="1" fill="#FBF7EF" />
      <rect x="11" y="9" width="3" height="14" rx="1" fill="#FBF7EF" />
      <rect x="15.5" y="9" width="3" height="14" rx="1" fill="#FBF7EF" />
      <rect x="20" y="6" width="3" height="17" rx="1" fill="#FBF7EF" />
      <rect x="5" y="24.5" width="20" height="1.6" rx="0.8" fill="#C8A45C" />
    </svg>
  )
}

// Subtle horizontal panel-slat background pattern. Use as a decorative
// background fill in cards or section backgrounds at very low opacity (5-8%).
export function PanelGrid({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern
          id="wp-panel-grid"
          x="0"
          y="0"
          width="20"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C8A45C" strokeWidth="0.5" />
          <line x1="0" y1="8" x2="20" y2="8" stroke="#C8A45C" strokeWidth="0.25" opacity="0.6" />
          <line x1="0" y1="15.5" x2="20" y2="15.5" stroke="#C8A45C" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#wp-panel-grid)" />
    </svg>
  )
}

// Gold hairline divider used between sections.
export function GoldHairline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        height: '1px',
        background:
          'linear-gradient(90deg, transparent 0%, #C8A45C 50%, transparent 100%)',
      }}
    />
  )
}
