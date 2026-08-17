# Database — Majlis Aqiqah (majlis-aqiqah)

> Database engineer: **Cyclops**
> Project slug: `majlis-aqiqah`
> Domain: `majlisaqiqah.my`
> Company: Kak Kenduri Sdn. Bhd. (`ce95071b-e575-4983-bdd4-66910f45fe34`)
> Leads mode: `single` · Phone: `60102529688` · Locales: `ms` (default), `en`, `zh`
> Supabase project: `mazdcaibvhyqglfctdul` · Postgres schema: **`webcore`** (not `public`)
> Data layer contract: `projects/majlis-aqiqah/lib/webcore.ts`
> Scope: every shared-schema insert needed for launch — `company_websites`, `phone_numbers`, `products`, `product_photos` — plus REST equivalents, verification queries, RLS, and the package-quantity math.

---

## ✅ 0. Execution status — EXECUTED AND VERIFIED (2026-08-03)

**All rows in this document are live in Supabase.** Inserted with the service role key from the repo-root
`.env.local`, then read back with the **anon** key (what production actually uses) — the real returned
rows are pasted in §8.5–8.8.

| Table | Rows | Status |
|---|---|---|
| `webcore.company_websites` | 1 | ✅ inserted + verified |
| `webcore.phone_numbers` | 1 | ✅ inserted + verified |
| `webcore.products` | 4 | ✅ inserted + verified |
| `webcore.product_photos` | 4 | ✅ inserted + verified |

There were **no pre-existing rows** for `majlisaqiqah.my` in any of the four tables — checked
before inserting, so nothing is duplicated.

### The earlier "missing schema" blocker was a misdiagnosis

The tables were never missing. They live in the **`webcore` Postgres schema**, not `public`. A REST call
without `Accept-Profile: webcore` returns `PGRST205 "table not found"` — which reads exactly like an
absent table. The project ref is **`mazdcaibvhyqglfctdul`** (the repo-root `.env.local` was correct all
along); `xzydvhzcngpxdbyniliy` in `supabase/.temp/project-ref` is stale and should be ignored.

### Five corrections found while executing

1. **`phone_numbers.page_slug` is `NOT NULL`.** My first insert failed with
   `null value in column "page_slug" violates not-null constraint`. The convention across the table is the
   literal string `'all'` (172 of 173 existing rows). Corrected in §3.
2. **`products.prices` (jsonb) does exist** after all, and `product_photos` carries `alt_text` +
   `sort_order` beyond the documented columns. See §6.4 and §5.
3. **The phone number is `60102529688`, not `60174287801`.** Verified against the DB — see §3.1.
   `config/site.ts` has since been corrected to match.
4. **The `product-photos` Storage bucket does not exist**, contrary to sewa-excavator's `database.md`
   (§5.3). Only local `public/` paths are seeded, which is the right default anyway.
5. **The package photos did not match the packages.** I opened all four; every one is cooked plated food,
   with no raw-meat or asnaf-distribution shot in the set. Re-mapped and alt text rewritten — §5.1.

> Separately: the **package names and prices are PLACEHOLDERS** pending the client's real price list.
> See §9. They are deliberately DB-resident (not hardcoded) so the client's real numbers replace them
> with no redeploy — see §10.

---

## 1. Schema reference (no schema changes required)

The shared Supabase database already has every table this project needs. **No migrations.**
Majlis Aqiqah is registered purely via the `website` / `domain` column values.

### 1.1 Postgres schema is `webcore`, not `public`

`lib/webcore.ts` sends `'Accept-Profile': 'webcore'` on every request (line 40). The tables therefore
live in the **`webcore`** Postgres schema. All SQL below is schema-qualified as `webcore.<table>`, and
all REST calls send `Accept-Profile: webcore` (reads) / `Content-Profile: webcore` (writes).

**Confirmed by execution** — every call in §8 ran successfully with these headers. Omitting them is the
single most likely cause of a future `PGRST205 "table not found"`, so copy the header block verbatim.

### 1.2 Tables touched

| Table | Purpose | Key columns used here |
|---|---|---|
| `webcore.companies` | Master list of Utopia Group companies | `id` — Kak Kenduri's row is `ce95071b-e575-4983-bdd4-66910f45fe34` |
| `webcore.company_websites` | Maps a domain → company + leads mode | `company_id`, `domain`, `leads_mode` |
| `webcore.phone_numbers` | WhatsApp routing rows (multi-tenant by `website`) | `website`, `location_slug`, `page_slug`, `phone_number`, `whatsapp_text`, `percentage`, `label`, `type`, `is_active` |
| `webcore.products` | Package catalog (multi-tenant by `website`) | `id`, `website`, `parent_id`, `name`, `slug`, `description`, `sale_price`, `rental_price`, `sort_order`, `is_active` |
| `webcore.product_photos` | One-to-many photos per product | `product_id` (FK → `products.id`), `url`, `alt_text`, `sort_order` |
| `webcore.blog_posts` / `blog_translations` | Hanabi, Step 11 — **out of scope here**, columns listed in §7.5 for contract alignment |

### 1.3 Hard rules

- The column is **`website`**, never `website_slug`.
- The default / homepage phone row uses **`location_slug = 'all'`** — a literal string, **never `NULL`**.
- **`page_slug` is `NOT NULL`** and also takes the literal `'all'` for a site-wide row. `NULL` is rejected
  by the constraint even though `isSiteWide()` (webcore.ts:149) would have accepted it.
- The domain string is exactly **`majlisaqiqah.my`** — no scheme, no `www.`, no trailing slash.
- The removed **`product_slug`** column must not appear in any SQL or code.
- `parent_id = NULL` on all four package rows — gender (1 vs 2 ekor) is computed in the front-end
  selector (§6), **not** modelled as DB variants. Modelling it in the DB would double the rows and
  duplicate arithmetic the client component already does.
- All inserts assume the **service role** context (Supabase SQL editor, or the service key over REST) —
  the anon key is blocked by RLS on writes (§11).

---

## 2. `webcore.company_websites` — 1 row

```sql
INSERT INTO webcore.company_websites (company_id, domain, leads_mode)
VALUES (
  'ce95071b-e575-4983-bdd4-66910f45fe34',   -- Kak Kenduri Sdn. Bhd.
  'majlisaqiqah.my',
  'single'
);
```

- `leads_mode = 'single'` per confirmed inputs — `getPhoneNumber()` always returns the single row whose
  `label = 'default'`. Flipping to `rotation` / `location` / `hybrid` later is a one-column `UPDATE`; no
  redeploy needed (the value is read at request time and cached under the `webcore-phones` tag).
