import { NextResponse } from 'next/server'
import { readSnapshot } from '@/lib/snapshotStore'

export const dynamic = 'force-dynamic'

/** Project detail — read from the Supabase snapshot (no disk). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const row = await readSnapshot(slug)
    if (!row) return NextResponse.json({ error: `no snapshot for ${slug}` }, { status: 404 })
    return NextResponse.json({
      slug: row.slug,
      domain: row.domain,
      fallbackPhone: row.fallback_phone,
      domainCandidates: row.domain_candidates,
      registered: row.registered,
      phones: row.phones,
      products: row.products,
      blogs: row.blogs,
      hardcoded: row.hardcoded ?? [],
      blogHardcoded: row.blog_hardcoded ?? [],
      liveStatus: row.live_status,
      ranAt: row.ran_at,
      mode: 'snapshot',
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
