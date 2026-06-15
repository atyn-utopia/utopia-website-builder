import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ms', 'zh'],
  defaultLocale: 'ms',
  // With `as-needed`, the default locale (ms) is served at `/` with no prefix,
  // while `/en` and `/zh` keep their prefixes.
  localePrefix: 'as-needed',
  // Disable browser-language autodetection so a visitor whose browser
  // advertises e.g. zh-CN doesn't bounce off the canonical Malay default.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
