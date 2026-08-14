# WhatsApp CMS and routing

How a tap on a green button becomes a WhatsApp chat with the right person — and why
the number a page *prints* and the number a click *reaches* are two different
questions with two different answers.

| | |
|---|---|
| **CMS** | webcore admin &rarr; `phone_numbers` + `company_websites.leads_mode` |
| **Site code** | `lib/webcore.ts` · `lib/waRedirect.ts` · `app/[locale]/redirect-whatsapp-1/` |
| **Reference** | `projects/water-tank-malaysia` |
| **API doc** | `docs/webcore-api.md` |
| **Verified** | 13 Aug 2026 |

---

## The one distinction everything else hangs off

```
  WHAT THE PAGE SHOWS                 WHO GETS THE LEAD
  (header + footer digits)            (every green button)

  getDisplayPhone(page)               waRedirect(locale, msg, loc)
        |                                   |
  GET /phone-numbers/display          /{locale}/redirect-whatsapp-1
        |                                   |
  is_display, keyed per                getPhoneNumber(loc, pageSlug)
  (website, page_slug)                      |
        |                              leads_mode logic
  DETERMINISTIC                        ROTATES PER CLICK
  same digits every load               different agent each time
```

Print a rotating number and the digits change between page loads — the same visitor
sees two different numbers, and neither matches what they'd reach by tapping. So:

- **Digits rendered as text** (header, footer, a visible `tel:`, schema.org) &rarr;
  `getDisplayPhone(page)` &rarr; `/display`.
- **A button that just says "WhatsApp us"** &rarr; `waRedirect()` &rarr; the redirect
  page &rarr; `getPhoneNumber()`.

Never a raw `wa.me/<number>` link in the site. That freezes one number for every page
and bypasses every routing rule below.

---

## The CMS side

Two tables in webcore drive everything. Neither needs a redeploy to take effect.

### `company_websites.leads_mode`

| Mode | Behaviour | Use case |
|---|---|---|
| `single` | one default number, always returned | new sites, single owner |
| `rotation` | weighted random across all site-wide rows, by `percentage` | several sales agents |
| `location` | filter by `location_slug`, then weighted; falls back to the default | regional teams |
| `hybrid` | location pages use location numbers; everything else uses site-wide | regional + national |

### `phone_numbers`

| Column | What it does |
|---|---|
| `website` | the **exact registered domain** — a wrong value orphans the row silently |
| `phone_number` | full international format, e.g. `60112668996` |
| `whatsapp_text` | the pre-filled message; rides with the number, so per-page rows carry per-page copy |
| `location_slug` | a town slug, or `all` for site-wide |
| `page_slug` | a page identifier, or `all` for site-wide |
| `percentage` | rotation weight; should total 100 within a pool |
| `is_display` | nominates the number this page **prints**. Unique per `(website, page_slug)` |
| `label` / `type` | `default` for the seeded row, agent name for extras |
| `is_active` | soft delete |

`is_display` and the routing columns are independent: a rotation pool can spread clicks
across five agents while exactly one number is the published, dialable one.

---

## The site side

### 1 · `lib/waRedirect.ts` — every CTA goes through this

```ts
export function waRedirect(
  locale: string,
  message?: string,
  locationSlug?: string,
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (locationSlug) params.set('loc', locationSlug);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
```

Location pages pass the town so the lead is attributed to it:
`waRedirect(locale, undefined, loc.slug)`.

### 2 · The redirect page — the file to never simplify

Every line here exists because something broke without it.

