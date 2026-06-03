# Katil Hospital 24 Jam — Technical SEO + i18n Implementation Spec

**Agent:** Kimmy — Technical Implementation Specialist
**Project slug:** `katilhospital-24jam`
**Domain (exact):** `katilhospital-24jam.vercel.app`
**Company:** Ibnu Sina Care Sdn. Bhd. (`company_id = d6cc8f48-ea42-4420-b9d6-73ca63263be0`)
**Locales:** `ms` (DEFAULT), `en`, `zh` — `localePrefix: 'always'`
**Leads mode:** `single`
**Phone seed:** `60174287801`
**Location count:** 159 (copied from `projects/electrician-24-hour/config/locations.ts`)
**Product SEO slug (location parent):** `katil-hospital`
**Dev port:** `3015`
**Tracking `data-website`:** `katilhospital-24jam.vercel.app`
**Date:** 2026-04-23
**Status:** Spec only. No code executed. Scaffolding runs after Gate 0 alignment; this doc is the authoritative recipe.

---

## 0. Ground Rules (verbatim — every sub-agent must respect)

From `CLAUDE.md` + user memory rules. These are non-negotiable.

1. **H1 + H2 each exactly 1 per page** — both inside the hero. Subtitle is `<h2>` not `<p>`. All other section titles = `<h3>`–`<h6>`.
2. **No phone / domain / email / SSM as visible text anywhere.** Contact flows through WhatsApp redirect only.
3. **All WhatsApp CTAs use `#25D366`** (hover `#1EBE57`) — never themed. Icon stays white.
4. **FOMO banner:** red (`#E11C1C`) or black background, live HH:MM:SS countdown, sticky top. Never brand colour, never yellow/green.
5. **3-point USP bar** mandatory immediately below hero on homepage AND every location page.
6. **3-steps only** for How It Works (not 4).
7. **Dynamic products from Supabase (CRITICAL).** Homepage + every location page queries `products` WHERE `website = 'katilhospital-24jam.vercel.app'` AND `is_active = true` ORDER BY `sort_order`, joined with `product_photos`. ISR `revalidate = 3600`. No hardcoded list is the source of truth.
8. **159 locations, ≥10 per state, total 150–180.** Copied from `projects/electrician-24-hour/config/locations.ts` (EWM's 84-location file does NOT satisfy the rule — Alpha flagged this).
9. **Gallery — no blank slots at any breakpoint.** Pad or trim; never rely on `auto-fill` stranding.
10. **Google Review section** uses real Google branding, not generic 5-stars.
11. **Mobile-first + mobile-center-aligned** headings / buttons / cards.
12. **Inter font globally** — headings AND body. No serif (user memory rule).
13. **Single rounded button shape** site-wide; only colour varies per variant.
14. **Blog layout must match `projects/electric-wheelchair-malaysia/app/[locale]/blog/` exactly** (per user memory rule).
15. **Layout ownership:** `app/[locale]/layout.tsx` contains NO header/footer — each page owns its own inline. Layout holds `<html>`, `<body>`, tracking `<script>`, `NextIntlClientProvider`, `OrganizationSchema`, `{children}` only.

---

## 1. File Tree Diff

Target project folder: `/Users/intern/Documents/GitHub/utopia-website-builder/projects/katilhospital-24jam/`.

Legend: **NEW** = create from scratch. **COPY-EWM** = copy from `projects/electric-wheelchair-malaysia/` and edit the project-specific constants. **COPY-E24** = copy from `projects/electrician-24-hour/` and edit. **COPY-KH** = copy from this project's existing `brand_assets/` or `Downloads/katilhospital24jam.my/`.

```
projects/katilhospital-24jam/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                              NEW — tracking script + Inter + OrganizationSchema + hreflang metadata; NO header/footer (layout ownership rule)
│   │   ├── page.tsx                                NEW — homepage SSR; ISR revalidate=3600; calls getProducts, renders 12-section homepage (architecture §7)
│   │   ├── HomePageClient.tsx                      NEW — client interactivity (FOMO countdown, IntersectionObserver impressions, WA click tracking)
│   │   ├── katil-hospital/
│   │   │   └── [location]/
│   │   │       ├── page.tsx                        NEW — location SSR; generateStaticParams over 159 × 3 locales; calls locationCopy hash-pick
│   │   │       └── LocationPageClient.tsx          NEW — client interactivity (FOMO, impressions, WA with loc slug)
│   │   ├── blog/
│   │   │   ├── page.tsx                            COPY-EWM — blog listing; update WEBSITE constant via getBlogPosts; palette tokens → Katil Hospital
│   │   │   └── [slug]/
│   │   │       └── page.tsx                        COPY-EWM — blog post; palette tokens swap; blog-content CSS untouched
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx                            COPY-EWM — server; force-dynamic; getPhoneNumber(loc); waLink; noindex metadata
│   │       └── RedirectClient.tsx                  COPY-EWM — client window.location + uwc click tracking
│   ├── api/
│   │   └── phones/
│   │       └── route.ts                            NEW (optional diagnostic) — echoes getPhoneNumber result; dev-only
│   ├── globals.css                                 NEW — design tokens (#E11C1C, #2A5FB0, #25D366) + .blog-content styles copied from EWM
│   ├── layout.tsx                                  NEW — root minimal shell (html/body only; locale layout does the real work)
│   ├── icon.svg                                    COPY-KH — red-clock favicon from Downloads/katilhospital24jam.my/icon.svg (must work at 16×16)
│   ├── robots.ts                                   NEW — allow all; disallow /api/, disallow /*/redirect-whatsapp-1; sitemap URL
│   └── sitemap.ts                                  NEW — enumerates 486 + 3N URLs × 3 locales; EXCLUDES /redirect-whatsapp-1
├── components/
│   ├── BlogNav.tsx                                 COPY-EWM — palette swap
│   ├── BlogFooter.tsx                              COPY-EWM — palette swap
│   ├── LanguageSwitcher.tsx                        NEW — text-only "MS / EN / ZH" (flag-less per PART C §3)
│   └── schema/
│       ├── OrganizationSchema.tsx                  COPY-EWM — update brand name, legalName (Ibnu Sina Care), remove hardcoded telephone (no phone as text)
│       ├── MedicalBusinessSchema.tsx               NEW — Sora chose MedicalBusiness for medical-equipment. RECOMMENDATION: emit BOTH MedicalBusiness AND LocalBusiness (see §6 & §15)
│       ├── ProductSchema.tsx                       COPY-EWM — per SKU; offers.url points to /redirect-whatsapp-1; priceCurrency MYR
│       ├── FAQSchema.tsx                           COPY-EWM — accepts array of {q, a}; emits FAQPage JSON-LD
│       ├── BreadcrumbSchema.tsx                    COPY-EWM — accepts array of {position, name, item}
│       └── BlogPostingSchema.tsx                   NEW — emits BlogPosting per blog post (headline/image/datePublished/author)
├── config/
│   ├── site.ts                                     NEW — domain/siteUrl/brandName/tagline(MS)/productSlug='katil-hospital'/fallbackPhone/defaultLocale='ms'/locales
│   └── locations.ts                                COPY-E24 — 159 rows from electrician-24-hour (verify count, state balance, ≥10/state)
├── i18n/
│   ├── routing.ts                                  NEW — locales:['ms','en','zh'], defaultLocale:'ms', localePrefix:'always'
│   └── request.ts                                  COPY-EWM — unchanged (generic)
├── lib/
│   ├── supabase.ts                                 COPY-EWM — unchanged (generic singleton)
│   ├── getPhoneNumber.ts                           COPY-EWM — edit FALLBACK_PHONE='60174287801' + FALLBACK_WA_TEXT (MS seed copy); keep all 4 leads-mode branches even though we use 'single'
│   ├── waRedirect.ts                               COPY-EWM — unchanged
│   ├── getBlogPosts.ts                             COPY-EWM — edit WEBSITE='katilhospital-24jam.vercel.app'; column `blog_translations.language` confirmed (not `locale`)
│   ├── getProducts.ts                              NEW — queries products + product_photos for this website; ISR-friendly; used by homepage + every location page
│   ├── locationCopy.ts                             NEW — deterministic hash-pick (intro variant / H2 variant / meta USP token / FAQ variant) per §1 in copy-locations.md
│   └── getNearbyLocations.ts                       NEW (MODIFIED from E24 helper) — returns 6 neighbours (not 4); pads with adjacent-state peers when <6 same-state exist
├── messages/
│   ├── ms.json                                     NEW — AUTHORED FIRST (default locale) — drives EN + ZH
│   ├── en.json                                     NEW — translated from ms.json
│   └── zh.json                                     NEW — translated from ms.json (Simplified)
├── public/
│   ├── brand_assets/                               COPY-KH — copied from brand_assets/ for runtime serving
│   ├── hero/                                       COPY-KH — pasted-image-1776907756088.png (bed) + pasted-image-1776907764125.png (doctor mascot)
│   ├── product/                                    COPY-KH — 8 SKU photos (FALLBACK only; real source = Supabase product_photos)
│   ├── review/                                     COPY-KH — 16 customer review screenshots from Downloads/.../review/
│   ├── google-review/                              COPY-KH — Google Review branding
│   ├── usp/                                        COPY-KH — USP icons from Downloads/.../usp/
│   └── diagram/                                    COPY-KH — how-it-works step diagrams
├── brand_assets/                                   (already exists in repo — Kagura's drop-zone; not served)
├── global.d.ts                                     NEW — window.uwc typing for tracking
├── middleware.ts                                   COPY-EWM — unchanged
├── next.config.ts                                  COPY-EWM — unchanged (loadEnvConfig + createNextIntlPlugin); remotePatterns includes placehold.co, images.pexels.com, images.unsplash.com, supabase.co
├── package.json                                    NEW — dev script uses port 3015
├── postcss.config.mjs                              NEW — standard Tailwind 4 setup
├── tsconfig.json                                   NEW — standard Next.js 15 setup
└── .env.local → ../../.env.local                   SYMLINK — shared Supabase credentials
```

---

## 2. Scaffolding Prerequisites

Exact commands (to run AFTER Gate 0 alignment — Kimmy does not execute; Layla / scaffolding step does).

### 2.1 Project init

```bash
cd /Users/intern/Documents/GitHub/utopia-website-builder/projects/katilhospital-24jam
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
npm install @supabase/supabase-js next-intl
npm install -D @tailwindcss/postcss puppeteer
```

### 2.2 Symlink shared credentials

```bash
cd /Users/intern/Documents/GitHub/utopia-website-builder/projects/katilhospital-24jam
ln -sf ../../.env.local .env.local
```

### 2.3 Dev port — 3015 (no collision per architecture.md §1)

Edit `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --port 3015",
    "build": "next build",
    "start": "next start --port 3015",
    "lint": "next lint"
  }
}
```

### 2.4 `next.config.ts` — load env from repo root

```ts
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
```

### 2.5 Vercel env vars (Layla sets during deploy)

```
NEXT_PUBLIC_SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
SUPABASE_ANON_KEY=<anon_key>
```

Both `NEXT_PUBLIC_*` and bare `SUPABASE_*` MUST be set per kimmy.md §17 (build-time + runtime compatibility).

---

## 3. i18n Implementation

### 3.1 `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['ms', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ms',
  localePrefix: 'always',
});
```

> Note the locale order — `ms` first, and `defaultLocale: 'ms'`. This differs from EWM (which defaults to `en`).

### 3.2 `i18n/request.ts`

Copy from EWM verbatim:

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 3.3 `middleware.ts`

Copy from EWM verbatim:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### 3.4 `messages/{ms,en,zh}.json` — required key paths

Nana's copy (`copy-homepage.md` + `copy-locations.md`) maps to these keys. MS is authored first; EN and ZH are translations.

```
{
  "nav":         { "home", "products", "how", "reviews", "blog", "cta" },                // copy-homepage §2
  "fomo":        { "primary", "secondary", "labels.hrs", "labels.min", "labels.sec" },   // copy-homepage §1
  "hero":        { "h1", "h2", "ctaPrimary", "ctaSecondary", "trustMicro" },             // copy-homepage §3
  "usp":         { "p1.label", "p1.sub", "p2.label", "p2.sub", "p3.label", "p3.sub" },   // copy-homepage §4
  "products":    { "h3", "intro", "cardCta",
                   "sku.katil-hospital-manual-1-fungsi.name", ".desc",
                   "sku.katil-hospital-manual-2-fungsi.name", ".desc",
                   "sku.katil-hospital-elektrik-3-fungsi.name", ".desc",
                   "sku.tilam-hospital-foam.name", ".desc",
                   "sku.tilam-angin-anti-decubitus.name", ".desc",
                   "sku.mesin-oksigen.name", ".desc",
                   "sku.kerusi-roda.name", ".desc",
                   "sku.mesin-cpap.name", ".desc" },                                     // copy-homepage §5
  "values":      { "h3", "intro",
                   "c1.title", "c1.body", "c2.title", "c2.body",
                   "c3.title", "c3.body", "c4.title", "c4.body" },                       // copy-homepage §6
  "howItWorks":  { "h3",
                   "s1.title", "s1.body",
                   "s2.title", "s2.body",
                   "s3.title", "s3.body" },                                              // copy-homepage §7 (exactly 3 steps)
  "gallery":     { "h3", "intro" },                                                      // copy-homepage §8
  "googleReview":{ "h3", "intro", "cta",
                   "r1.name", "r1.tag", "r1.body",  ...  "r8.name", "r8.tag", "r8.body" },// copy-homepage §9
  "faq":         { "h3",
                   "q1.q", "q1.a", ... "q10.q", "q10.a" },                               // copy-homepage §10
  "finalCta":    { "h3", "subtitle", "cta" },                                            // copy-homepage §11
  "footer":      { "brand.heading", "brand.tagline",
                   "products.heading", "locations.heading", "locations.all",
                   "language.heading", "copyright" },                                    // copy-homepage §12
  "location":    { "breadcrumb.home", "breadcrumb.product",
                   "h1Template",  // "Sewa Katil Hospital di {city} — Hantar 24 Jam"
                   "intro.tokensLabel",
                   "faq.sharedIntro",
                   "nearby.h3", "nearby.intro", "nearby.anchor",
                   "stateNames.klangValley", ".selangor", ".negeriSembilan", ".melaka",
                   ".johor", ".perak", ".penang", ".kedah", ".perlis", ".kelantan",
                   ".terengganu", ".pahang", ".sabah", ".sarawak" },                     // copy-locations §3.2
  "blog":        { "title", "readMore", "noPosts",
                   "breadcrumbHome", "breadcrumbBlog",
                   "publishedOn", "minRead", "recentPosts", "tocTitle",
                   "ctaBannerTitle", "ctaBannerCta",
                   "metaTitle", "metaDescription" },                                     // §11 blog implementation
  "metadata":    { "home.title", "home.description",                                     // copy-homepage §13
                   "location.titleTemplate", "location.descriptionTemplate",             // copy-locations §8
                   "uspTokens": ["…1…","…2…","…3…","…4…","…5…","…6…"],                   // copy-locations §8.3 — array of 6 USP tokens
                   "ogLocale" }                                                          // "ms_MY" | "en_MY" | "zh_CN"
}
```

Authoring order (per copy-locations.md §0.3 + CLAUDE.md user memory): **MS written first by Nana; EN and ZH are direct translations of MS.** Do not write EN/ZH independently — hreflang crawlers expect parity.

### 3.5 `components/LanguageSwitcher.tsx`

Flag-less text picker `MS / EN / ZH`, as spec'd in PART C §3.

```tsx
'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/routing';

