# Wall Panel Malaysia — Design Direction

**Author:** Kagura (UI Design Specialist)
**Project:** wall-panel-malaysia
**Domain:** wall-panel-malaysia.vercel.app
**Date:** 2026-05-11
**Reference brand asset:** `brand_assets/pasted-image-1778467904911.png` — two stacked product cards on warm white, dark navy pill CTA, green "Free Installation" rosette badge, minimalist beige-sofa interior photography against wood + marble panel backdrops.

> **Mood:** Premium-but-approachable interior finishing brand. Editorial, warm, calm. Not loud, not generic, not corporate-blue. Think a Malaysian interior-finishing studio that publishes its own magazine — confidence without shouting.

---

## 1. Differentiation Analysis — what each existing Utopia site already owns

| Site | Dominant palette | Mood / motif |
|---|---|---|
| `electric-wheelchair-malaysia` | Navy `#1B2D5B` + Orange `#F47B20` | Medical trust + alert orange |
| `skylift-malaysia` | Charcoal `#1C1F2A` + Yellow `#F5B400` | Heavy machinery, industrial yellow |
| `tablechair-rental-malaysia` | Cream `#FFFEF8` + Gold `#FDD835` | Event-rental, sunny, party gold |
| `service-aircond-malaysia` | Navy `#1B3A5C` + Yellow `#FFE500` + light blue | Aircon technician, cool blue |
| `roller-shutter-malaysia` | Gunmetal `#2C3338` + Yellow `#F2C744` + Crimson | Steel, industrial, security |
| `coldroom-malaysia` | Frost-deep `#0B3D5C` + Frost-cool `#4FB1D6` + Amber | Refrigeration, icy-blue dominance |
| `oxihome-malaysia` | Teal `#0B6B82` + Coral accent `#E8692A` | Medical oxygen, clinical teal |
| `cat-rumah-malaysia` | Jade `#17A890` + Coral `#EC6A4A` + Cream | Paint, friendly jade/coral pairing |
| `sewa-motor-malaysia` | Orange `#FF6B35` + Navy `#16213E` | Motorbike rental, hot orange |
| `lorry-sticker` | Charcoal `#1C1F2A` + Yellow `#F5B400` | Industrial signage, same family as skylift |
| `cpapmachine` / `hospital-bed-malaysia` | (palette stripped/legacy) | Medical |

**Existing slots taken:** navy+orange, charcoal+yellow, cream+gold (party), navy+yellow, gunmetal+yellow+crimson, frost-blue+amber, teal+coral, jade+coral+cream, orange+navy.

**Open slot — confirmed unique for wall-panel-malaysia:**
- **Dark Editorial Navy** (`#13204C` — deeper, more violet-leaning than electric-wheelchair's `#1B2D5B` and service-aircond's `#1B3A5C` — neither uses warm cream/sand as the dominant body background)
- paired with **warm sand/cream** (`#F5EFE6`) — distinct from tablechair's pale yellow cream, cat-rumah's jade-wash cream, coldroom's cold-paper-warm
- accented with a **muted antique gold** (`#C8A45C`) — softer than skylift/aircond/roller-shutter primary yellows; reads as "interior trim" not "industrial caution"
- support neutral **warm bone** (`#E9DFD0`) for card surfaces

No other site in the system uses **deep navy as primary on a warm sand background with muted gold accent**. Confirmed unique.

---

## 2. Brand Colour Palette

### CSS custom property block (drop into `app/globals.css`)

```css
:root {
  /* --- Primary: dark editorial navy --- */
  --brand-navy:           #13204C;   /* primary buttons, headings, footer */
  --brand-navy-deep:      #0B153A;   /* hover, deepest text, FOMO black */
  --brand-navy-mid:       #1F2F66;   /* gradient mid stop */
  --brand-navy-soft:      #2A3D80;   /* hovered links on light bg */

  /* --- Warm neutral background system --- */
  --brand-sand:           #F5EFE6;   /* page background — the canvas */
  --brand-sand-warm:      #ECE3D2;   /* alt section band */
  --brand-bone:           #E9DFD0;   /* card surface on dark bands */
  --brand-cream-pure:     #FBF7EF;   /* elevated card on dark sections */
  --brand-paper:          #FFFFFF;   /* product card surface */

  /* --- Muted gold accent (NOT industrial yellow) --- */
  --brand-gold:           #C8A45C;   /* eyebrow pill, small icons, hairlines */
  --brand-gold-deep:      #A8853F;   /* hover, focus ring */
  --brand-gold-pale:      #F3E9D2;   /* subtle wash for the eyebrow pill bg */

  /* --- Ink scale (text) --- */
  --brand-ink:            #0E172E;   /* body text on light bg */
  --brand-ink-muted:      #5A6480;   /* secondary text, captions */
  --brand-ink-light:      #8A93A8;   /* tertiary, disabled */
  --brand-line:           #DCD3C3;   /* hairline borders on sand bg */

  /* --- Reserved system colours --- */
  --wa-green:             #25D366;   /* WhatsApp CTAs ONLY */
  --wa-green-dark:        #1EBE57;
  --fomo-red:             #B71F2B;   /* FOMO banner option A */
  --fomo-black:           #0B0E18;   /* FOMO banner option B */
  --google-gold:          #FBBC04;   /* Google review star — reserved */
  --success:              #2F8F4E;   /* "Free Installation" badge green-tint option */

  /* --- Gradients (layered, never flat shadows) --- */
  --gradient-navy:        linear-gradient(135deg, #13204C 0%, #1F2F66 100%);
  --gradient-navy-deep:   linear-gradient(160deg, #0B153A 0%, #13204C 65%, #1F2F66 100%);
  --gradient-sand:        linear-gradient(180deg, #F5EFE6 0%, #ECE3D2 100%);
  --gradient-gold-hair:   linear-gradient(90deg, transparent 0%, #C8A45C 50%, transparent 100%);
  --gradient-hero-overlay:linear-gradient(180deg, rgba(11,21,58,.15) 0%, rgba(11,21,58,.65) 100%);
  --gradient-final-cta:   linear-gradient(135deg, rgba(11,21,58,.82) 0%, rgba(19,32,76,.72) 100%);
}
```

