/**
 * The wizard is fully GitHub/Supabase-driven — it never reads project files
 * from local disk. All project data comes from monitor_snapshots (written by
 * the connected-repo scanner, scan-repos). `dataMode` is therefore always
 * 'snapshot'; the live/disk path has been removed.
 *
 * `projectsDir()` only computes a path string (no filesystem access) and is
 * kept for the few callers that still reference it.
 */

import path from 'node:path'

export function projectsDir(): string {
  return path.resolve(process.cwd(), '..', 'projects')
}

export type DataMode = 'snapshot'

export function dataMode(): DataMode {
  return 'snapshot'
}
