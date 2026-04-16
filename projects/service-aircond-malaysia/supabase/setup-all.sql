-- ============================================================
-- Encik Beku — serviceaircond.my
-- FULL DATABASE SETUP (schema + RLS + seed)
-- Run this once in Supabase SQL Editor
-- ============================================================


-- ═══════════════════════════════════════════════════════════
-- 1. SCHEMA
-- ═══════════════════════════════════════════════════════════

create table if not exists public.phone_numbers (
  id           uuid primary key default gen_random_uuid(),
  website      text        not null,
  product_slug text        not null,
  location_slug text       not null,
  phone_number text        not null,
  label        text,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),

  constraint phone_numbers_unique_slot unique (website, product_slug, location_slug, phone_number)
);

comment on table  public.phone_numbers                  is 'WhatsApp phone numbers for all Utopia websites, scoped by website + product + location.';
comment on column public.phone_numbers.website          is 'Domain of the website, e.g. serviceaircond.my';
comment on column public.phone_numbers.product_slug     is 'Product/service slug, e.g. service-aircond';
comment on column public.phone_numbers.location_slug    is 'City slug, e.g. kuala-lumpur. Use ''all'' for a site-wide fallback pool.';
comment on column public.phone_numbers.phone_number     is 'E.164 format without leading +, e.g. 60123456789';
comment on column public.phone_numbers.label            is 'Human-readable label for admin use, e.g. KL Team 1';
comment on column public.phone_numbers.is_active        is 'Set false to soft-delete a number without removing it from history.';

create index if not exists idx_phone_numbers_lookup
  on public.phone_numbers (website, product_slug, location_slug, is_active);


-- ═══════════════════════════════════════════════════════════
-- 2. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

alter table public.phone_numbers enable row level security;

-- Public read — anon key can only SELECT active numbers
create policy "Public can read active phone numbers"
  on public.phone_numbers
  for select
  to anon, authenticated
  using (is_active = true);

-- Block all writes from anon/authenticated (service role bypasses RLS)
create policy "Deny anon insert"
  on public.phone_numbers for insert to anon with check (false);

create policy "Deny anon update"
  on public.phone_numbers for update to anon using (false);

create policy "Deny anon delete"
  on public.phone_numbers for delete to anon using (false);

create policy "Deny authenticated insert"
  on public.phone_numbers for insert to authenticated with check (false);

create policy "Deny authenticated update"
  on public.phone_numbers for update to authenticated using (false);

create policy "Deny authenticated delete"
  on public.phone_numbers for delete to authenticated using (false);


-- ═══════════════════════════════════════════════════════════
-- 3. SEED DATA (placeholder numbers — replace with real ones)
-- ═══════════════════════════════════════════════════════════

insert into public.phone_numbers
  (website, product_slug, location_slug, phone_number, label, is_active)
