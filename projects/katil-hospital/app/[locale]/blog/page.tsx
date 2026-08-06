import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { ogImages } from '@/lib/ogImage';
import { getBlogPosts } from '@/lib/webcore';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';

// No time-based ISR: content is invalidated by cache tag via /api/revalidate,
// so a DB edit appears within seconds instead of on the next time window.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.blog' });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${localeHref(l)}/blog`]),
  );
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `${localeHref(locale)}/blog`, languages },
    openGraph: {
      type: 'website',
      url: `${localeHref(locale)}/blog`,
      title: t('title'),
      description: t('description'),
      images: ogImages(locale),
    },
  };
}

const DATE_LOCALE: Record<string, string> = { ms: 'ms-MY', en: 'en-MY', zh: 'zh-CN' };

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = await getBlogPosts(locale);

  const crumbs = [
    { name: t('breadcrumbHome'), url: localeHref(locale) },
    { name: t('breadcrumbBlog'), url: `${localeHref(locale)}/blog` },
  ];

  return (
    <>
      <PageStyles />
      <BreadcrumbSchema items={crumbs} />
      <FomoBanner />
      <SiteHeader />

      <main className="bg-white text-gray-800">
        <section className="hero-gradient pt-8 pb-12 md:pt-16 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-teal-700">
              <Link href={`/${locale}`} className="hover:text-amber-600">
                {t('breadcrumbHome')}
              </Link>
              <span className="mx-2 text-teal-400">/</span>
              <span className="text-gray-500">{t('breadcrumbBlog')}</span>
            </nav>
            <h1 className="hero-title mb-4">{t('title')}</h1>
            <h2 className="hero-sub max-w-2xl mx-auto">{t('subtitle')}</h2>
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            {posts.length === 0 ? (
              <h5 className="body-text text-center text-gray-500">{t('empty')}</h5>
            ) : (
              <div className="blog-grid">
                {posts.map((post) => {
                  const tr = post.blog_translations[0];
                  if (!tr) return null;
                  return (
                    <article key={post.id} className="blog-card">
                      <BlogLinkTracker slug={post.slug} href={`/${locale}/blog/${post.slug}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.cover_image_url ?? '/images/showroom.png'}
                          alt={t('coverAltTemplate', { title: tr.title })}
                          className="w-full h-44 object-cover"
                        />
                      </BlogLinkTracker>
                      <div className="p-5 flex flex-col grow">
                        <h6 className="body-text text-xs text-gray-400 mb-2">
                          {new Date(post.published_at).toLocaleDateString(DATE_LOCALE[locale] ?? 'ms-MY', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h6>
                        <h3 className="card-title-lg text-teal-800 mb-2">
                          <BlogLinkTracker slug={post.slug} href={`/${locale}/blog/${post.slug}`}>
                            {tr.title}
                          </BlogLinkTracker>
                        </h3>
                        <h5 className="body-text text-sm text-gray-500 mb-4 grow">{tr.excerpt}</h5>
                        <BlogLinkTracker
                          slug={post.slug}
                          href={`/${locale}/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-teal-700 font-semibold text-sm hover:text-amber-600 transition-colors"
                        >
                          {t('readMore')} →
                        </BlogLinkTracker>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
