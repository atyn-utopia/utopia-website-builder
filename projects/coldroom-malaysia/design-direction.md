# Design Direction — Cold Room Malaysia
**Agent:** Kagura — UI Design Specialist
**Project:** coldroom-malaysia
**Date:** 2026-04-27
**Status:** Ready for Gate 1 user approval

---

## 1. Existing-Site Survey Table

| Project | Dominant Primary Colour | Hero Visual Pattern | One-Word Vibe |
|---|---|---|---|
| electric-wheelchair-malaysia | Navy `#1B2D5B` + Orange `#F47B20` | Split-grid hero, navy gradient, orange accent badges | Trustworthy |
| oxihome-malaysia | Deep ocean teal `#0B6B82` + warm orange `#E8692A` | Floating teal orbs, animated radial gradients | Healthcare-clean |
| roller-shutter-malaysia | Gunmetal `#2C3338` + signal yellow `#F2C744` | Full-bleed dark gradient, industrial steel | Industrial-fortress |
| service-aircond-malaysia | Jade `#17A890` + coral `#EC6A4A` | Cream/sand bg, jade pill highlight in H1 | Fresh-domestic |
| katilhospital-24jam | Crimson `#E11C1C` + hospital navy `#2A5FB0` | Split hero w/ red status pill | Urgent-medical |
| cat-rumah-malaysia | Brand-jade `#17A890` + coral | Cream surface, large editorial H1 | Domestic-warm |
| tablechair-rental-malaysia | Cream `#FFFEF8` + gold `#FDD835` | Editorial cream + gold, masonry gallery | Festive-event |
| sewa-motor-malaysia | Hot orange `#FF6B35` + navy `#16213E` | Aggressive orange CTA pulse | Rental-hustle |

**Where this leaves Cold Room Malaysia:** swap navy/yellow for **frost-blue tertiary** and use an **isothermal "temperature stripe" hero** — none of the sister sites attempt this.

---

## 2. Brand Colour Palette

```css
:root {
  /* PRIMARY — cold-chain amber */
  --cold-amber:        #F08A1C;
  --cold-amber-dark:   #C76C0E;
  --cold-amber-soft:   #FEEFD9;
  --cold-amber-glow:   #FFB347;

  /* SECONDARY — steel grey */
  --steel-900:         #1A1F24;
  --steel-700:         #2E353C;
  --steel-500:         #4D5760;
  --steel-300:         #9BA5AE;
  --steel-100:         #E2E6EA;

  /* ACCENT — frost / icy mint (NOT Tailwind blue/indigo) */
  --frost-deep:        #0E5C66;
  --frost-mid:         #2BA9B5;
  --frost-pale:        #DBF1F3;
  --frost-mist:        #F1F8F9;

  /* SURFACE */
  --frost-white:       #FBFCFD;
  --paper-warm:        #F5F2EE;
  --paper-cool:        #EDF1F4;

  /* WHATSAPP */
  --wa-green:          #25D366;
  --wa-green-dark:     #1EBE57;

  /* GOOGLE */
  --google-gold:       #FBBC04;
  --google-blue:       #4285F4;
  --google-red:        #EA4335;
  --google-green:      #34A853;

  /* STATE */
  --success:           #2F8F4E;
  --warning:           #E0A11C;
  --danger:            #C8313D;
  --info:              #2BA9B5;

  /* GRADIENTS */
  --grad-cold:    linear-gradient(135deg, #F08A1C 0%, #FFB347 100%);
  --grad-frost:   linear-gradient(160deg, #0E5C66 0%, #2BA9B5 100%);
  --grad-steel:   linear-gradient(180deg, #1A1F24 0%, #2E353C 100%);
  --grad-hero:    linear-gradient(115deg,
                    rgba(26,31,36,0.92) 0%,
                    rgba(46,53,60,0.78) 45%,
                    rgba(14,92,102,0.55) 100%);

  /* SHADOWS */
  --shadow-sm:   0 1px 3px rgba(26,31,36,0.08), 0 1px 2px rgba(26,31,36,0.04);
  --shadow-md:   0 4px 12px rgba(26,31,36,0.10), 0 2px 4px rgba(240,138,28,0.06);
  --shadow-lg:   0 10px 30px rgba(26,31,36,0.12), 0 4px 8px rgba(14,92,102,0.06);
  --shadow-amber:0 8px 24px rgba(240,138,28,0.28);
  --shadow-frost:0 8px 24px rgba(43,169,181,0.22);
  --shadow-wa:   0 8px 24px rgba(37,211,102,0.30);
}
```

