import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ms',
  localePrefix: 'as-needed',
  // Pin every fresh visitor to the unprefixed Malay site regardless of
  // browser Accept-Language.
  localeDetection: false,
});
