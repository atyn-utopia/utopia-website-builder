// `domain` is the canonical live host — Supabase rows for products, blog posts,
// phone numbers, and company_websites are keyed by this exact string. Keep this
// in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: 'f8dfcbf1-e65c-4eeb-9578-9e626646774b',
  domain: 'electrician-24hour.utopiaai.my',
  siteUrl: 'https://electrician-24hour.utopiaai.my',
  brandName: 'Electrician 24 Hours',
  tagline: '24-Hour Emergency Electrician & Wiring Service Malaysia',
  productSlug: 'electrician-service',
  productName: 'Electrician Service',
  fallbackPhone: '60174287801',
  defaultLocale: 'en',
  locales: ['en', 'ms', 'zh'] as const,
  emergency: true,
};
