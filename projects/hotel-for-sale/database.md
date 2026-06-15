# Database — Abang Excavator (sewa-excavator)

> Database engineer: **Cyclops**
> Project slug: `sewa-excavator`
> Domain: `sewa-excavator.vercel.app`
> Company: Utopia Holiday Sdn. Bhd. (`f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c`)
> Leads mode: `single`
> Reference data layer: `projects/tablechair-rental-malaysia/lib/webcore.ts` (canonical webcore pattern)
> Scope: All shared-schema inserts for launch — `company_websites`, `phone_numbers`, `products`, `product_photos`. Calculator multipliers, webcore column map, and verification queries included.

---

## 0. Schema reference (no schema changes)

The shared Supabase database already contains every table this project needs. **No migrations or schema edits are required.** Abang Excavator is registered exclusively via the `website` / `domain` columns.

| Table | Purpose | Key columns used here |
|---|---|---|
| `companies` | Master list of Utopia Group companies | `id` — Utopia Holiday's row is `f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c` |
| `company_websites` | Maps a Vercel domain to a company + leads mode | `company_id`, `domain`, `leads_mode` |
| `phone_numbers` | WhatsApp routing rows (multi-tenant by `website`) | `website`, `location_slug`, `phone_number`, `whatsapp_text`, `percentage`, `label`, `type`, `is_active` |
| `products` | Product/service catalog (multi-tenant by `website`) | `id`, `website`, `parent_id`, `name`, `slug`, `description`, `sale_price`, `rental_price`, `sort_order`, `is_active` |
| `product_photos` | One-to-many photos per product | `product_id` (FK → `products.id`), `url` |
| `blog_posts` | Article shells (Hanabi, Step 11) | `id`, `website`, `slug`, `cover_image_url`, `status`, `published_at` |
| `blog_translations` | Per-locale article body (ms / en / zh) | `blog_post_id` (FK), `language`, `title`, `content`, `excerpt`, `meta_title`, `meta_description` |

### Hard rules (from CLAUDE.md + agent spec)

- The column is **`website`**, never `website_slug`.
- The default / homepage row uses **`location_slug = 'all'`** (a literal string, **never `NULL`**).
- The deployed domain string is **`sewa-excavator.vercel.app`** — exact match, no scheme, no trailing slash.
- The removed `product_slug` column must not appear in any SQL or code.
- `parent_id = NULL` on the two product rows — rental period (daily/weekly/monthly) is computed in the front-end `<RentalCalculator>`, **not** modelled as DB variants.
- `sale_price = NULL` on both products — this is a rental-only site. `rental_price` stores the **daily** rate (other periods are derived in §5).
- All inserts in this document are intended to be run in the Supabase SQL editor (service role context — bypasses RLS).

---

## 1. `company_websites` — 1 row

```sql
INSERT INTO company_websites (
  company_id,
  domain,
  leads_mode
) VALUES (
  'f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c',
  'sewa-excavator.vercel.app',
  'single'
);
```

- Links the Vercel deployment domain to Utopia Holiday Sdn. Bhd.
- `leads_mode = 'single'` per confirmed inputs — the lone default row in `phone_numbers` is always returned. The schema supports flipping to `rotation` / `location` / `hybrid` later without redeploying.

---

