'use client';

import { type CSSProperties } from 'react';
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

export default function ProductCard({
  product,
  ctaLabel,
  waHref,
  locale,
  priceHintFallback,
}: Props) {
  return (
    <div
      id={`product-${product.slug}`}
      className="hover-lift"
      style={{
        background: '#FFFFFF',
        border: '1px solid #EAF0F7',
        borderRadius: 18,
        padding: 16,
        boxShadow: '0 1px 2px rgba(15,31,80,0.04), 0 14px 30px rgba(15,31,80,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        // Equal height across the row + button sticks to bottom (via marginTop:auto below).
        height: '100%',
      }}
    >
      <div
        style={{
          background: '#F6F9FC',
          borderRadius: 12,
          aspectRatio: '4 / 3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.name} — Katil Hospital Murah`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 14,
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{ width: '100%', height: '100%', background: '#F6F9FC' }}
            aria-hidden="true"
          />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h4
          style={{
            fontSize: 16.5,
            fontWeight: 700,
            color: '#1c3a6a',
            letterSpacing: -0.2,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {product.name}
        </h4>
        {product.description && (
          <p
            style={{
              fontSize: 13.5,
              color: 'rgba(28,58,106,0.6)',
              lineHeight: 1.55,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>
        )}
      </div>

      {/* Price block + WhatsApp CTA grouped together at the bottom of the card. */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(() => {
          const prices = product.prices ?? [];
          if (prices.length > 0) {
            return (
              <div className="product-prices price-list">
                {prices.map((line, i) => (
                  <div className="price-line" key={i}>
                    {line.label}: RM {Number(line.amount).toLocaleString()}
                    {line.unit ? ' / ' + line.unit : ''}
                    {line.note ? <span className="price-note">{line.note}</span> : null}
                  </div>
                ))}
              </div>
            );
          }
          const L = priceLabels(locale);
          const hasAny = product.rental_price || product.sale_price;
          const blockStyle: CSSProperties = {
            padding: '12px 14px',
            background: '#F8FAFC',
            borderRadius: 12,
            // Fixed height so every card's price block is identical regardless
            // of whether the product has rental + sale, just rental, or neither.
            height: 76,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 6,
          };
          const rowStyle: CSSProperties = {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8,
          };
          const labelStyle: CSSProperties = {
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(28,58,106,0.55)',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          };
          if (!hasAny) {
            return (
              <div style={blockStyle}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'rgba(28,58,106,0.6)',
                    textAlign: 'center',
                  }}
                >
                  {priceHintFallback}
                </span>
              </div>
            );
          }
          return (
            <div style={blockStyle}>
              <div style={rowStyle}>
                <span style={labelStyle}>{L.rentLabel}</span>
                {product.rental_price ? (
                  <span>
                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>RM </span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#e63030' }}>
                      {product.rental_price}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(28,58,106,0.6)' }}>{L.rentUnit}</span>
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: 'rgba(28,58,106,0.4)' }}>—</span>
                )}
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>{L.buyLabel}</span>
                {product.sale_price ? (
                  <span>
                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>RM </span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#1c3a6a' }}>
                      {product.sale_price}
                    </span>
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: 'rgba(28,58,106,0.4)' }}>—</span>
                )}
              </div>
            </div>
          );
        })()}
        <WhatsAppButton href={waHref} label={ctaLabel} variant="full" />
      </div>
    </div>
  );
}
