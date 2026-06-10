// Unified data layer for products / phone numbers / blog posts.
// Every read goes through fetch() against the Supabase REST API with a
// next.tags entry, so revalidateTag('webcore-…') invalidates the cache
// on demand without redeploys.

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
 * Phone numbers / leads routing
 * ============================================================ */

const FALLBACK_PHONE = siteConfig.fallbackPhone
const FALLBACK_WA_TEXT = siteConfig.whatsappMessages.en

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

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers()
    const host = h.get('host') || h.get('x-forwarded-host') || ''
    return host.replace(/:\d+$/, '')
  } catch {
    return ''
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  if (!domain) return 'single'
  const rows = await webcoreFetch<{ leads_mode: LeadsMode }[]>(
    `company_websites?select=leads_mode&domain=eq.${encodeURIComponent(domain)}&limit=1`,
    'webcore-phones',
  )
  return rows?.[0]?.leads_mode ?? 'single'
}

async function getPhoneRows(domain: string): Promise<PhoneRow[]> {
  if (!domain) return []
  const rows = await webcoreFetch<PhoneRow[]>(
    `phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug` +
      `&website=eq.${encodeURIComponent(domain)}` +
      `&is_active=eq.true`,
    'webcore-phones',
  )
  return rows ?? []
}

function toResult(row: PhoneRow | undefined, mode: LeadsMode, _domain: string): PhoneResult {
  if (!row) return fallbackResult()
  return {
    phone: row.phone_number,
    whatsappText: row.whatsapp_text || FALLBACK_WA_TEXT,
    source: 'database',
    mode,
  }
}

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: 'fallback',
    mode: 'fallback',
  }
}

export async function getPhoneNumber(locationSlug?: string): Promise<PhoneResult> {
  try {
    const domain = await getHostDomain()
    const [mode, rows] = await Promise.all([getLeadsMode(domain), getPhoneRows(domain)])
    if (rows.length === 0) return fallbackResult()

    const defaultRow = rows.find((r) => r.location_slug === 'all') ?? rows[0]

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
 * Products
 * ============================================================ */

export interface ProductPhoto {
  url: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  sale_price: number | null
  rental_price: number | null
  sort_order: number
  photos: ProductPhoto[]
}

interface ProductRow {
  id: string
  name: string
  slug: string
  description: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number | null
  product_photos: { url: string }[] | null
}

export async function getProducts(): Promise<Product[]> {
  const path =
    `products?select=id,name,slug,description,sale_price,rental_price,sort_order,product_photos(url)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`

  const data = await webcoreFetch<ProductRow[]>(path, 'webcore-products')
  if (!data) return []
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    sale_price: row.sale_price,
    rental_price: row.rental_price,
    sort_order: row.sort_order ?? 0,
    photos: Array.isArray(row.product_photos) ? row.product_photos : [],
  }))
}

/* ============================================================
 * Blog posts
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

interface BlogPostRow {
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
    | null
}

function flattenBlogRow(row: BlogPostRow): BlogPost {
  const translations = Array.isArray(row.blog_translations) ? row.blog_translations : []
  const t = translations[0] ?? { title: '', content: '', excerpt: '', meta_title: '', meta_description: '' }
  return {
    id: row.id,
    slug: row.slug,
    cover_image_url: row.cover_image_url ?? '',
    published_at: row.published_at || row.created_at || '',
    title: t.title || '',
    content: t.content || '',
    excerpt: t.excerpt || '',
    meta_title: t.meta_title || '',
    meta_description: t.meta_description || '',
  }
}

export async function getBlogPosts(language: string = 'en'): Promise<BlogPost[]> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,created_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(language)}` +
    `&order=created_at.desc`
  const data = await webcoreFetch<BlogPostRow[]>(path, 'webcore-blog')
  if (!data) return []
  return data.map(flattenBlogRow)
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
  const data = await webcoreFetch<BlogPostRow[]>(path, 'webcore-blog')
  if (!data || data.length === 0) return null
  return flattenBlogRow(data[0])
}
