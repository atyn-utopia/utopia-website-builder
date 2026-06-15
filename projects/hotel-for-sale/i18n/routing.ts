import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // English-first brand (mirrors hotelforsale.my). Force every fresh visitor to
  // English regardless of browser Accept-Language; /en redirects to /.
  localeDetection: false,
});
