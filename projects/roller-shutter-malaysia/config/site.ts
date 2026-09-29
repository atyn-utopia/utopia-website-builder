export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: 'affb0ba5-0a20-42ec-a5e6-980c3b7ceb4f',
  domain: 'rollershutterdoors.my',
  brandName: 'Encik Roller Shutter',
  tagline: 'Kukuh & Berbaloi, Kami Janji!',
  productSlug: 'roller-shutter',
  // This client's OWN number, matching the phone_numbers row for
  // rollershutterdoors.my. It previously held 60174287801, which belongs to a
  // DIFFERENT site in the fleet (katilhospitalmurah.com.my) — a fallback
  // pointing at another client silently misroutes leads on a DB miss.
  fallbackPhone: '60106684688',
  defaultLocale: 'ms',
  locales: ['ms', 'en', 'zh'] as const,
  emergency: true,
};
