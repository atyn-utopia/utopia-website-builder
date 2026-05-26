import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getBlogPosts } from '@/lib/webcore'
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker'

const BLOG_COPY = {
  en: {
    title: 'Sewa Motor Blog',
    subtitle: 'Tips, guides, and stories about renting motorcycles in Malaysia.',
    metaTitle: 'Sewa Motor Blog | Motorcycle Rental Tips & Guides Malaysia',
    metaDescription: 'Read motorcycle rental tips, route guides, and stories from Sewa Motor Malaysia — your same-day rental partner.',
    readMore: 'Read more',
    noPosts: 'No blog posts yet. Check back soon.',
    backHome: '← Back to home',
  },
  ms: {
    title: 'Blog Sewa Motor',
    subtitle: 'Tip, panduan, dan cerita tentang menyewa motosikal di Malaysia.',
    metaTitle: 'Blog Sewa Motor | Tip & Panduan Sewa Motosikal Malaysia',
    metaDescription: 'Baca tip sewa motosikal, panduan laluan, dan cerita dari Sewa Motor Malaysia — rakan sewa hari sama anda.',
    readMore: 'Baca lagi',
    noPosts: 'Belum ada artikel blog. Sila semak semula nanti.',
    backHome: '← Kembali ke laman utama',
  },
  zh: {
    title: '租车博客',
    subtitle: '关于在马来西亚租用摩托车的提示、指南和故事。',
    metaTitle: '租车博客 | 马来西亚摩托车租赁提示与指南',
    metaDescription: '阅读来自 Sewa Motor Malaysia 的摩托车租赁技巧、路线指南和故事。',
    readMore: '继续阅读',
    noPosts: '暂无博客文章，请稍后再来查看。',
    backHome: '← 返回首页',
  },
} as const

type Locale = keyof typeof BLOG_COPY

function copyFor(locale: string) {
  return BLOG_COPY[(locale as Locale)] ?? BLOG_COPY.en
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const c = copyFor(locale)
  const url = `${siteConfig.siteUrl}/${locale}/blog`
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.siteUrl}/en/blog`,
        ms: `${siteConfig.siteUrl}/ms/blog`,
        zh: `${siteConfig.siteUrl}/zh/blog`,
      },
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      siteName: siteConfig.brandName,
      type: 'website',
    },
  }
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const c = copyFor(locale)
  const posts = await getBlogPosts(locale)
  const dateLocale = locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY'

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff' }}>
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          padding: '64px 24px',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.7,
            marginBottom: 12,
          }}>
            Sewa Motor Knowledge Base
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}>
            {c.title}
          </h1>
          <h2 style={{
            fontSize: 16,
            fontWeight: 400,
            margin: '14px auto 0',
            maxWidth: 620,
            opacity: 0.85,
            lineHeight: 1.5,
          }}>
            {c.subtitle}
          </h2>
        </div>
      </section>

      <section style={{ padding: '56px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#64748b', fontSize: 16 }}>
              {c.noPosts}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24,
            }}>
              {posts.map((post) => {
                const date = new Date(post.published_at)
                const formattedDate = Number.isNaN(date.getTime())
                  ? ''
                  : date.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
                return (
                  <BlogLinkTracker
                    key={post.id}
                    slug={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#fff',
                      borderRadius: 14,
                      overflow: 'hidden',
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {post.cover_image_url && (
                      <div style={{
                        width: '100%',
                        height: 200,
                        backgroundImage: `url(${post.cover_image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                    )}
                    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {formattedDate && (
                        <span style={{ fontSize: 12, color: '#64748b', letterSpacing: '0.04em' }}>
                          {formattedDate}
                        </span>
                      )}
                      <h3 style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: '#0f172a',
                        margin: 0,
                        lineHeight: 1.3,
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        fontSize: 14,
                        color: '#475569',
                        margin: 0,
                        lineHeight: 1.55,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {post.excerpt}
                      </p>
                      <span style={{
                        marginTop: 'auto',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#2563eb',
                      }}>
                        {c.readMore} →
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
        <Link href={`/${locale}`} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>
          {c.backHome}
        </Link>
      </section>
    </main>
  )
}
