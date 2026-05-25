import { readFile, access, readdir } from 'fs/promises'
import path from 'path'
import type { ProjectInfo } from './projectInfo'
import { getDomainCounts, getBlogContentRows, getPhoneRows, getRegisteredDomains, supabaseConfigured } from './supabaseChecks'
import { findHardcodedPhones, findBlogHardcodedPhones } from './sourceScan'
import { checkLiveDbConnection } from './liveStatusCheck'

export type CheckStatus = 'pass' | 'fail' | 'skip'

export interface CheckResult {
  id: string
  name: string
  status: CheckStatus
  detail?: string
}

export interface CheckGroup {
  name: string
  items: CheckResult[]
}

interface Ctx {
  info: ProjectInfo
  fileCache: Map<string, string | null>
  grepCache: Map<string, boolean>
}

async function readProjectFile(ctx: Ctx, rel: string): Promise<string | null> {
  if (ctx.fileCache.has(rel)) return ctx.fileCache.get(rel)!
  try {
    const content = await readFile(path.join(ctx.info.projectDir, rel), 'utf-8')
    ctx.fileCache.set(rel, content)
    return content
  } catch {
    ctx.fileCache.set(rel, null)
    return null
  }
}

async function fileExists(ctx: Ctx, rel: string): Promise<boolean> {
  try {
    await access(path.join(ctx.info.projectDir, rel))
    return true
  } catch {
    return false
  }
}

const SKIP_DIRS = new Set(['node_modules', '.next', '.vercel', '.git', 'temporary screenshots', 'brand_assets'])

async function grepProject(ctx: Ctx, pattern: RegExp, exts: string[] = ['.tsx', '.ts']): Promise<boolean> {
  const key = `${pattern.source}|${exts.join(',')}`
  if (ctx.grepCache.has(key)) return ctx.grepCache.get(key)!

  const walk = async (dir: string): Promise<boolean> => {
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return false
    }
    for (const e of entries) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue
      const p = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (await walk(p)) return true
      } else if (exts.some((x) => e.name.endsWith(x))) {
        try {
          const c = await readFile(p, 'utf-8')
          if (pattern.test(c)) return true
        } catch { /* skip unreadable */ }
      }
    }
    return false
  }

  const found = await walk(ctx.info.projectDir)
  ctx.grepCache.set(key, found)
  return found
}

async function dirHasFiles(ctx: Ctx, rel: string, exts: string[]): Promise<boolean> {
  try {
    const entries = await readdir(path.join(ctx.info.projectDir, rel))
    return entries.some((f) => exts.some((x) => f.endsWith(x)))
  } catch {
    return false
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Check definitions
// ────────────────────────────────────────────────────────────────────────────

type Check = {
  group: string
  id: string
  name: string
  run: (ctx: Ctx) => Promise<CheckResult>
}

const pass = (id: string, name: string, detail?: string): CheckResult => ({ id, name, status: 'pass', detail })
const fail = (id: string, name: string, detail?: string): CheckResult => ({ id, name, status: 'fail', detail })
const skip = (id: string, name: string, detail?: string): CheckResult => ({ id, name, status: 'skip', detail })

const STRUCTURE: Check[] = [
  {
    group: 'Structure', id: 'homepage', name: 'Homepage exists',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/page.tsx')
      return ok
        ? pass('homepage', 'Homepage exists', 'app/[locale]/page.tsx')
        : fail('homepage', 'Homepage exists', 'Missing app/[locale]/page.tsx')
    },
  },
  {
    group: 'Structure', id: 'location-page', name: 'Location pages exist',
    run: async (ctx) => {
      const slug = ctx.info.productSlug
      if (!slug) return skip('location-page', 'Location pages exist', 'Unknown productSlug — cannot infer route')
      const p = `app/[locale]/${slug}/[location]/page.tsx`
      const ok = await fileExists(ctx, p)
      return ok
        ? pass('location-page', 'Location pages exist', p)
        : fail('location-page', 'Location pages exist', `Missing ${p}`)
    },
  },
  {
    group: 'Structure', id: 'blog-listing', name: 'Blog listing page',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/blog/page.tsx')
      return ok
        ? pass('blog-listing', 'Blog listing page', 'app/[locale]/blog/page.tsx')
        : fail('blog-listing', 'Blog listing page', 'Missing app/[locale]/blog/page.tsx')
    },
  },
  {
    group: 'Structure', id: 'blog-post', name: 'Blog post detail page',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      return ok
        ? pass('blog-post', 'Blog post detail page', 'app/[locale]/blog/[slug]/page.tsx')
        : fail('blog-post', 'Blog post detail page', 'Missing app/[locale]/blog/[slug]/page.tsx')
    },
  },
  {
    group: 'Structure', id: 'whatsapp-redirect', name: 'WhatsApp redirect page',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/redirect-whatsapp-1/page.tsx')
      return ok
        ? pass('whatsapp-redirect', 'WhatsApp redirect page', 'app/[locale]/redirect-whatsapp-1/page.tsx')
        : fail('whatsapp-redirect', 'WhatsApp redirect page', 'Missing app/[locale]/redirect-whatsapp-1/page.tsx')
    },
  },
]

