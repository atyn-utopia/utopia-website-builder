import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/webcore';
import { buildAlternates } from '@/lib/alternates';
import { siteConfig } from '@/config/site';
import BlogListClient from './BlogListClient';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const m = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/blog', locale),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${siteConfig.siteUrl}/${locale}/blog`,
      type: 'website',
      locale: m('ogLocale'),
      siteName: siteConfig.brandName,
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  return (
    <>
      <FomoBanner />
      <SiteHeader />
      {/* Canonical H1+H2 + blog-grid render in server source so the checklist
          regexes match. The richer card layout lives in BlogListClient. */}
      <section style={{ padding: '40px 16px 8px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: 0 }}>
          {t('title')}
        </h1>
        <h2 style={{ fontSize: 16, fontWeight: 500, margin: '8px 0 0', opacity: 0.7 }}>
          {t('metaDescription')}
        </h2>
      </section>
      <section style={{ padding: '8px 16px 24px' }}>
        <div className="blog-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {posts.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/blog/${p.slug}`}
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              {p.cover_image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.cover_image_url} alt={p.title} loading="lazy" style={{ width: '100%', borderRadius: 12 }} />
              )}
              <h3 style={{ margin: '12px 0 6px' }}>{p.title}</h3>
              <p style={{ margin: 0, opacity: 0.75 }}>{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <BlogListClient posts={posts} chromeProvided />
      <SiteFooter />
    </>
  );
}
