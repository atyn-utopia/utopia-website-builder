# The packages section — section 3.6

Two or three bundles on a dark image band, each a card with a spec line, one price and
its own WhatsApp CTA.

| | |
|---|---|
| **Reference** | `projects/water-tank-malaysia` &middot; `daikin-aircond` |
| **Lives in** | `app/[locale]/page.tsx` + `components/PageStyles.tsx` + `messages/*.json` |
| **Anchor** | `#packages` — the canonical header nav links to it |
| **Not to be confused with** | `docs/product-pricing-build.md`, which covers the DB-backed product cards |
| **Verified** | 17 Aug 2026 |

This is the *offer* section: pre-bundled combinations sold at one number, sitting between
the product grid and the process steps. It is the page's highest-margin block and the
one most likely to be edited after launch.

---

## Read this before you copy it

**Package prices are currently hardcoded in the translation files.** `comboItems` comes
from `tCombo.raw('items')`, so every price lives as a **string** in
`messages/ms.json`, `messages/en.json` and `messages/zh.json`:

```jsonc
{ "name": "Hitachi 200W Combo", "price": "RM 5,411", "tag": "Most Popular" }
```

That breaks the rule the rest of the site follows. CLAUDE.md's Dynamic Product Data rule
is explicit that product data is fetched from the database and never hardcoded — and
these are products with prices on them. The consequences are concrete:

- changing a package price is a code edit in **three files** plus a redeploy, not a CMS
  change that propagates on a tag purge;
- the packages are invisible to webcore, so they can't be reported on, reordered, or
  deactivated the way products can;
- the price is duplicated per locale, so `ms` and `en` can silently disagree. (They
  currently match on water-tank — I checked all three — but nothing enforces it.)

**Recommended:** model packages as webcore products with `parent_id` set, and use the
`prices[]` line items for the bundle breakdown. Then this section renders from
`getProducts()` like everything else and the guide below becomes layout only. Until
that happens, treat the copy blocks here as the current implementation, not the target.

---

## 3.4 vs 3.6 — where the line is

These two sections look alike and are not the same thing. Getting the boundary wrong is
how a site ends up showing the same product twice at two different prices.

| | 3.4 Services / products / offer | 3.6 Packages / pricing |
|---|---|---|
| **What it lists** | individual items you sell | pre-bundled combinations |
| **Priced** | per item | one number for the whole bundle |
| **Data source** | `getProducts()` — webcore DB | `messages/*.json` (see the warning above) |
| **Anchor** | `#products` | `#packages` |
| **Card shows** | name, description, photo, price or `prices[]` | name, spec line naming the components, one price, tag |
| **Changes how** | CMS edit + tag purge | code edit + redeploy |
| **Guide** | `docs/product-pricing-build.md` | this one |

The practical test: **if a customer could buy just that thing on its own, it belongs in
3.4.** If it only exists as a combination — tank *plus* pump *plus* filter at a bundle
price — it belongs in 3.6.

The components named in a 3.6 spec line should be real 3.4 products. When they are, the
bundle price is checkable against the sum of its parts, and a discontinued component
shows up as a broken bundle instead of a silent one.

---

## The rules

**1 &middot; One price per card, and it must be real**
No computed "was" price, no invented strike-through. If the bundle genuinely was more
expensive, store the real former price; otherwise show one number. Same rule as the
product cards — see `docs/product-pricing-build.md`.

**2 &middot; Every card carries its own WhatsApp CTA**
Prefilled with the package name and price, so the enquiry arrives identifiable:
`waRedirect(locale, `${c.name} — ${c.price}`)`. Label is `combo-${i+1}` so analytics can
tell which bundle converted. CTA label is three words maximum.

**3 &middot; The section anchor is `#packages`**
The canonical `SiteHeader` links to it. A scaffolded site that drops this section
without also editing the nav ships a link to nowhere.

**4 &middot; One feature card, not three**
`combo-card-feature` scales the first card up and gives it the tag. Three equally
weighted cards give the reader no route in.

**5 &middot; Headings stay in the hierarchy**
Section title `h3`, card name `h4`, spec `h5`, footnote `h6`. The hero owns `h1`/`h2`.
The price itself is a `div`, not a heading — it's a number, not a title.

---

## The markup

```tsx
      <section id="packages" className="section combo-section">
        <div className="combo-bg" role="img" aria-label={tCombo('bgAlt')} />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow-light">{tCombo('eyebrow')}</span>
            <h3 style={{ color: '#fff' }}>{tCombo('h3')}</h3>
            <h5 className="combo-intro">{tCombo('intro')}</h5>
          </div>
          <div className="combo-grid">
            {comboItems.map((c, i) => (
              <article key={i} className={`combo-card${i === 0 ? ' combo-card-feature' : ''}`}>
                <span className="combo-cardtag">{c.tag}</span>
                <h4 className="combo-name">{c.name}</h4>
                <h5 className="combo-spec">{c.spec}</h5>
                <div className="combo-price">{c.price}</div>
                <WhatsAppButton
                  href={waRedirect(locale, `${c.name} — ${c.price}`)}
                  label={`combo-${i + 1}`}
                  className="btn btn-wa combo-cta"
                >
                  <WaIcon size={16} /> {tCombo('ctaLabel')}
                </WhatsAppButton>
              </article>
            ))}
          </div>
          <h6 className="combo-note">{tCombo('note')}</h6>
        </div>
      </section>
```

