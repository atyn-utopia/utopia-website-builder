import { NextResponse } from 'next/server'
import { readSnapshot } from '@/lib/snapshotStore'

export const dynamic = 'force-dynamic'

/** Single-project checklist — read from the Supabase snapshot (no disk). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const row = await readSnapshot(slug)
    if (!row) return NextResponse.json({ error: `no snapshot for ${slug}` }, { status: 404 })
    return NextResponse.json({
      slug: row.slug,
      domain: row.domain,
      productSlug: row.product_slug,
      deployUrl: row.deploy_url,
      passed: row.passed,
      total: row.total,
      failedCount: row.failed_count,
      groups: row.groups,
      ranAt: row.ran_at,
      mode: 'snapshot',
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
