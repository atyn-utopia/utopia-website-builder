# Cold Room Malaysia — Database Spec

**Agent:** Cyclops — Database Engineer (Part 1: spec only — no SQL executed)
**Project slug:** `coldroom-malaysia`
**Domain (exact):** `coldroom-malaysia.vercel.app`
**Company:** Cold Truck Malaysia Sdn. Bhd. — `company_id = 99e92ff1-d776-4154-9346-426e3cb91936`
**Leads mode:** `single`
**Locales:** `en` (default), `ms`, `zh`
**Date:** 2026-04-27
**Status:** Spec for review. No SQL executed. Cyclops Part 2 runs after Gate 1 (design approval).

---

## 1. Pre-flight

### Supabase project
- Use the EXISTING shared Supabase project. DO NOT create a new Supabase project. All Utopia Webcore websites share one Supabase instance — rows are scoped per website by the `website` column on `phone_numbers`/`products`/`blog_posts`, and by the `domain` column on `company_websites`.
- Credentials live at repo-root `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for writes).
- Symlink: `projects/coldroom-malaysia/.env.local -> ../../.env.local`.
- `next.config.ts` calls `loadEnvConfig(process.cwd() + '/../..')`.
- Vercel project env mirrors the public two variables for production.

### Tables touched by this project
No new tables. No new columns. No schema migrations. This project only inserts rows into the existing shared schema:

1. `companies` — already populated; read-only confirm.
2. `company_websites` — insert one row (`leads_mode = 'single'`).
3. `phone_numbers` — insert one seed row (Step 13, before deploy).
4. `products` — insert four rows (one per temperature tier — Cyclops Part 2, after Gate 1).
5. `product_photos` — 8 rows (two per tier — Cyclops Part 2).
6. `blog_posts` + `blog_translations` — Hanabi inserts (Step 11). Cyclops does not touch.
7. Tracking tables — populated automatically by `https://webcore.utopiaai.my/t.js` once `data-website="coldroom-malaysia.vercel.app"` is set.

### Column-name reality check (verified against EWM `lib/getPhoneNumber.ts` + `lib/getBlogPosts.ts`)

| Table | Column | Notes |
|---|---|---|
| `phone_numbers` | `website` | NOT `website_slug`. Verified at `getPhoneNumber.ts` line 101. |
| `phone_numbers` | `location_slug` | String literal `'all'` for the global default — NEVER `null`. |
| `company_websites` | `domain` | NOT `website`. Verified at `getPhoneNumber.ts` line 56. |
| `company_websites` | `leads_mode` | `single` / `rotation` / `location` / `hybrid`. This project = `single`. |
| `products` | `website` | Literal `'coldroom-malaysia.vercel.app'`. |
| `products` | columns | `id, website, parent_id, name, slug, description, sale_price, rental_price, sort_order, is_active`. |
| `product_photos` | columns | `product_id` (FK), `url` (absolute). |
| `blog_translations` | `language` | NOT `locale`. Values: `en` / `ms` / `zh`. |

---

## 2. Phone seeding SQL (runnable — Step 13, before deploy)

```sql
INSERT INTO phone_numbers (
  website, location_slug, phone_number, whatsapp_text,
  percentage, label, type, is_active
)
SELECT
  'coldroom-malaysia.vercel.app',
  'all',
  '60192799832',
  'Hi, saya berminat dengan Cold Room Rental. Boleh saya dapatkan info lanjut?',
  100, 'default', 'default', true
WHERE NOT EXISTS (
  SELECT 1 FROM phone_numbers
  WHERE website = 'coldroom-malaysia.vercel.app'
    AND location_slug = 'all'
    AND label = 'default'
);
```

---

## 3. Company registration SQL (runnable — Step 13, before deploy)

```sql
INSERT INTO company_websites (company_id, domain, leads_mode)
SELECT
  '99e92ff1-d776-4154-9346-426e3cb91936',
  'coldroom-malaysia.vercel.app',
  'single'
WHERE NOT EXISTS (
  SELECT 1 FROM company_websites
  WHERE domain = 'coldroom-malaysia.vercel.app'
);
```

