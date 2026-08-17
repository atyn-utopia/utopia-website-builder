# Majlis Aqiqah — Design Direction

> **Author:** Kagura (UI Design Specialist)
> **Project:** `majlis-aqiqah` · `majlisaqiqah.my`
> **Scaffolded from:** `projects/sewa-excavator` (canonical skeleton)
> **Palette:** Emerald `#0C5B45` · Forest `#073A2C` · Antique gold `#C79A4B` · Cream paper `#FBF7EF`
> **Type stack:** Playfair Display (h1–h3) + Inter (everything else) — JetBrains Mono to be **removed**
> **Signature shape:** the **mihrab arch** (round-topped niche) — applied to hero photo, gallery, USP icons, package media
> **Signature texture:** **girih / khatam eight-point tessellation** — replaces the engineering blueprint grid

---

## 0. What I actually reviewed

Read before proposing: `app/globals.css`, `components/PageStyles.tsx`, `app/[locale]/page.tsx`,
`components/Calculator.tsx`, both brand logos, `inputs.md`, `ASSETS.md`, and the sibling sites
`sewa-excavator`, `water-tank-malaysia`, `cat-rumah-malaysia`, `service-aircond-malaysia`,
`katering-auntyrokiah`, `little-star-big-star`, `hollywood-night`.

### The finding that matters

I diffed the CSS class inventory of `majlis-aqiqah/components/PageStyles.tsx` against
`sewa-excavator/components/PageStyles.tsx`. **They are a 1:1 match — 73 of 73 selectors, same
names, same order, same structural values.** The homepage section comment blocks are also identical
(`HERO → BRAND STRIP → PRODUCTS → PROCESS → WHY US → REVIEWS → GALLERY → FAQ → LOCATIONS → FINAL CTA`).

The precedent for what happens if this is left alone is already in the repo:
`water-tank-malaysia/app/globals.css` still declares `--brand-orange: #0E7BD6` — a blue value under an
orange token name. That site *is* the excavator site with a find-and-replace on the hue. Majlis Aqiqah
is currently on exactly that trajectory: the re-skin so far is a token rename (`--brand-orange` →
`--brand-gold`, `--brand-charcoal` → `--brand-emerald`) plus a font swap. Everything below is aimed at
breaking that, and it has to break the **shapes and textures**, not the colours — the colours are
already correct.

Credit where due: the re-skin already landed four genuine divergences — the Playfair/Inter split, the
`app/icon.svg` crescent-and-cradle mark, the `.tread-divider` ornament replacing the excavator tread,
and the gender/tier package selector replacing the tonnage rental calculator. Those are kept and built on.

---

## 1. Existing sites audit

| Sibling | Palette | Hero signature | Texture / motif | Type |
|---|---|---|---|---|
| **sewa-excavator** (our skeleton) | Orange `#F26C1F` + charcoal `#0F0F0F` | Split grid, text left / framed machine photo right, mono stat row, ops ticker | 56px blueprint grid, excavator-tread divider | Inter + JetBrains Mono |
| **water-tank-malaysia** | Blue `#0E7BD6` + navy `#0A2540` | Identical to excavator | Identical blueprint grid | Inter + JetBrains Mono |
| **cat-rumah-malaysia** | Ink `#111` + blue `#023d93` + yellow `#FFD23F` + pink `#E91E63` | Paint-brand strip, high-chroma multi-accent | Paint-swatch blocks | Inter |
| **service-aircond-malaysia** | Navy `#1B3A5C` + electric yellow `#FFE500` | Trust-forward, cool cream `#F8FAFF` | Flat panels | Inter |
| **little-star-big-star** / **hollywood-night** | — | — | — | **Playfair Display** + Inter |

**Palette clearance:** emerald + antique gold + cream appears on no sibling. No conflict. ✅
**Type clearance:** Playfair Display is already used by `little-star-big-star` and `hollywood-night`.
Neither is in this category, and Playfair is the closest Google font to the high-contrast Didone
serif in the client's wordmark — so it stays. It must earn its distinctiveness through **scale and
restraint** (see §5), not by swapping to another serif that fights the logo.

---

## 2. Duplication audit — section by section

Every row below is currently *identical in shape* to `sewa-excavator`. Priority is the implementation order.