```tsx
import { headers } from 'next/headers';
import { getPhoneNumber, waLink } from '@/lib/webcore';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Locale prefixes we strip when deriving a page_slug from a path. Kept in sync
// with the site's configured locales.
const LOCALE_PREFIXES = new Set(['en', 'ms', 'zh']);

// Derive the page identifier for per-page phone routing. Priority:
//   1. an explicit ?page= slug on the redirect link, then
//   2. the first meaningful segment of the Referer path (locale stripped).
// e.g. Referer `/en/water-tank/kuala-lumpur` → `water-tank`. Returns undefined
// when neither is available (e.g. the wizard liveness probe hits the bare URL),
// so resolution cleanly falls back to the site-wide default.
async function resolvePageSlug(explicit?: string): Promise<string | undefined> {
  if (explicit?.trim()) return explicit.trim();
  try {
    const ref = (await headers()).get('referer');
    if (!ref) return undefined;
    const segments = new URL(ref).pathname.split('/').filter(Boolean);
    if (segments.length && LOCALE_PREFIXES.has(segments[0])) segments.shift();
    return segments[0] || undefined;
  } catch {
    return undefined;
  }
}
// Pin to Singapore so the function sits near Supabase's Cloudflare-KUL edge.
// Default iad1 (US East) round-trip is ~250ms each way and pushes the page's
// cold-start past the wizard's 7s liveness probe.
export const preferredRegion = 'sin1';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string; page?: string }>;
}) {
  const { loc, message, page } = await searchParams;
  const pageSlug = await resolvePageSlug(page);
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined, pageSlug);
  const url = waLink(phone, message || whatsappText);
  return <RedirectClient url={url} />;
}
```

- **Resolves server-side and renders a real `wa.me` link into the HTML.** A
  client-side handoff to the webcore endpoint fails the wizard's live-DB check and
  breaks entirely with JS disabled.
- **`page_slug` from `?page=` or the `Referer` path**, so per-page numbers work even
  when the link didn't carry an explicit slug.
- **`preferredRegion = 'sin1'`** — the default US-East region put the cold start past
  the 7s liveness probe.
- **`robots: { index: false, follow: false }`**, `dynamic = 'force-dynamic'`,
  `revalidate = 0` — never cached, never indexed.
- **A branded interstitial** with a spinner and a plain `<a>` fallback for no-JS.

### 3 · `getPhoneNumber()` — the routing logic itself

Resolution order is **page &rarr; location &rarr; all &rarr; default**, mirroring
webcore's own `/resolve`. Note that `leads_mode` runs only over *site-wide* rows, so a
page-pinned number never dilutes the homepage rotation.

```ts
export async function getPhoneNumber(
  locationSlug?: string,
  pageSlug?: string,
): Promise<PhoneResult> {
  try {
    const domain = await getHostDomain();
    const [mode, allRows] = await Promise.all([getLeadsMode(domain), getPhoneRows(domain)]);
    if (allRows.length === 0) return fallbackResult();

    // Resolution order (mirrors webcore /phone-numbers/resolve):
    //   page  →  location  →  all  →  default.
    // A page-pinned number wins first when we know the originating page, and
    // never leaks into the site-wide leads_mode pool below.
    if (pageSlug && pageSlug !== 'all') {
      const pageRows = allRows.filter((r) => r.page_slug === pageSlug);
      if (pageRows.length > 0) return toResult(pickWeighted(pageRows), mode, domain);
    }

    // leads_mode logic runs only over site-wide rows so per-page numbers
    // don't dilute the homepage rotation.
    const rows = allRows.filter(isSiteWide);
    if (rows.length === 0) return fallbackResult();

    const defaultRow = findDefaultRow(rows);

    switch (mode) {
      case 'single':
        return toResult(defaultRow ?? rows[0], mode, domain);
      case 'rotation':
        return toResult(pickWeighted(rows), mode, domain);
      case 'location': {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain);
        }
        return toResult(defaultRow, mode, domain);
      }
      case 'hybrid': {
        if (locationSlug && locationSlug !== 'all') {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain);
        }
        return toResult(defaultRow, mode, domain);
      }
      default:
        return toResult(defaultRow, mode, domain);
    }
  } catch (err) {
    console.error('[getPhoneNumber] Unexpected error:', err);
    return fallbackResult();
  }
}
```

The `whatsappText` is rewritten to start `Hi <domain>,` so an operator running several
sites can tell which one produced the enquiry — with any greeting already in
`whatsapp_text` stripped first, or the message double-greets.

### 4 · Cache invalidation

Phone reads are `cache: 'force-cache'` and tagged `webcore-phones`. Webcore POSTs to
`/api/revalidate` on every change; the route verifies a shared secret and purges the
tags it's given.

```ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TAGS = new Set(['webcore-products', 'webcore-phones', 'webcore-blog']);

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webcore-secret');
  const expected = process.env.WEBCORE_REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: 'WEBCORE_REVALIDATE_SECRET is not configured' },
      { status: 500 },
    );
  }
  if (!secret || secret !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { tags?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const tags = Array.isArray(body.tags) ? body.tags : [];
  const revalidated: string[] = [];
  for (const tag of tags) {
    if (ALLOWED_TAGS.has(tag)) {
      revalidateTag(tag);
      revalidated.push(tag);
    }
  }

  return NextResponse.json({ revalidated });
}
```

---

## What breaks it

**A shared operator number as `fallbackPhone`** · *silent, and it reaches clients*
`fallbackPhone` is what the site serves when the lookup returns nothing — a missing
row, a host mismatch, the DB down. Reuse one operator number across sites and a single
lookup miss silently puts *your* number on a client's live site. One real client number
per site; if you genuinely don't have it, use an obvious sentinel like `60000000000`
so a fallback is visible rather than plausible.

**The `www.` host mismatch** · *silent*
`getHostDomain()` strips the port and a leading `www.` before querying, because rows
are keyed to the bare domain. A site whose canonical host is `www.` and whose code
doesn't strip it finds zero rows and serves the fallback to every visitor.

**Printing `/resolve` instead of `/display`** · *visible once you look twice*
The header shows one number, a reload shows another. Use `/display` for anything
rendered as text.

**A missing tag in the revalidate allow-list** · *silent*
A tag not in `ALLOWED_TAGS` is accepted with a `200` and dropped — the response looks
like success. **24 of 31 sites currently omit `webcore-seo`**, water-tank included, so
SEO-override purges are being swallowed fleet-wide. CLAUDE.md requires all four:
`webcore-products`, `webcore-phones`, `webcore-blog`, `webcore-seo`.

**Expecting a redeploy to clear the cache** · *silent*
It doesn't. Reads are `force-cache`, so a stale number survives a redeploy — purge the
tag instead. And never reach for `vercel --force`: it re-links the project to a new one
named after the repo and overwrites `.vercel/project.json`.

**A raw `wa.me` link anywhere in the site** · *visible*
Freezes one number for every page, ignores `leads_mode`, and skips click tracking.
`waLink()` is internal to the redirect page for exactly this reason.

---

## Verify

```bash
# what the page will PRINT (deterministic)
curl -s "https://webcore.utopiaai.my/api/public/phone-numbers/display?website=<domain>&page=/"

# what a click will REACH (rotates — run it a few times)
curl -s "https://webcore.utopiaai.my/api/public/phone-numbers/resolve?website=<domain>&page=/"

# the site's own redirect, following to wa.me
curl -sI "https://<domain>/ms/redirect-whatsapp-1" | head -20

# purge after editing rows
curl -X POST "https://<domain>/api/revalidate" \
  -H "X-Webcore-Secret: $WEBCORE_REVALIDATE_SECRET" \
  -H "Content-Type: application/json" -d '{"tags":["webcore-phones"]}'
```

- [ ] A `phone_numbers` row exists with the **exact registered domain** — verify with a
      public read before writing, some fleet sites are registered on `*.vercel.app`
- [ ] Exactly one row per page has `is_display: true`
- [ ] `fallbackPhone` in `config/site.ts` is the client's own number
- [ ] `getHostDomain()` strips `www.` and the port
- [ ] `ALLOWED_TAGS` contains all four `webcore-*` tags
- [ ] Redirect page renders a real `wa.me` href in the HTML (view source, JS off)
- [ ] No raw `wa.me` link anywhere outside `waLink()`
- [ ] Header/footer digits match `/display`, not `/resolve`

---

Companions: `docs/site-header-build.md`, `docs/site-footer-build.md`,
`docs/reviews-section-build.md`. API reference: `docs/webcore-api.md`.
Rules: CLAUDE.md &rarr; Supabase Database Logic.
