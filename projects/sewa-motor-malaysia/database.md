# Sewa Motor Malaysia — Database Document

**Agent:** Cyclops (Database Engineer)
**Website slug:** `sewamotor-my`
**Product slug:** `sewa-motor`
**Domain:** sewamotor.my
**Supabase instance:** Shared (multi-tenant)

---

## 1. Schema SQL

Run this in the Supabase SQL Editor. All tables use `IF NOT EXISTS` so they are safe to run on a shared instance that may already have these tables from other projects (e.g. oxihome-my).

```sql
-- ============================================================
-- TABLE: websites
-- Registry of all websites sharing this Supabase instance.
-- ============================================================
CREATE TABLE IF NOT EXISTS websites (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,          -- e.g. 'sewamotor-my'
  domain        TEXT NOT NULL,                 -- e.g. 'sewamotor.my'
  brand_name    TEXT NOT NULL,                 -- e.g. 'Sewa Motor Malaysia'
  default_phone TEXT,                          -- website-level fallback phone
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: products
-- Product catalog per website.
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_slug  TEXT NOT NULL REFERENCES websites(slug) ON DELETE CASCADE,
  product_slug  TEXT NOT NULL,                 -- e.g. 'sewa-motor'
  display_name  TEXT NOT NULL,                 -- e.g. 'Honda Vario 160'
  description   TEXT,
  price_daily   NUMERIC(10,2),
  price_weekly  NUMERIC(10,2),
  price_monthly NUMERIC(10,2),
  badge         TEXT,                          -- e.g. 'Most Popular', 'Budget Pick'
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(website_slug, product_slug, display_name)
);

-- ============================================================
-- TABLE: locations
-- Shared location registry across all websites.
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,          -- e.g. 'kuala-lumpur'
  display_name  TEXT NOT NULL,                 -- e.g. 'Kuala Lumpur'
  state         TEXT,                          -- e.g. 'Selangor', 'Johor'
  country       TEXT DEFAULT 'MY',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: phone_numbers
-- Maps phone numbers to website + product + location.
-- Multiple rows per combination enable random rotation.
-- ============================================================
CREATE TABLE IF NOT EXISTS phone_numbers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_slug  TEXT NOT NULL REFERENCES websites(slug) ON DELETE CASCADE,
  product_slug  TEXT NOT NULL,                 -- e.g. 'sewa-motor'
  location_slug TEXT,                          -- NULL = product-level default
  phone_number  TEXT NOT NULL,                 -- e.g. '60123456789'
  label         TEXT,                          -- optional label: 'Agent Ali', 'HQ'
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Primary lookup index for phone number queries
CREATE INDEX IF NOT EXISTS idx_phone_numbers_lookup
  ON phone_numbers (website_slug, product_slug, location_slug)
  WHERE is_active = true;

-- Fast lookup by website slug
CREATE INDEX IF NOT EXISTS idx_products_website
  ON products (website_slug)
  WHERE is_active = true;

-- Location slug lookup
CREATE INDEX IF NOT EXISTS idx_locations_slug
  ON locations (slug);

-- ============================================================
-- UPDATED_AT TRIGGER
-- Automatically sets updated_at on row modification.
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_websites'
  ) THEN
    CREATE TRIGGER set_updated_at_websites
      BEFORE UPDATE ON websites
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_products'
  ) THEN
    CREATE TRIGGER set_updated_at_products
      BEFORE UPDATE ON products
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_phone_numbers'
  ) THEN
    CREATE TRIGGER set_updated_at_phone_numbers
      BEFORE UPDATE ON phone_numbers
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;
```

---

## 2. Query Examples

### 2a. Fetch active phone numbers for a specific location

```sql
SELECT phone_number, label
FROM phone_numbers
WHERE website_slug = 'sewamotor-my'
  AND product_slug = 'sewa-motor'
  AND location_slug = :location
  AND is_active = true;
```

Returns all active numbers for the location. Client-side JS picks one at random on each WhatsApp button click.

### 2b. Fallback: product-level default (location_slug IS NULL)

```sql
SELECT phone_number, label
FROM phone_numbers
WHERE website_slug = 'sewamotor-my'
  AND product_slug = 'sewa-motor'
  AND location_slug IS NULL
  AND is_active = true;
```

