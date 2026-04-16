import { site } from '@/config/site'

/**
 * Build a WhatsApp redirect URL for a given locale + optional location slug + message.
 * All WhatsApp buttons in the UI must go through this so the redirect page controls
 * the actual phone number (from Supabase).
 */
export function waRedirect(
  locale: string,
  locationSlug?: string,
  message?: string,
): string {
  const params = new URLSearchParams()
  if (locationSlug) params.set('loc', locationSlug)
  if (message) params.set('message', message)
  const q = params.toString()
  return `/${locale}/redirect-whatsapp-1${q ? `?${q}` : ''}`
}

export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Year for © footer */
export function currentYear(): number {
  return new Date().getFullYear()
}

/** Stable placeholder image that works offline — used only as a last-resort src */
export { site }
