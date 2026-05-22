# Wall Panel Malaysia — Database Document (Cyclops Part 1: SPEC)

**Agent:** Cyclops (Database Engineer)
**Owner Company:** Encik Beku Aircond Sdn. Bhd. (`16e62068-365d-4907-b7f0-763a173d8afa`)
**Domain:** `wall-panel-malaysia.vercel.app`
**Brand:** Wall Panel Malaysia
**Leads mode:** `single`
**Default phone:** `601116655300`
**Languages:** `en` (default + `x-default`) / `ms` / `zh`
**Supabase instance:** Shared multi-tenant (repo root `.env.local`, symlinked per project)
**Date:** 2026-05-11

> This document is **Part 1 — spec only**. No SQL is executed here. Cyclops Part 2 runs AFTER Gate 1 (design approval) and inserts the seed rows, product photos, and verifies everything end-to-end.

---

## 0. Hard Rules — No Schema Changes

1. **Reuse the shared Supabase tables.** Do NOT create, alter, or rename any table. Do NOT add columns. Do NOT add unique constraints. The webcore admin owns the schema; sites only insert rows scoped by `website = 'wall-panel-malaysia.vercel.app'`.
2. **Tables touched by this project (rows only):**
   - `company_websites` — 1 row
   - `phone_numbers` — 1 row
   - `products` — 7 rows (no parents; see hierarchy decision in §2)
   - `product_photos` — ≥ 2 rows per product (≥ 14 total)
   - `blog_posts` + `blog_translations` — populated by Hanabi after Gate 1 (Cyclops only verifies the tables accept this domain)
3. **Never reference the removed `product_slug` column** anywhere (`phone_numbers` does NOT have it; `products` uses `slug`, which is different and still valid).
4. **All reads** flow through `lib/webcore.ts` (Kimmy implements). No `lib/supabase.ts`, no `lib/getProducts.ts`, no `lib/getPhoneNumber.ts`, no `lib/getBlogPosts.ts`.
5. **Cache invalidation** is tag-based only — `webcore-products`, `webcore-phones`, `webcore-blog`. No `export const revalidate = N` anywhere except the WhatsApp redirect handler (`dynamic = 'force-dynamic'` + `revalidate = 0`).

---

## 1. Schema Reuse — Tables & Columns Touched

### 1a. `products` (existing — DO NOT recreate)

Canonical columns used in this project:

| Column | Type | Used for |
|---|---|---|
| `id` | UUID PK | Returned to `product_photos.product_id` |
| `website` | text | Always `'wall-panel-malaysia.vercel.app'` |
| `parent_id` | UUID nullable | **All NULL in this project** (see §2 — no parent rows) |
| `name` | text | Display name, e.g. `"Wood Wall Panel"` |
| `slug` | text | URL-safe, e.g. `"wood-wall-panel"` |
| `description` | text | Marketing copy (Nana writes final EN; Kimmy adds MS/ZH at app layer via i18n keys, NOT in DB — this matches every prior project) |
| `sale_price` | numeric | **Stores the promo per-sqft price** in MYR (whole number, e.g. `25`, `38`) |
| `rental_price` | numeric nullable | **NULL** for every row — this is a sale+install service, not rental |
| `sort_order` | integer | Ascending display order (10, 20, 30, …, 70) |
| `is_active` | boolean | `true` for all seeded rows |

### 1b. `product_photos` (existing — DO NOT recreate)

| Column | Type | Used for |
|---|---|---|
| `product_id` | UUID FK → products.id | Links photo to product |
| `url` | text | Pexels / Unsplash / brand-asset URL (no watermarks, no placeholders) |

### 1c. `phone_numbers` (existing — DO NOT recreate, NO `product_slug`)

| Column | Used for |
|---|---|
| `website` | `'wall-panel-malaysia.vercel.app'` |
| `location_slug` | `'all'` (string — NEVER null — convention for default row) |
| `phone_number` | `'601116655300'` |
| `whatsapp_text` | Pre-filled MS message (see §3b) |
| `percentage` | `100` |
| `label` | `'default'` |
| `type` | `'default'` |
| `is_active` | `true` |

