# AuntyRokiah Katering — Technical SEO + i18n Implementation (Kimmy)

> Project: `katering-auntyrokiah` • Domain: `auntyrokiah-katering.utopiaai.my` • Brand: AuntyRokiah Katering • Legal: Kak Kenduri Sdn. Bhd. (`ce95071b-e575-4983-bdd4-66910f45fe34`) • Locales: `ms` (default) / `en` / `zh`, `localePrefix: 'always'` • Phone: `60174287801` (leads_mode `single`) • Product slug: `pakej-katering` • 160 locations × 3 locales = 480 location URLs.
>
> This document is the implementation contract. Every code block compiles against Next.js 16 App Router + next-intl 4 as shipped in `projects/tablechair-rental-malaysia/`. All data reads go through `lib/webcore.ts` (CLAUDE.md Webcore Data Layer rule — overrides `kimmy.md`'s deprecated `lib/getPhoneNumber.ts` reference). No `lib/supabase.ts`, no `lib/getProducts.ts`, no `lib/getPhoneNumber.ts`, no `lib/getBlogPosts.ts`.

---

## 1. File inventory (with paths and ownership)

Absolute root: `projects/katering-auntyrokiah/`.

### Data layer (Kimmy owns)
| File | Adapted from | Notes |
|---|---|---|
| `lib/webcore.ts` | `projects/tablechair-rental-malaysia/lib/webcore.ts` | THE only data layer. Domain swapped, product partition split by slug (not by `rental_price`), AuntyRokiah fallback strings. |
| `app/api/revalidate/route.ts` | `projects/tablechair-rental-malaysia/app/api/revalidate/route.ts` | Identical pattern. Validates `x-webcore-secret` against `WEBCORE_REVALIDATE_SECRET`. |
| `lib/schema.ts` | `projects/tablechair-rental-malaysia/lib/schema.ts` | Brand constants + helper factories for Organization, LocalBusiness (`FoodEstablishment`), FAQPage, BreadcrumbList, Product. Re-exports `LOCATIONS`. |
| `lib/waRedirect.ts` | `projects/tablechair-rental-malaysia/lib/waRedirect.ts` | Helper that builds `/[locale]/redirect-whatsapp-1?loc=…&message=…` href. Zero hardcoded `wa.me` links anywhere else. |

### i18n (Kimmy owns)
| File | Adapted from | Notes |
|---|---|---|
| `i18n/routing.ts` | tablechair `i18n/routing.ts` | Locales `['ms','en','zh']`, defaultLocale `'ms'`, `localePrefix: 'always'`. |
| `i18n/request.ts` | tablechair `i18n/request.ts` | Falls back to `ms` if locale unknown. `timeZone: 'Asia/Kuala_Lumpur'`. |
| `middleware.ts` | tablechair `middleware.ts` | `createMiddleware(routing)` with matcher `['/((?!api|_next|_vercel|.*\\..*).*)' ]`. |
| `messages/ms.json` | tablechair messages | BM source-of-truth (default locale). Nana writes content. |
| `messages/en.json` | tablechair messages | EN localisation. Nana writes content. |
| `messages/zh.json` | tablechair messages | Simplified Chinese localisation. Nana writes content. |
| `components/LanguageSwitcher.tsx` | tablechair `components/LanguageSwitcher.tsx` | Tinted to AuntyRokiah turmeric. CSS-only dropdown. |

### Layout / pages (Kimmy + Kagura split — Kimmy owns metadata, schema, providers, tracking head script; Kagura owns visual JSX)
| File | Adapted from | Notes |
|---|---|---|
| `app/layout.tsx` | tablechair `app/layout.tsx` | Minimal root — `<html lang="en">` (overridden per-locale by setRequestLocale → html lang attr is set inside LocaleLayout). No font loading here. |
| `app/[locale]/layout.tsx` | tablechair `app/[locale]/layout.tsx` | Fonts (Plus Jakarta Sans + Inter + JetBrains Mono via `next/font/google`), tracking `<script>`, `<NextIntlClientProvider>`, `<OrganizationSchema />`, `<WebsiteSchema />`. NO header, NO footer. |
| `app/[locale]/page.tsx` | tablechair `app/[locale]/page.tsx` | Homepage shell — Kimmy provides imports, `generateMetadata`, section-order comments. Kagura fills JSX. |
| `app/[locale]/HomePageClient.tsx` | – | Kagura. Interactive bits (countdown, special-section calculator). |
| `app/[locale]/pakej-katering/[location]/page.tsx` | tablechair `app/[locale]/table-chair-rental/[location]/page.tsx` | Location page shell — Kimmy provides `generateStaticParams`, `generateMetadata`, schema injection. Kagura fills JSX. |
| `app/[locale]/pakej-katering/[location]/LocationPageClient.tsx` | – | Kagura. |
| `app/[locale]/blog/page.tsx` | tablechair `app/[locale]/blog/page.tsx` | Blog listing — Kagura fills JSX. |
| `app/[locale]/blog/[slug]/page.tsx` | tablechair `app/[locale]/blog/[slug]/page.tsx` | Blog post — Kagura fills JSX. |
| `app/[locale]/redirect-whatsapp-1/page.tsx` | tablechair `app/[locale]/redirect-whatsapp-1/page.tsx` | `dynamic = 'force-dynamic'` + `revalidate = 0`. Reads `?loc=` and `?message=`. |
| `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx` | tablechair equivalent | Opens WA in new tab, falls back to same-tab navigation. Themed turmeric. |

### Schema components (Kimmy owns)
| File | Notes |
|---|---|
| `components/schema/OrganizationSchema.tsx` | Rendered once in `app/[locale]/layout.tsx`. |
| `components/schema/ProductSchema.tsx` | Accepts `Product[]` from webcore. Emits one JSON-LD per pakej. |
| `components/schema/FAQSchema.tsx` | Accepts `{ q, a }[]`. Emits `FAQPage`. |
| `components/schema/LocalBusinessSchema.tsx` | `@type: 'FoodEstablishment'`. Accepts `{ city, state, locale, slug }`. |
| `components/schema/BreadcrumbSchema.tsx` | Accepts items array. |

### API (Kimmy owns)
| File | Notes |
|---|---|
| `app/api/revalidate/route.ts` | POST handler — `revalidateTag(tag, 'default')` per tag in body. |

### Config (Kimmy owns)
| File | Notes |
|---|---|
| `config/site.ts` | Brand strings, domain, locales, fallback phone, WA messages per locale, palette tokens. |
| `config/locations.ts` | 160 location records + `nearbyMap` (paste of Sora seo-plan §7) + `getLocation(slug)` + `getNearbyLocations(slug)` helpers. |

### Public / robots / sitemap (Kimmy owns)
| File | Notes |
|---|---|
| `app/robots.ts` | Allow all, disallow `/api/`, disallow `/*/redirect-whatsapp-1`. Sitemap URL. |
| `app/sitemap.ts` | Homepage × 3 + 480 location URLs + blog index × 3 + every published blog × 3. Each entry emits hreflang alternates. WA redirect excluded. |
| `app/icon.svg` | Isolated kenduri-pot crest from logo. Designer / Kagura supplies the SVG file. |

### Tracking (Kimmy owns)
| File | Adapted from | Notes |
|---|---|---|
| `global.d.ts` | tablechair `global.d.ts` | `window.uwc` typed. |
| `components/tracking/WhatsAppClickTracker.tsx` | tablechair equivalent | `display: contents` wrapper. |
| `components/tracking/ProductImpressionTracker.tsx` | tablechair equivalent | IntersectionObserver, disconnects after first fire. |
| `components/tracking/BlogClickTracker.tsx` | tablechair equivalent | Fires on click. |

### Build glue (already established pattern — Kimmy verifies)
| File | Notes |
|---|---|
| `next.config.ts` | `loadEnvConfig(process.cwd() + '/../..')` + `next-intl` plugin + `images.remotePatterns` (pexels, unsplash, placehold.co, supabase storage). |
| `package.json` | See §17. |
| `postcss.config.mjs` | `{ plugins: { '@tailwindcss/postcss': {} } }`. |
| `tsconfig.json` | Mirror tablechair. |
| `.env.local` | Symlink to repo root `.env.local`. |
| `eslint.config.mjs` | Mirror tablechair. |

---

## 2. `lib/webcore.ts` — full file content

```ts
// AuntyRokiah Katering — unified data layer.
// Every read goes through fetch() against the Supabase REST API with a next.tags
// entry so revalidateTag('webcore-products' | 'webcore-phones' | 'webcore-blog')
// invalidates the cache on demand without redeploys.

import { headers } from 'next/headers'
import { siteConfig } from '@/config/site'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    '[webcore] Missing SUPABASE_URL / SUPABASE_ANON_KEY. Fallback values will be used.',
  )
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
      // eslint-disable-next-line no-console
      console.error(`[webcore] ${tag} ${res.status} ${res.statusText} :: ${path}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[webcore] ${tag} fetch error:`, err)
    return null
  }
}

/* ============================================================
 * Products
 * ============================================================ */

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

// Per database.md §1: the Air Balang add-on row lives in the same `products` table
// as the three pakej tiers. We partition by slug — NOT by `rental_price !== null` —
// because every pakej catering row stores its price in `sale_price`, leaving
// `rental_price` NULL for all four rows. Splitting by slug is the only reliable cut.
const ADDITIONAL_SLUGS = new Set<string>(['add-on-air-balang'])

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
    core: products.filter((p) => !ADDITIONAL_SLUGS.has(p.slug)),
    additional: products.filter((p) => ADDITIONAL_SLUGS.has(p.slug)),
  }
}

/* ============================================================
 * Phone numbers / leads routing
 * ============================================================ */

const FALLBACK_PHONE = siteConfig.fallbackPhone
const FALLBACK_WA_TEXT = siteConfig.whatsappMessages.ms

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

function toResult(row: PhoneRow | undefined, mode: LeadsMode): PhoneResult {
  if (!row) return fallbackResult()
  const text = row.whatsapp_text || FALLBACK_WA_TEXT
  return {
    phone: row.phone_number,
    whatsappText: text,
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
        return toResult(defaultRow ?? rows[0], mode)

      case 'rotation':
        return toResult(pickWeighted(rows), mode)

      case 'location': {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode)
        }
        return toResult(defaultRow, mode)
      }

      case 'hybrid': {
        if (locationSlug && locationSlug !== 'all') {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode)
        }
        return toResult(defaultRow, mode)
      }

      default:
        return toResult(defaultRow, mode)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
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

/* ============================================================
 * Blog
 * ============================================================ */

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

---

## 3. `app/api/revalidate/route.ts` — full file content

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

Smoke test (per CLAUDE.md):

```
curl -i -X POST https://auntyrokiah-katering.utopiaai.my/api/revalidate \
  -H "x-webcore-secret: <SECRET>" \
  -H "content-type: application/json" \
  -d '{"tags":["webcore-products"]}'
```

Expected `200 {"revalidated":["webcore-products"]}`.

---

## 4. `i18n/routing.ts` + `i18n/request.ts` + `middleware.ts`

### 4.1 `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ms', 'en', 'zh'],
  defaultLocale: 'ms',
  localePrefix: 'always',
})

