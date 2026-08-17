# Majlis Aqiqah — System Architecture

> **Author:** Alpha (System Architect) · **Date:** 2026-08-03
> **Status:** Source of truth for Cyclops, Sora, Nana, Kagura, Kimmy, Hanabi, Layla, Gloo.
> Every downstream agent builds against this document. If reality diverges from it, fix the code — not the doc — unless the orchestrator says otherwise.

**Project:** Majlis Aqiqah — affordable, complete, hassle-free aqiqah packages in Malaysia
**Domain:** `majlisaqiqah.my` · **Company:** Kak Kenduri Sdn. Bhd. (`ce95071b-e575-4983-bdd4-66910f45fe34`)
**Product:** Pakej Aqiqah (`pakej-aqiqah`) · **Leads mode:** `single` · **Phone:** `60174287801`
**Scaffolded from:** `projects/sewa-excavator` (canonical skeleton) — this is a **retrofit**, not a greenfield build.

---

## 0. Confirmed inputs (no further user confirmation needed)

| Field | Value |
|-------|-------|
| Locales | `ms` (default, **no prefix**), `en`, `zh` |
| `localePrefix` | `as-needed` |
| `localeDetection` | `false` |
| Location count | 163 today → **169 after the Labuan fix** (§5.3) |
| Product URL pattern | `/pakej-aqiqah/{location}` (locale-prefixed for `en`/`zh`) |
| Tone | Warm, respectful, reassuring. This is a religious observance, not a party. |

---

## 1. Folder & routing structure

The tree below is **what exists on disk today**. Files marked ⚠️ need work; files marked ➕ must be created; files marked ❌ must be deleted.

```
projects/majlis-aqiqah/
├── app/
│   ├── layout.tsx                          ⚠️ root layout — strip stale excavator strings
│   ├── globals.css                         ✅ already re-tokenised to the aqiqah palette
│   ├── icon.svg                            ⚠️ must be the crescent+cradle icon from the logo
│   ├── robots.ts                           ✅
│   ├── sitemap.ts                          ✅ home + 169 locations + blog listing + posts × 3 locales
│   ├── api/
│   │   └── revalidate/route.ts             ✅ tag purge endpoint (webcore webhook)
│   └── [locale]/
│       ├── layout.tsx                      ✅ fonts, tracking, i18n provider, Organization + WebSite schema
│       ├── page.tsx                        ⚠️ homepage — products hardcoded to 2 excavators (§3.1)
│       ├── pakej-aqiqah/[location]/page.tsx ⚠️ same product bug + excavator copy
│       ├── blog/page.tsx                   ✅ listing
│       ├── blog/[slug]/page.tsx            ✅ article
│       └── redirect-whatsapp-1/
│           ├── page.tsx                    ✅ server — resolves number via leads_mode
│           └── RedirectClient.tsx          ✅ client bounce
├── components/
│   ├── SiteHeader.tsx                      ⚠️ nav key `calculator` → `selector` (§7.2)
│   ├── SiteFooter.tsx                      ✅ incl. "Built by Utopia AI" credit
│   ├── FomoBanner.tsx                      ✅ countdown + red/black bg
│   ├── LanguageSwitcher.tsx                ✅ MS/EN/中
│   ├── WhatsAppButton.tsx                  ✅ #25D366, target=_blank, uwc tracking
│   ├── MarketingMarquee.tsx                ✅ optional, keep
│   ├── PageStyles.tsx                      ⚠️ `.calc-*` block → `.sel-*` (§7.3)
│   ├── Calculator.tsx                      ❌ DELETE — excavator rental calculator
│   ├── AqiqahSelector.tsx                  ➕ NEW project-unique section (§7)
│   ├── schema/                             ✅ FAQ, Organization, Breadcrumb, WebSite, LocalBusiness, Product, Article
│   └── tracking/                           ✅ ProductImpressionTracker, BlogLinkTracker
├── config/
│   ├── site.ts                             ⚠️ `url`, `tagline`, `whatsappMessages`, `colors` still excavator (§9.1)
│   └── locations.ts                        ⚠️ 163 real MY towns — only Labuan (4) breaks the ≥10/state rule
├── i18n/{routing,request}.ts               ✅ ms default, as-needed, detection off
├── lib/
│   ├── webcore.ts                          ✅ unified Supabase data layer (products/phones/blog)
│   ├── localeHref.ts                       🚨 **BUILD BLOCKER** — exports don't match imports (§9.0)
│   ├── waRedirect.ts                       ⚠️ drop `calcQuote`, add `aqiqahSummary` (§7.4)
│   └── useTrackImpression.ts               ✅
├── messages/{ms,en,zh}.json                ⚠️ 100% sewa-excavator copy — Nana replaces wholesale
├── public/{brand,products,gallery,bg}/     ⚠️ aqiqah assets present, pages point at old filenames (§9.2)
├── middleware.ts                           ✅ broad matcher, handles un-prefixed default locale
├── next.config.ts                          ✅ loads root env, Supabase remote images allowed
├── package.json                            ⚠️ `name` still "sewa-excavator"; dev port 3025
└── global.d.ts                             ✅ `window.uwc`
```

