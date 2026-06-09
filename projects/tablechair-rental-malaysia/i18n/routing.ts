import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ms', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // Force every visitor onto `/en` regardless of browser Accept-Language —
  // without this, a browser advertising zh-CN would bounce off the canonical
  // default.
  localeDetection: false,
})

export type AppLocale = (typeof routing.locales)[number]
