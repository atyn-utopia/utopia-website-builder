export const siteConfig = {
  // Stable company_websites.id — the live domain is resolved FROM this id, so a
  // webcore domain rename can never silently disconnect the site.
  siteId: 'f95e0778-15df-4d7f-ae06-cb9b2ab4150e',
  domain: 'katilhospitalmurah.com.my',
  siteUrl: 'https://katilhospitalmurah.com.my',
  brandName: 'Katil Hospital Murah',
  legalName: 'Ibnu Sina Care Sdn. Bhd.',
  tagline: 'Sewa & Jual Katil Hospital 24 Jam di Seluruh Malaysia',
  productSlug: 'katil-hospital',
  productName: 'Katil Hospital',
  fallbackPhone: '60174287801',
  fallbackWaTextMs:
    'Hi, saya berminat dengan perkhidmatan sewa / beli katil hospital dari Katil Hospital Murah. Boleh bantu?',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  palette: {
    primary: '#E11C1C',
    navy: '#2A5FB0',
    softSteel: '#8FB8E0',
    bg: '#FFFFFF',
    bgAlt: '#F6F8FB',
    text: '#0F172A',
    whatsapp: '#25D366',
    whatsappHover: '#1EBE57',
  },
};
