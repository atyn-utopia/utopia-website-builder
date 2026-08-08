export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: '6f92b670-ae39-4b9f-a89a-ffda21b7d5c1',
  // Canonical "website" key for the shared Supabase DB — products, blog_posts,
  // phone_numbers and company_websites rows are all stored under this value.
  domain: 'coldroomrental.my',
  siteUrl: 'https://coldroomrental.my',
  brandName: 'Cold Room Malaysia',
  tagline: 'Cold Room Rental & Cold Chain Storage in Malaysia',
  productSlug: 'cold-room',
  productName: 'Cold Room Rental',
  // Real reachable number (the DB 'default' row) so the fallback path and the
  // Organization schema ContactPoint never expose a dead placeholder.
  fallbackPhone: '60183494981',
  defaultLocale: 'en',
  locales: ['en', 'ms', 'zh'] as const,
  emergency: false,
};
