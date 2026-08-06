import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'mazdcaibvhyqglfctdul.supabase.co' },
      // Product card photos the original static page pointed at. Kept so the
      // rebuild renders identically; replace with owned photography before
      // this becomes the production build (see reference/static-site.html).
      { protocol: 'https', hostname: 'katil-hospital-bed.my' },
      { protocol: 'https', hostname: 'randomuser.me' },
    ],
  },
};

export default withNextIntl(nextConfig);
