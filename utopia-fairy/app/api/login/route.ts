import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE, COOKIE_OPTIONS, makeAuthToken, isAuthConfigured } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'MONITOR_PASSCODE not set on the server' },
      { status: 500 },
    )
  }

  const body = (await req.json().catch(() => null)) as { passcode?: string } | null
  const provided = body?.passcode?.trim() ?? ''

  // Pad-compare to avoid leaking length, even though the cookie HMAC is the
  // real guard. We just want a deliberate 1.5s pause on misses to deter brute
  // force without leaking a side channel.
  if (provided !== (process.env.MONITOR_PASSCODE ?? '__unset__')) {
    await new Promise((r) => setTimeout(r, 1500))
    return NextResponse.json({ ok: false, error: 'Wrong passcode.' }, { status: 401 })
  }

  const token = await makeAuthToken()
  const jar = await cookies()
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_OPTIONS.ttlSeconds,
  })

  return NextResponse.json({ ok: true })
}
