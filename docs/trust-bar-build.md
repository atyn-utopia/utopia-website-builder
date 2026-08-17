# The trust bar — section 3.3

Two strips directly under the hero: a 3-point USP panel, then a scrolling strip of the brands you actually carry.

| | |
|---|---|
| **Reference** | `projects/water-tank-malaysia` |
| **Lives in** | `app/[locale]/page.tsx` + `components/PageStyles.tsx` |
| **Verified** | 17 Aug 2026 |

Two separate bands that do one job — surviving the first three seconds after the
hero. The USP panel answers *why you*; the brand strip answers *are you real*.

---

## The rules

**1 &middot; Three USP points, no visible section heading**
The bar sits immediately below the hero on every homepage. Its heading is `visually-hidden` — present for structure and screen readers, absent on screen, because a heading here interrupts the hero-to-proof flow.

**2 &middot; Brand strip below the USP bar**
Logos of the brands the client actually supplies. It is a factual claim about stock — only list brands they carry.

**3 &middot; Body copy in heading tags**
`h5` for the USP title and its supporting line, per the repo-wide no-bare-`<p>` rule. `PageStyles` resets `font-weight: inherit` so they still read as body copy, and re-bolds the first one.

**4 &middot; Mandatory on every homepage**
Not optional and not a per-project design decision.

---

## The markup

```tsx
      <section className="usp-bar" aria-labelledby="usp-heading">
        <h3 id="usp-heading" className="visually-hidden">{tUsp('srHeading')}</h3>
        <div className="container">
          <div className="usp-panel">
            {uspItems.map((u, i) => (
              <div key={i} className="usp-cell">
                <span className="usp-icon">
                  {i === 0 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M9 27 C9 15, 16 7, 16 7 C16 7, 23 15, 23 27 Z" fill="currentColor" stroke="none" />
                      <path d="M6 27 H26" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <path d="M6 14 L16 6 L26 14 V26 H6 Z" fill="currentColor" stroke="none" />
                      <path d="M13 26 V18 H19 V26" stroke="#0A2540" strokeWidth="2" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
                      <rect x="5" y="9" width="22" height="14" rx="2" fill="currentColor" stroke="none" />
                      <text x="16" y="19" textAnchor="middle" fontSize="7" fontWeight="800" fill="#0A2540" stroke="none">RM</text>
                    </svg>
                  )}
                </span>
                <h5>{u.title}</h5>
                <h5>{u.body}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STRIP — trust brands, sits below the USP bar */}
      <section className="brand-strip" aria-labelledby="brand-strip-heading">
        <div className="container">
          <h5 id="brand-strip-heading" className="brand-strip-eyebrow">{tBrand('eyebrow')}</h5>
          <div className="brand-strip-track no-scrollbar">
            <div className="marquee-track">
              {[...brandItems, ...brandItems].map((label, i) => (
                <span key={i} className="brand-chip">{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
```

## The CSS

Into `components/PageStyles.tsx`, inside its `<style>` block.

```css
.brand-strip { background: var(--brand-paper); padding: 32px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.brand-strip-eyebrow {
  font-family: var(--font-mono-stack);
  font-weight: 700;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin: 0 0 16px;
  text-align: center;
}
.brand-strip-track {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
}
.marquee-track { display: inline-flex; gap: 40px; padding: 6px 0; white-space: nowrap; will-change: transform; }
.brand-chip {
  color: var(--ink-muted);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  padding: 8px 18px;
  border: 1px solid var(--line);
  border-radius: 999px;
  flex-shrink: 0;
}

/* USP — floating residential cards on a soft water-blue wash */
.usp-bar { padding: 76px 0; background: linear-gradient(180deg, #EAF4FD 0%, #FFFFFF 100%); border-bottom: 1px solid var(--line); }
.usp-panel {
  max-width: 1120px;
  margin: 0 auto;
  background: transparent; border: none; box-shadow: none; overflow: visible;
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
}
@media (min-width: 768px) { .usp-panel { grid-template-columns: repeat(3, 1fr); } }
.usp-cell {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 42px 28px 34px;
  background: #fff;
  border: 1px solid #E1EEFA;
  border-radius: 24px;
  box-shadow: 0 22px 48px -24px rgba(14,123,214,0.34), 0 4px 12px -6px rgba(10,37,64,0.06);
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.usp-cell:hover { transform: translateY(-5px); box-shadow: 0 32px 64px -26px rgba(14,123,214,0.44); }
.usp-icon {
  width: 74px; height: 74px; display: grid; place-items: center;
  border-radius: 50%;
  background: linear-gradient(140deg, var(--brand-orange-bright) 0%, var(--brand-orange) 52%, var(--brand-orange-deep) 100%);
  box-shadow: 0 16px 32px -10px rgba(14,123,214,0.6), inset 0 0 0 1px rgba(255,255,255,0.28);
  color: #fff;
  margin-bottom: 22px;
}
.usp-cell h5:first-of-type {
  font-size: 19px; font-weight: 800;
  color: var(--brand-charcoal);
  letter-spacing: -0.02em;
  margin: 0;
}
.usp-cell h5:last-of-type {
  font-size: 14.5px; line-height: 1.6;
  color: var(--ink-muted);
  margin: 10px 0 0;
  max-width: 32ch;
  font-weight: 500;
}
```

---

## What breaks it

**A visible heading over the USP bar** · *silent*
Turns a proof strip into another section and pushes the products below the fold. Keep it `visually-hidden`.

**Brands the client doesn't carry** · *visible*
The strip asserts stock. Listing a brand they can't supply is the same class of problem as an invented review count.

**Bare `<p>` for the USP copy** · *silent*
Passes the eye test, fails `body-text-in-headings`. Use `h5`.

**Four or five USP cells** · *visible*
Three points. The panel's grid and the mobile stack are built for three.

---

## Verify

- [ ] Exactly three USP cells, directly below the hero
- [ ] USP heading present but `visually-hidden`
- [ ] Brand strip lists only brands the client actually supplies
- [ ] USP copy is `h5`, not `<p>`
- [ ] Both strips centre on mobile

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/site-header-build.md`, `docs/site-footer-build.md`, `docs/reviews-section-build.md`, `docs/product-pricing-build.md`, `docs/cta-whatsapp-build.md`, `docs/whatsapp-routing-build.md`. Rules: CLAUDE.md &rarr; Frontend Design Rules.
