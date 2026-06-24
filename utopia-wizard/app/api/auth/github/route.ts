import { NextResponse } from 'next/server'
import { authorizeUrl, oauthConfigured } from '@/lib/githubOAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATE_COOKIE = 'uf-oauth-state'
const FROM_COOKIE = 'uf-oauth-from'

/**
 * Kick off the GitHub OAuth web flow. Stashes a random CSRF `state` (and the
 * post-login redirect target) in short-lived httpOnly cookies, then bounces to
 * GitHub's authorize endpoint.
 */
export async function GET(req: Request) {
  if (!oauthConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'GitHub OAuth not configured (GITHUB_OAUTH_CLIENT_ID/SECRET).' },
      { status: 500 },
    )
  }

  const state = crypto.randomUUID()
  const from = new URL(req.url).searchParams.get('from') ?? '/'
  const res = NextResponse.redirect(authorizeUrl(req, state))

  const cookieBase = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600, // 10 minutes — just long enough to complete the round-trip
  }
  res.cookies.set(STATE_COOKIE, state, cookieBase)
  // Only honor app-relative redirect targets (avoid open-redirect via ?from=).
  res.cookies.set(FROM_COOKIE, from.startsWith('/') ? from : '/', cookieBase)
  return res
}
