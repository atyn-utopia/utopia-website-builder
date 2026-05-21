-- Utopia Wizard — add project creation timestamp + company name to snapshots
-- ----------------------------------------------------------------------------
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
--   project_created_at — when the inputs.md was first written for this slug
--                        (so the monitor can show "Created" without an extra
--                        Supabase round-trip per row)
--   company_name       — denormalised from company_websites → companies(name)

alter table monitor_snapshots
  add column if not exists project_created_at timestamptz,
  add column if not exists company_name text;
