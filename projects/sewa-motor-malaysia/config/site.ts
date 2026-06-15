// `domain` is the canonical live host — Supabase rows for products, blog posts,
// phone numbers, and company_websites are keyed by this exact string. Keep this
// in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
//
// Note: `sewamotor.my` is a separate Wix site we do not own; do not point this
// at that host.
export const siteConfig = {
  name: 'Sewa Motor Malaysia',
  brandName: 'Sewa Motor Malaysia',
  domain: 'motorsewa.com.my',
  baseUrl: 'https://motorsewa.com.my',
  siteUrl: 'https://motorsewa.com.my',
  productSlug: 'sewa-motor',
  fallbackPhone: '60174287801',
}
