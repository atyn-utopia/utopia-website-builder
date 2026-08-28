# Google Integration Automation — Setup (6-phase)

Automate the full Google stack for any site you ship: **GA4 + GTM + GSC + Ads
conversion import**, plus **Phase 6** which drives a real browser to flip the four
toggles Google never gave an API — so it's **~zero manual clicks per site**.

> ⚠️ **Bring your own Google.** This kit ships **no credentials** and every account
> id below is a **placeholder** — installing it does **not** grant access to anyone
> else's Google accounts. You must create your **own** Google Cloud project, service
> account, and OAuth client (§2) and point the scripts at your **own** keys (§3).

> Guided flow: drop this folder into your Claude Code `.claude/skills/` and let
> **`SKILL.md`** drive it — it asks internal-Utopia vs external first, then runs the phases.

---

> **Internal Utopia note.** This file is the *external / bring-your-own-Google*
> setup guide, kept here as the reference for the public kit. Inside this repo the
> Google Cloud setup in §2 is already done and the credential filenames differ —
> `~/.google-credentials/utopia-sa.json`, `utopia-user-oauth.json`,
> `utopia-oauth-client.json`, `utopia-ads-token.txt`. Skip §2 and §3; go to §4.
> Internal per-site runbook: `SKILL.md` + `MANUAL-STEPS.md`.

## 1. Install

```bash
npm install                      # googleapis + google-ads-api + playwright
npx playwright install chromium  # the browser Phase 6 drives
```

Node 18+. No global installs.

## 2. One-time Google Cloud setup (do once, forever)

1. Create a **Google Cloud project** (any name, e.g. `my-automation`).
2. Enable these APIs: **Analytics Admin**, **Tag Manager**, **Search Console**,
   **Indexing**, **Site Verification** (+ **Google Ads** for Phase 5).
3. Create a **service account**, download its JSON key → `~/.google-credentials/service-account.json`.
4. Add the service account to your **GA4 account** (Administrator) and **GTM account** (Administrator + Publish).
5. Create an **OAuth client** (`~/.google-credentials/oauth-client.json`) and run
   `node oauth-login.mjs` once → mints `~/.google-credentials/user-oauth.json`.
6. **For Phase 6:** run `node finalize-manual-toggles.mjs --login` once — it opens
   Chrome, you log in by hand (password + 2FA), and the session is persisted to
   `~/.google-credentials/pw-google-profile` and reused for every site.

Credentials live in `~/.google-credentials/` — **outside** this folder — so nothing
secret ever ships in this kit.

## 3. Set the placeholders to your own values

`grep -ril "example.com" .` plus a search for `your-` / `YOUR_` finds them all:

| Placeholder | What it is | Where |
|---|---|---|
| `~/.google-credentials/service-account.json` | your GA4 + GTM service-account key | `lib/auth.mjs` |
| `~/.google-credentials/user-oauth.json` + `oauth-client.json` | your OAuth token + client | `lib/auth.mjs`, `oauth-login.mjs`, `ads-import-conversion.mjs`, `finalize-manual-toggles.mjs` |
| `you@example.com` / `your-google-account` | the Google account that signs in / owns the GTM container | `oauth-login.mjs`, `gtm-setup.mjs`, `finalize-manual-toggles.mjs`, `lib/pw.mjs` |
| `your-vercel-scope` | your Vercel team scope | `gsc-add-domain-property.mjs` (or pass `--vercel-scope`) |
| `YOUR_ADS_MCC_ID` | your Ads manager id — or always use `--no-mcc` | `ads-import-conversion.mjs` |
| `YOUR_ADS_CUSTOMER_ID` | your Ads customer id (pass via `--customer-id`) | `ads-import-conversion.mjs`, `finalize-manual-toggles.mjs` |

## 4. Run it (per site — the 6-phase sequence)

Run AFTER the site's paid domain is connected to your host + DNS points there.

```bash
node gsc-add-domain-property.mjs --domain <domain> --sitemap https://www.<domain>/sitemap.xml   # 1
node ga4-create.mjs --domain <domain>                                                            # 2 → writes configs/<domain>.json
node gtm-setup.mjs --domain <domain> --ga4-id G-XXXX                                             # 3
node inject-gtm-snippet.mjs --container GTM-XXXX --site <site-dir>                               # 3 → DEPLOY after
node gsc-submit.mjs --domain <domain> --url https://www.<domain>/ --site <dir> --init           # 4 → DEPLOY → --finalize
node ads-import-conversion.mjs --no-mcc --customer-id <ads-id> --domain <domain> --ga4-property-id <id> --event whatsapp_click  # 5
node finalize-manual-toggles.mjs --domain <domain>                                              # 6 → automates the 4 toggles
```

## 5. Phase 6 — the toggles Google won't expose

`finalize-manual-toggles.mjs` reads `configs/<domain>.json` (written by Phases 2 + 5)
and flips: GA4 **Signals** ON, GA4 **User-provided data** ON, Ads counting
**Every → One**, Ads **"Import app and web metrics"** ON. It tries the GA4 API first,
falls back to Playwright, and is Playwright-only for the two Ads toggles. Idempotent —
reads state first, skips what's already set, verifies via API where possible. A browser
window opens and drives itself; screenshot proofs land in `_screenshots/<domain>/`. If
it says "session expired", re-run `node finalize-manual-toggles.mjs --login`.

---

The conversion event is `whatsapp_click` — rename it for your own funnel in
`gtm-setup.mjs` + `ads-import-conversion.mjs --event <name>`.
