export type LiveStatus = 'connected' | 'fallback' | 'unexpected' | 'no-target' | 'no-response'

export interface LiveDbStatus {
  status: LiveStatus
  targetUrl: string | null
  livePhone: string | null
  dbPhones: string[]
  fallbackPhone: string | null
  detail: string
}

interface Args {
  baseUrls: string[]      // URLs to try (e.g. https://example.com), in priority order
  dbPhones: string[]      // phones the DB says we should be using
  fallbackPhone: string | null
}

const cache = new Map<string, { ts: number; value: LiveDbStatus }>()
const TTL = 60_000

function cacheKey({ baseUrls, dbPhones, fallbackPhone }: Args): string {
  return JSON.stringify({ baseUrls, dbPhones, fallbackPhone })
}

async function probe(baseUrl: string): Promise<string | null> {
  const url = `${baseUrl.replace(/\/$/, '')}/en/redirect-whatsapp-1`
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(7000),
      redirect: 'follow',
      cache: 'no-store',
    })
    if (!res.ok) return null
    const html = await res.text()
    const m = html.match(/wa\.me\/(\d+)/)
    return m ? m[1] : null
  } catch {
    return null
  }
}

export async function checkLiveDbConnection(args: Args): Promise<LiveDbStatus> {
  const key = cacheKey(args)
  const cached = cache.get(key)
  if (cached && Date.now() - cached.ts < TTL) return cached.value

  const { baseUrls, dbPhones, fallbackPhone } = args
  if (baseUrls.length === 0) {
    const value: LiveDbStatus = {
      status: 'no-target',
      targetUrl: null,
      livePhone: null,
      dbPhones,
      fallbackPhone,
      detail: 'no deploy URL — site not deployed yet',
    }
    cache.set(key, { ts: Date.now(), value })
    return value
  }

  for (const baseUrl of baseUrls) {
    const live = await probe(baseUrl)
    if (!live) continue

    const target = `${baseUrl.replace(/\/$/, '')}/en/redirect-whatsapp-1`
    let value: LiveDbStatus
    if (dbPhones.includes(live)) {
      value = {
        status: 'connected',
        targetUrl: target,
        livePhone: live,
        dbPhones,
        fallbackPhone,
        detail: `live site is serving the DB phone ${live}`,
      }
    } else if (fallbackPhone && live === fallbackPhone) {
      value = {
        status: 'fallback',
        targetUrl: target,
        livePhone: live,
        dbPhones,
        fallbackPhone,
        detail: dbPhones.length === 0
          ? `live site is using the config/site.ts fallback ${live} (no DB phone seeded)`
          : `live site is using the config/site.ts fallback ${live} instead of DB phone ${dbPhones.join(', ')} — deployment cannot read from Supabase (env vars missing or cache stale)`,
      }
    } else {
      value = {
        status: 'unexpected',
        targetUrl: target,
        livePhone: live,
        dbPhones,
        fallbackPhone,
        detail: `live site is serving ${live}, which matches neither the DB phones (${dbPhones.join(', ') || '—'}) nor the fallback (${fallbackPhone ?? '—'})`,
      }
    }
    cache.set(key, { ts: Date.now(), value })
    return value
  }

  const value: LiveDbStatus = {
    status: 'no-response',
    targetUrl: `${baseUrls[0].replace(/\/$/, '')}/en/redirect-whatsapp-1`,
    livePhone: null,
    dbPhones,
    fallbackPhone,
    detail: `no candidate URL returned a parseable wa.me link (tried ${baseUrls.length})`,
  }
  cache.set(key, { ts: Date.now(), value })
  return value
}
