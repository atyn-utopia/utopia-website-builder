-- Utopia Wizard — per-user connected repos (one project per repo)
-- ----------------------------------------------------------------------------
-- Safe to re-run. MUST live in the `webcore` schema — objects are
-- schema-qualified so they land there regardless of the editor's active schema.
-- If you previously created this in `public`, run instead:
--   alter table public.user_repos set schema webcore;
--   notify pgrst, 'reload schema';
--
-- Each row = one GitHub repo a teammate has connected as a Utopia project.
-- Phase B's scanner clones each active repo (with the user's token) and writes
-- a snapshot keyed by project_slug; the wizard already reads snapshots.

create extension if not exists "pgcrypto";
create schema if not exists webcore;

create table if not exists webcore.user_repos (
  id              uuid primary key default gen_random_uuid(),
  github_login    text not null,
  repo_full_name  text not null,            -- "owner/name"
  repo_id         bigint,                   -- GitHub numeric id (stable across renames)
  default_branch  text not null default 'main',
  -- Slug the project is tracked under (drives project_owners + snapshots).
  -- Defaults to the repo name; editable when connecting.
  project_slug    text not null,
  html_url        text,
  is_active       boolean not null default true,
  connected_at    timestamptz not null default now(),
  unique (github_login, repo_full_name)
);

create index if not exists user_repos_login_idx on webcore.user_repos (github_login);
create index if not exists user_repos_slug_idx  on webcore.user_repos (project_slug);

-- All access is server-side via the service-role key (the wizard scopes by the
-- signed-in identity in the route handler). No anon policy → anon sees nothing.
alter table webcore.user_repos enable row level security;
