import { NextResponse } from 'next/server'
import { currentUser } from '@/lib/session'
import { listPlaybooks } from '@/lib/playbookStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Team-visible list of all playbooks (metadata only) + who's viewing. */
export async function GET() {
  const [user, playbooks] = await Promise.all([currentUser(), listPlaybooks()])
  return NextResponse.json({ viewer: user?.login ?? null, playbooks })
}
