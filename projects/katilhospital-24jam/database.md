# Katil Hospital 24 Jam — Database Spec

**Agent:** Cyclops — Database Engineer (Part 1: spec only)
**Project slug:** `katilhospital-24jam`
**Domain (exact):** `katilhospital-24jam.vercel.app`
**Company:** Ibnu Sina Care Sdn. Bhd. — `company_id = d6cc8f48-ea42-4420-b9d6-73ca63263be0`
**Leads mode:** `single`
**Locales:** `ms` (default), `en`, `zh`
**Date:** 2026-04-23
**Status:** Spec for review. No SQL executed. Cyclops Part 2 (actual product INSERTs) runs after Gate 1.

---

## 1. Pre-flight

### Supabase project
- Use the **EXISTING shared Supabase project**. DO NOT create a new Supabase project. All Utopia Webcore websites share one Supabase instance — rows are scoped per website by the `website` column (and by `domain` in `company_websites`).
- Credentials live at repo-root `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and for writes the service role key).
- Symlink must exist: `projects/katilhospital-24jam/.env.local → ../../.env.local`.
- `next.config.ts` must call `loadEnvConfig(process.cwd() + '/../..')` so env resolves for `next dev` + `next build`.
- Vercel project env must mirror the same three variables for production.

### Tables touched by this project
Read/written only — no new tables, no new columns:
1. `company_websites` — one row for the domain (leads_mode = 'single').
2. `phone_numbers` — one seed row (Step 8, before deploy).
3. `products` — 8 rows (Cyclops Part 2, after Gate 1).
4. `product_photos` — ≥1 row per product (Cyclops Part 2).
5. `blog_posts` — ≥10 rows (Hanabi, Step 11).
6. `blog_translations` — 3 rows per blog post: ms + en + zh (Hanabi, Step 11).

### Column-name reality check (verified against EWM `lib/`)
- `phone_numbers` column is **`website`** (NOT `website_slug`). Verified in `projects/electric-wheelchair-malaysia/lib/getPhoneNumber.ts` line 131 (`.eq("website", domain)`).
- `phone_numbers.location_slug` uses the **string literal `'all'`** for the global default row, NEVER `null`. Verified same file (lines 160, 167, 174 compare `r.location_slug === "all"`).
- `company_websites` identifier is **`domain`** (NOT `website`). Verified same file line 74 (`.eq("domain", domain)`).
- `blog_translations` locale column is **`language`** (NOT `locale`). Verified in `projects/electric-wheelchair-malaysia/lib/getBlogPosts.ts` lines 33 + 75 (`.eq("blog_translations.language", language)`). **Explicit confirmation of Alpha's finding.**

---

## 2. Table inventory

Every column below is part of the existing shared schema (verified against the EWM lib/ source files). Do NOT invent, rename, or add columns.

### 2.1 `products`
Columns (per root CLAUDE.md "Dynamic Product Data — Database schema" and Cyclops role spec):

| Column | Used by this project |
|---|---|
| `id` | PK — auto UUID. Referenced by `product_photos.product_id`. |
| `website` | Literal `'katilhospital-24jam.vercel.app'` on all 8 rows. |
| `parent_id` | `NULL` on all 8 rows (no parent-child SKUs this project). |
| `name` | MS product name from `inputs.md` §Products. |
| `slug` | From `inputs.md` §Products (e.g. `katil-hospital-manual-1-fungsi`). |
| `description` | MS short description (Nana supplies copy; Cyclops Part 2 inserts). |
| `sale_price` | TODO — pricing to be confirmed with Ibnu Sina Care. |
| `rental_price` | TODO — pricing to be confirmed with Ibnu Sina Care. |
| `sort_order` | Integers `1`–`8` matching the order in `inputs.md`. |
| `is_active` | `true` on all 8 rows. |

### 2.2 `product_photos`
| Column | Used by this project |
|---|---|
| `product_id` | FK to `products.id`. |
| `url` | Absolute URL — Supabase Storage, Pexels, or an absolute path served from `public/product/`. **Never** a `Downloads/…` path, never a relative path. |

At least one row per product is mandatory. If a product has multiple angles, insert additional rows.

### 2.3 `phone_numbers`
Verified columns (from `lib/getPhoneNumber.ts` select list + root CLAUDE.md "phone_numbers Table Columns"):

| Column | Used by this project |
|---|---|
| `website` | `'katilhospital-24jam.vercel.app'` |
| `location_slug` | `'all'` (string literal; never `null`) |
| `phone_number` | `'60174287801'` |
| `whatsapp_text` | MS seed copy (see §3) |
| `percentage` | `100` (relative weight; irrelevant under `single` but keep for schema parity) |
| `label` | `'default'` |
| `type` | `'default'` |
| `is_active` | `true` |
| `created_at` | auto (DB default timestamp) |

Leads-mode behaviour: with `leads_mode = 'single'`, `lib/getPhoneNumber.ts` returns `rows[0]`. With only one row, behaviour is deterministic.

### 2.4 `company_websites`
Verified columns used by `lib/getPhoneNumber.ts` (line 72–75) and root CLAUDE.md "Initial Phone Number Seeding":

| Column | Used by this project |
|---|---|
| `company_id` | `'d6cc8f48-ea42-4420-b9d6-73ca63263be0'` (Ibnu Sina Care Sdn. Bhd.) |
| `domain` | `'katilhospital-24jam.vercel.app'` |
| `leads_mode` | `'single'` |

Only these three columns are referenced by frontend code. If the real table has additional columns (e.g. `created_at`, `notes`), let them default; do not invent values.

### 2.5 `blog_posts`
Verified columns (from `lib/getBlogPosts.ts` select list lines 28–33):

| Column | Used by this project |
|---|---|
| `id` | PK — auto UUID. Referenced by `blog_translations.post_id`. |
| `slug` | Unique-per-website post slug (Hanabi supplies). |
| `cover_image_url` | Absolute URL to cover image. |
| `website` | `'katilhospital-24jam.vercel.app'` on all rows. |
| `status` | `'published'` on all rows at ship time. |
| `published_at` | ISO timestamp. Frontend falls back to `created_at` if null. |
| `created_at` | auto. |

### 2.6 `blog_translations`
Verified columns (from `lib/getBlogPosts.ts` select list + filter line 33):

| Column | Used by this project |
|---|---|
| `post_id` | FK to `blog_posts.id`. |
| `language` | **`'ms'` / `'en'` / `'zh'`** — column name is `language`, NOT `locale`. |
| `title` | Translated title. |
| `content` | Translated HTML body. |
| `excerpt` | Translated excerpt. |
| `meta_title` | Translated meta title (≤60 chars). |
| `meta_description` | Translated meta description (≤160 chars). |

Three rows per post (one per locale). Frontend `.eq("blog_translations.language", language)` filters to the active locale.

---

## 3. Phone seeding SQL (runnable template — Step 8, before deploy)

Literal values, ready to run in the Supabase SQL editor:

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
  'katilhospital-24jam.vercel.app',
  'all',
  '60174287801',
  'Hi, saya berminat dengan perkhidmatan sewa / beli katil hospital dari Katil Hospital 24 Jam. Boleh bantu?',
  100,
  'default',
  'default',
  true
);
```

