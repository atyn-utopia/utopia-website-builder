# Design Direction — Electrician 24 Hours

## Palette
- Deep Blue `#0A3A82` — primary surface, headings, trust
- Blue Accent `#0B63CE` — buttons, links, highlights
- Gold `#F9B419` — lightning-bolt accent, FOMO stripes, "24H" callouts
- Gold Dark `#E69A00` — hover state on gold surfaces
- Navy Deep `#061E4A` — footer, deep contrast bands
- White / Ice `#FFFFFF` / `#F5F7FA` — neutral backgrounds
- WhatsApp Green `#25D366` — WhatsApp CTA only (per memory)

## Typography
- Headings: Inter (700/800) with tight tracking `-0.02em` — bold, industrial
- Body: Inter (400/500) — clean, readable
- (Per memory: Inter globally — no serif fonts)

## Signature visual motif
- Lightning-bolt gold accent from the logo repeated as:
  - Diagonal FOMO stripes above bottom CTA
  - Numeric marker on step cards (step 1 / 2 / 3)
  - Subtle pattern inside dark hero overlay

## Layout unique to this project (not re-used from electric-wheelchair)
- Floating pill nav — white glass with blue border, gold lightning on left
- Hero: dark-navy band, full-bleed technician photo on right, giant 24/7 type on left, yellow "4-HOUR ARRIVAL" flag
- USP bar: 3 cards with yellow icon chips (from `/public/usp/`)
- Services grid: auto-fill `minmax(260px, 1fr)`, each card with dark-navy hover lift
- How-It-Works: 3 large vertical steps separated by gold connector line
- Gallery: masonry-ish 3-col grid from `/public/gallery/`
- Google Reviews: horizontally scrollable card strip
- Bottom CTA: dark gradient band with gold flash, big "Call an Electrician Now" WhatsApp button

## Button rules (single shape)
- All buttons: `border-radius: 9999px` (full pill)
- Primary: gold bg / navy text
- WhatsApp: green bg / white text
- Secondary/outline: white/transparent bg, blue border
- No squared or small-radius buttons anywhere

## Mobile
- Everything centre-aligned (headings, buttons, cards, icons)
- Sticky bottom floating WhatsApp button

## Images (all real, from brand_assets — no placeholders)
- `/brand/hero-technician.png` — main hero
- `/brand/hero.png` / `hero-2.png` / `hero-cta.png` — sub-heroes / CTAs
- `/gallery/gallery-*.png` — jobsite photos
- `/reviews/review-*.png` — Google reviews screenshots
- `/usp/usp-*.svg` — 3 USP icons