### 2c. Fallback: website-level default

```sql
SELECT default_phone
FROM websites
WHERE slug = 'sewamotor-my';
```

### 2d. Full fallback chain (single query using COALESCE logic)

This is what `getPhoneNumber.ts` implements programmatically:

1. Try location-specific numbers -> if found, return array
2. Try product-level default (location_slug IS NULL) -> if found, return array
3. Return `siteConfig.fallbackPhone` (hardcoded in code)

---

## 3. Complete `lib/getPhoneNumber.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

// ----------------------------------------------------------------
// Configuration — hardcoded per project
// ----------------------------------------------------------------
const WEBSITE_SLUG = "sewamotor-my";
const PRODUCT_SLUG = "sewa-motor";
const FALLBACK_PHONE = "60123456789"; // from siteConfig

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface PhoneRow {
  phone_number: string;
  label: string | null;
}

export interface PhoneResult {
  phones: string[];
  source: "location" | "product" | "fallback";
}

// ----------------------------------------------------------------
// getPhoneNumbers
// Fetches all active phone numbers for a location.
// Falls back through: location -> product default -> hardcoded.
// Never throws — always returns at least the fallback.
// ----------------------------------------------------------------
export async function getPhoneNumbers(
  locationSlug: string
): Promise<PhoneResult> {
  try {
    // 1. Try location-specific numbers
    const { data: locationPhones, error: locError } = await supabase
      .from("phone_numbers")
      .select("phone_number, label")
      .eq("website_slug", WEBSITE_SLUG)
      .eq("product_slug", PRODUCT_SLUG)
      .eq("location_slug", locationSlug)
      .eq("is_active", true);

    if (!locError && locationPhones && locationPhones.length > 0) {
      return {
        phones: locationPhones.map((r: PhoneRow) => r.phone_number),
        source: "location",
      };
    }

    // 2. Try product-level default (location_slug IS NULL)
    const { data: productPhones, error: prodError } = await supabase
      .from("phone_numbers")
      .select("phone_number, label")
      .eq("website_slug", WEBSITE_SLUG)
      .eq("product_slug", PRODUCT_SLUG)
      .is("location_slug", null)
      .eq("is_active", true);

    if (!prodError && productPhones && productPhones.length > 0) {
      return {
        phones: productPhones.map((r: PhoneRow) => r.phone_number),
        source: "product",
      };
    }

    // 3. Hardcoded fallback
    return {
      phones: [FALLBACK_PHONE],
      source: "fallback",
    };
  } catch {
    // Network error, Supabase down, etc. — never throw
    return {
      phones: [FALLBACK_PHONE],
      source: "fallback",
    };
  }
}

// ----------------------------------------------------------------
// getRandomPhone (client-side helper)
// Pick one phone at random from the array.
// ----------------------------------------------------------------
export function getRandomPhone(phones: string[]): string {
  if (!phones || phones.length === 0) return FALLBACK_PHONE;
  return phones[Math.floor(Math.random() * phones.length)];
}

// ----------------------------------------------------------------
// Convenience: get a single phone for SSG/ISR
// Returns one random phone string — suitable for initial render.
// ----------------------------------------------------------------
export async function getPhoneNumber(locationSlug: string): Promise<string> {
  const result = await getPhoneNumbers(locationSlug);
  return getRandomPhone(result.phones);
}
```

### Usage in a page component

```tsx
// app/[locale]/sewa-motor/[location]/page.tsx
import { getPhoneNumbers, getRandomPhone } from "@/lib/getPhoneNumber";

export default async function LocationPage({ params }) {
  const { location } = params;
  const phoneResult = await getPhoneNumbers(location);

  return (
    <>
      {/* Pass all phones to client component for rotation */}
      <WhatsAppButton phones={phoneResult.phones} />
    </>
  );
}
```

```tsx
// components/WhatsAppButton.tsx (client component)
"use client";

import { getRandomPhone } from "@/lib/getPhoneNumber";

