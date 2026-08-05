'use client'

// Branded interstitial — the fleet default (reference: water-tank-malaysia).
// Logo + spinner + localised copy, with a plain <a> fallback so the handoff
// still works with JS disabled or when the automatic redirect is blocked.
//
// Replaces the previous generic WhatsApp-bubble screen with hardcoded English
// copy. It is a fixed full-screen overlay rather than a 60vh block, so the
// interstitial never renders half-scrolled behind page chrome.

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { siteConfig } from '@/config/site'

export default function RedirectClient({ url }: { url: string }) {
  const t = useTranslations('redirect')

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.location.href = url
  }, [url])

  return (
    <div className="redir-overlay">
      <div className="redir-inner">
        <span className="redir-lockup">
          <span className="redir-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26">
              <circle cx="9" cy="22" r="5" fill="#fff" />
              <circle cx="9" cy="22" r="2" fill="#FF6B35" />
              <circle cx="23" cy="22" r="5" fill="#fff" />
              <circle cx="23" cy="22" r="2" fill="#FF6B35" />
              <path d="M12 19 L14 12 L19 12 L22 16 L26 16 L26 21 L22 21 L20 18 Z" fill="#fff" />
              <path d="M19 12 L22 8 L25 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
          <span className="redir-wordmark">{siteConfig.brandName}</span>
        </span>
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
        .redir-lockup { display: inline-flex; align-items: center; gap: 10px; margin: 0 auto 1.5rem; }
        .redir-mark {
          display: inline-flex; width: 42px; height: 42px; border-radius: 12px;
          background: var(--brand-primary, #FF6B35);
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .redir-wordmark { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--brand-dark, #16213E); }
        .redir-spinner { width: 48px; height: 48px; margin: 0 auto 1.5rem; position: relative; }
        .redir-spinner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid rgba(37, 211, 102, 0.2); border-top-color: #25D366;
          animation: redir-spin 0.8s linear infinite;
        }
        @keyframes redir-spin { to { transform: rotate(360deg); } }
        .redir-heading { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.02em; color: var(--brand-dark, #16213E); margin: 0 0 0.5rem; line-height: 1.2; }
        .redir-subtext { font-size: 0.9rem; color: var(--brand-text-muted, #6B7B8D); margin: 0 0 1.5rem; line-height: 1.4; }
        .redir-fallback { font-size: 0.85rem; color: #25D366; font-weight: 600; text-decoration: none; }
        .redir-fallback:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
