export const siteConfig = {
  brandName: 'Kak Kenduri',
  legalName: 'Kak Kenduri Sdn. Bhd.',
  domain: 'tablechair-rental-malaysia.vercel.app',
  url: 'https://tablechair-rental-malaysia.vercel.app',
  productSlug: 'table-chair-rental',
  fallbackPhone: '60174287801',
  email: 'kerusimejamy@gmail.com',
  phoneDisplay: '+60 17-428 7801',
  address: 'No. 3, Lot 156, Jalan Jurubina U1/18, 40150 Shah Alam, Selangor',
  ssm: '1507990-A',
  priceRange: 'RM3.60 - RM86.40',
  whatsappMessages: {
    en: "Hi Kak Kenduri, I'd like to rent tables and chairs.",
    ms: 'Hi Kak Kenduri, saya nak tanya pasal sewa meja dan kerusi.',
    zh: '你好 Kak Kenduri，我想了解桌椅出租。',
  },
  colors: {
    cream: '#FFFEF8',
    cream50: '#FFF9C4',
    gold: '#FDD835',
    sage: '#F9A825',
    charcoal: '#111111',
    whatsapp: '#25D366',
  },
} as const

export type Locale = 'en' | 'ms' | 'zh'
