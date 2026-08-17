import type { Metadata } from 'next';
import { seoAlternates } from '@/lib/seoAlternates'
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getBlogPosts } from '@/lib/webcore';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BlogLinkTracker from '@/components/tracking/BlogLinkTracker';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.blogListing' });
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/blog`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}/blog`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: seoAlternates(locale, `/blog`),
  };
}

export default async function BlogListing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = await getBlogPosts(locale);
  const dateLocale = locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY';

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff' }}>
      <SiteHeader />

      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          padding: '64px 24px',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
            <Link href={`/${locale}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{t('breadcrumbHome')}</Link>
            <span style={{ margin: '0 8px', opacity: 0.5 }} aria-hidden="true">›</span>
            <span aria-current="page" style={{ color: '#fff', fontWeight: 500 }}>{t('breadcrumbBlog')}</span>
          </nav>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, margin: 0,
            letterSpacing: '-0.02em', lineHeight: 1.15,
          }}>
            {t('title')}
          </h1>
          <h2 style={{
            fontSize: 16, fontWeight: 400, margin: '14px auto 0', maxWidth: 620,
            opacity: 0.85, lineHeight: 1.5,
          }}>
            {t('subtitle')}
          </h2>
        </div>
      </section>

      {/* Posts grid */}
      <section style={{ padding: '56px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#64748b', fontSize: 16 }}>
              {t('noPosts')}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24,
            }}>
              {posts.map((post) => {
                const tr = post.blog_translations[0];
                const date = new Date(post.published_at);
                const formattedDate = Number.isNaN(date.getTime())
                  ? ''
                  : date.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
                return (
                  <BlogLinkTracker
                    key={post.id}
                    slug={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#fff',
                      borderRadius: 14,
                      overflow: 'hidden',
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {post.cover_image_url && (
                      <div style={{
                        width: '100%',
                        height: 200,
                        backgroundImage: `url(${post.cover_image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }} />
                    )}
                    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {formattedDate && (
                        <span style={{ fontSize: 12, color: '#64748b', letterSpacing: '0.04em' }}>{formattedDate}</span>
                      )}
                      <h3 style={{
                        fontSize: 19, fontWeight: 700, color: '#0f172a', margin: 0,
                        lineHeight: 1.3, letterSpacing: '-0.01em',
                      }}>
                        {tr?.title}
                      </h3>
                      <p style={{
                        fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.55,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {tr?.excerpt}
                      </p>
                      <span style={{ marginTop: 'auto', fontSize: 13, fontWeight: 600, color: '#2563eb', paddingTop: 6 }}>
                        {t('readMore')} →
                      </span>
                    </div>
                  </BlogLinkTracker>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '32px 24px', textAlign: 'center', background: '#fff' }}>
        <Link href={`/${locale}`} style={{ display: 'inline-block', fontSize: 14, color: '#64748b', textDecoration: 'none' }}>
          ← {locale === 'ms' ? 'Kembali ke laman utama' : locale === 'zh' ? '返回首页' : 'Back to home'}
        </Link>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
