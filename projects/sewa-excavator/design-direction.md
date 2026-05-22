# Abang Excavator — Design Direction (`design-direction.md`)

> **Author:** Kagura (UI Design Specialist)
> **Project:** sewa-excavator
> **Domain:** sewa-excavator.vercel.app
> **Brand colour:** Orange #F26C1F + Charcoal #0F0F0F + White #FFFFFF
> **Type stack:** Plus Jakarta Sans (display + body) + JetBrains Mono (eyebrows, numerals)
> **Reference brief:** mobilecrane.my (energy/urgency) — but more modern + confident
> **Special section:** Inline rental calculator on charcoal panel
> **Section parity:** Homepage and location pages share the 14-section order from architecture.md

---

## 1. Existing Sites Audit (sibling differentiation grounding)

| Sibling | Primary palette | Hero signature | Section signature |
|---|---|---|---|
| **skylift-malaysia** | Industrial yellow `#F5B400` + charcoal `#1C1F2A` + off-white `#F8F8F6` | Pill buttons, rectangular cards, Inter-only, off-white body bg | Construction-document tone, document-card USPs |
| **sewa-motor-malaysia** | Coral-orange `#FF6B35` + navy `#16213E` + light surface `#F1F3F5` | Animated WhatsApp pulse, marquee brand strip, top-stripe product cards | High-saturation accents, 16px-radius cards with brand-border |
| **lorry-sticker** | Ignition orange `#FF5A1F` + ink-black `#0F0F12` + warm paper `#FAF7F1` + Archivo Black display | Paper/editorial body bg, Archivo Black hero, alert-red FOMO | "Stickerlori.my" editorial paper feel, 8px button radius |
| electrician-24-hour | Blue/yellow + emergency motif | 24-hour clock urgency hero | Service-card grid |
| oxihome-malaysia | Medical teal + white | Clinical trust hero with badge | Calm spacing, medical reassurance |
| katilhospital-24jam | Healthcare blue/white | Hospital-product imagery | Medical product grid |
| tablechair-rental-malaysia | Event/hospitality warm tone | Event styling hero | Rental-period chooser |
| wall-panel-installation | Wood / interior accent | Lifestyle interior hero | Variant chooser |
| roller-shutter-malaysia | Steel grey / silver | Industrial security hero | Security-card grid |
| service-aircond-malaysia | Cool blue + white | Service-tier hero | Pricing cards |

## 2. Duplicate Risk Report — What Abang Excavator MUST NOT copy

1. **DO NOT reuse sewa-motor-malaysia's coral-orange + navy combo, top-stripe product cards, animated WA pulse, or its 16px rounded card aesthetic.** Sewa-motor sits in the same orange neighbourhood — Abang Excavator must lean *deeper* and *darker* into a charcoal-dominant surface so the orange reads as **industrial signal** rather than consumer coral.
2. **DO NOT reuse skylift-malaysia's "construction document" layout** (off-white body bg, rectangular non-rounded cards, document-aesthetic). Skylift already owns the construction-document feel — we go in the opposite direction: dark, energetic, blueprint-grid, with rounded cards.
3. **DO NOT reuse lorry-sticker's Archivo Black display + warm paper background.** That editorial-paper vibe is taken — Abang Excavator stays clean, geometric, white + charcoal.
4. **DO NOT default to the same hero archetype** (split-hero with text-left photo-right card). Use a **floating transparent excavator silhouette over a charcoal field with blueprint-grid background** — none of the siblings use a blueprint-grid texture.
5. **DO NOT mirror lorry-sticker's red FOMO bar styling** — same colour role is fine (red = urgency) but the *typography* and chip styling must differ: we use a pure JetBrains Mono countdown with separator dots and an orange pulse dot, not pill-chips.

## 3. Recommended Design Direction

The site reads as **"industrial command centre meets confident trade brand."** Think Volvo-engineered, blueprint-grid, orange-on-charcoal — a control panel rather than a coupon flyer. Mobilecrane.my brings the urgency tempo, but we ground it with calm whitespace and precise mono numerals so it feels modern, not chaotic.

