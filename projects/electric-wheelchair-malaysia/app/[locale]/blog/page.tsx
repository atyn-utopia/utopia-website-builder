import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getBlogPosts } from '@/lib/getBlogPosts';
import { waRedirect } from '@/lib/waRedirect';
import Link from 'next/link';
import BlogNav from '@/components/BlogNav';
import BlogFooter from '@/components/BlogFooter';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/blog`,
      languages: {
        en: `${siteConfig.siteUrl}/en/blog`,
        ms: `${siteConfig.siteUrl}/ms/blog`,
        zh: `${siteConfig.siteUrl}/zh/blog`,
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${siteConfig.siteUrl}/${locale}/blog`,
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
  const navT = await getTranslations({ locale, namespace: 'nav' });
  const footerT = await getTranslations({ locale, namespace: 'footer' });
  const posts = await getBlogPosts(locale);
  const waHref = waRedirect(locale);

  return (
    <>
      <BlogNav />

      {/* BLOG HEADER */}
      <section
        style={{
          background: 'var(--gradient-navy)',
          padding: 'var(--space-3xl) 0',
        }}
      >
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: 'var(--white)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            {t('title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
            {t('metaDescription')}
          </p>
        </div>
      </section>

      {/* BLOG POSTS GRID */}
      <section className="section-spacing">
        <div className="section-container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                {t('noPosts')}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 'var(--space-xl)',
              }}
            >
              {posts.map((post) => {
                const date = new Date(post.published_at);
                const formattedDate = date.toLocaleDateString(
                  locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                );

                return (
                  <a
                    key={post.id}
                    href={`/${locale}/blog/${post.slug}`}
                    style={{
                      display: 'block',
                      background: 'var(--white)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-card)',
                      transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Cover image */}
                    {post.cover_image_url && (
                      <div
                        style={{
                          width: '100%',
                          height: '200px',
                          backgroundImage: `url(${post.cover_image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    )}

                    <div style={{ padding: 'var(--space-lg)' }}>
                      {/* Date */}
                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          marginBottom: 'var(--space-sm)',
                        }}
                      >
                        {formattedDate}
                      </p>

                      {/* Title */}
                      <h2
                        style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: 'var(--navy)',
                          lineHeight: 'var(--leading-snug)',
                          marginBottom: 'var(--space-sm)',
                        }}
                      >
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-muted)',
                          lineHeight: 'var(--leading-relaxed)',
                          marginBottom: 'var(--space-md)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Read More */}
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--orange)',
                        }}
                      >
                        {t('readMore')} &rarr;
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <BlogFooter />
    </>
  );
}
