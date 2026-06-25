import { NextRequest, NextResponse } from 'next/server'
import { deleteSnapshot } from '@/lib/snapshotStore'
import { untrackProject } from '@/lib/wizardUsers'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Stop tracking a project in the wizard: disconnect its repo (user_repos),
 * clear its ownership (project_owners), and delete its snapshot. The GitHub
 * repo and Supabase data (phones/products/blog) are NOT touched — nothing on
 * disk, nothing destructive to the source.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as { slug?: string; confirm?: string } | null
    const slug = body?.slug?.trim() ?? ''
    const confirm = body?.confirm?.trim() ?? ''

    if (!slug) return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 })
    if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ success: false, error: 'Invalid slug format' }, { status: 400 })
    if (confirm !== slug) return NextResponse.json({ success: false, error: 'Confirmation slug does not match' }, { status: 400 })

    // Disconnect the repo + clear ownership so the scanner stops re-creating it.
    await untrackProject(slug)
    const snapshotDeleted = await deleteSnapshot(slug)

    return NextResponse.json({ success: true, slug, snapshotDeleted })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
