import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'
import { getChecklistMode, setChecklistMode } from '@/lib/wizardUsers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Read the signed-in user's active checklist mode. */
export async function GET() {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) return NextResponse.json({ mode: 'default' })
  return NextResponse.json({ mode: await getChecklistMode(user.login) })
}

/** Set the mode. Body: { mode: 'default' | 'generated' }. */
export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  }
  const body = (await req.json().catch(() => null)) as { mode?: string } | null
  const mode = body?.mode === 'generated' ? 'generated' : 'default'
  const ok = await setChecklistMode(user.login, mode)
  return NextResponse.json({ ok, mode }, { status: ok ? 200 : 500 })
}