Notes:
- MS whatsapp_text is the default seed (matches `lib/getPhoneNumber.ts` which returns `whatsapp_text` from the selected row). EN and ZH variants from `inputs.md` are surfaced by the frontend translation layer at CTA time, not stored per row under `single` mode.
- Do NOT add a `created_at` value — let the DB default populate.
- Do NOT duplicate for a custom domain; this project ships on the Vercel subdomain only.

---

## 4. Company registration SQL (runnable template — Step 8, before deploy)

```sql
INSERT INTO company_websites (
  company_id,
  domain,
  leads_mode
)
VALUES (
  'd6cc8f48-ea42-4420-b9d6-73ca63263be0',
  'katilhospital-24jam.vercel.app',
  'single'
)
ON CONFLICT (domain) DO NOTHING;
```

Guard notes:
- `ON CONFLICT (domain) DO NOTHING` assumes a UNIQUE constraint on `company_websites.domain`. This is the natural key (the frontend `.eq("domain", host).single()` relies on uniqueness). If the existing schema does not have that constraint, drop the `ON CONFLICT` clause and instead run a pre-check:
  ```sql
  SELECT 1 FROM company_websites WHERE domain = 'katilhospital-24jam.vercel.app';
  ```
  and only INSERT if zero rows are returned. Do not invent a constraint that isn't in the live schema.