| # | Section | Class(es) in `PageStyles.tsx` | Why it reads as "the excavator site in green" | Proposed divergence | P |
|---|---|---|---|---|---|
| 1 | Dark-section texture | `.bg-blueprint`, `.bg-blueprint-glow` (in `globals.css`) | A 56px **engineering blueprint grid**. It is the excavator brand's core metaphor — construction drawings. On a religious family observance it is semantically wrong, not just derivative. | Replace with a **girih / khatam eight-point tessellation** in gold at 0.14 opacity. Exact recipe in §4.1. | **P0** |
| 2 | Page ground | `body { background: #FFFFFF }` | Every Utopia site is white-bodied. Cream is already tokenised (`--brand-paper: #FBF7EF`) but only used on three sections. | Make **cream the page ground**; white becomes the *elevated* card surface. One line, changes the feel of every page. | **P0** |
| 3 | Hero composition | `.hero-grid`, `.hero-text`, `.hero-image-img` | Split grid, text left / rectangular framed photo right, at `minmax(0,1fr) minmax(0,1.1fr)`. Byte-identical to excavator. | Keep the split (it works on mobile) but **arch the photo** — mihrab top on `.hero-image-img` — and inset a gold hairline frame. §4.2. | **P0** |
| 4 | Hero ops ticker | `.ops-ticker`, `.ops-ticker-inner` | A **fleet-dispatch device**. `SEMBELIH IKUT SYARIAH · KL ▸ KOTA KINABALU` in uppercase mono with `▸` arrows reads as logistics telemetry. Tonally wrong for a newborn's aqiqah. | **Delete outright.** Replace with a single centred gold-hairline rule carrying the tagline *Kami Melengkapkan Majlis Aqiqah Anda*. §4.2. | **P0** |
| 5 | Mono type role | `--font-mono-stack` on `.eyebrow`, `.hero-stat-num`, `.hero-stat-label`, `.price-label`, `.price-value`, `.product-tag`, `.process-num`, `.review-source`, `.state-block h4`, `.fomo-tag`, `.calc-*` | JetBrains Mono is the excavator's **technical/industrial** signature. Nine components inherit it. This is the single largest carrier of the clone feel after the blueprint grid. | **Remove JetBrains Mono from the site.** Eyebrows/labels → Inter 600 with `0.16em` tracking. Display numerals (`.hero-stat-num`, `.process-num`, `.price-value`, `.calc-num`) → **Playfair Display 700**. §5.3. | **P0** |
| 6 | Package card media | `.product-media` | `object-fit: contain`, 22px padding, on a `#FFFFFF → #FFF6EE` gradient — a **machine-cutout-on-white product shot**. Our assets are full-frame food photography (`products/pakej-*.jpg`); contain-fitting them leaves cream letterboxing around a briyani platter. | Full-bleed `object-fit: cover`, zero padding, arch-topped, bottom scrim so the tag stays legible. §4.4. | **P0** |
| 7 | Calculator panel | `.calc-panel` + `.calc-*` in `Calculator.tsx` | The *logic* is already ours (gender → head count → tier). The *shell* is not: blueprint-grid background, `--shadow-xl`, and a `clamp(2.5rem, 7vw, 5rem)` mono numeral. A giant monospace RM figure is a plant-hire quote machine. | Keep logic + chips. Re-shell: girih texture, Playfair numeral, reframe the output as a **ringkasan majlis** (summary), not a quote readout. §4.5. | **P0** |
| 8 | USP panel | `.usp-panel`, `.usp-icon` | Dark slab + three 72px squircle icon tiles with a 20px radius and a gold gradient. Structurally identical to the excavator's charcoal slab with orange tiles. | Icon container becomes a **mihrab arch** with a gold hairline on emerald, not a filled squircle. Panel gets the girih texture. §4.3. | **P1** |
| 9 | Gallery | `.gallery-grid`, `.gallery-item` | 2/4-column square grid, `--radius-md` corners. Same on five sibling sites. | **Arch-topped tiles**, 3 columns at `≥768px` (12 images ÷ 3 = 4 full rows — no blank slot at any breakpoint), gold hairline. §4.6. | **P1** |
| 10 | Hero brand lockup | `.hero-logo` | Renders the full `majlis-aqiqah-dark.png` **wordmark** directly above an `<h1>` that says the brand name — and the same wordmark is already in `SiteHeader` 60px higher. Three repetitions of one word in one viewport. | Swap to the **mark only** (crescent + cradle, no wordmark) at 64px, centred, as an ornament above the eyebrow. Needs a `brand/mark-gold.svg` cut from the logo. §4.2. | **P1** |
| 11 | Why-us cards | `.why-card` | `border-left: 3px solid` accent bar — the most reused card device in the repo (excavator, water-tank, skylift all use it). | Drop the left bar. Use a **top-centred arch bullet** in gold + centred text, on white over cream. §4.7. | **P1** |
| 12 | Ornament divider | `.tread-divider` | Already diverged from the excavator tread — good. But it is a row of hard diamonds and reads as a bullet list, not an arabesque. | Redraw as an **interlaced arabesque band** with the octagram at centre. §4.8. | **P2** |
| 13 | Process cards | `.process-card`, `.process-num` | Four white cards, big numeral top-left, over an image background. Same as excavator + water-tank. | Numeral in a **gold arch medallion**, centred, with a connecting hairline between cards at `≥980px`. §4.9. | **P2** |
| 14 | Reviews | `.review-card` | White card, Google G top-right, stars, quote. Repo-wide identical. | Add a large gold `”` glyph watermark; centre content on mobile. §4.10. | **P2** |
| 15 | FAQ / Locations | `.faq-item`, `.state-block`, `.city-chip` | `+`/`−` disclosure, mono state labels, pill chips. Repo-wide identical. | `+` → gold arch chevron; state labels to Inter small-caps. §4.11. | **P2** |

