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
[ ] Domain — the PAID domain (e.g. "electric-wheelchair.my"). MANDATORY.
      This becomes the webcore row key for every product, phone number and blog
      post, so changing it later means re-keying all of them by hand.
      48 of the 51 registered sites run on a paid domain — a *.vercel.app value
      is the exception, not the convention. And do NOT guess one: this Vercel
      team serves deployments on *.utopiaai.my, so {slug}.vercel.app 404s.
      If the paid domain genuinely is not decided yet, see the note in Step 2.
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

**Preferred: scaffold from the canonical reference (every structural check passes on day one).**
A fresh scaffold still has two blocking failures — `db-blog-posts` and `fallback-phone-is-own` —
because no Supabase rows exist for the new domain yet; they clear once Cyclops seeds the phone
and Hanabi seeds the blog. Structure is what the scaffold guarantees, not DB state.
Instead of an empty folder, clone the `water-tank-malaysia` skeleton — chrome, PageStyles,
WhatsApp redirect page, blog listing + article,
i18n, schema, and tracking come pre-correct, so whole guardrail failure classes
(`site-chrome`, `homepage-h1-h2`, `page-styles`, `i18n-routing`, `schema-components`)
are prevented by construction:

```bash
cd utopia-wizard && npm run scaffold -- \
  --slug={project-slug} --brand="{Brand Name}" \
  --product="{Product Name}" --product-slug={product-slug} \
  --domain={paid-domain} --phone=60XXXXXXXXX
```

> `--domain` is required and is no longer guessed. It used to default to
> `{slug}.vercel.app`; that guess reached `config/site.ts`, every canonical /
> sitemap / og:image URL, AND the webcore row key — so one unverified value
> silently pointed a whole site's SEO at a 404 host and pinned its database rows
> to a name nobody could serve. Check the real production host with
> `vercel project ls` ("Latest Production URL").

This writes `projects/{project-slug}/` with a correct structure + an `inputs.md` stub.
It deliberately leaves **copy, brand assets, the real locations list, and the
project-unique special section** as TODO — those are the agent pipeline's job
(Steps 2–6). Update the generated `inputs.md` with the full Step 0 inputs.

> Manual fallback (not recommended): `mkdir -p projects/{project-slug}` and save
> inputs to `projects/{project-slug}/inputs.md`, then scaffold the Next.js app by
> hand in Step 3. You lose that structural baseline and must build the chrome correctly yourself.

### The guardrail gate applies from here on

Every builder agent and every commit is now gated by the wizard's 100 checks
(54 blocking / 46 advisory — see [guardrails.html](guardrails.html)):

- **Agents** must run `cd utopia-wizard && npm run gate -- --source-only {slug}`,
  fix every **blocking** failure, and paste the passing output before returning
  (see [prompts/agent-self-check.md](../prompts/agent-self-check.md)).
- **Commits** touching a project run the same gate via `.githooks/pre-commit`.
- **PRs** run the full gate + ratchet in CI (`guardrails-gate` workflow).
- **Deploy** (Step 14, Layla) runs `npm run gate -- --ratchet {slug}` and refuses
  to deploy on any blocking failure or score regression.

The two human gates (Gate 1 design, Gate 2 content) then focus purely on judgment
the scanner can't make — image fit, layout craft, copy quality.

---

## 4. Step 2 — Run Agent Pipeline

The system uses 8 AI agents that run in a specific order. Some run in parallel.

### Agent Execution Order

```
Step A:  Alpha (System Architect)
            ↓
Step B:  Cyclops (Database) ∥ Sora (SEO)     ← parallel
            ↓
Step B2: KEYWORD VOLUME GATE                 ← blocking, see below
            ↓
Step C:  Nana (Copywriter)
            ↓
Step D:  Kagura (UI Design) ∥ Kimmy (Tech)   ← parallel
```

### Step B2 — Keyword Volume Gate (MANDATORY, blocking)

Sora produces keywords from model knowledge, not from search data. Nothing
downstream questions them: Nana writes every H1 from the plan, Kimmy builds
every meta title and slug from it, Hanabi picks blog topics from it. A head
term nobody searches therefore propagates into the whole site, and by the time
Search Console could reveal it (4–8 weeks post-launch) the fix costs a slug
migration and a 301 map.

Verify the plan against real Google search volume **before Nana writes a word**:

```bash
cd scripts/google-automation

# review what will be checked (no API call)
node keyword-volume.mjs --plan ../../Documents/GitHub/utopia-website-builder/projects/{slug}/seo-plan.md --list

# the gate — exits non-zero if a HEAD term has no volume
node keyword-volume.mjs --plan .../projects/{slug}/seo-plan.md --lang ms
node keyword-volume.mjs --plan .../projects/{slug}/seo-plan.md --lang en
```

**Reading the result:**

| Tier | Zero volume means | Action |
|---|---|---|
| `head` | Fatal — every page inherits this term | Stop. Fix `seo-plan.md`, re-run the gate. |
| `long-tail` | Normal and expected | No action. The page still catches the query. |
| location templates (`{location}`) | Not measured at all | By design — low per-city volume is the long-tail play. |

Keyword Planner reports `0` for anything under its disclosure threshold, so `0`
means "under ~10/mo in this market", not literally nobody.

**When a head term is dead**, find the live synonym rather than guessing again:

```bash
node keyword-volume.mjs --ideas "pakej aqiqah" --lang ms
```

Then edit `seo-plan.md` and re-run until the gate passes. Record the numbers in
the plan so Nana, Kimmy and Hanabi inherit verified terms.

> Requires the head terms to sit under a heading Sora marks as primary (e.g.
> `### 1.2 Primary money keywords`). If the script warns that no head-term
> section was found, nothing can fail the gate — fix the plan's headings or pass
> the head terms explicitly with `--keywords`.

