import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site'
import { getBlogPosts, getBlogPostBySlug } from '@/lib/webcore'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getBlogPostBySlug(slug, locale)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
      languages: {
        ms: `${siteConfig.siteUrl}/ms/blog/${slug}`,
        en: `${siteConfig.siteUrl}/en/blog/${slug}`,
        zh: `${siteConfig.siteUrl}/zh/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
      siteName: siteConfig.brandName,
      type: 'article',
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = await getBlogPostBySlug(slug, locale)
  if (!post) notFound()
  const t = await getTranslations({ locale, namespace: 'blog' })
  const tBread = await getTranslations({ locale, namespace: 'location.breadcrumb' })

  const allPosts = await getBlogPosts(locale)
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3)

  const date = new Date(post.published_at)
  const formattedDate = Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY', { year: 'numeric', month: 'long', day: 'numeric' })

  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <FomoBanner locale={locale as Locale} />
      <SiteHeader />
      <BreadcrumbSchema
        items={[
          { name: tBread('home'), url: `/${locale}` },
          { name: t('heading'), url: `/${locale}/blog` },
          { name: post.title, url: `/${locale}/blog/${slug}` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.siteUrl}/${locale}/blog/${slug}` },
            headline: post.title,
            description: post.meta_description || post.excerpt || '',
            ...(post.cover_image_url ? { image: [post.cover_image_url] } : {}),
            datePublished: post.published_at,
            dateModified: post.published_at,
            author: { '@type': 'Organization', name: siteConfig.brandName },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.brandName,
              logo: { '@type': 'ImageObject', url: `${siteConfig.siteUrl}/favicon.svg` },
            },
            inLanguage: locale,
          }),
        }}
      />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#142C50', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {post.title}
          </h1>
          <h2 style={{ fontSize: 16, fontWeight: 400, color: '#5B6478', margin: '14px 0 0', lineHeight: 1.55 }}>
            {post.excerpt}
          </h2>
          <div style={{ display: 'flex', gap: 14, marginTop: 18, fontSize: 13, color: '#5B6478', alignItems: 'center', flexWrap: 'wrap' }}>
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && <span style={{ opacity: 0.4 }}>·</span>}
            <span>{readingTime} min</span>
          </div>
        </header>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: 'auto', borderRadius: 14, marginBottom: 32, display: 'block' }} />
        )}

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <section style={{ background: '#142C50', color: '#fff', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{t('ctaHeading')}</h3>
          <p style={{ fontSize: 15, opacity: 0.85, margin: '12px 0 22px', lineHeight: 1.6 }}>{t('ctaSubheading')}</p>
          <Link href={`/${locale}/redirect-whatsapp-1`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#25D366', color: '#fff', padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            {t('ctaButton')}
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ padding: '56px 24px', background: '#FAF7F2' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#142C50', margin: '0 0 24px' }}>{t('readMore')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {related.map((p) => (
                <BlogLinkTracker
                  key={p.id}
                  slug={p.slug}
                  href={`/${locale}/blog/${p.slug}`}
                  style={{ background: '#fff', borderRadius: 12, padding: 20, textDecoration: 'none', color: 'inherit', boxShadow: '0 1px 2px rgba(20,28,48,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#142C50', margin: 0, lineHeight: 1.35 }}>{p.title}</h4>
                  <p style={{ fontSize: 13, color: '#5B6478', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.excerpt}</p>
                </BlogLinkTracker>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '24px', textAlign: 'center', background: '#fff' }}>
        <Link href={`/${locale}/blog`} style={{ fontSize: 14, color: '#5B6478', textDecoration: 'none' }}>
          {t('backToBlog')}
        </Link>
      </section>

      <SiteFooter locale={locale} />
    </main>
  )
}
