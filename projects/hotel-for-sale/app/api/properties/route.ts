import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { readHotels, upsertHotel, deleteHotel, nextHotelId, HOTELS_TAG } from '@/lib/hotelStore';
import { HotelListing } from '@/config/properties';

function refresh() {
  revalidateTag(HOTELS_TAG);
  revalidatePath('/', 'layout');
}

// Simple admin password gate for write operations.
const ADMIN_PASS = process.env.ADMIN_PASS ?? '8889';
function authed(req: Request): boolean {
  return req.headers.get('x-admin-pass') === ADMIN_PASS;
}
function unauthorized() {
  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}

const HOT_LIST_LIMIT = 5;
// Returns an error message if adding this hotel to the Hot List would exceed the limit.
async function hotListError(hotel: HotelListing): Promise<string | null> {
  if (!hotel.hotListed) return null;
  const all = await readHotels();
  const others = all.filter((p) => p.id !== hotel.id && p.hotListed).length;
  if (others >= HOT_LIST_LIMIT) {
    return `Hot List is limited to ${HOT_LIST_LIMIT} hotels. Unset another hotel from the Hot List first.`;
  }
  return null;
}

export const dynamic = 'force-dynamic';

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function toLines(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((x) => x.trim()).filter(Boolean);
  if (typeof v === 'string') return v.split('\n').map((x) => x.trim()).filter(Boolean);
  return [];
}
function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// Build a clean HotelListing from arbitrary form input.
function normalize(input: Record<string, unknown>, id: string): HotelListing {
  const cover = String(input.cover || '').trim() || 'https://placehold.co/1280x880?text=Hotel';
  const gallery = toLines(input.gallery);
  return {
    id,
    slug: id,
    name: String(input.name || 'Untitled Hotel').trim(),
    city: String(input.city || '').trim(),
    citySlug: String(input.citySlug || slugify(String(input.city || ''))).trim(),
    state: String(input.state || '').trim(),
    stateSlug: String(input.stateSlug || slugify(String(input.state || ''))).trim(),
    stars: Math.min(5, Math.max(1, num(input.stars, 3))),
    sellingPrice: num(input.sellingPrice),
    marketValue: num(input.marketValue) || num(input.sellingPrice),
    rooms: num(input.rooms),
    tenure: (String(input.tenure) === 'Leasehold' ? 'Leasehold' : 'Freehold'),
    propertyType: String(input.propertyType || 'Hotel').trim(),
    unitType: String(input.unitType || '').trim(),
    grossYield: num(input.grossYield),
    landSizeSqft: num(input.landSizeSqft),
    builtUpSqft: num(input.builtUpSqft),
    cover,
    gallery: gallery.length ? gallery : [cover],
    shortDesc: String(input.shortDesc || '').trim(),
    description: String(input.description || '').trim(),
    descriptionHtml: String(input.descriptionHtml || '').trim() || undefined,
    highlights: toLines(input.highlights),
    facilities: toLines(input.facilities),
    onSale: input.onSale !== false,
    featured: input.featured !== false,
    hotListed: input.hotListed === true,
  };
}

// GET — full list of hotels (all fields).
export async function GET() {
  const hotels = await readHotels();
  return NextResponse.json({ hotels });
}

// POST — create a new hotel (id auto-assigned unless provided).
export async function POST(req: Request) {
  if (!authed(req)) return unauthorized();
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }
  const id = (typeof body.id === 'string' && body.id.trim()) ? body.id.trim() : await nextHotelId();
  const hotel = normalize(body, id);
  const hlErr = await hotListError(hotel);
  if (hlErr) return NextResponse.json({ ok: false, error: hlErr }, { status: 400 });
  await upsertHotel(hotel);
  refresh();
  return NextResponse.json({ ok: true, hotel });
}

// PUT — update an existing hotel.
export async function PUT(req: Request) {
  if (!authed(req)) return unauthorized();
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }
  const id = String(body.id || '').trim();
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
  const hotel = normalize(body, id);
  const hlErr = await hotListError(hotel);
  if (hlErr) return NextResponse.json({ ok: false, error: hlErr }, { status: 400 });
  await upsertHotel(hotel);
  refresh();
  return NextResponse.json({ ok: true, hotel });
}

// DELETE — remove a hotel by ?id=
export async function DELETE(req: Request) {
  if (!authed(req)) return unauthorized();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
  await deleteHotel(id);
  refresh();
  return NextResponse.json({ ok: true });
}
