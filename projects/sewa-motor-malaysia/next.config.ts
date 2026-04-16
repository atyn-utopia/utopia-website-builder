import { loadEnvConfig } from '@next/env'
import createNextIntlPlugin from 'next-intl/plugin'

// Load shared Supabase env vars from repo root
loadEnvConfig(process.cwd() + '/../..')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {}

export default withNextIntl(nextConfig)