### 1d. `company_websites` (existing — DO NOT recreate)

| Column | Used for |
|---|---|
| `company_id` | `'16e62068-365d-4907-b7f0-763a173d8afa'` (Encik Beku Aircond Sdn. Bhd.) |
| `domain` | `'wall-panel-malaysia.vercel.app'` |
| `leads_mode` | `'single'` |
| `brand_name` | `'Wall Panel Malaysia'` (optional metadata — set if column exists) |

### 1e. `blog_posts` + `blog_translations` (existing)

Hanabi inserts 10+ posts × 3 locales after Gate 1. Cyclops Part 2 only verifies the tables accept inserts for this domain — no seeding from Cyclops.

---

## 2. Product Hierarchy Plan — Decision: **7 standalone rows, no parent rows**

### Decision

Insert **7 standalone product rows** (one per variant). **No `Standard Wall Panel` parent row, no `Marble Wall Panel` parent row** — every `parent_id` is `NULL`.

### Rationale

The `tablechair-rental-malaysia` reference seeds each rentable SKU as its own row with `parent_id = NULL`; `getProducts()` returns a flat array ordered by `sort_order` and the ProductGrid renders each row as one card. Adding parent rows would either:
- create duplicate cards (parent + children both rendered), OR
- require frontend filtering on `parent_id IS NULL` that no other site uses.

The `Standard` vs `Marble` family grouping is communicated in the UI through **section eyebrows** and **product descriptions** that include the family name (e.g. `"Part of the Standard Wall Panel family."`). The 7 rows display cleanly in a 3- or 4-column grid (4 + 3 fills evenly on desktop; 2 + 2 + 2 + 1 acceptable on tablet; stacked on mobile) — Kagura confirms the final grid template.

### Sort order — fixed

| sort_order | Slug | Display name | Family |
|---|---|---|---|
| 10 | `wood-wall-panel` | Wood Wall Panel | Standard |
| 20 | `fluted-wall-panel` | Fluted Wall Panel | Standard |
| 30 | `pvc-wall-panel` | PVC Wall Panel | Standard |
| 40 | `acoustic-wall-panel` | Acoustic Wall Panel | Standard |
| 50 | `gold-marble-wall-panel` | Gold Marble Wall Panel | Marble |
| 60 | `silver-marble-wall-panel` | Silver Marble Wall Panel | Marble |
| 70 | `black-marble-wall-panel` | Black Marble Wall Panel | Marble |

The grid renders Standard variants first, then Marble variants — matches the source brand asset's left-to-right reading order.

### Pricing storage — per-sqft promo price in `sale_price`

`products` only exposes `sale_price` (numeric) and `rental_price` (numeric) — there is no `market_price` or `our_price` column. The market/our anchor prices are NOT stored in the DB. They are configured in the frontend as constants per family (used by `PromoPricingSection` and the `PriceTag` component) so we can display the `Market RM50 → Our RM30 → Promo RM25` ladder without inventing new schema.

| Family | `sale_price` (DB) | Frontend constants (NOT in DB) |
|---|---|---|
| Standard variants (Wood / Fluted / PVC / Acoustic) | `25` | `marketPrice: 50`, `ourPrice: 30` |
| Marble variants (Gold / Silver / Black) | `38` | `marketPrice: 48`, `ourPrice: 48` |

All values are MYR per sqft. **No sen / cents conversion** — the existing webcore convention is to store whole-ringgit numerics in `sale_price`, matching `tablechair-rental-malaysia` and `service-aircond-malaysia`. The product card and `PromoPricingSection` render `RM ${sale_price}/sqft`.

`rental_price` is `NULL` for every row. **Heads-up for Kimmy:** `getProducts()` in the tablechair reference splits results into `{ core, additional }` where `core` = `rental_price !== null`. Because this site is sale-only, the wall-panel `webcore.ts` must either (a) split on `sale_price !== null` instead, or (b) return a single flat `core` array and drop the `additional` bucket. Either approach is safe; document the choice in the implementation PR.

