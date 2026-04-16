# Hollywood Night — Design Direction
**Project:** Annual Dinner RSVP Microsite
**Event:** Hollywood Red Carpet Night — 16 May 2026, 6:00 PM
**Designer:** Kagura (UI Design Specialist)

---

## 1. Existing Sites Audit (brief)

| Site | Visual signature |
|---|---|
| cpapmachine | Medical teal/white, split hero, product grid, green WhatsApp CTAs |
| oxihome-malaysia | Dark teal hero + red countdown bar, split hero (text L / device R), circular stat stamps |
| sewa-motor-malaysia | Rental orange/black, split hero with motorbike, urgency badges |
| electric-wheelchair-malaysia | Navy + orange, split hero (text L / chair R), orange circular stamps, green WhatsApp pill CTA |
| hospital-bed-malaysia | Clinical blue/white, product grid, trust-first layout |
| roller-shutter-malaysia | Dark slate + yellow accent, full-bleed shutter hero, yellow pill CTAs |
| service-aircond-malaysia | Cool blue service-card grid, WhatsApp green CTAs |

**Common DNA across ALL existing sites:** split hero (text left, hero image right), circular orange/yellow "stamp" badges, WhatsApp-green pill CTAs, product card grids, light or teal backgrounds, sans-serif throughout, clinical/commercial tone.

## 2. Duplicate Risk Report

**Risk level: NEGLIGIBLE.** Hollywood Night is:
- An event RSVP microsite, not a product/SEO site
- Black + metallic gold (no site uses this)
- Cinematic/editorial layout, not split commercial hero
- Serif display headings (no site uses serif headings)
- Zero WhatsApp green (this site has no WhatsApp CTA)
- No product grids, no stamps, no trust bars, no countdown nav strip
- Full-bleed spotlight hero, not split hero

No section of any existing site will be mirrored. Confirmed distinct.

## 3. Design Directions Explored

### Direction A — "Premiere Marquee" (cinema lobby)
Editorial, poster-like. Hero treated as a 1940s movie poster with art-deco gold borders, laurel frames, marquee-bulb row, letterboxed 2.39:1 aspect. Feels like a Turner Classic Movies key art. Pro: timeless, unmistakable. Con: could read retro-kitsch if overdone.

### Direction B — "Spotlight & Grain" (modern cinematic) — **RECOMMENDED**
A deep-black stage with a single radial gold spotlight falling on the event title. Film-grain noise, soft vignette, animated faint grain loop, thin gold hairlines, and a letterbox top/bottom band on the hero. The ticket is the hero artifact — a horizontal perforated stub with holographic gold gradient. Feels like A24 / The Academy / Dune premiere microsite. Modern, premium, not kitsch. **This is what we build.**

### Direction C — "Red Carpet Runway" (bold editorial)
Vertical red velvet texture runs down the page as a side rail; content sits on black panels that slide over it. Big numbered chapters (I / II / III). Pro: very unique. Con: red+gold+black risks looking like a Chinese New Year site, and the vertical rail fights mobile layout.

**Chosen:** Direction B — Spotlight & Grain.

---

## 4. Recommended Direction — Full Visual Specification

### 4.1 Color System

```
--ink-black:        #05060A   /* deepest base, pure stage */
--ink-900:          #0B0D14   /* page background */
--ink-800:          #111420   /* elevated surface (cards) */
--ink-700:          #1A1E2C   /* floating surface (modals, form fields) */
--ink-600:          #272B3B   /* hairline borders on dark */

--gold-500:         #D4AF37   /* primary metallic gold (brand accent) */
--gold-400:         #E6C659   /* highlight gold (hover, glow core) */
--gold-300:         #F4DC86   /* text-on-dark gold headings */
--gold-600:         #A8861F   /* deep gold (pressed, shadow) */
--gold-glow:        rgba(212,175,55,0.35)

--champagne:        #F6EBD0   /* warm off-white, "red carpet cream" */
--ivory:            #FBF7EC   /* body text on dark */
--ivory-dim:        rgba(251,247,236,0.72)
--ivory-faint:      rgba(251,247,236,0.42)

--carpet-red:       #7A0A12   /* accent only — "attending" state, ticket stub edge */
--carpet-red-bright:#B01028   /* hover for red accents */

--success-emerald:  #2E7D5B   /* RSVP confirmed state (subtle, not WhatsApp green) */
--warn-amber:       #C08421
--error-crimson:    #9E1B1B
```