---

## 3. Visual concept

**Warm, celebratory, reverent, family-centred.** An aqiqah is a *kenduri* — food, family, gratitude,
and an obligation discharged correctly. Two things must be simultaneously true on the page: *this
will be a beautiful majlis* and *this will be done properly, ikut syariah*. Beauty comes from the
gold and the serif; correctness comes from restraint, hairlines and symmetry.

**The organising idea: the niche.** The mihrab arch — the round-topped recess in a mosque wall — is
the one shape that is unmistakably Islamic without being ornamental kitsch, and it happens to be a
perfect photo mask: it crops a portrait subject at the head, which flatters every image in
`ASSETS.md` (parents with a newborn, a goat herd in pasture, a briyani platter). Used consistently
across hero photo, gallery tile, USP icon frame and package card, one shape carries the whole site's
identity. No sibling site has a non-rectangular photo mask.

**The hierarchy: gold on emerald, on cream.** Emerald is the *authority* colour — it holds the
serious surfaces (USP panel, footer, dark bands, section headings). Gold is the *celebration*
colour — hairlines, numerals, arch frames, ornaments, the primary button — used as **line and
accent, never as a large fill**. A gold-flooded page reads cheap; gold at 1–2px reads expensive.
Cream `#FBF7EF` carries the page and 70% of the vertical scroll: it is the paper the kenduri
invitation is printed on.

**Restraint rule.** Two arches maximum per viewport. The tessellation appears only on dark sections
and only at ≤0.16 opacity. If a section can be carried by cream + a gold hairline, it should be.

---

## 4. Section-by-section treatment

All paths relative to `projects/majlis-aqiqah/`.

### 4.1 — Dark texture: retire the blueprint grid  **[P0]**

In `app/globals.css`, add the arch/pattern tokens to `:root`:

```css
  /* Signature shape — mihrab arch. One token so every masked element matches. */
  --arch: 48% 48% var(--radius-card) var(--radius-card) / 34% 34% var(--radius-card) var(--radius-card);
  --arch-sm: 48% 48% 10px 10px / 34% 34% 10px 10px;

  /* Signature texture — girih / khatam octagram tessellation, 80px tile */
  --girih: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke='%23E3C489' stroke-width='1'><rect x='16' y='16' width='48' height='48'/><rect x='16' y='16' width='48' height='48' transform='rotate(45 40 40)'/><circle cx='40' cy='40' r='4'/><rect x='-24' y='-24' width='48' height='48'/><rect x='56' y='56' width='48' height='48'/></g></svg>");
```

Then **replace both blueprint rules** (they currently sit at `globals.css:364–378`):

```css
.bg-girih, .bg-girih-glow { position: relative; background-color: var(--brand-emerald); }
.bg-girih-glow { background-image: var(--gradient-hero-glow); }
.bg-girih::before, .bg-girih-glow::before {
  content: ''; position: absolute; inset: 0; z-index: 0;
  background-image: var(--girih); background-size: 80px 80px; background-position: center;
  opacity: 0.14; pointer-events: none;
}
.bg-girih > .container, .bg-girih-glow > .container { position: relative; z-index: 1; }
```

The pattern rides on a pseudo-element rather than a tinted SVG so the 0.14 opacity is adjustable in
one place. Keep `.bg-blueprint` / `.bg-blueprint-glow` as aliases for one commit if other pages
reference them, then delete. Grep first: `grep -rn "bg-blueprint" app components`.

### 4.2 — Hero  **[P0]**

`components/PageStyles.tsx`, `.hero-*` block:

- **`.hero-image-img`** — `border-radius: var(--radius-lg)` → `border-radius: var(--arch)`.
  Keep `aspect-ratio: 4 / 5` and `object-position: center 32%` (the arch crops at the head, which is
  exactly where `brand/hero-photo.jpg` wants to be cropped). Replace the current border+shadow with:
  ```css
  border: none;
  box-shadow:
    0 0 0 1px var(--brand-gold),
    0 0 0 9px rgba(199, 154, 75, 0.10),
    0 40px 80px -24px rgba(7, 58, 44, 0.55);
  ```
  The double-ring reads as a gilded frame rather than the excavator's flat 6px halo.
