import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getBlogPosts, getPhoneNumber } from '@/lib/webcore'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { FlutedMarkLight } from '@/components/Ornaments'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import BlogClickTracker from '@/components/tracking/BlogClickTracker'
import { TOP_FOOTER_LOCATIONS, findLocation } from '@/config/locations'

type Params = { locale: string }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
    },
  }
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'blog' })
  const tShared = await getTranslations({ locale, namespace: 'shared' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFoot = await getTranslations({ locale, namespace: 'footer' })

  const waHref = waRedirect(locale, tShared('whatsappMessageDefault'))
  const { phone: trackedPhone } = await getPhoneNumber()

  const blogPosts = await getBlogPosts(locale)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(
      locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
      { year: 'numeric', month: 'long', day: 'numeric' },
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* FOMO Banner */}
      <div className="relative z-50 bg-[#B71F2B] py-2.5 text-center text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 text-[13px] sm:gap-5 sm:text-[14px]">
          <p className="inline-flex items-center gap-2 font-medium">
            <span>{tShared('fomoText')}</span>
          </p>
          <WhatsAppClickTracker phone={trackedPhone}>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 rounded-full border border-white/40 px-3 py-1 text-[12px] font-bold text-white hover:bg-white hover:text-[#B71F2B] sm:inline-flex"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tShared('fomoCta')}
            </a>
          </WhatsAppClickTracker>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#13204C]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/${locale}`}
            aria-label={tShared('alt.logoAria')}
            className="flex shrink-0 items-center gap-2.5"
          >
            <FlutedMarkLight className="h-9 w-9" />
            <span
              className="text-[17px] font-semibold tracking-tight text-white sm:text-[18px]"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
            >
              Wall Panel Malaysia
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href={`/${locale}#styles`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-medium text-white/90 hover:bg-white/10 hover:text-white"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('services')}
            </Link>
            <Link
              href={`/${locale}#locations`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-medium text-white/90 hover:bg-white/10 hover:text-white"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('locations')}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="rounded-full bg-white/10 px-3.5 py-1.5 text-[14px] font-medium text-white"
            >
              {tNav('blog')}
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </header>

      {/* Blog Listing */}
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
        <nav className="mb-6 text-sm text-[#5A6480]">
          <p className="inline">
            <Link href={`/${locale}`} className="hover:text-[#13204C]">
              {t('breadcrumbs.home')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#13204C]">{t('breadcrumbs.blog')}</span>
          </p>
        </nav>

        <div className="mb-12 text-center">
          <p className="eyebrow eyebrow-lg">{locale === 'ms' ? 'BLOG' : locale === 'zh' ? '博客' : 'BLOG'}</p>
          <h1
            className="mb-3 text-3xl font-semibold tracking-tight text-[#13204C] sm:text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {t('heading')}
          </h1>
          <h2
            className="mx-auto max-w-2xl text-[15px] font-normal leading-relaxed text-[#5A6480] sm:text-[16px]"
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            {t('subheading')}
          </h2>
        </div>

        {blogPosts.length === 0 ? (
          <p className="text-center text-[#5A6480]">{t('noPosts')}</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => {
              const translation = post.blog_translations[0]
              return (
                <BlogClickTracker key={post.id} slug={post.slug}>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="group overflow-hidden rounded-2xl border border-[#DCD3C3] bg-white card-shadow card-shadow-hover"
                    style={{ transition: 'box-shadow 250ms ease' }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-white">
                      {post.cover_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image_url}
                          alt={translation?.title ?? post.slug}
                          className="h-full w-full object-cover group-hover:scale-105"
                          style={{ transition: 'transform 400ms ease' }}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <time
                        dateTime={post.published_at}
                        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#C8A45C]"
                        style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                      >
                        {formatDate(post.published_at)}
                      </time>
                      <h5
                        className="mb-2 text-[18px] font-semibold leading-snug text-[#13204C] group-hover:text-[#A8853F]"
                        style={{
                          fontFamily: 'var(--font-jakarta), sans-serif',
                          transition: 'color 200ms ease',
                        }}
                      >
                        {translation?.title ?? post.slug}
                      </h5>
                      <p className="line-clamp-3 text-[14px] leading-relaxed text-[#5A6480]">
                        {translation?.excerpt ?? ''}
                      </p>
                    </div>
                  </Link>
                </BlogClickTracker>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="contact" className="relative bg-[#0B153A] text-[#FBF7EF]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <p className="flex items-center gap-2.5">
                <FlutedMarkLight className="h-10 w-10" />
                <span
                  className="text-[18px] font-semibold tracking-tight"
                  style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
                >
                  Wall Panel Malaysia
                </span>
              </p>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#FBF7EF]/70">
                {tFoot('tagline')}
              </p>
            </div>
            <div>
              <p className="eyebrow eyebrow-light">
                {locale === 'ms' ? 'JELAJAH' : locale === 'zh' ? '导览' : 'EXPLORE'}
              </p>
              <h4
                className="text-[14px] font-semibold tracking-tight text-[#FBF7EF]"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                {tFoot('quickLinks')}
              </h4>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.7]">
                <li>
                  <Link href={`/${locale}#styles`} className="text-[#FBF7EF]/75 hover:text-[#C8A45C]">
                    {tNav('services')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}#locations`} className="text-[#FBF7EF]/75 hover:text-[#C8A45C]">
                    {tNav('locations')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/blog`} className="text-[#FBF7EF]/75 hover:text-[#C8A45C]">
                    {tNav('blog')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow eyebrow-light">
                {locale === 'ms' ? 'LOKASI PEMASANGAN' : locale === 'zh' ? '服务城市' : 'WHERE WE INSTALL'}
              </p>
              <h4
                className="text-[14px] font-semibold tracking-tight text-[#FBF7EF]"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                {tFoot('topLocations')}
              </h4>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.7]">
                {TOP_FOOTER_LOCATIONS.map((sl) => {
                  const l = findLocation(sl)
                  if (!l) return null
                  return (
                    <li key={sl}>
                      <Link
                        href={`/${locale}/${siteConfig.productSlug}/${sl}`}
                        className="text-[#FBF7EF]/75 hover:text-[#C8A45C]"
                        style={{ transition: 'color 160ms ease' }}
                      >
                        {l.display[locale as Locale]}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <p className="eyebrow eyebrow-light">
                {locale === 'ms' ? 'HUBUNGI' : locale === 'zh' ? '联系' : 'GET IN TOUCH'}
              </p>
              <h4
                className="text-[14px] font-semibold tracking-tight text-[#FBF7EF]"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                {tFoot('getInTouch')}
              </h4>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#FBF7EF]/70">
                {tFoot('getInTouchSub')}
              </p>
              <div className="mt-4">
                <WhatsAppClickTracker phone={trackedPhone}>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_8px_22px_rgba(37,211,102,0.32)] hover:bg-[#1EBE57]"
                    style={{ transition: 'background-color 200ms ease' }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
                    </svg>
                    {tNav('whatsapp')}
                  </a>
                </WhatsAppClickTracker>
              </div>
              <div className="mt-5">
                <LanguageSwitcher variant="dark" />
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-[#FBF7EF]/15 pt-6 text-xs text-[#FBF7EF]/60">
            <p>{tFoot('legal', { year: String(new Date().getFullYear()) })}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

