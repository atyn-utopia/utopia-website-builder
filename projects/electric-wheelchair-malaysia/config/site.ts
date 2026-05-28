// `domain` is the canonical live host — Supabase rows for products, blog
// posts, phones, and company_websites are keyed on this exact string, and the
// custom domain electricwheelchairmalaysia.com.my is what actually serves
// traffic (the *.vercel.app host now 404s). Keep this in sync with
// deploy-url.txt and the data-website attribute in app/[locale]/layout.tsx.
export const siteConfig = {
  domain: 'electricwheelchairmalaysia.com.my',
  siteUrl: 'https://electricwheelchairmalaysia.com.my',
  brandName: 'Electric Wheelchair Malaysia',
  tagline: 'Electric Wheelchair Rental & Sales in Malaysia',
  productSlug: 'electric-wheelchair',
  productName: 'Electric Wheelchair',
  fallbackPhone: '60108889849',
  defaultLocale: 'en',
  locales: ['en', 'ms', 'zh'] as const,
  emergency: false,
};
