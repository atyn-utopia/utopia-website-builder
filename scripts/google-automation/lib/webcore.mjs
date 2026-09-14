// Thin client for the webcore public API.
//
// Reads are CORS-open and need no key. Writes need `X-API-Key` with the right
// scope — the key is read from the environment at call time and is NEVER
// written to disk, logged, or embedded here.
//
//   export WEBCORE_API_KEY=uwc_...
//
// Docs: https://webcore.utopiagroup.com.my — "Webcore Token API" reference.

const BASE = process.env.WEBCORE_BASE_URL ?? 'https://webcore.utopiagroup.com.my';

/** webcore stores keywords per language, and only understands `en` / `ms`. */
export const WEBCORE_LANGUAGES = new Set(['en', 'ms']);

/**
 * Map our Ads-API language codes onto what webcore accepts.
 * Returns null for languages webcore cannot store (e.g. zh) so callers can
 * skip them loudly instead of silently mislabelling them.
 */
export function toWebcoreLanguage(code) {
  const c = String(code || '').toLowerCase();
  if (c.startsWith('ms') || c === 'malay') return 'ms';
  if (c.startsWith('en')) return 'en';
  return null;
}

async function request(path, { method = 'GET', body, apiKey } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (apiKey) headers['X-API-Key'] = apiKey;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }

  if (!res.ok) {
    const detail = json?.error ?? json?.raw ?? res.statusText;
    const hint = res.status === 401 ? ' (token missing/revoked — check WEBCORE_API_KEY)'
      : res.status === 403 ? ' (scope missing, or this domain is outside the token\'s site list)'
      : '';
    throw new Error(`webcore ${method} ${path} → ${res.status}: ${detail}${hint}`);
  }
  return json;
}

/**
 * The site's keyword research + webcore's last crawl of the live pages.
 *
 * Head terms are stored per language: `primary_keywords` answers for the
 * `language` asked for (English when none is given), falling back to the
 * site's older unlabelled list where that language has none of its own.
 * `heads` carries both languages, each with an `inherited` flag marking a
 * language still reading that older list.
 *
 * @returns {{ primary_keywords: string[], secondary_keywords: string[],
 *             heads: Record<'en'|'ms', {primary_keywords: string[], secondary_keywords: string[], inherited: boolean}>,
 *             keywords: Array, pages: Array, updated_at: string|null }}
 */
export function getKeywords(website, { language, path } = {}) {
  const qs = new URLSearchParams({ website });
  if (language) qs.set('language', language);
  if (path) qs.set('path', path);
  return request(`/api/public/keywords?${qs}`);
}

/**
 * Upsert keyword rows. Keyed on (website, search_word, language), so
 * re-pushing refreshed volumes updates rows instead of duplicating them.
 *
 * NOTE (verified 2026-08-06): webcore IGNORES the `source` field on write and
 * stores everything as `manual`. Pushed rows are therefore indistinguishable
 * from hand-entered ones in the store. Also, the public GET is CDN-cached for
 * 300s, so verifying a write needs a cache-busting query param.
 *
 * Head terms belong to one language. Pass `language` whenever the push carries
 * `primary_keywords` or `secondary_keywords`: webcore keeps a list per language
 * now, and a heads push it cannot attribute to one is refused with a 400
 * rather than filed under a guess. (It will read the language off the pushed
 * rows when they are all one language, but saying it outright is what makes a
 * rows-less push legal.)
 *
 * @param {object} opts
 * @param {Array<{search_word,language,volume,source}>} opts.rows
 * @param {'en'|'ms'} [opts.language] — whose head terms these are
 * @param {string[]} [opts.primary_keywords]
 * @param {string[]} [opts.secondary_keywords]
 * @param {'merge'|'replace'} [opts.mode] — 'replace' clears existing rows first
 */
export function pushKeywords(website, { rows, language, primary_keywords, secondary_keywords, mode }, apiKey) {
  if (!apiKey) throw new Error('WEBCORE_API_KEY is not set — refusing to attempt a write.');
  const body = { website };
  if (rows?.length) body.rows = rows;
  if (language) body.language = language;
  if (primary_keywords?.length) body.primary_keywords = primary_keywords;
  if (secondary_keywords?.length) body.secondary_keywords = secondary_keywords;
  if (mode) body.mode = mode;
  return request('/api/public/keywords', { method: 'POST', body, apiKey });
}

export function getApiKey() {
  return process.env.WEBCORE_API_KEY || null;
}
// ─── Ads readiness ────────────────────────────────────────────────
//
// Three Google settings gate a site running ads. Two are re-verified live by
// webcore on every read; the third has no API that exposes it, so a human
// confirms it once. Ticking an auto-verified item PINS it, so the live
// re-check stops overriding the answer.
//
//   google_signals       GA4 → Google Signals ON          (auto-verified)
//   conversion_counting  Ads → conversion Count = One     (auto-verified)
//   ga4_metrics_import   Ads → Data manager → GA4 import  (manual only)

/** The canonical item ids, in the order the Google UI presents them. */
export const ADS_READINESS_ITEMS = [
  'google_signals',
  'conversion_counting',
  'ga4_metrics_import',
];

/**
 * Current readiness, with both automatic checks re-run live against Google.
 * Needs `read`/`ads:write` scope — unlike the other `/api/public/*` reads.
 * @returns {{ readiness: object, ready: boolean, adsLink: object,
 *             signalsProbe: object, countingProbe: object }}
 */
export function getAdsReadiness(website, apiKey) {
  if (!apiKey) throw new Error('WEBCORE_API_KEY is not set — the readiness endpoint needs it.');
  return request(`/api/ads-readiness?website=${encodeURIComponent(website)}`, { apiKey });
}

/**
 * Confirm (or un-confirm) one readiness item.
 *
 * ⚠️ Completing the LAST item notifies the performance marketers, once. Send
 * `done: true` because the step is really done — never to tidy the card.
 */
export function tickAdsReadiness(website, item, done, apiKey) {
  if (!apiKey) throw new Error('WEBCORE_API_KEY is not set — refusing to attempt a write.');
  if (!ADS_READINESS_ITEMS.includes(item)) {
    throw new Error(`unknown readiness item "${item}" — expected one of ${ADS_READINESS_ITEMS.join(', ')}`);
  }
  return request('/api/ads-readiness', {
    method: 'PATCH', apiKey, body: { website, item, done },
  });
}

/**
 * Pin the Ads customer id when it cannot be resolved from the site's `AW-` tag
 * (or when conversions live on a manager account), so the counting check stops
 * guessing.
 */
export function pinAdsCustomerId(website, customerId, apiKey) {
  if (!apiKey) throw new Error('WEBCORE_API_KEY is not set — refusing to attempt a write.');
  return request('/api/ads-readiness', {
    method: 'PUT', apiKey, body: { website, customerId },
  });
}

/**
 * What webcore actually sees for this site's Google setup — GA4, GTM, Ads and
 * the readiness block. Every field is verified live on the call (Google API
 * round trips included), so call it once after a setup run, never as a poll.
 */
export function getIntegrations(website, apiKey) {
  return request(`/api/public/integrations?website=${encodeURIComponent(website)}`, { apiKey });
}
