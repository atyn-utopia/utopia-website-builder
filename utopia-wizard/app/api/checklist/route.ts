import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { runChecklist, getExpandedProjectInfo } from '@/lib/runChecklist'
import { totalCheckCount } from '@/lib/checklist'
import { dataMode, projectsDir } from '@/lib/dataSource'
import { readAllSnapshots } from '@/lib/snapshotStore'
import { getRegisteredDomains } from '@/lib/supabaseChecks'

export const dynamic = 'force-dynamic'

interface RegisteredEmbed {
  companies?: { name?: string | null } | null
}

function companyFromRegistered(registered: unknown): string | null {
  if (!Array.isArray(registered)) return null
  const rows = registered as RegisteredEmbed[]
  for (const r of rows) {
    const n = r?.companies?.name
    if (n) return n
  }
  return null
}

export async function GET() {
  if (dataMode() === 'snapshot') {
    return serveFromSnapshots()
  }
  return serveLive()
}

async function serveLive() {
  try {
    const dir = projectsDir()
    const entries = await readdir(dir)

    const slugs: { slug: string; createdAt: string }[] = []
    for (const slug of entries) {
      try {
        const s = await stat(path.join(dir, slug, 'inputs.md'))
        slugs.push({ slug, createdAt: s.mtime.toISOString() })
      } catch { /* not a project */ }
    }

    const runs = await Promise.all(
      slugs.map(async ({ slug, createdAt }) => {
        try {
          const r = await runChecklist(slug, dir)
          // Cheap parallel lookup for company name. Cached in supabaseChecks
          // when invoked again for the wish-data endpoint.
          let company: string | null = null
          try {
            const info = await getExpandedProjectInfo(slug, dir)
            const reg = await getRegisteredDomains(info.domainCandidates)
            company = companyFromRegistered(reg)
          } catch { /* leave null */ }
          return {
            slug,
            domain: r.domain,
            productSlug: r.productSlug,
            deployUrl: r.deployUrl,
            company,
            projectCreatedAt: createdAt,
            passed: r.passed,
            total: r.total,
            failedCount: r.failedCount,
            groups: r.groups.map((g) => ({
              name: g.name,
              passed: g.items.filter((i) => i.status === 'pass').length,
              total: g.items.length,
            })),
            createdAt,
          }
        } catch {
          return null
        }
      }),
    )

    const projects = runs.filter(Boolean)
    projects.sort((a, b) => new Date(b!.projectCreatedAt).getTime() - new Date(a!.projectCreatedAt).getTime())

    return NextResponse.json({
      projects,
      totalChecks: totalCheckCount(),
      mode: 'live',
    })
  } catch (e) {
    return NextResponse.json(
      { projects: [], totalChecks: totalCheckCount(), mode: 'live', error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}

async function serveFromSnapshots() {
  try {
    const rows = await readAllSnapshots()
    const projects = rows.map((r) => ({
      slug: r.slug,
      domain: r.domain,
      productSlug: r.product_slug,
      deployUrl: r.deploy_url,
      // Prefer the denormalised columns added in 20260522_project_metadata.
      // Fall back to deriving from the registered JSON / using ran_at if the
      // migration hasn't been applied yet.
      company: r.company_name ?? companyFromRegistered(r.registered),
      projectCreatedAt: r.project_created_at ?? r.ran_at,
      passed: r.passed,
      total: r.total,
      failedCount: r.failed_count,
      groups: (r.groups as { name: string; items: { status: string }[] }[]).map((g) => ({
        name: g.name,
        passed: g.items.filter((i) => i.status === 'pass').length,
        total: g.items.length,
      })),
      createdAt: r.project_created_at ?? r.ran_at,
    }))
    return NextResponse.json({
      projects,
      totalChecks: projects[0]?.total ?? 0,
      mode: 'snapshot',
      ranAt: rows[0]?.ran_at ?? null,
    })
  } catch (e) {
    return NextResponse.json(
      { projects: [], totalChecks: 0, mode: 'snapshot', error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}