### Usage rules
- **Page background:** `--brand-sand` (warm cream — never plain white) on the homepage and location pages. White is reserved for product card surfaces only.
- **Dark sections:** USP band, Why-Choose-Us, Final CTA, Footer — all use `--brand-navy` or `--gradient-navy-deep`.
- **Cream cards on dark navy sections:** `--brand-cream-pure` (`#FBF7EF`) so the cream pops against navy.
- **Gold is decorative only** — eyebrow pills, hairlines, icon strokes, divider lines, the "From RM25/sqft" price chip. Never a CTA fill. Never used at button size as a primary action.
- **WhatsApp green is reserved** — used only on WhatsApp buttons. Free-installation badges use the muted gold + cream styling, NOT WhatsApp green, to avoid devaluing the WA affordance. (Reference image shows green-on-gold "Free Installation" rosette — we keep that rosette badge using `--brand-gold` + `--brand-cream-pure` so the WhatsApp green stays exclusive.)
- **Absolutely no Tailwind default blue / indigo / sky.** The navy is custom and intentionally violet-leaning at `#13204C`.

### Contrast verification
- `--brand-navy` (`#13204C`) on `--brand-sand` (`#F5EFE6`) → ~15:1 (AAA large + body)
- `--brand-navy` on `--brand-paper` (white) → ~16:1 (AAA)
- `--brand-cream-pure` on `--brand-navy` → ~14:1 (AAA)
- `--brand-gold` on `--brand-navy` → ~5.2:1 (AA — large + bold body OK)
- `--brand-ink` (`#0E172E`) on `--brand-sand` → ~16:1 (AAA)

---

## 3. Typography

### Pairing — editorial-interior

| Role | Font | Source | Why |
|---|---|---|---|
| **Display headings** (H1, H2, big H3) | **Fraunces** (serif, variable) | Google Fonts | Modern serif with optical sizing — feels editorial, premium, "interior magazine" without being stuffy. Distinct from every existing Utopia site (all sans). Soft contrast strokes pair perfectly with warm sand background. |
| **Section sub-headings** (H3, H4) | **Fraunces** at 600 weight, tighter tracking | — | Same family for headline cohesion. Use weight + tracking to differentiate from H1/H2. |
| **Body / UI** | **Inter** (variable) | Google Fonts | Already specified in architecture.md as the global font — clean modern sans, neutral, anchors the editorial serif. |
| **Eyebrow / mono labels** | **JetBrains Mono** (or **IBM Plex Mono**) at 600, letter-spacing 0.18em | Google Fonts | Mono ALL-CAPS labels give the editorial-tech feel that distinguishes this site from every other Utopia site (which use regular sans for eyebrows). |
| **Price digits** | Inter Tabular numerals (`font-feature-settings: 'tnum'`) at 700 | — | Aligned columns in the promo pricing table. |

> **Note on Inter being already in `architecture.md`:** Architecture specified Inter as the global font *for body*. Kagura's recommendation is to also load Fraunces as the display font. This is **additive, not contradictory** — Inter remains the body. Kimmy must add a second `next/font/google` import for Fraunces and JetBrains Mono in `app/layout.tsx`.

### Type scale (mobile-first — px shown for mobile; scale up at md/lg)

| Token | Mobile | Desktop | Family | Weight | Tracking | Line-height |
|---|---|---|---|---|---|---|
| `display-xl` (H1 hero) | 36px | 64px | Fraunces | 500 (italic optional on subwords) | -0.025em (tight) | 1.05 |
| `display-lg` (H2 hero sub) | 20px | 28px | Fraunces | 400 (regular, lighter than H1) | -0.01em | 1.35 |
| `display-md` (section H3) | 26px | 40px | Fraunces | 600 | -0.02em | 1.15 |
| `display-sm` (sub H3 / card H4) | 20px | 26px | Fraunces | 600 | -0.015em | 1.25 |
| `body-lg` (lead paragraph) | 17px | 19px | Inter | 400 | 0 | 1.7 |
| `body` (default) | 16px | 16px | Inter | 400 | 0 | 1.7 |
| `body-sm` (captions) | 14px | 14px | Inter | 500 | 0.005em | 1.55 |
| `eyebrow` | 11px | 12px | JetBrains Mono | 600 | 0.18em ALL-CAPS | 1 |
| `price-hero` | 22px | 28px | Inter Tabular | 700 | -0.01em | 1.1 |

