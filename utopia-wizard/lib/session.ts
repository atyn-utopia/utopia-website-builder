/**
 * Server-side session helpers for route handlers / server components.
 *
 * Kept separate from auth.ts because it imports `next/headers` (cookies()),
 * which must not be pulled into the Edge middleware bundle (proxy.ts reads the
 * cookie off the NextRequest directly instead).
 */

import { cookies } from 'next/headers'
import {
  AUTH_COOKIE,
  ACCOUNTS_COOKIE,
  PASSCODE_LOGIN,
  readAuthToken,
  readAccountsToken,
  isAuthConfigured,
  type AuthSession,
} from './auth'
import { getAdminLogins } from './wizardUsers'

export interface CurrentUser {
  /** GitHub login, or `*` for a passcode/legacy session. */
  login: string
  /** True for `*` sessions or logins flagged is_admin in wizard_users. */
  isAdmin: boolean
}

/**
 * Resolve the signed-in user from the request cookie.
 *
 *  - Auth not configured (CI / open mode) → null caller treats as "show all".
 *  - Passcode / legacy session (login `*`) → isAdmin true (sees all).
 *  - GitHub session → isAdmin reflects the wizard_users.is_admin flag.
 */
export async function currentUser(): Promise<CurrentUser | null> {
  // Open mode: no passcode set means the proxy lets everyone through; there is
  // no identity to scope by, so callers should fall back to showing everything.
  if (!isAuthConfigured()) return null

  const jar = await cookies()
  const token = jar.get(AUTH_COOKIE)?.value
  const session: AuthSession | null = await readAuthToken(token)
  if (!session) return null

  if (session.login === PASSCODE_LOGIN) {
    return { login: PASSCODE_LOGIN, isAdmin: true }
  }

  const admins = await getAdminLogins()
  return { login: session.login, isAdmin: admins.has(session.login) }
}

/** Logins in the signed account roster (accounts authed in this browser). */
export async function currentAccounts(): Promise<string[]> {
  if (!isAuthConfigured()) return []
  const jar = await cookies()
  return readAccountsToken(jar.get(ACCOUNTS_COOKIE)?.value)
}
