import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getBlogPosts, getPhoneNumber } from '@/lib/webcore';
import BlogNav from '@/components/BlogNav';
import BlogFooter from '@/components/BlogFooter';
import BlogClickTracker from '@/components/tracking/BlogClickTracker';

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
  const [posts, phoneResult] = await Promise.all([
    getBlogPosts(locale),
    getPhoneNumber(),
  ]);

  return (
    <>
      <BlogNav phoneNumber={phoneResult.phone} />

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
              <p>{t('noPosts')}</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => {
                const date = new Date(post.published_at).toLocaleDateString(
                  locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                );
                return (
                  <BlogClickTracker
                    key={post.id}
                    slug={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    className="blog-card"
                  >
                    <div className="blog-card-img">
                      <img
                        src={post.cover_image_url || '/brand/hero.png'}
                        alt={post.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="blog-card-body">
                      <span className="blog-card-date">{date}</span>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <span className="blog-card-more">{t('readMore')} →</span>
                    </div>
                  </BlogClickTracker>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <BlogFooter phoneNumber={phoneResult.phone} />
    </>
  );
}
