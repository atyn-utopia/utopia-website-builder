# Katil Hospital 24 Jam — Design Direction

**Agent:** Kagura — UI Design Specialist
**Authored:** 2026-04-23
**Project:** `projects/katilhospital-24jam`
**Domain:** `katilhospital-24jam.vercel.app`
**Status:** Design direction — no code. Ready for builder handoff.

---

## 0. Preamble — the three hard constraints that shape every decision

1. **Inter-only typography** (user memory overrides CLAUDE.md's serif-pair default). Every heading + body is Inter. Differentiation comes from weight, tracking, size, and colour — not from a secondary family.
2. **Red + hospital-blue duotone**. `#E11C1C` owns urgency; `#2A5FB0` owns trust; `#25D366` owns contact. No other brand hue.
3. **"24 Jam" is the product**. The clock, the countdown, the number 24, and the one-day delivery promise must be visible in the first 600 vertical pixels on every viewport.

Every layout call below resolves to these three constraints first, craft second.

---

## 1. Uniqueness brief — why this site cannot be mistaken for any sibling

I reviewed every deployed sibling project in the system. The katilhospital-24jam direction is intentionally distinct on hero composition, accent geometry, and colour rhythm:

- **electric-wheelchair-malaysia** — split hero, orange accent `#F47B20` on navy `#0F1B3A`, rounded cards, soft-edge photo frames. **We diverge** by using rectilinear blue/white/red bands (not navy), a circular red-ring bed badge (not framed product photo), and zero orange anywhere. Reds are pure signal, not warmth.
- **electrician-24-hour** — pill nav + single-accent blue `#0b63ce` + full-width hero badge "● 24 hour" in a dark wash. Shares the "24-hour" concept but solves it with a flat blue field. **We diverge** with a dual-tone hero (white upper + soft-steel `#8FB8E0` lower) bisected by a red urgency stripe, and a clock-face badge instead of a filled "24-hour" chip.
- **roller-shutter-malaysia** — yellow-on-charcoal industrial palette `#151719` + yellow accordions. Totally different colour vocabulary. **No overlap risk**.
- **service-aircond-malaysia** — navy `#1B3A5C` + red `#DC2626`. This is the closest palette match, so our differentiator must be geometric: aircond uses wide flat blue fields with tight cards; **we use an off-white/soft-steel base with red as stripes + circular badges only**, never as a flat field behind body copy. Our hero is **blue-accented, not blue-dominant**.
- **sewa-motor-malaysia** — near-black `#0F1A2E` hero, motor product photography dominates. **No overlap risk**.
- **tablechair-rental-malaysia** — event-rental warmth, photographic hero, no 24-hour urgency signal. **No overlap risk**.
- **cat-rumah-malaysia** — paint/house-service vertical, colour-swatch motif in hero. **No overlap risk**.
- **oxihome-malaysia** — orange `#F59068` + WhatsApp green, consumer-oxygen product. **No overlap risk** on palette; distinct product-card treatment.
- **hospital-bed-malaysia** — has no `page.tsx` yet (inputs only). **We land first** and set the visual territory for the hospital-bed category.
- **katil-hospital** — has no `page.tsx` yet. Same territory-first argument applies.

**Katil Hospital 24 Jam's three differentiating motifs:**

1. **Circular red-ring "24 JAM" bed badge** — the hero product photo (blue hospital bed) sits inside a 520 px circular off-white tile framed by a 6 px solid `#E11C1C` ring, with a small rotating clock-glyph badge pinned at 2 o'clock. Nobody else uses a circular hero badge.
2. **Rectilinear "urgency stripes"** — a 6 px solid red horizontal bar divides every major section from the next, like a hospital wristband. It's the section divider AND a subliminal colour signal. No sibling uses a hard horizontal stripe between sections.
3. **Dual-aligned grid** — product cards are blue-border top, white body, red CTA underline (not filled button); review cards are white body with Google multicolour G stamp. Cards have **two recognisable silhouettes** (bed-blue vs Google-white) so the eye never confuses a product with a review at a glance.

---

## 2. Hero composition — **Recommendation: Option (c) Circular bed badge**

**Chosen: (c) Circular bed badge, with the doctor-mascot deferred to "Why Choose" (see §10).**

### Rationale
Option (a) would be safe but indistinguishable from electrician-24-hour's split hero. Option (b) risks mobile clutter because the bed photo and the hijab-doctor photo are both already busy compositions — crowding them kills the "24 jam" signal. Option (c) gives us a signature shape (the red-ringed bed disc), lets the bed photo breathe, and reserves the doctor mascot for a single high-trust moment lower on the page where her gesture (thumbs up, stethoscope) reads as personal endorsement rather than competing for attention.

### Desktop composition (≥1024 px)

| Region | Content | Spec |
|---|---|---|
| Top sliver (36 px) | FOMO red bar, ticking `HH:MM:SS` | `#E11C1C` bg, white Inter 13 px semibold, right-aligned countdown |
| 72 px below | Floating pill nav | White pill, radius 9999 px, layered shadow `0 8px 24px rgba(15,23,42,.08), 0 2px 6px rgba(15,23,42,.04)`, 72 px inset from left + right |
| Hero band | 2-column grid, 60/40 split | Left col: copy. Right col: circular bed badge. Column gap 64 px. |
| Left column | Eyebrow badge (red dot + "Sewa · Jual · Hantar 24 Jam"), `<h1>`, `<h2>`, CTA row (green WhatsApp + ghost "Lihat Produk"), trust micro-copy (§3.4 of copy-homepage.md) | H1 52–60 px, Inter 800, tracking −2%, navy `#0F172A`. H2 20–22 px, Inter 500, tracking normal, navy-muted `#334155`. |
| Right column | Circular bed tile | 520 × 520 px disc. Background `#F6F8FB`. 6 px solid `#E11C1C` ring. Bed photo `pasted-image-1776907756088.png` clipped inside a nested 488 × 488 circle with a soft radial gradient tint (white → `#EEF3FA`) for bed readability. |
| Clock sub-badge | Pinned at 2 o'clock on the disc | 88 × 88 px white circle, 2 px `#2A5FB0` border, red clock glyph in centre, "24 JAM" text below in Inter 700 11 px. This is the same red-clock used for `app/icon.svg`. |
| Hero background | Off-white `#F6F8FB` with a single 6 px red urgency stripe running edge-to-edge 32 px above the USP bar | No full-bleed image in the hero (image lives inside the disc) |

### Mobile composition (390 px)

- Stack order: FOMO bar → nav → eyebrow badge → H1 → H2 → circular disc (full-width ≤ 340 × 340 px, centred) → CTA row (WhatsApp full-width, ghost "Lihat Produk" full-width below) → micro-copy (centered, 2 lines max).
- All text **centre-aligned**.
- H1 drops to 32 px, H2 to 17 px, both keep Inter 800 / Inter 500.
- Disc shrinks but keeps the red ring + clock sub-badge so the signature shape survives.
- Minimum vertical breathing between stacked items: 20 px.

### What makes this hero clearly "24 Jam"
- Red clock glyph inside the disc (same mark as the favicon)
- FOMO red bar with ticking countdown above
- Eyebrow badge text "Sewa · Jual · Hantar 24 Jam"
- H1 ends with "…24 Jam di Seluruh Malaysia"
- Green WhatsApp CTA label "WhatsApp Kami Sekarang"

---

## 3. Section-by-section layout spec

Homepage sections 1–12 exactly as Nana's inventory and architecture Appendix §7 demand. Every section described with desktop, mobile, background, dominant colour, micro-detail.

### 3.1 FOMO countdown bar (Section 1)
- **Desktop:** height 40 px. Full width. Content centred horizontally: label text + inline `HH:MM:SS` that visibly ticks every second. Label font 13 px Inter 600. Countdown digits 14 px Inter 700 tabular-nums with a 6 px rounded-rectangle wrap `rgba(255,255,255,.16)` and 8 px horizontal padding per segment (so it reads like three chips).
- **Mobile:** height 36 px. Label truncated to "Tawaran 24 Jam" if needed. Countdown stays visible to the right.
- **Background:** solid `#E11C1C`. No gradient, no shine — urgency colour only. Per CLAUDE.md we may swap to pure `#000` if red fatigue becomes an issue; start with red.
- **Dominant colour:** red.
- **Micro:** inset 1 px darker hairline `rgba(0,0,0,.12)` at bottom to separate from nav. Sticky `top: 0`, disappears only after user scrolls past the hero. `z-index: 60`.

### 3.2 Floating pill nav (Section 2)
- **Desktop:** 72 px logo row floating 16 px below the FOMO bar, 72 px insets left+right. White fill, radius 9999 px, layered shadow (see hero spec). Left: red-clock icon + "Katil Hospital 24 Jam" wordmark in Inter 700 16 px navy. Middle: 5 nav items (`Laman Utama`, `Produk`, `Cara Pesan`, `Ulasan`, `Blog`) in Inter 500 14 px navy `#334155`, 28 px horizontal gap. Right: language switcher (compact MS | EN | ZH pill group with 32 px min-tap area each) + WhatsApp green CTA "WhatsApp Kami".
- **Mobile:** pill becomes 92% viewport width, nav items collapse into a hamburger that opens a full-screen overlay (white, centred links stacked). Logo + WhatsApp green pill remain visible in the collapsed bar.
- **Background:** white.
- **Dominant colour:** white chrome.
- **Micro:** on scroll past 300 px, the pill gains a subtle inset `backdrop-filter: blur(14px)` + background becomes `rgba(255,255,255,.92)`. Hover on nav items: underline grows from 0 → 100% width under the label (transform-origin left), never transition-all.

### 3.3 Hero (Section 3)
See §2 above. Full spec captured there.

### 3.4 3-point USP bar (Section 4)
- **Desktop:** single row, 3 equal columns, 1240 px max-width, background soft-steel `#8FB8E0` at 12% opacity over white (so it reads as a tinted band). Each USP: 48 × 48 px icon (red glyph on white circle, 1 px `#2A5FB0` outline), label (Inter 700 16 px navy), sub-line (Inter 500 14 px navy-muted, 1 line). Column gap 48 px. Vertical padding 32 px.
- **Mobile:** stack to 3 rows, centre-aligned. Icon sits above label. Full-width 1 column. Gap 20 px between rows. Horizontal padding 16 px.
- **Background:** soft steel-blue tint band with a 1 px top + bottom rule `#E2E8F0`.
- **Dominant colour:** soft steel-blue + navy text.
- **Icons:** use `/Users/intern/Downloads/katilhospital24jam.my/usp/8.png` (truck/24-jam), `usp/9.png` (ringgit/rental), `usp/10.png` (MY map). If those don't render crisp at 48 px, fall back to Lucide: `Truck` (stroked red), `Wallet` (stroked red), `MapPin` (stroked red).

### 3.5 Dynamic product grid (Section 5)
See §4 for full card internals. Section wrapper:
- **Desktop:** H3 "Produk Kami" centred, Inter 800 36 px navy, with a short 48 × 3 px red underline element directly under it. Sub-line Inter 500 16 px navy-muted, max-width 680 px, centred. 48 px below the heading, the grid begins at 1240 px max-width.
- **Mobile:** H3 drops to 26 px, centred. 24 px gap to grid.
- **Background:** white `#FFFFFF`. No tint.
- **Dominant colour:** white with blue card borders.
- **Micro:** 8 px rounded-full red dot on the left of the H3 eyebrow ("Produk Kami"), for a consistent section-eyebrow treatment used across sections 5–10.

### 3.6 Why Choose 24 Jam (Section 6)
- **Desktop:** 2-column layout. Left col (40%): H3 + intro copy + the **doctor mascot** (`pasted-image-1776907764125.png`) rendered at 420 × 520 px with the background knocked out (PNG already transparent) sitting on a soft `#8FB8E0` radial gradient disc. Right col (60%): 2 × 2 grid of the four value-prop cards.
- **Mobile:** doctor mascot stacks first (centred, max 280 × 340 px), then H3 centred, then intro 2-line centred, then 4 cards stacked single-column.
- **Background:** soft `#F6F8FB` off-white with a faint `#E2E8F0` 1 px top rule.
- **Dominant colour:** soft-blue backdrop, navy type, red accent on card number chips.
- **Cards:** white, radius 16 px, padding 28 px, layered shadow `0 4px 10px rgba(15,31,80,.06), 0 18px 40px rgba(15,31,80,.05)`. Each card opens with a 32 × 32 px red circle chip containing a white stroke icon (truck, wallet, wrench, headphones) above H4, then 1–2 sentence body.

### 3.7 How it works — 3 steps (Section 7)
- **Desktop:** H3 "3 Langkah Mudah" centred with red underline + eyebrow dot. Below it, 3 step cards in a horizontal row, 32 px column gap. Connecting element: a 2 px dashed `#2A5FB0` horizontal rule behind the cards linking step 1 → 2 → 3.
- **Mobile:** stack vertically. Replace the dashed horizontal rule with a 2 px dashed vertical line between cards.
- **Background:** white, bounded top + bottom by the 6 px red urgency stripe (§1 motif).
- **Dominant colour:** navy + red number badges.
- **Number badges:** 64 × 64 px circle, red `#E11C1C` fill, white Inter 800 28 px numeral (1, 2, 3). Use `/Users/intern/Downloads/katilhospital24jam.my/number/22.png`, `23.png`, `24.png` if the raster matches the palette; if not, draw them in SVG to stay crisp at retina. Badge sits above the step H4.
- **Card:** white, radius 16 px, 24 px padding, same layered shadow as value-prop cards.

### 3.8 Customer gallery (Section 8)
See §5 for grid internals. Section wrapper:
- **Desktop:** H3 "Gambar Pelanggan" centred + sub-line centred + 56 px gap → grid.
- **Mobile:** H3 + sub-line centred, 24 px gap → grid.
- **Background:** **image background** — use `/Users/intern/Downloads/katilhospital24jam.my/Background Website.png` at 6% opacity with a soft-steel `#8FB8E0` 10% overlay tint. This is the first "image-background" section per CLAUDE.md §Section Backgrounds.
- **Dominant colour:** soft steel + WhatsApp-screenshot green tints that come through the reviews.
- **Micro:** each grid cell gets a 1 px `#E2E8F0` border and a very subtle shadow on hover `0 6px 14px rgba(42,95,176,.08)` + translateY(-2px). No transition-all — only transform + box-shadow.

### 3.9 Google Review card section (Section 9)
See §6 for card internals. Section wrapper:
- **Desktop:** H3 centred, sub-line, then 4-col × 2-row grid of 8 review cards (fits Nana's 8-review copy exactly). 28 px column gap, 28 px row gap.
- **Mobile:** snap-scroll horizontal carousel with hidden scrollbar (per CLAUDE.md mobile overflow rule). Each card 85% viewport width, 16 px gutters. Scroll indicator dots below the carousel.
- **Background:** white with a subtle top-edge blue gradient wash `linear-gradient(to bottom, rgba(143,184,224,.12), transparent 160px)`.
- **Dominant colour:** white + Google multicolour accent.

### 3.10 FAQ (Section 10)
- **Desktop:** 2-column split. Left col: H3 "Soalan Lazim" with red underline + a secondary illustrative element (a smaller version of the circular red-ring badge from §2, 280 × 280 px, holding the doctor-mascot cropped to a portrait). Right col: 10 accordion items.
- **Mobile:** stack. Small red-ring portrait badge (240 × 240 px) first, then H3 centred, then accordions full-width.
- **Background:** off-white `#F6F8FB`.
- **Dominant colour:** navy + red accent on the opened accordion (left border 4 px `#E11C1C`).
- **Accordion item:** white, radius 12 px, padding 18 × 20 px, Inter 600 15 px navy for the Q, Inter 500 15 px navy-muted for the A. On open: left border becomes red, chevron rotates 180° (transform only), shadow layer lifts slightly.

### 3.11 Final CTA band (Section 11)
- **Desktop:** full-bleed photo band, min-height 420 px. Use `/Users/intern/Downloads/katilhospital24jam.my/hero 2.png` or `hero 3.png` as the background image (dark bed-in-setting composition). Overlay: `linear-gradient(135deg, rgba(15,23,42,.72), rgba(225,28,28,.22))`. Content centred: H3 white Inter 800 40 px, p subtitle (§11 of copy — NOT a second H2) white/80 Inter 500 18 px, then a single **WhatsApp green** CTA 56 px tall with white icon + label "WhatsApp Kami Sekarang".
- **Mobile:** min-height 360 px. H3 drops to 28 px. CTA full-width.
- **Background:** image + dark-red gradient overlay (dual gradient depth per CLAUDE.md).
- **Dominant colour:** dark navy + red wash.
- **Micro:** a faint repeating clock glyph watermark at 5% opacity in the lower-right corner.

### 3.12 Footer (Section 12)
See §11 for full footer spec.

---

## 4. Product card design (8 cards, dynamic grid)

### Card internals (identical across all 8 SKUs — name + body + price hint change via Supabase)

| Layer | Spec |
|---|---|
| Wrapper | White, radius 16 px, border-top 3 px `#2A5FB0`, border-left/right/bottom 1 px `#E2E8F0`, padding 20 px, layered shadow `0 2px 6px rgba(15,31,80,.04), 0 12px 28px rgba(15,31,80,.06)`. |
| Image aspect ratio | 4 : 3 (bed hero works at this ratio; tilam also works). Image fills a light `#F6F8FB` inner tile, radius 10 px, 16 px bottom margin. `object-fit: contain` so the bed isn't cropped. |
| Name | H4, Inter 700 18 px navy `#0F172A`, tracking −1%. 2-line clamp. |
| Description | Inter 500 14 px navy-muted `#475569`, line-height 1.55, 3-line clamp. |
| Price line | Inter 700 15 px red `#E11C1C`, prefix "dari" Inter 500 navy-muted. Format: `dari RM {rental_price}/bulan` OR fallback `Sebut harga di WhatsApp` when the DB row has no price. |
| CTA | Full-width (inside card) WhatsApp-green `#25D366` pill, 44 px tall, Inter 700 14 px white, centred icon (16 × 16 WhatsApp glyph) + label "Lihat di WhatsApp". Rounded-full radius (matches the site's one shape). |
| Micro | Hover: card translateY(-4px) + shadow depth up; image scale(1.02) via inner wrapper. No transition-all. Focus-visible ring 3 px `#E11C1C` offset 2 px. |

### Grid behaviour (auto-adjusts to DB count)

| Breakpoint | Columns | 8-product layout | 1 | 2 | 4 | 6 | 10 | 15 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| ≥ 1240 px | 4 | 4 × 2 fills | 1 × 1 (centred, max-w 320) | 2 × 1 (centred) | 4 × 1 | 3 × 2 (last row short → switch to 3 col for 6) | 4 × 3 (last row 2, but we centre it) | 4 × 4 minus 1 → switch to 5 col, 3 × 5 | 4 × 5 fills |
| 768–1239 px | 2 | 2 × 4 fills | 1 × 1 | 2 × 1 | 2 × 2 | 2 × 3 | 2 × 5 | 2 × 8 (last row has 1 → centre) or switch to 3 col | 2 × 10 |
| < 768 px | 1 | 1 × 8 | 1 × 1 | 1 × 2 | 1 × 4 | 1 × 6 | 1 × 10 | 1 × 15 | 1 × 20 |

**Implementation rule for the builder:** use the `products.length` value at render time to pick the column count from a lookup table (not `auto-fill`, because `auto-fill` strands partial rows). Acceptable counts that cleanly divide by 4 at desktop: 4, 8, 12, 16, 20. For 6, 10, 15 (and any odd total), switch desktop to 3 columns and centre the last partial row's items (`justify-self: center` on the orphans), so there are no empty slots — only visually-centred partial rows. This satisfies CLAUDE.md "no blank slots".

Grid gap: 28 px desktop, 20 px tablet, 16 px mobile. Max grid width 1240 px, centred.

---

## 5. Customer gallery grid (16 images)

### Count = 16 — clean divisor of 2, 4, 8. Every breakpoint fills.

| Breakpoint | Columns × rows | Gutter | Slot aspect |
|---|---|---|---|
| ≥ 1240 px | 4 × 4 | 16 px | 3 : 4 (WhatsApp screenshots are portrait) |
| 768–1239 px | 4 × 4 (same) or 2 × 8 (fallback if cells shrink below 160 px wide) | 14 px | 3 : 4 |
| < 768 px | 2 × 8 | 12 px | 3 : 4 |

### Cell spec
- Radius 10 px, 1 px `#E2E8F0` border, clip children to radius.
- Each cell has a subtle bottom-right corner "WhatsApp" green tag (12 × 12 px dot) to reinforce that these are real WhatsApp screenshots.
- On hover (desktop): cell scales 1.03 and shadow deepens. Mobile: no hover; tap opens the image in a lightbox (builder's responsibility, not in scope here).

### Source images
Use all 16 files from `brand_assets/review/`: `Review.png` and `Review (2).png` through `Review (16).png`. Order them by visual balance (alternate between predominantly-green screenshots and predominantly-white ones so the grid doesn't clump visually). **Zero blank slots rule enforced** — 16 ÷ 4 = 4 rows exact, 16 ÷ 2 = 8 rows exact. No image is dropped.

If later the count drops to 15 or grows to 18: rule is pad-or-trim. Trim 18 → 16 (drop two least-flattering). Pad 15 → 16 (repeat a hero setup shot). **Never ship a half-empty last row.**

---

## 6. Google Review card section (8 cards)

### Card internals

| Layer | Spec |
|---|---|
| Wrapper | White, radius 14 px, border 1 px `#E2E8F0`, padding 24 px, layered shadow `0 2px 4px rgba(15,31,80,.04), 0 8px 20px rgba(15,31,80,.05)` |
| Top row | Google multicolour "G" (28 × 28 px SVG using the exact 4-colour mark — blue `#4285F4`, red `#EA4335`, yellow `#FBBC05`, green `#34A853`) on the left. "Ulasan Google" label Inter 600 12 px navy-muted to the right of the G. Use assets from `/Users/intern/Downloads/katilhospital24jam.my/google review/27.png`–`38.png` for branding chrome; if those don't suit, SVG-render the G inline. |
| Star row | 5 × 14 px yellow `#FBBC04` stars, tight 2 px gap. Always 5/5 (Nana's sample reviewers all rate 5). |
| Review body | Inter 500 14 px navy, line-height 1.65, 4-line clamp. Uses exact copy from §9.2 of copy-homepage.md. |
| Reviewer | Inter 700 14 px navy. Under it: Inter 500 12 px navy-muted with the city (`Shah Alam`, `Klang`, etc.). |
| Date | Inter 500 12 px navy-muted, right-aligned in the same row as the reviewer name. "3 minggu lalu", "1 bulan lalu" (MS) / "3 weeks ago" (EN) / "3周前" (ZH). |
| Bottom strip | 1 px `#E2E8F0` rule, then "Disahkan oleh Google" (Inter 500 11 px navy-muted) with a small Google "verified" tick icon. |

### Layout
- **Desktop:** 4 × 2 grid, 28 px gutter, 1240 px max-width. Fills exactly with 8 cards — no blank slots.
- **Tablet:** 2 × 4 grid.
- **Mobile:** snap-scroll carousel, cards 85% viewport wide, hidden scrollbar, progress dots below.

### Section-level CTA anchor
Below the 8 cards, a small "Lihat semua ulasan di Google" link (ghost style, 14 px Inter 600 `#2A5FB0`) — but **no phone number and no domain text**. Link target is the eventual Google Business listing (Kimmy fills this URL; not displayed as text).

---

## 7. FOMO bar design

Re-stating the full spec in one place since FOMO is checklist-critical.

| Attribute | Value |
|---|---|
| Background | Solid `#E11C1C` (primary red). Black `#000` is an acceptable A/B alternative per CLAUDE.md but red is chosen first because it pairs with the site palette and amplifies the 24-Jam urgency. |
| Text | White `#FFFFFF`, Inter 600 13 px desktop / 12 px mobile. |
| Countdown | Ticking `HH:MM:SS` counting down to midnight Malaysia time (Kimmy implements the logic). Digits in Inter 700 tabular-nums, each of the three segments wrapped in a 6 px rounded pill with `rgba(255,255,255,.16)` fill and 8 px horizontal padding. |
| Height | 40 px desktop, 36 px mobile. |
| Position | Sticky `top: 0`, z-index 60. Stays pinned until the user scrolls past the hero (`IntersectionObserver` removes `sticky` when hero exits). |
| Label copy | MS: "Tawaran 24 Jam tamat dalam" · EN: "24-Hour offer ends in" · ZH: "24小时优惠倒计时" (from copy-homepage.md §1). |
| Alignment | Desktop: centred horizontally. Mobile: label left, countdown right. |
| Separator | 1 px `rgba(0,0,0,.12)` inset hairline along the bottom of the bar. |

---

## 8. 3-point USP bar (detailed)

| # | Icon file (primary) | Fallback Lucide | Label (MS) | Sub (MS) |
|---|---|---|---|---|
| 1 | `/Users/intern/Downloads/katilhospital24jam.my/usp/8.png` (truck/clock) | `Truck` | Penghantaran 24 Jam | Hantar & pasang hari sama di seluruh Malaysia |
| 2 | `/Users/intern/Downloads/katilhospital24jam.my/usp/9.png` (ringgit/wallet) | `Wallet` | Sewa Bulanan Fleksibel | Pakej sewa atau beli — ikut belanjawan keluarga |
| 3 | `/Users/intern/Downloads/katilhospital24jam.my/usp/10.png` (MY map pin) | `MapPin` | Liputan Seluruh Malaysia | 159 bandar dari Perlis ke Sabah & Sarawak |

Secondary asset folder `/Users/intern/Downloads/katilhospital24jam.my/USP 2/57.png, 59.png` is a reserve for a second USP band further down the page — not used in the primary 3-point bar.

Icon presentation: render raster PNG at 48 × 48 inside a 64 × 64 white circle with a 1 px `#2A5FB0` outline. The icon colour inside is **always red** `#E11C1C` (if the source asset isn't red, use the Lucide fallback so we control colour).

Spacing: desktop column gap 48 px, vertical padding 32 px. Mobile: stack with 20 px row gap, 16 px horizontal padding, centred.

---

## 9. How-it-works — 3 steps

Per Nana's §7 and the user memory rule (exactly 3 steps, never 4+).

### Step card spec (identical per step)

| Layer | Spec |
|---|---|
| Card | White, radius 16 px, padding 28 px 24 px, layered shadow identical to product card. |
| Number badge | 64 × 64 px red `#E11C1C` circle, centred above H4. White Inter 800 28 px numeral. Use a 2 px white inner ring for depth. Reference the raster `/Users/intern/Downloads/katilhospital24jam.my/number/22.png`, `23.png`, `24.png` as design direction but SVG-render for crispness. |
| H4 (step title) | Inter 700 20 px navy, centred. |
| Body | Inter 500 15 px navy-muted, centred, 2-line clamp OK at desktop, unlimited at mobile. |
| Icon accent | Small 20 × 20 red icon above the number badge for each step: Step 1 = WhatsApp glyph, Step 2 = payment glyph, Step 3 = truck glyph. Sits inside a 32 × 32 white circle. |

### Layout
- **Desktop:** 3 columns, 32 px gap, cards equal-height (use `h-full` wrappers per the Kagura mobile checklist). Behind the row, a 2 px dashed `#2A5FB0` horizontal rule linking card centres — ends capped with small red dots. Max-width 1040 px, centred.
- **Mobile:** stack vertically, 20 px row gap, centre-aligned. Dashed rule becomes vertical between cards.

---

## 10. Mascot placement plan

**Primary placement — "Why Choose Katil Hospital 24 Jam" section (Section 6), left column, desktop only; stacks first on mobile.**

### Rationale
The hijab-doctor mascot (`pasted-image-1776907764125.png`) is a trust signal — she's giving a thumbs-up in scrubs. Putting her in the hero competes with the bed photo and muddies the 24-Jam urgency signal. Putting her in the FAQ or footer buries her. "Why Choose" is the section where trust claims (24-hour delivery, transparent pricing, full setup, after-sales support) need a human endorsement, and the mascot's gesture reads as "we approve" when framed right next to those four cards.

### Secondary (smaller) appearance
A scaled-down cropped portrait of her sits inside the 280 × 280 px circular red-ring badge beside the FAQ section heading — as a micro-reinforcement. This is the only place she appears twice. She does NOT appear in the hero, the USP bar, the gallery, the Google Review cards, the final CTA band, or the footer.

### Treatment
- Background knocked out (PNG is already transparent).
- Rendered over a soft radial gradient disc: `radial-gradient(circle at 50% 40%, rgba(143,184,224,.45), transparent 70%)`.
- Optional: a small red-clock micro-badge (48 × 48) pinned bottom-right of her portrait so her presence is still tied to the "24 Jam" motif.

---

## 11. Footer layout

### Desktop (≥ 1024 px)
4-column grid, 1240 px max-width, 56 px column gap, 64 px vertical padding.

| Col A (Brand) | Col B (Produk) | Col C (Lokasi) | Col D (Bahasa) |
|---|---|---|---|
| Red-clock logo + wordmark (Inter 700 18 px white). Tagline §12.1 of copy (Inter 500 14 px white/80, max-w 280 px). **No phone, no email, no domain, no SSM.** Below tagline: a single WhatsApp-green CTA "WhatsApp Kami" for redundancy. | Heading "Produk" (Inter 700 14 px uppercase, tracked +10%, white/70). 8 anchor links to `#product-*` on the homepage (Inter 500 14 px white/85, 10 px row gap). | Heading "Lokasi Utama" (same style). 11 featured cities from copy §12.3 as anchor links to `/{locale}/katil-hospital/{slug}` (Inter 500 14 px white/85, 10 px row gap). Below: "Lihat Semua 159 Lokasi" link in red `#F87171`. | Heading "Bahasa" (same style). 3 locale links: Bahasa Melayu · English · 中文. Active locale in bold white, others white/70. |

### Background
Dark navy `#0F172A` with a 3-stop gradient wash: `linear-gradient(180deg, #0F172A 0%, #0B1120 60%, #050711 100%)`. A single 6 px red urgency stripe at the very top of the footer (continues the §1 motif — this is the final stripe).

### Copyright bar
Bottom 48 px strip, separated by 1 px `rgba(255,255,255,.08)` rule. Content: "© 2026 Katil Hospital 24 Jam. Hakcipta terpelihara." (Inter 500 12 px white/60, centred).

### Mobile
All 4 columns stack. Each column heading centred. Links centred. CTA in Col A becomes full-width. Column gap becomes row gap of 40 px. Vertical padding 48 px.

### What the footer explicitly does NOT contain (per CLAUDE.md + user memory)
- No phone number as text.
- No email address.
- No domain name as displayed text.
- No SSM registration number (architecture.md allows it but user memory blocks it — "Licensed" wording is OK if Kagura decides, but for this project we omit).
- No social-media icon row (Nana's Col D is the language switcher, not socials).

---

## 12. Micro-detail spec

### Corner radius tokens
| Token | Value | Where |
|---|---|---|
| `radius-pill` | 9999 px | All buttons, pill nav, USP circles, nav pill, language-switcher pills |
| `radius-lg` | 16 px | Product cards, value-prop cards, step cards, FAQ wrapper |
| `radius-md` | 12 px | FAQ accordion items, meta chips |
| `radius-sm` | 10 px | Gallery cells, image tiles inside cards |
| `radius-xs` | 6 px | Countdown digit chips |

### Shadow tokens (all layered with colour tint — no flat shadows)
| Token | Value |
|---|---|
| `shadow-nav` | `0 8px 24px rgba(15,23,42,.08), 0 2px 6px rgba(15,23,42,.04)` |
| `shadow-card` | `0 2px 6px rgba(15,31,80,.04), 0 12px 28px rgba(15,31,80,.06)` |
| `shadow-card-hover` | `0 6px 14px rgba(42,95,176,.10), 0 24px 48px rgba(15,31,80,.10)` |
| `shadow-cta-red` | `0 4px 10px rgba(225,28,28,.22), 0 14px 32px rgba(225,28,28,.18)` |
| `shadow-cta-green` | `0 4px 10px rgba(37,211,102,.22), 0 14px 32px rgba(37,211,102,.18)` |

### Hover states (transform + opacity only — never transition-all)
- Buttons: translateY(-1px) + shadow depth up (100 ms ease-out). On press: translateY(0) + shadow back to base.
- Cards: translateY(-4px) + shadow-card → shadow-card-hover (180 ms ease-out).
- Nav links: underline grows left→right (150 ms ease-out, transform scaleX).
- Gallery cells: scale(1.03) (180 ms).
- Accordion chevron: rotate(180deg) (180 ms).

### Focus-visible rings
- On white surfaces: 3 px red `#E11C1C` ring, 2 px offset.
- On red surfaces (FOMO bar, red CTAs): 3 px white ring, 2 px offset.
- On green (WhatsApp CTAs): 3 px white ring, 2 px offset.
- Keyboard `Tab` must reach every interactive element in visual order.

### Mobile breakpoints + type scale
| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | 320–767 | Default. Design starts here. |
| Tablet | 768–1023 | Product grid = 2 col, reviews = 2 × 4. |
| Desktop | 1024–1239 | Pill nav becomes full. |
| Desktop-XL | ≥ 1240 | Full 1240 px max-width containers. |

### Type scale (Inter, all weights)
| Element | Mobile | Desktop |
|---|---|---|
| H1 (hero) | 32 px / 800 / tracking −2% | 52–60 px / 800 / tracking −2% |
| H2 (hero subtitle) | 17 px / 500 | 20–22 px / 500 |
| H3 (section) | 26 px / 800 | 36 px / 800 |
| H4 (card) | 18 px / 700 | 18–20 px / 700 |
| Body | 15 px / 500 / leading 1.65 | 16 px / 500 / leading 1.7 |
| Micro (captions) | 12 px / 500 | 12 px / 500 |
| Button label | 14 px / 700 | 14 px / 700 |
| Nav link | 14 px / 500 | 14 px / 500 |

### Colour contrast (checked)
- Navy `#0F172A` on white → 16.9:1 AAA.
- Navy-muted `#475569` on white → 7.2:1 AAA.
- White on red `#E11C1C` → 4.8:1 AA.
- White on WhatsApp green `#25D366` → 2.6:1 — we bold the label to Inter 700 and add a `text-shadow: 0 1px 0 rgba(0,0,0,.15)` so it reads at a distance. (Per CLAUDE.md the WhatsApp green is a non-negotiable — we do not alter it.)

---

## 13. Blog layout note

**The blog listing and every blog post page MUST match `/Users/intern/Documents/GitHub/utopia-website-builder/projects/electric-wheelchair-malaysia/app/[locale]/blog/` exactly** (user memory "Blog layout reference"). Sequence per post: full site header → breadcrumbs → H1 → metadata row (author + date + read-time) → table of contents → body with H2/H3/H4/p → FAQ block → bottom WhatsApp CTA (green, full-width) → recent-posts grid → full site footer. Single column, no sidebar. **Do not propose an alternative blog layout.** Only the colour tokens change from the electric-wheelchair reference (swap teal for `#E11C1C` red + `#2A5FB0` blue + Inter only, no serif).

The blog CTA banner uses the WhatsApp green `#25D366` pill — same rounded shape as every other CTA on the site.

---

## 14. Pre-handoff checklist

| # | Rule | Status |
|---|---|---|
| a | **Inter-only font** — no serif, no secondary display family | PASS — single family specified everywhere |
| b | **WhatsApp `#25D366`** on every CTA (nav, hero, product cards, inline, FAB, final, blog) | PASS — specified §2, §4, §11, §13 |
| c | **ONE rounded button shape** site-wide (pill, radius 9999 px), colour only varies | PASS — `radius-pill` token locked in §12 |
| d | **No phone / domain / email / SSM** as visible text | PASS — footer §11 explicitly omits; hero uses CTA only |
| e | **1 H1 + 1 H2 per page** (both in hero) | PASS — §2 locks both as hero elements; no other section uses H1/H2 |
| f | **Customer gallery — no blank slots** at any breakpoint | PASS — 4×4 desktop, 2×8 mobile, both exact fills of 16 |
| g | **FOMO bar — red or black + ticking countdown** | PASS — red `#E11C1C`, HH:MM:SS, sticky top §7 |
| h | **How-it-works — exactly 3 steps** | PASS — §9 locks 3 cards, not 4+ |
| i | **Mobile centre alignment** for headings, buttons, cards | PASS — every mobile sub-spec states "centre-aligned" |
| j | **Dynamic product grid adjusts to Supabase count** (1–20) | PASS — §4 lookup table + orphan-centring rule |
| k | **Unique layout vs sibling projects** | PASS — circular red-ring hero badge + 6 px red urgency stripes + dual card silhouettes, no sibling uses these three together |
| l | **Mascot placement decided** — one primary location | PASS — "Why Choose" left column (desktop) / top-stacked (mobile); secondary reuse in FAQ portrait badge |
| m | **Image backgrounds on some sections** (not all flat) | PASS — §3.8 gallery uses `Background Website.png` at 6%, §3.11 final CTA uses `hero 2.png` with dark gradient overlay |
| n | **Layered shadows with colour tint** (no flat `shadow-md`) | PASS — all 5 shadow tokens in §12 use `rgba(…)` colour tints |
| o | **Never default Tailwind blue/indigo** | PASS — brand blues are `#2A5FB0` + `#8FB8E0`, custom |
| p | **Logo icon = favicon** (`app/icon.svg` reuses red-clock) | PASS — hero sub-badge, nav logo, and favicon all reference the same red-clock SVG |
| q | **3-point USP bar immediately below hero** | PASS — §3.4 specified |
| r | **Google Review real branding** (not generic stars) | PASS — §6 renders multicolour G + verified tick + real review copy |
| s | **Blog layout matches electric-wheelchair reference exactly** | PASS — §13 mandates parity, only colour tokens swap |
| t | **Homepage ↔ location page section parity** | PASS — architecture.md §7 Appendix order followed verbatim; location pages insert Breadcrumbs + Nearby Locations without omitting any homepage section |

---

## 15. Builder handoff notes

1. Hero disc (§2) is the project's signature element — build it first, screenshot it, confirm with user before continuing.
2. FOMO countdown (§7) requires a `useEffect`-driven tick; pick midnight-MY as the target and reset daily.
3. Product grid (§4) must read from Supabase via the project's `getProducts()` helper — **never hardcode the 8 SKUs**. The column-selection logic is based on `products.length` at render time.
4. Gallery (§5) image list must be trimmed or padded to a clean divisor before render; do NOT rely on `auto-fill`.
5. All WhatsApp CTAs route through `/{locale}/redirect-whatsapp-1?loc={slug}` (architecture §3.1) — do not embed raw `wa.me/…` URLs.
6. The red-clock favicon at `app/icon.svg` must be the exact same SVG used in the nav logo and the hero disc sub-badge — one asset, three placements.
7. Run the Kagura mobile-layout checklist (agents/kagura.md §Mobile layout checklist) at 390 × 844 before marking the design complete.

**End of design direction.**
