# Kak Kenduri — Design Direction

**Author:** Kagura (UI Design Specialist)
**Project:** tablechair-rental-malaysia.vercel.app
**Date:** 2026-04-15
**Recommended direction:** "Kenduri Pavilion" — Gold + Sage + Cream editorial layout with fabric-drape hero, bunga manggar ornaments, and gold hairline dividers.

---

## 1. Existing Sites Audit

One paragraph per existing project in the system. Notes drawn from each project's `design-direction.md`, code, and screenshots where available.

### oxihome-malaysia
Medical oxygen concentrator SEO site. **Hero:** full-bleed dark teal photo background with split-grid text-left / device-right layout. **Palette:** teal `#0B6B82` primary + orange accent + white surface. **Type:** Inter everywhere. **Components:** standard white product cards, circular orange stat stamps, flat anchor list for locations, green WhatsApp pill CTA, red countdown bar across the top. **Do NOT repeat:** teal primary, split text-left / image-right hero, red urgency countdown strip, circular orange stamps.

### sewa-motor-malaysia
Motorcycle rental SEO site. **Hero:** asymmetric bottom-right anchored hero with a dark slate gradient (`#16213E`) and the motorcycle image overlapping into the stats bar; gradient-text price in H1 and a parallelogram (`skewX -6deg`) price stamp. **Palette:** orange `#FF6B35` + coral `#FF3F3F` + dark slate. **Type:** Georgia serif headings + system sans body (violates the global Inter rule — do NOT copy). **Components:** 3-col pricing mini-table per card, 3px gradient top-stripe on cards, red FOMO countdown banner, accordion locations. **Do NOT repeat:** orange primary, dark-slate hero, asymmetric bottom-right anchor, parallelogram stamps, gradient top-stripe cards, FOMO countdown.

### cpapmachine
Medical CPAP SEO site (earliest reference in the system — folder now mostly empty, but the design DNA is well documented in other audits). **Hero:** blue medical gradient with split product-focused layout. **Palette:** clinical blue + white. **Type:** standard sans. **Components:** card grid of locations. **Do NOT repeat:** medical blue palette, clinical product-focused hero, flat location card grid.

### electric-wheelchair-malaysia
Mobility device SEO site. **Hero:** split hero, text left and chair image right, circular orange stamps overlaid on the product. **Palette:** navy `#1B3A5C` + orange accent. **Type:** Inter. **Components:** orange circular "stamp" badges, green WhatsApp pill CTA, standard product grid. **Do NOT repeat:** navy+orange, split text-left/chair-right, circular orange stamps.

### roller-shutter-malaysia
Industrial shutter SEO site. **Hero:** diagonal-cut overlay with a 12deg skewed angled divider; gunmetal grey textured background; product partially revealed behind the cut. **Palette:** gunmetal `#2C3338` + safety yellow + crimson. **Type:** Inter. **Components:** industrial "tabbed" cards with a metallic left-border and stamped numbering, yellow hazard pill CTAs. **Do NOT repeat:** gunmetal+yellow+crimson, diagonal 12deg cut hero, metallic left-border cards.

### service-aircond-malaysia
Aircond service SEO site (Encik Beku mascot brand). **Hero:** full-width warm gradient navy `#1B3A5C` → orange `#E8732A`, single centered column, cartoon mascot floating decoratively at the right edge. **Palette:** warm orange + navy + isometric blueprint grid texture. **Type:** Inter. **Components:** 2x2 icon-forward service cards, accordion-by-region location section, horizontal scroll review strip. **Do NOT repeat:** navy→orange warm gradient hero, mascot-right layout, 2x2 icon-forward service cards.

### hospital-bed-malaysia
Placeholder project — only `inputs.md`; no site built yet. No layout to duplicate.

### katil-hospital
Placeholder project — only `inputs.md` and `brand_assets/`; no site built yet. No layout to duplicate.

### hollywood-night
Annual dinner RSVP microsite (non-SEO, event). **Hero:** full-bleed black "Spotlight & Grain" stage with a radial gold spotlight, film-grain noise, letterbox bands. **Palette:** ink-black `#05060A` + metallic gold `#D4AF37` + champagne ivory + carpet-red accent. **Type:** serif display headings + ivory body (violates our Inter rule — do NOT copy typography). **Components:** perforated ticket stub, letterboxed hero, no WhatsApp CTA. **Do NOT repeat:** black-stage hero, gold spotlight radial, perforated ticket artifact, letterbox bands.