## The copy

Into all three `messages/*.json`. Keep the prices identical across locales.

```jsonc
"combo": {
  "eyebrow": "COMBO PACKAGES",
  "h3": "Tank + Pump + Filter, One Price",
  "intro": "…",
  "ctaLabel": "Get This Combo",
  "note": "…",
  "bgAlt": "…",
  "items": [
    {
      "name": "Hitachi 200W Combo",
      "spec": "King Kong 1000L + Hitachi 200W + 6-Layer Filter",
      "price": "RM 5,411",
      "tag": "Most Popular"
    }
  ]
}
```

## The CSS

Into `components/PageStyles.tsx`, inside its `<style>` block. The band is a dark image
with an overlay, so every text colour in here is explicitly light.

```css
.combo-section { position: relative; overflow: hidden; isolation: isolate; color: #fff; }
.combo-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    linear-gradient(150deg, rgba(14,123,214,0.88) 0%, rgba(10,90,168,0.85) 55%, rgba(10,37,64,0.92) 100%),
    url('/brand/combo-bg.png');
  background-size: cover, cover;
  background-position: center, center;
}
.combo-bg::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(50% 60% at 85% 12%, rgba(53,180,240,0.38) 0%, transparent 60%),
    radial-gradient(45% 55% at 8% 92%, rgba(53,180,240,0.22) 0%, transparent 60%);
}
.combo-section > .container { position: relative; z-index: 1; }
.combo-intro { color: rgba(255,255,255,0.86); max-width: 60ch; margin: 0 auto; }
.combo-grid { display: grid; grid-template-columns: 1fr; gap: 22px; margin-top: 16px; align-items: stretch; }
/* Wider gap on desktop so the scaled-up "Paling Popular" card doesn't crowd its neighbour */
@media (min-width: 880px) { .combo-grid { grid-template-columns: repeat(3, 1fr); align-items: center; gap: 44px; } }
.combo-card {
  position: relative; display: flex; flex-direction: column; gap: 12px;
  background: #fff;
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 24px;
  padding: 30px 26px 28px;
  box-shadow: 0 30px 60px -30px rgba(3,20,40,0.6);
}
.combo-card-feature {
  border: 3px solid var(--brand-orange-bright);
  box-shadow: 0 56px 104px -28px rgba(3,20,40,0.82), 0 0 0 6px rgba(53,180,240,0.16);
}
@media (min-width: 880px) { .combo-card-feature { transform: scale(1.09) translateY(-8px); z-index: 3; } }
.combo-cardtag {
  align-self: flex-start;
  font-weight: 800; font-size: 10.5px;
  letter-spacing: 0.08em; text-transform: uppercase;
  background: linear-gradient(135deg, var(--brand-orange-bright), var(--brand-orange));
  color: #fff; padding: 6px 12px; border-radius: 999px;
  box-shadow: 0 6px 14px -6px rgba(14,123,214,0.6);
}
.combo-name { font-size: 21px; font-weight: 800; color: var(--brand-charcoal); margin: 0; letter-spacing: -0.02em; }
.combo-spec { font-size: 14px; line-height: 1.6; color: var(--ink-muted); margin: 0; flex: 1; padding-bottom: 12px; border-bottom: 1px dashed #D6E6F5; }
.combo-price { font-family: var(--font-display); font-weight: 800; font-size: 30px; color: var(--brand-orange); letter-spacing: -0.02em; }
.combo-cta { width: 100%; }
.combo-note { text-align: center; margin-top: 26px; color: rgba(255,255,255,0.85); font-family: var(--font-display); font-weight: 600; font-size: 13px; letter-spacing: 0.01em; text-transform: none; }
```

---

## What breaks it

**Prices in three files** · *silent*
The current design. A price updated in `en` and missed in `ms` shows two different
numbers to two visitors with no warning and no check to catch it.

**A fabricated discount** · *visible, with legal exposure*
A struck-through "original" that was never charged is a misleading price comparison
under Malaysian trade-descriptions rules, and the client carries the risk. Don't
port `wasPrice()` into this section.

**A package that doesn't match stock** · *silent*
The spec line names specific models. If the client no longer supplies one, the bundle
is unsellable and the lead is wasted.

**Dropping the section but keeping the nav link** · *visible*
`#packages` is in the canonical header. Remove one, remove both.

**Light text assumptions** · *silent*
The band is dark, so this section's colours are hardcoded light. Reusing these class
names on a light background makes the copy invisible.

---

## Verify

- [ ] Every price is real — no computed or invented former price
- [ ] Prices identical across `ms`, `en` and `zh`
- [ ] Each card's CTA prefills the package name and price, with a distinct `label`
- [ ] CTA labels ≤3 words
- [ ] Section has `id="packages"` and the header nav points at it
- [ ] One feature card; the rest are secondary
- [ ] Headings are `h3` → `h4` → `h5` → `h6`; the price is not a heading
- [ ] Spec lines name products the client actually supplies

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/product-pricing-build.md` (the DB-backed product cards),
`docs/cta-whatsapp-build.md`, `docs/hero-build.md`, `docs/trust-bar-build.md`,
`docs/process-build.md`, `docs/locations-block-build.md`, `docs/faq-build.md`.
Rules: CLAUDE.md &rarr; Dynamic Product Data.
