# katilhospital-24jam — Project Inputs

**Created:** 2026-04-23T01:29:37.510Z
**Finalised:** 2026-04-23
**Slug:** katilhospital-24jam

## Original Prompt
i want create website for katil hospital 24 jam business, you can follow the hero photo, product listing and customer gallery same like in this link https://www.katilhospital24jam.my/

## Company (Owner)
**Ibnu Sina Care Sdn. Bhd.**
`company_id = d6cc8f48-ea42-4420-b9d6-73ca63263be0`

## Brand
- Brand name: **Katil Hospital 24 Jam**
- Tagline (MS): Sewa & Jual Katil Hospital 24 Jam di Seluruh Malaysia
- Reference URL: https://www.katilhospital24jam.my/
- Logo / favicon icon: red clock icon from `brand_assets` / `/Users/intern/Downloads/katilhospital24jam.my/logo dark.png` (must be reused for `app/icon.svg` — same icon in logo + favicon)
- Brand palette (extracted from reference pack):
  - Primary red (clock icon): `#E11C1C` (CTA / urgency / FOMO)
  - Hospital blue (bed accent): `#2A5FB0`
  - Soft steel blue: `#8FB8E0`
  - White / off-white background: `#FFFFFF` / `#F6F8FB`
  - Dark navy body text: `#0F172A`
- Font: **Inter** for ALL text (headings + body). No serif. (Per user memory rule.)
- WhatsApp CTA: **`#25D366`** (hover `#1EBE57`) everywhere — never themed.

## Products (Dynamic via Supabase)

Primary (5 — hospital bed rental/sale focus):

| # | Name (MS) | Slug | Image source | Category |
|---|-----------|------|--------------|----------|
| 1 | Katil Hospital Manual 1-Fungsi | `katil-hospital-manual-1-fungsi` | `brand_assets/product/14.png` | bed |
| 2 | Katil Hospital Manual 2-Fungsi | `katil-hospital-manual-2-fungsi` | `brand_assets/product/13.png` | bed |
| 3 | Katil Hospital Elektrik 3-Fungsi | `katil-hospital-elektrik-3-fungsi` | Pexels (new, Asian/MY subject) | bed |
| 4 | Tilam Hospital (Foam) | `tilam-hospital-foam` | `brand_assets/product/15.png` | mattress |
| 5 | Tilam Angin Anti-Decubitus | `tilam-angin-anti-decubitus` | `brand_assets/product/16.png` | mattress |

Secondary / cross-sell (3):

| # | Name (MS) | Slug | Image source |
|---|-----------|------|--------------|
| 6 | Mesin Oksigen | `mesin-oksigen` | `brand_assets/other-product/17.png` |
| 7 | Kerusi Roda | `kerusi-roda` | `brand_assets/other-product/18.png` |
| 8 | Mesin CPAP | `mesin-cpap` | `brand_assets/other-product/19.png` |

**Rules (from root CLAUDE.md Dynamic Product Data):**
- All 8 products inserted into `products` + `product_photos` Supabase tables with `website = 'katilhospital-24jam.vercel.app'`, `is_active = true`, `sort_order` 1–8
- Homepage + location pages fetch dynamically, ISR `revalidate = 3600`
- No hardcoded product list in frontend
- Grid auto-adjusts to product count at every breakpoint; no blank slots

## Product URL pattern
`/{locale}/katil-hospital/{location}` — primary product slug for location pages is `katil-hospital` (MS generic term). Per-SKU variant pages are rendered on the homepage and can be linked-to directly; the primary SEO template is the location page.

## Target Country
Malaysia

## Languages (MS primary)
- **Bahasa Melayu (ms) — DEFAULT LOCALE**
- English (en) — secondary
- Mandarin Chinese (zh) — secondary

`i18n/routing.ts`:
```
locales: ['ms', 'en', 'zh']
defaultLocale: 'ms'
localePrefix: 'always'
```

Copy priority: MS is authored first by Nana; EN and ZH are translated from MS (not the other way).

