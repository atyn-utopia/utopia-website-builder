// `domain` is the canonical live host — Supabase rows for products, blog
// posts, phones, and company_websites are filtered on this exact string.
// Keep it in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: '8d9a5918-dc2f-4740-86d4-55a2b4266af3',
  brandName: 'Encik Beku',
  tagline: 'Service & Repair Aircond Malaysia',
  domain: 'service-aircond-malaysia.utopiaai.my',
  baseUrl: 'https://service-aircond-malaysia.utopiaai.my',
  siteUrl: 'https://service-aircond-malaysia.utopiaai.my',
  productSlug: 'service-aircond',
  productName: 'Aircond Service',
  fallbackPhone: '60174287801',
  defaultLocale: 'ms' as const,
  locales: ['en', 'ms', 'zh'] as const,
  emergency: false,
}