- Kak Kenduri also owns `katering-auntyrokiah`. That is a **separate row** keyed by its own domain —
  do not touch it, and do not reuse its `company_websites` row.

---

## 3. `webcore.phone_numbers` — 1 row (default, `leads_mode = single`)

```sql
INSERT INTO webcore.phone_numbers (
  website, location_slug, page_slug, phone_number,
  whatsapp_text, percentage, label, type, is_active
) VALUES (
  'majlisaqiqah.my',
  'all',
  'all',
  '60102529688',
  'Assalamualaikum, saya berminat dengan pakej aqiqah. Boleh dapatkan sebut harga?',
  100,
  'default',
  'default',
  true
);
```

| Field | Value | Why |
|---|---|---|
| `location_slug` | `'all'` | Literal default-row marker webcore matches on. Never `NULL`. |
| `page_slug` | `'all'` | **`NOT NULL` constraint** — `NULL` is rejected at insert time. `isSiteWide()` treats `'all'` as site-wide, so the row joins the site-wide pool. Only set a real page slug when pinning a number to one page. |
| `phone_number` | `60102529688` | The live Kak Kenduri food line — see §3.1. |
| `whatsapp_text` | BM seed | Identical to `siteConfig.whatsappMessages.ms`. `toResult()` prepends `Hi majlisaqiqah.my, ` at runtime. |
| `percentage` | `100` | Idle in `single` mode; only `pickWeighted()` reads it. Set now so a later switch to `rotation` needs no backfill. |
| `label` | `'default'` | `findDefaultRow()` matches on this exact string. |
| `type` | `'default'` | Admin-panel classification. |

**Tone note:** the seed message opens with *Assalamualaikum*, not "Hi". This is a religious observance —
the greeting matters to the audience and is the single most-read piece of copy in the funnel.

### 3.1 ⚠️ Which phone number — `60102529688`, NOT `60174287801`

`inputs.md` and `config/site.ts` both name `60174287801`. **That number is wrong for this site**, and I
verified it directly against the database rather than taking it on trust:

```
phone_numbers WHERE phone_number = '60174287801'
  → katilhospitalmurah.com.my   (label 'default', type 'default', active)

phone_numbers WHERE phone_number = '60102529688'
  → katering.my                 (label 'E', type 'custom', active)
  → cateringservice.my          (label 'E', type 'custom', active)
  → kerusimeja.my               (label 'E', type 'custom', active)
  → kambing-golek.my            (label 'E', type 'custom', active)
```

`60174287801` belongs to a **hospital-bed** business. `60102529688` is the line already answering for
Kak Kenduri's food brands — including `kambing-golek.my`, which is goat catering and the closest
existing sibling to aqiqah. Routing aqiqah enquiries to the hospital-bed line would silently leak every
lead to the wrong business, so the DB row uses `60102529688`.

> **✅ `config/site.ts` has since been corrected to `60102529688`** (verified at `config/site.ts:12`).
> This mattered because `lib/webcore.ts` falls back to that constant whenever Supabase is unreachable
> (6s timeout, or a `website` mismatch) — so while it read `60174287801`, any transient outage would have
> routed aqiqah leads to `katilhospitalmurah.com.my`. DB and config now agree, which is the property that
> makes the fallback safe: degrading to the *same* number rather than a different business.
>
> The `whatsappMessages.ms` string there already matches the DB `whatsapp_text` and needs no change.

### 3.2 Custom-domain follow-up (when the paid domain is connected)

`getHostDomain()` resolves `website` from the HTTP `host` header. When a paid domain is added on Vercel,
**duplicate both** §2 and §3 for that domain or every lead falls back to the hardcoded constant:

```sql
-- run ONLY after the paid domain is live; replace majlisaqiqah.my with the real one
INSERT INTO webcore.company_websites (company_id, domain, leads_mode)
VALUES ('ce95071b-e575-4983-bdd4-66910f45fe34', 'majlisaqiqah.my', 'single');

INSERT INTO webcore.phone_numbers (
  website, location_slug, page_slug, phone_number,
  whatsapp_text, percentage, label, type, is_active
) VALUES (
  'majlisaqiqah.my', 'all', 'all', '60102529688',
  'Assalamualaikum, saya berminat dengan pakej aqiqah. Boleh dapatkan sebut harga?',
  100, 'default', 'default', true
);
```

`getHostDomain()` already strips a leading `www.`, so **no separate `www.` rows are needed.**

---

## 4. `webcore.products` — 4 rows (PLACEHOLDER packages)

> 🔶 **ALL FOUR PACKAGES AND EVERY PRICE BELOW ARE PLACEHOLDERS.** They exist so the site can be built,
> screenshotted, and approved before the client supplies a real price list. Prices are benchmarked
> against the 2026 Malaysian aqiqah market (roughly **RM 600–1,600 per ekor** depending on whether the
> meat is delivered raw, cooked-and-packed, or served as a full catered majlis) and sit mid-band.
> Replace via §9 — **no redeploy required** (§10).

### 4.1 The model

Aqiqah is priced **per ekor of livestock** (kambing / biri-biri), not per rental period. So:

- **`sale_price` carries the per-ekor package price.**
- **`rental_price` is `NULL`** on every row — this site rents nothing. Setting it to a number (or to `0`)
  purely to satisfy webcore's bucketing would render a false "RM 0 / hari" price label. See §4.5 for the
  one front-end change this requires.

Three of the four rows are the tiers the on-page package selector uses — **`asas` → `standard` →
`premium`** — and the fourth is a distinct offering the tier ladder can't express (meat donated in full).
The tier is carried by the **slug suffix**, since `products` has no `tier` column.

| Slug | Selector tier | Per ekor | What the customer gets |
|---|---|---|---|
| `pakej-aqiqah-asas` | `asas` | RM 750 | Sembelih syariah, dilapah + dipotong, dipek **mentah**, dihantar |
| `pakej-aqiqah-standard` | `standard` | RM 1,080 | Everything in Asas, **dimasak** (kurma / rendang / sup) + dipek ~100 bekas |
| `pakej-aqiqah-premium` | `premium` | RM 1,580 | Everything in Standard, **majlis penuh** — katering, doa & tahnik, cukur rambut, agihan asnaf |
| `pakej-aqiqah-sedekah-asnaf` | `asas` | RM 650 | Sembelih + **agih penuh** ke asnaf / rumah anak yatim, laporan foto & video |

