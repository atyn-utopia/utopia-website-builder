/**
 * gate.ts — Blocking guardrail gate (pre-commit + CI).
 *
 *   npx tsx scripts/gate.ts <slug> [<slug> ...]   # gate specific projects
 *   npx tsx scripts/gate.ts --only=<slug>         # single project
 *   npx tsx scripts/gate.ts --all                 # every project
 *
 * Flags:
 *   --source-only   Only gate statically-determinable checks. Drops the Database
 *                   + Deployment groups (they need network / a live deploy).
 *                   Use this in pre-commit. CI omits it for the full gate.
 *   --ratchet       Also fail if a project's score dropped below its last stored
 *                   snapshot — quality may only go up. Needs Supabase env.
 *   --json          Emit a machine-readable summary line.
 *
 * Exit code: 0 = all gated projects pass; 1 = at least one blocking failure
 * (or score regression under --ratchet). This is what gives the guardrails teeth.
 *
 * Reuses lib/runChecklist + lib/checkMeta so the gate can never diverge from the
 * wizard's own scoring.
 */
import { readdir, stat, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { scorePct } from '../lib/score'

// ── env load (same dance as scan.ts — modules read env at import time) ───────
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
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
      if (!process.env[key]) process.env[key] = val
    }
    return
  }
}

const args = process.argv.slice(2)
const SOURCE_ONLY = args.includes('--source-only')
const RATCHET = args.includes('--ratchet')
// Regression-only: fail ONLY on a score drop vs the last snapshot, not on
// absolute blocking failures. This is the correct mode for a PR gate — its job
// is "don't make it worse", not "retroactively demand pre-existing legacy sites
// be perfect". Absolute-blocking enforcement still lives at scaffold/self-check,
// pre-commit, and the deploy gate. Implies --ratchet.
const REGRESSION_ONLY = args.includes('--regression-only')
const ALL = args.includes('--all')
const JSON_OUT = args.includes('--json')
const onlyArg = args.find((a) => a.startsWith('--only='))?.split('=')[1]
const positional = args.filter((a) => !a.startsWith('--'))

// Groups that depend on network / a live deploy — skipped under --source-only.
const RUNTIME_GROUPS = new Set(['Database', 'Deployment'])

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

async function main() {
  await loadEnv()
  const { runChecklist } = await import('../lib/runChecklist')
  const { BLOCKING_IDS } = await import('../lib/checkMeta')
  const { readSnapshot } = await import('../lib/snapshotStore')

  const candidates = [
    path.resolve(process.cwd(), '..', 'projects'),
    path.resolve(process.cwd(), 'projects'),
  ]
  const projectsDir = candidates.find((p) => existsSync(p))
  if (!projectsDir) {
    console.error('gate: could not locate projects/')
    process.exit(2)
  }

  const allSlugs = await listProjectSlugs(projectsDir)
  let slugs: string[]
  if (ALL) slugs = allSlugs
  else if (onlyArg) slugs = allSlugs.filter((s) => s === onlyArg)
  else slugs = positional.filter((s) => allSlugs.includes(s))

  if (slugs.length === 0) {
    console.log('gate: no matching projects to check — nothing to gate. ✓')
    return
  }

  const ratchet = RATCHET || REGRESSION_ONLY
  const mode = REGRESSION_ONLY ? ' (regression-only)' : SOURCE_ONLY ? ' (source-only)' : ratchet ? ' +ratchet' : ''
  console.log(`gate: checking ${slugs.length} project(s)${mode}\n`)

  let failedProjects = 0
  const report: Array<{ slug: string; score: string; blocking: string[]; regressed?: string }> = []

  for (const slug of slugs) {
    const run = await runChecklist(slug, projectsDir, /* useCache */ false)
    const blocking: string[] = []
    for (const group of run.groups) {
      if (SOURCE_ONLY && RUNTIME_GROUPS.has(group.name)) continue
      for (const item of group.items) {
        if (item.status === 'fail' && BLOCKING_IDS.has(item.id)) blocking.push(item.id)
      }
    }

    let regressed: string | undefined
    if (ratchet) {
      try {
        const prev = await readSnapshot(slug)
        if (prev && (prev.passed + prev.failed_count) > 0) {
          const prevScore = scorePct(prev.passed, prev.failed_count)
          if (run.score < prevScore) regressed = `${run.score} < ${prevScore} (previous)`
        }
      } catch { /* no snapshot / no env → skip ratchet for this project */ }
    }

    // Regression-only: a project fails ONLY on a score drop. Blocking failures
    // are surfaced as warnings (legacy debt), not merge blockers.
    const fails = REGRESSION_ONLY ? !!regressed : (blocking.length > 0 || !!regressed)
    const score = `${run.score}/100`
    if (fails) failedProjects++
    report.push({ slug, score, blocking, regressed })

    const mark = fails ? '✗' : (blocking.length ? '⚠' : '✓')
    console.log(`  ${mark} ${slug.padEnd(32)} ${score}`)
    if (blocking.length) {
      const tag = REGRESSION_ONLY ? `${blocking.length} blocking (warning, not blocking merge)` : `${blocking.length} BLOCKING failure(s)`
      console.log(`      ${tag}: ${blocking.join(', ')}`)
    }
    if (regressed) console.log(`      SCORE REGRESSION: ${regressed}`)
  }

  console.log('')
  if (JSON_OUT) console.log('GATE_JSON ' + JSON.stringify({ failedProjects, report }))

  if (failedProjects > 0) {
    const why = REGRESSION_ONLY ? 'score regression(s)' : 'blocking failures or regressions'
    console.error(`gate: FAILED — ${failedProjects} project(s) have ${why}.`)
    console.error(`gate: see docs/guardrails.html for what each check id means.`)
    process.exit(1)
  }
  console.log(`gate: PASS — all ${slugs.length} project(s) clear. ✓`)
}

main().catch((e) => {
  console.error('gate: crashed —', e?.message ?? e)
  process.exit(2)
})