const labels: Record<string, string> = { ms: 'MS', en: 'EN', zh: 'ZH' };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(target: string) {
    // pathname starts with /ms|/en|/zh — swap first segment
    const rest = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${target}${rest || ''}`);
  }

  return (
    <div role="tablist" aria-label="Language" style={{ display: 'inline-flex', gap: 4 }}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          role="tab"
          aria-selected={locale === l}
          onClick={() => switchTo(l)}
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            border: '1px solid rgba(15,23,42,0.12)',
            background: locale === l ? '#0F172A' : 'transparent',
            color: locale === l ? '#FFFFFF' : '#0F172A',
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
```

Keyboard-accessible (tab + enter triggers `onClick`). Lives in the page-owned header (NOT in layout.tsx — layout ownership rule).

---

## 4. hreflang Implementation

Every indexable page emits hreflang alternates via Next.js Metadata API `alternates.languages`. Kimmy uses a single helper in every `generateMetadata`:

```ts
// helper used across every page
import { siteConfig } from '@/config/site';

export function buildAlternates(path: string, locale: string) {
  // path = canonical path WITHOUT the locale prefix, e.g. '/katil-hospital/kuala-lumpur' or '' for homepage
  const base = siteConfig.siteUrl; // 'https://katilhospital-24jam.vercel.app'
  return {
    canonical: `${base}/${locale}${path}`,
    languages: {
      'ms-MY': `${base}/ms${path}`,
      'en-MY': `${base}/en${path}`,
      'zh-CN': `${base}/zh${path}`,
      'x-default': `${base}/ms${path}`, // MS is default per Sora §3.2
    },
  };
}
```

`x-default` always points to `/ms/*` — confirmed by Sora's plan (MS is the authored source locale and real user distribution). Every location page cross-links correctly because `path` is locale-agnostic and each locale gets the same URL structure.

---

## 5. Metadata API per page

### 5.1 Homepage — `app/[locale]/page.tsx`

```ts
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/lib/alternates';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('home.title'),
    description: t('home.description'),
    alternates: buildAlternates('', locale),
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      url: `https://katilhospital-24jam.vercel.app/${locale}`,
      type: 'website',
      locale: t('ogLocale'), // ms_MY | en_MY | zh_CN
      siteName: 'Katil Hospital 24 Jam',
      images: [{ url: '/brand_assets/social-share.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
  };
}
```

### 5.2 Location page — `app/[locale]/katil-hospital/[location]/page.tsx`

Uses Sora's template + deterministic USP rotation:

```ts
import { getLocationBySlug } from '@/config/locations';
import { buildAlternates } from '@/lib/alternates';
import { hash, pickUspToken, stateName } from '@/lib/locationCopy';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}) {
  const { locale, location } = await params;
  const loc = getLocationBySlug(location);
  if (!loc) return {};
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const uspTokens = t.raw('uspTokens') as string[]; // 6-token array from messages file
  const usp = uspTokens[hash(location) % uspTokens.length]; // hash(slug) % 6 — Sora's hash-pick

  const cityLong = loc.name.length > 14;
  const titleTemplate = t('location.titleTemplate'); // "Sewa Katil Hospital {city} — 24 Jam Malaysia"
  const titleShort = cityLong
    ? titleTemplate.replace(' — 24 Jam Malaysia', ' — 24 Jam').replace('{city}', loc.name)
    : titleTemplate.replace('{city}', loc.name);

  const description = t('location.descriptionTemplate')
    .replace('{city}', loc.name)
    .replace('{state}', stateName(loc.state, locale))
    .replace('{usp}', usp);

  return {
    title: titleShort,
    description,
    alternates: buildAlternates(`/katil-hospital/${location}`, locale),
    openGraph: {
      title: titleShort,
      description,
      url: `https://katilhospital-24jam.vercel.app/${locale}/katil-hospital/${location}`,
      type: 'website',
      locale: t('ogLocale'),
      siteName: 'Katil Hospital 24 Jam',
    },
    twitter: { card: 'summary_large_image' },
  };
}
```

**Hash rule (Sora, §8.4 of copy-locations.md):** `hash(slug) % 6` — ensures same city always picks the same USP across builds and across locales; 159 cities × 6 tokens → each token reused across ~26 cities but always paired with a unique `{city} + {state}` combo, so all 477 descriptions are unique.

### 5.3 Blog listing — `app/[locale]/blog/page.tsx`

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/blog', locale),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `https://katilhospital-24jam.vercel.app/${locale}/blog`,
      type: 'website',
      locale: t('ogLocale'),
      siteName: 'Katil Hospital 24 Jam',
    },
  };
}
```

### 5.4 Blog post — `app/[locale]/blog/[slug]/page.tsx`

Uses `getBlogPostBySlug(slug, locale)` — meta title + description come from `blog_translations`:

```ts
export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) return {};
  return {
    title: post.meta_title || `${post.title} | Katil Hospital 24 Jam`,
    description: post.meta_description || post.excerpt.slice(0, 150),
    alternates: buildAlternates(`/blog/${slug}`, locale),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `https://katilhospital-24jam.vercel.app/${locale}/blog/${slug}`,
      type: 'article',
      locale: (await getTranslations({ locale, namespace: 'metadata' }))('ogLocale'),
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
    twitter: { card: 'summary_large_image' },
  };
}
```

### 5.5 WhatsApp redirect — `app/[locale]/redirect-whatsapp-1/page.tsx`

Explicit `noindex,nofollow`:

```ts
export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };
```

---

## 6. Schema Components

All schema components live in `components/schema/`. Emit JSON-LD via `<script type="application/ld+json">`.

### 6.1 `OrganizationSchema.tsx` (site-wide — in `[locale]/layout.tsx`)

Modify EWM's copy: remove `telephone` field (no phone number in structured data per CLAUDE.md "no contact info visible"). Replace with `contactPoint.url` pointing to `/{locale}/redirect-whatsapp-1`.

```ts
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Katil Hospital 24 Jam",
  "legalName": "Ibnu Sina Care Sdn. Bhd.",
  "url": siteConfig.siteUrl,
  "logo": `${siteConfig.siteUrl}/brand_assets/logo-dark.png`,
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": `${siteConfig.siteUrl}/ms/redirect-whatsapp-1`,
    "areaServed": "MY",
    "availableLanguage": ["Malay", "English", "Chinese"]
  },
  "sameAs": []
}
```

### 6.2 `MedicalBusinessSchema.tsx` (homepage + every location page)

Sora chose `MedicalBusiness` over `LocalBusiness` for medical-equipment relevance (seo-plan.md §6.2).

**Kimmy's recommendation: emit BOTH `MedicalBusiness` AND `LocalBusiness`** to cover Google's preference for `LocalBusiness` in local-pack rankings AND retain the medical-specific signal. JSON-LD supports multiple `@type` via an array, but not all validators accept it — emit two separate `<script>` blocks. See §15 Risks.

Homepage shape:

```ts
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Katil Hospital 24 Jam",
  "image": `${siteConfig.siteUrl}/brand_assets/og-image.jpg`,
  "url": `${siteConfig.siteUrl}/${locale}`,
  "areaServed": { "@type": "Country", "name": "Malaysia" },
  "priceRange": "RM",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00", "closes": "23:59"
  }],
  "potentialAction": {
    "@type": "CommunicateAction",
    "target": `${siteConfig.siteUrl}/${locale}/redirect-whatsapp-1`
  }
  // NO telephone field (no phone as text in schema)
}
```

Location page shape — swap `areaServed` to `{ "@type": "City", "name": "{cityName}" }` and `url` to the location canonical. Second `<script>` emits the same shape with `@type: "LocalBusiness"` for Google compatibility.

### 6.3 `ProductSchema.tsx` (homepage + every location page — one per SKU)

```ts
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{Product Name}",                   // from products.name
  "description": "{MS/EN/ZH description}",    // from products.description
  "image": ["{photo_url_1}", ...],            // from product_photos.url
  "brand": { "@type": "Brand", "name": "Katil Hospital 24 Jam" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "MYR",
    "lowPrice": "{rental_price}",
    "highPrice": "{sale_price}",
    "availability": "https://schema.org/InStock",
    "url": `${siteConfig.siteUrl}/${locale}/redirect-whatsapp-1`
  }
}
```

**No `aggregateRating` / `review` unless real reviews exist** (Sora §6.3 — never fabricate).

### 6.4 `FAQSchema.tsx` (homepage + every location page)

```ts
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "{q}", "acceptedAnswer": { "@type": "Answer", "text": "{a}" } },
    // …10 Q&A on homepage, 5 on location page (3 shared + 2 hash-picked unique)
  ]
}
```

Location page FAQ source: 3 shared Qs (copy-locations.md §6.1 — reuse of homepage Q1 + Q3 + Q5) + 2 unique Qs picked via `pick(slug, [U1,U2,U3,U4], 10)` and `pick(slug, [...], 11)` per copy-locations.md §6.2.

### 6.5 `BreadcrumbSchema.tsx` (location + blog post)

```ts
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Laman Utama", "item": `${siteUrl}/${locale}` },
    { "@type": "ListItem", "position": 2, "name": "Katil Hospital", "item": `${siteUrl}/${locale}#products` },
    { "@type": "ListItem", "position": 3, "name": "{cityName}", "item": `${siteUrl}/${locale}/katil-hospital/{slug}` }
  ]
}
```

Localised per locale — breadcrumb "Laman Utama" (ms) / "Home" (en) / "主页" (zh) pulled from `t('location.breadcrumb.home')`.

### 6.6 `BlogPostingSchema.tsx` (every blog post)

```ts
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{post.title}",
  "image": ["{post.cover_image_url}"],
  "datePublished": "{post.published_at}",
  "dateModified": "{post.published_at}",  // or a separate updated_at if DB adds it
  "author": { "@type": "Organization", "name": "Katil Hospital 24 Jam" },
  "publisher": {
    "@type": "Organization",
    "name": "Katil Hospital 24 Jam",
    "logo": { "@type": "ImageObject", "url": `${siteUrl}/brand_assets/logo-dark.png` }
  },
  "mainEntityOfPage": `${siteUrl}/${locale}/blog/${post.slug}`,
  "description": "{post.excerpt}"
}
```

---

## 7. WhatsApp Redirect Pages

### 7.1 `app/[locale]/redirect-whatsapp-1/page.tsx` (server)

```tsx
import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string }>;
}) {
  const { loc, message } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const url = waLink(phone, message || whatsappText);
  return <RedirectClient url={url} phone={phone} loc={loc} />;
}
```

- `?loc={slug}` support is wired even under `leads_mode = 'single'` so future upgrades to `rotation`/`location`/`hybrid` require zero code change.
- `export const dynamic = 'force-dynamic'` — reads live HTTP host header for `getHostDomain()`.

### 7.2 `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx` (client)

```tsx
'use client';
import { useEffect } from 'react';

