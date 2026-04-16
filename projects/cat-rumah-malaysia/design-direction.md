# Cat Rumah Malaysia — Design Direction

**Author:** Kagura (UI Design Specialist)
**Project:** cat-rumah-malaysia.vercel.app — Malaysian House Painting Service
**Date:** 2026-04-15
**Recommended:** **"Fresh Coat"** — Teal-jade primary + sunlit cream canvas + paint-swatch motif

---

## 1. Existing Sites Audit

I reviewed the design-direction docs (and page layouts where needed) of the closest peers in the system. Quick characterisation of each, so Cat Rumah Malaysia can avoid stepping on any of them:

**oxihome-malaysia (home services).** Teal/ocean `#0B6B82` with orange accent, full-bleed dark photo hero, split grid (text left, product image right), Inter single-font, flat-list locations. The teal-blue is close to our seed `#1FB8A7` — this is the single biggest duplicate risk and drives several decisions below (we shift noticeably towards jade/green and away from blue-teal, and we refuse the split grid hero).

**sewa-motor-malaysia (rental).** Orange `#FF6B35` + dark slate `#16213E` + coral, asymmetric bottom-right hero with product overlap, 3px gradient top-stripe cards, 3-col pricing mini-table, dark gradient hero. Strong masculine/motion vibe. Completely opposite tonal register to house painting.

**service-aircond-malaysia (Encik Beku).** Orange `#E8732A` + navy `#1B3A5C` + sky blue accent, warm navy→orange gradient hero, mascot floats right, icon-forward 2x2 service cards, regional accordion locations, blueprint dot texture, Plus Jakarta + DM Sans pair. Friendly local-expert tone.

**roller-shutter-malaysia (industrial).** Gunmetal `#2C3338` + safety yellow `#F2C744` + crimson, diagonal-cut hero, industrial tabbed cards. Heavy/armoured tone — no overlap.

**sewa-motor vs service-aircond vs oxihome vs roller-shutter** collectively claim: dark-slate hero, navy→orange gradient hero, split photo hero, diagonal-cut hero, asymmetric anchored hero. **All five dark-hero variants are taken.** Cat Rumah needs to go *bright*.

---

## 2. Duplicate Risk Report

| Element | Risk | Conflict | Decision |
|---|---|---|---|
| Teal `#1FB8A7` primary | MEDIUM | oxihome teal `#0B6B82` is blue-teal; ours is noticeably greener/jade | ACCEPT but push towards jade `#17A890` and pair with cream, not navy |
| Dark hero (photo or gradient) | HIGH | all 4 peers do dark heroes | REJECT — use a **light, cream-to-mint hero with real painted-room photo floating on right** |
| Split grid hero (text L / image R) | HIGH | oxihome exact match | REJECT strict split; use a **light canvas hero with a large rounded photo card that floats and breaks the baseline**, asymmetric but not a two-column grid |
| Centered gradient hero | HIGH | service-aircond | REJECT |
| Asymmetric bottom-right anchored | HIGH | sewa-motor | REJECT |
| Diagonal-cut hero | HIGH | roller-shutter | REJECT |
| Orange primary | HIGH | sewa-motor + service-aircond both orange | REJECT — jade-teal primary |
| Navy dark section | HIGH | sewa-motor + service-aircond | REJECT — use charcoal `#1E2430` only for nav/footer, not for whole sections |
| 3px gradient top-stripe card | HIGH | sewa-motor | REJECT |
| Left-border accent card | HIGH | service-aircond | REJECT — use **paint-swatch bottom band** on product cards instead |
| 2x2 icon-forward cards | HIGH | service-aircond | REJECT — product cards must feature real painted-work photos |
| Regional accordion locations | LOW | sewa-motor + service-aircond | ACCEPT (architecturally mandated) but restyle: flat cream panels, jade chevrons, no left-border |
| Mascot figure | LOW | service-aircond owns this | REJECT — no mascot |
| Blueprint dot texture | LOW | service-aircond | REJECT — use **paint-drip SVG accent** instead |
| Inter font everywhere | MANDATORY | oxihome uses Inter too | ACCEPT (user override; differentiation via weight/size/tracking) |

