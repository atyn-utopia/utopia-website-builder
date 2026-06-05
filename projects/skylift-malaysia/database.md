# Database — Skylift Malaysia

> Database engineer: **Cyclops**
> Project slug: `skylift-malaysia`
> Domain: `skylift-malaysia.vercel.app`
> Company: Scaffolding Malaysia Sdn. Bhd. (`7c15d93f-c2f7-488d-b38c-4b85d65a06d1`)
> Reference baseline: `projects/electrician-24-hour/lib/{getPhoneNumber.ts,supabase.ts}`
> Scope: **Part 1 only** — schema confirmation, phone/website seeding, lib code, verification commands. Product seeding is Part 2 (post-deploy).

---

## 1. Schema Reference (no schema changes)

The shared Supabase database already contains every table this project needs. **No migrations or schema edits are required.** Skylift Malaysia is registered exclusively via the `website` / `domain` columns.

### Tables consumed by this project

| Table | Purpose | Key columns used by Skylift Malaysia |
|-------|---------|--------------------------------------|
| `companies` | Master list of Utopia Group companies | `id` (uuid) — Skylift's row is `7c15d93f-c2f7-488d-b38c-4b85d65a06d1` |
| `company_websites` | Maps a Vercel domain to a company + leads mode | `company_id`, `domain`, `leads_mode` |
| `phone_numbers` | WhatsApp routing rows (multi-tenant by `website`) | `website`, `location_slug`, `phone_number`, `whatsapp_text`, `percentage`, `label`, `type`, `is_active` |
| `products` | Product/service catalog (multi-tenant by `website`) | `id`, `website`, `parent_id`, `name`, `slug`, `description`, `sale_price`, `rental_price`, `sort_order`, `is_active` |
| `product_photos` | One-to-many photos per product | `product_id` (FK → `products.id`), `url` |
| `blog_posts` | Article shells (multi-tenant by `website`) | `id`, `website`, `slug`, `cover_image_url`, `status` |
| `blog_translations` | Per-locale article body | `blog_post_id` (FK), `locale`, `title`, `content`, `excerpt`, `meta_title`, `meta_description` |

### Hard rules (from CLAUDE.md + agent spec)

- The column is **`website`**, never `website_slug`.
- The default / homepage row uses **`location_slug = 'all'`** (a literal string, **never `NULL`**).
- The deployed domain string is **`skylift-malaysia.vercel.app`** — exact match, no scheme, no trailing slash.
- The removed `product_slug` column must not appear in any SQL or code.
- Phone-number rows are matched by `website` + `location_slug` only.
- All writes from server code use the **anon key** for reads; seed inserts in this document are intended to run in the Supabase SQL editor (which bypasses RLS).

### Existing RLS posture (for reference, no change required)

`phone_numbers`, `company_websites`, `products`, `product_photos`, `blog_posts`, `blog_translations` are publicly readable via the anon key, writable only with the service role key — same posture used by every sibling project (e.g. `electrician-24-hour`, `electric-wheelchair-malaysia`). This document does not alter any RLS policy.

---

## 2. Final Seed SQL

Run both statements in the Supabase SQL editor (in order). They are idempotent-safe to read but **not** wrapped in `ON CONFLICT` — verify the rows do not already exist before re-running (see §5).

### 2.1 `phone_numbers` — single default row

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
) VALUES (
  'skylift-malaysia.vercel.app',
  'all',
  '60139499318',
  'Hi, saya berminat untuk sewa skylift. Boleh bagi sebut harga?',
  100,
  'default',
  'default',
  true
);
```

### 2.2 `company_websites` — link domain to Scaffolding Malaysia, leads_mode = single

```sql
INSERT INTO company_websites (
  company_id,
  domain,
  leads_mode
) VALUES (
  '7c15d93f-c2f7-488d-b38c-4b85d65a06d1',
  'skylift-malaysia.vercel.app',
  'single'
);
```

### Notes

- The architecture currently launches in `single` leads mode — the lone default row is always returned. The same row will continue to work later if the operator switches the website to `rotation` / `location` / `hybrid` (additional rows would simply be appended).
- The `whatsapp_text` is in Bahasa Melayu per project tone (`Hi, saya berminat untuk sewa skylift. Boleh bagi sebut harga?`). The MS phrasing is intentional — `getPhoneNumber.ts` prepends a host prefix at runtime, and the wa.me URL forwards it as the pre-filled chat text regardless of the user's UI locale.
- `percentage = 100` is fine even in `single` mode; the field is only consulted by `pickWeighted` in `rotation` / `location` / `hybrid`.

---

## 3. Final `lib/getPhoneNumber.ts`

Copy the file below into `projects/skylift-malaysia/lib/getPhoneNumber.ts`. Pattern is identical to `projects/electrician-24-hour/lib/getPhoneNumber.ts` — only `FALLBACK_PHONE` and `FALLBACK_WA_TEXT` change.

```ts
import { supabase } from "./supabase";
import { headers } from "next/headers";

