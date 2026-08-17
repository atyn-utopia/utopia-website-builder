---
name: google-integration-internal
description: Internal Utopia Google integration — set up GA4 + GTM + GSC + Google Ads conversion import for a Utopia site via the automated 5-phase sequence. Wired to Utopia's shared automation account with credentials bundled, so NO Google Cloud setup is needed. Use after a Utopia site's paid domain is live. This is the internal all-in-one bundle.
---

# Google Integration — Internal Utopia (all-in-one)

Wired to Utopia's shared automation account. **Credentials are bundled** in `credentials/`,
so there's no Google Cloud setup — just place the creds and run.

## Step 0 — one-time on this machine (place the bundled credentials)

```bash
mkdir -p ~/.google-credentials
cp credentials/* ~/.google-credentials/
npm install
```

> 🔒 These are live keys to Utopia's Google. Keep them on this machine only — don't
> commit them to any repo or forward them. If a key is exposed, tell the owner to rotate it.

## Prerequisites (per site)

- The site's paid domain is live on Vercel + DNS points there (`curl -I https://www.<domain>/` → 200).
- **Every WhatsApp CTA routes through a `/redirect-whatsapp-1/` page** — the `whatsapp_click`
  conversion fires on that redirect, so tracking won't work without it. Direct `wa.me` links aren't tracked.

## Run the 5 phases (from this folder)

```bash
# PHASE 1 — GSC Domain property (no deploy)
node gsc-add-domain-property.mjs --domain <domain> --sitemap https://www.<domain>/sitemap.xml
# PHASE 2 — GA4 property (no deploy) → outputs Measurement ID + numeric property id
node ga4-create.mjs --domain <domain>
# PHASE 3 — GTM container + inject snippet → DEPLOY after
node gtm-setup.mjs --domain <domain> --ga4-id G-XXXX
node inject-gtm-snippet.mjs --container GTM-XXXX --site <site-dir>
# PHASE 4 — GSC URL-prefix (init → DEPLOY → finalize; repeat per language)
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <dir> --init
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <dir> --finalize
# PHASE 5 — Ads conversion import (no 24h wait)
node ads-import-conversion.mjs --no-mcc --customer-id 1933757591 --domain <domain> --ga4-property-id <numeric-id> --event whatsapp_click
```

Deploy each phase that needs it (3 and 4) separately.

## Residual manual clicks (~3–4 min — genuinely no API)

Tell the user upfront, then do each after the phase noted:

1. **REQUIRED — GA4** → Admin → Data collection → turn ON Google Signals + User-provided data.
2. **REQUIRED — Ads** → the conversion action → Count → "Only one conversion" → Save.
3. **REQUIRED — Ads** → Data manager → GA4 → toggle ON "Import app and web metrics".
4. *(optional)* **GTM** → Container Settings → Consent Overview (BETA).

Screenshots for these: https://websitebuilder.utopiaai.my/google (§04).

## Full docs
- `MANUAL-STEPS.md` — canonical per-site runbook
- `README.md` — human quick-start
- `REFERENCE-manual-flow.md`, `ADS-API-DESIGN-DOC.md` — deep detail
