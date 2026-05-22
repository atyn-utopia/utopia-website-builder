import { loadEnvConfig } from '@next/env'
import createNextIntlPlugin from 'next-intl/plugin'

// Load shared Supabase env vars from repo root
loadEnvConfig(process.cwd() + '/../..')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.pexels.com' },
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
      { protocol: 'https' as const, hostname: 'placehold.co' },
      { protocol: 'https' as const, hostname: 'static.wixstatic.com' },
      { protocol: 'https' as const, hostname: 'xzydvhzcngpxdbyniliy.supabase.co' },
    ],
  },
}

export default withNextIntl(nextConfig)
