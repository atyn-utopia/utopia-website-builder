import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { getUserToken } from '@/lib/wizardUsers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RepoLite {
  full_name: string
  id: number
  default_branch: string
  html_url: string
  private: boolean
  updated_at: string
}

/**
 * List the signed-in user's GitHub repos (for the connect-repo picker), using
 * their own stored token. Returns a trimmed shape — never the token.
 */
export async function GET(req: Request) {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub to list your repos.' }, { status: 401 })
  }

  const token = await getUserToken(user.login)
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'No stored GitHub token — sign out and sign in with GitHub again.' },
      { status: 400 },
    )
  }

  const q = new URL(req.url).searchParams.get('q')?.toLowerCase() ?? ''

  try {
    // affiliation=owner so we list repos the user owns (one-project-per-repo).
    const res = await fetch(
      'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'utopia-wizard',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      },
    )
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `GitHub API ${res.status}` }, { status: 502 })
    }
    const repos = (await res.json()) as RepoLite[]
    const list = repos
      .map((r) => ({
        full_name: r.full_name,
        id: r.id,
        default_branch: r.default_branch,
        html_url: r.html_url,
        private: r.private,
        updated_at: r.updated_at,
      }))
      .filter((r) => !q || r.full_name.toLowerCase().includes(q))
    return NextResponse.json({ ok: true, repos: list })
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not reach GitHub.' }, { status: 502 })
  }
}
