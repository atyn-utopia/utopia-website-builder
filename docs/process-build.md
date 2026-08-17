# The process section — section 3.5

Numbered 1-2-3 steps that must close with a WhatsApp CTA — because step 1 is almost always "WhatsApp us".

| | |
|---|---|
| **Reference** | `projects/water-tank-malaysia` |
| **Lives in** | `app/[locale]/page.tsx` + `components/PageStyles.tsx` |
| **Verified** | 17 Aug 2026 |

Three numbered steps and then a button. The button is not a nicety: step 1 is
almost always *&ldquo;WhatsApp us your details&rdquo;*, so a section that tells the reader
exactly what to do and then gives them nothing to tap wastes the highest-intent moment
on the page.

---

## The rules

**1 &middot; The section must close with a CTA**
WhatsApp button plus one line of supporting copy. Mandatory on every project, on the homepage **and** every location page. See `docs/cta-whatsapp-build.md` for the block.

**2 &middot; Centre the CTA at every breakpoint**
It is one action for the whole section, not a per-card control.

**3 &middot; Location pages pass the town through**
`waRedirect(locale, undefined, loc.slug)` so the lead is attributed to that location.

**4 &middot; Steps are `h5`, section title is `h3`**
The hero owns `h1` and `h2`.

---

## The markup

```tsx
      <section className="section process-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tProcess('eyebrow')}</span>
            <h3>{tProcess('h3')}</h3>
          </div>
          <div className="steps-flow">
            {processSteps.map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-badge">{i + 1}</div>
                <h5 className="step-title">{s.title}</h5>
                <h5 className="step-body">{s.body}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>
```

## The CSS

Into `components/PageStyles.tsx`, inside its `<style>` block.

```css
.steps-flow { display: grid; grid-template-columns: 1fr; gap: 30px; margin-top: 8px; }
@media (min-width: 880px) { .steps-flow { grid-template-columns: repeat(4, 1fr); gap: 20px; } }
.step-item { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.step-badge {
  width: 66px; height: 66px; border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(140deg, var(--brand-orange-bright), var(--brand-orange-deep));
  color: #fff; font-family: var(--font-display); font-weight: 800; font-size: 27px;
  box-shadow: 0 16px 30px -10px rgba(14,123,214,0.6), inset 0 0 0 1px rgba(255,255,255,0.25);
  position: relative; z-index: 1;
}
@media (min-width: 880px) {
  .step-item:not(:last-child)::after {
    content: ''; position: absolute; top: 32px; left: 50%; width: 100%;
    transform: translateX(42px);
    height: 2px;
    background: repeating-linear-gradient(90deg, var(--brand-orange-ring) 0 8px, transparent 8px 16px);
    z-index: 0;
  }
}
.step-title { font-size: 17.5px; font-weight: 800; color: var(--brand-charcoal); margin: 6px 0 0; letter-spacing: -0.01em; }
.step-body { font-size: 14px; line-height: 1.55; color: var(--ink-muted); margin: 0; max-width: 26ch; }
```

---

## What breaks it

**No CTA at the end — live on the reference** · *visible*
`water-tank-malaysia`, the canonical layout reference, ends its `.process-section` right after `.steps-flow`. `light-tower-rental` and `daikin-aircond` have the CTA. Copy theirs.

**A location-page CTA with no `loc.slug`** · *silent*
The lead lands unattributed, so per-location routing and reporting both go blind.

**A per-card button** · *visible*
Three buttons for one action. One centred CTA closes the section.

---

## Verify

- [ ] Section closes with a centred WhatsApp CTA — homepage and every location page
- [ ] CTA carries one line of supporting copy
- [ ] Location variant passes `loc.slug`
- [ ] Steps are numbered and read as a sequence
- [ ] Section title is `h3`, step copy is `h5`

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/site-header-build.md`, `docs/site-footer-build.md`, `docs/reviews-section-build.md`, `docs/product-pricing-build.md`, `docs/cta-whatsapp-build.md`, `docs/whatsapp-routing-build.md`. Rules: CLAUDE.md &rarr; Frontend Design Rules.
