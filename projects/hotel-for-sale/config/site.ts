export const siteConfig = {
  brandName: 'HotelForSale.my',
  legalName: 'Vivahomes Realty Sdn. Bhd.',
  agencyLicence: 'Agency E(1)1670',
  tagline: "Malaysia's Largest Complete Hotel For Sale Listing",
  domain: 'hotelforsale.my',
  url: 'https://hotelforsale.my',
  // Pinned company_websites.id — a domain rename can never disconnect this site.
  siteId: '3fb8448c-77e5-483e-abf5-20bb83dcc433',
  // Catalogue route slug for hotel listing location pages: /hotel-for-sale/{city}
  productSlug: 'hotel-for-sale',
  productName: 'Hotel For Sale',
  fallbackPhone: '601139985579',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  whatsappMessages: {
    en: 'I am interested in buying a hotel in Malaysia. Can you send me the latest hotel for sale listings?',
    ms: 'Saya berminat untuk membeli hotel di Malaysia. Boleh hantarkan senarai hotel untuk dijual yang terkini?',
    zh: '我有意在马来西亚购买酒店。可以发送最新的待售酒店清单给我吗？',
  },
  colors: {
    brandRed: '#EF4123',
    brandRedDeep: '#C9300F',
    brandRedPale: '#FFECE7',
    brandNavy: '#0E4C92',
    brandNavyDeep: '#0A2540',
    brandCharcoal: '#0A2540',
    brandSteel: '#1E3A5F',
    brandGrey: '#6B7280',
    brandGreyLight: '#E5E7EB',
    brandWhite: '#FFFFFF',
    waGreen: '#25D366',
    waGreenHover: '#1EBE57',
    googleYellow: '#FBBC04',
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
