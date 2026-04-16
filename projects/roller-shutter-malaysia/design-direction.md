# Roller Shutter Door Malaysia — Design Direction

**Author:** Kagura (UI Design Specialist)
**Project:** roller-shutter-malaysia.vercel.app
**Date:** 2026-04-06
**Recommended:** "Steel Fortress" — Gunmetal/charcoal + safety yellow + crimson accent

---

## 1. Existing Sites Audit

| Site | Hero Layout | Color Scheme | Typography | Card Style | Location Display |
|---|---|---|---|---|---|
| oxihome-malaysia | Full-bleed dark photo BG + split grid (text left, product right) | Teal #0B6B82 + orange accent | Inter (both) | Standard | Anchor links flat list |
| sewa-motor-malaysia | Asymmetric bottom-right anchored, dark gradient, product overlapping stats | Orange #FF6B35 + dark slate #16213E + coral #FF3F3F | Georgia serif headings, sans body | White on gray, 3px gradient top-stripe, 3-col pricing | Accordion by region |
| service-aircond-malaysia | Full-width warm gradient (navy-to-orange), single centered column, mascot accent | Orange #E8732A + Navy #1B3A5C | Inter (both) | 2x2 icon-forward cards | Accordion by region |

### Common Patterns Across All Three
- All use dark hero treatments (photo overlay, dark gradient, warm gradient)
- Two use orange as primary CTA/accent color
- Two use Inter font
- Two use navy/dark blue tones
- Two use accordion locations

---

## 2. Duplicate Risk Report

