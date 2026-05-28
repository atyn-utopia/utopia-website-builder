import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getBlogPost, getBlogPostSlugs, getRecentBlogPosts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { ArticleSchema } from '@/components/schema/ArticleSchema';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FomoBanner from '@/components/FomoBanner';

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.flatMap((s) =>
    routing.locales.map((locale) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) return {};
  const tr = post.blog_translations[0];
  const path = `/blog/${slug}`;
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}${path}`;
  return {
    title: tr.meta_title || `${tr.title} | ${siteConfig.brandName}`,
    description: tr.meta_description || tr.excerpt,
    alternates: { canonical: `${siteConfig.url}/${locale}${path}`, languages },
    openGraph: {
      type: 'article', title: tr.title, description: tr.excerpt,
      url: `${siteConfig.url}/${locale}${path}`,
      images: post.cover_image_url ? [{ url: post.cover_image_url, width: 1200, height: 630 }] : undefined,
      publishedTime: post.published_at,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) notFound();
  const tr = post.blog_translations[0];
  const t = await getTranslations({ locale, namespace: 'blog' });
  const recent = await getRecentBlogPosts(locale, slug, 3);
  const wordCount = (tr.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 220));
  const formattedDate = new Date(post.published_at).toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <FomoBanner />
      <SiteHeader />
      <ArticleSchema
        locale={locale}
        slug={slug}
        title={tr.title}
        excerpt={tr.excerpt}
        coverImage={post.cover_image_url}
        publishedAt={post.published_at}
      />

      {/* Breadcrumb */}
      <section style={{ background: '#f8fafc', padding: '14px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <nav aria-label="Breadcrumb" style={{ maxWidth: 880, margin: '0 auto', fontSize: 13, color: '#64748b' }}>
          <Link href={`/${locale}`} style={{ color: '#64748b', textDecoration: 'none' }}>{t('breadcrumbHome')}</Link>
          <span style={{ margin: '0 8px' }} aria-hidden="true">›</span>
          <Link href={`/${locale}/blog`} style={{ color: '#64748b', textDecoration: 'none' }}>{t('breadcrumbBlog')}</Link>
          <span style={{ margin: '0 8px' }} aria-hidden="true">›</span>
          <span aria-current="page" style={{ color: '#0f172a', fontWeight: 500 }}>{tr.title}</span>
        </nav>
      </section>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#0f172a',
            margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em',
          }}>
            {tr.title}
          </h1>
          <h2 style={{ fontSize: 16, fontWeight: 400, color: '#475569', margin: '14px 0 0', lineHeight: 1.55 }}>
            {tr.excerpt}
          </h2>
          <div style={{
            display: 'flex', gap: 14, marginTop: 18, fontSize: 13, color: '#64748b',
            alignItems: 'center', flexWrap: 'wrap',
          }}>
            <span>{t('publishedOn')} {formattedDate}</span>
            <span style={{ opacity: 0.4 }} aria-hidden="true">·</span>
            <span>{minutes} {t('minRead')}</span>
          </div>
        </header>

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={tr.title}
            style={{ width: '100%', height: 'auto', borderRadius: 14, marginBottom: 32, display: 'block' }}
          />
        )}

        <div
          className="blog-content"
          style={{ fontSize: 17, lineHeight: 1.75, color: '#1e293b' }}
          dangerouslySetInnerHTML={{ __html: tr.content }}
        />
      </article>

      {/* WhatsApp CTA */}
      <section style={{ background: '#0f172a', color: '#fff', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
            {t('ctaBannerTitle')}
          </h3>
          <p style={{ fontSize: 15, opacity: 0.85, margin: '12px 0 22px', lineHeight: 1.6 }}>
            {t('ctaBannerBody')}
          </p>
          <Link
            href={waRedirect(locale)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', background: '#25D366', color: '#fff',
              padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none',
            }}
          >
            {t('ctaBannerLabel')}
          </Link>
        </div>
      </section>

      {/* Related articles */}
      {recent.length > 0 && (
        <section style={{ padding: '56px 24px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>
              {t('recentPosts')}
            </h3>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20,
            }}>
              {recent.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/blog/${r.slug}`}
                  style={{
                    background: '#fff', borderRadius: 12, padding: 20, textDecoration: 'none',
                    color: 'inherit', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                >
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
                    {r.blog_translations[0]?.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '24px', textAlign: 'center', background: '#fff' }}>
        <Link href={`/${locale}/blog`} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>
          {t('backToBlog')}
        </Link>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
