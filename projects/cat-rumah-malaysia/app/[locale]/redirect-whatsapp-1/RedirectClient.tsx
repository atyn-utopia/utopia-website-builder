'use client'

// Branded interstitial — the fleet default (reference: water-tank-malaysia).
// Logo + spinner + localised copy, with a plain <a> fallback so the handoff
// still works with JS disabled or when the automatic redirect is blocked.
//
// Replaces the previous unbranded screen, which had no logo or spinner, sat in
// a 60vh block rather than a full-screen overlay, hardcoded its copy through
// inline locale ternaries instead of the `redirect` namespace, and coloured the
// fallback link brand-teal rather than WhatsApp green.

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export function RedirectClient({ url }: { url: string }) {
  const t = useTranslations('redirect')

  useEffect(() => {
    window.location.replace(url)
  }, [url])

  return (
    <div className="redir-overlay">
      <div className="redir-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/logo-light.png" alt="Cat Rumah Express" className="redir-logo" />
        <div className="redir-spinner" aria-hidden="true" />
        <h1 className="redir-heading">{t('heading')}</h1>
        <p className="redir-subtext">{t('subtext')}</p>
        <a href={url} className="redir-fallback">{t('fallback')}</a>
      </div>

      <style>{`
        .redir-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          font-family: var(--font), Inter, system-ui, sans-serif;
        }
        .redir-inner { text-align: center; max-width: 400px; }
        .redir-logo { width: auto; height: 96px; margin: 0 auto 1.5rem; display: block; }
        .redir-spinner { width: 48px; height: 48px; margin: 0 auto 1.5rem; position: relative; }
        .redir-spinner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid rgba(37, 211, 102, 0.2); border-top-color: #25D366;
          animation: redir-spin 0.8s linear infinite;
        }
        @keyframes redir-spin { to { transform: rotate(360deg); } }
        .redir-heading { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.02em; color: var(--brand-ink, #111111); margin: 0 0 0.5rem; line-height: 1.2; }
        .redir-subtext { font-size: 0.9rem; color: var(--muted, #5F6470); margin: 0 0 1.5rem; line-height: 1.4; }
        .redir-fallback { font-size: 0.85rem; color: #25D366; font-weight: 600; text-decoration: none; }
        .redir-fallback:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
