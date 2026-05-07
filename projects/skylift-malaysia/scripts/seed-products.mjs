#!/usr/bin/env node
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

try {
  const envText = readFileSync('/Users/intern/Documents/GitHub/utopia-website-system/.env.local', 'utf8');
  for (const line of envText.split(/\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing Supabase env'); process.exit(1); }
console.log('Using', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON', 'key against', url);

const supabase = createClient(url, key);
const WEBSITE = 'skylift-malaysia.vercel.app';
const PRODUCT = (key) => `/products/product-${key}.png`;

// Only two units listed on the reference site (skyliftmalaysia.my) — keep parity.
const products = [
  {
    name: '20m Skylift',
    slug: 'skylift-20m',
    description:
      'Workhorse 20-metre diesel boom lift — most popular for shop-front signage, AC servicing and billboard installs. Half-day RM500, full-day RM620. Truck-mounted with stable outriggers; certified operator and full insurance included.',
    sale_price: null,
    rental_price: 620,
    sort_order: 1,
    photos: [PRODUCT('20m')],
  },
  {
    name: '24m Skylift',
    slug: 'skylift-24m',
    description:
      '24-metre boom for high-rise facade, factory roof and warehouse maintenance. Half-day RM500, full-day RM650. Stable outriggers, truck-mounted, fast deployment across KL & Selangor. Certified operator included.',
    sale_price: null,
    rental_price: 650,
    sort_order: 2,
    photos: [PRODUCT('24m')],
  },
];

console.log(`Clearing existing products for ${WEBSITE}...`);
const { data: existing } = await supabase
  .from('products')
  .select('id')
  .eq('website', WEBSITE);
if (existing && existing.length > 0) {
  for (const row of existing) {
    await supabase.from('product_photos').delete().eq('product_id', row.id);
  }
  await supabase.from('products').delete().eq('website', WEBSITE);
  console.log(`  removed ${existing.length} old rows`);
}

for (const p of products) {
  const { photos, ...row } = p;
  const { data, error } = await supabase
    .from('products')
    .insert({ ...row, website: WEBSITE, is_active: true })
    .select('id')
    .single();
  if (error) { console.error('  insert product failed:', p.slug, error.message); continue; }
  console.log(`  + product: ${p.slug}`);
  for (const url of photos) {
    const { error: pErr } = await supabase
      .from('product_photos')
      .insert({ product_id: data.id, url });
    if (pErr) console.error('    photo failed:', pErr.message);
  }
}

console.log('Verifying...');
const { data: final, error: fErr } = await supabase
  .from('products')
  .select('id, name, slug, rental_price, is_active, product_photos(url)')
  .eq('website', WEBSITE)
  .eq('is_active', true)
  .order('sort_order');
if (fErr) { console.error(fErr); process.exit(1); }
console.log(`✅ ${final.length} products active for ${WEBSITE}`);
for (const p of final) {
  console.log(`  - ${p.name} (${p.slug}) RM${p.rental_price}/day → ${p.product_photos.length} photos`);
}
