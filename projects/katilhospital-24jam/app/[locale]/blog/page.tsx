import { getTranslations } from 'next-intl/server';
import { getBlogPosts } from '@/lib/webcore';
import { buildAlternates } from '@/lib/alternates';
import { siteConfig } from '@/config/site';
import BlogListClient from './BlogListClient';

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

  return <BlogListClient posts={posts} />;
}
