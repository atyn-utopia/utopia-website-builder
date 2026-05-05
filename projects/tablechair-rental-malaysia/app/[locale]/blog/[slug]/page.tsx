import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getBlogPost, getBlogPostSlugs, getRecentBlogPosts } from '@/lib/webcore'
import { siteConfig, type Locale } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { KKMark } from '@/components/Ornaments'
import { TOP_FOOTER_LOCATIONS, findLocation } from '@/config/locations'

type Params = { locale: string; slug: string }

export async function generateStaticParams() {
  const posts = await getBlogPostSlugs()
  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const post of posts) {
      params.push({ locale, slug: post.slug })
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

  const post = await getBlogPost(slug, locale)
  if (!post || !post.blog_translations[0]) notFound()

  const tr = post.blog_translations[0]
  const t = await getTranslations({ locale, namespace: 'blog' })
  const tShared = await getTranslations({ locale, namespace: 'shared' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFoot = await getTranslations({ locale, namespace: 'footer' })

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

  /* ---------- Table of Contents ---------- */
  const tocItems: { id: string; text: string }[] = []
  const contentWithIds = tr.content.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs: string, text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '')
    const id = attrs.match(/id=["']([^"']+)["']/)?.[1]
      ?? plainText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    tocItems.push({ id, text: plainText })
    return `<h2 id="${id}"${attrs.replace(/id=["'][^"']*["']/g, '')}>${text}</h2>`
  })

  /* ---------- Recent Posts query ---------- */
  const recentPosts = await getRecentBlogPosts(locale, slug, 3)

  return (
    <div className="min-h-screen bg-[#FFFEF8]">
      {/* 1. FOMO Banner */}
      <div className="relative z-50 overflow-hidden bg-[#111111] py-2.5 text-center text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 text-[13px] sm:gap-5 sm:text-[14px]">
          <p className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FDD835] opacity-75" />
              <span className="inline-flex h-2 w-2 rounded-full bg-[#FDD835]" />
            </span>
            <span className="font-medium">{tShared('fomoText')}</span>
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 rounded-full bg-[#25D366] px-4 py-1 text-[12px] font-bold text-white hover:bg-[#1EB85A] sm:inline-flex"
            style={{ transition: 'background-color 180ms ease' }}
          >
            {tShared('fomoCta')}
          </a>
        </div>
      </div>

      {/* 2. Header */}
      <header className="relative z-40 flex justify-center bg-transparent px-4 pb-4 pt-5 sm:pt-6">
        <div className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full bg-white py-2 pl-3 pr-2 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)] ring-1 ring-black/5 sm:gap-5 sm:pl-5 sm:pr-3">
          <Link
            href={`/${locale}`}
            aria-label={tShared('alt.logoAria')}
            className="flex shrink-0 items-center gap-2"
          >
            <KKMark className="h-9 w-9" />
            <span className="text-[16px] font-extrabold tracking-tight text-[#111111] sm:text-[17px]">
              Kak Kenduri
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href={`/${locale}#services`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('services')}
            </Link>
            <Link
              href={`/${locale}#service-area`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('locations')}
            </Link>
            <Link
              href={`/${locale}#gallery`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('gallery')}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('blog')}
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('contact')}
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Article */}
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        {/* 3. Breadcrumbs */}
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

        {/* 4. Cover image */}
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

        {/* 5. H1 title */}
        <h1 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-[#111111] sm:text-3xl md:text-4xl">
          {tr.title}
        </h1>

        {/* 6. Metadata line: date + read time */}
        <p className="mb-8 text-[13px] font-medium uppercase tracking-wider text-[#F9A825]">
          <time dateTime={post.published_at}>
            {formatDate(post.published_at)}
          </time>
          {' | '}
          {t('minRead', { count: String(readTime) })}
        </p>

        {/* 7. Table of Contents */}
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

        {/* 8. Article content */}
        <article
          className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-[#111111] prose-h2:mt-10 prose-h2:text-[22px] prose-h3:text-[18px] prose-p:text-[#111111]/80 prose-p:leading-relaxed prose-a:text-[#F9A825] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-[#111111]"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />

        {/* 9. Bottom CTA */}
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
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
            </svg>
            {tShared('whatsappCta')}
          </a>
        </div>
      </main>

      {/* 10. Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <h3 className="mb-6 text-[20px] font-bold text-[#111111]">{t('recentPosts')}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentPosts.map((rp: { slug: string; published_at: string; blog_translations: { title: string }[] }) => (
              <Link
                key={rp.slug}
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
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 11. Footer */}
      <footer id="contact" className="relative bg-[#0A0A0A] text-[#FFFEF8]">
        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#FDD835] to-transparent opacity-70" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <p className="flex items-center gap-2.5">
                <KKMark className="h-10 w-10" />
                <span className="text-lg font-extrabold tracking-tight">Kak Kenduri</span>
              </p>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#FFFEF8]/70">
                {tFoot('tagline')}
              </p>
            </div>
            <div>
              <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
                {tFoot('contact')}
              </h6>
              <ul className="mt-5 space-y-3 text-[15px] leading-[1.7] text-[#FFFEF8]/80">
                <li>{tFoot('address')}</li>
                <li>{tFoot('hours')}</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
                {tFoot('topLocations')}
              </h6>
              <ul className="mt-5 space-y-3 text-[15px] leading-[1.7]">
                {TOP_FOOTER_LOCATIONS.map((sl) => {
                  const l = findLocation(sl)
                  if (!l) return null
                  return (
                    <li key={sl}>
                      <Link
                        href={`/${locale}/${siteConfig.productSlug}/${sl}`}
                        className="py-1 text-[#FFFEF8]/80 hover:text-[#FDD835]"
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
              <h6 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FDD835]">
                {tFoot('getInTouch')}
              </h6>
              <p className="mt-5 text-[15px] leading-[1.7] text-[#FFFEF8]/70">
                {tFoot('getInTouchSub')}
              </p>
              <div className="mt-4">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.55)] hover:bg-[#1EB85A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
                  style={{ transition: 'transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease' }}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .12 5.35.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.86-9.96 9.86zm5.68-7.41c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.69.16-.2.31-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.69-1.66-.95-2.28-.25-.6-.51-.52-.69-.53-.18 0-.39-.02-.59-.02-.2 0-.54.08-.83.38-.28.31-1.08 1.06-1.08 2.58s1.11 3 1.27 3.21c.16.2 2.19 3.35 5.31 4.7.74.32 1.32.51 1.77.66.74.24 1.42.21 1.95.13.6-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.2-.59-.36z" />
                  </svg>
                  {tNav('whatsapp')}
                </a>
              </div>
              <div className="mt-5">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#FFFEF8]/15 pt-6 text-xs text-[#FFFEF8]/60 md:flex-row">
            <p>
              {tFoot('legal', { year: String(new Date().getFullYear()) })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
