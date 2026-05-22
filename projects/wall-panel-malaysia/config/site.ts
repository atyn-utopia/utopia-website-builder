export const siteConfig = {
  brandName: 'Wall Panel Malaysia',
  legalName: 'Encik Beku Aircond Sdn. Bhd.',
  domain: 'wall-panel-malaysia.vercel.app',
  url: 'https://wall-panel-malaysia.vercel.app',
  productSlug: 'wall-panel',
  fallbackPhone: '601116655300',
  email: 'hello@wall-panel-malaysia.my',
  phoneDisplay: '+60 11-1665 5300',
  address: 'Kuala Lumpur, Malaysia',
  ssm: '—',
  priceRange: 'RM25 - RM38',
  whatsappMessages: {
    en: 'Hi Wall Panel Malaysia, I want to install wall panels.',
    ms: 'Hi Wall Panel Malaysia, saya nak pasang panel dinding.',
    zh: '你好 Wall Panel Malaysia，我想安装墙板。',
  },
  colors: {
    navy: '#13204C',
    navyDeep: '#0B153A',
    sand: '#F5EFE6',
    cream: '#FBF7EF',
    gold: '#C8A45C',
    goldDeep: '#A8853F',
    ink: '#0E172E',
    whatsapp: '#25D366',
  },
} as const

export type Locale = 'en' | 'ms' | 'zh'
