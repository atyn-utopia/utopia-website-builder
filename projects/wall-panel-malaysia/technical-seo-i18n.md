# Wall Panel Malaysia — Technical SEO + i18n + Tracking Plan

**Author:** Kimmy (Technical Implementation Specialist)
**Project:** wall-panel-malaysia
**Domain:** `wall-panel-malaysia.vercel.app`
**Tracking key:** `data-website="wall-panel-malaysia.vercel.app"` (must match deployed Vercel domain exactly)
**Locales:** `en` (default, also `x-default`), `ms`, `zh` (Simplified)
**Leads mode:** `single` — fallback `601116655300`
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · next-intl 4 · Inter (Google Fonts)
**Data layer:** `lib/webcore.ts` ONLY — `fetch()` against Supabase REST API with `next.tags`. NO `lib/supabase.ts`. NO time-based ISR.

This document is the single source of truth for **scaffolding, i18n, schema markup, sitemap/robots, the WhatsApp redirect, the `/api/revalidate` webhook, the tracking script, the metadata builders, and the section parity contract.**

---

## 1. Project Scaffold

### 1.1 Local dev port

| Port | Project |
|---|---|
| 3002 | roller-shutter-malaysia, service-aircond-malaysia |
| 3003 | sewa-motor-malaysia |
| 3004 | electric-wheelchair-malaysia, oxihome-malaysia |
| 3005 | admin |
| 3009 | coldroom-malaysia |
| 3010 | cat-rumah-malaysia |
| 3011 | electrician-24-hour |
| 3012 | skylift-malaysia |
| 3015 | katilhospital-24jam |
| 3016 | lorry-sticker |
| **3014** | **wall-panel-malaysia (this project)** |

Port 3013 is intentionally skipped (reserved for the next ad-hoc project). **Wall Panel Malaysia uses port `3014`.**

### 1.2 `package.json`

```json
{
  "name": "wall-panel-malaysia",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3014",
    "build": "next build",
    "start": "next start --port 3014",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.2",
    "next-intl": "^4.8.4",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@next/env": "16.2.2",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

> **Important:** We do **NOT** install `@supabase/supabase-js`. Webcore uses `fetch()` only — the JS client is forbidden because it bypasses the Next.js cache-tag system.

### 1.3 `next.config.ts`

```ts
import { loadEnvConfig } from '@next/env'
import createNextIntlPlugin from 'next-intl/plugin'

// Shared Supabase + tracking env vars live in the repo root .env.local
loadEnvConfig(process.cwd() + '/../..')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.pexels.com' },
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
      { protocol: 'https' as const, hostname: 'static.wixstatic.com' },
      { protocol: 'https' as const, hostname: 'xzydvhzcngpxdbyniliy.supabase.co' },
    ],
  },
}

export default withNextIntl(nextConfig)
```

### 1.4 `tsconfig.json` (mirrors tablechair reference)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### 1.5 `postcss.config.mjs`

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

### 1.6 `middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

The matcher **excludes `/api/`** so the `/api/revalidate` webhook is not rewritten with a locale prefix.

### 1.7 Env symlink + Vercel envs

```bash
# From the project directory:
cd projects/wall-panel-malaysia
ln -sf ../../.env.local .env.local
```

Required Vercel env vars (production environment):

```
NEXT_PUBLIC_SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
SUPABASE_ANON_KEY=<anon_key>
WEBCORE_REVALIDATE_SECRET=<generated_secret>   # MUST be set BEFORE the webhook is configured
```

After adding env vars, **redeploy once** — `loadEnvConfig` reads at build time so a fresh build is required for the values to take effect in the running deployment.

### 1.8 `.gitignore` additions

```
.env*.local
.next/
node_modules/
tsconfig.tsbuildinfo
.vercel
```

---

## 2. i18n — next-intl 4

