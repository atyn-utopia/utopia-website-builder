// `domain` is the canonical live host — Supabase rows for products, blog
// posts, phones, and company_websites are filtered on this exact string.
// Keep it in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: '8d9a5918-dc2f-4740-86d4-55a2b4266af3',
  brandName: 'Encik Beku',
  tagline: 'Service & Repair Aircond Malaysia',
  // The blog and product queries bake this in at BUILD time, so a change here
  // only reaches the live site after a redeploy, never from a DB edit alone.
  // (The phone lookup is unaffected — it reads the live HTTP host header.)
  domain: 'servisaircondrumah.my',
  baseUrl: 'https://servisaircondrumah.my',
  siteUrl: 'https://servisaircondrumah.my',
  productSlug: 'service-aircond',
  productName: 'Aircond Service',
  // This client's own number. It previously held 60174287801, which belongs to
  // katilhospitalmurah.com.my. That matters more here than on most sites:
  // leads_mode is 'location' and there is NO location_slug='all' row, so every
  // page outside kuala-lumpur / melaka / pulau-pinang resolves via this
  // fallback — pointing it at another client would misroute most enquiries.
  fallbackPhone: '60189294628',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  emergency: false,
}