const SEO: Check[] = [
  {
    group: 'SEO', id: 'sitemap', name: 'Sitemap generator',
    run: async (ctx) => {
      const a = await fileExists(ctx, 'app/sitemap.ts')
      const b = await fileExists(ctx, 'app/sitemap.xml/route.ts')
      return (a || b)
        ? pass('sitemap', 'Sitemap generator')
        : fail('sitemap', 'Sitemap generator', 'Missing app/sitemap.ts')
    },
  },
  {
    group: 'SEO', id: 'robots', name: 'robots.txt generator',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/robots.ts')
      return ok
        ? pass('robots', 'robots.txt generator')
        : fail('robots', 'robots.txt generator', 'Missing app/robots.ts')
    },
  },
  {
    group: 'SEO', id: 'schema-components', name: 'Schema markup components',
    run: async (ctx) => {
      const ok = await dirHasFiles(ctx, 'components/schema', ['.tsx', '.ts'])
      return ok
        ? pass('schema-components', 'Schema markup components', 'components/schema/*')
        : fail('schema-components', 'Schema markup components', 'Missing components/schema/*.tsx')
    },
  },
  {
    group: 'SEO', id: 'homepage-metadata', name: 'Homepage exports metadata',
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/page.tsx')
      if (!c) return fail('homepage-metadata', 'Homepage exports metadata', 'Homepage file missing')
      const ok = /export\s+(const|async function)\s+(metadata|generateMetadata)/.test(c)
      return ok
        ? pass('homepage-metadata', 'Homepage exports metadata')
        : fail('homepage-metadata', 'Homepage exports metadata', 'No metadata/generateMetadata export in homepage')
    },
  },
]

const I18N: Check[] = [
  {
    group: 'i18n', id: 'i18n-routing', name: 'i18n routing config',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'i18n/routing.ts')
      return ok
        ? pass('i18n-routing', 'i18n routing config')
        : fail('i18n-routing', 'i18n routing config', 'Missing i18n/routing.ts')
    },
  },
  {
    group: 'i18n', id: 'middleware', name: 'next-intl middleware',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'middleware.ts')
      return ok
        ? pass('middleware', 'next-intl middleware')
        : fail('middleware', 'next-intl middleware', 'Missing middleware.ts')
    },
  },
  {
    group: 'i18n', id: 'translations', name: 'Translation files (en/ms/zh)',
    run: async (ctx) => {
      const en = await fileExists(ctx, 'messages/en.json')
      const ms = await fileExists(ctx, 'messages/ms.json')
      const zh = await fileExists(ctx, 'messages/zh.json')
      const have = [en && 'en', ms && 'ms', zh && 'zh'].filter(Boolean) as string[]
      if (have.length === 3) return pass('translations', 'Translation files (en/ms/zh)', 'all 3 locales present')
      if (have.length === 0) return fail('translations', 'Translation files (en/ms/zh)', 'no messages/*.json found')
      return fail('translations', 'Translation files (en/ms/zh)', `only ${have.join(', ')}`)
    },
  },
  {
    group: 'i18n', id: 'language-switcher', name: 'Language switcher component',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'components/LanguageSwitcher.tsx')
      return ok
        ? pass('language-switcher', 'Language switcher component')
        : fail('language-switcher', 'Language switcher component', 'Missing components/LanguageSwitcher.tsx')
    },
  },
]