### Description copy — family-aware

Cyclops Part 2 will write the EN description for each row at insert time. Pattern:

> `"{Variant} finish from our Standard Wall Panel range. Premium 12mm panels with hidden-clip mounting and free installation across Malaysia."`

> `"{Colour} finish from our Marble Wall Panel range. PU marble texture with gloss top-coat, suitable for feature walls in homes and offices."`

(Nana may rewrite these in `content.md` after the design lock — that's fine; Cyclops Part 2 will re-run the UPDATE using Nana's final copy before deploy.)

---

## 3. SQL Seed Plan — Exact INSERTs for Cyclops Part 2

> Do **NOT** execute these in Part 1. They are the contract.
> All statements use `ON CONFLICT DO UPDATE` where a unique constraint exists, or `WHERE NOT EXISTS` otherwise — idempotent and safe to re-run during deploy.

### 3a. `company_websites` — 1 row

```sql
INSERT INTO company_websites (company_id, domain, leads_mode, brand_name)
VALUES (
  '16e62068-365d-4907-b7f0-763a173d8afa',
  'wall-panel-malaysia.vercel.app',
  'single',
  'Wall Panel Malaysia'
)
ON CONFLICT (domain) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  leads_mode = EXCLUDED.leads_mode,
  brand_name = EXCLUDED.brand_name;
```

> If the deployed `company_websites` table does not have a `brand_name` column on this shared instance, Cyclops Part 2 must drop that column from the INSERT before running. The other three columns are guaranteed.

### 3b. `phone_numbers` — 1 default row

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
  'wall-panel-malaysia.vercel.app',
  'all',
  '601116655300',
  'Hi Wall Panel Malaysia, saya berminat dengan pemasangan wall panel. Boleh saya tahu pakej promosi & cara tempahan?',
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

> If the unique constraint `(website, location_slug, phone_number)` does not exist on the shared table, Cyclops Part 2 drops the `ON CONFLICT` clause and prepends `WHERE NOT EXISTS (SELECT 1 FROM phone_numbers WHERE website = '...' AND location_slug = 'all')`. Do NOT add a unique constraint — the admin panel owns the schema.

### 3c. `products` — 7 rows

```sql
-- Standard Wall Panel family (sale_price = 25 RM/sqft, no parent)
INSERT INTO products
  (website, parent_id, name, slug, description, sale_price, rental_price, sort_order, is_active)
VALUES
  ('wall-panel-malaysia.vercel.app', NULL, 'Wood Wall Panel',     'wood-wall-panel',     'Wood finish from our Standard Wall Panel range. Premium 12mm panels with hidden-clip mounting and free installation across Malaysia.',     25, NULL, 10, true),
  ('wall-panel-malaysia.vercel.app', NULL, 'Fluted Wall Panel',   'fluted-wall-panel',   'Fluted finish from our Standard Wall Panel range. Vertical-groove texture that adds rhythm and depth to feature walls.',                 25, NULL, 20, true),
  ('wall-panel-malaysia.vercel.app', NULL, 'PVC Wall Panel',      'pvc-wall-panel',      'PVC finish from our Standard Wall Panel range. Water-resistant, easy-clean panels for kitchens, bathrooms, and humid spaces.',         25, NULL, 30, true),
  ('wall-panel-malaysia.vercel.app', NULL, 'Acoustic Wall Panel', 'acoustic-wall-panel', 'Acoustic finish from our Standard Wall Panel range. Sound-absorbing felt + slat front for offices, studios, and home theatres.',     25, NULL, 40, true),

-- Marble Wall Panel family (sale_price = 38 RM/sqft, no parent)
  ('wall-panel-malaysia.vercel.app', NULL, 'Gold Marble Wall Panel',   'gold-marble-wall-panel',   'Gold finish from our Marble Wall Panel range. Gloss or PU marble texture, perfect for luxury living rooms and reception walls.',   38, NULL, 50, true),
  ('wall-panel-malaysia.vercel.app', NULL, 'Silver Marble Wall Panel', 'silver-marble-wall-panel', 'Silver finish from our Marble Wall Panel range. Cool-tone gloss marble texture that pairs cleanly with modern minimalist interiors.', 38, NULL, 60, true),
  ('wall-panel-malaysia.vercel.app', NULL, 'Black Marble Wall Panel',  'black-marble-wall-panel',  'Black finish from our Marble Wall Panel range. Deep-vein gloss marble for dramatic feature walls in boardrooms and lounges.',     38, NULL, 70, true)

ON CONFLICT (website, slug) DO UPDATE SET
  name         = EXCLUDED.name,
  description  = EXCLUDED.description,
  sale_price   = EXCLUDED.sale_price,
  rental_price = EXCLUDED.rental_price,
  sort_order   = EXCLUDED.sort_order,
  is_active    = EXCLUDED.is_active,
  parent_id    = EXCLUDED.parent_id
RETURNING id, slug;
```