---

## 4. Product INSERT (Cyclops Part 2, post-Gate 1)

### 4.1 Pricing decision

Single service `Cold Room Rental` priced at the entry rate of `RM 5.00` per pallet per day. Temperature options (`-18°C`, `-5°C to -10°C`, `2°C to 4°C`, `7°C to 10°C`) are surfaced on the homepage as feature options of this single service, NOT as separate product rows.

`sale_price` = `NULL` (rental-only business).

### 4.2 Product image URLs (Pexels CDN — verify with curl in §4.4)

| Tier slug | URL |
|---|---|
| `frozen-storage-minus-18` | `https://images.pexels.com/photos/4483609/pexels-photo-4483609.jpeg?auto=compress&cs=tinysrgb&w=1200` |
| `frozen-storage-minus-18` | `https://images.pexels.com/photos/4480462/pexels-photo-4480462.jpeg?auto=compress&cs=tinysrgb&w=1200` |
| `freezer-minus-5-to-minus-10` | `https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=1200` |
| `freezer-minus-5-to-minus-10` | `https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1200` |
| `chiller-2-to-4` | `https://images.pexels.com/photos/2733918/pexels-photo-2733918.jpeg?auto=compress&cs=tinysrgb&w=1200` |
| `chiller-2-to-4` | `https://images.pexels.com/photos/4483773/pexels-photo-4483773.jpeg?auto=compress&cs=tinysrgb&w=1200` |
| `cool-storage-7-to-10` | `https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1200` |
| `cool-storage-7-to-10` | `https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1200` |

### 4.3 Backup / alternate URLs
```
https://images.pexels.com/photos/4483608/pexels-photo-4483608.jpeg?auto=compress&cs=tinysrgb&w=1200
https://images.pexels.com/photos/4480454/pexels-photo-4480454.jpeg?auto=compress&cs=tinysrgb&w=1200
https://images.pexels.com/photos/8101983/pexels-photo-8101983.jpeg?auto=compress&cs=tinysrgb&w=1200
https://images.pexels.com/photos/5717417/pexels-photo-5717417.jpeg?auto=compress&cs=tinysrgb&w=1200
https://images.pexels.com/photos/5025668/pexels-photo-5025668.jpeg?auto=compress&cs=tinysrgb&w=1200
https://images.pexels.com/photos/2199290/pexels-photo-2199290.jpeg?auto=compress&cs=tinysrgb&w=1200
https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80
https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80
```

### 4.4 Pre-insert URL verification (mandatory before Part 2)
Run a curl loop checking 200 OK on every URL above. Replace any non-200 with a §4.3 alternate.

### 4.5 Product INSERT — runnable template (idempotent: DELETE-then-INSERT)

```sql
-- STEP A: cleanup (idempotent re-run safety).
DELETE FROM product_photos
WHERE product_id IN (
  SELECT id FROM products
  WHERE website = 'coldroom-malaysia.vercel.app'
);

DELETE FROM products
WHERE website = 'coldroom-malaysia.vercel.app';
```

```sql
-- STEP B: single service row.
INSERT INTO products (
  website, parent_id, name, slug, description, sale_price, rental_price, sort_order, is_active
)
VALUES
  ('coldroom-malaysia.vercel.app', NULL,
   'Cold Room Rental',
   'cold-room-rental',
   'Refrigerated cold room rental for frozen, freezer, chiller and cool storage. HALAL fleet, same-day delivery, full Peninsular Malaysia coverage.',
   NULL, 5.00, 1, true);
```

```sql
-- STEP C: product photos (2 verified cold-room shots from the reference Wix CDN).
WITH p AS (
  SELECT id FROM products
  WHERE website = 'coldroom-malaysia.vercel.app'
    AND slug = 'cold-room-rental'
)
INSERT INTO product_photos (product_id, url)
SELECT p.id, v.url FROM p CROSS JOIN (VALUES
  ('https://static.wixstatic.com/media/d3104b_07e54eaffc154eeea47fbd4e1f5c3e16~mv2.jpg'),
  ('https://static.wixstatic.com/media/d3104b_3473e766890746e5be19fd9c22839039~mv2.jpg')
) AS v(url);
```

