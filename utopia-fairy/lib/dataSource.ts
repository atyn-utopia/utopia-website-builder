/**
 * Decides whether the API serves live scans (filesystem available) or
 * snapshots (deployed mode — projects/ doesn't exist).
 *
 *   UTOPIA_FAIRY_USE_SNAPSHOTS=1     → always snapshots, even if projects/ exists
 *   UTOPIA_FAIRY_USE_LIVE=1          → always live (errors if projects/ missing)
 *   default                          → live if projects/ exists, else snapshots
 */

import { existsSync } from 'node:fs'
import path from 'node:path'

export function projectsDir(): string {
  // utopia-fairy/ → ../projects
  return path.resolve(process.cwd(), '..', 'projects')
}

export type DataMode = 'live' | 'snapshot'

let cachedMode: DataMode | null = null

export function dataMode(): DataMode {
  if (cachedMode) return cachedMode
  if (process.env.UTOPIA_FAIRY_USE_SNAPSHOTS === '1') {
    cachedMode = 'snapshot'
    return cachedMode
  }
  if (process.env.UTOPIA_FAIRY_USE_LIVE === '1') {
    cachedMode = 'live'
    return cachedMode
  }
  cachedMode = existsSync(projectsDir()) ? 'live' : 'snapshot'
  return cachedMode
}
