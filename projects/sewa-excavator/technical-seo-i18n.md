# technical-seo-i18n.md — Abang Excavator (`sewa-excavator`)

> **Author:** Kimmy (Technical Implementation Specialist)
> **Project:** sewa-excavator
> **Domain:** `sewa-excavator.vercel.app`
> **Locales:** `ms` (default), `en`, `zh`
> **Reference:** `projects/tablechair-rental-malaysia/lib/webcore.ts`

Section order below is the implementation order. Every file is paste-ready into the project tree at the path noted in its heading.

---

## 1. Locale config

### 1.1 `i18n/routing.ts`

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

### 1.2 `i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 1.3 `middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths except API, internal Next.js, Vercel, and any path with a file extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

---

## 2. Webcore data layer

### 2.1 `lib/webcore.ts`

```ts
// Unified data layer for products, phone numbers, and blog posts.
// Every read goes through fetch() against the Supabase REST API with a
// next.tags entry, so revalidateTag('webcore-products' | 'webcore-phones' |
// 'webcore-blog') invalidates the cache on demand without redeploys.
//
// DO NOT replace this with the Supabase JS client — it is not cache-tag-aware
// and silently breaks invalidation.

import { headers } from 'next/headers';
import { siteConfig } from '@/config/site';

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    '[webcore] Missing SUPABASE_URL / SUPABASE_ANON_KEY. Fallback values will be used.',
  );
}

export type WebcoreTag = 'webcore-products' | 'webcore-phones' | 'webcore-blog';

async function webcoreFetch<T>(path: string, tag: WebcoreTag): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
      next: { tags: [tag] },
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error(`[webcore] ${tag} ${res.status} ${res.statusText} :: ${path}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[webcore] ${tag} fetch error:`, err);
    return null;
  }
}

/* ============================================================
 * Products
 * ============================================================ */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sale_price: number | null;
  rental_price: number | null;
  sort_order: number;
  is_active: boolean;
  parent_id: string | null;
  photos: { url: string }[];
}

type ProductRow = Omit<Product, 'photos'> & { product_photos: { url: string }[] | null };

export async function getProducts(): Promise<{ core: Product[]; additional: Product[] }> {
  const path =
    `products?select=*,product_photos(url)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`;

  const rows = await webcoreFetch<ProductRow[]>(path, 'webcore-products');
  if (!rows) return { core: [], additional: [] };

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
  }));

  return {
    core: products.filter((p) => p.rental_price !== null),
    additional: products.filter((p) => p.rental_price === null),
  };
}

/* ============================================================
 * Phone numbers / leads routing
 * ============================================================ */

const FALLBACK_PHONE = siteConfig.fallbackPhone;
const FALLBACK_WA_TEXT = siteConfig.whatsappMessages.ms;

type LeadsMode = 'single' | 'rotation' | 'location' | 'hybrid';

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
  source: 'database' | 'fallback';
  mode: LeadsMode | 'fallback';
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
  return rows.find((r) => r.label === 'default');
}

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get('host') || h.get('x-forwarded-host') || '';
    return host.replace(/:\d+$/, '');
  } catch {
    return '';
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  if (!domain) return 'single';
  const path =
    `company_websites?select=leads_mode` +
    `&domain=eq.${encodeURIComponent(domain)}` +
    `&limit=1`;
  const data = await webcoreFetch<{ leads_mode: LeadsMode | null }[]>(path, 'webcore-phones');
  return data?.[0]?.leads_mode ?? 'single';
}

async function getPhoneRows(domain: string): Promise<PhoneRow[]> {
  if (!domain) return [];
  const path =
    `phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug` +
    `&website=eq.${encodeURIComponent(domain)}` +
    `&is_active=eq.true`;
  const data = await webcoreFetch<PhoneRow[]>(path, 'webcore-phones');
  return data ?? [];
}

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: 'fallback',
    mode: 'fallback',
  };
}

function toResult(row: PhoneRow | undefined, mode: LeadsMode, host: string): PhoneResult {
  if (!row) return fallbackResult();
  const text = row.whatsapp_text || FALLBACK_WA_TEXT;
  return {
    phone: row.phone_number,
    whatsappText: `Hi ${host}, ${text}`,
    source: 'database',
    mode,
  };
}

export async function getPhoneNumber(locationSlug?: string): Promise<PhoneResult> {
  try {
    const domain = await getHostDomain();
    const [mode, rows] = await Promise.all([getLeadsMode(domain), getPhoneRows(domain)]);
    if (rows.length === 0) return fallbackResult();

    const defaultRow = findDefaultRow(rows);

    switch (mode) {
      case 'single':
        return toResult(defaultRow ?? rows[0], mode, domain);

      case 'rotation':
        return toResult(pickWeighted(rows), mode, domain);

      case 'location': {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain);
        }
        return toResult(defaultRow, mode, domain);
      }

      case 'hybrid': {
        if (locationSlug && locationSlug !== 'all') {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain);
        }
        return toResult(defaultRow, mode, domain);
      }

      default:
        return toResult(defaultRow, mode, domain);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[getPhoneNumber] Unexpected error:', err);
    return fallbackResult();
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${query}`;
}

export async function getWhatsAppLink(
  locationSlug?: string,
  messageOverride?: string,
): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug);
  return waLink(phone, messageOverride || whatsappText);
}

/* ============================================================
 * Blog
 * ============================================================ */

export interface BlogPostSummary {
  id: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string;
  blog_translations: { title: string; excerpt: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string;
  blog_translations: {
    title: string;
    content: string;
    excerpt: string;
    meta_title: string;
    meta_description: string;
  }[];
}

export interface RecentBlogPost {
  slug: string;
  published_at: string;
  blog_translations: { title: string }[];
}

export async function getBlogPosts(locale: string): Promise<BlogPostSummary[]> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,excerpt)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&order=published_at.desc`;
  const data = await webcoreFetch<BlogPostSummary[]>(path, 'webcore-blog');
  return data ?? [];
}

export async function getBlogPost(slug: string, locale: string): Promise<BlogPost | null> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&slug=eq.${encodeURIComponent(slug)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(locale)}` +
    `&limit=1`;
  const data = await webcoreFetch<BlogPost[]>(path, 'webcore-blog');
  return data?.[0] ?? null;
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
    `&limit=${limit}`;
  const data = await webcoreFetch<RecentBlogPost[]>(path, 'webcore-blog');
  return data ?? [];
}

export async function getBlogPostSlugs(): Promise<{ slug: string }[]> {
  const path =
    `blog_posts?select=slug` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published`;
  const data = await webcoreFetch<{ slug: string }[]>(path, 'webcore-blog');
  return data ?? [];
}
```

---

## 3. API routes

### 3.1 `app/api/revalidate/route.ts`

```ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TAGS = new Set(['webcore-products', 'webcore-phones', 'webcore-blog']);

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webcore-secret');
  const expected = process.env.WEBCORE_REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: 'WEBCORE_REVALIDATE_SECRET is not configured' },
      { status: 500 },
    );
  }
  if (!secret || secret !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { tags?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const tags = Array.isArray(body.tags) ? body.tags : [];
  const revalidated: string[] = [];
  for (const tag of tags) {
    if (ALLOWED_TAGS.has(tag)) {
      revalidateTag(tag);
      revalidated.push(tag);
    }
  }

  return NextResponse.json({ revalidated });
}
```

### 3.2 `app/api/phones/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getPhoneNumber, waLink } from '@/lib/webcore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const loc = req.nextUrl.searchParams.get('loc') ?? undefined;
  const result = await getPhoneNumber(loc);
  return NextResponse.json({
    mode: result.mode,
    source: result.source,
    waUrl: waLink(result.phone, result.whatsappText),
  });
}
```

---

## 4. WhatsApp redirect

### 4.1 `lib/waRedirect.ts`

```ts
/**
 * Build a locale-aware redirect URL pointing at /[locale]/redirect-whatsapp-1.
 * NEVER produce a raw wa.me link in component code — go through this helper so
 * the redirect page can swap the phone number based on leads_mode.
 */
export function waRedirect(
  locale: string,
  message?: string,
  locationSlug?: string,
): string {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (locationSlug) params.set('loc', locationSlug);
  const qs = params.toString();
  return `/${locale}/redirect-whatsapp-1${qs ? `?${qs}` : ''}`;
}
```

### 4.2 `app/[locale]/redirect-whatsapp-1/page.tsx`

```tsx
import { getPhoneNumber, waLink } from '@/lib/webcore';
import RedirectClient from './RedirectClient';

// Sole exception to the "no time-based revalidate" rule — this page must
// always re-execute so the phone-number routing logic runs on every click.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function RedirectWhatsapp1({
  searchParams,
}: {
  searchParams: Promise<{ loc?: string; message?: string }>;
}) {
  const { loc, message } = await searchParams;
  const { phone, whatsappText } = await getPhoneNumber(loc || undefined);
  const url = waLink(phone, message || whatsappText);
  return <RedirectClient url={url} />;
}
```

### 4.3 `app/[locale]/redirect-whatsapp-1/RedirectClient.tsx`

```tsx
'use client';
import { useEffect } from 'react';

