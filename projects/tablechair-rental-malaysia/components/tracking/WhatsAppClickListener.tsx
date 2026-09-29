'use client'

import { useEffect } from 'react'

/**
 * Reports every WhatsApp CTA click to the webcore tracker as
 * `uwc('click', { label: 'whatsapp-<where>' })`.
 *
 * The CTAs are plain server-rendered links to /redirect-whatsapp-1 spread over
 * the header, FOMO banner, hero, product cards and blog, so one listener on the
 * document catches them all instead of wrapping each link. `<where>` is the
 * first path segment after the locale that the click happened on ("home" for
 * the homepage), which is enough to tell location pages from the rest.
 */
export default function WhatsAppClickListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]')
      if (!a || !a.getAttribute('href')?.includes('/redirect-whatsapp-1')) return
      if (typeof window.uwc !== 'function') return
      const parts = window.location.pathname.split('/').filter(Boolean)
      const rest = ['en', 'ms', 'zh'].includes(parts[0] ?? '') ? parts.slice(1) : parts
      window.uwc('click', { label: `whatsapp-${rest[0] ?? 'home'}` })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
