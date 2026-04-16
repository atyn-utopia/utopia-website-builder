#!/usr/bin/env node
/**
 * Seed Cat Rumah Malaysia products into Utopia Webcore
 * API docs: utopia-webcore/docs/PRODUCT-API-GUIDE.md
 *
 * Usage:
 *   UWC_API_KEY=uwc_xxx node scripts/seed-products.mjs
 *
 * Inserts 1 main "umbrella" product (Cat Rumah Services) + 6 sub-products
 * (one per paint service). Re-running is safe — existing slugs return 409
 * and are skipped.
 */

const API_KEY = process.env.UWC_API_KEY
const BASE = 'https://utopia-webcore.vercel.app/api/public/products'
const WEBSITE = 'cat-rumah-malaysia.vercel.app'

if (!API_KEY) {
  console.error('Missing UWC_API_KEY env var. Get one from the webcore admin /api-keys dashboard.')
  process.exit(1)
}

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
}

const W = (id) =>
  `https://static.wixstatic.com/media/${id}~mv2.png/v1/fill/w_800,h_600,al_c,q_85,enc_avif,quality_auto/${id}.png`

// 1 main + 6 sub-products
const mainProduct = {
  website: WEBSITE,
  name: 'Cat Rumah Malaysia — House Painting Services',
  slug: 'cat-rumah',
  description:
    'Premium house painting services across Malaysia using Nippon Paint, Jotun, and Dulux. From RM3.50/sqft. Siap dalam 5 jam. Free on-site quotation and WhatsApp consultation.',
  sale_price: null,
  rental_price: null,
  sort_order: 0,
  photos: [
    {
      url: W('d3104b_f7b325071ce64386b8a663e43f48d1f2f000'),
      alt_text: 'Cat Rumah Malaysia — premium house painting service',
    },
  ],
}

const subProducts = [
  {
    name: 'Cat Dinding Rumah (Interior Wall Painting)',
    slug: 'cat-dinding-rumah',
    description:
      'Interior wall painting using premium Nippon, Jotun, or Dulux paint. Clean, even finish on plaster, drywall, and concrete walls. From RM3.50/sqft with labour and paint included.',
    sale_price: 3.50,
    rental_price: null,
    sort_order: 1,
    photos: [
      { url: W('d3104b_273cbdfa50b74941bc03c86827e98ea8'), alt_text: 'Interior wall painting — Cat Dinding Rumah' },
    ],
  },
  {
    name: 'Cat Luar Rumah (Exterior Wall / Weathershield)',
    slug: 'cat-luar-rumah',
    description:
      'Weathershield exterior wall painting using Nippon Weatherbond, Jotun Jotashield, or Dulux Weathershield. Protects against Malaysian sun, rain, mildew, and fading. From RM3.50/sqft.',
    sale_price: 3.50,
    rental_price: null,
    sort_order: 2,
    photos: [
      { url: W('d3104b_2b454e393c1e4c628f208892290823a9'), alt_text: 'Exterior wall weathershield painting — Cat Luar Rumah' },
    ],
  },
  {
    name: 'Cat Siling (Ceiling Painting)',
    slug: 'cat-siling',
    description:
      'Ceiling painting with low-odour, splatter-resistant ceiling white. Full masking and floor protection included. From RM3.50/sqft.',
    sale_price: 3.50,
    rental_price: null,
    sort_order: 3,
    photos: [
      { url: W('d3104b_4f7ae2b4c00647a9945f88804b9fcc6d'), alt_text: 'Ceiling painting service — Cat Siling' },
    ],
  },
  {
    name: 'Cat Epoxy Lantai (Epoxy Floor Coating)',
    slug: 'cat-epoxy-lantai',
    description:
      'Epoxy floor coating for garages, kitchens, porches, and commercial spaces. Seamless, stain-resistant finish with slip-safe options. Starting from RM2,000 per job.',
    sale_price: 2000,
    rental_price: null,
    sort_order: 4,
    photos: [
      { url: W('d3104b_542fc4abfad243178325a0d7fcdf150f'), alt_text: 'Epoxy floor coating — Cat Epoxy Lantai' },
    ],
  },
  {
    name: 'Cat Pagar Rumah (Fence Painting)',
    slug: 'cat-pagar-rumah',
    description:
      'Metal and stone fence painting with rust-inhibiting primer and weather-resistant topcoat. Quotation provided on site after free inspection.',
    sale_price: null,
    rental_price: null,
    sort_order: 5,
    photos: [
      { url: W('d3104b_573e909d7f354ce3864ba1712d1a317c'), alt_text: 'Fence painting — Cat Pagar Rumah' },
    ],
  },
  {
    name: 'Outdoor Metal Paint (Cat Besi Luar)',
    slug: 'outdoor-metal-paint',
    description:
      'Outdoor metal painting for grilles, gates, awnings, railings, and roofing. Anti-rust primer + UV-stable topcoat. Starting from RM1,800 per job.',
    sale_price: 1800,
    rental_price: null,
    sort_order: 6,
    photos: [
      { url: W('d3104b_659b2ba662dc45a898fc5443e3d93215'), alt_text: 'Outdoor metal painting — Cat Besi Luar' },
    ],
  },
]

async function post(body) {
  const res = await fetch(BASE, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

async function main() {
  console.log(`Seeding products for ${WEBSITE}...`)

  const main = await post(mainProduct)
  if (main.status === 409) {
    console.log(`  ~ main "${mainProduct.slug}" already exists — fetching id`)
    const existing = await fetch(`${BASE}?website=${WEBSITE}&slug=${mainProduct.slug}`).then((r) => r.json())
    main.data = Array.isArray(existing) ? existing[0] : existing
  } else if (!main.ok) {
    console.error('  ✗ failed to create main product:', main.status, main.data)
    process.exit(1)
  } else {
    console.log(`  ✓ main "${mainProduct.slug}" created (${main.data.id})`)
  }

  const parentId = main.data?.id
  if (!parentId) {
    console.error('  ✗ could not resolve main product id')
    process.exit(1)
  }

  let created = 0
  let skipped = 0
  for (const sub of subProducts) {
    const res = await post({ website: WEBSITE, parent_id: parentId, ...sub })
    if (res.status === 409) {
      console.log(`  ~ sub "${sub.slug}" already exists`)
      skipped++
    } else if (!res.ok) {
      console.error(`  ✗ sub "${sub.slug}" failed:`, res.status, res.data)
    } else {
      console.log(`  ✓ sub "${sub.slug}" created`)
      created++
    }
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