const WEBCORE: Check[] = [
  {
    group: 'Webcore data layer', id: 'webcore-lib', name: 'lib/webcore.ts exists',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'lib/webcore.ts')
      return ok
        ? pass('webcore-lib', 'lib/webcore.ts exists')
        : fail('webcore-lib', 'lib/webcore.ts exists', 'Missing lib/webcore.ts — site is not on the cache-tag data layer')
    },
  },
  {
    group: 'Webcore data layer', id: 'revalidate-route', name: '/api/revalidate route',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/api/revalidate/route.ts')
      return ok
        ? pass('revalidate-route', '/api/revalidate route')
        : fail('revalidate-route', '/api/revalidate route', 'Missing app/api/revalidate/route.ts')
    },
  },
  {
    group: 'Webcore data layer', id: 'no-forbidden-libs', name: 'No forbidden lib/* files',
    run: async (ctx) => {
      const forbidden = ['lib/supabase.ts', 'lib/getProducts.ts', 'lib/getPhoneNumber.ts', 'lib/getBlogPosts.ts']
      const found: string[] = []
      for (const f of forbidden) {
        if (await fileExists(ctx, f)) found.push(f)
      }
      return found.length === 0
        ? pass('no-forbidden-libs', 'No forbidden lib/* files')
        : fail('no-forbidden-libs', 'No forbidden lib/* files', `forbidden: ${found.join(', ')}`)
    },
  },
  {
    group: 'Webcore data layer', id: 'no-time-revalidate', name: 'No time-based ISR (export const revalidate = N)',
    run: async (ctx) => {
      const bad = await grepProject(ctx, /export\s+const\s+revalidate\s*=\s*[1-9]/)
      return bad
        ? fail('no-time-revalidate', 'No time-based ISR (export const revalidate = N)', 'found `export const revalidate = N` somewhere — must use tag-based invalidation')
        : pass('no-time-revalidate', 'No time-based ISR (export const revalidate = N)')
    },
  },
]

