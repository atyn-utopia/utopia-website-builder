const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''

export const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_KEY)

interface CountOpts {
  table: string
  filter: string
}

export async function countRows({ table, filter }: CountOpts): Promise<number | null> {
  if (!supabaseConfigured) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=id`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const range = res.headers.get('content-range') || ''
    const m = range.match(/\/(\d+|\*)$/)
    if (!m || m[1] === '*') return null
    return parseInt(m[1], 10)
  } catch {
    return null
  }
}

interface DomainCounts {
  companyWebsites: number | null
  phoneNumbers: number | null
  activeProducts: number | null
  publishedBlogPosts: number | null
  matchedAgainst: string[]
}

// Stores the in-flight promise — concurrent callers within the TTL share it
// instead of each firing their own Supabase fan-out.
const cache = new Map<string, { ts: number; promise: Promise<DomainCounts> }>()
const TTL = 60_000

function inFilter(field: string, candidates: string[]): string {
  // PostgREST `in.(a,b,c)` — values must be comma-separated, URL-encoded
  const list = candidates.map((c) => encodeURIComponent(c)).join(',')
  return `${field}=in.(${list})`
}

interface RestOpts {
  table: string
  filter: string
  select: string
}

async function selectRows<T = unknown>({ table, filter, select }: RestOpts): Promise<T[] | null> {
  if (!supabaseConfigured) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=${encodeURIComponent(select)}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as T[]
  } catch {
    return null
  }
}

export interface PhoneRow {
  phone_number: string
  label: string | null
  location_slug: string | null
  whatsapp_text: string | null
  percentage: number | null
  type: string | null
  is_active: boolean
}

export interface ProductRow {
  name: string
  slug: string
  description: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number | null
  is_active: boolean
  product_photos: { url: string }[]
}

export interface BlogRow {
  slug: string
  status: string
  cover_image_url: string | null
  blog_translations: { language: string; title: string | null }[]
}

export interface RegisteredDomain {
  domain: string
  leads_mode: string | null
  company_id: string | null
  companies?: { name: string | null } | null
}

export async function findRegisteredDomainsByPhone(phone: string): Promise<string[]> {
  if (!supabaseConfigured) return []
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/phone_numbers?phone_number=eq.${encodeURIComponent(phone)}&select=website`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    if (!res.ok) return []
    const rows = (await res.json()) as { website: string }[]
    return Array.from(new Set(rows.map((r) => r.website).filter(Boolean)))
  } catch {
    return []
  }
}

/**
 * Search `company_websites` for any domain matching a keyword substring.
 * Used to discover that e.g. `electric-wheelchair-malaysia` (folder slug)
 * is registered as `electricwheelchairmalaysia.com.my` (custom domain).
 */
export async function findRegisteredDomainsByKeyword(keyword: string): Promise<string[]> {
  if (!supabaseConfigured || keyword.length < 4) return []
  try {
    const enc = encodeURIComponent(`*${keyword}*`)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/company_websites?domain=ilike.${enc}&select=domain`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    if (!res.ok) return []
    const rows = (await res.json()) as { domain: string }[]
    return Array.from(new Set(rows.map((r) => r.domain).filter(Boolean)))
  } catch {
    return []
  }
}

export async function getRegisteredDomains(candidates: string[]): Promise<RegisteredDomain[] | null> {
  const dedup = Array.from(new Set(candidates)).filter(Boolean)
  if (dedup.length === 0) return []
  return selectRows<RegisteredDomain>({
    table: 'company_websites',
    filter: inFilter('domain', dedup),
    select: 'domain,leads_mode,company_id,companies(name)',
  })
}

export async function getPhoneRows(candidates: string[]): Promise<PhoneRow[] | null> {
  const dedup = Array.from(new Set(candidates)).filter(Boolean)
  if (dedup.length === 0) return []
  return selectRows<PhoneRow>({
    table: 'phone_numbers',
    filter: inFilter('website', dedup),
    select: 'phone_number,label,location_slug,whatsapp_text,percentage,type,is_active',
  })
}

export async function getProductRows(candidates: string[]): Promise<ProductRow[] | null> {
  const dedup = Array.from(new Set(candidates)).filter(Boolean)
  if (dedup.length === 0) return []
  return selectRows<ProductRow>({
    table: 'products',
    filter: `${inFilter('website', dedup)}&order=sort_order.asc`,
    select: 'name,slug,description,sale_price,rental_price,sort_order,is_active,product_photos(url)',
  })
}

export interface BlogContentRow {
  slug: string
  blog_translations: {
    language: string
    title: string | null
    content: string | null
    excerpt: string | null
    meta_title: string | null
    meta_description: string | null
  }[]
}

// Store the *promise* (not the resolved value) so concurrent callers within
// the same TTL window share one in-flight request. Without this, 10 parallel
// blog-content checks all fire their own Supabase request and the wizard
// table page pays ~8s of synchronised Supabase latency.
const blogContentCache = new Map<string, { ts: number; promise: Promise<BlogContentRow[] | null> }>()

export async function getBlogContentRows(candidates: string[]): Promise<BlogContentRow[] | null> {
  const dedup = Array.from(new Set(candidates)).filter(Boolean)
  if (dedup.length === 0) return []
  const key = dedup.slice().sort().join('|')
  const cached = blogContentCache.get(key)
  if (cached && Date.now() - cached.ts < TTL) return cached.promise
  const promise = selectRows<BlogContentRow>({
    table: 'blog_posts',
    filter: inFilter('website', dedup),
    select: 'slug,blog_translations(language,title,content,excerpt,meta_title,meta_description)',
  })
  blogContentCache.set(key, { ts: Date.now(), promise })
  return promise
}

export async function getBlogRows(candidates: string[]): Promise<BlogRow[] | null> {
  const dedup = Array.from(new Set(candidates)).filter(Boolean)
  if (dedup.length === 0) return []
  return selectRows<BlogRow>({
    table: 'blog_posts',
    filter: inFilter('website', dedup),
    select: 'slug,status,cover_image_url,blog_translations(language,title)',
  })
}

export async function getDomainCounts(candidates: string[]): Promise<DomainCounts> {
  const dedup = Array.from(new Set(candidates)).filter(Boolean)
  if (dedup.length === 0) {
    return { companyWebsites: null, phoneNumbers: null, activeProducts: null, publishedBlogPosts: null, matchedAgainst: [] }
  }

  const key = dedup.slice().sort().join('|')
  const cached = cache.get(key)
  if (cached && Date.now() - cached.ts < TTL) return cached.promise

  // Compose all 4 row counts into a single in-flight Promise. Concurrent
  // db-* checks share it instead of each firing a fresh fan-out.
  const promise = (async (): Promise<DomainCounts> => {
    const [cw, ph, pr, bl] = await Promise.all([
      countRows({ table: 'company_websites', filter: inFilter('domain', dedup) }),
      countRows({ table: 'phone_numbers', filter: `${inFilter('website', dedup)}&is_active=eq.true` }),
      countRows({ table: 'products', filter: `${inFilter('website', dedup)}&is_active=eq.true` }),
      countRows({ table: 'blog_posts', filter: `${inFilter('website', dedup)}&status=eq.published` }),
    ])
    return {
      companyWebsites: cw,
      phoneNumbers: ph,
      activeProducts: pr,
      publishedBlogPosts: bl,
      matchedAgainst: dedup,
    }
  })()
  cache.set(key, { ts: Date.now(), promise })
  return promise
}
