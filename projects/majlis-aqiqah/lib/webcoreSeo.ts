// Per-page SEO overrides from webcore (`webcore.seo_overrides`).
//
// Webcore's SEO page lets an editor set a page's meta title, description and
// share image without touching this repo. Rows are keyed by the page's public
// path — exactly what localePath() returns, so `/` for the Malay homepage and
// `/en/pakej-aqiqah/klang` for an English location page — plus the language.
// A page with no row keeps the metadata it builds itself.
//
// seo_overrides has no anon read policy and this project carries no service
// key, so the rows come from webcore's public list endpoint instead. That GET
// is CDN-cached for 300s, so the fetch itself is `no-store` with a unique URL,
// and the answer is held in Next's cache under `webcore-seo` — webcore's ping
// to /api/revalidate is what refreshes it, not a timer.

import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { siteConfig } from '@/config/site';
import { localePath } from '@/lib/localeHref';

const WEBCORE_PUBLIC_BASE = 'https://webcore.utopiagroup.com.my';
const TIMEOUT_MS = 6000;

type Override = {
  path: string;
  language: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  is_pattern?: boolean;
};

// Throws on any failure so a timeout or an error is never cached as "no
// overrides" — the next request tries again and the page falls back meanwhile.
async function fetchOverrides(): Promise<Override[]> {
  const url =
    `${WEBCORE_PUBLIC_BASE}/api/public/seo?website=${encodeURIComponent(siteConfig.domain)}` +
    `&v=${Date.now()}`;
  const res = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`webcore seo ${res.status}`);
  const rows = (await res.json()) as Override[];
  if (!Array.isArray(rows)) throw new Error('webcore seo: unexpected body');
  return rows.filter((r) => !r.is_pattern);
}

const getOverrides = unstable_cache(fetchOverrides, ['webcore-seo-overrides'], {
  tags: ['webcore-seo'],
});

/**
 * Layer the webcore override for this page over the metadata the page built.
 * Only fields the override actually sets are replaced, and the Open Graph copy
 * follows so a shared link says the same thing as the search result.
 */
export async function withSeoOverride(locale: string, path: string, meta: Metadata): Promise<Metadata> {
  let rows: Override[];
  try {
    rows = await getOverrides();
  } catch (err) {
    console.error('[webcore] seo overrides unavailable:', err);
    return meta;
  }
  const key = localePath(locale, path);
  const o = rows.find((r) => r.path === key && r.language === locale);
  if (!o) return meta;

  const merged: Metadata = { ...meta };
  const og = { ...(meta.openGraph ?? {}) } as NonNullable<Metadata['openGraph']>;
  if (o.title) {
    merged.title = o.title;
    og.title = o.title;
  }
  if (o.description) {
    merged.description = o.description;
    og.description = o.description;
  }
  if (o.og_image) {
    og.images = [o.og_image];
    merged.twitter = { ...(meta.twitter ?? {}), images: [o.og_image] } as Metadata['twitter'];
  }
  if (meta.openGraph || o.og_image) merged.openGraph = og;
  return merged;
}
