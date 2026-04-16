import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { supabase } from '@/lib/supabase'
import { siteConfig } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'

type Params = { locale: string; slug: string }

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('website', siteConfig.domain)
    .eq('status', 'published')

  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const post of posts ?? []) {
      params.push({ locale, slug: post.slug })
    }
  }
  return params
}

async function getPost(slug: string, locale: string) {
  const { data } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug,
      cover_image_url,
      published_at,
      blog_translations!inner (
        title,
        content,
        excerpt,
        meta_title,
        meta_description
      )
    `)
    .eq('website', siteConfig.domain)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('blog_translations.language', locale)
    .single()

  return data as unknown as {
    id: string
    slug: string
    cover_image_url: string | null
    published_at: string
    blog_translations: {
      title: string
      content: string
      excerpt: string
      meta_title: string
      meta_description: string
    }[]
  } | null
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
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const waHref = waRedirect(locale, tShared('whatsappMessageDefault'))

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
      {/* FOMO Banner */}
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

      {/* Header */}
      <header className="relative z-40 flex justify-center bg-transparent px-4 pb-4 pt-5 sm:pt-6">
        <div className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full bg-white py-2 pl-3 pr-2 shadow-[0_20px_50px_-18px_rgba(17,17,17,0.25)] ring-1 ring-black/5 sm:gap-5 sm:pl-5 sm:pr-3">
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-2"
          >
            <span className="text-[16px] font-extrabold tracking-tight text-[#111111] sm:text-[17px]">
              Kak Kenduri
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href={`/${locale}`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('services')}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]/80 hover:bg-[#FFF9C4] hover:text-[#111111]"
              style={{ transition: 'background-color 180ms ease, color 180ms ease' }}
            >
              {tNav('blog')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-[#111111]/60">
          <Link href={`/${locale}`} className="hover:text-[#111111]">
            {t('breadcrumbs.home')}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/blog`} className="hover:text-[#111111]">
            {t('breadcrumbs.blog')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#111111]">{tr.title}</span>
        </nav>

        {/* Cover image */}
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

        {/* Title + date */}
        <h1 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-[#111111] sm:text-3xl md:text-4xl">
          {tr.title}
        </h1>
        <time
          dateTime={post.published_at}
          className="mb-8 block text-[13px] font-medium uppercase tracking-wider text-[#F9A825]"
        >
          {formatDate(post.published_at)}
        </time>

        {/* Content */}
        <article
          className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-[#111111] prose-h2:mt-10 prose-h2:text-[22px] prose-h3:text-[18px] prose-p:text-[#111111]/80 prose-p:leading-relaxed prose-a:text-[#F9A825] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-[#111111]"
          dangerouslySetInnerHTML={{ __html: tr.content }}
        />

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl bg-[#111111] p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-extrabold text-white sm:text-2xl">
            {t('cta.heading')}
          </h2>
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

      {/* Footer */}
      <footer className="bg-[#0A0A0A] px-4 py-12 text-center text-[13px] text-white/50">
        <p>&copy; {new Date().getFullYear()} {siteConfig.legalName}</p>
      </footer>
    </div>
  )
}