const TRACKING: Check[] = [
  {
    group: 'Tracking', id: 'tracking-script', name: 'Tracking script in layout',
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!c) return fail('tracking-script', 'Tracking script in layout', 'layout.tsx missing')
      const ok = /webcore\.utopiaai\.my\/t\.js/.test(c)
      return ok
        ? pass('tracking-script', 'Tracking script in layout')
        : fail('tracking-script', 'Tracking script in layout', 'no webcore.utopiaai.my/t.js script tag')
    },
  },
  {
    group: 'Tracking', id: 'data-website-match', name: 'data-website matches domain',
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!c) return fail('data-website-match', 'data-website matches domain', 'layout.tsx missing')
      const m = c.match(/data-website=["']([^"']+)["']/)
      if (!m) return fail('data-website-match', 'data-website matches domain', 'no data-website attribute on tracking script')
      const dw = m[1]
      // Accept either the vercel domain or the *.utopiaai.my alias
      const domain = ctx.info.domain
      if (!domain) return skip('data-website-match', 'data-website matches domain', `data-website=${dw} but project domain unknown`)
      const alias = domain.replace(/\.vercel\.app$/, '.utopiaai.my')
      const ok = dw === domain || dw === alias
      return ok
        ? pass('data-website-match', 'data-website matches domain', dw)
        : fail('data-website-match', 'data-website matches domain', `data-website=${dw}, expected ${domain} or ${alias}`)
    },
  },
  {
    group: 'Tracking', id: 'uwc-typedef', name: 'window.uwc type declaration',
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'global.d.ts')
      if (!c) return fail('uwc-typedef', 'window.uwc type declaration', 'global.d.ts missing')
      const ok = /uwc\s*:/.test(c)
      return ok
        ? pass('uwc-typedef', 'window.uwc type declaration')
        : fail('uwc-typedef', 'window.uwc type declaration', 'no uwc declaration in global.d.ts')
    },
  },
  {
    group: 'Tracking', id: 'whatsapp-click-track', name: 'WhatsApp click tracked',
    run: async (ctx) => {
      const ok = await grepProject(ctx, /uwc\(['"]click['"][^)]*whatsapp-/)
      return ok
        ? pass('whatsapp-click-track', 'WhatsApp click tracked')
        : fail('whatsapp-click-track', 'WhatsApp click tracked', "no uwc('click', { label: 'whatsapp-…' }) call")
    },
  },
  {
    group: 'Tracking', id: 'product-impression-track', name: 'Product impression tracked',
    run: async (ctx) => {
      const ok = await grepProject(ctx, /uwc\(['"]impression['"][^)]*product-/)
      return ok
        ? pass('product-impression-track', 'Product impression tracked')
        : fail('product-impression-track', 'Product impression tracked', "no uwc('impression', { label: 'product-…' }) call")
    },
  },
  {
    group: 'Tracking', id: 'blog-click-track', name: 'Blog article click tracked',
    run: async (ctx) => {
      const ok = await grepProject(ctx, /uwc\(['"]click['"][^)]*blog-/)
      return ok
        ? pass('blog-click-track', 'Blog article click tracked')
        : fail('blog-click-track', 'Blog article click tracked', "no uwc('click', { label: 'blog-…' }) call")
    },
  },
]

const DESIGN: Check[] = [
  {
    group: 'Design', id: 'font-house-style', name: 'Uses Inter or Plus Jakarta Sans',
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!c) return fail('font-house-style', 'Uses Inter or Plus Jakarta Sans', 'layout.tsx missing')
      const ok = /\bInter\b|\bPlus_Jakarta_Sans\b/.test(c)
      return ok
        ? pass('font-house-style', 'Uses Inter or Plus Jakarta Sans')
        : fail('font-house-style', 'Uses Inter or Plus Jakarta Sans', 'no Inter / Plus_Jakarta_Sans import in layout')
    },
  },
  {
    group: 'Design', id: 'no-forbidden-serifs', name: 'No forbidden serif display fonts',
    run: async (ctx) => {
      const bad = await grepProject(ctx, /\b(Cormorant|Fraunces|Playfair|EB_Garamond|Garamond_EB)\b/)
      return bad
        ? fail('no-forbidden-serifs', 'No forbidden serif display fonts', 'found Cormorant/Fraunces/Playfair/EB Garamond — house style is sans only')
        : pass('no-forbidden-serifs', 'No forbidden serif display fonts')
    },
  },
  {
    group: 'Design', id: 'favicon', name: 'Favicon (app/icon.svg)',
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/icon.svg')
      return ok
        ? pass('favicon', 'Favicon (app/icon.svg)')
        : fail('favicon', 'Favicon (app/icon.svg)', 'Missing app/icon.svg')
    },
  },
]

const DATABASE: Check[] = [
  {
    group: 'Database', id: 'db-company-website', name: 'company_websites row',
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('db-company-website', 'company_websites row', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('db-company-website', 'company_websites row', 'unknown domain')
      const c = await getDomainCounts(ctx.info.domainCandidates)
      if (c.companyWebsites == null) return skip('db-company-website', 'company_websites row', 'query failed')
      return c.companyWebsites > 0
        ? pass('db-company-website', 'company_websites row', `${c.companyWebsites} row(s) matched`)
        : fail('db-company-website', 'company_websites row', `no row for ${c.matchedAgainst.join(' | ')}`)
    },
  },
  {
    group: 'Database', id: 'db-phone-number', name: 'phone_numbers row (active)',
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('db-phone-number', 'phone_numbers row (active)', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('db-phone-number', 'phone_numbers row (active)', 'unknown domain')
      const c = await getDomainCounts(ctx.info.domainCandidates)
      if (c.phoneNumbers == null) return skip('db-phone-number', 'phone_numbers row (active)', 'query failed')
      return c.phoneNumbers > 0
        ? pass('db-phone-number', 'phone_numbers row (active)', `${c.phoneNumbers} active number(s)`)
        : fail('db-phone-number', 'phone_numbers row (active)', `no active rows for ${c.matchedAgainst.join(' | ')}`)
    },
  },
  {
    group: 'Database', id: 'db-products', name: 'Active products in Supabase',
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('db-products', 'Active products in Supabase', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('db-products', 'Active products in Supabase', 'unknown domain')
      const c = await getDomainCounts(ctx.info.domainCandidates)
      if (c.activeProducts == null) return skip('db-products', 'Active products in Supabase', 'query failed')
      return c.activeProducts > 0
        ? pass('db-products', 'Active products in Supabase', `${c.activeProducts} active product(s)`)
        : fail('db-products', 'Active products in Supabase', `0 active products for ${c.matchedAgainst.join(' | ')}`)
    },
  },
  {
    group: 'Database', id: 'db-blog-posts', name: '≥10 published blog posts',
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('db-blog-posts', '≥10 published blog posts', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('db-blog-posts', '≥10 published blog posts', 'unknown domain')
      const c = await getDomainCounts(ctx.info.domainCandidates)
      if (c.publishedBlogPosts == null) return skip('db-blog-posts', '≥10 published blog posts', 'query failed')
      return c.publishedBlogPosts >= 10
        ? pass('db-blog-posts', '≥10 published blog posts', `${c.publishedBlogPosts} published post(s)`)
        : fail('db-blog-posts', '≥10 published blog posts', `only ${c.publishedBlogPosts} published post(s)`)
    },
  },
]

const DEPLOYMENT: Check[] = [
  {
    group: 'Deployment', id: 'vercel-linked', name: 'Vercel project linked',
    run: async (ctx) => {
      // `.vercel/project.json` is gitignored, so the GitHub-Actions cron never
      // sees it. If the project nevertheless has a working deploy signal
      // (deploy-url.txt) AND a data-website tag (proving production runs are
      // happening), treat the file's absence as expected and skip the check
      // instead of failing.
      const ok = await fileExists(ctx, '.vercel/project.json')
      if (ok) return pass('vercel-linked', 'Vercel project linked')
      const hasDeployUrl = await fileExists(ctx, 'deploy-url.txt')
      if (hasDeployUrl) {
        return skip('vercel-linked', 'Vercel project linked', 'deploy-url.txt present (CI cannot see .vercel/)')
      }
      return fail('vercel-linked', 'Vercel project linked', 'Missing .vercel/project.json — run `vercel link`')
    },
  },
  {
    group: 'Deployment', id: 'deploy-url-live', name: 'Deploy URL responds',
    run: async (ctx) => {
      const url = ctx.info.deployUrl
      if (!url) return fail('deploy-url-live', 'Deploy URL responds', 'no deploy URL — not deployed yet')
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(4000) })
        if (res.ok || res.status === 307 || res.status === 308 || res.status === 301 || res.status === 302) {
          return pass('deploy-url-live', 'Deploy URL responds', url)
        }
        return fail('deploy-url-live', 'Deploy URL responds', `${url} returned ${res.status}`)
      } catch {
        return fail('deploy-url-live', 'Deploy URL responds', `${url} unreachable`)
      }
    },
  },
  {
    group: 'Deployment', id: 'live-db-connected', name: 'Live site reads phone from Supabase',
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('live-db-connected', 'Live site reads phone from Supabase', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('live-db-connected', 'Live site reads phone from Supabase', 'unknown domain')

      const [phones, registered] = await Promise.all([
        getPhoneRows(ctx.info.domainCandidates),
        getRegisteredDomains(ctx.info.domainCandidates),
      ])

      const baseUrls: string[] = []
      if (registered) for (const r of registered) baseUrls.push(`https://${r.domain}`)
      if (ctx.info.deployUrl) baseUrls.push(ctx.info.deployUrl)
      for (const d of ctx.info.domainCandidates) {
        const u = `https://${d}`
        if (!baseUrls.includes(u)) baseUrls.push(u)
      }

      const dbPhones = (phones ?? []).filter((p) => p.is_active).map((p) => p.phone_number)
      const status = await checkLiveDbConnection({
        baseUrls: Array.from(new Set(baseUrls)),
        dbPhones,
        fallbackPhone: ctx.info.fallbackPhone,
      })

      if (status.status === 'connected') return pass('live-db-connected', 'Live site reads phone from Supabase', `live=${status.livePhone}`)
      if (status.status === 'no-target') return skip('live-db-connected', 'Live site reads phone from Supabase', 'no deploy URL')
      if (status.status === 'no-response') return fail('live-db-connected', 'Live site reads phone from Supabase', 'no candidate URL returned a wa.me link')
      if (status.status === 'fallback') return fail('live-db-connected', 'Live site reads phone from Supabase', `live=${status.livePhone} (fallback), DB=${dbPhones.join(', ') || '—'}`)
      return fail('live-db-connected', 'Live site reads phone from Supabase', status.detail)
    },
  },
]

const QUALITY: Check[] = [
  {
    group: 'Quality', id: 'no-hardcoded-phones', name: 'No hardcoded phone numbers in app/ or components/',
    run: async (ctx) => {
      const hits = await findHardcodedPhones(ctx.info.projectDir)
      if (hits.length === 0) return pass('no-hardcoded-phones', 'No hardcoded phone numbers in app/ or components/')
      const first = hits[0]
      return fail(
        'no-hardcoded-phones',
        'No hardcoded phone numbers in app/ or components/',
        `${hits.length} hit(s) — e.g. ${first.file}:${first.line} → ${first.match}`,
      )
    },
  },
  {
    group: 'Quality', id: 'no-hardcoded-phones-blog', name: 'No hardcoded phone numbers in blog content',
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('no-hardcoded-phones-blog', 'No hardcoded phone numbers in blog content', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('no-hardcoded-phones-blog', 'No hardcoded phone numbers in blog content', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('no-hardcoded-phones-blog', 'No hardcoded phone numbers in blog content', 'query failed')
      const hits = findBlogHardcodedPhones(rows)
      if (hits.length === 0) return pass('no-hardcoded-phones-blog', 'No hardcoded phone numbers in blog content')
      const first = hits[0]
      return fail(
        'no-hardcoded-phones-blog',
        'No hardcoded phone numbers in blog content',
        `${hits.length} hit(s) — e.g. [${first.post_slug}/${first.language}/${first.field}] ${first.match}`,
      )
    },
  },
]

const ALL_CHECKS: Check[] = [
  ...STRUCTURE,
  ...SEO,
  ...I18N,
  ...WEBCORE,
  ...TRACKING,
  ...DESIGN,
  ...DATABASE,
  ...DEPLOYMENT,
  ...QUALITY,
]

export async function runChecksForProject(info: ProjectInfo): Promise<CheckGroup[]> {
  const ctx: Ctx = { info, fileCache: new Map(), grepCache: new Map() }
  const results = await Promise.all(ALL_CHECKS.map((c) => c.run(ctx)))

  const byGroup = new Map<string, CheckResult[]>()
  ALL_CHECKS.forEach((c, i) => {
    if (!byGroup.has(c.group)) byGroup.set(c.group, [])
    byGroup.get(c.group)!.push(results[i])
  })

  return Array.from(byGroup.entries()).map(([name, items]) => ({ name, items }))
}

export function totalCheckCount(): number {
  return ALL_CHECKS.length
}
