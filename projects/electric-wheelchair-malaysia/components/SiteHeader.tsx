// Sticky white header that mirrors sewa-excavator's chrome 1:1: brand logo +
// horizontal nav in the centre, language switcher + WhatsApp CTA on the right,
// burger menu on mobile. Uses electric-wheelchair's nav.* keys and brand
// colours (#1B2D5B navy ink, #F47B20 orange accent, #25D366 WA green).
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/i18n/routing';

function WaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

// page.tsx still passes a locale prop. Accept it for back-compat but read
// useLocale() at runtime so this can be a client component (needed for burger
// menu state).
export default function SiteHeader(_props?: { locale?: Locale }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const waHref = `/${locale}/redirect-whatsapp-1`;
  const productSlug = siteConfig.productSlug;

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#products`, label: t('products') },
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}#reviews`, label: t('reviews') },
    { href: `/${locale}#locations`, label: t('locations') },
    { href: `/${locale}/blog`, label: t('blog') },
  ];

  return (
    <header className="ewc-header">
      <div className="ewc-header__inner">
        <Link href={`/${locale}`} className="ewc-header__brand" aria-label={t('brandName')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt={t('logoAlt')} className="ewc-header__logo" />
          <span className="ewc-header__brand-text">{t('brandName')}</span>
        </Link>

        <nav className="ewc-header__nav ewc-header__nav--desktop" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <button
          type="button"
          className="ewc-header__burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="ewc-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="ewc-header__actions">
          <div className="ewc-header__lang"><LanguageSwitcher /></div>
          <Link
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ewc-header__cta"
          >
            <WaIcon size={15} />
            <span className="ewc-header__cta-label">{t('whatsappCta')}</span>
          </Link>
        </div>
      </div>

      <div id="ewc-mobile-nav" className={`ewc-header__drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="ewc-header__nav--mobile" aria-label="Mobile primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>
          ))}
          <Link href={`/${locale}/${productSlug}/kuala-lumpur`} onClick={close}>
            {t('locations')} — Kuala Lumpur
          </Link>
        </nav>
        <div className="ewc-header__mobile-actions">
          <LanguageSwitcher />
          <Link
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ewc-header__cta ewc-header__cta--mobile"
            onClick={close}
          >
            <WaIcon size={16} />
            {t('whatsappCta')}
          </Link>
        </div>
      </div>
      {/* All .ewc-header* styles live in app/globals.css — styled-jsx in the
         App Router doesn't reliably ship CSS during SSR, leaving the header
         unstyled until React hydrates. */}
    </header>
  );
}

