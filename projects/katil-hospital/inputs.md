# katil-hospital — Project Inputs

**Slug:** katil-hospital
**Rebuilt:** 2026-08-06 — static Tailwind-CDN landing page → Next.js App Router

## What this project is

A **1:1 Next.js port** of the original static `index.html` landing page for Ibnu
Sina Care (preserved at `reference/static-site.html`). The brief was to keep the
layout and design identical and change only the stack, so the palette, fonts,
section order, copy, imagery and even the light-weight Rubik heading treatment
are carried over verbatim. See "Deliberate deviations" below for the short list
of things that could not be carried over as-is.

## Confirmed Inputs

| Field | Value |
|-------|-------|
| **Brand name** | Ibnu Sina Care |
| **Legal name** | Ibnu Sina Care Sdn. Bhd. |
| **Product name** | Katil Hospital |
| **Product slug** | `katil-hospital` |
| **Domain** | `sewakatilhospital.my` |
| **Vercel project** | `katil-hospital` (`prj_QUt8223IGpnoJIjEOduyjMC7aq0s`) |
| **Phone (WhatsApp)** | `60146869468` (live, from Supabase; also the config fallback) |
| **Leads mode** | `single` |
| **webcore siteId** | `0a4253e2-c6b9-4c74-a319-d457d6f77b4f` |
| **Languages** | `ms` (default), `en`, `zh` |

### Which domain — and why

Three live sites share the "katil hospital" name. They are **not** the same site:

| Domain | Vercel project | What it is |
|---|---|---|
| `sewakatilhospital.my` | `katil-hospital` | **This project.** Serves the original static page this rebuild replaces. |
| `katilhospital.com.my` | `katil-hospital-prod` | A separate, separately-built Next.js site. Registered in webcore (`2ec463cc-…`). Not this repo. |
| `katilhospitalmurah.com.my` | `katilhospital-24jam` | Sister brand for the same client, in `projects/katilhospital-24jam`. |

`sewakatilhospital.my` was confirmed as this project's domain by matching the
live `<title>` against `reference/static-site.html` and by the Vercel project
that the original `chokchunynh/katil-hospital` repo deployed from.

## Deliberate deviations from the static page

Each of these is a house rule in the root `CLAUDE.md` that the static page
predates — the design is otherwise untouched.

1. **No phone number as visible text.** The static hero/footer/sticky bar printed
   `014-686 9468`. Those buttons remain in place but are relabelled
   ("Hubungi Kami") and routed through `/redirect-whatsapp-1`.
2. **FOMO banner added** at the top — red, with a live countdown.
3. **3-point USP bar added** directly below the hero, using the static page's own
   three USPs (2-hour delivery / zero deposit / 50% buyback).
4. **Heading hierarchy re-levelled** to exactly one `<h1>` + one `<h2>` per page.
   Section titles moved to `<h3>`/`<h4>` and are styled to render at the same
   size as before, so nothing changes visually.
5. **Body copy uses `h5`/`h6.body-text`** instead of `<p>` (house SEO rule).
6. **Prices read "Dari RM 139"** rather than "RM139" — single-number pricing is
   forbidden by the checklist.
7. **Testimonial avatars** are initial-letter circles instead of `randomuser.me`
   stock portraits (see Known risks).

## Known risks / follow-ups

- **Product images hotlink a competitor.** `config/products.ts` points at
  `katil-hospital-bed.my`, exactly as the static page did. These should be
  replaced with owned photography before this build goes live.
- **Testimonials are unattributed marketing copy** carried over from the static
  page. If they aren't real, verifiable reviews they should be removed — schema
  markup declares `aggregateRating 4.9 / 1247`.
- **Blog cache must be purged after DB edits.** Vercel's Data Cache persists
  across deployments, so editing `blog_posts` / `products` and redeploying is
  NOT enough — the site keeps serving the old cached fetch. POST the tags to
  `/api/revalidate` with the `x-webcore-secret` header (the secret lives in
  `webcore.website_settings` for this domain, and as `WEBCORE_REVALIDATE_SECRET`
  on the Vercel project).

## Done (2026-08-06)

- [x] Registered `sewakatilhospital.my` in webcore (`company_websites` +
      `phone_numbers` default row + 7 `products` with photos), `siteId` pinned
- [x] Vercel project `katil-hospital` switched from static to `nextjs`, and its
      **production** Supabase env vars overwritten with the current values —
      they are `sensitive` type (write-only) so the old ones could not be read
      back, and this project predates the fleet DB move
- [x] Deployed to production and aliased to `sewakatilhospital.my`
- [x] 10 blog posts × 3 locales written and published (`.blog-scripts/`, which
      is gitignored — re-running `node .blog-scripts/run.mjs --insert` updates
      the translations in place). Every article carries a TOC, ≥3 H2s, lists,
      captioned images and ≥3 real-path internal links
- [x] Wired the webcore cache-purge path: `website_settings` row +
      `WEBCORE_REVALIDATE_SECRET` env var, so DB edits can be published without
      a redeploy
- [x] Footer + WhatsApp redirect switched to the canonical Utopia templates
      (flat minimal footer; standard interstitial) — site palette retained
- [x] Google integration (Gloo, all 5 phases) — see below

## Still TODO

- [ ] Delete the stray Vercel project `utopia-website-builder`
      (`prj_u0Xs9YsSliYFMnXzRooHQ3u0mq9M`) — created by accident by a
      `vercel --prod --force` run, holds one deployment and no real domain
- [ ] Replace competitor-hotlinked product images with owned photos
      (`product_photos.url` rows + `config/products.ts`)
- [ ] Decide whether the testimonials + `aggregateRating 4.9 / 1247` are
      verifiable; remove them if not
## Google integration (Gloo) — 2026-08-06

| Asset | Value |
|---|---|
| GA4 measurement ID | `G-9E64KV7M0R` |
| GA4 property ID | `548851742` |
| GTM container | `GTM-P323MPG9` (account `6000211475`) |
| GSC domain property | `sc-domain:sewakatilhospital.my` |
| GSC URL-prefix property | `https://www.sewakatilhospital.my/` |
| Ads customer | `1933757591`, conversion `whatsapp_click` |

Gotchas hit, for the next site:
- `gsc-add-domain-property.mjs` defaults to `--vercel-scope
  chokchunynh-4497s-projects`, which does not exist. Pass `--vercel-scope chokchunynh`.
- `inject-gtm-snippet.mjs` and `gsc-submit.mjs --init` only patch **static HTML**.
  On a Next.js site they silently miss `app/[locale]/layout.tsx` (and will edit
  `reference/static-site.html` if present). Add the GTM id + the
  `google-site-verification` meta to the layout by hand.
- The Indexing API daily quota is shared across the automation account and was
  already spent, so the 513 URLs were not force-submitted. The sitemap is
  submitted, so discovery still happens — just slower.

### Residual manual toggles (~3–4 min, no API exists)
- [ ] GA4 → Admin → Data collection → ON: **Google signals** + **User-provided data**
- [ ] Ads → Goals → Conversions → `sewakatilhospital.my (web) whatsapp_click`
      → Count → change **Every → One** (canonical Utopia setting, not optional)
- [ ] Ads → Tools → Linked accounts → GA4 → ON: **Import app and web metrics**
- [ ] *(optional)* GTM → Container Settings → Consent Overview (BETA)