---

## 5. Product INSERT template (for Cyclops Part 2, post-Gate 1)

8-row INSERT into `products`. `sort_order` matches `inputs.md`. `website` is literal. Descriptions come from Nana's MS copy and are dropped in at Part 2; placeholders below mark the slot. Pricing is TODO until Ibnu Sina Care confirms.

```sql
-- STEP A: Insert 8 products and capture their generated ids via RETURNING.
INSERT INTO products (
  website, parent_id, name, slug, description, sale_price, rental_price, sort_order, is_active
)
VALUES
  ('katilhospital-24jam.vercel.app', NULL, 'Katil Hospital Manual 1-Fungsi',  'katil-hospital-manual-1-fungsi',  '<MS description — Nana>', NULL /* TODO: confirm sale_price with Ibnu Sina Care */, NULL /* TODO: confirm rental_price */, 1, true),
  ('katilhospital-24jam.vercel.app', NULL, 'Katil Hospital Manual 2-Fungsi',  'katil-hospital-manual-2-fungsi',  '<MS description — Nana>', NULL /* TODO */, NULL /* TODO */, 2, true),
  ('katilhospital-24jam.vercel.app', NULL, 'Katil Hospital Elektrik 3-Fungsi','katil-hospital-elektrik-3-fungsi','<MS description — Nana>', NULL /* TODO */, NULL /* TODO */, 3, true),
  ('katilhospital-24jam.vercel.app', NULL, 'Tilam Hospital (Foam)',           'tilam-hospital-foam',             '<MS description — Nana>', NULL /* TODO */, NULL /* TODO */, 4, true),
  ('katilhospital-24jam.vercel.app', NULL, 'Tilam Angin Anti-Decubitus',      'tilam-angin-anti-decubitus',      '<MS description — Nana>', NULL /* TODO */, NULL /* TODO */, 5, true),
  ('katilhospital-24jam.vercel.app', NULL, 'Mesin Oksigen',                   'mesin-oksigen',                   '<MS description — Nana>', NULL /* TODO */, NULL /* TODO */, 6, true),
  ('katilhospital-24jam.vercel.app', NULL, 'Kerusi Roda',                     'kerusi-roda',                     '<MS description — Nana>', NULL /* TODO */, NULL /* TODO */, 7, true),
  ('katilhospital-24jam.vercel.app', NULL, 'Mesin CPAP',                      'mesin-cpap',                      '<MS description — Nana>', NULL /* TODO */, NULL /* TODO */, 8, true)
RETURNING id, slug;
```

