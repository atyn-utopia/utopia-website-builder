import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { runChecklist } from '@/lib/runChecklist'
import { totalCheckCount } from '@/lib/checklist'
import { dataMode, projectsDir } from '@/lib/dataSource'
import { readAllSnapshots } from '@/lib/snapshotStore'

export const dynamic = 'force-dynamic'

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
      slugs.map(({ slug, createdAt }) =>
        runChecklist(slug, dir)
          .then((r) => ({
            slug,
            domain: r.domain,
            productSlug: r.productSlug,
            deployUrl: r.deployUrl,
            passed: r.passed,
            total: r.total,
            failedCount: r.failedCount,
            groups: r.groups.map((g) => ({
              name: g.name,
              passed: g.items.filter((i) => i.status === 'pass').length,
              total: g.items.length,
            })),
            createdAt,
          }))
          .catch(() => null),
      ),
    )

    const projects = runs.filter(Boolean)
    projects.sort((a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime())

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
      passed: r.passed,
      total: r.total,
      failedCount: r.failed_count,
      groups: (r.groups as { name: string; items: { status: string }[] }[]).map((g) => ({
        name: g.name,
        passed: g.items.filter((i) => i.status === 'pass').length,
        total: g.items.length,
      })),
      createdAt: r.ran_at,
    }))
    // Sort newest first by ran_at; ties keep original (already sorted by Supabase).
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
