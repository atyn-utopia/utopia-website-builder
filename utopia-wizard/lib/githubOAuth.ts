/**
 * GitHub OAuth web-flow helpers (internal team sign-in).
 *
 * Flow: /api/auth/github → GitHub authorize → /api/auth/github/callback.
 * The callback exchanges the code for a token, fetches the user, checks the
 * explicit allowlist, then mints the identity session cookie.
 *
 * The redirect_uri is derived from the incoming request host (so the same
 * code works on localhost + production) — the host's callback path must match
 * the URL registered on the GitHub OAuth app.
 */

const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID ?? ''
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET ?? ''

export const CALLBACK_PATH = '/api/auth/github/callback'

export function oauthConfigured(): boolean {
  return !!(CLIENT_ID && CLIENT_SECRET)
}

/** Comma-separated ALLOWED_GITHUB_LOGINS → lowercased set. */
export function allowedLogins(): Set<string> {
  return new Set(
    (process.env.ALLOWED_GITHUB_LOGINS ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  )
}

export function isAllowed(login: string): boolean {
  const set = allowedLogins()
  // Empty allowlist = locked down (deny all) rather than open, so a missing
  // env var can never accidentally admit the whole world.
  if (set.size === 0) return false
  return set.has(login.toLowerCase())
}

/**
 * Best base URL for redirect_uri. Honors x-forwarded-* (Vercel sits behind a
 * proxy) and falls back to the Host header.
 */
export function baseUrlFromRequest(req: Request): string {
  const h = req.headers
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? ''
  return `${proto}://${host}`
}

export function authorizeUrl(req: Request, state: string): string {
  const redirectUri = `${baseUrlFromRequest(req)}${CALLBACK_PATH}`
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    // `read:user` to read the login; `repo` so the stored token can drive git
    // operations as the user (push to their repos).
    scope: 'read:user repo',
    state,
    allow_signup: 'false',
  })
  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export interface GithubUser {
  login: string
  name: string | null
  avatarUrl: string | null
}

/** Exchange the OAuth code for an access token. Returns null on failure. */
export async function exchangeCodeForToken(req: Request, code: string): Promise<string | null> {
  const redirectUri = `${baseUrlFromRequest(req)}${CALLBACK_PATH}`
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { access_token?: string; error?: string }
    return json.access_token ?? null
  } catch {
    return null
  }
}

/** Fetch the authenticated user's profile with the access token. */
export async function fetchGithubUser(token: string): Promise<GithubUser | null> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'utopia-wizard',
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const u = (await res.json()) as { login: string; name: string | null; avatar_url: string | null }
    if (!u.login) return null
    return { login: u.login, name: u.name ?? null, avatarUrl: u.avatar_url ?? null }
  } catch {
    return null
  }
}
