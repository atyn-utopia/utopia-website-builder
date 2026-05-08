import { siteConfig } from '@/config/site';

interface BlogPostingSchemaProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  publishedAt: string;
  locale: string;
}

export function BlogPostingSchema({
  title,
  slug,
  excerpt,
  coverImageUrl,
  publishedAt,
  locale,
}: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    image: coverImageUrl ? [coverImageUrl] : [`${siteConfig.siteUrl}/brand/hero/hero.png`],
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      '@type': 'Organization',
      name: siteConfig.brandName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brandName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.siteUrl}/brand/logo/logo-dark.png`,
      },
    },
    mainEntityOfPage: `${siteConfig.siteUrl}/${locale}/blog/${slug}`,
    description: excerpt,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