## 2. `phone_numbers` — 1 row (default, leads_mode = single)

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
) VALUES (
  'sewa-excavator.vercel.app',
  'all',
  '60174287801',
  'Hi Abang Excavator, saya berminat untuk sewa excavator. Boleh dapatkan sebut harga?',
  100,
  'default',
  'default',
  true
);
```

- `location_slug = 'all'` is the literal string used by webcore as the default-row marker.
- `percentage = 100` even in `single` mode — harmless; the field is only consulted by `pickWeighted()` in rotation/location/hybrid modes.
- `whatsapp_text` is in Bahasa Melayu (default locale). `getPhoneNumber()` prepends a `Hi {host}, ` prefix at runtime; the message forwards into wa.me regardless of the user's UI locale.

---

## 3. `products` — 2 rows (Volvo EC200 + Volvo EC400)

> **All prices below are PROPOSAL — confirm with user.** Pricing is benchmarked against the 2026 Malaysian excavator rental market (EC200 / 20-tonne class ~RM 800–1,200/day; EC400 / 40-tonne class ~RM 1,400–2,000/day). The figures sit mid-band so the calculator quotes feel competitive without anchoring too low.
>
> `description` text is in Bahasa Melayu (default locale), ≤15 words, ≤2 lines per Frontend Design Rules. Longer editorial copy lives on the page (Nana), not in the DB.

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
) VALUES
  (
    'sewa-excavator.vercel.app',
    NULL,
    'Volvo EC200',
    'volvo-ec200',
    'Excavator 20 tan Volvo EC200 untuk kerja tapak bina sederhana. Sewa harian, mingguan atau bulanan dengan operator.',
    NULL,
    1000.00,   -- PROPOSAL — confirm with user (RM/day, mid-band for 20-tonne class)
    1,
    true
  ),
  (
    'sewa-excavator.vercel.app',
    NULL,
    'Volvo EC400',
    'volvo-ec400',
    'Excavator 40 tan Volvo EC400 berkuasa tinggi untuk projek besar dan kerja tanah berat seluruh Malaysia.',
    NULL,
    1700.00,   -- PROPOSAL — confirm with user (RM/day, mid-band for 40-tonne class)
    2,
    true
  );
```

### Field rationale

| Field | Value | Why |
|---|---|---|
| `parent_id` | `NULL` | No DB-modelled variants. Daily/weekly/monthly are computed by the calculator (see §5). |
| `sale_price` | `NULL` | Rental-only site. |
| `rental_price` | `1000.00` (EC200) / `1700.00` (EC400) | **PROPOSAL** — RM/day. Sits inside webcore's `core` bucket (rental_price NOT NULL). |
| `sort_order` | `1`, `2` | EC200 first (entry-level class), EC400 second (heavy-duty). |
| `is_active` | `true` | Surfaces on homepage + location pages immediately. |
| `slug` | `volvo-ec200`, `volvo-ec400` | Stable, URL-safe — used by tracking labels (`product-volvo-ec200`) and any future product-detail route. |

### Capturing the inserted IDs for §4

Each insert auto-generates a `uuid` for `products.id`. Capture them in the SQL editor before running §4:

```sql
SELECT id, name, slug, rental_price
FROM products
WHERE website = 'sewa-excavator.vercel.app'
ORDER BY sort_order;
```

Note the `id` for `volvo-ec200` → `<EC200_ID>`, and `volvo-ec400` → `<EC400_ID>`, then substitute into §4.

---

## 4. `product_photos` — 2 rows (one per product)

The two source photos live in `projects/sewa-excavator/brand_assets/`. During the build step they are uploaded to Supabase Storage under the public bucket `product-photos`, then linked from `product_photos.url`. Use the URL pattern below — Layla / the build step replaces the placeholders with real public URLs after upload.

```sql
INSERT INTO product_photos (product_id, url) VALUES
  (
    '<EC200_ID>',
    'https://xzydvhzcngpxdbyniliy.supabase.co/storage/v1/object/public/product-photos/sewa-excavator/exc-ec200e-t4f-2-w-lf-1000x1000.jpg'
  ),
  (
    '<EC400_ID>',
    'https://xzydvhzcngpxdbyniliy.supabase.co/storage/v1/object/public/product-photos/sewa-excavator/volvo-show-crawler-excavator-ec400f-sv-t4f-2324x1200.jpg'
  );
```

### Upload checklist (build step / Layla)