See `.claude/skills/keyword-research/SKILL.md` for full flag reference.

> **If the paid domain is not decided yet, do not register the site in webcore
> at Step 2.** Scaffold with the intended domain so the code is consistent, but
> have Cyclops hold the `POST /api/public/sites` + phone/product seeding until
> the domain is settled or the first deploy reveals the real host. Registering
> early keys every row to a name you then have to migrate — see
> `projects/sticker-lori-malaysia/DOMAIN-MIGRATION.md` for what that costs
> (22 rows across 5 tables, plus a gate check that fails until it is done).
>
> `config/site.ts` separates the two concerns for exactly this reason:
> `domain` = the webcore row key, `url` = where the site is actually served.
> Never change `domain` alone to make them match — that orphans every row while
> the site keeps returning 200 with empty sections.

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

> **If you scaffolded in Step 1, skip Initialize** — the Next.js app, config,
> chrome, and dependencies are already in place. Just symlink env + install:
> `cd projects/{project-slug} && ln -sf ../../.env.local .env.local && npm install`.
> The steps below are only for the manual fallback path.

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

> **`fallbackPhone` MUST be the client's own number — never a shared Utopia/operator test number.** `fallbackPhone` is what the site serves whenever the Supabase phone lookup returns nothing (missing row, host mismatch, DB down). If you reuse one operator number across sites, a single lookup miss silently puts *your* number on a client's live site — and the same number showing under multiple sites makes the wizard's phone panel ambiguous. One real client number per site; if you truly don't have it yet, use an obviously-fake sentinel (e.g. `60000000000`) so a fallback is visible, not a live personal line.

### `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ms', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // MANDATORY: 'as-needed' serves the default locale at `/` with NO prefix
  // (clean URL — e.g. site.my/ is the default language, not site.my/ms) while
  // non-default locales keep their prefix (/en, /zh). A prefixed default-locale
  // URL (/ms) 301-redirects to `/`, so there's no duplicate content.
  localePrefix: 'as-needed',
  // MANDATORY: disables browser Accept-Language autodetection. Without this,
  // a Malay-default site loses every visitor whose browser is set to English
  // — they get served the wrong language on the first hit. The default
  // language we configure is the one we want every fresh visitor to land on.
  localeDetection: false,
});
```

**Default-language rule (MANDATORY).** Whichever locale is set as `defaultLocale`, every fresh visitor MUST land on that locale's page first — regardless of browser language. `localePrefix: 'as-needed'` + `localeDetection: false` is what enforces this: `/` serves the default locale (no prefix, no detection), and `/<defaultLocale>` redirects to `/`. Pick the default per project (MS for sewa-* / Malay-first brands, EN for English-first brands) and never leave `localeDetection` on its default (`true`).

**Locale-aware URLs (MANDATORY with `as-needed`).** Because the default locale has no prefix, every canonical / sitemap / hreflang URL must omit the `/<locale>` segment for the default locale. Use a `lib/localeHref.ts` helper (`locale === defaultLocale ? siteConfig.url : \`${siteConfig.url}/${locale}\``) and build all SEO URLs through it — never hardcode `${siteConfig.url}/${locale}`. The middleware matcher must be the broad form `['/((?!api|_next|_vercel|.*\\..*).*)']` so un-prefixed default-locale paths (e.g. `/product/city`) are handled.

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
          src="https://utopia-webcore.vercel.app/t.js"
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

This file handles all 4 leads modes. Copy from `projects/electric-wheelchair-malaysia/lib/getPhoneNumber.ts` (or `lib/webcore.ts`) and update:
- `FALLBACK_PHONE` — set to the **client's** phone number (see the `fallbackPhone` note above — never a shared operator number)
- `FALLBACK_WA_TEXT` — set to the default WhatsApp message

