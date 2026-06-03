// `domain` is the canonical live host — Supabase rows for products, blog
// posts, phones, and company_websites are filtered on this exact string.
// Keep it in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  brandName: 'KatilCare',
  tagline: 'Sewa Katil Hospital Malaysia',
  domain: 'katil-hospital.utopiaai.my',
  baseUrl: 'https://katil-hospital.utopiaai.my',
  siteUrl: 'https://katil-hospital.utopiaai.my',
  productSlug: 'sewa-katil-hospital',
  productName: 'Hospital Bed Rental',
  fallbackPhone: '60123456789',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  emergency: false,
}
