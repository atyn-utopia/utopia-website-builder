'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { ProductCardData } from '@/components/ProductCard';
import { locations } from '@/config/locations';

// Direction A hero ("Lengkung Merah"): the red arc, red cross and navy wave
// come from the logo. The page passes its own <h1>/<h2> in, so each page file
// keeps exactly one of each — the wizard counts them in app/[locale].
const FEATURED_SLUG = 'katil-hospital-auto-3-fungsi';
const BED_PREFIX = 'katil-hospital';

function lowest(values: (number | null | undefined)[]): number | null {
  const real = values.filter((v): v is number => typeof v === 'number' && v > 0);
  return real.length > 0 ? Math.min(...real) : null;
}

interface Props {
  title: ReactNode;
  subtitle: ReactNode;
  badge: string;
  products: ProductCardData[];
  waHref: string;
  locationSlug?: string;
}

export default function HeroArc({ title, subtitle, badge, products, waHref, locationSlug }: Props) {
  const t = useTranslations('hero');
  const tRoot = useTranslations();

  // Facts come from the live catalogue, so a price change in webcore moves
  // the hero with it. Beds only: a RM60 mattress is not "sewa katil dari".
  const beds = products.filter((p) => p.slug.startsWith(BED_PREFIX));
  const rentFrom = lowest(beds.map((p) => p.rental_price));
  const buyFrom = lowest(beds.map((p) => p.sale_price));
  const featured = products.find((p) => p.slug === FEATURED_SLUG);

  return (
    <section className="kh-hero">
      <div className="kh-hero-in">
        <div className="kh-hero-copy">
          {/* The header carries no logo (canonical fleet chrome) — the round
              badge is the brand's first appearance on the page. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo/logo-badge.png"
            alt={tRoot('logoAlt')}
            className="kh-hero-logo"
            width={512}
            height={512}
            fetchPriority="high"
          />
          <p className="kh-hero-badge">
            <span className="kh-hero-badge-icon" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </span>
            {badge}
          </p>
          {title}
          {subtitle}
          <div className="kh-hero-ctas">
            <WhatsAppButton href={waHref} label={t('ctaPrimary')} variant="pill" locationSlug={locationSlug} />
            <a href="#products" className="kh-btn-ghost">
              {t('ctaSecondary')}
            </a>
          </div>
          <dl className="kh-hero-facts">
            {rentFrom !== null && (
              <div>
                <dt>{t('factRent')}</dt>
                <dd>
                  RM{rentFrom}
                  <small>{t('unitMonth')}</small>
                </dd>
              </div>
            )}
            {buyFrom !== null && (
              <div>
                <dt>{t('factBuy')}</dt>
                <dd>RM{buyFrom}</dd>
              </div>
            )}
            <div>
              <dt>{t('factCoverage')}</dt>
              <dd>
                {locations.length}
                <small> {t('unitTowns')}</small>
              </dd>
            </div>
          </dl>
        </div>

        <div className="kh-hero-visual">
          <svg className="kh-hero-ring" viewBox="0 0 400 400" aria-hidden="true">
            <circle cx="200" cy="200" r="168" fill="#EAF1FA" />
            <path d="M25.2 136.4 A186 186 0 0 1 374.8 136.4" fill="none" stroke="#e63030" strokeWidth="12" strokeLinecap="round" />
            <path d="M14.7 216.2 A186 186 0 0 0 293 361.1" fill="none" stroke="#1c3a6a" strokeWidth="20" strokeLinecap="round" />
          </svg>
          <span className="kh-hero-cross" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hero/hero-bed-auto.png"
            alt={t('bedAlt')}
            className="kh-hero-bed"
            width={960}
            height={710}
            fetchPriority="high"
          />
          {featured?.rental_price ? (
            <div className="kh-hero-tag" aria-hidden="true">
              <small>{featured.name}</small>
              <strong>
                RM{featured.rental_price}
                <small>{t('unitMonth')}</small>
              </strong>
            </div>
          ) : null}
        </div>
      </div>
      <svg className="kh-hero-wave" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 L0 36 C 260 4, 540 60, 820 30 C 990 12, 1110 16, 1200 26 L1200 60 Z" fill="#1c3a6a" />
      </svg>
    </section>
  );
}
