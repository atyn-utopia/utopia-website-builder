# Design Direction — Skylift Malaysia

> Author: **Kagura** (UI Design Specialist)
> Project slug: `skylift-malaysia`
> Domain: `skylift-malaysia.vercel.app`
> Locked palette source: `inputs.md` (Industrial Yellow `#F5B400`, Charcoal `#1C1F2A`, Off-white `#F8F8F6`)
> Hero asset: transparent PNG cutout — Asian female site supervisor, yellow vest + helmet, pointing left
> Section order locked by `architecture.md §2.1`: FOMO → Nav → Hero → USP → Products → How It Works → Risk → Mid CTA → Reviews → Why Choose → Gallery → Locations Accordion → FAQ → Final CTA → Footer

---

## 1. Existing-sites audit (one-line per site)

| Site | Layout signature | Palette | Type pairing |
|------|-----------------|---------|--------------|
| `electrician-24-hour` | Centered hero on navy gradient + gold accents, USP strip on solid navy, card grid w/ heavy gold shadow | Royal Blue `#0B63CE` + Gold `#F9B419` + Navy `#061E4A` | Inter only (sans, both heading + body) |
| `cat-rumah-malaysia` | Cream wash, asymmetric two-column hero, soft pill badges, organic spacing | Jade `#17A890` + Coral `#EC6A4A` + Cream `#FBF7F0` | Inter + Noto Sans SC |
| `oxihome-malaysia` | Full-bleed photo hero (90vh) right-column image, dark teal sections alternating with surface tone | Teal `#0B6B82` + Burnt Orange `#E8692A` + Dark `#0A2535` | Inter only (labelled `font-display` but still Inter) |
| `sewa-motor-malaysia` | Dark-on-dark hero, neon orange gradient text, image right column inside card | Orange `#FF6B35` + Navy `#16213E` + Neutral surface | Inter only |
| `electric-wheelchair-malaysia` | Navy-blue hero block, orange CTA, conventional card grid w/ tall product photos | Navy `#1B2D5B` + Orange `#F47B20` | Inter only |
| `tablechair-rental-malaysia` | Cream + saturated yellow, editorial spacing, type-led hero | Gold `#FDD835` + Cream `#FFFEF8` + Charcoal `#111` | Inter only |

**Key insight:** every sibling ships Inter as both heading + body face, with no genuine display typeface. Skylift can win immediate visual differentiation by introducing a wide industrial grotesque heading face.

---

## 2. Duplicate-risk report

| Risk | Sibling that owns it | Mitigation for Skylift |
|------|---------------------|-----------------------|
| Yellow + dark pairing | `tablechair-rental` (gold/cream) and `electrician-24-hour` (gold accent on navy) | tablechair is *cream + saturated yellow on serif-feel layout*; electrician is *gold accent on royal-blue gradient*. Skylift uses **off-white #F8F8F6 + industrial yellow as a structural block** (oversized yellow corner/diagonal slab), not a gradient or pill — visually closer to construction signage than to either sibling. |
| Image-right hero with image inside a card | `oxihome`, `sewa-motor`, `electric-wheelchair` | Skylift hero MUST be a transparent cutout placed freely (no card/box) — already enforced by CLAUDE.md hero rule. Cutout floats over a **textured off-white canvas with a black diagonal stripe and yellow construction-tape marks** — no rectangle, no shadow box. |
| Inter-everywhere | All 6 siblings | Skylift uses **Archivo Black** (industrial display grotesque) for H1/H2 + section headings, and **DM Sans** for body — neither appears on any other site. |
| Standard 3-column product grid | every sibling | Skylift uses an **asymmetric 5-card "spec-sheet" layout** — first card is full-width hero card (20m most-popular), then a 2×2 grid for 9m/24m/32m/Spider — reads like a rental catalogue page, not a generic product grid. |
| Centered text-on-dark hero | `electrician-24-hour`, `sewa-motor`, `electric-wheelchair` | Skylift hero is **left-aligned text on light/off-white** — directly opposite of the navy/dark hero pattern dominating the system. |

---

## 3. Design directions explored

### Direction A — "Construction Site Document" (RECOMMENDED)
Off-white paper background with technical-drawing motifs: yellow construction-tape diagonal accents, hairline charcoal borders, monospaced caption labels, isometric line illustrations behind section headings. Hero is a transparent cutout woman pointing into a giant H1 set in Archivo Black with a yellow underline slab. Reads like a rental spec sheet from a real industrial supplier — distinct from every sibling's marketing-template feel.

**Why it fits:** Skylift is a B2B/contractor service (site supervisors, project managers), not a consumer rental. The technical-document aesthetic signals competence and matches the reference site's industrial-professional tone. It's also the most differentiated direction vs. siblings.

