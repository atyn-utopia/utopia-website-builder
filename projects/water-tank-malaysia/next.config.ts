import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Keep <title>/<meta> in <head> for every client. By default Next streams
  // metadata into <body> for user agents outside its HTML-limited bot list,
  // which includes Googlebot's renderer and webcore's SEO audit — both then
  // read the page as having no title.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'xzydvhzcngpxdbyniliy.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
