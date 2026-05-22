# AuntyRokiah Katering — Database Design (Cyclops)

> Project slug: `katering-auntyrokiah`
> Domain: `auntyrokiah-katering.utopiaai.my`
> Company: Kak Kenduri Sdn. Bhd. — `company_id = ce95071b-e575-4983-bdd4-66910f45fe34`
> Locales: `ms` (default), `en`, `zh`
> Leads mode: `single`
> Default WA phone: `60174287801`

This document is paste-runnable in the Supabase SQL editor. All rows scope to the shared multi-tenant database via the `website` column. We **reuse existing tables only** — no new tables, no new columns. Reads go through `lib/webcore.ts` (cache-tag-aware `fetch()` against the Supabase REST API), never the Supabase JS client. The forbidden helpers (`lib/supabase.ts`, `lib/getProducts.ts`, `lib/getPhoneNumber.ts`, `lib/getBlogPosts.ts`) are not created — Cyclops contract aligns with this.

---

## 1. Table inventory used by this site

Every read and every write below references the **shared** Supabase database. Rows are partitioned by `website = 'auntyrokiah-katering.utopiaai.my'`.

| Table | Direction | Columns this site touches | Read pattern in `lib/webcore.ts` | Cache tag |
|---|---|---|---|---|
| `companies` | read-only (already populated) | `id`, `name` (the row `ce95071b-e575-4983-bdd4-66910f45fe34` = "Kak Kenduri Sdn. Bhd." already exists) | not read directly by webcore; FK target only | — |
| `company_websites` | write (1 row) → read | `company_id` (FK → `companies.id`), `domain`, `leads_mode` ∈ {`single`,`rotation`,`location`,`hybrid`} | `getLeadsMode(domain)` → `GET /rest/v1/company_websites?select=leads_mode&domain=eq.<host>&limit=1` | `webcore-phones` |
| `phone_numbers` | write (1 row) → read | `website`, `location_slug` (literal `'all'`, NEVER `NULL`), `phone_number`, `whatsapp_text`, `percentage`, `label`, `type`, `is_active` | `getPhoneRows(domain)` → `GET /rest/v1/phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug&website=eq.<host>&is_active=eq.true` | `webcore-phones` |
| `products` | write (4 rows) → read | `id` (uuid), `website`, `parent_id` (nullable self-FK), `name`, `slug`, `description`, `sale_price`, `rental_price`, `sort_order`, `is_active` | `getProducts()` → `GET /rest/v1/products?select=*,product_photos(url)&website=eq.<domain>&is_active=eq.true&order=sort_order.asc` | `webcore-products` |
| `product_photos` | write (≥1 per product) → read | `product_id` (FK → `products.id` ON DELETE CASCADE), `url` | embedded via `?select=*,product_photos(url)` in the products query | `webcore-products` |
| `blog_posts` | write (≥10 rows, Hanabi phase) → read | `id`, `website`, `slug`, `cover_image_url`, `published_at`, `status` (`'published'`) | `getBlogPosts(locale)`, `getBlogPost(slug, locale)`, `getRecentBlogPosts`, `getBlogPostSlugs` | `webcore-blog` |
| `blog_translations` | write (≥30 rows, Hanabi phase) → read | `id`, `blog_post_id` (FK → `blog_posts.id` ON DELETE CASCADE), `language` ∈ {`ms`,`en`,`zh`}, `title`, `content` (HTML), `excerpt`, `meta_title`, `meta_description` | embedded via `?select=...,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` with `&blog_translations.language=eq.<locale>` | `webcore-blog` |

### FK / cascade rules already in the shared DB

- `product_photos.product_id → products.id` — **ON DELETE CASCADE** (deleting a pakej removes its photos).
- `blog_translations.blog_post_id → blog_posts.id` — **ON DELETE CASCADE**.
- `company_websites.company_id → companies.id` — **RESTRICT** (cannot delete a company that still owns a website row).
- `products.parent_id → products.id` (self-FK) — nullable; only used when a product is a child variant. **For AuntyRokiah we use NULL on all 4 rows** (Air Balang is a sibling add-on, not a child of any pakej).

