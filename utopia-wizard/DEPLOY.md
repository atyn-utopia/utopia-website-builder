# Deploying Utopia Fairy as a hosted monitor

The monitor has two modes:

| Mode | When | Data source |
|---|---|---|
| **live** | Local dev (`npm run dev` inside this folder) | Runs all 35 checks on-demand against the local `projects/` folder + Supabase + live websites |
| **snapshot** | Deployed (Vercel) | Reads pre-computed results from the `monitor_snapshots` table |

The CI scanner (`.github/workflows/monitor-scan.yml`) writes snapshots hourly. The deployed monitor reads them — it has no filesystem access to `projects/`.

---

## One-time setup

### 1. Create the snapshot table

Run [supabase/migrations/20260520_monitor_snapshots.sql](supabase/migrations/20260520_monitor_snapshots.sql) in the Supabase SQL Editor.

Verify it worked:

```sql
select count(*) from monitor_snapshots;  -- → 0
```

### 2. Seed the first snapshot (optional — proves the local scanner works)

From the repo root:

```bash
cd utopia-wizard
npm install   # picks up tsx
npm run scan
```

Expected output (each line ≈ 4–5 s):

```
scan: 16 project(s) under .../projects
  ✓ coldroom-malaysia                    35/35 · live=connected · 4938ms
  ✓ electric-wheelchair-malaysia         34/35 · live=connected · 5102ms
  ...
scan: done · 16 ok · 0 failed
```

Confirm the rows are there:

```bash
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/monitor_snapshots?select=slug,passed,total,ran_at" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

### 3. Preview deployed mode locally

```bash
UTOPIA_FAIRY_USE_SNAPSHOTS=1 npm run dev
```

The monitor now reads from `monitor_snapshots` instead of the local filesystem. It should look identical to the live mode, but with a `ran_at` timestamp at the top.

---

## CI: hourly snapshot job

The workflow lives at [.github/workflows/monitor-scan.yml](../.github/workflows/monitor-scan.yml). It runs:

- Every hour (minute 7)
- On every push to `main` that touches `projects/**` or `utopia-wizard/**`
- Manually via the Actions tab → workflow_dispatch

**Add these repository secrets** (Settings → Secrets and variables → Actions → New repository secret):

| Secret | Value |
|---|---|
| `SUPABASE_URL` | Same as `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` |
| `SUPABASE_ANON_KEY` | Same as `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | The service role key (write permission) |

Trigger one run manually to verify the workflow works before relying on the cron.

---

## Vercel deployment

### Create the project

From the repo root:

```bash
cd utopia-wizard
vercel link
```

Or in the Vercel dashboard:

1. Import the `utopia-website-builder` GitHub repo
2. **Root directory** → `utopia-wizard`
3. Framework preset: Next.js

### Environment variables (Vercel project settings)

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | from `.env.local` | Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from `.env.local` | Required |
| `UTOPIA_FAIRY_USE_SNAPSHOTS` | `1` | Forces snapshot mode — otherwise it auto-detects but explicit is safer |

**Do NOT** set `SUPABASE_SERVICE_ROLE_KEY` on Vercel. The deployed app should only ever read; writes happen exclusively from the CI scanner.

### Password-protect the deployment

In Vercel: Project Settings → Deployment Protection → Password Protection → enable, set a password, save.

This locks every preview and production URL behind a single shared password (Pro plan).

### Deploy

```bash
vercel --prod
```

The first deployment may show "0 projects" until the scanner has populated the table. Trigger the GitHub Actions workflow once via `workflow_dispatch` to seed it.

---

## What's in a snapshot

Each row in `monitor_snapshots`:

```
slug                — primary key (project folder name)
ran_at              — when the scan ran
total, passed,
  failed_count      — top-line score
domain,
  product_slug,
  fallback_phone,
  deploy_url        — parsed from config/site.ts + .vercel/
domain_candidates   — every alias considered (slug, alias, custom domain, ...)
groups              — full checklist groups[] with per-item status & detail
registered          — company_websites rows matched
phones              — phone_numbers rows for this site
products            — products + product_photos
blogs               — blog_posts + locale list
hardcoded           — file-scan phone hits
blog_hardcoded      — blog-content phone hits
live_status         — { status, livePhone, dbPhones, fallbackPhone, detail }
```

Removing a project folder removes its snapshot on the next scan (the scanner prunes rows whose slug no longer exists).

---

## Updating

When you add a new checklist item to `lib/checklist.ts`, the snapshot's `total` column will reflect it immediately on the next scan — no migration needed. The jsonb columns absorb new fields without schema changes.

If you change the schema in a backwards-incompatible way (rare), drop and re-create the table:

```sql
drop table monitor_snapshots;
-- then re-run the migration
```
