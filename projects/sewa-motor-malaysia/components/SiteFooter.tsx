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
          <p className="footer-brand">Sewa Motor Malaysia</p>
          <p className="footer-tagline">{t('tagline')}</p>
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
        .site-footer-inner { max-width: 1200px; margin: 0 auto; padding: 48px 20px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px; }
        .footer-col { display: flex; flex-direction: column; gap: 10px; }
        .footer-brand { font-weight: 800; font-size: 18px; color: #fff; margin: 0; }
        .footer-tagline { color: #94A3B8; font-size: 14px; line-height: 1.55; margin: 0; }
        .footer-heading { font-weight: 700; font-size: 13px; color: #fff; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 4px; }
        .footer-col a { color: #CBD5E1; font-size: 14px; }
        .footer-col a:hover { color: #fff; }
        .site-footer-bar { border-top: 1px solid #1E293B; padding: 18px 20px; text-align: center; font-size: 12px; color: #94A3B8; }
        .site-footer-bar p { margin: 0; }
      `}</style>
    </footer>
  );
}
