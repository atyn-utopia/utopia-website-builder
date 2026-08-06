# Google Ads API Tool — Design Document

**Applicant:** Utopia (Manager Account 193-375-7591)
**Contact:** utopiacoliving@gmail.com
**Date:** 2026-05-11
**Tool name:** Utopia Conversion Import Automation

---

## 1. Purpose

Single-purpose internal tool used by Utopia's engineering team to
automate the otherwise-manual conversion-import workflow whenever a
new site is added to the Utopia portfolio. The tool runs only on
accounts under Manager Account `193-375-7591`.

---

## 2. Workflow

When a new website is launched (typically 1-2 per week), the engineer
runs a single command from the terminal:

```
node ads-import-conversion.mjs \
  --domain newsite.com.my \
  --ga4-property-id <numeric_id> \
  --event whatsapp_click
```

The tool performs exactly two API operations on the named sub-account:

### Step 1 — Link the new GA4 property to the Ads manager account

- API: `customers.googleAdsLinks.mutate`
- Operation: Create a single GoogleAdsLink between the manager
  account `193-375-7591` and the GA4 property identified by
  `ga4-property-id`.
- Idempotent: tool checks for an existing link first and skips
  creation if one already exists.

### Step 2 — Create a conversion action

- API: `conversionActions.mutate`
- Operation: Create one ConversionAction of type
  `GOOGLE_ANALYTICS_4_CUSTOM` that imports the GA4 event (e.g.
  `whatsapp_click`) as an Ads conversion.
- `primary_for_goal = true` so the conversion counts toward
  Smart Bidding optimisation on any campaigns the site runs.
- Idempotent: tool queries existing conversion actions and skips if
  one already exists with the same event source.

---

## 3. Authentication

- **OAuth 2.0** user credentials, refresh-token flow.
- Login user: `utopiacoliving@gmail.com` (the manager-account admin)
- OAuth client created in Google Cloud project `utopia-automation`,
  consent screen in External / Testing mode with this email as the
  sole test user.
- Refresh token stored locally at
  `~/.google-credentials/utopia-user-oauth.json` (file-system
  permissions restrict access to the operator's user account).
- Developer token stored at `~/.google-credentials/utopia-ads-token.txt`
  or `GOOGLE_ADS_DEVELOPER_TOKEN` env var.

---

## 4. Access control

- Internal tool only. Source lives in a private GitHub repo
  (`designutco/website-builder`).
- Runs from the engineer's laptop on demand. Not deployed as a
  service, not scheduled, not callable from any external surface.
- No employee outside Utopia engineering has access to the OAuth
  token or developer token.

---

## 5. Volume estimate

- ~5-10 Google Ads API calls per new site
- ~1-2 new sites per week
- Expected total: **<100 API calls / week, peaks under 500 / month**

Well within Basic Access quotas.

---

## 6. Scope limits / what this tool does NOT do

- Does NOT create or modify campaigns, ad groups, ads, keywords,
  budgets, or bids.
- Does NOT manage audiences or remarketing lists.
- Does NOT touch accounts outside Manager Account `193-375-7591`.
- Does NOT operate unattended — every invocation is a manual command
  by an engineer.
- Does NOT call the App Conversion Tracking and Remarketing API.

---

## 7. Endpoints used

| Endpoint | Operation |
|---|---|
| `GoogleAdsService.search` | Read — check if a GA4 link already exists |
| `GoogleAdsService.search` | Read — check if a conversion action already exists |
| `GoogleAds4LinkService.mutate` | Write — create GA4 link |
| `ConversionActionService.mutate` | Write — create conversion action |

No other API endpoints are called.

---

## 8. Error handling

- All API errors are logged to stdout for the engineer to review.
- Idempotency checks prevent duplicate resource creation on retry.
- No automatic retry loops — engineer re-runs the command if a
  transient error occurs.

---

## 9. Compliance

- The tool agrees to the Google Ads API Terms of Service.
- Tool only operates on accounts owned by the applicant under the
  registered Manager Account.
- No reselling of the tool or its outputs to third parties.
- No scraping or unauthorized data collection.

---

## Appendix A — Source code

The tool is open and reviewable at:
`github.com/designutco/website-builder/blob/main/google-automation/ads-import-conversion.mjs`

(Internal repository; Google reviewer may request access if needed
for verification.)
