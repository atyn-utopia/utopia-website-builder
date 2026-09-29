import { loadEnvConfig } from '@next/env'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Load shared Supabase env vars from repo root
loadEnvConfig(process.cwd() + '/../..')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // Every route renders per request, and Next streams metadata into <body>
  // for any user agent not on its HTML-limited bot list. Googlebot and
  // webcore's audit (Webcore-SEO-Audit/1.0) are not on it, so a cold render
  // put <title> after </head>. Block on metadata for every agent instead.
  htmlLimitedBots: /.*/,
}

export default withNextIntl(nextConfig)