**Safe design space for Cat Rumah Malaysia:**
- Light, airy, cream-canvas dominated page (nobody else is light)
- Jade-teal `#17A890` + warm clay coral `#EC6A4A` secondary + cream `#FBF7F0` (truly different palette)
- Hero with a large floating photo card over a cream-to-mint wash — asymmetric but not gridded
- Paint-swatch colour-chip motif as the signature visual device
- Before/After slider as a distinct unique element no one else has

---

## 3. Directions Explored

### Direction A — "Fresh Coat" (RECOMMENDED)
Bright, optimistic, home-interior-magazine aesthetic. Cream canvas, jade-teal primary, warm clay coral accent. Hero shows a **real freshly-painted living room photo** on a large rounded card floating over a cream-to-mint wash. Signature device: **paint-swatch chips** (vertical stack of 5 coloured rectangles) appearing as a decorative element in the hero, stats bar, and CTA sections. Before/after slider in the Gallery section. Feels like Nippon/Jotun/Dulux consumer marketing.

### Direction B — "Tropical Bungalow"
Warm terracotta + banana-leaf green + rattan beige, rattan-pattern texture, tropical Malaysian kampung tone. Rejected: terracotta edges too close to sewa-motor/service-aircond orange family, and the rattan texture narrows the brand to vernacular homes when customers include modern condos and landed semi-Ds.

### Direction C — "Swatch Grid Monolith"
Brutalist editorial grid with oversized numerals, paint-chip cards as the entire page rhythm. Rejected: too cold for a service business; cuts against the trust/warmth signals that win quote leads.

---

## 4. Recommended Direction — "Fresh Coat" (Full Spec)

### 4.1 Concept

Cat Rumah Malaysia sells the feeling of **"wake up to a new home"** — the before/after transformation that takes just 5 hours. The design language is a **light, airy, magazine-style canvas** built around three devices: a creamy background, a jade-teal primary that reads as "fresh paint just dried", and a recurring **paint-swatch chip stack** motif that ties the visual identity together. Real photography from catrumah.com.my (wixstatic CDN) carries the product trust.

### 4.2 Color System

| CSS Variable | Hex | Usage |
|---|---|---|
| `--brand-jade` | `#17A890` | Primary — headings accent, CTA secondary, active states, icons |
| `--brand-jade-dark` | `#108074` | Hover on primary actions, text on cream |
| `--brand-jade-soft` | `#D7F0EA` | Tinted backgrounds, badge fills, card hover wash |
| `--brand-jade-wash` | `#ECF7F4` | Section alt-background (very subtle mint) |
| `--brand-coral` | `#EC6A4A` | Secondary accent — price stamps, "from RM3.50" highlight, swatch chip |
| `--brand-coral-soft` | `#FDEAE2` | Coral-tinted badge background |
| `--brand-cream` | `#FBF7F0` | Primary page background (warm off-white, NOT pure white) |
| `--brand-cream-elevated` | `#FFFFFF` | Card surfaces, elevated panels |
| `--brand-sand` | `#F1EAD9` | Divider fills, subtle section separators |
| `--brand-charcoal` | `#1E2430` | Nav, footer, heading text on cream |
| `--brand-charcoal-mid` | `#2A313F` | Footer gradient pair, final CTA background |
| `--brand-body` | `#5A6472` | Body copy |
| `--brand-muted` | `#8A94A3` | Captions, labels, metadata |
| `--brand-border` | `#E8ECF1` | Card borders, dividers |
| `--wa-green` | `#25D366` | WhatsApp CTA ONLY |
| `--wa-green-dark` | `#1EAD53` | WhatsApp hover |
| `--google-blue` | `#4285F4` | Google branding in reviews |
| `--google-gold` | `#FBBC04` | Review stars |

