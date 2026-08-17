// `domain` is the canonical live host — Supabase rows for products, blog posts,
// phones, and company_websites are filtered on this exact string. Keep it in
// sync with `deploy-url.txt` and the `data-website` attribute rendered in
// app/[locale]/layout.tsx (which binds to siteConfig.domain, so it can't drift).
export const siteConfig = {
  // Pinned company_websites.id. The live domain is resolved FROM this id, so a
  // webcore domain rename can never silently disconnect the site.
  // Do NOT point this at katilhospital.com.my (2ec463cc-…): that is a separate,
  // separately-built site that happens to share the brand name.
  siteId: '0a4253e2-c6b9-4c74-a319-d457d6f77b4f',
  domain: 'sewakatilhospital.my',
  url: 'https://sewakatilhospital.my',
  siteUrl: 'https://sewakatilhospital.my',
  brandName: 'Ibnu Sina Care',
  legalName: 'Ibnu Sina Care Sdn. Bhd.',
  tagline: 'Sewa & Beli Katil Hospital Malaysia',
  productSlug: 'katil-hospital',
  productName: 'Katil Hospital',
  // Ibnu Sina Care's own WhatsApp line, as published on the static page this
  // site was ported from. Only used when Supabase is unreachable — the redirect
  // page resolves the live number server-side on every request.
  fallbackPhone: '60146869468',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  whatsappMessages: {
    ms: 'Salam, saya berminat dengan katil hospital Ibnu Sina Care. Boleh bagi info lanjut?',
    en: 'Hi, I am interested in a hospital bed from Ibnu Sina Care. Could you share more details?',
    zh: '你好，我想了解 Ibnu Sina Care 的医疗病床。可以提供更多资料吗？',
  },
  // Brand palette lifted verbatim from the original static landing page so the
  // rebuild is a pixel port, not a redesign.
  colors: {
    brand: '#0f766e',
    brandDark: '#115e59',
    brandDeep: '#134e4a',
    brandLight: '#14b8a6',
    accent: '#d97706',
    accentLight: '#f59e0b',
    waGreen: '#25D366',
    waGreenHover: '#1da851',
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