### Tracking rules (per anti-generic guardrails)
- All headings 24px+ use **negative tracking** (-0.015em to -0.025em).
- All body text uses **0 or slightly positive tracking** at small sizes.
- All eyebrows use **+0.18em** (wide-tracked ALL CAPS).
- Body line-height is **1.7** on mobile (per CLAUDE mobile checklist) — never less.

### Italic accent
- Fraunces supports a beautiful italic — use it sparingly to italicise **the most evocative word** in some H3s (e.g. `Choose Your Wall Panel *Family*`, `Premium *Finishes* For Modern Homes`). Italic = editorial signature, used once per section max.

---

## 4. Section Motifs — full visual treatment, top to bottom

### 4.1 FOMO Banner (sticky, top of every page)
- Background: `--fomo-red` (`#B71F2B`) — solid, NO gradient (urgency reads strongest flat).
- Height: 44px desktop, 56px mobile (taller to fit countdown + CTA stacked at 390px).
- Text colour: pure white.
- Countdown: monospaced (JetBrains Mono 600, tabular nums) so the digits don't jitter as they tick. Format `HH:MM:SS` with the colons in `--brand-gold` (subtle pop).
- Inline CTA: `Claim on WhatsApp` — white text, transparent button with white border (1px), rounded `999px`, hover fills white with red text.
- Sticky on first viewport, scrolls away after 60vh (Kimmy wires up the dismiss/return logic).

### 4.2 Inline Header
- Default state (over hero): **transparent** background, white logo wordmark, white nav links, white WhatsApp CTA with green fill.
- Scrolled state (after ~80px scroll): solid `--brand-sand` with `1px solid var(--brand-line)` bottom hairline, navy logo, navy nav links, green WhatsApp button. Transition opacity 200ms only (never `transition-all`).
- Logo: wordmark "Wall Panel Malaysia" set in Fraunces 600 with the icon mark (see section 8) to the left.
- Nav links: Inter 500, 14px, navy, gold-hairline underline (1px) animates in on hover from left.
- Language switcher: small pill `EN / BM / 中文` separated by hairline dividers, gold underline on active locale.
- Header WhatsApp CTA: same pill shape as site-wide button system, `--wa-green` fill.

### 4.3 Hero
- **Full-bleed photographic background** — a warm modern Malaysian interior with a real wall-panel feature wall (wood or fluted). Wide-angle, indirect sunlight. Beige/cream sofa or armchair anchoring the foreground (matching the brand asset).
- Overlay: `--gradient-hero-overlay` (transparent navy 15% top → navy 65% bottom) so the H1 is legible at the bottom-left.
- Layout: **Asymmetric** — H1 + H2 + body + CTA all sit in a 50%-wide column anchored bottom-left on desktop (`max-w-2xl`). On mobile, the column centers horizontally and shifts to the upper-middle.
- H1: Fraunces 500, 64px desktop, white. Tight tracking. The word "Premium" gets a Fraunces italic accent.
- H2: Fraunces 400, 28px desktop, `--brand-bone` (slightly warmer than pure white).
- Price teaser pill: floats inline above H1 — `--brand-gold-pale` background, navy text, gold-deep border (1px), pill shape. Text `From RM25/sqft · Free Installation`.
- Primary CTA: WhatsApp green pill, large (56px tall).
- Secondary link: `See all 5 styles` — white text, gold underline.
- Trust line under CTA: small body-sm white, `--brand-gold` icon bullets between each phrase.
- Subtle texture: a faint paper-grain SVG overlay at 6% opacity over the hero photo to add depth (an editorial print signature).

### 4.4 USP Bar — MANDATORY 3-card strip below hero
- Section band: **dark navy** (`--gradient-navy-deep`) — pulls the user's eye down off the hero into a "founders' promise" band.
- Section eyebrow `WHY WALL PANEL MALAYSIA` above section H3 — gold mono pill on the dark navy.
- 3 cards horizontal on desktop (`grid-cols-3 gap-6`), stack to single column on mobile.
- Card surface: `--brand-cream-pure` with subtle inner `1px solid var(--brand-gold-pale)` hairline.
- Card top: small gold icon (32px) in a circle (`--brand-gold-pale` fill, gold stroke).
- Each card: eyebrow → H3 → body. H3 in Fraunces 600 navy. Body in Inter ink.
- Padding: `p-7` mobile, `p-9` desktop. Generous internal whitespace.
- No drop shadow; depth comes from the cream pop against navy band + the hairline.

