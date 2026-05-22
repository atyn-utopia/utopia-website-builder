#!/usr/bin/env -S npx tsx
/**
 * sync-listener — local daemon that bridges the deployed wizard's "Sync"
 * button to your local git working tree.
 *
 * Loop:
 *   1. Read `git status --porcelain -- projects/`
 *   2. Push that summary into Supabase `sync_status` so the deployed wizard
 *      can show "N projects pending sync"
 *   3. Poll Supabase `sync_requests` for `status='pending'` rows targeted at
 *      this machine_id
 *   4. When one is found: mark it running, execute the git command (PR or
 *      direct-to-main), mark done/error with the result
 *
 * Run interactively:
 *   cd utopia-wizard && npm run sync-listener
 *
 * Run as a launchd agent so it survives reboots:
 *   cd utopia-wizard && npm run sync-listener:install
 */

import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

// Pick up SUPABASE_* keys from the repo-root .env.local symlink. Inline this
// instead of depending on @next/env (which is CJS — breaks Node's native
// --experimental-strip-types loader used under launchd).
function loadEnvLocal(): void {
  const envPath = path.resolve(process.cwd(), '..', '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}
loadEnvLocal()

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const MACHINE_ID = process.env.UTOPIA_SYNC_MACHINE_ID ?? 'default'
const POLL_INTERVAL_MS = 8_000
const STATUS_INTERVAL_MS = 30_000

if (!SUPA_URL || !SERVICE_KEY) {
  console.error('[sync-listener] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const exec = promisify(execFile)
const repoRoot = path.resolve(process.cwd(), '..')

async function git(args: string[]): Promise<string> {
  const { stdout } = await exec('git', args, { cwd: repoRoot, maxBuffer: 32 * 1024 * 1024 })
  return stdout
}

interface PorcelainEntry { status: string; path: string }

function parsePorcelain(out: string): PorcelainEntry[] {
  return out
    .split('\n')
    .filter(Boolean)
    .map((line) => ({ status: line.slice(0, 2), path: line.slice(3) }))
}

interface SyncRequest {
  id: string
  machine_id: string
  mode: 'pr' | 'main'
  message: string | null
  status: 'pending' | 'running' | 'done' | 'error'
}

async function supaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`)
  }
  // Supabase returns 204 No Content when Prefer=return=minimal — there's no
  // body to parse. Read raw text first; only JSON.parse if non-empty.
  const text = await res.text()
  if (!text) return undefined as unknown as T
  return JSON.parse(text) as T
}

async function pushStatus(): Promise<void> {
  try {
    const porcelain = await git(['status', '--porcelain', '--', 'projects/'])
    const changes = parsePorcelain(porcelain)
    const branch = (await git(['rev-parse', '--abbrev-ref', 'HEAD'])).trim()
    const row = {
      machine_id: MACHINE_ID,
      branch,
      pending_count: changes.length,
      changes: changes.slice(0, 200),
      daemon_pid: process.pid,
      updated_at: new Date().toISOString(),
    }
    await supaFetch<unknown>(`sync_status?on_conflict=machine_id`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(row),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown'
    console.error('[sync-listener] pushStatus failed:', msg)
  }
}

async function claimNextRequest(): Promise<SyncRequest | null> {
  // Atomic-ish claim: fetch one pending row, update it to running. Two daemons
  // on the same machine_id would race, but in practice there's only one.
  const rows = await supaFetch<SyncRequest[]>(
    `sync_requests?machine_id=eq.${encodeURIComponent(MACHINE_ID)}&status=eq.pending&order=requested_at.asc&limit=1`,
  )
  if (rows.length === 0) return null
  const req = rows[0]

  await supaFetch<unknown>(`sync_requests?id=eq.${req.id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ status: 'running', started_at: new Date().toISOString() }),
  })
  return req
}

