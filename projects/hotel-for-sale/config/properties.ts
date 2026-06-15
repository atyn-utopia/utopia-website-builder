// ─────────────────────────────────────────────────────────────────────────────
// HOTEL LISTINGS — PLACEHOLDER DATASET
//
// The client will supply the real hotel-for-sale dataset later. Until then these
// realistic sample listings (modelled on hotelforsale.my's "Hot List") drive the
// homepage Hot List, the /properties catalogue, and the /properties/[id] detail
// pages so the full layout can be reviewed.
//
// When the real dataset arrives it is loaded through lib/getProperties.ts, which
// prefers the Supabase `products` table and falls back to this config. Swapping
// the data source requires NO page changes — every page reads HotelListing[].
// ─────────────────────────────────────────────────────────────────────────────

export interface HotelListing {
  id: string;            // e.g. "h001" — used in /properties/{id}
  slug: string;          // url-safe, used interchangeably with id
  name: string;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  stars: number;         // 2–5
  sellingPrice: number;  // RM
  marketValue: number;   // RM (always >= sellingPrice → shows the discount)
  rooms: number;
  tenure: 'Freehold' | 'Leasehold';
  propertyType: string;  // "Hotel" | "Resort" | "Motel" | "Hotel / Resort"
  grossYield: number;    // % per year
  landSizeSqft: number;
  builtUpSqft: number;
  cover: string;
  gallery: string[];
  shortDesc: string;     // 1 line for cards
  description: string;   // detail-page intro paragraph
  highlights: string[];  // investment highlights (5)
  facilities: string[];
  onSale: boolean;
  featured: boolean;     // appears in the catalogue
  hotListed?: boolean;   // appears in the dedicated Hot List section
}

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1280&q=70`;

export const properties: HotelListing[] = [
  {
    id: 'h001',
    slug: 'h001',
    name: '3 Stars Hotel @ Genting',
    city: 'Genting Highlands',
    citySlug: 'bentong',
    state: 'Pahang',
    stateSlug: 'pahang',
    stars: 3,
    sellingPrice: 40_000_000,
    marketValue: 47_000_000,
    rooms: 90,
    tenure: 'Freehold',
    propertyType: 'Hotel / Resort',
    grossYield: 11,
    landSizeSqft: 43_560,
    builtUpSqft: 78_000,
    cover: U('photo-1566073771259-6a8506099945'),
    gallery: [
      U('photo-1566073771259-6a8506099945'),
      U('photo-1582719478250-c89cae4dc85b'),
      U('photo-1611892440504-42a792e24d32'),
      U('photo-1542314831-068cd1dbfeeb'),
    ],
    shortDesc: 'Prime Investment Opportunity: 3-Star Hotel in Enchanting Genting Highlands',
    description:
      'Introducing a remarkable investment opportunity nestled in the captivating realm of Genting Highlands – the "3 Stars Hotel @ Genting." Situated in the charming locale of Gohtong Jaya, this exquisite hotel presents an enticing blend of comfort, convenience, and potential for both discerning investors and hospitality enthusiasts.',
    highlights: [
      'Enchanting Locale: Nestled within the scenic ambiance of Genting Highlands, the hotel offers guests an enchanting escape from the ordinary, providing a tranquil retreat with cool breezes and lush surroundings.',
      'Unparalleled Comfort: The hotel boasts 90 well-appointed rooms designed to provide utmost comfort and relaxation, ensuring a memorable stay for every guest.',
      'Investment Potential: With a value of RM47,000,000 and a selling price of RM40,000,000, this property presents a unique investment prospect, combining affordability with a strong potential for future value appreciation.',
      'Strategic Advantage: Positioned within proximity to Genting’s attractions, entertainment, and leisure venues, the hotel capitalizes on the thriving tourism industry in the area.',
      'Freehold Ownership: Benefit from the assurance of freehold tenure, allowing for long-term ownership and potential legacy-building.',
    ],
    facilities: ['Restaurant', 'Banquet Hall', 'Car Park', 'Lift', 'Reception Lounge', 'Cafe'],
    onSale: true,
    featured: true,
  },
  {
    id: 'h002',
    slug: 'h002',
    name: '3 Star Hotel @ Bukit Bintang',
    city: 'Bukit Bintang',
    citySlug: 'kuala-lumpur',
    state: 'Klang Valley',
    stateSlug: 'klang-valley',
    stars: 3,
    sellingPrice: 43_000_000,
    marketValue: 52_000_000,
    rooms: 120,
    tenure: 'Freehold',
    propertyType: 'Hotel',
    grossYield: 10,
    landSizeSqft: 12_000,
    builtUpSqft: 96_000,
    cover: U('photo-1564501049412-61c2a3083791'),
    gallery: [
      U('photo-1564501049412-61c2a3083791'),
      U('photo-1571896349842-33c89424de2d'),
      U('photo-1551882547-ff40c63fe5fa'),
      U('photo-1520250497591-112f2f40a3f4'),
    ],
    shortDesc: 'Freehold 120-room hotel in the heart of Bukit Bintang, KL.',
    description:
      'A landmark freehold hotel in the heart of Bukit Bintang — Kuala Lumpur’s premier shopping and entertainment district. Steady walk-in and corporate demand, with redevelopment potential given the prime city-centre land.',
    highlights: [
      'Heart of Bukit Bintang — KL’s top tourism & retail belt',
      'Freehold city-centre land with redevelopment upside',
      '120 rooms with strong corporate and walk-in occupancy',
      'Below market value with immediate income in place',
      'Walking distance to Pavilion KL and the monorail',
    ],
    facilities: ['Restaurant', 'Rooftop Bar', 'Gym', 'Meeting Rooms', 'Lift', 'Car Park'],
    onSale: true,
    featured: true,
  },
  {
    id: 'h003',
    slug: 'h003',
    name: '5 Star Hotel @ Penang',
    city: 'George Town',
    citySlug: 'george-town',
    state: 'Penang',
    stateSlug: 'penang',
    stars: 5,
    sellingPrice: 600_000_000,
    marketValue: 720_000_000,
    rooms: 380,
    tenure: 'Freehold',
    propertyType: 'Hotel / Resort',
    grossYield: 9,
    landSizeSqft: 130_000,
    builtUpSqft: 410_000,
    cover: U('photo-1455587734955-081b22074882'),
    gallery: [
      U('photo-1455587734955-081b22074882'),
      U('photo-1582719478250-c89cae4dc85b'),
      U('photo-1542314831-068cd1dbfeeb'),
      U('photo-1611892440504-42a792e24d32'),
    ],
    shortDesc: 'Iconic 5-star seafront resort in George Town, Penang.',
    description:
      'An iconic 5-star seafront hotel in the UNESCO heritage city of George Town. A trophy asset with international brand pedigree, established MICE business and a loyal leisure following across the region.',
    highlights: [
      'Trophy 5-star seafront asset in UNESCO George Town',
      'Freehold land on the prime Penang waterfront',
      '380 rooms with established MICE and leisure business',
      'International management contract in place',
      'Significant land bank for future expansion',
    ],
    facilities: ['Infinity Pool', 'Spa', 'Ballroom', '4 Restaurants', 'Gym', 'Private Beach'],
    onSale: true,
    featured: true,
  },
  {
    id: 'h004',
    slug: 'h004',
    name: '2 Star Hotel @ Sunway',
    city: 'Petaling Jaya',
    citySlug: 'petaling-jaya',
    state: 'Klang Valley',
    stateSlug: 'klang-valley',
    stars: 2,
    sellingPrice: 8_500_000,
    marketValue: 10_500_000,
    rooms: 54,
    tenure: 'Leasehold',
    propertyType: 'Hotel',
    grossYield: 12,
    landSizeSqft: 6_500,
    builtUpSqft: 38_000,
    cover: U('photo-1520250497591-112f2f40a3f4'),
    gallery: [
      U('photo-1520250497591-112f2f40a3f4'),
      U('photo-1571896349842-33c89424de2d'),
      U('photo-1566073771259-6a8506099945'),
      U('photo-1551882547-ff40c63fe5fa'),
    ],
    shortDesc: 'Budget 54-room hotel near Sunway, Petaling Jaya.',
    description:
      'A high-yield budget hotel minutes from Sunway Pyramid and Sunway University. Strong, recession-resilient demand from students, visiting families and value travellers keeps occupancy high all year.',
    highlights: [
      'Minutes from Sunway Pyramid and Sunway University',
      'High 12% gross yield from resilient budget demand',
      '54 rooms with consistent student & family occupancy',
      'Priced well below market for a quick transaction',
      'Turn-key operation with existing management team',
    ],
    facilities: ['Cafe', 'Reception', 'Lift', 'Car Park', 'Laundry'],
    onSale: true,
    featured: true,
  },
  {
    id: 'h005',
    slug: 'h005',
    name: '2 Star Hotel @ Raub',
    city: 'Raub',
    citySlug: 'raub',
    state: 'Pahang',
    stateSlug: 'pahang',
    stars: 2,
    sellingPrice: 3_900_000,
    marketValue: 5_200_000,
    rooms: 38,
    tenure: 'Freehold',
    propertyType: 'Hotel',
    grossYield: 13,
    landSizeSqft: 5_000,
    builtUpSqft: 24_000,
    cover: U('photo-1445019980597-93fa8acb246c'),
    gallery: [
      U('photo-1445019980597-93fa8acb246c'),
      U('photo-1517840901100-8179e982acb7'),
      U('photo-1566073771259-6a8506099945'),
      U('photo-1542314831-068cd1dbfeeb'),
    ],
    shortDesc: 'Freehold 38-room town hotel in Raub, Pahang.',
    description:
      'A freehold town-centre hotel in fast-growing Raub, Pahang. An affordable entry point into hotel ownership with the highest gross yield in our hot list and steady demand from durian-season tourism and business travellers.',
    highlights: [
      'Affordable freehold entry into hotel ownership',
      'Highest 13% gross yield in the current hot list',
      '38 rooms in the growing Raub town centre',
      'Strong seasonal demand from durian tourism',
      'Below valuation — motivated seller',
    ],
    facilities: ['Cafe', 'Reception', 'Car Park', 'Meeting Room'],
    onSale: true,
    featured: true,
  },
  {
    id: 'h006',
    slug: 'h006',
    name: '3 Star Hotel @ Raja Laut',
    city: 'Chow Kit',
    citySlug: 'kuala-lumpur',
    state: 'Klang Valley',
    stateSlug: 'klang-valley',
    stars: 3,
    sellingPrice: 65_000_000,
    marketValue: 78_000_000,
    rooms: 160,
    tenure: 'Freehold',
    propertyType: 'Hotel',
    grossYield: 10,
    landSizeSqft: 14_500,
    builtUpSqft: 128_000,
    cover: U('photo-1542314831-068cd1dbfeeb'),
    gallery: [
      U('photo-1542314831-068cd1dbfeeb'),
      U('photo-1564501049412-61c2a3083791'),
      U('photo-1611892440504-42a792e24d32'),
      U('photo-1520250497591-112f2f40a3f4'),
    ],
    shortDesc: 'Freehold 160-room hotel on Jalan Raja Laut, KL.',
    description:
      'A large freehold business hotel on Jalan Raja Laut, central Kuala Lumpur. Excellent connectivity to the LRT, KL Sentral and the CBD makes it a dependable performer for corporate and group bookings.',
    highlights: [
      'Central KL location on Jalan Raja Laut',
      'Freehold land near the LRT and CBD',
      '160 rooms with strong corporate group demand',
      'Below market value with stable occupancy',
      'Scope to reposition to a 4-star product',
    ],
    facilities: ['Restaurant', 'Ballroom', 'Meeting Rooms', 'Gym', 'Lift', 'Car Park'],
    onSale: true,
    featured: true,
  },
  {
    id: 'h007',
    slug: 'h007',
    name: '5 Star Hotel @ PJ',
    city: 'Petaling Jaya',
    citySlug: 'petaling-jaya',
    state: 'Klang Valley',
    stateSlug: 'klang-valley',
    stars: 5,
    sellingPrice: 190_000_000,
    marketValue: 225_000_000,
    rooms: 250,
    tenure: 'Freehold',
    propertyType: 'Hotel',
    grossYield: 9,
    landSizeSqft: 48_000,
    builtUpSqft: 290_000,
    cover: U('photo-1551882547-ff40c63fe5fa'),
    gallery: [
      U('photo-1551882547-ff40c63fe5fa'),
      U('photo-1582719478250-c89cae4dc85b'),
      U('photo-1571896349842-33c89424de2d'),
      U('photo-1455587734955-081b22074882'),
    ],
    shortDesc: 'Freehold 250-room 5-star hotel in Petaling Jaya — from RM420 psf.',
    description:
      'A freehold 5-star hotel in the heart of Petaling Jaya’s commercial belt, priced from just RM420 per square foot. A rare institutional-grade asset with mature corporate, banquet and F&B income streams.',
    highlights: [
      'Institutional-grade 5-star asset in PJ',
      'Exceptional value from RM420 per square foot',
      '250 rooms with mature corporate & banquet income',
      'Freehold land in a established commercial belt',
      'Below replacement cost',
    ],
    facilities: ['Pool', 'Spa', 'Grand Ballroom', '3 Restaurants', 'Gym', 'Car Park'],
    onSale: true,
    featured: true,
  },
  {
    id: 'h008',
    slug: 'h008',
    name: '3 Star Standalone Hotel @ Bukit Bintang',
    city: 'Bukit Bintang',
    citySlug: 'kuala-lumpur',
    state: 'Klang Valley',
    stateSlug: 'klang-valley',
    stars: 3,
    sellingPrice: 26_000_000,
    marketValue: 32_000_000,
    rooms: 85,
    tenure: 'Freehold',
    propertyType: 'Hotel',
    grossYield: 11,
    landSizeSqft: 7_200,
    builtUpSqft: 64_000,
    cover: U('photo-1611892440504-42a792e24d32'),
    gallery: [
      U('photo-1611892440504-42a792e24d32'),
      U('photo-1564501049412-61c2a3083791'),
      U('photo-1517840901100-8179e982acb7'),
      U('photo-1542314831-068cd1dbfeeb'),
    ],
    shortDesc: 'Freehold standalone 85-room hotel in Bukit Bintang, KL.',
    description:
      'A rare freehold standalone hotel building in Bukit Bintang — full control of the entire asset, not a strata title. Ideal for owner-operators or boutique-brand conversion in KL’s busiest tourism district.',
    highlights: [
      'Rare freehold standalone building (not strata)',
      'Full control of the entire Bukit Bintang asset',
      '85 rooms ideal for boutique-brand conversion',
      'Below market value with redevelopment upside',
      'Steps from Jalan Alor and Pavilion KL',
    ],
    facilities: ['Cafe', 'Rooftop', 'Reception', 'Lift', 'Car Park'],
    onSale: true,
    featured: true,
  },
];

// Hotels flagged as "Hot List" — shown in the dedicated Hot List section.
export const HOT_LISTED_IDS = ['h003', 'h002', 'h006', 'h001', 'h008'];

export function pricePerRoom(h: HotelListing): number {
  return Math.round(h.sellingPrice / h.rooms);
}

export function discountPct(h: HotelListing): number {
  if (!h.marketValue || h.marketValue <= h.sellingPrice) return 0;
  return Math.round(((h.marketValue - h.sellingPrice) / h.marketValue) * 100);
}

// Compact RM formatting: 43,000,000 → "RM 43,000,000"; also a short form for cards.
export function formatRM(value: number): string {
  return `RM ${value.toLocaleString('en-MY')}`;
}

export function formatRMShort(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `RM ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (value >= 1_000) return `RM ${Math.round(value / 1_000)}K`;
  return `RM ${value}`;
}

// Filter option helpers used by the /properties catalogue.
export const STAR_OPTIONS = [2, 3, 5] as const;

export const PRICE_BANDS: { label: string; min: number; max: number }[] = [
  { label: 'Below RM 10M', min: 0, max: 10_000_000 },
  { label: 'RM 10M – 50M', min: 10_000_000, max: 50_000_000 },
  { label: 'RM 50M – 100M', min: 50_000_000, max: 100_000_000 },
  { label: 'Above RM 100M', min: 100_000_000, max: Number.MAX_SAFE_INTEGER },
];