> **`getHostDomain()` MUST normalise the host — strip the port AND a leading `www.`:**
> ```ts
> return host.replace(/:\d+$/, '').replace(/^www\./, '')
> ```
> Sites canonicalise apex → `www.` (or vice versa), so the runtime host is often `www.<domain>` while the `phone_numbers` / `company_websites` rows are keyed to the **bare apex**. Without stripping `www.`, the lookup misses and the site silently falls back to `fallbackPhone`. This bit `roller-shutter` (served the operator's number on the live `www.` host). The canonical reference `projects/water-tank-malaysia/lib/webcore.ts` already does this, so scaffolded sites inherit it — don't remove it.

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

### Utopia Brand CI — Footer Credit + Structural Tokens (MANDATORY on every site)

Insert the Utopia Corporate CI **elements** into every site. **Scope is deliberately narrow** — this is a build-credit + structural tokens, **NOT a Utopia reskin.** The site keeps its **own palette, fonts, and button *shape*.** Do not recolour anything blue, do not swap fonts.

**1. Structural tokens — add to `globals.css` `:root` (radius + motion ONLY):**

```css
:root {
  /* Utopia CI structural tokens — radius + motion only (palette/fonts stay per-project) */
  --r-button: 8px;
  --r-card: 12px;
  --r-pill: 999px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-hover: 220ms;
  --dur-layout: 320ms;
}
```

> ⚠️ **Do NOT retrofit `--r-button` onto existing CTAs.** If the site already uses pill / `rounded-full` buttons (e.g. cat-rumah), forcing 8px changes the client's design. Define the tokens; only the credit link and any *new* Utopia-CI elements consume them. Existing buttons keep their current shape.

**2. "Built by Utopia AI" footer credit — add to the shared `SiteFooter.tsx`** (alongside the copyright line, once per page):

```tsx
<a
  className="utopia-credit"
  href="https://utopiagroup.com.my"
  target="_blank"
  rel="noopener noreferrer"
>
  <span>Built by</span>
  <span className="utopia-credit__word">Utopia</span>
  <svg className="utopia-credit__mark" width="14" height="12" viewBox="0 0 64 56" aria-hidden="true">
    <defs>
      <linearGradient id="utopiaCreditGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0054A6" />
        <stop offset="50%" stopColor="#2774AE" />
        <stop offset="100%" stopColor="#4A9DD0" />
      </linearGradient>
    </defs>
    <polygon points="32,4 60,52 4,52" fill="url(#utopiaCreditGrad)" />
  </svg>
  <span className="utopia-credit__word">AI</span>
</a>
```

**3. Credit styles — add to `globals.css`** (consumes the tokens above; easeOutExpo hover lift, icon never compresses):

```css
.utopia-credit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: inherit;              /* inherits the site's own footer text colour */
  text-decoration: none;
  border-radius: var(--r-button);
  transition: transform var(--dur-hover) var(--ease), opacity var(--dur-hover) var(--ease);
}
.utopia-credit:hover { transform: translateY(-1px); opacity: 0.85; }
.utopia-credit__mark { flex: none; }   /* triangle icon must never compress */
```

**Reference implementation:** `atyn-utopia/sewa-motor-malaysia` (extracted deploy repo) — `components/SiteFooter.tsx` credit block + `globals.css` token block. The full CI spec is `brand_assets/utopia-brand-kit/CI.md` (locked v1.5.1) when present.

For an **already-live site** ("apply the brand CI to X"), this is the same two-part change (tokens + footer credit); on extracted per-site repos it needs a **redeploy** (`vercel --prod`) to go live, not just a push.

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
<script defer src="https://utopia-webcore.vercel.app/t.js" data-website="{domain}" />
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

### 8b. Generate the social share cards (MANDATORY — owned by Kimmy)

A link with no `og:image` renders as a bare text card in WhatsApp, Facebook and
X. Only 7 of 28 projects had one before this became a step, and the canonical
reference had none — so a site could pass every other check and still share as
plain text.

The card is a 1200x630 screenshot of the hero, one per locale. It runs **here**,
not with Kimmy's other metadata work, because it needs a built site being served.

```bash
cd projects/{project-slug}
npm run build && npm run start      # one shell
node scripts/og-shot.mjs            # another
```

Prerequisites Kimmy should already have done (Step 5/6): `lib/ogImage.ts` and
`scripts/og-shot.mjs` copied from `templates/site-chrome/`, `metadataBase` set,
and `ogImages(locale)` spread into **every** page that defines `openGraph` —
layout, location, blog listing, blog article. Next replaces a parent's
`openGraph` wholesale, so inheriting does not work.

Then verify, in this order:

- [ ] **Look at every PNG.** Correct dimensions do not mean a good card — check
      nothing is sliced mid-text and the logo, H1 and CTA are intact.
- [ ] Restart the server before testing the URLs: `next start` snapshots
      `public/` at boot, so cards written while it runs return **404** until it
      restarts. (`pkill -f "next start"` will not match it — the process is
      named `next-server`; use `lsof -ti:<PORT> | xargs kill -9`.)
- [ ] `curl -sI localhost:<PORT>/og-{locale}.png` → 200 `image/png` for each.
- [ ] Each locale's HTML carries its own card: `curl -s localhost:<PORT>/<prefix> | grep og:image`.

> These are screenshots, so they go stale **silently** — the site looks right and
> only the shared link is wrong. Rerun `node scripts/og-shot.mjs` after any hero
> copy, image, or palette change, and before any redeploy that touched the hero.

Check:
- Desktop + mobile layouts
- All page types (homepage, location, blog listing, blog post)
- Language switcher works across all 3 locales
- WhatsApp redirect works

---

### Layout & Design Checklist (MANDATORY before Gate 1)

Every item below MUST be verified on the running site. These rules come from real user feedback on prior projects — every line is here because something broke or had to be iterated on. Treat them as blocking acceptance criteria.

#### Alt text (every image, no exceptions)
- [ ] Every `<img>` has a descriptive alt — never `alt=""` for content images. Decorative images that genuinely carry no information may use `alt=""` but only as a last resort.
- [ ] **Brand logo alts** (hero, header, footer, location hero) all come from `nav.logoAlt` — a brand-name + tagline string (~6–10 words) localised for MS/EN/ZH. Never hard-code `alt="Abang Excavator"`.
- [ ] **Hero image / operator photo** uses `hero.imageAlt` — describes the photo + product + scene.
- [ ] **Product images** use `products.imageAltTemplate` with `{model}` substitution.
- [ ] **Gallery images** use `gallery.alts[]` — one descriptive string per image per locale (not a generic "image N").
- [ ] **CSS background images** (hero-bg, why-bg, process section, reviews section) attach `role="img"` + `aria-label={t('bgAlt')}` on the container so screen readers describe what's in the bg.
- [ ] **Final CTA `<img>` bg** uses `finalCta.bgAlt` — never empty alt.
- [ ] Alt strings live in `messages/{ms,en,zh}.json` so each locale gets its own. No hard-coded English fallbacks.
- [ ] Alt should include the primary keyword at least once where natural — without keyword stuffing.

#### Assets & Images
- [ ] Use brand-provided assets from `brand_assets/` for hero photo, product photos, gallery, logos. Never substitute with stock photos when brand assets exist.
- [ ] **DO NOT convert image formats automatically.** Keep PNGs as PNG and JPEGs as JPEG — don't change formats when fixing tasks. Re-encoding PNG → JPEG flattens alpha (breaks transparent cutouts) and has broken images in real projects. If a file is genuinely too large for the web (>5 MB) flag it for the user; do not silently re-encode it.
- [ ] For any asset >5 MB, use plain `<img loading="lazy" decoding="async">` — `<Image>` from `next/image` silently rejects huge files and leaves blank gaps in galleries / product cards.
- [ ] Add `projects/{slug}/.gitignore` excluding `brand_assets/` and `temporary screenshots/` — raw artwork must not enter git.
- [ ] **Utopia Brand CI elements inserted** — "Built by Utopia AI" credit in `SiteFooter` + `--r-*`/`--ease`/`--dur-*` tokens in `globals.css` (Step 5 → "Utopia Brand CI"). Elements only — site keeps its own palette, fonts, and button shape; do not force `--r-button` onto existing pill CTAs.

#### Typography
- [ ] Body font is **Inter** site-wide. Not Plus Jakarta Sans, not the default Tailwind stack.
- [ ] **Every visible text element must sit inside a heading tag (h1–h6).** This is non-negotiable per user rule, even if it appears to break "proper" semantic HTML.
- [ ] **Heading level is keyword-driven**, not structural:
  - **H1** → hero title (one per page), must contain primary keyword.
  - **H2** → hero subtitle (one per page), keyword variant.
  - **H3** → every section title. MUST contain a primary keyword (see Keyword stuffing below). USP bar gets a visually-hidden H3 for SEO while keeping the "no visible USP heading" design rule.
  - **H4** → only for copy that contains a primary keyword: section-head intros with keywords (e.g. products + locations intros), product card titles ("Volvo EC200"), state labels in the locations grid, FAQ answers (typically have product/price keywords).
  - **H5** → for copy WITHOUT primary keywords: hero supporting line, intros without keyword (calc/process/why/reviews/gallery/faq intros), card bodies (USP body, process step body, why-card body), reviews aggregate pill, review body, final-CTA body, brand-strip eyebrow.
  - **H6** → small captions: review author name, review suburb, process step numbers (01/02/03).
  - Bare `<span>` / `<p>` for visible copy is a bug.
- [ ] **Keyword stuffing in headings (mandatory).** Every H3 + every eyebrow + every H4 intro must contain at least one primary keyword (`excavator`/`Volvo`/`EC200`/`EC400`/`sewa`/`rental`/geo). Audit headings like "Kira Kos Sewa Segera", "Cara Sewa Excavator dalam 4 Langkah", "Soalan Lazim Sewa Excavator" — never ship a heading without a keyword. Rewrite weak headings (e.g. "Soalan Lazim" → "Soalan Lazim Sewa Excavator", "Dipercayai oleh Industri" → "Dipercayai Kontraktor Sewa Excavator Malaysia").
- [ ] Update PageStyles selectors after any text-tag swap: e.g. `.usp-cell p` → `.usp-cell p, .usp-cell h5`. Add a `font-weight: inherit` normaliser at the top so the new headings don't pick up huge default sizes.
- [ ] All H1–H4 strings in `messages/*.json` are in proper Title Case with conjunctions kept lowercase. MS lowercase set: `dan, atau, di, dalam, untuk, pada, ke, dengan, dari, oleh, yang, tanpa, bagi, serta, seperti, antara, melalui`. EN lowercase set: `a, an, the, and, or, but, nor, of, to, in, on, at, by, for, with, from, into, via, vs, as, if, so`. ZH untouched.
- [ ] NEVER use CSS `text-transform: capitalize` on headings — it capitalizes every word and breaks conjunction rules. Title-case the source strings instead.
- [ ] ICU placeholder names are lowercase (`{location}`, `{state}`, `{price}`, `{model}`) — a Title Case script must NOT uppercase placeholders. Run a final pass to lowercase `\{(\w+)\}`.
- [ ] Exactly one H1 + one H2 per page (both in the hero). All other section titles use H3–H6.

#### Hero (homepage + every location page)
- [ ] Hero uses a brand-provided image background (e.g. `/brand/bg-hero.jpg`) with a multi-layer overlay: vertical fade (dark at top fading to darker at bottom) + horizontal gradient (text side darker) + subtle orange radial glow accents for warmth.
- [ ] Stack order inside `.hero-text`: brand logo → eyebrow tag → H1 → H2 → support paragraph → CTA row → stats. The logo sits ABOVE the eyebrow, the eyebrow ABOVE the H1.
- [ ] Hero brand logo is a plain `<img>` (not `<Image>`) with `width: clamp(120px, 13vw, 192px)` as a starting size — expect the user to iterate. Use the logo variant designed for the hero's background (dark bg → white wordmark file; this repo's convention is `abang-excavator-dark.png` = white wordmark for dark backgrounds).
- [ ] Hero product/operator photo is a transparent PNG cutout displayed via plain `<img>`. Two-column hero-grid on desktop (`text` | `image`), single-column centred on mobile.