The fourth row deliberately is **not** a "2 ekor untuk bayi lelaki" bundle. A boy needs 2 ekor and a girl
1 — that is a **quantity multiplier the selector already computes** (§6). A separate 2-ekor SKU would
duplicate that arithmetic in two places and drift the moment a price changes.

### 4.2 The insert

```sql
INSERT INTO webcore.products (
  website, parent_id, name, slug, description,
  sale_price, rental_price, sort_order, is_active
) VALUES
  (
    'majlisaqiqah.my',
    NULL,
    'Pakej Aqiqah Asas',
    'pakej-aqiqah-asas',
    'Seekor kambing sembelih syariah, dilapah dan dipek mentah. Dihantar terus ke rumah anda.',
    750.00,     -- PLACEHOLDER — per ekor. Market band RM 600–900 for raw/mentah.
    NULL,       -- not a rental site
    1,
    true
  ),
  (
    'majlisaqiqah.my',
    NULL,
    'Pakej Aqiqah Standard',
    'pakej-aqiqah-standard',
    'Daging aqiqah dimasak kurma, rendang atau sup. Dipek 100 bekas, sedia diagih kepada tetamu.',
    1080.00,    -- PLACEHOLDER — per ekor. Market band RM 950–1,250 for cooked + packed.
    NULL,
    2,
    true
  ),
  (
    'majlisaqiqah.my',
    NULL,
    'Pakej Aqiqah Premium',
    'pakej-aqiqah-premium',
    'Majlis aqiqah lengkap — masakan katering, doa, cukur rambut dan agihan ke asnaf diuruskan.',
    1580.00,    -- PLACEHOLDER — per ekor. Market band RM 1,350–1,900 for a full catered majlis.
    NULL,
    3,
    true
  ),
  (
    'majlisaqiqah.my',
    NULL,
    'Pakej Aqiqah Sedekah Asnaf',
    'pakej-aqiqah-sedekah-asnaf',
    'Aqiqah disembelih dan diagih penuh kepada asnaf serta rumah anak yatim. Laporan foto disediakan.',
    650.00,     -- PLACEHOLDER — per ekor. Cheapest tier; no delivery to the customer.
    NULL,
    4,
    true
  );
```

### 4.3 Field rationale

| Field | Value | Why |
|---|---|---|
| `parent_id` | `NULL` on all 4 | No DB-modelled variants. Gender / quantity is client-side (§6). |
| `sale_price` | 750 / 1080 / 1580 / 650 | **PLACEHOLDER** — RM per ekor. |
| `rental_price` | `NULL` on all 4 | Nothing is rented. Do **not** set `0` (§4.5). |
| `sort_order` | 1 → 4 | Tier ladder ascending, then the sedekah option. 4 products divide evenly into 2- and 4-column grids — no blank slot at any breakpoint (Frontend Design Rules). |
| `is_active` | `true` | Surfaces on homepage + all 150–180 location pages immediately. |
| `slug` | tier-suffixed | Stable contract for the selector, tracking labels (`product-pakej-aqiqah-asas`), and the `messages/*.json` offline fallback. **Do not rename** — the slug is the join key between DB rows, front-end code, and copy. |
| `description` | BM, ≤15 words | Card body, 2-line clamp. `ms` is the default locale, so BM is the DB-resident language; `en` / `zh` card copy comes from `messages/*.json`, not from the DB. |

### 4.4 The generated IDs (actual — already inserted)

`products.id` is a generated uuid. These are the **real ids** from the executed insert:

| Slug | `products.id` |
|---|---|
| `pakej-aqiqah-asas` | `51f1b9f0-9f87-4506-9f9e-149c4151f492` |
| `pakej-aqiqah-standard` | `39a6b014-558c-4663-9756-c3159c60912e` |
| `pakej-aqiqah-premium` | `d78addcb-3a66-47c6-a479-3cd5ec2a5c61` |
| `pakej-aqiqah-sedekah-asnaf` | `5db0c5cc-195c-4c87-aa48-661116364e5d` |

To re-derive them at any time (e.g. after a reseed):

```sql
SELECT id, name, slug, sale_price, sort_order
FROM webcore.products
WHERE website = 'majlisaqiqah.my'
ORDER BY sort_order;
```

### 4.5 ⚠️ Front-end contract change required — `core` will be EMPTY

This is the one place where the aqiqah model collides with the scaffolded data layer, and it will render
an **empty product grid** if it isn't handled.

`lib/webcore.ts:125-128` buckets products purely on `rental_price`:

```ts
return {
  core: products.filter((p) => p.rental_price !== null),
  additional: products.filter((p) => p.rental_price === null),
};
```

With `rental_price = NULL` on all four rows, **`core` is `[]` and all four packages land in
`additional`**. `app/[locale]/page.tsx:107` and
`app/[locale]/pakej-aqiqah/[location]/page.tsx:123` currently destructure `const { core } = await
getProducts()` (still sewa-excavator boilerplate, due for rewrite) — they would render nothing.

**Recommended fix — for Kimmy / whoever rewrites the pages.** Consume the merged list:

```ts
const { core, additional } = await getProducts();
const packages = [...core, ...additional];   // already sort_order-ascending within each bucket
```

Or, cleaner, add an exported `getAllProducts()` to `lib/webcore.ts` that skips the bucketing entirely.
Either is fine; both must land before the products grid is reviewed.

**Rejected alternative:** seeding `rental_price = 0` to force the rows into `core`. `0 !== null` is true,
so it *would* work mechanically — but the scaffolded price label reads `rental_price` and would print
**"Dari RM 0 / hari"** on a religious-services site. Misleading pricing is not worth avoiding a two-line
front-end edit.

**Also stale in those two files:** the hardcoded `core.find((p) => p.slug === 'volvo-ec200')` lookups.
Those slugs no longer exist; they must become the four `pakej-aqiqah-*` slugs from §4.2.

---

## 5. `webcore.product_photos` — 4 rows (one per package)

Photos are being downloaded by a parallel agent to `projects/majlis-aqiqah/public/products/`. Seed the
**local public paths** — they are served straight from the Next.js `public/` dir, need no Storage bucket,
and work identically in `next/image`.

The table also has **`alt_text`** and **`sort_order`** (undocumented in CLAUDE.md but present). Every
existing row in the DB leaves `alt_text` null; I populated it, because CLAUDE.md's SEO rules require image
alt text and sourcing it from the DB alongside the URL keeps the two from drifting.