export default function RedirectClient({
  url, phone, loc,
}: { url: string; phone: string; loc?: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.uwc) {
      const label = loc ? `whatsapp-${phone}-${loc}` : `whatsapp-${phone}`;
      window.uwc('click', { label });
    }
    window.location.href = url;
  }, [url, phone, loc]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 12, color: '#0F172A' }}>Membuka WhatsApp…</p>
        <a href={url} style={{ color: '#25D366', fontWeight: 600, fontSize: 16 }}>
          Klik di sini jika tidak terbuka
        </a>
      </div>
    </div>
  );
}
```

Fires the tracking event BEFORE the redirect so it's sent via `navigator.sendBeacon` (handled inside `t.js`) before the tab navigates away.

---

## 8. `lib/` Implementation

### 8.1 `lib/supabase.ts` — singleton with null fallback

**COPY-EWM verbatim** — already implements `SUPABASE_URL` ∥ `NEXT_PUBLIC_SUPABASE_URL` fallback (kimmy.md §17). Keep the existing shape — returns `null` if env missing, callers degrade gracefully.

### 8.2 `lib/getPhoneNumber.ts` — ALL 4 leads modes

**COPY-EWM** (197 lines) and change ONLY:

```ts
const FALLBACK_PHONE = "60174287801";
const FALLBACK_WA_TEXT = "Hi, saya berminat dengan perkhidmatan sewa / beli katil hospital dari Katil Hospital 24 Jam. Boleh bantu?";
```

The full `single / rotation / location / hybrid` switch is retained even though this project runs `single`. Column names verified in EWM source:

| Column | Usage |
|---|---|
| `phone_numbers.website` | line 131 `.eq("website", domain)` — NOT `website_slug` |
| `phone_numbers.location_slug` | string literal `'all'` (never `null`) |
| `company_websites.domain` | line 74 `.eq("domain", domain)` — NOT `website` |
| `phone_numbers.is_active` | line 132 `.eq("is_active", true)` |

`getPhoneNumber` signature: `getPhoneNumber(locationSlug?: string): Promise<PhoneResult>`. Returns `{ phone, whatsappText, source, mode }`. Exports `waLink(phone, message)` which builds `https://wa.me/${phone}?text=${encodeURIComponent(message)}`.

