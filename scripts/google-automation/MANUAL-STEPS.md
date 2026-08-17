# Manual Steps — Google Integration Automation

Things the automation scripts CAN'T do. Keep this list short — these are the only clicks you make per site.

---

## ⚠️ WHEN to run Google integration

**Run these scripts at the END of a build, AFTER the paid domain is connected on Vercel.**

### Prerequisites (must be true before running)

- [x] Site is built + deployed on Vercel (can be preview URL initially)
- [x] **Paid domain is connected to Vercel** (e.g. `katilhospital.com.my` → Vercel)
- [x] Paid domain resolves: `curl -I https://www.yourdomain.com/` returns 200
- [x] **DNS nameservers point to Vercel** (required for `gsc-add-domain-property.mjs` — check via `vercel domains ls`)
- [x] Vercel deploy automation works (CLI or git push, so re-deploys happen smoothly)

### Why after paid domain, not before

- **GSC property = the URL you submit.** If you verify with `https://xxx-six.vercel.app/`, you'd need to create a second property later for your real domain → duplicate properties, split data, confusion.
- **GA4 data stream URL** is tied to the domain. Easier to set once with the final domain than migrate later.
- **GTM itself** doesn't care about URL (it's loaded via container ID on any domain), but the tracking data ends up cleaner when GA4/GSC are set up on the final URL.
- **Webcore entities** are keyed by production domain — same logic as above.

### Canonical per-site sequence (updated 2026-05-11 — GSC Domain reordered to Phase 1)

This is the order Claude follows for every new Utopia site. Run from `google-automation/` directory.

Each phase that requires a deploy is deployed separately (not batched) so each step has its own live-site checkpoint — if something breaks, you know exactly which phase caused it.

```
PHASE 0 — Prereqs (manual)
  • Site built, deployed to Vercel
  • Paid domain connected + DNS nameservers on Vercel
  • Webcore entity created (slug + WA number + prefill text)

PHASE 1 — GSC Domain property (fully automated, no deploy needed) ← REORDERED to first
  • node gsc-add-domain-property.mjs --domain <newdomain> --sitemap https://www.<newdomain>/sitemap.xml
  • Result: catch-all property at sc-domain:<newdomain> with main sitemap submitted
    (also picks up /en/ and /zh/ sitemaps automatically when they exist)
  • Position rationale: pure DNS TXT, no <head> modification, no deploy — runs first
    so the property is registered even if a later phase fails

PHASE 2 — GA4 (automated + 1 manual toggle batch)
  • node ga4-create.mjs --domain <newdomain>
  • Manual: GA4 → Admin → Data collection → toggle Google Signals + User-provided data (~20s)
  • Produces the Measurement ID (G-XXXX) needed by Phase 3

PHASE 3 — GTM (fully automated, requires deploy)
  • node gtm-setup.mjs --domain <newdomain> --ga4-id <G-XXXX>
  • node inject-gtm-snippet.mjs --site <projectDir> --gtm-id <GTM-XXXX>
  • DEPLOY here so GTM snippet goes live (verify GTM is loading on the live site)

PHASE 4 — GSC URL-prefix properties (automated, 3 per multi-lang site, requires deploy)
  • node gsc-submit.mjs --domain <newdomain> --url https://www.<newdomain>/ --site <projectDir> --init
  • DEPLOY here so the verification meta tag goes live
  • node gsc-submit.mjs ... --finalize             # for canonical /
  • node gsc-submit.mjs ... --url https://www.<newdomain>/en/ --finalize
  • node gsc-submit.mjs ... --url https://www.<newdomain>/zh/ --finalize
  • node _user-add-gsc-properties.mjs <each URL>   # adds to user dashboard

PHASE 5 — Google Ads conversion import (AUTOMATED as of 2026-05-25)
  • node ads-import-conversion.mjs --no-mcc \
      --customer-id 1933757591 \
      --domain <newdomain> \
      --ga4-property-id <numeric_from_ga4-create_config> \
      --event whatsapp_click
  • Creates GA4↔Ads link via Analytics Admin API → Google auto-imports the
    Key Event as an Ads conversion within ~5s. Idempotent.
  • Run AFTER Phase 2 (GA4 has property + Key Event registered).
  • Conversion will only START REPORTING DATA once event fires in production
    (typically a few hours to a day after deploy).
```

End state per site: GA4 property + GTM container + 4 GSC properties (1 Domain + 3 URL-prefix) + 1 Ads conversion action.

---

## 🔧 One-time Setup (do ONCE, forever)

Already completed ✅:

- [x] Google Cloud project created (`utopia-automation`)
- [x] 4 APIs enabled: Analytics Admin, Tag Manager, Search Console, Indexing
- [x] Service account created: `utopia-sa@utopia-automation.iam.gserviceaccount.com`
- [x] JSON key saved at `~/.google-credentials/utopia-sa.json`
- [x] SA added to GTM "Utopia Website" account as Administrator + Publish
- [x] SA added to GA4 "Utopia 1st Analytics" account as Administrator

