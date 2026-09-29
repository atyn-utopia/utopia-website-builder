import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Load shared Supabase env vars from repo root
loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Block on metadata for every user agent, not just Next's built-in bot list.
  // Otherwise per-request pages stream <title> into <body>, and webcore's SEO
  // audit (Webcore-SEO-Audit/1.0) and non-JS crawlers find no title in <head>.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
