# Webcore Token API — reference

The write API for products, phone numbers, blog posts, SEO overrides, keywords
and integrations. Every agent that puts content into a site goes through this.

> **The key is never written down here or anywhere in this repo.**
> It lives in the gitignored root `.env.local` as `WEBCORE_API_KEY`.
> Load it with `set -a && . ./.env.local && set +a`, then use `$WEBCORE_API_KEY`.
> It never expires and carries write scope on **every site its creator is
> assigned to**, so a leak is a fleet-wide problem, not a per-site one.

## Auth & conventions

- **Base URL**: `https://webcore.utopiaai.my` (`$WEBCORE_BASE_URL`)
- **Header**: `X-API-Key: $WEBCORE_API_KEY` on every write. Server-only.
- **Scopes on the current key**: `products:write`, `blog:write`, `phones:write`,
  `seo:write`, `integrations:write`, `read`, `sites:write`.
- **Reads** (`GET /api/public/*`) are CORS-open and need **no** key.
- `website` must be the **exact registered domain**. Writes against an
  unregistered value orphan silently — they return 2xx and never appear.

### The vercel.app trap

The upstream doc says never send a `*.vercel.app` deploy URL as `website`. That
is correct **for a site registered on its paid domain**. Several sites in this
fleet were registered on their `*.vercel.app` host and their real data lives
under that key — `light-tower-rental.vercel.app` is one. For those, the
vercel.app host *is* the registered domain and sending the paid domain is what
would orphan the write.

Check before writing, never assume:

```bash
curl -s "$WEBCORE_BASE_URL/api/public/phone-numbers?website=<candidate>" | head -c 200
```

An empty array means that is not the registered key. On domain migration, every
row has to be re-keyed — see the domain-migration notes in
`docs/full-website-setup.md`.

## Errors

| Code | Meaning |
|---|---|
| 401 | token missing / revoked |
| 403 | scope missing, or `website` outside the token's site list |
| 400 / 500 | validation / server error; body carries `{ error }` |

---

## 1. Register a site — `sites:write`

A site must be registered before it shows in the admin. Pushing a product does
**not** register it.

```bash
curl -X POST "$WEBCORE_BASE_URL/api/public/sites" \
  -H "x-api-key: $WEBCORE_API_KEY" -H "Content-Type: application/json" \
  -d '{ "website": "<domain>", "company_name": "<Company Sdn. Bhd.>" }'
```

Idempotent: `200 { alreadyLinked: true }` when already linked to this company,
`409` when linked to a different one. Returns the site id + tracking snippet.

## 2. Products — `products:write`

```
GET    /api/public/products?website=<d>              # nested main+sub
GET    /api/public/products?website=<d>&slug=<slug>  # single
GET    /api/public/products?website=<d>&type=all     # flat
POST   /api/public/products   { website, name, slug, description?, sale_price?, rental_price?, prices?, parent_id?, photos? }
PATCH  /api/public/products?id=<id>   { ...fields }
DELETE /api/public/products?id=<id>
```

For anything with more than one rate send `prices` instead of the single
`sale_price` / `rental_price`. Render `prices` when non-empty, else fall back.

```jsonc
"prices": [
  { "label": "Harian",  "amount": 1800,  "unit": "day" },
  { "label": "Bulanan", "amount": 32000, "unit": "month" },
  { "label": "Deposit", "amount": 5000 }
]
```

## 3. Phone numbers — `phones:write`

```
GET    /api/public/phone-numbers?website=<d>[&location=<slug>]
GET    /api/public/phone-numbers/resolve?website=<d>[&location=<slug>][&page=/<path>]
GET    /api/public/phone-numbers/display?website=<d>[&page=/<path>]
POST   /api/public/phone-numbers   { website, phone_number, whatsapp_text, location_slug?='all', page_slug?='all', percentage?, label?, is_display? }
PATCH  /api/public/phone-numbers   { id, ...fields }   # the admin type='default' row is read-only here
DELETE /api/public/phone-numbers   { id }
```

- **Rotation**: active rows in the same pool are weighted by `percentage`
  (should total 100 per pool).
- **Per-page numbers**: `page_slug` (`all` = site-wide). Each row carries its
  own `whatsapp_text`, so per-page copy rides with the number.
- **`/resolve` order**: page → location → `all` → admin default.

### Two different questions — get this right

| What you are doing | Endpoint |
|---|---|
| Printing digits (header, footer, `tel:` with the number visible, schema.org) | **`/display`** |
| A CTA with no digits shown ("WhatsApp us", "Call us") | `/whatsapp-redirect`, `/resolve` |

`/resolve` and `/whatsapp-redirect` answer *"who receives this lead"* and rotate
per click. Printing them means the digits change between page loads. `/display`
answers *"what does this page show"* and is deterministic:
**page display number → site-wide display number → admin default**, with
`source` naming the tier that answered.

### `is_display` — the published number

- Unique per **`(website, page_slug)`** — *not* per site. `POST`/`PATCH` with
  `is_display: true` claims it and unticks the sibling that held it.
- A page always keeps one, so unticking the only number on a page is a no-op,
  and a page with a single number is its own display number without any tick.
- Independent of routing: a rotation pool can spread clicks across agents while
  exactly one number is the published, dialable one.
- Ticking it on a different row changes the visible number with no code change
  and no redeploy — the `webcore-phones` purge carries it through.

**Because it is keyed per page, the page is part of the question.** A site
implementation that picks "the row where `is_display` is true" without scoping
to the page will grab an arbitrary page's number once any per-page display
number exists. In this fleet that is `getDisplayPhone(page)` in
`lib/webcore.ts`, which calls `/display` and passes the locale-stripped path.