### 2.1 `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ms', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
```

`localePrefix: 'always'` → every URL is locale-prefixed (`/en`, `/ms`, `/zh`). Bare `/` is rewritten by the middleware to `/en` (or the detected locale).

### 2.2 `i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale
  }

  let messages: Record<string, unknown>
  try {
    messages = (await import(`../messages/${locale}.json`)).default
  } catch {
    messages = (await import(`../messages/${routing.defaultLocale}.json`)).default
  }

  return {
    locale,
    messages,
    timeZone: 'Asia/Kuala_Lumpur',
  }
})
```

### 2.3 Translation namespaces — shape contract

Every JSON file (`messages/en.json`, `messages/ms.json`, `messages/zh.json`) shares the same key structure. Nana fills the strings; Kimmy locks the shape:

```jsonc
{
  "nav": {
    "styles": "Styles",
    "locations": "Locations",
    "process": "Process",
    "blog": "Blog",
    "whatsapp": "WhatsApp Now",
    "skipToContent": "Skip to content"
  },
  "fomo": {
    "label": "Promo ends in",
    "body": "Free installation + From RM25/sqft — limited slots this month",
    "cta": "WhatsApp now",
    "countdownHours": "h",
    "countdownMinutes": "m",
    "countdownSeconds": "s"
  },
  "hero": {
    "eyebrow": null,
    "h1": "Premium Wall Panel Installation Across Malaysia",
    "h2": "Wood · Fluted · PVC · Acoustic · Marble — free installation included, from RM25/sqft.",
    "primaryCta": "WhatsApp Now",
    "secondaryCta": "See styles",
    "trustBadge": "Free installation · From RM25/sqft · Homes + offices",
    "alt": "Wall panel installation Malaysia — premium feature wall finish"
  },
  "usp": {
    "eyebrow": "WHY HOMEOWNERS + OFFICES CHOOSE US",
    "heading": "Three reasons we win the brief",
    "usp1Title": "Free Installation Included",
    "usp1Body": "Every quote includes measurement, installation and finishing — no hidden labour fees.",
    "usp2Title": "5 Premium Styles to Choose",
    "usp2Body": "Wood, Fluted, PVC, Acoustic, and PU Marble — match any interior brief.",
    "usp3Title": "Homes + Offices Nationwide",
    "usp3Body": "From living-room feature walls to boardroom finishes — we cover all 14 states."
  },
  "products": {
    "eyebrow": "STYLE CATALOGUE",
    "heading": "Pick your wall panel finish",
    "subheading": "Seven premium variants — all priced per sqft with free installation.",
    "freeInstallBadge": "Free Installation",
    "priceLabelMarket": "Market",
    "priceLabelOurs": "Ours",
    "priceLabelPromo": "Promo",
    "perSqft": "/sqft",
    "from": "From",
    "ctaBook": "WhatsApp to book",
    "family": {
      "standard": "Standard Wall Panel",
      "marble": "Marble Wall Panel"
    },
    "variants": {
      "wood-wall-panel":            { "name": "Wood Wall Panel",         "tagline": "Warm grain, premium feel.", "alt": "Wood wall panel finish — interior feature wall" },
      "fluted-wall-panel":          { "name": "Fluted Wall Panel",       "tagline": "Vertical lines, modern depth.", "alt": "Fluted wall panel — vertical line design" },
      "pvc-wall-panel":             { "name": "PVC Wall Panel",          "tagline": "Water-resistant, easy clean.", "alt": "PVC wall panel — waterproof finish" },
      "acoustic-wall-panel":        { "name": "Acoustic Wall Panel",     "tagline": "Sound-absorbing studio quality.", "alt": "Acoustic wall panel — sound-absorbing finish" },
      "gold-marble-wall-panel":     { "name": "Gold Marble Wall Panel",  "tagline": "PU marble with warm gold veining.", "alt": "Gold marble wall panel — luxury feature wall" },
      "silver-marble-wall-panel":   { "name": "Silver Marble Wall Panel","tagline": "Cool silver tones, glass-like gloss.", "alt": "Silver marble wall panel — modern luxury finish" },
      "black-marble-wall-panel":    { "name": "Black Marble Wall Panel", "tagline": "Bold black marble with white veining.", "alt": "Black marble wall panel — bold feature wall" }
    }
  },
  "process": {
    "eyebrow": "PROCESS",
    "heading": "Three steps to a finished wall",
    "step1Title": "WhatsApp us your space",
    "step1Body": "Send a photo or video and the rough dimensions — we reply within the hour.",
    "step2Title": "Free measurement + quote",
    "step2Body": "Our installer visits, takes precise measurements and confirms the per-sqft price.",
    "step3Title": "Installation in 3–7 days",
    "step3Body": "Hidden-clip mounting, dust-controlled site, finished and cleaned before we leave."
  },
  "useCase": {
    "eyebrow": "FOR HOME + OFFICE",
    "heading": "Where wall panel earns its keep",
    "homeTitle": "Homeowners",
    "homeBody": "Living-room feature walls, TV consoles, bedroom headboards and statement entryways.",
    "officeTitle": "Office owners",
    "officeBody": "Boardrooms, reception backdrops, cabin walls and acoustic meeting rooms."
  },
  "why": {
    "eyebrow": "PROMISE",
    "heading": "Why Wall Panel Malaysia",
    "p1Title": "Free installation",
    "p1Body": "Quoted as one all-in number per sqft.",
    "p2Title": "Premium 12mm panels",
    "p2Body": "Hidden-clip mount, no visible screws.",
    "p3Title": "Trained installers",
    "p3Body": "Dust-controlled site, finished same week.",
    "p4Title": "Workmanship warranty",
    "p4Body": "Covered against bowing and lifting."
  },
  "gallery": {
    "eyebrow": "INSTALLATIONS",
    "heading": "Real walls we finished",
    "subheading": "Tap any photo to open it full-size.",
    "altPattern": "Wall panel installation {n} — {style}"
  },
  "reviews": {
    "eyebrow": "CUSTOMER VOICE",
    "heading": "What homeowners and offices say",
    "ratingLabel": "Google · 4.9★ · 240+ reviews",
    "seeAllOnGoogle": "See all reviews on Google Business"
  },
  "faq": {
    "eyebrow": "FAQ",
    "heading": "Common questions",
    "items": [
      { "q": "Is installation really free?", "a": "Yes — the per-sqft price already includes site visit, installation, finishing and clean-up." },
      { "q": "What is the minimum area you take?", "a": "We start from 30 sqft. Below that, we still quote but the minimum-call-out fee may apply." },
      { "q": "How long does installation take?", "a": "Most homes finish in 1–2 days; office boardrooms in 2–4 days. We confirm timing in the written quote." },
      { "q": "Do you cover Sabah and Sarawak?", "a": "Yes — every state. East Malaysia jobs add a freight line item on the quote." },
      { "q": "How do I get started?", "a": "WhatsApp us your space and rough size — we reply within the hour and book a free measurement." }
    ]
  },
  "locations": {
    "eyebrow": "COVERAGE",
    "heading": "Wall panel installation across Malaysia",
    "subheading": "150+ towns covered — pick yours below.",
    "byRegion": {
      "klangValley": "Klang Valley",
      "selangor": "Selangor",
      "negeriSembilan": "Negeri Sembilan",
      "melaka": "Melaka",
      "johor": "Johor",
      "perak": "Perak",
      "penang": "Penang",
      "kedah": "Kedah",
      "perlis": "Perlis",
      "kelantan": "Kelantan",
      "terengganu": "Terengganu",
      "pahang": "Pahang",
      "sabah": "Sabah",
      "sarawak": "Sarawak"
    }
  },
  "nearby": {
    "eyebrow": "NEAR YOU",
    "heading": "Wall panel installation near {city}"
  },
  "breadcrumbs": {
    "home": "Home",
    "wallPanel": "Wall Panel",
    "blog": "Blog"
  },
  "finalCta": {
    "eyebrow": "LOCK IN TODAY",
    "heading": "Ready for a premium wall?",
    "body": "WhatsApp us your space — free measurement, written quote, installation included.",
    "cta": "WhatsApp Now",
    "tag1": "Free Installation",
    "tag2": "Lifetime Care",
    "tag3": "Across Malaysia"
  },
  "footer": {
    "tagline": "Premium wall panel installation — homes and offices across Malaysia.",
    "quickLinks": "Quick links",
    "topLocations": "Top locations",
    "styles": "Styles",
    "legal": "© {year} Encik Beku Aircond Sdn. Bhd. All rights reserved.",
    "operatedBy": "Operated by Encik Beku Aircond Sdn. Bhd."
  },
  "blog": {
    "hub": {
      "meta": {
        "title": "Wall Panel Blog — Malaysia | Wall Panel Malaysia",
        "description": "Style guides, cost breakdowns and installation timelines for wall panels in Malaysia."
      },
      "heading": "Wall Panel Journal",
      "subheading": "Style guides, install timelines, and care tips for your wall panel project.",
      "eyebrow": "JOURNAL",
      "readMore": "Read article"
    },
    "post": {
      "back": "All articles",
      "publishedOn": "Published {date}",
      "ctaHeading": "Plan your wall panel project",
      "ctaBody": "WhatsApp us a photo of your space — free measurement and written quote.",
      "ctaButton": "WhatsApp Now",
      "relatedHeading": "Keep reading"
    }
  },
  "redirect": {
    "openingWhatsApp": "Opening WhatsApp…",
    "fallback": "Click here if it did not open"
  },
  "languageSwitcher": {
    "label": "Language",
    "en": "English",
    "ms": "Bahasa Melayu",
    "zh": "中文"
  }
}
```

Nana owns the **string values per locale**. The **key structure above is locked** — every locale file must have the same keys so the LanguageSwitcher never lands on a missing translation.

### 2.4 Location-specific copy lives in `lib/locationCopy.ts`

Per-location intro + FAQ (155 locations × 3 locales = ~465 intros + ~2,325 FAQ entries) is **NOT** stored in `messages/{locale}.json` — that file would balloon. Instead, mirror the tablechair pattern: `lib/locationCopy.ts` exports `getLocationIntro(slug, locale)` and `getLocationFaq(slug, locale)`. Nana writes those tables.

---

## 3. `lib/webcore.ts` — the data layer (MANDATORY single source)

The file's exports, types, and tag conventions match `projects/tablechair-rental-malaysia/lib/webcore.ts` exactly. **No `lib/supabase.ts`, no `lib/getProducts.ts`, no `lib/getPhoneNumber.ts`, no `lib/getBlogPosts.ts` is created.**

```ts
// projects/wall-panel-malaysia/lib/webcore.ts
import { headers } from 'next/headers'
import { siteConfig } from '@/config/site'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[webcore] Missing SUPABASE_URL / SUPABASE_ANON_KEY. Fallback values will be used.')
}

export type WebcoreTag = 'webcore-products' | 'webcore-phones' | 'webcore-blog'

