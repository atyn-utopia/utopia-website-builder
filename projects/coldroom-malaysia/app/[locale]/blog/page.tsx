import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getBlogPosts } from '@/lib/getBlogPosts';
import { waRedirect } from '@/lib/waRedirect';
import { SiteFomoBar } from '@/components/SiteFomoBar';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { BlogCard } from './BlogCard';

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
      <SiteFomoBar />
      <SiteNav activeBlog />

      {/* BLOG HEADER */}
      <section
        style={{
          background: 'var(--grad-steel)',
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
          <h2 style={{ color: 'var(--frost-pale)', fontSize: 'clamp(15px, 1.5vw, 20px)', fontWeight: 500, maxWidth: 660, margin: '0 auto' }}>
            {t('subtitle')}
          </h2>
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
                  <BlogCard
                    key={post.id}
                    locale={locale}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    coverImageUrl={post.cover_image_url}
                    formattedDate={formattedDate}
                    readMoreLabel={t('readMore')}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter locale={locale} />
    </>
  );
}