### 8.3 `lib/waRedirect.ts` — URL builder

**COPY-EWM verbatim** (11 lines). No edits required:

```ts
export function waRedirect(locale: string, message?: string, location?: string): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (location) params.set('loc', location);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
```

Used site-wide by every WhatsApp button — never hardcode `wa.me/` anywhere (kimmy.md §16).

### 8.4 `lib/getBlogPosts.ts` — blog queries

**COPY-EWM** (98 lines). Change ONLY:

```ts
const WEBSITE = "katilhospital-24jam.vercel.app";
```

Column confirmation — `blog_translations.language` (NOT `locale`): verified at EWM line 33:

```ts
.eq("blog_translations.language", language)
```

And line 75 inside `getBlogPostBySlug`. Do NOT rename. This is the shared-schema reality.

### 8.5 `lib/getProducts.ts` — NEW

```ts
import { getSupabase } from "./supabase";
import { siteConfig } from "@/config/site";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sale_price: number | null;
  rental_price: number | null;
  sort_order: number;
  photos: { url: string }[];
}

export async function getProducts(): Promise<ProductRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, description,
      sale_price, rental_price, sort_order, is_active,
      product_photos(url)
    `)
    .eq("website", siteConfig.domain)      // 'katilhospital-24jam.vercel.app'
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("[getProducts] error:", error?.message);
    return [];
  }

  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    sale_price: r.sale_price,
    rental_price: r.rental_price,
    sort_order: r.sort_order,
    photos: Array.isArray(r.product_photos) ? r.product_photos : [r.product_photos].filter(Boolean),
  }));
}
```

**Caller ISR:** every page that calls `getProducts()` must declare `export const revalidate = 3600;` (homepage, location page).

### 8.6 `lib/locationCopy.ts` — NEW (Nana's hash-pick translated to TS)

```ts
import { Locale } from '@/i18n/routing';

