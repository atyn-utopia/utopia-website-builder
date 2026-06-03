# Encik Beku — serviceaircond.my
## Database Design
**Agent:** Cyclops — Database Engineer
**Date:** 2026-04-01
**Project:** Aircond Service & Installation (Encik Beku)
**Domain:** serviceaircond.my

---

## Overview

The database lives in a shared Supabase instance used by all Utopia websites. Every row is scoped by `website`, so multiple sites coexist in the same `phone_numbers` table without conflict.

---

## 1. Schema SQL

Run this once in the Supabase SQL Editor (or via migration).

```sql
-- ============================================================
-- phone_numbers table
-- ============================================================

create table if not exists public.phone_numbers (
  id            uuid        primary key default gen_random_uuid(),
  website       text        not null,            -- 'serviceaircond.my'
  product_slug  text        not null,            -- 'service-aircond'
  location_slug text        not null,            -- e.g. 'kuala-lumpur' | 'all'
  phone_number  text        not null,            -- E.164 without '+', e.g. '60123456789'
  label         text,                            -- optional, e.g. 'KL Team 1'
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),

  constraint phone_numbers_unique_slot
    unique (website, product_slug, location_slug, phone_number)
);

comment on table  public.phone_numbers                  is 'WhatsApp phone numbers for all Utopia websites, scoped by website + product + location.';
comment on column public.phone_numbers.website          is 'Domain of the website, e.g. serviceaircond.my';
comment on column public.phone_numbers.product_slug     is 'Product/service slug, e.g. service-aircond';
comment on column public.phone_numbers.location_slug    is 'City slug, e.g. kuala-lumpur. Use ''all'' for a site-wide fallback pool.';
comment on column public.phone_numbers.phone_number     is 'E.164 format without leading +, e.g. 60123456789';
comment on column public.phone_numbers.label            is 'Human-readable label for admin use, e.g. KL Team 1';
comment on column public.phone_numbers.is_active        is 'Set false to soft-delete a number without removing it from history.';

-- Composite index: covers the exact WHERE clause in getPhoneNumber.ts
create index if not exists idx_phone_numbers_lookup
  on public.phone_numbers (website, product_slug, location_slug, is_active);
```

Full file: [`supabase/schema.sql`](./supabase/schema.sql)

---

## 2. RLS Policy SQL

```sql
-- Enable RLS
alter table public.phone_numbers enable row level security;

-- PUBLIC READ — anon key may SELECT active rows only
create policy "Public can read active phone numbers"
  on public.phone_numbers
  for select
  to anon, authenticated
  using (is_active = true);

-- BLOCK all writes for anon/authenticated roles
-- (Service role bypasses RLS by default — use SUPABASE_SERVICE_ROLE_KEY server-side)

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
```

Full file: [`supabase/rls.sql`](./supabase/rls.sql)

### Security summary

| Role            | SELECT           | INSERT | UPDATE | DELETE |
|-----------------|------------------|--------|--------|--------|
| `anon`          | Active rows only | DENIED | DENIED | DENIED |
| `authenticated` | Active rows only | DENIED | DENIED | DENIED |
| `service_role`  | All rows         | YES    | YES    | YES    |

Use `SUPABASE_SERVICE_ROLE_KEY` in the Layla admin backend only. Never expose it to the browser.

---

## 3. Query Logic & Fallback Chain

The runtime query is a **single round-trip** that fetches both location-specific and global-pool rows:

```sql
select phone_number, location_slug
from phone_numbers
where website      = 'serviceaircond.my'
  and product_slug = 'service-aircond'
  and is_active    = true
  and location_slug in ('kuala-lumpur', 'all')   -- 'all' = site-wide fallback pool
```

Application-level resolution (in TypeScript):

```
1. Filter rows where location_slug = locationSlug
   → if pool is non-empty, pick one at random  ✓ source: 'location'

2. Filter rows where location_slug = 'all'
   → if pool is non-empty, pick one at random  ✓ source: 'global-pool'

3. Return PHONE_FALLBACK env var (or hardcoded constant)
                                                ✓ source: 'env-fallback'
```

This never throws and always returns a valid phone string.

---

## 4. `lib/getPhoneNumber.ts`

```typescript
import { headers } from 'next/headers'
import { supabase } from './supabase'

const WEBSITE       = 'serviceaircond.my'
const PRODUCT_SLUG  = 'service-aircond'
const FALLBACK_PHONE = process.env.PHONE_FALLBACK ?? '60123456799'

interface PhoneRow {
  phone_number: string
  location_slug: string
}

export interface PhoneResult {
  phone:  string
  source: 'location' | 'global-pool' | 'env-fallback'
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

async function resolveWebsite(): Promise<string> {
  try {
    return (await headers()).get('host') ?? WEBSITE
  } catch {
    return WEBSITE
  }
}

export async function getPhoneNumber(locationSlug: string): Promise<PhoneResult> {
  try {
    const website = await resolveWebsite()

    const { data, error } = await supabase
      .from('phone_numbers')
      .select('phone_number, location_slug')
      .eq('website',      website)
      .eq('product_slug', PRODUCT_SLUG)
      .eq('is_active',    true)
      .in('location_slug', [locationSlug, 'all'])

    if (error) {
      console.error('[getPhoneNumber] Supabase error:', error.message)
      return { phone: FALLBACK_PHONE, source: 'env-fallback' }
    }

    if (!data || data.length === 0) {
      return { phone: FALLBACK_PHONE, source: 'env-fallback' }
    }

    const rows = data as PhoneRow[]
    const locationPool = rows.filter(r => r.location_slug === locationSlug)
    const globalPool   = rows.filter(r => r.location_slug === 'all')

    const fromLocation = pickRandom(locationPool)
    if (fromLocation) return { phone: fromLocation.phone_number, source: 'location' }

    const fromGlobal = pickRandom(globalPool)
    if (fromGlobal) return { phone: fromGlobal.phone_number, source: 'global-pool' }

    return { phone: FALLBACK_PHONE, source: 'env-fallback' }
  } catch (err) {
    console.error('[getPhoneNumber] Unexpected error:', err)
    return { phone: FALLBACK_PHONE, source: 'env-fallback' }
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${query}`
}

