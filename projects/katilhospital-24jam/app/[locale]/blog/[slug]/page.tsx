import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/webcore';
import { buildAlternates } from '@/lib/alternates';
import { siteConfig } from '@/config/site';
import BlogPostClient from './BlogPostClient';
import { BlogPostingSchema } from '@/components/schema/BlogPostingSchema';

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
      <BlogPostClient
        post={post}
        recentPosts={recent}
        readingTime={readingTime}
        formattedDate={formattedDate}
      />
    </>
  );
}
