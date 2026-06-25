import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { listChecklists } from '@/lib/checklistStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Team-visible list of all checklists (metadata only). */
export async function GET() {
  const [user, checklists] = await Promise.all([currentUser(), listChecklists()])
  return NextResponse.json({ viewer: user?.login ?? null, checklists })
}
