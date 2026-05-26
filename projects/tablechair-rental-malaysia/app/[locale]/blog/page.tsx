import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getBlogPosts } from '@/lib/webcore'
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { siteConfig, type Locale } from '@/config/site'

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
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
    },
  }
}

interface BlogPost {
  id: string
  slug: string
  cover_image_url: string | null
  published_at: string
  blog_translations: {
    title: string
    excerpt: string
  }[]
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'blog' })

  const fetched = await getBlogPosts(locale)
  const blogPosts = fetched.map((p) => ({
    id: p.id,
    slug: p.slug,
    cover_image_url: p.cover_image_url,
    published_at: p.published_at,
    blog_translations: [{ title: p.title, excerpt: p.excerpt }],
  })) as unknown as BlogPost[]

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[#FFFEF8]">
      <FomoBanner locale={locale} />
      <SiteHeader locale={locale} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <nav className="mb-6 text-sm text-[#111111]/60">
          <p className="inline">
            <Link href={`/${locale}`} className="hover:text-[#111111]">
              {t('breadcrumbs.home')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#111111]">{t('breadcrumbs.blog')}</span>
          </p>
        </nav>

        <h1 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl md:text-5xl">
          {t('heading')}
        </h1>
        <h2 className="mx-auto mb-12 max-w-2xl text-center text-[15px] font-normal leading-relaxed text-[#111111]/70 sm:text-[16px]">
          {t('subheading')}
        </h2>

        {blogPosts.length === 0 ? (
          <p className="text-center text-[#111111]/50">{t('noPosts')}</p>
        ) : (
          <div className="blog-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => {
              const translation = post.blog_translations[0]
              return (
                <BlogLinkTracker
                  key={post.id}
                  slug={post.slug}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_-6px_rgba(17,17,17,0.1)] ring-1 ring-black/5 hover:shadow-[0_8px_32px_-6px_rgba(253,216,53,0.3)]"
                  style={{ transition: 'box-shadow 250ms ease, transform 250ms ease' }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#FFF9C4]">
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
                      className="mb-2 block text-[12px] font-medium uppercase tracking-wider text-[#F9A825]"
                    >
                      {formatDate(post.published_at)}
                    </time>
                    <h5 className="mb-2 text-[17px] font-bold leading-snug text-[#111111] group-hover:text-[#F9A825]"
                      style={{ transition: 'color 200ms ease' }}
                    >
                      {translation?.title ?? post.slug}
                    </h5>
                    <p className="line-clamp-3 text-[14px] leading-relaxed text-[#111111]/65">
                      {translation?.excerpt ?? ''}
                    </p>
                  </div>
                </BlogLinkTracker>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}
