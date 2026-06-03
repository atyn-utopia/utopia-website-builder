'use client'

import { useEffect } from 'react'

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url
  }, [url])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--brand-cream)' }}>
      <div className="text-center">
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-navy)' }}>Redirecting to WhatsApp...</p>
        <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
          If you are not redirected,{' '}
          <a href={url} className="underline" style={{ color: 'var(--brand-navy)' }}>click here</a>.
        </p>
      </div>
    </div>
  )
}
