import { getProjectInfo, ProjectInfo } from './projectInfo'
import { runChecksForProject, CheckGroup, totalCheckCount } from './checklist'
import { scorePct } from './score'
import { findRegisteredDomainsByPhone, findRegisteredDomainsByKeyword, getWebsiteById } from './supabaseChecks'

export interface ChecklistRun {
  slug: string
  domain: string | null
  productSlug: string | null
  fallbackPhone: string | null
  deployUrl: string | null
  domainCandidates: string[]
  passed: number
  total: number
  failedCount: number
  /** 0–100 score = % of applicable (non-skipped) checks passing. Always /100. */
  score: number
  groups: CheckGroup[]
  ranAt: string
}

interface Cached { value: ChecklistRun; ts: number }
const cache = new Map<string, Cached>()
const TTL = 60_000

const STOP_TOKENS = new Set(['malaysia', 'my', 'sdn', 'bhd'])
const TIME_TOKEN = /^(jam|hour|hours|minute|min|day|days)$/i

function slugKeywords(slug: string): string[] {
  // Strip generic tokens (country, units, pure numbers) and try two variants:
  //   1. joined  → 'electricwheelchair' (more specific, try first)
  //   2. first   → 'electrician'        (fallback when joined misses)
  // We always try the more specific first so 'electric' (too generic) only
  // gets used when 'electricwheelchair' returns no rows.
  const tokens = slug.split('-').filter((t) => {
    if (!t || STOP_TOKENS.has(t.toLowerCase())) return false
    if (/^\d+$/.test(t)) return false
    if (TIME_TOKEN.test(t)) return false
    return true
  })
  if (tokens.length === 0) return []

  const out: string[] = []
  const joined = tokens.join('').toLowerCase()
  if (joined.length >= 4) out.push(joined)

  const first = tokens[0].toLowerCase()
  if (first.length >= 6 && first !== joined) out.push(first)

  return out
}

async function expandCandidates(info: ProjectInfo): Promise<ProjectInfo> {
  const extras = new Set<string>()

  // (0) siteId → company_websites.id lookup. The most reliable link: `id` is
  // immutable, so this resolves the CURRENT live domain even after a rename
  // that broke both the slug-keyword (a) and phone (b) paths below. Adding it
  // to the candidate list keeps the data checks (products/phones/blog) green
  // while the dedicated `db-site-id-domain` check separately flags that the
  // repo's config/site.ts domain is now stale.
  if (info.siteId) {
    const row = await getWebsiteById(info.siteId)
    if (row?.domain) extras.add(row.domain.toLowerCase())
  }

  // (a) Slug keyword → company_websites ilike match. Reliably finds custom
  // domains like `electricwheelchairmalaysia.com.my` for slug
  // `electric-wheelchair-malaysia` without pulling in unrelated sites.
  // Try the specific keyword first, fall back to the first token only if
  // the specific one returned nothing.
  for (const kw of slugKeywords(info.slug)) {
    const matches = await findRegisteredDomainsByKeyword(kw)
    if (matches.length > 0) {
      for (const d of matches) extras.add(d)
      break
    }
  }

  // (b) Fallback phone → phone_numbers lookup, but only when the phone is
  // unique to ONE website. Shared/template phones (e.g. the same number
  // across 6 sister sites) would otherwise pollute the candidate list.
  if (info.fallbackPhone) {
    const byPhone = await findRegisteredDomainsByPhone(info.fallbackPhone)
    if (byPhone.length === 1) extras.add(byPhone[0])
  }

  if (extras.size === 0) return info
  const merged = Array.from(new Set([...info.domainCandidates, ...extras]))
  return { ...info, domainCandidates: merged }
}

export async function runChecklist(
  slug: string,
  projectsDir: string,
  useCache = true,
): Promise<ChecklistRun> {
  const cached = cache.get(slug)
  if (useCache && cached && Date.now() - cached.ts < TTL) return cached.value

  const base = await getProjectInfo(slug, projectsDir)
  const info = await expandCandidates(base)
  const groups = await runChecksForProject(info)

  // Every check counts toward the denominator so totals are consistent
  // across projects. Skipped items (missing prerequisites) read as "not yet
  // passing" rather than disappearing from the score.
  const total = totalCheckCount()
  let passed = 0
  let failedCount = 0
  for (const g of groups) {
    for (const item of g.items) {
      if (item.status === 'pass') passed++
      else if (item.status === 'fail') failedCount++
    }
  }

  const value: ChecklistRun = {
    slug,
    domain: info.domain,
    productSlug: info.productSlug,
    fallbackPhone: info.fallbackPhone,
    deployUrl: info.deployUrl,
    domainCandidates: info.domainCandidates,
    passed,
    total,
    failedCount,
    score: scorePct(passed, failedCount),
    groups,
    ranAt: new Date().toISOString(),
  }
  cache.set(slug, { value, ts: Date.now() })
  return value
}

/**
 * Return the full ProjectInfo (including DB-expanded candidates) for a slug.
 * Used by the data-view endpoint so it sees the same expanded alias list.
 */
export async function getExpandedProjectInfo(slug: string, projectsDir: string): Promise<ProjectInfo> {
  const base = await getProjectInfo(slug, projectsDir)
  return expandCandidates(base)
}
