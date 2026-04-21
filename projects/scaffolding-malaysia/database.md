# Scaffolding Malaysia — Database Document

**Agent:** Cyclops (Database Engineer)
**Company:** Scaffolding Malaysia Sdn. Bhd.
**Company UUID:** `7c15d93f-c2f7-488d-b38c-4b85d65a06d1`
**Domain:** `scaffolding-malaysia.vercel.app`
**Leads mode:** `single`
**Default phone:** `60174287801`
**Languages:** `ms` (default), `en`, `zh`
**Supabase instance:** Shared multi-tenant (repo root `.env.local`, symlinked per project)

This project does **NOT** create or alter any tables. The shared Supabase instance already has the canonical schema. Cyclops only seeds rows and writes `lib/getPhoneNumber.ts`.

---

## 1. Schema Verification (no DDL)

### 1a. `phone_numbers` — current columns

The canonical schema for this project, as defined in `CLAUDE.md` → "Supabase Database Logic" → "phone_numbers Table Columns":

> - `website` — Vercel domain (e.g. `scaffolding-malaysia.vercel.app`)
> - `location_slug` — city slug or `'all'` for default
> - `phone_number` — full international format
> - `whatsapp_text` — pre-filled WhatsApp message
> - `percentage` — weight for random selection (relative, doesn't need to sum to 100)
> - `label` — `'default'` for initial number, agent name for additional numbers
> - `type` — `'default'` for initial setup, `'custom'` for additional numbers
> - `is_active` — boolean

Plus the housekeeping columns `id` (UUID primary key) and `created_at` (TIMESTAMPTZ).

**The `product_slug` column HAS BEEN REMOVED.** It is not present on `phone_numbers` and must never be referenced in SQL, SELECT lists, INSERTs, WHERE clauses, or TypeScript code anywhere in this project.

### 1b. `company_websites` — relevant columns

- `company_id` — UUID reference to the company (Scaffolding Malaysia Sdn. Bhd. = `7c15d93f-c2f7-488d-b38c-4b85d65a06d1`)
- `domain` — the deployed host (matches `phone_numbers.website`)
- `leads_mode` — one of `single` | `rotation` | `location` | `hybrid`
- brand metadata columns (`brand_name`, `logo_url`, etc.) — optional, not required by the runtime query path

### 1c. `products` — shared product catalog

- `id` — UUID primary key
- `website` — Vercel domain (scopes all products by website)
- `parent_id` — UUID (for product hierarchies/categories, nullable)
- `name` — product display name (Malay by default)
- `slug` — URL-friendly product identifier
- `description` — product description
- `sale_price` — selling price in MYR (nullable)
- `rental_price` — rental price in MYR (nullable)
- `sort_order` — integer for manual ordering
- `is_active` — boolean

### 1d. `product_photos` — product images

- `id` — UUID primary key
- `product_id` — foreign key to `products.id`
- `url` — image URL (absolute path or CDN URL)

### 1e. Pre-seed verification query

Run these in the Supabase SQL Editor before seeding, to confirm no `product_slug` column exists on `phone_numbers` and to see what is already present for this domain:

```sql
-- Confirm phone_numbers has NO product_slug column.
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'phone_numbers'
ORDER BY ordinal_position;
-- Expected rows: id, website, location_slug, phone_number, whatsapp_text,
-- percentage, label, type, is_active, created_at

-- Any rows already seeded for this domain? (Should be zero on first run.)
SELECT id, website, location_slug, phone_number, label, type, is_active
FROM phone_numbers
WHERE website = 'scaffolding-malaysia.vercel.app';

-- Any company_websites row already?
SELECT domain, leads_mode, company_id
FROM company_websites
WHERE domain = 'scaffolding-malaysia.vercel.app';

-- Any products already?
SELECT id, name, slug, rental_price, is_active
FROM products
WHERE website = 'scaffolding-malaysia.vercel.app';
```

If `product_slug` appears in the first query's output, STOP and escalate — the schema has drifted.

---

## 2. Seed SQL (run in Supabase SQL Editor)

### 2a. `company_websites` — one row, leads_mode = 'single'

```sql
INSERT INTO company_websites (
  company_id,
  domain,
  leads_mode,
  brand_name
)
VALUES (
  '7c15d93f-c2f7-488d-b38c-4b85d65a06d1',
  'scaffolding-malaysia.vercel.app',
  'single',
  'Scaffolding Malaysia Sdn. Bhd.'
)
ON CONFLICT (domain) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  leads_mode = EXCLUDED.leads_mode,
  brand_name = EXCLUDED.brand_name;
```

### 2b. `phone_numbers` — one default row (location_slug = 'all')

```sql
INSERT INTO phone_numbers (
  website,
  location_slug,
  phone_number,
  whatsapp_text,
  percentage,
  label,
  type,
  is_active
)
VALUES (
  'scaffolding-malaysia.vercel.app',
  'all',
  '60174287801',
  'Hi, saya berminat dengan sewa perancah scaffolding.',
  100,
  'default',
  'default',
  true
)
ON CONFLICT (website, location_slug, phone_number) DO UPDATE SET
  whatsapp_text = EXCLUDED.whatsapp_text,
  percentage    = EXCLUDED.percentage,
  label         = EXCLUDED.label,
  type          = EXCLUDED.type,
  is_active     = EXCLUDED.is_active;
```

> If the shared `phone_numbers` table does not have a unique constraint on `(website, location_slug, phone_number)`, drop the `ON CONFLICT` clause on first seed and instead guard the insert with `WHERE NOT EXISTS (...)`. Do NOT add a new unique constraint yourself — the admin panel owns the schema.

### 2c. `products` — scaffolding rental products

Based on typical scaffolding rental businesses in Malaysia, here are 8 recommended products to seed:

```sql
INSERT INTO products (
  website,
  parent_id,
  name,
  slug,
  description,
  sale_price,
  rental_price,
  sort_order,
  is_active
)
VALUES
  -- 1. Mobile Scaffolding
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Perancah Mudah Alih (Mobile Scaffolding)',
    'perancah-mudah-alih',
    'Perancah mudah alih dengan roda, sesuai untuk kerja dalaman dan luaran. Mudah dipasang dan ditanggalkan. Ketinggian boleh laras sehingga 6 meter.',
    NULL,
    180.00,
    1,
    true
  ),

  -- 2. H-Frame Scaffolding
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Perancah H-Frame (Frame Scaffolding)',
    'perancah-h-frame',
    'Perancah jenis H-frame yang kukuh dan stabil. Sesuai untuk projek pembinaan, pengecatan, dan penyelenggaraan bangunan. Set lengkap termasuk cross brace dan platform.',
    NULL,
    150.00,
    2,
    true
  ),

  -- 3. Ladder Frame Scaffolding
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Perancah Tangga (Ladder Frame)',
    'perancah-tangga',
    'Perancah jenis tangga untuk akses mudah ke ketinggian. Selamat dan stabil, dilengkapi dengan platform kerja. Ketinggian sehingga 4 meter.',
    NULL,
    120.00,
    3,
    true
  ),

  -- 4. Scaffolding Platform / Board
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Papan Platform Perancah (Scaffolding Board)',
    'papan-platform',
    'Papan platform kayu atau aluminium berkualiti tinggi. Tahan beban sehingga 200kg. Saiz standard 2 meter x 0.3 meter. Permukaan anti-gelincir.',
    NULL,
    30.00,
    4,
    true
  ),

  -- 5. Double Width Scaffolding
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Perancah Lebar Berganda (Double Width)',
    'perancah-lebar-berganda',
    'Perancah lebar berganda untuk ruang kerja yang lebih selesa. Platform luas 1.4 meter, sesuai untuk kerja berat dan pasukan besar. Ketinggian sehingga 8 meter.',
    NULL,
    280.00,
    5,
    true
  ),

  -- 6. Scaffolding Wheels / Casters
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Roda Perancah (Scaffolding Casters)',
    'roda-perancah',
    'Set roda berkualiti tinggi dengan brek kunci. Memudahkan pergerakan perancah. Tahan beban berat, sesuai untuk semua jenis perancah mudah alih.',
    NULL,
    40.00,
    6,
    true
  ),

  -- 7. Scaffolding Accessories Set
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Set Aksesori Perancah (Safety Accessories)',
    'set-aksesori-perancah',
    'Set lengkap aksesori keselamatan termasuk safety rail, toe board, netting, dan coupling pin. Memastikan kerja lebih selamat mengikut standard OSHA.',
    NULL,
    80.00,
    7,
    true
  ),

  -- 8. Heavy Duty Scaffolding
  (
    'scaffolding-malaysia.vercel.app',
    NULL,
    'Perancah Tugas Berat (Heavy Duty)',
    'perancah-tugas-berat',
    'Perancah kelas berat untuk projek komersial dan industri. Tahan beban sehingga 400kg per platform. Ketinggian boleh capai 12 meter. Termasuk inspeksi keselamatan.',
    NULL,
    450.00,
    8,
    true
  );
```

**Product Details Summary Table:**

| No. | Product Name (Malay) | Slug | Rental Price (MYR/day) | Description |
|-----|----------------------|------|------------------------|-------------|
| 1 | Perancah Mudah Alih | perancah-mudah-alih | 180.00 | Mobile scaffolding with wheels, adjustable up to 6m |
| 2 | Perancah H-Frame | perancah-h-frame | 150.00 | H-frame scaffolding with cross brace and platform |
| 3 | Perancah Tangga | perancah-tangga | 120.00 | Ladder frame scaffolding, up to 4m height |
| 4 | Papan Platform | papan-platform | 30.00 | Wooden/aluminum scaffolding board, 2m x 0.3m |
| 5 | Perancah Lebar Berganda | perancah-lebar-berganda | 280.00 | Double width scaffolding, 1.4m platform, up to 8m |
| 6 | Roda Perancah | roda-perancah | 40.00 | Heavy-duty casters with brake locks |
| 7 | Set Aksesori Perancah | set-aksesori-perancah | 80.00 | Safety accessories: rails, toe boards, netting |
| 8 | Perancah Tugas Berat | perancah-tugas-berat | 450.00 | Heavy duty scaffolding, 400kg capacity, up to 12m |

**Pricing Notes:**
- All prices are per day rental rates
- Weekly/monthly rates typically offer 20-30% discount
- Free delivery within Klang Valley (minimum order RM300)
- Installation service available at additional cost
- Prices are competitive with Malaysian market rates (RM30-450/day range)

### 2d. `product_photos` — placeholder product images

Product photos will be added after the products are seeded. Use placeholder URLs initially, then replace with actual product images from brand assets or stock photos.

```sql
-- Example: Add photos after products are inserted
-- Replace <product-id> with actual UUID from products table

INSERT INTO product_photos (product_id, url)
VALUES
  -- Mobile Scaffolding
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'perancah-mudah-alih'), 'https://placehold.co/800x600/png?text=Mobile+Scaffolding'),

  -- H-Frame
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'perancah-h-frame'), 'https://placehold.co/800x600/png?text=H-Frame+Scaffolding'),

  -- Ladder Frame
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'perancah-tangga'), 'https://placehold.co/800x600/png?text=Ladder+Frame'),

  -- Platform Board
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'papan-platform'), 'https://placehold.co/800x600/png?text=Scaffolding+Board'),

  -- Double Width
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'perancah-lebar-berganda'), 'https://placehold.co/800x600/png?text=Double+Width'),

  -- Casters
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'roda-perancah'), 'https://placehold.co/800x600/png?text=Scaffolding+Wheels'),

  -- Accessories
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'set-aksesori-perancah'), 'https://placehold.co/800x600/png?text=Safety+Accessories'),

  -- Heavy Duty
  ((SELECT id FROM products WHERE website = 'scaffolding-malaysia.vercel.app' AND slug = 'perancah-tugas-berat'), 'https://placehold.co/800x600/png?text=Heavy+Duty');
```

### 2e. Post-seed verification query

```sql
-- Verify phone number
SELECT website, location_slug, phone_number, label, type, percentage, is_active, whatsapp_text
FROM phone_numbers
WHERE website = 'scaffolding-malaysia.vercel.app';
-- Expected: exactly 1 row
--   location_slug = 'all'
--   phone_number  = '60174287801'
--   label = type  = 'default'
--   percentage    = 100
--   is_active     = true

-- Verify company website registration
SELECT domain, leads_mode, company_id, brand_name
FROM company_websites
WHERE domain = 'scaffolding-malaysia.vercel.app';
-- Expected: exactly 1 row
--   leads_mode = 'single'
--   company_id = '7c15d93f-c2f7-488d-b38c-4b85d65a06d1'

-- Verify products
SELECT id, name, slug, rental_price, sort_order, is_active
FROM products
WHERE website = 'scaffolding-malaysia.vercel.app'
ORDER BY sort_order;
-- Expected: 8 rows (all scaffolding products)

-- Verify product photos
SELECT p.name, p.slug, COUNT(pp.id) as photo_count
FROM products p
LEFT JOIN product_photos pp ON pp.product_id = p.id
WHERE p.website = 'scaffolding-malaysia.vercel.app'
GROUP BY p.id, p.name, p.slug
ORDER BY p.sort_order;
-- Expected: 8 rows, each with photo_count >= 1
```

---

## 3. Query Logic for `leads_mode = 'single'`

Since every WhatsApp CTA on every page hits `/[locale]/redirect-whatsapp-1?loc={slug}`, the single-mode flow is:

1. Read the HTTP `host` header in the route handler.
2. Fetch `leads_mode` from `company_websites` WHERE `domain = host`. For this project that returns `'single'`.
3. Fetch active rows from `phone_numbers` WHERE `website = host` AND `is_active = true`, ordered so the `label = 'default'` row sorts first.
4. Return the first row. Because this project only ever seeds one row, the `loc` query param is intentionally ignored (but accepted for API symmetry with `rotation`/`location`/`hybrid` modes).
5. Redirect to `https://wa.me/{phone_number}?text={encodeURIComponent(whatsapp_text)}` with status `302`.

### Reference SQL (executed from JS via PostgREST)

```sql
-- Resolve the website's leads mode.
SELECT leads_mode
FROM company_websites
WHERE domain = 'scaffolding-malaysia.vercel.app'
LIMIT 1;

-- Fetch the active default number for single mode.
SELECT phone_number, whatsapp_text
FROM phone_numbers
WHERE website   = 'scaffolding-malaysia.vercel.app'
  AND is_active = true
ORDER BY
  CASE WHEN label = 'default' THEN 0 ELSE 1 END,
  created_at ASC
LIMIT 1;
```

Fallback chain used by `getPhoneNumber.ts`:

| Priority | Source | Condition |
|---|---|---|
| 1 | Single default row | `website = host AND is_active = true` returns >= 1 row |
| 2 | Hardcoded fallback | Supabase error, zero rows, or network failure — returns `FALLBACK_PHONE` |

---

## 4. `lib/getPhoneNumber.ts` (complete)

Create `projects/scaffolding-malaysia/lib/getPhoneNumber.ts` with the contents below. It is server-only, imported by `app/[locale]/redirect-whatsapp-1/route.ts`. **No `product_slug` anywhere.** The website is resolved from the HTTP `host` header so the same code works on the Vercel preview domain and any custom domain added later (just seed more rows).

```typescript
// projects/scaffolding-malaysia/lib/getPhoneNumber.ts
// Server-only. Never import from a client component.

import { createClient } from '@supabase/supabase-js'

// ------------------------------------------------------------------
// Hardcoded fallbacks (must match the seeded default row exactly).
// ------------------------------------------------------------------
const FALLBACK_PHONE = '60174287801'
const FALLBACK_WHATSAPP_TEXT =
  'Hi, saya berminat dengan sewa perancah scaffolding.'

// ------------------------------------------------------------------
// Supabase client (anon key — RLS enforces read-only public access).
// ------------------------------------------------------------------
const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface PhoneResult {
  phone: string
  whatsappText: string
}

type LeadsMode = 'single' | 'rotation' | 'location' | 'hybrid'

interface PhoneRow {
  phone_number: string
  whatsapp_text: string | null
  location_slug: string | null
  percentage: number | null
  label: string | null
}

// ------------------------------------------------------------------
// Host normalisation — strip port, lowercase, trim trailing dot.
// ------------------------------------------------------------------
function normaliseHost(host: string): string {
  return host.trim().toLowerCase().split(':')[0].replace(/\.$/, '')
}

function fallback(): PhoneResult {
  return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WHATSAPP_TEXT }
}

// ------------------------------------------------------------------
// Weighted random pick (used by rotation / location / hybrid modes).
// Kept here so the function stays drop-in compatible if the owner
// later switches leads_mode away from 'single'. For single mode it
// is a no-op because we only ever have one active row.
// ------------------------------------------------------------------
function pickWeighted(rows: PhoneRow[]): PhoneRow {
  const weights = rows.map((r) => Math.max(0, r.percentage ?? 0))
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return rows[0]
  let r = Math.random() * total
  for (let i = 0; i < rows.length; i++) {
    r -= weights[i]
    if (r <= 0) return rows[i]
  }
  return rows[rows.length - 1]
}

// ------------------------------------------------------------------
// getPhoneNumber
// Resolves the WhatsApp phone + pre-filled text for the given host.
// Never throws — always returns a usable PhoneResult.
//
// Signature matches the project contract:
//   getPhoneNumber(host, locationSlug?) => { phone, whatsappText }
// The locationSlug argument is accepted for API symmetry with other
// leads modes. In 'single' mode it is ignored (one default row wins).
// ------------------------------------------------------------------
export async function getPhoneNumber(
  host: string,
  locationSlug?: string
): Promise<PhoneResult> {
  if (!host) return fallback()
  const website = normaliseHost(host)

  try {
    // 1. Resolve leads_mode for this website.
    const { data: siteRow, error: siteErr } = await supabase
      .from('company_websites')
      .select('leads_mode')
      .eq('domain', website)
      .maybeSingle()

    if (siteErr) return fallback()

    const leadsMode: LeadsMode =
      (siteRow?.leads_mode as LeadsMode | undefined) ?? 'single'

    // 2. Fetch all active rows for this website.
    // NOTE: no product_slug — this column has been removed from the schema.
    const { data: rows, error: rowsErr } = await supabase
      .from('phone_numbers')
      .select('phone_number, whatsapp_text, location_slug, percentage, label')
      .eq('website', website)
      .eq('is_active', true)

    if (rowsErr || !rows || rows.length === 0) return fallback()

    // 3. Apply leads_mode logic.
    const loc = (locationSlug ?? 'all').trim().toLowerCase()

    let candidates: PhoneRow[] = []
    switch (leadsMode) {
      case 'single': {
        // Prefer the 'default' label, fall back to the first row.
        const sorted = [...rows].sort((a, b) => {
          const aDef = a.label === 'default' ? 0 : 1
          const bDef = b.label === 'default' ? 0 : 1
          return aDef - bDef
        })
        candidates = sorted.slice(0, 1)
        break
      }
      case 'rotation': {
        candidates = rows
        break
      }
      case 'location': {
        const locRows = rows.filter((r) => r.location_slug === loc)
        candidates =
          locRows.length > 0
            ? locRows
            : rows.filter((r) => r.location_slug === 'all')
        break
      }
      case 'hybrid': {
        if (loc && loc !== 'all') {
          candidates = rows.filter((r) => r.location_slug === loc)
          if (candidates.length === 0) {
            candidates = rows.filter((r) => r.location_slug === 'all')
          }
        } else {
          candidates = rows.filter((r) => r.location_slug === 'all')
        }
        break
      }
    }

    if (candidates.length === 0) return fallback()

    const picked = pickWeighted(candidates)
    return {
      phone: picked.phone_number || FALLBACK_PHONE,
      whatsappText: picked.whatsapp_text || FALLBACK_WHATSAPP_TEXT,
    }
  } catch {
    return fallback()
  }
}

// ------------------------------------------------------------------
// waLink helper function
// Builds a WhatsApp URL from a phone number and optional message.
// ------------------------------------------------------------------
export function waLink(phone: string, message?: string): string {
  const encoded = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${encoded}`
}
```

### Usage in the redirect route

```typescript
// projects/scaffolding-malaysia/app/[locale]/redirect-whatsapp-1/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPhoneNumber } from '@/lib/getPhoneNumber'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  const loc = req.nextUrl.searchParams.get('loc') ?? 'all'

  const { phone, whatsappText } = await getPhoneNumber(host, loc)
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`

  return NextResponse.redirect(url, 302)
}
```

