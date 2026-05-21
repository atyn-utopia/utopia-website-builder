import { NextResponse } from 'next/server'
import { getExpandedProjectInfo } from '@/lib/runChecklist'
import {
  getPhoneRows,
  getProductRows,
  getBlogRows,
  getBlogContentRows,
  getRegisteredDomains,
} from '@/lib/supabaseChecks'
import { findHardcodedPhones, findBlogHardcodedPhones } from '@/lib/sourceScan'
import { checkLiveDbConnection } from '@/lib/liveStatusCheck'
import { dataMode, projectsDir } from '@/lib/dataSource'
import { readSnapshot } from '@/lib/snapshotStore'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    if (dataMode() === 'snapshot') {
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
    }

    const info = await getExpandedProjectInfo(slug, projectsDir())

    const [registered, phones, products, blogs, blogContent, hardcoded] = await Promise.all([
      getRegisteredDomains(info.domainCandidates),
      getPhoneRows(info.domainCandidates),
      getProductRows(info.domainCandidates),
      getBlogRows(info.domainCandidates),
      getBlogContentRows(info.domainCandidates),
      findHardcodedPhones(info.projectDir),
    ])

    const blogHardcoded = findBlogHardcodedPhones(blogContent)

    const candidateBaseUrls: string[] = []
    if (registered) for (const r of registered) candidateBaseUrls.push(`https://${r.domain}`)
    if (info.deployUrl) candidateBaseUrls.push(info.deployUrl)
    for (const d of info.domainCandidates) {
      const u = `https://${d}`
      if (!candidateBaseUrls.includes(u)) candidateBaseUrls.push(u)
    }
    const dbPhones = Array.from(new Set((phones ?? []).filter((p) => p.is_active).map((p) => p.phone_number)))
    const liveStatus = await checkLiveDbConnection({
      baseUrls: Array.from(new Set(candidateBaseUrls)),
      dbPhones,
      fallbackPhone: info.fallbackPhone,
    })

    return NextResponse.json({
      slug,
      domain: info.domain,
      fallbackPhone: info.fallbackPhone,
      domainCandidates: info.domainCandidates,
      registered,
      phones,
      products,
      blogs,
      hardcoded,
      blogHardcoded,
      liveStatus,
      mode: 'live',
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}
