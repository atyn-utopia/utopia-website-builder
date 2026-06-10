import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // Disable browser-Accept-Language autodetection so every visitor lands on
  // `/en` first regardless of their browser locale.
  localeDetection: false,
});