async function finishRequest(id: string, status: 'done' | 'error', result: unknown): Promise<void> {
  await supaFetch<unknown>(`sync_requests?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ status, result, finished_at: new Date().toISOString() }),
  })
}

interface ExecOutcome {
  filesCommitted: number
  commitSha: string
  branch?: string
  prUrl?: string | null
  mode: 'pr' | 'main'
  message: string
}

async function executeSyncRequest(req: SyncRequest): Promise<ExecOutcome> {
  // Stage projects/ only. If nothing's there, bail out cleanly.
  await git(['add', '--', 'projects/'])
  const staged = parsePorcelain(await git(['diff', '--cached', '--name-only', '--', 'projects/']))
  if (staged.length === 0) {
    throw new Error('Nothing to sync — projects/ is clean at execution time.')
  }

  const defaultMsg = `sync: update projects/ from local working tree (${staged.length} file${staged.length === 1 ? '' : 's'})`
  const message = (req.message ?? '').trim() || defaultMsg

  await git(['commit', '-m', message])
  const commitSha = (await git(['rev-parse', 'HEAD'])).trim().slice(0, 7)

  if (req.mode === 'main') {
    const branch = (await git(['rev-parse', '--abbrev-ref', 'HEAD'])).trim()
    if (branch !== 'main') {
      throw new Error(`Direct-to-main push requested but working branch is "${branch}". Switch to main locally first.`)
    }
    await git(['push', 'origin', 'main'])
    return { filesCommitted: staged.length, commitSha, mode: 'main', message }
  }

  // PR mode: branch off latest main, cherry-pick, push, open PR.
  const startingBranch = (await git(['rev-parse', '--abbrev-ref', 'HEAD'])).trim()
  const stamp = new Date().toISOString().replace(/[:T.]/g, '-').slice(0, 19)
  const syncBranch = `sync/projects-${stamp}`

  await git(['fetch', 'origin', 'main'])
  await git(['checkout', '-b', syncBranch, 'origin/main'])
  try {
    await git(['cherry-pick', commitSha])
  } catch (err) {
    await git(['cherry-pick', '--abort']).catch(() => {})
    await git(['checkout', startingBranch]).catch(() => {})
    await git(['branch', '-D', syncBranch]).catch(() => {})
    throw new Error(`Cherry-pick failed. Your local commit is preserved on ${startingBranch}.`)
  }

  await git(['push', '-u', 'origin', syncBranch])
  await git(['checkout', startingBranch]).catch(() => {})
  await git(['branch', '-D', syncBranch]).catch(() => {})

  let prUrl: string | null = null
  try {
    const out = await exec('gh', [
      'pr', 'create',
      '--base', 'main',
      '--head', syncBranch,
      '--title', message,
      '--body', message,
    ], { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 })
    prUrl = out.stdout.trim().split('\n').pop() ?? null
  } catch {
    // gh missing or unauthed — leave prUrl null and surface the branch.
  }

  return { filesCommitted: staged.length, commitSha, branch: syncBranch, prUrl, mode: 'pr', message }
}

async function processNext(): Promise<boolean> {
  const req = await claimNextRequest().catch((err) => {
    console.error('[sync-listener] claim failed:', err.message)
    return null
  })
  if (!req) return false

  console.log(`[sync-listener] processing ${req.id} (mode=${req.mode})`)
  try {
    const outcome = await executeSyncRequest(req)
    await finishRequest(req.id, 'done', outcome)
    console.log(`[sync-listener] ✓ ${req.id} — ${outcome.commitSha} ${outcome.prUrl ?? ''}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    await finishRequest(req.id, 'error', { error: message })
    console.error(`[sync-listener] ✕ ${req.id} — ${message}`)
  }
  return true
}

async function main(): Promise<void> {
  console.log(`[sync-listener] starting (machine_id=${MACHINE_ID}, repo=${repoRoot})`)
  console.log(`[sync-listener] poll ${POLL_INTERVAL_MS / 1000}s · status ${STATUS_INTERVAL_MS / 1000}s`)

  let lastStatus = 0

  const tick = async () => {
    const now = Date.now()
    if (now - lastStatus > STATUS_INTERVAL_MS) {
      await pushStatus()
      lastStatus = now
    }
    // Drain the queue — process all pending rows before sleeping.
    while (await processNext()) { /* keep going */ }
  }

  // Run forever. Crash on uncaught errors so launchd KeepAlive restarts us.
  while (true) {
    try {
      await tick()
    } catch (err) {
      console.error('[sync-listener] tick error:', err)
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
}

void main()

// Graceful shutdown so launchd can stop us cleanly.
for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => {
    console.log(`[sync-listener] caught ${sig}, exiting`)
    process.exit(0)
  })
}