1. In Supabase Storage, ensure bucket `product-photos` exists and is **public-read**. (Already present — used by every sibling project.)
2. Create folder `sewa-excavator/` inside the bucket.
3. Upload the two files from `projects/sewa-excavator/brand_assets/`:
   - `exc-ec200e-t4f-2-w-lf-1000x1000.jpg` (cutout — transparent-style framing on white)
   - `volvo-show-crawler-excavator-ec400f-sv-t4f-2324x1200.jpg` (lifestyle / on-site)
4. Confirm both are reachable in a browser without auth.
5. Run §4 with the captured `<EC200_ID>` / `<EC400_ID>` substituted.

### Product-card photo treatment

Per CLAUDE.md "Product Card Photos — MANDATORY", pick **one** treatment per grid. Since one photo is a cutout and the other is lifestyle, **the product grid uses `object-fit: contain`** with internal padding for both — that lets the EC400 lifestyle shot frame as a silhouette in the card while the EC200 cutout reads cleanly. The lifestyle shot may also be reused as a section background image elsewhere (e.g. final CTA), where it crops freely.

---

## 5. Rental Calculator multiplier table

`<RentalCalculator>` (special section, between Products and Process) reads `rental_price` (= daily rate) from `getProducts()` and applies these multipliers. Multipliers are **fixed in the client component** — never duplicated into the database — so they invalidate with the next deploy, not via a content webhook.

| Period | Multiplier (× daily rate) | Effective per-day | Why |
|---|---|---|---|
| **Daily** | `days × 1` | 100% | Baseline. Calculator default. |
| **Weekly** | `days × 6` for 7-day rentals | ~86% per day (1 day free) | Standard Malaysian trade-equipment discount — book a week, pay 6 days. Implemented as `Math.floor(days / 7) * 6 + (days % 7)` so partial weeks bill the remainder at the daily rate. |
| **Monthly** | `days × 22` for 30-day rentals | ~73% per day (8 days free) | Aligned with the typical "22 working days = 1 month" convention quoted by Malaysian excavator suppliers. Implemented for v1 as `Math.floor(days / 30) * 22 + Math.min(days % 30, 22)` — partial months bill the remainder at the daily rate, capped at 22 days so a partial month is never more expensive than a full one. |

### Recommended JS for v1 (lock with Nana during copy review)

```ts
function quote(dailyRate: number, days: number, period: 'daily' | 'weekly' | 'monthly') {
  const d = Math.max(1, Math.floor(days));
  if (period === 'daily')   return dailyRate * d;
  if (period === 'weekly')  return dailyRate * (Math.floor(d / 7) * 6 + (d % 7));
  /* monthly */              return dailyRate * (Math.floor(d / 30) * 22 + Math.min(d % 30, 22));
}
```

### Worked examples (EC200 daily rate proposal RM 1,000 — confirm with user)

| Input | Quote |
|---|---|
| Daily × 1 day | RM 1,000 |
| Daily × 3 days | RM 3,000 |
| Weekly × 7 days | RM 6,000 (1 day free) |
| Weekly × 14 days | RM 12,000 |
| Monthly × 30 days | RM 22,000 (8 days free vs daily × 30) |
| Monthly × 45 days | RM 22,000 + 15 days capped at 22 → RM 22,000 + RM 15,000 = RM 37,000 |

### Worked examples (EC400 daily rate proposal RM 1,700 — confirm with user)

| Input | Quote |
|---|---|
| Daily × 1 day | RM 1,700 |
| Weekly × 7 days | RM 10,200 |
| Monthly × 30 days | RM 37,400 |

> All multipliers above are **PROPOSAL — confirm with user** before Gate 2. The calculator will display "Sebut harga anggaran sahaja — sila WhatsApp untuk pengesahan" so the quote can't be treated as a binding price.

---

## 6. Webcore data-layer column map

Every column read by `lib/webcore.ts` must exist in the seeded rows. Layla / the build step uses this checklist to confirm no field is missed.

### 6.1 `products` (read by `getProducts()`)

