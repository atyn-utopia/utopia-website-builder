-- ============================================================
-- Encik Beku — serviceaircond.my
-- Row Level Security (RLS) Policies
-- Cyclops — Database Engineer
-- Date: 2026-04-01
-- ============================================================

-- Enable RLS on the table
alter table public.phone_numbers enable row level security;

-- ─────────────────────────────────────────────────────────────
-- PUBLIC READ — anyone (anon key) can SELECT active numbers
-- ─────────────────────────────────────────────────────────────

create policy "Public can read active phone numbers"
  on public.phone_numbers
  for select
  to anon, authenticated
  using (is_active = true);


-- ─────────────────────────────────────────────────────────────
-- SERVICE ROLE WRITE — only the service role can mutate rows.
-- The service role bypasses RLS by default in Supabase, so
-- no explicit INSERT/UPDATE/DELETE policy is required.
-- The policies below are defensive extras — they block any
-- accidental anon/authenticated writes.
-- ─────────────────────────────────────────────────────────────

create policy "Deny anon insert"
  on public.phone_numbers
  for insert
  to anon
  with check (false);

create policy "Deny anon update"
  on public.phone_numbers
  for update
  to anon
  using (false);

create policy "Deny anon delete"
  on public.phone_numbers
  for delete
  to anon
  using (false);

create policy "Deny authenticated insert"
  on public.phone_numbers
  for insert
  to authenticated
  with check (false);

create policy "Deny authenticated update"
  on public.phone_numbers
  for update
  to authenticated
  using (false);

create policy "Deny authenticated delete"
  on public.phone_numbers
  for delete
  to authenticated
  using (false);

-- ─────────────────────────────────────────────────────────────
-- ADMIN OVERRIDE HINT
-- Use SUPABASE_SERVICE_ROLE_KEY (server-side only, never in
-- browser bundles) to perform admin mutations. That key
-- bypasses RLS entirely — keep it in .env.local and never
-- expose it client-side.
-- ─────────────────────────────────────────────────────────────