- **`.ops-ticker` — delete.** Remove the markup block at `app/[locale]/page.tsx:219–225` and the
  `.ops-ticker*` rules at `globals.css:479–496`. Replace with a tagline rule:
  ```css
  .hero-tagline {
    display: flex; align-items: center; gap: 14px;
    font-family: var(--font-serif); font-style: italic;
    font-size: clamp(0.95rem, 1.5vw, 1.125rem);
    color: var(--brand-gold-bright); margin-top: 6px;
  }
  .hero-tagline::before, .hero-tagline::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--brand-gold), transparent);
  }
  @media (min-width: 880px) { .hero-tagline::before { display: none; } }
  ```
- **`.hero-logo`** — point at a mark-only asset (`/brand/mark-gold.svg`, crescent + cradle cut from
  the logo, no wordmark) and shrink to `width: 64px; aspect-ratio: 1;`. Drop the mobile override at
  `globals.css:237` that blows it to `clamp(180px, 50vw, 280px)`.
- **`.hero-stat-num`** — `font-family: var(--font-serif); font-weight: 700; font-size: 32px;` and
  `color: var(--brand-gold-bright)`. `.hero-stat-label` → `font-family: var(--font-display); font-weight: 600;
  font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;`.
- **`.hero-stat-div`** — `height: 32px` → `40px`, `opacity: 0.4` → `0.55`.
- **`.hero-text h1`** — `letter-spacing: -0.035em` → `-0.02em`. Playfair's Didone contrast breaks up
  at tight excavator-grade tracking; −0.02em is the floor.
- Hero `padding: 80px 0 96px` → `96px 0 112px`. The subject deserves more air than a machine does.

### 4.3 — USP bar  **[P1]**

- `.usp-panel` — add the girih texture behind the existing `::before` radial glow. The panel already
  uses `::before`; add the pattern as a second layer inside that same rule at 0.10:
  `background-image: radial-gradient(60% 100% at 50% 0%, rgba(199,154,75,0.18) 0%, transparent 70%), var(--girih);`
  with `background-size: auto, 80px 80px;`. Keep the emerald fill and `--radius-card`.
- `.usp-icon` — this is the highest-leverage single change in the section:
  ```css
  .usp-icon {
    width: 68px; height: 84px;
    border-radius: var(--arch-sm);
    background: transparent;
    border: 1.5px solid var(--brand-gold);
    box-shadow: inset 0 0 24px rgba(199, 154, 75, 0.18);
    color: var(--brand-gold-bright);
    display: grid; place-items: center; margin-bottom: 22px;
  }
  ```
  The three inline SVGs at `page.tsx:259–282` currently use `fill="currentColor"` with `#16241E`
  knockouts sized for a filled tile. On a transparent arch they must become **stroked outlines**:
  set `stroke="currentColor" fill="none" stroke-width="1.6"` and delete the `#16241E` counter-shapes.
- `.usp-cell` dividers `rgba(255,255,255,0.08)` → `rgba(199, 154, 75, 0.22)` — gold hairlines, not grey.

### 4.4 — Packages (products)  **[P0]**

`.product-media`:
```css
.product-media {
  position: relative;
  aspect-ratio: 4 / 3;
  padding: 0;
  background: var(--brand-paper);
  border-bottom: none;
  border-radius: var(--arch);      /* arch top, soft bottom */
  overflow: hidden;
}
.product-media img { width: 100%; height: 100%; object-fit: cover; }
.product-media::after {            /* scrim so .product-tag stays legible */
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(7,58,44,0.42) 0%, transparent 42%);
}
```
Card body: `.product-card` border `var(--line)` → `1px solid var(--brand-gold-ring)`, and hover
shadow keeps the existing gold-tinted recipe. `.product-title` → `font-family: var(--font-serif);
font-size: 23px;` (Playfair earns its place on package names). `.product-tag` → Inter 700, 10px,
`0.16em` tracking, emerald pill with a `1px` gold hairline. `.price-value` → Playfair 700, 19px;
`.price-label` → Inter 600, `0.16em`. Grid stays `1fr` → `1fr 1fr` at 768px (4 packages = 2 full rows).

### 4.5 — Package selector (`Calculator.tsx`)  **[P0]**

Logic and the three controls stay exactly as built — they are already project-unique and correct
(2 head for a boy, 1 for a girl). Only the shell changes:

