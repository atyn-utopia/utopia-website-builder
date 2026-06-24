import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { getProjectOwners, setProjectOwner } from '@/lib/wizardUsers'
import { isAllowed } from '@/lib/githubOAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Reassign (or claim) a project's owner.
 *
 * Body: { slug: string, login: string }
 * Rules:
 *   - must be signed in with a real GitHub identity
 *   - admins (or passcode sessions) may reassign any project to anyone allowed
 *   - a regular user may only CLAIM an unowned project, and only to themselves
 *   - the target login must be on the team allowlist
 */
export async function POST(req: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as { slug?: string; login?: string } | null
  const slug = body?.slug?.trim()
  const target = body?.login?.trim()
  if (!slug || !target) {
    return NextResponse.json({ ok: false, error: 'slug and login are required.' }, { status: 400 })
  }
  if (!isAllowed(target)) {
    return NextResponse.json({ ok: false, error: 'Target user is not on the allowlist.' }, { status: 400 })
  }

  const isAdmin = user.isAdmin || user.login === PASSCODE_LOGIN

  if (!isAdmin) {
    const owners = await getProjectOwners()
    const existing = owners.get(slug) ?? null
    // Non-admins can only claim an unowned project, for themselves.
    if (existing && existing !== user.login) {
      return NextResponse.json(
        { ok: false, error: 'Only an admin can reassign a project owned by someone else.' },
        { status: 403 },
      )
    }
    if (target !== user.login) {
      return NextResponse.json(
        { ok: false, error: 'You can only assign a project to yourself.' },
        { status: 403 },
      )
    }
  }

  const ok = await setProjectOwner(slug, target, user.login)
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: 'Could not save owner (Supabase service role not configured?).' },
      { status: 500 },
    )
  }
  return NextResponse.json({ ok: true, slug, login: target })
}
