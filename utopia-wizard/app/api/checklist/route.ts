import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { runChecklist, getExpandedProjectInfo } from '@/lib/runChecklist'
import { totalCheckCount } from '@/lib/checklist'
import { dataMode, projectsDir } from '@/lib/dataSource'
import { readAllSnapshots } from '@/lib/snapshotStore'
import { getRegisteredDomains } from '@/lib/supabaseChecks'
import { getProjectOwners } from '@/lib/wizardUsers'
import { currentUser } from '@/lib/session'

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

/** A project row carries its owner login (null = unowned legacy project). */
interface Scopable {
  slug: string
  owner: string | null
}

/**
 * Filter the project list to what the signed-in user should see.
 *   - `showAll` (toggle), open mode (no user), or admin → everything
 *   - otherwise → projects owned by the user, plus still-unowned ones so the
 *     legacy backlog stays visible until someone claims it.
 * Returns the filtered list + the viewer context for the client.
 */
async function scopeProjects<T extends Scopable>(
  projects: T[],
  showAll: boolean,
): Promise<{ projects: T[]; viewer: string | null; isAdmin: boolean; scoped: boolean }> {
  const user = await currentUser()
  // No identity (open mode) → cannot scope; show all.
  if (!user) return { projects, viewer: null, isAdmin: false, scoped: false }
  if (showAll) {
    return { projects, viewer: user.login, isAdmin: user.isAdmin, scoped: false }
  }
  const mine = projects.filter((p) => p.owner === user.login || p.owner == null)
  return { projects: mine, viewer: user.login, isAdmin: user.isAdmin, scoped: true }
}

export async function GET(req: Request) {
  const showAll = new URL(req.url).searchParams.get('all') === '1'
  if (dataMode() === 'snapshot') {
    return serveFromSnapshots(showAll)
  }
  return serveLive(showAll)
}

async function serveLive(showAll: boolean) {
  try {
    const dir = projectsDir()
    const [entries, owners] = await Promise.all([readdir(dir), getProjectOwners()])

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
            owner: owners.get(slug) ?? null,
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
              failed: g.items.filter((i) => i.status === 'fail').length,
              total: g.items.length,
            })),
            createdAt,
          }
        } catch {
          return null
        }
      }),
    )

    const all = runs.filter((p): p is NonNullable<typeof p> => p !== null)
    all.sort((a, b) => new Date(b.projectCreatedAt).getTime() - new Date(a.projectCreatedAt).getTime())

    const { projects, viewer, isAdmin, scoped } = await scopeProjects(all, showAll)

    return NextResponse.json({
      projects,
      totalChecks: totalCheckCount(),
      mode: 'live',
      viewer,
      isAdmin,
      scoped,
    })
  } catch (e) {
    return NextResponse.json(
      { projects: [], totalChecks: totalCheckCount(), mode: 'live', error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}

async function serveFromSnapshots(showAll: boolean) {
  try {
    const [rows, owners] = await Promise.all([readAllSnapshots(), getProjectOwners()])
    const all = rows.map((r) => ({
      slug: r.slug,
      owner: owners.get(r.slug) ?? null,
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
        failed: g.items.filter((i) => i.status === 'fail').length,
        total: g.items.length,
      })),
      createdAt: r.project_created_at ?? r.ran_at,
    }))
    const { projects, viewer, isAdmin, scoped } = await scopeProjects(all, showAll)
    return NextResponse.json({
      projects,
      totalChecks: all[0]?.total ?? 0,
      mode: 'snapshot',
      ranAt: rows[0]?.ran_at ?? null,
      viewer,
      isAdmin,
      scoped,
    })
  } catch (e) {
    return NextResponse.json(
      { projects: [], totalChecks: 0, mode: 'snapshot', error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}