**Section background rotation (no empty space rule satisfied):**
```
FomoBanner    → coral #EC6A4A solid
Nav           → cream with 92% opacity + backdrop blur (sticky)
Hero          → cream with jade-wash radial behind floating photo card
Stats         → cream (continues — separated only by paint-swatch divider)
Products      → jade-wash #ECF7F4
HowItWorks    → cream (warm return)
RiskProblem   → white elevated (subtle lift)
MidCta        → jade-dark gradient #108074 → #17A890 (full-width)
GoogleReviews → cream with white elevated cards
WhyChoose     → jade-wash
Gallery       → cream (before/after sliders)
Locations     → white elevated with jade chevrons
FAQ           → cream
FinalCta      → charcoal #1E2430 → charcoal-mid gradient (only dark section on page)
Footer        → charcoal #1E2430
```

No section shares its neighbour's background, so there is zero flat-grey emptiness; the eye always has a tonal step.

### 4.3 Typography (Inter-Only, User Override)

Inter is used globally. Hierarchy is built with weight, size, tracking and colour — no second family.

| Token | Size (clamp) | Weight | Tracking | Line-height | Usage |
|---|---|---|---|---|---|
| `--text-display` | clamp(44px, 6.4vw, 76px) | 800 | -0.035em | 1.05 | Hero H1 |
| `--text-h2` | clamp(30px, 3.8vw, 44px) | 800 | -0.025em | 1.1 | Section headings |
| `--text-h3` | clamp(22px, 2.4vw, 28px) | 700 | -0.015em | 1.2 | Card titles, sub-headings |
| `--text-h4` | 18px | 700 | -0.005em | 1.3 | Stats labels, small titles |
| `--text-lead` | clamp(17px, 1.4vw, 20px) | 400 | 0 | 1.65 | Hero subheadline, intro paras |
| `--text-body` | 16px | 400 | 0 | 1.75 | Body copy |
| `--text-sm` | 14px | 500 | 0.01em | 1.6 | Labels, captions |
| `--text-eyebrow` | 12px | 700 | 0.16em UPPERCASE | 1.4 | Section eyebrow labels above H2 |
| `--text-xs` | 11px | 500 | 0.04em | 1.4 | Microcopy, legal |

**Hero H1 treatment:** the phrase **"Terus Nampak Baru"** wraps in a highlighted jade `background: var(--brand-jade-soft); padding: 0.05em 0.2em; border-radius: 8px;` inline pill — NOT a gradient text. This is a cleaner, magazine-style highlight distinct from sewa-motor's gradient text.

**Price treatment:** "Dari **RM3.50**/sqft" — "RM3.50" rendered at `--text-h2` weight 800 in `--brand-coral`, pinned below the H1 in a flat coral badge `background: var(--brand-coral-soft); color: var(--brand-coral); border-radius: 999px; padding: 8px 18px;`.

### 4.4 Layout Blueprint

#### Hero — "Cream Canvas + Floating Photo Card"
```
┌──────────────────────────────────────────────────────────────┐
│  [eyebrow label]  CAT RUMAH MALAYSIA                         │
│                                                              │
│   Rumah Lama Terus                        ┌───────────────┐  │
│   [Nampak Baru] Dalam                     │               │  │
│   5 Jam!                                  │  real painted │  │
│                                           │  living-room  │  │
│   Dengan Nippon, Jotun & Dulux.           │  photo        │  │
│   Warranty 5 tahun.                       │  (wixstatic)  │  │
│                                           │               │  │
│   [ Dari RM3.50/sqft ]                    │  ┌─ swatch ─┐ │  │
│                                           │  │ 5 chips  │ │  │
│   [ WhatsApp us on +60xxx ]  [ See work ] │  └──────────┘ │  │
│                                           └───────────────┘  │
│     ●●● (paint drip divider)                                 │
└──────────────────────────────────────────────────────────────┘
```
- **Background:** `--brand-cream` base with a soft radial `radial-gradient(ellipse at 72% 50%, var(--brand-jade-soft) 0%, transparent 55%)` behind the photo card — no full-bleed dark photo, no gradient sweep, no diagonal cut.
- **Photo card:** Real wixstatic painted-room image in a `rounded-[32px] overflow-hidden` card, `shadow: 0 24px 48px -16px rgba(23,168,144,0.28), 0 8px 16px -8px rgba(30,36,48,0.08)` — layered jade-tinted shadow.
- **Swatch chips overlap:** A vertical stack of 5 paint-swatch rectangles (12px wide × 56px tall each, stacked horizontally with 2px gap) absolutely positioned at `left: -28px; bottom: 32px` on the photo card, each chip a different brand colour sampled from Nippon/Jotun/Dulux palettes. This is the **signature identity device**.
- **No split grid:** text is 60% column, photo is 55% column — they **overlap** by ~15% horizontally. On mobile, photo card sits above text with swatch chips underneath.