### Layout ownership (MANDATORY)
`app/[locale]/layout.tsx` **must not** render header or footer. Every page component owns its own
`<FomoBanner /> → <SiteHeader /> → …sections… → <SiteFooter /> → <PageStyles />`. This is already
correct in the scaffold; do not "tidy" it into the layout — that double-renders the chrome.

### Locale-aware URLs
`localePrefix: 'as-needed'` means `ms` is served at `/` with **no prefix**. Consequences:

- `/` = Malay homepage. `/ms` **301s to** `/`. `/en` and `/zh` keep their prefix.
- Every canonical / hreflang / sitemap URL is built through `lib/localeHref.ts` — never hardcode
  `${url}/${locale}`. (The helper is currently broken; see §9.0.)
- `middleware.ts` matcher stays the broad `['/((?!api|_next|_vercel|.*\\..*).*)']` so
  `/pakej-aqiqah/kuala-lumpur` (un-prefixed Malay) resolves.
- Internal `<Link>`s currently emit `/${locale}/…`, which produces a redirect hop for `ms`. Kimmy
  should route in-app links through a `localePath()` helper so Malay links are prefix-free.

---

## 2. Page inventory

| # | Route (ms / en / zh) | Rendering | Count |
|---|---------------------|-----------|-------|
| 1 | `/` · `/en` · `/zh` | ISR, static | 3 |
| 2 | `/pakej-aqiqah/{location}` · `/en/…` · `/zh/…` | ISR + `dynamicParams` | 169 × 3 = **507** |
| 3 | `/blog` · `/en/blog` · `/zh/blog` | ISR | 3 |
| 4 | `/blog/{slug}` × 3 locales | ISR + `dynamicParams` | 10+ posts × 3 = 30+ |
| 5 | `/redirect-whatsapp-1` × 3 locales | `force-dynamic` | 3 |
| 6 | `/sitemap.xml`, `/robots.txt` | build-time | 2 |
| 7 | `POST /api/revalidate` | route handler | 1 |

**Build strategy for (2):** `generateStaticParams` pre-renders only `topCitySlugs` (10 cities × 3
locales = 30 routes). The remaining ~477 render on first request and stay cached. This is
deliberate — pre-rendering all 507 blew past Vercel's per-route static-worker budget on
sewa-excavator. `dynamicParams = true` must stay. All 507 still appear in the sitemap.

### Section order (homepage and location pages are IDENTICAL — mandatory)

| # | Section | Notes |
|---|---------|-------|
| 1 | `<FomoBanner />` | sticky, red/black, live countdown |
| 2 | `<SiteHeader />` | nav + language switcher + WA CTA |
| 3 | **Hero** | image bg + gradient overlay; **the page's only H1 and only H2** |
| 4 | Marketing marquee (light) | optional |
| 5 | Trust strip | JAKIM / syariah / halal compliance chips (replaces the excavator "brand strip") |
| 6 | **USP bar** | 3 cells, one panel, visually-hidden H3 |
| 7 | **Packages** | dynamic from Supabase `products` |
| 8 | **Aqiqah Package Selector** | ⭐ project-unique section (§7) |
| 9 | Marketing marquee (dark) | optional |
| 10 | Process | image bg — how the majlis runs end-to-end |
| 11 | Why us | syariah compliance, livestock health, transparent pricing |
| 12 | Reviews | image bg, Google-style cards |
| 13 | Gallery | **12 images, columns must divide 12** (2 / 3 / 4 / 6) — no blank slots |
| 14 | FAQ | `<FAQSchema>` fed from the same array |
| 15 | Locations | top-city chips + per-state grid |
| 16 | Final CTA | image bg, different file from the hero bg |
| 17 | `<SiteFooter />` + `<PageStyles />` | |

