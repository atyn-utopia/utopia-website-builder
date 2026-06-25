/**
 * Storage + GitHub fetch for per-user playbooks (webcore.user_playbooks).
 *
 * Reads use the service-role key (team-visible list is gated in-app). The
 * markdown is fetched from a teammate's repo with THEIR token (getUserToken),
 * so private repos work.
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA ?? 'webcore'
const REST = `${SUPABASE_URL}/rest/v1`

const writeConfigured = !!(SUPABASE_URL && SERVICE_ROLE_KEY)

function svcHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Accept-Profile': DB_SCHEMA,
    'Content-Profile': DB_SCHEMA,
    ...extra,
  }
}

export interface PlaybookRow {
  github_login: string
  repo_full_name: string
  source_path: string
  title: string | null
  content: string | null
  structure: unknown | null
  generated_at: string
}

/** Candidate markdown files to auto-detect, in priority order. */
export const PLAYBOOK_FILE_CANDIDATES = [
  'CLAUDE.md',
  'claude.md',
  'docs/full-website-setup.md',
  'README.md',
  'readme.md',
]

/**
 * Fetch the first existing candidate file from a repo via the GitHub contents
 * API using the given token. Returns { path, content } or null.
 */
export async function fetchRepoMarkdown(
  token: string,
  repoFullName: string,
  candidates: string[] = PLAYBOOK_FILE_CANDIDATES,
): Promise<{ path: string; content: string } | null> {
  for (const path of candidates) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repoFullName}/contents/${encodeURIComponent(path)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'utopia-wizard',
          },
          cache: 'no-store',
          signal: AbortSignal.timeout(10000),
        },
      )
      if (!res.ok) continue
      const json = (await res.json()) as { content?: string; encoding?: string }
      if (!json.content) continue
      const content =
        json.encoding === 'base64'
          ? Buffer.from(json.content, 'base64').toString('utf-8')
          : json.content
      return { path, content }
    } catch {
      /* try next candidate */
    }
  }
  return null
}

/** First markdown H1 (`# Title`) or null. */
export function extractTitle(md: string): string | null {
  for (const line of md.split('\n')) {
    const m = line.match(/^#\s+(.+?)\s*$/)
    if (m) return m[1].trim()
  }
  return null
}

export async function upsertPlaybook(row: Omit<PlaybookRow, 'generated_at'>): Promise<boolean> {
  if (!writeConfigured) return false
  try {
    const res = await fetch(`${REST}/user_playbooks?on_conflict=github_login`, {
      method: 'POST',
      headers: svcHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ ...row, generated_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch {
    return false
  }
}

/** All playbooks (metadata only — no content) for the team-visible list. */
export async function listPlaybooks(): Promise<Omit<PlaybookRow, 'content' | 'structure'>[]> {
  if (!writeConfigured) return []
  try {
    const res = await fetch(
      `${REST}/user_playbooks?select=github_login,repo_full_name,source_path,title,generated_at&order=generated_at.desc`,
      { headers: svcHeaders(), cache: 'no-store', signal: AbortSignal.timeout(6000) },
    )
    if (!res.ok) return []
    return (await res.json()) as Omit<PlaybookRow, 'content' | 'structure'>[]
  } catch {
    return []
  }
}

export async function deletePlaybook(login: string): Promise<boolean> {
  if (!writeConfigured) return false
  try {
    const res = await fetch(`${REST}/user_playbooks?github_login=eq.${encodeURIComponent(login)}`, {
      method: 'DELETE',
      headers: svcHeaders({ Prefer: 'return=minimal' }),
      signal: AbortSignal.timeout(6000),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function getPlaybook(login: string): Promise<PlaybookRow | null> {
  if (!writeConfigured) return null
  try {
    const res = await fetch(
      `${REST}/user_playbooks?select=*&github_login=eq.${encodeURIComponent(login)}&limit=1`,
      { headers: svcHeaders(), cache: 'no-store', signal: AbortSignal.timeout(6000) },
    )
    if (!res.ok) return null
    const rows = (await res.json()) as PlaybookRow[]
    return rows[0] ?? null
  } catch {
    return null
  }
}
