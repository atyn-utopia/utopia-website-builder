import { headers } from 'next/headers'
import { supabase } from './supabase'
import { siteConfig } from '@/config/site'

const PRODUCT_SLUG = 'default'

/**
 * Fetch a random active phone number for a location from Supabase.
 * Uses the actual request host as the website identifier — no env vars needed.
 * Fallback chain: location-specific pool → 'all' pool → siteConfig.fallbackPhone
 * Never throws — always returns a valid phone string.
 */
export async function getPhoneNumber(locationSlug: string): Promise<string> {
  try {
    const host = (await headers()).get('host') ?? siteConfig.domain

    if (!supabase) return siteConfig.fallbackPhone

    const { data, error } = await supabase
      .from('phone_numbers')
      .select('phone_number, location_slug')
      .eq('website', host)
      .eq('product_slug', PRODUCT_SLUG)
      .eq('is_active', true)
      .in('location_slug', [locationSlug, 'all'])

    if (error) {
      console.error('Supabase phone number query error:', error.message)
      return siteConfig.fallbackPhone
    }

    if (!data || data.length === 0) return siteConfig.fallbackPhone

    const locationPool = data.filter(r => r.location_slug === locationSlug)
    const allPool = data.filter(r => r.location_slug === 'all')
    const pool = locationPool.length > 0 ? locationPool : allPool

    if (pool.length === 0) return siteConfig.fallbackPhone

    return pool[Math.floor(Math.random() * pool.length)].phone_number
  } catch {
    return siteConfig.fallbackPhone
  }
}

export function waLink(phone: string, message?: string): string {
  const encoded = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${encoded}`
}