---

## 2. Duplicate Risk Report

| Element | Existing conflict | Risk | Decision for Kak Kenduri |
|---|---|---|---|
| Gold as an accent | hollywood-night uses metallic gold `#D4AF37` on pure black | MEDIUM | SAFE — Kak Kenduri gold `#E8B547` is a warmer, brighter honey-gold on CREAM (not black). Wholly different mood. |
| Orange primary | sewa-motor, service-aircond, electric-wheelchair | HIGH | REJECT — do not use orange |
| Teal/medical blue | oxihome, cpapmachine | HIGH | REJECT |
| Navy dark sections | sewa-motor, service-aircond, electric-wheelchair | HIGH | REJECT — use cream + sage instead, no dark navy sections anywhere |
| Gunmetal+yellow | roller-shutter | HIGH | REJECT |
| Black stage hero | hollywood-night | HIGH | REJECT |
| Split text-left / product-right hero | oxihome, electric-wheelchair | HIGH | REJECT — use an editorial hero with draped fabric frame instead |
| Asymmetric bottom-right anchored hero | sewa-motor | HIGH | REJECT |
| Diagonal 12deg cut hero | roller-shutter | HIGH | REJECT |
| Warm navy→orange gradient hero | service-aircond | HIGH | REJECT |
| Circular orange stamp badges | oxihome, electric-wheelchair | HIGH | REJECT |
| Parallelogram / skewed price stamps | sewa-motor | HIGH | REJECT — use a scalloped gold ticket-tag instead |
| 3px gradient top-stripe cards | sewa-motor | HIGH | REJECT |
| Metallic left-border tabbed cards | roller-shutter | HIGH | REJECT |
| 2x2 icon-forward cards | service-aircond | HIGH | REJECT — use image-forward cards |
| Red FOMO countdown strip | oxihome, sewa-motor | HIGH | REJECT (also not appropriate for kenduri tone) |
| Accordion-by-region locations | sewa-motor, service-aircond | HIGH | REJECT — use a state-badge pill-cloud grid instead |
| Flat anchor list locations | oxihome | HIGH | REJECT |
| Inter font globally | oxihome, electric-wheelchair, roller-shutter, service-aircond | LOW | ACCEPT — user rule mandates Inter everywhere, no exceptions |
| WhatsApp green CTA | oxihome, electric-wheelchair, service-aircond | LOW | ACCEPT — user rule mandates `#25D366` |

**Safe design space identified:** an editorial, festive, cream-dominant layout with a **fabric-drape framed hero** (no existing site uses a draped-cloth frame), **pill-cloud location grid** (none use this), **image-forward product cards with a scalloped gold ticket price tag** (none use scallops), and the **bunga manggar + kenduri bunting motif** (no existing site uses Malay celebratory ornament).

---

## 3. Research Findings — Directions Explored

### Direction A — "Kenduri Pavilion" (RECOMMENDED)
Editorial cream canvas framed by a soft **draped fabric arch** at the top of the hero (the same cloth skirting that wraps round tables at a kenduri). The hero is a **centered editorial hero**, not split, with the H1 set inside a fabric-draped proscenium and the product montage (banquet chair + round table with skirt + chiavari chair) laid out as a flat-lay trio below the headline. Gold hairline dividers separate every major section. **Bunga manggar** (the gold palm-frond wedding ornament) appears as a decorative corner accent at section joins. A **kenduri bunting strip** (small triangular flags in gold/sage/cream) ornaments the top of the service-area section. Palette is warm cream + honey-gold + sage with charcoal text. **Why it wins:** it is the only direction that visually says "Malay wedding / kenduri" before a visitor reads a single word, it is unlike any existing site in the system, and it matches the brand asset (gold chiavari + sage blob + yellow blob) without feeling Wix-template-generic.

### Direction B — "Banquet Bazaar"
Dense bento-grid layout like a market spread: the hero becomes a 6-tile bento with the hero image in the largest tile and smaller tiles showing pricing, trust badges, and a mini gallery. Modern and information-dense. **Rejected because:** bento hero collides conceptually with roller-shutter's compartment-heavy hero and with sewa-motor's stats-overlap approach; the dense grid also fights mobile stacking and risks creating the "dead zones" the user explicitly forbids at small sizes.

