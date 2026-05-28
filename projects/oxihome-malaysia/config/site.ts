export const siteConfig = {
  name: 'Oxihome Malaysia',
  brandName: 'Oxihome Malaysia',
  legalName: 'Ibnu Sina Care Sdn. Bhd.',
  domain: 'oxihome-malaysia.utopiaai.my',
  siteUrl: 'https://oxihome-malaysia.utopiaai.my',
  url: 'https://oxihome-malaysia.utopiaai.my',
  productSlug: 'oxygen-machine',
  fallbackPhone: '60123456789',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  whatsappMessages: {
    en: 'Hi Oxihome, I would like to rent an oxygen machine.',
    ms: 'Hi Oxihome, saya berminat untuk sewa mesin oksigen.',
    zh: '你好 Oxihome，我想租用氧气机。',
  },
} as const