```sql
-- STEP B: Insert product_photos for each product.
-- Using a CTE that resolves product_id by (website, slug). Safe even if run in a new transaction after Step A.
-- URLs below are the expected Supabase Storage / CDN targets.
-- Kimmy/Kagura will upload to Supabase Storage (or confirm absolute CDN URLs) before Part 2 runs.

WITH p AS (
  SELECT id, slug FROM products
  WHERE website = 'katilhospital-24jam.vercel.app'
)
INSERT INTO product_photos (product_id, url)
SELECT p.id, v.url FROM p JOIN (VALUES
  ('katil-hospital-manual-1-fungsi',   '<ABSOLUTE_URL_PRODUCT_14>'),  -- from brand_assets/product/14.png
  ('katil-hospital-manual-2-fungsi',   '<ABSOLUTE_URL_PRODUCT_13>'),  -- from brand_assets/product/13.png
  ('katil-hospital-elektrik-3-fungsi', '<ABSOLUTE_URL_PEXELS_BED>'),  -- new Pexels image (MY/Asian subject)
  ('tilam-hospital-foam',              '<ABSOLUTE_URL_PRODUCT_15>'),  -- from brand_assets/product/15.png
  ('tilam-angin-anti-decubitus',       '<ABSOLUTE_URL_PRODUCT_16>'),  -- from brand_assets/product/16.png
  ('mesin-oksigen',                    '<ABSOLUTE_URL_PRODUCT_17>'),  -- from brand_assets/other-product/17.png
  ('kerusi-roda',                      '<ABSOLUTE_URL_PRODUCT_18>'),  -- from brand_assets/other-product/18.png
  ('mesin-cpap',                       '<ABSOLUTE_URL_PRODUCT_19>')   -- from brand_assets/other-product/19.png
) AS v(slug, url) ON p.slug = v.slug;
```

Hard rules for Part 2:
- `website` must equal `katilhospital-24jam.vercel.app` **exactly** — no trailing slash, no `www.`, no `https://`.
- No row may be inserted with a placeholder image URL. Resolve every `<ABSOLUTE_URL_*>` before running.
- If pricing is still unknown at Gate 1, leave `sale_price` / `rental_price` as `NULL` and display "Hubungi untuk harga" in the UI — do NOT block launch on pricing.

---

## 6. Blog post INSERT template (for Hanabi, Step 11)

Shape Hanabi will follow. Column is **`language`**, not `locale` — confirmed per `lib/getBlogPosts.ts` line 33.

```sql
-- STEP A: Insert the blog_posts row. Capture the returned id.
INSERT INTO blog_posts (
  slug,
  cover_image_url,
  website,
  status,
  published_at
)
VALUES (
  '<post-slug>',
  '<absolute-cover-image-url>',
  'katilhospital-24jam.vercel.app',
  'published',
  NOW()
)
RETURNING id;
```

```sql
-- STEP B: Insert three blog_translations rows for the returned post_id — one per locale.
-- IMPORTANT: column is `language`, NOT `locale`.
INSERT INTO blog_translations (
  post_id, language, title, content, excerpt, meta_title, meta_description
)
VALUES
  ('<returned-post-id>', 'ms', '<MS title>', '<MS HTML content>', '<MS excerpt>', '<MS meta title>', '<MS meta description>'),
  ('<returned-post-id>', 'en', '<EN title>', '<EN HTML content>', '<EN excerpt>', '<EN meta title>', '<EN meta description>'),
  ('<returned-post-id>', 'zh', '<ZH title>', '<ZH HTML content>', '<ZH excerpt>', '<ZH meta title>', '<ZH meta description>');
```

Repeat per post. Minimum per architecture: ≥10 posts × 3 translations = ≥30 `blog_translations` rows.

---

## 7. Read queries

Frontend query shapes — these are the canonical reads the site will perform at runtime. They match the existing EWM lib/ files; use them verbatim when adapting `lib/getPhoneNumber.ts` and `lib/getBlogPosts.ts` into this project.

### 7.1 Homepage + location-page product grid
```sql
SELECT
  p.id, p.name, p.slug, p.description,
  p.sale_price, p.rental_price, p.sort_order, p.is_active,
  pp.url AS photo_url
FROM products p
LEFT JOIN product_photos pp ON pp.product_id = p.id
WHERE p.website = 'katilhospital-24jam.vercel.app'
  AND p.is_active = true
ORDER BY p.sort_order ASC;
```

Supabase-JS equivalent (to be used in a new `lib/getProducts.ts`):
```ts
supabase
  .from('products')
  .select('id, name, slug, description, sale_price, rental_price, sort_order, is_active, product_photos(url)')
  .eq('website', 'katilhospital-24jam.vercel.app')
  .eq('is_active', true)
  .order('sort_order', { ascending: true });
```
Consumed by homepage + every location page. ISR `revalidate = 3600`.

