import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates'
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker';
import { ogImages } from '@/lib/ogImage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  const baseUrl = `https://${siteConfig.domain}`;

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: seoAlternates(locale, `/blog/${slug}`),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      siteName: siteConfig.brandName,
      type: 'article',
      // An article with its own cover art shares better than the generic hero
      // card; fall back to the locale card when it has none.
      images: post.cover_image_url ? [post.cover_image_url] : ogImages(locale),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  const post = await getBlogPostBySlug(slug, locale);
  if (!post) notFound();

  const allPosts = await getBlogPosts(locale);
  const recentPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const waHref = waRedirect(locale);

  const date = new Date(post.published_at);
  const formattedDate = date.toLocaleDateString(
    locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const baseUrl = `https://${siteConfig.domain}`;

  return (
    <>
      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${baseUrl}/${locale}/blog/${slug}`,
            },
            headline: post.title,
            description: post.meta_description || post.excerpt || '',
            ...(post.cover_image_url ? { image: [post.cover_image_url] } : {}),
            datePublished: post.published_at,
            dateModified: post.published_at,
            author: { '@type': 'Organization', name: siteConfig.brandName },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.brandName,
              logo: { '@type': 'ImageObject', url: `${baseUrl}/icon.svg` },
            },
            inLanguage: locale,
          }),
        }}
      />

      <FomoBanner />
      <SiteHeader />

      {/* BREADCRUMBS */}
      <div style={{ background: 'var(--brand-surface)', padding: '12px 24px' }}>
        <div className="max-w-6xl mx-auto" style={{ fontSize: 13, color: 'var(--brand-text-muted)' }}>
          <a href={`/${locale}`} style={{ color: 'var(--brand-text-muted)' }}>{t('breadcrumbHome')}</a>
          {' > '}
          <a href={`/${locale}/blog`} style={{ color: 'var(--brand-text-muted)' }}>{t('breadcrumbBlog')}</a>
          {' > '}
          <span style={{ color: 'var(--brand-charcoal)', fontWeight: 500 }}>{post.title}</span>
        </div>
      </div>

      <section style={{ padding: '56px 24px', background: '#fff' }}>
        <div className="max-w-6xl mx-auto" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, maxWidth: 1100 }}>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <article style={{ flex: '1 1 600px', maxWidth: 740 }}>
              {post.cover_image_url && (
                <div
                  style={{
                    width: '100%',
                    height: 360,
                    backgroundImage: `url(${post.cover_image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 16,
                    marginBottom: 32,
                  }}
                  role="img"
                  aria-label={post.title}
                />
              )}

              <h1
                style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 800,
                  color: 'var(--brand-charcoal)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: 16,
                }}
              >
                {post.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 48,
                  fontSize: 14,
                  color: 'var(--brand-text-muted)',
                }}
              >
                <span>{t('publishedOn')} {formattedDate}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--brand-text-muted)' }} />
                <span>{readingTime} {t('minRead')}</span>
              </div>

              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {recentPosts.length > 0 && (
              <aside style={{ flex: '0 0 280px', minWidth: 250 }}>
                <div style={{ position: 'sticky', top: 88 }}>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--brand-charcoal)',
                      marginBottom: 24,
                      paddingBottom: 8,
                      borderBottom: '2px solid var(--brand-yellow)',
                    }}
                  >
                    {t('recentPosts')}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {recentPosts.map((rp) => {
                      const rpDate = new Date(rp.published_at);
                      const rpFormatted = rpDate.toLocaleDateString(
                        locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      );

                      return (
                        <BlogLinkTracker
                          key={rp.id}
                          slug={rp.slug}
                          href={`/${locale}/blog/${rp.slug}`}
                          style={{
                            display: 'block',
                            padding: 16,
                            background: 'var(--brand-surface)',
                            borderRadius: 10,
                            transition: 'transform 200ms ease',
                          }}
                        >
                          {rp.cover_image_url && (
                            <div
                              style={{
                                width: '100%',
                                height: 120,
                                backgroundImage: `url(${rp.cover_image_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 6,
                                marginBottom: 8,
                              }}
                              role="img"
                              aria-label={rp.title}
                            />
                          )}
                          <h6 className="body-h6" style={{ fontSize: 12, color: 'var(--brand-text-muted)', marginBottom: 4 }}>{rpFormatted}</h6>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-charcoal)', lineHeight: 1.3 }}>
                            {rp.title}
                          </h4>
                        </BlogLinkTracker>
                      );
                    })}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA BANNER */}
      <section style={{ background: 'var(--gradient-hero)', padding: '48px 24px' }}>
        <div className="max-w-6xl mx-auto" style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 16,
            }}
          >
            {navT('ctaButton')}
          </h2>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            {navT('ctaButton')}
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
