export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: 'affb0ba5-0a20-42ec-a5e6-980c3b7ceb4f',
  // Canonical "website" key for the shared Supabase DB — products, blog_posts,
  // phone_numbers and company_websites rows are all stored under this value.
  // The blog and product queries bake this in at BUILD time, so a change here
  // only reaches the live site after a redeploy, never from a DB edit alone.
  domain: 'rollershutterdoors.my',
  brandName: 'Encik Roller Shutter',
  tagline: 'Kukuh & Berbaloi, Kami Janji!',
  productSlug: 'roller-shutter',
  // This client's OWN number, matching the phone_numbers row for
  // rollershutterdoors.my. It previously held 60174287801, which belongs to a
  // DIFFERENT site in the fleet — a fallback pointing at another client
  // silently misroutes leads whenever the DB lookup misses.
  fallbackPhone: '60106684688',
  defaultLocale: 'ms',
  locales: ['ms', 'en', 'zh'] as const,
  emergency: true,
};
