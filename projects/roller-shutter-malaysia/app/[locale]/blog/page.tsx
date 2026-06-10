import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates'
import { siteConfig } from '@/config/site';
import { getBlogPosts } from '@/lib/webcore';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const baseUrl = `https://${siteConfig.domain}`;

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: seoAlternates(locale, `/blog`),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${baseUrl}/${locale}/blog`,
      siteName: siteConfig.brandName,
      type: 'website',
    },
  };
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = await getBlogPosts(locale);

  return (
    <>
      <FomoBanner />
      <SiteHeader />

      {/* BLOG HEADER */}
      <section style={{ background: 'var(--gradient-hero)', padding: '64px 24px' }}>
        <div className="max-w-6xl mx-auto" style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            {t('title')}
          </h1>
          <h2 style={{ color: 'rgba(255,255,255,0.78)', fontSize: 16, fontWeight: 400 }}>
            {t('metaDescription')}
          </h2>
        </div>
      </section>

      {/* BLOG POSTS GRID */}
      <section style={{ padding: '64px 24px', background: 'var(--brand-surface)' }}>
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '96px 0' }}>
              <h5 className="body-h5" style={{ fontSize: 18, color: 'var(--brand-text-muted)' }}>
                {t('noPosts')}
              </h5>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 28,
              }}
            >
              {posts.map((post) => {
                const date = new Date(post.published_at);
                const formattedDate = date.toLocaleDateString(
                  locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                );

                return (
                  <BlogLinkTracker
                    key={post.id}
                    slug={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    style={{
                      display: 'block',
                      background: '#fff',
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      border: '1px solid var(--brand-border)',
                      transition: 'transform 200ms ease',
                    }}
                  >
                    {post.cover_image_url && (
                      <div
                        style={{
                          width: '100%',
                          height: 200,
                          backgroundImage: `url(${post.cover_image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                        role="img"
                        aria-label={post.title}
                      />
                    )}
                    <div style={{ padding: 24 }}>
                      <h6 className="body-h6" style={{ fontSize: 13, color: 'var(--brand-text-muted)', marginBottom: 8 }}>
                        {formattedDate}
                      </h6>
                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: 'var(--brand-charcoal)',
                          lineHeight: 1.3,
                          marginBottom: 8,
                        }}
                      >
                        {post.title}
                      </h3>
                      <h5
                        className="body-h5"
                        style={{
                          fontSize: 14,
                          color: 'var(--brand-text-muted)',
                          lineHeight: 1.7,
                          marginBottom: 16,
                          fontWeight: 400,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.excerpt}
                      </h5>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-yellow-dark)' }}>
                        {t('readMore')} &rarr;
                      </span>
                    </div>
                  </BlogLinkTracker>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
