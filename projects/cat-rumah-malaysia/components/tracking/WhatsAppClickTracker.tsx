'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  phoneNumber: string
  children: ReactNode
}

/**
 * Anchor wrapper that fires `window.uwc('click', { label: 'whatsapp-<phone>' })`
 * on click before navigation runs. Used by every WhatsApp CTA — nav, hero,
 * mid-CTA, product card, final CTA.
 *
 * The original onClick (if any) still runs.
 */
export default function WhatsAppClickTracker({
  phoneNumber,
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        if (typeof window !== 'undefined' && window.uwc) {
          window.uwc('click', { label: `whatsapp-${phoneNumber}` })
        }
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