### 4.5 Product Grid
- Section band: back on `--brand-sand`.
- Section header layout: **editorial two-column** — eyebrow + H3 + intro paragraph on the left (40%); product count + "Free Installation Included" stamp + "From RM25/sqft" chip on the right (60%). On mobile stacks vertically, all center-aligned.
- Card design:
  - Surface: pure white (`--brand-paper`) with `1px solid var(--brand-line)` and a layered shadow (see section 6).
  - Border radius: 22px (matches button family — see section 5).
  - Image area: 4:3 ratio. Image uses `object-fit: cover` (not contain) because wall-panel product photos in this project are **interior scenes** showing the panel installed (e.g. beige sofa against wood-panel backdrop, per the brand asset). The product IS the room — contain would shrink the visual context. Add 14px internal padding around the card to keep the photo away from edges; the image itself fills the 4:3 frame.
  - "Free Installation" badge: top-right rosette, `--brand-gold` ring, `--brand-cream-pure` fill, navy text. ~64px diameter rosette with mini scallop edge (CSS `clip-path` or SVG mask).
  - Variant chips above the photo (Wood / Fluted / PVC / Acoustic for Standard family): small pill chips, `--brand-sand-warm` fill on inactive, `--brand-navy` fill with white text on active. Same shape as buttons.
  - Below image: H4 product name (Fraunces 600 navy) + 1-line description (Inter ink-muted) + price line + primary CTA (WhatsApp green pill, full-width on mobile).
  - Price line: market price strikethrough in ink-muted, then bold navy "From RM25/sqft" — same line, separated by a gold hairline dot.
- Grid: 3 cols desktop, 2 cols tablet, 1 col mobile. Auto-fill so 6/7 products still look balanced.

### 4.6 Promo Pricing Anchor
- Section band: `--brand-sand-warm` (slightly warmer than the page) — visual rest stop.
- Pricing comparison table styled as **editorial column** — three vertical columns: Market | Our Standard | Promo. Each column a vertical card.
- Market column: dim gold pill header ("Market"), price with strikethrough, ink-muted text.
- Our Standard column: light navy outline card, navy text.
- Promo column: **solid navy fill, cream-pure text**, with `--brand-gold` accent border at the top, large promo price in Fraunces. This is the visual destination of the eye journey.
- CTA below the columns spans the row width on mobile.

### 4.7 Style Gallery (Wood / Fluted / PVC / Acoustic / Marble Gold / Silver / Black)
- Section band: `--brand-sand`.
- Layout: **masonry / staggered grid** — not a uniform rectangle grid. 7 panels of varying heights so the eye dances. (Distinct from any uniform card grid on existing sites.)
- Each panel: full-bleed material photo + bottom-left gold eyebrow + H3 style name (Fraunces 600 white) on a small dark gradient overlay strip.
- Hover (desktop): the photo zooms 1.04x over 400ms, the eyebrow pill brightens. Mobile: tap to expand a one-line description.

### 4.8 Process / How It Works (4 steps)
- Section band: `--brand-cream-pure` (slightly lighter than page sand — a "process clarity" feel).
- Layout: **vertical connected timeline** on mobile, horizontal 4-step on desktop.
- Numbered circles: 56px, `--brand-navy` fill, cream-pure number in Fraunces 700, `--brand-gold` 2px outer ring.
- Connecting line: 1px `--brand-gold` dashed hairline between circles.
- Each step: eyebrow → H4 → body. Step cards are NOT enclosed — they sit on the cream band directly, only the numbered circle has structure. Editorial, like a process diagram in a design magazine.

### 4.9 Why Choose Us (4 cards)
- Section band: **dark navy** (`--brand-navy-deep`). Big mood shift — establishes the brand voice.
- Layout: 2x2 grid desktop, 1 col mobile.
- Cards: cream-pure surface (matches USP cards), gold-pale hairline.
- Icon style: line-art SVG icons in `--brand-gold`, 40px, sitting in a `--brand-sand` circular wash.
- Headlines in navy Fraunces 600, body in ink Inter.

### 4.10 Customer Reviews
- Section band: **full-bleed photographic background** — a Malaysian living room with a finished wall panel installation (different photo from the hero). Dark navy overlay 65%.
- Section eyebrow + H3 + 4.9★ badge centered, white text.
- Review cards: `--brand-cream-pure` surface, 22px radius (matches site), Fraunces italic opening quote-mark in `--brand-gold` (decorative, 80px size), navy review text in Inter 500.
- Each card has the reviewer eyebrow (5★ · LIVING ROOM) + H4 reviewer name (Fraunces 600 navy) + review body.
- Layout: 3 across desktop, snap-scroll carousel on mobile with hidden scrollbar (per CLAUDE mobile rule).

### 4.11 FAQ
- Section band: **alternating** — odd rows on `--brand-sand`, even rows on `--brand-paper` (white). Creates a horizontal ledger feel.
- Each FAQ is a separate horizontal row (not a card) with:
  - Gold-thin left border (3px) when expanded.
  - Eyebrow pill on the left of the question row.
  - Question (H4 Fraunces 600 navy) center.
  - Plus/minus toggle (gold icon in cream circle) on the right.
- On expand: row reveals the answer in Inter 400 ink, with a gold hairline above the answer.
- Smooth height transition using `transform: scaleY` + `opacity` (never `transition-all`).