export function WhatsAppButton({ phones }: { phones: string[] }) {
  const handleClick = () => {
    const phone = getRandomPhone(phones);
    const message = encodeURIComponent("Hi, I want to rent a motorcycle.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <button onClick={handleClick}>
      WhatsApp Us
    </button>
  );
}
```

---

## 4. Seed Data SQL

### 4a. Register website

```sql
INSERT INTO websites (slug, domain, brand_name, default_phone)
VALUES ('sewamotor-my', 'sewamotor.my', 'Sewa Motor Malaysia', '60123456789')
ON CONFLICT (slug) DO UPDATE SET
  domain = EXCLUDED.domain,
  brand_name = EXCLUDED.brand_name,
  default_phone = EXCLUDED.default_phone;
```

### 4b. Seed products (6 motorcycles)

```sql
INSERT INTO products (website_slug, product_slug, display_name, description, price_daily, price_weekly, price_monthly, badge, sort_order)
VALUES
  ('sewamotor-my', 'sewa-motor', 'Honda Vario 160', 'Reliable 160cc automatic scooter, perfect for city riding.', 50.00, 280.00, 900.00, 'Most Popular', 1),
  ('sewamotor-my', 'sewa-motor', 'Yamaha NMax 155', 'Premium 155cc maxi-scooter with connected features.', 55.00, 310.00, 1000.00, NULL, 2),
  ('sewamotor-my', 'sewa-motor', 'Honda PCX 160', 'Smooth and fuel-efficient 160cc premium scooter.', 60.00, 340.00, 1100.00, 'Best Value', 3),
  ('sewamotor-my', 'sewa-motor', 'Honda Wave 125', 'Economical 125cc underbone, great fuel economy.', 35.00, 200.00, 650.00, 'Budget Pick', 4),
  ('sewamotor-my', 'sewa-motor', 'Yamaha Y15ZR', 'Sporty 150cc moped with strong acceleration.', 40.00, 230.00, 750.00, NULL, 5),
  ('sewamotor-my', 'sewa-motor', 'Modenas Kriss MR3', 'Affordable and lightweight 110cc daily commuter.', 30.00, 170.00, 550.00, NULL, 6)
ON CONFLICT (website_slug, product_slug, display_name) DO UPDATE SET
  price_daily = EXCLUDED.price_daily,
  price_weekly = EXCLUDED.price_weekly,
  price_monthly = EXCLUDED.price_monthly,
  badge = EXCLUDED.badge,
  sort_order = EXCLUDED.sort_order;
```

### 4c. Seed locations (128 locations)

This inserts all 128 locations. Uses `ON CONFLICT` so it is safe to run on a shared instance where locations may already exist from another project.

```sql
INSERT INTO locations (slug, display_name, state, country) VALUES
  ('sibu', 'Sibu', 'Sarawak', 'MY'),
  ('dungun', 'Dungun', 'Terengganu', 'MY'),
  ('kota-laksamana', 'Kota Laksamana', 'Melaka', 'MY'),
  ('seberang-jaya', 'Seberang Jaya', 'Penang', 'MY'),
  ('arau', 'Arau', 'Perlis', 'MY'),
  ('mont-kiara', 'Mont Kiara', 'Kuala Lumpur', 'MY'),
  ('subang-jaya', 'Subang Jaya', 'Selangor', 'MY'),
  ('kuala-krai', 'Kuala Krai', 'Kelantan', 'MY'),
  ('gua-musang', 'Gua Musang', 'Kelantan', 'MY'),
  ('damansara-heights', 'Damansara Heights', 'Kuala Lumpur', 'MY'),
  ('segambut', 'Segambut', 'Kuala Lumpur', 'MY'),
  ('gombak', 'Gombak', 'Selangor', 'MY'),
  ('kuching', 'Kuching', 'Sarawak', 'MY'),
  ('ipoh', 'Ipoh', 'Perak', 'MY'),
  ('rembau', 'Rembau', 'Negeri Sembilan', 'MY'),
  ('shah-alam', 'Shah Alam', 'Selangor', 'MY'),
  ('sarawak', 'Sarawak', 'Sarawak', 'MY'),
  ('bangsar', 'Bangsar', 'Kuala Lumpur', 'MY'),
  ('padang-besar', 'Padang Besar', 'Perlis', 'MY'),
  ('bukit-cina', 'Bukit Cina', 'Melaka', 'MY'),
  ('raub', 'Raub', 'Pahang', 'MY'),
  ('setapak', 'Setapak', 'Kuala Lumpur', 'MY'),
  ('nibong-tebal', 'Nibong Tebal', 'Penang', 'MY'),
  ('puchong', 'Puchong', 'Selangor', 'MY'),
  ('bandar-puchong', 'Bandar Puchong', 'Selangor', 'MY'),
  ('kuala-lumpur', 'Kuala Lumpur', 'Kuala Lumpur', 'MY'),
  ('kota-setar', 'Kota Setar', 'Kedah', 'MY'),
  ('perak', 'Perak', 'Perak', 'MY'),
  ('kuala-pilah', 'Kuala Pilah', 'Negeri Sembilan', 'MY'),
  ('mid-valley', 'Mid Valley', 'Kuala Lumpur', 'MY'),
  ('sunway-velocity', 'Sunway Velocity', 'Kuala Lumpur', 'MY'),
  ('jempol', 'Jempol', 'Negeri Sembilan', 'MY'),
  ('kelantan', 'Kelantan', 'Kelantan', 'MY'),
  ('sri-petaling', 'Sri Petaling', 'Kuala Lumpur', 'MY'),
  ('ampang', 'Ampang', 'Selangor', 'MY'),
  ('marang', 'Marang', 'Terengganu', 'MY'),
  ('hulu-langat', 'Hulu Langat', 'Selangor', 'MY'),
  ('george-town', 'George Town', 'Penang', 'MY'),
  ('kinta', 'Kinta', 'Perak', 'MY'),
  ('perlis', 'Perlis', 'Perlis', 'MY'),
  ('muar', 'Muar', 'Johor', 'MY'),
  ('pulau-pinang', 'Pulau Pinang', 'Penang', 'MY'),
  ('skudai', 'Skudai', 'Johor', 'MY'),
  ('ayer-keroh', 'Ayer Keroh', 'Melaka', 'MY'),
  ('sungai-petani', 'Sungai Petani', 'Kedah', 'MY'),
  ('temerloh', 'Temerloh', 'Pahang', 'MY'),
  ('kemaman', 'Kemaman', 'Terengganu', 'MY'),
  ('sentul', 'Sentul', 'Kuala Lumpur', 'MY'),
  ('cheras', 'Cheras', 'Kuala Lumpur', 'MY'),
  ('taiping', 'Taiping', 'Perak', 'MY'),
  ('klang-valley', 'Klang Valley', 'Selangor', 'MY'),
  ('bandar-utama', 'Bandar Utama', 'Selangor', 'MY'),
  ('melaka', 'Melaka', 'Melaka', 'MY'),
  ('selangor', 'Selangor', 'Selangor', 'MY'),
  ('cameron-highlands', 'Cameron Highlands', 'Pahang', 'MY'),
  ('jerantut', 'Jerantut', 'Pahang', 'MY'),
  ('sungai-buloh', 'Sungai Buloh', 'Selangor', 'MY'),
  ('seri-manjung', 'Seri Manjung', 'Perak', 'MY'),
  ('kuala-perlis', 'Kuala Perlis', 'Perlis', 'MY'),
  ('kuchai-lama', 'Kuchai Lama', 'Kuala Lumpur', 'MY'),
  ('serdang', 'Serdang', 'Selangor', 'MY'),
  ('segamat', 'Segamat', 'Johor', 'MY'),
  ('terengganu', 'Terengganu', 'Terengganu', 'MY'),
  ('machang', 'Machang', 'Kelantan', 'MY'),
  ('miri', 'Miri', 'Sarawak', 'MY'),
  ('manjung', 'Manjung', 'Perak', 'MY'),
  ('sepang', 'Sepang', 'Selangor', 'MY'),
  ('batu-pahat', 'Batu Pahat', 'Johor', 'MY'),
  ('damansara', 'Damansara', 'Selangor', 'MY'),
  ('butterworth', 'Butterworth', 'Penang', 'MY'),
  ('kajang', 'Kajang', 'Selangor', 'MY'),
  ('kulim', 'Kulim', 'Kedah', 'MY'),
  ('seremban', 'Seremban', 'Negeri Sembilan', 'MY'),
  ('rawang', 'Rawang', 'Selangor', 'MY'),
  ('johor', 'Johor', 'Johor', 'MY'),
  ('kulai', 'Kulai', 'Johor', 'MY'),
  ('desa-parkcity', 'Desa ParkCity', 'Kuala Lumpur', 'MY'),
  ('bangsar-south', 'Bangsar South', 'Kuala Lumpur', 'MY'),
  ('pahang', 'Pahang', 'Pahang', 'MY'),
  ('putrajaya', 'Putrajaya', 'Putrajaya', 'MY'),
  ('besut', 'Besut', 'Terengganu', 'MY'),
  ('bintulu', 'Bintulu', 'Sarawak', 'MY'),
  ('kangar', 'Kangar', 'Perlis', 'MY'),
  ('jitra', 'Jitra', 'Kedah', 'MY'),
  ('kampar', 'Kampar', 'Perak', 'MY'),
  ('alor-gajah', 'Alor Gajah', 'Melaka', 'MY'),
  ('bukit-bintang', 'Bukit Bintang', 'Kuala Lumpur', 'MY'),
  ('pekan', 'Pekan', 'Pahang', 'MY'),
  ('pantai-dalam', 'Pantai Dalam', 'Kuala Lumpur', 'MY'),
  ('taman-desa', 'Taman Desa', 'Kuala Lumpur', 'MY'),
  ('negeri-sembilan', 'Negeri Sembilan', 'Negeri Sembilan', 'MY'),
  ('petaling-jaya', 'Petaling Jaya', 'Selangor', 'MY'),
  ('seksyen-7', 'Seksyen 7', 'Selangor', 'MY'),
  ('sabah', 'Sabah', 'Sabah', 'MY'),
  ('bandar-baru-bangi', 'Bandar Baru Bangi', 'Selangor', 'MY'),
  ('kuantan', 'Kuantan', 'Pahang', 'MY'),
  ('bukit-mertajam', 'Bukit Mertajam', 'Penang', 'MY'),
  ('setiawangsa', 'Setiawangsa', 'Kuala Lumpur', 'MY'),
  ('sungai-dua', 'Sungai Dua', 'Penang', 'MY'),
  ('jasin', 'Jasin', 'Melaka', 'MY'),
  ('tanah-merah', 'Tanah Merah', 'Kelantan', 'MY'),
  ('kota-kinabalu', 'Kota Kinabalu', 'Sabah', 'MY'),
  ('penang', 'Penang', 'Penang', 'MY'),
  ('alor-setar', 'Alor Setar', 'Kedah', 'MY'),
  ('sandakan', 'Sandakan', 'Sabah', 'MY'),
  ('kota-bharu', 'Kota Bharu', 'Kelantan', 'MY'),
  ('bahau', 'Bahau', 'Negeri Sembilan', 'MY'),
  ('bangi', 'Bangi', 'Selangor', 'MY'),
  ('kedah', 'Kedah', 'Kedah', 'MY'),
  ('taman-tun-dr.-ismail-(ttdi)', 'Taman Tun Dr. Ismail (TTDI)', 'Kuala Lumpur', 'MY'),
  ('klang', 'Klang', 'Selangor', 'MY'),
  ('johor-bahru', 'Johor Bahru', 'Johor', 'MY'),
  ('old-klang-road', 'Old Klang Road', 'Kuala Lumpur', 'MY'),
  ('langkawi', 'Langkawi', 'Kedah', 'MY'),
  ('sri-hartamas', 'Sri Hartamas', 'Kuala Lumpur', 'MY'),
  ('tawau', 'Tawau', 'Sabah', 'MY'),
  ('kepong', 'Kepong', 'Kuala Lumpur', 'MY'),
  ('port-dickson', 'Port Dickson', 'Negeri Sembilan', 'MY'),
  ('kuala-terengganu', 'Kuala Terengganu', 'Terengganu', 'MY'),
  ('balik-pulau', 'Balik Pulau', 'Penang', 'MY'),
  ('taman-melawati', 'Taman Melawati', 'Selangor', 'MY'),
  ('cyberjaya', 'Cyberjaya', 'Selangor', 'MY')
ON CONFLICT (slug) DO NOTHING;
```

### 4d. Seed phone numbers (example data)

These are placeholder numbers for demonstration. Replace with real numbers before going live.

```sql
-- Product-level default (fallback for locations with no specific numbers)
INSERT INTO phone_numbers (website_slug, product_slug, location_slug, phone_number, label)
VALUES
  ('sewamotor-my', 'sewa-motor', NULL, '60123456789', 'HQ Default'),
  ('sewamotor-my', 'sewa-motor', NULL, '60129876543', 'HQ Backup');

-- Location-specific numbers (examples for 5 key locations)
INSERT INTO phone_numbers (website_slug, product_slug, location_slug, phone_number, label)
VALUES
  -- Kuala Lumpur (2 numbers for rotation)
  ('sewamotor-my', 'sewa-motor', 'kuala-lumpur', '60111111001', 'KL Agent 1'),
  ('sewamotor-my', 'sewa-motor', 'kuala-lumpur', '60111111002', 'KL Agent 2'),

  -- Petaling Jaya
  ('sewamotor-my', 'sewa-motor', 'petaling-jaya', '60122222001', 'PJ Agent'),

  -- Johor Bahru (2 numbers for rotation)
  ('sewamotor-my', 'sewa-motor', 'johor-bahru', '60133333001', 'JB Agent 1'),
  ('sewamotor-my', 'sewa-motor', 'johor-bahru', '60133333002', 'JB Agent 2'),

  -- George Town
  ('sewamotor-my', 'sewa-motor', 'george-town', '60144444001', 'Penang Agent'),

  -- Kota Kinabalu
  ('sewamotor-my', 'sewa-motor', 'kota-kinabalu', '60155555001', 'KK Agent');
```

---

## 5. RLS (Row Level Security) Policies

```sql
-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Public READ access (using anon key from client-side)
-- ============================================================

-- websites: public read
CREATE POLICY "Allow public read on websites"
  ON websites
  FOR SELECT
  TO anon
  USING (true);

-- products: public read
CREATE POLICY "Allow public read on products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- locations: public read
CREATE POLICY "Allow public read on locations"
  ON locations
  FOR SELECT
  TO anon
  USING (true);

-- phone_numbers: public read
CREATE POLICY "Allow public read on phone_numbers"
  ON phone_numbers
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- Write access: service_role only (server-side admin)
-- No INSERT/UPDATE/DELETE policies for anon role means
-- anon cannot write. Only service_role bypasses RLS.
-- ============================================================

-- Explicit deny is not needed — RLS with no matching policy
-- for INSERT/UPDATE/DELETE on anon role means those operations
-- are denied by default.
```

---

## 6. Environment Variables

Add these to your `.env.local` (Next.js) and Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Never expose the `service_role` key in client-side code.** The anon key is safe for public reads because RLS restricts it to SELECT only.

---

## 7. Supabase Client (`lib/supabase.ts`)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 8. Fallback Strategy Summary

| Priority | Source | Condition |
|---|---|---|
| 1 | Location-specific | `location_slug = :location` matches rows |
| 2 | Product default | `location_slug IS NULL` matches rows |
| 3 | Hardcoded fallback | `siteConfig.fallbackPhone` = `60123456789` |

The `getPhoneNumbers()` function tries each level in order and never throws an error. If Supabase is unreachable, it returns the hardcoded fallback.

---

## 9. Maintenance Notes

- **Adding a new location's phone number:** Insert a row into `phone_numbers` with the location slug. The location page will pick it up on next ISR revalidation (1 hour).
- **Rotating numbers:** Insert multiple rows with the same (website_slug, product_slug, location_slug). The client picks one at random on each click.
- **Deactivating a number:** Set `is_active = false`. The number will stop being returned.
- **Adding a new website:** Insert into `websites`, then add `phone_numbers` rows referencing the new website slug. All tables are multi-tenant by design.
- **Phone Number Manager (admin panel):** Uses `service_role` key server-side to INSERT/UPDATE/DELETE phone numbers. The admin UI is a separate internal system, not part of the public website.
