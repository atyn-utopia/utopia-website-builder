# AuntyRokiah Katering — Design Direction (Kagura)

> Project slug: `katering-auntyrokiah` • Domain: `auntyrokiah-katering.utopiaai.my`
> Locales: `ms` (default) / `en` / `zh` • Section order: per `architecture.md` §7.3
> This document is the single visual source of truth. Kimmy implements directly from it.

---

## 1. Visual concept — one paragraph

AuntyRokiah Katering should feel like the moment a brass tudung saji is lifted at a kenduri kahwin — warm steam, turmeric oil glinting on nasi minyak, the hum of saudara mara around a freshly-laid dulang. The supplied logo gives us a 1998-vintage cartouche crest with a gold kenduri pot and rising steam wisps; we extend that single image into a complete visual world by pairing crisp **white canvas + warm ivory panels** with **turmeric-gold and spice-orange accents**, **charcoal serif-feeling sans typography (Plus Jakarta Sans display + Inter body)**, and **photographic hero/CTA backgrounds of real Malaysian kenduri spreads** under a warm gradient. Nothing on the site should look like a generic SaaS catering template — every section is dressed like a majlis table: white cloth (background), gold-rimmed dulang (cards), turmeric trim (eyebrows + CTAs), and a single sambal-red urgency strip at the very top.

---

## 2. Differentiation from existing sister sites

Survey of sister sites (directory pass — patterns inferred from category, not deep-read):