#### Full Homepage Section Order (parity-locked)
```
1.  FomoBanner          — coral, countdown to price increase
2.  Nav (sticky)        — cream w/ blur, logo left, lang switcher + WA pill right
3.  Hero                — cream canvas + floating photo card + swatch chips
4.  Stats               — cream, 4-up, jade numerals + coral underscore
5.  Products (6 cards)  — jade-wash bg, 3-col desktop / 1-col mobile
6.  HowItWorks (3 only) — cream, large numerals + swatch chip connector
7.  RiskProblem         — white elevated, 2-col text+checklist
8.  MidCta              — jade gradient banner full-width
9.  GoogleReviews       — cream, white cards, Google G mark top-left of each
10. WhyChoose           — jade-wash, 4 icon+text blocks
11. Gallery             — cream, before/after slider row (3 sliders)
12. LocationsAccordion  — white elevated, regional groups, jade chevrons
13. FAQ                 — cream, single-column accordion
14. FinalCta            — charcoal gradient, white text, jade button
15. Footer              — charcoal, 4-col links
```
**Location page parity:** same order, insert `Breadcrumbs` directly after Nav, and `NearbyLocations` directly after `LocationsAccordion`. All other sections identical to homepage, identical background rhythm, identical components.

### 4.5 Component Spec Table

| Component | Shape / Radius | Background | Border | Shadow | Hover |
|---|---|---|---|---|---|
| Product card | `rounded-2xl` (20px) | `--brand-cream-elevated` | `1px solid --brand-border` | `0 1px 2px rgba(30,36,48,0.04), 0 12px 32px -12px rgba(23,168,144,0.14)` | `translateY(-4px)`, shadow deepens to jade 0.22 alpha, **bottom swatch band brightens** |
| Product card — image | `rounded-xl` top-only | real wixstatic image | — | — | scale(1.03) 500ms ease |
| Product card — swatch band | 8px bottom strip | 5 paint chips (jade, coral, cream, sand, charcoal) | — | — | band saturates on hover |
| Product card — price | coral pill | `--brand-coral-soft` | — | — | — |
| Primary CTA (WhatsApp) | pill `rounded-full` | `--wa-green` | — | `0 10px 28px rgba(37,211,102,0.35)` | scale(1.04), `0 14px 36px rgba(37,211,102,0.5)` |
| Secondary CTA | `rounded-xl` (12px) | transparent | `2px solid --brand-jade` | — | fill `--brand-jade-soft`, text `--brand-jade-dark` |
| Ghost link | none | — | — | — | underline from-left 300ms transform |
| Stats numeral | — | — | — | — | — |
| Section eyebrow | pill | `--brand-jade-soft` | — | — | — |
| FAQ panel | `rounded-2xl` | `--brand-cream-elevated` | `1px solid --brand-border` | `0 4px 12px rgba(30,36,48,0.04)` | border brightens to jade |
| Location accordion header | `rounded-xl` | `--brand-cream-elevated` | `1px solid --brand-border` | — | chevron rotates, bg → jade-wash |
| Review card | `rounded-2xl` | white | `1px solid --brand-border` | `0 2px 6px rgba(30,36,48,0.04), 0 16px 40px -18px rgba(30,36,48,0.12)` | lift 2px |
| Gallery before/after slider | `rounded-3xl` (24px) | — | — | `0 24px 56px -18px rgba(23,168,144,0.24)` | — |
| FomoBanner | full-width strip | `--brand-coral` | — | — | — |
| MidCta banner | full-width | jade gradient | — | inset `0 0 0 1px rgba(255,255,255,0.08)` | — |

