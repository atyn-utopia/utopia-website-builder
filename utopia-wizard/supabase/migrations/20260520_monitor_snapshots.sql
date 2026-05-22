-- Utopia Fairy — monitor snapshots
-- ----------------------------------------------------------------------------
-- One row per project. The scanner (utopia-wizard/scripts/scan.ts, run from
-- GitHub Actions) upserts the row each hour. The deployed monitor reads from
-- this table via the anon key.
--
-- Run this once in the Supabase SQL Editor before deploying the monitor.

create extension if not exists "pgcrypto";

create table if not exists monitor_snapshots (
  slug            text primary key,
  ran_at          timestamptz not null default now(),

  -- Top-line scoring
  total           int  not null,
  passed          int  not null,
  failed_count    int  not null,

  -- Project metadata (parsed from config/site.ts)
  domain          text,
  product_slug    text,
  fallback_phone  text,
  deploy_url      text,
  domain_candidates text[] not null default '{}',

  -- Full payloads (kept as jsonb so the schema doesn't change every time we
  -- add a check item). The deployed monitor reads these directly.
  groups          jsonb not null,  -- ChecklistRun.groups
  registered      jsonb,           -- company_websites rows
  phones          jsonb,           -- phone_numbers rows
  products        jsonb,           -- products + product_photos rows
  blogs           jsonb,           -- blog_posts + blog_translations summary
  hardcoded       jsonb,           -- source-file phone hits
  blog_hardcoded  jsonb,           -- blog-content phone hits
  live_status     jsonb            -- live DB connectivity probe result
);

create index if not exists monitor_snapshots_ran_at_idx
  on monitor_snapshots (ran_at desc);

-- Row Level Security: anon can read (deployed viewer), only service_role can
-- write (CI scanner). Service role bypasses RLS by default.
alter table monitor_snapshots enable row level security;

drop policy if exists "monitor_snapshots anon read" on monitor_snapshots;
create policy "monitor_snapshots anon read"
  on monitor_snapshots
  for select
  to anon, authenticated
  using (true);
