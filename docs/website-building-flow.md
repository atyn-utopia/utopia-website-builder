# Website-Building Flow (Quick Reference)

> Condensed operational flow for building a new SEO website in this system.
> Authoritative source: [full-website-setup.md](full-website-setup.md) + [../CLAUDE.md](../CLAUDE.md).
> Follow the full setup doc step-by-step for any real build — this is the map, not the territory.

## At a glance

```
Step 0  Gather inputs ───────────────────────────────────────┐
Step 1  Create project folder + inputs.md                    │
Step 2  Agent pipeline:  Alpha → (Cyclops ∥ Sora) → Nana      │  BUILD
              → (Kagura ∥ Kimmy)                              │
Step 3  Scaffold Next.js                                      │
Step 4  Connect shared Supabase                              │
Step 5  Build core files (i18n, middleware, lib, WA redirect)│
Step 6  Build pages (home, location, blog)                   │
Step 7  Add analytics tracking                               │
Step 8  Dev server + screenshot review + Layout Checklist ───┘
─────────────────────────────────────────────────────────────
Step 9  ⛔ GATE 1 — user confirms DESIGN  (blocking)
─────────────────────────────────────────────────────────────
Step 10 Insert products into Supabase                        ┐
Step 11 Hanabi generates blog posts → Supabase               │  CONTENT
─────────────────────────────────────────────────────────────┘
Step 12 ⛔ GATE 2 — user confirms CONTENT  (blocking)
─────────────────────────────────────────────────────────────
Step 13 Seed phone number + register website                 ┐
Step 14 Layla: QA → push GitHub → deploy Vercel + env vars   │  SHIP
        Final checklist                                      ┘
```

Two **blocking gates** — never pass either without explicit user confirmation.

---

## Phase 1 — BUILD

**Step 0 · Gather inputs** *(do not start until all confirmed)*
Company (1 of 16 Utopia entities) · product name + slug · domain · brand name · target country · location list · languages (ms/en/zh) · WhatsApp number · leads mode (single/rotation/location/hybrid) · special requirements · brand assets · competitor URLs.

**Step 1 · Create folder** — `mkdir -p projects/{slug}`, save everything to `projects/{slug}/inputs.md`. *(This `inputs.md` is also how the Utopia Wizard discovers the project for QA scans.)*

**Step 2 · Agent pipeline** — each is a real subagent spawned with the contents of `agents/{name}.md` + inputs:

```
Alpha (architecture, confirms languages)        → architecture.md
   ↓
Cyclops (DB schema) ∥ Sora (SEO keyword/page plan)  → database.md / seo-plan.md
   ↓
Nana (homepage + all location copy)             → copy-homepage.md, copy-locations.md
   ↓
Kagura (unique design direction) ∥ Kimmy (technical SEO, i18n, WA redirect)
                                                → design-direction.md, technical-seo-i18n.md
```

**Step 3 · Scaffold** — `create-next-app` (TS, Tailwind, App Router) + `@supabase/supabase-js`, `next-intl`. Unique dev port per project (3001, 3002…).

**Step 4 · Connect Supabase (shared)** — `ln -sf ../../.env.local .env.local`, add `loadEnvConfig(cwd + '/../..')` to `next.config.ts`, create `lib/supabase.ts`. **Never** make a per-site DB — sites are distinguished by the `website` column.

**Step 5 · Core files** — `config/site.ts`, `i18n/routing.ts` + `request.ts`, `middleware.ts`, `[locale]/layout.tsx`, `lib/getPhoneNumber.ts`, `lib/waRedirect.ts`, `lib/getBlogPosts.ts`, the `/redirect-whatsapp-1` pages, `config/locations.ts` (150–180 real locations, ≥10/state), `messages/{en,ms,zh}.json`.

**Step 6 · Pages** — homepage + dynamic `/{product}/{location}` pages (unique copy each) + blog listing + blog post. Products are **fetched dynamically** from `products`/`product_photos` (ISR `revalidate = 3600`) — never hardcoded. Use the canonical `<SiteHeader/>` + `<SiteFooter/>` + `<FomoBanner/>` from `sewa-excavator`.

**Step 7 · Tracking** — analytics script in `<head>` with `data-website` = domain; `global.d.ts` for `window.uwc`; track WhatsApp clicks, product impressions, blog clicks.

