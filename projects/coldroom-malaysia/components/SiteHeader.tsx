'use client';

// Canonical shared site header (nav + language switcher + WhatsApp CTA).
// Rendered on every public page (home, location, blog listing, blog post).
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BrandMark, WaIcon, MenuIcon } from '@/components/BrandMark';
import { siteConfig } from '@/config/site';
import { waRedirect } from '@/lib/waRedirect';
import { trackWhatsApp } from '@/lib/track';

export default function SiteHeader({ activeBlog = false }: { activeBlog?: boolean }) {
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
          <button
            aria-label="menu"
            className="mobile-menu-btn"
            onClick={() => setOpen((o) => !o)}
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, color: 'var(--frost-deep)', flexShrink: 0 }}
          >
            <MenuIcon open={open} />
          </button>
          <Link href={`/${locale}`} className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} aria-label={siteConfig.brandName}>
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
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div className="nav-lang"><LanguageSwitcher /></div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsApp(siteConfig.fallbackPhone)}
              className="btn btn-wa nav-cta"
              style={{ height: 42, padding: '0 18px', fontSize: 13, width: 'auto' }}
            >
              <WaIcon size={14} /> {t('ctaShort')}
            </a>
          </div>
        </div>
        {/* Mobile drawer is an absolute child of the sticky nav, anchored at its
            bottom edge (top: 100%). It follows the nav wherever it sticks, so it
            can never be mis-offset by the FOMO banner height (sewa-excavator
            attaches the drawer to the header the same way). */}
        {open && (
          <div
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#fff', borderBottom: '1px solid var(--steel-100)',
              boxShadow: 'var(--shadow-md)', padding: 12,
              display: 'flex', flexDirection: 'column', gap: 4,
              maxHeight: 'calc(100vh - 68px)', overflowY: 'auto',
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
      </nav>
      {/* Mobile hides the header WhatsApp CTA so it never overlaps the language
          dropdown.  so the rule reaches the .nav-cta <a> from styled-jsx. */}
      <style>{`
        @media (max-width: 900px) {
          .nav-cta { display: none !important; }
        }
      `}</style>
    </>
  );
}
