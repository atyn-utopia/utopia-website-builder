export const siteConfig = {
  // Stable webcore identity (company_websites.id). Never changes on domain rename.
  siteId: '757196d4-c728-47a9-b6b3-283e6937d34a',
  brandName: 'Abang Excavator',
  legalName: 'Utopia Group of Companies',
  tagline: 'Sewa Excavator No.1 Malaysia',
  domain: 'sewaexcavator.my',
  url: 'https://sewaexcavator.my',
  productSlug: 'excavator',
  productName: 'Excavator Rental',
  fallbackPhone: '60174287801',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  whatsappMessages: {
    ms: 'Hi Abang Excavator, saya berminat untuk sewa excavator. Boleh dapatkan sebut harga?',
    en: 'Hi Abang Excavator, I would like to rent an excavator. Can you send me a quote?',
    zh: '你好 Abang Excavator，我想租用挖掘机。可以给我报价吗？',
  },
  colors: {
    brandOrange: '#F26C1F',
    brandOrangeDeep: '#D8550E',
    brandOrangePale: '#FFF1E6',
    brandCharcoal: '#0F0F0F',
    brandSteel: '#2A2D33',
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
