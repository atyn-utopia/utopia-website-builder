-- Utopia Wizard — per-user checklist rules derived from a repo's CLAUDE.md
-- ----------------------------------------------------------------------------
-- Safe to re-run. MUST live in `webcore` (schema-qualified below).
-- If you previously created this in `public`, run:
--   alter table public.user_checklists set schema webcore;
--   notify pgrst, 'reload schema';
--
-- One checklist per teammate. The wizard reads the chosen repo's CLAUDE.md (+
-- referenced files), and OpenAI extracts a structured set of check items. These
-- become that user's checklist (Phase 2 evaluates repos against them).

create extension if not exists "pgcrypto";
create schema if not exists webcore;

create table if not exists webcore.user_checklists (
  github_login    text primary key,        -- owner
  repo_full_name  text not null,            -- "owner/name" the rules came from
  source_path     text not null,            -- e.g. "CLAUDE.md"
  -- [{ id, group, name, description, severity }]
  items           jsonb not null,
  generated_at    timestamptz not null default now()
);

create index if not exists user_checklists_login_idx on webcore.user_checklists (github_login);

-- Server-side access via service-role; team visibility enforced in-app. No anon.
alter table webcore.user_checklists enable row level security;
