import { createClient } from '@supabase/supabase-js'

const WEBSITE = 'sewa-motor-malaysia.vercel.app'
const FALLBACK_PHONE = '60174287801'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface PhoneRow {
  phone_number: string
  label: string | null
}

export interface PhoneResult {
  phones: string[]
  source: 'location' | 'product' | 'fallback'
}

export async function getPhoneNumbers(locationSlug: string): Promise<PhoneResult> {
  try {
    // 1. Try location-specific match
    const { data: locationPhones, error: locError } = await supabase
      .from('phone_numbers')
      .select('phone_number, label')
      .eq('website', WEBSITE)
      .eq('location_slug', locationSlug)
      .eq('is_active', true)

    if (!locError && locationPhones && locationPhones.length > 0) {
      return {
        phones: locationPhones.map((r: PhoneRow) => r.phone_number),
        source: 'location',
      }
    }

    // 2. Try website-wide default (location_slug = 'all')
    const { data: defaultPhones, error: defError } = await supabase
      .from('phone_numbers')
      .select('phone_number, label')
      .eq('website', WEBSITE)
      .eq('location_slug', 'all')
      .eq('is_active', true)

    if (!defError && defaultPhones && defaultPhones.length > 0) {
      return {
        phones: defaultPhones.map((r: PhoneRow) => r.phone_number),
        source: 'product',
      }
    }

    return { phones: [FALLBACK_PHONE], source: 'fallback' }
  } catch {
    return { phones: [FALLBACK_PHONE], source: 'fallback' }
  }
}

export function getRandomPhone(phones: string[]): string {
  if (!phones || phones.length === 0) return FALLBACK_PHONE
  return phones[Math.floor(Math.random() * phones.length)]
}

export async function getPhoneNumber(locationSlug: string): Promise<string> {
  const result = await getPhoneNumbers(locationSlug)
  return getRandomPhone(result.phones)
}
