'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function SiteFooter() {
  const locale = useLocale();
  const fo = useTranslations('footer');
  const locs = useTranslations('locations');

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-lockup brand-lockup--light" style={{ marginBottom: 14 }}>
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
                <circle cx="18" cy="40" r="1.4" fill="var(--charcoal)" />
                <circle cx="52" cy="40" r="3.4" fill="currentColor" />
                <circle cx="52" cy="40" r="1.4" fill="var(--charcoal)" />
              </svg>
              <span className="brand-lockup-text">
                <strong>Skylift Malaysia</strong>
                <small>SCAFFOLDING MALAYSIA SDN. BHD.</small>
              </span>
            </div>
            <h5 className="footer-tagline body-h5">{fo('tagline')}</h5>
            <div style={{ marginTop: 16 }}>
              <LanguageSwitcher />
            </div>
          </div>
          <div>
            <h5>{fo('unitsHeading')}</h5>
            <ul>
              <li><a href={`/${locale}#products`}>20m Skylift</a></li>
              <li><a href={`/${locale}#products`}>24m Skylift</a></li>
            </ul>
          </div>
          <div>
            <h5>{fo('topLocationsHeading')}</h5>
            <ul>
              <li><Link href={`/${locale}/skylift/kuala-lumpur`}>Kuala Lumpur</Link></li>
              <li><Link href={`/${locale}/skylift/petaling-jaya`}>Petaling Jaya</Link></li>
              <li><Link href={`/${locale}/skylift/shah-alam`}>Shah Alam</Link></li>
              <li><Link href={`/${locale}/skylift/johor-bahru`}>Johor Bahru</Link></li>
              <li><Link href={`/${locale}/skylift/george-town`}>George Town</Link></li>
              <li><Link href={`/${locale}/skylift/ipoh`}>Ipoh</Link></li>
            </ul>
          </div>
          <div>
            <h5>{fo('resourcesHeading')}</h5>
            <ul>
              <li><Link href={`/${locale}/blog`}>{fo('blog')}</Link></li>
              <li><a href={`/${locale}#how`}>{fo('siteSafety')}</a></li>
              <li><a href={`/${locale}#products`}>{fo('operatorCert')}</a></li>
              <li><a href={`/${locale}#locations`}>{locs('viewAll')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{fo('copyright')}</span>
          <span>{fo('ssm')}</span>
        </div>
      </div>
    </footer>
  );
}
