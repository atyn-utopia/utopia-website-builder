import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { existsSync } from 'fs'

export const runtime = 'nodejs'
export const maxDuration = 60

const exec = promisify(execFile)

interface PorcelainEntry {
  status: string
  path: string
}

function repoRoot(): string {
  return path.resolve(process.cwd(), '..')
}

function projectsDirExists(): boolean {
  return existsSync(path.join(repoRoot(), 'projects'))
}

async function git(args: string[]): Promise<{ stdout: string; stderr: string }> {
  const { stdout, stderr } = await exec('git', args, {
    cwd: repoRoot(),
    maxBuffer: 32 * 1024 * 1024,
  })
  return { stdout, stderr }
}

function parsePorcelain(out: string): PorcelainEntry[] {
  return out
    .split('\n')
    .filter(Boolean)
    .map((line) => ({ status: line.slice(0, 2), path: line.slice(3) }))
}

// "Untracked but no actual files" check: a `??` entry that points to a folder
// with zero non-ignored files inside it would lead to `git add` no-op. We
// surface the raw porcelain so the UI can show what it'd commit.
async function getProjectChanges(): Promise<PorcelainEntry[]> {
  const { stdout } = await git(['status', '--porcelain', '--', 'projects/'])
  return parsePorcelain(stdout)
}

async function currentBranch(): Promise<string> {
  const { stdout } = await git(['rev-parse', '--abbrev-ref', 'HEAD'])
  return stdout.trim()
}

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const DEFAULT_MACHINE_ID = process.env.UTOPIA_SYNC_MACHINE_ID ?? 'default'

// Supabase REST helper for the sync_status / sync_requests tables. Anon key
// is enough because Read policies are public; inserts pass through unchecked.
async function supaFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!SUPA_URL || !SUPA_ANON) return null
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: SUPA_ANON,
        Authorization: `Bearer ${SUPA_ANON}`,
        'Content-Type': 'application/json',
        // Tables live in the `webcore` schema, not `public`.
        'Accept-Profile': process.env.SUPABASE_DB_SCHEMA ?? 'webcore',
        'Content-Profile': process.env.SUPABASE_DB_SCHEMA ?? 'webcore',
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const text = await res.text()
    if (!text) return null
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

interface SyncStatusRow {
  machine_id: string
  branch: string | null
  pending_count: number
  changes: PorcelainEntry[]
  updated_at: string
  daemon_pid: number | null
}