---

## 5. Blog post INSERT template (Hanabi, Step 11)

Column is `language`, NOT `locale`.

```sql
INSERT INTO blog_posts (slug, cover_image_url, website, status, published_at)
VALUES ('<post-slug>', '<absolute-cover-image-url>', 'coldroom-malaysia.vercel.app', 'published', NOW())
RETURNING id;

INSERT INTO blog_translations (post_id, language, title, content, excerpt, meta_title, meta_description)
VALUES
  ('<id>', 'en', '...', '...', '...', '...', '...'),
  ('<id>', 'ms', '...', '...', '...', '...', '...'),
  ('<id>', 'zh', '...', '...', '...', '...', '...');
```

Repeat per post. Minimum: ≥10 posts × 3 translations.

---

## 6. Read queries (frontend)

### 6.1 Product grid
```ts
supabase
  .from('products')
  .select('id, name, slug, description, sale_price, rental_price, sort_order, is_active, product_photos(url)')
  .eq('website', 'coldroom-malaysia.vercel.app')
  .eq('is_active', true)
  .order('sort_order', { ascending: true });
```
ISR `revalidate = 3600`.

### 6.2 Phone number
Copy `electric-wheelchair-malaysia/lib/getPhoneNumber.ts` verbatim. Change ONLY:
```ts
const FALLBACK_PHONE = "60192799832";
const FALLBACK_WA_TEXT = "Hi, saya berminat dengan Cold Room Rental. Boleh saya dapatkan info lanjut?";
```

### 6.3 Blog
Copy `electric-wheelchair-malaysia/lib/getBlogPosts.ts` verbatim. Change ONLY:
```ts
const WEBSITE = "coldroom-malaysia.vercel.app";
```

---

## 7. Verification queries (post-INSERT)

| # | Query | Expected |
|---|---|---|
| 1 | `SELECT COUNT(*) FROM companies WHERE id = '99e92ff1-d776-4154-9346-426e3cb91936';` | `1` |
| 2 | `SELECT COUNT(*) FROM company_websites WHERE domain = 'coldroom-malaysia.vercel.app';` | `1` |
| 3 | `SELECT leads_mode, company_id FROM company_websites WHERE domain = 'coldroom-malaysia.vercel.app';` | `single`, `99e92ff1-d776-4154-9346-426e3cb91936` |
| 4 | `SELECT COUNT(*) FROM phone_numbers WHERE website = 'coldroom-malaysia.vercel.app';` | `1` |
| 5 | `SELECT phone_number, location_slug, label, type, is_active, percentage FROM phone_numbers WHERE website = 'coldroom-malaysia.vercel.app';` | `60192799832`, `all`, `default`, `default`, `true`, `100` |
| 6 | `SELECT COUNT(*) FROM products WHERE website = 'coldroom-malaysia.vercel.app' AND is_active = true;` | `4` |
| 7 | `SELECT slug, sort_order, rental_price FROM products WHERE website = 'coldroom-malaysia.vercel.app' ORDER BY sort_order;` | rows in order: frozen (8.00), freezer (7.00), chiller (6.00), cool (5.00) |
| 8 | `SELECT COUNT(*) FROM product_photos pp JOIN products p ON pp.product_id = p.id WHERE p.website = 'coldroom-malaysia.vercel.app';` | `>= 8` |
| 9 | URL HTTP smoke | every URL in §4.2 returns 200 |
| 10 | `SELECT COUNT(*) FROM blog_posts WHERE website = 'coldroom-malaysia.vercel.app' AND status = 'published';` | `>= 10` (post-Hanabi) |

---

**End of Cyclops Part 1 (spec only).** No SQL was executed. Cyclops Part 2 runs after Gate 1.