#### USP bar
- [ ] No section heading on the USP bar — go straight to 3 USP cells.
- [ ] One contained `.usp-panel` (dark charcoal, brand-shadow, rounded corners) with 3 `.usp-cell` children separated by interior dividers — NOT three separate cards.
- [ ] Icons are 32 px inside 72 px rounded-square chips with an orange-gradient fill. Icons must semantically match: delivery → truck/excavator silhouette, expert operator → hard-hat, transparent pricing → money/credit-card with RM glyph (NOT a generic map pin).

#### Process / steps section (MANDATORY)
- [ ] The numbered 1-2-3 steps section closes with a **CTA** — WhatsApp button + one line of supporting copy — on the homepage **and** every location page. Step 1 is almost always "WhatsApp us", so a section with no button wastes the highest-intent moment on the page.
- [ ] Button uses official WhatsApp green (`#25D366`), label **max 3 words**, same rounded shape as every other button on the site.
- [ ] Location-page variant passes the town to the redirect — `waRedirect(locale, undefined, loc.slug)` — so the lead is attributed to that location.
- [ ] Block is centred at every breakpoint (one action for the whole section, not a per-card control).

#### Pricing display
- [ ] Every price string in `messages/*.json` uses the localized 'From' prefix: MS `Dari RM {price}`, EN `From RM {price}`, ZH `RM {price} 起`.
- [ ] Product cards show Daily and Monthly prices side-by-side in a bordered panel with a vertical divider — never single-price.
- [ ] Use ICU substitution `t('priceDaily', { price: value })` — NEVER `.replace('{price}', value)`. The latter throws `FORMATTING_ERROR` on placeholder-containing strings.
- [ ] Mobile: price value 13 px + `white-space: nowrap` so "Dari RM 1,800" never wraps to 2 lines.