Location pages **add** two things and **omit nothing**:
- a breadcrumb pill inside the hero (Home › Pakej Aqiqah › {City})
- a "Nearby locations" section between (15) and (16)

Location-only CSS lives in a small `loc-` scoped block (`.breadcrumb`, `.city-chip`,
`.nearby-card`); everything else inherits from `<PageStyles />`. Never duplicate the style block.

---

## 3. Data flow

### 3.1 Products (CRITICAL — currently violated)

```
Supabase `products` + `product_photos`
        │  webcoreFetch()  →  REST, Accept-Profile: webcore, cache:'force-cache', next.tags:['webcore-products']
        ▼
lib/webcore.ts  getProducts()
        │  filter website = 'majlisaqiqah.my' AND is_active = true, order by sort_order
        ▼
{ core: Product[], additional: Product[] }
        ▼
Homepage + location page  →  packages grid  →  AqiqahSelector package chips  →  <ProductSchema>
```

**The scaffold is non-compliant and must be rewritten.** `app/[locale]/page.tsx` builds a
hardcoded 2-element `productCards` array keyed to `volvo-ec200` / `volvo-ec400`, using the DB only
to look up those two slugs. That breaks CLAUDE.md rules 1–5: adding a package in Supabase would not
make it appear.

Required shape:

```ts
const { core } = await getProducts();          // already ordered by sort_order
const packages = core.length ? core : fallbackPackagesFromMessages();
// render: packages.map(p => <PackageCard … />)
```

- Grid is `repeat(auto-fill, minmax(280px, 1fr))` and must look right at 1, 4, and 20 packages.
- Images come **only** from `product_photos.url` (`p.photos[0]?.url`). `public/products/pakej-*.jpg`
  is a build-time fallback for when Supabase is unreachable — never the source of truth.
- Prices come from `rental_price` / `sale_price` / the `prices[]` JSON line array. Because the
  client's real pricing is not yet supplied, **every price must render with a "Dari RM …" prefix**
  and the selector must carry an "anggaran sahaja — sahkan melalui WhatsApp" disclaimer.
- A `config/products.ts` fallback file is optional and, if created, must be clearly marked as
  a Supabase-outage fallback.

### 3.2 Caching / revalidation

Two mechanisms, both required:

1. **Time-based ISR — `export const revalidate = 3600`** on `app/[locale]/page.tsx`,
   `app/[locale]/pakej-aqiqah/[location]/page.tsx`, `app/[locale]/blog/page.tsx`, and
   `app/[locale]/blog/[slug]/page.tsx`. This is the CLAUDE.md mandate and the safety floor:
   worst case a DB change is live within an hour even if the webhook never fires.
   **The scaffold currently exports no `revalidate` on any route — this must be added.**
2. **Tag-based instant purge** — every `webcoreFetch` tags its response
   (`webcore-products` / `webcore-phones` / `webcore-blog`). The webcore admin panel POSTs to
   `/api/revalidate` with `x-webcore-secret`, which calls `revalidateTag()` and purges within
   seconds. Requires `WEBCORE_REVALIDATE_SECRET` in Vercel env.

`/redirect-whatsapp-1` stays `force-dynamic` — a cached phone number would break rotation.

Do **not** pass an `AbortSignal` to `webcoreFetch`; it opts the response out of the Data Cache and
silently kills tag revalidation. The 6 s timeout is enforced with `Promise.race` for that reason.

### 3.3 Phone numbers / leads mode

```
CTA click → /{locale}/redirect-whatsapp-1?loc={slug}&message={prefill}   (target="_blank")
   → server reads Host header, strips :port and leading www.
   → company_websites.leads_mode WHERE domain = host              ('single' for this site)
   → phone_numbers WHERE website = host AND is_active = true
   → resolution order: page_slug → location_slug → 'all' → label='default'
   → single mode: return the label='default' row (else first row)
   → wa.me/{phone}?text={whatsapp_text}
   → RedirectClient bounces the browser
```

