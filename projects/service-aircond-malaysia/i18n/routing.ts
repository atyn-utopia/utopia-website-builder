import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ms', 'zh'],
  defaultLocale: 'en',
  // Force the locale prefix on every URL so `/` always redirects to
  // `/<defaultLocale>` instead of serving locale-detected content.
  localePrefix: 'always',
  // Disable browser-language autodetection so a visitor whose browser
  // advertises e.g. zh-CN doesn't bounce off the canonical English default.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
