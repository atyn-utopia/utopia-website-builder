# Full Website Setup Guide

> Complete step-by-step guide for setting up a new SEO website in the Utopia Webcore system.
> This document covers every action from initial input gathering to live deployment.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 0 — Gather Inputs](#2-step-0--gather-inputs)
3. [Step 1 — Create Project Folder](#3-step-1--create-project-folder)
4. [Step 2 — Run Agent Pipeline](#4-step-2--run-agent-pipeline)
5. [Step 3 — Scaffold the Next.js Project](#5-step-3--scaffold-the-nextjs-project)
6. [Step 4 — Connect Supabase (Shared Database)](#6-step-4--connect-supabase-shared-database)
7. [Step 5 — Build Core Files](#7-step-5--build-core-files)
8. [Step 6 — Build Pages](#8-step-6--build-pages)
9. [Step 7 — Add Tracking](#9-step-7--add-tracking)
10. [Step 8 — Dev Server + Screenshot Review](#10-step-8--dev-server--screenshot-review)
11. [Step 9 — User Confirms Design (Gate 1)](#11-step-9--user-confirms-design-gate-1)
12. [Step 10 — Insert Products into Database](#12-step-10--insert-products-into-database)
13. [Step 11 — Generate Blog Posts](#13-step-11--generate-blog-posts)
14. [Step 12 — User Confirms Content (Gate 2)](#14-step-12--user-confirms-content-gate-2)
15. [Step 13 — Seed Phone Number + Register Website](#15-step-13--seed-phone-number--register-website)
16. [Step 14 — Deploy](#16-step-14--deploy)
17. [Final Checklist](#17-final-checklist)

---

## 1. Prerequisites

Before starting, ensure you have:

- Access to the shared Supabase project (credentials in `/.env.local` at repo root)
- A GitHub account with push access to the `utopia-website-system` repo
- Vercel account for deployment
- Brand assets ready (logo, colors, fonts, reference images) — store in `brand_assets/{project}/`

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS 4 |
| i18n | next-intl 4 |
| Database | Supabase (shared instance for ALL websites) |
| Deployment | Vercel |
| Analytics | Utopia Webcore Tracking |

---

## 2. Step 0 — Gather Inputs

**Do not start building until all inputs are confirmed.**

Ask the user for every item below:

```
Project Inputs Checklist:

[ ] Company — which Utopia Group company owns this website? (MANDATORY)
      1. Encik Beku Aircond Sdn. Bhd.
      2. Butik Glam & Lux Sdn. Bhd.
      3. Mobile Wheeler Sdn. Bhd.
      4. Mandiri Sdn. Bhd.
      5. Pulse Pilates Sdn. Bhd.
      6. Jom Vend Sdn. Bhd.
      7. Scaffolding Malaysia Sdn. Bhd.
      8. Cold Truck Malaysia Sdn. Bhd.
      9. Rev Move Sdn. Bhd.
     10. Kak Kenduri Sdn. Bhd.
     11. Merry Elderly Care Sdn. Bhd.
     12. Ibnu Sina Care Sdn. Bhd.
     13. Rev Move Utara Sdn. Bhd.
     14. Rev Bike Sdn. Bhd.
     15. Utopia Holiday Sdn. Bhd.
     16. Outsource

[ ] Product name (e.g. "Electric Wheelchair")
[ ] Product slug (e.g. "electric-wheelchair")
[ ] Domain (e.g. "electric-wheelchair-malaysia.vercel.app")
[ ] Brand name (e.g. "Electric Wheelchair Malaysia")
[ ] Target country (e.g. Malaysia)
[ ] Target locations list (city names + slugs)
[ ] Languages — "English only, or also Bahasa Melayu and/or Mandarin?"
[ ] Phone number for WhatsApp (international format, e.g. 60123456789)
[ ] Leads mode — single / rotation / location / hybrid
[ ] Special requirements (e.g. rental system, phone routing, multiple products)
[ ] Brand assets available? (logo, colors, fonts, reference images)
[ ] Competitor URLs to analyse? (optional)
```

---

## 3. Step 1 — Create Project Folder

```bash
mkdir -p projects/{project-slug}
```

Save all collected inputs to `projects/{project-slug}/inputs.md`.

---

## 4. Step 2 — Run Agent Pipeline

The system uses 8 AI agents that run in a specific order. Some run in parallel.

### Agent Execution Order

```
Step A:  Alpha (System Architect)
            ↓
Step B:  Cyclops (Database) ∥ Sora (SEO)     ← parallel
            ↓
Step C:  Nana (Copywriter)
            ↓
Step D:  Kagura (UI Design) ∥ Kimmy (Tech)   ← parallel
```

### Agent Details

| Agent | Role | Input | Output |
|-------|------|-------|--------|
| **Alpha** | System architecture, confirms languages | All inputs from Step 0 | `architecture.md` |
| **Cyclops** | Supabase schema design | Alpha's output + locations list | `database.md` |
| **Sora** | SEO keyword plan, page hierarchy, internal linking | Alpha's output + product + locations + languages | `seo-plan.md` |
| **Nana** | Homepage copy + all location page copy | Alpha + Sora's output + brand tone + locations + locales | `copy-homepage.md`, `copy-locations.md` |
| **Kagura** | Unique UI design direction (reviews existing sites to avoid duplication) | Alpha + Nana's output + brand assets + reference images | `design-direction.md` |
| **Kimmy** | Technical SEO, i18n, WhatsApp redirect | Alpha + Sora + Nana's output + languages + domain | `technical-seo-i18n.md` |

All outputs are saved to `projects/{project-slug}/`.

### How to Invoke an Agent

Use the Claude Agent tool. Pass the contents of `agents/{agent-name}.md` as the prompt, plus all required inputs.

```
Agent tool:
  prompt: [contents of agents/alpha.md] + [project inputs]
```

---

## 5. Step 3 — Scaffold the Next.js Project

### Initialize

```bash
cd projects/{project-slug}
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
```

### Install Dependencies

```bash
npm install @supabase/supabase-js next-intl
npm install -D @tailwindcss/postcss puppeteer
```

### Expected `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev --port 3XXX",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Use a unique port per project (3001, 3002, 3003...) to avoid conflicts.

### Final Project Structure

```
projects/{project-slug}/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              ← locale layout (fonts, tracking, i18n provider)
│   │   ├── page.tsx                ← homepage
│   │   ├── HomePageClient.tsx      ← client-side homepage interactions
│   │   ├── {product-slug}/
│   │   │   └── [location]/
│   │   │       ├── page.tsx        ← location page (SSR)
│   │   │       └── LocationPageClient.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx            ← blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx        ← individual blog post
│   │   └── redirect-whatsapp-1/
│   │       ├── page.tsx            ← WhatsApp redirect (server)
│   │       └── RedirectClient.tsx  ← WhatsApp redirect (client)
│   ├── api/
│   │   └── phones/
│   │       └── route.ts            ← phone number API
│   ├── globals.css                 ← global styles + blog-content styles
│   ├── layout.tsx                  ← root layout (minimal)
│   ├── icon.svg                    ← favicon (MUST use the same icon from the logo)
│   ├── robots.ts                   ← robots.txt generator
│   └── sitemap.ts                  ← sitemap generator
├── components/
│   ├── BlogNav.tsx
│   ├── BlogFooter.tsx
│   ├── LanguageSwitcher.tsx
│   └── schema/
│       ├── BreadcrumbSchema.tsx
│       ├── FAQSchema.tsx
│       ├── LocalBusinessSchema.tsx
│       ├── OrganizationSchema.tsx
│       └── ProductSchema.tsx
├── config/
│   ├── site.ts                     ← site config (domain, brand, locales)
│   └── locations.ts                ← all target locations + nearby map
├── i18n/
│   ├── routing.ts                  ← locale routing config
│   └── request.ts                  ← request-level locale resolution
├── lib/
│   ├── supabase.ts                 ← Supabase client singleton
│   ├── getPhoneNumber.ts           ← phone number + leads mode logic
│   ├── getBlogPosts.ts             ← blog post queries
│   └── waRedirect.ts               ← WhatsApp redirect URL builder
├── messages/
│   ├── en.json                     ← English translations
│   ├── ms.json                     ← Bahasa Melayu translations
│   └── zh.json                     ← Mandarin translations
├── middleware.ts                   ← next-intl middleware
├── next.config.ts                  ← Next.js config (loads shared env)
├── postcss.config.mjs
├── tsconfig.json
└── .env.local → ../../.env.local   ← symlink to shared credentials
```

---

## 6. Step 4 — Connect Supabase (Shared Database)

**All websites share ONE Supabase database.** Never create a separate Supabase project.

### Symlink Shared Credentials

```bash
cd projects/{project-slug}
ln -sf ../../.env.local .env.local
```

### Configure `next.config.ts`

```ts
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Load shared Supabase env vars from repo root
loadEnvConfig(process.cwd() + '/../..');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
```

### Create `lib/supabase.ts`

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
```

---

## 7. Step 5 — Build Core Files

### `config/site.ts`

```ts
export const siteConfig = {
  domain: '{project-slug}.vercel.app',
  siteUrl: 'https://{project-slug}.vercel.app',
  brandName: '{Brand Name}',
  tagline: '{Product} Rental & Sales in Malaysia',
  productSlug: '{product-slug}',
  productName: '{Product Name}',
  fallbackPhone: '60XXXXXXXXX',
  defaultLocale: 'en',
  locales: ['en', 'ms', 'zh'] as const,
};
```

### `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});
```

### `i18n/request.ts`

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

### `middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
};
```

### `app/[locale]/layout.tsx`

```tsx
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website="{project-slug}.vercel.app"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        <NextIntlClientProvider messages={messages}>
          <OrganizationSchema />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### `lib/getPhoneNumber.ts`

This file handles all 4 leads modes. Copy from `projects/electric-wheelchair-malaysia/lib/getPhoneNumber.ts` and update:
- `FALLBACK_PHONE` — set to the user's phone number
- `FALLBACK_WA_TEXT` — set to the default WhatsApp message

### `lib/waRedirect.ts`

```ts
export function waRedirect(
  locale: string,
  message?: string,
  location?: string
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (location) params.set('loc', location);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
```

### `lib/getBlogPosts.ts`

Copy from `projects/electric-wheelchair-malaysia/lib/getBlogPosts.ts` and update:
- `WEBSITE` constant — set to the new domain

### WhatsApp Redirect Pages

**`app/[locale]/redirect-whatsapp-1/page.tsx`**

```tsx
import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber';
import RedirectClient from './RedirectClient';

export const dynamic = 'force-dynamic';

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string }>;
}) {
  const { loc } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const url = waLink(phone, whatsappText);
  return <RedirectClient url={url} />;
}
```

**`app/[locale]/redirect-whatsapp-1/RedirectClient.tsx`**

```tsx
'use client';
import { useEffect } from 'react';

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '12px' }}>Opening WhatsApp...</p>
        <a href={url} style={{ color: '#25D366', fontWeight: 600, fontSize: '16px' }}>
          Click here if it did not open
        </a>
      </div>
    </div>
  );
}
```

### `config/locations.ts`

Define all target locations with:
- `slug` — URL-safe city name
- `name` — display name
- `state` — state/region grouping
- `stateSlug` — URL-safe state name
- `nearbyMap` — related cities for internal linking

Reference: `projects/electric-wheelchair-malaysia/config/locations.ts` for the full Malaysia locations list.

### Translation Files (`messages/*.json`)

Create `en.json`, `ms.json`, `zh.json` with sections:
- `nav` — navigation labels, CTA button text
- `hero` — homepage hero section
- `products` — product section headings
- `locations` — location section headings
- `faq` — FAQ section
- `footer` — footer text, copyright
- `blog` — blog listing/post labels (title, readMore, noPosts, breadcrumbHome, breadcrumbBlog, publishedOn, minRead, recentPosts, metaTitle, metaDescription)

---

## 8. Step 6 — Build Pages

### Homepage (`app/[locale]/page.tsx`)

Must include:
- H1 with primary keyword
- Product grid (dynamic from Supabase `products` table, NOT hardcoded)
- Location section with links to all location pages
- FAQ section
- WhatsApp CTA
- Schema markup (Organization, Product, FAQ)

### Location Pages (`app/[locale]/{product-slug}/[location]/page.tsx`)

Each location page must have:
- **Unique copy** — no duplicate content across locations
- Location-specific H1 with keyword
- Location-specific introduction
- Product grid (same dynamic query)
- FAQ with location-specific questions
- Nearby locations for internal linking
- WhatsApp CTA with `loc={slug}` parameter
- Schema markup (LocalBusiness, Breadcrumb)

### Blog Listing (`app/[locale]/blog/page.tsx`)

**Must match electric-wheelchair-malaysia blog layout:**
- Header banner with gradient background
- Auto-fill grid (`minmax(340px, 1fr)`) with cards
- Each card: cover image, date, title, excerpt, "Read More" link

### Blog Post (`app/[locale]/blog/[slug]/page.tsx`)

**Must match electric-wheelchair-malaysia blog layout:**
- Breadcrumb navigation
- Article column (max 740px) + sticky sidebar with recent posts
- Cover image, title, published date, reading time
- Blog content rendered via `dangerouslySetInnerHTML`
- Table of contents in articles
- WhatsApp CTA banner at bottom

### Blog Content CSS (in `globals.css`)

```css
.blog-content h2 { font-size: 28px; font-weight: 700; color: var(--navy); margin: 2em 0 0.5em; line-height: 1.25; }
.blog-content h3 { font-size: 24px; font-weight: 700; color: var(--navy); margin: 1.5em 0 0.5em; line-height: 1.3; }
.blog-content p { font-size: 16px; line-height: 1.75; margin: 0 0 1em; color: var(--text); }
.blog-content img { max-width: 100%; height: auto; border-radius: var(--radius-lg); margin: 1.5em 0; }
.blog-content ul, .blog-content ol { margin: 1em 0; padding-left: 1.5em; }
.blog-content li { margin: 0.5em 0; line-height: 1.6; }
.blog-content blockquote { border-left: 4px solid var(--orange); padding: 1em 1.5em; margin: 1.5em 0; background: var(--orange-pale); border-radius: 0 var(--radius-md) var(--radius-md) 0; }
.blog-content a { color: var(--orange); text-decoration: underline; }
.blog-content a:hover { opacity: 0.8; }
```

### SEO Files

**`app/robots.ts`** — generate robots.txt allowing all crawlers  
**`app/sitemap.ts`** — generate sitemap with all pages (homepage, locations, blog posts) in all locales  
**Schema components** — Organization, Product, FAQ, LocalBusiness, Breadcrumb (in `components/schema/`)

---

## 9. Step 7 — Add Tracking

**MANDATORY for every website.** See `docs/tracking-guide.md` for full details.

### 1. Add Tracking Script

Already included in `app/[locale]/layout.tsx` above:

```html
<script defer src="https://webcore.utopiaai.my/t.js" data-website="{domain}" />
```

`data-website` MUST match the exact deployed domain.

### 2. Add TypeScript Declaration

Create `global.d.ts` in the project root:

```ts
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void
  }
}
export {}
```

### 3. Track WhatsApp Button Clicks

In every WhatsApp button/CTA component:

```ts
if (typeof window !== 'undefined' && window.uwc) {
  window.uwc('click', { label: `whatsapp-${phoneNumber}` })
}
```

### 4. Track Product Impressions

Use IntersectionObserver on product cards:

```ts
window.uwc('impression', { label: `product-${slug}` })
```

Disconnect observer after first trigger — only track once per card.

### 5. Track Blog Article Clicks

On blog listing page, track clicks to individual articles:

```ts
window.uwc('click', { label: `blog-${slug}` })
```

### Label Conventions

| Action | Label Format |
|--------|-------------|
| WhatsApp click | `whatsapp-{phone_number}` |
| Call click | `call-{phone_number}` |
| Product impression | `product-{product_slug}` |
| Blog article click | `blog-{article_slug}` |

---

## 10. Step 8 — Dev Server + Screenshot Review

```bash
cd projects/{project-slug}
npm run dev
```

Take screenshots:

```bash
node screenshot.mjs http://localhost:3000
```

Screenshots saved to `temporary screenshots/`.

**Perform at least 2 comparison rounds:**
1. Compare with reference images or design direction
2. Fix spacing, typography, color mismatches
3. Screenshot again and verify fixes

Check:
- Desktop + mobile layouts
- All page types (homepage, location, blog listing, blog post)
- Language switcher works across all 3 locales
- WhatsApp redirect works

---

## 11. Step 9 — User Confirms Design (Gate 1)

Present the website to the user. **Do not proceed until confirmed:**

- [ ] Website structure is correct
- [ ] Layout matches expectations
- [ ] Design and styling are approved
- [ ] Navigation and language switcher work
- [ ] WhatsApp redirect works

---

## 12. Step 10 — Insert Products into Database

**MANDATORY — must complete before deployment.**

Spawn Cyclops (Part 2) to insert product data:

```sql
-- Example product insertion
INSERT INTO products (website, name, slug, description, sale_price, rental_price, sort_order, is_active)
VALUES
  ('{domain}', '{Product Name}', '{product-slug}', '{description}', {price}, {rental_price}, 1, true);

-- Example product photo insertion
INSERT INTO product_photos (product_id, url)
VALUES
  ('{product_id}', 'https://images.pexels.com/...');
```

### Rules
- `website` column MUST match the exact deployed domain
- Use `is_active = true` for products to display
- `sort_order` controls display order
- Product images go in `product_photos` table, NOT hardcoded in frontend
- Use ISR with `revalidate = 3600` — products appear within 1 hour of DB change

### Verify
- All product rows exist in Supabase
- All product images load correctly
- Products display on homepage and location pages

---

## 13. Step 11 — Generate Blog Posts

**MANDATORY — must complete before deployment.**

### Prerequisites
- Blog routes exist: `app/[locale]/blog/page.tsx` and `app/[locale]/blog/[slug]/page.tsx`
- `blog_posts` and `blog_translations` tables exist in Supabase

### Blog Layout Reference
**Must match `projects/electric-wheelchair-malaysia/app/[locale]/blog/`:**
- Same `blog-content` CSS styles for headings
- Table of contents in articles
- Same listing grid + post page layout
- Breadcrumbs, reading time, WhatsApp CTA banner

### Spawn Hanabi (Blog Writer)

Hanabi generates **minimum 10 blog articles**:

1. 10 SEO-optimized article titles for the product niche
2. Full articles (800–1500 words each) with heading hierarchy (H1 > H2 > H3 > H4 > p)
3. Real images (Pexels/Unsplash — Asian/Malaysian subjects only)
4. Internal backlinks to product and location pages
5. WhatsApp CTAs within articles
6. Inserted into Supabase for all supported locales:
   - `blog_posts` — slug, cover_image_url, website, status='published'
   - `blog_translations` — title, content, excerpt, meta_title, meta_description per language

### Verify
- All 10+ blog posts visible on `/en/blog`
- Individual post pages render correctly
- Blog works in all 3 locales
- Images load, internal links work

---

## 14. Step 12 — User Confirms Content (Gate 2)

Present the full website to the user. **Do not proceed until confirmed:**

- [ ] Products displaying correctly from database
- [ ] Blog posts are live and accessible
- [ ] All 3 locales working (en/ms/zh)
- [ ] Blog layout matches electric-wheelchair reference
- [ ] Overall content quality approved

---

## 15. Step 13 — Seed Phone Number + Register Website

### Insert Phone Number

```sql
INSERT INTO phone_numbers (website, location_slug, phone_number, label, type, is_active, whatsapp_text, percentage)
VALUES ('{domain}', 'all', '{phone_number}', 'default', 'default', true, 'Hi, saya berminat dengan {product}...', 100);
```

### Register Website in `company_websites`

```sql
INSERT INTO company_websites (company_id, domain, leads_mode)
VALUES ('{company_uuid}', '{domain}', '{leads_mode}');
```

Company UUIDs (from `companies` table):

| Company | UUID |
|---------|------|
| Encik Beku Aircond Sdn. Bhd. | `16e62068-365d-4907-b7f0-763a173d8afa` |
| Butik Glam & Lux Sdn. Bhd. | `215139a6-8ac7-449e-8310-0a38ccc8d579` |
| Mobile Wheeler Sdn. Bhd. | `23bd0372-9f4b-4410-ae56-a8aecd54ea90` |
| Mandiri Sdn. Bhd. | `374c1201-246f-41bf-b59a-a04efab47eaa` |
| Pulse Pilates Sdn. Bhd. | `3f5087b3-6b0f-441a-a864-49b82f8335a4` |
| Jom Vend Sdn. Bhd. | `6961d264-61e6-49ac-93f5-70daf1687106` |
| Scaffolding Malaysia Sdn. Bhd. | `7c15d93f-c2f7-488d-b38c-4b85d65a06d1` |
| Cold Truck Malaysia Sdn. Bhd. | `99e92ff1-d776-4154-9346-426e3cb91936` |
| Rev Move Sdn. Bhd. | `9e5a0a86-55cb-4754-93fd-f80dccb2a17a` |
| Kak Kenduri Sdn. Bhd. | `ce95071b-e575-4983-bdd4-66910f45fe34` |
| Merry Elderly Care Sdn. Bhd. | `d4a9e4ba-a1da-4548-a45f-526579c56b6d` |
| Ibnu Sina Care Sdn. Bhd. | `d6cc8f48-ea42-4420-b9d6-73ca63263be0` |
| Rev Move Utara Sdn. Bhd. | `ef7b3fec-68d7-4153-bf2e-39c5d8621592` |
| Rev Bike Sdn. Bhd. | `eff0fecf-ef85-449a-bd68-dac176945700` |
| Utopia Holiday Sdn. Bhd. | `f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c` |
| Outsource | `f81da9e5-3896-4a98-abe1-247252c81258` |

### Verify
- WhatsApp redirect works on the live site
- Correct phone number is returned
- Leads mode is set correctly

---

## 16. Step 14 — Deploy

Spawn **Layla** (QA & Deployment Specialist) only after user confirms in Gate 2.

### Layla's Checklist

1. Verify phone number system is connected and working
2. Verify products load from Supabase
3. Verify blog posts load from Supabase
4. Verify tracking script is present and `data-website` matches domain
5. Push code to GitHub
6. Deploy to Vercel
7. Add Supabase env vars to Vercel: `vercel env add`
8. Report the live URL

### Vercel Environment Variables

Add these to Vercel for the project:

```
NEXT_PUBLIC_SUPABASE_URL=https://xzydvhzcngpxdbyniliy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY={anon_key}
```

---

## 17. Final Checklist

Before calling the website "done", verify everything:

### Structure
- [ ] Homepage loads with dynamic products from Supabase
- [ ] All location pages have unique copy
- [ ] Blog listing shows 10+ posts
- [ ] Individual blog posts render correctly
- [ ] WhatsApp redirect works (returns correct phone number)

### SEO
- [ ] Every page has meta title + description
- [ ] H1 heading structure on every page
- [ ] Schema markup (Organization, Product, FAQ, LocalBusiness, Breadcrumb)
- [ ] Sitemap generated with all pages in all locales
- [ ] robots.txt allows crawling
- [ ] Image alt text on all images
- [ ] Internal links between pages

### i18n
- [ ] Language switcher works (EN / MS / ZH)
- [ ] All translations present in `messages/*.json`
- [ ] Locale prefix in URLs (`/en/`, `/ms/`, `/zh/`)
- [ ] Meta tags localized

### Database
- [ ] `company_websites` row exists with correct `company_id` and `leads_mode`
- [ ] `phone_numbers` row exists with correct `website` domain
- [ ] `products` rows exist with correct `website` domain
- [ ] `blog_posts` + `blog_translations` rows exist for all locales

### Tracking
- [ ] Tracking script in `<head>` with correct `data-website`
- [ ] WhatsApp clicks tracked (`uwc('click', { label: 'whatsapp-...' })`)
- [ ] Product impressions tracked (`uwc('impression', { label: 'product-...' })`)
- [ ] Blog clicks tracked (`uwc('click', { label: 'blog-...' })`)
- [ ] TypeScript declaration for `window.uwc` in `global.d.ts`

### Design
- [ ] Custom brand colors (never default Tailwind blue/indigo)
- [ ] Display font for headings, sans font for body
- [ ] Mobile-responsive on all pages
- [ ] Blog layout matches electric-wheelchair-malaysia reference
- [ ] Logo icon and favicon (`app/icon.svg`) use the **same icon** — must be identical
- [ ] **Heading hierarchy** — one H1 (hero title), one H2 (hero subtitle), H3–H6 for sections. No multiple H1s or H2s.
- [ ] **Image backgrounds** used on some sections (not all flat solid color)
- [ ] **3-point USP bar** immediately below hero section
- [ ] **All buttons same rounded shape** — only color varies
- [ ] **No phone numbers or domain names** displayed as visible text
- [ ] **Mobile center-aligned** — headings, buttons, cards, icons centered on mobile
- [ ] **All images verified** — every image matches its context, no placeholders left

### Deployment
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Env vars set on Vercel
- [ ] Live URL accessible and working