---

## 5. Row Level Security (RLS)

`phone_numbers`, `company_websites`, `products`, and `product_photos` are publicly readable but not writable. On the shared instance these policies are already in place from earlier projects; the block below is idempotent and safe to run again.

```sql
-- Enable RLS.
ALTER TABLE phone_numbers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_photos   ENABLE ROW LEVEL SECURITY;

-- Public read on phone_numbers.
DROP POLICY IF EXISTS "Allow public read on phone_numbers" ON phone_numbers;
CREATE POLICY "Allow public read on phone_numbers"
  ON phone_numbers
  FOR SELECT
  TO anon
  USING (true);

-- Public read on company_websites.
DROP POLICY IF EXISTS "Allow public read on company_websites" ON company_websites;
CREATE POLICY "Allow public read on company_websites"
  ON company_websites
  FOR SELECT
  TO anon
  USING (true);

-- Public read on products.
DROP POLICY IF EXISTS "Allow public read on products" ON products;
CREATE POLICY "Allow public read on products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- Public read on product_photos.
DROP POLICY IF EXISTS "Allow public read on product_photos" ON product_photos;
CREATE POLICY "Allow public read on product_photos"
  ON product_photos
  FOR SELECT
  TO anon
  USING (true);

-- No INSERT / UPDATE / DELETE policies for `anon` — writes are denied
-- by default under RLS. Only the service_role (server-side admin panel)
-- bypasses RLS and can mutate rows.
```