- `single` mode is confirmed for launch. The code already implements all four modes, so switching
  to `location`/`hybrid` later is a DB change only, no redeploy.
- Fallback when Supabase is down: `siteConfig.fallbackPhone` = `60174287801` — the **client's own**
  number, correct per the fallbackPhone rule.
- **Every** CTA on the site routes through this page. No `wa.me` link may appear anywhere except
  `lib/webcore.ts::waLink`. Every link to it carries `target="_blank" rel="noopener noreferrer"`.
- No phone number or domain may appear as visible text anywhere on the site.

### 3.4 Locations

`config/locations.ts` is a static, build-time array (`{ slug, name, state, stateSlug }`). It drives
`generateStaticParams`, the locations grid, the nearby-locations block, and the sitemap. A location
slug that isn't in the array → `notFound()`. Locations are **not** in the database and should not be.

### 3.5 Translations

`middleware` resolves the locale → `i18n/request.ts` imports `messages/{locale}.json` → server
components read via `getTranslations({ locale, namespace })`, client components via
`useTranslations()` under `NextIntlClientProvider`. All copy, including **every alt string**, lives
in the message files. No hardcoded English fallbacks in JSX.

### 3.6 Blog

`blog_posts` (+ `blog_translations` joined on `language = locale`) filtered by
`website = majlisaqiqah.my` and `status = 'published'`, ordered by `published_at desc`.
Listing, article, recent-posts sidebar, and sitemap all read through `lib/webcore.ts`. Hanabi
writes rows; no code change is needed to publish.

---

## 4. Database requirements (for Cyclops)

Do not create a new Supabase project. Everything below lives in the **shared** instance, `webcore`
schema, scoped by `website = 'majlisaqiqah.my'`.

| Table | What this site needs |
|-------|----------------------|
| `companies` | Row already exists — Kak Kenduri Sdn. Bhd. `ce95071b-e575-4983-bdd4-66910f45fe34` |
| `company_websites` | **1 row**: `company_id` = above, `domain` = `majlisaqiqah.my`, `leads_mode` = `single` |
| `phone_numbers` | **1 row**: `website` = domain, `location_slug` = `'all'`, `page_slug` = `'all'`/null, `phone_number` = `60174287801`, `label` = `'default'`, `type` = `'default'`, `is_active` = true, `percentage` = 100, `whatsapp_text` = Malay aqiqah enquiry |
| `products` | **4–6 rows** — the aqiqah packages. Placeholder pricing; client supplies real prices later. `website` = domain, `is_active` = true, sequential `sort_order`, MS `name` + `description`. Use `rental_price`/`sale_price` (or the `prices[]` line array) for per-head pricing. |
| `product_photos` | ≥1 row per product. Upload `public/products/pakej-*.jpg` to Supabase storage, or use Pexels/Unsplash URLs of Malaysian/Asian subjects. Frontend reads `photos[0].url`. |
| `blog_posts` / `blog_translations` | 10+ posts × 3 locales (Hanabi, Step 11) |

Column-name reality check (verified against the live schema via `lib/webcore.ts`): it is `website`,
not `website_slug`; the site-wide default is `location_slug = 'all'`, not `NULL`; `phone_numbers`
also carries `page_slug` for per-page pinning.

**🚨 Blocker:** the root `.env.local` points at Supabase project `mazdcaibvhyqglfctdul`, which does
not contain these tables (PGRST205). The shared project is `xzydvhzcngpxdbyniliy` (per
`supabase/.temp/project-ref` and the `next.config.ts` image allowlist). Working credentials for
that project are required before Steps 10, 11, and 13. Everything else can proceed in parallel —
the data layer degrades gracefully to `[]` / `fallbackPhone`.

---

## 5. SEO structure (for Sora)

### 5.1 Hierarchy
```
/                                   ← homepage, primary keyword "pakej aqiqah murah Malaysia"
├── /pakej-aqiqah/{location}        ← 169 pages × 3 locales, geo-modified head terms
├── /blog                           ← hub
└── /blog/{slug}                    ← 10+ supporting articles, backlinking up
```

