'use client'

import { useCallback, type ReactNode } from 'react'

interface Props {
  slug: string
  children: ReactNode
}

export default function BlogClickTracker({ slug, children }: Props) {
  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.uwc) {
      window.uwc('click', { label: `blog-${slug}` })
    }
  }, [slug])

  return (
    <span style={{ display: 'contents' }} onClick={handleClick}>
      {children}
    </span>
  )
}
