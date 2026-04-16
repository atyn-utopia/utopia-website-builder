'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function BlogNav() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const waHref = waRedirect(locale);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('products'), href: `/${locale}#products` },
    { label: t('howItWorks'), href: `/${locale}#how-it-works` },
    { label: t('reviews'), href: `/${locale}#reviews` },
    { label: t('locations'), href: `/${locale}#locations` },
    { label: t('faq'), href: `/${locale}#faq` },
    { label: t('blog'), href: `/${locale}/blog`, active: true },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--white)',
        boxShadow: 'var(--shadow-nav)',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <a href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#1B2D5B" />
            <circle cx="13" cy="22" r="5.5" stroke="#F47B20" strokeWidth="2" fill="none" />
            <circle cx="13" cy="22" r="1.5" fill="#F47B20" />
            <circle cx="15" cy="8" r="2.5" fill="#FFFFFF" />
            <path d="M14 11v6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 17h6l2 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="22" cy="22" r="2.5" stroke="#F47B20" strokeWidth="1.5" fill="none" />
            <path d="M24 5l-3 4h3l-3 4" stroke="#F47B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--navy)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            {t('brandName')}
          </span>
        </a>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '24px' }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: '14px',
                fontWeight: link.active ? 600 : 500,
                color: link.active ? 'var(--navy)' : 'var(--text-muted)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn desktop-nav"
            style={{ display: 'none', padding: '8px 16px', fontSize: '13px' }}
          >
            <WhatsAppIcon size={14} />
            {t('ctaButton')}
          </a>

          {/* Mobile hamburger */}
          <button
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <span
              style={{
                width: '22px',
                height: '2px',
                background: 'var(--navy)',
                borderRadius: '2px',
                transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                background: 'var(--navy)',
                borderRadius: '2px',
                transition: 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                background: 'var(--navy)',
                borderRadius: '2px',
                transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          height: '100vh',
          background: 'var(--white)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 200,
          padding: '80px 24px 24px',
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'block',
              padding: '12px 0',
              fontSize: '16px',
              fontWeight: link.active ? 700 : 500,
              color: 'var(--navy)',
              borderBottom: '1px solid var(--surface)',
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-btn"
          style={{ marginTop: '16px', textAlign: 'center' }}
        >
          <WhatsAppIcon size={16} />
          {t('ctaButton')}
        </a>
      </div>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 199,
          }}
        />
      )}
    </nav>
  );
}
