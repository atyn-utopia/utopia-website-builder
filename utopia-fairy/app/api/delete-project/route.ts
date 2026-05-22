import { NextRequest, NextResponse } from 'next/server'
import { rm, stat } from 'fs/promises'
import path from 'path'
import { deleteSnapshot } from '@/lib/snapshotStore'

export const runtime = 'nodejs'
export const maxDuration = 30

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

    const repoRoot = path.resolve(process.cwd(), '..')
    const projectDir = path.join(repoRoot, 'projects', slug)

    let folderDeleted = false
    let folderError: string | null = null
    try {
      const s = await stat(projectDir)
      if (s.isDirectory()) {
        await rm(projectDir, { recursive: true, force: true })
        folderDeleted = true
      }
    } catch (err) {
      // ENOENT (folder doesn't exist) is fine — we're already in the state we wanted.
      // Any other error is real.
      const code = (err as NodeJS.ErrnoException).code
      if (code !== 'ENOENT') {
        folderError = err instanceof Error ? err.message : 'Unknown filesystem error'
      }
    }

    let snapshotDeleted = false
    let snapshotError: string | null = null
    try {
      snapshotDeleted = await deleteSnapshot(slug)
    } catch (err) {
      snapshotError = err instanceof Error ? err.message : 'Unknown snapshot error'
    }

    if (folderError && snapshotError) {
      return NextResponse.json(
        { success: false, error: `Both deletions failed. Folder: ${folderError}. Snapshot: ${snapshotError}` },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      slug,
      folderDeleted,
      snapshotDeleted,
      folderError,
      snapshotError,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
