import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Treat every user agent as HTML-limited so metadata is never streamed.
  // Otherwise a cache-miss render puts <title> in <body> for any agent not on
  // Next's bot list -- webcore's audit (Webcore-SEO-Audit/1.0) included -- and
  // the audit, which reads head > title, reports the page as having no title.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