- `.calc-panel` — drop the inlined 56px blueprint gradients (`Calculator.tsx:118–121`). Replace with
  `background: var(--brand-emerald); background-image: var(--girih); background-size: 80px 80px;`
  and lower it behind the content with the same 0.12-opacity pseudo-element approach as §4.1.
  Border → `1px solid var(--brand-gold-ring)`.
- Section wrapper in `page.tsx:353` — `className="section bg-blueprint-glow calc-section"` →
  `"section bg-girih-glow calc-section"`.
- `.calc-num` — `font-family: var(--font-mono-stack)` → `var(--font-serif)`, size
  `clamp(2.5rem, 7vw, 5rem)` → `clamp(2.25rem, 6vw, 4rem)`. `.calc-rm` and `.calc-from` → Inter.
- `.calc-label`, `.calc-quote-label` → Inter 700, 10.5px, `0.16em`.
- `.calc-chip.is-active` keeps gold fill — correct, it is the one place a gold flood is right.
- **Framing:** the output is a *summary of the majlis*, not a machine quote. Keep
  `.calc-heads-pill` prominent (it is the syariah fact — "2 ekor untuk anak lelaki") and let the
  RM figure sit *below* it at the reduced size above. Copy strings are Nana's; the layout order
  (heads pill → amount → suffix) is already right in the component.
- `.calc-shimmer` — keep, it is a good gold hairline. Raise `opacity: 0.55` → `0.7`.

### 4.6 — Gallery  **[P1]**

```css
.gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
.gallery-item {
  aspect-ratio: 3 / 4;
  border-radius: var(--arch);
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--brand-gold-ring);
  background: var(--brand-paper);
}
```
**Blank-slot check:** 12 images ÷ 2 cols = 6 full rows; ÷ 3 cols = 4 full rows. Both clean. Do **not**
go to 4 columns with the arch mask — the arches get narrow and read as tombstones.

### 4.7 — Why us  **[P1]**

```css
.why-card {
  background: #fff;
  border: 1px solid var(--brand-gold-ring);
  border-left: none;                       /* was 3px solid gold — repo-wide cliché */
  border-radius: var(--radius-card);
  padding: 30px 24px 26px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 18px -8px rgba(7,58,44,0.08);
}
.why-card::before {                        /* small gold arch bullet, top-centre */
  content: ''; position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
  width: 34px; height: 12px;
  border-radius: 999px 999px 0 0;
  background: var(--brand-gold);
}
```
`.why-card h5:first-of-type` → `font-family: var(--font-serif); font-size: 18px;`.
`.why-section` background is already `--brand-paper` — once §4.2's cream body lands, change it to
`#FFFFFF` so the section still separates from the page ground.

### 4.8 — Ornament divider  **[P2]**

Redraw `.tread-divider` (`globals.css:382–389`) as an interlaced band — octagram at centre, tapering
hairline either side:

```css
.tread-divider {
  height: 28px; width: 100%;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='28' viewBox='0 0 120 28'><g fill='none' stroke='%23C79A4B' stroke-width='1.2' opacity='0.45'><rect x='50' y='4' width='20' height='20'/><rect x='50' y='4' width='20' height='20' transform='rotate(45 60 14)'/><path d='M0 14 H44 M76 14 H120'/><circle cx='60' cy='14' r='2'/></g></svg>");
  background-repeat: repeat-x; background-size: 120px 28px;
}
```
`.tread-divider-on-dark` — same path data with `stroke='%23E3C489'` and `opacity='0.6'`.
Rename the class to `.ornament-divider` and grep-replace; `tread` is excavator vocabulary.

### 4.9 — Process  **[P2]**

`.process-num` → gold arch medallion, centred:
```css
.process-num {
  font-family: var(--font-serif); font-weight: 700; font-size: 22px;
  color: var(--brand-gold-deep);
  width: 46px; height: 56px; margin: 0 auto;
  display: grid; place-items: center;
  border: 1.5px solid var(--brand-gold-ring);
  border-radius: var(--arch-sm);
  background: var(--brand-gold-pale);
}
```
`.process-card { text-align: center; align-items: center; }`, `.process-card h5:first-of-type` →
Playfair 17px. At `≥980px` add a connecting hairline between the four cards:
```css
@media (min-width: 980px) {
  .process-grid { position: relative; }
  .process-grid::before {
    content: ''; position: absolute; top: 56px; left: 12%; right: 12%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--brand-gold-ring) 15%, var(--brand-gold-ring) 85%, transparent);
    z-index: 0;
  }
  .process-card { position: relative; z-index: 1; }
}
```

### 4.10 — Reviews  **[P2]**

