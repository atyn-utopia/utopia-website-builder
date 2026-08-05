'use client'

// Branded interstitial — the fleet default (reference: water-tank-malaysia).
// Logo + spinner + localised copy, with a plain <a> fallback so the handoff
// still works with JS disabled or when the automatic redirect is blocked.
//
// Replaces the previous unbranded screen with hardcoded English copy.

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function RedirectClient({ url }: { url: string }) {
  const t = useTranslations('redirect')

  useEffect(() => {
    window.location.href = url
  }, [url])

  return (
    <div className="redir-overlay">
      <div className="redir-inner">
        <span className="redir-lockup">
          {/* Logo icon = the favicon, so the two always match. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="Encik Beku" className="redir-logo" />
          <span className="redir-wordmark">Encik Beku</span>
        </span>
        <div className="redir-spinner" aria-hidden="true" />
        <h1 className="redir-heading">{t('heading')}</h1>
        <p className="redir-subtext">{t('subtext')}</p>
        <a href={url} className="redir-fallback">{t('fallback')}</a>
      </div>

      <style>{`
        .redir-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: var(--brand-cream, #F8FAFF);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          font-family: var(--font), Inter, system-ui, sans-serif;
        }
        .redir-inner { text-align: center; max-width: 400px; }
        .redir-lockup { display: inline-flex; align-items: center; gap: 10px; margin: 0 auto 1.5rem; }
        .redir-logo { width: 44px; height: 44px; display: block; }
        .redir-wordmark { font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em; color: var(--brand-navy, #1B3A5C); }
        .redir-spinner { width: 48px; height: 48px; margin: 0 auto 1.5rem; position: relative; }
        .redir-spinner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid rgba(37, 211, 102, 0.2); border-top-color: #25D366;
          animation: redir-spin 0.8s linear infinite;
        }
        @keyframes redir-spin { to { transform: rotate(360deg); } }
        .redir-heading { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.02em; color: var(--brand-text, #1C2B3A); margin: 0 0 0.5rem; line-height: 1.2; }
        .redir-subtext { font-size: 0.9rem; color: var(--brand-text-muted, #5A6B7D); margin: 0 0 1.5rem; line-height: 1.4; }
        .redir-fallback { font-size: 0.85rem; color: #25D366; font-weight: 600; text-decoration: none; }
        .redir-fallback:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
