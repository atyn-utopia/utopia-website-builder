# The hero — section 3.2

The only place a page spends its h1 and its h2. Background image, one headline, one supporting line, one green button.

| | |
|---|---|
| **Reference** | `projects/water-tank-malaysia` |
| **Lives in** | `app/[locale]/page.tsx` + `components/PageStyles.tsx` |
| **Verified** | 17 Aug 2026 |

The hero is the page's SEO anchor and its first conversion surface at the same
time. Everything below it uses `h3`–`h6`, because the hero has already spent both of
the page's top-level headings.

---

## The rules

**1 &middot; Exactly one `h1` and exactly one `h2` — both here**
`h1` is the main title, `h2` the supporting line directly under it. Every other section title on the page is `h3` or lower. A page missing either fails `homepage-h1-h2`, which is blocking.

**2 &middot; The background is an image with a gradient overlay**
Flat colour heroes are forbidden. The overlay is not decoration — it is what keeps the headline readable over photography. The bg element carries `role="img"` and an `aria-label`, so it is described to screen readers rather than being invisible.

**3 &middot; One WhatsApp CTA, official green**
`waRedirect(locale)` with no message and no location on the homepage; `waRedirect(locale, undefined, loc.slug)` on a location page. Three words maximum.

**4 &middot; Mobile is the primary viewport**
Headline, subtitle, button and stats all centre on mobile. Left-aligned body text is fine; standalone elements are not.

---

## The markup

```tsx
      <section className="hero hero-solo">
        <div className="hero-bg" role="img" aria-label={tHero('bgAlt')} />
        <div className="container hero-grid hero-grid-solo">
          <div className="hero-text">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tankpro-light.png" alt={tNav('logoAlt')} width={600} height={441} className="hero-logo" />
            <span className="eyebrow eyebrow-light">{tHero('eyebrow')}</span>
            <h1>
              {tHero('h1Part1')}{' '}
              <span className="hero-h1-accent">{tHero('h1Highlight')}</span>{' '}
              {tHero('h1Part2')}
            </h1>
            <h2>{tHero('h2')}</h2>
            <h5 className="hero-support">{tHero('supporting')}</h5>
            <div className="hero-cta-row">
              <WhatsAppButton href={waRedirect(locale)} label="hero" className="btn btn-wa">
                <WaIcon /> {tHero('ctaPrimary')}
              </WhatsAppButton>
              <a href="#packages" className="hero-secondary">{tHero('ctaSecondary')}</a>
            </div>
          </div>
        </div>
      </section>

      <MarketingMarquee locale={locale} variant="light" />
```

## The CSS

Into `components/PageStyles.tsx`, inside its `<style>` block.

