# Product pricing

Where the numbers on a product card come from, and the two shapes they arrive in.

| | |
|---|---|
| **Source of truth** | webcore `products` table — never a config file |
| **Site code** | `lib/webcore.ts` · `app/[locale]/page.tsx` · `components/PageStyles.tsx` |
| **API doc** | `docs/webcore-api.md` |
| **Reference** | `projects/water-tank-malaysia` (single) · `sewaexcavator.my` (multi-rate) |
| **Verified** | 17 Aug 2026 |

---

## The rule that outranks everything else here

**Product data is fetched from the database. It is never hardcoded.** Adding a product
in webcore makes it appear on the site; setting `is_active = false` makes it disappear.
`config/products.ts` may exist **only** as an unreachable-Supabase fallback — it is not
the source of truth, and a grid that reads from it is broken even if it looks right.

The grid must also survive any product count. 1, 6 or 20 products all have to lay out
without stranding a cell.

---

## Two shapes, one rule

A product carries either a **single price** or a **list of labelled lines**. Never both.

```
SINGLE RATE                          MULTI-RATE  (prices[] non-empty)
sale_price / rental_price            [{ label, amount, unit?, note? }, …]

  FROM                                 Harian:  RM 1,800 / day
  RM 1,800  ~~RM 2,100~~               Bulanan: RM 32,000 / month
                                       Deposit: RM 5,000
```

**Render `prices` when it is non-empty; otherwise fall back to the single fields.**
That single line is the whole contract — a product that gains a second rate in webcore
starts rendering as a list with no code change.

A real payload, live on `sewaexcavator.my`:

```jsonc
{
  "name": "Volvo EC200",
  "slug": "volvo-ec200",
  "sale_price": null,
  "rental_price": 1800,
  "prices": [
    { "unit": "day",   "label": "Harian",  "amount": 1800 },
    { "unit": "month", "label": "Bulanan", "amount": 32000 }
  ]
}
```

Note `rental_price` is still populated alongside `prices`. Keep the single field in
sync as the "from" number — WhatsApp prefill copy and schema markup still read it.

---

## 1 · The types

```ts
export interface PriceLine {
  label: string;    // "Harian", "Bulanan", "Deposit"
  amount: number;   // 1800
  unit?: string;    // "day", "month" — omit for one-off charges
  note?: string;    // small print under the line
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sale_price: number | null;
  rental_price: number | null;
  sort_order: number;
  is_active: boolean;
  parent_id: string | null;
  photos: { url: string }[];
  prices: PriceLine[];      // [] when the product is single-rate
}
```

## 2 · The fetch

Tagged `webcore-products` so a webcore change purges it without a redeploy. `prices`
comes back `null` for older rows, hence `?? []` — code downstream can then trust
`.length`.

```ts
export async function getProducts(): Promise<{ core: Product[]; additional: Product[] }> {
  const path =
    `products?select=*,product_photos(url)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`;

  const rows = await webcoreFetch<ProductRow[]>(path, 'webcore-products');
  if (!rows) return { core: [], additional: [] };

  const products: Product[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    sale_price: p.sale_price,
    rental_price: p.rental_price,
    sort_order: p.sort_order,
    is_active: p.is_active,
    parent_id: p.parent_id,
    photos: p.product_photos ?? [],
    prices: p.prices ?? [],
  }));

  return {
    core: products.filter((p) => p.rental_price !== null),
    additional: products.filter((p) => p.rental_price === null),
  };
}
```

## 3 · The render

```tsx
                {featured.prices.length > 0 ? (
                  <div className="product-prices price-list">
                    {featured.prices.map((line, i) => (
                      <div className="price-line" key={i}>
                        {line.label}: RM {Number(line.amount).toLocaleString()}
                        {line.unit ? ' / ' + line.unit : ''}
                        {line.note ? <span className="price-note">{line.note}</span> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="product-prices product-prices-single">
                    <div className="price-cell">
                      <span className="price-from-label">{fromWord}</span>
                      <div className="price-row">
                        <span className="price-value">RM {featured.price.toLocaleString()}</span>
                        <span className="price-was">RM {wasPrice(featured.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
```

## 4 · The CSS

Into `components/PageStyles.tsx`, inside its `<style>` block.

