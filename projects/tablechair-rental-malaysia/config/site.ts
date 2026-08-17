// `domain` is the canonical live host — Supabase rows for products, blog
// posts, phones, and company_websites are filtered on this exact string. Keep
// it in sync with `deploy-url.txt` and the `data-website` attribute in
// app/[locale]/layout.tsx — the checklist enforces this match.
export const siteConfig = {
  brandName: 'Kak Kenduri',
  legalName: 'Kak Kenduri Sdn. Bhd.',
  domain: 'tablechairrentals.my',
  url: 'https://tablechairrentals.my',
  // Pinned company_websites.id — a domain rename can never disconnect this site.
  siteId: 'be0bbd1e-1089-4791-9403-3d4031b042a3',
  productSlug: 'table-chair-rental',
  // Kak Kenduri's OWN WhatsApp number, matching the phone_numbers row for
  // tablechairrentals.my. It previously held 60174287801, which belongs to a
  // DIFFERENT site in the fleet (katilhospital) — a fallback pointing at
  // another client silently misroutes leads whenever the DB lookup misses.
  fallbackPhone: '60178799468',
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
