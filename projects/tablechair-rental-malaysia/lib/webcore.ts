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

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number
  is_active: boolean
  parent_id: string | null
  photos: { url: string }[]
}

type ProductRow = Omit<Product, 'photos'> & { product_photos: { url: string }[] | null }

export async function getProducts(): Promise<{ core: Product[]; additional: Product[] }> {
  const path =
    `products?select=*,product_photos(url)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`

  const rows = await webcoreFetch<ProductRow[]>(path, 'webcore-products')
  if (!rows) return { core: [], additional: [] }

  const products: Product[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    sale_price: p.sale_price,
    rental_price: p.rental_price,
    sort_order: p.sort_order,
    is_active: p.is_active,
    parent_id: p.parent_id,
    photos: p.product_photos ?? [],
  }))

  return {
    core: products.filter((p) => p.rental_price !== null),
    additional: products.filter((p) => p.rental_price === null),
  }
}

/* ============================================================
 * Phone numbers / leads routing
 * ============================================================ */

const FALLBACK_PHONE = siteConfig.fallbackPhone
const FALLBACK_WA_TEXT = siteConfig.whatsappMessages.ms

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
    return host.replace(/:\d+$/, '')
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
    const domain = await getHostDomain()
    const [mode, rows] = await Promise.all([getLeadsMode(domain), getPhoneRows(domain)])
    if (rows.length === 0) return fallbackResult()

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

export interface BlogPostSummary {
  id: string
  slug: string
  cover_image_url: string | null
  published_at: string
  blog_translations: { title: string; excerpt: string }[]
}

export interface BlogPost {
  id: string
  slug: string
  cover_image_url: string | null
  published_at: string
  blog_translations: {
    title: string
    content: string
    excerpt: string
    meta_title: string
    meta_description: string
  }[]
}

export interface RecentBlogPost {
  slug: string
  published_at: string
  blog_translations: { title: string }[]
}

export async function getBlogPosts(locale: string): Promise<BlogPostSummary[]> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,excerpt)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&order=published_at.desc`
  const data = await webcoreFetch<BlogPostSummary[]>(path, 'webcore-blog')
  return data ?? []
}

export async function getBlogPost(slug: string, locale: string): Promise<BlogPost | null> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&slug=eq.${encodeURIComponent(slug)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&limit=1`
  const data = await webcoreFetch<BlogPost[]>(path, 'webcore-blog')
  return data?.[0] ?? null
}

export async function getRecentBlogPosts(
  locale: string,
  exceptSlug: string,
  limit = 3,
): Promise<RecentBlogPost[]> {
  const path =
    `blog_posts?select=slug,published_at,blog_translations!inner(title)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&slug=neq.${encodeURIComponent(exceptSlug)}` +
    `&order=published_at.desc` +
    `&limit=${limit}`
  const data = await webcoreFetch<RecentBlogPost[]>(path, 'webcore-blog')
  return data ?? []
}

export async function getBlogPostSlugs(): Promise<{ slug: string }[]> {
  const path =
    `blog_posts?select=slug` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published`
  const data = await webcoreFetch<{ slug: string }[]>(path, 'webcore-blog')
  return data ?? []
}