- [x] Site Verification API enabled in Google Cloud project
- [x] SA has all required scopes (GTM, GA4 Admin, Search Console, Indexing, Site Verification)

### Deferred (optional):
- [ ] (Optional) Google Ads developer token if you want to automate Ads conversion import later

---

## 📋 Per-new-site Manual Steps

These clicks remain even after all scripts are built. All other steps are automated.

### After `ga4-create.mjs` runs — 2 toggles (~20 seconds)

Google API intentionally keeps these behind manual consent:

**Open GA4** → Admin → Data collection and modification → **Data collection**:

1. **Google signals data collection** → "Turn on" → acknowledge
2. **User ID and user-provided data collection** → "Turn on" → acknowledge + check "Collect automatically-detected user-provided data"

*Why manual:* Google requires explicit human consent to enable these advertising/privacy features on new properties.

---

### GTM container — 1 optional toggle (~3 seconds)

**Open GTM** → container → Admin → Container Settings:

- [ ] Tick **"Enable consent overview (BETA)"** (purely cosmetic — shows the Consent Overview panel in Tags page)

*Why manual:* BETA feature, not exposed in GTM API v2.  
*Why optional:* Per-tag consent is already set via API. Toggle only affects UI visibility.

---

### GSC Domain property (NOW AUTOMATED when DNS is on Vercel — see `gsc-add-domain-property.mjs`)

In addition to the 3 URL-prefix properties (canonical + `/en/` + `/zh/`) handled by `gsc-submit.mjs`, every site should also have a **Domain property** (`sc-domain:<domain>`) for catch-all rollup + future-subdomain coverage. As of 2026-05-11 this is fully automated when the domain's DNS is on Vercel:

```bash
node gsc-add-domain-property.mjs \
  --domain <newdomain> \
  --sitemap https://www.<newdomain>/sitemap.xml
```

Runs in ~30 seconds. No clicks. End state: 4 properties total in user's GSC dashboard (3 URL-prefix + 1 Domain), all with sitemaps submitted.

Requires: `vercel` CLI authenticated under the right scope (defaults to `chokchunynh-4497s-projects`); nameservers for the domain already pointed to Vercel.

---

### After all scripts — Google Ads conversion import (AUTOMATED as of 2026-05-25 — DO NOT skip as "manual")

**Status:** FULLY AUTOMATED via `ads-import-conversion.mjs --no-mcc` (Phase 5 in the table above). It creates the GA4↔Ads link via the Analytics Admin API; Google auto-imports the GA4 Key Event as an Ads conversion within ~5s; the script then activates it (`status=ENABLED`, `category=CONTACT`, `primary_for_goal=true`, `lookback=90d`). Idempotent. Full detail: `memory/google-ads-conversion-import-fully-automated-as-of-2026-05-25.md`.

**The unblock (why the old "stays manual" note below was wrong):** the old blocker was that MCC `511-251-8935` couldn't manage target `193-375-7591` (manager slot full). `--no-mcc` bypasses it — the OAuth user `utopiacoliving@gmail.com` is a direct admin on Ads customer `1933757591`, so the script calls that customer directly with no MCC hop. **No 24h wait:** `whatsapp_click` is pre-registered as a Key Event in Phase 2 (`ga4-create.mjs`), so it's importable immediately — the conversion action exists right away; only reported *data* waits on real clicks.

**Canonical command (per new site):**
```
node ads-import-conversion.mjs --no-mcc \
  --customer-id 1933757591 \
  --domain <domain> \
  --ga4-property-id <numeric-id-from-ga4-create-config> \
  --event whatsapp_click
```

**2 residual UI-only steps stay manual (genuinely API-impossible — verified v18→v24, do NOT re-attempt via API):**
1. **REQUIRED — counting `EVERY` → `ONE_PER_CLICK`:** Ads → Goals → Conversions → the action → Edit settings → Count → "One". (counting_type is immutable on auto-imported `GOOGLE_ANALYTICS_4_CUSTOM` actions; UI is the only path. Canonical Utopia setting = cleaner Smart Bidding signal.)
2. **Toggle ON "Import app and web metrics":** Tools → Data manager → Google Analytics (GA4) → Manage & link → toggle ON. (No API field exists on either side. The "audiences" toggle the script already sets is a different thing.)

#### Dev token (one-time, already in place — historical note)
Dev token `CAHfap-...` (Basic Access on MCC `511-251-8935`) at `~/.google-credentials/utopia-ads-token.txt`; OAuth user `utopiacoliving@gmail.com` has `adwords` + `analytics.edit` scopes and is admin on both the GA4 property and Ads customer `1933757591`; Google Ads API enabled in GCP project `utopia-automation`. Only re-apply if the token is ever revoked: Ads → Tools → API Center → Apply, then `node oauth-login.mjs` to refresh the OAuth token with the `adwords` scope.

