#!/usr/bin/env tsx
/**
 * Utopia Wizard — connected-repo scanner (Phase B).
 *
 * For every active row in user_repos, clones the repo (shallow, with the
 * owner's decrypted GitHub token), runs the full checklist against the repo
 * root (one project per repo), and upserts a snapshot keyed by project_slug.
 * The deployed wizard then shows pass/fail for connected repos exactly like
 * monorepo projects.
 *
 * Runs where `git` exists (CI / local), NOT in a Vercel request.
 *
 * Usage:
 *   npm run scan-repos
 *   npm run scan-repos -- --dry         # don't write to Supabase
 *   npm run scan-repos -- --only=slug   # one project
 *
 * Env required (repo-root .env.local or CI secrets):
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *   SUPABASE_SERVICE_ROLE_KEY, WIZARD_TOKEN_KEY
 */

import { readFile, mkdtemp, rm, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { scorePct } from '../lib/score'

const exec = promisify(execFile)
const DRY = process.argv.includes('--dry')
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]

async function loadEnv(): Promise<void> {
  const candidates = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '..', '.env.local'),
  ]
  for (const file of candidates) {
    if (!existsSync(file)) continue
    const text = await readFile(file, 'utf-8')
    for (const raw of text.split('\n')) {
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let val = line.slice(eq + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = val
    }
    return
  }
}

// Lazy module handles — resolved after loadEnv() so they read env correctly.
type Mods = {
  runChecklist: typeof import('../lib/runChecklist').runChecklist
  getExpandedProjectInfo: typeof import('../lib/runChecklist').getExpandedProjectInfo
  getPhoneRows: typeof import('../lib/supabaseChecks').getPhoneRows
  getProductRows: typeof import('../lib/supabaseChecks').getProductRows
  getBlogRows: typeof import('../lib/supabaseChecks').getBlogRows
  getBlogContentRows: typeof import('../lib/supabaseChecks').getBlogContentRows
  getRegisteredDomains: typeof import('../lib/supabaseChecks').getRegisteredDomains
  findHardcodedPhones: typeof import('../lib/sourceScan').findHardcodedPhones
  findBlogHardcodedPhones: typeof import('../lib/sourceScan').findBlogHardcodedPhones
  checkLiveDbConnection: typeof import('../lib/liveStatusCheck').checkLiveDbConnection
  upsertSnapshot: typeof import('../lib/snapshotStore').upsertSnapshot
  deleteSnapshotsExcept: typeof import('../lib/snapshotStore').deleteSnapshotsExcept
  listAllActiveRepos: typeof import('../lib/wizardUsers').listAllActiveRepos
  getUserToken: typeof import('../lib/wizardUsers').getUserToken
}

async function loadModules(): Promise<Mods> {
  const rc = await import('../lib/runChecklist')
  const sc = await import('../lib/supabaseChecks')
  const ss = await import('../lib/sourceScan')
  const ls = await import('../lib/liveStatusCheck')
  const st = await import('../lib/snapshotStore')
  const wu = await import('../lib/wizardUsers')
  return {
    runChecklist: rc.runChecklist,
    getExpandedProjectInfo: rc.getExpandedProjectInfo,
    getPhoneRows: sc.getPhoneRows,
    getProductRows: sc.getProductRows,
    getBlogRows: sc.getBlogRows,
    getBlogContentRows: sc.getBlogContentRows,
    getRegisteredDomains: sc.getRegisteredDomains,
    findHardcodedPhones: ss.findHardcodedPhones,
    findBlogHardcodedPhones: ss.findBlogHardcodedPhones,
    checkLiveDbConnection: ls.checkLiveDbConnection,
    upsertSnapshot: st.upsertSnapshot,
    deleteSnapshotsExcept: st.deleteSnapshotsExcept,
    listAllActiveRepos: wu.listAllActiveRepos,
    getUserToken: wu.getUserToken,
  }
}