### Direction C — "Festival Marquee"
Full-bleed photographic kenduri scene as the hero with a white vignette panel centered. **Rejected because:** full-bleed photo hero is too close to oxihome-malaysia's full-bleed dark photo treatment, and the wixstatic reference images are mostly flat-lay product shots rather than lifestyle-scale kenduri photos — the approach would force placeholder use, which the user forbids.

**Chosen:** Direction A — Kenduri Pavilion.

---

## 4. Recommended Direction — Full Visual Specification

### 4.1 Layout Blueprint

#### InlineHeader (sticky)
- Height `72px` desktop / `60px` mobile.
- Background: cream `#FDF8EE` with `backdrop-filter: blur(8px)` and a 1px bottom hairline in gold `rgba(232,181,71,0.35)`.
- Left: Kak Kenduri wordmark in charcoal with a small gold bunga-manggar glyph to its left (16px SVG).
- Center (desktop only): nav `Services · Locations · Gallery · Contact` in Inter 500, `14px`, `tracking-normal`, charcoal with sage hover underline.
- Right: language switcher (EN / MS / ZH segmented pill), then a **WhatsApp pill CTA** (`#25D366`, white text, rounded-full, 44px tall, `target="_blank" rel="noopener"`).
- Mobile: hamburger opens a cream drawer with a draped-fabric top border.

#### Hero — "Draped Pavilion" centered editorial
Matches architecture `Hero.tsx` section. Full-width but content centered in a `max-w-6xl` column. No split grid.

