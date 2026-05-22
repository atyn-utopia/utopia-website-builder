import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getBlogPosts, getPhoneNumber } from '@/lib/webcore'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'
import SiteNav from '@/components/sections/SiteNav'
import SiteFooter from '@/components/sections/SiteFooter'
import FomoBanner from '@/components/sections/FomoBanner'
import BlogClickTracker from '@/components/tracking/BlogClickTracker'
import { Eyebrow } from '@/components/PageShell'

type Params = { locale: Locale }

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
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        'ms-MY': `${siteConfig.url}/ms/blog`,
        'en-MY': `${siteConfig.url}/en/blog`,
        'zh-Hans-MY': `${siteConfig.url}/zh/blog`,
        'x-default': `${siteConfig.url}/ms/blog`,
      },
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
  const t = await getTranslations({ locale })

  const [posts, phoneResult] = await Promise.all([
    getBlogPosts(locale),
    getPhoneNumber(),
  ])

  const defaultWaHref = waRedirect(locale, t('hero.lede'))

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(
      locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
      { year: 'numeric', month: 'long', day: 'numeric' },
    )

  return (
    <>
      <FomoBanner
        eyebrow={t('fomo.eyebrow')}
        line={t('fomo.line')}
        countdownLabel={t('fomo.countdownLabel')}
        ctaLabel={t('fomo.ctaMini')}
        waHref={defaultWaHref}
        phone={phoneResult.phone}
      />
      <SiteNav
        locale={locale}
        labels={{
          logoAria: t('nav.logoAria'),
          pakej: t('nav.pakej'),
          locations: t('nav.locations'),
          blog: t('nav.blog'),
          contact: t('nav.contact'),
          whatsapp: t('nav.whatsapp'),
        }}
        waHref={defaultWaHref}
        phone={phoneResult.phone}
      />

      <main className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <nav className="mb-6 text-sm text-[var(--maroon-soft)]">
          <Link href={`/${locale}`} className="hover:text-[var(--maroon)]">
            {t('breadcrumb.home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--maroon)]">{t('blog.breadcrumbBlog')}</span>
        </nav>

        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <Eyebrow>{t('blog.breadcrumbBlog')}</Eyebrow>
          <h1 className="text-[clamp(32px,5vw,48px)] font-extrabold tracking-[-0.035em] text-[var(--maroon)]">
            {t('blog.heading')}
          </h1>
          <h2 className="max-w-2xl text-[16px] leading-[1.7] text-[var(--maroon-soft)]">
            {t('blog.subheading')}
          </h2>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-[15px] text-[var(--maroon-soft)]">
            {t('blog.noPosts')}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const tr = post.blog_translations[0]
              return (
                <BlogClickTracker key={post.id} slug={post.slug}>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="card-heritage group block overflow-hidden rounded-2xl hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_var(--shadow-tint)]"
                    style={{
                      transition: 'transform 220ms ease, box-shadow 220ms ease',
                    }}
                  >
                    {post.cover_image_url ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--cream-deep)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.cover_image_url}
                          alt={tr?.title ?? post.slug}
                          className="h-full w-full object-cover group-hover:scale-105"
                          style={{ transition: 'transform 400ms ease' }}
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <time
                        dateTime={post.published_at}
                        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--honey-dark)]"
                      >
                        {formatDate(post.published_at)}
                      </time>
                      <h3 className="mb-2 text-[18px] font-extrabold leading-snug tracking-[-0.025em] text-[var(--maroon)] group-hover:text-[var(--honey-dark)]"
                        style={{ transition: 'color 200ms ease' }}
                      >
                        {tr?.title ?? post.slug}
                      </h3>
                      <p
                        className="text-[14px] leading-[1.7] text-[var(--maroon-soft)]"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {tr?.excerpt ?? ''}
                      </p>
                    </div>
                  </Link>
                </BlogClickTracker>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter
        locale={locale}
        labels={{
          tagline: t('footer.tagline'),
          legal: t('footer.legal'),
          col1Eyebrow: t('footer.col1Eyebrow'),
          col1Heading: t('footer.col1Heading'),
          col1Link1: t('footer.col1Link1'),
          col1Link2: t('footer.col1Link2'),
          col1Link3: t('footer.col1Link3'),
          col1Link4: t('footer.col1Link4'),
          col2Eyebrow: t('footer.col2Eyebrow'),
          col2Heading: t('footer.col2Heading'),
          col3Eyebrow: t('footer.col3Eyebrow'),
          col3Heading: t('footer.col3Heading'),
          col3Link: t('footer.col3Link'),
          col4Eyebrow: t('footer.col4Eyebrow'),
          col4Heading: t('footer.col4Heading'),
          col4Cta: t('footer.col4Cta'),
        }}
        waHref={defaultWaHref}
        phone={phoneResult.phone}
      />
    </>
  )
}
