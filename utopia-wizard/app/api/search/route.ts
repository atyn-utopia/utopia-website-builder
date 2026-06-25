import { NextResponse } from 'next/server'
import { readAllSnapshots } from '@/lib/snapshotStore'
import { listAllActiveRepos, getProjectOwners } from '@/lib/wizardUsers'
import { listPlaybooks } from '@/lib/playbookStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export interface SearchResult { type: 'project' | 'repo' | 'playbook'; label: string; sub: string; href: string }

/** Universal search across projects, connected repos, and playbooks. */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get('q') ?? '').trim().toLowerCase()
  if (q.length < 2) return NextResponse.json({ results: [] })

  const [snapshots, repos, playbooks, owners] = await Promise.all([
    readAllSnapshots().catch(() => []),
    listAllActiveRepos().catch(() => []),
    listPlaybooks().catch(() => []),
    getProjectOwners().catch(() => new Map<string, string>()),
  ])

  const results: SearchResult[] = []

  // Projects (from the monitor snapshots)
  for (const s of snapshots) {
    const hay = [s.slug, s.domain, s.company_name].filter(Boolean).join(' ').toLowerCase()
    if (hay.includes(q)) {
      const owner = owners.get(s.slug)
      results.push({
        type: 'project',
        label: s.slug,
        sub: [s.company_name, s.domain, owner ? `@${owner}` : null].filter(Boolean).join(' · ') || 'project',
        href: `/wish/${s.slug}`,
      })
    }
  }

  // Connected repos
  for (const r of repos) {
    const hay = `${r.repo_full_name} ${r.project_slug} ${r.github_login}`.toLowerCase()
    if (hay.includes(q)) {
      results.push({ type: 'repo', label: r.repo_full_name, sub: `repo · @${r.github_login}`, href: '/repos' })
    }
  }

  // Playbooks
  for (const p of playbooks) {
    const hay = `${p.github_login} ${p.title ?? ''} ${p.repo_full_name}`.toLowerCase()
    if (hay.includes(q)) {
      results.push({ type: 'playbook', label: p.title || p.repo_full_name, sub: `playbook · @${p.github_login}`, href: '/playbooks' })
    }
  }

  // Cap per type so one category can't flood the dropdown.
  const cap = (t: SearchResult['type'], n: number) => results.filter((r) => r.type === t).slice(0, n)
  return NextResponse.json({ results: [...cap('project', 6), ...cap('repo', 5), ...cap('playbook', 5)] })
}
