# The coverage block — section 3.7

Every town the site serves, grouped by state, each one an internal link to its own location page.

| | |
|---|---|
| **Reference** | `projects/water-tank-malaysia` |
| **Lives in** | `app/[locale]/page.tsx` + `components/PageStyles.tsx` |
| **Verified** | 17 Aug 2026 |

This block is the site's internal-linking backbone. Every location page is
reachable from the homepage in one hop, which is how 150–180 thin pages get crawled at
all.

---

## The rules

**1 &middot; 150–180 locations, at least 10 per state**
Real, populated towns and suburbs — never invented. `config/locations.ts` is the source; `generateStaticParams` must emit a page for every one, and every one must appear in the sitemap.

**2 &middot; Grouped by state, chips for the top cities**
A flat list of 170 links is unusable. States give it structure and give each group a keyword-bearing `h4`.

**3 &middot; Every entry is a real link**
`/{productSlug}/{slug}`, built through the locale-URL helper so the prefix is right in every language.

**4 &middot; Location pages must have unique copy**
The block links them; it is the pages themselves that must not be duplicates.

---

## The markup

```tsx
      <section id="locations" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{tLoc('eyebrow')}</span>
            <h3>{tLoc('h3')}</h3>
            <h4>{tLoc('intro')}</h4>
          </div>
          <div className="top-cities">
            {topCitySlugs.map((slug) => {
              const loc = locations.find((l) => l.slug === slug);
              if (!loc) return null;
              return (
                <Link
                  key={slug}
                  href={`/${locale}/${siteConfig.productSlug}/${slug}`}
                  className="city-chip"
                >
                  {loc.name}
                </Link>
              );
            })}
          </div>
          <div className="states-grid">
            {regionOrder.map((region) => {
              const cities = locationsByState[region] || [];
              if (cities.length === 0) return null;
              const key = regionKeys[region];
              return (
                <div key={region} className="state-block">
                  <h4>{tLoc(`stateLabels.${key}`)}</h4>
                  <ul>
                    {cities.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/${locale}/${siteConfig.productSlug}/${c.slug}`}>{c.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
```

## The CSS

Into `components/PageStyles.tsx`, inside its `<style>` block.

```css
.top-cities {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 9px;
  margin-bottom: 40px;
}
.city-chip {
  padding: 9px 18px;
  background: #fff;
  border: 1px solid #DBEBFA;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13.5px;
  color: var(--brand-charcoal);
  box-shadow: 0 6px 16px -10px rgba(14,123,214,0.3);
  transition: transform var(--dur) var(--ease-out), background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
}
.city-chip:hover { transform: translateY(-2px); background: var(--brand-orange); border-color: var(--brand-orange); color: #fff; }
.states-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
@media (min-width: 640px) { .states-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 980px) { .states-grid { grid-template-columns: repeat(3, 1fr); } }
.state-block {
  background: #fff; border: 1px solid #E1EEFA; border-radius: 18px;
  padding: 22px 22px 20px;
  box-shadow: 0 16px 36px -28px rgba(14,123,214,0.28);
}
.state-block h4 {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-display);
  font-weight: 800; font-size: 15px; letter-spacing: -0.01em; text-transform: none;
  color: var(--brand-charcoal);
  margin: 0 0 14px; padding-bottom: 12px;
  border-bottom: 1px solid #EAF2FA;
}
.state-block h4::before {
  content: ''; flex: none; width: 9px; height: 9px; border-radius: 50%;
  background: linear-gradient(140deg, var(--brand-orange-bright), var(--brand-orange-deep));
  box-shadow: 0 0 0 4px rgba(14,123,214,0.12);
}
.state-block ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
.state-block a { color: var(--ink-muted); font-size: 13.5px; font-weight: 500; transition: color var(--dur) var(--ease-out), padding-left var(--dur) var(--ease-out); }
.state-block a:hover { color: var(--brand-orange-deep); padding-left: 3px; }
```

---

## What breaks it

**Invented towns** · *silent*
Padding to hit the count with places that don't exist, or aren't populated. Verify against a real reference.

**Locations in the block but not in `generateStaticParams`** · *silent*
The link 404s. The list and the params must come from the same config export.

**Hardcoded locale prefixes** · *silent*
Hand-built `/en/...` strings break on the default locale, which is unprefixed. Use the helper — `seo-locale-url-helper` checks it.

**Fewer than 10 sub-locations for a state you claim to serve** · *visible*
Thin coverage reads as a stub to both users and crawlers.

---

## Verify

- [ ] 150–180 locations total, ≥10 per served state
- [ ] Every town is real and populated
- [ ] Every entry links to a page that exists and is in the sitemap
- [ ] URLs built via the locale helper, not hand-assembled
- [ ] State groups carry keyword-bearing headings

```bash
cd utopia-wizard
npx tsx scripts/gate.ts --source-only --only=<slug>
```

---

Companions: `docs/site-header-build.md`, `docs/site-footer-build.md`, `docs/reviews-section-build.md`, `docs/product-pricing-build.md`, `docs/cta-whatsapp-build.md`, `docs/whatsapp-routing-build.md`. Rules: CLAUDE.md &rarr; Frontend Design Rules.
