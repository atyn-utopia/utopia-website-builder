// Server-only. Never import from a client component.

import { createClient } from '@supabase/supabase-js'

const FALLBACK_PHONE = '60174287801'
const FALLBACK_WHATSAPP_TEXT =
  'Hi Kak Kenduri, saya nak tanya pasal sewa meja dan kerusi.'

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

export interface PhoneResult {
  phone: string
  whatsappText: string
}

type LeadsMode = 'single' | 'rotation' | 'location' | 'hybrid'

interface PhoneRow {
  phone_number: string
  whatsapp_text: string | null
  location_slug: string | null
  percentage: number | null
  label: string | null
}

function normaliseHost(host: string): string {
  return host.trim().toLowerCase().split(':')[0].replace(/\.$/, '')
}

function fallback(): PhoneResult {
  return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WHATSAPP_TEXT }
}

function pickWeighted(rows: PhoneRow[]): PhoneRow {
  const weights = rows.map((r) => Math.max(0, r.percentage ?? 0))
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return rows[0]
  let r = Math.random() * total
  for (let i = 0; i < rows.length; i++) {
    r -= weights[i]
    if (r <= 0) return rows[i]
  }
  return rows[rows.length - 1]
}

export async function getPhoneNumber(
  host: string,
  locationSlug?: string,
): Promise<PhoneResult> {
  if (!host) return fallback()
  const website = normaliseHost(host)

  try {
    const { data: siteRow, error: siteErr } = await supabase
      .from('company_websites')
      .select('leads_mode')
      .eq('domain', website)
      .maybeSingle()

    if (siteErr) return fallback()

    const leadsMode: LeadsMode =
      (siteRow?.leads_mode as LeadsMode | undefined) ?? 'single'

    const { data: rows, error: rowsErr } = await supabase
      .from('phone_numbers')
      .select('phone_number, whatsapp_text, location_slug, percentage, label')
      .eq('website', website)
      .eq('is_active', true)

    if (rowsErr || !rows || rows.length === 0) return fallback()

    const loc = (locationSlug ?? 'all').trim().toLowerCase()

    let candidates: PhoneRow[] = []
    switch (leadsMode) {
      case 'single': {
        const sorted = [...rows].sort((a, b) => {
          const aDef = a.label === 'default' ? 0 : 1
          const bDef = b.label === 'default' ? 0 : 1
          return aDef - bDef
        })
        candidates = sorted.slice(0, 1)
        break
      }
      case 'rotation': {
        candidates = rows
        break
      }
      case 'location': {
        const locRows = rows.filter((r) => r.location_slug === loc)
        candidates =
          locRows.length > 0
            ? locRows
            : rows.filter((r) => r.location_slug === 'all')
        break
      }
      case 'hybrid': {
        if (loc && loc !== 'all') {
          candidates = rows.filter((r) => r.location_slug === loc)
          if (candidates.length === 0) {
            candidates = rows.filter((r) => r.location_slug === 'all')
          }
        } else {
          candidates = rows.filter((r) => r.location_slug === 'all')
        }
        break
      }
    }

    if (candidates.length === 0) return fallback()

    const picked = pickWeighted(candidates)
    return {
      phone: picked.phone_number || FALLBACK_PHONE,
      whatsappText: picked.whatsapp_text || FALLBACK_WHATSAPP_TEXT,
    }
  } catch {
    return fallback()
  }
}
