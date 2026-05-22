// Idempotent insert of 7 wall-panel-malaysia products + photos.
import { createClient } from '@supabase/supabase-js'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig('/Users/intern/Documents/GitHub/utopia-website-builder')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !serviceKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const WEBSITE = 'wall-panel-malaysia.vercel.app'

const PRODUCTS = [
  {
    slug: 'standard-wood',
    name: 'Standard Wood Wall Panel',
    description:
      'Warm natural-wood feature wall. Free installation included.',
    sale_price: 25,
    sort_order: 10,
    photoUrl:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'standard-fluted',
    name: 'Standard Fluted Wall Panel',
    description: 'Modern slat-fluted texture. Free installation included.',
    sale_price: 25,
    sort_order: 20,
    photoUrl:
      'https://images.pexels.com/photos/3214113/pexels-photo-3214113.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'standard-pvc',
    name: 'Standard PVC Wall Panel',
    description: 'Waterproof PVC panel for kitchens, bathrooms, offices.',
    sale_price: 25,
    sort_order: 30,
    photoUrl:
      'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'standard-acoustic',
    name: 'Standard Acoustic Wall Panel',
    description: 'Sound-absorbing felt-back panel for home office and studios.',
    sale_price: 25,
    sort_order: 40,
    photoUrl:
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'marble-gold',
    name: 'Marble Gold Wall Panel',
    description: 'Luxury gold-veined marble finish in PU or gloss texture.',
    sale_price: 38,
    sort_order: 50,
    photoUrl:
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'marble-silver',
    name: 'Marble Silver Wall Panel',
    description: 'Cool silver-veined marble finish, PU or gloss.',
    sale_price: 38,
    sort_order: 60,
    photoUrl:
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    slug: 'marble-black',
    name: 'Marble Black Wall Panel',
    description: 'Deep black-marble accent for feature walls and lobbies.',
    sale_price: 38,
    sort_order: 70,
    photoUrl:
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]

async function main() {
  // 1. Fetch any existing rows for this website
  const { data: existing, error: exErr } = await sb
    .from('products')
    .select('id, slug')
    .eq('website', WEBSITE)

  if (exErr) {
    console.error('Failed to read existing products:', exErr)
    process.exit(1)
  }

  const bySlug = new Map(existing.map((r) => [r.slug, r.id]))
  console.log(`Existing products for ${WEBSITE}: ${existing.length}`)

  const finalIds = {}

  for (const p of PRODUCTS) {
    const row = {
      website: WEBSITE,
      parent_id: null,
      name: p.name,
      slug: p.slug,
      description: p.description,
      sale_price: p.sale_price,
      rental_price: null,
      sort_order: p.sort_order,
      is_active: true,
    }

    if (bySlug.has(p.slug)) {
      const id = bySlug.get(p.slug)
      const { error } = await sb
        .from('products')
        .update(row)
        .eq('id', id)
      if (error) {
        console.error(`UPDATE failed for ${p.slug}:`, error)
        process.exit(1)
      }
      finalIds[p.slug] = id
      console.log(`UPDATED ${p.slug} (${id})`)
    } else {
      const { data, error } = await sb
        .from('products')
        .insert(row)
        .select('id')
        .single()
      if (error) {
        console.error(`INSERT failed for ${p.slug}:`, error)
        process.exit(1)
      }
      finalIds[p.slug] = data.id
      console.log(`INSERTED ${p.slug} (${data.id})`)
    }
  }

  // 2. Replace photos: delete old, insert one fresh per product
  const allIds = Object.values(finalIds)
  if (allIds.length) {
    const { error: delErr } = await sb
      .from('product_photos')
      .delete()
      .in('product_id', allIds)
    if (delErr) {
      console.error('Failed to delete old photos:', delErr)
      process.exit(1)
    }
    console.log(`Cleared old photos for ${allIds.length} products`)
  }

  const photoRows = PRODUCTS.map((p) => ({
    product_id: finalIds[p.slug],
    url: p.photoUrl,
  }))
  const { error: phErr } = await sb.from('product_photos').insert(photoRows)
  if (phErr) {
    console.error('Failed to insert photos:', phErr)
    process.exit(1)
  }
  console.log(`Inserted ${photoRows.length} photos`)

  // 3. Verify
  const { data: verify, error: vErr } = await sb
    .from('products')
    .select('slug, name, sale_price, sort_order, product_photos(url)')
    .eq('website', WEBSITE)
    .order('sort_order', { ascending: true })
  if (vErr) {
    console.error('Verify failed:', vErr)
    process.exit(1)
  }
  console.log('--- VERIFICATION ---')
  console.log(JSON.stringify(verify, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