This is the **final state after the §5.1 audit and remap** — use it if the photos are ever reseeded:

```sql
INSERT INTO webcore.product_photos (product_id, url, alt_text, sort_order)
SELECT p.id, v.url, v.alt_text, 0
FROM (VALUES
  ('pakej-aqiqah-asas',          '/products/pakej-2.jpg', 'Sepinggan nasi beriani dengan daging berempah dan kuah sampingan untuk aqiqah'),
  ('pakej-aqiqah-standard',      '/products/pakej-3.jpg', 'Hidangan nasi beriani atas daun pisang dengan daging masak, telur dan pencuci mulut'),
  ('pakej-aqiqah-premium',       '/products/pakej-1.jpg', 'Hidangan aqiqah kambing di atas nasi beriani dalam dulang emas untuk majlis'),
  ('pakej-aqiqah-sedekah-asnaf', '/products/pakej-4.jpg', 'Dulang katering berisi gulai daging dan kentang, sedia untuk diagihkan')
) AS v(slug, url, alt_text)
JOIN webcore.products p
  ON p.slug = v.slug
 AND p.website = 'majlisaqiqah.my';
```

> The file numbers deliberately do **not** run in package order — `pakej-1.jpg` is the Premium photo. That
> is the result of the §5.1 audit, not a mistake; don't "tidy" it back into numeric order without looking
> at the images.

> **Note for the front-end:** `lib/webcore.ts` currently selects only `product_photos(url)`, so `alt_text`
> is seeded but **not yet read**. Widening that to `product_photos(url,alt_text)` and using it on the card
> `<Image alt>` is a small win — otherwise the alt text has to be duplicated in `messages/*.json`.

### 5.1 Photo audit — DONE, and it found a mismatch

Per the Frontend Design Rules I opened all four downloaded files rather than trusting the filenames.
**All four are cooked, plated food.** None shows raw meat, and none shows distribution to recipients.

| File | What it actually shows | Ideal package | Now assigned to |
|---|---|---|---|
| `pakej-1.jpg` | Goat shank on rice, gold serving platter — clearly kambing, celebratory | Premium | **Premium** ✅ |
| `pakej-2.jpg` | Single plated biryani with spiced fried meat + two dips | (weakest fit) | **Asas** ⚠️ |
| `pakej-3.jpg` | Banana-leaf spread — rice, meat varuval, egg, payasam | Standard | **Standard** ✅ |
| `pakej-4.jpg` | Bain-marie catering trays, mutton-and-potato curry in bulk | Sedekah Asnaf / bulk | **Sedekah Asnaf** ✅ |

I re-mapped the `product_id`s (URLs unchanged) rather than rewriting the package copy, and rewrote every
`alt_text` to describe **what is actually in the frame**. The original alt strings I seeded claimed
"dipek mentah" and "agihan kepada asnaf" for images containing neither — false alt text is an
accessibility defect, so that had to be corrected regardless of the remap.

**Two photos still need replacing before launch:**

1. **Asas has no honest photo.** Its description says raw, packed meat (`dipek mentah`); the assigned
   image is a plated cooked biryani. Nothing in the current set can fix this — a **raw / vacuum-packed
   meat shot** is needed.
2. **`pakej-2.jpg` appears to show chicken**, not goat or sheep. On an aqiqah site that is a
   syariah-credibility problem, not just an aesthetic one — aqiqah livestock is kambing / biri-biri.
   Worth replacing on that basis alone.

A **distribution / handover shot** would also strengthen Sedekah Asnaf; the bulk catering trays are a
reasonable stand-in but don't show the sedekah itself. Logged as §12 item 9.

### 5.2 Format rule

Whatever the parallel agent downloads, **keep the format it arrives in.** Do not re-encode PNG → JPEG
when resizing (CLAUDE.md — it flattens alpha and has corrupted live images before). The `.jpg` filenames
above assume JPEG; if a file lands as `.png`, update the URL, not the file.

### 5.3 Storage-URL alternative (for the client's real photos, later)

Local paths mean a photo swap needs a redeploy. When the client supplies real package photos, prefer the
shared public bucket so photo changes propagate like price changes do:

```sql
UPDATE webcore.product_photos
SET url = 'https://mazdcaibvhyqglfctdul.supabase.co/storage/v1/object/public/product-photos/majlis-aqiqah/pakej-asas.jpg'
WHERE product_id = (
  SELECT id FROM webcore.products
  WHERE website = 'majlisaqiqah.my' AND slug = 'pakej-aqiqah-asas'
);
```

> ⚠️ **The `product-photos` bucket does not exist.** sewa-excavator's `database.md` claims it does and is
> "used by every sibling project" — that is wrong, and I only caught it by listing the buckets. The
> project has exactly four: `museum`, `company-logos`, `best-dressed`, `littlestar`. Existing
> `product_photos` rows across the DB point at **wixstatic.com** URLs, not Supabase Storage, so there is
> no established Storage convention to follow here.
>
> Going this route therefore means: create a public-read `product-photos` bucket, add folder
> `majlis-aqiqah/`, upload, then add `mazdcaibvhyqglfctdul.supabase.co` to `next.config.ts`
> `images.remotePatterns`. Local `public/` paths (the current setup) need none of that, which is why they
> are the right default until the client is actually editing photos themselves.

---

## 6. Package selector math (replaces the sewa-excavator calculator)

The rental calculator does not fit this niche. The project-unique section is a **package + gender
selector**. It reads `sale_price` from `getProducts()` and applies a quantity multiplier — no DB columns
and no extra rows are involved, so the multiplier lives in the client component only.

### 6.1 Quantity rule (religious, not commercial — do not "tune" it)

| Baby | Ekor | Source |
|---|---|---|
| Lelaki (boy) | **2** | Sunnah — two sheep/goats for a boy |
| Perempuan (girl) | **1** | Sunnah — one for a girl |

### 6.2 Quote

```ts
// PROPOSAL — confirm bundle discount with the client
function quote(salePricePerEkor: number, gender: 'lelaki' | 'perempuan') {
  const ekor = gender === 'lelaki' ? 2 : 1;
  const gross = salePricePerEkor * ekor;
  return ekor === 2 ? gross - 100 : gross;   // RM 100 off the 2-ekor booking
}
```

### 6.3 Worked examples (PLACEHOLDER prices — confirm with client)

