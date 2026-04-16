-- ============================================================
-- Encik Beku — serviceaircond.my
-- Database Schema
-- Cyclops — Database Engineer
-- Date: 2026-04-01
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. phone_numbers table
-- ─────────────────────────────────────────────────────────────

create table if not exists public.phone_numbers (
  id           uuid primary key default gen_random_uuid(),
  website      text        not null,            -- 'serviceaircond.my'
  product_slug text        not null,            -- 'service-aircond'
  location_slug text       not null,            -- e.g. 'kuala-lumpur' | 'all'
  phone_number text        not null,            -- E.164, e.g. '+60123456789'
  label        text,                            -- optional, e.g. 'KL Team 1'
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),

  -- prevent exact duplicates on the same number for a slot
  constraint phone_numbers_unique_slot unique (website, product_slug, location_slug, phone_number)
);

comment on table  public.phone_numbers                  is 'WhatsApp phone numbers for all Utopia websites, scoped by website + product + location.';
comment on column public.phone_numbers.website          is 'Domain of the website, e.g. serviceaircond.my';
comment on column public.phone_numbers.product_slug     is 'Product/service slug, e.g. service-aircond';
comment on column public.phone_numbers.location_slug    is 'City slug, e.g. kuala-lumpur. Use ''all'' for a site-wide fallback pool.';
comment on column public.phone_numbers.phone_number     is 'E.164 format without leading +, e.g. 60123456789';
comment on column public.phone_numbers.label            is 'Human-readable label for admin use, e.g. KL Team 1';
comment on column public.phone_numbers.is_active        is 'Set false to soft-delete a number without removing it from history.';


-- ─────────────────────────────────────────────────────────────
-- 2. Composite index for runtime query performance
--    Covers the exact WHERE clause used in getPhoneNumber.ts
-- ─────────────────────────────────────────────────────────────

create index if not exists idx_phone_numbers_lookup
  on public.phone_numbers (website, product_slug, location_slug, is_active);
