'use client'

import type { CSSProperties, ReactNode, MouseEventHandler } from 'react'

interface WhatsAppClickTrackerProps {
  href: string
  label: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  target?: string
  rel?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export default function WhatsAppClickTracker({
  href,
  label,
  children,
  className,
  style,
  target,
  rel,
  onClick,
}: WhatsAppClickTrackerProps) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      target={target}
      rel={rel}
      onClick={(e) => {
        if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
          window.uwc('click', { label: `whatsapp-${label}` })
        }
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
