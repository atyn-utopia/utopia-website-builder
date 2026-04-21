#!/usr/bin/env node
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load env manually from repo root + hollywood-night (where service-role key lives)
for (const p of [
  '/Users/intern/Documents/GitHub/utopia-website-system/.env.local',
  '/Users/intern/Documents/GitHub/utopia-website-system/projects/hollywood-night/.env.local',
]) {
  try {
    const envText = readFileSync(p, 'utf8');
    for (const line of envText.split(/\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing Supabase env'); process.exit(1); }
console.log('Using', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE key' : 'ANON key');

const supabase = createClient(url, key);
const WEBSITE = 'electrician-24-hour.vercel.app';
const GALLERY = (n) => `https://electrician-24-hour.vercel.app/gallery/gallery-${n}.png`;

const products = [
  {
    name: 'Plug Point Add & Repair',
    slug: 'plug-point',
    description:
      'Add new plug points, replace burnt sockets, fix loose connections and tripped breakers. ST-registered wiremen — fixed RM80 per-job pricing includes diagnosis, parts (standard 13A socket) and testing. Same-day across Klang Valley.',
    sale_price: 80,
    rental_price: null,
    sort_order: 1,
    photos: [GALLERY(1), GALLERY(2)],
  },
  {
    name: 'Ceiling Fan & Exhaust Fan Installation',
    slug: 'ceiling-fan-installation',
    description:
      'New ceiling fan install or old-fan replacement with proper down-rod mounting, wiring to wall regulator and capacitor check. From RM150 per fan — includes balancing and a 30-day workmanship warranty.',
    sale_price: 150,
    rental_price: null,
    sort_order: 2,
    photos: [GALLERY(3), GALLERY(4)],
  },
  {
    name: 'Air-Cond Electrical Service',
    slug: 'aircond-electrical',
    description:
      'Dedicated aircond point wiring, isolator switch installation, MCB upgrade for inverter units. We handle the electrical side — your appointed aircond technician handles refrigerant. From RM130.',
    sale_price: 130,
    rental_price: null,
    sort_order: 3,
    photos: [GALLERY(5), GALLERY(6)],
  },
  {
    name: 'Downlight & Ceiling Light Installation',
    slug: 'downlight-installation',
    description:
      'New downlight cut-out, LED strip mounting, chandelier hanging and dimmer switch wiring. From RM60 per point — bundle pricing available when installing 6 or more points in one visit.',
    sale_price: 60,
    rental_price: null,
    sort_order: 4,
    photos: [GALLERY(7), GALLERY(8)],
  },
  {
    name: 'Water Heater Installation',
    slug: 'water-heater',
    description:
      'Instant and storage water heater wiring with dedicated MCB + RCCB, waterproof isolator and safety earth. From RM150 — critical for bathroom safety. Includes post-install leak / insulation check.',
    sale_price: 150,
    rental_price: null,
    sort_order: 5,
    photos: [GALLERY(9), GALLERY(11)],
  },
  {
    name: 'Full House Rewiring',
    slug: 'full-house-rewiring',
    description:
      'Complete removal of old aluminium / decayed PVC cabling, replaced with new copper + modern DB board, RCCB, MCBs and ELCB. Suitable for homes over 20 years old. Quoted on-site with a written scope and a per-phase schedule.',
    sale_price: 2500,
    rental_price: null,
    sort_order: 6,
    photos: [GALLERY(12), GALLERY(2)],
  },
  {
    name: 'DB Box Repair & Upgrade',
    slug: 'db-box-upgrade',
    description:
      'Buzzing main switch, tripping MCB, burnt neutral, overloaded DB — we rebuild it. Upgraded to current SIRIM-approved RCCBs/MCBs with full phase labelling and circuit testing.',
    sale_price: 450,
    rental_price: null,
    sort_order: 7,
    photos: [GALLERY(1), GALLERY(3)],
  },
  {
    name: '24-Hour Emergency Call-Out',
    slug: 'emergency-callout',
    description:
      'Power out at 2 AM. Plug sparking. Smoke from DB. We dispatch 24/7 across Malaysia — 4-hour arrival for Klang Valley, under 8 hours for outer cities. Flat call-out fee, fix price quoted before any work starts.',
    sale_price: 180,
    rental_price: null,
    sort_order: 8,
    photos: [GALLERY(4), GALLERY(6)],
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
  .select('id, name, slug, is_active, product_photos(url)')
  .eq('website', WEBSITE)
  .eq('is_active', true)
  .order('sort_order');
if (fErr) { console.error(fErr); process.exit(1); }
console.log(`✅ ${final.length} products active for ${WEBSITE}`);
for (const p of final) {
  console.log(`  - ${p.name} (${p.slug}) → ${p.product_photos.length} photos`);
}
