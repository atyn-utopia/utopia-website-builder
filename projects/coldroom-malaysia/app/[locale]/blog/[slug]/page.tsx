import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import PageStyles from '@/components/PageStyles';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { TrackedWhatsAppLink } from '@/components/TrackedWhatsAppLink';
import { BlogCard } from '../BlogCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale as string);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
      languages: {
        en: `${siteConfig.siteUrl}/en/blog/${slug}`,
        ms: `${siteConfig.siteUrl}/ms/blog/${slug}`,
        zh: `${siteConfig.siteUrl}/zh/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
      siteName: siteConfig.brandName,
      type: 'article',
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
  };
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function stripLeadingH1(html: string): string {
  return html.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, '');
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const [post, all] = await Promise.all([
    getBlogPostBySlug(slug, locale),
    getBlogPosts(locale),
  ]);
  if (!post) notFound();

  const recent = all.filter((p) => p.slug !== slug).slice(0, 3);
  const readingTime = estimateReadingTime(post.content);
  const formattedDate = new Date(post.published_at).toLocaleDateString(
    locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const waHref = waRedirect(locale);

  const breadcrumbItems = [
    { name: t('breadcrumbHome'), url: `/${locale}` },
    { name: t('breadcrumbBlog'), url: `/${locale}/blog` },
    { name: post.title, url: `/${locale}/blog/${slug}` },
  ];

  const ctaCopy: Record<string, { strong: string; body: string; button: string }> = {
    en: {
      strong: '❄️ Need cold storage today?',
      body: 'HALAL fleet, same-day delivery across Peninsular Malaysia. Quote in 5 minutes.',
      button: 'WhatsApp Now',
    },
    ms: {
      strong: '❄️ Perlukan cold storage hari ini?',
      body: 'Armada HALAL, penghantaran hari sama seluruh Semenanjung Malaysia. Sebut harga dalam 5 minit.',
      button: 'WhatsApp Sekarang',
    },
    zh: {
      strong: '❄️ 今天就需要冷藏？',
      body: 'HALAL 车队，马来西亚半岛当天送达。5 分钟内报价。',
      button: '立即 WhatsApp',
    },
  };
  const cta = ctaCopy[locale] ?? ctaCopy.en;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: { '@type': 'Organization', name: siteConfig.brandName },
    publisher: { '@type': 'Organization', name: siteConfig.brandName },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.siteUrl}/${locale}/blog/${slug}` },
    inLanguage: locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <PageStyles />
      <FomoBanner />
      <SiteHeader activeBlog />

      <article className="section-spacing-blog">
        <div className="blog-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
            <span className="sep">/</span>
            <Link href={`/${locale}/blog`}>{t('breadcrumbBlog')}</Link>
            <span className="sep">/</span>
            <span>{post.title}</span>
          </nav>

          <h1>{post.title}</h1>
          <div className="meta">
            <span>{t('publishedOn')} {formattedDate}</span>
            <span>·</span>
            <span>{readingTime} {t('minRead')}</span>
          </div>

          {post.cover_image_url && (
            <div className="cover">
              <img src={post.cover_image_url} alt={post.title} />
            </div>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: stripLeadingH1(post.content) }}
          />

          <div className="blog-cta-inline">
            <strong>{cta.strong}</strong>
            <p>{cta.body}</p>
            <TrackedWhatsAppLink href={waHref} className="btn btn-wa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.463 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm5.421-7.403c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              {cta.button}
            </TrackedWhatsAppLink>
          </div>
        </div>
      </article>

      {recent.length > 0 && (
        <section className="section-ice section-spacing-blog">
          <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span className="eyebrow">More</span>
              <h3 style={{ fontSize: 'var(--text-h3, 28px)', fontWeight: 800, color: 'var(--steel-900)', marginTop: 6 }}>
                {t('recentPosts')}
              </h3>
            </div>
            <div className="blog-grid">
              {recent.map((p) => {
                const d = new Date(p.published_at).toLocaleDateString(
                  locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                );
                return (
                  <BlogCard
                    key={p.id}
                    locale={locale}
                    slug={p.slug}
                    title={p.title}
                    excerpt={p.excerpt}
                    coverImageUrl={p.cover_image_url}
                    formattedDate={d}
                    readMoreLabel={t('readMore')}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      <SiteFooter locale={locale} />
    </>
  );
}
