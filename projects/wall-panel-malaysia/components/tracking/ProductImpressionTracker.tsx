'use client'

// Wraps a product card and fires `window.uwc('impression', { label: 'product-<slug>' })`
// exactly once when the card scrolls into view (>=50% visible), then disconnects
// the IntersectionObserver so it never fires again for the same card on this page.
//
// Renders a thin <div> wrapper with `h-full` so it occupies its grid cell exactly
// like the article it wraps — no visual or layout difference vs. the unwrapped form.

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