---

## 6. Product Data Fetching (CRITICAL)

All product data MUST be fetched dynamically from the Supabase `products` + `product_photos` tables. NEVER hardcode product lists in config files.

### Example: Fetching products on homepage

```typescript
// app/[locale]/page.tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 3600 // ISR: revalidate every 1 hour

async function getProducts(website: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      rental_price,
      sort_order,
      product_photos (url)
    `)
    .eq('website', website)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data
}

export default async function HomePage() {
  const products = await getProducts('scaffolding-malaysia.vercel.app')

  return (
    <main>
      <section className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.product_photos[0]?.url}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">RM {product.rental_price}/hari</p>
          </div>
        ))}
      </section>
    </main>
  )
}
```

### Rules for product data:
1. Homepage and location pages query `products` WHERE `website = domain` AND `is_active = true` ORDER BY `sort_order`
2. Use ISR with `revalidate = 3600` (1 hour) so DB changes propagate without redeploy
3. Grid layout must auto-adjust to any product count — use CSS grid auto-fill
4. Adding a product in the database → it appears on the site automatically (within revalidate window)
5. Setting `is_active = false` or deleting → it disappears automatically
6. Product images come from `product_photos.url` — never hardcode image URLs

---

## 7. Blog Posts Schema Reference

Blog posts are stored in `blog_posts` and `blog_translations` tables (multi-language support).

### `blog_posts` table
- `id` — UUID primary key
- `website` — Vercel domain
- `slug` — URL-friendly identifier
- `published_at` — TIMESTAMPTZ
- `is_active` — boolean
- `featured_image` — image URL
- `author` — author name

### `blog_translations` table
- `id` — UUID primary key
- `post_id` — foreign key to `blog_posts.id`
- `locale` — language code (`ms`, `en`, `zh`)
- `title` — translated title
- `excerpt` — translated excerpt
- `content` — translated full content (markdown)
- `meta_title` — SEO title
- `meta_description` — SEO description

Blog posts are managed by Hanabi agent and inserted before deployment.

---

## 8. Verification Checklist (run before deploy)

- [ ] `.env.local` in the project is a symlink to the repo root `../../.env.local` and `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are loaded.
- [ ] `next.config.ts` calls `loadEnvConfig(process.cwd() + '/../..')`.
- [ ] `information_schema` query confirms `phone_numbers` has NO `product_slug` column.
- [ ] `company_websites` has exactly one row for `scaffolding-malaysia.vercel.app` with `leads_mode = 'single'` and `company_id = '7c15d93f-c2f7-488d-b38c-4b85d65a06d1'`.
- [ ] `phone_numbers` has exactly one row for `scaffolding-malaysia.vercel.app` with `location_slug = 'all'`, `phone_number = '60174287801'`, `label = 'default'`, `type = 'default'`, `percentage = 100`, `is_active = true`, and the seeded `whatsapp_text`.
- [ ] `products` has exactly 8 rows for `scaffolding-malaysia.vercel.app`, all with `is_active = true`, sorted by `sort_order`.
- [ ] `product_photos` has at least 1 photo per product (8 photos minimum).
- [ ] `lib/getPhoneNumber.ts` contains no occurrence of the string `product_slug`.
- [ ] `lib/getPhoneNumber.ts` exports both `getPhoneNumber` and `waLink` functions.
- [ ] Local smoke test: `curl -I http://localhost:3000/ms/redirect-whatsapp-1?loc=all` returns `302` with a `Location` header pointing to `https://wa.me/60174287801?text=...`.
- [ ] Repeat for `loc=kuala-lumpur`, `loc=shah-alam`, `loc=johor-bahru` — all must redirect to the same `60174287801` number (single mode).
- [ ] PostgREST smoke test: `curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/phone_numbers?website=eq.scaffolding-malaysia.vercel.app&select=phone_number,whatsapp_text,label,type" -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"` returns the seeded row.
- [ ] PostgREST products test: `curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/products?website=eq.scaffolding-malaysia.vercel.app&is_active=eq.true&select=name,slug,rental_price" -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"` returns all 8 products.
- [ ] When a custom domain is added later (e.g. `scaffolding.my`), re-seed `company_websites` and `phone_numbers` rows with that `domain` / `website` value. The code needs no change.
- [ ] `FALLBACK_PHONE` in `getPhoneNumber.ts` === `60174287801` (matches the seeded row; not a placeholder).
- [ ] Vercel project env vars match `.env.local` (`vercel env add NEXT_PUBLIC_SUPABASE_URL`, `vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY`).

Once every box is ticked, hand off to Layla for deployment.

---

## 9. Summary

### What Cyclops delivers:
1. Complete `lib/getPhoneNumber.ts` with `waLink()` helper function
2. SQL seed statements for:
   - 1 company_websites row (single leads mode)
   - 1 phone_numbers row (default number with Malay WhatsApp text)
   - 8 products rows (complete scaffolding rental catalog)
   - 8 product_photos rows (placeholder images, to be replaced)
3. Verification queries and checklist
4. Product recommendations with Malaysian market pricing

### Next steps:
- Nana: Write homepage and location page copy
- Kimmy: Implement i18n translations (ms, en, zh)
- Kagura: Design unique layout and replace placeholder product images
- Hanabi: Generate blog posts before deployment
- Layla: Run verification checklist, deploy to Vercel

### Critical reminders:
- Column is `website` NOT `website_slug`
- Default uses `location_slug = 'all'` NOT null
- Use actual domain: `scaffolding-malaysia.vercel.app`
- Leads mode: single (always return one number)
- Fallback phone: 60174287801
- Products are dynamically fetched — NEVER hardcode product lists
- All prices in MYR, all default text in Malay (ms)
