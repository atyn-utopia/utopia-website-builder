import { NextResponse } from 'next/server'
import { currentAccounts } from '@/lib/session'
import { makeAuthToken, AUTH_COOKIE, COOKIE_OPTIONS } from '@/lib/auth'
import { isAllowed } from '@/lib/githubOAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Switch the active account to another login the user has already authed in
 * this browser (proven by membership in the signed roster cookie). No re-OAuth
 * needed. Re-checks the allowlist so a since-removed teammate can't switch in.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { login?: string } | null
  const target = body?.login?.trim()
  if (!target) {
    return NextResponse.json({ ok: false, error: 'login required.' }, { status: 400 })
  }

  const roster = await currentAccounts()
  if (!roster.includes(target)) {
    return NextResponse.json(
      { ok: false, error: 'That account is not signed in on this device.' },
      { status: 403 },
    )
  }
  if (!isAllowed(target)) {
    return NextResponse.json({ ok: false, error: 'That account is no longer allowed.' }, { status: 403 })
  }

  const res = NextResponse.json({ ok: true, active: target })
  res.cookies.set(AUTH_COOKIE, await makeAuthToken(target), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_OPTIONS.ttlSeconds,
  })
  return res
}
