import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*/redirect-whatsapp-1'],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
