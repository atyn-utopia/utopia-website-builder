'use client'

import { useEffect } from 'react'

interface Props { url: string; locale: string }

export function RedirectClient({ url, locale }: Props) {
  useEffect(() => {
    window.location.replace(url)
  }, [url])

  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        fontFamily: 'Inter, sans-serif',
        color: '#1E2430',
      }}
    >
      <p style={{ fontWeight: 700, fontSize: 18 }}>
        {locale === 'zh' ? '正在跳转到 WhatsApp…' : locale === 'en' ? 'Redirecting to WhatsApp…' : 'Mengalihkan ke WhatsApp…'}
      </p>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#17A890', fontWeight: 700 }}>
        {locale === 'zh' ? '手动点击打开' : locale === 'en' ? 'Tap here if not redirected' : 'Tekan di sini jika tidak beralih'}
      </a>
    </main>
  )
}
