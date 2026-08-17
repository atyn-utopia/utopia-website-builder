'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Canonical Utopia WhatsApp interstitial (templates/site-chrome +
 * water-tank-malaysia): branded logo, green spinner, heading + subtext, and a
 * plain <a> fallback so the handoff still works with JS disabled.
 *
 * The wa.me URL is resolved SERVER-side in page.tsx and passed in — never
 * fetched from the client, which is what makes the live-DB check pass.
 */
export default function RedirectClient({ url }: { url: string }) {
  const t = useTranslations('redirect');

  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div className="redir-overlay">
      <div className="redir-inner">
        <span className="redir-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </span>
        <span className="redir-brand">Ibnu Sina Care</span>
        <div className="redir-spinner" aria-hidden="true" />
        <h1 className="redir-heading">{t('heading')}</h1>
        <h2 className="redir-subtext">{t('subtext')}</h2>
        <a href={url} className="redir-fallback">{t('fallback')}</a>
      </div>

      <style>{`
        .redir-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .redir-inner { text-align: center; max-width: 400px; }
        .redir-logo {
          width: 64px; height: 64px; border-radius: 18px; background: #0f766e;
          display: inline-flex; align-items: center; justify-content: center;
          color: #fff; margin: 0 auto 0.75rem;
        }
        .redir-logo svg { width: 38px; height: 38px; }
        .redir-brand {
          display: block; margin-bottom: 1.5rem;
          font-family: var(--font-rubik), Rubik, system-ui, sans-serif;
          font-size: 1.1rem; color: #115e59; line-height: 1.2;
        }
        .redir-spinner { width: 48px; height: 48px; margin: 0 auto 1.5rem; position: relative; }
        .redir-spinner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid rgba(37, 211, 102, 0.2); border-top-color: #25D366;
          animation: redir-spin 0.8s linear infinite;
        }
        @keyframes redir-spin { to { transform: rotate(360deg); } }
        .redir-heading {
          font-size: 1.3rem; font-weight: 700; letter-spacing: -0.02em;
          color: #134e4a; margin: 0 0 0.5rem; line-height: 1.2;
          font-family: var(--font-rubik), Rubik, system-ui, sans-serif;
        }
        .redir-subtext { font-size: 0.9rem; font-weight: 400; color: #6b7280; margin: 0 0 1.5rem; line-height: 1.4; }
        .redir-fallback { font-size: 0.85rem; color: #25D366; font-weight: 600; text-decoration: none; }
        .redir-fallback:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
