// Unified data layer for products, phone numbers, and blog posts.
// Every read goes through fetch() against the Supabase REST API with a
// next.tags entry, so revalidateTag('webcore-products' | 'webcore-phones' |
// 'webcore-blog') invalidates the cache on demand without redeploys.

import { headers } from 'next/headers'
import { siteConfig } from '@/config/site'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    '[webcore] Missing SUPABASE_URL / SUPABASE_ANON_KEY. Fallback values will be used.',
  )
}

export type WebcoreTag = 'webcore-products' | 'webcore-phones' | 'webcore-blog'

async function webcoreFetch<T>(path: string, tag: WebcoreTag): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
        'Accept-Profile': 'webcore',
      },
      next: { tags: [tag] },
    })
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error(`[webcore] ${tag} ${res.status} ${res.statusText} :: ${path}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[webcore] ${tag} fetch error:`, err)
    return null
  }
}

/* ============================================================
 * Products
 * ============================================================ */

export interface ProductPhoto {
  url: string
}

export interface ProductRow {
  id: string
  name: string
  slug: string
  description: string | null
  rental_price: number | null
  sale_price: number | null
  sort_order: number | null
  product_photos: ProductPhoto[]
}

const FALLBACK_PRODUCTS: ProductRow[] = [
  {
    id: 'fb-cold-room',
    name: 'Cold Room Rental',
    slug: 'cold-room-rental',
    description:
      'Refrigerated cold room rental for frozen, freezer, chiller and cool storage. HALAL fleet, same-day delivery, full Peninsular Malaysia coverage.',
    rental_price: 5,
    sale_price: null,
    sort_order: 1,
    product_photos: [],
  },
]

export async function getProducts(): Promise<ProductRow[]> {
  const path =
    `products?select=id,name,slug,description,rental_price,sale_price,sort_order,product_photos(url)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`

  const rows = await webcoreFetch<ProductRow[]>(path, 'webcore-products')
  if (!rows || rows.length === 0) return FALLBACK_PRODUCTS
  return rows
}

/* ============================================================
 * Phone numbers / leads routing
 * ============================================================ */

const FALLBACK_PHONE = siteConfig.fallbackPhone
const FALLBACK_WA_TEXT =
  'Hi, saya berminat dengan Cold Room Rental. Boleh saya dapatkan info lanjut?'

type LeadsMode = 'single' | 'rotation' | 'location' | 'hybrid'

interface PhoneRow {
  phone_number: string
  whatsapp_text: string | null
  percentage: number | null
  label: string | null
  location_slug: string | null
}

export interface PhoneResult {
  phone: string
  whatsappText: string
  source: 'database' | 'fallback'
  mode: LeadsMode | 'fallback'
}

function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined
  if (rows.length === 1) return rows[0]
  const total = rows.reduce((sum, r) => sum + (r.percentage || 1), 0)
  let roll = Math.random() * total
  for (const row of rows) {
    roll -= row.percentage || 1
    if (roll <= 0) return row
  }
  return rows[rows.length - 1]
}

function findDefaultRow(rows: PhoneRow[]): PhoneRow | undefined {
  return rows.find((r) => r.label === 'default')
}

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers()
    const host = h.get('host') || h.get('x-forwarded-host') || ''
    return host.replace(/:\d+$/, '').replace(/^www\./, '')
  } catch {
    return ''
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  if (!domain) return 'single'
  const path =
    `company_websites?select=leads_mode` +
    `&domain=eq.${encodeURIComponent(domain)}` +
    `&limit=1`
  const data = await webcoreFetch<{ leads_mode: LeadsMode | null }[]>(path, 'webcore-phones')
  return data?.[0]?.leads_mode ?? 'single'
}

async function getPhoneRows(domain: string): Promise<PhoneRow[]> {
  if (!domain) return []
  const path =
    `phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug` +
    `&website=eq.${encodeURIComponent(domain)}` +
    `&is_active=eq.true`
  const data = await webcoreFetch<PhoneRow[]>(path, 'webcore-phones')
  return data ?? []
}

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: 'fallback',
    mode: 'fallback',
  }
}

