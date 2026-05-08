import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

interface Props { locale: string; phoneNumber?: string }

export function Nav({ locale, phoneNumber }: Props) {
  const t = useTranslations('nav')
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(251,247,240,0.92)',
        backdropFilter: 'saturate(1.5) blur(12px)',
        WebkitBackdropFilter: 'saturate(1.5) blur(12px)',
        borderBottom: '1px solid var(--brand-border)',
      }}
    >
      <div
        className="container-p"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          gap: 24,
        }}
      >
        <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              width: 36, height: 36,
              background: 'var(--brand-jade)',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
            }}
          >C</span>
          <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--brand-charcoal)' }}>
            {t('brand')}
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }} className="nav-links">
          <a href="#services" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-body)' }}>{t('services')}</a>
          <a href="#reviews" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-body)' }}>{t('reviews')}</a>
          <a href="#gallery" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-body)' }}>{t('gallery')}</a>
          <a href="#locations" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-body)' }}>{t('locations')}</a>
          <a href="#faq" style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-body)' }}>{t('faq')}</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LanguageSwitcher />
          <div className="nav-cta">
            <WhatsAppButton locale={locale} label={t('cta')} phoneNumber={phoneNumber} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 640px) {
          .nav-cta { display: none; }
        }
      `}</style>
    </nav>
  )
}
