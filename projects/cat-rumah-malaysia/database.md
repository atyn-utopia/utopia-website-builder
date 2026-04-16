# Database — Cat Rumah Malaysia

Shared Supabase database. This project is distinguished by the `website` column value `cat-rumah-malaysia.vercel.app`. Leads mode is `single`, so only ONE phone row is needed (`location_slug = 'all'`).

---

## 1. Tables Used (existing schema — DO NOT recreate)

Both tables already exist in the shared Supabase project. Cyclops only needs to seed rows.

### `phone_numbers`
Columns used by this project:

| Column          | Type      | Value for this project                                  |
|-----------------|-----------|---------------------------------------------------------|
| `website`       | text      | `cat-rumah-malaysia.vercel.app`                         |
| `location_slug` | text      | `all` (single mode — no per-location rows)              |
| `phone_number`  | text      | `60174287801` (full international, no `+` prefix)       |
| `whatsapp_text` | text      | pre-filled MS message (see seed SQL)                    |
| `percentage`    | numeric   | `100`                                                   |
| `label`         | text      | `default`                                               |
| `type`          | text      | `default`                                               |
| `is_active`     | boolean   | `true`                                                  |

Notes:
- The column is `website` (NOT `website_slug`).
- There is NO `product_slug` column — it was removed from the schema.
- Default/global row uses `location_slug = 'all'` (NOT `NULL`). Always query with `.eq('location_slug', 'all')`, never `.is(null)`.

### `company_websites`
Columns used:

| Column        | Type | Value                                  |
|---------------|------|----------------------------------------|
| `domain`      | text | `cat-rumah-malaysia.vercel.app`        |
| `leads_mode`  | text | `single`                               |

---

## 2. Seed SQL (paste into Supabase SQL editor)

```sql
-- 1. Upsert company_websites row with leads_mode = 'single'
INSERT INTO company_websites (domain, leads_mode)
VALUES ('cat-rumah-malaysia.vercel.app', 'single')
ON CONFLICT (domain) DO UPDATE
  SET leads_mode = EXCLUDED.leads_mode;

-- 2. Insert the single default phone_numbers row
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
  'cat-rumah-malaysia.vercel.app',
  'all',
  '60174287801',
  'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?',
  100,
  'default',
  'default',
  true
)
ON CONFLICT DO NOTHING;
```

Because `leads_mode = 'single'`, no per-location rows are required for the 16 cities (kuala-lumpur, petaling-jaya, shah-alam, subang-jaya, puchong, cheras, ampang, klang, kajang, cyberjaya, putrajaya, seremban, melaka, johor-bahru, ipoh, george-town). The single `location_slug = 'all'` row serves every page.

---

## 3. Query Examples

### Fetch the default number for this website
```ts
const { data, error } = await supabase
  .from('phone_numbers')
  .select('phone_number, whatsapp_text, location_slug')
  .eq('website', 'cat-rumah-malaysia.vercel.app')
  .eq('location_slug', 'all')   // NEVER .is('location_slug', null)
  .eq('is_active', true)
  .limit(1)
  .single()
```

### Fetch the leads mode
```ts
const { data } = await supabase
  .from('company_websites')
  .select('leads_mode')
  .eq('domain', 'cat-rumah-malaysia.vercel.app')
  .single()
```

---

## 4. Full `lib/getPhoneNumbers.ts`

Save to `/Users/intern/Documents/GitHub/utopia-website-system/projects/cat-rumah-malaysia/lib/getPhoneNumbers.ts`.

