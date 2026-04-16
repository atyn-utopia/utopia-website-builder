import { useTranslations } from 'next-intl'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { swatchChips } from '@/config/products'

interface Props {
  locale: string
  locationSlug?: string
  cityOverride?: string
}

export function Hero({ locale, locationSlug, cityOverride }: Props) {
  const t = useTranslations('hero')
  const th = useTranslations('whatsapp')
  const heroImg = '/hero-painter.png'

  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 72% 45%, var(--brand-jade-soft) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="container-p hero-grid"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.95fr',
          gap: 48,
          alignItems: 'center',
        }}
      >
        <div>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="t-display" style={{ marginTop: 20, color: 'var(--brand-charcoal)' }}>
            {t('h1Line1')}{' '}
            <span className="hero-highlight">{t('h1Highlight')}</span>{' '}
            {t('h1Line2')}
          </h1>
          {cityOverride ? (
            <p style={{ marginTop: 18, fontSize: 20, fontWeight: 700, color: 'var(--brand-jade-dark)' }}>
              {cityOverride}
            </p>
          ) : null}
          <p className="t-lead" style={{ marginTop: 22, maxWidth: 560 }}>
            {t('subheadline')}
          </p>
          <div style={{ marginTop: 26 }}>
            <span className="price-pill">{t('priceBadge')}</span>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 32 }}>
            <WhatsAppButton
              locale={locale}
              locationSlug={locationSlug}
              label={t('cta')}
              ariaLabel={th('ariaLabel')}
            />
            <a href="#gallery" className="btn-secondary">{t('ctaSecondary')}</a>
          </div>
          {/* Guarantee shield badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 18,
              padding: '8px 16px',
              background: 'var(--brand-jade-soft)',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--brand-jade-dark)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            {t('trustGuarantee')}
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '36px 0 0 0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px 22px',
              color: 'var(--brand-body)',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <li>★ {t('trustRating')}</li>
            <li>• {t('trustHomes')}</li>
            <li>• {t('trustYears')}</li>
            <li>• {t('trustGuarantee')}</li>
          </ul>
        </div>

        <div style={{ position: 'relative', paddingLeft: 28 }}>
          <div className="hero-photo" style={{ aspectRatio: '4 / 5', background: '#e6eae5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImg}
              alt={
                locale === 'zh'
                  ? '专业房屋油漆团队 — Cat Rumah Malaysia'
                  : locale === 'en'
                  ? 'Professional house painting team — Cat Rumah Malaysia'
                  : 'Pasukan cat rumah profesional — Cat Rumah Malaysia'
              }
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="eager"
            />
          </div>
          {/* Paint swatch chip stack — signature motif */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              bottom: 40,
              display: 'flex',
              gap: 2,
              padding: 8,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 16px 40px -18px rgba(30,36,48,0.24)',
            }}
          >
            {swatchChips.map((c) => (
              <span
                key={c}
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 56,
                  background: c,
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 880px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  )
}
