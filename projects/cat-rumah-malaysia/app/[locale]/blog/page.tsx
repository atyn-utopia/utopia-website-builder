import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site'
import { getBlogPosts } from '@/lib/webcore'
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog.meta' })
  const url = `${siteConfig.siteUrl}/${locale}/blog`
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url,
      languages: {
        ms: `${siteConfig.siteUrl}/ms/blog`,
        en: `${siteConfig.siteUrl}/en/blog`,
        zh: `${siteConfig.siteUrl}/zh/blog`,
      },
    },
    openGraph: { title: t('title'), description: t('description'), url, siteName: siteConfig.brandName, type: 'website' },
  }
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = await getBlogPosts(locale)
  const dateLocale = locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY'

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff' }}>
      <FomoBanner locale={locale as Locale} />
      <SiteHeader />

      <section style={{ background: 'linear-gradient(135deg, #0F1626 0%, #142C50 100%)', padding: '64px 24px', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{t('heading')}</h1>
          <h2 style={{ fontSize: 16, fontWeight: 400, margin: '14px auto 0', maxWidth: 620, opacity: 0.85, lineHeight: 1.5 }}>{t('subheading')}</h2>
        </div>
      </section>

      <section style={{ padding: '56px 24px', background: '#FAF7F2' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#5B6478', fontSize: 16 }}>
              {t('subheading')}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {posts.map((post) => {
                const date = new Date(post.published_at)
                const formattedDate = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
                return (
                  <BlogLinkTracker
                    key={post.id}
                    slug={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 2px rgba(20,28,48,0.06), 0 4px 12px rgba(20,28,48,0.04)', textDecoration: 'none', color: 'inherit' }}
                  >
                    {post.cover_image_url && (
                      <div style={{ width: '100%', height: 200, backgroundImage: `url(${post.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    )}
                    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {formattedDate && (<span style={{ fontSize: 12, color: '#5B6478', letterSpacing: '0.04em' }}>{formattedDate}</span>)}
                      <h3 style={{ fontSize: 19, fontWeight: 700, color: '#142C50', margin: 0, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{post.title}</h3>
                      <p style={{ fontSize: 14, color: '#5B6478', margin: 0, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                      <span style={{ marginTop: 'auto', fontSize: 13, fontWeight: 600, color: '#2563EB', paddingTop: 6 }}>
                        {t('readMore')} →
                      </span>
                    </div>
                  </BlogLinkTracker>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '32px 24px', textAlign: 'center', background: '#fff' }}>
        <Link href={`/${locale}`} style={{ display: 'inline-block', fontSize: 14, color: '#5B6478', textDecoration: 'none' }}>
          ← {t('backToBlog')}
        </Link>
      </section>

      <SiteFooter locale={locale} />
    </main>
  )
}