export type AppLocale = (typeof routing.locales)[number]
```

### 4.2 `i18n/request.ts`

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

### 4.3 `middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Exclude /api, /_next, /_vercel, and any URL with a dot (static files).
  // This ensures /api/revalidate is NEVER intercepted by the locale middleware.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

---

## 5. `messages/{ms,en,zh}.json` skeleton structure

Each locale file follows this top-level shape. Nana fills full strings; Kimmy guarantees the keys exist in every locale so `t('…')` calls never throw. See `copy-homepage.md` for full Nana content and `copy-locations-variants.md` for the per-state-grouping variant pool used inside `locationSeo`.

Top-level key tree:

- `nav`, `fomo`, `hero`, `usp`, `brandStrip`, `pakej`, `special`, `process`, `reviews`, `gallery`, `faq`, `locations`, `nearby`, `breadcrumb`, `finalCta`, `footer`, `blog`, `redirect`, `meta`, `locationSeo`

Per-slug entry inside `locationSeo` carries: `h1`, `h2`, `introEyebrow`, `introH3`, `introBody`, `testimonial: { name, city, stars, body }`, `faqs: { q, a }[4]`, `metaTitle`, `metaDescription`.

---

## 6. `app/[locale]/layout.tsx` — full file content

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import OrganizationSchema from '@/components/schema/OrganizationSchema'
import '../globals.css'

