'use client'

import { useLocale, useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { waRedirect } from '@/lib/waRedirect'

function ShutterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="var(--brand-charcoal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="3" y1="14" x2="21" y2="14" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <circle cx="12" cy="20" r="1" fill="var(--brand-charcoal)" stroke="none" />
    </svg>
  )
}

function WAIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
    </svg>
  )
}

export default function SiteFooter() {
  const locale = useLocale()
  const navT = useTranslations('nav')
  const footT = useTranslations('footer')
  const waHref = waRedirect(locale)

  return (
    <footer style={{ background: '#151719' }} className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: 'var(--brand-yellow)' }}
                role="img"
                aria-label={navT('logoAlt')}
              >
                <ShutterIcon />
              </div>
              <span className="font-bold text-white text-sm">{navT('brandName')}</span>
            </div>
            <h6 className="body-h6 text-xs font-normal mb-4" style={{ color: 'var(--brand-steel-light)', lineHeight: '1.7' }}>{footT('tagline')}</h6>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              onClick={() => {
                if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
                  window.uwc('click', { label: 'whatsapp-footer' })
                }
              }}
            >
              <WAIcon size={14} />
              {navT('whatsappCta')}
            </a>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">{footT('services.heading')}</h4>
            <ul className="space-y-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <li key={i}>
                  <span className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{footT(`services.items.${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">{footT('productTypes.heading')}</h4>
            <ul className="space-y-1.5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i}>
                  <span className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{footT(`productTypes.items.${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">{footT('areas.heading')}</h4>
            <ul className="space-y-1.5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i}>
                  <span className="text-xs font-normal" style={{ color: 'var(--brand-steel-light)' }}>{footT(`areas.items.${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h6 className="body-h6 text-xs font-normal" style={{ color: 'var(--brand-steel)' }}>{footT('copyright')}</h6>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  )
}
