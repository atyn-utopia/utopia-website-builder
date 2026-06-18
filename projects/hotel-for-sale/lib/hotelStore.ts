// Supabase-backed hotel store. Hotels live as rows in the shared `products`
// table (webcore schema), scoped by `website`; the full HotelListing is stored
// as JSON in `description`. Reads are tag-cached ('hotels-data') so pages stay
// static and refresh on demand; the /manage admin writes go straight to
// Supabase, so edits persist on the live (Vercel) site.
//
// If Supabase is unreachable, reads fall back to the config seed so the site
// still renders.

import { properties as seed, HotelListing } from '@/config/properties';
import { siteConfig } from '@/config/site';

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  ?? process.env.SUPABASE_ANON_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ?? '';
const WEBSITE = siteConfig.domain;
export const HOTELS_TAG = 'hotels-data';
const enc = encodeURIComponent;

function headers(write = false): Record<string, string> {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    [write ? 'Content-Profile' : 'Accept-Profile']: 'webcore',
  };
}

type Row = { id?: string; slug: string; description: string; sort_order?: number };

function rowToHotel(r: Row): HotelListing | null {
  try {
    return { ...(JSON.parse(r.description) as HotelListing), id: r.slug, slug: r.slug };
  } catch {
    return null;
  }
}

// Cached read for pages (tag-invalidated on write).
export async function readHotels(): Promise<HotelListing[]> {
  if (!BASE || !KEY) return seed;
  try {
    const res = await fetch(
      `${BASE}/rest/v1/products?website=eq.${enc(WEBSITE)}&select=slug,description&order=sort_order.asc`,
      { headers: headers(), next: { tags: [HOTELS_TAG] } },
    );
    if (!res.ok) return seed;
    const rows = (await res.json()) as Row[];
    const list = rows.map(rowToHotel).filter(Boolean) as HotelListing[];
    return list.length ? list : seed;
  } catch {
    return seed;
  }
}

// Fresh read used inside write handlers (no caching).
async function readFresh(): Promise<HotelListing[]> {
  if (!BASE || !KEY) return [];
  const res = await fetch(
    `${BASE}/rest/v1/products?website=eq.${enc(WEBSITE)}&select=slug,description,sort_order&order=sort_order.asc`,
    { headers: headers(), cache: 'no-store' },
  );
  if (!res.ok) return [];
  return ((await res.json()) as Row[]).map(rowToHotel).filter(Boolean) as HotelListing[];
}

async function rowExists(slug: string): Promise<boolean> {
  const res = await fetch(
    `${BASE}/rest/v1/products?website=eq.${enc(WEBSITE)}&slug=eq.${enc(slug)}&select=slug`,
    { headers: headers(), cache: 'no-store' },
  );
  if (!res.ok) return false;
  return ((await res.json()) as unknown[]).length > 0;
}

export async function upsertHotel(hotel: HotelListing): Promise<void> {
  const exists = await rowExists(hotel.id);
  const body = {
    website: WEBSITE,
    name: hotel.name,
    slug: hotel.id,
    description: JSON.stringify(hotel),
    sale_price: hotel.sellingPrice,
    is_active: hotel.onSale !== false,
  };
  if (exists) {
    await fetch(
      `${BASE}/rest/v1/products?website=eq.${enc(WEBSITE)}&slug=eq.${enc(hotel.id)}`,
      { method: 'PATCH', headers: { ...headers(true), Prefer: 'return=minimal' }, body: JSON.stringify(body) },
    );
  } else {
    const all = await readFresh();
    const sort_order = all.length;
    await fetch(`${BASE}/rest/v1/products`, {
      method: 'POST',
      headers: { ...headers(true), Prefer: 'return=minimal' },
      body: JSON.stringify({ ...body, sort_order }),
    });
  }
}

export async function deleteHotel(id: string): Promise<void> {
  await fetch(
    `${BASE}/rest/v1/products?website=eq.${enc(WEBSITE)}&slug=eq.${enc(id)}`,
    { method: 'DELETE', headers: { ...headers(true), Prefer: 'return=minimal' } },
  );
}

export async function nextHotelId(): Promise<string> {
  const all = await readFresh();
  let max = 0;
  for (const h of all) {
    const m = /^h(\d+)$/.exec(h.id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `h${String(max + 1).padStart(3, '0')}`;
}
