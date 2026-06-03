import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getBlogPosts, getBlogPostBySlug } from '@/lib/webcore'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import type { Locale as AppLocale } from '@/i18n/routing'

const POST_COPY = {
  en: {
    home: 'Home',
    blog: 'Blog',
    back: '← Back to blog',
    minRead: 'min read',
    relatedTitle: 'Related articles',
    ctaTitle: 'Need a hospital bed at home?',
    ctaBody: 'WhatsApp our team for same-day hospital bed delivery and setup across Malaysia.',
    ctaButton: 'Chat on WhatsApp',
  },
  ms: {
    home: 'Laman Utama',
    blog: 'Blog',
    back: '← Kembali ke blog',
    minRead: 'min bacaan',
    relatedTitle: 'Artikel berkaitan',
    ctaTitle: 'Perlu katil hospital di rumah?',
    ctaBody: 'WhatsApp pasukan kami untuk penghantaran dan pemasangan katil hospital pada hari yang sama di seluruh Malaysia.',
    ctaButton: 'WhatsApp Kami',
  },
  zh: {
    home: '首页',
    blog: '博客',
    back: '← 返回博客',
    minRead: '分钟阅读',
    relatedTitle: '相关文章',
    ctaTitle: '今天需要医院病床吗？',
    ctaBody: '通过 WhatsApp 联系我们的团队，全马来西亚当日送货并安装医院病床。',
    ctaButton: 'WhatsApp 联系',
  },
} as const

type Locale = keyof typeof POST_COPY

function copyFor(locale: string) {
  return POST_COPY[(locale as Locale)] ?? POST_COPY.en
}

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
        en: `${siteConfig.siteUrl}/en/blog/${slug}`,
        ms: `${siteConfig.siteUrl}/ms/blog/${slug}`,
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
  const c = copyFor(locale)

  const post = await getBlogPostBySlug(slug, locale)
  if (!post) notFound()

  const allPosts = await getBlogPosts(locale)
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3)

  const date = new Date(post.published_at)
  const formattedDate = Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY', {
        year: 'numeric', month: 'long', day: 'numeric',
      })

  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <FomoBanner locale={locale as AppLocale} />
      <SiteHeader locale={locale as AppLocale} />
      <BreadcrumbSchema
        items={[
          { name: c.home, url: `/${locale}` },
          { name: c.blog, url: `/${locale}/blog` },
          { name: post.title, url: `/${locale}/blog/${slug}` },
        ]}
      />
      {/* Article / BlogPosting JSON-LD — required by checklist `blog-post-article-schema`.
          Inlined here (rather than a dedicated component) so the canonical fields
          (headline, datePublished, image, author, mainEntityOfPage) match exactly
          what we already render visibly. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
            },
            headline: post.title,
            description: post.meta_description || post.excerpt || '',
            ...(post.cover_image_url ? { image: [post.cover_image_url] } : {}),
            datePublished: post.published_at,
            dateModified: post.published_at,
            author: { '@type': 'Organization', name: siteConfig.brandName },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.brandName,
              logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.siteUrl}/favicon.svg`,
              },
            },
            inLanguage: locale,
          }),
        }}
      />

      <section style={{ background: '#f8fafc', padding: '14px 24px' }}>
        <nav style={{ maxWidth: 880, margin: '0 auto', fontSize: 13, color: '#64748b' }}>
          <Link href={`/${locale}`} style={{ color: '#64748b', textDecoration: 'none' }}>
            {c.home}
          </Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/${locale}/blog`} style={{ color: '#64748b', textDecoration: 'none' }}>
            {c.blog}
          </Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#0f172a', fontWeight: 500 }}>{post.title}</span>
        </nav>
      </section>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: '#0f172a',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            {post.title}
          </h1>
          <h2 style={{
            fontSize: 16,
            fontWeight: 400,
            color: '#475569',
            margin: '14px 0 0',
            lineHeight: 1.55,
          }}>
            {post.excerpt}
          </h2>
          <div style={{
            display: 'flex',
            gap: 14,
            marginTop: 18,
            fontSize: 13,
            color: '#64748b',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && <span style={{ opacity: 0.4 }}>·</span>}
            <span>{readingTime} {c.minRead}</span>
          </div>
        </header>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 14,
              marginBottom: 32,
              display: 'block',
            }}
          />
        )}

        <div
          className="blog-content"
          style={{
            fontSize: 17,
            lineHeight: 1.75,
            color: '#1e293b',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <section style={{ background: '#0f172a', color: '#fff', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {c.ctaTitle}
          </h3>
          <p style={{ fontSize: 15, opacity: 0.85, margin: '12px 0 22px', lineHeight: 1.6 }}>
            {c.ctaBody}
          </p>
          <Link
            href={`/${locale}/redirect-whatsapp-1`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#25D366',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {c.ctaButton}
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ padding: '56px 24px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <span style={{
              display: 'inline-block',
              fontFamily: 'monospace',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: 10,
            }}>
              {c.relatedTitle}
            </span>
            <h3 style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 24px',
            }}>
              {c.relatedTitle}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {related.map((p) => (
                <BlogLinkTracker
                  key={p.id}
                  slug={p.slug}
                  href={`/${locale}/blog/${p.slug}`}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 20,
                    textDecoration: 'none',
                    color: 'inherit',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <h4 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0,
                    lineHeight: 1.35,
                  }}>
                    {p.title}
                  </h4>
                  <p style={{
                    fontSize: 13,
                    color: '#64748b',
                    margin: 0,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {p.excerpt}
                  </p>
                </BlogLinkTracker>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '24px', textAlign: 'center', background: '#fff' }}>
        <Link
          href={`/${locale}/blog`}
          style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}
        >
          {c.back}
        </Link>
      </section>

      <SiteFooter locale={locale as AppLocale} />
    </main>
  )
}