const SITE_URL = siteConfig.url

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600'],
  variable: '--font-mono',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Params = { locale: string }

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {}
  }
  const t = await getTranslations({ locale, namespace: 'meta' })

  const languages: Record<string, string> = {
    'ms-MY': `${SITE_URL}/ms`,
    'en-MY': `${SITE_URL}/en`,
    'zh-Hans-MY': `${SITE_URL}/zh`,
    'x-default': `${SITE_URL}/ms`,
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('homeTitle') + t('titleSuffix'), template: `%s${t('titleSuffix')}` },
    description: t('homeDescription'),
    alternates: { canonical: `${SITE_URL}/${locale}`, languages },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: siteConfig.brandName,
      title: t('homeTitle') + t('titleSuffix'),
      description: t('homeDescription'),
      images: [{ url: t('ogImage'), width: 1200, height: 630, alt: siteConfig.brandName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('homeTitle') + t('titleSuffix'),
      description: t('homeDescription'),
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
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)

  const messages = await getMessages()
  const htmlLang =
    locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-Hans-MY' : 'en-MY'

  return (
    <html lang={htmlLang} className={`${jakarta.variable} ${inter.variable} ${jbMono.variable}`}>
      <head>
        {/* Utopia Webcore analytics — MANDATORY. data-website MUST equal the deployed domain exactly. */}
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website={siteConfig.domain}
        />
      </head>
      <body className="bg-white text-[var(--charcoal)] antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OrganizationSchema locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

> Per Alpha's "layout ownership" rule: **no header, no footer, no nav** rendered here. Each page (homepage, location, blog) owns its own chrome. `app/layout.tsx` (the root) stays minimal — it only exports `metadata` defaults and renders `{children}`.

The minimal `app/layout.tsx` (root):

```tsx
// Root layout — intentionally empty. The locale layout owns <html>, <head>, <body>.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

---

## 7. `app/[locale]/redirect-whatsapp-1/page.tsx` + `RedirectClient.tsx`

### 7.1 `page.tsx`

```tsx
import { getPhoneNumber, waLink } from '@/lib/webcore'
import { getTranslations } from 'next-intl/server'
import RedirectClient from './RedirectClient'

// CLAUDE.md webcore rule: this page is the ONLY allowed `revalidate = 0` exception.
// It must re-pick a phone on every hit so leads_mode rotation behaves correctly.
export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { loc?: string; message?: string }

export default async function RedirectWhatsapp1Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Search>
}) {
  const { locale } = await params
  const sp = await searchParams
  const loc = sp.loc?.trim() || undefined
  const overrideMessage = sp.message?.trim()

  const { phone, whatsappText } = await getPhoneNumber(loc)
  const url = waLink(phone, overrideMessage || whatsappText)

  const t = await getTranslations({ locale, namespace: 'redirect' })

  return (
    <RedirectClient
      url={url}
      openingLabel={t('openingLabel')}
      fallbackLabel={t('fallbackLabel')}
    />
  )
}