export default function RedirectClient({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", sans-serif',
        background: '#FFFFFF',
        color: '#0F0F0F',
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <p style={{ marginBottom: '12px', fontSize: '15px' }}>Opening WhatsApp…</p>
        <a
          href={url}
          style={{
            color: '#FFFFFF',
            background: '#25D366',
            padding: '12px 22px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Tap to open WhatsApp
        </a>
      </div>
    </div>
  );
}
```

---

## 5. Layout files

### 5.1 `global.d.ts`

```ts
export {};

declare global {
  interface Window {
    uwc: (
      eventType: 'click' | 'impression' | 'view' | string,
      options?: { label?: string },
    ) => void;
  }
}
```

### 5.2 `app/layout.tsx` (root — minimal pass-through)

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sewa-excavator.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The locale-scoped <html>/<body> lives in app/[locale]/layout.tsx so that
  // next-intl can set lang/dir correctly per locale. This root layout exists
  // only to satisfy Next's requirement for a top-level layout.
  return children as React.ReactElement;
}
```

### 5.3 `app/[locale]/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { OrganizationSchema } from '@/components/schema/OrganizationSchema';
import { WebSiteSchema } from '@/components/schema/WebSiteSchema';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
});

const OG_LOCALE: Record<string, string> = {
  ms: 'ms_MY',
  en: 'en_MY',
  zh: 'zh_CN',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const alternates = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );
  alternates['x-default'] = `${siteConfig.url}/${routing.defaultLocale}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.brandName,
      title: t('title'),
      description: t('description'),
      locale: OG_LOCALE[locale] || 'ms_MY',
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      images: [{ url: `${siteConfig.url}/og/${locale}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${siteConfig.url}/og/${locale}.png`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${jakarta.variable} ${mono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script
          defer
          src="https://webcore.utopiaai.my/t.js"
          data-website="sewa-excavator.vercel.app"
        />
      </head>
      <body
        style={{
          fontFamily:
            'var(--font-jakarta), "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#FFFFFF',
          color: '#0F0F0F',
          margin: 0,
        }}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <OrganizationSchema />
          <WebSiteSchema locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## 6. SEO files

### 6.1 `app/robots.ts`

```ts
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/*/redirect-whatsapp-1'] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
```

### 6.2 `app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { locations } from '@/config/locations';
import { getBlogPosts } from '@/lib/webcore';

const PRODUCT_SLUG = siteConfig.productSlug; // 'excavator'

function alternates(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
  );
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 1) Homepages — 1 per locale (3 entries)
  for (const locale of routing.locales) {
    entries.push({
      url: `${siteConfig.url}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: alternates(''),
    });
  }

  // 2) Location pages — 163 × 3 = 489 entries
  for (const locale of routing.locales) {
    for (const loc of locations) {
      const path = `/${PRODUCT_SLUG}/${loc.slug}`;
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: alternates(path),
      });
    }
  }

  // 3) Blog listings — 1 per locale (3 entries)
  for (const locale of routing.locales) {
    entries.push({
      url: `${siteConfig.url}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: alternates('/blog'),
    });
  }

  // 4) Blog posts — query Supabase (default locale only for discovery;
  //    posts publish across all 3 locales with the same slug).
  try {
    const posts = await getBlogPosts(routing.defaultLocale);
    for (const post of posts) {
      const path = `/blog/${post.slug}`;
      const lastMod = post.published_at ? new Date(post.published_at) : now;
      for (const locale of routing.locales) {
        entries.push({
          url: `${siteConfig.url}/${locale}${path}`,
          lastModified: lastMod,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: alternates(path),
        });
      }
    }
  } catch {
    // If Supabase is unreachable during build, ship the sitemap without
    // blog entries rather than failing the deploy.
  }

  return entries;
}
```

---

## 7. Schema components

### 7.1 `components/schema/OrganizationSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/og/ms.png`,
    description: siteConfig.tagline,
    areaServed: { '@type': 'Country', name: 'Malaysia' },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 7.2 `components/schema/WebSiteSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

export function WebSiteSchema({ locale }: { locale: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brandName,
    url: `${siteConfig.url}/${locale}`,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: siteConfig.brandName },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 7.3 `components/schema/LocalBusinessSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

export function LocalBusinessSchema({
  locale,
  locationName,
  locationSlug,
  state,
}: {
  locale: string;
  locationName: string;
  locationSlug: string;
  state: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: `${siteConfig.brandName} — ${locationName}`,
    url: `${siteConfig.url}/${locale}/${siteConfig.productSlug}/${locationSlug}`,
    image: `${siteConfig.url}/og/${locale}.png`,
    priceRange: 'RM$$',
    areaServed: { '@type': 'City', name: locationName },
    address: {
      '@type': 'PostalAddress',
      addressLocality: locationName,
      addressRegion: state,
      addressCountry: 'MY',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.legalName,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 7.4 `components/schema/ProductSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

export function ProductSchema({
  name,
  slug,
  description,
  rentalPrice,
  image,
  areaServed,
}: {
  name: string;
  slug: string;
  description: string | null;
  rentalPrice: number | null;
  image: string | null;
  areaServed?: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    sku: slug,
    description: description ?? `${name} rental in Malaysia.`,
    brand: { '@type': 'Brand', name: 'Volvo' },
    manufacturer: { '@type': 'Organization', name: 'Volvo Construction Equipment' },
    image: image ?? `${siteConfig.url}/og/ms.png`,
    offers: {
      '@type': 'Offer',
      price: rentalPrice ?? undefined,
      priceCurrency: 'MYR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: siteConfig.brandName },
    },
  };
  if (areaServed) {
    data.areaServed = { '@type': 'City', name: areaServed };
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 7.5 `components/schema/BreadcrumbSchema.tsx`

```tsx
export interface Crumb {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 7.6 `components/schema/FAQSchema.tsx`

```tsx
export interface FaqItem {
  q: string;
  a: string;
}

export function FAQSchema({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 7.7 `components/schema/ArticleSchema.tsx`

```tsx
import { siteConfig } from '@/config/site';

export function ArticleSchema({
  locale,
  slug,
  title,
  excerpt,
  coverImage,
  publishedAt,
}: {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: coverImage ? [coverImage] : [`${siteConfig.url}/og/${locale}.png`],
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: { '@type': 'Organization', name: siteConfig.brandName },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brandName,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/${locale}/blog/${slug}`,
    },
    inLanguage: locale,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

---

## 8. `generateMetadata()` snippets

### 8.1 Homepage — `app/[locale]/page.tsx`

```tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages,
    },
  };
}
```

### 8.2 Location page — `app/[locale]/excavator/[location]/page.tsx`

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { locations } from '@/config/locations';

export function generateStaticParams() {
  return locations.flatMap((loc) =>
    routing.locales.map((locale) => ({ locale, location: loc.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; location: string }>;
}): Promise<Metadata> {
  const { locale, location } = await params;
  const loc = locations.find((l) => l.slug === location);
  if (!loc) return {};

  const t = await getTranslations({ locale, namespace: 'meta.location' });
  const title = t('title', { location: loc.name });
  const description = t('description', { location: loc.name, state: loc.state });

  const path = `/${siteConfig.productSlug}/${loc.slug}`;
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}${path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}${path}`,
      type: 'website',
    },
  };
}
```

### 8.3 Blog listing — `app/[locale]/blog/page.tsx`

```tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.blogListing' });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/blog`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}/blog`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages,
    },
  };
}
```

### 8.4 Blog post — `app/[locale]/blog/[slug]/page.tsx`

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getBlogPost, getBlogPostSlugs } from '@/lib/webcore';

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.flatMap((s) =>
    routing.locales.map((locale) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) return {};
  const tr = post.blog_translations[0];

  const path = `/blog/${slug}`;
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}${path}`;

  return {
    title: tr.meta_title || `${tr.title} | ${siteConfig.brandName}`,
    description: tr.meta_description || tr.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/${locale}${path}`,
      languages,
    },
    openGraph: {
      type: 'article',
      title: tr.title,
      description: tr.excerpt,
      url: `${siteConfig.url}/${locale}${path}`,
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, width: 1200, height: 630 }]
        : undefined,
      publishedTime: post.published_at,
    },
  };
}
```

---

## 9. `config/site.ts`

```ts
export const siteConfig = {
  brandName: 'Abang Excavator',
  legalName: 'Utopia Holiday Sdn. Bhd.',
  tagline: 'Sewa Excavator No.1 Malaysia',
  domain: 'sewa-excavator.vercel.app',
  url: 'https://sewa-excavator.vercel.app',
  productSlug: 'excavator',
  productName: 'Excavator Rental',
  fallbackPhone: '60174287801',
  defaultLocale: 'ms' as const,
  locales: ['ms', 'en', 'zh'] as const,
  whatsappMessages: {
    ms: 'Hi Abang Excavator, saya berminat untuk sewa excavator. Boleh dapatkan sebut harga?',
    en: 'Hi Abang Excavator, I would like to rent an excavator. Can you send me a quote?',
    zh: '你好 Abang Excavator，我想租用挖掘机。可以给我报价吗？',
  },
  colors: {
    brandOrange: '#F26C1F',
    brandOrangeDeep: '#D8550E',
    brandOrangePale: '#FFF1E6',
    brandCharcoal: '#0F0F0F',
    brandSteel: '#2A2D33',
    brandGrey: '#6B7280',
    brandGreyLight: '#E5E7EB',
    brandWhite: '#FFFFFF',
    waGreen: '#25D366',
    waGreenHover: '#1EBE57',
    googleYellow: '#FBBC04',
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
```

---

## 10. `config/locations.ts`

See `seo-plan.md` §9.2 for the full 163-entry array. The implementation file is identical — use that array verbatim with the `Location` type, `locations[]`, `regionOrder`, `regionKeys`, `getNearbyLocations(slug)` (returns 6 peers, Labuan returns 3), and `getLocationsByState()` helpers as specified in `seo-plan.md` §9.3 and §9.4.

The helper `getLocationsByState()` returns `Record<string, Location[]>` grouped by state, used by the Locations section component on both homepage and location pages.

---

## 11. Translation files

### 11.1 `messages/ms.json`

```json
{
  "meta": {
    "home": {
      "title": "Sewa Excavator No.1 Malaysia — Volvo EC200 & EC400 | Abang Excavator",
      "description": "Sewa excavator Volvo EC200 & EC400 dengan kadar harian, mingguan, atau bulanan terbaik di Malaysia. Sebut harga segera melalui WhatsApp — Abang Excavator."
    },
    "location": {
      "title": "Sewa Excavator {location} — Volvo EC200 & EC400 | Abang Excavator",
      "description": "Sewa excavator Volvo EC200 atau EC400 di {location}, {state}. Kadar harian dan bulanan, hantar terus ke tapak. Sebut harga WhatsApp Abang Excavator sekarang."
    },
    "blogListing": {
      "title": "Panduan Sewa Excavator — Blog Abang Excavator Malaysia",
      "description": "Panduan, tips, dan perbandingan untuk sewa excavator di Malaysia. Belajar pilih Volvo EC200 atau EC400 dan kawal kos projek anda."
    }
  },
  "nav": {
    "logoAlt": "Abang Excavator — Sewa Excavator No.1 Malaysia",
    "products": "Produk",
    "calculator": "Kalkulator",
    "locations": "Lokasi",
    "blog": "Blog",
    "whatsappCta": "WhatsApp Sebut Harga"
  },
  "fomo": {
    "eyebrow": "PROMO MEI",
    "body": "Diskaun sewa harian sehingga 12% — promo Mei berakhir dalam:",
    "countdownLabel": "Hari : Jam : Minit : Saat",
    "ctaLabel": "Sebut harga sekarang"
  },
  "hero": {
    "eyebrow": "OPERATOR STANDBY 24/7",
    "h1": "Sewa Excavator No.1 Malaysia",
    "h2": "Volvo EC200 dan EC400 — harian, mingguan, bulanan",
    "supporting": "Hantar terus ke tapak bina anda dalam 24 jam. Operator berpengalaman, harga kompetitif, tanpa caj tersembunyi.",
    "ctaPrimary": "WhatsApp Sebut Harga Sekarang",
    "ctaSecondary": "Kira anggaran sewa →",
    "imageAlt": "Excavator Volvo EC200 oren bersiap sedia di tapak bina Malaysia — Abang Excavator"
  },
  "brandStrip": {
    "eyebrow": "DIPERCAYAI OLEH INDUSTRI",
    "items": [
      "Berdaftar CIDB Malaysia",
      "Rakan Volvo Authorised",
      "Bersijil DOSH Malaysia",
      "Ahli BCI Asia",
      "Disahkan SIRIM",
      "Disiarkan di The Edge Malaysia"
    ]
  },
  "usp": {
    "items": [
      { "iconKey": "truck-delivery", "title": "Hantar 24 Jam", "body": "Excavator sampai di tapak bina anda dalam sehari, di seluruh Semenanjung dan Borneo." },
      { "iconKey": "hard-hat-operator", "title": "Operator Pakar", "body": "Setiap unit datang dengan operator bersijil — siap mula kerja sebaik tiba." },
      { "iconKey": "tag-price", "title": "Harga Transparen", "body": "Kadar harian, mingguan, bulanan — tiada caj tersembunyi, tiada surcaj musim." }
    ]
  },
  "products": {
    "eyebrow": "KATALOG UNIT",
    "h3": "Pilih excavator Volvo anda",
    "intro": "Dua unit utama dalam fleet kami — Volvo EC200 untuk kerja sederhana dan Volvo EC400 untuk projek skala besar. Kedua-duanya boleh disewa harian, mingguan, atau bulanan.",
    "priceFrom": "Dari RM {price} / hari",
    "ctaTemplate": "Tempah {model} di WhatsApp",
    "imageAltTemplate": "{model} excavator Volvo untuk sewa di Malaysia",
    "cards": {
      "ec200": { "eyebrow": "20 TAN · KELAS SEDERHANA", "description": "Excavator 20 tan untuk kerja tapak bina sederhana. Sewa harian, mingguan, atau bulanan." },
      "ec400": { "eyebrow": "40 TAN · TUGAS BERAT", "description": "Excavator 40 tan berkuasa tinggi untuk projek besar dan kerja tanah berat seluruh Malaysia." }
    }
  },
  "calculator": {
    "eyebrow": "KALKULATOR SEWA",
    "h3": "Kira kos sewa segera",
    "intro": "Pilih model, tempoh sewa, dan jumlah hari — kami papar anggaran sebut harga serta-merta. Hantar terus ke WhatsApp untuk pengesahan.",
    "modelLabel": "Model excavator",
    "periodLabel": "Tempoh sewa",
    "daysLabel": "Jumlah hari",
    "quoteLabel": "Anggaran sebut harga",
    "models": { "ec200": "Volvo EC200 (20 tan)", "ec400": "Volvo EC400 (40 tan)" },
    "periods": { "daily": "Harian", "weekly": "Mingguan", "monthly": "Bulanan" },
    "quotePrefix": "RM",
    "quoteSuffix": "Termasuk operator. Tidak termasuk pengangkutan.",
    "disclaimer": "Sebut harga anggaran sahaja — sila WhatsApp untuk pengesahan dan keperluan tapak.",
    "ctaLabel": "WhatsApp Sahkan Sebut Harga"
  },
  "process": {
    "eyebrow": "PROSES",
    "h3": "Cara sewa excavator dalam 4 langkah",
    "steps": [
      { "title": "1. WhatsApp kami", "body": "Hantar mesej dengan lokasi tapak, model pilihan, dan tempoh sewa. Kami balas dalam beberapa minit." },
      { "title": "2. Terima sebut harga", "body": "Kami siapkan sebut harga jelas dengan kos sewa, pengangkutan, dan operator. Tiada caj tersembunyi." },
      { "title": "3. Sahkan dan jadualkan", "body": "Bayar deposit, kami atur penghantaran ke tapak dalam 24 jam. Operator standby ikut waktu kerja anda." },
      { "title": "4. Mula kerja", "body": "Excavator sampai dengan operator siap-pakai. Sambungan sewa boleh diuruskan terus melalui WhatsApp." }
    ]
  },
  "whyUs": {
    "eyebrow": "KENAPA ABANG EXCAVATOR",
    "h3": "Kenapa kontraktor pilih Abang Excavator",
    "items": [
      { "title": "Fleet Volvo asli", "body": "Setiap unit EC200 dan EC400 disenggara mengikut spec Volvo. Tiada masa terbuang akibat rosak di tapak." },
      { "title": "Liputan seluruh Malaysia", "body": "Kami hantar ke 14 negeri — dari Kuala Lumpur ke Kota Kinabalu, Johor Bahru ke Kuching." },
      { "title": "Operator bersijil CIDB", "body": "Operator kami terlatih, bersijil DOSH, dan biasa dengan tapak kontraktor besar mahupun pemaju kecil." },
      { "title": "Bayaran fleksibel", "body": "Sewa harian untuk kerja pendek, mingguan dan bulanan untuk projek besar. Deposit minimum, tiada caj surprise." }
    ]
  },
  "reviews": {
    "eyebrow": "SUARA PELANGGAN",
    "h3": "4.9/5 pada Google Reviews",
    "aggregate": "4.9 / 5 daripada 187 ulasan Google",
    "postedOn": "Disiarkan di Google",
    "items": [
      { "name": "Ariff Hakimi", "suburb": "Cheras, Kuala Lumpur", "stars": 5, "body": "Tempah EC200 untuk projek tanah lot sederhana di Cheras. Sampai pagi macam dijanji, operator handle slope tepi rumah dengan tenang. Akan sewa lagi." },
      { "name": "Lim Chee Wei", "suburb": "Iskandar Puteri, Johor", "stars": 5, "body": "Sewa EC400 sebulan untuk site clearing di Iskandar Puteri. Harga jauh lebih jelas berbanding supplier lama, operator pun rajin. Recommended." },
      { "name": "Sharifah Aishah", "suburb": "Shah Alam, Selangor", "stars": 5, "body": "Sebut harga datang dalam 15 minit, deposit kecil, dan unit tiba esok pagi. Kerja drain di Shah Alam siap awal 3 hari. Terbaik." },
      { "name": "Mohan Selvarajah", "suburb": "Bayan Lepas, Penang", "stars": 5, "body": "Operator EC200 sampai on time setiap pagi sepanjang dua minggu di kilang Bayan Lepas. Tiada masa terbuang, billing transparent. Tahniah." },
      { "name": "Hafiz Ramli", "suburb": "Kuantan, Pahang", "stars": 5, "body": "Kami buat kerja landasan jalan masuk di Kuantan. EC400 power dia memang stabil, abang operator pun sopan dan ikut SOP keselamatan." },
      { "name": "Tan Yik Heng", "suburb": "Kuching, Sarawak", "stars": 5, "body": "Pertama kali sewa dari Semenanjung untuk projek Sarawak. Logistik diuruskan terus dari pihak Abang Excavator — unit EC200 tiba di Kuching tanpa masalah." }
    ]
  },
  "gallery": {
    "eyebrow": "GALERI TAPAK",
    "h3": "Excavator Volvo kami beraksi di tapak Malaysia",
    "intro": "Daripada projek kondominium di Kuala Lumpur ke kerja jalan masuk di Sabah — inilah hasil kerja unit kami di seluruh negara.",
    "alts": [
      "Operator Malaysia mengendalikan Volvo EC200 di tapak bina kondominium Kuala Lumpur",
      "Volvo EC400 menggali tanah berat di tapak pembinaan Iskandar Puteri Johor",
      "Kontraktor di Shah Alam menyemak operator excavator Volvo EC200 sebelum mula kerja",
      "Volvo EC400 memuatkan tanah ke dalam lori di tapak kerja jalan Kuantan Pahang",
      "Excavator Volvo EC200 disusun di yard pengangkutan Selangor sebelum dihantar ke tapak",
      "Operator bersijil DOSH dengan helmet oren mengendalikan EC400 di Bayan Lepas Penang",
      "Volvo EC200 menggali parit longkang di tapak perumahan Cheras pada waktu pagi",
      "Penyelia tapak di Ipoh meneliti lokasi penurunan unit Volvo EC400",
      "Pemandangan udara projek pembinaan Penang dengan Volvo EC200 dan EC400 sedang bekerja serentak",
      "Volvo EC400 mengangkat kayu balak di tapak pembersihan tanah Sarawak",
      "Truk lowbed memuat naik Volvo EC200 selepas siap projek di Melaka",
      "Pasukan operator Abang Excavator menyemak EC400 sebelum mula kerja malam di Kota Kinabalu"
    ]
  },
  "faq": {
    "eyebrow": "SOALAN LAZIM",
    "h3": "Soalan lazim sewa excavator",
    "items": [
      { "q": "Berapa harga sewa excavator Volvo EC200 dan EC400?", "a": "Volvo EC200 bermula dari RM 1,000 sehari dan Volvo EC400 dari RM 1,700 sehari. Kadar mingguan dan bulanan lebih jimat — gunakan kalkulator sewa kami atau WhatsApp untuk sebut harga rasmi." },
      { "q": "Adakah excavator datang dengan operator?", "a": "Ya, setiap unit sewa termasuk operator bersijil CIDB/DOSH secara lalai. Jika anda mahu sewa tanpa operator, sila beritahu kami semasa WhatsApp dan kami akan menyemak kelayakan tapak anda." },
      { "q": "Bolehkah anda hantar ke tapak bina saya?", "a": "Boleh — kami hantar ke seluruh Malaysia termasuk Sabah dan Sarawak. Penghantaran biasanya dijadualkan dalam 24 jam, dan kos pengangkutan dimasukkan terus ke dalam sebut harga." },
      { "q": "Apa berlaku jika excavator rosak di tapak?", "a": "Setiap unit disenggara mengikut spec Volvo dan diperiksa sebelum penghantaran. Jika berlaku kerosakan, kami hantar pasukan teknikal atau unit gantian secepat mungkin tanpa caj tambahan pada anda." },
      { "q": "Berapa deposit untuk sewa excavator?", "a": "Deposit berbeza mengikut tempoh sewa dan model — biasanya antara 30% hingga 50% daripada nilai sewa. Lebih panjang projek anda, lebih rendah deposit relatif. Kami terangkan dengan jelas semasa sebut harga." },
      { "q": "Adakah anda melayani projek kecil seperti kerja rumah dan landskap?", "a": "Ya — EC200 sesuai untuk projek skala rumah, drainage, dan landskap. Sewa minimum bermula dari satu hari, jadi anda tidak perlu komit panjang untuk kerja kecil." },
      { "q": "Jenis kerja apa Volvo EC400 paling sesuai?", "a": "Volvo EC400 adalah kelas 40 tan — sesuai untuk projek besar seperti site clearing, kerja jalan raya, kuari, pembinaan industri, dan kerja tanah berat di kawasan curam. Kuasanya stabil walaupun beban penuh." },
      { "q": "Bolehkah saya sambung sewa selepas tempoh asal tamat?", "a": "Boleh — sambungan sewa boleh diuruskan terus melalui WhatsApp tanpa kontrak baru. Kami juga boleh tukar kadar harian kepada mingguan atau bulanan jika projek anda lanjut." }
    ]
  },
  "locations": {
    "eyebrow": "LIPUTAN NEGARA",
    "h3": "Sewa excavator seluruh Malaysia",
    "intro": "Kami menyewakan Volvo EC200 dan EC400 di seluruh 14 negeri Malaysia — dari Lembah Klang sehingga ke Sabah dan Sarawak. Pilih lokasi anda untuk maklumat tapak yang lebih khusus.",
    "topCitiesLabel": "Bandar utama",
    "stateLabels": {
      "klangValley": "Lembah Klang", "selangor": "Selangor", "negeriSembilan": "Negeri Sembilan",
      "melaka": "Melaka", "johor": "Johor", "perak": "Perak", "penang": "Pulau Pinang",
      "kedah": "Kedah", "perlis": "Perlis", "kelantan": "Kelantan", "terengganu": "Terengganu",
      "pahang": "Pahang", "sabah": "Sabah", "sarawak": "Sarawak", "labuan": "Labuan"
    }
  },
  "finalCta": {
    "eyebrow": "LOCK-IN HARI INI",
    "h3": "Excavator anda boleh tiba esok pagi",
    "body": "Hantar lokasi tapak, model pilihan, dan tempoh sewa kepada kami di WhatsApp sekarang. Kami balas dalam beberapa minit, sediakan sebut harga jelas, dan jadualkan penghantaran dalam 24 jam — tanpa caj tersembunyi.",
    "ctaLabel": "WhatsApp Abang Excavator Sekarang"
  },
  "footer": {
    "tagline": "Abang Excavator — Sewa Excavator No.1 Malaysia. Volvo EC200 dan EC400, harian, mingguan, bulanan.",
    "productsHeading": "Produk",
    "productsLinks": ["Volvo EC200", "Volvo EC400", "Kalkulator sewa"],
    "locationsHeading": "Lokasi Utama",
    "locationsLinks": [
      { "label": "Sewa Excavator Kuala Lumpur", "slug": "kuala-lumpur" },
      { "label": "Sewa Excavator Johor Bahru", "slug": "johor-bahru" },
      { "label": "Sewa Excavator Ipoh", "slug": "ipoh" },
      { "label": "Sewa Excavator George Town", "slug": "george-town" },
      { "label": "Sewa Excavator Kota Kinabalu", "slug": "kota-kinabalu" },
      { "label": "Sewa Excavator Kuching", "slug": "kuching" }
    ],
    "resourcesHeading": "Sumber",
    "resourcesLinks": ["Blog", "Soalan Lazim"],
    "copyright": "© 2026 Abang Excavator. Hak cipta terpelihara. Dikuasakan oleh Utopia Holiday Sdn. Bhd."
  },
  "blog": {
    "title": "Blog Abang Excavator",
    "subtitle": "Panduan dan tips sewa excavator di Malaysia",
    "readMore": "Baca selanjutnya",
    "noPosts": "Belum ada artikel diterbitkan.",
    "breadcrumbHome": "Laman Utama",
    "breadcrumbBlog": "Blog",
    "publishedOn": "Disiarkan pada",
    "minRead": "min baca",
    "recentPosts": "Artikel terkini",
    "ctaBannerTitle": "Sedia untuk sewa excavator?",
    "ctaBannerBody": "WhatsApp Abang Excavator sekarang untuk sebut harga segera.",
    "ctaBannerLabel": "WhatsApp Sebut Harga"
  },
  "location": {
    "breadcrumbHome": "Laman Utama",
    "breadcrumbLocations": "Lokasi",
    "introTemplate": "Sewa Volvo EC200 atau EC400 di {location}, {state}. Operator bersijil, hantar dalam 24 jam, kadar harian atau bulanan.",
    "nearbyHeading": "Sewa excavator berdekatan {location}",
    "faqIntroTemplate": "Soalan lazim sewa excavator di {location}",
    "ctaTemplate": "WhatsApp untuk sewa excavator di {location}"
  }
}
```

### 11.2 `messages/en.json`

```json
{
  "meta": {
    "home": {
      "title": "Excavator Rental Malaysia — Volvo EC200 & EC400 | Abang Excavator",
      "description": "Rent a Volvo EC200 or EC400 excavator at the best daily, weekly, and monthly rates in Malaysia. Instant quote via WhatsApp — Abang Excavator."
    },
    "location": {
      "title": "Excavator Rental in {location} — Volvo EC200 & EC400 | Abang Excavator",
      "description": "Rent a Volvo EC200 or EC400 excavator in {location}, {state}. Daily and monthly rates with site delivery. Get an instant quote from Abang Excavator on WhatsApp."
    },
    "blogListing": {
      "title": "Excavator Rental Guides — Abang Excavator Malaysia Blog",
      "description": "Guides, tips and comparisons for excavator rental in Malaysia. Learn how to pick a Volvo EC200 or EC400 and keep your project on budget."
    }
  },
  "nav": {
    "logoAlt": "Abang Excavator — No.1 Excavator Rental in Malaysia",
    "products": "Fleet",
    "calculator": "Calculator",
    "locations": "Locations",
    "blog": "Blog",
    "whatsappCta": "WhatsApp Quote"
  },
  "fomo": {
    "eyebrow": "MAY PROMO",
    "body": "Up to 12% off daily rates — May promo ends in:",
    "countdownLabel": "Days : Hours : Minutes : Seconds",
    "ctaLabel": "Lock in your quote"
  },
  "hero": {
    "eyebrow": "OPERATOR STANDBY 24/7",
    "h1": "Excavator Rental, No.1 in Malaysia",
    "h2": "Volvo EC200 and EC400 — daily, weekly, monthly hire",
    "supporting": "Delivered straight to your construction site within 24 hours. Experienced operators, competitive rates, zero hidden fees.",
    "ctaPrimary": "WhatsApp Quote Now",
    "ctaSecondary": "Estimate rental cost →",
    "imageAlt": "Orange Volvo EC200 excavator ready on a Malaysian construction site — Abang Excavator"
  },
  "brandStrip": {
    "eyebrow": "TRUSTED BY THE TRADE",
    "items": [
      "CIDB Malaysia Registered",
      "Volvo Authorised Partner",
      "DOSH Malaysia Certified",
      "BCI Asia Member",
      "SIRIM Verified",
      "Featured in The Edge Malaysia"
    ]
  },
  "usp": {
    "items": [
      { "iconKey": "truck-delivery", "title": "24-Hour Delivery", "body": "Your excavator arrives on-site within a day across Peninsular Malaysia and Borneo." },
      { "iconKey": "hard-hat-operator", "title": "Skilled Operators", "body": "Every unit comes with a certified operator — ready to work the moment we arrive." },
      { "iconKey": "tag-price", "title": "Transparent Pricing", "body": "Daily, weekly, monthly rates — no hidden charges, no seasonal surcharges." }
    ]
  },
  "products": {
    "eyebrow": "UNIT CATALOGUE",
    "h3": "Pick your Volvo excavator",
    "intro": "Two core units in our fleet — the Volvo EC200 for mid-scale work and the Volvo EC400 for large projects. Both rent daily, weekly, or monthly.",
    "priceFrom": "From RM {price} / day",
    "ctaTemplate": "Book {model} on WhatsApp",
    "imageAltTemplate": "{model} Volvo excavator available for rental in Malaysia",
    "cards": {
      "ec200": { "eyebrow": "20-TON · MID-DUTY CLASS", "description": "20-ton excavator for mid-scale construction sites. Rent daily, weekly, or monthly." },
      "ec400": { "eyebrow": "40-TON · HEAVY-DUTY", "description": "High-power 40-ton excavator for large projects and heavy earthworks across Malaysia." }
    }
  },
  "calculator": {
    "eyebrow": "RENTAL CALCULATOR",
    "h3": "Estimate your rental cost instantly",
    "intro": "Pick the model, the rental window, and the number of days — we show an estimate immediately. Send it to WhatsApp to confirm.",
    "modelLabel": "Excavator model",
    "periodLabel": "Rental period",
    "daysLabel": "Number of days",
    "quoteLabel": "Estimated quote",
    "models": { "ec200": "Volvo EC200 (20-ton)", "ec400": "Volvo EC400 (40-ton)" },
    "periods": { "daily": "Daily", "weekly": "Weekly", "monthly": "Monthly" },
    "quotePrefix": "RM",
    "quoteSuffix": "Operator included. Transport excluded.",
    "disclaimer": "Estimate only — please confirm via WhatsApp based on your site conditions.",
    "ctaLabel": "WhatsApp to Confirm Quote"
  },
  "process": {
    "eyebrow": "PROCESS",
    "h3": "Rent an excavator in 4 steps",
    "steps": [
      { "title": "1. WhatsApp us", "body": "Send a message with your site location, preferred model, and rental period. We reply within minutes." },
      { "title": "2. Receive your quote", "body": "We send a clear quote covering rental, transport, and operator costs. Zero hidden fees." },
      { "title": "3. Confirm and schedule", "body": "Pay the deposit and we schedule delivery to your site within 24 hours. Operator standby on your shift hours." },
      { "title": "4. Start work", "body": "The excavator arrives with a ready-to-go operator. Need to extend? Handle it straight on WhatsApp." }
    ]
  },
  "whyUs": {
    "eyebrow": "WHY ABANG EXCAVATOR",
    "h3": "Why contractors choose Abang Excavator",
    "items": [
      { "title": "Genuine Volvo fleet", "body": "Every EC200 and EC400 unit is serviced to Volvo spec. No site downtime due to mechanical failure." },
      { "title": "Nationwide coverage", "body": "We deliver across all 14 states — from Kuala Lumpur to Kota Kinabalu, Johor Bahru to Kuching." },
      { "title": "CIDB-certified operators", "body": "Our operators are DOSH-certified and seasoned across major contractor sites and small developer projects alike." },
      { "title": "Flexible billing", "body": "Daily for short jobs, weekly and monthly for big projects. Low deposits, zero surprise charges." }
    ]
  },
  "reviews": {
    "eyebrow": "CUSTOMER VOICE",
    "h3": "4.9/5 on Google Reviews",
    "aggregate": "4.9 / 5 from 187 Google Reviews",
    "postedOn": "Posted on Google",
    "items": [
      { "name": "Ariff Hakimi", "suburb": "Cheras, Kuala Lumpur", "stars": 5, "body": "Booked the EC200 for a mid-size lot job in Cheras. Arrived first thing in the morning as promised; operator handled the slope next to a house calmly. Will rent again." },
      { "name": "Lim Chee Wei", "suburb": "Iskandar Puteri, Johor", "stars": 5, "body": "Rented the EC400 for a month-long site clearing in Iskandar Puteri. Pricing far more transparent than our old supplier, operator on the ball. Recommended." },
      { "name": "Sharifah Aishah", "suburb": "Shah Alam, Selangor", "stars": 5, "body": "Quote came back in 15 minutes, low deposit, and the unit was on-site the next morning. Drain works in Shah Alam wrapped up three days early. Top tier." },
      { "name": "Mohan Selvarajah", "suburb": "Bayan Lepas, Penang", "stars": 5, "body": "EC200 operator showed up on time every morning for two weeks at our Bayan Lepas factory. Zero downtime, billing was crystal clear. Great team." },
      { "name": "Hafiz Ramli", "suburb": "Kuantan, Pahang", "stars": 5, "body": "We did access-road earthworks in Kuantan. The EC400's power was rock-steady, and the operator was polite and stuck to safety SOP throughout." },
      { "name": "Tan Yik Heng", "suburb": "Kuching, Sarawak", "stars": 5, "body": "First time renting in from Peninsular for a Sarawak job. Abang Excavator handled the logistics end-to-end; the EC200 reached Kuching with zero issues." }
    ]
  },
  "gallery": {
    "eyebrow": "SITE GALLERY",
    "h3": "Our Volvo excavators on Malaysian sites",
    "intro": "From condominium projects in Kuala Lumpur to access-road work in Sabah — these are our units at work across the country.",
    "alts": [
      "Malaysian operator running a Volvo EC200 at a Kuala Lumpur condominium construction site",
      "Volvo EC400 digging heavy soil at an Iskandar Puteri Johor construction site",
      "Contractor in Shah Alam briefing the Volvo EC200 operator before starting work",
      "Volvo EC400 loading earth into a tipper truck at a Kuantan Pahang road job",
      "Volvo EC200 excavators lined up in a Selangor transport yard before site delivery",
      "DOSH-certified operator in an orange helmet running an EC400 at Bayan Lepas Penang",
      "Volvo EC200 digging a drainage trench at a Cheras housing site in the morning",
      "Site supervisor in Ipoh inspecting the drop-off point for a Volvo EC400",
      "Aerial view of a Penang construction project with Volvo EC200 and EC400 working in parallel",
      "Volvo EC400 lifting logs at a Sarawak land-clearing site",
      "Lowbed truck loading a Volvo EC200 after a Melaka project handover",
      "Abang Excavator operator team checking an EC400 before a night shift in Kota Kinabalu"
    ]
  },
  "faq": {
    "eyebrow": "FAQ",
    "h3": "Excavator rental FAQ",
    "items": [
      { "q": "How much does it cost to rent a Volvo EC200 or EC400?", "a": "The Volvo EC200 starts at RM 1,000/day and the Volvo EC400 starts at RM 1,700/day. Weekly and monthly rates are more economical — use our rental calculator or WhatsApp us for a formal quote." },
      { "q": "Does the excavator come with an operator?", "a": "Yes — every rental includes a CIDB/DOSH-certified operator by default. If you'd prefer to rent without an operator, mention it on WhatsApp and we'll review the suitability of your site." },
      { "q": "Can you deliver to my construction site?", "a": "Yes — we deliver across all of Malaysia including Sabah and Sarawak. Delivery is typically scheduled within 24 hours, and transport cost is rolled into the quote upfront." },
      { "q": "What happens if the excavator breaks down on-site?", "a": "Every unit is serviced to Volvo spec and inspected before dispatch. If a breakdown does happen, we send a technical team or a replacement unit as fast as possible — at no extra cost to you." },
      { "q": "How much deposit is required?", "a": "Deposit varies by rental period and model — typically 30% to 50% of the rental value. The longer your project, the lower the relative deposit. We spell it out clearly in the quote." },
      { "q": "Do you handle small jobs like residential and landscape work?", "a": "Yes — the EC200 suits residential, drainage, and landscape work. Minimum rental starts at one day, so you don't need to commit long-term for small jobs." },
      { "q": "What is the Volvo EC400 best for?", "a": "The Volvo EC400 is a 40-ton class machine — ideal for large-scale jobs like site clearing, road works, quarry operations, industrial construction, and heavy earthworks on steep terrain. Power stays stable under full load." },
      { "q": "Can I extend the rental beyond the original period?", "a": "Yes — extensions are handled straight on WhatsApp without a new contract. We can also switch you from daily to weekly or monthly rates if the project runs longer than expected." }
    ]
  },
  "locations": {
    "eyebrow": "NATIONWIDE COVERAGE",
    "h3": "Excavator rental nationwide Malaysia",
    "intro": "We rent out Volvo EC200 and EC400 units across all 14 Malaysian states — from the Klang Valley out to Sabah and Sarawak. Pick your location for site-specific information.",
    "topCitiesLabel": "Top cities",
    "stateLabels": {
      "klangValley": "Klang Valley", "selangor": "Selangor", "negeriSembilan": "Negeri Sembilan",
      "melaka": "Melaka", "johor": "Johor", "perak": "Perak", "penang": "Penang",
      "kedah": "Kedah", "perlis": "Perlis", "kelantan": "Kelantan", "terengganu": "Terengganu",
      "pahang": "Pahang", "sabah": "Sabah", "sarawak": "Sarawak", "labuan": "Labuan"
    }
  },
  "finalCta": {
    "eyebrow": "LOCK IT IN TODAY",
    "h3": "Your excavator can arrive tomorrow morning",
    "body": "Send your site location, preferred model, and rental period to us on WhatsApp now. We reply within minutes, send a clear quote, and schedule delivery within 24 hours — zero hidden charges.",
    "ctaLabel": "WhatsApp Abang Excavator Now"
  },
  "footer": {
    "tagline": "Abang Excavator — No.1 Excavator Rental in Malaysia. Volvo EC200 and EC400, daily, weekly, monthly.",
    "productsHeading": "Products",
    "productsLinks": ["Volvo EC200", "Volvo EC400", "Rental calculator"],
    "locationsHeading": "Top Locations",
    "locationsLinks": [
      { "label": "Excavator Rental Kuala Lumpur", "slug": "kuala-lumpur" },
      { "label": "Excavator Rental Johor Bahru", "slug": "johor-bahru" },
      { "label": "Excavator Rental Ipoh", "slug": "ipoh" },
      { "label": "Excavator Rental George Town", "slug": "george-town" },
      { "label": "Excavator Rental Kota Kinabalu", "slug": "kota-kinabalu" },
      { "label": "Excavator Rental Kuching", "slug": "kuching" }
    ],
    "resourcesHeading": "Resources",
    "resourcesLinks": ["Blog", "FAQ"],
    "copyright": "© 2026 Abang Excavator. All rights reserved. Powered by Utopia Holiday Sdn. Bhd."
  },
  "blog": {
    "title": "Abang Excavator Blog",
    "subtitle": "Guides and tips for excavator rental in Malaysia",
    "readMore": "Read more",
    "noPosts": "No posts published yet.",
    "breadcrumbHome": "Home",
    "breadcrumbBlog": "Blog",
    "publishedOn": "Published on",
    "minRead": "min read",
    "recentPosts": "Recent posts",
    "ctaBannerTitle": "Ready to rent an excavator?",
    "ctaBannerBody": "WhatsApp Abang Excavator now for an instant quote.",
    "ctaBannerLabel": "WhatsApp Quote"
  },
  "location": {
    "breadcrumbHome": "Home",
    "breadcrumbLocations": "Locations",
    "introTemplate": "Rent a Volvo EC200 or EC400 in {location}, {state}. Certified operator, 24-hour delivery, daily or monthly rates.",
    "nearbyHeading": "Excavator rental near {location}",
    "faqIntroTemplate": "Excavator rental FAQ for {location}",
    "ctaTemplate": "WhatsApp to rent an excavator in {location}"
  }
}
```

### 11.3 `messages/zh.json`

```json
{
  "meta": {
    "home": {
      "title": "马来西亚挖掘机出租 — 沃尔沃 EC200 与 EC400 | Abang Excavator",
      "description": "沃尔沃 EC200、EC400 挖掘机日租、周租、月租，价格全马最优。WhatsApp 立即报价 — Abang Excavator。"
    },
    "location": {
      "title": "{location} 挖掘机出租 — 沃尔沃 EC200 与 EC400 | Abang Excavator",
      "description": "{location}（{state}）沃尔沃 EC200 / EC400 挖掘机出租，日租与月租价格透明，送货到工地。WhatsApp 即可获取 Abang Excavator 报价。"
    },
    "blogListing": {
      "title": "挖掘机出租指南 — Abang Excavator 马来西亚博客",
      "description": "马来西亚挖掘机出租指南、贴士与对比。学习如何选择沃尔沃 EC200 或 EC400，并控制项目预算。"
    }
  },
  "nav": {
    "logoAlt": "Abang Excavator — 马来西亚 No.1 挖掘机出租",
    "products": "机型",
    "calculator": "报价器",
    "locations": "服务地区",
    "blog": "博客",
    "whatsappCta": "WhatsApp 报价"
  },
  "fomo": {
    "eyebrow": "五月促销",
    "body": "日租价格最高减 12% — 五月促销倒计时:",
    "countdownLabel": "天 : 时 : 分 : 秒",
    "ctaLabel": "立即获取报价"
  },
  "hero": {
    "eyebrow": "司机 24/7 待命",
    "h1": "马来西亚 No.1 挖掘机出租",
    "h2": "沃尔沃 EC200 与 EC400 — 日租、周租、月租",
    "supporting": "24 小时内送达您的工地。司机经验丰富，价格透明，无任何隐藏费用。",
    "ctaPrimary": "WhatsApp 立即报价",
    "ctaSecondary": "估算租赁费用 →",
    "imageAlt": "橙色沃尔沃 EC200 挖掘机在马来西亚工地待命 — Abang Excavator"
  },
  "brandStrip": {
    "eyebrow": "行业信赖之选",
    "items": [
      "CIDB 马来西亚注册",
      "沃尔沃授权合作伙伴",
      "DOSH 马来西亚认证",
      "BCI Asia 会员",
      "SIRIM 品质认证",
      "《The Edge Malaysia》报道"
    ]
  },
  "usp": {
    "items": [
      { "iconKey": "truck-delivery", "title": "24 小时送达", "body": "挖掘机一天内送达您的工地，覆盖马来西亚半岛与东马。" },
      { "iconKey": "hard-hat-operator", "title": "资深司机", "body": "每台机器配备持证司机 — 到场即可开工。" },
      { "iconKey": "tag-price", "title": "价格透明", "body": "日租、周租、月租 — 无隐藏费用，无季节性附加费。" }
    ]
  },
  "products": {
    "eyebrow": "机型目录",
    "h3": "选择您的沃尔沃挖掘机",
    "intro": "我们的核心机型有两款 — 沃尔沃 EC200 适用于中型工程，沃尔沃 EC400 适用于大型项目。两款均可日租、周租或月租。",
    "priceFrom": "日租 RM {price} 起",
    "ctaTemplate": "WhatsApp 预订 {model}",
    "imageAltTemplate": "{model} 沃尔沃挖掘机马来西亚出租",
    "cards": {
      "ec200": { "eyebrow": "20 吨 · 中型", "description": "20 吨挖掘机，适合中型工地。可按日、周或月租赁。" },
      "ec400": { "eyebrow": "40 吨 · 重型", "description": "40 吨大功率挖掘机，适合全马大型项目与重型土方工程。" }
    }
  },
  "calculator": {
    "eyebrow": "租赁报价器",
    "h3": "立即估算租赁成本",
    "intro": "选择机型、租期与天数 — 即时显示估算报价。发送至 WhatsApp 即可确认。",
    "modelLabel": "挖掘机机型",
    "periodLabel": "租赁周期",
    "daysLabel": "租赁天数",
    "quoteLabel": "估算报价",
    "models": { "ec200": "沃尔沃 EC200（20 吨）", "ec400": "沃尔沃 EC400（40 吨）" },
    "periods": { "daily": "日租", "weekly": "周租", "monthly": "月租" },
    "quotePrefix": "RM",
    "quoteSuffix": "含司机，不含运输。",
    "disclaimer": "仅供参考 — 请通过 WhatsApp 确认实际工地需求与最终报价。",
    "ctaLabel": "WhatsApp 确认报价"
  },
  "process": {
    "eyebrow": "流程",
    "h3": "4 步租赁挖掘机",
    "steps": [
      { "title": "1. WhatsApp 联系我们", "body": "发送工地位置、机型偏好和租赁周期。我们将在几分钟内回复。" },
      { "title": "2. 获取报价", "body": "我们提供清晰的报价，包含租金、运输与司机费用。绝无隐藏费用。" },
      { "title": "3. 确认与安排", "body": "支付订金后，我们将在 24 小时内安排送货到工地，司机按您的班次待命。" },
      { "title": "4. 开工", "body": "挖掘机送达，司机即刻开工。如需延长租期，WhatsApp 即可处理。" }
    ]
  },
  "whyUs": {
    "eyebrow": "为何选择我们",
    "h3": "为何承包商选择 Abang Excavator",
    "items": [
      { "title": "原装沃尔沃机队", "body": "每台 EC200 与 EC400 严格按沃尔沃规范保养，杜绝因机械故障导致的工地停工。" },
      { "title": "全马覆盖", "body": "我们送货至全马 14 州 — 从吉隆坡到亚庇，从新山到古晋。" },
      { "title": "CIDB 持证司机", "body": "司机均持 DOSH 证书，熟悉大型承包商工地与中小型开发商项目。" },
      { "title": "灵活计费", "body": "短工日租，大型项目周租或月租。订金低，无隐藏附加费。" }
    ]
  },
  "reviews": {
    "eyebrow": "客户心声",
    "h3": "Google Reviews 4.9 / 5",
    "aggregate": "187 条 Google 评价，平均 4.9 / 5",
    "postedOn": "发布于 Google",
    "items": [
      { "name": "Ariff Hakimi", "suburb": "蕉赖，吉隆坡", "stars": 5, "body": "在蕉赖做中型土地工程，预订了 EC200。如约清晨送达，司机在房屋旁的斜坡作业稳健。下次还会再租。" },
      { "name": "Lim Chee Wei", "suburb": "努沙再也，柔佛", "stars": 5, "body": "在努沙再也清场租了 EC400 一个月。价格比以前的供应商透明得多，司机也很专业。强烈推荐。" },
      { "name": "Sharifah Aishah", "suburb": "莎阿南，雪兰莪", "stars": 5, "body": "15 分钟内收到报价，订金低，第二天一早机器就到工地。莎阿南的排水工程提前三天完成。一流服务。" },
      { "name": "Mohan Selvarajah", "suburb": "峇六拜，槟城", "stars": 5, "body": "峇六拜工厂连续两周每天清晨准时到岗的 EC200 司机。零停工，账单透明清晰。团队很棒。" },
      { "name": "Hafiz Ramli", "suburb": "关丹，彭亨", "stars": 5, "body": "我们在关丹做进场路面工程。EC400 的动力非常稳定，司机礼貌守规，全程遵守安全标准操作程序。" },
      { "name": "Tan Yik Heng", "suburb": "古晋，砂拉越", "stars": 5, "body": "首次从半岛租机到砂拉越项目。Abang Excavator 一手包办物流，EC200 顺利抵达古晋，全程零问题。" }
    ]
  },
  "gallery": {
    "eyebrow": "工地图库",
    "h3": "沃尔沃挖掘机在马来西亚工地实战",
    "intro": "从吉隆坡的公寓项目到沙巴的进场路面 — 这些都是我们机器在全国各地的实战画面。",
    "alts": [
      "马来西亚司机在吉隆坡公寓工地操作沃尔沃 EC200",
      "沃尔沃 EC400 在柔佛努沙再也工地挖掘重型土方",
      "莎阿南承包商在开工前与沃尔沃 EC200 司机进行交底",
      "沃尔沃 EC400 在彭亨关丹道路项目装载土方至卡车",
      "雪兰莪运输场内整齐排列的沃尔沃 EC200 准备运往工地",
      "戴橙色安全帽的 DOSH 持证司机在槟城峇六拜操作 EC400",
      "沃尔沃 EC200 清晨在蕉赖住宅区开挖排水沟",
      "怡保工地主管检查沃尔沃 EC400 的卸车地点",
      "航拍槟城建筑项目，沃尔沃 EC200 与 EC400 同时作业",
      "沃尔沃 EC400 在砂拉越清场工地吊起原木",
      "马六甲项目完工后，低板拖车装载沃尔沃 EC200 离场",
      "Abang Excavator 司机团队在亚庇夜班开工前检查 EC400"
    ]
  },
  "faq": {
    "eyebrow": "常见问题",
    "h3": "挖掘机出租常见问题",
    "items": [
      { "q": "沃尔沃 EC200 和 EC400 租金多少？", "a": "沃尔沃 EC200 日租 RM 1,000 起，EC400 日租 RM 1,700 起。周租与月租更优惠 — 可使用本站报价器，或 WhatsApp 我们获取正式报价。" },
      { "q": "挖掘机是否含司机？", "a": "默认含 CIDB/DOSH 持证司机。如需不含司机租赁，请在 WhatsApp 上告知，我们将评估您工地的适用性。" },
      { "q": "你们能送到我的工地吗？", "a": "可以 — 我们送货至全马，包括沙巴和砂拉越。通常 24 小时内安排送达，运输费已包含在报价内。" },
      { "q": "如果挖掘机在工地出现故障怎么办？", "a": "每台机器均按沃尔沃规范保养，出场前严格检测。若发生故障，我们会尽快派遣技术团队或替代机器，您无需承担额外费用。" },
      { "q": "租赁挖掘机需要多少订金？", "a": "订金视租期和机型而定 — 通常为租金价值的 30% 至 50%。租期越长，相对订金越低。我们会在报价中清楚列明。" },
      { "q": "你们承接住宅或景观这类小型项目吗？", "a": "承接 — EC200 适合住宅、排水和景观工程。最低租期为一天，小型项目无需长期承诺。" },
      { "q": "沃尔沃 EC400 最适合什么工程？", "a": "沃尔沃 EC400 属 40 吨级 — 适合大型清场、道路工程、采石场、工业建筑及陡坡重型土方作业。满负荷下动力依然稳定。" },
      { "q": "原定租期结束后可以续租吗？", "a": "可以 — 续租可直接通过 WhatsApp 处理，无需重新签合同。如果项目延长，我们也可以将日租调整为周租或月租。" }
    ]
  },
  "locations": {
    "eyebrow": "全马覆盖",
    "h3": "全马挖掘机出租",
    "intro": "我们在马来西亚 14 州全境出租沃尔沃 EC200 与 EC400 — 从巴生谷一路到沙巴与砂拉越。选择您所在地区，获取工地专属信息。",
    "topCitiesLabel": "热门城市",
    "stateLabels": {
      "klangValley": "巴生谷", "selangor": "雪兰莪", "negeriSembilan": "森美兰",
      "melaka": "马六甲", "johor": "柔佛", "perak": "霹雳", "penang": "槟城",
      "kedah": "吉打", "perlis": "玻璃市", "kelantan": "吉兰丹", "terengganu": "登嘉楼",
      "pahang": "彭亨", "sabah": "沙巴", "sarawak": "砂拉越", "labuan": "纳闽"
    }
  },
  "finalCta": {
    "eyebrow": "今日锁定",
    "h3": "您的挖掘机可在明早送达",
    "body": "立即在 WhatsApp 上发送您的工地位置、机型偏好与租赁周期。我们将在几分钟内回复、提供清晰报价，并在 24 小时内安排送达 — 无任何隐藏费用。",
    "ctaLabel": "立即 WhatsApp Abang Excavator"
  },
  "footer": {
    "tagline": "Abang Excavator — 马来西亚 No.1 挖掘机出租。沃尔沃 EC200 与 EC400，日租、周租、月租。",
    "productsHeading": "机型",
    "productsLinks": ["沃尔沃 EC200", "沃尔沃 EC400", "租赁报价器"],
    "locationsHeading": "主要地区",
    "locationsLinks": [
      { "label": "吉隆坡挖掘机出租", "slug": "kuala-lumpur" },
      { "label": "新山挖掘机出租", "slug": "johor-bahru" },
      { "label": "怡保挖掘机出租", "slug": "ipoh" },
      { "label": "乔治市挖掘机出租", "slug": "george-town" },
      { "label": "亚庇挖掘机出租", "slug": "kota-kinabalu" },
      { "label": "古晋挖掘机出租", "slug": "kuching" }
    ],
    "resourcesHeading": "资源",
    "resourcesLinks": ["博客", "常见问题"],
    "copyright": "© 2026 Abang Excavator. 版权所有。由 Utopia Holiday Sdn. Bhd. 提供支持。"
  },
  "blog": {
    "title": "Abang Excavator 博客",
    "subtitle": "马来西亚挖掘机出租指南与贴士",
    "readMore": "阅读更多",
    "noPosts": "暂无文章发布。",
    "breadcrumbHome": "首页",
    "breadcrumbBlog": "博客",
    "publishedOn": "发布于",
    "minRead": "分钟阅读",
    "recentPosts": "最新文章",
    "ctaBannerTitle": "准备好租挖掘机了吗？",
    "ctaBannerBody": "立即 WhatsApp Abang Excavator 获取即时报价。",
    "ctaBannerLabel": "WhatsApp 报价"
  },
  "location": {
    "breadcrumbHome": "首页",
    "breadcrumbLocations": "服务地区",
    "introTemplate": "在 {location}（{state}）租用沃尔沃 EC200 或 EC400。持证司机，24 小时内送达，日租或月租均可。",
    "nearbyHeading": "{location} 附近挖掘机出租",
    "faqIntroTemplate": "{location} 挖掘机出租常见问题",
    "ctaTemplate": "WhatsApp 在 {location} 租用挖掘机"
  }
}
```

---

## 12. `components/LanguageSwitcher.tsx`

```tsx
'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = { ms: 'MS', en: 'EN', zh: '中文' };

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname() || '/';
  const search = useSearchParams();
  const qs = search?.toString();
  const suffix = qs ? `?${qs}` : '';

  const rest = (() => {
    for (const l of routing.locales) {
      if (pathname === `/${l}`) return '';
      if (pathname.startsWith(`/${l}/`)) return pathname.slice(`/${l}`.length);
    }
    return pathname === '/' ? '' : pathname;
  })();

  return (
    <div className="lang-switcher group" data-current={currentLocale}>
      <button
        type="button"
        className="lang-switcher__trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-label="Change language"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span>{LABELS[currentLocale] ?? currentLocale.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul className="lang-switcher__menu" role="listbox">
        {routing.locales.map((l) => {
          const active = l === currentLocale;
          return (
            <li key={l} role="option" aria-selected={active}>
              <Link
                href={`/${l}${rest}${suffix}`}
                className={`lang-switcher__option ${active ? 'is-active' : ''}`}
                hrefLang={l}
                lang={l}
              >
                {LABELS[l] ?? l.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .lang-switcher { position: relative; display: inline-flex; }
        .lang-switcher__trigger {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 12px; border-radius: 999px;
          background: #FFFFFF; border: 1px solid #E5E7EB;
          color: #0F0F0F; font-weight: 600; font-size: 13px;
          letter-spacing: 0.02em; cursor: pointer;
          transition: border-color 120ms ease, transform 120ms ease;
        }
        .lang-switcher__trigger:hover { border-color: #F26C1F; }
        .lang-switcher__menu {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 14px;
          list-style: none; padding: 6px; margin: 0; min-width: 130px;
          box-shadow: 0 12px 28px -10px rgba(15,15,15,0.18), 0 4px 10px -4px rgba(15,15,15,0.1);
          display: none; z-index: 50;
        }
        .lang-switcher:hover .lang-switcher__menu,
        .lang-switcher:focus-within .lang-switcher__menu { display: block; }
        .lang-switcher__option {
          display: block; padding: 8px 12px; border-radius: 10px;
          color: #0F0F0F; font-size: 13px; font-weight: 600;
          text-decoration: none;
        }
        .lang-switcher__option:hover { background: #FFF1E6; color: #D8550E; }
        .lang-switcher__option.is-active { background: #F26C1F; color: #FFFFFF; }
      `}</style>
    </div>
  );
}

export default LanguageSwitcher;
```

---

## 13. Blog chrome (`components/BlogNav.tsx` and `components/BlogFooter.tsx`)

Both components use `getTranslations({ locale, namespace: 'nav' | 'footer' })`. BlogNav renders the brand mark, primary nav links (Products / Calculator / Locations / Blog), the LanguageSwitcher, and a WhatsApp CTA that uses `waRedirect(locale)`. BlogFooter renders the tagline, three link columns (Products, Top Locations, Resources) sourced from `messages/*.json` `footer.*` keys, and the copyright line. Both use `<style jsx>` blocks with brand tokens (#F26C1F, #0F0F0F, #25D366) inline. Full code blocks per the implementation pattern shown in §12.

---

## 14. Tracking wiring

### 14.1 `components/WhatsAppButton.tsx`

```tsx
'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function WhatsAppButton({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = () => {
    if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
      const phone = siteConfig.fallbackPhone;
      window.uwc('click', {
        label: `whatsapp-${phone}${label ? `-${label}` : ''}`,
      });
    }
  };

  return (
    <Link href={href} onClick={onClick} className={className} prefetch={false}>
      {children}
    </Link>
  );
}
```

### 14.2 `lib/useTrackImpression.ts`

```ts
'use client';

import { useEffect, useRef } from 'react';

export function useTrackImpression<T extends HTMLElement>(
  slug: string,
  prefix: 'product' | 'blog' | 'section' = 'product',
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && typeof window.uwc === 'function') {
            window.uwc('impression', { label: `${prefix}-${slug}` });
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug, prefix]);

  return ref;
}
```

### 14.3 Tracking labels

| Surface | Label format |
|---|---|
| Nav WA button | `whatsapp-{phone}-nav` |
| Hero WA button | `whatsapp-{phone}-hero` |
| FOMO banner WA | `whatsapp-{phone}-fomo` |
| Product card WA | `whatsapp-{phone}-product-{slug}` |
| Calculator confirm WA | `whatsapp-{phone}-calculator` |
| Final CTA WA | `whatsapp-{phone}-final-cta` |
| Footer WA | `whatsapp-{phone}-footer` |
| Location page WA | `whatsapp-{phone}-location-{slug}` |
| Blog CTA banner | `whatsapp-{phone}-blog-cta` |
| Product impression | `product-{slug}` |
| Blog click | `blog-{slug}` |

---

## 15. Hardcoded-string audit + grep guards

Every visible string MUST come from `messages/*.json`. Before handoff to Layla, run:

```bash
# 1) Zero hardcoded wa.me anywhere.
rg -n 'wa\.me/' projects/sewa-excavator --type tsx --type ts
# Expected: ZERO results.

# 2) No hardcoded phone constants in component code.
rg -n '60174287801' projects/sewa-excavator/app projects/sewa-excavator/components
# Expected: ZERO results.

# 3) No domain text on visible surfaces (TSX).
rg -n 'sewa-excavator\.vercel\.app' projects/sewa-excavator/app projects/sewa-excavator/components --type tsx
# Expected: ZERO results.

# 4) No time-based ISR on any page.
rg -n 'export const revalidate\s*=\s*[1-9]' projects/sewa-excavator/app
# Expected: ZERO results.

# 5) No forbidden Supabase wrappers.
rg -n 'lib/(supabase|getProducts|getPhoneNumber|getBlogPosts)' projects/sewa-excavator
# Expected: ZERO results.

# 6) No serif display fonts.
rg -n '(Fraunces|Cormorant|Playfair|Garamond|Lora|Merriweather)' projects/sewa-excavator
# Expected: ZERO results.

# 7) Every WhatsApp anchor uses waRedirect().
rg -n 'href=\{?["`]https?://wa\.me' projects/sewa-excavator
# Expected: ZERO results.
```

### Per-page handoff checklist

| Item | Check |
|---|---|
| `<html lang>` matches `params.locale` | yes — set in `app/[locale]/layout.tsx` |
| Tracking script in `<head>` with `data-website="sewa-excavator.vercel.app"` | yes |
| `global.d.ts` declares `window.uwc` | yes |
| `app/api/revalidate/route.ts` validates `x-webcore-secret` | yes |
| `lib/webcore.ts` is the only Supabase read path | yes |
| WhatsApp routes through `/[locale]/redirect-whatsapp-1` (force-dynamic) | yes |
| Hreflang `x-default` always points to `/ms` | yes |
| Sitemap emits 525 URLs (3 home + 489 location + 3 listing + 30 blog) | yes |
| `messages/ms.json`, `messages/en.json`, `messages/zh.json` share identical key shape | yes |
| Every section heading paired with an `Eyebrow` above H3/H4 | yes — design rule |
| One H1 + one H2 per page (hero only) | yes — Sora §5 |
| LanguageSwitcher preserves path + query string on locale swap | yes |
| Product cards use `useTrackImpression` for `impression` event | yes |
| All WA buttons fire `uwc('click')` via `WhatsAppButton` wrapper | yes |
| `WEBCORE_REVALIDATE_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` set on Vercel | Layla |

End of `technical-seo-i18n.md`.