> If `(website, slug)` is not a unique constraint on the shared `products` table, Cyclops Part 2 drops `ON CONFLICT` and wraps each row in `INSERT ... SELECT ... WHERE NOT EXISTS (SELECT 1 FROM products WHERE website = '...' AND slug = '...')`. The `RETURNING id, slug` clause is used to capture the new UUIDs for the `product_photos` step.

### 3d. `product_photos` — placeholder URLs (real photos picked in Part 2)

Cyclops Part 2 captures the 7 returned UUIDs from §3c and runs one INSERT per photo. **Placeholder URLs below — Cyclops Part 2 swaps each one for a real Pexels/Unsplash image of the matching style** (no watermarks, no `via.placeholder.com`, no Lorem-Picsum, no Tailwind blue stock). Minimum 2 photos per product (hero + detail); aim for 3 where a strong second angle exists.

```sql
INSERT INTO product_photos (product_id, url) VALUES
  -- Wood Wall Panel (replace URLs in Part 2)
  ('<wood-id>',     'https://images.pexels.com/photos/<wood-1>.jpeg'),
  ('<wood-id>',     'https://images.pexels.com/photos/<wood-2>.jpeg'),

  -- Fluted Wall Panel
  ('<fluted-id>',   'https://images.pexels.com/photos/<fluted-1>.jpeg'),
  ('<fluted-id>',   'https://images.pexels.com/photos/<fluted-2>.jpeg'),

  -- PVC Wall Panel
  ('<pvc-id>',      'https://images.pexels.com/photos/<pvc-1>.jpeg'),
  ('<pvc-id>',      'https://images.pexels.com/photos/<pvc-2>.jpeg'),

  -- Acoustic Wall Panel
  ('<acoustic-id>', 'https://images.pexels.com/photos/<acoustic-1>.jpeg'),
  ('<acoustic-id>', 'https://images.pexels.com/photos/<acoustic-2>.jpeg'),

  -- Gold Marble Wall Panel
  ('<gold-id>',     'https://images.pexels.com/photos/<gold-1>.jpeg'),
  ('<gold-id>',     'https://images.pexels.com/photos/<gold-2>.jpeg'),

  -- Silver Marble Wall Panel
  ('<silver-id>',   'https://images.pexels.com/photos/<silver-1>.jpeg'),
  ('<silver-id>',   'https://images.pexels.com/photos/<silver-2>.jpeg'),

  -- Black Marble Wall Panel
  ('<black-id>',    'https://images.pexels.com/photos/<black-1>.jpeg'),
  ('<black-id>',    'https://images.pexels.com/photos/<black-2>.jpeg');
```

### 3e. RLS — verify only, do not re-create

The shared instance already has public-read RLS on `products`, `product_photos`, `phone_numbers`, `company_websites`, `blog_posts`, `blog_translations` (set up by earlier projects). Cyclops Part 2 verifies the anon key can SELECT — no DDL.

```sql
-- Verification (run as anon via REST, not the SQL editor):
SELECT id, name, slug FROM products
WHERE website = 'wall-panel-malaysia.vercel.app'
ORDER BY sort_order;
```

