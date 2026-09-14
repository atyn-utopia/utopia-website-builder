# Webcore Token API — reference

The write API for products, phone numbers, blog posts, SEO overrides, keywords
and integrations. Every agent that puts content into a site goes through this.

> **The key is never written down here or anywhere in this repo.**
> It lives in the gitignored root `.env.local` as `WEBCORE_API_KEY`.
> Load it with `set -a && . ./.env.local && set +a`, then use `$WEBCORE_API_KEY`.
> It never expires and carries write scope on **every site its creator is
> assigned to**, so a leak is a fleet-wide problem, not a per-site one.

## Auth & conventions

- **Base URL**: `https://webcore.utopiagroup.com.my` (`$WEBCORE_BASE_URL`)
- **Header**: `X-API-Key: $WEBCORE_API_KEY` on every write. Server-only.
- **Scopes on the current key**: `products:write`, `blog:write`, `phones:write`,
  `seo:write`, `integrations:write`, `read`, `sites:write`, `ads:write`.
- **Reads** (`GET /api/public/*`) are CORS-open and need **no** key.
- `website` must be the **exact registered domain**. Writes against an
  unregistered value orphan silently — they return 2xx and never appear.

> **Host moved (2026-09-10).** The old `webcore.utopiaai.my` now 307s to
> `webcore.utopiagroup.com.my` for the whole host, `/t.js` included, and the new host does not redirect
> further. 307 preserves method and body and both `fetch()` and `curl -L` follow
> it, so nothing breaks today — which is exactly why this is easy to miss.
>
> **The fleet still points at the old host.** 37 live sites under `projects/`
> carry a `webcore.utopiaai.my/t.js` tag, 7 `lib/webcore.ts` files hardcode it as
> `WEBCORE_PUBLIC_BASE`, and `utopia-wizard/lib/checklist.ts`'s `tracking-script`
> check asserts the old host **by name**. Those move together or not at all —
> changing the sites while the guardrail still names the old host fails every
> site's check. Moving them also means 37 redeploys, so it needs a decision on
> whether the old host is actually being retired. Until then they ride the
> redirect. Do not migrate a site's tag piecemeal.

### The vercel.app trap

The upstream doc says never send a `*.vercel.app` deploy URL as `website`. That
is correct **for a site registered on its paid domain**. A couple of sites in
this fleet were registered on a `*.vercel.app` name and their data lives under
that key — for those, sending the paid domain is what would orphan the write.

But treat that as damage, not as a pattern: **48 of the 51 registered sites use
a paid domain.** A `*.vercel.app` key almost always means the site was
registered before its domain was settled and still needs migrating. Note also
that this Vercel team serves deployments on **`*.utopiaai.my`**, so a
`{slug}.vercel.app` host usually **404s** — registering under one pins the rows
to a name that never serves the site.

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

**Look the company up first — never guess `company_name`.** A near-miss creates a
second company rather than linking to the existing one, and the site then sits
outside the company the rest of its sites belong to. `read` scope answers it
without dashboard access:

```bash
curl -s "$WEBCORE_BASE_URL/api/public/companies?q=Ibnu" -H "x-api-key: $WEBCORE_API_KEY"
# → { "companies": [ { "id": "...", "name": "...", "domains": ["..."] } ] }
```

Params: `q` (name substring, case-insensitive), `website` (which company owns
this domain), `limit` (default 50, max 200). Only companies behind this token's
sites are visible; no match is an empty list, not a 404. Feed the returned `id`
straight in as `company_id`.

## 2. Products — `products:write`

