// Decorative ornaments used in hero, special section, and other accents.

interface Props {
  className?: string
}

export function RadialGlow({ className = '' }: Props) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{
        background:
          'radial-gradient(circle at 90% 10%, var(--saffron-soft) 0%, transparent 60%)',
      }}
      aria-hidden="true"
    />
  )
}

export function CornerBlob({
  position = 'top-right',
  className = '',
}: Props & { position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }) {
  const map: Record<string, string> = {
    'top-right': '-top-16 -right-12',
    'top-left': '-top-16 -left-12',
    'bottom-right': '-bottom-16 -right-12',
    'bottom-left': '-bottom-16 -left-12',
  }
  return (
    <div
      className={`pointer-events-none absolute h-64 w-64 rounded-full blur-3xl ${map[position]} ${className}`}
      style={{ background: 'rgba(244, 129, 31, 0.22)' }}
      aria-hidden="true"
    />
  )
}
