'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { KKMark } from '@/components/Ornaments';

// Default redirect layout, matching the fleet reference
// (water-tank-malaysia/app/[locale]/redirect-whatsapp-1/RedirectClient.tsx):
// full-bleed white overlay, brand mark, spinner, i18n heading + subtext, and a
// manual fallback link for when the automatic hand-off is blocked.
// Accent colour is WhatsApp green on every site — it is the affordance here.
export default function RedirectClient({ url }: { url: string }) {
  const t = useTranslations('redirect');

  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div className="redir-overlay">
      <div className="redir-inner">
        <KKMark className="redir-mark h-16 w-16" />
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
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
        }
        .redir-inner { text-align: center; max-width: 400px; }
        .redir-logo { width: auto; height: 64px; margin: 0 auto 1.5rem; display: block; }
        .redir-mark { margin: 0 auto 1.5rem; display: block; }
        .redir-spinner { width: 48px; height: 48px; margin: 0 auto 1.5rem; position: relative; }
        .redir-spinner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid rgba(37, 211, 102, 0.2); border-top-color: #25D366;
          animation: redir-spin 0.8s linear infinite;
        }
        @keyframes redir-spin { to { transform: rotate(360deg); } }
        .redir-heading { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.02em; color: #111111; margin: 0 0 0.5rem; line-height: 1.2; }
        .redir-subtext { font-size: 0.9rem; color: #6b7280; margin: 0 0 1.5rem; line-height: 1.4; }
        .redir-fallback { font-size: 0.85rem; color: #25D366; font-weight: 600; text-decoration: none; }
        .redir-fallback:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
