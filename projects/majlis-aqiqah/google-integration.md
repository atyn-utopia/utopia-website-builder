# Google Integration — Majlis Aqiqah (`majlisaqiqah.my`)

> Run 2026-08-04 via the internal `google-automation-INTERNAL` bundle, after the paid
> domain went live. Utopia shared Google account (`utopiacoliving@gmail.com`).

## What exists now

| Asset | Value |
|---|---|
| GA4 Measurement ID | `G-9HG0M51F7E` |
| GA4 Property ID | `548396942` |
| GTM Container | `GTM-WKVL7GXN` (account `6000211475`, container `260266708`) |
| GSC Domain property | `sc-domain:majlisaqiqah.my` — DNS TXT verified, `siteOwner` |
| GSC URL-prefix | `https://majlisaqiqah.my/` · `/en/` · `/zh/` — all verified |
| Ads customer | `1933757591`, conversion action `whatsapp_click` imported from GA4 |
| Key Event | `whatsapp_click`, pre-registered in GA4, fires on `/redirect-whatsapp-1` |

Per-site config: `google-automation-INTERNAL/configs/majlisaqiqah.my.json`.

## Two deviations from the bundle's happy path

1. **`--vercel-scope`** — the script defaults to `chokchunynh-4497s-projects`, which does not
   exist on this account; `vercel dns add` failed with "The specified scope does not exist".
   The real team id is **`chokchunynh`**. Pass `--vercel-scope chokchunynh`.
2. **This is a Next.js site, so both injectors no-op** (`Found 0 HTML file(s)`) — they only
   rewrite static HTML. Both snippets were added by hand to `app/[locale]/layout.tsx`:
   - GTM head script + post-`<body>` noscript iframe, following the `boom-lift-rental` pattern.
   - GSC ownership via the Metadata API: `verification: { google: '…' }`, which renders
     `<meta name="google-site-verification">` on every page.
   A single meta tag covered all three URL-prefix properties because the Domain property is
   already DNS-verified.

## Notes

- Bulk indexing in Phase 4 hit the shared account's daily Indexing API quota
  (`~200 publish requests/day`) and requested 0 of 549 URLs. This is **best-effort only** —
  the submitted sitemap is what drives discovery. Re-run later if you want the nudge.
- `_list-gsc-sites.mjs` authenticates as the **service account** and lists no `sc-domain:`
  properties for any site. That is a property of that helper's auth, not a missing property —
  confirm domain properties against the **user** auth instead.

## Residual manual clicks (no API exists for these)

- [ ] **GA4** → Admin → Data collection and modification → Data collection:
      turn ON *Google signals* and *User ID and user-provided data*.
- [ ] **Ads** → Goals → Conversions → `majlisaqiqah.my (web) whatsapp_click` → Edit settings
      → Count → change **Every → One**. Auto-imported conversions are `EVERY` and the field is
      immutable via API; `ONE_PER_CLICK` is the Utopia standard (cleaner Smart Bidding signal).
- [ ] **Ads** → Tools → Linked accounts → Google Analytics 4 → the linked property →
      toggle ON *Import app and web metrics*. (Audiences is already on.)
- [ ] *(optional)* **GTM** → Container Settings → Enable consent overview (BETA).

Screenshots: https://websitebuilder.utopiaai.my/google (§04)
