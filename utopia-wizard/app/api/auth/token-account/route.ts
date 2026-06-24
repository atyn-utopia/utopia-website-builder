import { NextResponse } from 'next/server'
import { fetchGithubUser, isAllowed } from '@/lib/githubOAuth'
import {
  makeAuthToken,
  AUTH_COOKIE,
  ACCOUNTS_COOKIE,
  COOKIE_OPTIONS,
  readAccountsToken,
  makeAccountsToken,
} from '@/lib/auth'
import { encryptToken, tokenCryptoConfigured } from '@/lib/cryptoToken'
import { upsertWizardUser } from '@/lib/wizardUsers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Add (or sign in with) a GitHub account via a Personal Access Token — no OAuth
 * redirect, so it sidesteps GitHub's single-session limit and makes adding a
 * second account frictionless. Public route: validates the token against
 * GitHub + the allowlist itself, then mints the session and updates the roster.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string } | null
  const token = body?.token?.trim()
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Paste a GitHub token.' }, { status: 400 })
  }

  const user = await fetchGithubUser(token)
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or expired token (needs read:user).' },
      { status: 400 },
    )
  }
  if (!isAllowed(user.login)) {
    return NextResponse.json(
      { ok: false, error: `@${user.login} is not on the team allowlist.` },
      { status: 403 },
    )
  }

  // Store the user + encrypted token (best-effort; also used for repo cloning).
  try {
    const ciphertext = tokenCryptoConfigured() ? await encryptToken(token) : undefined
    await upsertWizardUser({
      githubLogin: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      tokenCiphertext: ciphertext,
    })
  } catch { /* session still works without stored token */ }

  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_OPTIONS.ttlSeconds,
  }

  const res = NextResponse.json({ ok: true, login: user.login })
  // Make the just-added account active.
  res.cookies.set(AUTH_COOKIE, await makeAuthToken(user.login), cookieOpts)

  // Append to the signed roster (read existing from the request cookie).
  const existing = (req.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ACCOUNTS_COOKIE}=`))
    ?.split('=')[1]
  const roster = await readAccountsToken(existing ? decodeURIComponent(existing) : null)
  roster.push(user.login)
  res.cookies.set(ACCOUNTS_COOKIE, await makeAccountsToken(roster), cookieOpts)

  return res
}
