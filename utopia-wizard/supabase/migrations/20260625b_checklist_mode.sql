-- Utopia Wizard — per-user active checklist preference
-- ----------------------------------------------------------------------------
-- Run in the `webcore` schema. Safe to re-run.
--
-- checklist_mode controls which checklist a user's projects are scored against:
--   'default'   → the built-in Utopia checklist (lib/checklist.ts)  [default]
--   'generated' → the user's AI-derived checklist (user_checklists)

alter table webcore.wizard_users
  add column if not exists checklist_mode text not null default 'default';

notify pgrst, 'reload schema';
