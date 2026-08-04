import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Both forms: the default locale (ms) serves the redirect page
        // un-prefixed, which `/*/redirect-whatsapp-1` would not match.
        disallow: ['/api/', '/redirect-whatsapp-1', '/*/redirect-whatsapp-1'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
