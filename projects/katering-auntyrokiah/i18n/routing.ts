import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ms', 'en', 'zh'],
  defaultLocale: 'ms',
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
