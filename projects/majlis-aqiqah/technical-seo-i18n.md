# Technical SEO & i18n — Majlis Aqiqah (`majlis-aqiqah`)

> **Author:** Kimmy (Technical Implementation Specialist) · audit-and-fix pass, 2026-08-04
> **Verified against:** a dev server run from this working tree, all three locales, live Supabase.
> **Domain:** `majlisaqiqah.my` · **Locales:** `ms` (default, un-prefixed), `en`, `zh`
> **Guardrail gate:** `94/100 — PASS` (was 92 before this pass).

---

## Summary

Most of the remit was already implemented and correct. This pass verified it end to end and fixed
nine real defects — the highest-impact being **leftover sewa-excavator schema** (every aqiqah
package was published to Google as a *Volvo* product) and a **307 redirect hop on every Malay
WhatsApp click**.

---

## 1. i18n routing — PASS

| Setting | Value | Why |
|---|---|---|
| `localePrefix` | `as-needed` | `/` serves Malay with no prefix; `/en`, `/zh` are prefixed |
| `localeDetection` | `false` | Every fresh visitor lands on Malay regardless of browser language |
| `defaultLocale` | `ms` | The aqiqah market is Malay-Muslim first |
| middleware matcher | `['/((?!api\|_next\|_vercel\|.*\\..*).*)']` | Broad form, so un-prefixed default-locale paths resolve |

Translation files are at **exact key parity** — `ms`, `en` and `zh` each carry the same 139 leaf
keys, zero missing and zero orphaned. All 15 locale × page-type combinations return 200.

## 2. Canonical + hreflang — PASS

Built through `lib/localeHref.ts` (`localeAbs`), never by inlining `${locale}`.

```
canonical   https://majlisaqiqah.my
ms          https://majlisaqiqah.my
en          https://majlisaqiqah.my/en
zh          https://majlisaqiqah.my/zh
x-default   https://majlisaqiqah.my
```

The default locale correctly drops its prefix, so no canonical points at a URL that would 301.
**All 16 distinct alternate URLs across the four page types were fetched individually — every one
returns 200 with no redirect hop**, and `x-default` resolves to the un-prefixed Malay URL.

## 3. Schema markup — FIXED

Verified by parsing every `application/ld+json` block out of the rendered HTML of each page type;
all parse as valid JSON, with exactly one `Organization` and one `WebSite` block per page and no
duplicate or conflicting types.

| Page | Blocks | Types |
|---|---|---|
| Homepage | 7 | Organization, WebSite, 4 × Product, FAQPage (8 questions) |
| Location page | 9 | Organization, WebSite, LocalBusiness, BreadcrumbList (3), 4 × Product, FAQPage (8) |
| Blog listing | 2 | Organization, WebSite |
| Blog article | 4 | Organization, WebSite, Article, BreadcrumbList (3) |

**Five defects found and fixed — all sewa-excavator leftovers:**

1. `ProductSchema` stamped **`brand: Volvo` + `manufacturer: Volvo Construction Equipment`** onto
   every aqiqah package, on the homepage and all 169 location pages. Brand now resolves to
   `siteConfig.brandName`; the bogus `manufacturer` is gone.
2. `LocalBusinessSchema` emitted **`@type: GeneralContractor`** — a construction trade — on every
   location page. Now `LocalBusiness`, with an `image` added (Google wants one for LocalBusiness).
3. `OrganizationSchema.logo` and `ArticleSchema.publisher.logo` pointed at **`/logo.png`, which does
   not exist** in `public/`. Both now use `siteConfig.logoPath`.
4. `ProductSchema` / `ArticleSchema` image fallbacks pointed at **`/og/{locale}.png`, also
   non-existent**. Both now use `siteConfig.ogImage`.
5. `WebSiteSchema.url`, `LocalBusinessSchema.url` and `ArticleSchema.mainEntityOfPage.@id` hardcoded
   `${url}/${locale}`, so on Malay pages they advertised `/ms/…` — a URL that 301s, and in the
   Article case an `@id` that disagreed with the page's own canonical. All three now go through
   `localeAbs`.

Also fixed: `Product.image` was emitted as a **relative** path (`/products/pakej-1.jpg`) whenever the
local fallback image was used; JSON-LD requires absolute URLs, so it is now absolutised.

`ProductSchema`'s price prop was named `rentalPrice` while being fed `sale_price` — renamed to
`price` with a comment, since aqiqah is a sale, not a rental. The emitted `offers` is coherent:
live Supabase prices in MYR (`750 / 1080 / 1580 / 650`), `availability: InStock`, `seller` set.

