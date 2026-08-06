/**
 * FALLBACK ONLY — Supabase (`products` + `product_photos`, filtered on
 * siteConfig.domain) is the source of truth. This catalogue mirrors the
 * original static page and is rendered only when the Supabase read returns no
 * rows, so the page never ships an empty product grid.
 *
 * Copy (name / description / features) is NOT here — it lives in
 * messages/*.json under `products.items.<slug>` so it stays translatable.
 */
export interface FallbackProduct {
  slug: string;
  image: string;
  rentalPrice: number;
  salePrice: number;
  popular?: boolean;
  featureCount: number;
  accent: 'teal' | 'amber';
}

export const fallbackBeds: FallbackProduct[] = [
  {
    slug: 'standard-2-fungsi',
    image:
      'https://katil-hospital-bed.my/images/Images/Product%20Card/Hospital%20Bed%202%20Function%20Manual.webp',
    rentalPrice: 139,
    salePrice: 749,
    featureCount: 4,
    accent: 'teal',
  },
  {
    slug: 'premium-3-fungsi',
    image:
      'https://katil-hospital-bed.my/images/Images/Product%20Card/Hospital%20Bed%203%20Function%20Manual.webp',
    rentalPrice: 229,
    salePrice: 1249,
    popular: true,
    featureCount: 5,
    accent: 'teal',
  },
  {
    slug: 'ultra-6-fungsi-elektrik',
    image:
      'https://katil-hospital-bed.my/images/Images/Product%20Card/Hospital%20Bed%206%20Function%20Auto.webp',
    rentalPrice: 649,
    salePrice: 4999,
    featureCount: 5,
    accent: 'amber',
  },
];

export interface FallbackAddon {
  slug: string;
  image: string;
}

export const fallbackAddons: FallbackAddon[] = [
  { slug: 'tilam-ripple', image: 'https://katil-hospital-bed.my/images/produk-kami/ripple-mattress.webp' },
  { slug: 'tilam-kalis-air', image: 'https://katil-hospital-bed.my/images/produk-kami/tilam-kulit-10cm.webp' },
  { slug: 'kerusi-roda', image: 'https://katil-hospital-bed.my/images/produk-kami/wheelchair.webp' },
  { slug: 'oxygen-concentrator', image: 'https://katil-hospital-bed.my/images/produk-kami/mesin-oksigen.webp' },
];
