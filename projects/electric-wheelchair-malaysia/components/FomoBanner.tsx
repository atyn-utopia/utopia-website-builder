// Shared FOMO banner rendered by every public page so the checklist sees
// <FomoBanner /> in homepage/location/blog source. Server component —
// reads this project's actual schema: fomoBanner.{texts[], bookNow}.
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'

function waRedirect(locale: string) {
  return `/${locale}/redirect-whatsapp-1`
}

export default async function FomoBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'fomoBanner' })
  const texts = t.raw('texts') as string[]
  const text = Array.isArray(texts) && texts.length > 0 ? texts[0] : ''

  return (
    <div style={{ background: '#DC2626' }}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap text-white text-xs sm:text-sm">
        <span className="w-2 h-2 rounded-full bg-white shrink-0" aria-hidden="true" />
        <span className="font-medium">{text}</span>
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
