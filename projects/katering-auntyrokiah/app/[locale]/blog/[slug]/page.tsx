import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import {
  getBlogPost,
  getBlogPostSlugs,
  getPhoneNumber,
  getRecentBlogPosts,
} from '@/lib/webcore'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'
import { breadcrumbSchema } from '@/lib/schema'
import SiteNav from '@/components/sections/SiteNav'
import SiteFooter from '@/components/sections/SiteFooter'
import FomoBanner from '@/components/sections/FomoBanner'
import FinalCta from '@/components/sections/FinalCta'

type Params = { locale: Locale; slug: string }

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  const params: { locale: Locale; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const { slug } of slugs) {
      params.push({ locale: locale as Locale, slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getBlogPost(slug, locale)
  if (!post) return {}
  const tr = post.blog_translations[0]
  return {
    title: tr?.meta_title ?? tr?.title ?? slug,
    description: tr?.meta_description ?? tr?.excerpt ?? '',
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${slug}`,
      languages: {
        'ms-MY': `${siteConfig.url}/ms/blog/${slug}`,
        'en-MY': `${siteConfig.url}/en/blog/${slug}`,
        'zh-Hans-MY': `${siteConfig.url}/zh/blog/${slug}`,
        'x-default': `${siteConfig.url}/ms/blog/${slug}`,
      },
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, slug } = await params
  const post = await getBlogPost(slug, locale)
  if (!post) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  const tr = post.blog_translations[0]
  const recent = await getRecentBlogPosts(locale, slug, 3)
  const phoneResult = await getPhoneNumber()
  const defaultWaHref = waRedirect(locale, t('hero.lede'))

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(
      locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
      { year: 'numeric', month: 'long', day: 'numeric' },
    )

  const pageUrl = `${siteConfig.url}/${locale}/blog/${slug}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: t('breadcrumb.home'), item: `${siteConfig.url}/${locale}` },
              { name: t('blog.breadcrumbBlog'), item: `${siteConfig.url}/${locale}/blog` },
              { name: tr?.title ?? slug, item: pageUrl },
            ]),
          ),
        }}
      />
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

      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <nav className="mb-6 text-sm text-[var(--maroon-soft)]">
          <Link href={`/${locale}`} className="hover:text-[var(--maroon)]">
            {t('breadcrumb.home')}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/blog`} className="hover:text-[var(--maroon)]">
            {t('blog.breadcrumbBlog')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--maroon)]">{tr?.title ?? slug}</span>
        </nav>

        <h1 className="mb-4 text-[clamp(28px,4.5vw,40px)] font-extrabold tracking-[-0.035em] text-[var(--maroon)]">
          {tr?.title ?? slug}
        </h1>
        <h2 className="mb-6 text-[16px] font-medium text-[var(--maroon-soft)]">
          {tr?.excerpt ?? ''}
        </h2>
        <time
          dateTime={post.published_at}
          className="mb-8 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--honey-dark)]"
        >
          {t('blog.publishedOn')} {formatDate(post.published_at)}
        </time>

        {post.cover_image_url ? (
          <div className="mb-10 overflow-hidden rounded-2xl border border-[var(--hairline)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={tr?.title ?? slug}
              className="h-auto w-full"
              loading="eager"
            />
          </div>
        ) : null}

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: tr?.content ?? '' }}
        />

        {recent.length > 0 ? (
          <aside className="mt-16 border-t border-[var(--hairline)] pt-10">
            <h3 className="mb-6 text-[18px] font-extrabold tracking-[-0.025em] text-[var(--maroon)]">
              {t('blog.recentPosts')}
            </h3>
            <ul className="flex flex-col gap-3">
              {recent.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/${locale}/blog/${r.slug}`}
                    className="text-[15px] font-semibold text-[var(--honey-dark)] hover:text-[var(--maroon)]"
                    style={{ transition: 'color 180ms ease' }}
                  >
                    {r.blog_translations[0]?.title ?? r.slug} →
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </article>

      <FinalCta
        eyebrow={t('finalCta.eyebrow')}
        heading={t('finalCta.heading')}
        body={t('finalCta.body')}
        buttonLabel={t('finalCta.button')}
        waHref={defaultWaHref}
        phone={phoneResult.phone}
      />
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
