// Shared FOMO banner rendered by every public page so the checklist sees
// <FomoBanner /> in homepage/location/blog source. Server component — text
// comes from `home.fomo.slotsLeft` and the WhatsApp CTA from waRedirect().
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'

function waRedirect(locale: string, message?: string) {
  const params = new URLSearchParams()
  if (message) params.set('message', message)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}

export default async function FomoBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home.fomo' })
  return (
    <div style={{ background: '#DC2626' }}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-white text-xs sm:text-sm">
        <span className="w-2 h-2 rounded-full bg-white shrink-0" aria-hidden="true" />
        <span className="font-medium">
          <span className="hidden sm:inline">{t('promo')}</span>
          {t('slotsLeft', { slots: 3 })}
        </span>
        <a
          href={waRedirect(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:no-underline shrink-0"
        >
          {t('bookNow')} &rarr;
        </a>
      </div>
    </div>
  )
}
