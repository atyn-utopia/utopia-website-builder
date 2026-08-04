export const siteConfig = {
  brandName: 'Majlis Aqiqah',
  legalName: 'Kak Kenduri Sdn. Bhd.',
  tagline: 'Pakej Aqiqah Lengkap & Mampu Milik Seluruh Malaysia',
  domain: 'majlisaqiqah.my',
  url: 'https://majlisaqiqah.my',
  // Pins webcore.company_websites.id so renaming the domain can never orphan
  // this site's leads_mode / phone routing.
  siteId: '0b9d52b7-eb5e-4cf3-b4f3-c7be77f86d26',
  productSlug: 'pakej-aqiqah',
  productName: 'Pakej Aqiqah',
  fallbackPhone: '60102529688',
  // Wordmark on a light background — used as the Organization / Article
  // publisher logo in JSON-LD (Google renders it on white).
  logoPath: '/brand/majlis-aqiqah-light.png',
  // Default social preview + JSON-LD image fallback. Must be a file that
  // actually exists in public/ — a 404 here silently kills link previews.
  ogImage: '/bg/hero.jpg',
  ogImageWidth: 1600,
  ogImageHeight: 1280,
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  whatsappMessages: {
    ms: 'Assalamualaikum, saya berminat dengan pakej aqiqah. Boleh dapatkan sebut harga?',
    en: 'Assalamualaikum, I am interested in your aqiqah package. Could I get a quote?',
    zh: '你好，我想了解你们的 Aqiqah 配套。可以给我报价吗？',
  },
  colors: {
    brandGold: '#C79A4B',
    brandGoldDeep: '#A87C33',
    brandGoldPale: '#FBF3E4',
    brandEmerald: '#0C5B45',
    brandForest: '#073A2C',
    brandGrey: '#6B7280',
    brandGreyLight: '#E4E7E4',
    brandWhite: '#FFFFFF',
    brandPaper: '#FBF7EF',
    waGreen: '#25D366',
    waGreenHover: '#1EBE57',
    googleYellow: '#FBBC04',
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