---

## ✅ Fully Automated (reference — no manual work needed)

These steps require ZERO clicks per new site once scripts are finished:

### GA4 (`ga4-create.mjs`)
- Property creation (name, timezone, currency, industry)
- Web data stream + Measurement ID
- Enhanced Measurement (defaults ON)
- Data retention → 14 months
- User data collection acknowledgement (top-level privacy disclosure)
- `whatsapp_click` pre-registered as Key Event (skips 24h wait)

### GTM (`gtm-setup.mjs`)
- Container creation under Utopia Website account
- Grant Publish access to `utopiacoliving@gmail.com`
- Enable all 6 Built-In Click variables
- Create `Constant_Measurement ID` variable
- Create All Pages trigger
- Create Google Tag + Conversion Linker + GA4 Event tag (all with consent=notNeeded)
- Create `whatsapp_click` trigger (Just Links, filter on `/redirect-whatsapp-1`)
- Interactive extra events (optional — e.g. phone_click, form_submit)
- Publish new version

### GTM snippet injection (`inject-gtm-snippet.mjs`)
- Patches `<head>` + `<body>` of all HTML (hub + en/ + zh/ + location pages)
- Idempotent — re-runs safely skip already-injected files

### GSC (`gsc-submit.mjs` — two-phase)
- Phase 1 (`--init`): Get verification token → inject meta tag into all HTML → save token to config
- *Deploy step happens here (your deploy workflow — Vercel CLI or git push)*
- Phase 2 (`--finalize`): Verify site ownership → add as URL-prefix property → submit sitemap → bulk-submit URLs via Indexing API

**Indexing API note:** ~200 URL/day quota per project. For sites with 200+ pages (like katil-hospital 231), script auto-stops at limit. Run again next day if needed.

---

## 🗒️ Summary: total manual time per new site

- 20 seconds: 2 GA4 toggles (Google Signals + User-provided data)
- Google Ads conversion import: AUTOMATED (`ads-import-conversion.mjs`, no 24h wait) — leaves only 2 UI-only toggles (~30s): counting `Every`→`One`, and "Import app and web metrics" ON
- 3 seconds (optional): GTM Consent Overview BETA toggle
- + your normal deploy step (Vercel CLI `vercel --prod` or git push)

**Total clicking: ~3-4 minutes per site** (vs ~45-60 min fully manual before automation)

---

## 🚀 Full Per-New-Site Workflow

```bash
cd "/Users/aliah/Website Builder/google-automation"

# 1. Create GA4 property
node ga4-create.mjs --domain katilhospital.com.my
# → outputs Measurement ID (e.g. G-XXXXXXXXXX)
# → manual: toggle Google Signals + User-provided data in GA4 UI

# 2. Create GTM container + all tags
node gtm-setup.mjs --domain katilhospital.com.my --ga4-id G-XXXXXXXXXX
# → outputs Container ID (e.g. GTM-XXXXXXX)
# → interactive: asks for extra events (optional)

# 3. Inject GTM snippet into all HTML
node inject-gtm-snippet.mjs --container GTM-XXXXXXX --site ../projects/katilhospital.com.my

# 4. GSC Phase 1: get token + inject meta tag
node gsc-submit.mjs --domain katilhospital.com.my --url https://www.katilhospital.com.my/ --site ../projects/katilhospital.com.my --init

# 5. DEPLOY (your normal process — vercel CLI or git push)

# 6. GSC Phase 2: verify + submit sitemap + bulk index
node gsc-submit.mjs --domain katilhospital.com.my --url https://www.katilhospital.com.my/ --site ../projects/katilhospital.com.my --finalize

# 7. Manual: GA4 toggles (Google Signals + User-provided data) — 20 seconds

# 8. Ads conversion import — AUTOMATED (no 24h wait; whatsapp_click is already a Key Event):
node ads-import-conversion.mjs --no-mcc \
  --customer-id 1933757591 --domain katilhospital.com.my \
  --ga4-property-id <numeric-id> --event whatsapp_click
#    → then 2 UI-only follow-ups: counting Every→One, "Import app and web metrics" ON
```

---

## 🧪 Test Coverage

- ✅ `ga4-create.mjs` — tested with throwaway property, all steps worked except 2 toggles (deliberate API limit)
- ✅ `gtm-setup.mjs` — tested with throwaway container, all tags/triggers/variables/consent/publish works
- ✅ `inject-gtm-snippet.mjs` — tested with sandbox HTML files, idempotent, handles nested folders
- ✅ `gsc-submit.mjs` Phase 1 — tested on katil-hospital (233 files injected successfully)
- ⏸️ `gsc-submit.mjs` Phase 2 — deferred to next real site build (test deploy blocked by permission config between `aliahutopia` user and `designutco` team)
