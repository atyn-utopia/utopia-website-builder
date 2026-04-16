import { useTranslations } from 'next-intl'

function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.3C40.9 36 44 30.4 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  )
}

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 2, color: 'var(--google-gold)' }} aria-hidden>
      {[0,1,2,3,4].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  )
}

export function GoogleReviews() {
  const t = useTranslations('reviews')
  const reviews = [1, 2, 3, 4, 5, 6] as const

  return (
    <section id="reviews" className="section bg-cream">
      <div className="container-p">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
          <p className="t-lead" style={{ marginTop: 14 }}>{t('subheading')}</p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
              padding: '10px 18px',
              borderRadius: 999,
              background: '#fff',
              border: '1px solid var(--brand-border)',
              boxShadow: '0 4px 16px -8px rgba(30,36,48,0.12)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-muted)' }}>
              {t('googleLabel')}
            </span>
            <GoogleG size={18} />
            <span style={{ fontWeight: 800, color: 'var(--brand-charcoal)', fontSize: 15 }}>
              {t('googleBrand')}
            </span>
            <Stars />
          </div>
        </div>

        <div
          className="reviews-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 22,
          }}
        >
          {reviews.map((n) => (
            <article
              key={n}
              style={{
                background: '#fff',
                borderRadius: 20,
                border: '1px solid var(--brand-border)',
                padding: 24,
                boxShadow: '0 2px 6px rgba(30,36,48,0.04), 0 16px 40px -18px rgba(30,36,48,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <GoogleG size={20} />
                <Stars />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--brand-charcoal)', flex: 1 }}>
                "{t(`review${n}.text`)}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'var(--brand-jade-soft)',
                    color: 'var(--brand-jade-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {t(`review${n}.name`).slice(0, 1)}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--brand-charcoal)' }}>
                    {t(`review${n}.name`)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--brand-muted)' }}>
                    {t(`review${n}.location`)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 960px) {
          .reviews-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