## 4. Sitemap + robots — PASS

`/sitemap.xml` → **549 `<loc>` entries, zero duplicates**:

```
3 locales × (1 homepage + 169 location pages + 1 blog listing + 12 blog posts) = 549
```

Counted per locale: `en` 183, `zh` 183, un-prefixed Malay 183, and **zero URLs carrying a `/ms`
prefix**. All 169 location pages and all 12 blog posts are present in each locale.

`robots.txt` allows crawling and points at the sitemap. **Fixed:** the redirect page was disallowed
only as `/*/redirect-whatsapp-1`, which does not match the un-prefixed default-locale URL
`/redirect-whatsapp-1` — that tracking interstitial was crawlable. Both forms are now disallowed.

## 5. WhatsApp lead routing — PASS (one fix)

- `grep -rn "wa\.me" app/ components/` → **zero hits**. The only `wa.me` construction in the codebase
  is `waLink()` in `lib/webcore.ts`, which is what the redirect page itself uses. No CTA bypasses the
  tracked redirect.
- **Every** anchor carrying a `waRedirect()` href has both `target="_blank"` and
  `rel="noopener noreferrer"` — 10 on the homepage, 10 on location pages, 4 on the blog listing,
  5 on an article, verified in the rendered HTML rather than the source.
- **Fixed:** `waRedirect()` built `/${locale}/redirect-whatsapp-1`, so on the Malay site — the
  default locale, i.e. most traffic — **every WhatsApp click took a 307 hop** before reaching the
  redirect page. It now goes through `localePath()` and emits `/redirect-whatsapp-1` directly.
- **DB lookup proven working.** With the production `Host` header the redirect resolves to
  `wa.me/60102529688?text=Hi majlisaqiqah.my, Assalamualaikum…`. The `Hi {host},` prefix is
  applied only on the Supabase path, so its presence proves the row came from `phone_numbers` and
  not from `config/site.ts`. Requested from `localhost` the same page returns the config fallback
  (no prefix) — expected, since no `phone_numbers` row exists for host `localhost`.
- `leads_mode = single`, so the one default number is always returned.

## 6. Tracking — PASS (one fix)

- Script present in `app/[locale]/layout.tsx` `<head>`, `data-website="majlisaqiqah.my"`,
  matching the deploy domain exactly. Source is `https://webcore.utopiaai.my/t.js` — the current
  house endpoint used by every other project (`docs/tracking-guide.md` still names the older
  `utopia-webcore.vercel.app`; the doc is stale, the code is right).
- `global.d.ts` declares `window.uwc`.
- Events fire per `docs/tracking-guide.md`: `whatsapp-{phone}` on every WhatsApp CTA
  (`WhatsAppButton`), `product-{slug}` impressions via IntersectionObserver that unobserves after
  the first fire (`ProductImpressionTracker`), and `blog-{slug}` clicks on the listing
  (`BlogLinkTracker`).
- **Fixed:** the FOMO banner CTA was a bare `<Link>`, so clicks from the sticky top banner — present
  on every page — **fired no tracking event at all**. It now renders through `WhatsAppButton`.

Note: `WhatsAppButton` labels its event `whatsapp-{phone}-{placement}` (e.g.
`whatsapp-60102529688-hero`). That extends the documented `whatsapp-{number}` convention rather than
breaking it — prefix matching still groups them — and buys per-placement attribution. Left as-is.
The phone in the label is `siteConfig.fallbackPhone`, because the actual number is only chosen
server-side on the redirect page; identical under `leads_mode = single`, but worth knowing if this
site ever moves to `rotation`.

## 7. No leaked phone numbers or domains — PASS

Stripped `<script>`, `<style>`, `<head>` and every tag attribute from the rendered HTML of the
homepage (all 3 locales), a location page, the blog listing and an article, then searched the
remaining visible text for `60102529688`, `+60`, `wa.me`, `majlisaqiqah.my` and
`utopiaai.my` — **clean on all six**. Those strings appear only in `href` attributes, JSON-LD and
canonical/OG tags, which is correct.

## 8. Heading hierarchy — PASS

Counted in the rendered HTML, not the source:

| Page | h1 | h2 | h3 | h4 |
|---|---|---|---|---|
| Homepage | 1 | 1 | 10 | 29 |
| Location page | 1 | 1 | 11 | 29 |
| Blog listing | 1 | 1 | 13 | 0 |
| Blog article | 1 | 1 | 10 | 20 |

