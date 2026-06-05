# Website-Building Flow (Quick Reference)

> Latest operational flow for building a new SEO website in this system.
> Authoritative source: [full-website-setup.md](full-website-setup.md) + [../CLAUDE.md](../CLAUDE.md).
> Reflects the guardrail system: scaffold-first, the blocking gate, canonical
> chrome, the `vercel-domain-match` check, and the Webcore API for data + integrations.

## At a glance

```
┌─ PREVENT ──────────────────────────────────────────────────────────┐
│ 0  Gather inputs (incl. the REAL Vercel domain)                     │
│ 1  npm run scaffold   → new site starts at ~96/100, canonical chrome│  BUILD
│ 2  Agents fill CONTENT (copy, design, assets, locations)           │
│ 3  Each agent self-verifies: npm run gate -- --source-only {slug}  │
└────────────────────────────────────────────────────────────────────┘
        🚪 GATE 1 — human approves DESIGN (taste only)
┌─ DATA (via Webcore API) ───────────────────────────────────────────┐
│ 4  Products      → products:write                                   │  CONTENT
│ 5  Phones/leads  → phones:write                                     │
│ 6  Blog posts    → blog:write                                       │
│ 7  SEO overrides + alt-text → seo:write                             │
└────────────────────────────────────────────────────────────────────┘
        🚪 GATE 2 — human approves CONTENT
┌─ SHIP ─────────────────────────────────────────────────────────────┐
│ 8  Full gate: npm run gate -- --ratchet {slug}  (incl. domain-match)│  SHIP
│ 9  Push → CI guardrails-gate must pass → deploy Vercel              │
│ 10 Verify domain (vercel-domain-match) + set revalidate_url         │
│ 11 [human] Connect Google in admin UI → submit sitemap + key events│
└────────────────────────────────────────────────────────────────────┘
```

Two **blocking human gates**; everything mechanical is enforced by the gate.

---

## Phase 1 — BUILD (prevent-by-construction)