**Interactive states** — all clickable elements must implement:
- `hover:` (visual change)
- `focus-visible:ring-2 ring-offset-2 ring-[--brand-jade]`
- `active:scale-[0.97]`
- Never `transition-all`; use `transition-[transform,opacity,background-color,box-shadow] duration-300 ease-out`.

### 4.6 Section Details

**Stats bar (cream):** 4 cells, no backgrounds, separated by thin 1px vertical dividers in `--brand-border`. Each numeral Inter 800 weight `clamp(40px, 5vw, 60px)` in `--brand-charcoal`. A 2px wide, 24px long coral underline sits directly below each numeral (the **"stamp"**), then the label in `--text-eyebrow` `--brand-muted`. Distinct from service-aircond which uses navy-on-navy with orange numerals — ours is charcoal-on-cream with coral underline stamp.

**Products grid (6 services, jade-wash bg):** 3 columns desktop, 2 tablet, 1 mobile. Each card has real wixstatic image (16:10) on top, title, 2-line description, price "Dari RM X/sqft", WA button, **and the signature 8px swatch-chip band at the very bottom**. The swatch band is the distinguishing card device — nobody else in the system has it.

**HowItWorks — 3 steps (user override):** Cream background. Horizontal 3-column on desktop (vertical mobile). Each step is a large outlined circle `border: 2px solid --brand-jade; width: 88px; height: 88px;` containing Inter 800 48px numeral in `--brand-jade`. Between nodes a **thin dashed jade connector** with a tiny coral swatch chip placed mid-line. Step title in h3 charcoal, description in body. No cards, no boxes — the numerals carry the weight.

**RiskProblem (white elevated):** 2-col. Left: "Tanpa Cat Baru..." problem paragraph. Right: 4-item checklist with red-coral X icons. This differentiates from oxihome's flat text block.

**MidCta (jade gradient full-width):** `background: linear-gradient(135deg, #108074 0%, #17A890 55%, #1EBFA6 100%)`. Large white H2 centred, one WhatsApp green pill. Faint paint-drip SVG outline in top-right at `opacity: 0.12`.

**GoogleReviews (cream with white cards):** Section header includes the **Google G logo** (multi-coloured SVG) next to text "Reviewed on **Google**" in charcoal. Each review card top-left shows a small 20px Google G mark, 5 gold stars `--google-gold`, reviewer initials in a circular jade badge (no photos), quote, name, Malaysian city in `--brand-muted`. Desktop 3-col grid; mobile horizontal snap scroll. This satisfies the "Google Reviews branding" mandate.

**WhyChoose (jade-wash):** 4 blocks in a row: 1) Nippon/Jotun/Dulux brand logo row, 2) 5-year warranty badge, 3) Licensed painters, 4) Price lock. Each block is icon + h3 + 2-line body, no card — just soft vertical dividers.

**Gallery (cream, before/after sliders):** 3 interactive before/after image sliders in a row (desktop), stacked mobile. Each slider is a `rounded-3xl` card with draggable vertical divider, jade handle circle with left/right arrows. Above the sliders an eyebrow "Sebelum & Selepas" and H2. **This is the second signature identity device.**

**LocationsAccordion (white elevated):** Regional groups (Klang Valley / Northern / Southern / East Coast / East Malaysia). Each region is a `rounded-xl` panel with region name + city count pill (jade-soft bg, jade-dark text) and a jade chevron. Expanded panel shows cities in a 3-col inline grid with jade hover underlines. No left-border accents (differentiates from service-aircond).

