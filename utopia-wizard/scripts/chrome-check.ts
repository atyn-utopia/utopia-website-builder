/**
 * chrome-check.ts — Chrome drift report (G2: keep the copies honest).
 *
 *   npx tsx scripts/chrome-check.ts            # all projects
 *   npx tsx scripts/chrome-check.ts --only=slug
 *   npx tsx scripts/chrome-check.ts --json
 *
 * Each project copies the canonical chrome from templates/site-chrome/. Over
 * time those copies drift (a custom BlogNav, a hand-edited SiteHeader). This
 * reports, per project, how closely each chrome component still matches the
 * canonical template — using a NORMALISED comparison that ignores legitimate
 * per-project customisation (brand strings, asset paths, comments, whitespace),
 * so it flags structural divergence, not brand swaps.
 *
 * Advisory by design — NOT part of the scored gate. Per-project branding makes
 * byte-parity unsuitable for blocking commits/deploys; this is a signal to
 * re-sync intentionally, not a hard fail.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const CHROME = ['SiteHeader', 'SiteFooter', 'FomoBanner', 'PageStyles', 'LanguageSwitcher', 'WhatsAppButton']
const onlyArg = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]
const JSON_OUT = process.argv.includes('--json')

// Drop comments, whitespace, string literals, and asset/brand tokens so the
// comparison reflects code structure rather than per-project content.
function normalize(src: string): Set<string> {
  const stripped = src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')     // block comments
    .replace(/\/\/[^\n]*/g, ' ')           // line comments
    .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '""') // string literals → ""
  // Token set = identifiers, JSX tags, className keys — the structural skeleton.
  const tokens = stripped.match(/[A-Za-z_][A-Za-z0-9_-]+/g) ?? []
  return new Set(tokens.map((t) => t.toLowerCase()))
}

function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 1 : inter / union   // Jaccard
}

async function listProjects(projectsDir: string): Promise<string[]> {
  const entries = await readdir(projectsDir)
  const out: string[] = []
  for (const slug of entries) {
    try { await stat(path.join(projectsDir, slug, 'inputs.md')); out.push(slug) } catch { /* not a project */ }
  }
  return out
}

async function main() {
  const projectsDir = path.resolve(process.cwd(), '..', 'projects')
  const templateDir = path.resolve(process.cwd(), '..', 'templates', 'site-chrome')
  if (!existsSync(templateDir)) { console.error('chrome-check: templates/site-chrome not found'); process.exit(2) }

  const canon: Record<string, Set<string>> = {}
  for (const c of CHROME) {
    const p = path.join(templateDir, `${c}.tsx`)
    if (existsSync(p)) canon[c] = normalize(await readFile(p, 'utf-8'))
  }

  let slugs = await listProjects(projectsDir)
  if (onlyArg) slugs = slugs.filter((s) => s === onlyArg)

  const MATCH = 0.60   // below this share of canonical structure → flag as drifted
  const report: Array<{ slug: string; drift: Array<{ comp: string; sim: number; status: string }> }> = []

  for (const slug of slugs) {
    const drift: Array<{ comp: string; sim: number; status: string }> = []
    for (const c of CHROME) {
      if (!canon[c]) continue
      const p = path.join(projectsDir, slug, 'components', `${c}.tsx`)
      if (!existsSync(p)) { drift.push({ comp: c, sim: 0, status: 'MISSING' }); continue }
      const sim = similarity(canon[c], normalize(await readFile(p, 'utf-8')))
      if (sim < MATCH) drift.push({ comp: c, sim, status: 'DRIFTED' })
    }
    report.push({ slug, drift })
  }

  if (JSON_OUT) { console.log(JSON.stringify(report, null, 2)); return }

  let flagged = 0
  console.log(`chrome-check: ${slugs.length} project(s) vs templates/site-chrome (match threshold ${Math.round(MATCH * 100)}%)\n`)
  for (const r of report) {
    if (r.drift.length === 0) { console.log(`  ✓ ${r.slug}`); continue }
    flagged++
    console.log(`  ⚠ ${r.slug}`)
    for (const d of r.drift) {
      console.log(`      ${d.status.padEnd(8)} ${d.comp}${d.status === 'DRIFTED' ? ` (${Math.round(d.sim * 100)}% match)` : ''}`)
    }
  }
  console.log(`\nchrome-check: ${flagged} project(s) with chrome drift. Re-sync from templates/site-chrome/ where intended.`)
}

main().catch((e) => { console.error('chrome-check: crashed —', e?.message ?? e); process.exit(1) })
