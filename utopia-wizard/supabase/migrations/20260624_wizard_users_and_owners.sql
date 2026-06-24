-- Utopia Wizard — per-user identity + project ownership
-- ----------------------------------------------------------------------------
-- Foundation for multi-user mode (internal team). Safe to re-run.
--
-- IMPORTANT: these tables MUST live in the `webcore` schema (same as
-- monitor_snapshots) — the wizard reads them via PostgREST's webcore profile.
-- Every object below is schema-qualified so it lands in webcore regardless of
-- the SQL editor's active schema. If you previously created them in `public`,
-- run instead:
--   alter table public.wizard_users   set schema webcore;
--   alter table public.project_owners set schema webcore;
--   notify pgrst, 'reload schema';
--
--   wizard_users   — one row per teammate who signs in via GitHub OAuth. The
--                    encrypted GitHub token lets the wizard run git ops as
--                    that user. `is_admin` flags who may see all projects.
--   project_owners — maps a project slug to the GitHub login that owns it.
--                    Drives the per-user checklist filter. Reassignable from
--                    the wizard UI.

create extension if not exists "pgcrypto";
create schema if not exists webcore;

-- ── wizard_users ────────────────────────────────────────────────────────────
create table if not exists webcore.wizard_users (
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
create table if not exists webcore.project_owners (
  slug          text primary key,
  github_login  text not null,
  -- Who set this mapping (creator, or an admin reassigning). Audit only.
  assigned_by   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists project_owners_login_idx
  on webcore.project_owners (github_login);

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- The wizard reads/writes these through the service-role key from server-side
-- routes (never the browser), so RLS stays restrictive: anon gets nothing.
-- project_owners is readable by anon/authenticated so the deployed (snapshot)
-- monitor can still scope the list; tokens in wizard_users stay service-only.
alter table webcore.wizard_users   enable row level security;
alter table webcore.project_owners enable row level security;

drop policy if exists "project_owners anon read" on webcore.project_owners;
create policy "project_owners anon read"
  on webcore.project_owners
  for select
  to anon, authenticated
  using (true);

-- wizard_users: no anon/authenticated policy → only service_role (which
-- bypasses RLS) can touch it. Keeps encrypted tokens off the public key.
