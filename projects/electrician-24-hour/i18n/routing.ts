import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  // Force every fresh visitor to the default locale regardless of browser
  // Accept-Language header. Without this, next-intl middleware would inspect
  // the visitor's preferred language and redirect them to /ms or /zh.
  localeDetection: false,
});