Add a gold quote watermark and centre on mobile:
```css
.review-card::before {
  content: '”';
  position: absolute; top: 6px; left: 18px;
  font-family: var(--font-serif); font-size: 68px; line-height: 1;
  color: var(--brand-gold); opacity: 0.16; pointer-events: none;
}
@media (max-width: 639px) {
  .review-card { text-align: center; align-items: center; }
  .review-card .stars { justify-content: center; }
}
```
`.review-source` → Inter 600, `0.16em`. `.review-author` → Playfair 15px.

### 4.11 — FAQ, locations  **[P2]**

- `.faq-item summary::after` — the `+` / `−` becomes a gold arch-capped chevron in a 26px round
  well: `background: var(--brand-gold-pale); border-radius: 999px; width: 26px; height: 26px;
  display: grid; place-items: center;` (keeps a 44px effective tap target with the existing 18px
  summary padding).
- `.state-block h4` — drop `--font-mono-stack` → Inter 700, 11px, `0.16em`, keep the gold underline.
- `.city-chip` — add `border: 1px solid var(--brand-gold-ring)` at rest so the chip row reads as a
  gilded index, not grey pills.

---

## 5. Typography

### 5.1 Roles

| Font | Where | Never |
|---|---|---|
| **Playfair Display** 700/800 | `h1`, `h2`, `h3`; `.product-title`; `.hero-stat-num`; `.calc-num`; `.process-num`; `.price-value`; `.review-author`; `.why-card h5:first-of-type` | Buttons, nav, eyebrows, labels, FAQ summaries, body paragraphs, list items, form controls, anything below 15px |
| **Playfair Display** italic 400 | `.hero-tagline` only — one instance per page | Anywhere else. Italic serif at volume reads as a wedding invitation, not a service business |
| **Inter** 400/600/700 | All body copy; `h4`–`h6` (they are body copy per the repo heading rule); every button label; nav; eyebrows and micro-labels; FAQ summaries; price labels; state labels; the whole `SiteHeader`/`SiteFooter` | Section headings |
| **JetBrains Mono** | — **remove entirely** | Everywhere. Delete the `--font-mono-stack` declaration and the `JetBrains_Mono` import in `app/[locale]/layout.tsx` once all nine consumers are migrated |

`globals.css:86` already scopes the serif correctly (`h1, h2, h3`). Extend it:
```css
h1, h2, h3, .product-title, .hero-stat-num, .calc-num, .process-num,
.price-value, .review-author { font-family: var(--font-serif); font-weight: 700; }
```

### 5.2 Scale

| Element | Mobile (390px) | Desktop | Tracking |
|---|---|---|---|
| `h1` | 34px | `clamp(2.25rem, 5.5vw, 4.5rem)` | `-0.02em` |
| `h2` (hero subtitle) | 19px | `clamp(1.125rem, 2vw, 1.5rem)` | `-0.01em` |
| `h3` (section head) | 26px | `clamp(1.625rem, 3vw, 2.25rem)` | `-0.018em` (was `-0.025em`) |
| `.product-title` | 21px | 23px | `-0.015em` |
| Body / `h4`–`h6` | 15.5px | 15–16px | `0` |
| Eyebrow / micro-label | 10.5px | 11px | `+0.16em` |
| Button label | 12.5px → 16px (mobile full-width) | 15px | `-0.005em` |

Minimum type size anywhere: **12px**. `.price-label` currently drops to 9px on mobile
(`globals.css:229`) and `.fomo-tag` to 9.5px (`globals.css:233`) — both must come up to 12px and
10.5px respectively; shorten the strings instead of shrinking the type.

### 5.3 Line height

Already correct in `globals.css:80–82` (1.2 headings / 1.4 body) — do not touch. Component-level
overrides that exceed this are fine where they already exist (`.hero-support` at 1.7, `.blog-content
p` at 1.75) since long-form body copy wants the extra air.

---

## 6. Mobile-first (390 × 844 — the primary viewport)

Ordered as they appear down the page.

1. **Hero** — everything centred. `.hero-text` is already `text-align: center` below 880px; keep. The
   mark ornament, eyebrow, h1, h2, tagline and stat row all centre. `.hero-stats` stays
   `justify-content: center` with `flex-wrap: wrap` — at 390px it wraps 2 + 1, which is acceptable;
   reduce `gap: 18px` → `14px` to try to hold all three on one line.
2. **Hero photo** — arch mask at `aspect-ratio: 4/5` is ~312 × 390 at 390px wide. Good. Verify the
   9px gold ring does not clip: the `box-shadow` spread sits outside the box, so `.hero-image`
   needs `padding: 10px` on mobile to avoid the ring being cropped by `overflow: hidden` on `.hero`.
3. **USP** — `.usp-panel` is already single-column below 768px with hairline dividers. Arch icon
   centres by default. `padding: 44px 32px` → `36px 22px` at ≤480px.
