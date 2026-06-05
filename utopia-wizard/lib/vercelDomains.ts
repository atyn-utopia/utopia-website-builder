/**
 * vercelDomains.ts — Ask Vercel (the external source of truth) what domains a
 * project actually serves, so the wizard can detect a domain changed in Vercel
 * that the repo doesn't know about.
 *
 * Token resolution (first hit wins):
 *   1. process.env.VERCEL_TOKEN          — CI / explicit
 *   2. local Vercel CLI auth.json        — dev convenience (mac + linux paths)
 * No token → returns { token: null } and the caller SKIPS (never fails on auth).
 *
 * Project is looked up by NAME (= project slug) because .vercel/project.json is
 * gitignored and absent in CI. teamId comes from project.json when present, else
 * process.env.VERCEL_TEAM_ID, else omitted (token's default team).
 */
import { readFile } from 'fs/promises'
import { homedir } from 'os'
import path from 'path'

export interface VercelDomainsResult {
  ok: boolean
  /** verified, non-redirect, production (gitBranch=null) domain names */
  productionDomains: string[]
  /** every domain name the project has, for diagnostics */
  allDomains: string[]
  error?: string
  skipped?: string
}

let cachedToken: string | null | undefined

async function resolveToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken
  if (process.env.VERCEL_TOKEN) return (cachedToken = process.env.VERCEL_TOKEN)
  const candidates = [
    path.join(homedir(), 'Library', 'Application Support', 'com.vercel.cli', 'auth.json'),
    path.join(homedir(), '.local', 'share', 'com.vercel.cli', 'auth.json'),
    path.join(homedir(), '.config', 'com.vercel.cli', 'auth.json'),
  ]
  for (const f of candidates) {
    try {
      const j = JSON.parse(await readFile(f, 'utf-8'))
      if (j?.token) return (cachedToken = j.token as string)
    } catch { /* not here */ }
  }
  return (cachedToken = null)
}

export function hasVercelToken(): Promise<boolean> {
  return resolveToken().then((t) => !!t)
}

/**
 * @param projectNameOrId  project slug (preferred) or prj_… id
 * @param teamId           team_… (optional)
 */
export async function getProjectDomains(
  projectNameOrId: string,
  teamId?: string | null,
): Promise<VercelDomainsResult> {
  const token = await resolveToken()
  if (!token) return { ok: false, productionDomains: [], allDomains: [], skipped: 'no VERCEL_TOKEN (and no local CLI auth)' }

  const qs = teamId ? `?teamId=${encodeURIComponent(teamId)}` : ''
  const url = `https://api.vercel.com/v9/projects/${encodeURIComponent(projectNameOrId)}/domains${qs}`
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15_000) })
    if (res.status === 404) return { ok: false, productionDomains: [], allDomains: [], error: `Vercel project "${projectNameOrId}" not found (404)` }
    if (!res.ok) return { ok: false, productionDomains: [], allDomains: [], error: `Vercel API HTTP ${res.status}` }
    const data = await res.json() as { domains?: Array<{ name: string; verified?: boolean; redirect?: string | null; gitBranch?: string | null }> }
    const domains = data.domains ?? []
    const norm = (h: string) => h.toLowerCase().replace(/^www\./, '')
    const allDomains = domains.map((d) => norm(d.name))
    const productionDomains = domains
      .filter((d) => d.verified && !d.redirect && !d.gitBranch)
      .map((d) => norm(d.name))
    return { ok: true, productionDomains, allDomains }
  } catch (e: any) {
    return { ok: false, productionDomains: [], allDomains: [], error: e?.name === 'TimeoutError' ? 'Vercel API timeout' : `Vercel API error: ${e?.message ?? e}` }
  }
}