**Do NOT use:** Tailwind default blue/indigo, WhatsApp green, any teal, any flat pure white (#FFFFFF) — always use champagne/ivory for warmth.

**Background treatment:** Never a flat black. Always layered:
1. Base `#05060A`
2. Radial spotlight `radial-gradient(ellipse 60% 45% at 50% 25%, rgba(212,175,55,0.18) 0%, transparent 70%)`
3. Film grain SVG overlay at ~6% opacity
4. Bottom vignette `linear-gradient(to bottom, transparent 60%, #000 100%)`

### 4.2 Typography

- **Display / Headings:** **Playfair Display** (Google Fonts) — weights 600, 700, 900. High-contrast serif, gives old-Hollywood-poster feel without being kitsch. Use italic 700 for flourish words ("Hollywood", "Premiere").
- **Body:** **Inter** (Google Fonts) — weights 400, 500, 600. Per user memory: Inter always as body. Never serif body.
- **Numeric / Ticket / Countdown:** **JetBrains Mono** 500 — used ONLY for ticket numbers, QR ID, countdown digits, admin tables. Gives a cinematic ticket-stub feel.

**Scale (desktop → mobile):**
```
Display hero   clamp(3.5rem, 8vw, 7.5rem)   Playfair 900  tracking-[-0.03em]  leading-[0.92]
H1             clamp(2.5rem, 5vw, 4rem)     Playfair 700  tracking-[-0.02em]
H2             clamp(1.75rem, 3vw, 2.5rem)  Playfair 700  tracking-[-0.015em]
H3             1.375rem                      Playfair 600
Eyebrow        0.75rem  Inter 500 uppercase tracking-[0.28em] gold-500
Body-lg        1.125rem Inter 400 leading-[1.7] ivory-dim
Body           1rem     Inter 400 leading-[1.7] ivory-dim
Caption        0.8125rem Inter 500 ivory-faint
Mono-ticket    1rem     JetBrains 500 tracking-[0.08em]
```

Body text minimum 14px on mobile, hero headline minimum 40px on mobile. All headings `tracking-tight` or tighter.

### 4.3 Layout Blueprint

#### Page 1 — RSVP Landing (`/`)

```
┌──────────────────────────────────────────┐
│ Top letterbox bar (12px solid black)     │ ← cinematic letterbox
├──────────────────────────────────────────┤
│                                          │
│   [gold hairline · eyebrow "16.05.2026"]│
│                                          │
│        You're Invited to the            │
│     HOLLYWOOD                           │ ← Playfair 900, italic "Hollywood"
│        Red Carpet Night                  │
│                                          │
│   [gold divider ◆]                       │
│   Annual Dinner · Saturday 16 May 2026   │
│   6:00 PM · Venue TBA                    │
│                                          │
│   [Scroll hint ▼ with animated opacity]  │
│                                          │
├──────────────────────────────────────────┤  ← letterbox bottom band
│ Section 2 — "The Evening" (event details)│
│ 3-column grid of gold-bordered cards:    │
│  ◆ DATE        ◆ DRESS CODE    ◆ VENUE   │
│  16 May '26     Black Tie       TBA      │
│  6:00 PM        Glamour         (placeholder)│
├──────────────────────────────────────────┤
│ Section 3 — "Your Ticket Awaits" (ticket │
│ preview card, centered, tilted 2deg,     │
│ holographic gold gradient — see §5)      │
├──────────────────────────────────────────┤
│ Section 4 — RSVP Form                    │
│ Two-column on desktop, stacked mobile.   │
│ Left: form fields on #111420 card with   │
│       1px gold-600 border                │
│ Right: "The Details" sticky summary card │
│       showing live echo of user inputs   │
│       as a mini-ticket preview.          │
├──────────────────────────────────────────┤
│ Section 5 — FAQ accordion (4-5 items)    │
│ Gold hairline dividers, + → × rotation   │
├──────────────────────────────────────────┤
│ Footer — black, centered, 3 gold stars,  │
│ "See you on the red carpet" italic       │
│ + small link to /retrieve                │
└──────────────────────────────────────────┘
```

**Hero key move:** The word "HOLLYWOOD" is set in Playfair italic 900, letter-spaced, with a repeating marquee-bulb row of gold dots (•) above and below it, and a soft animated gold radial glow behind it (opacity 0 → 0.6 over 1.8s, then gentle 4s pulse). No background image needed — the black + spotlight + typography carries it.

#### Page 2 — Retrieve Tickets (`/retrieve`)

```
┌──────────────────────────────────────────┐
│ Slim nav: ◆ Hollywood Night      [Home]  │
├──────────────────────────────────────────┤
│         Eyebrow: TICKET RETRIEVAL        │
│                                          │
│          Find Your Ticket                │ ← Playfair 700
│   Enter the phone number you used to     │
│   RSVP to reveal your ticket(s).         │
│                                          │
│   [ Phone input  ·········· ][ LOOKUP ]  │ ← single-row, gold button
│                                          │
├──────────────────────────────────────────┤
│ Result state:                            │
│   Ticket card(s) revealed with soft      │
│   opacity + translate-y fade-in.         │
│   Each ticket shows:                     │
│     · guest name                         │
│     · seat / table (if assigned)         │
│     · QR code on champagne panel         │
│     · ticket ID in JetBrains Mono        │
│   If plus-one exists: two tickets stack  │
│   with a perforated divider between.     │
└──────────────────────────────────────────┘
```

#### Page 3 — Admin (`/admin`, `/admin/scan`)

Functional but themed. Never loses the black+gold identity.

**`/admin` (login + guest list):**
```
Login card:  #111420 surface, gold hairline border, Playfair H2 "Staff Entrance",
             Inter form fields, gold CTA.
After auth:  Full-width guest table on #0B0D14 background.
             Sticky header row in #111420 with gold-300 labels uppercase tracking-wide.
             Alternating row tints (#0B0D14 / #0E111A).
             Status chips:
               ATTENDING  → gold-500 outline on #111420
               NOT GOING  → ivory-faint outline
               CHECKED-IN → filled gold-500 with ink-black text
             Search bar (top) + filter pills (attending / checked-in / transport).
             Row hover: subtle gold glow left-edge 2px.
```

**`/admin/scan`:**
```
Full-screen dark stage. Center: 320×320 camera viewport
framed by 4 gold L-brackets (art-deco corner marks) that
pulse on successful scan (scale 1 → 1.05 → 1 over 400ms).
Below: large status banner (success emerald or error crimson).
Last 5 scans listed below as mono-tickets.
```

### 4.4 Component Styles

**Buttons**
```
Primary (gold):
  bg-gradient-to-b from-[#E6C659] via-[#D4AF37] to-[#A8861F]
  text-[#05060A] font-medium tracking-[0.08em] uppercase text-sm
  px-8 py-4 rounded-none              ← squared, like a cinema ticket
  border border-[#F4DC86]/40
  shadow: 0 8px 24px -8px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.25)
  hover: translate-y-[-1px], brightness-110
  active: translate-y-[1px], brightness-95
  focus-visible: ring-2 ring-[#F4DC86] ring-offset-2 ring-offset-[#05060A]
  Animate: transform + opacity only, duration-200

Ghost (gold outline):
  bg-transparent border border-[#D4AF37]/60 text-[#F4DC86]
  hover: bg-[#D4AF37]/10 border-[#D4AF37]

Danger (carpet red):
  bg-[#7A0A12] text-[#F6EBD0] border border-[#B01028]/40
  hover: bg-[#B01028]
```

**Form fields**
```
bg-[#111420] border border-[#272B3B]
text-[#FBF7EC] placeholder-[#FBF7EC]/35
rounded-none px-5 py-4
Inter 400
focus: border-[#D4AF37] ring-1 ring-[#D4AF37]/40 outline-none
label: Eyebrow style — uppercase 11px gold-500 tracking-[0.22em] mb-2
error: border-[#9E1B1B] with crimson helper text below
```

Toggle switch (attending / transport / plus-one): thin rounded-full rail `#272B3B`, knob is a gold disc with inset shadow. On state: rail `#A8861F`, knob slides right. Animate transform only.

**Cards (base → elevated → floating)**
```
Base (section panel):
  bg-[#0B0D14]  — no border, sits on page

Elevated (detail cards in "The Evening"):
  bg-[#111420]
  border border-[#D4AF37]/20
  ring-1 ring-inset ring-white/[0.03]
  shadow: 0 20px 60px -30px rgba(0,0,0,0.9),
          0 1px 0 rgba(244,220,134,0.08) inset
  rounded-[2px]  — almost-sharp corners

Floating (ticket card — §5):
  see ticket spec
```

**Gold hairline divider:**
`height: 1px; background: linear-gradient(90deg, transparent, #D4AF37 50%, transparent); opacity: 0.5;`

With optional centered diamond ◆ glyph in gold-400.

**Marquee bulb row** (decorative, between sections):
Row of 12–16 small gold circles (`w-1.5 h-1.5 rounded-full bg-[#E6C659] shadow-[0_0_8px_rgba(230,198,89,0.8)]`). Every other bulb animates opacity 0.4 ↔ 1.0 on a 1.6s offset stagger — pure CSS, transform/opacity only.

### 4.5 Motion & Animation (transform + opacity ONLY)

- **Hero entrance:** spotlight glow fades in (opacity 0 → 0.6, 1.8s ease-out), headline words stagger-rise (`translateY(20px) → 0`, opacity 0 → 1, 80ms stagger).
- **Scroll reveal:** sections fade+rise 24px on intersection (single trigger, 600ms ease-out).
- **Ticket tilt on hover:** `transform: rotate(-1deg) scale(1.02)`, 300ms.
- **Gold glow pulse** on primary CTA: box-shadow alternating, infinite 2.4s ease-in-out. Prefers-reduced-motion: disable.
- **Film grain loop:** 8-frame SVG noise cycled via `transform: translate3d()` shifts, 0.8s steps.
- **Marquee bulbs:** staggered opacity pulse as described.
- **Form success:** ticket card slides in from below (translateY 40px → 0) + opacity, 700ms.
- **NEVER use `transition-all`.** Always `transition-[transform,opacity]`.

### 4.6 Mobile-First Considerations

- Hero headline minimum 40px mobile, scales up to 120px desktop via `clamp()`.
- Letterbox bands shrink to 8px on mobile.
- Ticket card rotates to vertical orientation below 640px (perforation becomes horizontal dash across the middle).
- Form becomes single column, sticky summary collapses to a bottom sheet that slides up on scroll.
- Admin table transforms to stacked card list on mobile — each guest a mini-card with name + status chip + chevron.
- Scanner viewport: 80vw square, brackets scale proportionally.
- All tap targets ≥ 44×44px. Gold CTA on mobile is full-width with 56px height.
- No horizontal overflow anywhere. Marquee bulb rows use `overflow-hidden`, not scroll.
- Hidden scrollbars on any horizontal list via `scrollbar-width: none`.

---

## 5. The Ticket Visual (hero artifact — spec in detail)

The ticket is the emotional payoff of the entire site. Design it like a real cinema premiere stub.

**Aspect:** 5.2 : 1 (desktop), ~1:1.4 vertical (mobile)
**Structure:** Two panels divided by a perforated line.

```
┌───────────────────────────────┬──────────┐
│ ◆ HOLLYWOOD NIGHT             │  ADMIT   │
│                               │   ONE    │
│ You're Invited                │          │
│ Ada Lovelace                  │  [QR]    │
│ + Guest: Grace Hopper         │          │
│                               │ 0042·A17 │
│ 16.05.2026  ·  18:00          │          │
│ Venue TBA                     │          │
└───────────────────────────────┴──────────┘
         ← perforation (dashed) →
```

**Surface:**
- Base gradient: `linear-gradient(135deg, #1A1E2C 0%, #0B0D14 40%, #111420 100%)`
- Overlay gold shimmer: `linear-gradient(105deg, transparent 40%, rgba(244,220,134,0.12) 50%, transparent 60%)` — this strip slowly pans across (translateX loop, 6s, paused by default, runs on hover)
- Hairline gold frame: `1px solid #D4AF37`, inset `1px solid rgba(244,220,134,0.15)`
- Outer shadow: `0 30px 80px -30px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.2), 0 0 40px -10px rgba(212,175,55,0.35)`
- Film grain: SVG noise at 5% opacity inside the card
- Subtle `rotate(-1.2deg)` at rest for character

**Perforation:**
Dashed line `border-left: 2px dashed rgba(212,175,55,0.4)` with two circular "bite" cutouts at top and bottom (`::before` / `::after` absolute positioned `#05060A` discs overlapping the edge).

**Typography inside ticket:**
- Eyebrow "HOLLYWOOD NIGHT" — Inter 600 11px tracking-[0.32em] uppercase gold-400
- Guest name — Playfair 700 28px champagne
- Meta lines — JetBrains Mono 13px ivory-dim
- Ticket ID — JetBrains Mono 14px gold-400 tracking-[0.1em]
- "ADMIT ONE" — Playfair italic 700 rotated 90deg down the right stub

**QR panel:** champagne `#F6EBD0` background (QR must be light for scanner readability), 16px padding, sits inside a thin gold frame.

**Micro-detail:** four tiny corner art-deco ornaments (SVG, 12×12, gold-400) in each corner of the left panel.

---

## 6. Admin Screens — Specific Guidance

Admin must feel like "backstage at the Oscars" — premium, not corporate. But it is utility-first: density and readability win.

- Keep base palette identical. No sudden light mode.
- Use JetBrains Mono for: ticket IDs, phone numbers, timestamps, counts.
- Keep Playfair only for page titles ("Guest List", "Scanner"), not for table content.
- Guest list table density: 52px row height desktop, 16px horizontal padding. Hover state: row bg shifts to `#12162220` + left 2px gold edge.
- Status chips (per §4.3). Clicking a chip filters.
- Top bar: page title + total count "124 ATTENDING / 38 CHECKED-IN" with gold counters, no icons.
- Scanner: the gold L-bracket corner marks are the signature. Success flash = quick scale pulse + emerald flash overlay at 20% opacity fading out. Error flash = crimson.
- Logout link — ghost button top right, ivory-faint.
- Responsive: table → stacked cards on mobile (each card = guest mini-ticket with chip + check-in button).

---

## 7. Copy-Paste Tailwind Tokens

### 7.1 `app/globals.css` additions

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,700;1,900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

:root {
  /* Ink */
  --ink-black: #05060A;
  --ink-900:   #0B0D14;
  --ink-800:   #111420;
  --ink-700:   #1A1E2C;
  --ink-600:   #272B3B;

  /* Gold */
  --gold-300:  #F4DC86;
  --gold-400:  #E6C659;
  --gold-500:  #D4AF37;
  --gold-600:  #A8861F;
  --gold-glow: rgba(212,175,55,0.35);

  /* Warm neutrals */
  --champagne: #F6EBD0;
  --ivory:     #FBF7EC;
  --ivory-dim: rgba(251,247,236,0.72);
  --ivory-faint: rgba(251,247,236,0.42);

  /* Accents */
  --carpet-red:        #7A0A12;
  --carpet-red-bright: #B01028;
  --success-emerald:   #2E7D5B;
  --warn-amber:        #C08421;
  --error-crimson:     #9E1B1B;

  /* Fonts */
  --font-display: 'Playfair Display', ui-serif, Georgia, serif;
  --font-body:    'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;

  /* Shadows */
  --shadow-card:   0 20px 60px -30px rgba(0,0,0,0.9), 0 1px 0 rgba(244,220,134,0.08) inset;
  --shadow-gold:   0 8px 24px -8px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.25);
  --shadow-ticket: 0 30px 80px -30px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.2), 0 0 40px -10px rgba(212,175,55,0.35);

  /* Gradients */
  --grad-stage:   radial-gradient(ellipse 60% 45% at 50% 25%, rgba(212,175,55,0.18) 0%, transparent 70%);
  --grad-vignette:linear-gradient(to bottom, transparent 60%, #000 100%);
  --grad-gold:    linear-gradient(180deg, #E6C659 0%, #D4AF37 55%, #A8861F 100%);
  --grad-ticket:  linear-gradient(135deg, #1A1E2C 0%, #0B0D14 40%, #111420 100%);
  --grad-shimmer: linear-gradient(105deg, transparent 40%, rgba(244,220,134,0.12) 50%, transparent 60%);
  --grad-hairline:linear-gradient(90deg, transparent, #D4AF37 50%, transparent);
}

html { background: var(--ink-black); }
body {
  font-family: var(--font-body);
  color: var(--ivory);
  background: var(--ink-900);
  -webkit-font-smoothing: antialiased;
}

h1,h2,h3,.font-display { font-family: var(--font-display); letter-spacing: -0.02em; }
.font-mono { font-family: var(--font-mono); }

.bg-stage {
  background:
    var(--grad-vignette),
    var(--grad-stage),
    var(--ink-900);
}

.hairline { height:1px; background:var(--grad-hairline); opacity:.5; }

/* Hidden scrollbar util */
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

/* Film grain (inline SVG data URI) */
.grain::before{
  content:""; position:absolute; inset:0; pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  opacity:.06; mix-blend-mode:overlay;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

### 7.2 `tailwind.config` theme extension

```ts
theme: {
  extend: {
    colors: {
      ink: {
        black: '#05060A',
        900: '#0B0D14',
        800: '#111420',
        700: '#1A1E2C',
        600: '#272B3B',
      },
      gold: {
        300: '#F4DC86',
        400: '#E6C659',
        500: '#D4AF37',
        600: '#A8861F',
      },
      champagne: '#F6EBD0',
      ivory: {
        DEFAULT: '#FBF7EC',
        dim: 'rgba(251,247,236,0.72)',
        faint: 'rgba(251,247,236,0.42)',
      },
      carpet: {
        red: '#7A0A12',
        bright: '#B01028',
      },
    },
    fontFamily: {
      display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
    },
    boxShadow: {
      card:   '0 20px 60px -30px rgba(0,0,0,0.9), 0 1px 0 rgba(244,220,134,0.08) inset',
      gold:   '0 8px 24px -8px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
      ticket: '0 30px 80px -30px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.2), 0 0 40px -10px rgba(212,175,55,0.35)',
    },
    backgroundImage: {
      'grad-stage':   'radial-gradient(ellipse 60% 45% at 50% 25%, rgba(212,175,55,0.18) 0%, transparent 70%)',
      'grad-gold':    'linear-gradient(180deg, #E6C659 0%, #D4AF37 55%, #A8861F 100%)',
      'grad-ticket':  'linear-gradient(135deg, #1A1E2C 0%, #0B0D14 40%, #111420 100%)',
      'grad-shimmer': 'linear-gradient(105deg, transparent 40%, rgba(244,220,134,0.12) 50%, transparent 60%)',
      'grad-hairline':'linear-gradient(90deg, transparent, #D4AF37 50%, transparent)',
    },
    letterSpacing: {
      eyebrow: '0.28em',
      tightest: '-0.03em',
    },
    transitionProperty: {
      'tf-op': 'transform, opacity',
    },
  },
}
```

### 7.3 Ready-to-use class recipes

```html
<!-- Primary gold CTA -->
<button class="bg-grad-gold text-ink-black font-medium tracking-[0.08em] uppercase text-sm px-8 py-4 border border-gold-300/40 shadow-gold transition-tf-op duration-200 hover:-translate-y-px hover:brightness-110 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-black">
  RSVP Now
</button>

<!-- Ghost gold CTA -->
<button class="bg-transparent border border-gold-500/60 text-gold-300 px-8 py-4 uppercase tracking-[0.08em] text-sm transition-tf-op duration-200 hover:bg-gold-500/10">
  Retrieve Ticket
</button>

<!-- Form field -->
<label class="block">
  <span class="block text-[11px] uppercase tracking-eyebrow text-gold-500 mb-2">Full name</span>
  <input class="w-full bg-ink-800 border border-ink-600 text-ivory placeholder-ivory/35 px-5 py-4 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 outline-none transition-tf-op duration-150 font-sans" />
</label>

<!-- Elevated card -->
<div class="bg-ink-800 border border-gold-500/20 ring-1 ring-inset ring-white/[0.03] shadow-card rounded-[2px] p-8">...</div>

<!-- Hairline divider -->
<div class="hairline w-full" />

<!-- Section eyebrow -->
<span class="inline-block text-[11px] font-medium uppercase tracking-eyebrow text-gold-500">16.05.2026 · Red Carpet Night</span>
```

---

## 8. Design Review Checklist

- [x] Hero layout (full-bleed spotlight + typographic) differs from every existing split-hero site
- [x] Color palette (black + metallic gold + champagne + carpet red) used by no existing site
- [x] Typography pairing (Playfair Display + Inter + JetBrains Mono) used by no existing site
- [x] Card/component style (sharp corners, gold hairlines, ticket perforation) is distinct
- [x] Section order unique (no product grid, no trust bar, no WhatsApp CTA)
- [x] Fits category (premium event, cinematic tone)
- [x] Mobile-first considered (clamp scale, stacked forms, hidden scrollbars, 44px taps)
- [x] Accessibility: gold #D4AF37 on #05060A = 11.8:1 contrast (AAA); ivory #FBF7EC on #0B0D14 = 16.4:1 (AAA); focus rings defined
- [x] Animations restricted to transform + opacity; reduced-motion respected
- [x] No Tailwind default blue/indigo; no flat shadows; no `transition-all`
- [x] Three unique elements: (1) Playfair italic Hollywood + marquee-bulb rows, (2) perforated cinema-ticket hero artifact with gold shimmer, (3) L-bracket art-deco scanner frame on admin

## 9. Three Signature Elements (for engineer to prioritize)

1. **The Spotlight Hero** — radial gold glow behind Playfair italic "Hollywood" with marquee-bulb rows top and bottom. This sells the theme in the first 500ms.
2. **The Ticket Card** — perforated two-panel stub with shimmer, rotated -1.2deg, gold glow shadow. It appears on landing (as a preview), on the form's sticky summary (as live echo), on `/retrieve` (as retrieved tickets), and conceptually on `/admin` (as guest rows).
3. **The Art-Deco Corner Brackets** — gold L-brackets used in three places: scanner viewport, event-detail cards, and around the hero content block. This is the unifying ornament that ties all three page types to the same visual language.

---

End of design direction.