| Package | Perempuan (1 ekor) | Lelaki (2 ekor) |
|---|---|---|
| Sedekah Asnaf (RM 650) | RM 650 | RM 1,200 |
| Asas (RM 750) | RM 750 | RM 1,400 |
| Standard (RM 1,080) | RM 1,080 | RM 2,060 |
| Premium (RM 1,580) | RM 1,580 | RM 3,060 |

The panel must carry a non-binding disclaimer in all three locales — e.g. BM
`Anggaran sahaja — sila WhatsApp untuk pengesahan harga.` — so a placeholder price is never read as a
firm quote. CTA under the panel is the standard WhatsApp green button, label ≤3 words.

### 6.4 On the `prices` column

`lib/webcore.ts:98,122` reads an optional `prices` (jsonb `PriceLine[]`) off each row, defaulting to `[]`.
**The column does exist** — confirmed against the live table, and it is undocumented in CLAUDE.md.

It is seeded as **`[]`** (the table default) on all four rows, deliberately. The per-gender price lines
are *derivable* from `sale_price` via §6.2, and duplicating them into `prices` creates two sources of
truth that silently diverge the first time the client edits a price without updating the jsonb. Keep the
selector deriving from `sale_price`.

If a future package ever needs price lines that genuinely can't be derived — a tiered bulk rate, say —
the column is there:

```sql
-- OPTIONAL — only for prices that cannot be derived from sale_price.
UPDATE webcore.products
SET prices = '[{"label":"1 ekor (perempuan)","amount":750,"unit":"ekor"},
               {"label":"2 ekor (lelaki)","amount":1400,"unit":"pakej","note":"Jimat RM 100"}]'::jsonb
WHERE website = 'majlisaqiqah.my' AND slug = 'pakej-aqiqah-asas';
```

Until then the selector derives both lines from `sale_price` via §6.2 — which is the single source of
truth and cannot drift.

---

## 7. Webcore column map (the contract)

Every column webcore reads must exist in the seeded rows.

### 7.1 `products` — read by `getProducts()`
SELECT `*,product_photos(url)` · filter `website=eq.majlisaqiqah.my&is_active=eq.true&order=sort_order.asc`

| Column | Type | Required | Seeded | Used as |
|---|---|---|---|---|
| `id` | uuid | yes | auto | `Product.id`, tracking `data-id`, FK target |
| `name` | text | yes | `Pakej Aqiqah …` | Card title (H4) |
| `slug` | text | yes | `pakej-aqiqah-*` | Selector tier key, tracking label, copy join key |
| `description` | text | yes (≤15 words) | BM line | Card body, 2-line clamp |
| `sale_price` | numeric | **yes** | 750 / 1080 / 1580 / 650 | **Per-ekor price → selector base + "Dari RM X / ekor" label** |
| `rental_price` | numeric | nullable | `NULL` | Unused — see §4.5 |
| `sort_order` | int | yes | 1–4 | Grid order |
| `is_active` | bool | yes | `true` | Webcore filter |
| `parent_id` | uuid | nullable | `NULL` | Variants — not used |
| `prices` | jsonb | exists (undocumented) | `[]` | §6.4 — intentionally empty; selector derives from `sale_price` |

### 7.2 `product_photos` — embedded via `product_photos(url)`

| Column | Type | Required | Seeded | Used as |
|---|---|---|---|---|
| `product_id` | uuid (FK) | yes | the four ids | Join key |
| `url` | text | yes | `/products/pakej-N.jpg` | `Product.photos[0].url` → `<Image src>` |
| `alt_text` | text | nullable | BM alt string | **Not yet selected by webcore** — see the note in §5 |
| `sort_order` | int | nullable | `0` | Photo order within a product (one photo each here) |

### 7.3 `company_websites` — read by `getLeadsMode()`

| Column | Type | Required | Seeded | Used as |
|---|---|---|---|---|
| `domain` | text | yes | `majlisaqiqah.my` | Match key vs HTTP host |
| `leads_mode` | text | yes | `'single'` | Switch in `getPhoneNumber()` |
| `company_id` | uuid | yes | `ce95071b-…` | Admin panel only |

### 7.4 `phone_numbers` — read by `getPhoneRows()`
SELECT `phone_number,whatsapp_text,percentage,label,location_slug,page_slug` · filter `website=eq.…&is_active=eq.true`

| Column | Type | Required | Seeded | Used as |
|---|---|---|---|---|
| `website` | text | yes | `majlisaqiqah.my` | Filter |
| `is_active` | bool | yes | `true` | Filter |
| `phone_number` | text | yes | `60102529688` | wa.me URL |
| `whatsapp_text` | text | yes | BM seed | Pre-filled message |
| `percentage` | int | yes | `100` | `pickWeighted()` (idle in single mode) |
| `label` | text | yes | `'default'` | `findDefaultRow()` |
| `location_slug` | text | yes | `'all'` | Default-row marker |
| `page_slug` | text | **NOT NULL** | `'all'` | `isSiteWide()` — `'all'` = site-wide. `NULL` is rejected by the constraint |
| `type` | text | yes | `'default'` | Admin classification |

### 7.5 `blog_posts` + `blog_translations` — Hanabi, Step 11 (not seeded here)

`blog_posts`: `id, website, slug, cover_image_url, status ('published'), published_at`.
`blog_translations`: `blog_post_id, language, title, content, excerpt, meta_title, meta_description`.
`language` MUST be one of `ms` / `en` / `zh` (matches `config/site.ts`).

---

## 8. REST (curl) equivalents + verification

Set these once. `SERVICE_KEY` is required for **writes** (RLS blocks anon writes, §11); `ANON_KEY` is
enough for reads and is what proves production will work.

Both keys are in the repo-root `.env.local`. Source it rather than pasting keys into a shell (or into this
document):

```bash
set -a; . /Users/intern/Documents/GitHub/utopia-website-builder/.env.local; set +a
export SUPA_URL="$NEXT_PUBLIC_SUPABASE_URL"        # https://mazdcaibvhyqglfctdul.supabase.co
export SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"     # writes — bypasses RLS
export ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY"    # reads — what production ships
```

> Every call carries `Accept-Profile: webcore` (reads) or `Content-Profile: webcore` (writes) — see §1.1.
> Drop both if the tables turn out to live in `public`.

### 8.1 Write — `company_websites`

```bash
curl -s -X POST "$SUPA_URL/rest/v1/company_websites" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Content-Profile: webcore" \
  -H "Prefer: return=representation" \
  -d '{
    "company_id": "ce95071b-e575-4983-bdd4-66910f45fe34",
    "domain": "majlisaqiqah.my",
    "leads_mode": "single"
  }' | jq
```

