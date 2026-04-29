# technical-seo-i18n.md — Cold Room Malaysia

**Author:** Kimmy
**Project:** coldroom-malaysia
**Domain:** coldroom-malaysia.vercel.app
**Locales:** en (default), ms, zh — `localePrefix: 'always'`

## A. config/locations.ts
**153 locations** across 13 Peninsular Malaysia states.
Per-state breakdown: KL 15 · Selangor 21 · Putrajaya 10 · Johor 14 · Penang 11 · Perak 12 · NS 10 · Melaka 10 · Kedah 10 · Kelantan 10 · Terengganu 10 · Pahang 10 · Perlis 10. Total = **153** (within 150–180 window).

Each entry: `slug`, `name`, optional `name_ms`, `name_zh`, `state`, `stateSlug`, `nearby[]`. Helpers: `getLocation`, `getLocationsByState`, `getNearbyLocations`, `getState`. File written to `config/locations.ts`.

## B. Metadata helpers
- Homepage: tri-lingual title + description; canonical + en/ms/zh + x-default hreflang; OG image.
- Location: clamp-60 title template `Cold Room Rental in {City}, Malaysia | Same-Day` (ZH `{City}冷库出租 | 清真，当天送达`); per-locale OG locale.
- Blog listing + blog post: locale-specific title + description; article OG type for posts.

## C. Schema components
- `LocalBusinessSchema.tsx` — patched: removed `electric-wheelchair` URL fragment, dropped `telephone` (per CLAUDE no-phone rule), priceRange `RM5 - RM10000`.
- `ProductSchema.tsx` — replaced: rental-only single offer, MYR/day unitCode, supports per-tier `rentalPrice`, `slug`, `imageUrl`.
- Organization, FAQ, Breadcrumb — clean, read from siteConfig.

## D. app/sitemap.ts
Per-locale URLs: 3 homepages + 459 location pages (153 × 3) + 3 blog listings + (3 × N) blog posts. `/redirect-whatsapp-1` excluded.

## E. app/robots.ts
Allow all + disallow `/api/`. Sitemap link emitted.

## F. Tracking
- `global.d.ts` declares `window.uwc`.
- Script in `app/[locale]/layout.tsx` head with `data-website="coldroom-malaysia.vercel.app"`.
- `lib/track.ts` exports `trackWhatsApp(phone)`, `trackBlog(slug)`, `trackProductImpression(slug)`.
- `lib/useImpression.ts` — IntersectionObserver hook fires once per card.

## G. WhatsApp redirect
`page.tsx` passes `phone` to client; `RedirectClient.tsx` fires `window.uwc('click', {label: 'whatsapp-{phone}'})` 60ms before redirect.

## H. Heading lint script
`scripts/lint-headings.mjs` — crawls sitemap sample, asserts H1=1 + H2=1 per page.

## I. Pre-deploy checklist
- ≥150 locations (≥10 per state) ✅ 153
- `npm run build` zero TS errors
- sitemap entry count = 3 + 459 + 3 + (3 × N posts)
- robots.txt 200 with correct Sitemap line
- All pages H1=1, H2=1
- `data-website` matches deployed domain
- All WA buttons fire tracking
- No hardcoded phone in `.tsx` outside `siteConfig.fallbackPhone`
- No `electric-wheelchair` strings remain

**Status:** Ready. Cyclops Part 2 + Hanabi pending Gate 1.
