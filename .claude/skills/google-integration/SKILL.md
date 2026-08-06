---
name: google-integration
description: Set up a live Utopia site's Google footprint — GA4 + GTM + Google Search Console + Google Ads conversion import — via the internal automation bundle. Use AFTER the site's PAID domain is live on Vercel (post-deploy Step 14). Runs the 5-phase sequence and hands off the ~3–4 min of residual manual Google toggles. Internal Utopia only; wired to the shared automation account with credentials on this machine.
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
gates → place creds → 5 phases with deploys between → residual manual-toggle handoff → verify →
report.

**Or drive it directly.** `cd` into the script folder, read its own `SKILL.md` +
`MANUAL-STEPS.md` (source of truth for flags), then:

```bash
cd scripts/google-automation
npm install                                                                 # one-time
# creds one-time per machine (source: the original bundle, never the repo):
# mkdir -p ~/.google-credentials && cp ~/Downloads/google-automation-INTERNAL/credentials/* ~/.google-credentials/

# PHASE 1 — GSC Domain property (no deploy)
node gsc-add-domain-property.mjs --domain <domain> --sitemap https://www.<domain>/sitemap.xml
# PHASE 2 — GA4 (no deploy) → capture Measurement ID (G-XXXX) + numeric property id
node ga4-create.mjs --domain <domain>
# PHASE 3 — GTM container + inject snippet → DEPLOY after
node gtm-setup.mjs --domain <domain> --ga4-id G-XXXX
node inject-gtm-snippet.mjs --container GTM-XXXX --site <project-dir>
# PHASE 4 — GSC URL-prefix (init → DEPLOY → finalize; repeat per locale)
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <project-dir> --init
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <project-dir> --finalize
# PHASE 5 — Ads conversion import (no deploy, no 24h wait)
node ads-import-conversion.mjs --no-mcc --customer-id 1933757591 --domain <domain> --ga4-property-id <numeric-id> --event whatsapp_click
```

## Prerequisites (block until all true)
- Paid domain live: `curl -I https://www.<domain>/` → 200, DNS on Vercel (`vercel domains ls`).
- Every WhatsApp CTA routes through `/redirect-whatsapp-1/` — the `whatsapp_click` conversion
  fires there; direct `wa.me/` links are not tracked.
- Sitemap reachable at `https://www.<domain>/sitemap.xml`.

## Residual manual clicks (~3–4 min — genuinely no API)
Hand these back to the user; the setup isn't done until they're on:
1. **GA4** → Admin → Data collection → ON: Google Signals + User-provided data (after Phase 2).
2. **Ads** → conversion action → Count → "One" (after Phase 5).
3. **Ads** → Data manager → GA4 → ON: "Import app and web metrics" (after Phase 5).
4. *(optional)* GTM → Container Settings → Consent Overview (BETA).

Screenshots: https://websitebuilder.utopiaai.my/google (§04).

## Deploy discipline
Deploy Phases 3 and 4 **separately** (own checkpoint each). For extracted per-site repos with no
Vercel git integration, a `git push` does NOT deploy — run `vercel --prod` so the injected GTM
snippet / GSC meta tag actually goes live before finalizing.

## Full detail
The script folder's `SKILL.md`, `MANUAL-STEPS.md`, and `REFERENCE-manual-flow.md` are the canonical
runbooks. [agents/gloo.md](../../../agents/gloo.md) is the agent that drives them.