### 4.12 Customer Gallery / Completed Installs
- Section band: `--brand-sand-warm`.
- Masonry of completed installation photos (3 cols desktop, 2 mobile — divisible counts only, per "no blank slots" rule).
- Hover overlay: gradient bottom-up gold-tint + caption (room type + location).
- Image treatment: very subtle warm filter (saturation +5%, warmth +3%) for editorial cohesion across all photos.

### 4.13 Final CTA
- Section band: **full-bleed photographic background** — wide interior shot showing a finished room with a wall panel as the hero element (could be living room or boardroom).
- Overlay: `--gradient-final-cta` (navy at 82% top → navy at 72% bottom).
- Content centered, single column, max-w-3xl.
- Section eyebrow (gold pill on dark bg) → H3 in Fraunces 500 cream-pure → body in Inter cream-pure-90 → 3 trust tags as small gold-bordered pills horizontally → WhatsApp green CTA, large.
- Subtle texture: paper-grain SVG overlay at 5% opacity.

### 4.14 Location Cloud (homepage)
- Section band: `--brand-sand`.
- Grouped by state — each state gets a small H4 (Fraunces 600 navy with gold underline) + a flex-wrap pill list of cities.
- City pills: small, low-key. `--brand-paper` surface, navy text, gold-pale hairline. Hover navy fill + cream text.

### 4.15 Inline Footer
- Background: `--brand-navy-deep` (`#0B153A`).
- 4-column grid desktop, single column mobile.
- Brand line + tagline in cream-pure Fraunces 500.
- H4 headings cream-pure Fraunces 600 with gold pill eyebrows.
- Links cream-pure-80 Inter 400 with gold hairline underline on hover.
- Bottom legal line on a faint gold hairline divider.

### 4.16 FloatingWhatsApp FAB
- Bottom-right (16px mobile, 24px desktop).
- 60px circle, `--wa-green` fill, white WhatsApp icon.
- Soft `0 10px 30px rgba(11,21,58,.25)` navy-tinted shadow (per anti-generic rule — no flat gray shadows).
- Gentle pulse animation: `transform: scale(1) → scale(1.04)` every 2.5s. Only `transform` and `opacity` animated.

---

## 5. Button System

### One shape across the entire site
**`border-radius: 999px` (full pill)** on every button — primary, secondary, WhatsApp, outline. Same shape, only colour varies.

> Rationale: the brand asset shows a deeply rounded pill CTA. The pill reads as soft, premium, and approachable — which is the brand position. Pill > rect for an interior-finishing brand.

### Variants

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.005em;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease,
              color 180ms ease, box-shadow 220ms ease,
              border-color 180ms ease;
  /* IMPORTANT: never transition-all */
}

/* Primary — navy (used for "Lock In Promo Price", "See all 5 styles", "Get Quote" non-WhatsApp variants) */
.btn-primary {
  background: var(--brand-navy);
  color: var(--brand-cream-pure);
  box-shadow: 0 6px 18px rgba(11,21,58,.18),
              0 1px 0 rgba(255,255,255,.04) inset;
}
.btn-primary:hover { background: var(--brand-navy-deep); transform: translateY(-1px); }
.btn-primary:focus-visible { outline: 3px solid var(--brand-gold); outline-offset: 3px; }
.btn-primary:active { transform: translateY(0); }

