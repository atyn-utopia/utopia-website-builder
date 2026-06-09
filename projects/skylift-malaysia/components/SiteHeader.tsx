'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import NavCtaGlobalStyle from '@/components/NavCtaGlobalStyle';
import { waRedirect } from '@/lib/waRedirect';

function BrandLogo() {
  return (
    <span className="brand-lockup brand-lockup--dark">
      <svg className="brand-lockup-icon" viewBox="0 0 64 48" fill="none" aria-hidden="true">
        <path d="M3 8 L3 18 L13 18 L13 8 Z M5 10 L11 10 L11 16 L5 16 Z" fill="currentColor" fillRule="evenodd" />
        <rect x="3" y="8" width="10" height="2" fill="#F5B400" />
        <path d="M11 13 L26 22 L24 25.5 L9 16.5 Z" fill="currentColor" />
        <circle cx="26" cy="22" r="2.4" fill="currentColor" />
        <circle cx="26" cy="22" r="0.8" fill="#F5B400" />
        <path d="M24.5 21 L31 30 L28 32 L21.5 23 Z" fill="currentColor" />
        <rect x="26" y="29" width="8" height="4" rx="0.6" fill="currentColor" />
        <rect x="10" y="33" width="38" height="5" rx="0.6" fill="currentColor" />
        <path d="M48 33 L48 23 L54 23 L60 28 L60 33 Z" fill="currentColor" />
        <rect x="58.5" y="30" width="1.4" height="1.4" fill="#F5B400" />
        <rect x="10" y="38" width="50" height="2" rx="0.4" fill="currentColor" />
        <circle cx="18" cy="40" r="3.4" fill="currentColor" />
        <circle cx="18" cy="40" r="1.4" fill="var(--off-white)" />
        <circle cx="52" cy="40" r="3.4" fill="currentColor" />
        <circle cx="52" cy="40" r="1.4" fill="var(--off-white)" />
      </svg>
      <span className="brand-lockup-text">
        <strong>Skylift Malaysia</strong>
        <small>SCAFFOLDING MALAYSIA SDN. BHD.</small>
      </span>
    </span>
  );
}

function WhatsappGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function SiteHeader() {
  const nav = useTranslations('nav');
  const locale = useLocale();
  const waHref = waRedirect(locale);

  return (
    <header className="nav-wrap">
      <NavCtaGlobalStyle />
      <nav className="nav-pill" aria-label="Main">
        <Link href={`/${locale}`} className="nav-brand" aria-label={nav('brandName')}>
          <BrandLogo />
        </Link>
        <div className="nav-links">
          <a href={`/${locale}#products`}>{nav('products')}</a>
          <a href={`/${locale}#locations`}>{nav('locations')}</a>
          <Link href={`/${locale}/blog`}>{nav('blog')}</Link>
        </div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== 'undefined' && window.uwc) {
                window.uwc('click', { label: 'whatsapp-nav' });
              }
            }}
            className="btn btn-wa btn-sm nav-cta wa-btn"
          >
            <WhatsappGlyph />
            {nav('whatsappCta')}
          </a>
        </div>
      </nav>
    </header>
  );
}