```ts
import { headers } from 'next/headers'
import { supabase } from './supabase'

// ─── Constants ────────────────────────────────────────────────────────────────

const WEBSITE = 'cat-rumah-malaysia.vercel.app'

/**
 * Hard fallback used when Supabase is unreachable or returns no rows.
 * Override via PHONE_FALLBACK env var so ops can change it without a redeploy.
 * Must match the seeded default row in phone_numbers.
 */
const FALLBACK_PHONE =
  process.env.PHONE_FALLBACK ?? '60174287801'

const FALLBACK_WHATSAPP_TEXT =
  'Hi, saya berminat untuk servis cat rumah. Boleh dapatkan quotation?'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhoneRow {
  phone_number: string
  location_slug: string
  whatsapp_text: string | null
  percentage: number | null
}

export interface PhoneResult {
  phone: string
  whatsappText: string
  source: 'location' | 'global-pool' | 'env-fallback'
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

/**
 * Weighted random pick using the `percentage` column.
 * Falls back to uniform random when weights are missing/zero.
 */
function pickWeighted<T extends { percentage: number | null }>(
  arr: T[],
): T | undefined {
  if (arr.length === 0) return undefined
  const total = arr.reduce((s, r) => s + (r.percentage ?? 0), 0)
  if (total <= 0) return arr[Math.floor(Math.random() * arr.length)]
  let roll = Math.random() * total
  for (const row of arr) {
    roll -= row.percentage ?? 0
    if (roll <= 0) return row
  }
  return arr[arr.length - 1]
}

/**
 * Resolve the effective website identifier from the request host header.
 * Falls back to the hardcoded constant for tests / local dev where there is
 * no live HTTP request.
 */
async function resolveWebsite(): Promise<string> {
  try {
    const host = (await headers()).get('host')
    return host ?? WEBSITE
  } catch {
    return WEBSITE
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetch the active WhatsApp number for a given location.
 *
 * Leads mode for this project is `single`, so in practice every call returns
 * the `location_slug = 'all'` row. The location-first branch remains so the
 * function is drop-in compatible if the mode is later changed to `location`
 * or `hybrid`.
 *
 * Fallback chain:
 *   1. Location-specific pool  (location_slug = locationSlug)
 *   2. Global site pool        (location_slug = 'all')
 *   3. PHONE_FALLBACK env var  (or hardcoded constant)
 *
 * This function never throws — it always returns a valid phone string.
 *
 * @param locationSlug  e.g. 'kuala-lumpur'. Pass 'all' for homepage/blog.
 */
export async function getPhoneNumber(
  locationSlug: string = 'all',
): Promise<PhoneResult> {
  try {
    if (!supabase) {
      return {
        phone: FALLBACK_PHONE,
        whatsappText: FALLBACK_WHATSAPP_TEXT,
        source: 'env-fallback',
      }
    }

    const website = await resolveWebsite()

    // Single round-trip: fetch location-specific and global rows together.
    const { data, error } = await supabase
      .from('phone_numbers')
      .select('phone_number, location_slug, whatsapp_text, percentage')
      .eq('website', website)
      .eq('is_active', true)
      .in('location_slug', [locationSlug, 'all'])

    if (error) {
      console.error('[getPhoneNumber] Supabase error:', error.message)
      return {
        phone: FALLBACK_PHONE,
        whatsappText: FALLBACK_WHATSAPP_TEXT,
        source: 'env-fallback',
      }
    }

    if (!data || data.length === 0) {
      return {
        phone: FALLBACK_PHONE,
        whatsappText: FALLBACK_WHATSAPP_TEXT,
        source: 'env-fallback',
      }
    }

    const rows = data as PhoneRow[]

    // Prefer location-specific pool; fall back to global pool.
    const locationPool = rows.filter(r => r.location_slug === locationSlug)
    const globalPool = rows.filter(r => r.location_slug === 'all')

    const fromLocation = pickWeighted(locationPool)
    if (fromLocation) {
      return {
        phone: fromLocation.phone_number,
        whatsappText: fromLocation.whatsapp_text ?? FALLBACK_WHATSAPP_TEXT,
        source: 'location',
      }
    }

    const fromGlobal = pickWeighted(globalPool)
    if (fromGlobal) {
      return {
        phone: fromGlobal.phone_number,
        whatsappText: fromGlobal.whatsapp_text ?? FALLBACK_WHATSAPP_TEXT,
        source: 'global-pool',
      }
    }

    return {
      phone: FALLBACK_PHONE,
      whatsappText: FALLBACK_WHATSAPP_TEXT,
      source: 'env-fallback',
    }
  } catch (err) {
    console.error('[getPhoneNumber] Unexpected error:', err)
    return {
      phone: FALLBACK_PHONE,
      whatsappText: FALLBACK_WHATSAPP_TEXT,
      source: 'env-fallback',
    }
  }
}

// ─── WhatsApp URL builder ─────────────────────────────────────────────────────

/**
 * Build a wa.me deep-link.
 *
 * @param phone    E.164 without '+', e.g. '60174287801'
 * @param message  Optional pre-filled message text (will be URI-encoded)
 */
export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${query}`
}

/**
 * Convenience: fetch the active number and immediately return a wa.me link.
 * Always opens in a new tab on the frontend (per project rules).
 *
 * @param locationSlug  e.g. 'kuala-lumpur'
 * @param message       Optional pre-filled WhatsApp message (defaults to the
 *                      seeded whatsapp_text column)
 */
export async function getWhatsAppLink(
  locationSlug: string = 'all',
  message?: string,
): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug)
  return waLink(phone, message ?? whatsappText)
}
```

---

## 5. RLS Policy

The existing shared Supabase project already has a public-anon SELECT policy on both `phone_numbers` and `company_websites`. No new policy is required for this project.

Existing policy (for reference — already applied, do not re-run):
```sql
-- phone_numbers: anon read of active rows
CREATE POLICY "public read active phone_numbers"
  ON phone_numbers FOR SELECT
  TO anon
  USING (is_active = true);

-- company_websites: anon read
CREATE POLICY "public read company_websites"
  ON company_websites FOR SELECT
  TO anon
  USING (true);
```

The anon key from the shared repo-root `.env.local` (symlinked into this project) is sufficient. No service-role key is needed at runtime.

---

## 6. Verification Checklist

Before deploy:

- [ ] `.env.local` is symlinked from repo root: `ln -sf ../../.env.local .env.local`
- [ ] `next.config.ts` loads env via `loadEnvConfig(process.cwd() + '/../..')`
- [ ] Same env vars added to Vercel production via `vercel env add`
- [ ] `company_websites` row exists with `domain = 'cat-rumah-malaysia.vercel.app'` AND `leads_mode = 'single'`
- [ ] Exactly one `phone_numbers` row exists with `website = 'cat-rumah-malaysia.vercel.app'`, `location_slug = 'all'`, `phone_number = '60174287801'`, `is_active = true`
- [ ] No per-location rows were seeded (single mode — not needed)
- [ ] `lib/getPhoneNumbers.ts` `FALLBACK_PHONE` constant equals `'60174287801'` (matches DB)
- [ ] Query uses `.eq('location_slug', 'all')` — never `.is('location_slug', null)`
- [ ] Query filters on `website` column (NOT `website_slug`)
- [ ] Query does NOT reference `product_slug` (column removed)
- [ ] Smoke test: hit `/redirect-whatsapp-1?loc=kuala-lumpur` and confirm redirect to `https://wa.me/60174287801?text=...`
- [ ] Smoke test: hit `/redirect-whatsapp-1` (no loc) and confirm same redirect
- [ ] Verify WhatsApp link opens in a new tab on every CTA