values

  -- Klang Valley
  ('serviceaircond.my', 'service-aircond', 'kuala-lumpur',     '60123456701', 'KL Team 1',           true),
  ('serviceaircond.my', 'service-aircond', 'kuala-lumpur',     '60123456702', 'KL Team 2',           true),
  ('serviceaircond.my', 'service-aircond', 'petaling-jaya',    '60123456703', 'PJ Team 1',           true),
  ('serviceaircond.my', 'service-aircond', 'shah-alam',        '60123456704', 'Shah Alam Team 1',    true),
  ('serviceaircond.my', 'service-aircond', 'subang-jaya',      '60123456705', 'Subang Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'cheras',           '60123456706', 'Cheras Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'ampang',           '60123456707', 'Ampang Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'puchong',          '60123456708', 'Puchong Team 1',      true),
  ('serviceaircond.my', 'service-aircond', 'bangsar',          '60123456709', 'Bangsar Team 1',      true),
  ('serviceaircond.my', 'service-aircond', 'damansara',        '60123456710', 'Damansara Team 1',    true),
  ('serviceaircond.my', 'service-aircond', 'cyberjaya',        '60123456711', 'Cyberjaya Team 1',    true),
  ('serviceaircond.my', 'service-aircond', 'putrajaya',        '60123456712', 'Putrajaya Team 1',    true),
  ('serviceaircond.my', 'service-aircond', 'kajang',           '60123456713', 'Kajang Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'bangi',            '60123456714', 'Bangi Team 1',        true),
  ('serviceaircond.my', 'service-aircond', 'rawang',           '60123456715', 'Rawang Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'klang',            '60123456716', 'Klang Team 1',        true),
  ('serviceaircond.my', 'service-aircond', 'setia-alam',       '60123456717', 'Setia Alam Team 1',   true),
  ('serviceaircond.my', 'service-aircond', 'kepong',           '60123456718', 'Kepong Team 1',       true),

  -- Northern
  ('serviceaircond.my', 'service-aircond', 'penang',           '60123456719', 'Penang Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'penang',           '60123456720', 'Penang Team 2',       true),
  ('serviceaircond.my', 'service-aircond', 'ipoh',             '60123456721', 'Ipoh Team 1',         true),
  ('serviceaircond.my', 'service-aircond', 'alor-setar',       '60123456722', 'Alor Setar Team 1',   true),
  ('serviceaircond.my', 'service-aircond', 'sungai-petani',    '60123456723', 'Sg Petani Team 1',    true),
  ('serviceaircond.my', 'service-aircond', 'taiping',          '60123456724', 'Taiping Team 1',      true),

  -- Southern
  ('serviceaircond.my', 'service-aircond', 'johor-bahru',      '60123456725', 'JB Team 1',           true),
  ('serviceaircond.my', 'service-aircond', 'johor-bahru',      '60123456726', 'JB Team 2',           true),
  ('serviceaircond.my', 'service-aircond', 'melaka',           '60123456727', 'Melaka Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'batu-pahat',       '60123456728', 'Batu Pahat Team 1',   true),
  ('serviceaircond.my', 'service-aircond', 'muar',             '60123456729', 'Muar Team 1',         true),
  ('serviceaircond.my', 'service-aircond', 'kluang',           '60123456730', 'Kluang Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'skudai',           '60123456731', 'Skudai Team 1',       true),
  ('serviceaircond.my', 'service-aircond', 'iskandar-puteri',  '60123456732', 'Iskandar Puteri T1',  true),

  -- East Coast
  ('serviceaircond.my', 'service-aircond', 'kuantan',          '60123456733', 'Kuantan Team 1',      true),
  ('serviceaircond.my', 'service-aircond', 'kota-bharu',       '60123456734', 'Kota Bharu Team 1',   true),
  ('serviceaircond.my', 'service-aircond', 'kuala-terengganu', '60123456735', 'KT Team 1',           true),
  ('serviceaircond.my', 'service-aircond', 'temerloh',         '60123456736', 'Temerloh Team 1',     true),

  -- East Malaysia
  ('serviceaircond.my', 'service-aircond', 'kota-kinabalu',    '60123456737', 'KK Team 1',           true),
  ('serviceaircond.my', 'service-aircond', 'kuching',          '60123456738', 'Kuching Team 1',      true),
  ('serviceaircond.my', 'service-aircond', 'miri',             '60123456739', 'Miri Team 1',         true),
  ('serviceaircond.my', 'service-aircond', 'sandakan',         '60123456740', 'Sandakan Team 1',     true),
  ('serviceaircond.my', 'service-aircond', 'sibu',             '60123456741', 'Sibu Team 1',         true),

  -- Site-wide fallback pool
  ('serviceaircond.my', 'service-aircond', 'all',              '60123456799', 'National Hotline 1',  true),
  ('serviceaircond.my', 'service-aircond', 'all',              '60123456800', 'National Hotline 2',  true)

on conflict (website, product_slug, location_slug, phone_number) do nothing;