### 5.2 What Sora must plan
- Primary + secondary keyword per page type, in **Malay first** (`aqiqah`, `pakej aqiqah`,
  `aqiqah murah`, `kambing aqiqah`, `aqiqah dan korban`, `khidmat aqiqah`, `aqiqah + {bandar}`).
- Meta title / description templates per page type per locale (Nana writes the strings).
- The heading contract: exactly **one H1** (hero title) and **one H2** (hero subtitle) per page;
  every section title is H3; H4 for keyword-bearing copy; H5/H6 for non-keyword copy and captions.
  Every H3 and every eyebrow must contain a primary keyword.
- Internal linking: homepage → top 10 cities + full state grid; each location page → 6 same-state
  neighbours; blog → relevant location + package anchors.
- hreflang: `ms` / `en` / `zh` + `x-default` = `ms`, all emitted through `lib/localeHref.ts`.
- Schema: `Organization` + `WebSite` (locale layout), `Product` per package, `FAQPage`,
  `LocalBusiness` + `BreadcrumbList` on location pages, `Article` on blog posts.
- Niche-specific E-E-A-T signals that belong in copy and schema: syariah-compliant slaughter,
  certified slaughterman, JAKIM-compliant process, livestock health/age, distribution to asnaf.

### 5.3 Location coverage
163 real Malaysian towns across 15 regions. **Labuan has only 4** — below the ≥10-per-state rule.
Fix by adding 6 more real Labuan localities (e.g. Batu Manikar, Patau-Patau, Sungai Lada, Bebuloh,
Durian Tunjung, Kiamsam) → **169 total**, inside the 150–180 band. The rest of the list is
niche-agnostic (real towns) and should be **kept as-is**, not regenerated — despite what
`inputs.md` implies, there is nothing excavator-specific about it.

---

## 6. i18n requirements (for Kimmy)

| Locale | Prefix | Role |
|--------|--------|------|
| `ms` | none (`/`) | **default** — every fresh visitor lands here regardless of Accept-Language |
| `en` | `/en` | English |
| `zh` | `/zh` | 中文 |

- `localePrefix: 'as-needed'`, `localeDetection: false` — already correct, do not change.
- Message namespaces to carry over (rename `calculator` → `selector`):
  `meta, nav, fomo, hero, marquee, trustStrip, usp, products, selector, process, whyUs, reviews,
  gallery, faq, locations, finalCta, footer, blog, location`.
- `nav.*` must define `home, packages, selector, locations, blog, whatsappCta, logoAlt` in all three
  locales — a missing key renders the raw key on the live site.
- CTA button labels ≤ 3 words in `ms` + `en` ("WhatsApp" counts); keep `zh` equally compact.
- Title Case with lowercase conjunctions for H1–H4; never `text-transform: capitalize`.
- ICU placeholders stay lowercase (`{location}`, `{state}`, `{price}`, `{count}`) and must be
  substituted via `t('key', { … })` — never `.replace('{price}', …)`.
- Language switcher: 3 inline pills on desktop, single dropdown on mobile; each `CircleFlag`
  generates its `clipPath` id with `useId()`.

---

## 7. ⭐ Project-unique section: the Aqiqah Package Selector

**Decision:** delete `components/Calculator.tsx` and build `components/AqiqahSelector.tsx`.

