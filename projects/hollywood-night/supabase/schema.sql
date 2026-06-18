-- Hollywood Night RSVP — Supabase schema
-- Lives in the SHARED Supabase DB (mazdcaibvhyqglfctdul) alongside `webcore`.
-- Run this whole file in that project's SQL editor. Safe to re-run; uses
-- IF NOT EXISTS throughout. The final block exposes `hollywood` to PostgREST so
-- the REST API can read it — without it queries return PGRST106 "Invalid schema".

create schema if not exists hollywood;
create extension if not exists "pgcrypto";

create table if not exists hollywood.guests (
  id              uuid primary key default gen_random_uuid(),
  guest_id        text unique not null,
  name            text not null,
  phone           text not null,
  email           text not null,
  company_name    text not null default '',
  attending       boolean not null default true,
  has_plus_one    boolean not null default false,
  plus_one_name   text,
  plus_one_phone  text,
  transportation_required boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Migration for existing tables: add company_name if missing.
alter table hollywood.guests
  add column if not exists company_name text not null default '';

create index if not exists guests_phone_idx on hollywood.guests (phone);
create index if not exists guests_email_idx on hollywood.guests (email);

create table if not exists hollywood.tickets (
  id              uuid primary key default gen_random_uuid(),
  ticket_id       text unique not null,
  guest_row_id    uuid not null references hollywood.guests(id) on delete cascade,
  holder_name     text not null,
  kind            text not null check (kind in ('main','plus_one')),
  checked_in      boolean not null default false,
  checked_in_at   timestamptz,
  lucky_number    integer,
  drawn_at        timestamptz,
  created_at      timestamptz not null default now()
);

alter table hollywood.tickets
  add column if not exists lucky_number integer,
  add column if not exists drawn_at timestamptz;

create index if not exists tickets_guest_row_idx on hollywood.tickets (guest_row_id);
create index if not exists tickets_checked_in_idx on hollywood.tickets (checked_in);
create unique index if not exists tickets_lucky_number_uniq
  on hollywood.tickets (lucky_number)
  where lucky_number is not null;

alter table hollywood.guests  enable row level security;
alter table hollywood.tickets enable row level security;

grant usage on schema hollywood to service_role;
grant all on all tables in schema hollywood to service_role;
grant all on all sequences in schema hollywood to service_role;
alter default privileges in schema hollywood
  grant all on tables to service_role;
alter default privileges in schema hollywood
  grant all on sequences to service_role;

-- ── Expose `hollywood` to PostgREST (the REST API) ──────────────────────────
-- The shared DB currently exposes: public, graphql_public, webcore.
-- This line is ADDITIVE — it keeps those and adds hollywood. Do NOT drop the
-- others or you'll disconnect webcore (every live SEO site + the Fairy monitor).
-- Equivalent to Dashboard → Settings → API → Exposed schemas → add "hollywood".
alter role authenticator set pgrst.db_schemas = 'public, graphql_public, webcore, hollywood';
notify pgrst, 'reload config';
