---
name: google-integration
description: Set up a live Utopia site's Google footprint — GA4 + GTM + Google Search Console + Google Ads conversion import — via the internal automation bundle. Use AFTER the site's PAID domain is live on Vercel (post-deploy Step 14). Runs the 6-phase sequence, where Phase 6 drives a browser to flip the four toggles Google exposes no API for (this replaced the old ~3–4 min of manual Google clicks). Internal Utopia only; wired to the shared automation account with credentials on this machine.
---

# Google Integration (post-deploy)

Sets up **GA4 + GTM + GSC + Google Ads conversion import** for a Utopia site once its
**paid domain is live**. This is the project's post-deploy **Step 14** — it runs after Layla
deploys, never before. It is separate from the Utopia Webcore `t.js` analytics
(`docs/tracking-guide.md`); this is the Google/Ads layer.

## Where the automation lives
The scripts are in this repo:

```
scripts/google-automation/
```

They are wired to Utopia's shared Google account, so there's **no Google Cloud setup**. The
scripts hold **no secrets** — they read credentials at runtime from `~/.google-credentials`,
which **must never enter this git repo**. `scripts/google-automation/.gitignore` blocks the
obvious credential filenames as a backstop.

## How to run it

**Preferred — spawn the agent.** Use the Agent tool with the contents of
[agents/gloo.md](../../../agents/gloo.md) as the prompt, plus the site's paid domain, project
dir, and supported locales. Gloo (Analytics & Growth Specialist) owns the whole flow: preflight
gates → 6 phases with deploys between → verify → report.

**Or drive it directly.** `cd` into the script folder, read its own `SKILL.md` +
`MANUAL-STEPS.md` (source of truth for flags), then:

```bash
cd scripts/google-automation
npm install                                     # one-time
npx playwright install chromium                 # one-time — the browser Phase 6 drives
node finalize-manual-toggles.mjs --login        # one-time per machine — human does password + 2FA
# Credentials themselves are already at ~/.google-credentials on the build machine
# (utopia-sa.json, utopia-user-oauth.json, utopia-oauth-client.json, utopia-ads-token.txt).
# They must never enter this repo.

# PHASE 1 — GSC Domain property (no deploy)
node gsc-add-domain-property.mjs --domain <domain> --sitemap https://www.<domain>/sitemap.xml
# PHASE 2 — GA4 (no deploy) → capture Measurement ID (G-XXXX) + numeric property id
node ga4-create.mjs --domain <domain>
# PHASE 3 — GTM container + inject snippet → DEPLOY after
node gtm-setup.mjs --domain <domain> --ga4-id G-XXXX --skip-extras
node inject-gtm-snippet.mjs --container GTM-XXXX --site <project-dir>
# PHASE 4 — GSC URL-prefix (init → DEPLOY → finalize; repeat per locale)
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <project-dir> --init
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <project-dir> --finalize
# PHASE 5 — Ads conversion import (no deploy, no 24h wait)
node ads-import-conversion.mjs --no-mcc --customer-id 1933757591 --domain <domain> --ga4-property-id <numeric-id> --event whatsapp_click
# → writes the "ads" block into configs/<domain>.json for Phase 6
# PHASE 6 — the 4 no-API toggles, via a real browser (no deploy)
node finalize-manual-toggles.mjs --domain <domain>
```

## Prerequisites (block until all true)
- Paid domain live: `curl -I https://www.<domain>/` → 200, DNS on Vercel (`vercel domains ls`).
- Every WhatsApp CTA routes through `/redirect-whatsapp-1/` — the `whatsapp_click` conversion
  fires there; direct `wa.me/` links are not tracked.
- Sitemap reachable at `https://www.<domain>/sitemap.xml`.

## Phase 6 — the four toggles Google exposes no API for
`finalize-manual-toggles.mjs` reads `configs/<domain>.json` and flips:

1. **GA4** → Google signals data collection → ON — Admin API PATCH as the *user* OAuth, Playwright fallback.
2. **GA4** → User-provided data collection (+ auto-detect) → ON — same.
3. **Ads** → conversion counting **Every → One-per-click** — Playwright only (`counting_type` is immutable on auto-imported actions), verified back through the Ads API.
4. **Ads** → Data manager → GA4 link → "Import app and web metrics" → ON — Playwright only, verified by `aria-checked` + screenshot.

It reads state first and skips whatever is already set, so re-running is safe. A browser window
opening and driving itself is expected; proofs land in `_screenshots/<domain>/` (gitignored).
`--dry-run` reports state without changing anything; "session expired" means re-run `--login`.

The **`ads` block in `configs/<domain>.json` is a prerequisite** for steps 3–4. Phase 5 writes it
automatically; if it's missing (older site integrated before Aug 2026, or Phase 5 never
completed), Phase 6 exits with `❌ No ads.customerId / ads.conversionActionId in config` — re-run
Phase 5, which is idempotent.

Still manual, still optional: GTM → Container Settings → Consent Overview (BETA). Manual
fallback for everything above, if Phase 6 can't run: `scripts/google-automation/MANUAL-STEPS.md`,
screenshots at https://websitebuilder.utopiaai.my/google (§04).

## Deploy discipline
Deploy Phases 3 and 4 **separately** (own checkpoint each). For extracted per-site repos with no
Vercel git integration, a `git push` does NOT deploy — run `vercel --prod` so the injected GTM
snippet / GSC meta tag actually goes live before finalizing.

## Full detail
The script folder's `SKILL.md`, `MANUAL-STEPS.md`, and `REFERENCE-manual-flow.md` are the canonical
runbooks. [agents/gloo.md](../../../agents/gloo.md) is the agent that drives them.
