import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Next 15.2+ streams metadata into <body> for every user agent that is not on
  // its short "HTML-limited bot" list — Googlebot and webcore's SEO audit
  // included — so <title> and the description landed ~75KB after </head>.
  // Matching every UA keeps metadata blocking, i.e. inside <head>, for all.
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
