import { NextResponse } from 'next/server'
import { getPlaybook, deletePlaybook } from '@/lib/playbookStore'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** A single teammate's playbook (raw markdown + metadata) for the viewer. */
export async function GET(_req: Request, { params }: { params: Promise<{ login: string }> }) {
  const { login } = await params
  const pb = await getPlaybook(login)
  if (!pb) return NextResponse.json({ ok: false, error: 'No playbook for that user.' }, { status: 404 })
  return NextResponse.json({ ok: true, playbook: pb })
}

/** Delete a playbook — only your own. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ login: string }> }) {
  const { login } = await params
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  }
  if (user.login !== login) {
    return NextResponse.json({ ok: false, error: 'You can only delete your own playbook.' }, { status: 403 })
  }
  const ok = await deletePlaybook(login)
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 })
}
