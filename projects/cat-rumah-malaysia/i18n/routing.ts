import { defineRouting } from 'next-intl/routing'

export const locales = ['ms', 'en', 'zh'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'ms',
  // Force the locale prefix on every URL so `/` always redirects to
  // `/<defaultLocale>` instead of serving locale-detected content.
  localePrefix: 'as-needed',
  // Disable browser-language autodetection so a visitor whose browser
  // advertises a different language doesn't bounce off the canonical default.
  localeDetection: false,
})
