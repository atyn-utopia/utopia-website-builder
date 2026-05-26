import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ms', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
})
