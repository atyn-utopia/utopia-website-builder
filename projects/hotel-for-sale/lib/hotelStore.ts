// Writable hotel store backing the /manage CRUD admin page.
//
// Full hotel records live in config/hotels.json. On first read the file is
// seeded from config/properties.ts (the static placeholder dataset). Every page
// reads through getProperties() → readHotels(), so add/update/delete in the
// admin reflects across the homepage, catalogue, and detail pages.
//
// When the client's real dataset arrives, seed hotels.json from it (or switch
// readHotels/writeHotels to Supabase) — the page layer never changes.

import { promises as fs } from 'fs';
import path from 'path';
import { properties as seed, HOT_LISTED_IDS, HotelListing } from '@/config/properties';

const DATA_PATH = path.join(process.cwd(), 'config', 'hotels.json');

function withDefaults(h: HotelListing): HotelListing {
  return { ...h, hotListed: h.hotListed ?? HOT_LISTED_IDS.includes(h.id) };
}

export async function readHotels(): Promise<HotelListing[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length > 0) return arr as HotelListing[];
  } catch {
    /* not seeded yet */
  }
  const seeded = seed.map(withDefaults);
  await writeHotels(seeded);
  return seeded;
}

export async function writeHotels(list: HotelListing[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 2) + '\n', 'utf8');
}

export async function upsertHotel(hotel: HotelListing): Promise<HotelListing[]> {
  const list = await readHotels();
  const i = list.findIndex((h) => h.id === hotel.id);
  if (i >= 0) list[i] = hotel;
  else list.push(hotel);
  await writeHotels(list);
  return list;
}

export async function deleteHotel(id: string): Promise<HotelListing[]> {
  const list = (await readHotels()).filter((h) => h.id !== id);
  await writeHotels(list);
  return list;
}

// Generate the next free id like h009, h010…
export async function nextHotelId(): Promise<string> {
  const list = await readHotels();
  let max = 0;
  for (const h of list) {
    const m = /^h(\d+)$/.exec(h.id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `h${String(max + 1).padStart(3, '0')}`;
}
