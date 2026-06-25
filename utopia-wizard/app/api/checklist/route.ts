import { NextResponse } from 'next/server'
import { readAllSnapshots } from '@/lib/snapshotStore'
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
 *   - `showAll` (toggle) or open mode (no user) → everything
 *   - otherwise → strictly the projects this user owns. Unowned projects (e.g.
 *     the monorepo backlog) are NOT shown in the per-user view — they only
 *     appear under "All", so each teammate sees a clean, isolated list.
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
  const mine = projects.filter((p) => p.owner === user.login)
  return { projects: mine, viewer: user.login, isAdmin: user.isAdmin, scoped: true }
}

export async function GET(req: Request) {
  const showAll = new URL(req.url).searchParams.get('all') === '1'
  return serveFromSnapshots(showAll)
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
