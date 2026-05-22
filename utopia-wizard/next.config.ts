import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Brand-asset uploads in /new can easily blow past the 4MB default
    // when the user drops a logo + a few hero photos. 50MB is plenty.
    serverActions: { bodySizeLimit: '50mb' },
  },
}

export default nextConfig
