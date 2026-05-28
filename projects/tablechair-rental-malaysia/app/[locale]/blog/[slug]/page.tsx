import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/webcore'
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'

type Params = { locale: Locale; slug: string }

export async function generateStaticParams() {
  const posts = await getBlogPosts('en')
  const params: { locale: Locale; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const post of posts) {
      params.push({ locale: locale as Locale, slug: post.slug })
    }
  }
  return params
}

async function getPost(slug: string, locale: Locale) {
  const post = await getBlogPostBySlug(slug, locale)
  if (!post) return null
  return {
    id: post.id,
    slug: post.slug,
    cover_image_url: post.cover_image_url || null,
    published_at: post.published_at,
    blog_translations: [{
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
    }],
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug, locale)
  if (!post || !post.blog_translations[0]) return {}
  const tr = post.blog_translations[0]
  return {
    title: tr.meta_title,
    description: tr.meta_description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: tr.meta_title,
      description: tr.meta_description,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = await getPost(slug, locale)
  if (!post || !post.blog_translations[0]) notFound()

  const tr = post.blog_translations[0]
  const t = await getTranslations({ locale, namespace: 'blog' })
  const tShared = await getTranslations({ locale, namespace: 'shared' })

  const waHref = waRedirect(locale, tShared('whatsappMessageDefault'))

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /* ---------- Read time calculation ---------- */
  const wordCount = tr.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  /* ---------- Strip duplicates ----------
     The blog writer emits content with its own top-level title heading and
     a table-of-contents nav. The page provides both, so render-side strip
     them to avoid two titles and two TOCs on the live post. */
  const H1_BLOCK = /<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i
  const NAV_BLOCK = /<nav\b[^>]*>[\s\S]*?<\/nav>\s*/i
  const strippedContent = tr.content
    .replace(H1_BLOCK, '')
    .replace(NAV_BLOCK, '')

  /* ---------- Table of Contents ---------- */
  const tocItems: { id: string; text: string }[] = []
  const contentWithIds = strippedContent.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs: string, text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '')
    // Skip the writer's "Table of Contents" h2 if it leaked through outside <nav>.
    if (/table[\s_-]?of[\s_-]?contents/i.test(plainText)) return ''
    const id = attrs.match(/id=["']([^"']+)["']/)?.[1]
      ?? plainText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    tocItems.push({ id, text: plainText })
    return `<h2 id="${id}"${attrs.replace(/id=["'][^"']*["']/g, '')}>${text}</h2>`
  })

  /* ---------- Recent Posts query ---------- */
  const allPosts = await getBlogPosts(locale)
  const recentPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      published_at: p.published_at,
      blog_translations: [{ title: p.title }],
    }))

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: tr.title,
    description: tr.meta_description ?? tr.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    inLanguage: locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/${locale}/blog/${slug}`,
    },
    author: { '@type': 'Organization', name: siteConfig.brandName },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brandName,
      url: siteConfig.url,
    },
  }

  return (
    <div className="min-h-screen bg-[#FFFEF8]">
      <script
        type="application/ld+json"
        // Server-rendered structured data — never executed as JS.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <FomoBanner locale={locale} />
      <SiteHeader locale={locale} />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <nav className="mb-6 text-sm text-[#111111]/60">
          <p className="inline">
            <Link href={`/${locale}`} className="hover:text-[#111111]">
              {t('breadcrumbs.home')}
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href={`/${locale}/blog`} className="hover:text-[#111111]">
              {t('breadcrumbs.blog')}
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-[#111111]">{tr.title}</span>
          </p>
        </nav>

        {post.cover_image_url && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={tr.title}
              className="h-auto w-full object-cover"
              style={{ maxHeight: '420px' }}
            />
          </div>
        )}

        <h1 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-[#111111] sm:text-3xl md:text-4xl">
          {tr.title}
        </h1>

        <p className="mb-8 text-[13px] font-medium uppercase tracking-wider text-[#F9A825]">
          <time dateTime={post.published_at}>
            {formatDate(post.published_at)}
          </time>
          {' | '}
          {t('minRead', { count: String(readTime) })}
        </p>

        {tocItems.length > 0 && (
          <div className="mb-10 rounded-2xl border border-[#FDD835]/30 bg-[#FFF9C4]/30 p-6">
            <h3 className="mb-4 text-[16px] font-bold text-[#111111]">Table of Contents</h3>
            <ul className="space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-[15px] text-[#111111]/70 hover:text-[#F9A825]">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <article
          className="blog-content prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-[#111111] prose-h2:mt-10 prose-h2:text-[22px] prose-h3:text-[18px] prose-p:text-[#111111]/80 prose-p:leading-relaxed prose-a:text-[#F9A825] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-[#111111]"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />

        <div className="mt-12 rounded-2xl bg-[#111111] p-8 text-center sm:p-10">
          <h3 className="mb-3 text-xl font-extrabold text-white sm:text-2xl">
            {t('cta.heading')}
          </h3>
          <p className="mb-6 text-[14px] text-white/70">{t('cta.sub')}</p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.55)] hover:bg-[#1EB85A]"
            style={{ transition: 'background-color 200ms ease' }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42z" />
            </svg>
            {tShared('whatsappCta')}
          </a>
        </div>
      </main>

      {recentPosts && recentPosts.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <h3 className="mb-6 text-[20px] font-bold text-[#111111]">{t('recentPosts')}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentPosts.map((rp) => (
              <BlogLinkTracker
                key={rp.slug}
                slug={rp.slug}
                href={`/${locale}/blog/${rp.slug}`}
                className="group rounded-xl border border-[#FDD835]/25 bg-white p-4 hover:shadow-md"
                style={{ transition: 'box-shadow 200ms ease' }}
              >
                <h5 className="text-[15px] font-semibold text-[#111111] group-hover:text-[#F9A825]">
                  {rp.blog_translations[0]?.title}
                </h5>
                <p className="mt-2 text-[13px] text-[#111111]/50">
                  {formatDate(rp.published_at)}
                </p>
              </BlogLinkTracker>
            ))}
          </div>
        </section>
      )}

      <SiteFooter locale={locale} />
    </div>
  )
}
