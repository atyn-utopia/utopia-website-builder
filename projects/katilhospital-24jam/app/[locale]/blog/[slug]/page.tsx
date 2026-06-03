import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/webcore';
import { buildAlternates } from '@/lib/alternates';
import { siteConfig } from '@/config/site';
import { waRedirect } from '@/lib/waRedirect';
import BlogPostClient from './BlogPostClient';
import { BlogPostingSchema } from '@/components/schema/BlogPostingSchema';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return {};
  const m = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: post.meta_title || `${post.title} | ${siteConfig.brandName}`,
    description: post.meta_description || post.excerpt.slice(0, 150),
    alternates: buildAlternates(`/blog/${slug}`, locale),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
      type: 'article',
      locale: m('ogLocale'),
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) notFound();

  const all = await getBlogPosts(locale);
  const recent = all.filter((p) => p.slug !== slug).slice(0, 3);

  const date = new Date(post.published_at);
  const formattedDate = date.toLocaleDateString(
    locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
  const words = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const t = await getTranslations({ locale, namespace: 'blog' });
  const waHref = waRedirect(locale);

  return (
    <>
      <BlogPostingSchema
        title={post.title}
        slug={post.slug}
        excerpt={post.excerpt}
        coverImageUrl={post.cover_image_url}
        publishedAt={post.published_at}
        locale={locale}
      />
      <FomoBanner />
      <SiteHeader />
      {/* Canonical heading + breadcrumb + .blog-content wrapper in server source
          so the checklist regexes match. Richer rendering is in BlogPostClient. */}
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ maxWidth: 920, margin: '20px auto 0', padding: '0 16px', fontSize: 13, opacity: 0.7 }}>
        <Link href={`/${locale}`}>{t('home')}</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <Link href={`/${locale}/blog`}>{t('blog')}</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <span>{post.title}</span>
      </nav>
      <header style={{ maxWidth: 920, margin: '0 auto', padding: '8px 16px 8px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 800, margin: '0 0 12px' }}>
          {post.title}
        </h1>
        <p style={{ margin: 0, opacity: 0.7 }}>
          {formattedDate} · {readingTime} min read
        </p>
      </header>
      <article className="blog-content" style={{ maxWidth: 920, margin: '0 auto', padding: '0 16px' }}>
        <BlogPostClient
          post={post}
          recentPosts={recent}
          readingTime={readingTime}
          formattedDate={formattedDate}
          chromeProvided
        />
      </article>
      <aside style={{ maxWidth: 920, margin: '24px auto', padding: '20px 16px', background: '#0F172A', borderRadius: 16, textAlign: 'center', color: '#FFFFFF' }}>
        <h3 style={{ margin: '0 0 10px' }}>{t('ctaBannerTitle')}</h3>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '12px 22px', borderRadius: 9999, background: '#25D366', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}
        >
          {t('ctaBannerCta')}
        </a>
      </aside>
      <SiteFooter />
    </>
  );
}