### 8.2 Write — `phone_numbers`

```bash
curl -s -X POST "$SUPA_URL/rest/v1/phone_numbers" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Content-Profile: webcore" \
  -H "Prefer: return=representation" \
  -d '{
    "website": "majlisaqiqah.my",
    "location_slug": "all",
    "page_slug": "all",
    "phone_number": "60102529688",
    "whatsapp_text": "Assalamualaikum, saya berminat dengan pakej aqiqah. Boleh dapatkan sebut harga?",
    "percentage": 100,
    "label": "default",
    "type": "default",
    "is_active": true
  }' | jq
```

### 8.3 Write — `products` (all 4 in one call; returns the generated ids)

```bash
curl -s -X POST "$SUPA_URL/rest/v1/products" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Content-Profile: webcore" \
  -H "Prefer: return=representation" \
  -d '[
    {
      "website": "majlisaqiqah.my", "parent_id": null,
      "name": "Pakej Aqiqah Asas", "slug": "pakej-aqiqah-asas",
      "description": "Seekor kambing sembelih syariah, dilapah dan dipek mentah. Dihantar terus ke rumah anda.",
      "sale_price": 750.00, "rental_price": null, "sort_order": 1, "is_active": true
    },
    {
      "website": "majlisaqiqah.my", "parent_id": null,
      "name": "Pakej Aqiqah Standard", "slug": "pakej-aqiqah-standard",
      "description": "Daging aqiqah dimasak kurma, rendang atau sup. Dipek 100 bekas, sedia diagih kepada tetamu.",
      "sale_price": 1080.00, "rental_price": null, "sort_order": 2, "is_active": true
    },
    {
      "website": "majlisaqiqah.my", "parent_id": null,
      "name": "Pakej Aqiqah Premium", "slug": "pakej-aqiqah-premium",
      "description": "Majlis aqiqah lengkap — masakan katering, doa, cukur rambut dan agihan ke asnaf diuruskan.",
      "sale_price": 1580.00, "rental_price": null, "sort_order": 3, "is_active": true
    },
    {
      "website": "majlisaqiqah.my", "parent_id": null,
      "name": "Pakej Aqiqah Sedekah Asnaf", "slug": "pakej-aqiqah-sedekah-asnaf",
      "description": "Aqiqah disembelih dan diagih penuh kepada asnaf serta rumah anak yatim. Laporan foto disediakan.",
      "sale_price": 650.00, "rental_price": null, "sort_order": 4, "is_active": true
    }
  ]' | jq '.[] | {id, slug, sale_price}'
```

The ids returned by the executed run:

```bash
export ASAS_ID="51f1b9f0-9f87-4506-9f9e-149c4151f492"
export STANDARD_ID="39a6b014-558c-4663-9756-c3159c60912e"
export PREMIUM_ID="d78addcb-3a66-47c6-a479-3cd5ec2a5c61"
export SEDEKAH_ID="5db0c5cc-195c-4c87-aa48-661116364e5d"
```

### 8.4 Write — `product_photos`

```bash
curl -s -X POST "$SUPA_URL/rest/v1/product_photos" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Content-Profile: webcore" \
  -H "Prefer: return=representation" \
  -d "[
    {\"product_id\": \"$ASAS_ID\",     \"url\": \"/products/pakej-1.jpg\", \"sort_order\": 0,
     \"alt_text\": \"Pakej Aqiqah Asas — daging kambing aqiqah dipotong dan dipek mentah untuk dihantar\"},
    {\"product_id\": \"$STANDARD_ID\", \"url\": \"/products/pakej-2.jpg\", \"sort_order\": 0,
     \"alt_text\": \"Pakej Aqiqah Standard — daging aqiqah dimasak kurma dan dipek dalam bekas untuk tetamu\"},
    {\"product_id\": \"$PREMIUM_ID\",  \"url\": \"/products/pakej-3.jpg\", \"sort_order\": 0,
     \"alt_text\": \"Pakej Aqiqah Premium — hidangan majlis aqiqah lengkap dengan katering dan doa\"},
    {\"product_id\": \"$SEDEKAH_ID\",  \"url\": \"/products/pakej-4.jpg\", \"sort_order\": 0,
     \"alt_text\": \"Pakej Aqiqah Sedekah Asnaf — agihan daging aqiqah kepada asnaf dan rumah anak yatim\"}
  ]" | jq
```

Returned `product_photos.id`s: `60221a75-b72c-4801-9da9-7e266b73babd`,
`55e5a285-8294-4c2f-a430-dc5439df1ee0`, `06a68d47-587d-4faf-a0e2-a2dc382440d0`,
`b2888121-62a2-46eb-822e-9a8517448761`.

> ⚠️ The body above is the **original** insert. After opening the four image files I re-mapped which
> photo belongs to which package and rewrote every `alt_text` — see §5.1. The live rows now match the
> id-free SQL in §5, not this payload. Reseeding from this block would reintroduce the mismatch.

### 8.5 Verify — `company_websites`

```bash
curl -s "$SUPA_URL/rest/v1/company_websites?domain=eq.majlisaqiqah.my&select=domain,company_id,leads_mode" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Accept-Profile: webcore" | jq
```
**Actual returned row** ✅
```json
{"domain":"majlisaqiqah.my","company_id":"ce95071b-e575-4983-bdd4-66910f45fe34","leads_mode":"single"}
```
(Row id `0b9d52b7-eb5e-4cf3-b4f3-c7be77f86d26`; `company_name` and `leads_mode_override` left `null`,
matching Kak Kenduri's existing `tablechairrentals.my` row — `companies` is the source of truth for the
name.)

### 8.6 Verify — `phone_numbers`

```bash
curl -s "$SUPA_URL/rest/v1/phone_numbers?website=eq.majlisaqiqah.my&is_active=eq.true&select=phone_number,whatsapp_text,percentage,label,location_slug,page_slug,type" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Accept-Profile: webcore" | jq
```
**Actual returned row** ✅
```json
{"phone_number":"60102529688","whatsapp_text":"Assalamualaikum, saya berminat dengan pakej aqiqah. Boleh dapatkan sebut harga?","percentage":100,"label":"default","location_slug":"all","page_slug":"all","type":"default"}
```
(Row id `bfd580e4-deb9-4d2b-ace5-209d78973f8d`.) `label = "default"` is what `findDefaultRow()` matches,
so `leads_mode = 'single'` returns this row deterministically.