```
GET    /api/public/products?website=<d>              # nested main+sub
GET    /api/public/products?website=<d>&slug=<slug>  # single
GET    /api/public/products?website=<d>&type=all     # flat
POST   /api/public/products   { website, name, slug, description?, sale_price?, rental_price?, prices?, parent_id?, photos?: [{ url }] }
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

`photos` is an array of `{ url }` objects — a bare string array is rejected with
`400 photos[0].url is required`. `PATCH` accepts it too, and **replaces** the
product's photos rather than appending, so send the full set you want to keep.
That is how to change a live product's photos: DELETE + re-POST would give it a
new id and orphan anything that referenced the old one.

```jsonc
"photos": [{ "url": "/images/fleet/motor.jpg" }]
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
GET    /api/public/keywords?website=<d>                # everything, EN head terms
GET    /api/public/keywords?website=<d>&language=ms    # BM rows and BM head terms
GET    /api/public/keywords?website=<d>&path=/products # one page's crawled copy
POST   /api/public/keywords   { website, rows?, paste?, mode?, language?, primary_keywords?, secondary_keywords? }
PATCH  /api/public/keywords   { id, search_word?, language?, keywords?, volume? }
DELETE /api/public/keywords   { id }
```

```jsonc
{
  // The head terms for the language asked for — EN when none was named.
  "primary_keywords": ["sewa excavator"],
  "secondary_keywords": ["sewa excavator selangor"],
  // Both languages. `inherited` marks one still reading the site's older
  // single list, from before head terms were stored per language.
  "heads": { "en": { "primary_keywords": [], "secondary_keywords": [], "inherited": false },
             "ms": { "primary_keywords": ["sewa excavator"], "secondary_keywords": [], "inherited": false } },
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

**Six behaviours that will mislead you if you don't know them:**

- **The POST body field is `rows`, not `keywords`.** `keywords` is the *GET
  response* field name, and sending it on a POST is accepted with `200` and
  `{"saved": 0}` — the rows are dropped while `primary_keywords` /
  `secondary_keywords` in the same body still land. The partial success reads
  like a validation quirk rather than a wrong field name.
- **`primary_keywords` and `secondary_keywords` are capped at 32 each, and the
  overflow is dropped from the TAIL with no error or `truncated` count.**
  Measured on coldroomrental.my: 60 sent, 32 stored, both arrays. Order the
  lists by priority before pushing. (The cap is per language now, so the old
  advice to interleave locales no longer applies — a single list never has to
  hold both.) The `rows` array has no such cap (51 rows stored fine) and does
  report `truncated`.

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
- **`primary_keywords` and `secondary_keywords` are REPLACED on every POST, and
  they belong to ONE language.** "Upsert" above is true for rows and false for
  the two lists — whatever lists the last POST carried are that language's
  lists. Say which language with a top-level `language`; webcore will otherwise
  read it off the pushed `rows` when they are all one language, and **refuses
  the push with a `400` when it cannot tell** (no `language`, and either no rows
  or rows in both languages). Pushing each language separately is the whole
  point — do not merge the two languages' lists into one call.
  *History (webcore, until 2026-09-14):* the lists were site-wide, so the
  per-language flow (`--lang ms`, then `--lang en`) ended with only the English
  lists. Measured on acsonaircond.my (2026-09-11): `primary=[aircond acson]`
  after the `ms` push, `primary=[acson aircond]` after the `en` push — the Malay
  term gone, all five rows intact. Sites researched before that date still hold
  one unlabelled list, which answers for both languages (`heads.*.inherited` is
  `true`) until the first per-language push replaces it. Read back and count the
  lists, not just `saved`.
- **The plan parser needs an enclosing H2, not only the H3.** The skill says
  head terms must sit under an H3 like `### 1.2 Primary money keywords`. That
  H3 is only read when it is nested under an H2 matching
  `keyword strategy` / `keyword plan` / `primary keyword` / `money keyword`
  (`lib/seo-plan.mjs`, `inStrategy`). A plan with the H3 and no such H2 yields
  **0 keywords**, `--list` prints an empty section list, and the gate prints
  "passed" having checked nothing. Sora's plans carry `## 1. Keyword strategy`
  and are fine; a hand-written backfill plan usually is not.

## 7. Integrations — `integrations:write`

OAuth connect stays in the admin UI (needs human consent); these run after.

```
PUT  /api/website-settings                { website, revalidate_url }   # offering_type is admin-only
POST /api/integrations/gsc/submit-sitemap { domain }                    # site must be GSC-connected
POST /api/integrations/marketing/mark-key-event { domain, eventName }   # event must have fired once
```

**Read back what webcore actually sees** (`read` scope) instead of asking
someone to open the Integrations page. Every field is verified live on the call,
Google API round trips included — so use it once after a setup run, not as a
poll:

```bash
curl -s "$WEBCORE_BASE_URL/api/public/integrations?website=<d>" -H "x-api-key: $WEBCORE_API_KEY"
# → { ga4: { property_id, measurement_id, connected_at },
#     gtm: { container_id, detected }, ads: { detected, source, customer_id },
#     readiness: { signals, counting_one, metrics_imported, ready },
#     checks: { … why a live check could not answer … } }
```

## 8. Ads readiness — `ads:write`

Three Google settings gate a site running ads. Two are re-verified live on every
read; the third has no API that exposes it, so a human confirms it once.

```
google_signals       GA4 → Google Signals ON          — auto-verified
conversion_counting  Ads → conversion Count = One     — auto-verified
ga4_metrics_import   Ads → Data manager → GA4 import  — manual, no API exposes it
```

```bash
curl -s "$WEBCORE_BASE_URL/api/ads-readiness?website=<d>" -H "x-api-key: $WEBCORE_API_KEY"

curl -X PATCH "$WEBCORE_BASE_URL/api/ads-readiness" \
  -H "x-api-key: $WEBCORE_API_KEY" -H "Content-Type: application/json" \
  -d '{ "website": "<d>", "item": "ga4_metrics_import", "done": true }'
```

Ticking an auto-verified item **pins** it, so the live re-check stops overriding
the answer. **Completing the last item notifies the performance marketers,
once** — send `done: true` because the step is really done, not to tidy the card.

When the Ads account can't be resolved from the site's `AW-` tag, or conversions
live on a manager account, pin the customer id once and the counting check stops
guessing:

```bash
curl -X PUT "$WEBCORE_BASE_URL/api/ads-readiness" \
  -H "x-api-key: $WEBCORE_API_KEY" -H "Content-Type: application/json" \
  -d '{ "website": "<d>", "customerId": "123-456-7890" }'
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