### 7.2 Phone number for WhatsApp redirect
Exactly the flow in `projects/electric-wheelchair-malaysia/lib/getPhoneNumber.ts` — copy that file, change only the `FALLBACK_PHONE` and `FALLBACK_WA_TEXT` constants:

```ts
const FALLBACK_PHONE = "60174287801";
const FALLBACK_WA_TEXT = "Hi, saya berminat dengan perkhidmatan sewa / beli katil hospital dari Katil Hospital 24 Jam. Boleh bantu?";
```

Query performed (line 128–132 of EWM source):
```ts
supabase
  .from('phone_numbers')
  .select('phone_number, whatsapp_text, percentage, label, location_slug')
  .eq('website', domain)         // domain = host header, i.e. 'katilhospital-24jam.vercel.app'
  .eq('is_active', true);
```
Plus the `company_websites` lookup:
```ts
supabase
  .from('company_websites')
  .select('leads_mode')
  .eq('domain', domain)
  .single();
```
Under `leads_mode = 'single'` the function returns `rows[0]` directly (line 141–144).

### 7.3 Blog listing
From `lib/getBlogPosts.ts` (copy the file, change only the `WEBSITE` constant):
```ts
const WEBSITE = "katilhospital-24jam.vercel.app";

supabase
  .from('blog_posts')
  .select(`
    id, slug, cover_image_url, published_at, created_at,
    blog_translations!inner (title, content, excerpt, meta_title, meta_description)
  `)
  .eq('website', WEBSITE)
  .eq('status', 'published')
  .eq('blog_translations.language', language)   // 'ms' | 'en' | 'zh'
  .order('created_at', { ascending: false });
```

### 7.4 Blog single post
Same source, `getBlogPostBySlug`:
```ts
supabase
  .from('blog_posts')
  .select(`
    id, slug, cover_image_url, published_at, created_at,
    blog_translations!inner (title, content, excerpt, meta_title, meta_description)
  `)
  .eq('website', WEBSITE)
  .eq('slug', slug)
  .eq('status', 'published')
  .eq('blog_translations.language', language)
  .single();
```

---

## 8. Verification checklist (post-deploy)

Run each query against the shared Supabase project once seeding + inserts are complete. Every assertion on the right must be true.

| # | Query | Expected |
|---|---|---|
| 1 | `SELECT COUNT(*) FROM company_websites WHERE domain = 'katilhospital-24jam.vercel.app';` | `1` |
| 2 | `SELECT leads_mode, company_id FROM company_websites WHERE domain = 'katilhospital-24jam.vercel.app';` | `leads_mode = 'single'` AND `company_id = 'd6cc8f48-ea42-4420-b9d6-73ca63263be0'` |
| 3 | `SELECT COUNT(*) FROM phone_numbers WHERE website = 'katilhospital-24jam.vercel.app';` | `1` |
| 4 | `SELECT phone_number, location_slug, label, type, is_active, percentage FROM phone_numbers WHERE website = 'katilhospital-24jam.vercel.app';` | `60174287801`, `all`, `default`, `default`, `true`, `100` |
| 5 | `SELECT COUNT(*) FROM products WHERE website = 'katilhospital-24jam.vercel.app' AND is_active = true;` | `8` |
| 6 | `SELECT slug, sort_order FROM products WHERE website = 'katilhospital-24jam.vercel.app' ORDER BY sort_order;` | slugs match `inputs.md` in order 1–8 |
| 7 | `SELECT COUNT(*) FROM product_photos pp JOIN products p ON pp.product_id = p.id WHERE p.website = 'katilhospital-24jam.vercel.app';` | `≥ 8` |
| 8 | `SELECT pp.url FROM product_photos pp JOIN products p ON pp.product_id = p.id WHERE p.website = 'katilhospital-24jam.vercel.app';` | every URL starts with `http` (no relative paths, no `Downloads/`) |
| 9 | `SELECT COUNT(*) FROM blog_posts WHERE website = 'katilhospital-24jam.vercel.app' AND status = 'published';` | `≥ 10` |
| 10 | `SELECT post_id, COUNT(*) FROM blog_translations bt JOIN blog_posts bp ON bp.id = bt.post_id WHERE bp.website = 'katilhospital-24jam.vercel.app' GROUP BY post_id HAVING COUNT(*) <> 3;` | empty result (every post has exactly 3 translations: ms/en/zh) |
| 11 | `SELECT DISTINCT language FROM blog_translations bt JOIN blog_posts bp ON bp.id = bt.post_id WHERE bp.website = 'katilhospital-24jam.vercel.app' ORDER BY language;` | `en`, `ms`, `zh` — no extra locales |
| 12 | Domain spot-check | `SELECT website FROM products WHERE website LIKE '%katilhospital-24jam%' GROUP BY website;` returns exactly one value `katilhospital-24jam.vercel.app` (no trailing slash, no `https://`, no `www.`). |
| 13 | Live curl smoke | `curl -I https://katilhospital-24jam.vercel.app/ms/redirect-whatsapp-1` returns `200` + redirect HTML loads the seed phone number. |