export async function getWhatsAppLink(locationSlug: string, message?: string): Promise<string> {
  const { phone } = await getPhoneNumber(locationSlug)
  return waLink(phone, message)
}
```

Full file: [`lib/getPhoneNumber.ts`](./lib/getPhoneNumber.ts)

### Usage in a Server Component

```typescript
// app/[locale]/service-aircond/[location]/page.tsx

import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'

export default async function LocationPage({ params }) {
  const { phone } = await getPhoneNumber(params.location)
  const whatsappUrl = waLink(phone, `Hi, I need aircond service in ${params.location}`)

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      WhatsApp Us
    </a>
  )
}
```

### Usage in the WhatsApp redirect page

```typescript
// app/[locale]/redirect-whatsapp-1/page.tsx

import { redirect } from 'next/navigation'
import { getWhatsAppLink } from '@/lib/getPhoneNumber'

export default async function WhatsAppRedirect({ searchParams }) {
  const location = searchParams.loc ?? 'all'
  const url = await getWhatsAppLink(location, 'Hi, I need aircond service!')
  redirect(url)
}
```

---

## 5. Seed Data SQL

Provides one number per location across all 38 cities, plus two numbers for high-volume cities (Kuala Lumpur, Penang, Johor Bahru), plus two site-wide fallback rows under `location_slug = 'all'`.

**Total: 44 seed rows.**

Excerpt (see full file at [`supabase/seed.sql`](./supabase/seed.sql)):

```sql
insert into public.phone_numbers
  (website, product_slug, location_slug, phone_number, label, is_active)
values
  -- Kuala Lumpur (2 numbers → rotation)
  ('serviceaircond.my', 'service-aircond', 'kuala-lumpur',  '60123456701', 'KL Team 1', true),
  ('serviceaircond.my', 'service-aircond', 'kuala-lumpur',  '60123456702', 'KL Team 2', true),

  -- Petaling Jaya
  ('serviceaircond.my', 'service-aircond', 'petaling-jaya', '60123456703', 'PJ Team 1', true),

  -- Shah Alam
  ('serviceaircond.my', 'service-aircond', 'shah-alam',     '60123456704', 'Shah Alam Team 1', true),

  -- Penang (2 numbers → rotation)
  ('serviceaircond.my', 'service-aircond', 'penang',        '60123456719', 'Penang Team 1', true),
  ('serviceaircond.my', 'service-aircond', 'penang',        '60123456720', 'Penang Team 2', true),

  -- ... (38 locations total, see seed.sql)

  -- Site-wide fallback pool
  ('serviceaircond.my', 'service-aircond', 'all', '60123456799', 'National Hotline 1', true),
  ('serviceaircond.my', 'service-aircond', 'all', '60123456800', 'National Hotline 2', true)

on conflict (website, product_slug, location_slug, phone_number) do nothing;
```

---

## 6. Environment Variables

Add these to `.env.local` (Vercel → Project Settings → Environment Variables):

```env
# Supabase — public (safe to expose to browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Fallback phone number when Supabase returns no results
# E.164 without '+', e.g. Malaysian mobile
PHONE_FALLBACK=60123456799
```

Never commit `.env.local` to git. The `SUPABASE_SERVICE_ROLE_KEY` is only needed by the Layla admin backend — keep it strictly server-side.

---

## 7. Deployment Checklist

- [ ] Run `supabase/schema.sql` in the Supabase SQL Editor
- [ ] Run `supabase/rls.sql` in the Supabase SQL Editor
- [ ] Run `supabase/seed.sql` to populate placeholder numbers
- [ ] Replace placeholder numbers (`601234567XX`) with real business numbers
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- [ ] Set `PHONE_FALLBACK` in Vercel
- [ ] Verify RLS: test with anon key that only active rows are returned
- [ ] Verify rotation: refresh the WhatsApp redirect page multiple times for KL / Penang (2 numbers each) and confirm both numbers appear

---

## 8. Design Decisions

| Decision | Rationale |
|---|---|
| Single `phone_numbers` table for all websites | Shared infrastructure; Cyclops manages one schema, Layla's admin covers all sites |
| `location_slug = 'all'` as fallback pool | One query, two pools — no second round-trip needed |
| Application-level random selection | Supabase does not guarantee row order; `ORDER BY RANDOM()` is expensive; picking in JS is free |
| `is_active` soft-delete | Preserves history; ops can disable a number instantly without a code deploy |
| `PHONE_FALLBACK` env var | Ops can change the last-resort number without touching code |
| Unique constraint on `(website, product_slug, location_slug, phone_number)` | Idempotent seed inserts with `ON CONFLICT DO NOTHING` |
