# Google Integration — Original Manual Flow (PRE-automation)

> Source: User's "GOOGLE INTEGRATION SET UP.pdf" (May 2026). This is the manual click-through flow Aliah personally used for previous Utopia sites BEFORE `google-automation/` scripts were built. **Read this when:** the automation scripts hit a step they can't do via API, OR when validating that automated output matches what the manual flow produces.
>
> The automated equivalent lives in `MANUAL-STEPS.md` — but `MANUAL-STEPS.md` only covers what the scripts can't automate. THIS doc covers EVERYTHING (the full original flow). Keep both.

---

## Phase 1 — GA4 Property setup (manual flow)

1. Open `https://analytics.google.com` → **+ Create** → **Property**
2. **Property name** = the domain name **without `www`** (e.g., `utopiagroup.com.my`, NOT `www.utopiagroup.com.my`). Naming convention used across all Utopia sites for easier dashboard scanning.
3. Reporting time zone: **Malaysia (GMT+08:00)**
4. Currency: **Malaysian Ringgit (RM)**
5. Industry category: **Business & Industrial** (or whatever matches the site's actual industry)
6. Business size: **Large — 101 to 500 employees**
7. Business objective: **Generate leads** (tick this one)
8. Choose platform: **Web**
9. Set up the web data stream:
   - Website URL: `https://www.<domain>`
   - Stream name: same as property (domain without `www`)
   - Enhanced Measurement: ON (default — leave on)
10. **Copy the Measurement ID** (`G-XXXXXXXXXX`) — needed for GTM later

### GA4 manual toggles (post-creation)
Property → Admin → Data collection and modification → **Data collection**:
- **Google signals data collection** → "Turn on" → acknowledge
- **User ID and user-provided data collection** → "Turn on" → acknowledge + tick "Collect automatically-detected user-provided data"

### Data retention
Property → Admin → Data collection and modification → **Data retention**:
- Event data: **14 months**
- User data: **14 months**
- Save

> **Automated equivalent:** `node ga4-create.mjs --domain <domain>` does property creation + data stream + 14-month retention + Key Event registration. The two manual toggles (Google Signals + User-provided data) still need clicks — Google API limit.

---

## Phase 2 — GTM Container setup (manual flow)

1. Open `https://tagmanager.google.com` → **All accounts** → "Utopia Website" → **Create Container**
2. **Container name** = `www.<domain>` (with the `www` prefix — different from GA4 naming)
3. Target platform: **Web**
4. Click **Create**

### Variables — Built-In
Container → **Variables** → **Configure** Built-In Variables → tick all 6 click variables:
- Click Element, Click Classes, Click ID, Click Target, Click URL, Click Text

### Variables — Constant for Measurement ID
**User-Defined Variables** → **New** → **Constant**:
- Value: paste the GA4 Measurement ID (e.g., `G-9YE4CH739M`)
- Name: `Constant_Measurement ID`
- Save

### Tag — Google Tag
Tags → **New** → tag type: **Google Tag**:
- Tag ID: `{{Constant_Measurement ID}}` (use the constant variable)
- Triggering: **All Pages**
- Save (no consent required at this point)

### Tag — Conversion Linker
Tags → **New** → tag type: **Conversion Linker**:
- No configuration required
- Triggering: **All Pages**
- Save

### Tag — GA4 Event for `whatsapp_click`
Tags → **New** → tag type: **Google Analytics: GA4 Event**:
- Measurement ID: `{{Constant_Measurement ID}}`
- Event Name: `whatsapp_click`
- Triggering: a custom **Just Links** trigger:
  - Trigger Configuration: Click — Just Links
  - Fires on: Click URL **contains** `/redirect-whatsapp-1`
  - Save trigger named `whatsapp_click`
- Save tag

### Consent Overview (BETA)
Admin → **Container Settings** → tick **"Enable consent overview (BETA)"** → Save.

Then: Tags → "Consent Overview" button (top-right) → opens **Consent Overview (BETA)** panel → bulk-edit all 3 tags → consent → **No additional consent required** → Save.

### Submit + Publish
Top-right → **Submit**:
- Choose: **Publish and Create Version**
- Version Name: e.g., `17 April 2026` (or today's date)
- Publish

> **Automated equivalent:** `node gtm-setup.mjs --domain <domain> --ga4-id G-XXX` creates container, variables, all 3 tags, the whatsapp_click trigger, sets consent on all tags, and publishes. The "Consent Overview BETA" toggle is purely cosmetic UI; the actual per-tag consent IS set via API.

### Snippet installation
GTM gives you two `<script>` snippets to install on the website. **For Next.js sites**, do NOT paste these directly into HTML — instead use `@next/third-parties` package and add `<GoogleTagManager gtmId="GTM-XXX" />` to `app/layout.tsx`. That snippet survives every `npm run build`. (For static-HTML sites, paste the snippets into every page's `<head>` and right after `<body>`.)

---

## Phase 3 — Google Ads conversion import (AUTOMATED as of 2026-05-25)

Run the script — **no 24h wait** (the event is pre-registered as a Key Event in Phase 2, so it's importable immediately; only reported *data* waits on real clicks):

```
node ads-import-conversion.mjs --no-mcc \
  --customer-id 1933757591 --domain <domain> \
  --ga4-property-id <numeric-id-from-ga4-create-config> --event whatsapp_click
```

It creates the GA4↔Ads link (Analytics Admin API), Google auto-imports the `whatsapp_click` Key Event as a conversion within ~5s, and the script activates it (`ENABLED` / `CONTACT` / primary-for-goal / 90-day lookback). Idempotent — re-running on a set-up site is a no-op.

**2 residual UI-only steps stay manual (genuinely API-impossible — verified v18→v24, do NOT re-attempt via API):**
1. **REQUIRED — counting `Every` → `One`** (ONE_PER_CLICK): Ads → Goals → Conversions → the action → Edit settings → Count → "One". (counting_type is immutable on auto-imported `GOOGLE_ANALYTICS_4_CUSTOM` actions.)
2. **Toggle ON "Import app and web metrics":** Tools → Data manager → Google Analytics (GA4) → Manage & link → ON. (No API field exists; the "audiences" toggle the script sets is a different thing.)

> **How the old blocker was solved (the 2026-05-11 "stay manual" decision is SUPERSEDED):** `--no-mcc` targets Ads customer `1933757591` (= `193-375-7591`) **directly**, using the OAuth user's direct-admin access — so it no longer needs MCC `511-251-8935` to *manage* the target (the old "manager slot full" wall). The dev token still comes from `511-251-8935`; only the `login_customer_id` changes (to the target itself). Full detail: `memory/google-ads-conversion-import-fully-automated-as-of-2026-05-25.md`.

**Manual fallback** (only if the script ever fails — e.g. token revoked):
1. Open Google Ads as `utopiacoliving@gmail.com`, account `193-375-7591`
2. Tools → Data Manager → Google Analytics (GA4) → Link the GA4 property (app+web metrics ON, audiences ON)
3. Goals → Conversions → + Create → Conversions on a website → select the `whatsapp_click` event → Import

## MCC Account Structure (important — read before any Ads automation)

Multiple accounts share the `utopiacoliving@gmail.com` login. They look similar in the UI but serve different roles:

| Account ID | Name | Type | Role |
|---|---|---|---|
| `193-375-7591` | Utopia | regular Ads | **Hosts campaigns + conversions for all Utopia sites.** Reachable by the Ads API via `ads-import-conversion.mjs --no-mcc` (dev token from `511-251-8935`, `login_customer_id` = this account, OAuth user is direct admin) — it does NOT need to be an MCC. Managed by 197-027-2227. |
| `511-251-8935` | Manager Utopia | **true MCC** | Has approved dev token. Zero children. Cannot host conversions directly. |
| `197-027-2227` | Utopia Group | Business Account Manager (BAM) | Currently manages `193-375-7591`. Ownership/purpose unclear — investigate before touching. |

Earlier confusion (already burned through 1 rejected dev token application): the user originally believed `193-375-7591` was the MCC because its UI looks identical to a true MCC. It's not — it's a regular account with linked sub-accounts via invitations. Only a TRUE MCC (created via the manager-account signup flow) can be issued a dev token. See `memory/feedback_verify_true_mcc_before_ads_application.md`.

---

## Phase 4 — Google Search Console setup (manual flow)

1. Open `https://search.google.com/search-console`
2. Click **Add property** → choose **URL prefix** (right side)
3. Enter `https://www.<domain>/` → **Continue**
4. Verify via one of the offered methods (HTML tag is the standard for Utopia sites — paste the tag into `<head>`, deploy, click Verify)
5. **Repeat for each language variant** — `/ms/`, `/en/`, `/zh/` etc. if the site has them. **Aliah verifies each language path as a separate URL-prefix property** so per-language Search Performance data is visible in GSC.
6. URL Inspection → paste a URL → **Test live URL** → "URL is on Google" once indexed → click **Request indexing** to nudge Google

### Known patterns

- For multi-language sites, add ALL of: `https://www.<domain>/`, `https://www.<domain>/en/`, `https://www.<domain>/zh/`. Each becomes its own GSC property.
- **Also add a Domain property** (`sc-domain:<domain>`) for the catch-all rollup + future-subdomain coverage. The 3 URL-prefix properties give per-language Search Performance data; the Domain property catches everything else.
- Sitemap: submit `https://www.<domain>/sitemap.xml` once per property after verification.

> **Automated equivalent:**
> - **URL-prefix properties:**
>   - `node gsc-submit.mjs --domain <domain> --url <siteUrl> --site <projectDir> --init` → injects verification meta tag
>   - DEPLOY happens here
>   - `node gsc-submit.mjs ... --finalize` → verifies via Site Verification API + adds property to SA's GSC + submits sitemap + bulk-indexes URLs
>   - **Per-language properties NOT yet automated.** The script handles only the canonical URL. To add `/en/` and `/zh/`, run finalize again with each `--url`.
>   - **Adding the user as a verified owner so they see the property in their dashboard:** use `--add-owner <email>` flag (added 2026-05-08) OR run `_add-gsc-owner.mjs <siteUrl> <email>` standalone. The user STILL has to click "Add property" once in their own GSC because Google requires a per-user dashboard registration step.
> - **Domain property (DNS TXT) — fully automated when DNS is on Vercel:**
>   - `node gsc-add-domain-property.mjs --domain <domain> --sitemap <sitemapUrl>` (added 2026-05-11)
>   - Fetches the TXT token via Site Verification API, runs `vercel dns add` for the TXT record, polls DNS propagation, calls the verify endpoint, registers the property to the user's dashboard, submits sitemap. ~30 s end-to-end.
>   - Requires: `vercel` CLI authenticated under the right scope (default `chokchunynh-4497s-projects`), DNS already pointed to Vercel nameservers, OAuth refresh token at `~/.google-credentials/utopia-user-oauth.json` (created by `oauth-login.mjs`).
>   - **No "click Add property" step required** — verification done via the user's own OAuth so the property auto-appears in their GSC sidebar.

---

## Per-site naming conventions (consistent across all Utopia sites)

| Thing | Format | Example |
|---|---|---|
| GA4 property name | domain without www | `utopiagroup.com.my` |
| GA4 stream name | same as property | `utopiagroup.com.my` |
| GTM container name | domain WITH www | `www.utopiagroup.com.my` |
| GTM constant variable | `Constant_Measurement ID` | – |
| GTM whatsapp event name | `whatsapp_click` | – |
| GTM whatsapp trigger filter | Click URL contains `/redirect-whatsapp-1` | – |
| GSC properties | URL prefix per language | `https://www.<domain>/`, `/en/`, `/zh/` |
| Google Ads campaign account | `193-375-7591` Utopia (regular Ads, NOT an MCC) | – |
| Google Ads API token MCC | `511-251-8935` Manager Utopia (separate from above) | – |
| Default user email | `utopiacoliving@gmail.com` | – |

---

## Why this doc exists

The `google-automation/` scripts were built later (April-May 2026) to remove most of these clicks. But:
1. A few steps STILL require manual UI clicks: GA4 toggles (Google Signals + User-provided data), and 2 Ads-side toggles after the automated import (counting `Every`→`One`, "Import app and web metrics"). NOTE: the Ads conversion *import itself* is AUTOMATED (`ads-import-conversion.mjs`) as of 2026-05-25 — only those 2 toggles remain. GSC dashboard registration per Gmail user is handled by `_user-add-gsc-properties.mjs`.
2. When automation hits an edge case, this doc shows what the original click-flow looked like so we can debug
3. Future Utopia sites built without the automation (or before it's available) follow this exact flow

If you're a future Claude session working on Google integration: **read this doc first, then `MANUAL-STEPS.md` for what's automated, then run the scripts in `google-automation/`**. Don't reinvent the manual flow from scratch.
