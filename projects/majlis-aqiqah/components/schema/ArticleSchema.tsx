import { siteConfig } from '@/config/site';
import { localeAbs } from '@/lib/localeHref';

export function ArticleSchema({
  locale,
  slug,
  title,
  excerpt,
  coverImage,
  publishedAt,
}: {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: coverImage ? [coverImage] : [`${siteConfig.url}${siteConfig.ogImage}`],
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: { '@type': 'Organization', name: siteConfig.brandName },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brandName,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}${siteConfig.logoPath}` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      // Must match the page's canonical exactly (un-prefixed for the default locale).
      '@id': localeAbs(locale, `/blog/${slug}`),
    },
    inLanguage: locale,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
