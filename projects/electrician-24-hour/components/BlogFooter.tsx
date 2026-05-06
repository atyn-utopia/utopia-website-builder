'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { waRedirect } from '@/lib/waRedirect';
import WaClickTracker from './tracking/WaClickTracker';

export default function BlogFooter({ phoneNumber }: { phoneNumber: string }) {
  const locale = useLocale();
  const nav = useTranslations('nav');
  const fo = useTranslations('footer');
  const fin = useTranslations('finalCta');
  const waHref = waRedirect(locale);

  return (
    <>
      <section className="cta-band">
        <div className="container">
          <h3>{fin('heading')}</h3>
          <p>{fin('subheading')}</p>
          <WaClickTracker
            phoneNumber={phoneNumber}
            href={waHref}
            target="_blank"
            rel="noopener"
            className="btn btn-wa btn-lg"
          >
            {fin('cta')}
          </WaClickTracker>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <img src="/brand/logo-light.svg" alt="Electrician 24 Hours" />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: 340 }}>{fo('tagline')}</p>
            </div>
            <div>
              <h5>{fo('quickLinks')}</h5>
              <ul>
                <li><Link href={`/${locale}`}>{nav('services')}</Link></li>
                <li><Link href={`/${locale}#how`}>{nav('howItWorks')}</Link></li>
                <li><Link href={`/${locale}#locations`}>{nav('locations')}</Link></li>
                <li><Link href={`/${locale}/blog`}>{nav('blog')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{fo('copyright')}</span>
            <span>{fo('ssm')}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
