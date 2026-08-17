// `domain` is the canonical live host — Supabase rows for products, blog
// posts, phones, and company_websites are filtered on this exact string.
// Keep it in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: '54c0e27d-64bd-491e-a97a-8fe6d4e92650',
  brandName: 'Cat Rumah Express',
  tagline: 'Rumah Baru dalam 1 Hari — Dari RM3.50/sqft',
  domain: 'cat-rumah.my',
  baseUrl: 'https://cat-rumah.my',
  siteUrl: 'https://cat-rumah.my',
  productSlug: 'cat-rumah',
  productName: 'Cat Rumah',
  fallbackPhone: '60165885466',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  emergency: false,
}

// Legacy export kept so any straggling imports don't break during the chassis
// swap; new code should import { siteConfig } only.
export const site = siteConfig