4. **Packages** — single column. Card media at `4/3` = 390 × 293 — the arch top is generous and the
   food photography reads well. CTA is full-width via the existing
   `@media (max-width: 640px) .btn { width: 100% }`. ✅
5. **Selector** — `.calc-grid` already collapses to one column at 760px. `.calc-chip { flex: 1 }`
   with three tiers at 390px gives ~110px chips — above the 44px target. ✅ `.calc-num` at
   `clamp(2.25rem, 6vw, 4rem)` = 36px on mobile; keep it from overflowing by holding
   `.calc-quote-amount` at `flex-wrap: wrap; justify-content: center`.
6. **Process** — single column, medallion centred, connecting hairline suppressed below 980px. ✅
7. **Why us** — single column, centred, arch bullet centred. ✅
8. **Reviews** — single column, centred (§4.10). ✅
9. **Gallery** — 2 columns × 6 rows, `gap: 10px`. Each tile ~180 × 240. No blank slot. ✅
10. **FAQ** — summary padding `18px 22px` + 26px marker = 62px row height, well over 44px. ✅
11. **Locations** — `.state-block ul` is `1fr 1fr` at all widths; at 390px with long names
    (`Kota Kinabalu`, `Seberang Perai`) this will wrap badly. Add
    `@media (max-width: 479px) { .state-block ul { grid-template-columns: 1fr; } }`.
12. **Vertical rhythm** — `--section-y: clamp(64px, 9vw, 112px)` gives 64px on mobile, above the
    56px floor. ✅
13. **No horizontal overflow** — the two risks are the hero photo's outer ring (item 2) and
    `.brand-strip-track` / `.gallery-grid`; both are `overflow: hidden` with `.no-scrollbar`. Verify
    at 360px as well as 390px.

---

## 7. Logo, mark and favicon

`app/icon.svg` is already correct and on-brand: emerald rounded square, gold crescent, gold star,
cream cradle with the swaddled baby, gold rocker. It is legible at 16px because the crescent is a
single high-contrast silhouette.

**One gap:** the same mark does not exist as a standalone asset for in-page use. Produce
`public/brand/mark-gold.svg` — the identical crescent + cradle + star geometry from `app/icon.svg`,
transparent background, gold `#C79A4B` crescent/rocker and cream `#FBF7EF` cradle — for the hero
ornament (§4.2) and as a lighter alternative to the divider in `.section-head`. The mark must be
**identical in construction** to the favicon; do not redraw it.

The two supplied wordmark PNGs (`brand_assets/aqiqah-{light,dark}-bg-logo.png`) stay exactly as they
are — header uses the light-bg green+gold version, footer uses the dark-bg white+gold version. **Do
not re-encode either to JPEG**; both carry alpha.

---

## 8. What NOT to change

These are system rules, not preferences. Any proposal above that appears to conflict loses.

- **Button shape is uniform site-wide.** `.btn` keeps `border-radius: var(--radius-btn)` (12px),
  `height: 52px` desktop / `44px` tablet / `56px` full-width mobile. Only `background-color` varies
  between `.btn-wa`, `.btn-primary`, `.btn-ghost`, `.btn-ghost-light`. **No arch masks on buttons.**
- **WhatsApp CTAs stay official green** `#25D366`, hover `#1EBE57`, white icon — nav, hero, package
  cards, selector, final CTA, floating FAB, blog banner. Never emerald, never gold, never tinted.
  `--wa-green` / `--wa-green-hover` in `globals.css:32–33` are correct; leave them.
- **FOMO banner stays red or black with a live ticking countdown.** `.fomo-bar` is on
  `--alert-red: #E10600` — correct. Do not re-theme it emerald or gold "for brand consistency". The
  only change permitted is raising `.fomo-tag` off 9.5px (§5.2).
- **Exactly one `<h1>` and exactly one `<h2>` per page**, both in the hero. Every other section
  heading is `h3`–`h6`. The `h4`/`h5`/`h6`-as-body-copy convention and its
  `font-weight: inherit` normaliser at `PageStyles.tsx:12–13` must survive every edit above.
- **`SiteHeader` and `SiteFooter` are not redesigned.** They stay structurally identical to
  `projects/sewa-excavator/components/`. Permitted deltas: brand name, logo file path, locale-aware
  nav labels, and the palette they inherit from `globals.css`. No per-page nav variants — no
  `BlogNav`. `SiteFooter` keeps the "Built by Utopia AI" credit and the `--r-button` / `--r-card` /
  `--r-pill` / `--ease` / `--dur-*` structural tokens (`globals.css:70–76`) untouched.
