# Encik Beku — Design Direction
**Project:** serviceaircond.my  
**Reviewed by:** Kagura (UI Design Specialist)  
**Date:** 2026-04-01  

---

## 1. Duplicate Detection Report

### Existing Sites Audit

| Site | Hero Layout | Color Scheme | Typography | Location Display |
|---|---|---|---|---|
| oxihome.my | Full-bleed dark photo BG + split grid (text left, product image right) | Teal/ocean blue #0B6B82 + orange accent | Inter (single font, both headings and body) | Anchor links — flat list |
| sewamotor.my | Dark overlay hero, single column centered | Orange/black, Georgian serif headings | Georgia serif h1-h6, system sans body | Footer links only |
| cpapmachine.my | Blue medical gradient, product-focused | Blue medical palette | Standard sans-serif | Card grid |

### Conflict Assessment

| Element | Risk | Verdict |
|---|---|---|
| Orange primary color | sewamotor.my also uses orange/black | SAFE — Encik Beku is orange+navy, not orange+black. Totally different personality |
| Split hero | oxihome.my uses text-left, image-right | AVOID — do not use split hero for Encik Beku |
| Card grid for locations | cpapmachine.my uses card grid | AVOID — use a different location display format |
| Inter font | oxihome.my uses Inter | AVOID — choose a different font family |
| Serif headings | sewamotor.my uses Georgia serif | AVOID — choose a different heading approach |
| Dark hero overlay | All three sites use dark hero | AVOID — explore an alternative hero treatment |

---

## 2. Visual Direction

### Core Concept: "The Friendly Local Expert"

Encik Beku is a mascot-led brand — a cheerful uniformed technician with a wrench. The design must reflect that warmth. The concept is **"neighbourhood workshop meets professional service"**: approachable but competent, local but polished, warm but clean.

The visual language uses **warm light** (oranges, soft creams, navy depth) with a **workshop-blueprint undertone** — subtle grid lines and geometric patterns evoke technical precision without being cold or corporate.

---

## 3. Layout Blueprint

### Hero — Full-Width Warm Gradient (NOT split, NOT full-bleed dark photo)