#### Marketing marquee (OPTIONAL — not mandatory)
- The scrolling `<MarketingMarquee>` is **optional**, not required. It doesn't suit every layout (e.g. electrician) — only use it if it fits the design. Do NOT force it onto a site where it looks out of place. The wizard does not check for it.
- If you do use it: two variants (light orange below hero, dark charcoal before process/why-us), short punchy items (max ~3 words) separated by ★, slim padding (~8 px), 12.5 px font, scrolls left → right.

#### Language switcher
- [ ] Desktop: 3 inline pills (`.lsw-item`). Each pill has a bordered rounded shell, a circular SVG flag on the left, and the locale label (MS / EN / 中) on the right, side-by-side. Active state = dark charcoal fill with white text + drop shadow.
- [ ] Mobile: collapsed to a single dropdown trigger (current flag + label + caret) that opens a small menu listing all locales. NEVER render the 3 pills in mobile — they wrap and look broken.
- [ ] Each `CircleFlag` SVG MUST generate its `clipPath` id via `useId()`. Sharing one id across multiple flag instances breaks clipping on some — flags lose their circle and render square.
- [ ] Language switcher CSS lives in `globals.css` with `!important` on `display`, `flex-direction`, `flex-wrap` — `<style jsx>` rules lose to global element resets.

#### WhatsApp redirect (every link) — MANDATORY
- [ ] **Every CTA on the site must route through `/{locale}/redirect-whatsapp-1`** — never link directly to `wa.me/<number>` or `api.whatsapp.com/send`. The redirect page reads `leads_mode` + `location_slug` from Supabase and picks the correct number for the visitor; a hardcoded `wa.me` link bypasses rotation, location targeting, and per-agent split — every miss is a tracked lead lost. The only file that may legitimately reference `wa.me` is `lib/webcore.ts`, which is what the redirect page itself uses.
- [ ] **Every link pointing at `/{locale}/redirect-whatsapp-1`** (header CTA, hero CTA, product card CTA, calculator CTA, FOMO banner link, final-CTA, blog CTA, footer CTA, sticky FAB) MUST open in a new tab: `target="_blank"` + `rel="noopener noreferrer"`. The redirect page bounces the visitor straight to `wa.me/<number>` — keeping the site open in the original tab preserves the SEO session and gives the visitor somewhere to return.
- [ ] The shared `<WhatsAppButton>` already sets `target="_blank"` + `rel="noopener noreferrer"` internally; verify any bare `<Link>` or `<a>` that uses `waRedirect()` (e.g. FOMO banner inline link, blog inline CTAs) explicitly sets them too — styled-jsx scoping won't help here, the attributes have to live on the element.

#### WhatsApp / CTA buttons
- [ ] Use the official Meta WhatsApp SVG (the speech-bubble-with-phone-handset glyph). The placeholder simplified path looks wrong — replace immediately.
- [ ] All WA CTAs use the official WhatsApp green `#25D366` (hover `#1EBE57`). Never themed in brand colour.
- [ ] **Every CTA button label is ≤3 words** (count "WhatsApp" too): `WhatsApp Us Now`, `Get a Quote`, `Book Now`. `WhatsApp for a Quote` (4) is too long. Button-label keys only (`cta`, `ctaButton`, `ctaPrimary/Secondary`, `ctaLabel`, `ctaTemplate`, `whatsappCta`, `bookNow`) — not CTA headings, subtext, tags, alt text, or sentence-style closing CTAs. Enforced on `en` + `ms`; keep `zh` equally short. Wizard: `cta-button-word-limit`.
- [ ] Header on mobile: hide the WA CTA entirely (`display: none !important`). The language dropdown replaces it. The WA button is also hidden inside the mobile drawer.
- [ ] Header on desktop: nav links + language pills + WA CTA, all visible.
- [ ] The `.nav-cta` class must be targeted via `:global(.nav-cta)` inside `<style jsx>` — styled-jsx scoping does not reach child components, so the bare `.nav-cta` rule will silently miss.
- [ ] Mobile: all `.btn` → 12.5 px font, 44 px height, 16 px padding, `white-space: nowrap` so no CTA text wraps to 2 lines.

#### Section backgrounds
- [ ] Mix image backgrounds with flat sections — at minimum: Hero, Process, Reviews, Final CTA all use image backgrounds with a dark gradient overlay.
- [ ] Headings on image-bg sections render white. Aggregate pills (e.g. "4.9/5 Google Reviews") use a translucent-white backdrop with white text — never leave dark text on dark image.
- [ ] Use the brand-provided bg images first (`/brand/bg-hero.jpg`, `/bg/bg-3.webp`, etc.) before any stock fallback. The Final CTA bg must be a different file from the Hero bg (no repeats).

