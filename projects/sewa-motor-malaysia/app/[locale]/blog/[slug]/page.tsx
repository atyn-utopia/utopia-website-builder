import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getBlogPosts, getBlogPostBySlug } from '@/lib/webcore'
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const POST_COPY = {
  en: { home: 'Home', blog: 'Blog', back: '← Back to blog', minRead: 'min read', relatedTitle: 'Related articles', ctaTitle: 'Ready to ride?', ctaBody: 'WhatsApp Sewa Motor Malaysia for same-day delivery from RM30/day.', ctaButton: 'Chat on WhatsApp' },
  ms: { home: 'Laman Utama', blog: 'Blog', back: '← Kembali ke blog', minRead: 'min bacaan', relatedTitle: 'Artikel berkaitan', ctaTitle: 'Sedia untuk berkendara?', ctaBody: 'WhatsApp Sewa Motor Malaysia untuk penghantaran hari sama dari RM30/hari.', ctaButton: 'WhatsApp Kami' },
  zh: { home: '首页', blog: '博客', back: '← 返回博客', minRead: '分钟阅读', relatedTitle: '相关文章', ctaTitle: '准备好出行了吗？', ctaBody: '通过 WhatsApp 联系 Sewa Motor Malaysia，每天 RM30 起，当日送达。', ctaButton: 'WhatsApp 联系' },
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
    alternates: seoAlternates(locale, `/blog/${slug}`),
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

  // Inline BreadcrumbList JSON-LD (the existing BreadcrumbSchema component is
  // tied to the location-page shape; not reusing it for blog).
  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.home, item: `${siteConfig.siteUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: c.blog, item: `${siteConfig.siteUrl}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteConfig.siteUrl}/${locale}/blog/${slug}` },
    ],
  }

  return (
    <>
      <FomoBanner />
      <SiteHeader />
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

      <section style={{ background: '#f8fafc', padding: '14px 24px' }}>
        <nav style={{ maxWidth: 880, margin: '0 auto', fontSize: 13, color: '#64748b' }}>
          <Link href={`/${locale}`} style={{ color: '#64748b', textDecoration: 'none' }}>{c.home}</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/${locale}/blog`} style={{ color: '#64748b', textDecoration: 'none' }}>{c.blog}</Link>
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
            style={{ width: '100%', height: 'auto', borderRadius: 14, marginBottom: 32, display: 'block' }}
          />
        )}

        <div
          className="blog-content"
          style={{ fontSize: 17, lineHeight: 1.75, color: '#1e293b' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <section style={{ background: '#0f172a', color: '#fff', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{c.ctaTitle}</h3>
          <p style={{ fontSize: 15, opacity: 0.85, margin: '12px 0 22px', lineHeight: 1.6 }}>{c.ctaBody}</p>
          <Link
            href={`/${locale}/redirect-whatsapp-1`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#25D366',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="#fff" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            {c.ctaButton}
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ padding: '56px 24px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>{c.relatedTitle}</h3>
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
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>{p.title}</h4>
                  <p style={{
                    fontSize: 13,
                    color: '#64748b',
                    margin: 0,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>{p.excerpt}</p>
                </BlogLinkTracker>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '24px', textAlign: 'center', background: '#fff' }}>
        <Link href={`/${locale}/blog`} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{c.back}</Link>
      </section>
    </main>
      <SiteFooter />
    </>
  )
}
