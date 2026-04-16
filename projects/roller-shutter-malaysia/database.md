# Cyclops — roller-shutter-malaysia.vercel.app
## Database Design
**Agent:** Cyclops — Database Engineer
**Date:** 2026-04-06
**Project:** Roller Shutter Door Malaysia
**Domain:** roller-shutter-malaysia.vercel.app

---

## Overview

The database lives in a shared Supabase instance used by all Utopia websites. Every row is scoped by `website`, so multiple sites coexist in the same `phone_numbers` table without conflict.

---

## 1. Schema SQL

The `phone_numbers` table already exists in the shared Supabase instance (created by earlier projects). No need to run CREATE TABLE again.

For reference, the existing schema is:

```sql
-- ============================================================
-- phone_numbers table (ALREADY EXISTS — do NOT re-run)
-- ============================================================

create table if not exists public.phone_numbers (
  id            uuid        primary key default gen_random_uuid(),
  website       text        not null,            -- 'roller-shutter-malaysia.vercel.app'
  product_slug  text        not null,            -- 'roller-shutter'
  location_slug text        not null,            -- e.g. 'kuala-lumpur' | 'all'
  phone_number  text        not null,            -- E.164 without '+', e.g. '60174287801'
  label         text,                            -- optional, e.g. 'KL Team 1'
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),

  constraint phone_numbers_unique_slot
    unique (website, product_slug, location_slug, phone_number)
);

-- Composite index: covers the exact WHERE clause in getPhoneNumber.ts
create index if not exists idx_phone_numbers_lookup
  on public.phone_numbers (website, product_slug, location_slug, is_active);
```

**Action:** Skip this step — the table and index already exist. Proceed directly to seed data.

---

## 2. RLS Policy SQL

RLS policies are already applied to the shared `phone_numbers` table. For reference:

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

### Security summary

| Role            | SELECT           | INSERT | UPDATE | DELETE |
|-----------------|------------------|--------|--------|--------|
| `anon`          | Active rows only | DENIED | DENIED | DENIED |
| `authenticated` | Active rows only | DENIED | DENIED | DENIED |
| `service_role`  | All rows         | YES    | YES    | YES    |

Use `SUPABASE_SERVICE_ROLE_KEY` in the admin backend only. Never expose it to the browser.

---

## 3. Query Logic & Fallback Chain

The runtime query is a **single round-trip** that fetches both location-specific and global-pool rows:

```sql
select phone_number, location_slug
from phone_numbers
where website      = 'roller-shutter-malaysia.vercel.app'
  and product_slug = 'roller-shutter'
  and is_active    = true
  and location_slug in ('kuala-lumpur', 'all')   -- 'all' = site-wide fallback pool
```

Application-level resolution (in TypeScript):

```
1. Filter rows where location_slug = locationSlug
   -> if pool is non-empty, pick one at random   source: 'location'

2. Filter rows where location_slug = 'all'
   -> if pool is non-empty, pick one at random   source: 'global-pool'

3. Return FALLBACK_PHONE constant
                                                  source: 'env-fallback'
```

This never throws and always returns a valid phone string.

---

## 4. Supabase Client (`lib/supabase.ts`)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Supports both `SUPABASE_` and `NEXT_PUBLIC_SUPABASE_` env var names. Uses the anon key for public reads only — never the service role key.

---

## 5. `lib/getPhoneNumber.ts`

```typescript
import { supabase } from "./supabase";

const WEBSITE = "roller-shutter-malaysia.vercel.app";
const PRODUCT_SLUG = "roller-shutter";
const FALLBACK_PHONE = "60174287801";

interface PhoneRow {
  phone_number: string;
  location_slug: string;
}

export interface PhoneResult {
  phone: string;
  source: "location" | "global-pool" | "env-fallback";
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function getPhoneNumber(
  locationSlug: string
): Promise<PhoneResult> {
  try {
    const { data, error } = await supabase
      .from("phone_numbers")
      .select("phone_number, location_slug")
      .eq("website", WEBSITE)
      .eq("product_slug", PRODUCT_SLUG)
      .eq("is_active", true)
      .in("location_slug", [locationSlug, "all"]);

    if (error) {
      console.error("[getPhoneNumber] Supabase error:", error.message);
      return { phone: FALLBACK_PHONE, source: "env-fallback" };
    }

    if (!data || data.length === 0) {
      return { phone: FALLBACK_PHONE, source: "env-fallback" };
    }

    const rows = data as PhoneRow[];
    const locationPool = rows.filter((r) => r.location_slug === locationSlug);
    const globalPool = rows.filter((r) => r.location_slug === "all");

    const fromLocation = pickRandom(locationPool);
    if (fromLocation)
      return { phone: fromLocation.phone_number, source: "location" };

    const fromGlobal = pickRandom(globalPool);
    if (fromGlobal)
      return { phone: fromGlobal.phone_number, source: "global-pool" };

    return { phone: FALLBACK_PHONE, source: "env-fallback" };
  } catch (err) {
    console.error("[getPhoneNumber] Unexpected error:", err);
    return { phone: FALLBACK_PHONE, source: "env-fallback" };
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

export async function getWhatsAppLink(
  locationSlug: string,
  message?: string
): Promise<string> {
  const { phone } = await getPhoneNumber(locationSlug);
  return waLink(phone, message);
}
```