const FALLBACK_PHONE = "60139499318";
const FALLBACK_WA_TEXT =
  "Hi, saya berminat untuk sewa skylift. Boleh bagi sebut harga?";

type LeadsMode = "single" | "rotation" | "location" | "hybrid";

interface PhoneRow {
  phone_number: string;
  whatsapp_text: string | null;
  percentage: number | null;
  label: string | null;
  location_slug: string | null;
}

export interface PhoneResult {
  phone: string;
  whatsappText: string;
  source: "database" | "fallback";
  mode: LeadsMode | "fallback";
}

function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined;
  if (rows.length === 1) return rows[0];
  const total = rows.reduce((sum, r) => sum + (r.percentage || 1), 0);
  let roll = Math.random() * total;
  for (const row of rows) {
    roll -= row.percentage || 1;
    if (roll <= 0) return row;
  }
  return rows[rows.length - 1];
}

function findDefaultRow(rows: PhoneRow[]): PhoneRow | undefined {
  return rows.find((r) => r.label === "default");
}

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host") || h.get("x-forwarded-host") || "";
    return host.replace(/:\d+$/, "");
  } catch {
    return "";
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  try {
    if (!supabase) return "single";
    const { data, error } = await supabase
      .from("company_websites")
      .select("leads_mode")
      .eq("domain", domain)
      .single();
    if (error || !data) return "single";
    return (data.leads_mode as LeadsMode) || "single";
  } catch {
    return "single";
  }
}

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: "fallback",
    mode: "fallback",
  };
}

function toResult(
  row: PhoneRow | undefined,
  mode: LeadsMode,
  host: string,
): PhoneResult {
  if (!row) return fallbackResult();
  const text = row.whatsapp_text || FALLBACK_WA_TEXT;
  return {
    phone: row.phone_number,
    whatsappText: `Hi ${host}, ${text}`,
    source: "database",
    mode,
  };
}

export async function getPhoneNumber(
  locationSlug?: string,
): Promise<PhoneResult> {
  try {
    if (!supabase) return fallbackResult();

    const domain = await getHostDomain();
    const mode = await getLeadsMode(domain);

    const { data, error } = await supabase
      .from("phone_numbers")
      .select("phone_number, whatsapp_text, percentage, label, location_slug")
      .eq("website", domain)
      .eq("is_active", true);

    if (error || !data || data.length === 0) return fallbackResult();

    const rows = data as PhoneRow[];
    const defaultRow = findDefaultRow(rows);

    switch (mode) {
      case "single":
        return toResult(defaultRow ?? rows[0], mode, domain);

      case "rotation":
        return toResult(pickWeighted(rows), mode, domain);

      case "location": {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) {
            return toResult(pickWeighted(locRows), mode, domain);
          }
        }
        return toResult(defaultRow, mode, domain);
      }

      case "hybrid": {
        if (locationSlug && locationSlug !== "all") {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) {
            return toResult(pickWeighted(locRows), mode, domain);
          }
        }
        return toResult(defaultRow, mode, domain);
      }

      default:
        return toResult(defaultRow, mode, domain);
    }
  } catch (err) {
    console.error("[getPhoneNumber] Unexpected error:", err);
    return fallbackResult();
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

export async function getWhatsAppLink(
  locationSlug?: string,
  messageOverride?: string,
): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug);
  return waLink(phone, messageOverride || whatsappText);
}
```

### Why this code

- `FALLBACK_PHONE = '60139499318'` matches the seeded row in `phone_numbers` exactly — if Supabase is unreachable, users still reach the right WhatsApp number.
- `FALLBACK_WA_TEXT` is the same Bahasa Melayu message as the seeded row, so the user-facing experience is consistent in both database-success and database-down scenarios.
- All four leads modes are implemented even though the project launches in `single` mode — operators can flip `company_websites.leads_mode` later without redeploying.
- `host` is derived from request headers, so the same code runs unchanged when a custom domain is later attached (just add a second seed row scoped to the new domain).

---

## 4. Final `lib/supabase.ts`

Copy the file below into `projects/skylift-malaysia/lib/supabase.ts`. Pattern is identical to `projects/electrician-24-hour/lib/supabase.ts` — supports both `SUPABASE_*` and `NEXT_PUBLIC_SUPABASE_*` env names per the agent spec's env-var compatibility requirement.

```ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "";

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

