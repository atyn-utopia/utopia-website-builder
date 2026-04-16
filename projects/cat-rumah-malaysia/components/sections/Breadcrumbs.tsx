import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Props { locale: string; cityName: string }

export function Breadcrumbs({ locale, cityName }: Props) {
  const t = useTranslations('location')
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        background: 'var(--brand-cream)',
        borderBottom: '1px solid var(--brand-border)',
      }}
    >
      <ol
        className="container-p"
        style={{
          listStyle: 'none',
          padding: '14px 24px',
          margin: 0,
          display: 'flex',
          gap: 10,
          fontSize: 13,
          color: 'var(--brand-muted)',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <li>
          <Link href={`/${locale}`} style={{ color: 'var(--brand-body)', fontWeight: 600 }}>
            {t('breadcrumbsHome')}
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link href={`/${locale}`} style={{ color: 'var(--brand-body)', fontWeight: 600 }}>
            {t('breadcrumbsService')}
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li style={{ color: 'var(--brand-charcoal)', fontWeight: 700 }}>{cityName}</li>
      </ol>
    </nav>
  )
}
