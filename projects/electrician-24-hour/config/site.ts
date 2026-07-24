// `domain` is the canonical live host — Supabase rows for products, blog posts,
// phone numbers, and company_websites are keyed by this exact string. Keep this
// in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  // Stable webcore identity — company_websites.id. The live domain is resolved
  // FROM this id, so a domain rename in the webcore admin can never silently
  // disconnect this site. Keep it pinned; never change it.
  siteId: 'f8dfcbf1-e65c-4eeb-9578-9e626646774b',
  domain: '24hourelectrician.my',
  siteUrl: 'https://24hourelectrician.my',
  brandName: 'Electrician 24 Hours',
  tagline: '24-Hour Emergency Electrician & Wiring Service Malaysia',
  productSlug: 'electrician-service',
  productName: 'Electrician Service',
  fallbackPhone: '60174287801',
  defaultLocale: 'en',
  locales: ['en', 'ms', 'zh'] as const,
  emergency: true,
};
