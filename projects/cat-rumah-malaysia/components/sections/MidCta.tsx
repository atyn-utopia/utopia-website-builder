import { useTranslations } from 'next-intl'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface Props { locale: string; locationSlug?: string }

export function MidCta({ locale, locationSlug }: Props) {
  const t = useTranslations('midCta')
  return (
    <section className="bg-jade-gradient" style={{ padding: 'clamp(44px, 5.5vw, 72px) 0' }}>
      <div className="container-p" style={{ textAlign: 'center', maxWidth: 780 }}>
        <h2 className="t-h2" style={{ color: '#fff' }}>{t('heading')}</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginTop: 16, lineHeight: 1.6 }}>
          {t('line')}
        </p>
        <div style={{ marginTop: 30 }}>
          <WhatsAppButton locale={locale} locationSlug={locationSlug} label={t('cta')} />
        </div>
      </div>
    </section>
  )
}
