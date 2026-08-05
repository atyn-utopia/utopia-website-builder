/**
 * Run the full checklist for one project and print every non-passing item.
 *
 *   npx tsx scripts/check-one.ts <slug> [--all]
 *
 * `--all` also lists passing checks. Bypasses the run cache so results
 * always reflect the current working tree + database.
 */
import path from 'node:path'
import { runChecklist } from '../lib/runChecklist'

const args = process.argv.slice(2)
const showAll = args.includes('--all')
const slug = args.find((a) => !a.startsWith('--'))

if (!slug) {
  console.error('usage: tsx scripts/check-one.ts <slug> [--all]')
  process.exit(1)
}

const projectsDir = path.resolve(process.cwd(), '..', 'projects')

// tsx transpiles this to CJS, which has no top-level await.
async function main() {
  const run = await runChecklist(slug!, projectsDir, /* useCache */ false)

  console.log(`\n${slug} — score ${run.score}  (${run.passed}/${run.total} passed, ${run.failedCount} failed)`)
  console.log(`domain: ${run.domain}   candidates: ${run.domainCandidates.join(', ')}\n`)

  for (const group of run.groups) {
    const items = group.items.filter((i) => (showAll ? true : i.status !== 'pass'))
    if (items.length === 0) continue
    console.log(`── ${group.name}`)
    for (const item of items) {
      const mark = item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : 'SKIP'
      console.log(`  ${mark}  ${item.name}${item.detail ? `\n         ${item.detail}` : ''}`)
    }
    console.log()
  }
}

main()