```css
.product-prices, .product-prices-single {
  display: block;
  border: none; background: transparent; border-radius: 0; overflow: visible;
  margin: 8px 0 2px; padding: 14px 0 0;
  border-top: 1px solid #EAF2FA;
}
.price-cell { display: block; padding: 0; text-align: left; }
.price-from-label {
  display: block;
  font-family: var(--font-mono-stack);
  font-weight: 700; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 3px;
}
.price-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.price-value {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 30px;
  color: var(--brand-orange);
  letter-spacing: -0.03em;
  line-height: 1;
}
.price-was {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  color: var(--ink-faint);
  text-decoration: line-through;
  text-decoration-color: rgba(120,132,146,0.75);
  line-height: 1;
}
.product-prices.price-list { display: flex; flex-direction: column; align-items: stretch; padding: 4px 16px; text-align: left; }
.price-line { font-family: var(--font-mono-stack); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color: var(--brand-charcoal); padding: 11px 0; border-bottom: 1px solid var(--line); }
.price-line:last-child { border-bottom: none; }
.price-line:first-child { color: var(--brand-orange); }
.price-note { display: block; margin-top: 3px; font-weight: 400; font-size: 11px; letter-spacing: 0.02em; text-transform: none; color: var(--ink-muted); }
.product-cta { margin-top: 14px; width: 100%; }
```

---

## Writing prices through the API

`docs/webcore-api.md` is the full reference. The parts that bite:

```bash
# CREATE — prices[] goes in on POST
curl -X POST https://webcore.utopiaai.my/api/public/products \
  -H "x-api-key: $WEBCORE_API_KEY" -H "Content-Type: application/json" \
  -d '{
        "website": "<exact registered domain>",
        "name": "Volvo EC200", "slug": "volvo-ec200",
        "rental_price": 1800,
        "prices": [
          { "label": "Harian",  "amount": 1800,  "unit": "day" },
          { "label": "Bulanan", "amount": 32000, "unit": "month" },
          { "label": "Deposit", "amount": 5000 }
        ]
      }'

# UPDATE — the id goes in the BODY, not the query string
curl -X PATCH https://webcore.utopiaai.my/api/public/products \
  -H "x-api-key: $WEBCORE_API_KEY" -H "Content-Type: application/json" \
  -d '{ "id": "<product-id>", "prices": [ … ] }'

# VERIFY — the public GET is CDN-cached, so bust it
curl -s "https://webcore.utopiaai.my/api/public/products?website=<domain>&type=all&_=$(date +%s)" \
  -H "Cache-Control: no-cache"

# PURGE the site's own cache after any write
curl -X POST "https://<domain>/api/revalidate" \
  -H "X-Webcore-Secret: $WEBCORE_REVALIDATE_SECRET" \
  -H "Content-Type: application/json" -d '{"tags":["webcore-products"]}'
```

---

## What breaks it

**A fabricated &ldquo;was&rdquo; price** · *visible, and the one with legal exposure*
`water-tank-malaysia` and `daikin-aircond` render a struck-through original computed as
`price × 1.15` — a number no customer was ever charged. A crossed-out price asserts a
genuine former price; inventing one is a misleading price comparison under Malaysian
trade-descriptions rules, and it is the client who carries that risk. Either store the
real previous price in the DB and show it, or drop the strike-through and show the
price alone. Do not copy `wasPrice()` into a new project.

**Hardcoding the product list** · *silent*
A grid reading `config/products.ts` looks identical and is dead — DB edits never reach
it. Products come from `getProducts()`; the config file is a fallback only.

**`?id=` on PATCH** · *silent*
The id belongs in the **body**. Sent as a query param it is ignored and the write
either 4xxs or lands on nothing. The published API doc has this wrong.

**`sort_order` on POST** · *silent*
POST ignores it. Create first, then PATCH the order in a second call, or the grid
sequence is whatever the DB felt like.

**Photos via PATCH** · *silent*
PATCH cannot set photos at all, and a bare string array is accepted with a `201` and
dropped. Photos must be objects, on POST — to fix an existing row, delete and re-POST.

**Expecting a redeploy to refresh prices** · *silent*
Reads are `force-cache`. A stale price survives a redeploy; purge `webcore-products`.

**A project with no `PriceLine` type** · *silent*
`roller-shutter-malaysia`, `service-aircond-malaysia` and
`electric-wheelchair-malaysia` still lack it. Their products are all single-rate today,
so nothing is visibly wrong — but push a multi-rate line to any of them and it is
accepted with a `201` and never displays.

---

## Verify

- [ ] Grid renders from `getProducts()`, not from a config file
- [ ] `prices.length > 0` branch renders the list; single-rate falls back cleanly
- [ ] Layout holds at 1, 6 and 20 products — no stranded cells at any breakpoint
- [ ] `rental_price` / `sale_price` kept in sync with the first `prices` line
- [ ] Any struck-through price is a real former price, not computed
- [ ] Amounts read back correctly through a cache-busted GET after writing
- [ ] `webcore-products` purged after the write

---

Companions: `docs/whatsapp-routing-build.md`, `docs/site-footer-build.md`,
`docs/site-header-build.md`, `docs/reviews-section-build.md`.
Rules: CLAUDE.md &rarr; Dynamic Product Data.
