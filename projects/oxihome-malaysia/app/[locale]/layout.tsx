import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import { siteConfig } from '@/config/site'
import { getPhoneNumber, waLink } from '@/lib/webcore'
import '../globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const WA_GREEN = '#25D366'

const OxiIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
    {/* Droplet / oxygen bubble */}
    <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.15" />
    <path
      d="M16 6C16 6 9 13.5 9 18.5C9 22.09 12.13 25 16 25C19.87 25 23 22.09 23 18.5C23 13.5 16 6 16 6Z"
      fill="white"
    />
    <text x="13" y="21" fontSize="9" fontWeight="700" fill="#0B6B82" fontFamily="sans-serif">O₂</text>
  </svg>
)

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const localeNames: Record<string, string> = { en: 'en_MY', ms: 'ms_MY', zh: 'zh_CN' }

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: 'Oxygen Machine Malaysia | Rent from RM250/mo | Oxihome',
      template: '%s | Oxihome Malaysia',
    },
    description: "Malaysia's dedicated home oxygen equipment provider. Rent or buy oxygen machines with 4-hour same-day delivery across 127 locations.",
    openGraph: {
      type: 'website',
      locale: localeNames[locale] ?? 'en_MY',
      url: siteConfig.siteUrl,
      siteName: siteConfig.name,
    },
    alternates: seoAlternates(locale),
    robots: { index: true, follow: true },
    icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/icon.svg' },
  }
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'ms' | 'zh')) notFound()

  const messages = await getMessages()
  const t  = await getTranslations({ locale, namespace: 'nav' })
  const { phone } = await getPhoneNumber('all')

  const navLinks = [
    { label: t('products'),  href: `/${locale}#products` },
    { label: t('locations'), href: `/${locale}#locations` },
    { label: t('blog'),      href: `/${locale}/blog` },
  ]

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <OrganizationSchema />
        <link rel="alternate" hrefLang="en" href={`${siteConfig.siteUrl}/en`} />
        <link rel="alternate" hrefLang="ms" href={`${siteConfig.siteUrl}/ms`} />
        <link rel="alternate" hrefLang="zh" href={`${siteConfig.siteUrl}/zh`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteConfig.siteUrl}/en`} />
              <script defer src="https://webcore.utopiaai.my/t.js" data-website="oksigen.com.my"></script>
      </head>
      <body className="antialiased" style={{ fontFamily: 'var(--font-body)', color: 'var(--brand-text)', background: 'var(--brand-white)' }}>
        <NextIntlClientProvider messages={messages}>

          {/* ── HEADER ── */}
          <header
            className="sticky top-0 z-50 border-b"
            style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderColor: 'var(--brand-border)' }}
          >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
              {/* Logo: SVG icon + brand text */}
              <a href={`/${locale}`} className="shrink-0 flex items-center gap-2.5 group">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <OxiIcon />
                </div>
                <span className="font-display font-normal text-xl leading-none tracking-tight" style={{ color: 'var(--brand-dark)' }}>
                  Oxi<span style={{ color: 'var(--brand-primary)' }}>home</span>
                  <span className="text-sm font-medium ml-0.5" style={{ color: 'var(--brand-text-muted)', fontFamily: 'var(--font-body)' }}>.my</span>
                </span>
              </a>

              <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="nav-link text-sm font-medium focus:outline-none"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3 shrink-0">
                <LanguageSwitcher currentLocale={locale} />
                <a
                  href={`/${locale}/redirect-whatsapp-1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ background: WA_GREEN }}
                >
                  <WAIcon />
                  {t('whatsapp')}
                </a>
              </div>
            </div>
          </header>

          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
