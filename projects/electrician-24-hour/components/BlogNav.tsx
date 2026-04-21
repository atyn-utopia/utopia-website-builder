'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function BlogNav() {
  const locale = useLocale();
  const nav = useTranslations('nav');
  const waHref = waRedirect(locale);

  return (
    <header className="nav-wrap">
      <nav className="nav-pill" aria-label="Main">
        <Link href={`/${locale}`} className="nav-brand">
          <img src="/brand/logo.svg" alt="Electrician 24 Hours" />
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}#services`}>{nav('services')}</Link>
          <Link href={`/${locale}#how`}>{nav('howItWorks')}</Link>
          <Link href={`/${locale}#locations`}>{nav('locations')}</Link>
          <Link href={`/${locale}/blog`}>{nav('blog')}</Link>
        </div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className="btn btn-wa btn-sm"
          >
            {nav('ctaButton')}
          </a>
        </div>
      </nav>
    </header>
  );
}