**FAQ (cream):** Single column, max-width 800px, each Q is an accordion row — left-aligned question in h3 700, jade plus/minus icon right. Panel expand reveals body copy.

**FinalCta (charcoal gradient):** `linear-gradient(160deg, #1E2430 0%, #2A313F 100%)`. White H2, white body, WA green pill, secondary jade outline button. Faint **paint-roller SVG silhouette** in background at 6% opacity.

**Footer (charcoal):** 4 columns — brand/about, services, locations, contact. Logo in cream, links in `rgba(255,255,255,0.65)`, hover `--brand-jade-soft`. Bottom row: copyright + language switcher inline.

### 4.7 Image Treatment
- **Always use real wixstatic images from catrumah.com.my** — never placehold.co.
- All image containers `rounded-2xl` or `rounded-3xl`.
- Hero photo card gets a **subtle inner gradient overlay** `linear-gradient(180deg, transparent 60%, rgba(30,36,48,0.15) 100%)` to give grounding against the cream.
- Product images get a 1px `rgba(30,36,48,0.04)` inner border for edge definition.
- Gallery before/after sliders need **paired** wixstatic images of the same room/wall.
- No stock photography, no icon-only product cards.

### 4.8 Animations (transform + opacity only)

| Element | Animation | Trigger |
|---|---|---|
| Hero photo card | `opacity 0→1` + `translateY(20px → 0)` 800ms | on mount |
| Hero swatch chips | stagger 80ms each `scaleY(0 → 1)` from bottom | on mount |
| WhatsApp button | `scale(1→1.04)` + colour-shadow grow | hover |
| Product card | `translateY(-4px)` + shadow intensify | hover |
| HowItWorks numeral circles | `opacity 0→1 + translateY(12 → 0)` | IntersectionObserver stagger |
| Before/after slider handle | `scale(1.08)` | hover |
| MidCta paint-drip svg | `translateY -6px` loop 8s | mount |
| Accordion chevron | `rotate(0→180deg)` | click |

Wrap scroll/loop animations in `@media (prefers-reduced-motion: no-preference)`.

---

## 5. Unique Visual Identity Elements

### 5.1 Paint-Swatch Chip Stack (SIGNATURE)
A vertical row of 5 coloured rectangles (12 × 56px, 2px gap) sampled from the Nippon/Jotun/Dulux palettes (jade, coral, cream, sand, charcoal). This motif repeats:
- overlapping the hero photo card (left edge, bottom)
- as the 8px bottom band on every product card
- as a mid-line accent on HowItWorks connectors
- as the FomoBanner divider motif

No other site in `/projects/` uses a paint-swatch device. This is Cat Rumah's signature.

### 5.2 Before/After Draggable Slider Row in Gallery
Three side-by-side interactive before/after image sliders, each with a jade handle that drags horizontally to reveal the painted version. No other project in the system has an interactive compare slider. Directly sells the "5-hour transformation" promise.

### 5.3 Cream-Canvas Light Hero with Floating Photo Card
Every peer site uses a dark hero (photo overlay / dark gradient / navy→orange / diagonal cut / charcoal). Cat Rumah is the **only** bright cream hero in the system, with a rounded photo card that floats above the canvas and breaks the text baseline. This alone makes the site feel categorically different at first glance.

### Bonus: Coral Underline "Stamp" on Stats Numerals
2px × 24px coral bar directly under each stats numeral — a miniature nod to the paint-roller stroke, and tonally distinct from service-aircond's outlined-number treatment and sewa-motor's parallelogram price stamp.

---

## 6. Mobile-First Considerations

| Breakpoint | Layout |
|---|---|
| < 640px | Single column. Hero photo card above text, swatch chips below photo in a horizontal row. Stats 2×2. Products 1-col. HowItWorks vertical with left dashed connector. Gallery sliders stacked. Accordion locations full-width. |
| 640–1024px | 2 column where sensible (products 2-col, stats 4×1, gallery sliders 2-col + 1 below). |
| > 1024px | Full layout — hero overlap visible, 3-col products, 3-col gallery sliders, horizontal HowItWorks. |

