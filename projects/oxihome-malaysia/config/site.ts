export const siteConfig = {
  name: 'Oxihome Malaysia',
  brandName: 'Oxihome Malaysia',
  legalName: 'Ibnu Sina Care Sdn. Bhd.',
  domain: 'oksigen.com.my',
  siteUrl: 'https://oksigen.com.my',
  url: 'https://oksigen.com.my',
  // Pinned company_websites.id — a domain rename can never disconnect this site.
  siteId: '4f4358f6-9a94-4c1c-b02f-1687fa92ed8c',
  productSlug: 'oxygen-machine',
  // The client's own WhatsApp number. Must stay a REAL client number — a
  // placeholder here silently swallows leads if the DB lookup ever falls back.
  fallbackPhone: '60165770899',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  whatsappMessages: {
    en: 'Hi Oxihome, I would like to rent an oxygen machine.',
    ms: 'Hi Oxihome, saya berminat untuk sewa mesin oksigen.',
    zh: '你好 Oxihome，我想租用氧气机。',
  },
} as const
