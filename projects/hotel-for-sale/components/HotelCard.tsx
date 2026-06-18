'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { HotelListing, formatRM } from '@/config/properties';
import ProductImpressionTracker from './tracking/ProductImpressionTracker';

export function Stars({ count }: { count: number }) {
  const t = useTranslations('hotelCard');
  return (
    <span className="stars" aria-label={t('starsAria', { count })}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" aria-hidden="true">
          <path d="M12 2l3.1 6.3 7 1-5.1 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9L2 9.3l7-1L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

export default function HotelCard({ h }: { h: HotelListing }) {
  const t = useTranslations('hotelCard');
  const locale = useLocale();
  const detailHref = `/${locale}/properties/${h.id}`;

  return (
    <article className="hotel-card" data-product={h.id}>
      <ProductImpressionTracker slug={h.id} />
      <div className="hotel-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={h.cover}
          alt={t('imageAlt', { name: h.name, city: h.city, state: h.state })}
          loading="lazy"
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hotel-watermark" src="/brand/logo-dark.png" alt="HotelForSale.my" loading="lazy" />
      </div>

      <div className="hotel-card-body">
        <h4 className="hotel-card-title">
          <Link href={detailHref}>{h.name}</Link>
        </h4>
        <h5 className="hotel-card-loc">{h.city}, {h.state}</h5>
        <h5 className="hotel-card-desc">{h.shortDesc}</h5>
        <div className="hotel-card-meta">
          <span className="hotel-card-stars">
            <Stars count={h.stars} />
            <span className="hotel-card-startext">{t('starHotel', { count: h.stars })}</span>
          </span>
          {h.onSale && (
            <span className="hotel-onsale">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm1 16h-2v-1.1c-1.3-.3-2.3-1.1-2.4-2.5h1.7c.1.7.6 1.2 1.7 1.2s1.5-.5 1.5-1.1c0-.6-.4-.9-1.7-1.2-1.5-.4-2.9-1-2.9-2.6 0-1.2.9-2 2.1-2.3V5.9h2v1.2c1.2.3 2 1.1 2.1 2.3h-1.7c-.1-.6-.5-1-1.4-1-1 0-1.4.5-1.4 1 0 .6.5.9 1.8 1.2 1.6.4 2.8 1 2.8 2.6 0 1.2-.9 2.1-2.1 2.4V17z"/></svg>
              {t('onSale')}
            </span>
          )}
        </div>
      </div>

      <div className="hotel-card-footer">
        <span className="hotel-price-tag">{t('sellingPrice')}</span>
        <span className="hotel-price-value">{formatRM(h.sellingPrice)}</span>
      </div>

      <Link href={detailHref} className="hotel-card-link" aria-label={h.name} />
    </article>
  );
}