### Usage in a Server Component

```typescript
// app/[locale]/roller-shutter/[location]/page.tsx

import { getPhoneNumber, waLink } from "@/lib/getPhoneNumber";

export default async function LocationPage({ params }) {
  const { phone } = await getPhoneNumber(params.location);
  const whatsappUrl = waLink(
    phone,
    `Hi, I need roller shutter door service in ${params.location}`
  );

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      WhatsApp Us
    </a>
  );
}
```

### Usage in the WhatsApp redirect page

```typescript
// app/[locale]/redirect-whatsapp-1/page.tsx

import { redirect } from "next/navigation";
import { getWhatsAppLink } from "@/lib/getPhoneNumber";

export default async function WhatsAppRedirect({ searchParams }) {
  const location = searchParams.loc ?? "all";
  const url = await getWhatsAppLink(
    location,
    "Hi, I need a roller shutter door quote!"
  );
  redirect(url);
}
```

---

## 6. Seed Data SQL

Run this in the Supabase SQL Editor to populate phone numbers for Roller Shutter Door Malaysia.

```sql
insert into public.phone_numbers
  (website, product_slug, location_slug, phone_number, label, is_active)
values
  -- Site-wide default (fallback pool)
  ('roller-shutter-malaysia.vercel.app', 'roller-shutter', 'all',            '60174287801', 'National Hotline', true),

  -- Location-specific numbers
  ('roller-shutter-malaysia.vercel.app', 'roller-shutter', 'kuala-lumpur',   '60174287801', 'KL Team',          true),
  ('roller-shutter-malaysia.vercel.app', 'roller-shutter', 'petaling-jaya',  '60174287801', 'PJ Team',          true),
  ('roller-shutter-malaysia.vercel.app', 'roller-shutter', 'shah-alam',      '60174287801', 'Shah Alam Team',   true),
  ('roller-shutter-malaysia.vercel.app', 'roller-shutter', 'johor-bahru',    '60174287801', 'JB Team',          true),
  ('roller-shutter-malaysia.vercel.app', 'roller-shutter', 'penang',         '60174287801', 'Penang Team',      true)

on conflict (website, product_slug, location_slug, phone_number) do nothing;
```

**Total: 6 seed rows** (1 global fallback + 5 location-specific).

All rows currently use the same phone number (`60174287801`). When additional team numbers are available, insert new rows for the same location to enable random rotation.

---

## 7. Environment Variables

Add these to `.env.local` (and Vercel Project Settings > Environment Variables):

```env
# Supabase — public (safe to expose to browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Fallback phone number (hardcoded in code, but can also be set here)
PHONE_FALLBACK=60174287801
```

Never commit `.env.local` to git. The `SUPABASE_SERVICE_ROLE_KEY` is only needed by the admin backend — keep it strictly server-side.

---

## 8. Deployment Checklist

- [ ] Confirm `phone_numbers` table exists in shared Supabase instance
- [ ] Confirm RLS policies are active on `phone_numbers`
- [ ] Run seed SQL (Section 6) to insert roller-shutter-malaysia rows
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- [ ] Verify RLS: test with anon key that only active rows are returned
- [ ] Verify fallback: disable all rows, confirm FALLBACK_PHONE is returned
- [ ] When real team numbers are assigned, update seed data and re-run

---

## 9. Design Decisions

| Decision | Rationale |
|---|---|
| Shared `phone_numbers` table | Same infrastructure as all Utopia websites; Cyclops manages one schema |
| `location_slug = 'all'` as fallback pool | One query, two pools — no second round-trip needed |
| Application-level random selection | Supabase does not guarantee row order; `ORDER BY RANDOM()` is expensive; picking in JS is free |
| `is_active` soft-delete | Preserves history; ops can disable a number instantly without a code deploy |
| Hardcoded `FALLBACK_PHONE` constant | Last-resort number always available even if Supabase is down |
| Unique constraint on `(website, product_slug, location_slug, phone_number)` | Idempotent seed inserts with `ON CONFLICT DO NOTHING` |
| Dual env var support (`SUPABASE_` / `NEXT_PUBLIC_SUPABASE_`) | Works in both server-only and client-accessible contexts |
| No CREATE TABLE in this project | Table already exists from prior projects sharing the same Supabase instance |
