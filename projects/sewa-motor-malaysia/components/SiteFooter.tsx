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
        .footer-col a { color: #CBD5E1; font-size: 14px; line-height: 1.4; padding: 3px 0; transition: color 0.2s; }
        .footer-col a:hover { color: #fff; }
        .site-footer-bar { border-top: 1px solid #1E293B; padding: 24px 20px; text-align: center; font-size: 12px; color: #94A3B8; }
        .site-footer-bar p { margin: 0; }
        @media (max-width: 640px) {
          .site-footer-inner { padding: 48px 24px 32px; gap: 40px; text-align: center; }
          .footer-col { align-items: center; }
          .footer-tagline { max-width: none; }
        }
      `}</style>
    </footer>
  );
}