Hero H1 `clamp(44px, 6.4vw, 76px)` keeps mobile legible without overflow. Touch targets minimum 44×44px. Sticky bottom WhatsApp button on mobile (`position: fixed; bottom: 16px; right: 16px;` — WA green pill with label hidden below 400px).

---

## 7. Design Review Checklist

| Check | Status | Notes |
|---|---|---|
| Layout unique vs oxihome-malaysia | PASS | Bright cream hero vs dark full-bleed photo; no split grid |
| Layout unique vs sewa-motor-malaysia | PASS | Light canvas vs dark slate; floating photo card vs asymmetric anchored product; swatch band vs top-stripe |
| Layout unique vs service-aircond-malaysia | PASS | Light hero vs warm navy gradient; photo cards vs icon cards; no mascot |
| Layout unique vs roller-shutter-malaysia | PASS | Cream vs gunmetal; jade vs yellow; floating photo vs diagonal cut |
| Colour palette unique | PASS | Jade `#17A890` + coral `#EC6A4A` + cream `#FBF7F0` combination unused elsewhere |
| Typography unique | PASS (mandated Inter) | Hierarchy via weight/tracking/inline-highlight — no second font; differs from Inter-using peers via jade highlight pill, coral price badge, eyebrow uppercase tracking |
| WhatsApp = `#25D366` only | PASS | Never used for decoration |
| WhatsApp opens new tab | PASS | All WA anchors `target="_blank" rel="noopener noreferrer"` |
| Inter globally, NO serif anywhere | PASS | Single Inter font; zero serif mentions in this doc |
| Real images from wixstatic | PASS | Hero photo, product cards, gallery sliders — all real catrumah.com.my images |
| HowItWorks = 3 steps | PASS | Section 4.6 explicitly 3 steps |
| Google branding in reviews | PASS | Google G SVG + "Reviewed on Google" header + per-card G mark |
| No empty spaces between sections | PASS | Alternating cream / jade-wash / white rhythm, every transition carries tonal step |
| Unique vs all existing projects | PASS | Duplicate table addressed oxihome, sewa-motor, service-aircond, roller-shutter |
| Anti-generic guardrails | PASS | No default blue/indigo; layered jade-tinted shadows; distinct weights/tracking for hierarchy; transform+opacity only animations; hover/focus/active states on all clickables; image gradient overlay on hero card |
| Layered depth (base → elevated → floating) | PASS | base=cream, elevated=white card, floating=photo card with layered shadow |
| Design-first workflow | PASS | This doc precedes implementation |

---

## 8. LAYOUT PARITY VERIFICATION

**Homepage section order (locked):**
```
FomoBanner → Nav → Hero → Stats → Products → HowItWorks
→ RiskProblem → MidCta → GoogleReviews → WhyChoose → Gallery
→ LocationsAccordion → FAQ → FinalCta → Footer
```

**Location page section order (locked — same 15 sections plus 2 inserts):**
```
FomoBanner → Nav → Breadcrumbs → Hero → Stats → Products → HowItWorks
→ RiskProblem → MidCta → GoogleReviews → WhyChoose → Gallery
→ LocationsAccordion → NearbyLocations → FAQ → FinalCta → Footer
```

Parity rules:
1. Every section on the location page uses the **same component file** and the **same visual spec** as the homepage — only the data (location name, city-specific copy, location-filtered phone number) changes.
2. `Breadcrumbs` is inserted **between Nav and Hero** and nowhere else.
3. `NearbyLocations` is inserted **between LocationsAccordion and FAQ** and nowhere else.
4. Section backgrounds, shadows, typography, spacing tokens, and swatch-chip motif placements are identical between homepage and every location page.
5. Hero headline on location pages keeps the same jade highlight pill structure but swaps the city name into the sub-headline: "Perkhidmatan Cat Rumah di {City}".
6. No section is added, removed, reordered, or restyled on location pages beyond the two inserts above.

---

*End of Design Direction — Cat Rumah Malaysia*
