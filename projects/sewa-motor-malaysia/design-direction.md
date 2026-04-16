# Sewa Motor Malaysia -- Design Direction

**Author:** Kagura (UI Design Specialist)
**Project:** sewamotor.my -- Motorcycle Rental Malaysia
**Date:** 2026-04-02
**Recommended:** "Electric Ride" — Orange/coral/dark-slate

---

## Color System

| Token | Hex | Usage |
|---|---|---|
| `--brand-primary` | `#FF6B35` | Primary — buttons, heading accents, active states |
| `--brand-primary-dark` | `#E85A25` | Hover state on primary buttons |
| `--brand-primary-xs` | `#FFF4EE` | Light orange tint for backgrounds, badges |
| `--brand-dark` | `#16213E` | Hero bg, nav, dark sections, heading text |
| `--brand-dark-mid` | `#1A2744` | Dark section variants |
| `--brand-coral` | `#FF3F3F` | Gradient pair with orange, price highlights |
| `--brand-surface` | `#F1F3F5` | Light gray page background |
| `--brand-white` | `#FFFFFF` | Card backgrounds |
| `--brand-text` | `#1B2432` | Body text |
| `--brand-text-muted` | `#6B7B8D` | Secondary text, captions |
| `--brand-border` | `#E2E8F0` | Dividers |
| `--wa-green` | `#25D366` | WhatsApp CTA |
| `--google-gold` | `#FBBC04` | Google review stars |

## Layout Blueprint

### Hero — Asymmetric Bottom-Right Anchored
- Full-width dark gradient `linear-gradient(135deg, #16213E 0%, #1A2744 40%, #1E2D4A 100%)`
- 2-column: text left, motorcycle image bottom-right overlapping into stats bar (~40px)
- Parallelogram price stamp (skewX -6deg) + same-day delivery pill
- Gradient text on "from RM30/day" in H1

### Homepage Section Order
1. FOMO Urgency Banner (red #DC2626, countdown)
2. Sticky Nav (dark slate, motorcycle icon in orange badge)
3. Hero (asymmetric, dark gradient, product bottom-right with overlap)
4. Stats Bar (dark slate, orange stat numbers)
5. Products Grid (gray surface, 3-col desktop / 1-col mobile)
6. How It Works (3 steps, large orange step numbers)
7. Risk/Problem Section (light surface, text + icon accents)
8. Mid-Page WhatsApp CTA (full-width orange gradient banner)
9. Google Reviews (dark section, image bg + dark overlay)
10. Brand Logos (light strip, grayscale, marquee mobile)
11. Why Choose / Trust (light surface, icon cards)
12. Customer Gallery (marquee auto-scroll, fade edges)
13. Location Grid (accordion by state/region)
14. FAQ (accordion)
15. Final CTA (dark section, orange gradient button)
16. Footer

## Component Styles

### Product Cards
- White on gray surface, 16px radius, 1px solid #E2E8F0
- 3px gradient top-stripe (orange to coral) — NO left-border
- Product image centered top, badge pill overlapping image bottom-right
- 3-column pricing mini-table: Daily | Weekly | Monthly
- Orange full-width CTA button at bottom
- Hover: scale(1.02) + warm orange-tinted shadow
- h-full for equal height

### Buttons
- Primary (WhatsApp): #25D366, white text, rounded-xl, pulse animation
- Secondary (card CTA): #FF6B35, white text, rounded-lg, full-width, hover #E85A25
- Ghost: transparent, 1.5px solid #FF6B35, hover fills #FFF4EE

### Review Cards (dark section)
- rgba(255,255,255,0.06) bg, 1px rgba(255,255,255,0.10) border
- backdrop-filter blur(6px), snap-scroll mobile, hidden scrollbar

## 5 Unique Visual Elements
1. Parallelogram price stamp (skewX -6deg) — speed/motion
2. Gradient headline text — orange to coral on price phrase
3. Top-stripe product cards — gradient bar replacing left-border
4. Bottom-overlap hero image — motorcycle extends ~40px below hero
5. Warm orange shadow system — rgba(255,107,53,0.12) hover shadows