**Step 0 · Inputs** — company, product name+slug, **the real Vercel domain** (the one Vercel actually serves — verify, don't assume), brand, locations, languages (ms/en/zh), WhatsApp number, leads mode, assets.

**Step 1 · Scaffold** (replaces the old empty-folder + `create-next-app`):
```bash
cd utopia-wizard && npm run scaffold -- \
  --slug={slug} --brand="{Brand}" --product="{Product}" \
  --product-slug={product-slug} --domain={slug}.utopiaai.my --phone=60XXXXXXXXX
```
Clones the canonical skeleton; chrome comes from **`templates/site-chrome/`** (single source of truth). New site starts at **~96/100, zero blocking failures**. Then `ln -sf ../../.env.local .env.local && npm install`. Update the generated `inputs.md` with the full Step 0 inputs.

**Step 2 · Agents fill content** — the pipeline now only does what the scaffold can't:
```
Alpha (architecture) → Cyclops ∥ Sora → Nana (copy) → Kagura (design) ∥ Kimmy (tech)
```
Brand colour tokens in `globals.css`, real `config/locations.ts` (150–180 towns, ≥10/state), brand assets, `messages/{ms,en,zh}.json`, the project-unique special section.

**Step 3 · Self-verify (mandatory contract)** — every builder agent runs and pastes the result before returning:
```bash
npm run gate -- --source-only {slug}    # ~2s · must be 0 blocking failures
```
Self-attestation ("I followed the rules") is replaced by the deterministic gate ([../prompts/agent-self-check.md](../prompts/agent-self-check.md)). See [Layout build process](#layout-build-process) for how the pages are assembled.

### 🚪 Step 3.5 · GATE 1 — human approves **design** *(taste only — the gate already owns the 101 mechanical rules)*

---

## Phase 2 — DATA (via the Webcore API)

Using `WEBCORE_API_KEY` as the `X-API-Key` header; `website` = the `.utopiaai.my` domain.

| Step | Scope | Endpoint |
|---|---|---|
| **4 · Products** | `products:write` | `POST /api/public/products` |
| **5 · Phones / leads** | `phones:write` | `POST /api/public/phone-numbers` (set `leads_mode` per project) |
| **6 · Blog posts** (10+) | `blog:write` | `POST /api/public/blog` |
| **7 · SEO overrides + alt-text** | `seo:write` | `POST /api/seo/overrides` |

Products are still rendered **dynamically** from Supabase with ISR `revalidate = 3600`; the API just writes the rows. (Raw SQL remains a fallback, but the scoped API is the new path — no service-role key needed.)

### 🚪 Step 7.5 · GATE 2 — human approves **content**

---

## Phase 3 — SHIP (enforced at every boundary)

**Step 8 · Full gate** — 101 checks incl. **`vercel-domain-match`**:
```bash
npm run gate -- --ratchet {slug}        # needs VERCEL_TOKEN
```
`vercel-domain-match` asks the Vercel API whether `config/site.ts` domain is actually served and fails if not (catches the "config says one domain, Vercel serves another" class). `--ratchet` blocks any score regression vs the last snapshot.

**Step 9 · Push & deploy** —
- `.githooks/pre-commit` gates the commit (source-only).
- CI **`guardrails-gate`** re-runs the full gate + ratchet on changed projects and must pass before merge.
- Deploy to Vercel; **Layla refuses to deploy** on any blocking failure (`npm run gate -- --ratchet {slug}`).

**Step 10 · Domain + revalidation** — confirm `vercel-domain-match` passes (config/site.ts + deploy-url.txt + data-website + DB rows all = the real served domain), then set the revalidate URL:
```
PUT /api/website-settings   { website, revalidate_url: "https://{domain}/api/revalidate" }   (integrations:write)
```

**Step 11 · Google integration** — *connect is human, the rest is API:*
- **[human, admin UI]** connect the site to **GSC / GA4 / GTM** (Google OAuth consent). The API key **cannot** do this — it's a one-time consent per site.
- **[API, after connect]** (`integrations:write`):
  - `POST /api/integrations/gsc/submit-sitemap`  → submits `/sitemap.xml`
  - `POST /api/integrations/marketing/mark-key-event`  → marks `whatsapp_click` (after it has fired once)

---

## The guardrail spine running underneath all of it

```
PREVENT              DETECT                 ENFORCE                  OBSERVE
scaffold +           npm run gate           pre-commit hook          npm run scan
canonical chrome     chrome:check (drift)   CI ratchet gate          docs/guardrails.html
(templates/site-     vercel-domain-match    deploy gate (Layla)      (101 checks scored 0–100)
 chrome)
```

- **101 rules** (55 blocking / 46 advisory) live in `utopia-wizard/lib/checkMeta.ts`, render to [guardrails.html](guardrails.html), and are drift-guarded against the live checklist (`npm run check-meta:sync`).
- Humans judge **taste** at the two gates; the machine owns the **mechanical 101**.
- Chrome has one canonical source (`templates/site-chrome/`); `npm run chrome:check` reports drift. Migrating a legacy site is a 3-layer refactor (CSS tokens + export API + old-nav) — don't bulk-migrate working sites.

---

## Layout build process

The layout is assembled in **Step 2** (pages) and hardened in **Step 3** (review). Order of operations:

1. **Design direction first.** Kagura's `design-direction.md` reviews existing sites to avoid duplicate layouts and fixes the visual direction: colour tokens, fonts, hero treatment, special section. Nothing visual is invented at page-build time that contradicts it.

2. **Token foundation in `globals.css`.** Define this project's own `--brand-*`, `--ink-*`, `--gut`, `--radius-*` CSS variables + default line-heights (headings `1.2`, body `1.4`). Every page references these tokens — **never** copy a page from another project without remapping its variables (undefined `var(--x)` silently collapses colours/spacing; the `no-undefined-css-vars` check catches it).

3. **Shared chrome from `templates/site-chrome/`.** The scaffolder already places the canonical `<SiteHeader/>`, `<SiteFooter/>`, `<FomoBanner/>`, `<PageStyles/>`, `<LanguageSwitcher/>`, `<WhatsAppButton/>`. Swap only brand assets (logo, `/brand/bg-hero.jpg`) — brand name/labels come from i18n/config. Per-page nav variants (e.g. `BlogNav`) are forbidden; every public page renders the same chrome.

4. **Shared section styles via `<PageStyles/>`.** All section CSS lives in one shared component so homepage and location pages stay identical. Location pages import it — never inline-duplicate the style block.

5. **Build the homepage section stack:**
   `FomoBanner → SiteHeader → Hero → USP bar → Products → (special section) → Process → Why-us → Reviews → Gallery → FAQ → Final CTA → SiteFooter`.

6. **Mirror it on location pages.** Location pages render the **same sections** with the same class names (no `loc-` prefix except for breadcrumb / city-chip / nearby-card). Only the copy changes per city. Dropping the USP bar / gallery / reviews on a location page is a bug.

7. **Blog pages** match the `electric-wheelchair-malaysia` canonical layout (gradient header banner + auto-fill card grid for listing; article column ≤740px + sticky recent-posts sidebar + ToC + bottom WA CTA for the post). `.blog-content` CSS mirrors site type.

8. **Review + lint loop.** `npm run dev` → `node screenshot.mjs` → compare → fix → re-screenshot, ≥2 rounds, desktop **and** mobile, all 3 locales. Then `npm run gate -- --source-only {slug}`.

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

After building, the wizard (`npm run gate` / `npm run scan`) verifies these rules automatically per project and scores 0–100. Layout checks include: `site-chrome-components`, `homepage-chrome`, `location-page-chrome`, `location-matches-homepage`, `blog-listing-chrome`, `blog-post-chrome`, `no-blognav-usage`, `no-undefined-css-vars`, `homepage-h1-h2`. A failing blocking check stops the pipeline before Gate 1.
