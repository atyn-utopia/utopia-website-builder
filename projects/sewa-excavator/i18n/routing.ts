import { defineRouting } from 'next-intl/routing';

export const locales = ['ms', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ms',
  localePrefix: 'always',
});
