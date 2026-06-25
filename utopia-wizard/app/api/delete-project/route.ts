import { NextRequest, NextResponse } from 'next/server'
import { deleteSnapshot } from '@/lib/snapshotStore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Remove a project from the monitor by deleting its Supabase snapshot. No disk
 * — the project's source lives in its own GitHub repo, untouched.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as { slug?: string; confirm?: string } | null
    const slug = body?.slug?.trim() ?? ''
    const confirm = body?.confirm?.trim() ?? ''

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 })
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ success: false, error: 'Invalid slug format' }, { status: 400 })
    }
    // Guard against accidental triggers from outside the modal.
    if (confirm !== slug) {
      return NextResponse.json({ success: false, error: 'Confirmation slug does not match' }, { status: 400 })
    }

    const snapshotDeleted = await deleteSnapshot(slug)
    return NextResponse.json({ success: true, slug, snapshotDeleted })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
