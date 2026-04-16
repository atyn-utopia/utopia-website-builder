'use client'

import { useEffect } from 'react'

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      window.location.href = url
    } else {
      setTimeout(() => {
        if (window.history.length > 1) window.history.back()
        else window.location.href = '/'
      }, 150)
    }
  }, [url])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        background: '#FFFEF8',
        color: '#111111',
      }}
    >
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
          Opening WhatsApp…
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '999px',
            background: '#25D366',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
          }}
        >
          Click here if it did not open
        </a>
      </div>
    </div>
  )
}