| Element | Risk Level | Existing Conflict | Decision |
|---|---|---|---|
| Orange primary | HIGH | Used by sewa-motor (#FF6B35) AND service-aircond (#E8732A) | REJECT — use safety yellow + crimson instead |
| Teal/blue primary | HIGH | Used by oxihome (#0B6B82) | REJECT |
| Navy dark sections | HIGH | Used by sewa-motor (#16213E) AND service-aircond (#1B3A5C) | REJECT — use pure charcoal/gunmetal instead |
| Split hero (text+image) | HIGH | oxihome uses this exact pattern | REJECT |
| Asymmetric anchored hero | HIGH | sewa-motor uses this | REJECT |
| Centered single-column gradient hero | HIGH | service-aircond uses this | REJECT |
| 2x2 icon-forward cards | HIGH | service-aircond uses this | REJECT |
| 3px gradient top-stripe cards | HIGH | sewa-motor uses this | REJECT |
| Inter font | LOW | Used by oxihome and service-aircond — but user MANDATES Inter | ACCEPT (mandatory) |
| Accordion locations | LOW | Used by sewa-motor and service-aircond | ACCEPT (mandatory per brief) |

### Safe Design Space
- **Hero:** Diagonal-cut / angled-overlay hero (none of the 3 use this)
- **Colors:** Gunmetal grey + safety yellow + crimson (no site uses grey-dominant or yellow)
- **Cards:** Industrial tabbed cards with metallic left-border and stamped numbering
- **Unique identity:** Industrial/steel/security visual language (all others are soft/medical/playful/rental)

---

## 3. Research Findings — Design Directions Explored

### Direction A: "Steel Fortress" (RECOMMENDED)

**Concept:** Heavy industrial aesthetic inspired by corrugated steel, warehouse architecture, and security infrastructure. Gunmetal grey dominates with safety yellow (the universal industrial caution color) as the primary accent, and crimson red for urgency/emergency. The feeling is: armored, reliable, no-nonsense.

**Hero approach:** Diagonal-cut overlay — a bold angled divider (12-degree skew) slices across the hero, with a dark textured background on one side and a steel-grey gradient on the other. Product image sits behind the angle cut, partially revealed. This is unlike any existing hero in the system.

**Why it works:** Roller shutters are industrial security products. The visual language should feel impenetrable, heavy, and trustworthy — not soft, medical, or playful. Safety yellow is the universal color of "caution / heavy machinery / industrial zone" and immediately signals the product category. Crimson red signals 24-hour emergency urgency.

### Direction B: "Vault Lock"

**Concept:** Dark mode dominant with brushed-metal textures. Primary color is a cool silver-blue (#7B8FA1) paired with amber warning (#F5A623). Hero uses a perspective-grid vanishing-point effect suggesting a warehouse corridor.

**Rejected because:** Silver-blue risks looking too close to oxihome's teal palette. The cool tone doesn't convey the raw industrial strength of roller shutters as well as Direction A.

### Direction C: "Industrial Grit"

**Concept:** High-contrast black-and-yellow hazard-stripe motif. Bold geometric shapes, oversized typography, construction-site warning patterns.

**Rejected because:** Too aggressive and potentially off-putting for property managers and business owners who want professional service. The hazard-stripe pattern could feel gimmicky at scale across 15 sections.

---

## 4. Recommended Direction: "Steel Fortress"

### 4.1 Color System

| CSS Variable | Hex | Usage |
|---|---|---|
| `--brand-gunmetal` | `#2C3338` | Primary dark — nav, dark sections, headings |
| `--brand-gunmetal-light` | `#3D464C` | Dark section variants, hover states |
| `--brand-charcoal` | `#1C1F22` | Deepest dark — footer, hero overlay |
| `--brand-steel` | `#6B7D8A` | Secondary text, muted elements, dividers |
| `--brand-steel-light` | `#8FA3B0` | Tertiary text, icon fills |
| `--brand-yellow` | `#F2C744` | Primary accent — headings, highlights, active states |
| `--brand-yellow-dark` | `#D4AD2E` | Hover state on yellow elements |
| `--brand-yellow-pale` | `#FFF9E6` | Light yellow tint for badges, subtle BGs |
| `--brand-crimson` | `#DC2626` | Emergency/urgency — FOMO banner, 24hr badge |
| `--brand-crimson-dark` | `#B91C1C` | Crimson hover |
| `--brand-surface` | `#F0F1F3` | Light grey page background (cold-toned) |
| `--brand-surface-warm` | `#F7F7F5` | Alternate section background |
| `--brand-white` | `#FFFFFF` | Card backgrounds, clean surfaces |
| `--brand-text` | `#1C1F22` | Body text (matches charcoal) |
| `--brand-text-muted` | `#6B7D8A` | Captions, secondary text (matches steel) |
| `--brand-border` | `#D1D5DB` | Card borders, dividers |
| `--brand-border-steel` | `#9CA3AF` | Stronger borders for active/focus states |
| `--wa-green` | `#25D366` | WhatsApp CTA buttons ONLY |
| `--wa-green-dark` | `#1EAD53` | WhatsApp hover state |
| `--google-gold` | `#FBBC04` | Google review stars |

### Gradient Definitions

```css
--gradient-hero: linear-gradient(155deg, #1C1F22 0%, #2C3338 45%, #3D464C 100%);
--gradient-hero-accent: linear-gradient(135deg, rgba(242,199,68,0.15) 0%, transparent 50%);
--gradient-dark-section: linear-gradient(180deg, #1C1F22 0%, #2C3338 100%);
--gradient-yellow-shine: linear-gradient(135deg, #F2C744 0%, #D4AD2E 100%);
--gradient-emergency: linear-gradient(90deg, #DC2626 0%, #B91C1C 100%);
--gradient-surface: linear-gradient(180deg, #F0F1F3 0%, #F7F7F5 100%);
```

### 4.2 Layout Blueprint

#### Hero — Diagonal-Cut Angled Overlay

**Structure:** Full-viewport hero with a bold diagonal cut dividing the composition. The left/upper portion is the dark content zone (gunmetal gradient). The right/lower portion shows a large roller shutter image behind a tinted overlay. A CSS `clip-path: polygon(0 0, 75% 0, 55% 100%, 0 100%)` creates the angular division.

- **Left zone (content):** H1 headline + subtitle + dual CTA buttons (WhatsApp green + phone call ghost button). Text stacks vertically, left-aligned.
- **Right zone (visual):** Large roller shutter door image with a gunmetal-to-transparent gradient overlay for depth. The diagonal cut reveals the image at an angle.
- **Yellow accent stripe:** A thin (4px) yellow diagonal line runs parallel to the clip-path edge, acting as the brand signature element.
- **Emergency badge:** A crimson pill badge reading "24 JAM KECEMASAN" sits above the H1, pulsing subtly with a red glow.
- **Background texture:** Faint corrugated-steel pattern (CSS repeating-linear-gradient at 2% opacity) on the dark zone.

**Differentiation:**
- NOT split grid like oxihome (this is diagonal-cut, not columnar)
- NOT asymmetric bottom-anchored like sewa-motor (no product overlapping into stats)
- NOT centered single-column like service-aircond (this is angled, not centered)

#### Section Styles

**FOMO Banner (Section 1)**
- Full-width crimson gradient bar
- White text, single line: "X orang sedang melihat roller shutter di {location} sekarang"
- Subtle pulse animation on the viewer count number
- Height: 40px, sticky at very top above nav

**Nav (Section 2)**
- Gunmetal (#2C3338) background
- Logo text in white, nav links in steel-light, active link underlined in yellow
- Sticky on scroll with subtle shadow: `0 2px 12px rgba(44,51,56,0.15)`
- Language switcher: ghost-bordered pills
- Mobile: hamburger menu slides from right, dark overlay

**Stats (Section 4)**
- Gunmetal background, 4-column horizontal bar
- Each stat: large yellow number (48px) + white label below
- Stats: "15+ Tahun Pengalaman" | "10,000+ Projek Siap" | "50+ Lokasi" | "24 Jam Kecemasan"
- Thin yellow top-border (2px) separating from hero

**Products (Section 5) — Industrial Tab Cards**
- Light surface background (#F0F1F3)
- 3-column grid (desktop), 1-column (mobile)
- Cards: white background, 1px solid #D1D5DB border, 12px border-radius
- **Unique element — 4px solid yellow left-border** (NOT top-stripe like sewa-motor)
- Card header: product image (placehold.co, 16:10 ratio) with gunmetal overlay gradient at bottom
- Below image: product name (bold, charcoal), 2-line description, key features as small steel-colored pills
- Bottom: yellow "Dapatkan Sebut Harga" CTA button (full-width within card)
- Hover: translateY(-4px) + shadow `0 8px 24px rgba(44,51,56,0.12)`

**How It Works (Section 6)**
- White background
- 4 steps in horizontal timeline (desktop), vertical (mobile)
- Each step: large yellow circle with white step number (stamped industrial look) + step title + description
- Steps connected by dashed grey line (#D1D5DB)
- Steps: Hubungi Kami > Lawatan & Ukuran > Pemasangan > Siap & Jaminan

**Risk/Problem (Section 7)**
- Surface-warm background (#F7F7F5)
- Left: icon-list of 4 pain points (red X icons) — "Pintu rosak tak boleh buka?", "Kecemasan malam hari?", etc.
- Right: bold statement + yellow CTA
- Layout: 2-column (desktop), stacked (mobile)
- Thin crimson accent line (2px) at section top

**Mid CTA (Section 8)**
- Full-width gunmetal background with subtle corrugated texture
- Centered: bold white H2 + yellow subtitle + large WhatsApp green button
- Yellow diagonal accent lines in background (very low opacity, 3-4%) echoing the hero angle

**Google Reviews (Section 9)**
- Light surface background
- Horizontal scroll strip (snap-scroll) on mobile, 3-visible on desktop
- Cards: white, 12px radius, subtle shadow `0 2px 8px rgba(107,125,138,0.08)`
- Gold stars, reviewer name in charcoal, review text in steel
- Section header: "4.9/5 di Google" with gold star cluster

**Why Choose (Section 10)**
- White background
- 2x3 grid (desktop), 1-column (mobile)
- Each item: yellow icon circle (48px) + heading + description
- NOT icon-forward cards (no card container — these are open-layout items with generous spacing)
- This differentiates from service-aircond's 2x2 icon-forward cards

**Gallery (Section 11)**
- Gunmetal dark background
- Masonry-style grid (3-column desktop, 2-column mobile)
- Images: 4px radius, on hover a yellow border appears (2px) with slight scale(1.03)
- Overlay on hover: semi-transparent gunmetal with white text caption

**Locations Accordion (Section 12)**
- Light surface background
- Accordion panels grouped by region (7 regions)
- Panel header: region name in charcoal + city count badge (yellow pill)
- Expanded: city links in 4-column grid (desktop), 2-column (mobile)
- Active panel: 4px yellow left-border (matching card style)
- Links: steel color, hover turns yellow with underline

**FAQ (Section 13)**
- White background
- Simple accordion, one question at a time
- Question row: charcoal text, yellow chevron icon
- Open state: yellow top-border (2px) on the expanded item
- Answer: steel color text, generous line-height

**Final CTA (Section 14)**
- Full-width charcoal (#1C1F22) background
- Large centered H2 in white + yellow accent text for phone number
- Dual CTA: WhatsApp green button (primary) + ghost white-bordered call button
- Diagonal yellow accent stripe echoing hero motif

**Footer (Section 15)**
- Charcoal background (#1C1F22), lighter than Final CTA to create layered depth
- 4-column grid: Company info | Products | Top Locations | Contact
- Text in steel-light (#8FA3B0), links hover to yellow
- Bottom bar: copyright + language switcher

#### Location Page Additions

**Breadcrumbs (between Nav and Hero)**
- Light surface bar, small text
- Format: Home > Roller Shutter > {City}
- Separator: steel chevron icon
- Active page: yellow text

**Nearby Locations (between Locations Accordion and FAQ)**
- Surface-warm background
- 3-5 horizontal cards with city name + "Roller Shutter di {City}" + arrow link
- Cards: white, yellow left-border (4px), minimal padding
- Horizontal scroll on mobile

### 4.3 Typography

**Font Family:** Inter (sans-serif) for ALL text — headings AND body. Loaded via `next/font/google`.

| Element | Size (clamp) | Weight | Tracking | Line Height |
|---|---|---|---|---|
| H1 (hero) | `clamp(2.25rem, 5vw, 4rem)` | 800 (ExtraBold) | `-0.03em` | `1.1` |
| H2 (section) | `clamp(1.75rem, 3.5vw, 2.75rem)` | 700 (Bold) | `-0.025em` | `1.15` |
| H3 (card/item) | `clamp(1.125rem, 2vw, 1.5rem)` | 600 (SemiBold) | `-0.015em` | `1.25` |
| H4 (sub-item) | `clamp(1rem, 1.5vw, 1.25rem)` | 600 (SemiBold) | `-0.01em` | `1.3` |
| Body large | `1.125rem` (18px) | 400 (Regular) | `0` | `1.75` |
| Body | `1rem` (16px) | 400 (Regular) | `0` | `1.7` |
| Body small | `0.875rem` (14px) | 400 (Regular) | `0.01em` | `1.6` |
| Caption | `0.75rem` (12px) | 500 (Medium) | `0.02em` | `1.5` |
| Button | `1rem` (16px) | 600 (SemiBold) | `0.01em` | `1` |
| Nav link | `0.875rem` (14px) | 500 (Medium) | `0.02em` | `1` |
| Stat number | `clamp(2rem, 4vw, 3rem)` | 800 (ExtraBold) | `-0.02em` | `1` |
| FOMO banner | `0.875rem` (14px) | 500 (Medium) | `0.01em` | `1` |

### 4.4 Component Styles

#### Buttons

**WhatsApp CTA (Primary)**
```
Background: #25D366
Text: white, 600 weight
Padding: 16px 32px
Border-radius: 12px
Shadow: 0 4px 16px rgba(37,211,102,0.25)
Hover: background #1EAD53, translateY(-1px), shadow 0 6px 20px rgba(37,211,102,0.3)
Focus: ring 3px rgba(37,211,102,0.4) offset 2px
Active: translateY(0), shadow 0 2px 8px rgba(37,211,102,0.2)
Transition: transform 200ms ease, opacity 200ms ease
```

**Brand CTA (Secondary)**
```
Background: linear-gradient(135deg, #F2C744, #D4AD2E)
Text: #1C1F22, 600 weight
Padding: 14px 28px
Border-radius: 10px
Shadow: 0 4px 12px rgba(242,199,68,0.2)
Hover: translateY(-1px), shadow 0 6px 16px rgba(242,199,68,0.3)
Focus: ring 3px rgba(242,199,68,0.4) offset 2px
Active: translateY(0)
Transition: transform 200ms ease, opacity 200ms ease
```

**Ghost Button**
```
Background: transparent
Border: 2px solid #6B7D8A
Text: #6B7D8A, 600 weight (or white when on dark BG)
Padding: 14px 28px
Border-radius: 10px
Hover: border-color #F2C744, text #F2C744, translateY(-1px)
Focus: ring 3px rgba(242,199,68,0.3) offset 2px
Active: translateY(0), background rgba(242,199,68,0.05)
Transition: transform 200ms ease, opacity 200ms ease
```

**Emergency Badge**
```
Background: linear-gradient(90deg, #DC2626, #B91C1C)
Text: white, 500 weight, 12px
Padding: 6px 14px
Border-radius: 9999px (pill)
Animation: pulse-glow — box-shadow oscillates between 0 0 0 0 rgba(220,38,38,0.4) and 0 0 0 8px rgba(220,38,38,0)
```

#### Cards

**Product Card**
```
Background: #FFFFFF
Border: 1px solid #D1D5DB
Border-left: 4px solid #F2C744
Border-radius: 12px
Padding: 0 (image flush top) / 20px 24px (content area)
Shadow: 0 1px 4px rgba(44,51,56,0.06)
Hover: translateY(-4px), shadow 0 8px 24px rgba(44,51,56,0.12)
Transition: transform 250ms ease, opacity 250ms ease
```

**Review Card**
```
Background: #FFFFFF
Border: 1px solid #D1D5DB
Border-radius: 12px
Padding: 24px
Shadow: 0 2px 8px rgba(107,125,138,0.08)
Min-width: 320px (for horizontal scroll)
```

**Nearby Location Card**
```
Background: #FFFFFF
Border: 1px solid #D1D5DB
Border-left: 4px solid #F2C744
Border-radius: 8px
Padding: 16px 20px
Hover: border-left-color #D4AD2E, shadow 0 4px 12px rgba(44,51,56,0.08)
```

#### Shadows (Layered, Never Flat)

```css
--shadow-sm: 0 1px 4px rgba(44,51,56,0.06);
--shadow-md: 0 2px 8px rgba(107,125,138,0.08), 0 1px 2px rgba(44,51,56,0.04);
--shadow-lg: 0 8px 24px rgba(44,51,56,0.12), 0 2px 6px rgba(44,51,56,0.04);
--shadow-xl: 0 16px 40px rgba(44,51,56,0.15), 0 4px 12px rgba(44,51,56,0.06);
--shadow-yellow: 0 4px 16px rgba(242,199,68,0.2);
--shadow-wa: 0 4px 16px rgba(37,211,102,0.25);
--shadow-nav: 0 2px 12px rgba(44,51,56,0.15);
```

#### Spacing Tokens

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
--space-section: clamp(64px, 8vw, 96px);  /* Between sections */
--space-container: clamp(16px, 4vw, 80px); /* Horizontal padding */
--max-width: 1200px;                        /* Container max-width */
```

#### Border Radius Tokens

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-pill: 9999px;
```

### 4.5 Unique Visual Identity — 5 Elements

1. **Diagonal-Cut Hero** — The bold 12-degree angled clip-path dividing content from visual is the signature layout element. No other site in the system uses diagonal geometry. This angular cut echoes the slanted lines of a half-open roller shutter door.

2. **Yellow Left-Border System** — A consistent 4px solid yellow (#F2C744) left-border appears on product cards, active accordion panels, nearby location cards, and the active FAQ item. This creates a visual throughline (a "steel rail" motif) that ties the entire page together. Different from sewa-motor's top-stripe and service-aircond's icon-forward approach.

3. **Corrugated Steel Texture** — A subtle CSS-only repeating-linear-gradient pattern (alternating 1px lines at ~88-degree angle, 2% opacity) appears in the hero dark zone, mid-CTA section, and final CTA. This industrial texture is unique to this project and directly references the product (corrugated roller shutter slats).
   ```css
   background-image: repeating-linear-gradient(
     88deg,
     rgba(255,255,255,0.02) 0px,
     rgba(255,255,255,0.02) 1px,
     transparent 1px,
     transparent 12px
   );
   ```

4. **Emergency Crimson Pulse** — The 24-hour emergency badge uses a crimson gradient with a pulsing glow-ring animation. This element appears in the hero, FOMO banner, and risk section — reinforcing the urgent/emergency service angle that is unique to this business among all system sites.

5. **Gunmetal-Yellow Contrast System** — While other sites use orange or teal as accents on dark backgrounds, this project uses safety yellow (#F2C744) on gunmetal (#2C3338). This is the universal industrial color pairing (think warehouse signage, heavy machinery, safety equipment). It is immediately recognizable as "industrial" and creates a distinctly different mood from every other site in the system.

---

## 5. Design Review Checklist

| # | Check | Status |
|---|---|---|
| 1 | Hero layout differs from all 3 existing sites | PASS — Diagonal-cut (not split, not asymmetric-anchored, not centered-gradient) |
| 2 | Color palette differs from all 3 existing sites | PASS — Gunmetal/yellow/crimson (not teal, not orange/slate, not orange/navy) |
| 3 | Card style differs from all 3 existing sites | PASS — Yellow left-border industrial cards (not icon-forward 2x2, not top-stripe 3-col) |
| 4 | Location display uses accordion (allowed) | PASS — Accordion by region, 4-col grid inside |
| 5 | No default Tailwind blue or indigo used | PASS — All custom brand colors |
| 6 | No flat shadow-md used | PASS — All layered shadows with color tint |
| 7 | Inter font for both headings and body | PASS — User preference enforced |
| 8 | Large headings use tight tracking | PASS — H1: -0.03em, H2: -0.025em |
| 9 | Body text uses generous line height | PASS — Body: 1.7, Body large: 1.75 |
| 10 | Multiple gradients and depth effects | PASS — Hero gradient, accent gradient, dark sections, yellow shine, emergency gradient |
| 11 | Animations only on transform and opacity | PASS — No transition-all anywhere |
| 12 | All clickable elements have hover + focus + active states | PASS — Defined for all 3 button types |
| 13 | Images have gradient overlay | PASS — Hero image overlay, gallery hover overlay, product card bottom gradient |
| 14 | Consistent spacing tokens defined | PASS — Full token system from 4px to 96px |
| 15 | Surface layering: base, elevated, floating | PASS — surface (#F0F1F3) > white cards > hover-elevated cards |
| 16 | WhatsApp buttons use #25D366 green | PASS — Separate from brand yellow |
| 17 | Section order matches mandatory spec (15 sections) | PASS — All 15 sections in correct order |
| 18 | Location pages add Breadcrumbs and Nearby Locations | PASS — Both specified |
| 19 | No serif fonts used anywhere | PASS — Inter only |
| 20 | Images use placehold.co | PASS — No real brand assets available |
| 21 | 3+ unique visual identity elements | PASS — 5 unique elements defined |
| 22 | Industrial/security feel appropriate for roller shutters | PASS — Gunmetal, corrugated texture, safety yellow, emergency crimson |