## Domain
**`katilhospital-24jam.vercel.app`**
- `siteUrl`: `https://katilhospital-24jam.vercel.app`
- Tracking script `data-website` MUST match exactly

## Leads Mode
**`single`** — one default phone number returned on every WhatsApp redirect, regardless of page or location.

## Phone Number (Seed)
- Phone: `60174287801`
- Label: `default`
- Type: `default`
- `location_slug`: `all`
- `percentage`: 100
- WhatsApp text (MS): `Hi, saya berminat dengan perkhidmatan sewa / beli katil hospital dari Katil Hospital 24 Jam. Boleh bantu?`
- WhatsApp text (EN): `Hi, I'm interested in renting / buying a hospital bed from Katil Hospital 24 Jam. Can you assist?`
- WhatsApp text (ZH): `您好，我有兴趣从 Katil Hospital 24 Jam 租用/购买病床，请问能协助吗？`

## Target Locations
Reuse the full Malaysia coverage list from `projects/electric-wheelchair-malaysia/config/locations.ts` (≥10 sub-locations per state, 150–180 total). Verify count and state balance before shipping.

Hero / USP priority locations (featured first in location section, most-searched MY cities for hospital beds): Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Johor Bahru, Klang, Penang (George Town), Ipoh, Kuantan, Kota Kinabalu, Kuching.

## Special Requirements
- Urgency angle: **"24 Jam"** — 24-hour delivery/service. Bake into hero, USP bar, FOMO countdown, and CTAs.
- FOMO banner: live ticking countdown (HH:MM:SS), background **red (#E11C1C) or black** — never brand colour, never yellow/green. Sticky top of first viewport.
- 3-point USP bar immediately below hero (e.g. "Penghantaran 24 Jam", "Sewa RM/bulan", "Liputan Seluruh Malaysia").
- Gallery: customer gallery (from `brand_assets/review/`) must fill every grid cell at every breakpoint — no blank slots.
- Every WhatsApp button uses `#25D366` / `#1EBE57`.
- No phone number / domain / email / SSM visible as text — WhatsApp CTA only.
- Every page exactly one H1 + one H2 (both in hero).
- Mobile-first, mobile-center-aligned headings/buttons/cards.
- Blog layout must match `projects/electric-wheelchair-malaysia/app/[locale]/blog/` exactly.

## Brand Assets Available
Project folder: `projects/katilhospital-24jam/brand_assets/`
- `pasted-image-1776907756088.png` — hero hospital bed (blue mattress, side rails)
- `pasted-image-1776907764125.png` — doctor mascot (Malaysian Muslim woman in hijab, thumbs up, stethoscope)

Reference asset pack: `/Users/intern/Downloads/katilhospital24jam.my/`
- `hero.png`, `hero 2.png`, `hero 3.png`, `hero whatsapp.png` — hero candidates
- `logo dark.png`, `logo light.png`, `favicon.png`, `icon.svg` — logo set
- `product/13-16.png` — primary bed/mattress SKUs
- `other product/17-19.png` — cross-sell SKUs
- `review/Review.png`, `Review (2-16).png` — 16 customer review screenshots (WhatsApp-style)
- `google review/` — Google review branding (use for review cards per user memory)
- `number/`, `number 1.png`, `stamping EN.png`, `stamping.png` — trust badges
- `Background Website.png`, `scroll*.png`, `Social Share Cover Master` — background + social
- `usp/`, `USP 2/`, `diagram/` — USP icons + how-it-works diagrams
- `Video Demo.mp4` — product demo video

**Rule:** copy needed files into `projects/katilhospital-24jam/brand_assets/` or `public/` during scaffolding — do not reference `Downloads/` from the deployed site.

## Competitor / Reference
- https://www.katilhospital24jam.my/ — match hero photo, product listing, customer gallery layout (per brief)
- `projects/electric-wheelchair-malaysia/` — reference implementation for all technical patterns (blog layout, location pages, i18n, schema, tracking, lib/*)