function toResult(row: PhoneRow | undefined, mode: LeadsMode, host: string): PhoneResult {
  if (!row) return fallbackResult()
  const text = row.whatsapp_text || FALLBACK_WA_TEXT
  return {
    phone: row.phone_number,
    whatsappText: `Hi ${host}, ${text}`,
    source: 'database',
    mode,
  }
}

export async function getPhoneNumber(locationSlug?: string): Promise<PhoneResult> {
  try {
    const host = await getHostDomain()
    // phone_numbers / company_websites rows are keyed by the project's canonical
    // website id (siteConfig.domain). When the site is served from a different
    // host (staging, preview, or an aliased domain), the host lookup misses — so
    // fall back to siteConfig.domain instead of returning the hardcoded number.
    let domain = host
    let rows = await getPhoneRows(domain)
    if (rows.length === 0 && siteConfig.domain && siteConfig.domain !== host) {
      domain = siteConfig.domain
      rows = await getPhoneRows(domain)
    }
    if (rows.length === 0) return fallbackResult()
    const mode = await getLeadsMode(domain)

    const defaultRow = findDefaultRow(rows)

    switch (mode) {
      case 'single':
        return toResult(defaultRow ?? rows[0], mode, domain)

      case 'rotation':
        return toResult(pickWeighted(rows), mode, domain)

      case 'location': {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain)
        }
        return toResult(defaultRow, mode, domain)
      }

      case 'hybrid': {
        if (locationSlug && locationSlug !== 'all') {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain)
        }
        return toResult(defaultRow, mode, domain)
      }

      default:
        return toResult(defaultRow, mode, domain)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[getPhoneNumber] Unexpected error:', err)
    return fallbackResult()
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${query}`
}

export async function getWhatsAppLink(
  locationSlug?: string,
  messageOverride?: string,
): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug)
  return waLink(phone, messageOverride || whatsappText)
}

/* ============================================================
 * Blog
 * ============================================================ */

export interface BlogPost {
  id: string
  slug: string
  cover_image_url: string
  published_at: string
  title: string
  content: string
  excerpt: string
  meta_title: string
  meta_description: string
}

interface BlogRowRaw {
  id: string
  slug: string
  cover_image_url: string | null
  published_at: string | null
  created_at: string | null
  blog_translations:
    | {
        title: string | null
        content: string | null
        excerpt: string | null
        meta_title: string | null
        meta_description: string | null
      }[]
    | {
        title: string | null
        content: string | null
        excerpt: string | null
        meta_title: string | null
        meta_description: string | null
      }
    | null
}

function flattenBlogRow(row: BlogRowRaw): BlogPost {
  const t = Array.isArray(row.blog_translations)
    ? row.blog_translations[0]
    : row.blog_translations
  return {
    id: row.id,
    slug: row.slug,
    cover_image_url: row.cover_image_url ?? '',
    published_at: row.published_at || row.created_at || '',
    title: t?.title || '',
    content: t?.content || '',
    excerpt: t?.excerpt || '',
    meta_title: t?.meta_title || '',
    meta_description: t?.meta_description || '',
  }
}

export async function getBlogPosts(language: string = 'en'): Promise<BlogPost[]> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,created_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(language)}` +
    `&order=created_at.desc`

  const rows = await webcoreFetch<BlogRowRaw[]>(path, 'webcore-blog')
  if (!rows) return []
  return rows.map(flattenBlogRow)
}

export async function getBlogPostBySlug(
  slug: string,
  language: string = 'en',
): Promise<BlogPost | null> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,created_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&slug=eq.${encodeURIComponent(slug)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(language)}` +
    `&limit=1`

  const rows = await webcoreFetch<BlogRowRaw[]>(path, 'webcore-blog')
  if (!rows || rows.length === 0) return null
  return flattenBlogRow(rows[0])
}