**Why a selector and not the 4-step process alternative:** the scaffold already ships a Process
section (#10), so a "4-step majlis" block would duplicate it. The calculator's real job is
conversion — an interactive widget that ends in a pre-filled WhatsApp message — and that mechanic
transfers perfectly. The gender → livestock-count rule (2 for a boy, 1 for a girl) is also the
single most-searched fact in this niche, so encoding it as the widget's first step is both useful
and an organic keyword surface.

### 7.1 Interaction spec

Client component. Three inputs in one panel, mirroring the calculator's 3-cell responsive grid
(3 columns ≥760 px, stacked below), then a result readout, then the WhatsApp CTA.

**Step 1 — Untuk siapa? (segmented chips, single select)**

| Chip | Livestock | Derived |
|------|-----------|---------|
| Bayi Lelaki (baby boy) | 2 ekor | `count = 2` |
| Bayi Perempuan (baby girl) | 1 ekor | `count = 1` |
| Aqiqah Dewasa (adult / self) | 1 ekor | `count = 1` |

Selecting a chip immediately updates a live line: **"2 ekor kambing — mengikut sunnah"**. Never
present the count as a price upsell; it is a religious rule being explained, not a tier.

**Step 2 — Pilih pakej (segmented chips, single select)**
Chips are generated **from the `core` products returned by `getProducts()`** — the same array that
feeds the packages grid. No hardcoded package list. If Supabase returns nothing, fall back to the
package names in `messages.selector.fallbackPackages`. Adding a package in Supabase adds a chip.

**Step 3 — Cara majlis (segmented chips, single select)**

| Chip | Meaning |
|------|---------|
| Masak & Hantar | cooked, packed, delivered to the customer |
| Agih kepada Asnaf | slaughtered and distributed to asnaf/orphanages on the customer's behalf |
| Sembelih Sahaja | slaughter only, raw meat handed over |

**Result readout** (`aria-live="polite"`):
- line 1: livestock count + animal
- line 2: chosen package name
- line 3: `Anggaran: Dari RM {unit × count}` when the chosen product has a price; if the product has
  no price yet, render `Harga atas permintaan` instead of a fabricated number.
- disclaimer beneath, always visible: *"Harga anggaran sahaja. Sahkan pakej sebenar melalui
  WhatsApp."* — non-negotiable while pricing is placeholder data.

**CTA** — `<WhatsAppButton>` in official green, ≤3-word label, routing through
`waRedirect(locale, aqiqahSummary(...), locationSlug?)`. On a location page the current city slug is
passed so lead routing works if leads mode later becomes `location`/`hybrid`.
Tracking label: `selector` (homepage) / `selector-{citySlug}` (location page).

### 7.2 Anchor + nav
Section `id="pemilih"`. `SiteHeader` desktop **and** mobile nav swap `#calculator` → `#pemilih` and
the `nav.calculator` key → `nav.selector`. The hero secondary CTA (`href="#calculator"`) updates too.

### 7.3 Styling
Reuse the calculator's visual treatment — dark emerald panel (`--gradient-emerald`), gold radial
glow (`--brand-gold-glow`) instead of the orange one, `--radius-card`, `--shadow-xl`, gold active
chips. Rename the `.calc-*` block in `PageStyles.tsx` / the component to `.sel-*` in one pass so no
orphan selectors remain. Do not introduce a new button shape — `--radius-btn: 12px` site-wide.

### 7.4 Supporting lib change
`lib/waRedirect.ts`: delete `calcQuote` (excavator day/week/month maths, now dead) and add a pure
`aqiqahSummary({ recipient, count, packageName, style, estimate })` that returns the localized
prefill string. Keeping it pure and out of the component makes it trivially testable.

---

## 8. Tracking

Utopia Webcore `t.js` is already in `app/[locale]/layout.tsx` with
`data-website="majlisaqiqah.my"` — it must exactly match the deployed domain.
`global.d.ts` declares `window.uwc`.

| Event | Label | Fired by |
|-------|-------|----------|
| `click` | `whatsapp-{phone}` | `WhatsAppButton` (every CTA) |
| `impression` | `product-{slug}` | `ProductImpressionTracker` (IntersectionObserver, once per card) |
| `click` | `blog-{slug}` | `BlogLinkTracker` on the listing |

Per-CTA position labels already in use: `nav`, `nav-mobile`, `hero`, `product-{slug}`, `final-cta`,
`final-cta-{city}`. Add `selector` / `selector-{city}` for the new section.

Google/GA4/GTM/GSC/Ads (Gloo, Step 15) runs **only after a paid domain is live** — never against
`*.vercel.app`.

---

## 9. Technical decisions & known defects

### Stack
Next.js 15 App Router · React 19 · Tailwind CSS 4 (+ hand-written CSS custom properties in
`globals.css`, which is where the real design system lives) · next-intl 4 · Supabase (shared,
REST via tagged `fetch`, no `@supabase/supabase-js` client on the read path) · Vercel · dev port 3025.

Fonts: **Playfair Display** for H1–H3 (display serif), **Inter** for body and H4–H6, **JetBrains
Mono** for eyebrows/labels. Note the deliberate quirk: H4–H6 are used as *body copy* here because
heading level is keyword-driven, not size-driven — `globals.css` already handles this.

### 9.0 🚨 BUILD BLOCKER — `lib/localeHref.ts`
Nine files import `{ localeHref }` from `@/lib/localeHref`, but that module exports only
`localePath`, `localeAbs`, and `seoAlternates`. **The project does not compile.** Fix before any
other work: either add `export const localeHref = (l: string) => localeAbs(l)` (matching how
callers use it — they concatenate a path and feed absolute URLs to the sitemap), or migrate all
nine call sites to `localeAbs` / `seoAlternates`. Owner: Kimmy.

### 9.1 `config/site.ts` — stale values
- `url: 'https://sewaexcavator.my'` → must be `https://majlisaqiqah.my` (this feeds
  `metadataBase`, so every canonical and OG URL on the site is currently wrong).
- `tagline: 'Sewa Excavator No.1 Malaysia'` → the client's line, "Kami Melengkapkan Majlis Aqiqah Anda".
- `whatsappMessages` (all 3 locales) → aqiqah enquiry text.
- `legalName` → "Kak Kenduri Sdn. Bhd.".
- `colors` → still the orange excavator set; align with the emerald/gold tokens already in
  `globals.css`, or delete the block if nothing reads it.
- `package.json` `name` → `majlis-aqiqah`.

### 9.2 Asset path drift (both pages)
`public/` already holds the aqiqah assets, but the pages point at the old filenames:

| Referenced in code | Exists on disk |
|--------------------|----------------|
| `/brand/abang-excavator-dark.png` | `/brand/majlis-aqiqah-dark.png` |
| `/brand/hero-photo.png` | `/brand/hero-photo.jpg` |
| `/bg/bg-5.avif` (final CTA) | `/bg/final-cta.jpg` (also `/bg/hero.jpg`, `/bg/process.jpg`, `/bg/reviews.jpg`) |
| `/gallery/3.jpg … /gallery/14.jpg` | only `/gallery/1.jpg … 12.jpg` |

The gallery array is the worst of these: it requests `13.jpg` and `14.jpg`, which don't exist —
**two broken tiles**, which also violates the no-blank-slot rule. Switch the array to `1–12` and
use a column count that divides 12 (2 / 3 / 4 / 6) at every breakpoint. `messages.gallery.alts`
already has exactly 12 entries, confirming 1–12 is the intended set.

### 9.3 Other carry-over cleanups
- `app/layout.tsx` and `components/tracking/*` contain stale excavator strings/comments.
- Homepage hero stats are hardcoded `2 models / 14 states / 24h` — re-derive for this niche.
- `getNearbyLocations` returns same-state peers via `slice(0, 6)`, so Labuan currently yields 3.
  Fixing Labuan to 10 also fixes this.

### 9.4 Deliberate non-obvious decisions (do not "fix" these)
1. **Partial `generateStaticParams`** — 30 pre-rendered routes, the rest on demand. Prevents the
   Vercel static-worker timeout that 507 routes causes.
2. **No `AbortSignal` in `webcoreFetch`** — a signal disables the Data Cache and breaks
   `revalidateTag`. The 6 s budget is enforced by `Promise.race`.
3. **`Accept-Profile: webcore`** — the shared tables live in the `webcore` Postgres schema, not `public`.
4. **Header hides the brand logo** — nav + language switcher + WA CTA only; the logo lives in the hero.
5. **`h4`–`h6` as body copy** — keyword-driven heading levels, per the system-wide rule.
6. **Utopia CI is elements-only** — footer credit + `--r-*` / `--ease` / `--dur-*` tokens. The site
   keeps its emerald/gold palette, Playfair/Inter fonts, and 12 px button radius. Do not force
   `--r-button: 8px` onto existing CTAs.

---

## 10. Downstream handoff

| Agent | Depends on | Must produce |
|-------|-----------|--------------|
| **Cyclops** | §4 | `database.md` + seeded `products` / `product_photos` / `phone_numbers` / `company_websites` (blocked on §4 credentials) |
| **Sora** | §5 | `seo-plan.md` — keyword map, meta templates, heading contract, internal-link graph |
| **Nana** | §5, §7 | `copy-homepage.md`, `copy-locations.md` — all 3 locales incl. the `selector` namespace and every alt string |
| **Kagura** | §1, §7 | `design-direction.md` — emerald/gold direction, distinct from existing Utopia sites |
| **Kimmy** | §1, §3, §6, §9 | Fix §9.0 first, then §9.1–9.3, `revalidate = 3600`, nav/anchor rename, i18n + schema |
| **Builder** | §7 | `AqiqahSelector.tsx`, dynamic packages grid, `aqiqahSummary()` |
| **Hanabi** | §3.6 | 10+ posts × 3 locales |
| **Layla** | all | gate → push → deploy |
| **Gloo** | post-deploy | GA4 / GTM / GSC / Ads — **paid domain only** |

---

## Amendment (orchestrator, build time) — special section naming

Alpha's §7.2 proposed deleting `components/Calculator.tsx` and shipping
`components/AqiqahSelector.tsx` under a new `selector` message namespace, with the nav key
`nav.calculator` renamed to `nav.selector` and the anchor changed to `#pemilih`.

**The *behaviour* was adopted; the *renaming* was not.** The guardrail gate has a blocking check
`nav-keys-complete` (`utopia-wizard/lib/checklist.ts`) that requires
`nav.{home,products,calculator,locations,blog,whatsappCta}` to exist in `messages/ms.json`.
Renaming the key to `selector` fails that check and blocks the deploy.

**As built:**
- File stays `components/Calculator.tsx`; message namespace stays `calculator`; anchor stays
  `#calculator`; nav key stays `nav.calculator`.
- The *content* is Alpha's design: a three-input aqiqah package selector — baby gender
  (lelaki → 2 ekor / perempuan → 1 ekor) × package tier (asas / standard / premium) × number of
  children — resolving to a live head-count pill and an estimated total, with a WhatsApp CTA
  carrying the selection.
- The visible label is free text in `messages/*.json` (e.g. "Kalkulator Aqiqah"), so the user-facing
  wording is aqiqah-native even though the key is generic.

Tier prices are read from the Supabase `products` rows (`pakej-aqiqah-asas` / `-standard` /
`-premium`), so the client's real prices flow into the calculator with no code change.

---

## Amendment (orchestrator, build time) — ISR: tag-based, NOT time-based

Alpha's §— spec'd `export const revalidate = 3600` on the homepage, location, blog listing and
blog post routes, citing `CLAUDE.md` → "Dynamic Product Data (CRITICAL)" rule 2.

**This was implemented, then reverted.** The guardrail gate has a **blocking** check
`no-time-revalidate` (`utopia-wizard/lib/checklist.ts`) that fails the build on any
`export const revalidate = N` where N ≥ 1:

> "Pages invalidate by tag, not by time — DB edits show up instantly."

Adding it dropped the gate from 91/100 to 89/100 with a blocking failure.

**The gate is correct and `CLAUDE.md` is stale on this point.** The requirement CLAUDE.md is really
expressing — "adding a product in the database makes it appear on the site automatically, without a
redeploy" — is satisfied *better* by the webcore cache tags: `revalidateTag('webcore-products' |
'webcore-phones' | 'webcore-blog')` via `POST /api/revalidate` purges within seconds, versus up to
an hour of staleness with time-based ISR. The location route additionally documents that time-based
regeneration across 507 routes (169 cities × 3 locales) risks 60s/route timeouts on Vercel's static
worker.

**As built:** no route exports a non-zero `revalidate`. `lib/webcore.ts` fetches with
`cache: 'force-cache'` + `next: { tags: [...] }`, and `app/api/revalidate/route.ts` purges by tag.
`app/[locale]/redirect-whatsapp-1/page.tsx` keeps `revalidate = 0` (it must never be cached).

**Deploy dependency:** `/api/revalidate` requires `WEBCORE_REVALIDATE_SECRET`. It is NOT in the
repo-root `.env.local` — it must be set as a Vercel env var, or the admin panel's purge ping gets
a 500 and DB edits will not propagate until the next deploy.
