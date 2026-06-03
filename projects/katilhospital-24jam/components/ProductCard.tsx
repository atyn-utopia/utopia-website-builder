'use client';

import { type CSSProperties } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';

export interface ProductCardData {
  slug: string;
  name: string;
  description?: string | null;
  rental_price?: number | null;
  sale_price?: number | null;
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
        borderTop: '3px solid #1c3a6a',
        borderLeft: '1px solid #E2E8F0',
        borderRight: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 18,
        boxShadow: '0 2px 6px rgba(15,31,80,0.04), 0 12px 28px rgba(15,31,80,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div
        style={{
          background: '#F0F4FA',
          borderRadius: 10,
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
            alt={`${product.name} — Katil Hospital 24 Jam`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 12,
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #F0F4FA 0%, #F0F4FA 100%)',
            }}
            aria-hidden="true"
          />
        )}
      </div>
      <h4
        style={{
          fontSize: 17,
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
            color: 'rgba(28,58,106,0.65)',
            lineHeight: 1.55,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>
      )}
      {(() => {
        const L = priceLabels(locale);
        const hasAny = product.rental_price || product.sale_price;
        const blockStyle: CSSProperties = {
          padding: '10px 12px',
          background: '#F0F4FA',
          borderRadius: 8,
          borderLeft: '3px solid #e63030',
          minHeight: 70,
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
          color: 'rgba(28,58,106,0.65)',
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
                  color: 'rgba(28,58,106,0.65)',
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
                  <span style={{ fontSize: 12, color: 'rgba(28,58,106,0.65)' }}>{L.rentUnit}</span>
                </span>
              ) : (
                <span style={{ fontSize: 12, color: 'rgba(28,58,106,0.45)' }}>—</span>
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
                <span style={{ fontSize: 12, color: 'rgba(28,58,106,0.45)' }}>—</span>
              )}
            </div>
          </div>
        );
      })()}
      <div style={{ marginTop: 4 }}>
        <WhatsAppButton href={waHref} label={ctaLabel} variant="full" />
      </div>
    </div>
  );
}
