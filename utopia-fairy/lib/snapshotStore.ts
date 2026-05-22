/**
 * Storage adapter for monitor_snapshots. Reads use the anon key (so the
 * deployed monitor only needs NEXT_PUBLIC_SUPABASE_*). Writes use the service
 * role key and are intended to run only from the CLI scanner.
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export interface SnapshotRow {
  slug: string
  ran_at: string
  total: number
  passed: number
  failed_count: number
  domain: string | null
  product_slug: string | null
  fallback_phone: string | null
  deploy_url: string | null
  domain_candidates: string[]
  groups: unknown
  registered: unknown
  phones: unknown
  products: unknown
  blogs: unknown
  hardcoded: unknown
  blog_hardcoded: unknown
  live_status: unknown
  /** Added in 20260522_project_metadata. Older rows will return null. */
  project_created_at?: string | null
  company_name?: string | null
}

function ensureRead() {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error('snapshotStore: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set')
  }
}

function ensureWrite() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('snapshotStore: SUPABASE_SERVICE_ROLE_KEY not set — required for writing snapshots')
  }
}

export async function readAllSnapshots(): Promise<SnapshotRow[]> {
  ensureRead()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/monitor_snapshots?select=*&order=ran_at.desc`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`readAllSnapshots: HTTP ${res.status}`)
  return res.json()
}

export async function readSnapshot(slug: string): Promise<SnapshotRow | null> {
  ensureRead()
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/monitor_snapshots?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      cache: 'no-store',
    },
  )
  if (!res.ok) throw new Error(`readSnapshot: HTTP ${res.status}`)
  const rows = (await res.json()) as SnapshotRow[]
  return rows[0] ?? null
}

export async function upsertSnapshot(row: Omit<SnapshotRow, 'ran_at'> & { ran_at?: string }): Promise<void> {
  ensureWrite()
  const body = { ...row, ran_at: row.ran_at ?? new Date().toISOString() }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/monitor_snapshots?on_conflict=slug`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`upsertSnapshot ${row.slug}: HTTP ${res.status} ${text.slice(0, 200)}`)
  }
}

export async function deleteSnapshot(slug: string): Promise<boolean> {
  ensureWrite()
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/monitor_snapshots?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: 'return=representation',
      },
    },
  )
  if (!res.ok) throw new Error(`deleteSnapshot ${slug}: HTTP ${res.status}`)
  const removed = (await res.json()) as unknown[]
  return removed.length > 0
}

export async function deleteSnapshotsExcept(keepSlugs: string[]): Promise<number> {
  ensureWrite()
  // Build a NOT-IN filter so we prune rows for projects that no longer exist.
  const list = keepSlugs.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(',')
  const url = keepSlugs.length === 0
    ? `${SUPABASE_URL}/rest/v1/monitor_snapshots`
    : `${SUPABASE_URL}/rest/v1/monitor_snapshots?slug=not.in.(${list})`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
    },
  })
  if (!res.ok) throw new Error(`deleteSnapshotsExcept: HTTP ${res.status}`)
  const removed = (await res.json()) as unknown[]
  return removed.length
}