### Webcore partitioning convention (IMPORTANT — read carefully)

The reference `tablechair-rental-malaysia/lib/webcore.ts` partitions products into `core` vs `additional` by `rental_price !== null`. That heuristic does **not** match AuntyRokiah Katering — **none** of the 4 pakej rows have a `rental_price` (catering is sale-priced per pax, not rented).

When Kimmy writes this site's `lib/webcore.ts`, partition products by **slug** instead. Concretely:

```ts
return {
  core: products.filter((p) => p.slug !== 'add-on-air-balang'),
  additional: products.filter((p) => p.slug === 'add-on-air-balang'),
}
```

The 4 pakej rows seed cleanly with `sale_price` set and `rental_price = NULL` — no shimming required at the DB layer. The split lives in the UI/data layer.

---

## 2. Website scoping rule

**Every row this project writes scopes by `website = 'auntyrokiah-katering.utopiaai.my'` exactly.** No trailing slash, no protocol prefix, all lowercase. This string is the deployed custom domain and matches:

- the `domain` value used in `company_websites`
- the `data-website` attribute of the Webcore tracking script (`<script defer src="https://webcore.utopiaai.my/t.js" data-website="auntyrokiah-katering.utopiaai.my">`)
- the host header that `getHostDomain()` reads at request time inside `lib/webcore.ts`

There is **no** Vercel preview-domain fallback row in this project — webcore reads from the production custom domain only. Preview URLs will fall through to `FALLBACK_PHONE` from `siteConfig`, which is acceptable for previews.

---

## 3. Initial seed SQL

Paste-runnable as a single transaction. Re-running is idempotent for `company_websites` (ON CONFLICT) and safe for `phone_numbers` thanks to the existence check; the products + photos block is wrapped in a CTE so the photo URLs bind to the product IDs returned in the same statement.

### 3.1 `company_websites` — register the site under Kak Kenduri Sdn. Bhd.

```sql
INSERT INTO company_websites (company_id, domain, leads_mode)
VALUES (
  'ce95071b-e575-4983-bdd4-66910f45fe34',
  'auntyrokiah-katering.utopiaai.my',
  'single'
)
ON CONFLICT (domain) DO NOTHING;
```

### 3.2 `phone_numbers` — seed the default WhatsApp routing row

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
SELECT
  'auntyrokiah-katering.utopiaai.my',
  'all',                                  -- literal 'all', NEVER NULL
  '60174287801',
  'Hi AuntyRokiah Katering, saya berminat dengan pakej katering untuk majlis saya. Boleh bantu?',
  100,
  'default',
  'default',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM phone_numbers
  WHERE website = 'auntyrokiah-katering.utopiaai.my'
    AND label   = 'default'
);
```

### 3.3 `products` + `product_photos` — seed 4 pakej rows with placeholder photos

Single statement using two CTEs: the first inserts the products and returns their generated UUIDs; the second joins those UUIDs to placeholder Pexels photo URLs and inserts one photo per product. Cyclops Part 2 will replace these placeholders with curated, real-Malay-kenduri imagery.

```sql
WITH new_products AS (
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
    (
      'auntyrokiah-katering.utopiaai.my',
      NULL,
      'Pakej Katering Jimat',
      'pakej-jimat',
      'Pakej katering paling laris untuk majlis kecil — Nasi Minyak, Ayam Merah, Acar Timun, Papadom. RM15 setiap tetamu.',
      15,
      NULL,
      1,
      true
    ),
    (
      'auntyrokiah-katering.utopiaai.my',
      NULL,
      'Pakej Katering Standard',
      'pakej-standard',
      'Naik taraf hidangan kenduri — Nasi Minyak, Ayam Merah, Daging Hitam, Acar Timun, Papadom. RM21 setiap tetamu.',
      21,
      NULL,
      2,
      true
    ),
    (
      'auntyrokiah-katering.utopiaai.my',
      NULL,
      'Pakej Katering Premium',
      'pakej-premium',
      'Pakej penuh untuk majlis besar — Nasi Minyak, Ayam Merah, Daging Hitam, Acar Timun, Papadom, Buah-buahan, Kuih. RM25 setiap tetamu.',
      25,
      NULL,
      3,
      true
    ),
    (
      'auntyrokiah-katering.utopiaai.my',
      NULL,
      'Add-on Air Balang',
      'add-on-air-balang',
      'Air balang segar untuk majlis anda — pilih Oren, Sirap, atau Anggur. RM80 setiap 1 balang melayan 50 tetamu.',
      80,
      NULL,
      4,
      true
    )
  RETURNING id, slug
)
INSERT INTO product_photos (product_id, url)
SELECT
  np.id,
  CASE np.slug
    WHEN 'pakej-jimat'        THEN 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg'
    WHEN 'pakej-standard'     THEN 'https://images.pexels.com/photos/12842627/pexels-photo-12842627.jpeg'
    WHEN 'pakej-premium'      THEN 'https://images.pexels.com/photos/5409027/pexels-photo-5409027.jpeg'
    WHEN 'add-on-air-balang'  THEN 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg'
  END AS url
