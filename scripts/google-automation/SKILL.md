---
name: google-integration-internal
description: Internal Utopia Google integration — set up GA4 + GTM + GSC + Google Ads conversion import for a Utopia site via the automated 6-phase sequence, where Phase 6 drives a real browser to flip the four toggles Google exposes no API for. Wired to Utopia's shared automation account with credentials already on this machine, so NO Google Cloud setup is needed. Use after a Utopia site's paid domain is live. This is the internal all-in-one bundle.
---

# Google Integration — Internal Utopia (all-in-one)

Wired to Utopia's shared automation account. **Credentials already live in
`~/.google-credentials/`** on the build machine, so there's no Google Cloud setup —
just run the phases.

`SETUP.md` is the external / bring-your-own-Google variant of this doc, kept for
reference. Internally you skip its §2 and §3 — our credential filenames are
`utopia-sa.json`, `utopia-user-oauth.json`, `utopia-oauth-client.json`,
`utopia-ads-token.txt`.

## Step 0 — one-time on this machine

```bash
npm install
npx playwright install chromium                 # the browser Phase 6 drives
node finalize-manual-toggles.mjs --login        # one-time Google login (password + 2FA)
```

`--login` opens a real window; a human signs in as `utopiacoliving@gmail.com` and ticks
"Don't ask again on this device". The session persists to
`~/.google-credentials/pw-google-profile` and is reused for every site afterwards.

> 🔒 These are live keys to Utopia's Google. Keep them on this machine only — don't
> commit them to any repo or forward them. If a key is exposed, tell the owner to rotate it.

## Prerequisites (per site)

- The site's paid domain is live on Vercel + DNS points there (`curl -I https://www.<domain>/` → 200).
- **Every WhatsApp CTA routes through a `/redirect-whatsapp-1/` page** — the `whatsapp_click`
  conversion fires on that redirect, so tracking won't work without it. Direct `wa.me` links aren't tracked.

## Run the 6 phases (from this folder)

```bash
# PHASE 1 — GSC Domain property (no deploy)
node gsc-add-domain-property.mjs --domain <domain> --sitemap https://www.<domain>/sitemap.xml
# PHASE 2 — GA4 property (no deploy) → outputs Measurement ID + numeric property id
node ga4-create.mjs --domain <domain>
# PHASE 3 — GTM container + inject snippet → DEPLOY after
node gtm-setup.mjs --domain <domain> --ga4-id G-XXXX --skip-extras
node inject-gtm-snippet.mjs --container GTM-XXXX --site <site-dir>
# PHASE 4 — GSC URL-prefix (init → DEPLOY → finalize; repeat per language)
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <dir> --init
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <dir> --finalize
# PHASE 5 — Ads conversion import (no 24h wait)
node ads-import-conversion.mjs --no-mcc --customer-id 1933757591 --domain <domain> --ga4-property-id <numeric-id> --event whatsapp_click
# PHASE 6 — the 4 toggles Google gives no API for (was the manual 3–4 min)
node finalize-manual-toggles.mjs --domain <domain>
```

Deploy each phase that needs it (3 and 4) separately.

**Phase 6 reads `configs/<domain>.json`** — Phase 2 writes the `ga4` block and Phase 5
writes the `ads` block (`customerId`, `ga4PropertyId`, `conversionActionId`,
`conversionActionName`, `event`), both automatically. If the `ads` block is missing,
Phase 6 exits with `❌ No ads.customerId / ads.conversionActionId in config` — re-run
Phase 5, which is idempotent.

## Phase 6 — what it actually flips

| # | Toggle | How |
|---|---|---|
| 1 | GA4 → Google signals data collection → ON | GA4 Admin API PATCH as the **user** OAuth, Playwright fallback |
| 2 | GA4 → User-provided data collection (+ auto-detect) → ON | same |
| 3 | Ads → conversion counting **Every → One-per-click** | Playwright only (`counting_type` is immutable on auto-imported actions); verified back through the Ads API |
| 4 | Ads → GA4 link → "Import app and web metrics" → ON | Playwright only (no API field exists); verified by `aria-checked` + screenshot |

Idempotent — it reads current state first and skips anything already set. Useful flags:

```bash
node finalize-manual-toggles.mjs --domain <domain> --dry-run   # report state, change nothing
node finalize-manual-toggles.mjs --domain <domain> --only ads-counting,ads-metrics
node finalize-manual-toggles.mjs --login                       # session expired
```

A browser window opening and driving itself is expected. Screenshot proofs land in
`_screenshots/<domain>/` (gitignored). If it reports "session expired", re-run `--login`.

Still genuinely manual, and still optional: **GTM → Container Settings → Consent
Overview (BETA)**. Screenshots for the manual fallback of all of the above:
https://websitebuilder.utopiaai.my/google (§04).

## Full docs
- `SETUP.md` — external / bring-your-own-Google setup (placeholder swap-list)
- `MANUAL-STEPS.md` — canonical per-site runbook + manual fallback for Phase 6
- `README.md` — human quick-start
- `REFERENCE-manual-flow.md`, `ADS-API-DESIGN-DOC.md` — deep detail
