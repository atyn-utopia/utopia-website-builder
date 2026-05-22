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

// GET: preview what would be synced. Used by the SyncButton to decide whether
// to render itself and to populate the modal preview.
export async function GET() {
  if (!projectsDirExists()) {
    return NextResponse.json({ available: false, reason: 'snapshot' })
  }
  try {
    const changes = await getProjectChanges()
    const branch = await currentBranch()
    return NextResponse.json({
      available: true,
      branch,
      count: changes.length,
      changes: changes.slice(0, 200),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error'
    return NextResponse.json({ available: false, reason: 'git-error', error: msg }, { status: 500 })
  }
}

interface PostBody {
  mode?: 'pr' | 'main'
  message?: string
}

export async function POST(request: NextRequest) {
  if (!projectsDirExists()) {
    return NextResponse.json({ ok: false, error: 'Not available — wizard is running in snapshot mode (no filesystem).' }, { status: 400 })
  }

  const body = (await request.json().catch(() => ({}))) as PostBody
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