async function webcoreFetch<T>(path: string, tag: WebcoreTag): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
      next: { tags: [tag] },
    })
    if (!res.ok) {
      console.error(`[webcore] ${tag} ${res.status} ${res.statusText} :: ${path}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error(`[webcore] ${tag} fetch error:`, err)
    return null
  }
}

/* ------------------------------------------------------------------
 * Products
 * ------------------------------------------------------------------ */

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number
  is_active: boolean
  parent_id: string | null
  photos: { url: string }[]
}

type ProductRow = Omit<Product, 'photos'> & { product_photos: { url: string }[] | null }

/**
 * Wall Panel Malaysia is a SALE business — rental_price is always NULL.
 * We split on `sale_price !== null` instead of `rental_price !== null`
 * (heads-up from Cyclops' database.md, section 2).
 *
 * Returns `{ core, additional }` to keep the shape parity with other sites.
 * `additional` will normally be empty for this project.
 */
export async function getProducts(): Promise<{ core: Product[]; additional: Product[] }> {
  const path =
    `products?select=*,product_photos(url)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`

  const rows = await webcoreFetch<ProductRow[]>(path, 'webcore-products')
  if (!rows) return { core: [], additional: [] }

  const products: Product[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    sale_price: p.sale_price,
    rental_price: p.rental_price,
    sort_order: p.sort_order,
    is_active: p.is_active,
    parent_id: p.parent_id,
    photos: p.product_photos ?? [],
  }))

  return {
    core: products.filter((p) => p.sale_price !== null),
    additional: products.filter((p) => p.sale_price === null),
  }
}

/* ------------------------------------------------------------------
 * Phone numbers (full 4-mode logic preserved for forward-compat)
 * ------------------------------------------------------------------ */

const FALLBACK_PHONE = siteConfig.fallbackPhone
const FALLBACK_WA_TEXT = siteConfig.whatsappMessages.en

type LeadsMode = 'single' | 'rotation' | 'location' | 'hybrid'

interface PhoneRow {
  phone_number: string
  whatsapp_text: string | null
  percentage: number | null
  label: string | null
  location_slug: string | null
}

export interface PhoneResult {
  phone: string
  whatsappText: string
  source: 'database' | 'fallback'
  mode: LeadsMode | 'fallback'
}

function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined
  if (rows.length === 1) return rows[0]
  const total = rows.reduce((sum, r) => sum + (r.percentage || 1), 0)
  let roll = Math.random() * total
  for (const row of rows) {
    roll -= row.percentage || 1
    if (roll <= 0) return row
  }
  return rows[rows.length - 1]
}

function findDefaultRow(rows: PhoneRow[]): PhoneRow | undefined {
  return rows.find((r) => r.label === 'default')
}

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers()
    const host = h.get('host') || h.get('x-forwarded-host') || ''
    return host.replace(/:\d+$/, '')
  } catch {
    return ''
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  if (!domain) return 'single'
  const path =
    `company_websites?select=leads_mode` +
    `&domain=eq.${encodeURIComponent(domain)}` +
    `&limit=1`
  const data = await webcoreFetch<{ leads_mode: LeadsMode | null }[]>(path, 'webcore-phones')
  return data?.[0]?.leads_mode ?? 'single'
}

async function getPhoneRows(domain: string): Promise<PhoneRow[]> {
  if (!domain) return []
  const path =
    `phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug` +
    `&website=eq.${encodeURIComponent(domain)}` +
    `&is_active=eq.true`
  const data = await webcoreFetch<PhoneRow[]>(path, 'webcore-phones')
  return data ?? []
}

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: 'fallback',
    mode: 'fallback',
  }
}

function toResult(row: PhoneRow | undefined, mode: LeadsMode, host: string): PhoneResult {
  if (!row) return fallbackResult()
  const text = row.whatsapp_text || FALLBACK_WA_TEXT
  return {
    phone: row.phone_number,
    whatsappText: `Hi ${host}, ${text}`,
    source: 'database',
    mode,
  }
}

export async function getPhoneNumber(locationSlug?: string): Promise<PhoneResult> {
  try {
    const domain = await getHostDomain()
    const [mode, rows] = await Promise.all([getLeadsMode(domain), getPhoneRows(domain)])
    if (rows.length === 0) return fallbackResult()

    const defaultRow = findDefaultRow(rows)

    switch (mode) {
      case 'single':
        return toResult(defaultRow ?? rows[0], mode, domain)
      case 'rotation':
        return toResult(pickWeighted(rows), mode, domain)
      case 'location': {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain)
        }
        return toResult(defaultRow, mode, domain)
      }
      case 'hybrid': {
        if (locationSlug && locationSlug !== 'all') {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain)
        }
        return toResult(defaultRow, mode, domain)
      }
      default:
        return toResult(defaultRow, mode, domain)
    }
  } catch (err) {
    console.error('[getPhoneNumber] Unexpected error:', err)
    return fallbackResult()
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${query}`
}

export async function getWhatsAppLink(
  locationSlug?: string,
  messageOverride?: string,
): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug)
  return waLink(phone, messageOverride || whatsappText)
}

/* ------------------------------------------------------------------
 * Blog
 * ------------------------------------------------------------------ */

export interface BlogPostSummary {
  id: string
  slug: string
  cover_image_url: string | null
  published_at: string
  blog_translations: { title: string; excerpt: string }[]
}

export interface BlogPost {
  id: string
  slug: string
  cover_image_url: string | null
  published_at: string
  blog_translations: {
    title: string
    content: string
    excerpt: string
    meta_title: string
    meta_description: string
  }[]
}

export interface RecentBlogPost {
  slug: string
  published_at: string
  blog_translations: { title: string }[]
}

export async function getBlogPosts(locale: string): Promise<BlogPostSummary[]> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,excerpt)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&order=published_at.desc`
  const data = await webcoreFetch<BlogPostSummary[]>(path, 'webcore-blog')
  return data ?? []
}

export async function getBlogPost(slug: string, locale: string): Promise<BlogPost | null> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&slug=eq.${encodeURIComponent(slug)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&limit=1`
  const data = await webcoreFetch<BlogPost[]>(path, 'webcore-blog')
  return data?.[0] ?? null
}

export async function getRecentBlogPosts(
  locale: string,
  exceptSlug: string,
  limit = 3,
): Promise<RecentBlogPost[]> {
  const path =
    `blog_posts?select=slug,published_at,blog_translations!inner(title)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&slug=neq.${encodeURIComponent(exceptSlug)}` +
    `&order=published_at.desc` +
    `&limit=${limit}`
  const data = await webcoreFetch<RecentBlogPost[]>(path, 'webcore-blog')
  return data ?? []
}

