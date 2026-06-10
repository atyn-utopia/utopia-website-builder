import { defineRouting } from 'next-intl/routing';

export const locales = ['ms', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ms',
  localePrefix: 'as-needed',
  // Disable browser-Accept-Language autodetection so every visitor lands on
  // `/ms` first regardless of their browser locale (checklist item #1).
  localeDetection: false,
});