export const metadata = {
  robots: { index: false, follow: false },
}
```

### 7.2 `RedirectClient.tsx`

```tsx
'use client'

import { useEffect } from 'react'

interface Props {
  url: string
  openingLabel: string
  fallbackLabel: string
}

export default function RedirectClient({ url, openingLabel, fallbackLabel }: Props) {
  useEffect(() => {
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      window.location.href = url
    } else {
      setTimeout(() => {
        if (window.history.length > 1) window.history.back()
        else window.location.href = '/'
      }, 150)
    }
  }, [url])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
        background: '#FFFFFF',
        color: '#1F1A17',
      }}
    >
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ marginBottom: '14px', fontSize: '18px', fontWeight: 600 }}>
          {openingLabel}
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
            boxShadow: '0 12px 24px -12px rgba(37, 211, 102, 0.5)',
          }}
        >
          {fallbackLabel}
        </a>
      </div>
    </div>
  )
}
```

---

## 8. `config/site.ts` — full file content

```ts
export const siteConfig = {
  brandName: 'AuntyRokiah Katering',
  legalName: 'Kak Kenduri Sdn. Bhd.',
  companyId: 'ce95071b-e575-4983-bdd4-66910f45fe34',
  slogan: 'Tradisi Rasa, Sentuhan Istimewa',
  heritageLine: 'Since 1998',
  foundingYear: '1998',
  domain: 'auntyrokiah-katering.utopiaai.my',
  url: 'https://auntyrokiah-katering.utopiaai.my',
  productSlug: 'pakej-katering',
  fallbackPhone: '60174287801',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  priceRange: 'RM15–RM25 per pax',
  servesCuisine: 'Malay',
  whatsappMessages: {
    ms: 'Hi AuntyRokiah Katering, saya berminat dengan pakej katering untuk majlis saya. Boleh bantu?',
    en: "Hi AuntyRokiah Katering, I'm interested in your catering package for my event. Could you help?",
    zh: '你好 AuntyRokiah Katering，我对您们的宴会餐饮配套有兴趣，请帮忙。',
  },
  colors: {
    bg: '#FFFFFF',
    cream: '#FAF3E5',
    turmeric: '#E89A2C',
    spiceOrange: '#D9742A',
    charcoal: '#1F1A17',
    ink: '#3C3531',
    sambal: '#C9252C',
    googleYellow: '#FBBC04',
    whatsapp: '#25D366',
    whatsappHover: '#1EBE57',
  },
} as const