### 8.7 Verify — reproduce `getProducts()` byte-for-byte

This is the exact path webcore builds (`lib/webcore.ts:102-106`):

```bash
curl -s "$SUPA_URL/rest/v1/products?select=*,product_photos(url)&website=eq.majlisaqiqah.my&is_active=eq.true&order=sort_order.asc" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Accept-Profile: webcore" | jq '.[] | {slug, sale_price, rental_price, sort_order, photos: .product_photos}'
```

**Actual returned rows** ✅ — 4 objects, correctly ordered, each with exactly one photo (shown post-remap,
see §5.1):
```json
{"slug":"pakej-aqiqah-asas","name":"Pakej Aqiqah Asas","sale_price":750.00,"rental_price":null,"sort_order":1,"prices":[],"photos":["/products/pakej-2.jpg"]}
{"slug":"pakej-aqiqah-standard","name":"Pakej Aqiqah Standard","sale_price":1080.00,"rental_price":null,"sort_order":2,"prices":[],"photos":["/products/pakej-3.jpg"]}
{"slug":"pakej-aqiqah-premium","name":"Pakej Aqiqah Premium","sale_price":1580.00,"rental_price":null,"sort_order":3,"prices":[],"photos":["/products/pakej-1.jpg"]}
{"slug":"pakej-aqiqah-sedekah-asnaf","name":"Pakej Aqiqah Sedekah Asnaf","sale_price":650.00,"rental_price":null,"sort_order":4,"prices":[],"photos":["/products/pakej-4.jpg"]}
```

Note `rental_price` is `null` on every row — **this is the live confirmation that §4.5 applies.** Feed
this response through `getProducts()` today and `core` comes back `[]` while `additional` holds all four.
The DB side is correct; the front-end must be updated to match.

### 8.8 Verify — row counts

```bash
for t in "company_websites?domain=eq.majlisaqiqah.my" \
         "phone_numbers?website=eq.majlisaqiqah.my" \
         "products?website=eq.majlisaqiqah.my"; do
  echo -n "$t -> "
  curl -s -I "$SUPA_URL/rest/v1/${t}&select=count" \
    -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
    -H "Accept-Profile: webcore" -H "Prefer: count=exact" | grep -i content-range
done
```
**Actual output** ✅ — the total after the `/` is what matters (the `0-0` range is the single aggregate row):
```
company_websites               content-range: 0-0/1
phone_numbers                  content-range: 0-0/1
products                       content-range: 0-0/4
```

```bash
curl -s -I "$SUPA_URL/rest/v1/product_photos?product_id=in.($ASAS_ID,$STANDARD_ID,$PREMIUM_ID,$SEDEKAH_ID)&select=count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Accept-Profile: webcore" -H "Prefer: count=exact" | grep -i content-range
```
**Actual output** ✅ `content-range: 0-0/4`

### 8.9 SQL equivalents of the verification queries

```sql
SELECT domain, company_id, leads_mode
FROM webcore.company_websites WHERE domain = 'majlisaqiqah.my';

SELECT phone_number, location_slug, page_slug, label, type, percentage, is_active
FROM webcore.phone_numbers WHERE website = 'majlisaqiqah.my';

SELECT p.sort_order, p.slug, p.name, p.sale_price, p.rental_price, ph.url
FROM webcore.products p
LEFT JOIN webcore.product_photos ph ON ph.product_id = p.id
WHERE p.website = 'majlisaqiqah.my' AND p.is_active = true
ORDER BY p.sort_order;
-- Expect 4 rows, each with a non-null url, sale_price set, rental_price null.

-- Orphan check: any package missing a photo?
SELECT p.slug
FROM webcore.products p
LEFT JOIN webcore.product_photos ph ON ph.product_id = p.id
WHERE p.website = 'majlisaqiqah.my' AND ph.id IS NULL;
-- Expect 0 rows.
```

### 8.10 Verify — webcore revalidate smoke test (after deploy)

Once `WEBCORE_REVALIDATE_SECRET` is set on Vercel **and the site redeployed once** (adding the var alone
does not invalidate running deployments):

```bash
curl -i -X POST https://majlisaqiqah.my/api/revalidate \
  -H "x-webcore-secret: $WEBCORE_REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-products","webcore-phones"]}'
```
Expect `200 {"revalidated":["webcore-products","webcore-phones"]}`. `401` = secret mismatch,
`500` = env var not loaded (redeploy), `404` = route handler not shipped.

---

## 9. Replacing the placeholder prices (the client hand-off)

When the client supplies real pricing, this is the entire change — **no code edit, no redeploy** (§10):

```sql
UPDATE webcore.products SET sale_price = <real_price>, description = '<real BM description>'
WHERE website = 'majlisaqiqah.my' AND slug = 'pakej-aqiqah-asas';
-- repeat per slug: pakej-aqiqah-standard, pakej-aqiqah-premium, pakej-aqiqah-sedekah-asnaf
```

REST equivalent:

```bash
curl -s -X PATCH "$SUPA_URL/rest/v1/products?website=eq.majlisaqiqah.my&slug=eq.pakej-aqiqah-asas" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" -H "Content-Profile: webcore" \
  -H "Prefer: return=representation" \
  -d '{"sale_price": 820.00}' | jq
```

Renaming or retiring a package:

```sql
-- retire (preferred over DELETE — keeps history and any FK'd photos)
UPDATE webcore.products SET is_active = false
WHERE website = 'majlisaqiqah.my' AND slug = 'pakej-aqiqah-sedekah-asnaf';

-- add a 5th package (needs a photo row too, and a `/products/pakej-5.jpg` asset)
INSERT INTO webcore.products (website, parent_id, name, slug, description, sale_price, rental_price, sort_order, is_active)
VALUES ('majlisaqiqah.my', NULL, 'Pakej Aqiqah Korporat', 'pakej-aqiqah-korporat',
        'Aqiqah berjemaah untuk syarikat dan surau. Harga khas untuk tempahan pukal.',
        NULL, NULL, 5, true);
```

> **Grid warning when changing the count.** Four packages divide evenly into 2- and 4-column grids. Going
> to **5** strands one card in a half-empty last row, which violates the no-blank-slot rule. Prefer 4 or
> 6, or have the front-end pick a column count that divides the live count.

### 9.1 Keep `messages/*.json` in sync

Per the brief, the offline fallback copy in `messages/{ms,en,zh}.json` mirrors these four packages. The
**slugs are the join key and must stay stable**; if a slug changes here it must change there in the same
commit, or the fallback silently stops matching.

