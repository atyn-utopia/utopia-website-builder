const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'oxihome-malaysia.utopiaai.my'

export const siteConfig = {
  name: 'Oxihome Malaysia',
  brandName: 'Oxihome Malaysia',
  legalName: 'Ibnu Sina Care Sdn. Bhd.',
  domain,
  siteUrl: `https://${domain}`,
  url: `https://${domain}`,
  productSlug: 'oxygen-machine',
  fallbackPhone: '60123456789',
  defaultWhatsApp: 'https://wa.me/60123456789',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  whatsappMessages: {
    en: 'Hi Oxihome, I would like to rent an oxygen machine.',
    ms: 'Hi Oxihome, saya berminat untuk sewa mesin oksigen.',
    zh: '你好 Oxihome，我想租用氧气机。',
  },
} as const