Webcore SELECT: `*,product_photos(url)` filtered by `website=eq.{domain}&is_active=eq.true&order=sort_order.asc`.

| Column | Type | Required | Seeded value | Used as |
|---|---|---|---|---|
| `id` | uuid | yes | auto | `Product.id`, tracking `data-id`, FK for `product_photos` |
| `name` | text | yes | `Volvo EC200` / `Volvo EC400` | Card title, H4 |
| `slug` | text | yes | `volvo-ec200` / `volvo-ec400` | Tracking label `product-{slug}`, future detail route |
| `description` | text | yes (≤15 words) | Bahasa Melayu line | Card body (2-line clamp) |
| `sale_price` | numeric | nullable | `NULL` | Unused on this site (rental-only) |
| `rental_price` | numeric | **yes** | `1000.00` / `1700.00` | Daily rate → calculator base, "From RM X / day" label |
| `sort_order` | int | yes | `1`, `2` | Card grid order |
| `is_active` | bool | yes | `true` | Webcore filter |
| `parent_id` | uuid | nullable | `NULL` | Variants — not used here |

### 6.2 `product_photos` (embedded via `product_photos(url)`)

| Column | Type | Required | Seeded value | Used as |
|---|---|---|---|---|
| `product_id` | uuid (FK) | yes | `<EC200_ID>` / `<EC400_ID>` | Join key |
| `url` | text | yes | Supabase Storage public URL | `Product.photos[0].url` → `<Image>` src |

### 6.3 `company_websites` (read by `getLeadsMode()`)

| Column | Type | Required | Seeded value | Used as |
|---|---|---|---|---|
| `domain` | text | yes | `sewa-excavator.vercel.app` | Match key (vs HTTP host) |
| `leads_mode` | text | yes | `'single'` | Switch in `getPhoneNumber()` |
| `company_id` | uuid | yes | `f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c` | Not read by webcore — used by admin panel |

### 6.4 `phone_numbers` (read by `getPhoneRows()`)

Webcore SELECT: `phone_number,whatsapp_text,percentage,label,location_slug` filtered by `website=eq.{domain}&is_active=eq.true`.

| Column | Type | Required | Seeded value | Used as |
|---|---|---|---|---|
| `website` | text | yes | `sewa-excavator.vercel.app` | Filter |
| `is_active` | bool | yes | `true` | Filter |
| `phone_number` | text | yes | `60174287801` | wa.me URL |
| `whatsapp_text` | text | yes | Bahasa Melayu seed | Pre-filled message |
| `percentage` | int | yes | `100` | Weighted picker (idle in single mode) |
| `label` | text | yes | `'default'` | `findDefaultRow()` |
| `location_slug` | text | yes | `'all'` | Default-row marker |
| `type` | text | yes | `'default'` | Admin-side classification |

### 6.5 `blog_posts` + `blog_translations` (Hanabi, Step 11 — not seeded here)

Listed for completeness so Hanabi's inserts match what webcore reads:

`blog_posts` columns webcore reads: `id, slug, cover_image_url, published_at, website, status`.
`blog_translations` columns webcore reads: `language` (filter), `title`, `content`, `excerpt`, `meta_title`, `meta_description`.

`blog_translations.language` MUST be one of `ms`, `en`, `zh` (matches `config/site.ts` locale codes).

---

## 7. Verification queries (Layla — run AFTER seeding)

Set `SUPA_URL` and `ANON_KEY` from `/.env.local` first. These reproduce the exact reads webcore performs at runtime — they prove production won't fall back to the hardcoded constants in `lib/webcore.ts`.

### 7.1 Confirm `company_websites` row

```bash
curl -s "$SUPA_URL/rest/v1/company_websites?domain=eq.sewa-excavator.vercel.app&select=domain,company_id,leads_mode" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" | jq
```

Expected: `[{ "domain": "sewa-excavator.vercel.app", "company_id": "f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c", "leads_mode": "single" }]`.

### 7.2 Confirm `phone_numbers` default row