---

## 10. Why ISR means the client's price edits need no redeploy

Two independent mechanisms, both already wired:

**1. Time-based — `revalidate = 3600`.** Each page exports a 1-hour revalidate window. After a price
`UPDATE`, the next request past the hour serves a freshly-regenerated page carrying the new number.
Worst case: 60 minutes. No build, no deploy, no CI run — the running deployment simply re-renders.

**2. Tag-based — instant purge.** Every read goes through `webcoreFetch()`, which tags the cached
response `webcore-products` (`lib/webcore.ts:35-43`). Posting to `/api/revalidate` with
`{"tags":["webcore-products"]}` calls `revalidateTag()` and purges it in seconds — the 1-hour window
becomes the *ceiling*, not the wait (§8.10).

This is exactly why the packages are DB-resident rather than hardcoded in `config/products.ts`. The
client edits a price in the admin panel; the site reflects it within seconds-to-an-hour; no engineer is
involved. It is also why §4.5 matters — a front-end that reads the wrong bucket breaks this whole chain
at the last step.

> Two caveats worth stating plainly:
> - `webcoreFetch` uses `cache: 'force-cache'`. **Do not add an `AbortSignal`** — a `signal` opts the
>   response out of Next's Data Cache and silently kills tag revalidation (the file already warns about
>   this at lines 28-34; the 6s timeout is done with `Promise.race` for exactly this reason).
> - Local `/products/*.jpg` photo paths are **build artefacts, not DB content**. Swapping a photo file
>   still needs a redeploy. Move to Storage URLs (§5.3) if the client will change photos often.

---

## 11. RLS policies

Reads must work with the **anon** key (the site ships it publicly). Writes must not.

```sql
ALTER TABLE webcore.products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE webcore.product_photos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE webcore.phone_numbers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE webcore.company_websites ENABLE ROW LEVEL SECURITY;

-- Public read-only. No INSERT/UPDATE/DELETE policy exists for anon,
-- so with RLS on, every write from the anon key is denied by default.
CREATE POLICY "public_read_products"
  ON webcore.products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_product_photos"
  ON webcore.product_photos FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_phone_numbers"
  ON webcore.phone_numbers FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_company_websites"
  ON webcore.company_websites FOR SELECT TO anon, authenticated USING (true);
```

- **These are already in place — do not run the block above.** It is documentation of the required end
  state, not a task. Every verification read in §8.5–8.8 was performed with the **anon** key and returned
  the seeded rows, which is direct proof that public SELECT works. Only run these if a future `SELECT`
  with `ANON_KEY` returns `[]` while the service key returns rows.
- The `service_role` key bypasses RLS entirely — that is why §8.1–8.4 use it.
- **Never ship the service key to the browser.** `lib/webcore.ts` reads `SUPABASE_ANON_KEY` /
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` only — keep it that way.
- Multi-tenancy is enforced by the `website =` filter in the query, **not** by RLS. Every website's rows
  are readable by every other site's anon key. That is the existing system-wide design (all rows are
  public marketing data); do not put anything sensitive in these tables.

---

## 12. Open items

Seeding is **done**. These are what remain — items 1 and 2 are code bugs, not data.

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | ~~`config/site.ts` `fallbackPhone` was `60174287801`~~ — now `60102529688` (§3.1) | front-end | ✅ **fixed** (verified in `config/site.ts:12`) |
| 2 | 🔴 **`core` is empty** — pages must consume the merged product list, and the `volvo-ec200`/`volvo-ec400` slug lookups must become the four `pakej-aqiqah-*` slugs (§4.5). | Kimmy | **blocking — fix before Gate 1** |
| 3 | Package lineup — 4 placeholders (§4.1) | client | pending real list |
| 4 | Asas price — RM 750 / ekor | client | pending (band RM 600–900) |
| 5 | Standard price — RM 1,080 / ekor | client | pending (band RM 950–1,250) |
| 6 | Premium price — RM 1,580 / ekor | client | pending (band RM 1,350–1,900) |
| 7 | Sedekah Asnaf price — RM 650 / ekor | client | pending; confirm the package is even offered |
| 8 | 2-ekor bundle discount — RM 100 off (§6.2) | client | confirm, or set to 0 |
| 9 | 🟠 **Two package photos need replacing** — Asas has no raw-meat shot, and `pakej-2.jpg` appears to show **chicken** on an aqiqah site (§5.1). A distribution shot for Sedekah Asnaf would help too. | photo sourcing | audited; remap applied as a stopgap |
| 10 | `alt_text` seeded but not selected by webcore (§5) | Kimmy | nice-to-have |
| 11 | Paid domain | — | if/when bought → run §3.2 |

> Items 3–8 need **no redeploy** to apply — they are `UPDATE`s (§9) that propagate via ISR (§10). That is
> the whole point of seeding placeholders now rather than waiting for the client.

---

## Handoff

- **Kimmy / front-end:** §4.5 is mandatory — `core` will be empty, the pages must consume the merged
  list, and the `volvo-ec200` / `volvo-ec400` slug lookups in `app/[locale]/page.tsx:117-143` and
  `app/[locale]/pakej-aqiqah/[location]/page.tsx:130-143` must become the four `pakej-aqiqah-*` slugs.
  §7 is the column contract.
- **Kagura:** §6.3 has the worked numbers for the package-selector comp; §4.1 has the tier ladder.
- **Nana:** §4.2 descriptions are the DB-resident BM card copy (≤15 words); `en` / `zh` card copy lives
  in `messages/*.json` and must mirror the same four slugs (§9.1). Note the Asas card currently promises
  raw packed meat over a photo of a cooked dish (§5.1) — if a raw-meat photo can't be sourced, the copy
  is the other lever.
- **Kagura / photo sourcing:** §5.1 — two replacement photos wanted (raw packed meat; ideally an asnaf
  handover), and `pakej-2.jpg` looks like chicken on an aqiqah site.
- **Layla:** seeding is **already done** — do not re-run §2–§5 or you will duplicate rows. Re-run the
  read-only checks §8.5–8.9 before Gate 2. Confirm §12 items 1 and 2 are fixed before deploy. Set
  `WEBCORE_REVALIDATE_SECRET` on Vercel, redeploy once, confirm §8.10 returns 200. Run §3.2 if a paid
  domain is added.
- **Hanabi:** §7.5 lists the blog columns webcore reads — outside this document's scope.