// GET: preview what would be synced. Behaviour depends on mode:
//   - LIVE (filesystem available) → returns the working-tree porcelain.
//   - SNAPSHOT (deployed wizard) → returns the latest snapshot the local
//     sync-listener daemon pushed into Supabase, plus a freshness signal.
export async function GET() {
  if (projectsDirExists()) {
    try {
      const changes = await getProjectChanges()
      const branch = await currentBranch()
      return NextResponse.json({
        available: true,
        source: 'local',
        branch,
        count: changes.length,
        changes: changes.slice(0, 200),
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown error'
      return NextResponse.json({ available: false, source: 'local', reason: 'git-error', error: msg }, { status: 500 })
    }
  }

  // Snapshot mode: read whatever the daemon last reported.
  const rows = await supaFetch<SyncStatusRow[]>(
    `sync_status?machine_id=eq.${encodeURIComponent(DEFAULT_MACHINE_ID)}&select=*`,
  )
  if (!rows || rows.length === 0) {
    return NextResponse.json({
      available: false,
      source: 'remote',
      reason: 'no-daemon',
      hint: 'No sync-listener daemon has reported in. On your Mac, run: cd utopia-wizard && npm run sync-listener',
    })
  }
  const row = rows[0]
  const ageMs = Date.now() - new Date(row.updated_at).getTime()
  const stale = ageMs > 5 * 60 * 1000

  return NextResponse.json({
    available: true,
    source: 'remote',
    branch: row.branch,
    count: row.pending_count,
    changes: (row.changes ?? []).slice(0, 200),
    daemonAgeSeconds: Math.round(ageMs / 1000),
    stale,
  })
}

interface PostBody {
  mode?: 'pr' | 'main'
  message?: string
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as PostBody

  // SNAPSHOT mode (deployed wizard): no filesystem, so queue the request for
  // the local listener daemon. Return the request id so the client can poll.
  if (!projectsDirExists()) {
    if (!SUPA_URL || !SUPA_ANON) {
      return NextResponse.json({
        ok: false,
        error: 'Supabase not configured — cannot queue a remote sync request.',
      }, { status: 500 })
    }
    const mode = body.mode === 'main' ? 'main' : 'pr'
    const inserted = await supaFetch<{ id: string }[]>('sync_requests?select=id', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        machine_id: DEFAULT_MACHINE_ID,
        mode,
        message: (body.message ?? '').trim() || null,
      }),
    })
    if (!inserted || inserted.length === 0) {
      return NextResponse.json({ ok: false, error: 'Failed to queue sync request (Supabase insert).' }, { status: 500 })
    }
    return NextResponse.json({
      ok: true,
      mode: 'queued',
      requestId: inserted[0].id,
      hint: 'Your local sync-listener daemon will pick this up within ~8 seconds.',
    })
  }
  const mode = body.mode === 'main' ? 'main' : 'pr'
  const userMessage = (body.message ?? '').trim()

  try {
    // Check there's actually something to commit under projects/
    const changes = await getProjectChanges()
    if (changes.length === 0) {
      return NextResponse.json({ ok: false, error: 'Nothing to sync — projects/ is clean.' }, { status: 400 })
    }

    // Stage only projects/ — never touches utopia-wizard or root.
    await git(['add', '--', 'projects/'])

    const stagedCount = parsePorcelain((await git(['diff', '--cached', '--name-only', '--', 'projects/'])).stdout).length
    if (stagedCount === 0) {
      // Could happen if everything under projects/ is ignored or empty dirs.
      return NextResponse.json({ ok: false, error: 'Nothing was staged after `git add projects/` — every change may be gitignored.' }, { status: 400 })
    }

    const defaultMsg = `sync: update projects/ from local working tree (${stagedCount} file${stagedCount === 1 ? '' : 's'})`
    const commitMsg = userMessage || defaultMsg

    await git(['commit', '-m', commitMsg])
    const { stdout: shaOut } = await git(['rev-parse', 'HEAD'])
    const commitSha = shaOut.trim().slice(0, 7)

    if (mode === 'main') {
      // Direct push to main. Refuses if we're not already on main.
      const branch = await currentBranch()
      if (branch !== 'main') {
        return NextResponse.json({
          ok: false,
          error: `Direct-to-main push requested but checked-out branch is "${branch}". Switch to main first or use PR mode.`,
        }, { status: 400 })
      }
      await git(['push', 'origin', 'main'])
      return NextResponse.json({
        ok: true,
        mode: 'main',
        commitSha,
        filesCommitted: stagedCount,
        message: commitMsg,
      })
    }

    // PR mode: branch off the current main, cherry-pick the new commit, push,
    // open a PR. The user's working branch is restored at the end so they don't
    // get parked on the sync branch.
    const startingBranch = await currentBranch()
    const stamp = new Date().toISOString().replace(/[:T.]/g, '-').slice(0, 19)
    const syncBranch = `sync/projects-${stamp}`

    await git(['fetch', 'origin', 'main'])
    await git(['checkout', '-b', syncBranch, 'origin/main'])
    let cherryPickFailed = false
    try {
      await git(['cherry-pick', commitSha])
    } catch (e) {
      cherryPickFailed = true
      await git(['cherry-pick', '--abort']).catch(() => {})
    }

    if (cherryPickFailed) {
      // Restore the user's branch before bailing out.
      await git(['checkout', startingBranch]).catch(() => {})
      await git(['branch', '-D', syncBranch]).catch(() => {})
      return NextResponse.json({
        ok: false,
        error: 'Cherry-pick onto main failed — your local commit lives on the original branch, but the sync branch could not be built. Resolve conflicts manually.',
      }, { status: 500 })
    }

    await git(['push', '-u', 'origin', syncBranch])
    await git(['checkout', startingBranch]).catch(() => {})
    await git(['branch', '-D', syncBranch]).catch(() => {})

    // Try to open a PR with gh CLI. If gh isn't installed / not authed, return
    // the branch name so the user can open the PR manually.
    let prUrl: string | null = null
    try {
      const { stdout } = await exec(
        'gh',
        ['pr', 'create', '--base', 'main', '--head', syncBranch, '--title', commitMsg, '--body', commitMsg],
        { cwd: repoRoot(), maxBuffer: 4 * 1024 * 1024 },
      )
      prUrl = stdout.trim().split('\n').pop() ?? null
    } catch (e) {
      // Fall through — return the branch name so the user can open manually.
    }

    return NextResponse.json({
      ok: true,
      mode: 'pr',
      commitSha,
      filesCommitted: stagedCount,
      message: commitMsg,
      branch: syncBranch,
      prUrl,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
