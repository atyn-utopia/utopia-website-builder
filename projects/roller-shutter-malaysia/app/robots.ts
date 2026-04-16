import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${siteConfig.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/redirect-whatsapp-1'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