export function hash(slug: string): number {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function pick<T>(slug: string, bucket: T[], offset = 0): T {
  return bucket[(hash(slug) + offset) % bucket.length];
}

export function pickUspToken(slug: string, uspBank: string[]): string {
  return uspBank[hash(slug) % uspBank.length];
}

// State-name translations (copy-locations.md §3.2)
const STATE_NAMES: Record<string, Record<Locale, string>> = {
  'Klang Valley':    { ms: 'Lembah Klang',   en: 'Klang Valley',   zh: '巴生谷' },
  'Selangor':        { ms: 'Selangor',       en: 'Selangor',       zh: '雪兰莪' },
  'Negeri Sembilan': { ms: 'Negeri Sembilan', en: 'Negeri Sembilan', zh: '森美兰' },
  'Melaka':          { ms: 'Melaka',         en: 'Melaka',         zh: '马六甲' },
  'Johor':           { ms: 'Johor',          en: 'Johor',          zh: '柔佛' },
  'Perak':           { ms: 'Perak',          en: 'Perak',          zh: '霹雳' },
  'Penang':          { ms: 'Pulau Pinang',   en: 'Penang',         zh: '槟城' },
  'Kedah':           { ms: 'Kedah',          en: 'Kedah',          zh: '吉打' },
  'Perlis':          { ms: 'Perlis',         en: 'Perlis',         zh: '玻璃市' },
  'Kelantan':        { ms: 'Kelantan',       en: 'Kelantan',       zh: '吉兰丹' },
  'Terengganu':      { ms: 'Terengganu',     en: 'Terengganu',     zh: '登嘉楼' },
  'Pahang':          { ms: 'Pahang',         en: 'Pahang',         zh: '彭亨' },
  'Sabah':           { ms: 'Sabah',          en: 'Sabah',          zh: '沙巴' },
  'Sarawak':         { ms: 'Sarawak',        en: 'Sarawak',        zh: '砂拉越' },
};

export function stateName(stateKey: string, locale: Locale | string): string {
  return STATE_NAMES[stateKey]?.[locale as Locale] ?? stateKey;
}

// Offsets mapped per copy-locations.md §0.2:
//   0 = intro variant    (per state, 4 variants → pick(slug, introVariants[state], 0))
//   1 = h2 variant       (8 shared variants → pick(slug, h2Variants, 1))
//   2 = meta USP token   (6 tokens → pickUspToken / hash(slug) % 6)
//   3 = FAQ variant      (per state, 4 variants → pick(slug, faqVariants[state], 3))
//  10 = unique FAQ #1    (pool of 4 → pick(slug, uniqueFaqs, 10))
//  11 = unique FAQ #2    (pool of 4 → pick(slug, uniqueFaqs, 11))
//   4..7 = location review pool picks (pool of 16 → pick(slug, pool, 4..7))

// Fact-token tables (city → {hospital, district}) — full 159 entries per
// copy-locations.md §4.2.1–§4.2.14. Truncated here; spell out all 159 in the
// final implementation file.
export const localFacts: Record<string, { hospital: string; district: string }> = {
  'kuala-lumpur': { hospital: 'Hospital Kuala Lumpur', district: 'Jalan Pahang / KLCC' },
  'petaling-jaya': { hospital: 'Hospital Sungai Buloh', district: 'Section 13 / SS2' },
  // … all 159 entries from copy-locations.md §4.2.*
};
```

### 8.7 `lib/getNearbyLocations.ts` — NEW / MODIFIED (**6, not 4**)

Sora flagged the current E24 helper returns 4. Upgrade to 6, pad with adjacent-state peers when <6 same-state exist.

```ts
import { locations, Location } from '@/config/locations';

// Adjacency fallback map — adjacent states for padding when a state has <6 peers.
const ADJACENT: Record<string, string[]> = {
  'Klang Valley':    ['Selangor', 'Negeri Sembilan'],
  'Selangor':        ['Klang Valley', 'Perak', 'Pahang'],
  'Negeri Sembilan': ['Klang Valley', 'Melaka', 'Johor'],
  'Melaka':          ['Negeri Sembilan', 'Johor'],
  'Johor':           ['Melaka', 'Pahang', 'Negeri Sembilan'],
  'Perak':           ['Kedah', 'Penang', 'Pahang', 'Selangor'],
  'Penang':          ['Kedah', 'Perak'],
  'Kedah':           ['Perlis', 'Penang', 'Perak'],
  'Perlis':          ['Kedah'],
  'Kelantan':        ['Terengganu', 'Pahang'],
  'Terengganu':      ['Kelantan', 'Pahang'],
  'Pahang':          ['Terengganu', 'Kelantan', 'Perak', 'Johor', 'Selangor'],
  'Sabah':           ['Sarawak'],
  'Sarawak':         ['Sabah'],
};

export function getNearbyLocations(slug: string, count = 6): Location[] {
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) return [];

  // Same-state peers first, deterministic order
  const sameState = locations.filter((l) => l.state === loc.state && l.slug !== slug);
  if (sameState.length >= count) return sameState.slice(0, count);

  // Pad with adjacent-state peers
  const filled: Location[] = [...sameState];
  for (const adjState of ADJACENT[loc.state] ?? []) {
    if (filled.length >= count) break;
    const adj = locations.filter((l) => l.state === adjState);
    for (const a of adj) {
      if (filled.length >= count) break;
      filled.push(a);
    }
  }
  return filled.slice(0, count);
}
```

Stable, deterministic, and always returns 6 peers (because 14 × ≥10 cities always yields enough adjacency once a state is padded).

---

## 9. `config/` Implementation

### 9.1 `config/site.ts` — NEW

```ts
export const siteConfig = {
  domain: 'katilhospital-24jam.vercel.app',
  siteUrl: 'https://katilhospital-24jam.vercel.app',
  brandName: 'Katil Hospital 24 Jam',
  legalName: 'Ibnu Sina Care Sdn. Bhd.',
  tagline: 'Sewa & Jual Katil Hospital 24 Jam di Seluruh Malaysia', // MS — per inputs.md
  productSlug: 'katil-hospital',
  productName: 'Katil Hospital',
  fallbackPhone: '60174287801',
  fallbackWaTextMs: 'Hi, saya berminat dengan perkhidmatan sewa / beli katil hospital dari Katil Hospital 24 Jam. Boleh bantu?',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
};
```

### 9.2 `config/locations.ts` — COPY-E24

Copy the entire 270-line file from `projects/electrician-24-hour/config/locations.ts` verbatim. Verify post-copy:

```bash
grep -c "slug:" projects/katilhospital-24jam/config/locations.ts  # → 162 (159 + 3 interface/regionOrder/regionKeys matches — 159 real rows)
```

State balance (copy-locations.md §0.1): Klang Valley 25 / Perak 12 / Johor 12 / Selangor 10 / Negeri Sembilan 10 / Melaka 10 / Penang 10 / Kedah 10 / Perlis 10 / Kelantan 10 / Terengganu 10 / Pahang 10 / Sabah 10 / Sarawak 10 = **159**.

**Replace the bundled `getNearbyLocations` export** (which returns 4) with an `import` from the new `lib/getNearbyLocations.ts` above. Keep `getLocationBySlug` + `getLocationsByRegion` + `nearbyMap` untouched.

---

## 10. Sitemap + Robots

### 10.1 `app/sitemap.ts` — NEW

Emits `/ms`, `/en`, `/zh` for: 3 homepages + 159 × 3 = 477 location pages + 3 blog listings + N × 3 blog posts. EXCLUDES `/redirect-whatsapp-1`.

```ts
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { locations } from '@/config/locations';
import { locales } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