```css
.hero {
  position: relative;
  color: #fff;
  padding: 44px 0 52px;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-color: var(--brand-charcoal);
  /* Mobile: darker on the left/top where the text sits, easing right */
  background-image:
    linear-gradient(115deg, rgba(10,37,64,0.93) 0%, rgba(10,37,64,0.85) 42%, rgba(10,37,64,0.66) 72%, rgba(10,37,64,0.52) 100%),
    url('/brand/bg-hero.png');
  background-size: cover, cover;
  background-position: center, center right;
  background-repeat: no-repeat, no-repeat;
  z-index: 0;
}
@media (min-width: 880px) {
  /* Desktop: solid navy on the left, fading to near-clear on the right so
     the rooftop King Kong tanks read clearly behind the left-aligned text. */
  .hero-bg {
    background-image:
      linear-gradient(90deg, rgba(10,37,64,0.95) 0%, rgba(10,37,64,0.9) 30%, rgba(10,37,64,0.66) 45%, rgba(10,37,64,0.2) 60%, rgba(10,37,64,0) 72%),
      url('/brand/bg-hero.png');
    background-size: cover, cover;
    background-position: center, center right;
  }
}
.hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(52% 70% at 12% 38%, rgba(53,180,240,0.14) 0%, transparent 60%);
  pointer-events: none;
}
.hero-grid {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
}
@media (min-width: 880px) { .hero-grid { grid-template-columns: minmax(0,1fr) minmax(0,1.1fr); gap: 64px; } }
.hero-text { display: flex; flex-direction: column; gap: 14px; text-align: center; }
@media (min-width: 880px) { .hero-text { text-align: left; align-items: flex-start; } }
.hero-logo {
  display: block;
  width: clamp(120px, 13vw, 192px);
  height: auto;
  aspect-ratio: 600 / 441;
  margin: 4px auto 12px;
  object-fit: contain;
}
@media (min-width: 880px) { .hero-logo { margin: 4px 0 12px; } }
/* Headings keep their natural casing from the source strings (proper Title Case with lowercase conjunctions). */
.hero-text h1 {
  font-size: clamp(2rem, 4.6vw, 3.5rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0;
}
.hero-h1-accent { color: #56C1F5; }
.hero-text h2 {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: rgba(255,255,255,0.82);
  margin: 0;
}
.hero-support {
  font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
  line-height: 1.7;
  color: rgba(255,255,255,0.66);
  margin: 0;
  max-width: 56ch;
}
.hero-cta-row {
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
@media (min-width: 640px) { .hero-cta-row { flex-direction: row; align-items: center; } }
@media (min-width: 880px) { .hero-cta-row { justify-content: flex-start; } }
.hero-secondary {
  color: var(--brand-orange-bright);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.005em;
}
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
@media (min-width: 880px) { .hero-stats { justify-content: flex-start; } }
.hero-stats > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
@media (min-width: 880px) { .hero-stats > div { align-items: flex-start; } }
.hero-stat-num {
  font-family: var(--font-mono-stack);
  font-weight: 700;
  font-size: 28px;
  color: #fff;
  line-height: 1;
}
.hero-stat-label {
  font-family: var(--font-mono-stack);
  font-weight: 500;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}
.hero-stat-div { width: 1px; height: 32px; background: var(--brand-orange); opacity: 0.4; }
.hero-image { position: relative; display: flex; justify-content: center; }
.hero-image-img {
  width: 110%;
  max-width: 800px;
  height: auto;
  aspect-ratio: 1600 / 1137;
  filter: drop-shadow(0 36px 70px rgba(14, 123, 214, 0.28));
  border-radius: var(--radius-card);
}
@media (min-width: 880px) {
  .hero-image { justify-content: flex-end; }
  .hero-image-img { margin-right: calc(var(--gut) * -1); }
}

/* BRAND STRIP */
```

---

## What breaks it

**Two h1s, or no h2** · *blocking*
A second `h1` anywhere on the page — a logo wrapped in one, a section title promoted — breaks the hierarchy the whole page is built on. `homepage-h1-h2` is a blocking check and it counts both.

**A hero image that doesn't match the product** · *silent*
The most-seen image on the site. On the aircond fleet most stock indoor-unit photography carries a competitor's brand on the fascia — no checklist catches it, so it has to be eyeballed.

**No gradient overlay** · *silent*
Reads fine on the one screenshot you checked and becomes unreadable on a bright photo or a small screen.

**A four-word CTA label** · *visible*
Wraps on mobile. `cta-button-word-limit` catches `en` and `ms`.

---

## Verify

- [ ] Exactly one `h1` and one `h2`, both in the hero
- [ ] Background is an image with a gradient overlay, `role="img"` + `aria-label`
- [ ] Image actually depicts this product, and carries no competitor branding
- [ ] CTA is `#25D366`, ≤3 words, routed through `waRedirect()`
- [ ] Everything centres on mobile
- [ ] `h1` carries the page's primary keyword

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/site-header-build.md`, `docs/site-footer-build.md`, `docs/reviews-section-build.md`, `docs/product-pricing-build.md`, `docs/cta-whatsapp-build.md`, `docs/whatsapp-routing-build.md`. Rules: CLAUDE.md &rarr; Frontend Design Rules.
