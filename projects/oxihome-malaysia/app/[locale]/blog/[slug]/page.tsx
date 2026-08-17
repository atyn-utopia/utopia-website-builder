import type { Metadata } from 'next';
import { seoAlternates } from '@/lib/seoAlternates'
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
import { ogImages } from '@/lib/ogImage';

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
    alternates: seoAlternates(locale, `${path}`),
    openGraph: {
      type: 'article', title: tr.title, description: tr.excerpt,
      url: `${siteConfig.url}/${locale}${path}`,
      // An article with its own cover art shares better than the generic hero
      // card; fall back to the locale card when it has none.
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, width: 1200, height: 630 }]
        : ogImages(locale),
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
              display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff',
              padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none',
            }}
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="#fff" style={{ flexShrink: 0 }} aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
            </svg>
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
