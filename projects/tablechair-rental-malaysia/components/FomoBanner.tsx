// Extracted from PageShell so every public page can drop the same FOMO bar
// at the top of the document. Server component — text comes from `shared.fomoText`
// and the WhatsApp CTA from the localised default redirect URL.
import { getTranslations } from 'next-intl/server'
import { waRedirect } from '@/lib/waRedirect'
import FomoCountdown from '@/components/FomoCountdown'
import type { Locale } from '@/config/site'

export default async function FomoBanner({ locale }: { locale: Locale }) {
  const tShared = await getTranslations({ locale, namespace: 'shared' })
  const waDefault = waRedirect(locale, tShared('whatsappMessageDefault'))

  return (
    <div className="relative z-50 overflow-hidden bg-[#111111] py-2.5 text-center text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 text-[13px] sm:gap-5 sm:text-[14px]">
        <p className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FDD835] opacity-75" />
            <span className="inline-flex h-2 w-2 rounded-full bg-[#FDD835]" />
          </span>
          <span className="font-medium">{tShared('fomoText')}</span>
        </p>
        <FomoCountdown />
        <a
          href={waDefault}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-full bg-[#25D366] px-4 py-1 text-[12px] font-bold text-white hover:bg-[#1EB85A] sm:inline-flex"
          style={{ transition: 'background-color 180ms ease' }}
        >
          {tShared('fomoCta')}
        </a>
      </div>
    </div>
  )
}
