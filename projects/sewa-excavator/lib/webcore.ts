// Unified data layer for products, phone numbers, and blog posts.
// Every read goes through fetch() against the Supabase REST API with a
// next.tags entry, so revalidateTag('webcore-products' | 'webcore-phones' |
// 'webcore-blog') invalidates the cache on demand without redeploys.

import { headers } from 'next/headers';
import { siteConfig } from '@/config/site';

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export type WebcoreTag = 'webcore-products' | 'webcore-phones' | 'webcore-blog';

// 6s hard timeout per Supabase request. Without this the default undici
// headers timeout is 5 minutes, which on a slow link between Vercel iad1
// build machines and Supabase's Cloudflare-KUL edge can hang `next build`
// for the full 5min before failing — and the same hang shows up at runtime
// on the WhatsApp redirect page, blowing past the wizard's liveness probe.
// Failing fast lets the caller use its built-in fallback (config phone for
// phones, [] for products/blog) so the page still renders.
const WEBCORE_FETCH_TIMEOUT_MS = 6000;

async function webcoreFetch<T>(path: string, tag: WebcoreTag): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  // Cache the response and tag it so webcore's /api/revalidate ping
  // (revalidateTag) purges it within seconds — no redeploy needed.
  // IMPORTANT: do NOT pass an AbortSignal here. A `signal` opts the response
  // out of Next's Data Cache, which silently breaks tag-based revalidation on
  // statically generated pages (revalidateTag would have nothing to purge).
  // The hard timeout is enforced with Promise.race instead, so a slow Supabase
  // edge can't hang `next build` while the response stays cacheable + taggable.
  const request = fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json',
      'Accept-Profile': 'webcore',
    },
    cache: 'force-cache',
    next: { tags: [tag] },
  }).catch((err) => {
    console.error(`[webcore] ${tag} fetch error:`, err);
    return null;
  });

  const res = await Promise.race([
    request,
    new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), WEBCORE_FETCH_TIMEOUT_MS),
    ),
  ]);

  if (!res) {
    console.error(`[webcore] ${tag} unavailable (timeout/error) :: ${path}`);
    return null;
  }
  if (!res.ok) {
    console.error(`[webcore] ${tag} ${res.status} ${res.statusText} :: ${path}`);
    return null;
  }
  try {
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[webcore] ${tag} parse error:`, err);
    return null;
  }
}

/* Products */

// An ordered, labeled price line for products with multiple/custom rates.
export interface PriceLine {
  label: string;
  amount: number;
  unit?: string;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sale_price: number | null;
  rental_price: number | null;
  sort_order: number;
  is_active: boolean;
  parent_id: string | null;
  photos: { url: string }[];
  prices: PriceLine[];
}

type ProductRow = Omit<Product, 'photos' | 'prices'> & {
  product_photos: { url: string }[] | null;
  prices: PriceLine[] | null;
};

export async function getProducts(): Promise<{ core: Product[]; additional: Product[] }> {
  const path =
    `products?select=*,product_photos(url)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`;

  const rows = await webcoreFetch<ProductRow[]>(path, 'webcore-products');
  if (!rows) return { core: [], additional: [] };

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
    prices: p.prices ?? [],
  }));

  return {
    core: products.filter((p) => p.rental_price !== null),
    additional: products.filter((p) => p.rental_price === null),
  };
}

/* Phone numbers */

const FALLBACK_PHONE = siteConfig.fallbackPhone;
const FALLBACK_WA_TEXT = siteConfig.whatsappMessages.ms;

type LeadsMode = 'single' | 'rotation' | 'location' | 'hybrid';

interface PhoneRow {
  phone_number: string;
  whatsapp_text: string | null;
  percentage: number | null;
  label: string | null;
  location_slug: string | null;
  page_slug: string | null;
}

// A row is "site-wide" when it isn't pinned to a specific page. Rows that
// predate the page_slug column (null) are treated as site-wide too.
function isSiteWide(row: PhoneRow): boolean {
  return !row.page_slug || row.page_slug === 'all';
}

export interface PhoneResult {
  phone: string;
  whatsappText: string;
  source: 'database' | 'fallback';
  mode: LeadsMode | 'fallback';
}

function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined;
  if (rows.length === 1) return rows[0];
  const total = rows.reduce((sum, r) => sum + (r.percentage || 1), 0);
  let roll = Math.random() * total;
  for (const row of rows) {
    roll -= row.percentage || 1;
    if (roll <= 0) return row;
  }
  return rows[rows.length - 1];
}

function findDefaultRow(rows: PhoneRow[]): PhoneRow | undefined {
  return rows.find((r) => r.label === 'default');
}

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get('host') || h.get('x-forwarded-host') || '';
    return host.replace(/:\d+$/, '').replace(/^www\./, '');
  } catch {
    return '';
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  if (!domain) return 'single';
  const path =
    `company_websites?select=leads_mode` +
    `&domain=eq.${encodeURIComponent(domain)}` +
    `&limit=1`;
  const data = await webcoreFetch<{ leads_mode: LeadsMode | null }[]>(path, 'webcore-phones');
  return data?.[0]?.leads_mode ?? 'single';
}

async function getPhoneRows(domain: string): Promise<PhoneRow[]> {
  if (!domain) return [];
  const path =
    `phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug,page_slug` +
    `&website=eq.${encodeURIComponent(domain)}` +
    `&is_active=eq.true`;
  const data = await webcoreFetch<PhoneRow[]>(path, 'webcore-phones');
  return data ?? [];
}

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: 'fallback',
    mode: 'fallback',
  };
}

function toResult(row: PhoneRow | undefined, mode: LeadsMode, host: string): PhoneResult {
  if (!row) return fallbackResult();
  const text = row.whatsapp_text || FALLBACK_WA_TEXT;
  return {
    phone: row.phone_number,
    whatsappText: `Hi ${host}, ${text}`,
    source: 'database',
    mode,
  };
}

export async function getPhoneNumber(
  locationSlug?: string,
  pageSlug?: string,
): Promise<PhoneResult> {
  try {
    const domain = await getHostDomain();
    const [mode, allRows] = await Promise.all([getLeadsMode(domain), getPhoneRows(domain)]);
    if (allRows.length === 0) return fallbackResult();

    // Resolution order (mirrors webcore /phone-numbers/resolve):
    //   page  →  location  →  all  →  default.
    // A page-pinned number wins first when we know the originating page, and
    // never leaks into the site-wide leads_mode pool below.
    if (pageSlug && pageSlug !== 'all') {
      const pageRows = allRows.filter((r) => r.page_slug === pageSlug);
      if (pageRows.length > 0) return toResult(pickWeighted(pageRows), mode, domain);
    }

    // leads_mode logic runs only over site-wide rows so per-page numbers
    // don't dilute the homepage rotation.
    const rows = allRows.filter(isSiteWide);
    if (rows.length === 0) return fallbackResult();

    const defaultRow = findDefaultRow(rows);

    switch (mode) {
      case 'single':
        return toResult(defaultRow ?? rows[0], mode, domain);
      case 'rotation':
        return toResult(pickWeighted(rows), mode, domain);
      case 'location': {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain);
        }
        return toResult(defaultRow, mode, domain);
      }
      case 'hybrid': {
        if (locationSlug && locationSlug !== 'all') {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain);
        }
        return toResult(defaultRow, mode, domain);
      }
      default:
        return toResult(defaultRow, mode, domain);
    }
  } catch (err) {
    console.error('[getPhoneNumber] Unexpected error:', err);
    return fallbackResult();
  }
}

// Internal helper — only the /redirect-whatsapp-1 page is allowed to
// construct a raw wa.me URL. Every other CTA must route through that page
// so phone routing, leads_mode, and click tracking go through one place.
export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${query}`;
}

