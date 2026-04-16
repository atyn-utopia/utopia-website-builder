import { headers } from 'next/headers'
import { supabase } from './supabase'

const WEBSITE = 'cat-rumah-malaysia.vercel.app'
const FALLBACK_PHONE = process.env.PHONE_FALLBACK ?? '60174287801'
const FALLBACK_WHATSAPP_TEXT =
  'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?'

interface PhoneRow {
  phone_number: string
  location_slug: string
  whatsapp_text: string | null
  percentage: number | null
}

export interface PhoneResult {
  phone: string
  whatsappText: string
  source: 'location' | 'global-pool' | 'env-fallback'
}

function pickWeighted<T extends { percentage: number | null }>(
  arr: T[],
): T | undefined {
  if (arr.length === 0) return undefined
  const total = arr.reduce((s, r) => s + (r.percentage ?? 0), 0)
  if (total <= 0) return arr[Math.floor(Math.random() * arr.length)]
  let roll = Math.random() * total
  for (const row of arr) {
    roll -= row.percentage ?? 0
    if (roll <= 0) return row
  }
  return arr[arr.length - 1]
}

async function resolveWebsite(): Promise<string> {
  try {
    const host = (await headers()).get('host')
    return host ?? WEBSITE
  } catch {
    return WEBSITE
  }
}

export async function getPhoneNumber(
  locationSlug: string = 'all',
): Promise<PhoneResult> {
  try {
    if (!supabase) {
      return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WHATSAPP_TEXT, source: 'env-fallback' }
    }

    const website = await resolveWebsite()

    const { data, error } = await supabase
      .from('phone_numbers')
      .select('phone_number, location_slug, whatsapp_text, percentage')
      .eq('website', website)
      .eq('is_active', true)
      .in('location_slug', [locationSlug, 'all'])

    if (error || !data || data.length === 0) {
      return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WHATSAPP_TEXT, source: 'env-fallback' }
    }

    const rows = data as PhoneRow[]
    const locationPool = rows.filter(r => r.location_slug === locationSlug)
    const globalPool = rows.filter(r => r.location_slug === 'all')

    const fromLocation = pickWeighted(locationPool)
    if (fromLocation) {
      return {
        phone: fromLocation.phone_number,
        whatsappText: fromLocation.whatsapp_text ?? FALLBACK_WHATSAPP_TEXT,
        source: 'location',
      }
    }
    const fromGlobal = pickWeighted(globalPool)
    if (fromGlobal) {
      return {
        phone: fromGlobal.phone_number,
        whatsappText: fromGlobal.whatsapp_text ?? FALLBACK_WHATSAPP_TEXT,
        source: 'global-pool',
      }
    }
    return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WHATSAPP_TEXT, source: 'env-fallback' }
  } catch (err) {
    console.error('[getPhoneNumber] error:', err)
    return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WHATSAPP_TEXT, source: 'env-fallback' }
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${query}`
}
