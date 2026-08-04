export const siteConfig = {
  brandName: 'TANKPRO Malaysia',
  legalName: 'Utopia Group of Companies',
  tagline: 'Water Tank, Pump & Filter Supply + Installation Malaysia',
  domain: 'water-tank.my',
  url: 'https://water-tank.my',
  // Pinned company_websites.id — a domain rename can never disconnect this site.
  siteId: '65d86e81-c866-4b6b-9575-2dcadf5676c5',
  productSlug: 'water-tank',
  productName: 'Water Tank Supply & Installation',
  // TANKPRO's own WhatsApp number (Encik Beku Aircond Sdn. Bhd.).
  fallbackPhone: '601126688996',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  whatsappMessages: {
    ms: 'Hi TANKPRO, saya berminat untuk supply & install water tank / water pump / water filter. Boleh dapatkan sebut harga?',
    en: 'Hi TANKPRO, I am interested in water tank / water pump / water filter supply & installation. Can you send me a quote?',
    zh: '你好 TANKPRO，我想咨询水塔／水泵／滤水器的供应与安装。可以给我报价吗？',
  },
  colors: {
    brandBlue: '#0E7BD6',
    brandBlueDeep: '#0A5AA8',
    brandCyan: '#35B4F0',
    brandBluePale: '#E8F3FC',
    brandNavy: '#0A2540',
    brandSteel: '#1C3D5A',
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
