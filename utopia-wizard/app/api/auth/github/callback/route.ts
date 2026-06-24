import { NextResponse } from 'next/server'
import {
  exchangeCodeForToken,
  fetchGithubUser,
  isAllowed,
  oauthConfigured,
} from '@/lib/githubOAuth'
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

const STATE_COOKIE = 'uf-oauth-state'
const FROM_COOKIE = 'uf-oauth-from'

/** Redirect back to the login page with an error code in the query string. */
function loginError(req: Request, code: string): NextResponse {
  const url = new URL('/login', req.url)
  url.searchParams.set('error', code)
  const res = NextResponse.redirect(url)
  res.cookies.delete(STATE_COOKIE)
  res.cookies.delete(FROM_COOKIE)
  return res
}

export async function GET(req: Request) {
  if (!oauthConfigured()) return loginError(req, 'oauth_unconfigured')

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  // CSRF: the returned state must match the cookie we set in the start route.
  const cookieState = req.headers
    .get('cookie')
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${STATE_COOKIE}=`))
    ?.split('=')[1]

  if (!code || !state || !cookieState || state !== cookieState) {
    return loginError(req, 'bad_state')
  }

  const token = await exchangeCodeForToken(req, code)
  if (!token) return loginError(req, 'exchange_failed')

  const user = await fetchGithubUser(token)
  if (!user) return loginError(req, 'user_fetch_failed')

  // Allowlist gate — only listed teammates get in.
  if (!isAllowed(user.login)) return loginError(req, 'not_allowed')

  // Persist the user + encrypted token (best-effort; never blocks login).
  try {
    const ciphertext = tokenCryptoConfigured() ? await encryptToken(token) : undefined
    await upsertWizardUser({
      githubLogin: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      tokenCiphertext: ciphertext,
    })
  } catch { /* identity still works without the stored token */ }

  // Mint the identity session and redirect to the original target.
  const fromCookie = req.headers
    .get('cookie')
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${FROM_COOKIE}=`))
    ?.split('=')[1]
  const dest = fromCookie ? decodeURIComponent(fromCookie) : '/'

  const sessionToken = await makeAuthToken(user.login)
  const res = NextResponse.redirect(new URL(dest.startsWith('/') ? dest : '/', req.url))
  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_OPTIONS.ttlSeconds,
  }
  res.cookies.set(AUTH_COOKIE, sessionToken, cookieOpts)

  // Add this login to the signed account roster so the user can switch back to
  // it later without re-running OAuth.
  const cookieHeader = req.headers.get('cookie') ?? ''
  const existingRoster = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ACCOUNTS_COOKIE}=`))
    ?.split('=')[1]
  const roster = await readAccountsToken(existingRoster ? decodeURIComponent(existingRoster) : null)
  roster.push(user.login)
  res.cookies.set(ACCOUNTS_COOKIE, await makeAccountsToken(roster), cookieOpts)

  res.cookies.delete(STATE_COOKIE)
  res.cookies.delete(FROM_COOKIE)
  return res
}