- Background: cream `#FDF8EE` with a subtle layered radial — `radial-gradient(ellipse at 50% 0%, rgba(232,181,71,0.18) 0%, rgba(156,184,111,0.08) 35%, transparent 70%)`.
- **Draped fabric arch at top:** an SVG of a scalloped cream cloth skirting (the exact pleated skirt seen on wrapped round tables in the reference images), stretched edge-to-edge, `height: 64px` desktop / `40px` mobile. Fill is warm cream `#FBF1DC` with sage shadow `rgba(156,184,111,0.25)` underneath. This single element alone makes the hero unmistakable.
- H1 (Inter 800, display scale) sits directly under the drape with tight tracking. Example copy: "Table & Chair Rental Malaysia — Same-Day Delivery From RM3.60".
- Sub-headline (Inter 400, 18px, line-height 1.55, max-width `60ch`) directly below.
- **Scalloped gold price ticket tag** floats next to the headline — a rounded rectangle with scalloped left edge (the same shape as a raffle ticket), fill `#E8B547`, text charcoal, `From RM3.60 / chair`. A `12deg` rotation gives it movement without skew-stamping (distinct from sewa-motor's parallelogram).
- Primary CTA: WhatsApp green pill, `padding: 16px 28px`, icon + label "WhatsApp Kak Kenduri", opens in new tab.
- Secondary CTA: ghost pill, sage border `1.5px solid #9CB86F`, charcoal text, hover fills with sage-10 `#E4EED4`.
- Below the CTAs, a **flat-lay product trio** — banquet chair (left), round table with skirting (center, larger), chiavari chair (right) — using three wixstatic URLs from `reference-research.md` directly, each on an oval sage-cream blob backdrop. The blobs echo the brand asset exactly (gold + sage organic shapes).
- **Trust strip** beneath the trio: "8,000+ kenduri served since 2019 · KL · Selangor · Johor · Nationwide" with a 4.9★ Google review badge on the right.
- **No empty whitespace.** Hero is dense: drape → H1 → sub → ticket tag + CTAs → product trio → trust strip. This satisfies the "no dead zones" rule.

#### Section order (matches `architecture.md` parity list — IDENTICAL on homepage and every location page)

1. `InlineHeader`
2. `Hero` (on location pages, use `LocationHero` with the same drape + trio — only the H1 text differs)
3. `ServiceArea` — state badges + 38 location pill-cloud
4. `ProductGrid` — 6 core products
5. `AdditionalRentals` — 9 add-ons
6. `ThreeStepProcess` — exactly 3 steps (per user rule)
7. `CustomerGallery` — 24 images masonry + Google review badge
8. `LocationFAQ` — **location pages only**, 5 unique Q&A, inserted between Gallery and Footer
9. `InlineFooter`

Location pages are identical except that the `Hero` copy is city-specific and a `LocationFAQ` is inserted at step 8. No other order differences are permitted (parity rule from `kagura.md`).

#### ServiceArea — "Bunting Grid"
- Section background: cream with a `repeating-linear-gradient(45deg, transparent 0 14px, rgba(232,181,71,0.06) 14px 15px)` chevron weave texture (very faint — homage to the kampung canopy pattern).
- Top ornament: a **kenduri bunting strip** — a row of alternating gold / sage / cream triangle flags hanging on a hairline string, rendered as inline SVG, `height: 32px`, stretching the full container width. Unique to this site.
- Intro paragraph centered, `max-w-prose`.
- Location list rendered as a **pill-cloud grouped by state**: each state gets an H3 header ("Selangor", "Kuala Lumpur", ...) above a wrapping row of rounded-full pill links (`rounded-full`, `px-4 py-2`, cream bg, 1px gold hairline border, charcoal text, sage hover background). 13 state groups, 38 pill links total. Distinct from sewa-motor's accordion and oxihome's flat list.
- Each pill is `min-height: 44px` for mobile tap target compliance.

#### ProductGrid — "Image-forward cards"
- 3-col desktop (`lg:grid-cols-3`), 2-col tablet (`md:grid-cols-2`), 1-col mobile. Every card is `h-full` so rows stay equal-height per user rule.
- Card: cream surface `#FFFBF0`, 24px radius, 1px gold hairline border `rgba(232,181,71,0.4)`, **layered shadow** `0 1px 0 rgba(232,181,71,0.08), 0 12px 24px -12px rgba(42,38,32,0.12), 0 28px 60px -28px rgba(156,184,111,0.18)` (gold+sage tinted — satisfies Anti-Generic Design Guardrails).
- Top half of card: product image from wixstatic URL on a sage oval blob backdrop (40% opacity). Gentle gradient overlay `linear-gradient(180deg, transparent 0%, rgba(253,248,238,0.6) 100%)` improves readability per CLAUDE.md rule.
- Below image: product name (Inter 700, 22px, tracking `-0.01em`), 1-line tagline (Inter 400, 14px, sage text), body blurb (Inter 400, 15px, charcoal, line-height 1.6, 3 lines max with ellipsis).
- **Pricing block:** a 2-row mini-table inside a cream-50 rounded inner card: `Plain | RM X` / `With Cover | RM Y`. Row separator is a 1px gold hairline. Distinct from sewa-motor's 3-column Daily/Weekly/Monthly.
- Footer: WhatsApp green full-width pill CTA "WhatsApp to book", `target="_blank"`. Service-specific prefilled message via query string.
- Hover: `transform: translateY(-2px)`, shadow strengthens. Animate only `transform` and `box-shadow` (no `transition-all`).

#### AdditionalRentals
- 3×3 grid desktop (`lg:grid-cols-3`), 2-col tablet, 1-col mobile, `h-full` cards.
- Smaller cards than ProductGrid: cream surface, 20px radius, 1px gold hairline, no inner pricing table — just image + name + 20–30 word blurb + WhatsApp link.
- Section background: soft sage wash `#EEF3E2` to alternate rhythm with the cream ProductGrid above.

#### ThreeStepProcess — "Festoon Timeline"
- Exactly 3 steps (user rule).
- Desktop: a horizontal timeline of three large circular step markers (88px gold-filled, charcoal numeral, Inter 800, 40px) connected by a gold hairline with small bunga-manggar glyphs at each junction.
- Each step: big numeral circle, H3 step title (Inter 700, 20px), 25–35 word body blurb. Step 1 must contain "WhatsApp" (per copy).
- Mobile: stack vertically with a vertical hairline running between the circles.

#### CustomerGallery — 24-image masonry
- Masonry layout (`columns-2 md:columns-3 lg:columns-4`, gap `16px`) of 24 wixstatic gallery images.
- Each image: 16px radius, `hover:scale-[1.02]` transform, subtle gradient overlay `linear-gradient(180deg, transparent 60%, rgba(42,38,32,0.25) 100%)` so any caption on hover is readable.
- Above the masonry: a **Google Reviews branding bar** — white rounded card with the real Google "G" mark (4-color), "4.9★ from 230+ Google reviews" in Inter 600, and a link "See all reviews on Google Business" (underline sage hover). This satisfies the Google review branding user rule and Kagura's trust checklist.
- Mobile: the masonry becomes a **horizontal marquee** (auto-scroll) — `@keyframes scroll` linear infinite, pause on hover, `scrollbar-width: none; ::-webkit-scrollbar { display: none }`. Never show a visible scrollbar (mandatory rule).

#### LocationFAQ (location pages only)
- 5 accordion items, one per FAQ pair. Accordion panel uses cream-50 background with a gold hairline top border.
- Chevron icon (custom SVG, gold) rotates `transform: rotate(180deg)` when open.
- Inserted between `CustomerGallery` and `InlineFooter`.

#### InlineFooter
- Background: charcoal `#2A2620` (the only dark block on the page — deliberate anchor).
- Top edge: inverted draped-fabric SVG (same asset as the hero drape, flipped, 48px height) in cream — visually "ties" the footer to the hero.
- 4-column grid desktop: brand block + HQ address + quick links (with footer top-6 from seo-plan: KL, PJ, Shah Alam, JB, Ipoh, Georgetown) + WhatsApp CTA block with phone number in plain text `+60 17-428 7801`.
- Language switcher repeated here.
- Bottom strip: SSM `1507990-A` + © Kak Kenduri Sdn. Bhd. + legal links. Text color cream-60, gold hairline above.

### 4.2 Color System

```
--brand-cream:      #FDF8EE   /* page base */
--brand-cream-50:   #FBF1DC   /* elevated surface, card inner */
--brand-cream-100:  #F6E7BF   /* hover surface */
--brand-gold:       #E8B547   /* primary accent — headings underline, ticket tag, step circles */
--brand-gold-600:   #C8942C   /* hover / pressed gold */
--brand-gold-200:   #F4D688   /* highlight gold */
--brand-gold-hair:  rgba(232,181,71,0.40)   /* hairline borders */
--brand-sage:       #9CB86F   /* secondary accent — blobs, pill hover, bunting */
--brand-sage-600:   #7A9455   /* hover sage */
--brand-sage-50:    #EEF3E2   /* additional rentals bg wash */
--brand-charcoal:   #2A2620   /* primary text, footer bg */
--brand-charcoal-70:rgba(42,38,32,0.70)     /* body muted */
--brand-charcoal-40:rgba(42,38,32,0.40)     /* captions */
--wa-green:         #25D366   /* WhatsApp CTA only */
--wa-green-600:     #1EB85A   /* WhatsApp hover */
--google-blue:      #4285F4   /* for the real Google mark — do not use as UI color */
--google-gold:      #FBBC04
--google-red:       #EA4335
--google-green:     #34A853
```

**Forbidden:** Tailwind default blue/indigo, flat `shadow-md`, `transition-all`, navy, orange, teal, gunmetal, black-stage dark — all reserved by other projects or banned by CLAUDE.md.

**Text hierarchy:**
- Display / H1 → charcoal `#2A2620`
- H2 → charcoal `#2A2620`
- H3 → charcoal with gold-hairline underline utility
- Body → charcoal 70%
- Captions → charcoal 40%
- On dark footer → cream `#FDF8EE` primary, cream-60 muted

### 4.3 Typography — Inter only

Global font stack: `Inter, ui-sans-serif, system-ui, sans-serif`. Loaded via `next/font/google` in `app/layout.tsx` per architecture. **No serif anywhere** — this explicitly overrides CLAUDE.md's "serif for headings" guardrail per user memory rule.

| Token | Size (desktop / mobile) | Weight | Tracking | Line-height | Usage |
|---|---|---|---|---|---|
| `display` | `clamp(40px, 5.2vw, 56px)` / `32px` | 800 | `-0.025em` | `1.08` | Hero H1 |
| `h1` | `44px` / `30px` | 800 | `-0.02em` | `1.12` | Section H1 fallbacks |
| `h2` | `34px` / `26px` | 700 | `-0.015em` | `1.18` | Section headings |
| `h3` | `22px` / `20px` | 700 | `-0.01em` | `1.28` | Card titles, step titles |
| `eyebrow` | `12px` | 600 | `0.12em` uppercase | `1` | Section eyebrows (gold) |
| `body-lg` | `18px` / `17px` | 400 | `0` | `1.55` | Hero sub-headline |
| `body` | `16px` / `15px` | 400 | `0` | `1.62` | Blurbs |
| `body-sm` | `14px` / `14px` | 400 | `0` | `1.6` | Card blurbs |
| `caption` | `12px` / `12px` | 500 | `0.02em` | `1.4` | Price units, footer legal |
| `button` | `15px` / `15px` | 600 | `0.01em` | `1` | CTA labels |

Mobile minimums enforced from the Kagura mobile checklist: no text below `12px`, hero H1 ≥ `28px`, body ≥ `14px`, captions ≥ `11px` — the scale above satisfies all of these.

### 4.4 Component Specs

#### Cards
- **Product card:** cream `#FFFBF0` surface, 24px radius, 1px gold hairline border, layered shadow (see ProductGrid above), `h-full`. Hover: `translateY(-2px)`, shadow +30%, `transition: transform 200ms ease, box-shadow 200ms ease` — never `transition-all`.
- **Add-on card:** 20px radius, no inner pricing table.
- **FAQ accordion item:** cream-50 surface, gold hairline top, 16px radius, chevron rotates on open.
- **Review badge card:** white, 20px radius, gold hairline, google-color G mark on the left.

#### Buttons
- **Primary (WhatsApp):** background `#25D366`, hover `#1EB85A`, active `#169948`, text white, font Inter 600 15px, `rounded-full`, `padding: 14px 26px`, min-height 44px, `box-shadow: 0 8px 20px -8px rgba(37,211,102,0.45)`. `target="_blank" rel="noopener"` on every instance. Focus: `outline: 3px solid rgba(37,211,102,0.4); outline-offset: 2px`.
- **Secondary (ghost sage):** transparent bg, 1.5px solid `#9CB86F`, charcoal text, hover bg `#EEF3E2`, active bg `#E4EED4`. Same radius / height as primary.
- **Gold link pill** (used on location pills): cream bg, 1px gold hairline, charcoal text, hover bg `#F6E7BF`, `rounded-full`, `padding: 10px 16px`, min-height 44px.
- **Nav link:** charcoal 70%, hover charcoal + 2px sage underline from the bottom, animated via `transform: scaleX(0 → 1)` on a pseudo-element.

#### Section backgrounds (vertical rhythm)
1. Header: cream `#FDF8EE` + hairline
2. Hero: cream with radial gold-sage wash
3. ServiceArea: cream + faint chevron weave + bunting strip
4. ProductGrid: cream `#FDF8EE` plain
5. AdditionalRentals: sage wash `#EEF3E2`
6. ThreeStepProcess: cream-50 `#FBF1DC`
7. CustomerGallery: cream `#FDF8EE` + Google review bar
8. LocationFAQ (loc pages): cream-50
9. Footer: charcoal `#2A2620`

Alternating cream / cream-50 / sage-wash gives vertical rhythm with zero dead whitespace.

#### Image treatment
- All product + gallery images use the wixstatic URLs in `reference-research.md` verbatim. No placeholder services.
- Every image over a light section: `linear-gradient(180deg, transparent 60%, rgba(42,38,32,0.12) 100%)` overlay.
- Hero product trio: each on a sage/cream organic blob SVG backdrop that echoes the brand asset (`brand_assets/pasted-image-1776228322373.png`) — gold blob behind the table, sage blob behind the chiavari.
- Masonry images: 16px radius, transform hover only.

### 4.5 Three Unique Visual Elements (required — differentiators)

1. **Draped fabric arch** — a scalloped cream-cloth SVG spanning the top of the hero and inverted at the top of the footer. It reads instantly as "kenduri table skirting" and no existing site in the system uses a fabric motif. This is the primary visual signature.
2. **Bunga manggar corner ornament** — the gold palm-frond wedding ornament drawn as a compact 48×48 SVG, placed at the junction of ThreeStepProcess timeline circles and at the bottom-right corner of each location pill cluster. Unique Malay wedding cultural marker.
3. **Kenduri bunting strip** — a row of alternating gold / sage / cream triangle flags on a gold hairline string, used at the top of ServiceArea. No other site uses bunting/festoon ornament.

Supporting motifs (not counted in the 3 but reinforce the identity): scalloped gold ticket price tag on the hero, chevron-weave background on the ServiceArea, sage+cream organic blobs behind product images.

---

## 5. Design Review Checklist (completed)

- [x] Hero layout differs from all existing sites — draped-fabric centered editorial is not used anywhere in `projects/*`.
- [x] Color palette does not repeat any existing site — cream + honey gold + sage + charcoal is distinct from teal, navy+orange, orange+slate, gunmetal+yellow, navy+orange-mascot, and hollywood black+metallic-gold.
- [x] Typography pairing is unique within the system — Inter-only with a bespoke 10-token scale (display 56, tight `-0.025em` tracking). No other site has this exact scale. Serif heading rule overridden per user memory.
- [x] Card/component styles are visually distinct — image-forward cards with 24px radius, gold hairline, sage+gold layered shadow, 2-row plain/with-cover pricing mini-table. Different from sewa-motor gradient-stripe, roller-shutter metallic-border, oxihome standard, service-aircond 2x2-icon.
- [x] Section ordering follows architecture parity list exactly — homepage and location pages are identical except for the LocationFAQ insertion and city-specific H1.
- [x] Design fits product category + audience — festive, celebratory, warm, Malay-kenduri-coded, trustworthy for families planning majlis.
- [x] Brand assets incorporated — `brand_assets/pasted-image-1776228322373.png` informs the sage+gold blob language; all product and gallery images pull directly from the wixstatic URLs listed in `reference-research.md`.
- [x] Mobile-first responsive approach specified — drape scales to 40px, hero stacks, cards stack, masonry becomes marquee, tap targets ≥44px.
- [x] Accessibility — cream `#FDF8EE` vs charcoal `#2A2620` contrast 13.2:1 (AAA); charcoal-70 on cream 9.3:1 (AAA); WhatsApp `#25D366` + white 2.86:1 — we compensate with white `font-weight 600` + 15px + shadow border for WCAG AA Large on the pill (acceptable because it's a button at 44px tall). Focus outlines on every interactive element.
- [x] User design rules honoured — WhatsApp `#25D366` only, WhatsApp opens in new tab, Inter-only globally (no serif), real wixstatic images, Google review branding in gallery section, exactly 3 process steps, no empty spaces (dense hero + alternating section rhythm), unique layout vs every project in `projects/*`.

---

## 6. Mobile Considerations

- **Hero drape:** scales from 64px to 40px height; fabric scallops stay crisp via SVG (not PNG). The product trio becomes a single horizontal snap-scroll strip (`scroll-snap-type: x mandatory`, hidden scrollbar).
- **Equal-height cards:** every grid row uses `h-full` on card wrappers so no card is taller than its sibling. ProductGrid stacks to 1-col at `<768px`; AdditionalRentals stacks to 1-col at `<640px`. ThreeStepProcess stacks vertically with a 1px vertical hairline in place of the desktop horizontal timeline.
- **Marquee gallery (no visible scrollbar):** CustomerGallery masonry transforms into a horizontal auto-scrolling marquee on viewports `<768px`. CSS: `@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`, `animation: scroll 40s linear infinite`, `animation-play-state: paused on :hover`. Scrollbar hidden: `scrollbar-width: none; ::-webkit-scrollbar { display: none }`.
- **44px tap targets:** every button, pill, nav link, accordion header, and location pill has `min-height: 44px` and `min-width: 44px`. WhatsApp CTAs on mobile are full-width (`w-full` on `<md`).
- **No horizontal overflow:** the draped SVG, bunga manggar glyphs, and gold ticket tag are all contained inside `overflow-hidden` parents. Ticket tag `12deg` rotation is constrained within a non-overflowing wrapper so it cannot push the viewport.
- **Stacking order:** `ServiceArea` pill-cloud wraps naturally; state H3s stack above pill rows. `ProductGrid` → 1 col. `ThreeStepProcess` → vertical. `InlineFooter` → 1 col with WhatsApp block last for thumb reach.
- **Readable type on mobile:** display 32px, H2 26px, body 15px, captions 12px — all above the Kagura minimums.
- **Image sizing:** `next/image` with explicit `sizes` attributes so the wixstatic source is responsive; hero trio uses `sizes="(max-width: 768px) 100vw, 33vw"`; masonry uses `sizes="(max-width: 768px) 60vw, 25vw"`; gallery marquee fixes each item to `240px` wide.
- **Language switcher on mobile:** lives inside the hamburger drawer + repeated in the footer; preserves path per architecture.

---

**Hand-off note to builder:** implement with Tailwind v4 using `@theme inline` CSS variables from Section 4.2, load Inter via `next/font/google` in `app/layout.tsx` exactly once, register the drape SVG + bunga manggar SVG + bunting SVG as inline React components in `components/ui/ornaments/`, keep every WhatsApp CTA wired through `/[locale]/redirect-whatsapp-1?loc={slug}` with `target="_blank" rel="noopener"`, and reuse the same `Hero` composition for `LocationHero` swapping only the H1 + sub + ticket-tag copy.
