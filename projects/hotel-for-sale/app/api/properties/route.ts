import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readHotels, upsertHotel, deleteHotel, nextHotelId } from '@/lib/hotelStore';
import { HotelListing } from '@/config/properties';

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
    grossYield: num(input.grossYield),
    landSizeSqft: num(input.landSizeSqft),
    builtUpSqft: num(input.builtUpSqft),
    cover,
    gallery: gallery.length ? gallery : [cover],
    shortDesc: String(input.shortDesc || '').trim(),
    description: String(input.description || '').trim(),
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
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }
  const id = (typeof body.id === 'string' && body.id.trim()) ? body.id.trim() : await nextHotelId();
  const hotel = normalize(body, id);
  await upsertHotel(hotel);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, hotel });
}

// PUT — update an existing hotel.
export async function PUT(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }
  const id = String(body.id || '').trim();
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
  const hotel = normalize(body, id);
  await upsertHotel(hotel);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, hotel });
}

// DELETE — remove a hotel by ?id=
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
  await deleteHotel(id);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
