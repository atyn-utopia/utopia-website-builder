import { NextResponse } from 'next/server'
import { currentUser, currentAccounts } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** The active account + the roster of switchable accounts for the UI. */
export async function GET() {
  const [user, accounts] = await Promise.all([currentUser(), currentAccounts()])
  return NextResponse.json({
    active: user?.login ?? null,
    accounts,
  })
}
