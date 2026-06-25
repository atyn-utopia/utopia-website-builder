import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { getUserToken } from '@/lib/wizardUsers'
import {
  fetchRepoMarkdown,
  extractTitle,
  upsertPlaybook,
  PLAYBOOK_FILE_CANDIDATES,
} from '@/lib/playbookStore'
import { generatePlaybook } from '@/lib/playbookGenerate'
import { generatePlaybookAI, openaiConfigured } from '@/lib/playbookAI'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Generate the signed-in user's playbook from a repo. Reads CLAUDE.md +
 * referenced files + conventional folders (agents/, docs/, prompts/,
 * workflows/) with the user's token, assembles a layered structure, and stores
 * it. Body: { repo_full_name, source_path? }.
 */
export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as {
    repo_full_name?: string
    source_path?: string
    mode?: 'ai' | 'parse'
  } | null
  const repo = body?.repo_full_name?.trim()
  if (!repo || !repo.includes('/')) {
    return NextResponse.json({ ok: false, error: 'repo_full_name (owner/name) required.' }, { status: 400 })
  }

  const token = await getUserToken(user.login)
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'No stored GitHub token — re-add your account with a token that has repo access.' },
      { status: 400 },
    )
  }

  const candidates = body?.source_path ? [body.source_path] : PLAYBOOK_FILE_CANDIDATES
  const found = await fetchRepoMarkdown(token, repo, candidates)
  if (!found) {
    return NextResponse.json(
      { ok: false, error: `No markdown found in ${repo} (looked for ${candidates.join(', ')}).` },
      { status: 404 },
    )
  }

  // AI when available + requested (default); fall back to the parser.
  const useAI = (body?.mode ?? 'ai') === 'ai' && openaiConfigured()
  let structure
  let mode: 'ai' | 'parse' = 'parse'
  if (useAI) {
    try {
      structure = await generatePlaybookAI(token, repo, found.path, found.content)
      mode = 'ai'
    } catch {
      structure = await generatePlaybook(token, repo, found.path, found.content)
    }
  } else {
    structure = await generatePlaybook(token, repo, found.path, found.content)
  }
  // Use the structure's title (AI's chosen name, or the parsed H1) so the list
  // card and the opened playbook header always match.
  const title = structure.title || extractTitle(found.content) || repo.split('/')[1]

  const ok = await upsertPlaybook({
    github_login: user.login,
    repo_full_name: repo,
    source_path: found.path,
    title,
    content: found.content,
    structure,
  })
  if (!ok) {
    return NextResponse.json({ ok: false, error: 'Could not save playbook.' }, { status: 500 })
  }
  return NextResponse.json({
    ok: true,
    title,
    mode,
    source_path: found.path,
    repo_full_name: repo,
    files_read: structure.filesRead.length,
    layers: structure.layers.length,
  })
}
