import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Load shared Supabase env vars from repo root
loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
