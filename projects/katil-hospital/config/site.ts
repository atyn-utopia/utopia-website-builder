// `domain` is the canonical live host — Supabase rows for products, blog
// posts, phones, and company_websites are filtered on this exact string.
// Keep it in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  brandName: 'KatilCare',
  tagline: 'Sewa Katil Hospital Malaysia',
  domain: 'katilcare-scaffold.utopiaai.my',
  baseUrl: 'https://katilcare-scaffold.utopiaai.my',
  siteUrl: 'https://katilcare-scaffold.utopiaai.my',
  productSlug: 'sewa-katil-hospital',
  productName: 'Hospital Bed Rental',
  fallbackPhone: '60173291488',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  emergency: false,
}
