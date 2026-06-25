-- Utopia Wizard — per-user playbooks generated from a repo's markdown
-- ----------------------------------------------------------------------------
-- Safe to re-run. MUST live in the `webcore` schema (schema-qualified below).
-- If you previously created this in `public`, run:
--   alter table public.user_playbooks set schema webcore;
--   notify pgrst, 'reload schema';
--
-- One playbook per teammate. The wizard reads the chosen repo's CLAUDE.md
-- (with the owner's token), stores the raw markdown + metadata, and renders a
-- parsed outline. Any signed-in teammate can view any playbook (team-visible);
-- only the owner can (re)generate their own.

create extension if not exists "pgcrypto";
create schema if not exists webcore;

create table if not exists webcore.user_playbooks (
  github_login    text primary key,        -- owner
  repo_full_name  text not null,            -- "owner/name" the md came from
  source_path     text not null,            -- e.g. "CLAUDE.md"
  title           text,                     -- first H1, or repo name
  content         text,                     -- raw CLAUDE.md (reference)
  -- Assembled playbook: layers/units/owners/doc-links built from CLAUDE.md +
  -- its referenced files (agents/, docs/, prompts/, workflows/).
  structure       jsonb,
  generated_at    timestamptz not null default now()
);

-- If the table predates this column, add it.
alter table webcore.user_playbooks add column if not exists structure jsonb;
alter table webcore.user_playbooks alter column content drop not null;

create index if not exists user_playbooks_login_idx on webcore.user_playbooks (github_login);

-- Server-side access via service-role; team visibility is enforced in-app
-- (any signed-in user may GET the list). No anon policy.
alter table webcore.user_playbooks enable row level security;
