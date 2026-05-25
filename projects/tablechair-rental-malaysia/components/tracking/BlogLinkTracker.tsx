'use client'

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

export default function BlogLinkTracker({
  slug,
  href,
  children,
  style,
  className,
}: {
  slug: string
  href: string
  children: ReactNode
  style?: CSSProperties
  className?: string
}) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={() => {
        if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
          window.uwc('click', { label: `blog-${slug}` })
        }
      }}
    >
      {children}
    </Link>
  )
}
