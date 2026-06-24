import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import {
  listUserRepos,
  connectUserRepo,
  disconnectUserRepo,
  setProjectOwner,
} from '@/lib/wizardUsers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Lowercase, hyphenated, [a-z0-9-] only — matches the project slug format. */
function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

async function requireGithubUser() {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) return null
  return user
}

export async function GET() {
  const user = await requireGithubUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  const repos = await listUserRepos(user.login)
  return NextResponse.json({ ok: true, repos })
}

export async function POST(req: Request) {
  const user = await requireGithubUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as {
    repo_full_name?: string
    repo_id?: number
    default_branch?: string
    html_url?: string
    project_slug?: string
  } | null

  const repoFullName = body?.repo_full_name?.trim()
  if (!repoFullName || !repoFullName.includes('/')) {
    return NextResponse.json({ ok: false, error: 'repo_full_name (owner/name) required.' }, { status: 400 })
  }

  // Slug defaults to the repo name; sanitised either way.
  const slug = toSlug(body?.project_slug || repoFullName.split('/')[1] || repoFullName)
  if (!slug) return NextResponse.json({ ok: false, error: 'Could not derive a valid slug.' }, { status: 400 })

  const ok = await connectUserRepo({
    githubLogin: user.login,
    repoFullName,
    repoId: body?.repo_id ?? null,
    defaultBranch: body?.default_branch || 'main',
    projectSlug: slug,
    htmlUrl: body?.html_url ?? null,
  })
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: 'Could not save (Supabase service role not configured?).' },
      { status: 500 },
    )
  }

  // Tie the project to its owner so the checklist scoping recognises it.
  await setProjectOwner(slug, user.login, user.login)

  return NextResponse.json({ ok: true, project_slug: slug, repo_full_name: repoFullName })
}

export async function DELETE(req: Request) {
  const user = await requireGithubUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })

  const repoFullName = new URL(req.url).searchParams.get('repo')?.trim()
  if (!repoFullName) {
    return NextResponse.json({ ok: false, error: '?repo=owner/name required.' }, { status: 400 })
  }
  const ok = await disconnectUserRepo(user.login, repoFullName)
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 })
}
