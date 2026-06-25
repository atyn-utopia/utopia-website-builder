import { NextResponse } from 'next/server'
import { getChecklist, deleteChecklist } from '@/lib/checklistStore'
import { currentUser } from '@/lib/session'
import { PASSCODE_LOGIN } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** A single teammate's checklist (items + metadata). */
export async function GET(_req: Request, { params }: { params: Promise<{ login: string }> }) {
  const { login } = await params
  const cl = await getChecklist(login)
  if (!cl) return NextResponse.json({ ok: false, error: 'No checklist for that user.' }, { status: 404 })
  return NextResponse.json({ ok: true, checklist: cl })
}

/** Delete a checklist — only your own. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ login: string }> }) {
  const { login } = await params
  const user = await currentUser()
  if (!user || user.login === PASSCODE_LOGIN) {
    return NextResponse.json({ ok: false, error: 'Sign in with GitHub.' }, { status: 401 })
  }
  if (user.login !== login) {
    return NextResponse.json({ ok: false, error: 'You can only delete your own checklist.' }, { status: 403 })
  }
  const ok = await deleteChecklist(login)
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 })
}