FROM new_products np;
```

**Placeholder photo URLs used above (Pexels, watermark-free):**

| Slug | Pexels URL | What it depicts |
|---|---|---|
| `pakej-jimat` | `https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg` | Nasi minyak / yellow rice plated, Malaysian-style |
| `pakej-standard` | `https://images.pexels.com/photos/12842627/pexels-photo-12842627.jpeg` | Catering buffet spread, multi-dish layout |
| `pakej-premium` | `https://images.pexels.com/photos/5409027/pexels-photo-5409027.jpeg` | Full kenduri table with curries, rice, sides |
| `add-on-air-balang` | `https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg` | Coloured fruit-drink jug / juice pitcher |

These are placeholder rows. Cyclops Part 2 (post-Gate 1) will swap in curated brand-owned or higher-resolution Pexels/Unsplash photos vetted against the actual pakej photography supplied by the user.

---

## 4. Leads mode operation

This site ships with `leads_mode = 'single'`. The data flow:

1. User taps any WhatsApp CTA → browser navigates to `/[locale]/redirect-whatsapp-1?loc=<location-slug-or-empty>`.
2. The redirect page server component calls `getPhoneNumber(loc)` from `lib/webcore.ts`.
3. Inside `getPhoneNumber()`:
   - `getHostDomain()` reads the request `host` header → resolves to `auntyrokiah-katering.utopiaai.my` in production.
   - `getLeadsMode(domain)` queries `company_websites` and returns `'single'`.
   - `getPhoneRows(domain)` returns the single seeded row (`location_slug = 'all'`, `label = 'default'`, `phone = 60174287801`).
   - The `case 'single':` branch returns `toResult(defaultRow ?? rows[0], 'single', domain)` → phone `60174287801`, message `"Hi AuntyRokiah Katering, saya berminat dengan pakej katering untuk majlis saya. Boleh bantu?"`.
4. `waLink()` constructs `https://wa.me/60174287801?text=<urlencoded>` and the client redirect fires.
5. If the database is unreachable or zero rows match, `fallbackResult()` returns `siteConfig.fallbackPhone` (the same `60174287801`) so the site never serves a dead WhatsApp link.

### What changes if the owner later switches modes

| New mode | What to add | What changes in routing |
|---|---|---|
| `rotation` | Insert N more `phone_numbers` rows for the same `website`, each with `location_slug = 'all'`, distinct `phone_number`, custom `whatsapp_text`, and a `percentage` weight. Set `type = 'custom'`, `label = 'agent-<name>'`. Keep the `default` row. Update `company_websites.leads_mode = 'rotation'`. | Every WhatsApp click picks a row by weighted random across `percentage`. The `default` label loses its priority. |
| `location` | Insert one row per location_slug (e.g. `kuala-lumpur`, `johor-bahru`) for the cities you want regional handling on. Keep the `location_slug = 'all'` row as fallback. Update `leads_mode = 'location'`. | Location pages → filter to matching `location_slug`, weighted-pick within. If zero matches → fall back to `'all'`. Homepage + blog → use `'all'` rows. |
| `hybrid` | Same insert pattern as `location`, but the `'all'` rows are used exclusively for non-location pages. Update `leads_mode = 'hybrid'`. | Location pages → only `location_slug = <slug>` rows (no fallback to `'all'`). Homepage + blog → only `location_slug = 'all'` rows. |