---

## 3. Typography System (Inter only — no serif)

Family: Inter via `next/font/google` weights 400/500/600/700/800.

```css
:root {
  --w-regular:  400;
  --w-medium:   500;
  --w-semibold: 600;
  --w-bold:     700;
  --w-black:    800;

  --text-h1:    clamp(34px, 6vw, 64px);
  --text-h2:    clamp(17px, 1.7vw, 22px);
  --text-h3:    clamp(24px, 3vw, 36px);
  --text-h4:    clamp(20px, 2vw, 24px);

  --track-display: -0.025em;
  --track-h2:      -0.015em;
  --track-h3:      -0.02em;

  --lh-display: 1.04;
  --lh-tight:   1.15;
  --lh-snug:    1.35;
  --lh-body:    1.6;
}

h1 { font-weight: 800; letter-spacing: -0.025em; line-height: 1.04; }
h2 { font-weight: 700; letter-spacing: -0.015em; line-height: 1.15; }
h3 { font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
h4 { font-weight: 600; line-height: 1.35; }
body, p { font-weight: 400; line-height: 1.6; }
```

---

## 4. Logo + Icon Concept

**Snowflake-in-notched-pallet** — 6-arm snowflake inside a notched square pallet frame. One arm (vertical) is amber; rest are steel-light.

### Favicon `app/icon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path d="M3 3 H29 V21 L21 29 H3 Z" fill="#1A1F24"/>
  <path d="M5 5 H27 V20 L20 27 H5 Z" fill="none" stroke="#2BA9B5" stroke-width="0.8" stroke-opacity="0.6"/>
  <g stroke-linecap="round" stroke-width="2" fill="none">
    <line x1="16" y1="7" x2="16" y2="23" stroke="#F08A1C"/>
    <line x1="8.2" y1="11" x2="23.8" y2="21" stroke="#E2E6EA"/>
    <line x1="8.2" y1="21" x2="23.8" y2="11" stroke="#E2E6EA"/>
    <path d="M13 9 L16 12 L19 9 M13 21 L16 18 L19 21" stroke="#F08A1C" stroke-width="1.5"/>
    <path d="M10 12 L12.5 13 L13 10.5 M22 20 L19.5 19 L19 21.5" stroke="#E2E6EA" stroke-width="1.2"/>
    <path d="M10 20 L12.5 19 L13 21.5 M22 12 L19.5 13 L19 10.5" stroke="#E2E6EA" stroke-width="1.2"/>
  </g>
</svg>
```

### Nav-logo lockup

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 40" width="220" height="40" role="img" aria-label="Cold Room Malaysia">
  <g transform="translate(0,4)">
    <path d="M2 2 H30 V22 L22 30 H2 Z" fill="#1A1F24"/>
    <path d="M4 4 H28 V21 L21 28 H4 Z" fill="none" stroke="#2BA9B5" stroke-width="0.7" stroke-opacity="0.6"/>
    <g stroke-linecap="round" stroke-width="2" fill="none">
      <line x1="16" y1="7" x2="16" y2="23" stroke="#F08A1C"/>
      <line x1="9" y1="11" x2="23" y2="21" stroke="#E2E6EA"/>
      <line x1="9" y1="21" x2="23" y2="11" stroke="#E2E6EA"/>
    </g>
  </g>
  <text x="42" y="22" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="17" fill="#1A1F24" letter-spacing="-0.5">Cold Room</text>
  <text x="42" y="36" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="11" fill="#F08A1C" letter-spacing="2">MALAYSIA · COLD CHAIN</text>
</svg>
```

---

## 5. Section-by-Section Visual Direction