---

## 9. Risks / TODOs

| # | Item | Owner | Blocker? |
|---|---|---|---|
| 1 | `sale_price` and `rental_price` for all 8 products are unknown — user has not supplied RM figures. | Confirm with Ibnu Sina Care Sdn. Bhd. | No — ship with `NULL` and display "Hubungi untuk harga"; update in Supabase post-launch without redeploy (ISR). |
| 2 | Absolute image URLs for `product_photos.url` are not yet resolved — brand_assets files must either be uploaded to Supabase Storage or served from the site's `public/product/`. | Kagura + Kimmy (Step 7 assets; Cyclops Part 2 inserts). | Yes — **must be resolved before Cyclops Part 2 runs**. No placeholder URLs. |
| 3 | Product 3 ("Katil Hospital Elektrik 3-Fungsi") image is marked "Pexels (new, Asian/MY subject)" in `inputs.md` — image not yet selected. | Kagura. | Yes for Part 2. |
| 4 | Product descriptions (MS) not yet written — Nana produces MS copy in Step 4 (before Part 2). EN/ZH product names/descriptions are surfaced by the translation layer, not stored per-locale in `products`. | Nana. | Yes for Part 2. |
| 5 | Blog cover image URLs, titles, bodies, excerpts, meta_title, meta_description for all 3 locales. | Hanabi (Step 11). | Yes for deploy — blog must exist before Layla's Vercel push. |
| 6 | `company_websites.domain` UNIQUE constraint is **assumed** (frontend uses `.single()`). If the live schema has no UNIQUE on `domain`, drop the `ON CONFLICT` clause in §4 and use a pre-SELECT guard instead. | Cyclops (verify before running §4). | No — spec covers both paths. |
| 7 | Under `leads_mode = 'single'`, only MS `whatsapp_text` is stored on the phone row. EN/ZH WA messages from `inputs.md` are handled by the frontend translation layer at CTA time. Flagged as explicit design choice — revisit if leads_mode is ever upgraded to `rotation`/`hybrid`. | Cyclops (design decision, documented here). | No. |
| 8 | `blog_posts.status` value is assumed to be `'published'` per EWM source. If the shared schema uses a different enum value (e.g. `'live'`), align Hanabi's inserts accordingly. | Cyclops + Hanabi (verify before Step 11). | No — trivially fixed. |
| 9 | No new columns proposed. If Nana, Kagura, or Hanabi request storing data that has no existing home (e.g. per-product specs, gallery subtitles), escalate — do not silently add columns. | Cyclops. | No. |

---

**End of Cyclops Part 1 (spec only).** No SQL was executed. Cyclops Part 2 runs after Gate 1 (design approval) and inserts the 8 products + photos per §5.