const FEATURED = new Set([
  'kuala-lumpur','petaling-jaya','shah-alam','subang-jaya','johor-bahru',
  'klang','george-town','ipoh','kuantan','kota-kinabalu','kuching',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: locale === 'ms' ? 1.0 : 0.9,
    });
  }

  for (const locale of locales) {
    for (const loc of locations) {
      entries.push({
        url: `${baseUrl}/${locale}/katil-hospital/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: FEATURED.has(loc.slug) ? 0.8 : 0.7,
      });
    }
  }

  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  try {
    const { getBlogPosts } = await import('@/lib/getBlogPosts');
    const posts = await getBlogPosts('ms'); // MS is default; slugs are locale-agnostic
    for (const locale of locales) {
      for (const post of posts) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.published_at ? new Date(post.published_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // Blog fetch failed at build time → skip; sitemap repopulates at next ISR tick.
  }

  // NEVER include /redirect-whatsapp-1.
  return entries;
}
```

### 10.2 `app/robots.ts` — NEW

```ts
import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*/redirect-whatsapp-1'],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
```

Belt-and-braces: redirect page itself also declares `export const metadata = { robots: { index: false, follow: false } };` (see §7.1).

---

## 11. Blog Implementation

Copy **exactly** from `projects/electric-wheelchair-malaysia/app/[locale]/blog/` (user memory rule — Blog layout reference):

- `page.tsx` (listing) — auto-fill grid `minmax(340px, 1fr)`, card with cover image, date, title, excerpt, "Read More"
- `[slug]/page.tsx` (post) — full header + breadcrumbs + H1 + metadata + read time + TOC + body (single column, no sidebar) + FAQ + bottom CTA + recent posts + full footer
- `blog-content` CSS in `globals.css`

Palette swaps vs EWM (keep layout identical):

| Token | EWM | Katil Hospital |
|---|---|---|
| `--accent` / CTA underline | orange | **`#E11C1C`** (primary red) |
| CTA button background | orange | **`#25D366`** (WhatsApp green — per rule 14) |
| Navy body text | keep | `#0F172A` |
| `blockquote` border-left | orange | `#E11C1C` |

Both blog pages use `getBlogPosts(locale)` / `getBlogPostBySlug(slug, locale)` from `lib/getBlogPosts.ts` with `WEBSITE = 'katilhospital-24jam.vercel.app'`. Blog CTA banner uses `waRedirect(locale)` — green `#25D366`. Blog listing card click fires `uwc('click', { label: 'blog-{slug}' })` (§12).

Every blog post emits `BlogPostingSchema` + `BreadcrumbSchema` in `<head>` (§6).

---

## 12. Tracking Implementation

### 12.1 `global.d.ts` (repo root of the project)

```ts
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void;
  }
}
export {};
```

### 12.2 Script in `app/[locale]/layout.tsx`

```tsx
<head>
  <script
    defer
    src="https://webcore.utopiaai.my/t.js"
    data-website="katilhospital-24jam.vercel.app"
  />
</head>
```

`data-website` MUST match the Vercel domain exactly — any mismatch silently drops events (tracking-guide.md §Best Practices).

### 12.3 WhatsApp click tracking

Every WhatsApp CTA button (nav, hero, inline, FAB, final CTA, blog banner, location page CTA) fires the event inside an `onClick`:

```tsx
'use client';
function trackWaClick(loc?: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    const label = loc ? `whatsapp-60174287801-${loc}` : `whatsapp-60174287801`;
    window.uwc('click', { label });
  }
}
```

The `60174287801` is the seeded phone — matches `FALLBACK_PHONE` + the `phone_numbers` row. Location pages append `-{slug}` for Sora §9 conversion analytics. The actual redirect goes through `/redirect-whatsapp-1` which ALSO fires a click event server-resolved (§7.2) — the two events combine in analytics for end-to-end funnel visibility.

### 12.4 Product impression tracking

Inside `HomePageClient.tsx` and `LocationPageClient.tsx`, the product card ref wrapper:

```tsx
'use client';
import { useEffect, useRef } from 'react';

export function ProductCard({ slug, children }: { slug: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && typeof window !== 'undefined' && window.uwc) {
        window.uwc('impression', { label: `product-${slug}` });
        io.disconnect();  // fire ONCE per card
      }
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [slug]);
  return <div ref={ref}>{children}</div>;
}
```

### 12.5 Blog listing card clicks

In blog listing `page.tsx`:

```tsx
<Link
  href={`/${locale}/blog/${post.slug}`}
  onClick={() => window.uwc?.('click', { label: `blog-${post.slug}` })}
>
  …
</Link>
```

End-of-post CTA inside the blog-post body fires `uwc('click', { label: `blog-cta-${post.slug}` })` per Sora §9.

---

## 13. Icon / Favicon

`app/icon.svg` MUST use the SAME red-clock glyph as the logo (brand rule in CLAUDE.md — "Logo Rules"). Source: `/Users/intern/Downloads/katilhospital24jam.my/icon.svg`.

Procedure:
1. Copy `/Users/intern/Downloads/katilhospital24jam.my/icon.svg` → `projects/katilhospital-24jam/app/icon.svg`.
2. Open in an SVG editor and verify viewBox normalises to a square (e.g. `0 0 24 24` or `0 0 32 32`) — Next.js will rasterise at 16×16 / 32×32.
3. Ensure strokes are ≥2 units thick so the clock ring + "24" remains legible at 16×16.
4. If the source file contains extra padding or non-red elements, rebuild as a minimal SVG:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="13" fill="none" stroke="#E11C1C" stroke-width="3"/>
  <text x="16" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="11" fill="#E11C1C">24</text>
</svg>
```

This must render crisp at 16×16 (favicon) AND 32×32 (tab icon) AND match the logo in the floating pill nav. Same icon everywhere (CLAUDE.md "Logo Rules" — "the icon must be consistent").

---

## 14. CI / Pre-Ship Lint Checks

Before Gate 1, Kimmy runs these automated checks. Failure on any = ship-blocker.

### 14.1 H1 + H2 count — exactly 1 each per page

```bash
# Playwright / Puppeteer script against each rendered URL. Pseudo:
for url in $(cat rendered-urls.txt); do
  H1=$(curl -s "$url" | grep -c "<h1")
  H2=$(curl -s "$url" | grep -c "<h2")
  [[ "$H1" == "1" && "$H2" == "1" ]] || { echo "FAIL $url h1=$H1 h2=$H2"; exit 1; }
done
```

Must cover: 3 homepages + 477 location pages + 3 blog listings + N × 3 blog posts = 486 + 3N pages.

### 14.2 No phone number as visible text

Regex `/60[0-9]{9,10}/` must NOT appear in any rendered HTML's visible text. Phone may appear in `wa.me/` URLs inside link targets (that's fine — not visible text) and in the `/redirect-whatsapp-1` page's `<a href>`; whitelist those specifically.

### 14.3 No domain as visible text

String `katilhospital-24jam.vercel.app` must NOT appear as visible text. Whitelist:
- The tracking script `data-website` attribute (not visible).
- Canonical / OG URL meta tags (not visible).
- JSON-LD `url` fields (not visible text — inside `<script>`).

### 14.4 WhatsApp link target

`document.querySelectorAll('a[href*="whatsapp"]')` — every hit MUST resolve to `/{locale}/redirect-whatsapp-1[?…]`. Zero `wa.me/`, zero hardcoded phone. Grep:

```bash
grep -rn "wa.me" projects/katilhospital-24jam/{app,components} && echo "FAIL: hardcoded wa.me found" && exit 1
grep -rn "60174287801" projects/katilhospital-24jam/{app,components} && echo "FAIL: hardcoded phone found (only lib/ allowed)" && exit 1
```

### 14.5 WhatsApp button colour

Every `[data-cta="whatsapp"]` must have computed `background-color: #25D366` (or `rgb(37, 211, 102)`). Puppeteer check via `getComputedStyle`.

### 14.6 Duplicate meta-description lint (477 location pages × 3 locales)

```bash
# hash every <meta name="description"> on the 477 location pages; fail if any hash count > 1 per locale
```

Sora §10 flagged this as THE biggest ship-blocker. The hash-pick rule in `lib/locationCopy.ts` (USP mod 6 + unique city + state) mathematically yields 477 unique strings — CI must verify empirically.

### 14.7 Location page count

```bash
# verify generateStaticParams emits 159 × 3 = 477 combinations
```

### 14.8 Alt text audit (kimmy.md §4 — mandatory)

- Every `<img>` has a descriptive `alt`.
- Every meaningful `<svg>` has `aria-label` or `<title>`; decorative SVGs have `aria-hidden="true"`.
- Alt text on multilingual pages uses `t()` not hardcoded English.

### 14.9 Zero hardcoded English strings

Grep `.tsx` files for English fragments > 3 words outside of `t()` / `s()` calls (kimmy.md §Zero Hardcoded English Rule).

### 14.10 Layout parity + layout ownership

- Homepage + location page render identical section order (architecture.md §7 Appendix).
- `app/[locale]/layout.tsx` does NOT contain a `<nav>` or `<footer>` — each page owns its own header + footer inline.

---

## 15. Risks / TODOs

| # | Risk / Gap | Owner | Blocker? |
|---|---|---|---|
| 1 | **MS translation of site-wide UI strings** — every visible label, button, caption, aria-label in `messages/ms.json` must use natural Bahasa Melayu, not word-for-word English. EN and ZH are translated from MS. | Nana (copy author) + Kimmy (structural verification) | No — Nana already supplied MS copy; Kimmy loads it. |
| 2 | **Nana's 56 intro shells** (4 variants × 14 states) — each must be string-templated with `{city}`, `{state}`, `{hospital}`, `{nearby1}`, `{nearby2}`, `{district}`. Kimmy encodes all 56 in `lib/locationCopy.ts` (or a JSON sidecar the function imports). Full Klang Valley + Selangor + every state's fact table (159 rows of `localFacts`) must be transcribed from `copy-locations.md §4.2.1–§4.2.14`. **This is the largest single transcription task in this ticket.** | Kimmy | Yes for Gate 1 — location pages need the full data. |
| 3 | **`MedicalBusiness` vs `LocalBusiness`** — Google's local-pack historically prefers `LocalBusiness`. Sora chose `MedicalBusiness` for topical relevance. **Recommendation: emit BOTH** as two separate `<script>` blocks on homepage + every location page. Low file-size cost, maximum coverage. | Kimmy | No. |
| 4 | **`getNearbyLocations` → 6** — Spec upgraded from 4 → 6; padding with adjacent-state peers implemented in `lib/getNearbyLocations.ts` (§8.7). Verify all 159 cities return exactly 6 peers via a unit test after scaffolding. | Kimmy + Layla (QA) | No. |
| 5 | **Product prices unknown** — `sale_price` + `rental_price` not yet confirmed by Ibnu Sina Care (database.md §9 TODO 1). Ship with `NULL`; UI displays "Hubungi untuk harga"; update in Supabase post-launch via ISR without redeploy. Affects `ProductSchema.offers.lowPrice` / `highPrice` — fields must be omitted when null (invalid JSON-LD otherwise). | Cyclops | No — handled by conditional rendering. |
| 6 | **Product photo URLs** — 8 SKUs need absolute URLs in `product_photos.url` before Cyclops Part 2 runs (database.md §9 TODO 2 + 3). Kimmy + Kagura upload to Supabase Storage or host in `public/product/`. | Kimmy + Kagura | **Yes for Cyclops Part 2** (not for Kimmy's spec step, but Kimmy coordinates the upload). |
| 7 | **Blog post status enum** — database.md §9 TODO 8 — assumed `'published'` per EWM. Verify against shared schema before Hanabi writes. | Cyclops | No — trivial fix. |
| 8 | **`company_websites.domain` UNIQUE** — database.md §9 TODO 6 — frontend uses `.single()` on `.eq("domain", host)`, so the column must be unique. Verify before running §4 INSERT in database.md. | Cyclops | No. |
| 9 | **Leads mode under `single` stores only MS WhatsApp text** (inputs.md specifies EN and ZH variants). Frontend translation layer surfaces EN/ZH WA CTA text at click time (via `t('hero.ctaPrimary')` etc.) — the `whatsapp_text` column stores MS only. Flag for future `rotation`/`hybrid` upgrade: per-locale rows will be needed. | Cyclops (documented), Kimmy (implementation aware) | No. |
| 10 | **Pricing RM in copy** — copy-homepage.md §0 flag — neutral phrasing ("harga berpatutan", "sebut harga WhatsApp") until Ibnu Sina Care confirms. No fabricated RM values ship. | Nana (done) | No. |
| 11 | **Sora's `katil hospital 24 jam` trademark risk** — seo-plan.md §10.7 — the reference `katilhospital24jam.my` is a real MY competitor. Avoid verbatim copy; "the original 24 Jam" is off-limits. Kimmy double-checks all output copy doesn't trip this during the duplicate-description lint. | Nana + Kimmy | No. |
| 12 | **ZH low search volume** — expect 3–6 months for meaningful ZH indexing (seo-plan.md §10.5). Pages exist for brand + hreflang compliance. Don't over-optimise. | Sora (informational) | No. |
| 13 | **Duplicate meta description on 477 pages** — §14.6 lint is the CI gate. Hash-pick rule mathematically guarantees uniqueness; CI empirically verifies. | Kimmy | Yes — must pass before Gate 1. |
| 14 | **Alt text i18n** — every image's alt must use `t()` with a per-locale string (§14.8). Nana provides alt-text templates in `copy-locations.md §10` (product alt = `{Product Name} di {city}` / `{Product Name} in {city}` / `{city} {Product Name}`). | Kimmy wires into components | No. |
| 15 | **Red-clock favicon rendering at 16×16** — verify legibility in Chrome + Safari tabs post-deploy. If the clock ring + "24" degrades, fall back to a simpler glyph (solid red circle + white "24"). | Kimmy | No — test in QA. |

---

## 16. Pages Needing Translation Hook Updates (reference list)

Every page component and client subcomponent that renders user-visible copy:

- `app/[locale]/page.tsx` — homepage (uses `getTranslations`)
- `app/[locale]/HomePageClient.tsx` — uses `useTranslations()` for FOMO countdown labels, WA CTAs, product card CTAs
- `app/[locale]/katil-hospital/[location]/page.tsx` — location page (uses `getTranslations` + `locationCopy` hash-pick)
- `app/[locale]/katil-hospital/[location]/LocationPageClient.tsx` — uses `useTranslations()` + `useLocale()`
- `app/[locale]/blog/page.tsx` — uses `getTranslations({ namespace: 'blog' })`
- `app/[locale]/blog/[slug]/page.tsx` — post title/content come from `blog_translations`, UI labels (breadcrumb, CTA) from `t()`
- `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx` — "Membuka WhatsApp…" + fallback link translated via inline string or `t()`
- `components/LanguageSwitcher.tsx` — static `MS/EN/ZH` labels, no `t()` needed
- `components/BlogNav.tsx` + `components/BlogFooter.tsx` — use `useTranslations('blog')`
- FOMO banner subcomponent — must call `useLocale()` + `useTranslations('fomo')` (kimmy.md §16 "Components outside main page use useLocale()")

**Rule:** `getTranslations()` in Server Components, `useTranslations()` in Client Components. Never use `useTranslations` in a Server Component — it throws (kimmy.md rules).

---

## 17. Final Pre-Gate-1 Checklist

Kimmy verifies before handing to Gate 1:

- [ ] `i18n/routing.ts` — `locales:['ms','en','zh']`, `defaultLocale:'ms'`, `localePrefix:'always'`
- [ ] `messages/ms.json` complete (authored), `en.json` + `zh.json` translated from MS
- [ ] `components/LanguageSwitcher.tsx` — flag-less MS/EN/ZH, swaps URL segment
- [ ] hreflang emitted on every indexable page via `alternates.languages` + `x-default → /ms/*`
- [ ] `generateMetadata()` on homepage / location / blog listing / blog post — with canonical URL + OG + Twitter card
- [ ] Location-page meta uses `hash(slug) % 6` USP rotation — 477 unique descriptions verified
- [ ] Schema: Organization (layout) + MedicalBusiness + LocalBusiness (homepage + location) + Product (per SKU) + FAQ (homepage + location) + Breadcrumb (location + blog post) + BlogPosting (blog post)
- [ ] `app/[locale]/redirect-whatsapp-1/page.tsx` — `force-dynamic` + `noindex` + `?loc` param support
- [ ] `lib/supabase.ts` (copy EWM), `lib/waRedirect.ts` (copy EWM), `lib/getPhoneNumber.ts` (copy EWM + update fallback constants, retain all 4 leads modes), `lib/getBlogPosts.ts` (copy EWM + update `WEBSITE`)
- [ ] `lib/getProducts.ts` NEW — queries with `ISR revalidate=3600` on callers
- [ ] `lib/locationCopy.ts` NEW — hash-pick + state-name map + 159-row `localFacts` table transcribed from copy-locations.md §4.2.*
- [ ] `lib/getNearbyLocations.ts` NEW — returns **6** peers with adjacent-state padding
- [ ] `config/site.ts` NEW, `config/locations.ts` COPY-E24 (159 rows verified)
- [ ] `app/sitemap.ts` — 486 + 3N URLs, excludes `/redirect-whatsapp-1`
- [ ] `app/robots.ts` — allow all, disallow `/api/` + `/*/redirect-whatsapp-1`, sitemap URL
- [ ] Blog pages copied from EWM verbatim, palette swap only (red `#E11C1C` accent + WhatsApp green `#25D366` CTAs)
- [ ] `global.d.ts` created (`window.uwc` typing)
- [ ] Tracking script with `data-website="katilhospital-24jam.vercel.app"` in layout `<head>`
- [ ] WhatsApp clicks → `whatsapp-60174287801` (optionally `-{loc}`)
- [ ] Product impressions → `product-{slug}` via one-shot IntersectionObserver
- [ ] Blog clicks → `blog-{slug}`; blog-post end CTA → `blog-cta-{slug}`
- [ ] `app/icon.svg` — red-clock glyph (same as logo), verified legible at 16×16
- [ ] Layout ownership — `app/[locale]/layout.tsx` has NO header/footer
- [ ] All 10 CI lints pass (§14)

---

**End of Kimmy's spec.** Scaffolding proceeds once Gate 0 alignment is confirmed.
