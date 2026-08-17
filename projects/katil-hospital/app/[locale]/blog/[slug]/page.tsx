import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localeHref } from '@/lib/localeHref';
import { ogImages } from '@/lib/ogImage';
import { waRedirect } from '@/lib/waRedirect';
import { getBlogPost, getBlogPostSlugs, getRecentBlogPosts } from '@/lib/webcore';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import PageStyles from '@/components/PageStyles';
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';
import { ArticleSchema } from '@/components/schema/ArticleSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';

// No time-based ISR: content is invalidated by cache tag via /api/revalidate,
// so a DB edit appears within seconds instead of on the next time window.

const DATE_LOCALE: Record<string, string> = { ms: 'ms-MY', en: 'en-MY', zh: 'zh-CN' };

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  const tr = post?.blog_translations[0];
  if (!post || !tr) return {};
  const path = `/blog/${slug}`;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${localeHref(l)}${path}`]));
  return {
    title: tr.meta_title || tr.title,
    description: tr.meta_description || tr.excerpt,
    alternates: { canonical: `${localeHref(locale)}${path}`, languages },
    openGraph: {
      type: 'article',
      title: tr.meta_title || tr.title,
      description: tr.meta_description || tr.excerpt,
      url: `${localeHref(locale)}${path}`,
      images: post.cover_image_url ? [post.cover_image_url] : ogImages(locale),
    },
  };
}

/** ~200 words/minute over the stripped article HTML. */
function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  const tr = post?.blog_translations[0];
  if (!post || !tr) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });
  const related = await getRecentBlogPosts(locale, slug, 3);

  const crumbs = [
    { name: t('breadcrumbHome'), url: localeHref(locale) },
    { name: t('breadcrumbBlog'), url: `${localeHref(locale)}/blog` },
    { name: tr.title, url: `${localeHref(locale)}/blog/${slug}` },
  ];

  return (
    <>
      <PageStyles />
      <BreadcrumbSchema items={crumbs} />
      <ArticleSchema
        locale={locale}
        slug={slug}
        title={tr.title}
        excerpt={tr.excerpt}
        coverImage={post.cover_image_url}
        publishedAt={post.published_at}
      />

      <FomoBanner />
      <SiteHeader />

      <main className="bg-white text-gray-800">
        <article>
          <header className="hero-gradient pt-8 pb-10 md:pt-14 md:pb-14">
            <div className="max-w-3xl mx-auto px-4">
              <nav aria-label="Breadcrumb" className="mb-4 text-xs text-teal-700">
                <Link href={`/${locale}`} className="hover:text-amber-600">
                  {t('breadcrumbHome')}
                </Link>
                <span className="mx-2 text-teal-400">/</span>
                <Link href={`/${locale}/blog`} className="hover:text-amber-600">
                  {t('breadcrumbBlog')}
                </Link>
                <span className="mx-2 text-teal-400">/</span>
                <span className="text-gray-500">{tr.title}</span>
              </nav>

              <h1 className="hero-title mb-4">{tr.title}</h1>
              <h2 className="hero-sub mb-4">{tr.excerpt}</h2>
              <h6 className="body-text text-xs text-gray-500">
                {new Date(post.published_at).toLocaleDateString(DATE_LOCALE[locale] ?? 'ms-MY', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' · '}
                {t('readingTimeTemplate', { minutes: readingMinutes(tr.content) })}
              </h6>
            </div>
          </header>

          {post.cover_image_url && (
            <div className="max-w-3xl mx-auto px-4 -mt-6 md:-mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image_url}
                alt={t('coverAltTemplate', { title: tr.title })}
                className="w-full rounded-2xl shadow-lg object-cover"
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: tr.content }} />
          </div>
        </article>

        {/* WhatsApp CTA banner */}
        <section className="pb-14">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-gradient-to-br from-teal-800 to-teal-950 text-white rounded-2xl p-8 text-center">
              <h3 className="card-title-lg text-white mb-2">{t('ctaTitle')}</h3>
              <h5 className="body-text text-teal-100 text-sm mb-5">{t('ctaBody')}</h5>
              <WhatsAppButton
                href={waRedirect(locale, undefined, undefined, 'blog')}
                label={`blog-${slug}`}
                className="btn-shine inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1da851] transition-colors"
              >
                <WaIcon size={20} />
                {t('ctaLabel')}
              </WhatsAppButton>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="pb-16">
            <div className="max-w-3xl mx-auto px-4">
              <h3 className="sec-title mb-6">{t('relatedTitle')}</h3>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <BlogLinkTracker
                      slug={r.slug}
                      href={`/${locale}/blog/${r.slug}`}
                      className="block bg-gray-50 rounded-xl px-5 py-4 text-teal-800 font-semibold hover:bg-teal-50 transition-colors"
                    >
                      {r.blog_translations[0]?.title ?? r.slug}
                    </BlogLinkTracker>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <div className="max-w-3xl mx-auto px-4 pb-16">
          <Link href={`/${locale}/blog`} className="text-teal-700 font-semibold hover:text-amber-600 transition-colors">
            ← {t('backToBlog')}
          </Link>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