- **Layout:** Single centered column — no image column. The mascot character stands as a large decorative figure to the right, but floats **outside the grid** as an oversized accent, not a constrained content column.
- **Background:** Warm gradient from deep navy (#1B3A5C) at top-left to a rich orange (#E8732A) burst at bottom-right. NOT a full-bleed photograph overlay.
- **Subtle texture:** A faint isometric grid pattern (very low opacity, 4–6%) drawn in CSS as a background-image using SVG data URI — evokes technical/engineering precision.
- **H1 treatment:** Large, centered, white — font size 64px–80px (clamp). Short line: ~4–5 words per line.
- **CTA button:** WhatsApp green, large pill shape, centered with a subtle pulsing glow ring animation.
- **Mascot placement:** The Encik Beku character (technician with wrench) is positioned at the right edge of the viewport, partially cropped, at ~80vh tall. He "stands in the scene" rather than being in a box.
- **Differentiator from oxihome:** No image column. Gradient hero not photo hero. Mascot decorative, not product-display.
- **Differentiator from sewamotor:** Warm orange/navy vs dark-on-black. Centered layout vs moody dramatic layout. Playful vs aggressive tone.

### Section Order

```
1. Nav bar          — logo + lang switcher + sticky WhatsApp button
2. Hero             — gradient, centered, mascot accent
3. Stats bar        — horizontal 4-up, orange/navy contrast
4. Services         — 2x2 grid with icon-forward cards (not image cards)
5. Why Choose       — alternating icon+text list with orange accent line
6. How It Works     — 3 numbered steps in horizontal timeline (desktop) / vertical (mobile)
7. Reviews          — horizontal scroll card strip, NOT a grid
8. Location grid    — accordion grouped by region, NOT a card grid
9. Final CTA        — full-width navy banner with mascot silhouette watermark
10. Footer          — clean two-column: links left, WhatsApp CTA right
```

### Location Grid — Accordion by Region (NOT card grid, NOT flat list)

Instead of a grid of 38 city cards (used by cpapmachine) or a flat anchor list (oxihome), the location section uses a **regional accordion**:

- 5 regional panels: Klang Valley, Northern, Southern, East Coast, East Malaysia
- Each panel expands to show city links in a 3-column inline grid
- Panel header shows region name + city count badge
- Active region is highlighted with orange left-border
- Links are text-only with orange hover underline — no card borders, no shadows
- This keeps the section compact while serving 38+ cities cleanly

---

## 4. Color System

### Palette

| Token | Value | Usage |
|---|---|---|
| `--brand-orange` | `#E8732A` | Primary CTA, active states, accent marks, section underlines |
| `--brand-orange-light` | `#F9A96A` | Hover tints, gradient midpoint |
| `--brand-orange-xs` | `#FEF3EB` | Orange-tinted backgrounds, card fills |
| `--brand-navy` | `#1B3A5C` | Page backgrounds (dark sections), headings on light, footer |
| `--brand-navy-mid` | `#2A5280` | Secondary dark, card headers, nav |
| `--brand-sky` | `#7EC8E3` | Accent on dark backgrounds, icon fills, step numbers |
| `--brand-sky-xs` | `#EDF8FC` | Light tinted backgrounds |
| `--brand-cream` | `#FFFAF5` | Page body background (warm white, not pure white) |
| `--brand-text` | `#1C2B3A` | Body text (dark navy-tinted, not pure black) |
| `--brand-text-muted` | `#607080` | Secondary text, captions |
| `--brand-border` | `#E2EBF0` | Dividers, card outlines |
| `--wa-green` | `#25D366` | WhatsApp CTA only |

### Color Combinations by Section

| Section | BG | Heading | Body text | Accent |
|---|---|---|---|---|
| Hero | navy→orange gradient | white | white 80% | sky blue |
| Stats bar | navy solid | white | sky blue | orange numbers |
| Services | cream (#FFFAF5) | navy | text-dark | orange icon bg |
| Why Choose | white | navy | text-dark | orange left-rule |
| How It Works | orange-xs (#FEF3EB) | navy | text-dark | navy step numbers |
| Reviews | navy solid | white | white 80% | orange star/accent |
| Location | cream | navy | text-dark | orange hover |
| Final CTA | navy | white | white 80% | orange button |
| Footer | #0F2740 (deep navy) | white | white 60% | orange links |

---

## 5. Typography

### Font Stack

All existing sites are disqualified:
- Inter — used by oxihome.my
- Georgia/serif — used by sewamotor.my
- Quicksand, Sora, Cormorant Garamond — disqualified per brief

**Chosen pair:**

| Role | Font | Source | Rationale |
|---|---|---|---|
| Headings (display) | **Plus Jakarta Sans** | Google Fonts | Geometric humanist sans with personality. Clean but warm. Not Inter. The rounded geometry matches the friendly mascot brand. |
| Body | **DM Sans** | Google Fonts | Paired companion to Jakarta Sans. Slightly looser, very legible at small sizes. Distinct from Inter and system sans. |

**Import:**
```
https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;1,9..40,400&display=swap
```

### Type Scale

| Token | Size | Weight | Font | Usage |
|---|---|---|---|---|
| `--text-hero` | clamp(48px, 7vw, 80px) | 800 | Plus Jakarta Sans | Hero H1 |
| `--text-h2` | clamp(28px, 4vw, 40px) | 700 | Plus Jakarta Sans | Section headings |
| `--text-h3` | clamp(20px, 2.5vw, 26px) | 600 | Plus Jakarta Sans | Card titles, sub-headings |
| `--text-body-lg` | 18px | 400 | DM Sans | Hero subheadline, intro paras |
| `--text-body` | 16px | 400 | DM Sans | Body copy |
| `--text-sm` | 14px | 400/500 | DM Sans | Labels, badges, captions |
| `--text-xs` | 12px | 500 | DM Sans | Fine print, microcopy |

**Letter spacing:**
- Hero H1: `letter-spacing: -0.03em` — tight, impactful
- Section H2: `letter-spacing: -0.02em`
- Body: `letter-spacing: 0` — natural
- Labels/badges: `letter-spacing: 0.06em; text-transform: uppercase`

**Line height:**
- Headings: 1.15
- Body: 1.75 (generous — approachable, easy to read)

---

## 6. Component Styles

### Service Cards (2×2 grid)

- **Shape:** Rounded rectangle, `border-radius: 20px`
- **Background:** White elevated on `--brand-cream` page background
- **Left accent:** 4px left border in `--brand-orange` (NOT a top border like typical cards)
- **Icon:** 48×48px circle background in `--brand-orange-xs`, icon in `--brand-orange`
- **Shadow:** `0 2px 8px rgba(27,58,92,0.06), 0 8px 32px rgba(27,58,92,0.1)` — navy-tinted shadow (NOT gray)
- **Hover state:** `transform: translateY(-4px)`, shadow deepens to `0 16px 48px rgba(27,58,92,0.16)`, left border brightens
- **No images** inside service cards — icon-forward design (cleaner than product image cards used in other sites)

### Buttons

**Primary CTA (WhatsApp):**
- Pill shape: `border-radius: 100px`
- BG: `--wa-green`
- Text: white, `DM Sans`, 500 weight, 16px
- Shadow: `0 8px 24px rgba(37,211,102,0.35)` — colored shadow
- Hover: `transform: scale(1.04)`, shadow `0 12px 36px rgba(37,211,102,0.5)`
- Active: `transform: scale(0.97)`
- Pulse ring on hero CTA: `@keyframes pulse-ring` expanding transparent border

**Secondary CTA:**
- Outlined, `border: 2px solid --brand-orange`
- Text: `--brand-orange`
- Hover: BG fills to orange, text becomes white
- No pill — uses `border-radius: 12px` (distinct from primary)

**Icon buttons / nav:**
- `border-radius: 8px`
- Hover BG: `--brand-orange-xs`
- Active: slight scale-down

### Stats Bar

- Full-width navy background
- 4 columns on desktop, 2×2 grid on mobile
- Numbers: Plus Jakarta Sans 800 weight, 48px, `--brand-orange`
- Labels: DM Sans, uppercase tracking, `--brand-sky` (light blue on navy)
- Vertical dividers between stats: 1px `rgba(255,255,255,0.12)`

### How It Works — Timeline Steps

- Horizontal arrow-connected steps on desktop (3 nodes)
- Node: circle with step number in `--brand-navy`, outlined in `--brand-orange`
- Connector: dashed orange line between nodes
- Step title: Plus Jakarta Sans 700
- Step description: DM Sans 400
- On mobile: vertical stack with orange left line connector

### Review Cards — Horizontal Scroll Strip

- Dark navy card (`--brand-navy-mid` background)
- White quote text
- Orange star icons (⭐ replaced with SVG stars in `--brand-orange`)
- Reviewer name: white 700 weight
- Location: `--brand-sky` (light blue)
- Card border: `1px solid rgba(126,200,227,0.15)`
- Cards overflow horizontally on mobile (scroll container, no pagination arrows needed)
- On desktop: 3 cards in a fixed grid row

### Navigation Bar

- Sticky, `background: rgba(27,58,92,0.95)`, `backdrop-filter: blur(16px)`
- Logo left (Encik Beku mascot + wordmark)
- Right: Language switcher + WhatsApp button (compact pill, always visible)
- Mobile: hamburger → full-screen overlay in navy
- Active nav link: `--brand-orange` underline, 2px

---

## 7. Section Transitions and Visual Flow

### Alternating rhythm

The page uses deliberate BG alternation to create visual breathing room:

```
Hero        → navy gradient
Stats bar   → navy (continues)
Services    → cream (light, open)
Why Choose  → white
How It Works→ orange-tinted cream (warm interlude)
Reviews     → navy (dark contrast)
Locations   → cream (light, functional)
Final CTA   → navy (strong close)
Footer      → deep navy
```

### Section separators

Avoid full-width horizontal rules. Instead:
- Light sections end with a subtle orange dot row (3 dots, centered) as a visual "breath mark"
- Dark-to-light transitions use a CSS clip-path `polygon` wave (gentle, not a sharp diagonal)
- Light-to-dark transitions use a straight edge but with the dark section having a top-gradient fade-in of 40px

---

## 8. Unique Identity Elements

### Unique Element 1 — The Mascot as Active Design Element

The Encik Beku technician mascot (from the logo: uniformed figure with wrench in an orange hexagon badge) is used as an oversized decorative element in two places:
1. **Hero section**: Full-height mascot figure (cropped at shoulder height) floats at the right edge of the viewport. Uses `position: absolute; right: -2%; bottom: 0; height: 85vh` with `object-fit: contain; object-position: bottom`. On mobile it becomes a 200px figure above the CTA text.
2. **Final CTA section**: Faint navy-tinted silhouette watermark (50% opacity, desaturated) behind the CTA text, centered.

No other site in this system uses a mascot character this way. This gives Encik Beku an immediately recognizable, personality-driven identity.

### Unique Element 2 — Blueprint Grid Texture

A very faint isometric dot grid (4px dot spacing, opacity 5%) is applied as a CSS `background-image` using an SVG data URI across the cream-background sections. This creates a subtle "technical blueprint" feel that:
- References the technical precision of aircond work
- Is completely invisible to casual viewers but adds texture depth
- No other site in this system uses this treatment

CSS implementation:
```css
.blueprint-texture {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1.2' fill='%231B3A5C' fill-opacity='0.07'/%3E%3C/svg%3E");
  background-repeat: repeat;
}
```

### Unique Element 3 — Regional Accordion Location Section

The location display is neither a card grid (cpapmachine) nor a flat anchor list (oxihome). It uses a **collapsible regional accordion** with:
- 5 region panels, collapsed by default (showing KV expanded on load)
- Region header: navy background, region name + city count pill badge in orange
- Open panel: smooth max-height CSS transition, city names as 3-col inline grid
- Orange left-border on active panel
- City link hover: orange text + orange underline from-left CSS animation

This is both functionally superior (38 cities without overwhelming scroll) and visually distinct.

### Bonus Unique Element — Orange Number Style in Stats

Stats numbers use an outlined/stroke style:
- The large number (e.g. "10,000+") renders in `--brand-orange`
- Below it, a thin 1px orange underline of 40% width (centered) before the label
- Creates a "stamp" quality that matches the technician-badge logo aesthetic

---

## 9. Image Treatment Guidelines

- All images: `border-radius: 16px` (softer corners than medical sites which use sharper borders)
- Overlay gradient on hero images: `linear-gradient(to right, rgba(27,58,92,0.7), transparent)` from left — keeps text readable without full darkness
- Service section: icon-only, no photos (intentional — avoids needing stock imagery)
- Location pages: use CSS gradient background instead of a hero photo (consistent with "local" tone, avoids generic stock)
- Testimonials: reviewer avatar initials in a circular orange badge (no profile photos needed)

---

## 10. Animation Guidelines

Only animate `transform` and `opacity`. Never `transition-all`.

| Element | Animation | Trigger |
|---|---|---|
| Hero CTA button | `transform: scale()` + glow ring pulse | On mount (ring), on hover (scale) |
| Service cards | `transform: translateY(-4px)` | Hover |
| Step circles | `opacity: 0 → 1` + `transform: translateY(20px → 0)` | Scroll into view (stagger 150ms each) |
| Mascot figure | `transform: translateY(-6px)` subtle float | On mount, loop 6s |
| Accordion panels | `max-height` transition | Click |
| WhatsApp sticky button | `transform: scale(1.05)` | Hover |

Respect `prefers-reduced-motion`: all scroll-triggered and loop animations should be wrapped in `@media (prefers-reduced-motion: no-preference)`.

---

## 11. Mobile-First Responsive Strategy

| Breakpoint | Grid | Notes |
|---|---|---|
| < 640px (mobile) | 1 column | Service cards stacked, stats 2×2 |
| 640–1024px (tablet) | 2 columns | Service cards 2×2, stats 4×1 |
| > 1024px (desktop) | Full layout | Mascot visible, 3-col reviews, accordion |

Hero text clamp ensures 48px minimum (never too small on mobile) and 80px maximum (never too large on desktop).

---

## 12. Design Review Checklist

| Check | Status | Notes |
|---|---|---|
| Layout differs from oxihome.my | PASS | No split hero; warm gradient vs dark photo overlay |
| Layout differs from sewamotor.my | PASS | Centered+mascot vs dark moody motorcycle aesthetic |
| Layout differs from cpapmachine.my | PASS | Accordion locations, icon service cards vs product image cards |
| Color unique | PASS | Orange+navy+sky vs teal (oxihome), orange+black (sewamotor), blue (cpap) |
| Typography unique | PASS | Plus Jakarta Sans + DM Sans — none used by other sites |
| Components distinct | PASS | Left-border accent cards, pulsing CTA, accordion locations |
| Mascot integrated | PASS | Oversized hero element + CTA watermark |
| Blueprint texture | PASS | Unique to this site, no other site uses it |
| Fits brand tone | PASS | Warm, friendly, local hero — not corporate or medical |
| Anti-generic guardrails met | PASS | No default Tailwind blue/indigo; layered navy shadows; separate heading/body fonts; no transition-all; interactive states on all clickable elements |

---

*End of Design Direction — Encik Beku (serviceaircond.my)*
