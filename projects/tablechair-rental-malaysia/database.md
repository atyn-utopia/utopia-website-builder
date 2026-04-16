# Kak Kenduri — Table & Chair Rental Malaysia — Database Document

**Agent:** Cyclops (Database Engineer)
**Domain:** `tablechair-rental-malaysia.vercel.app`
**Leads mode:** `single`
**Default phone:** `60174287801`
**Supabase instance:** Shared multi-tenant (repo root `.env.local`, symlinked per project)

This project does **NOT** create or alter any tables. The shared Supabase instance already has the canonical `phone_numbers` and `company_websites` schema. Cyclops only seeds rows and writes `lib/getPhoneNumber.ts`.

---

## 1. Schema Verification (no DDL)

### 1a. `phone_numbers` — current columns (quoted)

The canonical schema for this project, as defined in `CLAUDE.md` → "Supabase Database Logic" → "phone_numbers Table Columns":

> - `website` — Vercel domain (e.g. `electric-wheelchair-malaysia.vercel.app`)
> - `location_slug` — city slug or `'all'` for default
> - `phone_number` — full international format
> - `whatsapp_text` — pre-filled WhatsApp message
> - `percentage` — weight for random selection (relative, doesn't need to sum to 100)
> - `label` — `'default'` for initial number, agent name for additional numbers
> - `type` — `'default'` for initial setup, `'custom'` for additional numbers
> - `is_active` — boolean

Plus the housekeeping columns `id` (UUID primary key) and `created_at` (TIMESTAMPTZ).

**The `product_slug` column HAS BEEN REMOVED.** It is not present on `phone_numbers` and must never be referenced in SQL, SELECT lists, INSERTs, WHERE clauses, or TypeScript code anywhere in this project.

### 1b. `company_websites` — relevant columns

- `domain` — the deployed host (matches `phone_numbers.website`)
- `leads_mode` — one of `single` | `rotation` | `location` | `hybrid`
- brand metadata columns (`brand_name`, `logo_url`, etc.) — optional, not required by the runtime query path

### 1c. Pre-seed verification query

Run these in the Supabase SQL Editor before seeding, to confirm no `product_slug` column exists and to see what is already present for this domain:

```sql
-- Confirm phone_numbers has NO product_slug column.
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'phone_numbers'
ORDER BY ordinal_position;
-- Expected rows: id, website, location_slug, phone_number, whatsapp_text,
-- percentage, label, type, is_active, created_at

-- Any rows already seeded for this domain? (Should be zero on first run.)
SELECT id, website, location_slug, phone_number, label, type, is_active
FROM phone_numbers
WHERE website = 'tablechair-rental-malaysia.vercel.app';

-- Any company_websites row already?
SELECT domain, leads_mode
FROM company_websites
WHERE domain = 'tablechair-rental-malaysia.vercel.app';
```

If `product_slug` appears in the first query's output, STOP and escalate — the schema has drifted.

---

## 2. Seed SQL (run in Supabase SQL Editor)

Two rows total. Both use `ON CONFLICT DO UPDATE` so the seed is idempotent and safe to re-run.

### 2a. `company_websites` — one row, leads_mode = 'single'

```sql
INSERT INTO company_websites (domain, leads_mode, brand_name)
VALUES (
  'tablechair-rental-malaysia.vercel.app',
  'single',
  'Kak Kenduri'
)
ON CONFLICT (domain) DO UPDATE SET
  leads_mode = EXCLUDED.leads_mode,
  brand_name = EXCLUDED.brand_name;
```

### 2b. `phone_numbers` — one default row (location_slug = 'all')

```sql
INSERT INTO phone_numbers (
  website,
  location_slug,
  phone_number,
  whatsapp_text,
  percentage,
  label,
  type,
  is_active
)
VALUES (
  'tablechair-rental-malaysia.vercel.app',
  'all',
  '60174287801',
  'Hi Kak Kenduri, saya nak tanya pasal sewa meja dan kerusi.',
  100,
  'default',
  'default',
  true
)
ON CONFLICT (website, location_slug, phone_number) DO UPDATE SET
  whatsapp_text = EXCLUDED.whatsapp_text,
  percentage    = EXCLUDED.percentage,
  label         = EXCLUDED.label,
  type          = EXCLUDED.type,
  is_active     = EXCLUDED.is_active;
```

> If the shared `phone_numbers` table does not have a unique constraint on `(website, location_slug, phone_number)`, drop the `ON CONFLICT` clause on first seed and instead guard the insert with `WHERE NOT EXISTS (...)`. Do NOT add a new unique constraint yourself — the admin panel owns the schema.

### 2c. Post-seed verification query

```sql
SELECT website, location_slug, phone_number, label, type, percentage, is_active, whatsapp_text
FROM phone_numbers
WHERE website = 'tablechair-rental-malaysia.vercel.app';
-- Expected: exactly 1 row
--   location_slug = 'all'
--   phone_number  = '60174287801'
--   label = type  = 'default'
--   percentage    = 100
--   is_active     = true

SELECT domain, leads_mode
FROM company_websites
WHERE domain = 'tablechair-rental-malaysia.vercel.app';
-- Expected: exactly 1 row, leads_mode = 'single'
```

---

## 3. Query Logic for `leads_mode = 'single'`

Since every WhatsApp CTA on every page hits `/[locale]/redirect-whatsapp-1?loc={slug}`, the single-mode flow is:

1. Read the HTTP `host` header in the route handler.
2. Fetch `leads_mode` from `company_websites` WHERE `domain = host`. For this project that returns `'single'`.
3. Fetch active rows from `phone_numbers` WHERE `website = host` AND `is_active = true`, ordered so the `label = 'default'` row sorts first.
4. Return the first row. Because this project only ever seeds one row, the `loc` query param is intentionally ignored (but accepted for API symmetry with `rotation`/`location`/`hybrid` modes).
5. Redirect to `https://wa.me/{phone_number}?text={encodeURIComponent(whatsapp_text)}` with status `302`.

### Reference SQL (executed from JS via PostgREST)

```sql
-- Resolve the website's leads mode.
SELECT leads_mode
FROM company_websites
WHERE domain = 'tablechair-rental-malaysia.vercel.app'
LIMIT 1;

-- Fetch the active default number for single mode.
SELECT phone_number, whatsapp_text
FROM phone_numbers
WHERE website   = 'tablechair-rental-malaysia.vercel.app'
  AND is_active = true
ORDER BY
  CASE WHEN label = 'default' THEN 0 ELSE 1 END,
  created_at ASC
LIMIT 1;
```

Fallback chain used by `getPhoneNumber.ts`:

| Priority | Source | Condition |
|---|---|---|
| 1 | Single default row | `website = host AND is_active = true` returns ≥ 1 row |
| 2 | Hardcoded fallback | Supabase error, zero rows, or network failure — returns `siteConfig.fallbackPhone` |

---

## 4. `lib/getPhoneNumber.ts` (complete)

Create `projects/tablechair-rental-malaysia/lib/getPhoneNumber.ts` with the contents below. It is server-only, imported by `app/[locale]/redirect-whatsapp-1/route.ts`. **No `product_slug` anywhere.** The website is resolved from the HTTP `host` header so the same code works on the Vercel preview domain and any custom domain added later (just seed more rows).

```typescript
// projects/tablechair-rental-malaysia/lib/getPhoneNumber.ts
// Server-only. Never import from a client component.

import { createClient } from "@supabase/supabase-js";

// ------------------------------------------------------------------
// Hardcoded fallbacks (must match the seeded default row exactly).
// ------------------------------------------------------------------
const FALLBACK_PHONE = "60174287801";
const FALLBACK_WHATSAPP_TEXT =
  "Hi Kak Kenduri, saya nak tanya pasal sewa meja dan kerusi.";

// ------------------------------------------------------------------
// Supabase client (anon key — RLS enforces read-only public access).
// ------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface PhoneResult {
  phone: string;
  whatsappText: string;
}

type LeadsMode = "single" | "rotation" | "location" | "hybrid";

interface PhoneRow {
  phone_number: string;
  whatsapp_text: string | null;
  location_slug: string | null;
  percentage: number | null;
  label: string | null;
}

// ------------------------------------------------------------------
// Host normalisation — strip port, lowercase, trim trailing dot.
// ------------------------------------------------------------------
function normaliseHost(host: string): string {
  return host.trim().toLowerCase().split(":")[0].replace(/\.$/, "");
}

function fallback(): PhoneResult {
  return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WHATSAPP_TEXT };
}

// ------------------------------------------------------------------
// Weighted random pick (used by rotation / location / hybrid modes).
// Kept here so the function stays drop-in compatible if the owner
// later switches leads_mode away from 'single'. For single mode it
// is a no-op because we only ever have one active row.
// ------------------------------------------------------------------
function pickWeighted(rows: PhoneRow[]): PhoneRow {
  const weights = rows.map((r) => Math.max(0, r.percentage ?? 0));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return rows[0];
  let r = Math.random() * total;
  for (let i = 0; i < rows.length; i++) {
    r -= weights[i];
    if (r <= 0) return rows[i];
  }
  return rows[rows.length - 1];
}

// ------------------------------------------------------------------
// getPhoneNumber
// Resolves the WhatsApp phone + pre-filled text for the given host.
// Never throws — always returns a usable PhoneResult.
//
// Signature matches the project contract:
//   getPhoneNumber(host, locationSlug?) => { phone, whatsappText }
// The locationSlug argument is accepted for API symmetry with other
// leads modes. In 'single' mode it is ignored (one default row wins).
// ------------------------------------------------------------------
export async function getPhoneNumber(
  host: string,
  locationSlug?: string
): Promise<PhoneResult> {
  if (!host) return fallback();
  const website = normaliseHost(host);

  try {
    // 1. Resolve leads_mode for this website.
    const { data: siteRow, error: siteErr } = await supabase
      .from("company_websites")
      .select("leads_mode")
      .eq("domain", website)
      .maybeSingle();

    if (siteErr) return fallback();

    const leadsMode: LeadsMode =
      (siteRow?.leads_mode as LeadsMode | undefined) ?? "single";

    // 2. Fetch all active rows for this website.
    // NOTE: no product_slug — this column has been removed from the schema.
    const { data: rows, error: rowsErr } = await supabase
      .from("phone_numbers")
      .select("phone_number, whatsapp_text, location_slug, percentage, label")
      .eq("website", website)
      .eq("is_active", true);

    if (rowsErr || !rows || rows.length === 0) return fallback();

    // 3. Apply leads_mode logic.
    const loc = (locationSlug ?? "all").trim().toLowerCase();

    let candidates: PhoneRow[] = [];
    switch (leadsMode) {
      case "single": {
        // Prefer the 'default' label, fall back to the first row.
        const sorted = [...rows].sort((a, b) => {
          const aDef = a.label === "default" ? 0 : 1;
          const bDef = b.label === "default" ? 0 : 1;
          return aDef - bDef;
        });
        candidates = sorted.slice(0, 1);
        break;
      }
      case "rotation": {
        candidates = rows;
        break;
      }
      case "location": {
        const locRows = rows.filter((r) => r.location_slug === loc);
        candidates = locRows.length > 0
          ? locRows
          : rows.filter((r) => r.location_slug === "all");
        break;
      }
      case "hybrid": {
        if (loc && loc !== "all") {
          candidates = rows.filter((r) => r.location_slug === loc);
          if (candidates.length === 0) {
            candidates = rows.filter((r) => r.location_slug === "all");
          }
        } else {
          candidates = rows.filter((r) => r.location_slug === "all");
        }
        break;
      }
    }

    if (candidates.length === 0) return fallback();

    const picked = pickWeighted(candidates);
    return {
      phone: picked.phone_number || FALLBACK_PHONE,
      whatsappText: picked.whatsapp_text || FALLBACK_WHATSAPP_TEXT,
    };
  } catch {
    return fallback();
  }
}
```

### Usage in the redirect route

```typescript
// projects/tablechair-rental-malaysia/app/[locale]/redirect-whatsapp-1/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPhoneNumber } from "@/lib/getPhoneNumber";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const loc = req.nextUrl.searchParams.get("loc") ?? "all";

  const { phone, whatsappText } = await getPhoneNumber(host, loc);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`;

  return NextResponse.redirect(url, 302);
}
```

---

## 5. Row Level Security (RLS)

`phone_numbers` and `company_websites` are publicly readable but not writable. On the shared instance these policies are already in place from earlier projects; the block below is idempotent and safe to run again.

```sql
-- Enable RLS.
ALTER TABLE phone_numbers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_websites ENABLE ROW LEVEL SECURITY;