### Direction B — "High-Vis Editorial"
Heavy magazine layout: oversized type, generous whitespace, full-bleed yellow caution stripe at the FOMO bar, photo cards with chunky 2-px charcoal borders. More fashion-forward than industrial.

**Why rejected:** edges too close to `tablechair-rental-malaysia` (editorial cream + yellow) and risks reading like a lifestyle brand rather than a contractor service.

### Direction C — "Dark Industrial Brutalism"
Charcoal/black dominant background, yellow as accent only, oversized number plates, raw concrete textures.

**Why rejected:** breaks the locked palette intent (off-white background was specified in `inputs.md`) and overlaps with the dark-hero pattern that already dominates `electrician-24-hour`, `sewa-motor`, and `electric-wheelchair`.

---

## 4. Recommended direction — "Construction Site Document"

### 4.1 Layout blueprint (mandatory section order)

| # | Section | Visual treatment |
|---|---------|------------------|
| 1 | **FOMO Banner** | **Charcoal `#1C1F2A` background**, white text, yellow live-countdown digits (`#F5B400`). Sticky top. Background is solid charcoal (NOT yellow) to satisfy CLAUDE.md urgency-colour rule. |
| 2 | **Nav** | Off-white `#F8F8F6` with hairline 1px charcoal bottom border. Logo left, nav middle, EN/MS/ZH switcher + WhatsApp green CTA right. |
| 3 | **Hero** | Off-white textured canvas (subtle paper grain). **Yellow diagonal corner slab** top-right (45°, ~30vw, `#F5B400`). 2-col on desktop: left = H1 + H2 + supporting line + 2 CTAs; right = the transparent cutout woman placed freely (no container, no shadow box, no panel). Black "construction-tape" hatched stripe runs behind her feet to anchor without enclosing. Mobile: cutout stacks below the text, still no card. |
| 4 | **USP Bar (3-point)** | Solid yellow `#F5B400` strip directly under hero, charcoal text, 3 columns w/ thin charcoal vertical dividers. Each USP has a hand-drawn line icon (RM, truck, helmet) in charcoal. Mobile: stacks vertically, dividers become horizontal hairlines. |
| 5 | **Products** | **Asymmetric "spec-sheet" grid.** Card 1 (20m, most popular): full-width charcoal card w/ off-white photo on right, "MOST RENTED" yellow tag. Cards 2–5 (9m / 24m / 32m / Spider): 2×2 grid, off-white cards, hairline charcoal border, monospaced spec rows underneath each (Reach · Outrigger · Power). Mobile: every card stacks single-column. |
| 6 | **How It Works** | Off-white background with **isometric line illustration** (pale charcoal #1C1F2A at 8% opacity) of a skylift behind the steps. 4 numbered steps, big yellow numerals (Archivo Black) + charcoal step copy. |
| 7 | **Risk / Problem** | **Image background section** — full-bleed photo of a fall-from-height construction scene with **charcoal-to-transparent gradient overlay** (left to right). Off-white headline + 3 risk bullets in white. |
| 8 | **Mid CTA** | **Image background section** — close-up worker on skylift platform photo, yellow `#F5B400` 70% overlay (multiply blend), charcoal H3, WhatsApp green CTA centered. |
| 9 | **Google Reviews** | Off-white background, 6 review cards in a snap-scroll row on mobile (hidden scrollbar) and 3-col grid on desktop. Google rating badge above. Each card: 5-star row, body text, name + location, hairline charcoal border. |
| 10 | **Why Choose** | 2-col grid on desktop, 6 differentiator cards. Charcoal icons, yellow underline accent on each card title, off-white card backgrounds w/ tight 1px charcoal border. |
| 11 | **Gallery** | 16 images in a strict **4×4 grid on desktop** (4 cols × 4 rows — divides 16 cleanly), **2×8 grid on tablet**, **2×8 on mobile** (also clean). Every cell filled — never auto-fill. Each tile: 1:1 aspect ratio, hairline charcoal border, hover scales 1.03 with yellow corner-tag reveal. |
| 12 | **Locations Accordion** | 13 collapsible state rows. Closed state: charcoal H4 state name + sub-count badge in yellow + chevron. Open: grid of sub-location pill links, off-white pills with charcoal text, hover fills yellow. Hairline divider between state rows. |
| 13 | **FAQ** | Single-column accordion, max 720px centered. Plus/minus icon in yellow. Hairline charcoal divider between items. |
| 14 | **Final CTA** | **Image background section** — full-bleed wide shot of the supervisor with skylift in background, charcoal-to-charcoal vertical gradient overlay, white H3, WhatsApp green CTA centered. |
| 15 | **Footer** | Charcoal `#1C1F2A` background, off-white text, 4 columns (brand block · units · top locations · resources). EN/MS/ZH switcher and copyright on a hairline-bordered bottom row. **No phone number or domain text.** |

### 4.2 Colour system (locked palette only)

| Token | Hex | Use |
|-------|-----|-----|
| `--yellow` | `#F5B400` | Primary brand block, USP strip, accent slabs, tags, hover fills, FOMO countdown digits, secondary button bg |
| `--yellow-dark` | `#D89400` | Hover state for primary yellow buttons, focused borders |
| `--charcoal` | `#1C1F2A` | All body text, primary card backgrounds, footer, FOMO banner bg |
| `--off-white` | `#F8F8F6` | Page background, light card surface, footer text |
| `--white` | `#FFFFFF` | Pure white when needed inside dark sections |
| `--black` | `#0E0F12` | Construction-tape hatched stripe accents only |
| `--wa-green` | `#25D366` | EVERY WhatsApp CTA — nav, hero, mid CTA, sticky FAB, final CTA, blog banner |
| `--wa-green-dark` | `#1EBE57` | WhatsApp CTA hover state only |

**No tints outside this list.** Specifically — never default Tailwind blue/indigo, never the navy/orange combos owned by sibling sites.

### 4.3 Typography pairing (different from every sibling)

- **Heading display:** **Archivo Black** (next/font/google `Archivo_Black`, weight 900) — wide industrial grotesque. Used for H1, H2, H3, big numerals (USP RM rates, How-It-Works steps, FAQ counters).
  - H1: clamp(40px, 6vw, 72px), tracking `-0.03em`, line-height 1.0
  - H2: clamp(20px, 2.4vw, 28px), tracking `-0.01em`, line-height 1.25, charcoal 80%
  - H3: clamp(28px, 3.4vw, 40px), tracking `-0.02em`, line-height 1.1
  - H4: 20px, tracking `-0.01em`
- **Body sans:** **DM Sans** (next/font/google `DM_Sans`, weights 400/500/700) — clean modern sans, neutral but warmer than Inter. Body 16px, line-height 1.7.
- **Caption / spec labels:** **JetBrains Mono** (weight 500) — small monospaced labels for product spec rows ("REACH · 20m"), gallery captions, technical microcopy. This is the "construction document" signal — none of the siblings use a mono.

**Rationale:** Archivo Black + DM Sans + JetBrains Mono is a triplet that does not appear in any sibling project — every sibling defaults to Inter for both heading and body. The wide-grotesque + mono caption pairing reads industrial / spec-sheet, exactly matching the contractor target audience.

### 4.4 Component styles

**Buttons (single rounded shape, color is the only variant):**
- Shape: `border-radius: 999px` (full pill) on every button site-wide, `padding: 14px 28px`, font-weight 700, text 15px, all-caps tracking `0.02em`.
- Variants:
  - `wa` — WhatsApp green `#25D366` bg, white text, white WhatsApp icon. Hover `#1EBE57`. **Used on every WhatsApp CTA.**
  - `primary` — Yellow `#F5B400` bg, charcoal text. Hover `#D89400`.
  - `secondary` — Off-white bg, 1.5px charcoal border, charcoal text. Hover charcoal bg + off-white text.
- **Never mix shapes.** No squared buttons, no rounded-md, no rounded-lg corners — pill only.

**Cards:**
- Off-white surface, 1px solid charcoal border, `border-radius: 4px` (cards stay rectangular while buttons stay round — deliberate contrast that says "industrial document, friendly action").
- Hover: lift 4px, yellow accent line slides in from bottom (`::after` 3px yellow bar).
- Shadow only on hover: `0 12px 28px rgba(28,31,42,0.10)`.

**Section transitions:**
- Sections separated by hairline 1px charcoal lines OR by inverted background (off-white → charcoal → off-white → image-bg).
- Vertical rhythm: `py-20` desktop, `py-14` mobile (per CLAUDE.md mobile generous-spacing rule).

**Image treatment:**
- Hero cutout — placed freely, NO container, NO shadow box.
- Image-bg sections — gradient overlay (charcoal-to-transparent or yellow-multiply) for text legibility.
- Gallery thumbs — 1:1 aspect, 1px hairline charcoal border, no rounded corners (squared photos read like a contractor portfolio).

### 4.5 Logo + favicon

**Icon concept (designed FIRST, then wrapped into a logo wordmark):**

A bold geometric mark of a **skylift boom angled upward at 45°** — formed by two thick charcoal lines making an "L" rotated, with a small yellow square at the boom tip representing the work platform. The base sits on a 2-line charcoal hatched ground (construction-tape feel). Reads as both a literal skylift silhouette AND a rising arrow at 16×16.

```
            [yellow square]
           /
          /
   _____ /  charcoal boom
  ▮▮▮▮▮▮      (hatched ground)
```

**Favicon (`app/icon.svg`)** — the icon mark above, monochrome charcoal `#1C1F2A` boom + `#F5B400` square, on transparent background. Works at 16×16 because the boom is a single bold diagonal stroke and the yellow square at the tip remains visible.

**Logo wordmark** — icon left, "SKYLIFT" set in Archivo Black charcoal (capital, tight tracking) followed by a smaller "MALAYSIA" in DM Sans Medium charcoal underneath (or to the right at 0.5x size). The icon must be **identical** between logo and favicon — same boom angle, same yellow square, same proportions. No alternative icon variants.

### 4.6 Three unique design elements (signature to Skylift only)

1. **Yellow diagonal corner slab in the hero** — a 45° angled `#F5B400` polygon occupying the top-right ~30vw of the hero, behind the cutout woman. Reads as construction-tape signage. **No other sibling uses an angled colour slab.**
2. **JetBrains Mono spec-row captions under every product card** — small all-caps monospace metadata (`REACH · 20M  |  POWER · DIESEL  |  ROAD · TOWABLE`) that immediately signals industrial spec sheet. **No sibling uses a monospaced font.**
3. **Construction-tape hatched stripe accents** — short black-and-yellow 45° hatched bars used as section accents (between hero and USP bar, and behind the cutout woman's feet to anchor without enclosing her). Distinctive industrial-signage motif **none of the siblings use**.

---

## 5. Design review checklist

- [x] Hero layout differs from all existing sites (left-aligned text on off-white + transparent cutout placed freely with diagonal yellow slab — opposite of the navy-gradient-centered-hero pattern dominating siblings)
- [x] Color palette does not repeat any existing site (industrial yellow + charcoal + off-white is unique vs. royal-blue/gold, jade/coral, teal/burnt-orange, orange/navy, navy/orange, gold/cream)
- [x] Typography pairing is unique within the system (Archivo Black + DM Sans + JetBrains Mono — none of the 6 siblings ship anything except Inter)
- [x] Card/component styles are visually distinct (rectangular hairline-bordered spec-sheet cards + pill buttons — opposite mix from siblings' rounded-card + variable-button approach)
- [x] Section ordering matches the locked architecture spec (15 sections, no deviations)
- [x] Design fits the product category (B2B contractor rental → industrial spec-sheet aesthetic)
- [x] Brand assets incorporated — transparent cutout female supervisor placed freely in hero (no container)
- [x] Mobile-first: hero stacks (text → cutout), products go single column, USP stacks vertically, gallery becomes 2×8, all CTAs full-width on mobile, headings/cards/icons center-aligned on mobile
- [x] Image backgrounds used on Risk, Mid CTA, and Final CTA sections (3 of 15, mixed with flat off-white + flat charcoal + yellow strip — depth via layering)
- [x] 3-point USP bar present immediately below hero (yellow strip, charcoal text, 3 mono-captioned columns)
- [x] All buttons use the same rounded pill shape — only colour varies (WA green, yellow, off-white-bordered)
- [x] No phone numbers or domain names visible anywhere — WhatsApp redirect only
- [x] Heading hierarchy — exactly one H1 (hero title) and exactly one H2 (hero subtitle); all other section titles H3–H6 (matches Nana's copy structure exactly)
- [x] All gallery images verified — 16 captions, 4×4 grid divides cleanly, never blank cells
- [x] FOMO banner — charcoal background (urgency colour, not yellow), white text, yellow countdown digits, sticky top, live HH:MM:SS
- [x] WhatsApp CTAs — official `#25D366` everywhere (nav, hero, mid CTA, sticky FAB, final CTA, blog banner). Never themed in yellow or charcoal.
- [x] Customer gallery never leaves a blank slot — 16 images, 4 cols ÷ 16 = 4 rows exact at every breakpoint
- [x] Hero cutout is NOT wrapped in a card / shadow / panel — placed freely, with diagonal yellow slab and hatched stripe as compositional anchors only (not enclosures)
- [x] Logo icon = favicon — same boom + yellow-square mark, identical proportions in both
- [x] Accessibility — charcoal `#1C1F2A` on off-white `#F8F8F6` exceeds WCAG AAA; yellow `#F5B400` only used as background block (never as small body text)

---

## Section-order quick reference (matches Alpha + Nana)

> FOMO Banner → Nav → Hero → USP Bar → Products → How It Works → Risk → Mid CTA → Reviews → Why Choose → Gallery → Locations Accordion → FAQ → Final CTA → Footer

Location pages add: Breadcrumb (between Nav and Hero) + Nearby Locations (between Locations Accordion and FAQ). No other deviations.

---

**Next agent:** Kimmy implements the technical SEO + i18n + WhatsApp redirect against this visual spec. Layout-parity verification (homepage vs. location page) is enforced by Kagura before deployment, per `agents/kagura.md §"Layout Parity Verification"`.
