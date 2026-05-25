export const siteConfig = {
  brandName: 'Abang Excavator',
  legalName: 'Utopia Holiday Sdn. Bhd.',
  tagline: 'Sewa Excavator No.1 Malaysia',
  domain: 'sewa-excavator.utopiaai.my',
  url: 'https://sewa-excavator.utopiaai.my',
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
