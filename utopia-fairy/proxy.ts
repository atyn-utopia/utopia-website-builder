import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE, isAuthConfigured, verifyAuthToken } from '@/lib/auth'

const PUBLIC_PREFIXES = ['/login', '/api/login']

function isPublic(pathname: string): boolean {
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) return true
  return false
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // If MONITOR_PASSCODE is not set (e.g. CI scanner env), disable auth so the
  // monitor doesn't lock itself out. Set the env to enable.
  if (!isAuthConfigured()) return NextResponse.next()

  if (isPublic(pathname)) return NextResponse.next()

  const token = req.cookies.get(AUTH_COOKIE)?.value
  const ok = await verifyAuthToken(token)
  if (ok) return NextResponse.next()

  // For browser navigation → redirect to /login. For API/AJAX → 401 JSON.
  const accept = req.headers.get('accept') ?? ''
  if (pathname.startsWith('/api') || !accept.includes('text/html')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  // Run on everything except static assets and _next internals.
  // The negative lookahead excludes any file under /public/ (anything with a
  // dot extension at the end of the path) so logos, gifs, sw.js, etc. don't
  // hit the auth gate.
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}
