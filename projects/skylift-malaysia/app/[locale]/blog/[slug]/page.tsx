import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogNav from '@/components/BlogNav';
import BlogFooter from '@/components/BlogFooter';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
      siteName: siteConfig.brandName,
      type: 'article',
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
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

  const other = all.filter((p) => p.slug !== slug).slice(0, 3);
  const readingTime = estimateReadingTime(post.content);
  const publishedDate = new Date(post.published_at).toLocaleDateString(
    locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const waHref = waRedirect(locale);

  const breadcrumbItems = [
    { name: t('breadcrumbHome'), url: `/${locale}` },
    { name: t('breadcrumbBlog'), url: `/${locale}/blog` },
    { name: post.title, url: `/${locale}/blog/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <BlogNav />

      <article className="section">
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
            <span>{t('publishedOn')} {publishedDate}</span>
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
        </div>
      </article>

      {other.length > 0 && (
        <section className="section section-ice">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">More</span>
              <h3>{t('recentPosts')}</h3>
            </div>
            <div className="blog-grid">
              {other.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/blog/${p.slug}`}
                  className="blog-card"
                >
                  <div className="blog-card-img">
                    <img
                      src={p.cover_image_url || '/brand/hero.png'}
                      alt={p.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-card-body">
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <span className="blog-card-more">{t('readMore')} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <BlogFooter />
    </>
  );
}