/* WhatsApp — green ONLY for WhatsApp CTAs (the dominant CTA on this site) */
.btn-whatsapp {
  background: var(--wa-green);
  color: #FFFFFF;
  box-shadow: 0 8px 22px rgba(37,211,102,.28),
              0 1px 0 rgba(255,255,255,.10) inset;
}
.btn-whatsapp:hover { background: var(--wa-green-dark); transform: translateY(-1px); }
.btn-whatsapp:focus-visible { outline: 3px solid #fff; outline-offset: 3px; box-shadow: 0 0 0 6px var(--wa-green-dark); }
.btn-whatsapp:active { transform: translateY(0); }

/* Secondary outline — used on hero secondary link, header (over hero), variant chips */
.btn-outline {
  background: transparent;
  color: var(--brand-navy);
  border-color: var(--brand-navy);
}
.btn-outline:hover { background: var(--brand-navy); color: var(--brand-cream-pure); }
.btn-outline:focus-visible { outline: 3px solid var(--brand-gold); outline-offset: 3px; }

/* Outline on dark bg (over hero) */
.btn-outline-light {
  background: transparent;
  color: #fff;
  border-color: rgba(255,255,255,.55);
}
.btn-outline-light:hover { background: #fff; color: var(--brand-navy); }

/* Size variants — same pill shape */
.btn-lg { padding: 18px 32px; font-size: 16px; }
.btn-sm { padding: 10px 20px; font-size: 14px; }

/* Mobile full-width override (per CLAUDE mobile rule) */
@media (max-width: 640px) {
  .btn-block-mobile { width: 100%; }
}
```

### Tap-target compliance
- Default button height ≥ 44px (achieved with `padding: 14px 28px` + 15px text → ~48px).
- All FAB / icon buttons ≥ 44x44px.
- Variant chips (Wood / Fluted / PVC / Acoustic) min-height 36px, padding 8px 16px — acceptable because they're chip-style, not primary actions. On mobile they grow to 40px min-height.

---

## 6. Shadow + Depth Tokens (navy-tinted, never flat gray)

```css
:root {
  /* Layered, navy-tinted shadows — per anti-generic guardrails */
  --shadow-soft:
    0 2px 4px rgba(11,21,58,.06),
    0 4px 16px rgba(11,21,58,.08);

  --shadow-card:
    0 4px 10px rgba(11,21,58,.06),
    0 18px 36px -8px rgba(11,21,58,.14),
    0 1px 0 rgba(255,255,255,.6) inset;

  --shadow-card-hover:
    0 6px 14px rgba(11,21,58,.10),
    0 28px 48px -8px rgba(11,21,58,.20),
    0 1px 0 rgba(255,255,255,.7) inset;

  --shadow-cta:
    0 8px 22px rgba(37,211,102,.28),
    0 1px 0 rgba(255,255,255,.10) inset;

  --shadow-eyebrow-pill:
    0 1px 0 rgba(200,164,92,.40) inset,
    0 1px 2px rgba(11,21,58,.05);

  --shadow-fab:
    0 12px 32px rgba(11,21,58,.22),
    0 4px 12px rgba(37,211,102,.30);

  /* Hairline border (subtler than a full shadow) */
  --hairline: 1px solid var(--brand-line);
  --hairline-gold: 1px solid var(--brand-gold-pale);
}
```

### Depth layering (base → elevated → floating)
- **Base:** sand background (no shadow).
- **Elevated:** product cards, review cards — `--shadow-card`.
- **Floating:** FAB, hover-lifted cards, header-after-scroll — `--shadow-card-hover` or `--shadow-fab`.
- **No flat `shadow-md` Tailwind tokens** anywhere. Every shadow has a navy or wa-green tint.

---

## 7. Imagery Direction

All photography must be **Asian / Malaysian subjects** when people are visible. Mood: warm sunlight, beige/cream furniture, real Malaysian interior styling (not Scandinavian, not New York loft). High-resolution, no watermarks.

### Pexels / Unsplash search queries (provide to whoever sources images)

**Hero (homepage):**
- `modern living room wood wall panel`
- `Malaysian apartment interior beige sofa wood feature wall`
- `warm minimalist living room wood paneling`
- `fluted wood wall panel modern home`
→ Pick a wide-angle shot showing a wood or fluted feature wall behind a beige sofa, with indirect window light.

**Hero (location pages):**
Same search family but vary the room (bedroom, dining, study). Each location page can rotate among 3-4 hero photos so the SEO grid isn't visually identical.

**USP background imagery:**
USP band is solid navy — no images. Skip.

**Style Gallery (5 panels):**
- Wood: `oak wood wall panel living room`
- Fluted: `fluted vertical wood panel modern interior`
- PVC: `white PVC wall panel kitchen`
- Acoustic: `acoustic wood slat panel home office`
- Marble Gold: `gold marble wall panel luxury living`
- Marble Silver: `grey marble wall accent wall`
- Marble Black: `black marble feature wall boardroom`

**Process section:**
No photos — illustrated only with numbered circles + gold hairlines. Editorial clarity.

**Why-Choose-Us background:**
Solid navy. No images.

**Customer Reviews background:**
- `cozy Malaysian living room evening warm`
- `modern interior beige sofa wood panel night`
→ Wide warm-toned interior, slightly out of focus so the overlaid review cards read.

**Customer Gallery / Completed Installs (masonry):**
Source 12 completed-install photos. Mix room types:
- 3 living rooms (wood / fluted / marble)
- 2 bedrooms (fluted / wood)
- 2 offices (acoustic / marble black)
- 2 bathrooms / kitchens (PVC)
- 2 reception lobbies (marble gold / silver)
- 1 home studio (acoustic)
Keep one stylistic filter across all (warm +3, sat +5).

**Final CTA background:**
- `luxury Malaysian boardroom marble feature wall`
- `modern living room marble accent wall evening`
→ Wide cinematic shot of a finished room. Dark navy overlay so the white headline reads.

### Image policy
- Re-check every image before deploy — confirm it actually shows a wall panel (not a tile, not wallpaper, not paint).
- No people staring directly at camera (editorial mood, not portrait).
- No watermarks, no low-res, no Pinterest-style super-saturated edits.
- Every image gets descriptive alt text mentioning the panel style + room type + location when relevant.

---

## 8. Logo + Favicon

### Concept — "Stacked Fluted Lines W"
The icon is **four vertical strokes of unequal height arranged like fluted panel slats**, which together imply the letter W (Wall). At 16×16 it reads as four vertical strokes. At full logo size it reads as fluted wood paneling — the visual signature of the product itself becomes the mark.

```
   █  █  █  █
   █  █  █  █
   █     █  █
   █     █  █
   █        █
```

Four navy strokes, varying heights (tallest at corners, shortest in middle), with a thin gold underline tying them together (a baseline stroke). At full-logo scale, the underline reads as the floor where the wall panel meets the ground.

### Favicon SVG concept (`app/icon.svg`)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#13204C"/>
  <!-- Four vertical strokes (fluted panel slats forming a W silhouette) -->
  <rect x="14" y="14" width="6"  height="32" rx="2" fill="#FBF7EF"/>
  <rect x="24" y="20" width="6"  height="26" rx="2" fill="#FBF7EF"/>
  <rect x="34" y="20" width="6"  height="26" rx="2" fill="#FBF7EF"/>
  <rect x="44" y="14" width="6"  height="32" rx="2" fill="#FBF7EF"/>
  <!-- Gold baseline tying the four slats together -->
  <rect x="12" y="48" width="40" height="3" rx="1.5" fill="#C8A45C"/>
</svg>
```

### Full logo (header wordmark)
- **Icon** (same SVG as favicon, scaled to 28px) sits left of wordmark.
- **Wordmark:** "Wall Panel Malaysia" set in Fraunces 600 navy, with "Malaysia" in Fraunces 600 italic + gold underline.
- On dark backgrounds (hero, footer): icon strokes flip to cream-pure, baseline stays gold; wordmark flips to cream-pure.

### Why this works at 16×16
- Just four vertical strokes + one horizontal — the simplest possible silhouette.
- Strong contrast (navy bg + cream slats) survives compression.
- Reads as both fluted panel + W initial — dual-meaning is the editorial-design signature.

---

## 9. Mobile-First Notes (PRIMARY viewport)

### Breakpoints (Tailwind defaults adopted, mobile-first cascade)

| Token | Min-width | Use |
|---|---|---|
| (default) | 0 | Mobile — design here FIRST |
| `sm` | 640px | Large phone landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop |

Primary design target: **390×844** (iPhone 12/13/14 standard). Screenshot every page at this viewport before shipping.

### Mobile-specific overrides
- **Center alignment:** all H1/H2/H3/H4 headings, all buttons, all stand-alone icons, all stat numbers center. Body copy may remain left-aligned for readability.
- **Full-width CTAs:** every WhatsApp button below `sm` uses `.btn-block-mobile { width: 100%; }`.
- **Single-column stacks:** USP cards, product grid, process steps, why-choose cards, review cards all single column.
- **Section spacing:** `py-14` (56px) minimum between mobile sections.
- **Body line-height:** `leading-[1.7]` everywhere.
- **No horizontal scrollbars visible** — review carousel and brand logos use snap-scroll or marquee with `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.
- **Tap targets:** every button, accordion header, FAB ≥ 44×44px touch area.
- **No images cut off:** hero photo uses `object-position: 35% center` (slightly right-of-center) on mobile so the sofa stays in frame.
- **Hero H1:** scales from 64px desktop down to 36px mobile so it doesn't dominate a 390px viewport.
- **Equal-height cards in rows:** USP row, product row, review row — wrappers get `h-full` so siblings match.

### Mobile screenshot checklist (Kagura runs before sign-off)
1. FOMO banner visible + countdown ticking.
2. Hero H1+H2 readable in one viewport without scrolling past the CTA.
3. USP cards stack cleanly, no overflow.
4. Product cards full-width with photo, badge, price, full-width CTA.
5. Pricing table — column stack, no horizontal scroll.
6. Process — vertical timeline with connecting line.
7. Why-Choose 2x2 stacks to 1x4 with no card height mismatch.
8. Reviews — snap-scroll carousel, no visible scrollbar.
9. FAQ — accordion expands cleanly, no overflow.
10. Footer — 4 cols stack to 1 col, no orphan link rows.
11. FAB visible at bottom-right at every scroll position, not blocking content.

---

## 10. Section Heading Eyebrows — Spec

Every section heading (H3–H6) must carry an `.eyebrow` ALL-CAPS mono label directly above it. The hero H1+H2 are the only headings without an eyebrow.

### Component class

```css
.eyebrow {
  display: inline-block;
  font-family: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  line-height: 1;
  padding: 6px 12px;
  margin-bottom: 14px;
  color: var(--brand-navy);
  background: var(--brand-gold-pale);
  border: 1px solid rgba(200,164,92,.35);
  border-radius: 999px;        /* Same pill family as buttons */
  box-shadow: var(--shadow-eyebrow-pill);
}

/* On dark sections (USP band, Why-Us, Final CTA, Footer) */
.eyebrow-light {
  color: var(--brand-gold);
  background: rgba(200,164,92,.10);
  border-color: rgba(200,164,92,.45);
  box-shadow: 0 1px 0 rgba(200,164,92,.30) inset;
}

/* Larger eyebrow for section-level (above section H3) */
.eyebrow-lg {
  font-size: 12px;
  padding: 8px 14px;
  margin-bottom: 18px;
}

/* Mobile centering — eyebrows align with their headings */
@media (max-width: 768px) {
  .eyebrow { margin-left: auto; margin-right: auto; }
  .section-head { text-align: center; }
}
```

### Placement rules
- Sits **directly above** its heading with `margin-bottom: 14px`.
- One eyebrow per heading. Never stack multiple eyebrows.
- For card-level headings (each product card has an eyebrow above the H4): use `.eyebrow` default size.
- For section-level headings (above the section H3): use `.eyebrow-lg`.
- On dark sections: swap `.eyebrow` → `.eyebrow-light` while keeping the pill shape.
- For the FOMO banner inline eyebrow tag (`LIVE PROMO`): override colour to white-on-red, but keep the same pill + mono treatment for brand consistency.

### Lint check before shipping
- Every `<h3>`, `<h4>`, `<h5>` rendered in a page section has an `.eyebrow` (or `.eyebrow-light`) sibling immediately preceding it.
- Zero bare section headings.
- Zero eyebrows that wrap to 2 lines (keep labels ≤ 22 characters).

---

## 11. Design Review Checklist

- [x] Hero layout differs from all existing sites (asymmetric bottom-left text column on full-bleed warm interior photo, not seen on any other Utopia site)
- [x] Colour palette does not repeat any existing site (deep editorial navy `#13204C` + warm sand `#F5EFE6` + muted gold `#C8A45C` — unique slot confirmed in section 1)
- [x] Typography pairing is unique within the system (Fraunces serif headings + Inter body + JetBrains Mono eyebrows — every other site uses sans-only headings)
- [x] Card / component styles are visually distinct (white pill-radius cards with gold rosette "Free Installation" badge, navy-tinted layered shadows)
- [x] Section ordering follows architecture.md page-parity rule (same homepage + location section order)
- [x] Design fits product category and target audience (premium-but-approachable interior finishing — speaks to homeowners and office decision-makers)
- [x] Brand assets incorporated (navy CTA pill + gold "Free Installation" rosette + warm interior photography style all match the reference image)
- [x] Mobile-first responsive approach (mobile breakpoint primary, center alignment, full-width CTAs, vertical timelines)
- [x] Image backgrounds used on hero, customer reviews, final CTA, customer gallery (not all flat solid colour)
- [x] 3-point USP bar mandatory and specified directly below hero
- [x] All buttons use the same `999px` pill shape — only colour varies (primary navy, WhatsApp green, outline, outline-light)
- [x] No phone numbers or domain text shown anywhere on the site (all CTAs route through `/redirect-whatsapp-1?loc=...`)
- [x] Heading hierarchy enforced — one H1 + one H2 in hero, all section headings H3–H6
- [x] All images to be verified for context before deploy (real wall-panel installations, no wallpaper / tile / paint substitutes)
- [x] Section eyebrow spec defined for every section heading (gold pill on light bg, gold outline on dark bg)
- [x] Accessibility — contrast verified AAA on primary text pairs, focus rings on every interactive element

---

## Unique Visual Identity — what makes this site distinct in the Utopia system

1. **Editorial serif headlines (Fraunces) on warm sand canvas** — every other Utopia site uses sans-only headings on white or cool backgrounds. This site reads as "interior design magazine," not "service vendor".
2. **Muted antique gold accent (#C8A45C) instead of industrial yellow** — sharply differentiated from skylift, aircond, roller-shutter, lorry-sticker, tablechair which all lean on bright yellow/gold. Our gold is interior-trim, not caution.
3. **Mono-typeface eyebrow pills** (JetBrains Mono) — every other Utopia site uses regular sans for ALL-CAPS section tags. The mono pill is the editorial-tech signature.
4. **Stacked-slat W favicon** — the fluted-panel slats form a W. Reads as the product itself at favicon size. No other site in the system uses a stroke-only mark.
5. **Asymmetric bottom-left hero text** — no other Utopia site anchors hero text bottom-left over a full-bleed photo. Existing sites are centered or split-hero.
6. **Cream-on-navy USP band** — combines two unused tones in the system. Sand pages, navy USP, sand product grid, sand-warm pricing, cream process — a rhythm of warm tones nobody else has.
7. **Italic accent on a single word per H3** — the Fraunces italic adds a magazine-pull-quote moment. Distinctive without being ornamental.

---

## Summary

Wall Panel Malaysia takes the **only unused slot** in the Utopia visual system: deep editorial navy `#13204C` over a warm sand canvas `#F5EFE6` with a muted antique-gold `#C8A45C` accent — distinct from every existing site's blue/teal/jade/orange/yellow palette. The typography pairs Fraunces serif headings (editorial-interior mood) with Inter body and JetBrains Mono eyebrow pills — a serif-led headline treatment that no other Utopia site uses. Section flow follows the mandatory architecture: FOMO red banner → transparent hero with bottom-left asymmetric H1+H2 over a warm Malaysian interior photo → 3-card USP band on dark navy → white product cards with the brand-asset's gold "Free Installation" rosette → editorial pricing-ladder columns → masonry style gallery → numbered-timeline process → 2x2 why-us on navy → image-backed reviews with cream cards → alternating-row FAQ → image-backed final CTA → deep-navy footer. Every section heading carries a gold-pill mono eyebrow; every CTA uses one `999px` pill shape (navy, WhatsApp green, or outline); every shadow is navy-tinted and layered; every image will be sourced from warm-light Malaysian interiors with real wall panels visible. The favicon is a four-stroke fluted-slat mark that doubles as the letter W — the product becomes the icon.
