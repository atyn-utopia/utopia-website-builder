'use client'

// Wraps any clickable WhatsApp element (anchor, button, etc.) and fires
// `window.uwc('click', { label: 'whatsapp-<phone>' })` before the click is
// allowed to proceed. Uses display:contents so it adds zero layout impact —
// the wrapped child renders exactly as if no wrapper existed.

import { useCallback, type ReactNode } from 'react'

interface Props {
  phone: string
  children: ReactNode
}

export default function WhatsAppClickTracker({ phone, children }: Props) {
  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.uwc) {
      window.uwc('click', { label: `whatsapp-${phone}` })
    }
  }, [phone])

  return (
    <span style={{ display: 'contents' }} onClick={handleClick}>
      {children}
    </span>
  )
}