#### Header / Footer (every page)
- [ ] Every public page (home, location, blog listing, blog article) renders `<FomoBanner />`, `<SiteHeader />`, and `<SiteFooter />` — NEVER a per-page nav variant like `BlogNav`.
- [ ] Header brand logo / brand text is HIDDEN — nav links + language switcher + contact number + WA CTA only.
- [ ] **Contact number in header AND footer** — `components/ContactNumber.tsx` copied from `templates/site-chrome/`, rendered as `<SiteHeader contact={<ContactNumber locale={locale} page="…" />} />` and `<SiteFooter locale={locale} page="…" />` on **every** page. Pass that page's locale-stripped path (`/`, `/blog`, `` `/${siteConfig.productSlug}/${loc.slug}` ``) — `is_display` is unique per `(website, page_slug)`, so a wrong/absent path can print another page's number.
- [ ] `lib/webcore.ts` exports `getDisplayPhone()` + `formatPhoneDisplay()`, and `getPhoneRows`'s `select=` includes `is_display` (the direct-read fallback needs the column).
- [ ] `contact.availability` key exists in every locale (`Tersedia 24/7` / `Available 24/7` / `24/7 全天候`) — a missing key renders the raw key as the label.
- [ ] `templates/site-chrome/contact-number.css` pasted into `app/globals.css` — NOT into a styled-jsx block. The element is server-rendered and passed into the client `SiteHeader` as a prop, so scoped styles never reach it. Leave the `var(--font-heading, var(--font-display, inherit))` chain alone: the number takes **this site's** font, so never hardcode a family.
- [ ] Seed a `phone_numbers` row with `is_display: true` before Gate 1, or the chrome falls back to `siteConfig.fallbackPhone` — which must already be the client's own number, never a shared operator line.
- [ ] **Footer colour derives from this site's palette** — `SiteFooter` tints itself from the primary accent via `color-mix`, so the panel is a pale wash of the brand, not a fixed blue. Do not paste hex values from another project. Override with `--footer-bg` / `--footer-border` / `--footer-rule` in `globals.css` only if the derived tint is wrong for the brand.
- [ ] Footer logo matches the panel it sits on. The default panel is a **light** wash, so use the dark/colour wordmark, e.g. `tankpro-dark.png` — the `-dark` suffix names the *ink*, not the background. A white-wordmark variant disappears on it. If the site wants a **dark** footer, set `--footer-bg` plus `--footer-ink` and `--footer-ink-muted`, then use the white wordmark.
- [ ] All `nav.*` translation keys exist in all locales: `home, products, calculator, locations, blog, whatsappCta`. Missing key renders the raw key (e.g. "nav.home") on the live site.

#### Location pages — must equal homepage layout (MANDATORY)
- [ ] **The location page must render the SAME sections as the homepage** — hero, USP bar, products, calculator, process, why-us, reviews, gallery, FAQ, final CTA. Only the *copy* changes (localised to the city). A stripped-down location page that drops the USP bar / gallery / reviews is a bug (the electrician site had exactly this). The wizard's `location-matches-homepage` check fails when the location page is missing sections the homepage has.
- [ ] Location page imports `<PageStyles />` (the shared style component) — never inline-duplicate the homepage style block.
- [ ] Shared section class names match homepage exactly (no `loc-` prefix on hero, USP, products, calculator, process, why, reviews, gallery, FAQ, locations grid, final CTA).
- [ ] Only location-only elements live in a small dedicated style block under the `loc-` namespace: `.breadcrumb`, `.city-chip`, `.nearby-card`. Everything else inherits from `<PageStyles />`.
- [ ] Hero structure on location pages mirrors homepage: two-column `hero-grid` with `hero-text` (logo → eyebrow → H1 → H2 → support → CTA-row) + `hero-image` (plain `<img className="hero-image-img">`).
- [ ] Breadcrumb is a rounded pill on a white background, mono-font uppercase, with chevron `›` separators. The current city sits inside an orange chip with a brand-orange drop shadow — NEVER plain text.

#### Mobile layout (max-width: 879 px)
- [ ] All `.btn` → smaller (12.5 px / 44 px height / nowrap / 16 px padding).
- [ ] All `.eyebrow` tags → `align-self: center`, auto-width, do not stretch to full row width.
- [ ] Product price values → 13 px + nowrap. Product CTA → 12.5 px.
- [ ] Per-state location list → 2-column grid (the default 1-column makes the page extremely long).
- [ ] Language switcher → dropdown trigger (mobile rule activates the `.lsw-trigger` and hides `.lsw-toggle`).
- [ ] Header WA button → hidden.
- [ ] FOMO banner countdown stays sticky / visible at top of first viewport.

#### Styled-jsx / CSS pitfalls (don't repeat these)
- [ ] `:global(...)` only works inside `<style jsx>`, NOT plain `<style>`. In a server component's plain `<style>` block, `:global(.foo)` is invalid CSS and the rule is silently dropped. Use plain selectors there.
- [ ] In `<style jsx>` (client component), child-component classes do not receive the jsx hash. To target a class rendered by a child (e.g. `WhatsAppButton` rendering `.nav-cta`), you must wrap with `:global(.nav-cta)`.
- [ ] When multiple pages need identical CSS, extract into a shared `<PageStyles />` component — never duplicate the style block per page.
- [ ] Run `grep -c ':global(' app/**/page.tsx` after big edits — any non-zero count inside a plain `<style>` block is a bug.
- [ ] **Never copy a page from another project without remapping its CSS variables.** Each project defines its own `--brand-*` / `--ink-*` / `--gut` / `--radius-*` tokens in `globals.css`. A page copied from sewa-excavator into oxihome that still says `var(--brand-charcoal)` / `var(--gut)` references variables that don't exist in oxihome — they resolve to nothing, so colours, padding, and radii silently collapse and the layout looks broken even though every element is present. Confirm every `var(--x)` in a page is defined in *this* project's CSS. The wizard's `no-undefined-css-vars` check fails when a page references an undefined variable. (This is the real reason oxihome's blog article looked broken despite passing structural checks.)

#### Pre-deploy verification
- [ ] `git status` is clean of `.DS_Store`, raw `brand_assets/`, `temporary screenshots/`.
- [ ] `du -sh public/` is under 20 MB. If higher, audit large files (`find public -type f -size +500k`).
- [ ] All 3 locales return 200: `curl -o /dev/null -w "%{http_code}" http://localhost:PORT/{ms,en,zh}`.
- [ ] A spot-check of 2–3 random location pages also returns 200.
- [ ] Kill any background `scripts/sync-listener.ts` process (`ps aux | grep sync-listener && pkill -f sync-listener`) — it can revert local edits mid-iteration.

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
**Must match `projects/electric-wheelchair-malaysia/app/[locale]/blog/` (canonical layout).** Every rule below is enforced by the wizard checklist — a failing blog scan blocks Gate 2.