If the verification returns 0 rows from the anon key but ≥ 7 rows from the service key, RLS is mis-configured for this domain and Cyclops Part 2 must escalate before deploy.

---

## 4. Webcore Query Shapes — Exact REST URLs

All three reads go through `fetch()` against `{SUPABASE_URL}/rest/v1/...` with `apikey` + `Authorization: Bearer` headers (anon key) and a `next.tags` entry.

### 4a. Products — tag `webcore-products`

```
GET {SUPABASE_URL}/rest/v1/products
  ?select=*,product_photos(url)
  &website=eq.wall-panel-malaysia.vercel.app
  &is_active=eq.true
  &order=sort_order.asc
```

Fetch options:
```js
{
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Accept: 'application/json',
  },
  next: { tags: ['webcore-products'] },
}
```

Expected response: array of 7 objects, each with embedded `product_photos: [{ url }, ...]`. Frontend treats every row as "core" — there is no `additional` bucket on this site because `rental_price` is `NULL` for everything.

### 4b. Phone numbers — tag `webcore-phones`

Two fetches per WhatsApp redirect, both server-side from `lib/webcore.ts`:

**(1) Resolve leads_mode for the host:**
```
GET {SUPABASE_URL}/rest/v1/company_websites
  ?select=leads_mode
  &domain=eq.wall-panel-malaysia.vercel.app
  &limit=1
```

**(2) Fetch active phone rows for the host:**
```
GET {SUPABASE_URL}/rest/v1/phone_numbers
  ?select=phone_number,whatsapp_text,percentage,label,location_slug
  &website=eq.wall-panel-malaysia.vercel.app
  &is_active=eq.true
```

Both calls use `next: { tags: ['webcore-phones'] }`.

### 4c. Blog — tag `webcore-blog`

Listing query (per locale):
```
GET {SUPABASE_URL}/rest/v1/blog_posts
  ?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,excerpt)
  &website=eq.wall-panel-malaysia.vercel.app
  &status=eq.published
  &blog_translations.language=eq.{locale}
  &order=published_at.desc
```

Single post query:
```
GET {SUPABASE_URL}/rest/v1/blog_posts
  ?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)
  &website=eq.wall-panel-malaysia.vercel.app
  &slug=eq.{slug}
  &status=eq.published
  &blog_translations.language=eq.{locale}
  &limit=1
```

Both use `next: { tags: ['webcore-blog'] }`. Pattern is identical to `tablechair-rental-malaysia/lib/webcore.ts`.

---

## 5. `leads_mode = 'single'` — Behaviour

**Contract:** `single` always returns the row with `label = 'default'` (or the first active row if no `default` label is present), regardless of the `loc` query parameter on the WhatsApp redirect.

**Flow per WhatsApp click:**
1. User clicks WhatsApp CTA → navigates to `/[locale]/redirect-whatsapp-1?loc={slug}`.
2. Server component calls `getPhoneNumber(loc)` from `lib/webcore.ts`.
3. Webcore reads `host` from `headers()` → `wall-panel-malaysia.vercel.app`.
4. Webcore fetches `leads_mode` → `'single'`.
5. Webcore fetches all active rows for the host → returns the 1 seeded row.
6. `single` branch picks the `label = 'default'` row → `phone_number = '601116655300'`.
7. Builds `https://wa.me/601116655300?text={encoded whatsapp_text}` → client `window.location.href`.

**Why `single` is correct for this project:** the inputs.md confirms a single WhatsApp number for nationwide enquiries. The owner can switch to `rotation` / `location` / `hybrid` later in the admin without any code change — the full 4-mode logic in `webcore.ts` is preserved.

**Test SLAs:**
- `?loc=all`, `?loc=kuala-lumpur`, `?loc=kuching` — **all three** must redirect to `wa.me/601116655300`. If any returns a different number, the seed is wrong or `leads_mode` is not `single`.

---

## 6. Verification Queries — Layla's Pre-Deploy Checklist

Run all of these from the Supabase SQL Editor (service role) AND via `curl` against the REST API (anon key). Both must return matching results.

### 6a. Schema sanity

