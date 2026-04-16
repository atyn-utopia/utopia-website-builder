import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { supabase } from '@/lib/supabase'
import { siteConfig } from '@/config/site'
import { waRedirect } from '@/lib/waRedirect'

type Params = { locale: string }

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
  const tShared = await getTranslations({ locale, namespace: 'shared' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const waHref = waRedirect(locale, tShared('whatsappMessageDefault'))

  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug,
      cover_image_url,
      published_at,
      blog_translations!inner (
        title,
        excerpt
      )
    `)
    .eq('website', siteConfig.domain)
    .eq('status', 'published')
    .eq('blog_translations.language', locale)
    .order('published_at', { ascending: false })

  const blogPosts = (posts ?? []) as unknown as BlogPost[]

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
              className="rounded-full bg-[#FFF9C4] px-3.5 py-1.5 text-[14px] font-semibold text-[#111111]"
            >
              {tNav('blog')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Blog Listing */}
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-[#111111]/60">
          <Link href={`/${locale}`} className="hover:text-[#111111]">
            {t('breadcrumbs.home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#111111]">{t('breadcrumbs.blog')}</span>
        </nav>

        <h1 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl md:text-5xl">
          {t('heading')}
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-[15px] leading-relaxed text-[#111111]/70 sm:text-[16px]">
          {t('subheading')}
        </p>

        {blogPosts.length === 0 ? (
          <p className="text-center text-[#111111]/50">{t('noPosts')}</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => {
              const translation = post.blog_translations[0]
              return (
                <Link
                  key={post.id}
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
                    <h2 className="mb-2 text-[17px] font-bold leading-snug text-[#111111] group-hover:text-[#F9A825]"
                      style={{ transition: 'color 200ms ease' }}
                    >
                      {translation?.title ?? post.slug}
                    </h2>
                    <p className="line-clamp-3 text-[14px] leading-relaxed text-[#111111]/65">
                      {translation?.excerpt ?? ''}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] px-4 py-12 text-center text-[13px] text-white/50">
        <p>&copy; {new Date().getFullYear()} {siteConfig.legalName}</p>
      </footer>
    </div>
  )
}
