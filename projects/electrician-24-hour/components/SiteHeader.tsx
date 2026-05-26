'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import { LanguageSwitcher } from './LanguageSwitcher';

function trackClick(label: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    window.uwc('click', { label });
  }
}

export default function SiteHeader() {
  const nav = useTranslations('nav');
  const locale = useLocale();
  const waHref = waRedirect(locale);

  return (
    <header className="nav-wrap">
      <nav className="nav-pill" aria-label="Main">
        <Link href={`/${locale}`} className="nav-brand">
          <img src="/brand/logo.svg" alt={nav('logoAlt')} />
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}#services`}>{nav('services')}</Link>
          <Link href={`/${locale}#how`}>{nav('howItWorks')}</Link>
          <Link href={`/${locale}#gallery`}>{nav('gallery')}</Link>
          <Link href={`/${locale}#reviews`}>{nav('reviews')}</Link>
          <Link href={`/${locale}#locations`}>{nav('locations')}</Link>
          <Link href={`/${locale}/blog`}>{nav('blog')}</Link>
        </div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            onClick={() => trackClick('whatsapp-nav')}
            className="btn btn-wa btn-sm nav-cta"
          >
            {nav('ctaButton')}
          </a>
        </div>
      </nav>

      {/* Styled-jsx scoping note:
         The WhatsApp CTA below the language switcher is rendered with the
         `.nav-cta` className. Because future variants (WhatsAppButton, header
         islands) render that class from child components, plain scoped rules
         would silently miss them — `:global(.nav-cta)` keeps the selector live
         regardless of which component emits the class. */}
      <style jsx>{`
        :global(.nav-cta) {
          height: 40px;
          padding: 0 14px;
          font-size: 13px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        @media (max-width: 879px) {
          :global(.nav-cta) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