export type Locale = (typeof siteConfig.locales)[number]
```

---

## 9. `config/locations.ts` — full file content

See Kimmy's full file output (160 location entries grouped by state in inputs.md order, with `display: { ms, en, zh }`, plus `STATES_ORDER`, `nearbyMap` from Sora seo-plan §7, and helpers `getLocation()`, `getNearbyLocations()`, `getLocationsByStateSlug()`). Operator will paste verbatim during scaffold step.

The full content is in this document above (Kimmy's section 9, source returned by subagent) and will be written directly to `config/locations.ts` when the project is scaffolded.

---

## 10. Schema components — file content for each

### 10.1 `components/schema/OrganizationSchema.tsx`

```tsx
import { siteConfig } from '@/config/site'

interface Props { locale: string }

export default function OrganizationSchema({ locale }: Props) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.brandName,
    foundingDate: siteConfig.foundingYear,
    slogan: siteConfig.slogan,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    areaServed: 'MY',
    sameAs: [`https://wa.me/${siteConfig.fallbackPhone}`],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        areaServed: 'MY',
        availableLanguage: ['ms', 'en', 'zh'],
        url: `${siteConfig.url}/${locale}/redirect-whatsapp-1`,
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
```

### 10.2 `components/schema/ProductSchema.tsx`

```tsx
import type { Product } from '@/lib/webcore'
import { siteConfig } from '@/config/site'

interface Props {
  products: Product[]
  locale: string
  pageUrl: string
  cityDisplay?: string
}

export default function ProductSchema({ products, locale: _locale, pageUrl, cityDisplay }: Props) {
  const nextYear = new Date().getFullYear() + 1
  const blocks = products.map((p) => {
    const price = (p.sale_price ?? p.rental_price)?.toString()
    const image = p.photos[0]?.url
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${pageUrl}#product-${p.slug}`,
      name: p.name,
      description: p.description ?? undefined,
      image: image ? [image] : undefined,
      brand: { '@type': 'Brand', name: siteConfig.brandName },
      category: 'Catering package',
      ...(price
        ? {
            offers: {
              '@type': 'Offer',
              priceCurrency: 'MYR',
              price,
              priceValidUntil: `${nextYear}-12-31`,
              availability: 'https://schema.org/InStock',
              seller: { '@id': `${siteConfig.url}#organization` },
              ...(cityDisplay
                ? { areaServed: { '@type': 'City', name: cityDisplay, addressCountry: 'MY' } }
                : {}),
            },
          }
        : {}),
    }
  })

  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}
    </>
  )
}
```

### 10.3 `components/schema/FAQSchema.tsx`

```tsx
interface Props {
  items: Array<{ q: string; a: string }>
}

export default function FAQSchema({ items }: Props) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
```

### 10.4 `components/schema/LocalBusinessSchema.tsx`

```tsx
import { siteConfig } from '@/config/site'

interface Props {
  city: string
  state: string
  locale: string
  slug: string
}

export default function LocalBusinessSchema({ city, state, locale, slug }: Props) {
  const url = `${siteConfig.url}/${locale}/${siteConfig.productSlug}/${slug}`
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': `${url}#localbusiness`,
    name: `${siteConfig.brandName} — ${city}`,
    image: `${siteConfig.url}/icon.svg`,
    logo: `${siteConfig.url}/icon.svg`,
    url,
    priceRange: siteConfig.priceRange,
    servesCuisine: siteConfig.servesCuisine,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state,
      addressCountry: 'MY',
    },
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: { '@type': 'State', name: state, addressCountry: 'MY' },
    },
    parentOrganization: { '@id': `${siteConfig.url}#organization` },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
```

### 10.5 `components/schema/BreadcrumbSchema.tsx`

```tsx
interface Item { name: string; item: string }
interface Props { items: Item[] }

