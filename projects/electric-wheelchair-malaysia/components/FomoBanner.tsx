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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-3 flex-wrap text-white text-sm sm:text-[15px] leading-snug">
        <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-white" aria-hidden="true" />
        <span className="font-semibold">{text}</span>
        <a
          href={waRedirect(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-white/15 px-3 py-1 font-bold underline underline-offset-2 hover:bg-white/25 hover:no-underline"
        >
          {t('bookNow')} &rarr;
        </a>
      </div>
    </div>
  )
}
