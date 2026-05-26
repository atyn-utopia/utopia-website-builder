import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const CANONICAL_HOST = 'sewa-motor-malaysia.utopiaai.my'

// Hosts we want to 301 to the canonical alias. Vercel auto-assigns the
// `*.vercel.app` URL and there's no way to fully disable it, so we
// redirect it instead. Add other non-canonical aliases here as they
// surface (e.g. if a custom domain gets attached and we want it to be
// canonical, swap CANONICAL_HOST and add the old one here).
const NON_CANONICAL_HOSTS = new Set<string>([
  'sewa-motor-malaysia.vercel.app',
])

const intl = createMiddleware(routing)

export default function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''

  if (NON_CANONICAL_HOSTS.has(host)) {
    const dest = new URL(req.nextUrl.toString())
    dest.protocol = 'https:'
    dest.host = CANONICAL_HOST
    return NextResponse.redirect(dest, 308)
  }

  return intl(req)
}

export const config = {
  matcher: ['/', '/(en|ms|zh)/:path*'],
}
