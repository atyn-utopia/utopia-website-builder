// Shared footer used by homepage, location pages, blog listing, blog post.
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { siteConfig } from '@/config/site'
import type { Locale } from '@/i18n/routing'

function waRedirect(locale: string) {
  return `/${locale}/redirect-whatsapp-1`
}

const FOOTER_LOCATIONS = [
  'kuala-lumpur',
  'petaling-jaya',
  'shah-alam',
  'johor-bahru',
  'george-town',
  'ipoh',
] as const

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFoot = await getTranslations({ locale, namespace: 'footer' })
  const waHref = waRedirect(locale)
  const year = new Date().getFullYear()

  return (
    <footer className="py-12 px-6" style={{ background: '#0F2238' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#FACC15' }}
                aria-hidden="true"
              >
                <span className="text-[#1B3A5C] font-bold text-sm">EB</span>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">Encik Beku</span>
            </div>
            <p
              className="text-xs font-normal leading-relaxed max-w-xs"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {tFoot('description')}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-80"
                style={{ color: '#25D366' }}
              >
                {tFoot('whatsappUs')}
              </a>
              <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {tFoot('phone')}
              </span>
            </div>
          </div>
          <div>
            <h6 className="text-[11px] font-bold uppercase tracking-widest mb-3 text-yellow-400">
              {tNav('locations')}
            </h6>
            <ul className="space-y-2 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {FOOTER_LOCATIONS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${locale}/${siteConfig.productSlug}/${slug}`}
                    className="hover:text-white"
                  >
                    {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="text-[11px] font-bold uppercase tracking-widest mb-3 text-yellow-400">
              {tNav('home')}
            </h6>
            <ul className="space-y-2 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <li><Link href={`/${locale}`} className="hover:text-white">{tNav('home')}</Link></li>
              <li><a href={`/${locale}#services`} className="hover:text-white">{tNav('services')}</a></li>
              <li><a href={`/${locale}#reviews`} className="hover:text-white">{tNav('reviews')}</a></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-white">{tNav('blog')}</Link></li>
            </ul>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        <div
          className="border-t pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-normal"
          style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
        >
          <p>{tFoot('copyright', { year })} · {tFoot('ssm')}</p>
        </div>
      </div>
    </footer>
  )
}
