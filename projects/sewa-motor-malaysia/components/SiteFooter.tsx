'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="footer-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="28" height="28">
                <circle cx="9" cy="22" r="5" fill="#fff" />
                <circle cx="9" cy="22" r="2" fill="#FF6B35" />
                <circle cx="23" cy="22" r="5" fill="#fff" />
                <circle cx="23" cy="22" r="2" fill="#FF6B35" />
                <path d="M12 19 L14 12 L19 12 L22 16 L26 16 L26 21 L22 21 L20 18 Z" fill="#fff" />
                <path d="M19 12 L22 8 L25 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span className="footer-brand-text">Sewa Motor Malaysia</span>
          </div>
          <h5 className="footer-tagline">{t('tagline')}</h5>
        </div>
        <div className="footer-col">
          <p className="footer-heading">{t('quickLinks')}</p>
          <Link href={`/${locale}`}>{nav('home')}</Link>
          <Link href={`/${locale}#products`}>{nav('products')}</Link>
          <Link href={`/${locale}/blog`}>{nav('blog')}</Link>
        </div>
        <div className="footer-col">
          <p className="footer-heading">{t('topLocations')}</p>
          <Link href={`/${locale}/sewa-motor/kuala-lumpur`}>Kuala Lumpur</Link>
          <Link href={`/${locale}/sewa-motor/petaling-jaya`}>Petaling Jaya</Link>
          <Link href={`/${locale}/sewa-motor/shah-alam`}>Shah Alam</Link>
        </div>
      </div>
      <div className="site-footer-bar">
        <p>{t('copyright', { year })}</p>
        <a
          className="utopia-credit"
          href="https://utopiagroup.com.my"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Built by Utopia AI"
        >
          <span className="utopia-credit-by">Built by</span>
          <span className="utopia-credit-word">Utopia</span>
          <svg className="utopia-tri" viewBox="0 0 64 56" width="11" height="10" aria-hidden="true">
            <defs>
              <linearGradient id="utopiaCreditGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0054A6" />
                <stop offset="60%" stopColor="#2774AE" />
                <stop offset="100%" stopColor="#4A9DD0" />
              </linearGradient>
            </defs>
            <polygon points="32,4 60,52 4,52" fill="url(#utopiaCreditGrad)" />
          </svg>
          <span className="utopia-credit-word">AI</span>
        </a>
      </div>
      <style jsx>{`
        .site-footer { background: #0F172A; color: #E2E8F0; }
        .site-footer-inner { max-width: 1200px; margin: 0 auto; padding: 72px 24px 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 56px; }
        .footer-col { display: flex; flex-direction: column; gap: 16px; }
        .footer-brand { display: inline-flex; align-items: center; gap: 10px; margin: 0 0 4px; }
        .footer-brand-icon { display: inline-flex; width: 32px; height: 32px; border-radius: 9px; background: var(--brand-primary, #FF6B35); align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-brand-text { font-weight: 800; font-size: 15px; color: #fff; letter-spacing: -0.01em; }
        .footer-tagline { color: #94A3B8; font-size: 14px; line-height: 1.7; margin: 0; max-width: 30ch; }
        .footer-heading { font-weight: 700; font-size: 13px; color: #fff; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 8px; }
        /* .footer-col a styled in globals.css — the footer links are
           next/link <Link> elements, which don't receive styled-jsx's
           scope class, so a scoped rule here never matched and the links
           fell back to the browser-default 16px (inconsistent with the
           13–15px footer text). Same workaround as .site-brand/.nav-cta. */
        .site-footer-bar { border-top: 1px solid #1E293B; padding: 22px 20px; display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; text-align: center; font-size: 12px; color: #94A3B8; }
        .site-footer-bar p { margin: 0; }
        /* Utopia AI build credit — CI button rules: 8px radius, icon never
           compresses, easeOutExpo lift on hover. Mark carries Utopia's own
           gradient (correct brand-mark usage); site palette/fonts unchanged. */
        .utopia-credit {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: var(--r-button, 8px);
          color: #CBD5E1; font-size: 12px; font-weight: 600;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
          transition: transform var(--dur-hover, 220ms) var(--ease, ease),
                      border-color var(--dur-hover, 220ms) var(--ease, ease),
                      background-color var(--dur-hover, 220ms) var(--ease, ease);
        }
        .utopia-credit:hover {
          transform: translateY(-1px);
          border-color: rgba(74,157,208,0.55);
          background: rgba(39,116,174,0.12);
        }
        .utopia-credit-by { color: #64748B; }
        .utopia-credit-word { color: #F1F5F9; font-weight: 800; letter-spacing: -0.01em; }
        .utopia-tri { display: inline-block; flex-shrink: 0; }
        @media (max-width: 640px) {
          .site-footer-inner { padding: 48px 24px 32px; gap: 40px; text-align: center; }
          .footer-col { align-items: center; }
          .footer-tagline { max-width: none; }
        }
      `}</style>
    </footer>
  );
}
