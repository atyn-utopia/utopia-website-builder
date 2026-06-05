/**
 * check-meta-sync.ts — Drift guard.
 *
 *   npx tsx scripts/check-meta-sync.ts
 *
 * Asserts that lib/checkMeta.ts (the guardrail registry) stays 1:1 with the
 * check ids actually emitted by lib/checklist.ts. Exits non-zero on drift so it
 * can run in CI / pre-commit. This is what lets the rule metadata live next to —
 * but never silently diverge from — the check implementations.
 */
import { readFile } from 'fs/promises'
import path from 'path'
import { CHECK_META_BY_ID } from '../lib/checkMeta'

async function main() {
  const checklistPath = path.resolve(process.cwd(), 'lib', 'checklist.ts')
  const src = await readFile(checklistPath, 'utf-8')

  // Every check is constructed with `id: '<kebab>'`. Collect the distinct ids.
  const liveIds = new Set<string>()
  for (const m of src.matchAll(/\bid:\s*'([a-z0-9-]+)'/g)) liveIds.add(m[1])

  const metaIds = new Set(Object.keys(CHECK_META_BY_ID))

  const missingInMeta = [...liveIds].filter((id) => !metaIds.has(id)).sort()
  const staleInMeta = [...metaIds].filter((id) => !liveIds.has(id)).sort()

  if (missingInMeta.length === 0 && staleInMeta.length === 0) {
    console.log(`check-meta-sync: OK · ${liveIds.size} checks, all classified.`)
    return
  }

  if (missingInMeta.length)
    console.error(`check-meta-sync: ${missingInMeta.length} live check(s) MISSING from checkMeta.ts:\n  ${missingInMeta.join('\n  ')}`)
  if (staleInMeta.length)
    console.error(`check-meta-sync: ${staleInMeta.length} stale entry(ies) in checkMeta.ts (no live check):\n  ${staleInMeta.join('\n  ')}`)
  process.exit(1)
}

main()