**Blog post page (`app/[locale]/blog/[slug]/page.tsx`) — MANDATORY:**
- [ ] Exactly one `<h1>` — the article title.
- [ ] Breadcrumb nav at the top: Home → Blog → article (`<nav className="breadcrumb">` or `aria-label="Breadcrumb"`).
- [ ] Article body wrapped in `<div className="blog-content">` so the shared CSS styles headings, lists, and links.
- [ ] Reading-time indicator (`readingTime` / `minRead`) shown near the title.
- [ ] WhatsApp CTA banner inside the post (`<WhatsAppButton>` with `label={`blog-${slug}`}` for tracking, routing through `/redirect-whatsapp-1`).
- [ ] Per-post metadata export (`export const metadata` or `generateMetadata`) so Open Graph titles, descriptions, and share images are unique per article.

**Blog listing page (`app/[locale]/blog/page.tsx`) — MANDATORY:**
- [ ] Exactly one `<h1>` + one `<h2>` (same SEO structure as the homepage).
- [ ] Card grid layout — either `className="blog-grid"` or `grid-template-columns: repeat(auto-fill, …)`. Never a vertical stack of full-width blocks.
- [ ] Each card renders the post's `cover_image_url` + `excerpt`. Text-only cards tank click-through.

**Site chrome (both pages, every locale):**
- [ ] `<FomoBanner />`, `<SiteHeader />`, `<SiteFooter />` — never a per-page `BlogNav` variant.

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
| Butik Glam & Lux Sdn. Bhd. | `215139a6-8ac7-449e-8310-0a38ccc8d579` |
| Cold Truck Malaysia Sdn. Bhd. | `99e92ff1-d776-4154-9346-426e3cb91936` |
| Encik Beku Aircond Sdn. Bhd. | `16e62068-365d-4907-b7f0-763a173d8afa` |
| Encik Skylift & Crane Sdn. Bhd. | `74acbd4f-156c-46a7-924a-a6298ba4ef24` |
| Encik Sticker Printing Sdn. Bhd. | `42d6e364-b88a-4a63-9461-25afb0bab314` |
| Encik Towing Malaysia Sdn Bhd | `cfbadc24-2a7d-4aa4-bac1-d9e8a99e268a` |
| Ibnu Sina Care Sdn. Bhd. | `d6cc8f48-ea42-4420-b9d6-73ca63263be0` |
| Jom Vend Sdn. Bhd. | `6961d264-61e6-49ac-93f5-70daf1687106` |
| Kak Kenduri Sdn. Bhd. | `ce95071b-e575-4983-bdd4-66910f45fe34` |
| Mandiri Sdn. Bhd. | `374c1201-246f-41bf-b59a-a04efab47eaa` |
| Merry Elderly Care Sdn. Bhd. | `d4a9e4ba-a1da-4548-a45f-526579c56b6d` |
| Mobile Wheeler Sdn. Bhd. | `23bd0372-9f4b-4410-ae56-a8aecd54ea90` |
| Outsource | `f81da9e5-3896-4a98-abe1-247252c81258` |
| Pulse Pilates Sdn. Bhd. | `3f5087b3-6b0f-441a-a864-49b82f8335a4` |
| Rev Bike Sdn. Bhd. | `eff0fecf-ef85-449a-bd68-dac176945700` |
| Rev Move Sdn. Bhd. | `9e5a0a86-55cb-4754-93fd-f80dccb2a17a` |
| Rev Move Utara Sdn. Bhd. | `ef7b3fec-68d7-4153-bf2e-39c5d8621592` |
| Scaffolding Malaysia Sdn. Bhd. | `7c15d93f-c2f7-488d-b38c-4b85d65a06d1` |
| Sewa Skylift Malaysia | `90e3be11-1149-4736-9adb-faed1f856836` |
| Utopia Group | `d1336df4-fba2-4895-b450-f0c69acc9511` |
| Utopia Holiday Sdn. Bhd. | `f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c` |
| Vivahomes Realty Sdn. Bhd. | `e531a296-3ef6-4406-80ef-291fabd214a3` |

> **This table goes stale — verify against the database before registering a
> site.** It listed 16 companies while the database held 22, so a real company
> (`Encik Sticker Printing Sdn. Bhd.`) looked missing and nearly had a duplicate
> created for it. `POST /api/public/sites` takes a company *name* and creates one
> silently if it does not match, so a typo or a stale list becomes a stray row in
> the shared fleet DB. Check first:
>
> ```bash
> curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/companies?select=id,name&order=name" \
>   -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Accept-Profile: webcore"
> ```
> If the client's company is genuinely absent, ask the user whether to create it
> or use the closest existing entry — never decide that silently.

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

## 16b. Step 15 — Google Integration (POST-DEPLOY, after paid domain is live)

> **Runs LAST — only after the site's PAID domain is connected on Vercel with DNS pointed there.** Never against a `*.vercel.app` preview URL: Google properties are keyed to the URL you submit, and re-keying later means duplicate properties + split data.

This sets up the site's **Google/Ads** layer — GA4 + GTM + Google Search Console + Google Ads conversion import. It is **separate** from the Utopia Webcore `t.js` tracking added in Step 7 (`docs/tracking-guide.md`); that's internal analytics, this is Google.

