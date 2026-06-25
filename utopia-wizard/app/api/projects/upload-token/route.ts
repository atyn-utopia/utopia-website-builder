import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { getUserToken } from '@/lib/wizardUsers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Return the signed-in user's OWN GitHub token to their browser, so the client
 * can upload large brand assets straight to GitHub (bypassing Vercel's ~4.5 MB
 * function body limit). Only ever returns the caller's own token.
 *
 * Security: this is acceptable for an internal team using their own tokens —
 * the token is the user's own credential, returned only to their authenticated
 * session over HTTPS. Do NOT expose this for untrusted/public users.
 */
export async function GET() {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  }
  const token = await getUserToken(user.login)
  if (!token) return NextResponse.json({ ok: false, error: 'No stored GitHub token.' }, { status: 400 })
  return NextResponse.json({ ok: true, token })
}
