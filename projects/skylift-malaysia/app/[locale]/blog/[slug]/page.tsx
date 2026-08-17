import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates'
import { siteConfig } from '@/config/site';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BlogClickTracker from '@/components/tracking/BlogClickTracker';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { ogImages } from '@/lib/ogImage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return { title: 'Not Found' };
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  // The article's own cover when it has one, else the site hero card — an empty
  // array meant articles without a cover shared with no image at all.
  const images = post.cover_image_url ? [post.cover_image_url] : ogImages(locale);
  return {
    title,
    description,
    alternates: seoAlternates(locale, `/blog/${slug}`),
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
      siteName: siteConfig.brandName,
      type: 'article',
      images,
    },
    // Without this the article inherits the layout's twitter block, so X/Twitter
    // showed the site-wide title and hero card instead of the article's own.
    twitter: { card: 'summary_large_image', title, description, images },
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
  const navT = await getTranslations({ locale, namespace: 'nav' });
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

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.meta_description || post.excerpt,
            image: post.cover_image_url || undefined,
            datePublished: post.published_at,
            author: { '@type': 'Organization', name: siteConfig.brandName },
            publisher: { '@type': 'Organization', name: siteConfig.brandName },
            mainEntityOfPage: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
          }),
        }}
      />
      <FomoBanner />
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
                <BlogClickTracker key={p.id} slug={p.slug}>
                  <Link
                    href={`/${locale}/blog/${p.slug}`}
                    className="blog-card"
                  >
                    <div className="blog-card-img">
                      <img
                        src={p.cover_image_url || '/brand/hero.png'}
                        alt={p.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="blog-card-body">
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                      <span className="blog-card-more">{t('readMore')} →</span>
                    </div>
                  </Link>
                </BlogClickTracker>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-final-cta" style={{ backgroundColor: '#1C1F2A' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h3>{t('ctaHeading')}</h3>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa wa-btn btn-lg"
            style={{ marginTop: 18 }}
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            {navT('whatsappCta')}
          </a>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
