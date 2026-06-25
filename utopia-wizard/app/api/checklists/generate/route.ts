import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { getUserToken } from '@/lib/wizardUsers'
import { fetchRepoMarkdown, PLAYBOOK_FILE_CANDIDATES } from '@/lib/playbookStore'
import { generateChecklistAI, openaiConfigured } from '@/lib/checklistAI'
import { upsertChecklist } from '@/lib/checklistStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Derive the signed-in user's checklist from a repo's CLAUDE.md via AI.
 * Body: { repo_full_name, source_path? }.
 */
export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  }
  if (!openaiConfigured()) {
    return NextResponse.json({ ok: false, error: 'AI generation is not configured (OPENAI_API_KEY).' }, { status: 500 })
  }

  const body = (await req.json().catch(() => null)) as { repo_full_name?: string; source_path?: string } | null
  const repo = body?.repo_full_name?.trim()
  if (!repo || !repo.includes('/')) {
    return NextResponse.json({ ok: false, error: 'repo_full_name (owner/name) required.' }, { status: 400 })
  }

  const token = await getUserToken(user.login)
  if (!token) {
    return NextResponse.json({ ok: false, error: 'No stored GitHub token — re-add your account with repo access.' }, { status: 400 })
  }

  const candidates = body?.source_path ? [body.source_path] : PLAYBOOK_FILE_CANDIDATES
  const found = await fetchRepoMarkdown(token, repo, candidates)
  if (!found) {
    return NextResponse.json({ ok: false, error: `No markdown found in ${repo} (looked for ${candidates.join(', ')}).` }, { status: 404 })
  }

  let items
  try {
    items = await generateChecklistAI(token, repo, found.path, found.content)
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'AI generation failed.' }, { status: 502 })
  }

  const ok = await upsertChecklist({ github_login: user.login, repo_full_name: repo, source_path: found.path, items })
  if (!ok) return NextResponse.json({ ok: false, error: 'Could not save checklist.' }, { status: 500 })

  return NextResponse.json({ ok: true, repo_full_name: repo, source_path: found.path, count: items.length })
}
