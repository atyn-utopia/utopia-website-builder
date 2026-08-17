// Thin client for the webcore public API.
//
// Reads are CORS-open and need no key. Writes need `X-API-Key` with the right
// scope — the key is read from the environment at call time and is NEVER
// written to disk, logged, or embedded here.
//
//   export WEBCORE_API_KEY=uwc_...
//
// Docs: https://webcore.utopiaai.my — "Webcore Token API" reference.

const BASE = process.env.WEBCORE_BASE_URL ?? 'https://webcore.utopiaai.my';

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
 * @returns {{ primary_keywords: string[], secondary_keywords: string[],
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
 * @param {object} opts
 * @param {Array<{search_word,language,volume,source}>} opts.rows
 * @param {string[]} [opts.primary_keywords]
 * @param {string[]} [opts.secondary_keywords]
 * @param {'merge'|'replace'} [opts.mode] — 'replace' clears existing rows first
 */
export function pushKeywords(website, { rows, primary_keywords, secondary_keywords, mode }, apiKey) {
  if (!apiKey) throw new Error('WEBCORE_API_KEY is not set — refusing to attempt a write.');
  const body = { website };
  if (rows?.length) body.rows = rows;
  if (primary_keywords?.length) body.primary_keywords = primary_keywords;
  if (secondary_keywords?.length) body.secondary_keywords = secondary_keywords;
  if (mode) body.mode = mode;
  return request('/api/public/keywords', { method: 'POST', body, apiKey });
}

export function getApiKey() {
  return process.env.WEBCORE_API_KEY || null;
}
