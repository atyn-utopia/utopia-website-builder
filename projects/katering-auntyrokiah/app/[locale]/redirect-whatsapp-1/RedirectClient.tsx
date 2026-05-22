'use client'

import { useEffect } from 'react'

interface Props {
  url: string
  openingLabel: string
  fallbackLabel: string
}

export default function RedirectClient({ url, openingLabel, fallbackLabel }: Props) {
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
        fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
        background: '#FFFFFF',
        color: '#1F1A17',
      }}
    >
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ marginBottom: '14px', fontSize: '18px', fontWeight: 600 }}>
          {openingLabel}
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
            boxShadow: '0 12px 24px -12px rgba(37, 211, 102, 0.5)',
          }}
        >
          {fallbackLabel}
        </a>
      </div>
    </div>
  )
}
