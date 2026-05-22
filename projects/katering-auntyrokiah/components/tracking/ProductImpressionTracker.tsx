'use client'

// Wraps a product card and fires window.uwc('impression', { label: 'product-<slug>' })
// exactly once when the card scrolls into view (>=50% visible).

import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  slug: string
  children: ReactNode
}

export default function ProductImpressionTracker({ slug, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && window.uwc) {
            window.uwc('impression', { label: `product-${slug}` })
            observer.disconnect()
          }
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [slug])

  return (
    <div ref={ref} className="h-full">
      {children}
    </div>
  )
}
