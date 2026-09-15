'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';

/**
 * Canonical fleet header (templates/site-chrome/SiteHeader.tsx): nav on the
 * left, contact number + language switcher + WhatsApp CTA on the right, no
 * logo — the round badge lives in the hero instead.
 *
 * `contact` is a ReactNode, not a phone string, because the number is resolved
 * server-side (DB-backed) and this is a client component. Passing the already
 * rendered element in as a prop keeps the fetch on the server.
 *
 * Every page renders it as `<SiteHeader contact={<ContactNumber locale={locale}
 * page="/…" />} />` — the page path matters, `is_display` is keyed per page.
 *
 * Katil departs from the template in one place: the header is not sticky. The
 * FOMO banner above it is sticky at top:0, and two sticky bars at the same
 * offset would slide the header underneath it on scroll.
 */
export default function SiteHeader({ contact }: { contact?: React.ReactNode }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#products`, label: t('products') },
    { href: `/${locale}#how`, label: t('how') },
    { href: `/${locale}#lokasi`, label: t('locations') },
    { href: `/${locale}/blog`, label: t('blog') },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="site-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="site-actions">
          {contact}
          <div className="site-actions__lang">
            <LanguageSwitcher />
          </div>
          <WhatsAppButton href={waRedirect(locale)} label={t('whatsappCta')} variant="compact" className="nav-cta" />
        </div>
      </div>

      <div id="site-nav-mobile" className={`site-mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="site-mobile-nav" aria-label="Mobile primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="site-mobile-actions">
          {/* Switcher and number share one row — switcher left, number hard
              right. Wrapped rather than laid out on .site-mobile-actions
              directly so the WhatsApp button below stays its own full-width
              block instead of being pulled into the row. */}
          <div className="site-mobile-row">
            <LanguageSwitcher />
            {contact}
          </div>
          <WhatsAppButton href={waRedirect(locale)} label={t('whatsappCta')} variant="full" className="btn-wa" />
        </div>
      </div>

      {/* Plain <style>, NOT <style jsx>: styled-jsx in a client component ships
          its CSS inside the JS bundle, which flashes the header unstyled before
          hydration. It also cannot reach `contact` — that element is rendered on
          the server and passed in as a prop. */}
      <style>{`
        .site-header {
          position: relative; z-index: 40;
          background: rgba(255,255,255,0.92);
          backdrop-filter: saturate(180%) blur(10px);
          -webkit-backdrop-filter: saturate(180%) blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .site-header-inner {
          max-width: 1240px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          padding: 12px var(--gut);
          min-height: 60px;
        }
        .site-nav { display: inline-flex; gap: 24px; flex-wrap: nowrap; }
        .site-nav a { color: var(--ink); font-weight: 600; font-size: 14px; letter-spacing: -0.005em; transition: color var(--dur) var(--ease-out); white-space: nowrap; }
        .site-nav a:hover { color: var(--brand-orange-deep); }
        .site-nav--desktop { display: none; }
        .site-actions { display: inline-flex; align-items: center; gap: 10px; }
        .site-burger { display: inline-flex; flex-direction: column; justify-content: center; gap: 4px; width: 38px; height: 38px; padding: 0 8px; background: transparent; border: 1px solid var(--line-strong); border-radius: 10px; cursor: pointer; }
        .site-burger span { display: block; height: 2px; width: 100%; background: var(--brand-charcoal); border-radius: 2px; transition: transform 0.18s ease, opacity 0.18s ease; }
        .site-burger[aria-expanded="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .site-burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
        .site-burger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .site-mobile-drawer { display: none; background: #fff; border-top: 1px solid var(--line); padding: 14px var(--gut) 18px; }
        .site-mobile-drawer.is-open { display: block; }
        .site-mobile-nav { display: flex; flex-direction: column; }
        .site-mobile-nav a { padding: 13px 4px; font-weight: 700; font-size: 15px; color: var(--brand-charcoal); border-bottom: 1px solid var(--line); }
        .site-mobile-nav a:last-child { border-bottom: none; }
        .site-mobile-actions { display: flex; flex-direction: column; gap: 12px; padding-top: 16px; margin-top: 12px; border-top: 1px solid var(--line); }
        .site-mobile-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
        .site-mobile-actions .lsw-toggle { justify-content: center; }
        @media (min-width: 880px) { .site-nav--desktop { display: inline-flex; } .site-burger { display: none; } .site-mobile-drawer { display: none !important; } }
        @media (max-width: 879px) {
          .nav-cta { display: none !important; }
          .site-actions__lang { display: inline-flex; }
          .site-mobile-actions .btn-wa { display: none !important; }
        }
      `}</style>
    </header>
  );
}
