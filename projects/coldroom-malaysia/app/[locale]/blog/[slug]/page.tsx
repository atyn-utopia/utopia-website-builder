import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/getBlogPosts';
import { waRedirect } from '@/lib/waRedirect';
import BlogNav from '@/components/BlogNav';
import BlogFooter from '@/components/BlogFooter';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { BlogCard } from '../BlogCard';

export const revalidate = 3600;

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

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <BlogNav />

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
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="blog-cta-inline">
            <strong>{cta.strong}</strong>
            <p>{cta.body}</p>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              {cta.button}
            </a>
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

      <BlogFooter />
    </>
  );
}