```sql
-- Confirm phone_numbers has NO product_slug column.
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'phone_numbers'
ORDER BY ordinal_position;
-- Expected: id, website, location_slug, phone_number, whatsapp_text, percentage, label, type, is_active, created_at
-- product_slug must NOT appear.

-- Confirm products has parent_id, slug, sale_price, rental_price, sort_order.
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products'
ORDER BY ordinal_position;
```

### 6b. Company / domain row

```sql
SELECT company_id, domain, leads_mode
FROM company_websites
WHERE domain = 'wall-panel-malaysia.vercel.app';
-- Expected: exactly 1 row
--   company_id = '16e62068-365d-4907-b7f0-763a173d8afa'
--   leads_mode = 'single'
```

### 6c. Phone number row

```sql
SELECT website, location_slug, phone_number, label, type, percentage, is_active, whatsapp_text
FROM phone_numbers
WHERE website = 'wall-panel-malaysia.vercel.app';
-- Expected: exactly 1 row
--   location_slug = 'all'
--   phone_number  = '601116655300'
--   label = type  = 'default'
--   percentage    = 100
--   is_active     = true
--   whatsapp_text begins with 'Hi Wall Panel Malaysia,'
```

### 6d. Products + photos

```sql
SELECT
  p.id,
  p.slug,
  p.name,
  p.sale_price,
  p.rental_price,
  p.sort_order,
  p.is_active,
  p.parent_id,
  COUNT(ph.url) AS photo_count
FROM products p
LEFT JOIN product_photos ph ON ph.product_id = p.id
WHERE p.website = 'wall-panel-malaysia.vercel.app'
GROUP BY p.id
ORDER BY p.sort_order;
-- Expected: exactly 7 rows
--   slugs in order: wood-wall-panel, fluted-wall-panel, pvc-wall-panel, acoustic-wall-panel,
--                   gold-marble-wall-panel, silver-marble-wall-panel, black-marble-wall-panel
--   sale_price: 25 / 25 / 25 / 25 / 38 / 38 / 38
--   rental_price: NULL for every row
--   parent_id: NULL for every row
--   is_active: true for every row
--   photo_count: >= 2 for every row
```

### 6e. Public REST smoke tests (anon key)

```bash
# Products endpoint — must return the same 7 rows the SQL Editor returns.
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/products?select=*,product_photos(url)&website=eq.wall-panel-malaysia.vercel.app&is_active=eq.true&order=sort_order.asc" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  | jq 'length, [.[].slug]'
# Expected: 7
#           ["wood-wall-panel","fluted-wall-panel","pvc-wall-panel","acoustic-wall-panel","gold-marble-wall-panel","silver-marble-wall-panel","black-marble-wall-panel"]

# Phone numbers endpoint
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/phone_numbers?select=phone_number,whatsapp_text,label&website=eq.wall-panel-malaysia.vercel.app&is_active=eq.true" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"
# Expected: 1 row with phone_number = "601116655300"

# Leads mode endpoint
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/company_websites?select=leads_mode&domain=eq.wall-panel-malaysia.vercel.app&limit=1" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"
# Expected: [{"leads_mode":"single"}]
```

### 6f. Live redirect smoke test

```bash
# After Vercel deploy
curl -I "https://wall-panel-malaysia.vercel.app/en/redirect-whatsapp-1?loc=all"
curl -I "https://wall-panel-malaysia.vercel.app/en/redirect-whatsapp-1?loc=kuala-lumpur"
curl -I "https://wall-panel-malaysia.vercel.app/en/redirect-whatsapp-1?loc=kuching"
# Expected for all three: 302 redirect to https://wa.me/601116655300?text=...
```

### 6g. Webcore revalidate webhook

```bash
curl -i -X POST https://wall-panel-malaysia.vercel.app/api/revalidate \
  -H "x-webcore-secret: $WEBCORE_REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-products"]}'
# Expected: 200 {"revalidated":["webcore-products"]}
# 401 = secret mismatch  |  404 = handler missing  |  500 = env var not set / deployment stale
```

