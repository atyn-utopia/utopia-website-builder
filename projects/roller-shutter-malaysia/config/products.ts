// priceFrom mirrors the sale_price seeded in Supabase. Kept here so the
// public homepage can render pricing without an extra DB round-trip — the
// canonical source of truth remains the products table.
export const products = [
  { slug: 'mild-steel', key: 'mildSteel', name: 'Mild Steel Roller Shutter', priceFrom: 3200, unit: 'sq ft' },
  { slug: 'aluminium', key: 'aluminium', name: 'Aluminium Roller Shutter', priceFrom: 4500, unit: 'sq ft' },
  { slug: 'polycarbonate', key: 'polycarbonate', name: 'Polycarbonate/Transparent Roller Shutter', priceFrom: 5800, unit: 'sq ft' },
  { slug: 'fire-rated', key: 'fireRated', name: 'Fire-Rated Roller Shutter', priceFrom: 8500, unit: 'sq ft' },
  { slug: 'grille', key: 'grille', name: 'Grille Roller Shutter', priceFrom: 4200, unit: 'sq ft' },
  { slug: 'motorised', key: 'motorised', name: 'Motorised/Automatic Roller Shutter', priceFrom: 6500, unit: 'sq ft' },
];

export const services = [
  { slug: 'installation', name: 'New Installation' },
  { slug: 'repair', name: 'Repair & Troubleshooting (24hr Emergency)' },
  { slug: 'maintenance', name: 'Regular Maintenance' },
  { slug: 'motor-upgrade', name: 'Motor Upgrade' },
  { slug: 'spring-replacement', name: 'Spring Replacement' },
];
