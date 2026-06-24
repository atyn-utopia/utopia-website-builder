-- Utopia Wizard — per-user identity + project ownership
-- ----------------------------------------------------------------------------
-- Foundation for multi-user mode (internal team). Run once in the Supabase SQL
-- Editor with `webcore` as the active schema (same as monitor_snapshots). Safe
-- to re-run.
--
--   wizard_users   — one row per teammate who signs in via GitHub OAuth. The
--                    encrypted GitHub token lets the wizard run git ops as
--                    that user. `is_admin` flags who may see all projects.
--   project_owners — maps a project slug to the GitHub login that owns it.
--                    Drives the per-user checklist filter. Reassignable from
--                    the wizard UI.

create extension if not exists "pgcrypto";

-- ── wizard_users ────────────────────────────────────────────────────────────
create table if not exists wizard_users (
  github_login            text primary key,
  name                    text,
  avatar_url              text,
  -- AES-GCM ciphertext of the user's GitHub OAuth token (see lib/cryptoToken.ts).
  -- Null until the user completes OAuth (step 5). Never expose to the anon key.
  github_token_encrypted  text,
  is_admin                boolean not null default false,
  created_at              timestamptz not null default now(),
  last_login_at           timestamptz
);

-- ── project_owners ──────────────────────────────────────────────────────────
create table if not exists project_owners (
  slug          text primary key,
  github_login  text not null,
  -- Who set this mapping (creator, or an admin reassigning). Audit only.
  assigned_by   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists project_owners_login_idx
  on project_owners (github_login);

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- The wizard reads/writes these through the service-role key from server-side
-- routes (never the browser), so RLS stays restrictive: anon gets nothing.
-- project_owners is readable by anon/authenticated so the deployed (snapshot)
-- monitor can still scope the list; tokens in wizard_users stay service-only.
alter table wizard_users   enable row level security;
alter table project_owners enable row level security;

drop policy if exists "project_owners anon read" on project_owners;
create policy "project_owners anon read"
  on project_owners
  for select
  to anon, authenticated
  using (true);

-- wizard_users: no anon/authenticated policy → only service_role (which
-- bypasses RLS) can touch it. Keeps encrypted tokens off the public key.