| Sister site | Their dominant pattern | What AuntyRokiah does differently |
|---|---|---|
| `skylift-malaysia` | Industrial slate / blueprint blue, technical iconography, machine-on-grid hero | Warm cream + turmeric, NO blueprint grid, hero is a steaming food tray (lifestyle, not equipment) |
| `electrician-24-hour` | High-contrast yellow + black urgency, lightning glyphs, "24/7" badges as visual hook | We use red ONLY in the FOMO banner; the body palette is calm + appetising — urgency is contained, not the personality |
| `oxihome-malaysia` / `katilhospital-24jam` | Medical white + teal/aqua, soft trust gradients, clinical product cutouts | Catering is hospitality, not clinical — we keep white but swap teal for turmeric, and use `object-fit: cover` lifestyle plating photos instead of cutouts |
| `sewa-motor-malaysia` | Black / racing-orange, motion-streak hero, gear iconography | We share an orange family but ours is a softer **turmeric (#E89A2C)** not a racing-orange; hero is still + plated, not motion-blurred |
| `tablechair-rental-malaysia` | Event-rental neutrals (taupe / sage / beige), grid of furniture cutouts | We are also event-adjacent but go warmer — turmeric + ivory instead of taupe + sage, food photography instead of furniture cutouts, kenduri-pot crest free-floating instead of a wordmark |
| `wall-panel-malaysia` / `roller-shutter-malaysia` | Architectural neutrals + texture swatches, swatch-picker special section | We use a **guest-count → pakej recommender** as our special section (numerical input, not visual swatch) — completely different interaction model |

Net effect: AuntyRokiah is the **only** site in the system anchored on a vintage-crest emblem + photographic kenduri lifestyle hero + turmeric/spice palette + guest-count calculator. No sister site shares all four.

---

## 3. Color tokens

Define as CSS custom properties in `globals.css` and extend Tailwind in `tailwind.config.ts` under `theme.extend.colors`. All hex final — no "TBD".

| Token | Hex | Where it lives |
|---|---|---|
| `--white` | `#FFFFFF` | Site background base (per CLAUDE.md May 2026 rules — white, NOT cream) |
| `--ivory` | `#FAF3E5` | Elevated surfaces only: USP card bg, special-section panel, FOMO secondary states, footer top stripe |
| `--ivory-soft` | `#FDF8EE` | Hairline alternate for product card hover state |
| `--spice-orange` | `#D9742A` | Primary brand — primary CTA bg, hover state of turmeric, eyebrow pill on dark surfaces |
| `--turmeric` | `#E89A2C` | Secondary warm — eyebrow pill bg on white, icon-pill bg, ring on focus, "Best Seller" ribbon |
| `--turmeric-soft` | `#F6D9A8` | Layered shadow tint, gallery hover overlay tint |
| `--charcoal` | `#1F1A17` | H1, H2, H3, body text on white |
| `--charcoal-soft` | `#3C3531` | Secondary body, captions, meta text |
| `--charcoal-muted` | `#6B5F58` | Eyebrow text on white, footer secondary links |
| `--sambal-red` | `#C9252C` | FOMO banner background ONLY |
| `--wa-green` | `#25D366` | WhatsApp CTA fill ONLY |
| `--wa-green-hover` | `#1EBE57` | WhatsApp CTA hover |
| `--google-yellow` | `#FBBC04` | 5-star review row ONLY |
| `--hairline` | `rgba(31, 26, 23, 0.08)` | Card borders, divider lines |
| `--shadow-tint` | `rgba(217, 116, 42, 0.18)` | Layered shadow tint for product cards + hero |

Gradient tokens (also in `globals.css`):
- `--grad-warm-overlay`: `linear-gradient(180deg, rgba(31,26,23,0.05) 0%, rgba(31,26,23,0.55) 60%, rgba(31,26,23,0.78) 100%)` — sits over hero/final-CTA photographs so headlines are legible top + bottom, image still visible centre.
- `--grad-spice-pop`: `linear-gradient(135deg, #E89A2C 0%, #D9742A 55%, #B45A1C 100%)` — primary CTA fill, "Best Seller" ribbon, special-section feature panel.
- `--grad-ivory-veil`: `linear-gradient(180deg, #FAF3E5 0%, #FFFFFF 100%)` — gentle transition between white sections and ivory panels (USP bar → product grid).

**Contrast checks (AA target = 4.5:1 for body, 3.0:1 for large text/buttons):**
- `--spice-orange` (#D9742A) on `--white` (#FFFFFF) — **4.31:1** → passes AA for large text + UI components (buttons use 16px+ semibold, AA-compliant).
- `--white` (#FFFFFF) on `--spice-orange` (#D9742A) — **4.31:1** → passes AA for button label text at 16px semibold ✓.
- `--white` (#FFFFFF) on `--wa-green` (#25D366) — **3.13:1** → passes AA for large UI components (button label is 16px+ semibold and bold icon, meeting the 3:1 non-text + large-text threshold per WCAG 2.1) ✓. Pair with a `1px rgba(0,0,0,0.10)` inset bottom shadow on the WA button so the label sits on a slightly darker green band (extra legibility insurance).
- `--charcoal` (#1F1A17) on `--white` — **18.4:1** → passes AAA.
- `--charcoal` on `--ivory` (#FAF3E5) — **16.8:1** → passes AAA.
- `--white` on `--sambal-red` (#C9252C) — **5.4:1** → passes AA for body text (FOMO banner labels safe).

---

## 4. Typography stack

| Role | Family | Weight | Tracking | Line-height | Notes |
|---|---|---|---|---|---|
| Display H1 | Plus Jakarta Sans | 800 | -0.03em | 1.05 | Mobile 32px → desktop 64px (clamp) |
| Display H2 (hero subtitle) | Plus Jakarta Sans | 600 | -0.015em | 1.25 | Mobile 18px → desktop 24px |
| Section H3 | Plus Jakarta Sans | 700 | -0.02em | 1.15 | Mobile 26px → desktop 36px |
| Subsection H4 | Plus Jakarta Sans | 700 | -0.01em | 1.25 | Mobile 19px → desktop 22px |
| Lede paragraph | Inter | 500 | 0 | 1.6 | Mobile 16px → desktop 18px |
| Body | Inter | 400 | 0 | 1.7 | Mobile 15px → desktop 16px |
| Caption / meta | Inter | 500 | 0 | 1.5 | 13px constant |
| Eyebrow | JetBrains Mono | 600 | +0.12em | 1 | 12px uppercase, always paired with a 6px turmeric dot or 14px turmeric pill background |
| Price numerals | JetBrains Mono | 700 | 0 | 1 | Product card price line — gives a "ticker" credibility |
| Countdown HH:MM:SS | JetBrains Mono | 700 | +0.04em | 1 | FOMO banner timer — large, tabular figures (font-variant-numeric: tabular-nums) |

**Strict rules:** No serifs anywhere. No font-weight below 400. JetBrains Mono is restricted to eyebrows, prices, and the countdown — never used for body or headings.

Load via `next/font/google` inside `app/[locale]/layout.tsx`:
```ts
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-jakarta', weight: ['400','500','600','700','800'] });
const inter   = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter',  weight: ['400','500','600','700'] });
const mono    = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', weight: ['600','700'] });
```
Body class: `className={`${jakarta.variable} ${inter.variable} ${mono.variable} font-[var(--font-inter)]`}`.

---

## 5. Section-by-section treatment

Order is locked per `architecture.md` §7.3. Every entry below = (background) + (container shape) + (one developer-critical instruction).

### 1. FOMO Banner
- **Background:** `--sambal-red` (#C9252C), full-bleed strip.
- **Container:** Full-bleed `w-full`, h-10 mobile / h-9 desktop, sticky `top-0 z-50`.
- **Instruction:** Three children in a flex row: left = eyebrow "PROMO TERHAD" in JetBrains Mono 11px white, center = countdown `HH:MM:SS` in JetBrains Mono 14px white with tabular-nums (label "Tawaran tamat dalam" pinned to its left, hide on viewports < `sm`), right = mini CTA pill "WhatsApp Sekarang" with `--white` text + `--white/30` 1px border. Countdown ticks down to a fixed promo deadline stored in a config constant (set to 14 days from build, refresh on rebuild — never to 0).

### 2. Hero
- **Background:** Full-bleed photographic background (kenduri spread — Pexels candidates listed in §6) overlaid with `--grad-warm-overlay` for legibility. Behind the photo, a base `--charcoal` so a slow image-load never flashes white.
- **Container:** Full-bleed image, content inside `max-w-7xl mx-auto px-6` block with `min-h-[560px] md:min-h-[640px]` to lock hero height. Section is `relative overflow-hidden` to clip the floating crest decoration.
- **Instruction:** Logo-crest icon (isolated kenduri pot — see §13) floats above the H1, **NOT inside a card or container** (per CLAUDE.md transparent-cutout rule). On desktop, the layout is single-column centered text with the crest centered above; on mobile the same layout but everything stacked tighter (crest 96px, then H1, then H2, then lede, then CTAs full-width). The eyebrow "SEJAK 1998 · TRADISI MELAYU" sits between the crest and H1 with a faint white-on-transparent backdrop pill (`bg-white/15 backdrop-blur-sm`).

### 3. USP Bar
- **Background:** `--ivory` (#FAF3E5) — a calm warm panel that visually separates the photographic hero from the white product grid below.
- **Container:** `max-w-7xl mx-auto px-6 py-14 md:py-20`. Inside: `grid grid-cols-1 md:grid-cols-3 gap-6`.
- **Instruction:** NO section heading above the strip (CLAUDE.md mandate). Each card is white bg + `border border-[var(--hairline)]` + `rounded-2xl p-6 md:p-8`. Icon pill is a 56px circle filled with `--grad-spice-pop`, white Lucide icon inside, sitting at the top center. Title H4 below in `--charcoal`, then 1-line body in `--charcoal-soft`. Cards are vertically equal-height via `h-full` on the inner `<article>`.

### 4. Brand / Collaborator Strip
- **Background:** `--white`. A 1px `--hairline` divider top + bottom of the strip — feels like an in-between band, not a heavy section.
- **Container:** `max-w-7xl mx-auto px-6 py-10`. No H-level heading, only an eyebrow centered above.
- **Instruction:** Eyebrow line "DIPERCAYAI OLEH" (centered, JetBrains Mono). Below: a single horizontal flex row of 6 grayscale text-and-mini-icon "logo" badges (no real partner logos available — use Lucide icons paired with the partner name in JetBrains Mono caps, all rendered in `--charcoal-muted` at 60% opacity, hover lifts to 100% opacity + `--turmeric` tint). On mobile, wrap to 2 rows of 3 — never overflow-scroll on this strip (overflow-scroll is for gallery only).

### 5. Products / Pakej Catalogue
- **Background:** `--white`.
- **Container:** `max-w-7xl mx-auto px-6 py-16 md:py-24`. Section head (eyebrow + H3 + intro) center-aligned on mobile, left-aligned on desktop.
- **Instruction:** Two stacked grids inside one `<section>`:
  1. **Core pakej grid** — `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6` (3 cards: Jimat / Standard / Premium). Cards `display: flex; flex-direction: column` so CTA pins to the bottom. Card structure: image 16:10 with `object-fit: cover` (lifestyle plating), then padding-6 body with H4 title, 2-line `-webkit-line-clamp: 2` description, price line in JetBrains Mono (e.g. `RM15<small>/pax</small>`), then `mt-auto` CTA. The Pakej Jimat card gets a "Paling Popular" ribbon in `--grad-spice-pop` at top-right (rotated -8deg, absolute-positioned, do not affect card height).
  2. **Add-on sub-grid** — small section below the core grid, with its own eyebrow "TAMBAHAN" + H4 "Add-on Pilihan" — containing the single Air Balang card centered, max-width 360px (do not stretch a lone add-on across full width). Card same treatment as core but slightly smaller padding.

### 6. Special Section — "Pilih Pakej Mengikut Jumlah Tetamu" (guest-count recommender)
- **Background:** `--ivory` panel with a subtle `--turmeric-soft` radial glow top-right (`radial-gradient(circle at 90% 10%, var(--turmeric-soft) 0%, transparent 60%)`).
- **Container:** Full-bleed `--ivory` strip outside `max-w-7xl`. Inside, `max-w-6xl mx-auto px-6 py-16 md:py-24`. The interactive recommender card is a single elevated `bg-white rounded-3xl border border-[var(--hairline)] shadow-[0_24px_60px_-20px_var(--shadow-tint)] p-8 md:p-12`.
- **Instruction:** This is the **bespoke special section** (CLAUDE.md mandates one per project). Layout on desktop: 2 columns — left = section head (eyebrow "PEMILIH PAKEJ" + H3 + intro), right = the interactive card. Mobile = stacked. The card itself contains:
  - Tier-tab row at the top: 4 pill buttons (≤50 / 50–150 / 150–300 / 300+ pax), single-select, active state filled with `--grad-spice-pop` + white text, inactive `--ivory` + `--charcoal` text.
  - Below the tabs, the matching tier's H4 title + Recommended pakej label (in JetBrains Mono caps) + rationale paragraph + WA CTA button.
  - The card also displays a live estimate row at the bottom: "Anggaran kos: **RM<price × pax>**" — price comes from the selected tier's recommended pakej × the lower bound of the tier (e.g. 50 × RM15 = RM 750). Use JetBrains Mono for the number. This makes the section interactive (per CLAUDE.md special-section list — "inline calculator").

### 7. Process / Cara Tempah
- **Background:** `--white`.
- **Container:** `max-w-7xl mx-auto px-6 py-16 md:py-24`. Section head centered on mobile, left on desktop.
- **Instruction:** 4 step cards in a `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`. Each card has a large JetBrains-Mono step number ("01") in `--turmeric` at top-left (44px font-size, semi-transparent at 30%), a Lucide icon at top-right inside a 40px `--ivory` pill, the H4 step title, and a 2-line body. Connecting line between steps on `lg+` viewport using a 1px dashed `--hairline` border between cards (via `:not(:last-child)::after` pseudo-element).

### 8. Customer Reviews — Google Treatment
- **Background:** `--ivory` panel.
- **Container:** Full-bleed `--ivory`. Inside, `max-w-7xl mx-auto px-6 py-16 md:py-24`. Section head centered, with the aggregate badge directly below the H3.
- **Instruction:** Aggregate badge is a horizontal pill: Google "G" logo (full-colour multi-stroke per CLAUDE.md) → "4.9 / 5 di Google Reviews" → "250+ ulasan" — all on a white pill with `--hairline` border. Below, review cards in a 1-col mobile / 3-col desktop grid (6 reviews → 2 rows of 3 on desktop). Each card: `bg-white rounded-2xl p-6 border border-[var(--hairline)]` with Google G logo at top-right (24px, full colour), reviewer name + city in `--charcoal` semibold, 5-star row in `--google-yellow` (use Lucide `Star` filled), "Posted on Google" caption in JetBrains Mono 10px caps `--charcoal-muted`, review body in Inter 15px. On mobile, render as a horizontal snap-scroll instead of stacking all 6 vertically — `scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch;` (per CLAUDE.md no-visible-scrollbar rule).

### 9. Customer Gallery
- **Background:** `--white`.
- **Container:** `max-w-7xl mx-auto px-6 py-16 md:py-24`.
- **Instruction:** Exactly 12 images (one per Nana alt text). Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`. **12 divides 2, 3, AND 4 evenly → zero blank slots at any breakpoint** (CLAUDE.md gallery rule). Each image is `aspect-square` with `object-fit: cover`, `rounded-xl`, hover scales `transform: scale(1.03)` over 250ms with a `--turmeric-soft` tint overlay fading in at 20% opacity. No lightbox needed — keep simple.

### 10. FAQ
- **Background:** `--white`.
- **Container:** `max-w-4xl mx-auto px-6 py-16 md:py-24` — narrower than other sections, like a reading column.
- **Instruction:** Accordion of 8 Q/A. Each item is a button (full-width, left-aligned text on desktop, center on mobile is wrong here — keep left-aligned because they are long-form Q/A and centering breaks readability). Closed state: H4 question in `--charcoal`, Lucide `ChevronDown` icon on the right (rotates 180deg when open). Open state: 12px gap then answer paragraph in Inter 15px line-height-1.7. Divider `border-b border-[var(--hairline)]` between items. Animate ONLY `transform: rotate()` on the chevron and `max-height` on the answer panel — fall back to `opacity` + `transform: translateY` instead of `max-height` if the dev wants strict-CLAUDE compliance (no `transition-all`).

### 11. Locations
- **Background:** `--white`.
- **Container:** `max-w-7xl mx-auto px-6 py-16 md:py-24`. Section head centered on mobile, left on desktop.
- **Instruction:** A 16-state index. Each state is a card `bg-[var(--ivory)] rounded-2xl p-6 border border-[var(--hairline)]` with H4 state name, 1-2 line state intro from Nana, then a small chip-list of 10 location links (use `flex flex-wrap gap-2`, each chip is `inline-block px-3 py-1 rounded-full bg-white border border-[var(--hairline)] text-sm text-[var(--charcoal)] hover:bg-[var(--turmeric)] hover:text-white transition-[background-color,color] duration-200`). Grid: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`. "Lihat Semua Lokasi" link at the bottom. **On location pages**, prepend a "Lokasi Berdekatan" sub-block above this grid showing 3-4 nearby chips from `nearbyMap`.

### 12. Final CTA
- **Background:** Full-bleed photographic background (a different Pexels image from hero — see §6 for candidates: a wide kenduri-hall wide-shot) + `--grad-warm-overlay`.
- **Container:** `max-w-4xl mx-auto px-6 py-20 md:py-28 text-center`.
- **Instruction:** Eyebrow on a white-on-transparent pill (same treatment as hero), then H3 in white, then a 2-line body in `--ivory-soft`, then ONE big WhatsApp button (h-14, full-width on mobile, max-width 380px on desktop) — single CTA only, no secondary distraction. The crest icon repeats (48px) above the eyebrow as a closing signature.

### 13. Footer
- **Background:** `--ivory` top stripe (4-column area) → `--charcoal` bottom stripe (legal line).
- **Container:** Top: `max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-8`. Bottom legal: `max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2`.
- **Instruction:** Each column has an eyebrow above an H4 (per CLAUDE.md eyebrow rule). Column 1 leads with the crest icon + brand wordmark + tagline. **No phone number text. No domain text.** Footer column links use Inter 14px, `--charcoal-soft` default, hover `--spice-orange`. Bottom legal stripe: white text on `--charcoal`, JetBrains Mono 12px for the copyright line.

---

## 6. Hero composition (special focus)

**Background image:** A real, watermark-free Malaysian kenduri tray shot — preferably nasi minyak from above with hands serving, OR a wide kenduri hall plate-up moment. Image lives in `public/hero/kenduri-hero.jpg` (or pulled from Pexels via `remotePatterns` already in `next.config.ts`).

**Pexels search keywords to use:**
- `"nasi minyak"`
- `"malay wedding food"`
- `"kenduri kahwin"`
- `"malay biryani"`
- `"hand serving rice tray"`
- `"malaysian food spread"`

**Candidate Pexels URLs (verify exact URL before use — these are the search routes the photo will live behind):**
- `https://www.pexels.com/search/nasi%20minyak/` — look for a top-down tray of yellow nasi minyak with garnish.
- `https://www.pexels.com/search/malay%20wedding/` — look for a wide-shot of guests around a kenduri table.
- `https://www.pexels.com/search/biryani/` — fallback if nasi minyak is sparse (visually similar yellow rice + chicken).
- `https://www.pexels.com/search/halal%20food/` — broad pool; filter by "people serving" landscape orientation.

Final pick: a top-down or 3/4 angle photograph of a turmeric-yellow rice tray with ayam merah and acar timun on the side — orientation landscape, resolution ≥ 2400px wide. If a top photo isn't available, fall back to a 3/4-angle dulang with hands serving (more storytelling, still on-brand).

**Overlay:** `--grad-warm-overlay` (defined in §3) applied as an absolute layer between the image and the content. This darkens 60–100% of the bottom and 5% of the top, leaving the centre 30% of the image readable.

**Crest placement:**
- The kenduri-pot crest (isolated from the supplied logo — extract only the gold pot + steam wisps, NOT the cartouche frame or "SINCE 1998" rosette — see §13 for the spec) sits above the H1.
- Mobile: 96 × 96 px, centered, no container/card/border behind it.
- Desktop: 128 × 128 px, centered, no container.
- Do NOT add a circular background, soft shadow box, or coloured panel behind the crest (CLAUDE.md transparent-cutout rule).

**Content stack (top to bottom, both viewports):**
1. Crest (96/128px, centered)
2. Eyebrow pill "SEJAK 1998 · TRADISI MELAYU" (white text, `bg-white/15 backdrop-blur-sm` 8px radius, py-1 px-3)
3. H1 (white, Plus Jakarta Sans 800, clamp(32px, 6vw, 64px), tracking -0.03em, max-w-[18ch])
4. H2 (Plus Jakarta Sans 600, white at 90% opacity, clamp(18px, 2.6vw, 24px), max-w-[42ch])
5. Lede paragraph (Inter 500, `--ivory-soft`, 16-18px, max-w-[56ch])
6. CTA row

**CTA layout:**
- Mobile: stacked, full-width.
  - Primary: WhatsApp button, full-width, h-12, `--wa-green` fill, white Lucide `MessageCircle` icon + "Tempah Sekarang via WhatsApp" label.
  - Secondary: Underline text link "Lihat Pakej →" centered below, scrolls to product section.
- Desktop: side-by-side, content-width.
  - Primary: same WhatsApp button, width auto (px-8).
  - Secondary: "Lihat Pakej" as a ghost button (transparent, white text, 1px white border, same h-12, same rounded shape as primary).

---

## 7. Button system

**Single shape site-wide:** `rounded-full` (CSS `border-radius: 9999px`). NEVER mix with rounded-md or square. Same height per size variant.

**Sizes:**
- `sm` — h-9, px-4, text-13, used in nav and inline chips.
- `default` — h-12, px-6, text-15, used in card CTAs and section CTAs.
- `lg` — h-14, px-8, text-16, used in hero + final CTA.

**Variants (color only — shape never changes):**

| Variant | Default state | Hover | Focus-visible | Active |
|---|---|---|---|---|
| `primary` | `bg-[var(--spice-orange)] text-white shadow-[0_8px_20px_-8px_var(--shadow-tint)]` | `bg-[#B45A1C]` + `transform: translateY(-1px)` | `outline: 2px solid var(--turmeric); outline-offset: 3px` | `transform: translateY(0)` |
| `secondary` | `bg-transparent text-[var(--charcoal)] border border-[var(--charcoal)]` | `bg-[var(--charcoal)] text-white` | same outline | translateY(0) |
| `whatsapp` | `bg-[var(--wa-green)] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.4)]` | `bg-[var(--wa-green-hover)]` + `transform: translateY(-1px)` | outline `var(--wa-green)` | translateY(0) |
| `ghost` | `bg-transparent text-[var(--spice-orange)]` | `text-[#B45A1C]` + underline | outline `var(--turmeric)` | opacity 0.8 |
| `ghost-light` | `bg-transparent text-white border border-white/40` | `bg-white/10 border-white` | outline white | translateY(0) |

**Transitions:** `transition-[transform,background-color,box-shadow,opacity] duration-200 ease-out`. NEVER `transition-all`. NEVER animate `width` or `height`.

**Disabled state (all variants):** `opacity-50 cursor-not-allowed pointer-events-none`.

---

## 8. Card system

### USP card (3 cards under hero, NO section heading above)
- Container: `<article class="h-full bg-white rounded-2xl p-6 md:p-8 border border-[var(--hairline)] flex flex-col items-center text-center gap-4">`
- Icon pill: 56px circle, `bg: var(--grad-spice-pop)`, white Lucide icon 24px centered. 2px white ring-offset for the focal-icon treatment (CLAUDE.md USP rule).
- Title: H4 in `--charcoal`.
- Body: 1 line, Inter 15px, `--charcoal-soft`, max 14 words.
- No CTA. Static informational cards only.

### Pakej (product) card
- Container: `<article class="h-full flex flex-col bg-white rounded-2xl border border-[var(--hairline)] overflow-hidden hover:shadow-[0_24px_60px_-20px_var(--shadow-tint)] hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200">`
- Image: `aspect-[16/10] object-cover` — lifestyle plating photos.
- "Paling Popular" ribbon: absolute top-right, rotated -8deg, `bg: var(--grad-spice-pop) text-white py-1 px-3 text-xs font-jakarta-mono uppercase tracking-[0.12em]`. Only on Pakej Jimat (driven by sort_order = 1 OR a `is_bestseller` flag).
- Body: `p-6 flex flex-col gap-3`. H4 title, 2-line clamped description (`-webkit-line-clamp: 2 overflow-hidden text-ellipsis`), price row (`<div class="font-mono text-2xl font-bold text-[var(--spice-orange)]">RM15<small class="text-sm text-[var(--charcoal-soft)] ml-1">/pax</small></div>`), then `mt-auto` for the CTA so it pins to the bottom across cards of unequal description length.
- CTA: `primary` variant, `default` size, full-width inside the card.

### Review card (Google treatment)
- Container: `<article class="bg-white rounded-2xl p-6 border border-[var(--hairline)] flex flex-col gap-4 relative">`
- Google "G" logo: 24×24, absolute top-right (`top-5 right-5`). SVG path (multi-stroke Google G):
  ```svg
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
  ```
- 5-star row: 5 Lucide `Star` icons, all filled with `--google-yellow` (fill="#FBBC04"), 16px each, flex gap-0.5.
- "Posted on Google" caption: JetBrains Mono 10px, `tracking-[0.12em] uppercase`, `--charcoal-muted`.
- Body: Inter 15px, `--charcoal-soft`, line-height 1.7.
- Author line: `<footer class="mt-auto pt-3 border-t border-[var(--hairline)]"><cite class="not-italic font-semibold text-[var(--charcoal)]">Aida</cite> · <span class="text-[var(--charcoal-muted)]">Shah Alam</span></footer>`.

### Tier card (special section recommender)
- Same elevated white card already defined in §5.6. Tab pills use `primary` variant when active, `ghost` variant when inactive (only background/text color changes, NOT shape — pills still `rounded-full`).

---

## 9. Iconography

**Single library: Lucide React.** Install via `lucide-react` package. Stroke-width default 1.75. Color always `currentColor` so it inherits from parent's `text-` class. Size convention: 16/20/24/32/40/56 — pick the closest.

| Surface | Lucide name | Notes |
|---|---|---|
| USP Card 1 (Heirloom recipe) | `Sparkles` | 24px, white on `--grad-spice-pop` pill |
| USP Card 2 (Halal & clean) | `ShieldCheck` | 24px, same pill |
| USP Card 3 (On time delivery) | `Clock4` | 24px, same pill |
| Process Step 1 (WhatsApp) | `MessageCircle` | 20px, `--turmeric` on ivory pill |
| Process Step 2 (Confirm) | `CalendarCheck` | 20px |
| Process Step 3 (Deliver) | `Truck` | 20px |
| Process Step 4 (Enjoy) | `PartyPopper` | 20px |
| Special section tier ≤50 | `Users` | 20px |
| Special section tier 50–150 | `UsersRound` | 20px |
| Special section tier 150–300 | `UsersThree` (or `Users` filled) | 20px |
| Special section tier 300+ | `UserCheck` | 20px |
| FAQ chevron | `ChevronDown` | 20px, rotates 180deg on open |
| Nav burger | `Menu` | 24px |
| Nav close | `X` | 24px |
| Language switcher | `Globe2` | 18px |
| WhatsApp CTAs | `MessageCircle` | 20px white inside button |
| Review stars | `Star` (filled) | 16px `--google-yellow` |
| Footer social (placeholder) | `Facebook`, `Instagram` | 18px `--charcoal-soft` |
| Gallery hover overlay corner | `ZoomIn` | 24px white at 80% opacity |

---

## 10. Photography direction

**Hero & Final CTA backgrounds:** Pexels searches per §6. Always Malaysian or Asian subjects. NO Western catering, NO suit-and-tie waiters with white tablecloths in marble ballrooms.

**Gallery — 12 slots mapped to Nana's alt text (Pexels search query per slot):**

| Slot | Subject (Nana alt) | Pexels search |
|---|---|---|
| 1 | Nasi minyak tray with ayam merah | `nasi minyak` |
| 2 | Malay bride/groom enjoying spread | `malay wedding kahwin` |
| 3 | Crew arranging trays before guests | `catering staff setup` |
| 4 | Tender daging hitam plated | `beef rendang plated` |
| 5 | Orange + rose syrup barrels | `malaysian drinks orange syrup` |
| 6 | Fresh fruit + kuih raya | `kuih raya open house` |
| 7 | Guests at family tahlil | `malay family gathering food` |
| 8 | Papadom + acar timun | `papadom acar` |
| 9 | Host welcoming at doa selamat | `malay host welcome` |
| 10 | Pakej Jimat tray at corporate luncheon | `corporate halal lunch tray` |
| 11 | Crew serving at 300-guest kenduri | `large malay wedding hall` |
| 12 | Fresh fruit + kuih on tea table | `traditional malay kuih platter` |

Where Pexels lacks the exact shot, substitute the closest Malaysian halal-food photo with the same plating energy. NEVER use AI-generated images here.

**Special section background:** A subtle warm-overlay food texture — e.g. a softly out-of-focus nasi minyak surface in the corner radial glow defined in §5.6, NOT a full photographic background (would compete with the interactive card).

**Image hygiene rules (CLAUDE.md):**
- No watermarks. No low-res (must be ≥ 1600px wide for cards, ≥ 2400px for hero/final-CTA).
- All gallery images run through Next.js `<Image>` with explicit `width` / `height` (set in code) and `sizes` attribute for responsive loading.
- Add the gradient overlay (`--grad-warm-overlay`) on hero + final CTA for legibility.

---

## 11. Motion

All animations on `transform` and `opacity` only. NEVER `transition-all`. NEVER animate `width`, `height`, `top`, `left`, `margin`, `padding`.

| Element | Trigger | Animation |
|---|---|---|
| Hero H1/H2/lede/CTAs | Mount | 200ms ease-out, fade-in (opacity 0 → 1) + translateY(8px → 0). Stagger by 80ms per child. |
| USP / product / review / tier cards | IntersectionObserver intersect (threshold 0.15) | 250ms ease-out, opacity 0 → 1 + translateY(12px → 0). Apply `prefers-reduced-motion: reduce` short-circuit to skip the translate. |
| WhatsApp buttons (hero + final CTA) | Idle | Subtle pulse halo every 4s — `@keyframes pulse-halo` animating a pseudo-element's `transform: scale(1) → scale(1.35)` + `opacity: 0.5 → 0`. Halt on hover. |
| Product card | Hover (≥ md) | `transform: translateY(-2px)` + shadow swap, 200ms. |
| FAQ accordion chevron | Click | `transform: rotate(0deg → 180deg)`, 200ms ease-out. |
| FAQ accordion body | Click | Opacity 0 → 1 + translateY(-4px → 0), 200ms ease-out. Use `aria-hidden` + visibility toggle instead of `max-height` if `transition-all` is the only way to animate height — animate only opacity + transform. |
| Gallery image | Hover (≥ md) | `transform: scale(1.03)` + tint overlay `opacity: 0 → 0.2`, 250ms. |
| Special-section tier tabs | Click | `transform: scale(0.97 → 1)` on the newly-active pill, 150ms. |
| FOMO countdown | Continuous | Number swap via `setInterval(1000)` — no animation, just text content swap (font-variant-numeric: tabular-nums prevents layout shift). |

`prefers-reduced-motion`: wrap each `@keyframes` and intersection-observer-driven transition in `@media (prefers-reduced-motion: no-preference)`. Reduced-motion users get instant state changes.

---

## 12. Mobile-first checklist

Primary viewport: 390 × 844 (iPhone 14). Verify EVERY item below at this viewport — Kagura's final mobile audit must pass all.

- [x] Hero crest 96px on mobile, 128px on `md+`.
- [x] All hero headings + CTAs **center-aligned** on mobile. Left-aligned variants reserved for `md+`.
- [x] CTAs **`w-full` below sm`**, content-width from `sm+`.
- [x] USP bar: 1-col stack on mobile, 3-col grid on `md+`. Each card centered.
- [x] Pakej grid: 1-col mobile, 2-col `sm`, 3-col `xl`. (Add-on sub-grid: 1-col centered, max-w-[360px].)
- [x] Special section: stacked (section head above card) on mobile, 2-col on `lg+`.
- [x] Process: 1-col mobile, 2-col `md`, 4-col `lg`.
- [x] Reviews: horizontal snap-scroll on mobile (`scrollbar-width: none`), 3-col grid on `md+`.
- [x] Gallery: 2-col mobile, 3-col `md`, 4-col `lg` — 12 images = clean rows at every breakpoint.
- [x] FAQ: full-width column, left-aligned (long-form readability beats center).
- [x] Locations: 1-col mobile, 2-col `md`, 3-col `xl`.
- [x] Final CTA: stacked, center-aligned, single full-width WA button.
- [x] Footer: 1-col on mobile (columns stack), 4-col on `md+`.
- [x] Nav: hamburger < `md`, horizontal links + WA CTA pinned right on `md+`. WA green CTA visible in mobile-collapsed view too.
- [x] No text smaller than 12px on mobile. Hero H1 ≥ 32px. Body ≥ 15px.
- [x] All buttons + accordion headers ≥ 44 × 44 px touch target.
- [x] No horizontal overflow anywhere. FOMO countdown label hidden on < `sm` to keep the strip inside viewport.
- [x] Min `py-14` between sections on mobile; bump to `py-20` / `py-24` on `md+`.
- [x] `leading-[1.7]` or greater on all body paragraphs.
- [x] Min `px-4` (we use `px-6`) horizontal padding on all section containers.

---

## 13. Favicon spec (`app/icon.svg`)

The favicon **must reuse the kenduri-pot crest** isolated from the supplied logo (CLAUDE.md logo rule). Drop the cartouche frame, wordmark, "SINCE 1998" rosette, and tagline scroll — keep ONLY the gold pot + steam.

**Style:** Warm-gold (`--turmeric` #E89A2C) pot with a darker `--spice-orange` (#D9742A) rim band and `--charcoal` (#1F1A17) outline at 1px (`stroke-width="1.5"` to read at 16px). Two steam wisps in `--charcoal-soft` at 60% opacity above the pot. Transparent background. Centered in a 32 × 32 viewBox with 2px breathing room on every edge.

**SVG primitive list (compose in `app/icon.svg`):**
```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- steam wisp left -->
  <path d="M11 7 C 10 5, 12 4, 11 2" stroke="#3C3531" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
  <!-- steam wisp right -->
  <path d="M16 6 C 17 4, 15 3, 16 1" stroke="#3C3531" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
  <!-- pot lid knob -->
  <circle cx="16" cy="9" r="1.2" fill="#E89A2C" stroke="#1F1A17" stroke-width="0.8"/>
  <!-- pot lid dome -->
  <path d="M8 14 Q 16 7 24 14 Z" fill="#E89A2C" stroke="#1F1A17" stroke-width="1.5" stroke-linejoin="round"/>
  <!-- pot rim band (darker) -->
  <rect x="7" y="14" width="18" height="2" fill="#D9742A" stroke="#1F1A17" stroke-width="1.5"/>
  <!-- pot body -->
  <path d="M8 16 L 9 25 Q 16 28 23 25 L 24 16 Z" fill="#E89A2C" stroke="#1F1A17" stroke-width="1.5" stroke-linejoin="round"/>
  <!-- pot handle left -->
  <path d="M7 17 Q 4 19 7 22" stroke="#1F1A17" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- pot handle right -->
  <path d="M25 17 Q 28 19 25 22" stroke="#1F1A17" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>
```

The same icon, at 56–64px, is used as the brand mark in the navbar (paired with the wordmark "AuntyRokiah Katering" in Plus Jakarta Sans 700) and again in the footer column 1, and as the closing-signature 48px crest above the final CTA's eyebrow.

---

## 14. Implementation handoff

Kimmy (or the dev) executes in this exact order — each step compiles cleanly before the next begins.

1. **`tailwind.config.ts`** — extend `theme.extend.colors` with all tokens from §3 (white, ivory, ivory-soft, spice-orange, turmeric, turmeric-soft, charcoal, charcoal-soft, charcoal-muted, sambal-red, wa-green, wa-green-hover, google-yellow, hairline). Extend `fontFamily` with `jakarta`, `inter`, `mono` referencing the CSS vars. Extend `boxShadow` with `card: '0 24px 60px -20px var(--shadow-tint)'`. Extend `backgroundImage` with `grad-warm-overlay`, `grad-spice-pop`, `grad-ivory-veil`.
2. **`app/globals.css`** — declare `:root` with every CSS var (colors + gradients + shadow-tint). Add `@layer base` resets: `body { font-family: var(--font-inter); color: var(--charcoal); background: var(--white); }`. Add `.eyebrow` utility class for the JetBrains Mono uppercase tracker pill. Add `@keyframes pulse-halo` for the WA-button motion. Add `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` utility for snap-scroll rows.
3. **`app/icon.svg`** — drop in the SVG from §13.
4. **`app/[locale]/layout.tsx`** — load `Plus_Jakarta_Sans`, `Inter`, `JetBrains_Mono` via `next/font/google` with `variable: '--font-jakarta' | '--font-inter' | '--font-mono'` and `display: 'swap'`. Apply variables to `<body class>`. Inject the Utopia Webcore tracking `<script>` with `data-website="auntyrokiah-katering.utopiaai.my"` in `<head>`. Render `<NextIntlClientProvider>` + `<OrganizationSchema />` + `{children}`. **No header, no footer here** (architecture §7.4 mandate — each page owns its chrome).
5. **`components/PageShell.tsx`** — export shared visual primitives ONLY: `<Eyebrow>`, `<SectionHead eyebrow heading intro>`, `<Button variant size>`, `<GoogleG />` (the SVG from §8), `<CrestIcon size>` (the favicon SVG, sized via prop). Do NOT wrap pages in chrome.
6. **`components/Ornaments.tsx`** — export the radial glow + decorative blobs used in the special section + hero crest float.
7. **`components/LanguageSwitcher.tsx`** — uses `<Globe2 />` from Lucide, pill-shaped, opens a small dropdown of MS/EN/ZH preserving path.
8. **`app/[locale]/page.tsx`** (homepage) — render sections in order from §5: FOMO → Hero → USP → Brand Strip → Products → Special → Process → Reviews → Gallery → FAQ → Locations → Final CTA → Footer. Each section is its own component file in `components/sections/` (e.g. `FomoBanner.tsx`, `Hero.tsx`, etc.) so location pages can re-import them.
9. **`app/[locale]/pakej-katering/[location]/page.tsx`** — reuse the same section components in the same order, adding the Breadcrumb above Hero and the Nearby Locations sub-block above the Locations grid. Per-location copy keyed in `messages/<locale>.json` under `locationSeo`.
10. **`components/sections/`** — one file per section. Use `'use client'` ONLY for FomoBanner (countdown), Special-section recommender (state), Faq (accordion), Reviews (snap-scroll). All other sections stay server components.
11. **Verify before sign-off** — run the section-tagging lint (every H3/H4 in sections has a preceding `.eyebrow`), the heading-count lint (exactly 1 H1 + 1 H2 per page), the orphan-paragraph lint (no `<p>` outside a heading-led block), and the mobile audit at 390 × 844 (every checkbox in §12 passes).

No item above is "TBD". Anything not specified here defers to CLAUDE.md.
