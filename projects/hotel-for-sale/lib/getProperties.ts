// Read side of the hotel data layer. All listings come through readHotels()
// (config/hotels.json, seeded from config/properties.ts), so edits made in the
// /manage admin reflect everywhere. When the real dataset lands, point
// hotelStore at the database — these helpers don't change.

import { readHotels } from '@/lib/hotelStore';
import { HotelListing, HOT_LISTED_IDS } from '@/config/properties';

export async function getProperties(): Promise<HotelListing[]> {
  const list = await readHotels();
  // Sort: featured first, then by selling price descending (hot-list feel).
  return [...list].sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    return b.sellingPrice - a.sellingPrice;
  });
}

export async function getHotListed(limit = 5): Promise<HotelListing[]> {
  const all = await getProperties();
  const flagged = all.filter((p) => p.hotListed ?? HOT_LISTED_IDS.includes(p.id));
  const pool = flagged.length > 0 ? flagged : all;
  return pool.slice(0, limit);
}

export async function getFeaturedProperties(limit = 8): Promise<HotelListing[]> {
  const all = await getProperties();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getProperty(id: string): Promise<HotelListing | null> {
  const all = await getProperties();
  return all.find((p) => p.id === id || p.slug === id) ?? null;
}

export async function getPropertiesInCity(citySlug: string): Promise<HotelListing[]> {
  const all = await getProperties();
  return all.filter((p) => p.citySlug === citySlug);
}

export async function getPropertiesInState(stateSlug: string): Promise<HotelListing[]> {
  const all = await getProperties();
  return all.filter((p) => p.stateSlug === stateSlug);
}

export async function getAllPropertyIds(): Promise<string[]> {
  const all = await getProperties();
  return all.map((p) => p.id);
}
