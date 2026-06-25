import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Passcode login has been removed — sign-in is GitHub-only now. This endpoint
 * is retired and always refuses. (MONITOR_PASSCODE still serves as the session
 * cookie's HMAC signing key; it is no longer a login credential.)
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'Passcode login is disabled. Sign in with GitHub.' },
    { status: 410 },
  )
}