- **No phone numbers or domains as visible text** anywhere.
- **No default Tailwind blue or indigo.** The palette is fixed by the client logo.
- **Never convert image formats.** The Pexels JPEGs stay JPEG; the two logo PNGs stay PNG.
- **Gallery grid never leaves a blank slot** — 12 images at 2 or 3 columns only (§4.6).
- **CTA button labels stay ≤3 words** in `en` and `ms` (`ctaLabel`, `ctaPrimary`, `ctaSecondary`,
  `whatsappCta`, …). Copy is Nana's, but any label a design change introduces must obey it.
- **Products stay dynamic from Supabase.** The `fallbackPackages` path in `page.tsx:113–141` is a
  fallback only. The grid must survive 1, 4 or 20 packages — `1fr` → `1fr 1fr` does.
- **Section parity.** Homepage and location pages must expose the same section list in the same
  order; only copy differs. Every change above must be applied to
  `app/[locale]/pakej-aqiqah/[location]/page.tsx` in the same commit.

---

## 9. Implementation order

**P0 — ship these first; they are what stop the site reading as a recoloured clone**

1. §4.1 girih tessellation replaces `.bg-blueprint` / `.bg-blueprint-glow`
2. §4.2 cream page ground (`body { background: var(--brand-paper) }`)
3. §4.2 hero — arch photo mask + gilded double-ring
4. §4.2 delete `.ops-ticker`, add `.hero-tagline`
5. §5.1 remove JetBrains Mono; migrate its nine consumers to Inter or Playfair
6. §4.4 package card media — full-bleed arch, `object-fit: cover`
7. §4.5 selector re-shell — girih, Playfair numeral, no blueprint grid

**P1** — 8. §4.3 USP arch icons · 9. §4.6 gallery arches at 3 columns · 10. §4.2 hero mark-only
lockup + `public/brand/mark-gold.svg` · 11. §4.7 why-us cards

**P2** — 12. §4.8 arabesque divider (+ rename `.tread-divider` → `.ornament-divider`) ·
13. §4.9 process medallions · 14. §4.10 review watermark · 15. §4.11 FAQ + locations polish

---

## 10. Design review checklist

- [x] **Hero layout differs from all existing sites** — arch-masked photo with a gilded double-ring is
      unique in the repo; every sibling uses a rectangular framed image. Note the split-grid *skeleton*
      is retained deliberately: it is the correct responsive structure, and the divergence is carried by
      the mask, the ornament, the tagline rule and the removal of the ticker.
- [x] **Palette does not repeat any existing site** — emerald + antique gold + cream appears nowhere else.
- [x] **Typography pairing is unique within the system** — Playfair + Inter with **no mono** is a
      combination no sibling uses; the two Playfair sites pair it differently and are in other categories.
- [x] **Card/component styles visually distinct** — arch-topped media, gold-hairline borders, no
      left-accent bar, arch bullets and medallions.
- [ ] **Section ordering differs from existing homepage layouts** — **it does not, and should not.**
      The 15-block order is fixed by `architecture.md` and by the homepage/location-page parity rule.
      Flagged honestly rather than checked: differentiation here is bought with shape and texture,
      not with section sequence. This is the one checklist item I am deliberately not satisfying.
- [x] **Fits the category and audience** — reverent, warm, family-centred; no gore, no hard sell.
- [x] **Brand assets incorporated** — both wordmark PNGs, the crescent-cradle mark, the logo palette.
- [x] **Mobile-first** — §6 walks all 13 checks at 390px.
- [x] **Image backgrounds on some sections** — hero, process, reviews, final CTA (already in place).
- [x] **3-point USP bar immediately below the hero** — present. The 32px brand strip sits between; that
      matches the reference and reads as a band, not a section.
- [x] **All buttons the same rounded shape, colour-only variation** — §8, unchanged.
- [x] **No phone numbers or domains as visible text** — verified in `page.tsx`.
- [x] **One H1 + one H2, then H3–H6** — verified: `page.tsx:190` and `page.tsx:195`.
- [x] **All images verified for context** — cross-checked against `ASSETS.md`; every file's described
      subject matches its slot. `products/pakej-*.jpg` are acknowledged placeholders pending client photos.
- [x] **Accessibility** — gold `#C79A4B` on emerald `#0C5B45` is ~3.4:1, so gold is used for ≥18px
      display numerals, hairlines and ornament **only**, never for body copy on emerald; body on dark
      stays `rgba(255,255,255,0.7)`+. `:focus-visible` gold outline is already global (`globals.css:499`).
      Minimum type 12px (§5.2). Tap targets ≥44px (§6).

---

## 11. Still to run (after implementation)

The **pre-launch trust & marketing review** (§6 of `agents/kagura.md`) and **Layout Parity
Verification** are *not* done — both require the built site on localhost and a 390 × 844 screenshot
pass. Run both before Gate 1 sign-off, once the P0 items are in.
