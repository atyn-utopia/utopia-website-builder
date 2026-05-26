'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * Wraps a product card and fires `uwc('impression', { label: 'product-<slug>' })`
 * once when the card scrolls into view.
 */
export default function ProductImpressionTracker({
  slug, children, className, style,
}: {
  slug: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired.current) {
            fired.current = true
            if (typeof window.uwc === 'function') {
              window.uwc('impression', { label: `product-${slug}` })
            }
            obs.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [slug])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