No code changes are required to flip modes — the switch is a pure `UPDATE company_websites SET leads_mode = '<mode>' WHERE domain = 'auntyrokiah-katering.utopiaai.my';` plus seeding the new rows. The webcore admin emits a `webcore-phones` revalidation webhook on every change.

---

## 5. Cache tag map

`lib/webcore.ts` uses exactly three cache tags. Every Supabase mutation made through the webcore admin must POST to `https://auntyrokiah-katering.utopiaai.my/api/revalidate` with the corresponding tag in the body.

| Table mutated | Tag the admin posts | Pages that re-render on next request |
|---|---|---|
| `products` (insert / update / delete) | `webcore-products` | Homepage (`/[locale]`), every location page (`/[locale]/pakej-katering/[location]`), any page that reads from `getProducts()` |
| `product_photos` (insert / update / delete) | `webcore-products` | Same as above (the photo array is embedded in the products read) |
| `phone_numbers` (insert / update / delete) | `webcore-phones` | WhatsApp redirect (`/[locale]/redirect-whatsapp-1`). Homepage CTAs that resolve their href server-side via `getWhatsAppLink()` also refresh. |
| `company_websites` (only `leads_mode` changes in practice) | `webcore-phones` | Same as `phone_numbers` |
| `blog_posts` (insert / update / delete / status change) | `webcore-blog` | Blog listing (`/[locale]/blog`) and the affected post page (`/[locale]/blog/[slug]`) |
| `blog_translations` (insert / update / delete) | `webcore-blog` | Same as `blog_posts` |