-- Public read on phone_numbers.
DROP POLICY IF EXISTS "Allow public read on phone_numbers" ON phone_numbers;
CREATE POLICY "Allow public read on phone_numbers"
  ON phone_numbers
  FOR SELECT
  TO anon
  USING (true);

-- Public read on company_websites.
DROP POLICY IF EXISTS "Allow public read on company_websites" ON company_websites;
CREATE POLICY "Allow public read on company_websites"
  ON company_websites
  FOR SELECT
  TO anon
  USING (true);

-- No INSERT / UPDATE / DELETE policies for `anon` — writes are denied
-- by default under RLS. Only the service_role (server-side admin panel)
-- bypasses RLS and can mutate rows.
```

---

## 6. Verification Checklist (run before deploy)

- [ ] `.env.local` in the project is a symlink to the repo root `../../.env.local` and `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` are loaded.
- [ ] `next.config.ts` calls `loadEnvConfig(process.cwd() + '/../..')`.
- [ ] `information_schema` query confirms `phone_numbers` has NO `product_slug` column.
- [ ] `company_websites` has exactly one row for `tablechair-rental-malaysia.vercel.app` with `leads_mode = 'single'`.
- [ ] `phone_numbers` has exactly one row for `tablechair-rental-malaysia.vercel.app` with `location_slug = 'all'`, `phone_number = '60174287801'`, `label = 'default'`, `type = 'default'`, `percentage = 100`, `is_active = true`, and the seeded `whatsapp_text`.
- [ ] `lib/getPhoneNumber.ts` contains no occurrence of the string `product_slug`.
- [ ] Local smoke test: `curl -I http://localhost:3000/en/redirect-whatsapp-1?loc=all` returns `302` with a `Location` header pointing to `https://wa.me/60174287801?text=...`.
- [ ] Repeat for `loc=shah-alam`, `loc=kuala-lumpur`, `loc=kota-bharu` — all three must redirect to the same `60174287801` number (single mode).
- [ ] PostgREST smoke test: `curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/phone_numbers?website=eq.tablechair-rental-malaysia.vercel.app&select=phone_number,whatsapp_text,label,type" -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"` returns the seeded row.
- [ ] When a custom domain is added later (e.g. `tablechairrental.my`), re-seed both rows with that `domain` / `website` value. The code needs no change.
- [ ] `FALLBACK_PHONE` in `getPhoneNumber.ts` === `60174287801` (matches the seeded row; not a placeholder).
- [ ] Vercel project env vars match `.env.local` (`vercel env add NEXT_PUBLIC_SUPABASE_URL`, `vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY`).

Once every box is ticked, hand off to Layla for deployment.
