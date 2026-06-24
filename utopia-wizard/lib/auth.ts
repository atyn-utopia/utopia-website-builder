/**
 * HMAC-signed cookie auth. The shared passcode in MONITOR_PASSCODE doubles as
 * the HMAC key, so rotating it invalidates every active session.
 *
 * The token now carries an identity:  `${login}.${exp}.${sig}`
 *   - login `*`           → passcode / legacy session (sees all projects)
 *   - login `<gh-login>`  → a GitHub-authed teammate (step 5 / OAuth)
 * The 2-part legacy format `${exp}.${sig}` is still accepted and treated as
 * login `*`, so existing passcode sessions keep working across the upgrade.
 *
 * Uses Web Crypto (works in both Node + Edge runtimes), so the same helpers
 * can be called from middleware and API routes.
 */

export const AUTH_COOKIE = 'uf-auth'

/**
 * Roster of GitHub logins that have completed OAuth in this browser. Signed the
 * same way as the session token so it can't be forged. Lets a user switch
 * between already-authenticated accounts without re-running OAuth each time.
 */
export const ACCOUNTS_COOKIE = 'uf-accounts'

/** Sentinel login for passcode / legacy sessions — granted "see all". */
export const PASSCODE_LOGIN = '*'

export interface AuthSession {
  login: string
  exp: number
}
const TTL_SECONDS = 30 * 24 * 60 * 60 // 30 days

function getSecret(): string {
  return process.env.MONITOR_PASSCODE ?? ''
}

export function isAuthConfigured(): boolean {
  return !!getSecret()
}

async function hmac(key: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const k = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(data))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

/**
 * Mint a session token for `login` (default `*` = passcode/legacy = sees all).
 * GitHub-authed sessions pass the user's github login.
 */
export async function makeAuthToken(
  login: string = PASSCODE_LOGIN,
  now: number = Date.now(),
): Promise<string> {
  const exp = now + TTL_SECONDS * 1000
  const payload = `${login}.${exp}`
  const sig = await hmac(getSecret(), payload)
  return `${payload}.${sig}`
}

/**
 * Verify + decode a token. Returns the session ({ login, exp }) or null.
 * Accepts both the new 3-part `${login}.${exp}.${sig}` form and the legacy
 * 2-part `${exp}.${sig}` form (decoded as login `*`).
 */
export async function readAuthToken(
  token: string | undefined | null,
): Promise<AuthSession | null> {
  const secret = getSecret()
  if (!token || !secret) return null
  const parts = token.split('.')

  let login: string
  let expStr: string
  let sig: string
  let payload: string

  if (parts.length === 3) {
    ;[login, expStr, sig] = parts
    payload = `${login}.${expStr}`
  } else if (parts.length === 2) {
    // Legacy passcode token.
    ;[expStr, sig] = parts
    login = PASSCODE_LOGIN
    payload = expStr
  } else {
    return null
  }

  const exp = Number.parseInt(expStr, 10)
  if (!Number.isFinite(exp) || Date.now() > exp) return null
  const expected = await hmac(secret, payload)
  if (!timingSafeEqual(sig, expected)) return null
  return { login, exp }
}

/** Boolean gate kept for the middleware/proxy (which only needs valid/not). */
export async function verifyAuthToken(token: string | undefined | null): Promise<boolean> {
  return (await readAuthToken(token)) !== null
}

/**
 * Sign a roster of logins → `${csv}.${exp}.${sig}`. GitHub logins contain no
 * dots and the list is comma-joined, so the three segments are unambiguous.
 */
export async function makeAccountsToken(
  logins: string[],
  now: number = Date.now(),
): Promise<string> {
  const csv = Array.from(new Set(logins.filter(Boolean))).join(',')
  const exp = now + TTL_SECONDS * 1000
  const payload = `${csv}.${exp}`
  const sig = await hmac(getSecret(), payload)
  return `${payload}.${sig}`
}

/** Verify + decode the roster cookie → list of logins (empty if invalid). */
export async function readAccountsToken(token: string | undefined | null): Promise<string[]> {
  const secret = getSecret()
  if (!token || !secret) return []
  const parts = token.split('.')
  if (parts.length !== 3) return []
  const [csv, expStr, sig] = parts
  const exp = Number.parseInt(expStr, 10)
  if (!Number.isFinite(exp) || Date.now() > exp) return []
  const expected = await hmac(secret, `${csv}.${expStr}`)
  if (!timingSafeEqual(sig, expected)) return []
  return csv.split(',').filter(Boolean)
}

export const COOKIE_OPTIONS = {
  name: AUTH_COOKIE,
  ttlSeconds: TTL_SECONDS,
}