### 3.1 Hero layout (confirmed + extended)

**Layout type:** Split hero, 12-col grid, dark background.

- **Background:** `--brand-charcoal` (#0F0F0F) base with a low-opacity **blueprint-grid texture** (CSS-painted — see §6.1) and a subtle radial orange glow originating from the lower-right corner of the excavator boom. Adds depth without an image.
- **Right side (≥`md`, ≈55% width):** the orange Volvo excavator silhouette **isolated from the dark logo PNG** (no card, no border, no shadow box — per the transparent-cutout rule). Floats freely. Subtle CSS `drop-shadow(0 30px 60px rgba(242,108,31,0.25))` for grounding only. On mobile the silhouette sits *below* the text block at 60% width, centred.
- **Left side (≈45% width):** stack from top to bottom:
  1. **Eyebrow** — `OPERATOR STANDBY 24/7` in JetBrains Mono 700, 12px, letter-spacing 0.18em, orange pill bg `--brand-orange-pale` on light variant — but here on the dark hero we use the `eyebrow-light` variant (orange text on a 1px orange-translucent ring, transparent bg).
  2. **H1** — `Sewa Excavator No.1 Malaysia` — Plus Jakarta Sans 800, clamp(2.25rem, 5.5vw, 4.5rem), tracking -0.035em, line-height 1.02, white. Highlight "**No.1**" in `--brand-orange` (inline span).
  3. **H2** — `Volvo EC200 dan EC400 — harian, mingguan, bulanan` — Plus Jakarta Sans 600, clamp(1.125rem, 2vw, 1.5rem), tracking -0.01em, line-height 1.35, `rgba(255,255,255,0.78)`.
  4. **Supporting line** — body-lg, 1.7 line-height, `rgba(255,255,255,0.65)`.
  5. **CTA row** — Primary WA button (green, full-width on mobile, auto-width on desktop) + secondary text link "Kira anggaran sewa →" in orange.
  6. **Hero stat bar** — three inline stats below CTAs, separated by 1px orange dividers: `2 Model Volvo` / `14 Negeri` / `24 Jam Hantar`. Numerals in JetBrains Mono 700, labels in Plus Jakarta Sans 500 uppercase 11px. This replaces the typical "trust counter" — feels like an instrument panel.
- **Bottom-left corner of hero:** small JetBrains Mono label `SITE-READY · KL ▸ KOTA KINABALU` ticking through 6 cities (CSS keyframe rotation, 4s each). Gives the hero a "live ops" feel.

### 3.2 Colour tokens (drop into `app/globals.css`)

```css
:root {
  /* Brand — Abang Excavator */
  --brand-orange:        #F26C1F;
  --brand-orange-deep:   #D8550E;
  --brand-orange-bright: #FF8338;
  --brand-orange-pale:   #FFF1E6;
  --brand-orange-ring:   rgba(242, 108, 31, 0.28);
  --brand-orange-glow:   rgba(242, 108, 31, 0.45);

  --brand-charcoal:      #0F0F0F;
  --brand-charcoal-2:    #15161A;
  --brand-steel:         #2A2D33;
  --brand-steel-2:       #3A3E46;

  --brand-grey:          #6B7280;
  --brand-grey-light:    #E5E7EB;
  --brand-grey-soft:     #F3F4F6;
  --brand-white:         #FFFFFF;
  --brand-paper:         #FAFAFA;

  /* Semantic */
  --ink:                 #0F0F0F;
  --ink-muted:           #4B5563;
  --ink-faint:           #9CA3AF;
  --line:                rgba(15, 15, 15, 0.10);
  --line-strong:         rgba(15, 15, 15, 0.18);
  --line-on-dark:        rgba(255, 255, 255, 0.10);
  --line-on-dark-strong: rgba(255, 255, 255, 0.18);

  /* Mandatory cross-site */
  --wa-green:            #25D366;
  --wa-green-hover:      #1EBE57;
  --google-yellow:       #FBBC04;
  --alert-red:           #E10600;
  --alert-red-dark:      #B30500;

  /* Gradients */
  --gradient-orange:     linear-gradient(135deg, #FF8338 0%, #F26C1F 45%, #D8550E 100%);
  --gradient-orange-soft:linear-gradient(180deg, rgba(242,108,31,0.16) 0%, rgba(242,108,31,0) 100%);
  --gradient-charcoal:   linear-gradient(180deg, #15161A 0%, #0F0F0F 100%);
  --gradient-hero-glow:  radial-gradient(60% 80% at 80% 65%, rgba(242,108,31,0.30) 0%, rgba(242,108,31,0) 70%);

  /* Blueprint grid (used as background-image on dark sections) */
  --blueprint-grid: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 56px 56px,
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 56px 56px;

  /* Shadows — layered with brand tint, never flat */
  --shadow-sm:   0 1px 2px rgba(15,15,15,0.06);
  --shadow-md:   0 4px 14px rgba(15,15,15,0.08), 0 2px 4px rgba(15,15,15,0.04);
  --shadow-lg:   0 16px 36px rgba(15,15,15,0.12), 0 4px 10px rgba(15,15,15,0.06);
  --shadow-xl:   0 28px 60px rgba(15,15,15,0.18), 0 8px 18px rgba(15,15,15,0.08);
  --shadow-orange: 0 14px 36px rgba(242,108,31,0.32), 0 4px 12px rgba(242,108,31,0.20);
  --shadow-wa:   0 12px 28px rgba(37,211,102,0.32), 0 4px 10px rgba(37,211,102,0.18);

  /* Radius — one button shape across site */
  --radius-xs:   6px;
  --radius-sm:   10px;
  --radius-md:   14px;
  --radius-lg:   20px;
  --radius-card: 18px;
  --radius-btn:  12px;     /* THE single button radius — used by every CTA */
  --radius-pill: 9999px;

  /* Spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --space-9: 96px; --space-10: 128px;
  --section-y: clamp(64px, 9vw, 112px);
  --max-w:     1240px;
  --gut:       clamp(20px, 4vw, 56px);

  /* Type */
  --font-display: 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif;
  --font-body:    'Plus Jakarta Sans', -apple-system, system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, Menlo, monospace;

  /* Motion */
  --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
  --ease-emphasis: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast:      150ms;
  --dur:           240ms;
  --dur-slow:      420ms;
}
```

### 3.3 Typography scale (rem-based, mobile-first)

| Role | Family | Weight | Size (mobile → desktop) | Tracking | Line-height |
|---|---|---|---|---|---|
| **H1** (hero only) | Plus Jakarta Sans | 800 | `clamp(2.25rem, 5.5vw, 4.5rem)` | -0.035em | 1.02 |
| **H2** (hero subtitle) | Plus Jakarta Sans | 600 | `clamp(1.125rem, 2vw, 1.5rem)` | -0.01em | 1.35 |
| **H3** (section heading) | Plus Jakarta Sans | 700 | `clamp(1.625rem, 3vw, 2.25rem)` | -0.025em | 1.15 |
| **H4** (sub-section / card title) | Plus Jakarta Sans | 700 | `clamp(1.125rem, 1.6vw, 1.375rem)` | -0.015em | 1.3 |
| **H5** | Plus Jakarta Sans | 600 | `1rem` | -0.005em | 1.4 |
| **H6** | Plus Jakarta Sans | 600 | `0.875rem` | 0 | 1.5 |
| **Body-lg** | Plus Jakarta Sans | 400 | `clamp(1rem, 1.25vw, 1.125rem)` | 0 | 1.7 |
| **Body** | Plus Jakarta Sans | 400 | `1rem` | 0 | 1.7 |
| **Body-sm** | Plus Jakarta Sans | 500 | `0.875rem` | 0 | 1.6 |
| **Eyebrow** | JetBrains Mono | 700 | `0.6875rem` (11px) | 0.18em uppercase | 1 |
| **Mono numeral** (prices, quote, timer) | JetBrains Mono | 700 | varies | 0 | 1 |

Keyword-bearing subheadings (`Pilih excavator Volvo anda`, `Kira kos sewa segera`, `Sewa excavator seluruh Malaysia`, location-name H1 on location pages) live at H3/H4 — never H5/H6.

### 3.4 Component styles

**Button — single rounded shape site-wide (only colour varies).** Border-radius `--radius-btn` = **12px**. Height 52px desktop, 56px mobile (full-width). Padding `0 28px`. Font Plus Jakarta Sans 700, 15px, tracking -0.005em. Icon-gap 10px. All buttons share this base — variants only change `background`, `color`, `box-shadow`.

```css
.btn { display: inline-flex; align-items: center; justify-content: center;
  gap: 10px; height: 52px; padding: 0 28px;
  border-radius: var(--radius-btn);
  font: 700 15px/1 var(--font-display);
  letter-spacing: -0.005em;
  transition: transform var(--dur) var(--ease-out),
              box-shadow var(--dur) var(--ease-out),
              background-color var(--dur) var(--ease-out); }
.btn:hover  { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn:focus-visible { outline: 2px solid var(--brand-orange); outline-offset: 3px; }

.btn-wa       { background: var(--wa-green); color:#fff; box-shadow: var(--shadow-wa); }
.btn-wa:hover { background: var(--wa-green-hover); }

.btn-primary       { background: var(--gradient-orange); color:#fff; box-shadow: var(--shadow-orange); }
.btn-primary:hover { background: var(--brand-orange-deep); }

.btn-ghost        { background: transparent; color: var(--brand-charcoal); border: 1.5px solid var(--line-strong); }
.btn-ghost:hover  { border-color: var(--brand-charcoal); }

.btn-ghost-light  { background: transparent; color:#fff; border: 1.5px solid var(--line-on-dark-strong); }
.btn-ghost-light:hover { border-color: rgba(255,255,255,0.6); }

@media (max-width: 640px) { .btn { width:100%; height:56px; } }
```

WhatsApp CTA is **always** `--wa-green` per CLAUDE.md.

**Product card** — both EC200 and EC400 photos will be framed as silhouettes/cutouts on white, so per the rules and the architecture decision (§4.4 of database.md) use `object-fit: contain` for **both** with internal padding. Same card shape across the grid.

```css
.product-card {
  display: flex; flex-direction: column;
  background: #fff; border: 1px solid var(--line);
  border-radius: var(--radius-card);
  overflow: hidden; height: 100%;
  transition: transform var(--dur) var(--ease-out),
              box-shadow var(--dur) var(--ease-out),
              border-color var(--dur) var(--ease-out);
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--brand-orange-ring);
}
.product-card__media {
  position: relative; aspect-ratio: 4/3;
  background: linear-gradient(180deg, #FAFAFA 0%, #F0F0F0 100%);
  padding: 22px; display:grid; place-items:center;
}
.product-card__media img { width:100%; height:100%; object-fit: contain; }
.product-card__class-tag { /* eyebrow pill in upper-left */
  position:absolute; top:14px; left:14px;
  font: 700 10px/1 var(--font-mono); letter-spacing:0.18em;
  text-transform:uppercase;
  background: var(--brand-charcoal); color:#fff;
  padding: 6px 10px; border-radius: 999px;
}
.product-card__body { padding: 22px 22px 24px; display:flex; flex-direction:column; gap:10px; flex:1; }
.product-card__title { font: 700 22px/1.15 var(--font-display); letter-spacing:-0.02em; color:var(--brand-charcoal); }
.product-card__desc {
  font: 400 15px/1.55 var(--font-display); color: var(--ink-muted);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
  overflow:hidden;
}
.product-card__price {
  font: 700 15px/1 var(--font-mono); color: var(--brand-orange);
  letter-spacing: -0.01em;
}
.product-card__cta { margin-top:auto; }
```

Card heights equalised via `display:flex; flex-direction:column` + `margin-top:auto` on the CTA.

**USP card with highlighted icon** (no section heading per rules):

```css
.usp-card {
  display:flex; flex-direction:column; align-items:center; text-align:center;
  background:#fff; border:1px solid var(--line);
  border-radius: var(--radius-card);
  padding: 28px 24px;
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.usp-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

.usp-icon {
  width:64px; height:64px; display:grid; place-items:center;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--brand-orange-pale) 0%, #FFE2CB 100%);
  box-shadow: inset 0 0 0 2px var(--brand-orange-ring);
  color: var(--brand-orange-deep);
  margin-bottom: 16px;
}
.usp-icon svg { width:30px; height:30px; }
.usp-card h4 { font:700 18px/1.25 var(--font-display); color:var(--brand-charcoal); letter-spacing:-0.015em; }
.usp-card p  { font:400 14.5px/1.6 var(--font-display); color:var(--ink-muted); margin-top:6px; max-width:32ch; }
```

**Review card — Google treatment:**

```css
.review-card {
  position:relative;
  background:#fff; border:1px solid var(--line);
  border-radius: var(--radius-card);
  padding: 24px 22px 22px; display:flex; flex-direction:column; gap:12px;
  box-shadow: var(--shadow-sm);
}
.review-card__g {
  position:absolute; top:18px; right:18px; width:22px; height:22px;
  /* full-colour Google G — 4-arc SVG inline */
}
.review-card__source {
  font:700 10px/1 var(--font-mono); letter-spacing:0.18em; text-transform:uppercase;
  color: var(--ink-muted);
}
.review-card__stars { display:inline-flex; gap:2px; color: var(--google-yellow); }
.review-card__stars svg { width:16px; height:16px; }
.review-card__body { font:400 15px/1.65 var(--font-display); color:var(--ink); }
.review-card__author { font:700 14px/1.2 var(--font-display); color:var(--brand-charcoal); }
.review-card__suburb { font:500 12.5px/1.2 var(--font-display); color: var(--ink-muted); }
```

Aggregate badge above the H3 reads `4.9 / 5 daripada 187 ulasan Google` with the Google G placed inline before the rating.

**Eyebrow pill (two variants):**

```css
.eyebrow {
  display:inline-flex; align-items:center; gap:8px;
  font: 700 11px/1 var(--font-mono);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--brand-orange-deep);
  background: var(--brand-orange-pale);
  padding: 7px 12px; border-radius: 999px;
  border: 1px solid var(--brand-orange-ring);
}
.eyebrow::before {
  content:''; width:6px; height:6px; border-radius:50%;
  background: var(--brand-orange);
  box-shadow: 0 0 0 3px rgba(242,108,31,0.20);
}
.eyebrow-light {
  color: #FFD3B0;
  background: rgba(242,108,31,0.10);
  border-color: rgba(242,108,31,0.35);
}
```

Every section heading (H3/H4) gets a sibling `<Eyebrow>` immediately above — site-wide, **including** mid/final CTA, FAQ, Locations, Nearby, and any block without a `.section-head` wrapper.

**Section spacing.** Vertical padding `--section-y` = `clamp(64px, 9vw, 112px)`. Mobile minimum `py-16` (64px) between sections. Container `max-width: var(--max-w)` (1240px), gutter `--gut`.

### 3.5 Hero / section backgrounds (mix per rules — not all flat)

| Section | Background |
|---|---|
| FOMO banner | Solid `--alert-red` |
| Top nav | Transparent over hero; solid `#fff` with bottom-border on scroll |
| **Hero** | `--brand-charcoal` + `--blueprint-grid` overlay + `--gradient-hero-glow` (lower-right orange radial) |
| Brand strip | `--brand-paper` (#FAFAFA), 56px logo height, grayscale by default |
| USP bar | White, no section heading |
| Products | White |
| **Calculator (special)** | `--brand-charcoal` + `--blueprint-grid` + faint orange-glow blob top-left |
| Process | White; each step on its own card with light-grey number medallion |
| Why us | `--brand-paper` |
| Reviews | White |
| Gallery | White |
| FAQ | White |
| Locations | `--brand-paper` |
| **Final CTA** | Image-bg (Pexels query: `volvo excavator construction site malaysia dusk`) with `linear-gradient(rgba(15,15,15,0.78), rgba(15,15,15,0.92))` overlay |
| Footer | `--brand-charcoal` |

Pexels/Unsplash placeholder queries until the user drops final assets:
- Hero ambient/lower-right glow: no image needed (CSS-only).
- Gallery image queries: `excavator volvo construction site malaysia`, `crawler excavator working site asia`, `construction site earthworks aerial`, `excavator operator helmet`, `lowbed truck excavator transport`.
- Final CTA bg: `volvo excavator twilight construction site` (filter dusk).

### 3.6 Rental Calculator special section (visual spec)

A single charcoal panel sitting between Products and Process. The "control panel" moment of the site.

- **Container:** `max-width: 980px`, centered. Border-radius `--radius-card` (18px). Background `--brand-charcoal` with `--blueprint-grid` overlay at 0.06 opacity. 1px border `var(--line-on-dark)`. Box-shadow `--shadow-xl`.
- **Padding:** `48px 40px` desktop, `28px 20px` mobile.
- **Eyebrow + H3** centred at top in `.eyebrow-light` variant.
- **Form layout:** 3-column grid on desktop (`1fr 1fr 1fr`), single-column stack on mobile. Each cell has an uppercase mono label `MODEL / TEMPOH / HARI` and a control beneath.
- **Model + period controls:** segmented control — two/three orange-bordered chips in a row. Active state: orange-filled (`--brand-orange`), white text, `box-shadow: var(--shadow-orange)`. Inactive: transparent bg, `--line-on-dark-strong` border, `rgba(255,255,255,0.78)` text.
- **Days input:** stepper with `–` and `+` buttons either side of a JetBrains Mono number field. 14px-radius input, dark steel bg (`--brand-steel`), orange-pulse focus ring.
- **Quote output (the moment):** centred below the form, a **giant JetBrains Mono numeral** — `clamp(2.5rem, 7vw, 5rem)`, weight 700, white. The `RM` prefix sits beside it at half the size, weight 500, `rgba(255,255,255,0.6)`. Animated digit roll on change (translateY tween + opacity, 320ms `--ease-emphasis`).
- **Sub-line:** `Termasuk operator. Tidak termasuk pengangkutan.` — body-sm `rgba(255,255,255,0.6)`.
- **CTA at bottom:** full-width green WA button (`btn btn-wa`) prefilled with model + period + days + computed quote.
- **Decorative:** an animated 1px orange divider above the CTA that shimmers left-to-right every 4s (the "live wire" feel).
- **Hover on the entire panel:** the orange-glow blob (top-left) gently scales up 1.05× and fades in 8% — gives the panel a "powered up" reaction without being noisy.

### 3.7 Mobile breakpoints + centre-alignment audit

Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`. Design for **390px first**.

- All grids (products, USPs, reviews, why-us, process, gallery, locations, FAQ, nearby) → **single column on mobile**.
- Headings, eyebrows, CTAs, USP cards, calculator → **centre-aligned on mobile**. Body copy may be left-aligned inside cards but heading/CTA stays centred.
- Hero on mobile: text block first (centred), excavator silhouette below at 60% width, centred.
- All WA CTAs: `width: 100%` below `sm`, height 56px, font 16px.
- Card grids stack single-column. Review row + gallery use CSS snap-scroll with hidden scrollbar (`scrollbar-width: none; ::-webkit-scrollbar { display:none; }`). Brand strip uses CSS marquee (40s linear infinite).
- Min font sizes: hero H1 ≥ 36px on mobile, section H3 ≥ 24px, body ≥ 15px, eyebrow ≥ 11px, label ≥ 12px.
- Min tap target 44 × 44px (accordion headers, nav links, FAQ rows, segmented chips, language switcher).
- Section padding mobile ≥ 64px between sections.

### 3.8 Favicon (`app/icon.svg`)

Derive the favicon from the **orange Volvo excavator silhouette** isolated from `excavator-dark-logo.png`:

1. Open the dark-logo PNG in any image editor; mask out everything except the excavator body + boom + tracks (drop the orange arc and the wordmark).
2. Recolour to a single flat fill of `#F26C1F` (drop the multi-shade orange — at 16×16 only one tone reads).
3. Export at 512 × 512 PNG, trace to SVG (Vector Magic / Illustrator Image Trace) at coarse threshold to keep silhouette readable at 16×16.
4. Place on a transparent square canvas with ~10% padding so the cab + boom doesn't touch the edge.
5. Save as `app/icon.svg`. The same SVG drives apple-touch-icon at 180×180 with the icon centred on a `--brand-charcoal` rounded-square background (Apple/Android home-screen guideline).

The same orange-silhouette icon must appear inside the wordmark logo (it already does — that's the source). No mismatch between logo icon and favicon.

## 4. Unique Visual Elements (≥3 — what makes Abang Excavator unmistakable)

1. **Blueprint-grid texture on every dark section.** A 56px CSS-painted grid (white at 5% opacity) on charcoal in the hero, calculator, and final CTA. None of the siblings use this — skylift uses off-white solid, sewa-motor uses navy gradient, lorry-sticker uses paper texture. Reads as "construction-engineering blueprint."

2. **Orange tread-mark section divider.** Between major sections (Hero ↦ Brand strip, Calculator ↦ Process, Reviews ↦ Gallery, FAQ ↦ Locations) a 24px-tall horizontal strip of repeating tread-print pattern in `--brand-orange` (low opacity 0.12 on white, 0.22 on dark) — bespoke SVG of an excavator track segment. Doubles as a brand stamp throughout the scroll.

3. **Animated digit-roll quote in the calculator.** The RM total tweens on every input change (translateY + opacity, JetBrains Mono numerals). Combined with the "live wire" orange shimmer above the CTA, the calculator panel feels like an instrument display — the *kinetic moment* of the page.

4. **Hero "live ops" ticker.** The bottom-left of the hero rotates through `SITE-READY · KL ▸ KOTA KINABALU`, `SITE-READY · JB ▸ KUCHING`, `SITE-READY · PENANG ▸ IPOH` every 4s — pure CSS keyframe — gives a fleet-management feel without backend wiring.

5. **Hero instrument bar.** Three inline stats (`2 Model Volvo / 14 Negeri / 24 Jam Hantar`) split by 1px orange dividers, numerals in JetBrains Mono — reads as a Volvo dashboard rather than a generic counter row.

## 5. Design Review Checklist

- [x] Hero layout differs from all existing sibling sites (blueprint-grid charcoal + floating excavator cutout + live-ops ticker)
- [x] Colour palette differs — orange `#F26C1F` is darker, more "construction-Volvo" than sewa-motor's coral `#FF6B35`, and the charcoal-dominant surface separates it from sewa-motor's navy + light-surface
- [x] Typography pairing unique — Plus Jakarta Sans + JetBrains Mono (skylift uses Inter only; lorry-sticker uses Archivo Black; sewa-motor uses Inter only)
- [x] Card/component styles distinct — 18px radius product cards with bottom-flushed CTA, charcoal class-tag pill upper-left, contain-fit photo on gradient grey
- [x] Section ordering follows architecture.md (14 sections, special section between Products and Process)
- [x] Design fits trade/contractor audience — confident, instrument-panel, not consumer-coral
- [x] Brand assets incorporated — orange Volvo silhouette as hero element + favicon; light-bg + dark-bg logos used in nav + footer respectively
- [x] Mobile-first considered (390px first; full-width CTAs; single-column stacks; centre alignment for headings/CTAs/icons)
- [x] Image backgrounds present on Final CTA + light-image overlays on hero/calculator (gradient + grid texture, no flat-only)
- [x] 3-point USP bar present below hero, no section heading, highlighted icon pills
- [x] All buttons share one rounded shape — `--radius-btn: 12px` — colours only vary
- [x] No phone numbers or domain text anywhere on the site
- [x] Heading hierarchy — one H1 + one H2 in hero, H3/H4 in sections, eyebrow above every H3/H4
- [x] All images verified contextually — EC200 cutout + EC400 cutout on product cards, lifestyle EC400 reserved for Final CTA bg only; gallery photos selected from architecture-listed Pexels queries
- [x] Brand / collaborator logo strip below hero with 6 placeholder labels (per Nana's copy)
- [x] FOMO banner red (`--alert-red`) with live countdown in JetBrains Mono
- [x] WhatsApp CTAs use `--wa-green` only — no brand-tinted WA buttons
- [x] Customer reviews use Google G + "Posted on Google" + yellow stars (4.9 / 5 aggregate badge)
- [x] Special section = inline rental calculator on charcoal panel, between Products and Process
- [x] Section tagging (eyebrow) above every section heading — sitewide
- [x] Product card photos: `object-fit: contain` chosen for both EC200 + EC400 (silhouette family); 18px padding; max-2-line description with `-webkit-line-clamp: 2`; equal card heights via flex + `margin-top:auto` on CTA

## 6. Layout Parity Verification (Homepage ↔ Location pages)

Both pages share the **identical 15-block order** from architecture.md §2. The location page adds two extra blocks:

| # | Homepage | Location page |
|---|---|---|
| 1 | FOMO banner | FOMO banner |
| 2 | Top nav | Top nav |
| — | (n/a) | **Breadcrumb** (Home → Locations → {location}) |
| 3 | Hero (H1+H2, location-agnostic) | Hero (H1 `Sewa Excavator di {location}` + H2 `Volvo EC200 dan EC400 untuk projek anda di {state}`) |
| 4 | Brand strip | Brand strip |
| 5 | USP bar | USP bar |
| 6 | Products | Products |
| 7 | Rental Calculator (special) | Rental Calculator (special) |
| 8 | Process | Process |
| 9 | Why us | Why us |
| 10 | Reviews (Google) | Reviews (Google) — include ≥1 review near the location for trust |
| 11 | Gallery | Gallery |
| 12 | FAQ | FAQ (location-specific Q1 added) |
| 13 | Locations | Locations |
| — | (n/a) | **Nearby Locations** (6 sibling cities via `getNearbyLocations(slug)`; Labuan returns 3) |
| 14 | Final CTA | Final CTA |
| 15 | Footer | Footer |

The only legitimate structural differences are the two insertions (Breadcrumb after nav, Nearby after Locations) and copywriting. Padding, backgrounds, eyebrow placement, button shape, card heights, mobile stack order, footer columns — all identical. No section may be omitted on the location page.

### 6.1 Implementation snippets the build agents need

**Blueprint-grid background (utility on dark sections):**

```css
.bg-blueprint {
  background-color: var(--brand-charcoal);
  background-image: var(--blueprint-grid);
  background-attachment: local;
}
.bg-blueprint--glow {
  background-color: var(--brand-charcoal);
  background-image:
    var(--gradient-hero-glow),
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: auto, 56px 56px, 56px 56px;
}
```

**Tread-mark divider component:**

```html
<div class="tread-divider" aria-hidden="true"></div>
```

```css
.tread-divider {
  height: 24px; width: 100%;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='24' viewBox='0 0 64 24'><rect x='2' y='6' width='12' height='12' rx='2' fill='%23F26C1F' opacity='0.22'/><rect x='18' y='6' width='12' height='12' rx='2' fill='%23F26C1F' opacity='0.22'/><rect x='34' y='6' width='12' height='12' rx='2' fill='%23F26C1F' opacity='0.22'/><rect x='50' y='6' width='12' height='12' rx='2' fill='%23F26C1F' opacity='0.22'/></svg>");
  background-repeat: repeat-x; background-size: 64px 24px;
}
.tread-divider--on-dark { opacity: 0.42; }
```

**Live-ops ticker (hero):**

```css
@keyframes ops-rotate {
  0%, 28% { transform: translateY(0); opacity: 1; }
  33%, 61% { transform: translateY(-100%); opacity: 1; }
  66%, 94% { transform: translateY(-200%); opacity: 1; }
}
.ops-ticker { height: 16px; overflow: hidden; font: 700 11px/16px var(--font-mono);
              letter-spacing: 0.18em; color: rgba(255,255,255,0.55); text-transform: uppercase; }
.ops-ticker__inner { animation: ops-rotate 12s steps(3, end) infinite; }
.ops-ticker__row { height: 16px; }
```

Kimmy should implement these utilities directly in `app/globals.css` alongside the tokens in §3.2.

End of design direction.
