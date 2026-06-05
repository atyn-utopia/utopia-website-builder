/**
 * chrome-sync.ts — Re-sync a project's chrome from templates/site-chrome (G2).
 *
 *   npx tsx scripts/chrome-sync.ts --only=slug                 # DRY RUN (default) — shows the plan
 *   npx tsx scripts/chrome-sync.ts --only=slug --write          # actually copy
 *   npx tsx scripts/chrome-sync.ts --only=slug --components=SiteFooter,FomoBanner --write
 *
 * Copies the canonical chrome component FILES into projects/{slug}/components/.
 * Dry-run by default — nothing is written without --write.
 *
 * ⚠ SAFETY: this OVERWRITES the project's chrome with the canonical version.
 * Sites that score well but show chrome drift are usually customised ON PURPOSE
 * — syncing them can break a working layout. Use this ONLY on a project you are
 * actively re-aligning, one at a time, and ALWAYS run the gate + a build after:
 *     npm run gate -- --source-only {slug}
 *     (cd ../projects/{slug} && npm run build)
 *
 * Note: this syncs the component FILES. If the project's pages import an
 * old-named nav (e.g. SiteNav / BlogNav), update those imports too — the gate
 * (homepage-chrome / no-blognav-usage) will tell you if more work remains.
 *
 * For safety there is no --all. Sync is deliberate and per-project.
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ALL_CHROME = ['SiteHeader', 'SiteFooter', 'FomoBanner', 'PageStyles', 'LanguageSwitcher', 'WhatsAppButton']
const slug = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]
const WRITE = process.argv.includes('--write')
const compsArg = process.argv.find((a) => a.startsWith('--components='))?.split('=')[1]
const components = compsArg ? compsArg.split(',').map((s) => s.trim()).filter(Boolean) : ALL_CHROME

function normalize(src: string): Set<string> {
  const stripped = src
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ')
    .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '""')
  return new Set((stripped.match(/[A-Za-z_][A-Za-z0-9_-]+/g) ?? []).map((t) => t.toLowerCase()))
}
function similarity(a: Set<string>, b: Set<string>): number {
  let inter = 0; for (const t of a) if (b.has(t)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 1 : inter / union
}

async function main() {
  if (!slug) { console.error('chrome-sync: --only=<slug> is required. There is no --all.'); process.exit(2) }
  const bad = components.filter((c) => !ALL_CHROME.includes(c))
  if (bad.length) { console.error(`chrome-sync: unknown component(s): ${bad.join(', ')}`); process.exit(2) }

  const projectsDir = path.resolve(process.cwd(), '..', 'projects')
  const templateDir = path.resolve(process.cwd(), '..', 'templates', 'site-chrome')
  const projDir = path.join(projectsDir, slug)
  if (!existsSync(path.join(projDir, 'inputs.md'))) { console.error(`chrome-sync: projects/${slug} is not a project (no inputs.md)`); process.exit(2) }

  console.log(`chrome-sync: ${slug} ${WRITE ? '(WRITE)' : '(dry run — pass --write to apply)'}\n`)
  let changed = 0
  for (const c of components) {
    const src = path.join(templateDir, `${c}.tsx`)
    if (!existsSync(src)) { console.log(`  -  ${c}: no canonical template, skipped`); continue }
    const canon = await readFile(src, 'utf-8')
    const dst = path.join(projDir, 'components', `${c}.tsx`)

    if (!existsSync(dst)) {
      console.log(`  +  ${c}: MISSING → will be created`)
      changed++
      if (WRITE) { await mkdir(path.dirname(dst), { recursive: true }); await writeFile(dst, canon) }
      continue
    }
    const cur = await readFile(dst, 'utf-8')
    if (cur === canon) { console.log(`  =  ${c}: already canonical`); continue }
    const sim = Math.round(similarity(normalize(canon), normalize(cur)) * 100)
    console.log(`  ~  ${c}: ${sim}% match → will be OVERWRITTEN with canonical`)
    changed++
    if (WRITE) await writeFile(dst, canon)
  }

  console.log('')
  if (!WRITE) {
    console.log(`chrome-sync: ${changed} file(s) would change. Re-run with --write to apply.`)
  } else {
    console.log(`chrome-sync: synced ${changed} file(s) into projects/${slug}/components/.`)
    console.log(`chrome-sync: NOW verify →  npm run gate -- --source-only ${slug}  then build the project.`)
    console.log(`chrome-sync: if pages import an old nav (SiteNav/BlogNav), update those imports too.`)
  }
}

main().catch((e) => { console.error('chrome-sync: crashed —', e?.message ?? e); process.exit(1) })
