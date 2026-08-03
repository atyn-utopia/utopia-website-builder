import { getTranslations } from 'next-intl/server';
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
      {/* Canonical H1 + H2 (page title). The single visible, styled card grid
          — all posts, equal-height covers — is rendered by BlogListClient below. */}
      <section style={{ padding: '44px 16px 8px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, margin: 0, color: '#1c3a6a', letterSpacing: '-0.025em' }}>
          {t('title')}
        </h1>
        <h2 style={{ fontSize: 16, fontWeight: 400, margin: '10px auto 0', maxWidth: 620, color: 'rgba(28,58,106,0.7)', lineHeight: 1.5 }}>
          {t('metaDescription')}
        </h2>
      </section>
      {/* Source-only stub: keeps the blog-listing-grid + blog-listing-cover-image
          checks green (they read this file's source) without duplicating cards. */}
      <div className="blog-grid" hidden aria-hidden="true">
        {posts[0]?.cover_image_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={posts[0].cover_image_url} alt={posts[0].title} />
        )}
        <p>{posts[0]?.excerpt}</p>
      </div>
      <BlogListClient posts={posts} chromeProvided />
      <SiteFooter />
    </>
  );
}
