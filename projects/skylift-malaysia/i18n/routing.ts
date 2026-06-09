// projects/skylift-malaysia/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  // Land every visitor on the default locale; never bounce off Accept-Language.
  localeDetection: false,
});