### WhatsApp CTA — link, don't bake

Never hardcode `wa.me/<number>`; that freezes one number for every page. Point
CTAs at the site's own `/redirect-whatsapp-1`, which must resolve the number
**server-side** and render a real `wa.me` link into the HTML — a client-side
handoff fails the live DB check and breaks with JS disabled. See
`docs/full-website-setup.md` → redirect page.

## 4. Blog — `blog:write`

```
GET    /api/public/blog?website=<d>[&language=en][&slug=<slug>]
POST   /api/public/blog   { website, slug, status?='draft', cover_image_url?, translations: [{ language, title, content?, excerpt?, meta_title?, meta_description? }] }
PATCH  /api/public/blog   { id, ...postFields, translations? }   # translations upsert by language
DELETE /api/public/blog   { id }
```

## 5. SEO overrides — `seo:write`

Override meta per URL without touching site code.

```bash
curl -X POST "$WEBCORE_BASE_URL/api/seo/overrides" \
  -H "x-api-key: $WEBCORE_API_KEY" -H "Content-Type: application/json" \
  -d '{ "website": "<d>", "path": "/products/sample", "language": "en", "title": "…", "description": "…" }'
```

Purges arrive on the **`webcore-seo`** tag — a site's `/api/revalidate` must
accept it or the override never reaches the live page.

## 6. Keywords — `seo:write`

The site's keyword research plus the on-page copy webcore's crawler last read
off the live site. **Read this before writing page copy** so H1/H2/meta target
researched keywords.

```
GET    /api/public/keywords?website=<d>                # everything
GET    /api/public/keywords?website=<d>&language=ms    # BM only
GET    /api/public/keywords?website=<d>&path=/products # one page's crawled copy
POST   /api/public/keywords   { website, rows?, paste?, mode?, primary_keywords?, secondary_keywords? }
PATCH  /api/public/keywords   { id, search_word?, language?, keywords?, volume? }
DELETE /api/public/keywords   { id }
```

```jsonc
{
  "primary_keywords": ["sewa excavator"],
  "secondary_keywords": ["sewa excavator selangor"],
  "keywords": [{ "search_word": "sewa excavator", "language": "ms", "volume": 1900, "source": "semrush" }],
  "pages": [{ "path": "/", "lang": "ms", "meta_title": "…", "h1": ["…"], "h2": ["…"],
              "images": [{ "src": "…", "alt": "…" }] }]
}
```

Writes upsert on `(website, search_word, language)`, so re-pushing a refreshed
export updates volumes instead of duplicating. `paste` takes a raw Semrush
CSV/TSV export as one string. `mode: 'replace'` clears existing rows first
(default merges). An empty response means no research has been pushed yet —
that is a gap to fill, not a reason to invent keywords.

**Two behaviours that will mislead you if you don't know them:**

- **`language` is `en` or `ms` ONLY, and anything else is silently coerced —
  not rejected.** Pushing `zh` rows for a trilingual site returns `200` with the
  full `saved` count, and the rows land labelled `en`. Measured on
  lighttower.my: 5 Chinese terms pushed as `zh`, all stored as `en`, volumes
  intact. Consequences: a `?language=en` read for a trilingual site can contain
  CJK terms, and a `?language=zh` read returns nothing even though the research
  exists. Check the distribution after any multilingual push rather than
  trusting `saved`.
- **The plain `GET` is CDN-cached and can serve a stale empty result for
  minutes after a successful write.** Append a cache-buster
  (`&_=$(date +%s)`) plus `Cache-Control: no-cache` when verifying a push, or
  you will conclude the write failed when it did not.

## 7. Integrations — `integrations:write`

OAuth connect stays in the admin UI (needs human consent); these run after.

```
PUT  /api/website-settings                { website, revalidate_url }   # offering_type is admin-only
POST /api/integrations/gsc/submit-sitemap { domain }                    # site must be GSC-connected
POST /api/integrations/marketing/mark-key-event { domain, eventName }   # event must have fired once
```

---

## Live revalidation

Without this, anything pushed through the API sits behind the site's cache until
the next rebuild. Webcore POSTs `https://<site>/api/revalidate` on every change
with header `X-Webcore-Secret` and body `{ entity, tags, website }`.

**Tags**: `webcore-products`, `webcore-phones`, `webcore-blog`, `webcore-seo`.
They only do something if the matching fetches are tagged in `lib/webcore.ts`,
and if the route's allow-list contains them — a tag missing from that set is
accepted with a 200 and silently dropped.

Register the URL (auto-generates the secret if absent and returns it):

```bash
curl -X PUT "$WEBCORE_BASE_URL/api/website-settings" \
  -H "x-api-key: $WEBCORE_API_KEY" -H "Content-Type: application/json" \
  -d '{ "website": "<d>", "revalidate_url": "https://<d>/api/revalidate" }'
```

The secret must be set in **production** env (Vercel → Settings → Environment
Variables → tick Production) **and the site redeployed** — env changes only
apply to deployments made after the change.

Verify:

```bash
curl -X POST "https://<d>/api/revalidate" \
  -H "X-Webcore-Secret: $WEBCORE_REVALIDATE_SECRET" \
  -H "Content-Type: application/json" -d '{ "tags": ["webcore-products"] }'
```

`200 {"revalidated":[...]}` works · `401` secrets differ (usually the prod env
var was never set, or the site was not redeployed) · `500` the var is missing.

### Known cache gotcha

A redeploy alone does **not** clear the Next Data Cache — reads are
`cache: 'force-cache'`, so a stale value survives it. After editing rows, purge
the tag. Do not reach for `vercel --force`: it re-links the project to a new one
named after the repo and overwrites `.vercel/project.json`.
