import { NextRequest, NextResponse } from 'next/server'
import { readSnapshot } from '@/lib/snapshotStore'

export const dynamic = 'force-dynamic'

/**
 * Deploy status for a project — derived from its Supabase snapshot (deploy_url,
 * else the configured domain). No disk / local-port scanning.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ deployUrl: null, localUrl: null })

  let deployUrl: string | null = null
  try {
    const snap = await readSnapshot(slug)
    if (snap?.deploy_url) deployUrl = snap.deploy_url
    else if (snap?.domain) deployUrl = `https://${snap.domain}`
  } catch { /* no snapshot / no DB env */ }

  return NextResponse.json({ deployUrl, localUrl: null })
}
