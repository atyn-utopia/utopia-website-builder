'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { WhatsAppButton, WaIcon } from './WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

function BrandMark() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = [
    { href: `/${locale}#produk`, label: t('products') },
    { href: `/${locale}#sewa`, label: t('rentBuy') },
    { href: `/${locale}#showroom`, label: t('showroom') },
    { href: `/${locale}#lokasi`, label: t('locations') },
    { href: `/${locale}#faq`, label: t('faq') },
    { href: `/${locale}/blog`, label: t('blog') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0" aria-label={t('logoAlt')}>
          <span className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center shrink-0">
            <BrandMark />
          </span>
          <span>
            <span className="font-heading text-teal-800 text-lg leading-tight block">Ibnu Sina Care</span>
            <span className="text-[10px] text-teal-600 font-medium tracking-wide block">
              {t('logoTagline')}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600" aria-label="Utama">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-teal-700 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <WhatsAppButton
            href={waRedirect(locale)}
            label="nav"
            className="nav-cta inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1da851] transition-colors"
          >
            <WaIcon size={16} />
            {t('whatsappCta')}
          </WhatsAppButton>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="site-mobile-menu"
        className={`${open ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100 px-4 pb-4`}
      >
        <nav aria-label="Utama mudah alih">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className="block py-3 text-gray-700 font-medium border-b border-gray-50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <WhatsAppButton
          href={waRedirect(locale)}
          label="nav-mobile"
          className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-xl font-semibold w-full"
        >
          <WaIcon size={20} />
          {t('whatsappCtaLong')}
        </WhatsAppButton>
      </div>
    </header>
  );
}