**Owned by Gloo** (Analytics & Growth Specialist), driven by the **`google-integration` skill**, which drives the scripts at `scripts/google-automation/` (wired to Utopia's shared Google account; credentials are read at runtime from `~/.google-credentials`, never from the repo).

### Prerequisites (block until all true)
- [ ] Paid domain live: `curl -I https://www.<domain>/` → 200
- [ ] DNS nameservers on Vercel (`vercel domains ls`) — required for the GSC Domain property
- [ ] Every WhatsApp CTA routes through a `/redirect-whatsapp-1/` page (the `whatsapp_click` conversion fires there; direct `wa.me/` links are NOT tracked)
- [ ] Sitemap reachable at `https://www.<domain>/sitemap.xml`

### Run it
Spawn **Gloo** with the contents of `agents/gloo.md` + the paid domain, project dir, and supported locales. Gloo reads `scripts/google-automation/`'s own `SKILL.md` / `MANUAL-STEPS.md` (source of truth for flags) and runs the 5 phases:

1. **Phase 1 — GSC Domain property** (no deploy)
2. **Phase 2 — GA4 property** (no deploy) → captures Measurement ID `G-XXXX` + numeric property id
3. **Phase 3 — GTM container + inject snippet** → **DEPLOY** after
4. **Phase 4 — GSC URL-prefix** (init → **DEPLOY** → finalize; **repeat per locale**)
5. **Phase 5 — Ads conversion import** (no deploy, no 24h wait)

Deploy Phases 3 and 4 **separately** (own checkpoint each). For extracted per-site repos with no Vercel git integration, a `git push` does NOT deploy — run `vercel --prod` so the snippet/meta tag goes live before finalizing.

### Residual manual clicks (~3–4 min — genuinely no API — hand back to the user)
1. **REQUIRED — GA4** → Admin → Data collection → ON: Google Signals + User-provided data (after Phase 2)
2. **REQUIRED — Ads** → conversion action → Count → "One" (after Phase 5)
3. **REQUIRED — Ads** → Data manager → GA4 → ON: "Import app and web metrics" (after Phase 5)
4. *(optional)* GTM → Container Settings → Consent Overview (BETA)

Screenshots: https://websitebuilder.utopiaai.my/google (§04).

> 🔒 The files at `~/.google-credentials/` are LIVE Google keys — never commit, print, or forward them. If exposed, rotate immediately.

### End state
GA4 property + GTM container + GSC properties (1 Domain + 1 URL-prefix per locale) + 1 Ads conversion action. Per-site config written to `scripts/google-automation/configs/<domain>.json`.

---

## 16c. Step 16 — Keyword Audit (T+60 days, recurring)

Step B2 verified the plan against Ads *estimates*. This closes the loop with what
Google actually did. Search Console needs **~4 weeks minimum** before query data
is meaningful; 60 days is the first useful read.

Without this step, GSC query data is collected and never looked at — the plan is
never corrected, and queries the site ranks for by accident are never harvested.

```bash
cd scripts/google-automation

node gsc-keyword-audit.mjs \
  --domain <paid-domain> \
  --days 60 \
  --plan ../../Documents/GitHub/utopia-website-builder/projects/{slug}/seo-plan.md \
  --pages \
  --out ../../Documents/GitHub/utopia-website-builder/projects/{slug}/keyword-audit.md
```

The report has four sections, each with a different owner:

| Section | Means | Action |
|---|---|---|
| Planned keywords with impressions | The plan worked | Leave alone |
| **Planned keywords with ZERO impressions** | Plan missed, or page not indexed | Check GSC → Indexing → Pages first. Not-indexed is a crawl problem; indexed-with-zero is a keyword problem. |
| **Unplanned queries with impressions** | Ranking by accident | Cheapest wins available — fold into headings + give to Hanabi as blog topics |
| **Striking distance (position 5–20)** | Ranking, not clicking | One targeted blog post moves these fastest — hand to Hanabi |

Re-run quarterly. Feed confirmed findings back into `seo-plan.md` so the next
site in the same vertical starts from measured terms instead of guesses.

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
- [ ] **`og:image` on every page type, in every locale** — `public/og-{locale}.png`
      exists, returns 200, and the tag appears on the homepage, a location page,
      the blog listing AND a blog article (Next replaces a parent's `openGraph`
      wholesale, so a card on the homepage alone is the common failure)
- [ ] Cards regenerated if the hero changed since they were last shot

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
- [ ] **CTA button labels ≤3 words** (WhatsApp counts) — `en` + `ms`
- [ ] **Contact number in header + footer** — `<ContactNumber />` in both, digits from `getDisplayPhone(page)`, real page path passed on every page. Nowhere else on the site.
- [ ] **No hardcoded number anywhere** — no phone-shaped literal in JSX, copy, or a `tel:` href (wizard: `display-phone-db-backed`)
- [ ] **No domain names** displayed as visible text
- [ ] **Mobile center-aligned** — headings, buttons, cards, icons centered on mobile
- [ ] **All images verified** — every image matches its context, no placeholders left
- [ ] **Utopia Brand CI applied** — "Built by Utopia AI" footer credit in `SiteFooter` + `--r-*`/`--ease`/`--dur-*` structural tokens in `globals.css`. Site keeps its own palette/fonts/button-shape (no reskin, no forced 8px radius on existing pill buttons).

### Deployment
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Env vars set on Vercel
- [ ] Live URL accessible and working

### Google Integration (post-deploy — only after PAID domain is live)
- [ ] GA4 property created (Measurement ID + numeric property id recorded)
- [ ] GTM container created + snippet injected + redeployed (GTM loads on live site)
- [ ] GSC properties: 1 Domain + 1 URL-prefix per locale, sitemaps submitted
- [ ] Ads conversion action imported (`whatsapp_click`)
- [ ] Residual manual toggles done: GA4 Google Signals + User-provided data; Ads counting `One`; Ads "Import app and web metrics" ON
- [ ] Per-site config written to `scripts/google-automation/configs/<domain>.json`
