/**
 * Storage adapter for wizard_users + project_owners (webcore schema).
 *
 * Mirrors snapshotStore.ts conventions:
 *   - reads use the anon key (project_owners is anon-readable so the deployed
 *     monitor can scope the list)
 *   - writes use the service-role key (owner reassignment, user upserts)
 *   - wizard_users rows hold encrypted GitHub tokens, so they are NEVER read
 *     with the anon key — only the service-role helpers touch that table.
 *
 * All functions degrade gracefully: if Supabase isn't configured they return
 * empty/no-op so the wizard still runs in single-user (passcode) mode.
 */

import { decryptToken } from './cryptoToken'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA ?? 'webcore'

const REST = `${SUPABASE_URL}/rest/v1`

export const usersConfigured = !!(SUPABASE_URL && ANON_KEY)
const writeConfigured = !!(SUPABASE_URL && SERVICE_ROLE_KEY)

function readHeaders(): Record<string, string> {
  return {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
    'Accept-Profile': DB_SCHEMA,
  }
}

function writeHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Profile': DB_SCHEMA,
    'Content-Type': 'application/json',
    ...extra,
  }
}

// ── project_owners ──────────────────────────────────────────────────────────

export interface ProjectOwner {
  slug: string
  github_login: string
  assigned_by: string | null
}

/**
 * Map of slug → github_login for every owned project. Slugs absent from the
 * map are unowned (legacy backlog) — callers decide how to treat those.
 */
export async function getProjectOwners(): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (!usersConfigured) return map
  try {
    const res = await fetch(`${REST}/project_owners?select=slug,github_login`, {
      headers: readHeaders(),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return map
    const rows = (await res.json()) as ProjectOwner[]
    for (const r of rows) if (r.slug) map.set(r.slug, r.github_login)
    return map
  } catch {
    return map
  }
}

/**
 * Upsert the owner of a slug. Used on project creation (assigned_by = creator)
 * and on admin reassignment. No-op if service role isn't configured.
 */
export async function setProjectOwner(
  slug: string,
  githubLogin: string,
  assignedBy: string,
): Promise<boolean> {
  if (!writeConfigured) return false
  try {
    const res = await fetch(`${REST}/project_owners?on_conflict=slug`, {
      method: 'POST',
      headers: writeHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({
        slug,
        github_login: githubLogin,
        assigned_by: assignedBy,
        updated_at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

// ── wizard_users (service-role only) ────────────────────────────────────────

export interface WizardUser {
  github_login: string
  name: string | null
  avatar_url: string | null
  is_admin: boolean
}

/** Set of admin logins (is_admin = true). Used to grant "see all" by default. */
export async function getAdminLogins(): Promise<Set<string>> {
  const set = new Set<string>()
  if (!writeConfigured) return set
  try {
    const res = await fetch(
      `${REST}/wizard_users?select=github_login&is_admin=eq.true`,
      { headers: { ...readHeaders(), apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` }, cache: 'no-store', signal: AbortSignal.timeout(5000) },
    )
    if (!res.ok) return set
    const rows = (await res.json()) as { github_login: string }[]
    for (const r of rows) set.add(r.github_login)
    return set
  } catch {
    return set
  }
}

/**
 * Decrypt + return a user's stored GitHub token (service-role read). Returns
 * null if no token stored or decryption fails. Never expose this over the wire.
 */
export async function getUserToken(githubLogin: string): Promise<string | null> {
  if (!writeConfigured) return null
  try {
    const res = await fetch(
      `${REST}/wizard_users?select=github_token_encrypted&github_login=eq.${encodeURIComponent(githubLogin)}&limit=1`,
      {
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Accept-Profile': DB_SCHEMA },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      },
    )
    if (!res.ok) return null
    const rows = (await res.json()) as { github_token_encrypted: string | null }[]
    return decryptToken(rows[0]?.github_token_encrypted ?? null)
  } catch {
    return null
  }
}

// ── user_repos ──────────────────────────────────────────────────────────────

export interface UserRepo {
  id: string
  github_login: string
  repo_full_name: string
  repo_id: number | null
  default_branch: string
  project_slug: string
  html_url: string | null
  is_active: boolean
  connected_at: string
}

/** Every active connected repo across all users (for the scanner). */
export async function listAllActiveRepos(): Promise<UserRepo[]> {
  if (!writeConfigured) return []
  try {
    const res = await fetch(
      `${REST}/user_repos?select=*&is_active=eq.true&order=connected_at.desc`,
      {
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Accept-Profile': DB_SCHEMA },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      },
    )
    if (!res.ok) return []
    return (await res.json()) as UserRepo[]
  } catch {
    return []
  }
}

/** List the repos a user has connected (most recent first). */
export async function listUserRepos(githubLogin: string): Promise<UserRepo[]> {
  if (!writeConfigured) return []
  try {
    const res = await fetch(
      `${REST}/user_repos?select=*&github_login=eq.${encodeURIComponent(githubLogin)}&order=connected_at.desc`,
      {
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Accept-Profile': DB_SCHEMA },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      },
    )
    if (!res.ok) return []
    return (await res.json()) as UserRepo[]
  } catch {
    return []
  }
}

/** Connect (upsert) a repo for a user. */
export async function connectUserRepo(params: {
  githubLogin: string
  repoFullName: string
  repoId?: number | null
  defaultBranch?: string
  projectSlug: string
  htmlUrl?: string | null
}): Promise<boolean> {
  if (!writeConfigured) return false
  try {
    const res = await fetch(`${REST}/user_repos?on_conflict=github_login,repo_full_name`, {
      method: 'POST',
      headers: writeHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({
        github_login: params.githubLogin,
        repo_full_name: params.repoFullName,
        repo_id: params.repoId ?? null,
        default_branch: params.defaultBranch ?? 'main',
        project_slug: params.projectSlug,
        html_url: params.htmlUrl ?? null,
        is_active: true,
      }),
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Disconnect a repo (hard delete) for a user. */
export async function disconnectUserRepo(githubLogin: string, repoFullName: string): Promise<boolean> {
  if (!writeConfigured) return false
  try {
    const res = await fetch(
      `${REST}/user_repos?github_login=eq.${encodeURIComponent(githubLogin)}&repo_full_name=eq.${encodeURIComponent(repoFullName)}`,
      {
        method: 'DELETE',
        headers: writeHeaders({ Prefer: 'return=minimal' }),
        signal: AbortSignal.timeout(5000),
      },
    )
    return res.ok
  } catch {
    return false
  }
}

/**
 * Upsert a user on sign-in. `tokenCiphertext` is the AES-GCM blob from
 * lib/cryptoToken.ts (step 5 / OAuth). Pass undefined to leave the stored
 * token untouched (e.g. metadata-only refresh).
 */
export async function upsertWizardUser(params: {
  githubLogin: string
  name?: string | null
  avatarUrl?: string | null
  tokenCiphertext?: string
}): Promise<boolean> {
  if (!writeConfigured) return false
  const body: Record<string, unknown> = {
    github_login: params.githubLogin,
    name: params.name ?? null,
    avatar_url: params.avatarUrl ?? null,
    last_login_at: new Date().toISOString(),
  }
  if (params.tokenCiphertext !== undefined) {
    body.github_token_encrypted = params.tokenCiphertext
  }
  try {
    const res = await fetch(`${REST}/wizard_users?on_conflict=github_login`, {
      method: 'POST',
      headers: writeHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}
