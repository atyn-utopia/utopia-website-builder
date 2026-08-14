import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates'
import { siteConfig } from '@/config/site';
import { getBlogPosts } from '@/lib/webcore';
import { BlogCard } from './BlogCard';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
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
  const posts = await getBlogPosts(locale);

  return (
    <>
      <PageStyles />
      <FomoBanner />
      <SiteHeader activeBlog />

      <section className="blog-header">
        <div className="section-container">
          <h1>{t('title')}</h1>
          <h2>{t('subtitle')}</h2>
        </div>
      </section>

      <section className="section-spacing-blog">
        <div className="section-container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--steel-500)' }}>
              <p>{t('noPosts')}</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => {
                const formattedDate = new Date(post.published_at).toLocaleDateString(
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
