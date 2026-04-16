import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base }
  for (const key in override) {
    const o = override[key]
    const b = base[key]
    if (
      typeof o === 'object' && o !== null && !Array.isArray(o) &&
      typeof b === 'object' && b !== null && !Array.isArray(b)
    ) {
      result[key] = deepMerge(
        b as Record<string, unknown>,
        o as Record<string, unknown>
      )
    } else {
      result[key] = o
    }
  }
  return result
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }

  const fallback = (await import('../messages/ms.json')).default as Record<string, unknown>
  let messages: Record<string, unknown> = fallback
  if (locale !== 'ms') {
    try {
      const localeMessages = (await import(`../messages/${locale}.json`)).default as Record<string, unknown>
      messages = deepMerge(fallback, localeMessages)
    } catch {
      messages = fallback
    }
  }

  return { locale, messages }
})