### 1. FomoBanner — `--steel-900` black bg, white text, amber dot pulse, live `hh:mm:ss` countdown in tabular-nums, 2px amber bottom border.
### 2. Nav — Floating glass pill, 92% width, `top:12px`, `border-radius:9999px`, frost-cyan inner glow on hover.
### 3. Hero — Full-bleed dark photo (Malaysian frozen warehouse) + `--grad-hero` overlay. Asymmetric 58/42 split. Below H1+H2: a 4-cell **Temperature Stripe** ladder (`-18 / -10 / +4 / +10°C`) — UNIQUE.
### 4. UspBar — `--paper-cool`, 3 columns, amber-to-frost diagonal gradient ring on each icon.
### 5. Stats — Dark `--steel-900` w/ amber radial spotlight, 4 stat tiles, animated count-up + amber underline.
### 6. Products — DYNAMIC from Supabase. Card 20px radius. Vertical **thermometer rail** on left edge — UNIQUE.
### 7. HowItWorks — `--paper-warm`, exactly 3 steps, large outline numerals behind cards.
### 8. RiskProblem — Dark photo bg + `--grad-steel` overlay, amber warning triangles with snowflake center.
### 9. MidCta — Image bg + frost-glass floating amber-bordered card.
### 10. GoogleReviews — Multi-color Google G logo, full-color logos on each review card, temperature-tier pill on each review — UNIQUE.
### 11. WhyChoose — Bento dark `--steel-900` w/ frost-vapour mesh, asymmetric layout.
### 12. Gallery — `--frost-white`, 12 images in 4×3 / 3×4 / 2×6 grid (all even divisors). Odd tiles frost-tint, even tiles amber-tint.
### 13. LocationsAccordion — `--paper-cool`, 13 collapsible state cards, frost-pale chips inside.
### 14. Faq — `--frost-white`, single column, plus/minus accordion, opacity fade.
### 15. FinalCta — Dark refrigerated truck photo at dusk + `--grad-hero` overlay, large WA pill.
### 16. Footer — `--steel-900`, 4 cols, frost-cyan thin dividers, amber underline below brand. NO phone/email/domain visible.
### 17. StickyWhatsAppFab — `#25D366`, pulse animation, "Quote in 5 min" amber tail-pill on scroll.

---

## 6. Imagery Direction

12 gallery images:
1. -18°C frozen seafood storage
2. HALAL frozen chicken pallets
3. Chiller room with dairy
4. Refrigerated truck loading dock (Malaysian)
5. Cold-room insulated panels
6. Pharmaceutical cool storage
7. Asian/Malay warehouse worker
8. Halal-certified frozen meat
9. Pizza dough trays in -10°C
10. Cold-chain delivery handoff at restaurant
11. Insulated cold-room exterior
12. Temperature monitoring panel

Tone: clean, well-lit, real Malaysian/Asian subjects. Pexels + Unsplash.

---

## 7. Animation Principles

`transform` + `opacity` only. Respect `prefers-reduced-motion`.

| Micro-interaction | Animation |
|---|---|
| FOMO countdown digits | tabular-nums + translateY digit flip |
| FAB hover | scale(1.06) + amber glow |
| Product card hover | translateY(-4px) + shadow lift |
| Accordion expand | opacity 0.25s + max-height 0.3s |
| Stat count-up | requestAnimationFrame on IntersectionObserver |
| Gallery tile hover | scale(1.04) 0.4s |
| Hero scroll-in | opacity + translateY(12px)→0, 80ms stagger |

---

## 8. Mobile Center-Alignment Audit

On mobile (≤640px) center: H1, H2, hero CTAs, temperature chips (2×2), USP cells, stats, section H3s, step numbers/titles, WhyChoose cards, Mid/Final-CTA copy + button (full-width), gallery tiles, footer brand block.

---

## 9. Component Shape System

```css
.btn { border-radius: 9999px; height: 52px; padding: 14px 26px; font-weight: 600; }
@media (max-width: 640px) { .btn { height: 48px; width: 100%; } }
.btn-wa      { background: #25D366; color: #fff; box-shadow: var(--shadow-wa); }
.btn-primary { background: var(--cold-amber); color: #fff; box-shadow: var(--shadow-amber); }
.btn-ghost-frost { background: transparent; color: #fff; border: 1.5px solid rgba(219,241,243,0.6); }
```

Card 20px, chip 14px, badge 9999px, tile 16px, banner 24px. All buttons share the pill shape — colour only varies.

---

## 10. Differentiation Summary

1. **Temperature Stripe Hero** — sequential `-18°C → +10°C` colour-coded chips below H1/H2 acting as scroll anchors.
2. **Snowflake-in-notched-pallet logo** — unique mark; doubles as favicon.
3. **Amber + Steel + Frost-Cyan palette** — no sister site uses cyan-mint `#2BA9B5`.
4. **Vertical thermometer rail on product cards** — colour-coded gradient strip on left edge.
5. **Bento dark "WhyChoose"** — asymmetric bento on `--steel-900` with frost-cyan hairline borders.

---

**Status:** Ready for Gate 1 user approval.
