export const siteConfig = {
  brandName: 'Oxihome Malaysia',
  legalName: 'Ibnu Sina Care Sdn. Bhd.',
  tagline: 'Oxygen Machine Rental & Sales Malaysia',
  domain: 'oxihome-malaysia.utopiaai.my',
  url: 'https://oxihome-malaysia.utopiaai.my',
  productSlug: 'oxygen-machine',
  productName: 'Oxygen Machine',
  fallbackPhone: '60123456789',
  defaultLocale: 'en' as const,
  locales: ['en', 'ms', 'zh'] as const,
  whatsappMessages: {
    en: 'Hi Oxihome, I would like to rent an oxygen machine. Can you send me a quote?',
    ms: 'Hi Oxihome, saya berminat untuk sewa mesin oksigen. Boleh dapatkan sebut harga?',
    zh: '你好 Oxihome，我想租用氧气机。可以给我报价吗？',
  },
} as const;
