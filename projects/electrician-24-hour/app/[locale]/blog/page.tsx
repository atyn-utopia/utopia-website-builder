import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates'
import { siteConfig } from '@/config/site';
import { getBlogPosts } from '@/lib/webcore';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker';
import { ogImages } from '@/lib/ogImage';

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
    alternates: seoAlternates(locale, `/blog`),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${siteConfig.siteUrl}/${locale}/blog`,
      siteName: siteConfig.brandName,
      type: 'website',
      images: ogImages(locale),
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
  const fomoT = await getTranslations({ locale, namespace: 'fomoBanner' });
  const fomoTexts = fomoT.raw('texts') as string[];
  const posts = await getBlogPosts(locale);

  return (
    <>
      <FomoBanner text={fomoTexts[0]} />
      <SiteHeader />

      <section className="blog-header">
        <div className="container">
          <h1>{t('title')}</h1>
          <h2 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', fontWeight: 500, marginTop: 10, letterSpacing: 0 }}>
            {t('metaDescription')}
          </h2>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--ink-muted)',
              }}
            >
              <h5 className="body-text">{t('noPosts')}</h5>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => {
                const date = new Date(post.published_at).toLocaleDateString(
                  locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                );
                return (
                  <BlogLinkTracker
                    key={post.id}
                    slug={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    className="blog-card"
                  >
                    <div className="blog-card-img">
                      <img
                        src={post.cover_image_url || '/brand/hero.jpg'}
                        alt={post.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="blog-card-body">
                      <span className="blog-card-date">{date}</span>
                      <h3>{post.title}</h3>
                      <h5 className="body-text">{post.excerpt}</h5>
                      <span className="blog-card-more">{t('readMore')} →</span>
                    </div>
                  </BlogLinkTracker>
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
