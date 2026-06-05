'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BrandMark, WaIcon, MenuIcon } from '@/components/BrandMark';
import { siteConfig } from '@/config/site';
import { waRedirect } from '@/lib/waRedirect';
import { trackWhatsApp } from '@/lib/track';

export function SiteNav({ activeBlog = false }: { activeBlog?: boolean }) {
  const locale = useLocale();
  const t = useTranslations('nav');
  const waHref = waRedirect(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: `/${locale}#products`, label: t('products') },
    { href: `/${locale}#how-it-works`, label: t('howItWorks') },
    { href: `/${locale}#reviews`, label: t('reviews') },
    { href: `/${locale}#locations`, label: t('locations') },
    { href: `/${locale}#faq`, label: t('faq') },
    { href: `/${locale}/blog`, label: t('blog'), active: activeBlog },
  ];

  return (
    <>
      <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="section-container" style={{ display: 'flex', alignItems: 'center', gap: 24, height: 68 }}>
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} aria-label={siteConfig.brandName}>
            <BrandMark size={36} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--frost-deep)', whiteSpace: 'nowrap' }}>{t('brandName')}</span>
              <span style={{ fontWeight: 600, fontSize: 10, letterSpacing: '0.14em', color: 'var(--frost-mid)', textTransform: 'uppercase', marginTop: 2 }}>Cold Chain Rental</span>
            </div>
          </Link>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28 }} className="nav-links-desktop">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: 14,
                  fontWeight: l.active ? 700 : 500,
                  color: l.active ? 'var(--frost-deep)' : 'var(--steel-700)',
                  position: 'relative',
                  padding: '6px 0',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="lang-desktop"><LanguageSwitcher /></div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsApp(siteConfig.fallbackPhone)}
              className="btn btn-wa"
              style={{ height: 42, padding: '0 18px', fontSize: 13, width: 'auto' }}
            >
              <WaIcon size={14} /> {t('ctaShort')}
            </a>
            <button
              aria-label="menu"
              className="mobile-menu-btn"
              onClick={() => setOpen((o) => !o)}
              style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, color: 'var(--frost-deep)' }}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </nav>
      {open && (
        <div
          style={{
            position: 'fixed', top: 'calc(var(--fomo-height, 44px) + 68px)', left: 0, right: 0,
            background: '#fff', borderBottom: '1px solid var(--steel-100)',
            boxShadow: 'var(--shadow-md)', padding: 12, zIndex: 49,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ padding: '12px 16px', fontSize: 15, fontWeight: 500, color: 'var(--steel-700)', borderRadius: 8 }}>
              {l.label}
            </Link>
          ))}
          <div style={{ padding: 8 }}><LanguageSwitcher /></div>
        </div>
      )}
    </>
  );
}
