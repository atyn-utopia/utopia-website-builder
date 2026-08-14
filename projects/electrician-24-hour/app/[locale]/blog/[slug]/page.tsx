import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates'
import { siteConfig } from '@/config/site';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker';
import { ogImages } from '@/lib/ogImage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return { title: 'Not Found' };
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
      // An article with its own cover art shares better than the generic hero
      // card; fall back to the locale card when it has none.
      images: post.cover_image_url ? [post.cover_image_url] : ogImages(locale),
    },
  };
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const fomoT = await getTranslations({ locale, namespace: 'fomoBanner' });
  const fomoTexts = fomoT.raw('texts') as string[];
  const [post, all] = await Promise.all([
    getBlogPostBySlug(slug, locale),
    getBlogPosts(locale),
  ]);
  if (!post) notFound();

  const other = all.filter((p) => p.slug !== slug).slice(0, 3);
  const readingTime = estimateReadingTime(post.content);
  const publishedDate = new Date(post.published_at).toLocaleDateString(
    locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const waHref = waRedirect(locale);

  const breadcrumbItems = [
    { name: t('breadcrumbHome'), url: `/${locale}` },
    { name: t('breadcrumbBlog'), url: `/${locale}/blog` },
    { name: post.title, url: `/${locale}/blog/${slug}` },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    inLanguage: locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
    },
    author: { '@type': 'Organization', name: siteConfig.brandName },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <script
        type="application/ld+json"
        // Server-rendered structured data — never executed as JS.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <FomoBanner text={fomoTexts[0]} />
      <SiteHeader />

      <article className="section">
        <div className="blog-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
            <span className="sep">/</span>
            <Link href={`/${locale}/blog`}>{t('breadcrumbBlog')}</Link>
            <span className="sep">/</span>
            <span>{post.title}</span>
          </nav>

          <h1>{post.title}</h1>
          <div className="meta">
            <span>{t('publishedOn')} {publishedDate}</span>
            <span>·</span>
            <span>{readingTime} {t('minRead')}</span>
          </div>

          {post.cover_image_url && (
            <div className="cover">
              <img src={post.cover_image_url} alt={post.title} />
            </div>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="blog-cta-inline">
            <strong>⚡ Need an electrician right now?</strong>
            <h5 className="body-text" style={{ margin: '10px 0 16px', color: 'rgba(255,255,255,0.85)' }}>
              ST-registered, 4-hour arrival, 24/7 dispatch across Malaysia.
            </h5>
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              className="btn btn-wa"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp 24/7
            </a>
          </div>
        </div>
      </article>

      {other.length > 0 && (
        <section className="section section-ice">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">More</span>
              <h3>{t('recentPosts')}</h3>
            </div>
            <div className="blog-grid">
              {other.map((p) => (
                <BlogLinkTracker
                  key={p.id}
                  slug={p.slug}
                  href={`/${locale}/blog/${p.slug}`}
                  className="blog-card"
                >
                  <div className="blog-card-img">
                    <img
                      src={p.cover_image_url || '/brand/hero.jpg'}
                      alt={p.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-card-body">
                    <h3>{p.title}</h3>
                    <h5 className="body-text">{p.excerpt}</h5>
                    <span className="blog-card-more">{t('readMore')} →</span>
                  </div>
                </BlogLinkTracker>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter locale={locale} />
    </>
  );
}
