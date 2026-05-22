// Shared visual primitives — Eyebrow, SectionHead, Button, GoogleG, BrandLogo.
// Does NOT wrap pages in chrome. Each page (homepage, location, blog) owns its
// own header/footer per the architecture layout-ownership rule.

import Image from 'next/image'
import type { ReactNode } from 'react'

interface EyebrowProps {
  children: ReactNode
  variant?: 'default' | 'light' | 'bare'
  className?: string
}

export function Eyebrow({ children, variant = 'default', className = '' }: EyebrowProps) {
  const base =
    variant === 'light'
      ? 'eyebrow eyebrow-light'
      : variant === 'bare'
        ? 'eyebrow eyebrow-bare'
        : 'eyebrow'
  return <p className={`${base} ${className}`.trim()}>{children}</p>
}

interface SectionHeadProps {
  eyebrow: string
  heading: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  variant?: 'default' | 'light'
  className?: string
}

export function SectionHead({
  eyebrow,
  heading,
  intro,
  align = 'center',
  variant = 'default',
  className = '',
}: SectionHeadProps) {
  const alignClass =
    align === 'center'
      ? 'text-center mx-auto items-center'
      : 'text-left items-start'
  const headingColor = variant === 'light' ? 'text-white' : 'text-[var(--ink)]'
  const introColor =
    variant === 'light' ? 'text-white/85' : 'text-[var(--ink-soft)]'
  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignClass} ${className}`.trim()}>
      <Eyebrow variant={variant === 'light' ? 'light' : 'default'}>{eyebrow}</Eyebrow>
      <h3
        className={`text-[clamp(26px,3.6vw,36px)] font-extrabold leading-[1.15] tracking-[-0.03em] ${headingColor}`}
      >
        {heading}
      </h3>
      {intro ? (
        <p className={`text-[15px] md:text-[16px] leading-[1.7] ${introColor}`}>
          {intro}
        </p>
      ) : null}
    </div>
  )
}

interface ButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'ghost' | 'ghost-light'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  fullWidth?: boolean
  target?: string
  rel?: string
  ariaLabel?: string
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--wa-green)] text-white hover:bg-[var(--wa-green-hover)] shadow-[0_10px_24px_-10px_rgba(37,211,102,0.5)]',
  secondary:
    'bg-[var(--honey)] text-[var(--forest-deep)] hover:bg-[var(--honey-bright)] shadow-[0_8px_20px_-8px_rgba(244,193,21,0.5)]',
  whatsapp:
    'bg-[var(--wa-green)] text-white hover:bg-[var(--wa-green-hover)] shadow-[0_8px_20px_-8px_rgba(37,211,102,0.4)]',
  ghost: 'bg-transparent text-white/90 hover:text-[var(--honey-bright)] underline-offset-4 hover:underline decoration-[var(--honey)]',
  'ghost-light':
    'bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/60',
}

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-[13px]',
  default: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-[16px]',
}

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  fullWidth = false,
  target,
  rel,
  ariaLabel,
}: ButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--saffron)] focus-visible:ring-offset-2',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        transition:
          'transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease, border-color 200ms ease, color 200ms ease',
      }}
    >
      {children}
    </a>
  )
}

// Google "G" multi-stroke logo (per design-direction §8)
export function GoogleG({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// Brand logo — renders the user-supplied PNG logo file at the requested size.
// Replaces the previous hand-recreated SVG crest. Maintains transparent background
// per CLAUDE.md cutout rule (no container/box behind the logo).
export function BrandLogo({
  width = 64,
  className = '',
  priority = false,
}: {
  width?: number
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src="/brand/logo.png"
      alt="AuntyRokiah Katering"
      width={width}
      height={width}
      priority={priority}
      className={className}
      style={{ height: 'auto', width: `${width}px` }}
    />
  )
}

// WhatsApp icon
export function WhatsAppIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
    </svg>
  )
}

// Decorative filigree — heritage flourish used to bracket eyebrow lines and dividers.
export function Filigree({
  className = '',
  flip = false,
}: {
  className?: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox="0 0 64 12"
      width={64}
      height={12}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path
        d="M2 6 L 28 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="30" cy="6" r="1.5" fill="currentColor" />
      <path
        d="M33 6 C 38 6, 40 2, 45 2 C 48 2, 50 4, 50 6 C 50 8, 48 10, 45 10 C 40 10, 38 6, 33 6 Z"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
      />
      <circle cx="56" cy="6" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="60" cy="6" r="0.6" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