The route handler at `app/api/revalidate/route.ts` validates the `x-webcore-secret` header against `WEBCORE_REVALIDATE_SECRET`, then calls `revalidateTag(tag, 'default')` for every tag in the JSON body. The `WEBCORE_REVALIDATE_SECRET` env var must be bound on Vercel before the very first deploy (Layla's checklist enforces this).

Smoke test after each deploy:

```bash
curl -i -X POST https://auntyrokiah-katering.utopiaai.my/api/revalidate \
  -H "x-webcore-secret: <SECRET>" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-products"]}'
# Expected: 200 {"revalidated":["webcore-products"]}
```

---

## 6. Cyclops Part 2 plan (post-Gate 1)

Once the user approves the design at Gate 1, Cyclops returns to:

1. **Swap placeholder Pexels photos for curated, brand-aligned imagery.** Source priority: (a) photos the user uploads from the actual pakej photography, (b) curated Pexels / Unsplash kenduri + nasi minyak shoots that match the design palette, (c) Supabase Storage URLs if the user hosts brand-owned photos. UPDATE statement template:

   ```sql
   UPDATE product_photos pp
   SET url = '<NEW_URL>'
   FROM products p
   WHERE pp.product_id = p.id
     AND p.website = 'auntyrokiah-katering.utopiaai.my'
     AND p.slug    = '<pakej-slug>';
   ```

   After every UPDATE, post `{"tags":["webcore-products"]}` to `/api/revalidate`.

2. **Optionally insert a second photo per pakej** (gallery-style hover preview, or a "before plating / after plating" lifestyle shot). Schema-side this is a free `INSERT INTO product_photos (product_id, url) VALUES (...)` — no other table changes needed.

3. **Re-verify `is_active = true`** for every product after the admin panel edits — accidental `is_active = false` toggles silently remove rows from the grid.

4. **Coordinate with Hanabi** on blog seeding. Hanabi authors articles and writes `blog_posts` + `blog_translations` directly through the webcore admin or via SQL inserts that follow the schema in Section 1. Cyclops verifies the `website`, `status='published'`, `published_at`, `cover_image_url`, and that **every post has a row in `blog_translations` for each of `ms`, `en`, `zh`** (the `!inner` join in `getBlogPosts()` will silently hide posts missing the requested locale).

5. **Confirm tag invalidation end-to-end** by editing one product description in the admin and watching the homepage update without a redeploy.

---

## 7. Manual verification queries

Run these in the Supabase SQL editor (or via the REST API with the service role key) right after seed and after every deploy.

### 7.1 Company is registered with the correct leads mode

```sql
SELECT cw.domain, cw.leads_mode, c.name AS company_name
FROM company_websites cw
JOIN companies c ON c.id = cw.company_id
WHERE cw.domain = 'auntyrokiah-katering.utopiaai.my';
-- Expected: 1 row, leads_mode = 'single', company_name = 'Kak Kenduri Sdn. Bhd.'
```

### 7.2 Default phone row is live

```sql
SELECT website, location_slug, phone_number, label, type, percentage, is_active
FROM phone_numbers
WHERE website = 'auntyrokiah-katering.utopiaai.my';
-- Expected: 1 row, location_slug = 'all' (literal string), phone = '60174287801',
-- label = 'default', type = 'default', percentage = 100, is_active = true.
```

### 7.3 All 4 pakej rows exist, active, sorted correctly

```sql
SELECT sort_order, slug, name, sale_price, rental_price, is_active, parent_id
FROM products
WHERE website = 'auntyrokiah-katering.utopiaai.my'
ORDER BY sort_order;
-- Expected: 4 rows in order pakej-jimat (15), pakej-standard (21),
-- pakej-premium (25), add-on-air-balang (80). rental_price = NULL on all rows.
-- is_active = true on all rows. parent_id = NULL on all rows.
```

### 7.4 Every product has at least one photo

```sql
SELECT p.slug, COUNT(pp.url) AS photo_count
FROM products p
LEFT JOIN product_photos pp ON pp.product_id = p.id
WHERE p.website = 'auntyrokiah-katering.utopiaai.my'
GROUP BY p.slug
ORDER BY p.slug;
-- Expected: each slug has photo_count >= 1.
```

### 7.5 Webcore REST view (what the site actually sees)

This mirrors the exact query `getProducts()` runs. Replace `<SUPA_URL>` and `<ANON_KEY>`:

```bash
curl -s "<SUPA_URL>/rest/v1/products?select=*,product_photos(url)&website=eq.auntyrokiah-katering.utopiaai.my&is_active=eq.true&order=sort_order.asc" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" | jq '.[] | {slug, sale_price, photos: .product_photos | length}'
# Expected: 4 objects, slugs in sort order, photos >= 1 each.
```

### 7.6 Webcore REST view of the phone routing

```bash
curl -s "<SUPA_URL>/rest/v1/phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug&website=eq.auntyrokiah-katering.utopiaai.my&is_active=eq.true" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" | jq
# Expected: 1 object, phone_number = "60174287801", label = "default", location_slug = "all".
```

### 7.7 Blog readiness (after Hanabi)

```sql
SELECT bp.slug, bp.status, bp.published_at, ARRAY_AGG(bt.language ORDER BY bt.language) AS locales
FROM blog_posts bp
LEFT JOIN blog_translations bt ON bt.blog_post_id = bp.id
WHERE bp.website = 'auntyrokiah-katering.utopiaai.my'
GROUP BY bp.id, bp.slug, bp.status, bp.published_at
ORDER BY bp.published_at DESC;
-- Expected (post-Hanabi): >= 10 rows, status = 'published',
-- every locales array = {en, ms, zh} (sorted alphabetically by ARRAY_AGG).
-- A row missing any locale will be invisible to that locale's blog listing.
```

---

## Hand-off complete

Sora consumes Section 1 (table inventory) only as background. Nana / Kagura / Kimmy / Hanabi / Layla all consult Sections 4–7 during their phases. Cyclops Part 2 reopens this document after Gate 1 to swap placeholder images and verify blog seeding.