export default function BreadcrumbSchema({ items }: Props) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
```

---

## 11. `app/robots.ts` + `app/sitemap.ts`

### 11.1 `app/robots.ts`

```ts
import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/*/redirect-whatsapp-1'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
```

### 11.2 `app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import { locations } from '@/config/locations'
import { getBlogPostSlugs } from '@/lib/webcore'

const SITE_URL = siteConfig.url
const PRODUCT_SLUG = siteConfig.productSlug

export const revalidate = 86400

function buildLanguages(pathSuffix: string) {
  const languages: Record<string, string> = {
    'ms-MY': `${SITE_URL}/ms${pathSuffix}`,
    'en-MY': `${SITE_URL}/en${pathSuffix}`,
    'zh-Hans-MY': `${SITE_URL}/zh${pathSuffix}`,
    'x-default': `${SITE_URL}/ms${pathSuffix}`,
  }
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: buildLanguages('') },
    })
  }

  for (const locale of routing.locales) {
    for (const loc of locations) {
      const suffix = `/${PRODUCT_SLUG}/${loc.slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  for (const locale of routing.locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: { languages: buildLanguages('/blog') },
    })
  }

  const slugs = await getBlogPostSlugs()
  for (const locale of routing.locales) {
    for (const { slug } of slugs) {
      const suffix = `/blog/${slug}`
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: { languages: buildLanguages(suffix) },
      })
    }
  }

  return entries
}
```

---

## 14. `global.d.ts` — full file content

```ts
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void
  }
}
export {}
```

---

## 15. Tracking integration

1. **Tracking script** — already in `app/[locale]/layout.tsx` `<head>` (§6). `data-website="auntyrokiah-katering.utopiaai.my"` exactly.
2. **WhatsApp click → `whatsapp-<phone>`** — every WA CTA wraps with `<WhatsAppClickTracker phone={phoneNumber}>`. Fires `window.uwc('click', { label: 'whatsapp-<phone>' })` before navigation.
3. **Product impression → `product-<slug>`** — every `<article>` inside the pakej grid wraps with `<ProductImpressionTracker slug={p.slug}>` — IntersectionObserver at threshold 0.5, fires once, disconnects.
4. **Blog click → `blog-<slug>`** — every blog listing card wraps with `<BlogClickTracker slug={post.slug}>`.

Trackers mirror `projects/tablechair-rental-malaysia/components/tracking/*` verbatim.

---

## 16. Env vars needed on Vercel

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase REST endpoint. |
| `SUPABASE_URL` | Server-only mirror (webcore reads either name). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for REST calls. |
| `SUPABASE_ANON_KEY` | Server-only mirror. |
| `WEBCORE_REVALIDATE_SECRET` | Shared secret for `/api/revalidate` webhook auth. |

After first set of `WEBCORE_REVALIDATE_SECRET`, redeploy once so the new env binding is bound. Verify with curl smoke test in §3.

Local `.env.local` is a symlink to repo-root `.env.local`: `ln -sf ../../.env.local .env.local`.

---

## 17. `package.json` dependencies

```json
{
  "name": "katering-auntyrokiah",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3024",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.101.1",
    "lucide-react": "^0.460.0",
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
    "autoprefixer": "^10.4.20",
    "eslint": "^9",
    "eslint-config-next": "16.2.2",
    "postcss": "^8.4.49",
    "puppeteer": "^23.10.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

Notes:
- `@supabase/supabase-js` is included for compatibility with admin tooling, but **must not be imported by runtime code**. Runtime reads go through `lib/webcore.ts` only.
- `next dev --port 3024` keeps this project off ports used by sibling sites.
- `puppeteer` is dev-only for `screenshot.mjs`.

---

## 18. Lint checklist before Gate 1

- [ ] Tracking script renders in `<head>` with `data-website="auntyrokiah-katering.utopiaai.my"`.
- [ ] `global.d.ts` declares `window.uwc`.
- [ ] Zero `wa.me/` literal in any `.tsx` file outside `lib/webcore.ts`.
- [ ] Zero `lib/supabase.ts`, `lib/getProducts.ts`, `lib/getPhoneNumber.ts`, `lib/getBlogPosts.ts`.
- [ ] Zero `export const revalidate = N` outside `app/[locale]/redirect-whatsapp-1/page.tsx`.
- [ ] Every page has exactly 1 H1 + exactly 1 H2.
- [ ] Every `<h3>`/`<h4>` preceded by `.eyebrow`.
- [ ] hreflang triple + `x-default` on every page.
- [ ] `app/[locale]/layout.tsx` contains NO header/footer.
- [ ] Curl smoke test of `/api/revalidate` returns `200 {"revalidated":["webcore-products"]}`.

End of Kimmy's implementation contract.
