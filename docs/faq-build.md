# The FAQ — section 3.8

Native `<details>` accordions, with FAQ schema emitted from the same array that renders them.

| | |
|---|---|
| **Reference** | `projects/water-tank-malaysia` |
| **Lives in** | `app/[locale]/page.tsx` + `components/PageStyles.tsx` |
| **Verified** | 17 Aug 2026 |

Two things have to stay in sync: what the reader sees and what Google is told.
Both come from one `faqItems` array — render it and pass it to `FAQSchema`, never
maintain two lists.

---

## The rules

**1 &middot; One array, rendered and marked up**
`<FAQSchema items={faqItems} />` takes the same array the accordions map over. Schema that disagrees with the visible page is a structured-data violation.

**2 &middot; Native `<details>` / `<summary>`**
Keyboard accessible and open-by-default-free with no JavaScript. The `+`/`−` marker is CSS on `summary::after`; the native triangle is hidden.

**3 &middot; Questions are `h4`, answers are body copy in a heading tag**
The section title is `h3`. `PageStyles` resets `font-weight: inherit` on `.faq-item h4` so answers still read as prose.

**4 &middot; Location pages get localised answers**
The reference rewrites `Malaysia` to `{town}, {state}` in each answer so the page isn't a duplicate.

---

## The markup

```tsx
      <section id="faq" className="section bg-paper">
        <div className="container faq-container">
          <div className="section-head">
            <span className="eyebrow">{tFaq('eyebrow')}</span>
            <h3>{tFaq('h3')}</h3>
          </div>
          <div className="faq-list">
            {faqItems.map((f, i) => (
              <details key={i} className="faq-item">
                <summary>{f.q}</summary>
                <h4>{f.a}</h4>
              </details>
            ))}
          </div>
        </div>
      </section>
```

## The CSS

Into `components/PageStyles.tsx`, inside its `<style>` block.

```css
.faq-container { max-width: 860px; }
.faq-list { display: flex; flex-direction: column; gap: 12px; }
.faq-item {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.faq-item summary {
  padding: 18px 22px;
  font-weight: 600;
  font-size: 15.5px;
  color: var(--brand-charcoal);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after { content: '+'; font-weight: 700; color: var(--brand-orange); font-size: 22px; }
.faq-item[open] summary::after { content: '−'; }
.faq-item p, .faq-item h4 { padding: 0 22px 20px; font-size: 14.5px; line-height: 1.7; color: var(--ink-muted); margin: 0; font-weight: inherit; }
```

---

## What breaks it

**Schema and page drifting apart** · *silent*
Two hand-maintained lists guarantee it. One array feeds both.

**Answers that don't answer** · *silent*
Filler FAQs are worse than none — they train the crawler that the page is thin.

**A JS accordion** · *visible*
`<details>` is free, accessible and works without hydration.

**Identical FAQs on 170 location pages** · *silent*
Duplicate content at scale. Substitute the town into the answers.

---

## Verify

- [ ] `FAQSchema` receives the same array the page renders
- [ ] Accordions are native `<details>`/`<summary>`
- [ ] Section title is `h3`, questions `h4`
- [ ] Answers are substantive and locale-appropriate
- [ ] Location pages substitute the town into the answers

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/site-header-build.md`, `docs/site-footer-build.md`, `docs/reviews-section-build.md`, `docs/product-pricing-build.md`, `docs/cta-whatsapp-build.md`, `docs/whatsapp-routing-build.md`. Rules: CLAUDE.md &rarr; Frontend Design Rules.