Every page type is exactly **one H1 + one H2**. On articles the body contributes h2=1, h3=9, h4=19,
so the article's own outline sits under the page's single H2 without ever duplicating it.

## 9. Internal link locale hygiene — FIXED

Internal `<Link>` hrefs were built as `` `/${locale}/…` ``, which on the default locale rendered
`/ms/…` and took a 307 hop to the un-prefixed URL — a redirect on *every internal click* for Malay
visitors, plus the language switcher taking a hop whenever someone switched **to** Malay.

Migrated to `localePath()` across `SiteHeader`, `SiteFooter`, `LanguageSwitcher`, the homepage,
location pages, blog listing and blog articles. Verified rather than assumed: **the rendered HTML of
all four page types now contains zero `href="/ms…"` occurrences**, and the pages, the redirect page
and every hreflang alternate still return 200 with no redirect hop.

## 10. Blog article body — FIXED

Article HTML comes from Supabase (`blog_translations.content`) and is authored with root-relative
links. Served verbatim, `/blog/…`, `/pakej-aqiqah/ipoh` and `/` **dropped EN and ZH readers onto the
Malay version of every page they clicked** — a cross-locale leak on all 12 articles × 2 non-default
locales. The in-article WhatsApp CTA also carried no `target`/`rel`.

`lib/articleHtml.ts` (`localizeArticleHtml`) now rewrites root-relative hrefs to the rendered locale
and hardens the WhatsApp anchor, leaving absolute URLs, `mailto:`/`tel:` and `#anchor` links alone.
Verified across all three locales: the EN article now links to `/en/blog/…`, `/en/pakej-aqiqah/ipoh`,
`/en/redirect-whatsapp-1`; ZH likewise; **all 24 resulting links fetched, all 200**.

## 11. Open Graph / social preview — FIXED

**No page on the site emitted an `og:image`.** Every WhatsApp or Facebook share rendered as a bare
grey card — a real cost for a business whose entire funnel is WhatsApp shares. The locale layout set
OG tags, but each page's own `openGraph` block replaced it wholesale, and none included an image.

Added `lib/ogImage.ts` and wired it into the layout, location pages, blog listing and articles, plus
`twitter: { card: 'summary_large_image' }`. Articles use their Supabase cover image and fall back to
the site default. Confirmed in the rendered HTML of all four page types.

> The default preview reuses `/bg/hero.jpg` (1600×1280). It works, but it is a photograph, not a
> designed 1200×630 social card. Worth handing to whoever owns design if link previews matter.

## 12. Housekeeping

- `lib/waRedirect.ts` still exported `calcQuote()` — daily/weekly/monthly **excavator rental** maths,
  referenced nowhere. Removed.
- `middleware.ts` and `global.d.ts` opened with `// projects/skylift-malaysia/…` header comments
  copied from another project. Corrected.

---

## Verification performed

- `npx tsc --noEmit` — clean.
- `/`, `/en`, `/zh`, `/pakej-aqiqah/kuala-lumpur`, `/blog`, `/blog/beza-aqiqah-dan-korban` — all 200,
  plus the `en`/`zh` variants of each and all three redirect-page locales.
- JSON-LD parsed and field-checked on all four page types.
- Sitemap parsed and counted per locale; robots.txt fetched.
- 16 hreflang alternates + 24 article body links fetched individually for status and redirect hops.
- Visible-text scan for phone/domain leakage on six rendered pages.
- WhatsApp redirect exercised with both `localhost` and production `Host` headers to distinguish the
  Supabase path from the config fallback.
- `npx tsx scripts/gate.ts --source-only majlis-aqiqah` → **94/100, PASS**.

## Outstanding — all require a live deployment

| Check | Blocked on |
|---|---|
| `data-website-reachable` | Site must be live at `https://majlisaqiqah.my` |
| `vercel-linked`, `deploy-url-live`, `vercel-domain-match` | `vercel link` + first deploy |
| `live-db-connected` | Post-deploy probe against the live URL |
| `gtm-container`, `gtm-noscript` | Gloo's post-deploy Google step — runs only after the **paid** domain is live, never against `*.vercel.app` |

## Deploy dependency — do not miss this

`app/api/revalidate/route.ts` returns **500** unless `WEBCORE_REVALIDATE_SECRET` is set, and it is
**not** in the repo-root `.env.local`. Without it on Vercel the admin panel's purge ping fails, so
Supabase edits (package prices, new blog posts) will not reach the live site until the next deploy —
this site has no time-based ISR by design (see `architecture.md`).