```bash
curl -s "$SUPA_URL/rest/v1/phone_numbers?website=eq.sewa-excavator.vercel.app&is_active=eq.true&select=phone_number,whatsapp_text,percentage,label,location_slug,type" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" | jq
```

Expected: 1 object — `phone_number = "60174287801"`, `location_slug = "all"`, `label = "default"`, `type = "default"`, `percentage = 100`.

### 7.3 Reproduce `getProducts()` query

```bash
curl -s "$SUPA_URL/rest/v1/products?select=*,product_photos(url)&website=eq.sewa-excavator.vercel.app&is_active=eq.true&order=sort_order.asc" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" | jq
```

Expected: array of 2 objects in this order — `Volvo EC200` (sort_order 1, rental_price 1000), then `Volvo EC400` (sort_order 2, rental_price 1700). Each object's `product_photos` array must contain exactly one entry whose `url` resolves to a real public file (Layla opens both URLs in a browser to confirm).

### 7.4 Sanity row counts

```bash
# 1 company_website row
curl -s "$SUPA_URL/rest/v1/company_websites?domain=eq.sewa-excavator.vercel.app&select=count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Prefer: count=exact" -I | grep -i content-range
# Expected: content-range: 0-0/1

# 1 phone_numbers row
curl -s "$SUPA_URL/rest/v1/phone_numbers?website=eq.sewa-excavator.vercel.app&select=count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Prefer: count=exact" -I | grep -i content-range
# Expected: content-range: 0-0/1

# 2 products rows
curl -s "$SUPA_URL/rest/v1/products?website=eq.sewa-excavator.vercel.app&select=count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Prefer: count=exact" -I | grep -i content-range
# Expected: content-range: 0-1/2

# 2 product_photos rows (joined indirectly via products)
curl -s "$SUPA_URL/rest/v1/product_photos?product_id=in.($EC200_ID,$EC400_ID)&select=count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Prefer: count=exact" -I | grep -i content-range
# Expected: content-range: 0-1/2
```

### 7.5 Webcore revalidate smoke test

After Vercel has the `WEBCORE_REVALIDATE_SECRET` env var set and the site has been redeployed once:

```bash
curl -i -X POST https://sewa-excavator.vercel.app/api/revalidate \
  -H "x-webcore-secret: $WEBCORE_REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-products","webcore-phones"]}'
```

Expected: `200 {"revalidated":["webcore-products","webcore-phones"]}`. A `401` means the secret mismatches; `500` means the env var isn't loaded (redeploy required); `404` means the route handler wasn't shipped.

---

## 8. Open items for the user (PROPOSAL — confirm before Gate 2)

1. **EC200 daily rate.** Currently `RM 1,000/day`. Market band: RM 800–1,200.
2. **EC400 daily rate.** Currently `RM 1,700/day`. Market band: RM 1,400–2,000.
3. **Weekly multiplier.** Currently `6×` (1 day free per 7-day block).
4. **Monthly multiplier.** Currently `22×` (8 days free per 30-day block — aligned with "22 working days" convention).
5. **With-operator surcharge.** Not modelled in DB. If the user wants a surcharge toggle in the calculator, we add a fixed daily add-on inside `<RentalCalculator>` — does not need a new DB column.

---

## Handoff

- **Kimmy** copies `projects/tablechair-rental-malaysia/lib/webcore.ts` into `projects/sewa-excavator/lib/webcore.ts` unchanged (only `siteConfig` differs per project). The column map in §6 is the contract.
- **Kagura** uses §5 to render the calculator's worked-example numbers in the design comp.
- **Layla** runs §7 after seeding and before Gate 2; uploads the two product photos to Storage per §4; sets `WEBCORE_REVALIDATE_SECRET` on Vercel and redeploys once; confirms the §7.5 curl returns 200.
- **Hanabi** (Step 11) inserts blog rows using the columns flagged in §6.5 — outside this document's scope.