export async function getBlogPostSlugs(): Promise<{ slug: string }[]> {
  const path =
    `blog_posts?select=slug` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published`
  const data = await webcoreFetch<{ slug: string }[]>(path, 'webcore-blog')
  return data ?? []
}
```

> The **only** acceptable `revalidate` is `0` (paired with `dynamic = 'force-dynamic'`) on the WhatsApp redirect page. Every other page leaves caching to the fetch tag.

---

## 4. `app/api/revalidate/route.ts` — webhook receiver

```ts
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secret = process.env.WEBCORE_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'WEBCORE_REVALIDATE_SECRET not set' },
      { status: 500 },
    )
  }
  if (req.headers.get('x-webcore-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await req.json().catch(() => null)) as { tags?: string[] } | null
  const tags = Array.isArray(body?.tags) ? body!.tags : []
  if (tags.length === 0) {
    return NextResponse.json({ error: 'No tags provided' }, { status: 400 })
  }
  for (const tag of tags) revalidateTag(tag, 'default')
  return NextResponse.json({ revalidated: tags })
}
```

The webcore admin's Integrations panel must be configured **once** with:
- URL: `https://wall-panel-malaysia.vercel.app/api/revalidate`
- Header: `x-webcore-secret: <same value as WEBCORE_REVALIDATE_SECRET on Vercel>`

---

## 5. WhatsApp Redirect — `app/[locale]/redirect-whatsapp-1/`

### 5.1 Server `page.tsx`

```ts
import { getPhoneNumber, waLink } from '@/lib/webcore'
import RedirectClient from './RedirectClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { loc?: string; message?: string }

export default async function RedirectWhatsapp1Page({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const loc = sp.loc?.trim() || undefined
  const overrideMessage = sp.message?.trim()

  const { phone, whatsappText } = await getPhoneNumber(loc)
  const url = waLink(phone, overrideMessage || whatsappText)

  return <RedirectClient url={url} phone={phone} />
}
```

### 5.2 Client `RedirectClient.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function RedirectClient({
  url,
  phone,
}: {
  url: string
  phone: string
}) {
  const t = useTranslations('redirect')

  useEffect(() => {
    // Track the click BEFORE we leave the page.
    if (typeof window !== 'undefined' && window.uwc) {
      try {
        window.uwc('click', { label: `whatsapp-${phone}` })
      } catch {
        /* swallow — tracking failure must never block the redirect */
      }
    }

    // Open WhatsApp.
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      window.location.href = url
    } else {
      setTimeout(() => {
        if (window.history.length > 1) window.history.back()
        else window.location.href = '/'
      }, 150)
    }
  }, [url, phone])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        background: '#F5EFE6',
        color: '#0E1A40',
      }}
    >
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
          {t('openingWhatsApp')}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '999px',
            background: '#25D366',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
          }}
        >
          {t('fallback')}
        </a>
      </div>
    </div>
  )
}
```

### 5.3 `lib/waRedirect.ts` — helper used by every CTA

```ts
export function waRedirect(
  locale: string,
  message?: string,
  location?: string,
): string {
  const params = new URLSearchParams()
  if (location && location !== 'all') params.set('loc', location)
  if (message) params.set('message', message)
  const qs = params.toString()
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`
}
```

**Every** WhatsApp button on the entire site links through `waRedirect()`. Zero `wa.me/` strings appear in any `.tsx` file (grep-verified before handoff).

---

## 6. `app/sitemap.ts` + `app/robots.ts`

### 6.1 `app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { locations } from '@/config/locations'
import { getBlogPostSlugs } from '@/lib/webcore'
import { siteConfig } from '@/config/site'

const SITE_URL = siteConfig.url            // 'https://wall-panel-malaysia.vercel.app'
const PRODUCT_SLUG = siteConfig.productSlug // 'wall-panel'

function buildLanguages(pathSuffix: string) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${pathSuffix}`
  languages['x-default'] = `${SITE_URL}/en${pathSuffix}`
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  // Homepages
  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: locale === 'en' ? 1.0 : 0.9,
      alternates: { languages: buildLanguages('') },
    })
  }

  // Location pages — every locale × every location
  for (const locale of routing.locales) {
    for (const loc of locations) {
      const suffix = `/${PRODUCT_SLUG}/${loc.slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: locale === 'en' ? 0.8 : 0.7,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  // Blog hub
  for (const locale of routing.locales) {
    const suffix = `/blog`
    entries.push({
      url: `${SITE_URL}/${locale}${suffix}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.7 : 0.6,
      alternates: { languages: buildLanguages(suffix) },
    })
  }

  // Blog posts — pulled from Supabase via webcore (tag-revalidated)
  const slugs = await getBlogPostSlugs()
  for (const locale of routing.locales) {
    for (const { slug } of slugs) {
      const suffix = `/blog/${slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: locale === 'en' ? 0.6 : 0.5,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  return entries
}
```

> **No `export const revalidate = N` on the sitemap.** When Hanabi or the admin publishes a new post, the webhook hits `/api/revalidate` with `webcore-blog`; the sitemap re-renders on its next request and picks up the new slug.

### 6.2 `app/robots.ts`

```ts
import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

const SITE_URL = siteConfig.url

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/*/redirect-whatsapp-1'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
```

The redirect handler is disallowed because it is a JS-driven redirect of no SEO value — keeping it out of the index avoids crawl waste.

---

## 7. Schema Components — `components/schema/*`

Each schema component is a tiny server component that renders `<script type="application/ld+json">…</script>`. They are imported from the page that needs them. The underlying schema builders live in `lib/schema.ts` (single file, mirrors tablechair `lib/schema.ts`).

### Files to create

| File | Purpose | Used by |
|---|---|---|
| `lib/schema.ts` | Pure schema builders (no React) — exports `organizationSchema()`, `websiteSchema(locale)`, `localBusinessHomepageSchema(locale)`, `localBusinessLocationSchema(locale, slug, cityDisplay)`, `productSchemaForLocation(...)`, `productSchemaForHome(...)`, `faqPageSchema(qa)`, `breadcrumbHomeSchema(...)`, `breadcrumbLocationSchema(...)`, `breadcrumbBlogListSchema(...)`, `breadcrumbBlogPostSchema(...)`, `articleSchema(...)`, `blogCollectionSchema(...)`, `itemListLocationsSchema(...)` | All schema components |
| `components/schema/OrganizationSchema.tsx` | Wraps `organizationSchema()` | `app/[locale]/layout.tsx` |
| `components/schema/WebsiteSchema.tsx` | Wraps `websiteSchema(locale)` | Homepage |
| `components/schema/LocalBusinessSchema.tsx` | Wraps `localBusinessHomepageSchema()` (homepage variant) and `localBusinessLocationSchema(locale, slug, cityDisplay)` (location variant) — same component, two call modes | Homepage + each location page |
| `components/schema/ProductSchema.tsx` | Wraps `productSchemaForHome()` / `productSchemaForLocation()` — one `<script>` per product | Homepage + each location page (loops over `products.core`) |
| `components/schema/FaqSchema.tsx` | Wraps `faqPageSchema(qa)` | Homepage + each location page + each blog post (if it has FAQs) |
| `components/schema/BreadcrumbSchema.tsx` | Wraps the breadcrumb builders | Location pages, blog hub, blog post |
| `components/schema/ArticleSchema.tsx` | Wraps `articleSchema(post)` | Each blog post |

### Brand constants used by all builders (`lib/schema.ts`)

```ts
export const SITE_URL = 'https://wall-panel-malaysia.vercel.app'
export const BRAND_NAME = 'Wall Panel Malaysia'
export const LEGAL_NAME = 'Encik Beku Aircond Sdn. Bhd.'
export const BRAND_LOGO = `${SITE_URL}/brand/wall-panel-malaysia-logo.png`
export const BRAND_PHONE = '+60111665530'   // E.164 form for schema only; display is hidden site-wide
export const BRAND_PRICE_RANGE = 'RM25 - RM38 per sqft'

export const STATES_SERVED = [
  'Selangor', 'Kuala Lumpur', 'Putrajaya', 'Johor', 'Negeri Sembilan',
  'Melaka', 'Perak', 'Penang', 'Kedah', 'Perlis', 'Kelantan',
  'Terengganu', 'Pahang', 'Sabah', 'Sarawak',
]
```

> **No phone number is rendered as visible text** anywhere in the site — but `BRAND_PHONE` is allowed inside JSON-LD because schema markup is invisible to humans and search engines expect it for `LocalBusiness`.

### Per-page schema attachment

| Page type | Schemas attached |
|---|---|
| `app/[locale]/layout.tsx` | `OrganizationSchema` |
| Homepage `app/[locale]/page.tsx` | `WebsiteSchema(locale)`, `LocalBusinessSchema(homepage)`, `ProductSchema` (×7 — one per variant), `FaqSchema` (homepage FAQ), `BreadcrumbSchema(home)` (single-item: Home) |
| Location page `app/[locale]/wall-panel/[location]/page.tsx` | `LocalBusinessSchema(location)`, `ProductSchema` (×7), `FaqSchema` (5 location Q&A), `BreadcrumbSchema(location)` |
| Blog hub `app/[locale]/blog/page.tsx` | `BreadcrumbSchema(blogList)`, `blogCollectionSchema` |
| Blog post `app/[locale]/blog/[slug]/page.tsx` | `BreadcrumbSchema(blogPost)`, `ArticleSchema` |

---

## 8. Tracking — Utopia Webcore

### 8.1 `global.d.ts` (project root)

```ts
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void
  }
}
export {}
```

### 8.2 Tracking script — `app/layout.tsx` (root, NOT the locale layout)

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wall-panel-malaysia.vercel.app'),
  title: 'Wall Panel Malaysia — Premium Wall Panel Installation',
  description: 'Wood, Fluted, PVC, Acoustic and PU Marble wall panels installed across Malaysia. Free installation, from RM25/sqft.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website="wall-panel-malaysia.vercel.app"
        />
      </head>
      <body className="bg-[#F5EFE6] text-[#0E1A40] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
```

> `data-website` MUST be the **deployed Vercel domain**, NOT any custom alias. If the alias is set up later, Layla swaps this string in one place.

### 8.3 Event hooks

| Event | Where | Label format |
|---|---|---|
| `click` | Every WhatsApp CTA (in the `RedirectClient` `useEffect`, before the redirect runs) | `whatsapp-{phone}` |
| `impression` | Each product card — fires **once** when ≥50% in view via `IntersectionObserver`, then `observer.disconnect()` | `product-{slug}` |
| `click` | Blog listing card click (anchor onClick) | `blog-{slug}` |

The three tracker components live in `components/tracking/`:

```
components/tracking/
├── WhatsAppClickTracker.tsx       # display:contents wrapper, onClick → window.uwc(...)
├── ProductImpressionTracker.tsx   # IntersectionObserver wrapper, fires once, disconnects
└── BlogClickTracker.tsx           # onClick wrapper for blog cards
```

The WhatsApp tracker wraps any anchor; the impression tracker wraps each `<ProductCard>`; the blog tracker wraps each `<BlogCard>`. The redirect page **also** fires the WhatsApp click event inside `RedirectClient.useEffect` for a belt-and-braces capture in case the user navigates directly to `/redirect-whatsapp-1`.

---

## 9. `config/site.ts`

```ts
export const siteConfig = {
  brandName: 'Wall Panel Malaysia',
  legalName: 'Encik Beku Aircond Sdn. Bhd.',
  companyId: '16e62068-365d-4907-b7f0-763a173d8afa',
  domain: 'wall-panel-malaysia.vercel.app',
  url: 'https://wall-panel-malaysia.vercel.app',
  productSlug: 'wall-panel',
  productName: 'Wall Panel',
  locales: ['en', 'ms', 'zh'] as const,
  defaultLocale: 'en' as const,
  fallbackPhone: '601116655300',
  priceRange: 'RM25 - RM38 per sqft',
  whatsappMessages: {
    en: "Hi Wall Panel Malaysia, I'd like a free measurement and quote for wall panel installation.",
    ms: 'Hi Wall Panel Malaysia, saya nak free measurement dan quote untuk pemasangan wall panel.',
    zh: '你好 Wall Panel Malaysia，我想了解墙板安装的免费测量和报价。',
  },
  colors: {
    navy:     '#0E1A40',   // primary CTA / dark surface
    navyDark: '#0A1430',
    cream:    '#F5EFE6',   // page bg
    cream50:  '#EFE6D8',
    gold:     '#C9A55C',   // accent (marble nod)
    ink:      '#1A1A1A',
    whatsapp: '#25D366',
    whatsappHover: '#1EBE57',
  },
} as const

export type Locale = (typeof siteConfig.locales)[number]
```

> Final palette values are confirmed by Kagura's `design-direction.md`. Kimmy uses `siteConfig.colors.whatsapp` everywhere a WhatsApp button is rendered — never themed with brand navy.

---

## 10. `config/locations.ts` — Malaysia 150–180 cities

**Mandatory before scaffolding any page.** Mirror the **skylift-malaysia** file structure (162 locations, `nearbyMap` adjacency, 14 regions). The architecture's state-by-state seed table is the authoritative city list.

### 10.1 File shape

```ts
export interface Location {
  slug: string
  name: string
  state: string
  stateSlug: string
}

export const regionOrder = [
  'Klang Valley', 'Selangor', 'Negeri Sembilan', 'Melaka', 'Johor',
  'Perak', 'Penang', 'Kedah', 'Perlis', 'Kelantan',
  'Terengganu', 'Pahang', 'Sabah', 'Sarawak',
] as const

export const regionKeys: Record<string, string> = {
  'Klang Valley': 'klangValley',
  'Selangor': 'selangor',
  'Negeri Sembilan': 'negeriSembilan',
  'Melaka': 'melaka',
  'Johor': 'johor',
  'Perak': 'perak',
  'Penang': 'penang',
  'Kedah': 'kedah',
  'Perlis': 'perlis',
  'Kelantan': 'kelantan',
  'Terengganu': 'terengganu',
  'Pahang': 'pahang',
  'Sabah': 'sabah',
  'Sarawak': 'sarawak',
}

export const locations: Location[] = [
  // Klang Valley — 25
  { slug: 'kuala-lumpur',  name: 'Kuala Lumpur',  state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'petaling-jaya', name: 'Petaling Jaya', state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'shah-alam',     name: 'Shah Alam',     state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'subang-jaya',   name: 'Subang Jaya',   state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'puchong',       name: 'Puchong',       state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'cheras',        name: 'Cheras',        state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'ampang',        name: 'Ampang',        state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'kepong',        name: 'Kepong',        state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'setapak',       name: 'Setapak',       state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'wangsa-maju',   name: 'Wangsa Maju',   state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'bangsar',       name: 'Bangsar',       state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'mont-kiara',    name: 'Mont Kiara',    state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'damansara',     name: 'Damansara',     state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'sri-petaling',  name: 'Sri Petaling',  state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'bukit-jalil',   name: 'Bukit Jalil',   state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'cyberjaya',     name: 'Cyberjaya',     state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'putrajaya',     name: 'Putrajaya',     state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'kajang',        name: 'Kajang',        state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'bangi',         name: 'Bangi',         state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'semenyih',      name: 'Semenyih',      state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'rawang',        name: 'Rawang',        state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'selayang',      name: 'Selayang',      state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'gombak',        name: 'Gombak',        state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'klang',         name: 'Klang',         state: 'Klang Valley', stateSlug: 'klang-valley' },
  { slug: 'port-klang',    name: 'Port Klang',    state: 'Klang Valley', stateSlug: 'klang-valley' },

  // Selangor (outside KV) — 10
  // Negeri Sembilan — 10
  // Melaka — 10
  // Johor — 10
  // Perak — 10
  // Penang — 10
  // Kedah — 10
  // Perlis — 10
  // Kelantan — 10
  // Terengganu — 10
  // Pahang — 10
  // Sabah — 10
  // Sarawak — 10
  //
  // [Continue per the architecture seed table — copy the full city set from
  // projects/skylift-malaysia/config/locations.ts (162 entries), removing any
  // skylift-specific slugs and confirming every state has ≥10 sub-locations.]
]

// Manually curated geographic neighbours — used by NearbyLocations and SEO
// internal linking. Each key lists 4–6 closest cities by road distance.
export const nearbyMap: Record<string, string[]> = {
  'kuala-lumpur':  ['petaling-jaya', 'cheras', 'kepong', 'ampang', 'bangsar', 'mont-kiara'],
  'petaling-jaya': ['kuala-lumpur', 'subang-jaya', 'damansara', 'shah-alam', 'kepong'],
  'shah-alam':     ['subang-jaya', 'klang', 'puchong', 'kuala-lumpur', 'port-klang'],
  // … one entry per slug (155+). Copy adjacency from skylift-malaysia/config/locations.ts and adjust.
}

export function getNearbyLocations(slug: string): Location[] {
  const slugs = nearbyMap[slug] ?? []
  return slugs
    .map((s) => locations.find((l) => l.slug === s))
    .filter((l): l is Location => !!l)
}

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug)
}

export function getLocationsByRegion(): Record<string, Location[]> {
  const out: Record<string, Location[]> = {}
  for (const r of regionOrder) out[r] = []
  for (const loc of locations) out[loc.state].push(loc)
  return out
}

// Convenience alias matching the tablechair convention
export const LOCATIONS = locations
```

### 10.2 Lint contract (Layla verifies before deploy)

- `locations.length` is **between 150 and 180** (target ~155).
- Every state in `regionOrder` has **≥10** entries.
- Every slug exists in `nearbyMap` with **4–6** neighbours.
- Every neighbour slug in `nearbyMap` exists in `locations`.
- `generateStaticParams` for `/[locale]/wall-panel/[location]/page.tsx` returns exactly `routing.locales.length × locations.length` entries.

### 10.3 Run before scaffolding any page

```bash
# From the project root
node -e "const {locations} = require('./config/locations.ts'); console.log(locations.length)"
```

Expected: integer between 150 and 180. If not, the file is incomplete and no page may be built.

---

## 11. `config/products.ts` — fallback only

Supabase is the source of truth (CLAUDE.md rule 1). `config/products.ts` exists **only** as a build-time fallback if Supabase is unreachable. The frontend reads from `getProducts()` first; this file is the last-resort copy.

```ts
// Fallback only — do NOT import this from page components.
// Used by lib/webcore.ts only if SUPABASE_URL/KEY are missing.
export const FALLBACK_PRODUCTS = [
  {
    sort_order: 10,
    parent_id: null,
    slug: 'wood-wall-panel',
    name: 'Wood Wall Panel',
    family: 'standard',
    sale_price: 25,
    rental_price: null,
    description: 'Wood finish from our Standard Wall Panel range. Premium 12mm panels with hidden-clip mounting and free installation across Malaysia.',
  },
  {
    sort_order: 20,
    parent_id: null,
    slug: 'fluted-wall-panel',
    name: 'Fluted Wall Panel',
    family: 'standard',
    sale_price: 25,
    rental_price: null,
    description: 'Fluted finish from our Standard Wall Panel range. Vertical-line profile that adds modern depth to feature walls — free installation across Malaysia.',
  },
  {
    sort_order: 30,
    parent_id: null,
    slug: 'pvc-wall-panel',
    name: 'PVC Wall Panel',
    family: 'standard',
    sale_price: 25,
    rental_price: null,
    description: 'PVC finish from our Standard Wall Panel range. Water-resistant and easy to clean — ideal for kitchens and wet zones. Free installation included.',
  },
  {
    sort_order: 40,
    parent_id: null,
    slug: 'acoustic-wall-panel',
    name: 'Acoustic Wall Panel',
    family: 'standard',
    sale_price: 25,
    rental_price: null,
    description: 'Acoustic finish from our Standard Wall Panel range. Sound-absorbing core with felt face — perfect for home cinemas and meeting rooms. Free installation included.',
  },
  {
    sort_order: 50,
    parent_id: null,
    slug: 'gold-marble-wall-panel',
    name: 'Gold Marble Wall Panel',
    family: 'marble',
    sale_price: 38,
    rental_price: null,
    description: 'Gold finish from our Marble Wall Panel range. PU marble texture with gloss top-coat, suitable for feature walls in homes and offices.',
  },
  {
    sort_order: 60,
    parent_id: null,
    slug: 'silver-marble-wall-panel',
    name: 'Silver Marble Wall Panel',
    family: 'marble',
    sale_price: 38,
    rental_price: null,
    description: 'Silver finish from our Marble Wall Panel range. PU marble texture with cool grey veining and a glass-like gloss.',
  },
  {
    sort_order: 70,
    parent_id: null,
    slug: 'black-marble-wall-panel',
    name: 'Black Marble Wall Panel',
    family: 'marble',
    sale_price: 38,
    rental_price: null,
    description: 'Black finish from our Marble Wall Panel range. Bold black marble with white veining — a confident statement for entryways and boardrooms.',
  },
] as const

// Anchor prices NOT in the DB — frontend constants for the Market → Our → Promo display.
export const PRICE_ANCHORS = {
  standard: { market: 50, ours: 30, promo: 25 },
  marble:   { market: 48, ours: 48, promo: 38 },
} as const
```

---

## 12. `components/LanguageSwitcher.tsx`

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'

const LABELS: Record<(typeof routing.locales)[number], string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
  zh: '中文',
}

const SHORT: Record<(typeof routing.locales)[number], string> = {
  en: 'EN',
  ms: 'MS',
  zh: 'ZH',
}

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as (typeof routing.locales)[number]
  const pathname = usePathname() || '/'
  const t = useTranslations('languageSwitcher')

  const segments = pathname.split('/').filter(Boolean)
  const rest = routing.locales.includes(
    segments[0] as (typeof routing.locales)[number],
  )
    ? '/' + segments.slice(1).join('/')
    : pathname
  const cleanRest = rest === '/' ? '' : rest

  return (
    <div className="relative group">
      <button
        type="button"
        aria-label={t('label')}
        aria-haspopup="listbox"
        aria-expanded="false"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#0E1A40]/15 bg-white/85 px-3 py-1.5 text-sm font-medium text-[#0E1A40] hover:border-[#0E1A40]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A55C] min-h-[44px]"
        style={{ transition: 'transform 200ms ease, border-color 200ms ease' }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 0 20" />
          <path d="M12 2a15.3 15.3 0 0 0 0 20" />
        </svg>
        <span>{SHORT[currentLocale]}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <ul
        role="listbox"
        className="invisible absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-[#0E1A40]/15 bg-white opacity-0 shadow-[0_12px_30px_-12px_rgba(14,26,64,0.35)] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        style={{ transition: 'opacity 200ms ease' }}
      >
        {routing.locales.map((l) => {
          const isActive = l === currentLocale
          return (
            <li key={l}>
              <Link
                href={`/${l}${cleanRest}`}
                lang={l}
                className={
                  'block px-4 py-2.5 text-sm min-h-[44px] flex items-center ' +
                  (isActive
                    ? 'bg-[#0E1A40] font-semibold text-white'
                    : 'text-[#0E1A40] hover:bg-[#F5EFE6]')
                }
                style={{ transition: 'background-color 150ms ease' }}
              >
                {LABELS[l]}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

Pure CSS dropdown — no `useState`. Active locale highlighted with brand navy.

---

## 13. Metadata Strategy

### 13.1 `app/[locale]/layout.tsx` — generates the homepage metadata + global hreflang base

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import OrganizationSchema from '@/components/schema/OrganizationSchema'

const SITE_URL = siteConfig.url

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Params = { locale: string }

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) return {}
  const t = await getTranslations({ locale, namespace: 'hero' })
  const tMeta = await getTranslations({ locale, namespace: 'home.meta' }).catch(() => null)

  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`
  languages['x-default'] = `${SITE_URL}/en`

  const title = tMeta?.('title') ?? `${siteConfig.brandName} — ${t('h1')}`
  const description = tMeta?.('description') ?? t('h2')

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${siteConfig.brandName}` },
    description,
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      title,
      description,
      siteName: siteConfig.brandName,
      locale,
      images: [`${SITE_URL}/og/og-home.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og/og-home.jpg`],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound()
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <OrganizationSchema />
      {children}
    </NextIntlClientProvider>
  )
}
```

### 13.2 Homepage `app/[locale]/page.tsx`

`generateMetadata` is inherited from the locale layout — homepage uses the layout's metadata as-is.

### 13.3 Location page `app/[locale]/wall-panel/[location]/page.tsx`

```ts
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { locations, getLocationBySlug } from '@/config/locations'
import { getLocationIntro } from '@/lib/locationCopy'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    locations.map((loc) => ({ locale, location: loc.slug })),
  )
}

type RouteParams = { locale: string; location: string }

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { locale, location } = await params
  const loc = getLocationBySlug(location)
  if (!loc) return {}

  // Title/description templates from Nana's copy-locations.md (per-locale)
  const intro = getLocationIntro(location, locale)   // returns { metaTitle, metaDescription, ... }
  const SITE_URL = siteConfig.url
  const path = `/wall-panel/${location}`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${path}`
  languages['x-default'] = `${SITE_URL}/en${path}`

  return {
    title: intro.metaTitle,
    description: intro.metaDescription,
    alternates: { canonical: `${SITE_URL}/${locale}${path}`, languages },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}${path}`,
      title: intro.metaTitle,
      description: intro.metaDescription,
      siteName: siteConfig.brandName,
      locale,
      images: [`${SITE_URL}/og/og-location-${loc.stateSlug}.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: intro.metaTitle,
      description: intro.metaDescription,
      images: [`${SITE_URL}/og/og-location-${loc.stateSlug}.jpg`],
    },
  }
}
```

### 13.4 Blog hub + blog post

```ts
// app/[locale]/blog/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog.hub.meta' })
  const path = '/blog'
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${siteConfig.url}/${l}${path}`
  languages['x-default'] = `${siteConfig.url}/en${path}`
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `${siteConfig.url}/${locale}${path}`, languages },
  }
}

// app/[locale]/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getBlogPost(slug, locale)
  if (!post) return {}
  const translation = post.blog_translations[0]
  const path = `/blog/${slug}`
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${siteConfig.url}/${l}${path}`
  languages['x-default'] = `${siteConfig.url}/en${path}`
  return {
    title: translation.meta_title,
    description: translation.meta_description,
    alternates: { canonical: `${siteConfig.url}/${locale}${path}`, languages },
    openGraph: {
      type: 'article',
      url: `${siteConfig.url}/${locale}${path}`,
      title: translation.meta_title,
      description: translation.meta_description,
      siteName: siteConfig.brandName,
      locale,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      publishedTime: post.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: translation.meta_title,
      description: translation.meta_description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}
```

### 13.5 hreflang rules

- Every page emits `en`, `ms`, `zh`, AND `x-default → /en/...` (4 alternates total).
- Canonical always uses HTTPS + the production domain.
- Locale-specific paths must round-trip: `/{locale}/{...rest}` exists for every locale.

---

## 14. Section Parity Contract

Homepage and **every** location page MUST render the SAME sections in the SAME order. The only allowed deviations are explicit add-ins on location pages.

### 14.1 Order

```
1.  FomoBanner          (sticky, top of viewport — red/black bg, live countdown)
2.  InlineHeader        (logo + nav + LanguageSwitcher + WhatsApp CTA)
3.  Breadcrumbs         (LOCATION PAGES ONLY)
4.  HeroSection         (single H1 + single H2 + WhatsApp CTA + hero image)
5.  UspBar              (MANDATORY 3 points)
6.  ProductGrid         (7 products from getProducts(), Free Installation badge per card)
7.  PromoPricingSection (Market → Our → Promo anchor block)
8.  StyleGallery        (5 style swatches — Wood / Fluted / PVC / Acoustic / Marble Gold/Silver/Black)
9.  ProcessSection      (3 steps)
10. UseCaseSplit        (Home owner | Office owner two-column)
11. TrustSection        (Free installation, premium materials, trained installers, warranty)
12. CustomerGallery     (no empty grid slots)
13. FaqSection          (homepage: 6–8 Q&A;  location: 5 unique location Q&A)
14. LocationCloud       (HOMEPAGE ONLY)
14b. NearbyLocations    (LOCATION PAGES ONLY — 4–6 nearest from nearbyMap)
15. FinalCta            (image/dark bg, 3 trust tags, WhatsApp CTA)
16. InlineFooter        (no phone number / domain text visible)
17. FloatingWhatsApp    (sticky FAB)
```

### 14.2 Heading lint rules (Kimmy + Layla verify)

- Exactly **one** `<h1>` per page (hero title).
- Exactly **one** `<h2>` per page (hero subtitle).
- Every section heading is `<h3>`–`<h6>`.
- Every section heading has an `.eyebrow` ALL-CAPS mono label immediately above it. The hero H1/H2 are the only exception.
- No keyword phrases (`wall panel`, city names, `marble`, `acoustic`, etc.) inside `<h5>` or `<h6>`.
- No `<p>` orphan paragraphs — every `<p>` sits inside a section that has a heading.

### 14.3 Layout ownership rule

`app/[locale]/layout.tsx` renders ONLY: `<NextIntlClientProvider>`, `<OrganizationSchema />`, and `{children}`. **No** header, footer, FomoBanner, FloatingWhatsApp, or schema specific to one page. Each page imports those chrome components itself.

---

## 15. Webcore curl verification (Layla runs after deploy)

Once Vercel sets `WEBCORE_REVALIDATE_SECRET` and the deployment finishes, run:

```bash
SECRET=$(vercel env pull --environment=production /dev/stdout 2>/dev/null | grep WEBCORE_REVALIDATE_SECRET | cut -d= -f2)

curl -i -X POST https://wall-panel-malaysia.vercel.app/api/revalidate \
  -H "x-webcore-secret: $SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-products"]}'
```

| Response | Meaning |
|---|---|
| `200 {"revalidated":["webcore-products"]}` | All good — products will refetch on next page request. |
| `401 Unauthorized` | Secret mismatch. Verify the Vercel env var and the value you send. |
| `500 WEBCORE_REVALIDATE_SECRET not set` | Env var missing on the deployment. Redeploy after `vercel env add`. |
| `404` | Route handler missing — `app/api/revalidate/route.ts` not in the deployed build. |
| `400 No tags provided` | Body is empty or `tags` is not an array. |

Repeat for the other two tags to confirm full wiring:

```bash
curl -i -X POST https://wall-panel-malaysia.vercel.app/api/revalidate \
  -H "x-webcore-secret: $SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-phones"]}'

curl -i -X POST https://wall-panel-malaysia.vercel.app/api/revalidate \
  -H "x-webcore-secret: $SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-blog"]}'
```

Finally, configure the webcore admin Integrations panel:
- **Webhook URL:** `https://wall-panel-malaysia.vercel.app/api/revalidate`
- **Header:** `x-webcore-secret: <value matches Vercel env>`

Trigger any product edit in the admin and confirm a 200 in the Vercel function logs.

---

## 16. Alt-text catalogue (image accessibility)

Every `<img>` and `<Image>` on the site uses translated alt text via `t()`:

| Image | Translation key | Default (EN) |
|---|---|---|
| Hero photo | `hero.alt` | Wall panel installation Malaysia — premium feature wall finish |
| Location hero | derived: `Wall panel installation in {city} — Wall Panel Malaysia` (built in page component) | — |
| Product card (×7) | `products.variants.{slug}.alt` | e.g. Wood wall panel finish — interior feature wall |
| Style gallery (×7) | reuses `products.variants.{slug}.alt` | — |
| Customer gallery (n photos) | `gallery.altPattern` with `{n}` and `{style}` substituted | Wall panel installation 3 — wood feature wall |
| Logo (in nav + footer) | parent `<a aria-label="{siteConfig.brandName} homepage">` | — |

Decorative SVG icons (chevrons, arrows, USP icons, social icons) get `aria-hidden="true"`. The WhatsApp icon is decorative because the button label "WhatsApp Now" already provides context.

---

## 17. Files Kimmy creates (manifest)

```
projects/wall-panel-malaysia/
├── .env.local → ../../.env.local                          # symlink (step 1.7)
├── .gitignore
├── package.json                                            # § 1.2
├── next.config.ts                                          # § 1.3
├── tsconfig.json                                           # § 1.4
├── postcss.config.mjs                                      # § 1.5
├── middleware.ts                                           # § 1.6
├── global.d.ts                                             # § 8.1
├── eslint.config.mjs                                       # standard next/core-web-vitals
├── i18n/
│   ├── routing.ts                                          # § 2.1
│   └── request.ts                                          # § 2.2
├── messages/
│   ├── en.json                                             # § 2.3 (shape locked; Nana fills strings)
│   ├── ms.json
│   └── zh.json
├── lib/
│   ├── webcore.ts                                          # § 3
│   ├── waRedirect.ts                                       # § 5.3
│   ├── schema.ts                                           # § 7
│   └── locationCopy.ts                                     # § 2.4 (Nana fills tables)
├── config/
│   ├── site.ts                                             # § 9
│   ├── locations.ts                                        # § 10 (mirror skylift, ≥150)
│   └── products.ts                                         # § 11 (fallback only)
├── components/
│   ├── LanguageSwitcher.tsx                                # § 12
│   ├── tracking/
│   │   ├── WhatsAppClickTracker.tsx
│   │   ├── ProductImpressionTracker.tsx
│   │   └── BlogClickTracker.tsx
│   └── schema/
│       ├── OrganizationSchema.tsx
│       ├── WebsiteSchema.tsx
│       ├── LocalBusinessSchema.tsx
│       ├── ProductSchema.tsx
│       ├── FaqSchema.tsx
│       ├── BreadcrumbSchema.tsx
│       └── ArticleSchema.tsx
└── app/
    ├── layout.tsx                                          # § 8.2
    ├── globals.css                                         # Tailwind v4 + brand tokens + .eyebrow + .blog-content
    ├── icon.svg                                            # Favicon (same icon as the Wall Panel Malaysia logo)
    ├── robots.ts                                           # § 6.2
    ├── sitemap.ts                                          # § 6.1
    ├── api/
    │   └── revalidate/
    │       └── route.ts                                    # § 4
    └── [locale]/
        ├── layout.tsx                                      # § 13.1
        ├── not-found.tsx
        ├── page.tsx                                        # Homepage (Kagura assembles; Kimmy wires schema + tracking)
        ├── HomePageClient.tsx
        ├── wall-panel/
        │   └── [location]/
        │       ├── page.tsx                                # § 13.3 — generateStaticParams + generateMetadata
        │       └── LocationPageClient.tsx
        ├── blog/
        │   ├── page.tsx                                    # § 13.4 hub
        │   └── [slug]/
        │       └── page.tsx                                # § 13.4 post
        └── redirect-whatsapp-1/
            ├── page.tsx                                    # § 5.1
            └── RedirectClient.tsx                          # § 5.2
```

---

## 18. Pre-handoff checklist (Kimmy + Layla)

- [ ] Port 3014 set in `package.json` (`next dev --port 3014`)
- [ ] `.env.local` symlinked to repo root
- [ ] `WEBCORE_REVALIDATE_SECRET` added to Vercel production env and project redeployed
- [ ] `lib/webcore.ts` is the only data-layer file — `grep -r "from '@/lib/supabase'"` returns zero matches; `grep -r "from '@/lib/getProducts'"` returns zero matches; `grep -r "from '@/lib/getPhoneNumber'"` returns zero matches
- [ ] No `export const revalidate = ` anywhere except `redirect-whatsapp-1/page.tsx` (which is `0`) — `grep -rn "export const revalidate" app/` returns one match only
- [ ] Every `fetch()` in `lib/webcore.ts` carries `next: { tags: ['webcore-products' | 'webcore-phones' | 'webcore-blog'] }`
- [ ] `app/api/revalidate/route.ts` returns `200` to the curl test (§ 15) and `401` without the secret
- [ ] Tracking script in `app/layout.tsx` with `data-website="wall-panel-malaysia.vercel.app"`
- [ ] `global.d.ts` declares `window.uwc`
- [ ] WhatsApp click tracker wraps every WhatsApp CTA; product impression tracker wraps every `<ProductCard>`; blog click tracker wraps every `<BlogCard>`
- [ ] `grep -rn "wa.me/" app/ components/` returns zero matches (every WhatsApp link goes through `waRedirect()`)
- [ ] `config/locations.ts` has 150–180 entries with ≥10 per state and a complete `nearbyMap`
- [ ] Sitemap emits `3 + 3×155 + 3 + 3×N_blog` URLs, each with `alternates.languages` for `en`/`ms`/`zh`/`x-default`
- [ ] Robots disallows `/api/` and `/*/redirect-whatsapp-1`, points sitemap at `${SITE_URL}/sitemap.xml`
- [ ] Every page has exactly one `<h1>` and one `<h2>` (hero); all other section headings are `<h3>`–`<h6>` with an `.eyebrow` above them
- [ ] Every `<img>` has a translated `alt`; decorative SVGs use `aria-hidden="true"`
- [ ] `LanguageSwitcher` is CSS-only (no `useState`) and preserves the rest of the pathname when swapping locale
- [ ] Schema files validate against [schema.org](https://validator.schema.org/) — no made-up properties
- [ ] Homepage **and every location page** render the exact 17-section order in § 14.1 (no missing sections, no swapped order)