### Notes

- Reads the shared Supabase credentials from `/.env.local` at the repo root via the `loadEnvConfig` call wired up in `next.config.ts`.
- Exposes both a lazy `getSupabase()` helper and an eager `supabase` const — the latter is what `getPhoneNumber.ts`, `getBlogPosts.ts`, and product fetchers consume.
- Returns `null` when env vars are missing, which is exactly the path that triggers `fallbackResult()` in `getPhoneNumber.ts` (no throws — graceful degradation).

---

## 5. Verification (run AFTER inserting; do NOT run yet)

These commands confirm the seed rows exist and that the routing query Joe public would issue returns the expected single row. They use the Supabase REST API + anon key (set `SUPA_URL` and `ANON_KEY` from `/.env.local` first).

### 5.1 Confirm `phone_numbers` row exists

```bash
curl -s "$SUPA_URL/rest/v1/phone_numbers?website=eq.skylift-malaysia.vercel.app&select=website,location_slug,phone_number,label,type,is_active,percentage,whatsapp_text" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" | jq
```

Expected: a JSON array with exactly **1 object** — `phone_number = "60139499318"`, `location_slug = "all"`, `label = "default"`, `type = "default"`, `is_active = true`, `percentage = 100`.

### 5.2 Confirm `company_websites` row exists with leads_mode = single

```bash
curl -s "$SUPA_URL/rest/v1/company_websites?domain=eq.skylift-malaysia.vercel.app&select=domain,company_id,leads_mode" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" | jq
```

Expected: a JSON array with exactly **1 object** — `domain = "skylift-malaysia.vercel.app"`, `company_id = "7c15d93f-c2f7-488d-b38c-4b85d65a06d1"`, `leads_mode = "single"`.

### 5.3 Confirm the company exists (sanity check)

```bash
curl -s "$SUPA_URL/rest/v1/companies?id=eq.7c15d93f-c2f7-488d-b38c-4b85d65a06d1&select=id,name" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" | jq
```

Expected: `[{ "id": "7c15d93f-c2f7-488d-b38c-4b85d65a06d1", "name": "Scaffolding Malaysia Sdn. Bhd." }]`.

### 5.4 Reproduce the runtime query that `getPhoneNumber.ts` issues

```bash
curl -s "$SUPA_URL/rest/v1/phone_numbers?website=eq.skylift-malaysia.vercel.app&is_active=eq.true&select=phone_number,whatsapp_text,percentage,label,location_slug" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" | jq
```

Expected: 1 row matching the seed. This proves `getPhoneNumber.ts` will hit the `single` branch with the default row and never fall back to the hardcoded constant in production.

### 5.5 (Optional) Quick row counts before deploy

```bash
# Phone rows for this website
curl -s "$SUPA_URL/rest/v1/phone_numbers?website=eq.skylift-malaysia.vercel.app&select=count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Prefer: count=exact" -I | grep -i content-range

# Company website rows for this domain
curl -s "$SUPA_URL/rest/v1/company_websites?domain=eq.skylift-malaysia.vercel.app&select=count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" \
  -H "Prefer: count=exact" -I | grep -i content-range
```

Both should report `content-range: 0-0/1`.

---

## 6. Part 2 placeholder (NOT executed in this document)

Product / `product_photos` seeding for the 5 skylift units (9m, 20m, 24m, 32m, Spider) and blog inserts (Hanabi) happen **after** the dev build is approved at Gate 1 — they are out of scope for this Part 1 deliverable and will be produced in a follow-up Cyclops run alongside Hanabi.
