import { useTranslations } from 'next-intl'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface Props { locale: string; locationSlug?: string }

export function FinalCta({ locale, locationSlug }: Props) {
  const t = useTranslations('finalCta')
  return (
    <section className="section bg-charcoal" style={{ textAlign: 'center' }}>
      <div className="container-p" style={{ maxWidth: 760 }}>
        <span
          className="eyebrow"
          style={{
            background: 'rgba(215,240,234,0.12)',
            color: 'var(--brand-jade-soft)',
          }}
        >
          {t('eyebrow')}
        </span>
        <h2 className="t-h2" style={{ color: '#fff', marginTop: 20 }}>
          {t('headline')}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 18, marginTop: 16, lineHeight: 1.65 }}>
          {t('subheadline')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
          <WhatsAppButton locale={locale} locationSlug={locationSlug} label={t('cta')} />
          <a href="#gallery" className="btn-secondary" style={{ color: 'var(--brand-jade-soft)', borderColor: 'var(--brand-jade-soft)' }}>
            {t('ctaSecondary')}
          </a>
        </div>
      </div>
    </section>
  )
}
