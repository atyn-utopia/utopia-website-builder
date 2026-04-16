'use client';

import { useTranslations, useLocale } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';

export default function BlogFooter() {
  const locale = useLocale();
  const navT = useTranslations('nav');
  const footerT = useTranslations('footer');
  const waHref = waRedirect(locale);

  const navLinks = [
    { label: navT('products'), href: `/${locale}#products` },
    { label: navT('howItWorks'), href: `/${locale}#how-it-works` },
    { label: navT('reviews'), href: `/${locale}#reviews` },
    { label: navT('locations'), href: `/${locale}#locations` },
    { label: navT('faq'), href: `/${locale}#faq` },
    { label: navT('blog'), href: `/${locale}/blog` },
  ];

  return (
    <footer
      style={{
        background: 'var(--navy-dark)',
        padding: 'var(--space-3xl) 0 var(--space-lg)',
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      <div className="section-container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-2xl)',
            marginBottom: 'var(--space-2xl)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-sm)' }}>
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
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--white)', letterSpacing: '-0.02em' }}>
                {footerT('brandName')}
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, maxWidth: '300px' }}>{footerT('tagline')}</p>
          </div>

          <div>
            <h6
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: 'var(--space-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {footerT('quickLinks')}
            </h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h6
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: 'var(--space-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {footerT('contact')}
            </h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '14px',
                  color: 'var(--wa-green)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {navT('ctaButton')}
              </a>
              <span style={{ fontSize: '14px' }}>electric-wheelchair.com.my</span>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 'var(--space-md)',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <span>{footerT('copyright')}</span>
          <span>{footerT('ssm')}</span>
        </div>
      </div>
    </footer>
  );
}
