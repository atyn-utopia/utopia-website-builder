'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { ProductRow } from '@/lib/getProducts'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface Props {
  locale: string
  locationSlug?: string
  products: ProductRow[]
}

const W = (baseUrl: string) =>
  `${baseUrl}/v1/fill/w_800,h_600,al_c,q_85,enc_avif,quality_auto/${baseUrl.split('/').pop()?.split('~')[0]}.png`

function ImageCarousel({ photos, locale }: { photos: { url: string; alt_text: string | null }[]; locale: string }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const images = photos.map((p) => ({ url: W(p.url), alt: p.alt_text ?? '' }))

  if (images.length === 0) return null
  if (images.length === 1) {
    return (
      <div style={{ width: '100%', aspectRatio: '16/10', background: '#f0ede6', borderRadius: 12, overflow: 'hidden' }}>
        <img src={images[0].url} alt={images[0].alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
      </div>
    )
  }

  return (
    <div>
      <div style={{ width: '100%', aspectRatio: '16/10', background: '#f0ede6', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
        <img
          src={images[activeIdx].url}
          alt={images[activeIdx].alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
          loading="lazy"
        />
        <span style={{
          position: 'absolute', bottom: 10, right: 14,
          background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 12, fontWeight: 600,
          padding: '4px 10px', borderRadius: 12,
        }}>
          {activeIdx + 1}/{images.length}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              width: 56, height: 56, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
              border: i === activeIdx ? '2px solid var(--brand-jade)' : '2px solid transparent',
              padding: 0, background: '#f0ede6',
              opacity: i === activeIdx ? 1 : 0.65,
              transition: 'opacity 0.2s, border-color 0.2s',
            }}
          >
            <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}

function PricingInfo({ product, t }: { product: ProductRow; t: ReturnType<typeof useTranslations> }) {
  // Try to get pricing from translations (keyed by slug-derived key)
  const key = slugToKey(product.slug)
  const hasLaborOnly = t.has(`${key}.laborOnly`)

  if (hasLaborOnly) {
    return (
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 180px', background: 'var(--brand-cream)', border: '1px solid var(--brand-sand)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-body)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t(`${key}.laborOnly`)}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-charcoal)', marginTop: 4 }}>{t(`${key}.laborOnlyPrice`)}</div>
        </div>
        <div style={{ flex: '1 1 180px', background: 'var(--brand-cream)', border: '1px solid var(--brand-sand)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-body)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t(`${key}.laborAndPaint`)}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-charcoal)', marginTop: 4 }}>{t(`${key}.laborAndPaintPrice`)}</div>
        </div>
      </div>
    )
  }

  return null
}

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
  const tw = useTranslations('whatsapp')

  const mainProducts = products.filter((p) => p.parent_id === null)
  const getChildren = (parentId: string) => products.filter((p) => p.parent_id === parentId)

  // Primary mains: interior + exterior (have children)
  const primaryMains = mainProducts.filter((p) => getChildren(p.id).length > 0)
  // Secondary mains: standalone services (no children)
  const secondaryMains = mainProducts.filter((p) => getChildren(p.id).length === 0)

  return (
    <section id="services" className="section bg-jade-wash">
      <div className="container-p">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 56px' }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
          <p className="t-lead" style={{ marginTop: 14 }}>{t('subheading')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {primaryMains.map((main) => {
            const children = getChildren(main.id)
            const key = slugToKey(main.slug)
            return (
              <div key={main.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '32px 32px 0' }}>
                  <h3 className="t-h2" style={{ color: 'var(--brand-charcoal)' }}>{t(`${key}.title`)}</h3>
                  <p className="t-body" style={{ marginTop: 8, maxWidth: 600, color: 'var(--brand-body)' }}>
                    {t(`${key}.description`)}
                  </p>
                </div>
                <div style={{ padding: '24px 32px' }}>
                  <ImageCarousel photos={main.product_photos} locale={locale} />
                </div>
                {children.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--brand-sand)', padding: '24px 32px 32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                      {children.map((sub) => {
                        const subKey = slugToKey(sub.slug)
                        return (
                          <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: sub.product_photos.length > 1 ? '1fr 1fr' : '280px 1fr', gap: 24, alignItems: 'start' }} className="sub-product-grid">
                            <div>
                              <ImageCarousel photos={sub.product_photos} locale={locale} />
                            </div>
                            <div>
                              <h4 style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-charcoal)' }}>
                                {t(`${subKey}.title`)}
                              </h4>
                              {t.has(`${subKey}.description`) && (
                                <p className="t-body" style={{ marginTop: 8 }}>{t(`${subKey}.description`)}</p>
                              )}
                              <PricingInfo product={sub} t={t} />
                              <div style={{ marginTop: 16 }}>
                                <WhatsAppButton
                                  locale={locale}
                                  locationSlug={locationSlug}
                                  message={t(`${subKey}.title`)}
                                  label={t.has(`${subKey}.cta`) ? t(`${subKey}.cta`) : t('ctaGeneric')}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {secondaryMains.length > 0 && (
            <div>
              <h3 className="t-h2" style={{ marginBottom: 24, color: 'var(--brand-charcoal)' }}>
                {t('otherServices')}
              </h3>
              <div className="secondary-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(secondaryMains.length, 3)}, 1fr)`, gap: 20 }}>
                {secondaryMains.map((p) => {
                  const key = slugToKey(p.slug)
                  const mainPhoto = p.product_photos[0]
                  return (
                    <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ aspectRatio: '16/10', background: '#f0ede6', overflow: 'hidden' }}>
                        {mainPhoto && (
                          <img
                            src={W(mainPhoto.url)}
                            alt={mainPhoto.alt_text ?? t(`${key}.title`)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div style={{ padding: '20px 22px' }}>
                        <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-charcoal)' }}>
                          {t(`${key}.title`)}
                        </h4>
                        <p className="t-body" style={{ marginTop: 6, fontSize: 14 }}>
                          {t(`${key}.description`)}
                        </p>
                        {t.has(`${key}.price`) && (
                          <span className="price-pill" style={{ marginTop: 12, display: 'inline-block', fontSize: 13, padding: '6px 14px' }}>
                            {t(`${key}.price`)}
                          </span>
                        )}
                        <div style={{ marginTop: 14 }}>
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
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .sub-product-grid { grid-template-columns: 1fr !important; }
          .secondary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