/* Blog */

export interface BlogPostSummary {
  id: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string;
  blog_translations: { title: string; excerpt: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string;
  blog_translations: {
    title: string;
    content: string;
    excerpt: string;
    meta_title: string;
    meta_description: string;
  }[];
}

export interface RecentBlogPost {
  slug: string;
  published_at: string;
  blog_translations: { title: string }[];
}

export async function getBlogPosts(locale: string): Promise<BlogPostSummary[]> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,excerpt)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&order=published_at.desc`;
  const data = await webcoreFetch<BlogPostSummary[]>(path, 'webcore-blog');
  return data ?? [];
}

export async function getBlogPost(slug: string, locale: string): Promise<BlogPost | null> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&slug=eq.${encodeURIComponent(slug)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&limit=1`;
  const data = await webcoreFetch<BlogPost[]>(path, 'webcore-blog');
  return data?.[0] ?? null;
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
    `&limit=${limit}`;
  const data = await webcoreFetch<RecentBlogPost[]>(path, 'webcore-blog');
  return data ?? [];
}

export async function getBlogPostSlugs(): Promise<{ slug: string }[]> {
  const path =
    `blog_posts?select=slug` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published`;
  const data = await webcoreFetch<{ slug: string }[]>(path, 'webcore-blog');
  return data ?? [];
}
