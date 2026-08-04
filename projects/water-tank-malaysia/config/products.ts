// Fallback product catalogue — used ONLY when the Supabase `products` table is
// unreachable or empty (per CLAUDE.md rule 6). The DB is the source of truth;
// homepage + location pages query it first and fall back to this list so the
// grid never renders blank. Prices are the real supply+install prices from the
// TANKPRO price sheet. `image` may be null → the card renders a branded tile.

export interface FallbackProduct {
  slug: string;
  name: string;
  /** Short category/eyebrow tag shown on the card, e.g. "Water Tank". */
  category: string;
  description: string;
  /** Supply + install price in RM. */
  price: number;
  image: string | null;
}

export const fallbackProducts: FallbackProduct[] = [
  {
    slug: 'king-kong-1000l',
    name: 'King Kong 1000L',
    category: 'Water Tank',
    description: 'Tangki air King Kong stainless steel 1000L — supply & install lengkap untuk rumah landed.',
    price: 2914,
    image: null,
  },
  {
    slug: 'tsunami-pump-05hp',
    name: 'Tsunami 0.5 HP',
    category: 'Water Pump',
    description: 'Pam air Tsunami 0.5HP untuk tekanan air stabil — supply, wiring & pemasangan.',
    price: 1800,
    image: null,
  },
  {
    slug: 'tsunami-pump-1hp',
    name: 'Tsunami 1.0 HP',
    category: 'Water Pump',
    description: 'Pam air Tsunami 1.0HP untuk rumah 2–3 tingkat — supply & install pakar.',
    price: 2200,
    image: null,
  },
  {
    slug: 'grundfos-pump-05hp',
    name: 'Grundfos 0.5 HP',
    category: 'Water Pump',
    description: 'Pam air Grundfos 0.5HP jimat elektrik & senyap — supply & pemasangan penuh.',
    price: 3600,
    image: null,
  },
  {
    slug: 'grundfos-pump-1hp',
    name: 'Grundfos 1.0 HP',
    category: 'Water Pump',
    description: 'Pam air Grundfos 1.0HP premium untuk tekanan air kuat sepanjang rumah.',
    price: 4000,
    image: null,
  },
];