**Step 8 · Dev server + review** — run locally, Puppeteer screenshots, ≥2 comparison rounds, then walk the **mandatory Layout & Design Checklist** (~50 blocking rules). See [Layout build process](#layout-build-process) below.

## 🚪 Step 9 · GATE 1 — user confirms **design** *(blocking)*

## Phase 2 — CONTENT

**Step 10 · Products → Supabase** — Cyclops inserts product rows (`website` = domain, `is_active`, `sort_order`) + `product_photos`. Verify they appear on the live grid.

**Step 11 · Blog → Supabase** — Hanabi generates 10+ SEO posts (H1→H2→H3→p hierarchy, alt text, internal backlinks, meta + excerpt), inserts into `blog_posts` + `blog_translations`. Blog layout must match the `electric-wheelchair-malaysia` canonical reference.

## 🚪 Step 12 · GATE 2 — user confirms **content** *(blocking)*

## Phase 3 — SHIP

**Step 13 · Seed phone + register site** — one `phone_numbers` row (`location_slug='all'`, label `default`); ensure a `company_websites` row exists with the chosen `leads_mode`.

**Step 14 · Layla deploys** — verify phone system + products + blog + tracking → push GitHub → deploy Vercel → `vercel env add` the Supabase vars → report live URL. Then run the **Final Checklist** (Structure / SEO / i18n / Database / Tracking / Design / Deployment).

---

## Layout build process

The layout is built in **Step 6** (pages) and hardened in **Step 8** (review). Order of operations:

1. **Design direction first.** Kagura's `design-direction.md` (Step 2) reviews existing sites to avoid duplicate layouts and fixes the visual direction: colour tokens, fonts, hero treatment, special section. Nothing visual is invented at page-build time that contradicts it.

2. **Token foundation in `globals.css`.** Define this project's own `--brand-*`, `--ink-*`, `--gut`, `--radius-*` CSS variables + default line-heights (headings `1.2`, body `1.4`). Every page references these tokens — **never** copy a page from another project without remapping its variables (undefined `var(--x)` silently collapses colours/spacing).

3. **Shared chrome.** Copy `<SiteHeader/>`, `<SiteFooter/>`, `<FomoBanner/>` from `sewa-excavator` — swap only brand name, logo path, nav labels. Per-page nav variants (e.g. `BlogNav`) are forbidden; every public page renders the same chrome.

4. **Shared section styles via `<PageStyles/>`.** All section CSS lives in one shared component so homepage and location pages stay identical. Location pages import it — never inline-duplicate the style block.

5. **Build the homepage section stack:**
   `FomoBanner → SiteHeader → Hero → USP bar → Products → (special section) → Process → Why-us → Reviews → Gallery → FAQ → Final CTA → SiteFooter`.

6. **Mirror it on location pages.** Location pages render the **same sections** with the same class names (no `loc-` prefix except for breadcrumb / city-chip / nearby-card). Only the copy changes per city. Dropping the USP bar / gallery / reviews on a location page is a bug.

7. **Blog pages** match the `electric-wheelchair-malaysia` canonical layout (gradient header banner + auto-fill card grid for listing; article column ≤740px + sticky recent-posts sidebar + ToC + bottom WA CTA for the post). `.blog-content` CSS mirrors site type.

8. **Review + lint loop (Step 8).** `npm run dev` → `node screenshot.mjs` → compare → fix → re-screenshot, ≥2 rounds, desktop **and** mobile, all 3 locales.

### Layout rules that block Gate 1 (the high-frequency ones)

| Area | Rule |
|------|------|
| **Headings** | Exactly **one H1** (hero title) + **one H2** (hero subtitle) per page; all section titles H3–H6. Heading level is **keyword-driven**, not structural. Every visible text element sits inside an h1–h6 tag. Every H3 / eyebrow / H4-intro contains a primary keyword. |
| **Hero** | Brand-image background + multi-layer gradient overlay. Stack: logo → eyebrow → H1 → H2 → support → CTA row → stats. Two-column on desktop, single centred column on mobile. Product/operator photo is a transparent PNG cutout via plain `<img>`. |
| **USP bar** | 3-cell contained panel (no visible heading; SEO-only hidden H3) directly below hero. Mandatory. |
| **Buttons** | All buttons share one rounded shape — only colour varies. Never mix rounded + square. |
| **WhatsApp** | Every CTA routes through `/{locale}/redirect-whatsapp-1` (never bare `wa.me`). Official green `#25D366` / hover `#1EBE57`, white icon, `target="_blank"` + `rel="noopener noreferrer"`. |
| **FOMO banner** | Top of page, live ticking countdown, **red or black** bg (never brand colour), light text, sticky. |
| **Language switcher** | Desktop = 3 bordered pills (circular SVG flag + label); mobile = single dropdown. CSS in `globals.css` with `!important`; each `CircleFlag` clipPath id via `useId()`. |
| **Backgrounds** | Mix image-bg sections (hero, process, reviews, final CTA) with flat ones; dark gradient overlay for text readability; Final CTA bg ≠ Hero bg. |
| **Mobile** (≤879px) | Center headings / buttons / cards / icons. Buttons 12.5px / 44px / nowrap. Per-state location list → 2-col. Header WA button hidden. |
| **Images** | Real brand assets (no stock when assets exist). Descriptive localised alt on every image. **Never re-encode PNG→JPEG.** Files >5MB use plain `<img loading="lazy">`, not `next/image`. |
| **Gallery grid** | No blank slots — column count must evenly divide image count at every breakpoint. |
| **No visible contact** | No phone number or domain shown as text anywhere — WhatsApp redirect buttons only. |
| **CSS pitfalls** | `:global(...)` only inside `<style jsx>`. Confirm every `var(--x)` is defined in *this* project. Extract shared CSS into `<PageStyles/>`. |

### How the Utopia Wizard checks the layout

After building, the wizard (`utopia-wizard`, `npm run scan`) re-verifies many of these rules automatically per project and scores 0–100. Relevant checks include: `site-chrome-components`, `homepage-uses-site-header`, `location-page-chrome`, `location-matches-homepage`, `blog-listing-chrome`, `blog-post-chrome`, `no-blognav-usage`, `no-undefined-css-vars`. A failing layout scan blocks Gate 1.
