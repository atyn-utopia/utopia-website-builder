import { NextResponse } from 'next/server'
import { currentAccounts, currentUser } from '@/lib/session'
import {
  makeAuthToken,
  makeAccountsToken,
  AUTH_COOKIE,
  ACCOUNTS_COOKIE,
  COOKIE_OPTIONS,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Remove an account from this browser's roster. Does NOT delete the stored
 * user/token in Supabase — only drops it from the switch list here.
 *
 * If the removed account was active, the active session moves to the first
 * remaining account (the main), or is signed out if none remain.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { login?: string } | null
  const target = body?.login?.trim()
  if (!target) {
    return NextResponse.json({ ok: false, error: 'login required.' }, { status: 400 })
  }

  const roster = await currentAccounts()
  const remaining = roster.filter((l) => l !== target)
  const user = await currentUser()
  const removingActive = user?.login === target

  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_OPTIONS.ttlSeconds,
  }

  const res = NextResponse.json({
    ok: true,
    accounts: remaining,
    active: removingActive ? (remaining[0] ?? null) : (user?.login ?? null),
    signedOut: removingActive && remaining.length === 0,
  })

  // Rewrite the roster cookie.
  if (remaining.length === 0) {
    res.cookies.delete(ACCOUNTS_COOKIE)
  } else {
    res.cookies.set(ACCOUNTS_COOKIE, await makeAccountsToken(remaining), cookieOpts)
  }

  // If we removed the active account, move to the first remaining (or sign out).
  if (removingActive) {
    if (remaining.length > 0) {
      res.cookies.set(AUTH_COOKIE, await makeAuthToken(remaining[0]), cookieOpts)
    } else {
      res.cookies.delete(AUTH_COOKIE)
    }
  }

  return res
}
