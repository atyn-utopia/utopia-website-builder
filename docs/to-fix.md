# To fix

Running list of known problems across the fleet and the wizard infrastructure.
Fleet items come from the wizard's `single-main-domain` and
`db-single-default-phone` checks; re-generate them any time with a rescan (or
`npx tsx scripts/local-check.ts <slug>` from `projects/utopia-wizard`).

Last swept: 2026-08-14 · 32 projects · wizard @ 4283026.

---

## Infrastructure

### 1. The scanner runs a stale copy of the wizard — BLOCKING everything below
`monitor-scan.yml` and `guardrails-gate.yml` both run the vendored copy at
`utopia-website-builder/utopia-wizard/`, which is 30 files behind
`atyn-utopia/utopia-wizard` (no `lib/domainReport.ts`, no `lib/phoneDefaults.ts`,
no `single-main-domain` / `db-single-default-phone` checks). Live snapshots say
`total: 106`; the current code emits `108`.

Until this is fixed the Domain card stays empty, the two new checks never
appear, and the PR gate grades against the old engine.

**Decision needed:** check the wizard repo out into `utopia-wizard/` with a
read-only deploy key (recommended — one source of truth, no other workflow line
changes), or keep mirroring the files by hand.

### 2. `websitebuilder.utopiaai.my` is not attached to its project
Removed from the wizard project on 2026-08-14 (it had been aliased there since
June and was serving a stale wizard build). It is now unassigned. The project
`utopia-website-builder` (`prj_u0Xs…`) still answers only on
`utopia-website-builder.utopiaai.my`.

**Fix:** `vercel domains add websitebuilder.utopiaai.my utopia-website-builder`
— as a project domain, not an alias, so it follows every production deploy.

### 3. Dead aliases from the old project name
`utopia-fairy-monitor-prod.utopiaai.my` and
`utopia-fairy-monitor-chokchokchok.utopiaai.my` still point at a 2026-05-22
deployment of the renamed project. Nothing depends on them; they will not
regenerate once removed.

---

## Domains

### `hisense-aircond` — two `company_websites` rows *(blocking)*
Registered as **both** `hisenseaircond.my` and `hisense-aircond.vercel.app`
(same company `16e62068`), and the phone number `60189294628` is duplicated
under each. Vercel serves both hosts, so which row the live site reads depends
on the host the visitor landed on.

**Fix:** keep the `hisenseaircond.my` row, delete the `.vercel.app` one in the
webcore admin. Renaming cascades data rows automatically
(`20260610_domain_rename_cascade`) — rename, never re-seed.

### `waterproofing-my` — the paid domain isn't connected *(blocking)*
`config/site.ts` says `waterproofing.my`, but Vercel serves only the
auto-aliases (`waterproofing-my.utopiaai.my`, `waterproofing-my.vercel.app`).
The site has no `company_websites` row and no `siteId` either.

**Fix:** add `waterproofing.my` in Vercel → Settings → Domains and point the
registrar's DNS at it, then register the site in webcore and pin the returned
id as `siteId`.

### `katering-auntyrokiah` — not registered in webcore
Main domain resolves to the platform alias
`auntyrokiah-katering.utopiaai.my`; there is no `company_websites` row and no
`siteId` in `config/site.ts`.

**Fix:** register it in the webcore admin, pin `siteId`, then seed its phone
number (see below).

### `skylift-rental` — `deploy-url.txt` points at the wrong host
Says `skylift-rental.vercel.app`; the main domain is `skylift-rental.my`.
Every "is it live" probe describes the alias instead of the real site.

**Fix:** `deploy-url.txt` → `https://skylift-rental.my`.

### `sewa-excavator` — no `siteId` pinned
`config/site.ts` has no `siteId`, so a domain rename in the webcore admin would
silently disconnect the repo from its data.

**Fix:** add `siteId: '<company_websites.id>'` to `config/site.ts`.

---

## Phone numbers

Rule: one website, exactly one row with `label`/`type` = `default`. Extra agents
are `type='custom'`. A second active default is silent — in `single` leads mode
the redirect returns whichever row sorts first, so leads split between two
WhatsApp accounts with nothing on the site looking broken.

### `katering-auntyrokiah` — no active phone number *(blocking)*
No `phone_numbers` row at all, so every WhatsApp CTA falls back to the
hardcoded `fallbackPhone` and no lead is attributed.

**Fix:** seed one default row for the site's registered domain:

```sql
INSERT INTO phone_numbers (website, location_slug, phone_number, label, type, is_active, whatsapp_text, percentage)
VALUES ('<registered-domain>', 'all', '60XXXXXXXXX', 'default', 'default', true, 'Hi, saya berminat…', 100);
```

### `waterproofing-my` — no active phone number *(blocking)*
Same as above. Blocked behind registering the site first — the `website` column
has to match the registered domain or the row is orphaned.

### No duplicate defaults anywhere
All 32 projects carry exactly one active default per website. `hisense-aircond`
looks like two only because it is registered twice; fixing the domain row fixes
the phone row with it.
