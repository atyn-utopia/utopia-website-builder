'use client'

import { useTranslations } from 'next-intl'
import type { ProductRow } from '@/lib/webcore'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface Props {
  locale: string
  locationSlug?: string
  products: ProductRow[]
}

const W = (baseUrl: string) =>
  `${baseUrl}/v1/fill/w_800,h_600,al_c,q_85,enc_avif,quality_auto/${baseUrl.split('/').pop()?.split('~')[0]}.png`

/** Map product slug to the translation key used in messages/*.json */
function slugToKey(slug: string): string {
  const map: Record<string, string> = {
    'cat-dinding-rumah': 'interior',
    'cat-luar-rumah': 'exterior',
    'texture-painting': 'texture',
    'marble-painting': 'marble',
    'weathershield-paint': 'weathershield',
    'outdoor-metal-paint': 'metal',
    'cat-siling': 'ceiling',
    'cat-epoxy-lantai': 'epoxy',
    'cat-pagar-rumah': 'fence',
  }
  return map[slug] ?? slug
}

export function Products({ locale, locationSlug, products }: Props) {
  const t = useTranslations('products')

  return (
    <section id="services" className="section bg-jade-wash">
      <div className="container-p">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 36px' }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
          <p className="t-lead" style={{ marginTop: 14 }}>{t('subheading')}</p>
        </div>

        <div
          className="products-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 22,
          }}
        >
          {products.map((product) => {
            const key = slugToKey(product.slug)
            const mainPhoto = product.product_photos[0]
            const hasPrice = t.has(`${key}.price`)
            const hasLaborOnly = t.has(`${key}.laborOnly`)

            return (
              <div
                key={product.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Product image */}
                <div style={{ aspectRatio: '16/10', background: '#f0ede6', overflow: 'hidden', position: 'relative' }}>
                  {mainPhoto && (
                    <img
                      src={W(mainPhoto.url)}
                      alt={mainPhoto.alt_text ?? t(`${key}.title`)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  )}
                  {/* Price badge overlay */}
                  {(hasPrice || hasLaborOnly || product.sale_price) && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        background: 'var(--brand-coral)',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '6px 14px',
                        borderRadius: 999,
                      }}
                    >
                      {hasPrice
                        ? t(`${key}.price`)
                        : hasLaborOnly
                        ? t(`${key}.laborOnlyPrice`)
                        : product.sale_price && product.sale_price < 100
                        ? `Dari RM${product.sale_price}/sqft`
                        : product.sale_price
                        ? `Dari RM${product.sale_price.toLocaleString()}`
                        : null}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--brand-charcoal)', lineHeight: 1.25 }}>
                    {t(`${key}.title`)}
                  </h3>
                  <p className="t-body" style={{ marginTop: 8, fontSize: 14, flex: 1 }}>
                    {t(`${key}.description`)}
                  </p>
                  <div style={{ marginTop: 16 }}>
                    <WhatsAppButton
                      locale={locale}
                      locationSlug={locationSlug}
                      message={t(`${key}.title`)}
                      label={t.has(`${key}.cta`) ? t(`${key}.cta`) : t('ctaGeneric')}
                      className="wa-btn-sm"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 960px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
