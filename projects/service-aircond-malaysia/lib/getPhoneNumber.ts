import { headers } from 'next/headers'
import { supabase } from './supabase'

// ─── Constants ────────────────────────────────────────────────────────────────

const WEBSITE       = 'serviceaircond.my'
const PRODUCT_SLUG  = 'service-aircond'

/**
 * Hard fallback used when Supabase is unreachable or returns no rows.
 * Override via PHONE_FALLBACK env var so ops can change it without a redeploy.
 */
const FALLBACK_PHONE =
  process.env.PHONE_FALLBACK ?? '60123456799'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhoneRow {
  phone_number: string
  location_slug: string
}

export interface PhoneResult {
  phone:  string
  source: 'location' | 'global-pool' | 'env-fallback'
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

/**
 * Pick one entry at random from an array.
 * Returns undefined on empty input — caller handles the fallback.
 */
function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Resolve the effective website identifier from the request host header.
 * Falls back to the hardcoded constant so this works in tests / local dev
 * where there is no live HTTP request.
 */
async function resolveWebsite(): Promise<string> {
  try {
    const host = (await headers()).get('host')
    return host ?? WEBSITE
  } catch {
    return WEBSITE
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetch a random active WhatsApp number for a given location.
 *
 * Fallback chain:
 *   1. Location-specific pool  (location_slug = locationSlug)
 *   2. Global site pool        (location_slug = 'all')
 *   3. PHONE_FALLBACK env var  (or hardcoded constant)
 *
 * This function never throws — it always returns a valid phone string.
 *
 * @param locationSlug  e.g. 'kuala-lumpur'
 */
export async function getPhoneNumber(locationSlug: string): Promise<PhoneResult> {
  try {
    if (!supabase) {
      return { phone: FALLBACK_PHONE, source: 'env-fallback' }
    }

    const website = await resolveWebsite()

    // Single query: fetch both location-specific and global-pool rows together.
    // This is one round-trip instead of two sequential queries.
    const { data, error } = await supabase
      .from('phone_numbers')
      .select('phone_number, location_slug')
      .eq('website',      website)
      .eq('product_slug', PRODUCT_SLUG)
      .eq('is_active',    true)
      .in('location_slug', [locationSlug, 'all'])

    if (error) {
      console.error('[getPhoneNumber] Supabase error:', error.message)
      return { phone: FALLBACK_PHONE, source: 'env-fallback' }
    }

    if (!data || data.length === 0) {
      return { phone: FALLBACK_PHONE, source: 'env-fallback' }
    }

    const rows = data as PhoneRow[]

    // Prefer location-specific pool; fall back to global pool.
    const locationPool = rows.filter(r => r.location_slug === locationSlug)
    const globalPool   = rows.filter(r => r.location_slug === 'all')

    const fromLocation = pickRandom(locationPool)
    if (fromLocation) {
      return { phone: fromLocation.phone_number, source: 'location' }
    }

    const fromGlobal = pickRandom(globalPool)
    if (fromGlobal) {
      return { phone: fromGlobal.phone_number, source: 'global-pool' }
    }

    return { phone: FALLBACK_PHONE, source: 'env-fallback' }
  } catch (err) {
    console.error('[getPhoneNumber] Unexpected error:', err)
    return { phone: FALLBACK_PHONE, source: 'env-fallback' }
  }
}

// ─── WhatsApp URL builder ─────────────────────────────────────────────────────

/**
 * Build a wa.me deep-link.
 *
 * @param phone    E.164 without '+', e.g. '60123456789'
 * @param message  Optional pre-filled message text (will be URI-encoded)
 */
export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${query}`
}

/**
 * Convenience: fetch a random number and immediately return a wa.me link.
 *
 * @param locationSlug  e.g. 'kuala-lumpur'
 * @param message       Optional pre-filled WhatsApp message
 */
export async function getWhatsAppLink(
  locationSlug: string,
  message?: string
): Promise<string> {
  const { phone } = await getPhoneNumber(locationSlug)
  return waLink(phone, message)
}
