import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/ms/redirect-whatsapp-1',
          '/en/redirect-whatsapp-1',
          '/zh/redirect-whatsapp-1',
        ],
      },
    ],
    sitemap: 'https://cat-rumah-malaysia.vercel.app/sitemap.xml',
    host: 'https://cat-rumah-malaysia.vercel.app',
  }
}