/** Same payload shape as scripts/scan.ts, but against an arbitrary parent dir. */
async function buildPayload(m: Mods, slug: string, parentDir: string) {
  let projectCreatedAt: string | null = null
  try {
    const s = await stat(path.join(parentDir, slug, 'inputs.md'))
    projectCreatedAt = s.mtime.toISOString()
  } catch { /* connected repos may not have inputs.md — that's fine */ }

  const checklist = await m.runChecklist(slug, parentDir, false)
  const info = await m.getExpandedProjectInfo(slug, parentDir)
  const [registered, phones, products, blogs, blogContent, hardcoded] = await Promise.all([
    m.getRegisteredDomains(info.domainCandidates),
    m.getPhoneRows(info.domainCandidates),
    m.getProductRows(info.domainCandidates),
    m.getBlogRows(info.domainCandidates),
    m.getBlogContentRows(info.domainCandidates),
    m.findHardcodedPhones(info.projectDir),
  ])
  const blogHardcoded = m.findBlogHardcodedPhones(blogContent)

  const candidateBaseUrls: string[] = []
  if (registered) for (const r of registered) candidateBaseUrls.push(`https://${r.domain}`)
  if (info.deployUrl) candidateBaseUrls.push(info.deployUrl)
  for (const d of info.domainCandidates) {
    const u = `https://${d}`
    if (!candidateBaseUrls.includes(u)) candidateBaseUrls.push(u)
  }
  const dbPhones = Array.from(new Set((phones ?? []).filter((p) => p.is_active).map((p) => p.phone_number)))
  const liveStatus = await m.checkLiveDbConnection({
    baseUrls: Array.from(new Set(candidateBaseUrls)),
    dbPhones,
    fallbackPhone: info.fallbackPhone,
  })
  const companyName = (registered ?? []).find((r) => r.companies?.name)?.companies?.name ?? null

  return {
    slug,
    total: checklist.total,
    passed: checklist.passed,
    failed_count: checklist.failedCount,
    domain: info.domain,
    product_slug: info.productSlug,
    fallback_phone: info.fallbackPhone,
    deploy_url: info.deployUrl,
    domain_candidates: info.domainCandidates,
    project_created_at: projectCreatedAt,
    company_name: companyName,
    groups: checklist.groups,
    registered: registered ?? null,
    phones: phones ?? null,
    products: products ?? null,
    blogs: blogs ?? null,
    hardcoded,
    blog_hardcoded: blogHardcoded,
    live_status: liveStatus,
  }
}

/** Shallow-clone a repo into <workdir>/<slug> using the owner's token. */
async function cloneRepo(fullName: string, branch: string, token: string, workdir: string, slug: string): Promise<string> {
  const dest = path.join(workdir, slug)
  // Token is embedded as the basic-auth password; x-access-token works for
  // PATs and installation tokens alike. Never logged.
  const url = `https://x-access-token:${token}@github.com/${fullName}.git`
  await exec('git', ['clone', '--depth', '1', '--branch', branch, '--single-branch', url, dest], {
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
  })
  return dest
}

async function main(): Promise<void> {
  await loadEnv()
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('scan-repos: SUPABASE_SERVICE_ROLE_KEY required'); process.exit(2)
  }
  const m = await loadModules()

  let repos = await m.listAllActiveRepos()
  if (ONLY) repos = repos.filter((r) => r.project_slug === ONLY)
  if (repos.length === 0) {
    console.log('scan-repos: no connected repos to scan' + (ONLY ? ` (filter: ${ONLY})` : ''))
    return
  }
  console.log(`scan-repos: ${repos.length} connected repo(s)${DRY ? '  (dry run)' : ''}`)

  const tokenCache = new Map<string, string | null>()
  const workRoot = await mkdtemp(path.join(tmpdir(), 'utopia-scan-'))
  let ok = 0, fail = 0

  try {
    for (const repo of repos) {
      const t0 = Date.now()
      const label = `${repo.repo_full_name} → ${repo.project_slug}`
      try {
        if (!tokenCache.has(repo.github_login)) {
          tokenCache.set(repo.github_login, await m.getUserToken(repo.github_login))
        }
        const token = tokenCache.get(repo.github_login)
        if (!token) { throw new Error(`no stored token for @${repo.github_login}`) }

        await cloneRepo(repo.repo_full_name, repo.default_branch || 'main', token, workRoot, repo.project_slug)
        const payload = await buildPayload(m, repo.project_slug, workRoot)
        const elapsed = Date.now() - t0
        console.log(`  ✓ ${label.padEnd(48)} ${String(scorePct(payload.passed, payload.failed_count)).padStart(3)}/100 · ${elapsed}ms`)
        if (!DRY) await m.upsertSnapshot(payload)
        ok++
      } catch (err) {
        fail++
        console.error(`  ✗ ${label} — ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        await rm(path.join(workRoot, repo.project_slug), { recursive: true, force: true }).catch(() => {})
      }
    }
  } finally {
    await rm(workRoot, { recursive: true, force: true }).catch(() => {})
  }

  // Prune snapshots for repos that are no longer connected (e.g. disconnected,
  // or stale rows from the retired monorepo scanner). The dashboard then only
  // ever reflects currently-connected repos. Skip on dry/--only runs.
  if (!DRY && !ONLY) {
    try {
      const keep = repos.map((r) => r.project_slug)
      const pruned = await m.deleteSnapshotsExcept(keep)
      if (pruned > 0) console.log(`scan-repos: pruned ${pruned} stale snapshot(s)`)
    } catch (err) {
      console.warn('scan-repos: prune failed —', err instanceof Error ? err.message : err)
    }
  }

  console.log(`scan-repos: done · ${ok} ok · ${fail} failed${DRY ? ' (dry run)' : ''}`)
  if (fail > 0) process.exit(1)
}

main().catch((e) => {
  console.error('scan-repos: crashed —', e instanceof Error ? e.stack ?? e.message : e)
  process.exit(2)
})