### 6h. Final checklist (Layla ticks before deploy)

- [ ] `information_schema` confirms `phone_numbers.product_slug` does NOT exist.
- [ ] `company_websites` has exactly 1 row for the domain with `leads_mode = 'single'`.
- [ ] `phone_numbers` has exactly 1 row for the domain with `location_slug = 'all'`, `phone_number = '601116655300'`, `label = type = 'default'`, `percentage = 100`, `is_active = true`.
- [ ] `products` has exactly 7 rows for the domain, slugs and `sort_order` match §2, `sale_price` = 25 (Standard) / 38 (Marble), `rental_price` = NULL for all, `parent_id` = NULL for all.
- [ ] `product_photos` has ≥ 2 rows per product (≥ 14 total) with real (non-placeholder) URLs.
- [ ] Anon REST smoke tests in §6e match SQL Editor results.
- [ ] Three live redirect tests in §6f all return `302` → `wa.me/601116655300`.
- [ ] `/api/revalidate` returns `200` with the correct secret and `401` without.
- [ ] No code in `projects/wall-panel-malaysia` references the string `product_slug`.
- [ ] `lib/webcore.ts` exists; `lib/supabase.ts`, `lib/getProducts.ts`, `lib/getPhoneNumber.ts`, `lib/getBlogPosts.ts` do NOT exist.
- [ ] No `export const revalidate = N` anywhere except `app/[locale]/redirect-whatsapp-1/page.tsx`.

When every box is ticked, hand back to Layla for the production deploy.

---

## 7. Handoff Notes

**To Kimmy (technical implementation):**
- The wall-panel `getProducts()` returns 7 rows with `rental_price = NULL`. The tablechair-template split on `rental_price !== null` will mark all 7 as `additional` — **change the split**. Recommended: return `{ core: products, additional: [] }` OR split on `sale_price !== null`. Pick whichever keeps the ProductGrid component contract unchanged.
- The market/our anchor prices live in frontend constants (not the DB). Define them in `config/site.ts` as e.g.
  ```ts
  productPricing: {
    standard: { marketPrice: 50, ourPrice: 30, promoPrice: 25 },
    marble:   { marketPrice: 48, ourPrice: 48, promoPrice: 38 },
  }
  ```
  `PromoPricingSection` reads from this; `PriceTag` falls back to `product.sale_price`.

**To Nana (copywriter):**
- DB descriptions are placeholder copy written by Cyclops. Nana writes final EN descriptions in `content.md`; Cyclops Part 2 re-runs the UPDATE before deploy. MS and ZH descriptions stay in `messages/{ms,zh}.json` as i18n keys keyed by product slug — they do NOT go into the DB (no `description_ms` / `description_zh` columns exist).

**To Hanabi (blog writer):**
- Tables `blog_posts` + `blog_translations` are unchanged. Insert with `website = 'wall-panel-malaysia.vercel.app'`, `status = 'published'`, and one `blog_translations` row per locale (`en` / `ms` / `zh`). After insert, hit `/api/revalidate` with `{"tags":["webcore-blog"]}` to refresh the listing.

**To Layla (QA & deployment):**
- Cyclops Part 2 must complete §3a–§3d AND swap every placeholder photo URL for a real one BEFORE Layla runs §6. Layla blocks deploy if any photo URL still contains `<placeholder>` / `via.placeholder.com` / `picsum`.

**To future Cyclops Part 2 (you, after Gate 1):**
1. Run §3a, §3b — verify with §6b, §6c.
2. Run §3c with `RETURNING id, slug` — capture the 7 UUIDs into a temp map.
3. Source 14+ real Pexels/Unsplash photos for each style — verify no watermarks, ≥ 1200px wide.
4. Run §3d with the captured UUIDs and real URLs.
5. Run §6d, §6e — confirm 7 products + ≥ 14 photos visible to anon key.
6. Hand back to Layla with a short report: row counts, photo URLs, any deviations from this spec.

---

**End of Cyclops Part 1 spec. No SQL has been executed. Gate 1 (design approval) must pass before Part 2 runs.**
