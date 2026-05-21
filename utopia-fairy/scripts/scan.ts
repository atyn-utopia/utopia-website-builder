#!/usr/bin/env tsx
/**
 * Utopia Fairy snapshot scanner.
 *
 * Walks projects/*, runs every check + DB lookup, and upserts the result into
 * monitor_snapshots. The deployed monitor reads from that table; this script
 * is the only path that writes to it.
 *
 * Usage:
 *   npm run scan            # from utopia-fairy/
 *   npm run scan -- --dry   # don't write to Supabase, print payload
 *
 * Env required (load from repo-root .env.local; CI provides via secrets):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readdir, stat, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

// Load .env.local from the repo root before importing anything that reads env.
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

const DRY = process.argv.includes('--dry')
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]

// Imports must happen after env load — modules read env at module-load time.
// We resolve them lazily inside main() so loadEnv() runs first.
let runChecklist!: typeof import('../lib/runChecklist').runChecklist
let getExpandedProjectInfo!: typeof import('../lib/runChecklist').getExpandedProjectInfo
let getPhoneRows!: typeof import('../lib/supabaseChecks').getPhoneRows
let getProductRows!: typeof import('../lib/supabaseChecks').getProductRows
let getBlogRows!: typeof import('../lib/supabaseChecks').getBlogRows
let getBlogContentRows!: typeof import('../lib/supabaseChecks').getBlogContentRows
let getRegisteredDomains!: typeof import('../lib/supabaseChecks').getRegisteredDomains
let findHardcodedPhones!: typeof import('../lib/sourceScan').findHardcodedPhones
let findBlogHardcodedPhones!: typeof import('../lib/sourceScan').findBlogHardcodedPhones
let checkLiveDbConnection!: typeof import('../lib/liveStatusCheck').checkLiveDbConnection
let upsertSnapshot!: typeof import('../lib/snapshotStore').upsertSnapshot
let deleteSnapshotsExcept!: typeof import('../lib/snapshotStore').deleteSnapshotsExcept

async function loadModules(): Promise<void> {
  const rc = await import('../lib/runChecklist')
  runChecklist = rc.runChecklist
  getExpandedProjectInfo = rc.getExpandedProjectInfo
  const sc = await import('../lib/supabaseChecks')
  getPhoneRows = sc.getPhoneRows
  getProductRows = sc.getProductRows
  getBlogRows = sc.getBlogRows
  getBlogContentRows = sc.getBlogContentRows
  getRegisteredDomains = sc.getRegisteredDomains
  const ss = await import('../lib/sourceScan')
  findHardcodedPhones = ss.findHardcodedPhones
  findBlogHardcodedPhones = ss.findBlogHardcodedPhones
  const ls = await import('../lib/liveStatusCheck')
  checkLiveDbConnection = ls.checkLiveDbConnection
  const st = await import('../lib/snapshotStore')
  upsertSnapshot = st.upsertSnapshot
  deleteSnapshotsExcept = st.deleteSnapshotsExcept
}

async function listProjectSlugs(projectsDir: string): Promise<string[]> {
  const entries = await readdir(projectsDir)
  const slugs: string[] = []
  for (const slug of entries) {
    try {
      await stat(path.join(projectsDir, slug, 'inputs.md'))
      slugs.push(slug)
    } catch { /* not a project folder */ }
  }
  return slugs
}

async function buildPayloadForSlug(slug: string, projectsDir: string) {
  // 1. Run the full checklist (uses cache internally — fine for one-shot run)
  const checklist = await runChecklist(slug, projectsDir, /* useCache */ false)

  // 2. Gather wish-data (same shape the /api/wish-data endpoint produces)
  const info = await getExpandedProjectInfo(slug, projectsDir)
  const [registered, phones, products, blogs, blogContent, hardcoded] = await Promise.all([
    getRegisteredDomains(info.domainCandidates),
    getPhoneRows(info.domainCandidates),
    getProductRows(info.domainCandidates),
    getBlogRows(info.domainCandidates),
    getBlogContentRows(info.domainCandidates),
    findHardcodedPhones(info.projectDir),
  ])
  const blogHardcoded = findBlogHardcodedPhones(blogContent)

  const candidateBaseUrls: string[] = []
  if (registered) for (const r of registered) candidateBaseUrls.push(`https://${r.domain}`)
  if (info.deployUrl) candidateBaseUrls.push(info.deployUrl)
  for (const d of info.domainCandidates) {
    const u = `https://${d}`
    if (!candidateBaseUrls.includes(u)) candidateBaseUrls.push(u)
  }
  const dbPhones = Array.from(new Set((phones ?? []).filter((p) => p.is_active).map((p) => p.phone_number)))
  const liveStatus = await checkLiveDbConnection({
    baseUrls: Array.from(new Set(candidateBaseUrls)),
    dbPhones,
    fallbackPhone: info.fallbackPhone,
  })

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

async function main(): Promise<void> {
  await loadEnv()
  await loadModules()

  // Resolve projects/ relative to wherever the script runs from.
  // Local: utopia-fairy/ → ../projects.   CI: repo root → ./projects.
  const candidates = [
    path.resolve(process.cwd(), '..', 'projects'),
    path.resolve(process.cwd(), 'projects'),
  ]
  const projectsDir = candidates.find((p) => existsSync(p))
  if (!projectsDir) {
    console.error('scan: could not locate projects/ — tried', candidates)
    process.exit(2)
  }

  const allSlugs = await listProjectSlugs(projectsDir)
  const slugs = ONLY ? allSlugs.filter((s) => s === ONLY) : allSlugs
  if (slugs.length === 0) {
    console.error('scan: no projects matched', ONLY ? `(filter: ${ONLY})` : '')
    process.exit(2)
  }

  console.log(`scan: ${slugs.length} project(s) under ${projectsDir}${DRY ? '  (dry run)' : ''}`)

  let okCount = 0
  let failCount = 0
  const written: string[] = []

  for (const slug of slugs) {
    const t0 = Date.now()
    try {
      const payload = await buildPayloadForSlug(slug, projectsDir)
      const elapsed = Date.now() - t0
      console.log(
        `  ✓ ${slug.padEnd(36)} ${String(payload.passed).padStart(2)}/${payload.total}` +
        ` · live=${(payload.live_status as { status?: string }).status ?? '?'}` +
        ` · ${elapsed}ms`,
      )
      if (!DRY) {
        await upsertSnapshot(payload)
        written.push(slug)
      }
      okCount++
    } catch (err) {
      failCount++
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ ${slug}  — ${msg}`)
    }
  }

  if (!DRY && !ONLY && written.length > 0) {
    try {
      const pruned = await deleteSnapshotsExcept(written)
      if (pruned > 0) console.log(`scan: pruned ${pruned} snapshot(s) for removed projects`)
    } catch (err) {
      console.warn('scan: prune failed —', err instanceof Error ? err.message : err)
    }
  }

  console.log(`scan: done · ${okCount} ok · ${failCount} failed${DRY ? ' (dry run, nothing written)' : ''}`)
  if (failCount > 0) process.exit(1)
}

main().catch((e) => {
  console.error('scan: crashed —', e instanceof Error ? e.stack ?? e.message : e)
  process.exit(2)
})
