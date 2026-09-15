'use client';

import WhatsAppButton from '@/components/WhatsAppButton';
import type { PriceLine } from '@/lib/webcore';

export interface ProductCardData {
  slug: string;
  name: string;
  description?: string | null;
  rental_price?: number | null;
  sale_price?: number | null;
  prices?: PriceLine[];
  image?: string;
}

interface Props {
  product: ProductCardData;
  ctaLabel: string;
  waHref: string;
  locale: string;
  priceHintFallback: string;
}

interface PriceLabels {
  rentLabel: string;
  buyLabel: string;
  rentUnit: string;
}

function priceLabels(locale: string): PriceLabels {
  if (locale === 'en') return { rentLabel: 'Rent', buyLabel: 'Buy', rentUnit: '/month' };
  if (locale === 'zh') return { rentLabel: '租', buyLabel: '买', rentUnit: '/月' };
  return { rentLabel: 'Sewa', buyLabel: 'Beli', rentUnit: '/bulan' };
}

// Direction A card: photo left + details right on phones, stacked from 640px.
// Styles live in globals.css (.kh-card*).
export default function ProductCard({
  product,
  ctaLabel,
  waHref,
  locale,
  priceHintFallback,
}: Props) {
  const prices = product.prices ?? [];
  const L = priceLabels(locale);
  const hasSinglePrice = Boolean(product.rental_price || product.sale_price);

  return (
    <div id={`product-${product.slug}`} className="kh-card">
      <div className="kh-card-media">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={`${product.name} — Katil Hospital Murah`} loading="lazy" />
        ) : null}
      </div>

      <div className="kh-card-body">
        <h4 className="kh-card-name">{product.name}</h4>
        {product.description && <p className="kh-card-desc">{product.description}</p>}

        {prices.length > 0 ? (
          <div className="product-prices price-list">
            {prices.map((line, i) => (
              <div className="price-line" key={i}>
                {line.label}: RM {Number(line.amount).toLocaleString()}
                {line.unit ? ' / ' + line.unit : ''}
                {line.note ? <span className="price-note">{line.note}</span> : null}
              </div>
            ))}
          </div>
        ) : hasSinglePrice ? (
          <div className="kh-card-prices">
            {product.rental_price ? (
              <span className="kh-price">
                {L.rentLabel}
                <b>
                  RM{product.rental_price}
                  <small>{L.rentUnit}</small>
                </b>
              </span>
            ) : null}
            {product.sale_price ? (
              <span className="kh-price">
                {L.buyLabel}
                <b>RM{product.sale_price}</b>
              </span>
            ) : null}
          </div>
        ) : (
          <p className="kh-card-hint">{priceHintFallback}</p>
        )}

        <div className="kh-card-cta">
          <WhatsAppButton href={waHref} label={ctaLabel} variant="full" />
        </div>
      </div>
    </div>
  );
}
