import { readFile, access, readdir, stat } from 'fs/promises'
import path from 'path'
import type { ProjectInfo } from './projectInfo'
import { getDomainCounts, getBlogContentRows, getPhoneRows, getRegisteredDomains, getWebsiteById, supabaseConfigured, getPhoneRowsForExactDomain, getAllPhoneOwners,} from './supabaseChecks'
import { findHardcodedPhones, findBlogHardcodedPhones, findMessageLeaks } from './sourceScan'
import { checkLiveDbConnection } from './liveStatusCheck'
import { getProjectDomains } from './vercelDomains'

export type CheckStatus = 'pass' | 'fail' | 'skip'

export interface CheckResult {
  id: string
  name: string
  status: CheckStatus
  detail?: string
  /** Layman explanation of what this check is verifying. Attached by the runner. */
  help?: string
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

// Shared file-read cache, keyed by absolute path so both relative-path
// callers (readProjectFile) and walking callers (grepProject) can hit the
// same entry. Without this, grepProject re-reads every source file for each
// unique regex pattern — 20 patterns × 200 files = 4000 reads per project.
async function readFileCached(ctx: Ctx, absPath: string): Promise<string | null> {
  if (ctx.fileCache.has(absPath)) return ctx.fileCache.get(absPath)!
  try {
    const content = await readFile(absPath, 'utf-8')
    ctx.fileCache.set(absPath, content)
    return content
  } catch {
    ctx.fileCache.set(absPath, null)
    return null
  }
}

async function readProjectFile(ctx: Ctx, rel: string): Promise<string | null> {
  return readFileCached(ctx, path.join(ctx.info.projectDir, rel))
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
        // Read through the shared cache so every check reusing the same .tsx
        // file pays one read total — not one read per regex.
        const c = await readFileCached(ctx, p)
        if (c != null && pattern.test(c)) return true
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

// Concatenate the source of every .tsx directly inside `relDir` (not
// recursive). A page often delegates its markup to a sibling *Client.tsx, so
// counting tags only in page.tsx misses them — read the whole directory.
async function concatTsxInDir(ctx: Ctx, relDir: string): Promise<string> {
  const abs = path.join(ctx.info.projectDir, relDir)
  let out = ''
  let entries
  try { entries = await readdir(abs, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.tsx')) continue
    const c = await readFileCached(ctx, path.join(abs, e.name))
    if (c) out += '\n' + c
  }
  return out
}

// Chrome + presentational components whose source must NOT be folded into the
// homepage body. SiteHeader/SiteFooter carry their own WhatsApp CTA on every
// page, so counting them would make any homepage look converted.
const CHROME_COMPONENTS =
  /^(SiteHeader|SiteFooter|FomoBanner|FomoCountdown|LanguageSwitcher|NavCtaGlobalStyle|PageStyles|Ornaments)$/

// The homepage as actually rendered: app/[locale]/*.tsx plus the source of the
// non-chrome `@/components/*` it imports. Most sites delegate the product grid
// to PageShell / HomePageClient, so reading only app/[locale] sees the hero and
// nothing else — every product card's CTA is invisible to the check.
// One level deep: the page's own imports, not their transitive imports.
async function concatHomepageSource(ctx: Ctx): Promise<string> {
  const pageSrc = await concatTsxInDir(ctx, 'app/[locale]')
  if (!pageSrc) return ''
  let out = pageSrc.replace(/<SiteHeader\b[^>]*\/?>|<SiteFooter\b[^>]*\/?>/g, '')
  const seen = new Set<string>()
  for (const m of pageSrc.matchAll(/from\s+['"]@\/components\/([A-Za-z0-9_\-/]+)['"]/g)) {
    const rel = m[1]
    const base = rel.split('/').pop() as string
    if (seen.has(rel) || CHROME_COMPONENTS.test(base)) continue
    seen.add(rel)
    const c = await readFileCached(ctx, path.join(ctx.info.projectDir, 'components', `${rel}.tsx`))
    if (c) out += '\n' + c
  }
  return out
}

/** Fetch the live redirect page and parse the wa.me phone + decoded ?text=.
 *  Probes the locale-less path first, then /ms and /en, since default-locale
 *  routing differs per site (oxihome serves ms at /, most serve en at /). */
async function livePrefill(domain: string): Promise<{ phone: string; text: string } | null> {
  for (const path of ['', '/ms', '/en', '/zh']) {
    try {
      const res = await fetch(`https://${domain}${path}/redirect-whatsapp-1`, {
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
        redirect: 'follow',
      })
      if (!res.ok) continue
      const html = await res.text()
      const m = html.match(/wa\.me\/(\d+)(?:\?text=([^"'\\\s<]*))?/)
      if (!m) continue
      let text = ''
      try { text = m[2] ? decodeURIComponent(m[2]) : '' } catch { text = m[2] ?? '' }
      return { phone: m[1], text }
    } catch { /* try next path */ }
  }
  return null
}

// ── Heading keyword coverage (informational) ───────────────────────────────
// Resolves each homepage <h3>{tVar('key')} to its messages/ms.json string and
// reports how many section headings carry a primary keyword. This is a soft
// signal, never a hard fail — generic section titles ("FAQ", "Locations") and
// rating pills legitimately have no keyword even on a perfect site.
const KW_STOP = new Set([
  'malaysia', 'your', 'kami', 'anda', 'untuk', 'dalam', 'dengan', 'pada', 'yang',
  'seluruh', 'dari', 'atau', 'dan', 'the', 'and', 'near', 'setiap', 'boleh',
  'esok', 'segera', 'cara', 'service', 'services', 'sdn', 'bhd', 'hour',
])
function kwWords(s: string): string[] {
  return (s || '').toLowerCase().replace(/[^a-zà-ɏ\s]/gi, ' ').split(/\s+/)
    .filter((w) => w.length >= 4 && !KW_STOP.has(w))
}
function kwAllStrings(obj: unknown, acc: string[] = []): string[] {
  if (obj == null) return acc
  if (typeof obj === 'string') { acc.push(obj); return acc }
  if (typeof obj === 'object') for (const v of Object.values(obj as Record<string, unknown>)) kwAllStrings(v, acc)
  return acc
}
function kwResolve(obj: unknown, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj)
}
async function analyzeHeadingKeywords(ctx: Ctx): Promise<{ hit: number; total: number; misses: string[]; keywords: string[] } | null> {
  const src = await concatTsxInDir(ctx, 'app/[locale]')
  const msRaw = await readProjectFile(ctx, 'messages/ms.json')
  if (!src || !msRaw) return null
  let msgs: unknown
  try { msgs = JSON.parse(msRaw) } catch { return null }

  // var -> namespace from getTranslations({namespace}) / useTranslations('ns')
  const nsMap: Record<string, string> = {}
  for (const m of src.matchAll(/const\s+(\w+)\s*=\s*await\s+getTranslations\(\{[^}]*namespace:\s*'([^']+)'/g)) nsMap[m[1]] = m[2]
  for (const m of src.matchAll(/const\s+(\w+)\s*=\s*useTranslations\('([^']+)'\)/g)) nsMap[m[1]] = m[2]

  // Keywords: slug tokens + the most-frequent words in the hero copy (which is
  // keyword-rich by rule and in the site's actual language, so this handles
  // localized terms like "oksigen"/"elektrik" the English slug would miss).
  const heroFreq: Record<string, number> = {}
  for (const s of kwAllStrings(kwResolve(msgs, 'hero') ?? {})) for (const w of kwWords(s)) heroFreq[w] = (heroFreq[w] ?? 0) + 1
  const heroKw = Object.entries(heroFreq).sort((a, b) => b[1] - a[1]).slice(0, 6).map((e) => e[0])
  const keywords = [...new Set([...ctx.info.slug.split('-'), ...heroKw])]
    .map((s) => s.toLowerCase()).filter((s) => s.length >= 3 && !KW_STOP.has(s) && !/^\d+$/.test(s))

  let hit = 0, total = 0
  const misses: string[] = []
  for (const m of src.matchAll(/<h3[^>]*>\s*\{(\w+)\('([^']+)'\)/g)) {
    const ns = nsMap[m[1]]
    if (!ns) continue
    const val = kwResolve(msgs, `${ns}.${m[2]}`)
    if (typeof val !== 'string') continue
    total++
    if (keywords.some((k) => val.toLowerCase().includes(k))) hit++
    else if (misses.length < 4) misses.push(val.slice(0, 32))
  }
  return { hit, total, misses, keywords }
}

// Collect className tokens from every .tsx directly inside `relDir` (not
// recursive). Used to compare which sections a homepage vs a location page
// renders — both may delegate to a sibling *Client.tsx, so we union the whole
// directory's class usage.
async function classTokensInDir(ctx: Ctx, relDir: string): Promise<Set<string>> {
  const tokens = new Set<string>()
  const abs = path.join(ctx.info.projectDir, relDir)
  let entries
  try { entries = await readdir(abs, { withFileTypes: true }) } catch { return tokens }
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.tsx')) continue
    const c = await readFileCached(ctx, path.join(abs, e.name))
    if (!c) continue
    for (const m of c.matchAll(/className=["'`]([^"'`]+)["'`]/g)) {
      for (const t of m[1].split(/\s+/)) if (t && !t.startsWith('${')) tokens.add(t)
    }
  }
  return tokens
}

// Walk the whole project once, collecting every CSS custom property that is
// (a) defined `--x:` and (b) used `var(--x)`. Cached on the Ctx so multiple
// checks share one walk. Returns the orphans: used but never defined.
async function findUndefinedCssVars(ctx: Ctx): Promise<{ orphans: string[]; firstFile: string | null }> {
  const cacheKey = '__cssvars__'
  const memo = (ctx as unknown as { _cssVars?: { orphans: string[]; firstFile: string | null } })._cssVars
  if (memo) return memo

  const defined = new Set<string>()
  const used = new Map<string, string>() // var -> first file (relative)
  const walk = async (dir: string): Promise<void> => {
    let entries
    try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue
      const p = path.join(dir, e.name)
      if (e.isDirectory()) { await walk(p); continue }
      if (!/\.(css|tsx|ts)$/.test(e.name)) continue
      const c = await readFileCached(ctx, p)
      if (!c) continue
      for (const m of c.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1])
      for (const m of c.matchAll(/var\((--[a-z0-9-]+)\)/gi)) {
        if (!used.has(m[1])) used.set(m[1], path.relative(ctx.info.projectDir, p))
      }
    }
  }
  await walk(ctx.info.projectDir)

  // Exclude framework-injected vars: --tw-* (Tailwind) and --font-* (next/font
  // sets these at runtime on <html>, so they're never in CSS source).
  const orphans: string[] = []
  let firstFile: string | null = null
  for (const [v, file] of used) {
    if (defined.has(v) || v.startsWith('--tw-') || v.startsWith('--font-')) continue
    orphans.push(v)
    if (!firstFile) firstFile = file
  }
  const result = { orphans, firstFile }
  ;(ctx as unknown as { _cssVars?: typeof result })._cssVars = result
  return result
}

async function dirSizeBytes(absDir: string): Promise<number | null> {
  const walk = async (dir: string): Promise<number> => {
    let total = 0
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return 0
    }
    for (const e of entries) {
      if (e.name.startsWith('.')) continue
      const p = path.join(dir, e.name)
      if (e.isDirectory()) {
        total += await walk(p)
      } else if (e.isFile()) {
        try {
          const s = await stat(p)
          total += s.size
        } catch { /* skip */ }
      }
    }
    return total
  }
  try {
    await access(absDir)
  } catch {
    return null
  }
  return walk(absDir)
}

function countOccurrences(text: string, re: RegExp): number {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
  return (text.match(g) ?? []).length
}

interface BlogFormatStats {
  contentChars: number       // raw HTML length — used for density-based checks
  h2Count: number
  h3Count: number
  pCount: number
  boldCount: number
  ulCount: number
  olCount: number
  tableCount: number
  imgCount: number
  imgMissingAlt: number      // <img> with no alt= or empty alt
  hasToc: boolean
  paragraphCount: number
  avgParagraphChars: number
}

// Scan a blog post's HTML body and report formatting stats. Cheap heuristics —
// good enough to catch posts that are walls of text with no headings, no
// emphasis, no lists, and no table of contents.
function analyzeBlogFormat(html: string): BlogFormatStats {
  const contentChars = html.length
  const h2Count = countOccurrences(html, /<h2[\s>]/i)
  const h3Count = countOccurrences(html, /<h3[\s>]/i)
  const pCount = countOccurrences(html, /<p[\s>]/i)
  const boldCount = countOccurrences(html, /<(?:strong|b)[\s>]/i)
  const ulCount = countOccurrences(html, /<ul[\s>]/i)
  const olCount = countOccurrences(html, /<ol[\s>]/i)
  const tableCount = countOccurrences(html, /<table[\s>]/i)
  const imgCount = countOccurrences(html, /<img[\s>]/i)
  // Empty/missing alt: <img …> without `alt=` at all, OR alt="" / alt=' '.
  const imgsRaw = html.match(/<img\b[^>]*>/gi) ?? []
  const imgMissingAlt = imgsRaw.filter((tag) => !/alt=["'][^"']+["']/.test(tag)).length

  // TOC: either an explicit toc/table-of-contents class on a nav/aside/div, OR
  // a list of in-page anchor links sitting in the first ~1500 chars of the body.
  const hasTocClass = /<(?:nav|div|aside|section)[^>]*class=["'][^"']*\b(?:toc|table-of-contents|table_of_contents|tableOfContents)\b/i.test(html)
  const earlyAnchorList = /^[\s\S]{0,1500}<(?:ul|ol)[^>]*>\s*<li[^>]*>\s*<a\s+href=["']#[a-zA-Z0-9_-]+["']/i.test(html)
  // Some authors hand-roll a TOC as a <nav> wrapping a <ul> of anchor links —
  // catch that shape too.
  const navTocAnywhere = /<nav[^>]*>[\s\S]{0,400}<(?:ul|ol)[^>]*>\s*<li[^>]*>\s*<a\s+href=["']#[a-zA-Z0-9_-]+["']/i.test(html)
  const hasToc = hasTocClass || earlyAnchorList || navTocAnywhere

  // Paragraph length: strip HTML inside <p>…</p> and average the text length.
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? []
  const paragraphTexts = paragraphs
    .map((p) => p.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim())
    .filter((t) => t.length > 0)
  const totalChars = paragraphTexts.reduce((s, t) => s + t.length, 0)
  const avgParagraphChars = paragraphTexts.length > 0 ? Math.round(totalChars / paragraphTexts.length) : 0

  return { contentChars, h2Count, h3Count, pCount, boldCount, ulCount, olCount, tableCount, imgCount, imgMissingAlt, hasToc, paragraphCount: paragraphTexts.length, avgParagraphChars }
}

// Run a per-post predicate over every blog content row and return summary stats.
// Uses the longest available translation as canonical (short translations may
// just be auto-translated stubs). `criterion(stats)` returns true if the post
// passes — the aggregate fails if any post fails, surfacing up to 3 offenders.
type BlogTranslation = { language: string; content: string | null }
type BlogContentRowLite = { slug: string; blog_translations: BlogTranslation[] }

// Memoize the HTML parse so the 7 blog-content checks don't each re-analyze
// the same posts. Keyed by translation object identity — getBlogContentRows
// caches its result, so the same translation objects flow through every check.
const blogStatsCache = new WeakMap<BlogTranslation, BlogFormatStats>()
function statsFor(t: BlogTranslation): BlogFormatStats | null {
  if (!t.content) return null
  let cached = blogStatsCache.get(t)
  if (cached) return cached
  cached = analyzeBlogFormat(t.content)
  blogStatsCache.set(t, cached)
  return cached
}
function canonicalTranslation(post: BlogContentRowLite): BlogTranslation | null {
  return (post.blog_translations ?? [])
    .filter((t) => typeof t.content === 'string' && (t.content as string).length > 0)
    .sort((a, b) => (b.content!.length) - (a.content!.length))[0] ?? null
}
function evaluateBlogPosts(
  rows: BlogContentRowLite[],
  criterion: (stats: BlogFormatStats) => boolean,
): { total: number; passed: number; offenders: string[] } {
  const offenders: string[] = []
  let total = 0
  let passed = 0
  for (const post of rows) {
    const canonical = canonicalTranslation(post)
    if (!canonical) continue
    const stats = statsFor(canonical)
    if (!stats) continue
    total++
    if (criterion(stats)) passed++
    else if (offenders.length < 3) offenders.push(`${post.slug}/${canonical.language}`)
  }
  return { total, passed, offenders }
}

// Walks .tsx/.ts under the project (minus build/asset dirs and a per-call
// `excludeRel` set) and runs `predicate` on each file's text. Stops on the
// first match in each file so we can show one example. Returns `{file, sample}`
// hits.
async function scanProjectFiles(
  ctx: Ctx,
  exts: string[],
  excludeRel: (rel: string) => boolean,
  predicate: (text: string) => string | null,
): Promise<Array<{ file: string; sample: string }>> {
  const hits: Array<{ file: string; sample: string }> = []
  const walk = async (dir: string): Promise<void> => {
    let entries
    try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue
      const p = path.join(dir, e.name)
      if (e.isDirectory()) { await walk(p); continue }
      if (!exts.some((x) => e.name.endsWith(x))) continue
      const rel = path.relative(ctx.info.projectDir, p)
      if (excludeRel(rel)) continue
      try {
        const text = await readFile(p, 'utf-8')
        const sample = predicate(text)
        if (sample != null) hits.push({ file: rel, sample })
      } catch { /* skip unreadable */ }
    }
  }
  await walk(ctx.info.projectDir)
  return hits
}

// ────────────────────────────────────────────────────────────────────────────
// Check definitions
// ────────────────────────────────────────────────────────────────────────────

type Check = {
  group: string
  id: string
  name: string
  /** Plain-English explanation shown under the check name in the UI. */
  help: string
  run: (ctx: Ctx) => Promise<CheckResult>
}

const pass = (id: string, name: string, detail?: string): CheckResult => ({ id, name, status: 'pass', detail })
const fail = (id: string, name: string, detail?: string): CheckResult => ({ id, name, status: 'fail', detail })
const skip = (id: string, name: string, detail?: string): CheckResult => ({ id, name, status: 'skip', detail })

const STRUCTURE: Check[] = [
  {
    group: 'Structure', id: 'homepage', name: 'Homepage exists',
    help: "The main landing page visitors see first.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/page.tsx')
      return ok
        ? pass('homepage', 'Homepage exists', 'app/[locale]/page.tsx')
        : fail('homepage', 'Homepage exists', 'Missing app/[locale]/page.tsx')
    },
  },
  {
    group: 'Structure', id: 'location-page', name: 'Location pages exist',
    help: "Per-city pages like /excavator/kuala-lumpur for local SEO.",
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
    group: 'Blog', id: 'blog-listing', name: 'Blog listing page',
    help: "The blog index page that lists all articles.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/blog/page.tsx')
      return ok
        ? pass('blog-listing', 'Blog listing page', 'app/[locale]/blog/page.tsx')
        : fail('blog-listing', 'Blog listing page', 'Missing app/[locale]/blog/page.tsx')
    },
  },
  {
    group: 'Blog', id: 'blog-post', name: 'Blog post detail page',
    help: "Individual blog article pages.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      return ok
        ? pass('blog-post', 'Blog post detail page', 'app/[locale]/blog/[slug]/page.tsx')
        : fail('blog-post', 'Blog post detail page', 'Missing app/[locale]/blog/[slug]/page.tsx')
    },
  },
  {
    group: 'Structure', id: 'whatsapp-redirect', name: 'WhatsApp redirect page',
    help: "The page that picks the right phone number and forwards to WhatsApp.",
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
    help: "Tells Google every URL on the site exists.",
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
    help: "Tells search engines which pages they're allowed to crawl.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/robots.ts')
      return ok
        ? pass('robots', 'robots.txt generator')
        : fail('robots', 'robots.txt generator', 'Missing app/robots.ts')
    },
  },
  {
    // Presence of the PNGs is the easy half. The half that actually breaks is
    // coverage: Next replaces a parent's `openGraph` WHOLESALE when a child
    // page defines its own, so a site routinely ends up with a share card on
    // the homepage and none on location or blog pages. So this walks every file
    // that defines openGraph and requires each one to spread ogImages().
    group: 'SEO', id: 'og-image-per-locale', name: 'Social share card (og:image) per locale',
    help: "A link with no og:image renders as a bare text card in WhatsApp/Facebook/X. Needs public/og-{locale}.png for every locale AND ogImages() spread into every page that defines openGraph — inheriting from the layout does not work, so a card on the homepage alone still fails. Generate with `node scripts/og-shot.mjs` (Step 8b). They are screenshots: rerun after any hero change or they go stale silently.",
    run: async (ctx) => {
      const id = 'og-image-per-locale'
      const name = 'Social share card (og:image) per locale'

      const locales = (['ms', 'en', 'zh'] as const).filter((l) =>
        ctx.fileCache.has(path.join(ctx.info.projectDir, `messages/${l}.json`)) || true,
      )
      const present: string[] = []
      const missing: string[] = []
      for (const l of locales) {
        if (await fileExists(ctx, `messages/${l}.json`)) {
          ;(await fileExists(ctx, `public/og-${l}.png`)) ? present.push(l) : missing.push(l)
        }
      }
      if (!present.length && !missing.length) return skip(id, name, 'no messages/*.json to derive locales from')
      if (missing.length) {
        return fail(id, name, `missing public/og-${missing.join('.png, public/og-')}.png — run \`node scripts/og-shot.mjs\` (Step 8b)`)
      }

      if (!(await fileExists(ctx, 'lib/ogImage.ts'))) {
        return fail(id, name, 'cards exist but lib/ogImage.ts is missing — copy it from templates/site-chrome/')
      }

      // Every file declaring openGraph must also reference ogImages.
      // `covered` is counted too: cards on disk that nothing references would
      // otherwise pass vacuously, which is exactly how a presence-only check
      // gets gamed.
      const uncovered: string[] = []
      let covered = 0
      const walk = async (dir: string): Promise<void> => {
        let entries
        try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
        for (const e of entries) {
          if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue
          const p = path.join(dir, e.name)
          if (e.isDirectory()) { await walk(p); continue }
          if (!e.name.endsWith('.tsx') && !e.name.endsWith('.ts')) continue
          const c = await readFileCached(ctx, p)
          if (c && /openGraph\s*:/.test(c)) {
            if (/ogImages?\s*\(/.test(c)) covered++
            else uncovered.push(path.relative(ctx.info.projectDir, p))
          }
        }
      }
      await walk(path.join(ctx.info.projectDir, 'app'))

      if (uncovered.length) {
        return fail(id, name, `openGraph without ogImages() in ${uncovered.length} file(s): ${uncovered.slice(0, 3).join(', ')}${uncovered.length > 3 ? ' …' : ''} — Next replaces a parent's openGraph wholesale, so these pages share as bare text`)
      }
      if (!covered) {
        return fail(id, name, 'cards exist but no page references ogImages() — nothing actually emits og:image')
      }
      return pass(id, name, `${present.length} locale cards, ${covered} openGraph blocks covered`)
    },
  },
  {
    group: 'SEO', id: 'schema-components', name: 'Schema markup components',
    help: "Structured data so Google can show rich snippets in search results.",
    run: async (ctx) => {
      const ok = await dirHasFiles(ctx, 'components/schema', ['.tsx', '.ts'])
      return ok
        ? pass('schema-components', 'Schema markup components', 'components/schema/*')
        : fail('schema-components', 'Schema markup components', 'Missing components/schema/*.tsx')
    },
  },
  {
    group: 'SEO', id: 'homepage-metadata', name: 'Homepage exports metadata',
    help: "Page title + description that appear in Google search results.",
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
    help: "Routes URLs like /en/, /ms/, /zh/ to the right language.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'i18n/routing.ts')
      return ok
        ? pass('i18n-routing', 'i18n routing config')
        : fail('i18n-routing', 'i18n routing config', 'Missing i18n/routing.ts')
    },
  },
  {
    group: 'i18n', id: 'middleware', name: 'next-intl middleware',
    help: "Detects the visitor's language and redirects to the right locale.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'middleware.ts')
      return ok
        ? pass('middleware', 'next-intl middleware')
        : fail('middleware', 'next-intl middleware', 'Missing middleware.ts')
    },
  },
  {
    group: 'i18n', id: 'translations', name: 'Translation files (en/ms/zh)',
    help: "Translation files for English, Malay, and Chinese copy.",
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
    help: "The flag dropdown that lets visitors switch languages.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'components/LanguageSwitcher.tsx')
      return ok
        ? pass('language-switcher', 'Language switcher component')
        : fail('language-switcher', 'Language switcher component', 'Missing components/LanguageSwitcher.tsx')
    },
  },
  {
    group: 'i18n', id: 'default-locale-enforced', name: 'Default locale always shown first',
    help: "When you pick a default language, every visitor lands on it — no browser auto-detection override. Use localePrefix 'always' (every URL prefixed) or 'as-needed' (default locale served at / with no prefix); both keep the default-first rule.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'i18n/routing.ts')
      if (!c) return fail('default-locale-enforced', 'Default locale always shown first', 'Missing i18n/routing.ts')
      const defMatch = c.match(/defaultLocale\s*:\s*['"]([a-z-]+)['"]/)
      if (!defMatch) {
        return fail('default-locale-enforced', 'Default locale always shown first', 'no defaultLocale set in i18n/routing.ts')
      }
      const defLoc = defMatch[1]
      const missing: string[] = []
      // `/` must serve the default locale with no browser detection. Two valid
      // prefix strategies achieve this: 'always' (every URL prefixed, / → /xx) or
      // 'as-needed' (default locale served at / with NO prefix; /xx redirects to
      // /). Either is fine — what matters is the default-first + no-detection rule.
      if (!/localePrefix\s*:\s*['"](always|as-needed)['"]/.test(c)) missing.push("localePrefix: 'always' or 'as-needed'")
      // Disable browser-language autodetection so a visitor with
      // Accept-Language: en doesn't bounce off a Malay-default site.
      if (!/localeDetection\s*:\s*false/.test(c)) missing.push('localeDetection: false')
      return missing.length === 0
        ? pass('default-locale-enforced', 'Default locale always shown first', `defaultLocale=${defLoc}`)
        : fail('default-locale-enforced', 'Default locale always shown first', `defaultLocale=${defLoc} but missing: ${missing.join(', ')}`)
    },
  },
  {
    group: 'i18n', id: 'localeprefix-as-needed', name: "localePrefix is 'as-needed'",
    help: "The convention: default locale served at / with NO prefix (site.my/ = default language), other locales prefixed (/en, /zh), and /<default> redirects to /. Set localePrefix: 'as-needed' in i18n/routing.ts.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'i18n/routing.ts')
      if (!c) return skip('localeprefix-as-needed', "localePrefix is 'as-needed'", 'no i18n/routing.ts')
      return /localePrefix\s*:\s*['"]as-needed['"]/.test(c)
        ? pass('localeprefix-as-needed', "localePrefix is 'as-needed'")
        : fail('localeprefix-as-needed', "localePrefix is 'as-needed'", "set localePrefix: 'as-needed' so the default locale is served at / with no prefix")
    },
  },
  {
    group: 'SEO', id: 'seo-locale-url-helper', name: 'SEO URLs built via the locale-URL helper',
    help: "With localePrefix 'as-needed' the default locale has no prefix, so a hardcoded canonical/sitemap/og URL like `${base}/${locale}` points the default locale at a /xx URL that 301-redirects (a muddy SEO signal). Build all SEO URLs through lib/localeHref (localePath / localeAbs / seoAlternates) so the default locale drops its prefix.",
    run: async (ctx) => {
      // The precise regression: a canonical that inlines `${locale}` (relative
      // `/${locale}` or absolute `${base}/${locale}`) instead of going through the
      // helper — so the default locale's canonical points at a /xx redirect.
      const bad = await grepProject(ctx, /canonical:\s*`[^`]*\$\{locale\}/)
      return bad
        ? fail('seo-locale-url-helper', 'SEO URLs built via the locale-URL helper', 'a canonical hardcodes `${...}/${locale}` — route it through lib/localeHref (seoAlternates) so the default locale is un-prefixed')
        : pass('seo-locale-url-helper', 'SEO URLs built via the locale-URL helper')
    },
  },
]

const WEBCORE: Check[] = [
  {
    group: 'Webcore data layer', id: 'webcore-lib', name: 'lib/webcore.ts exists',
    help: "Shared helper for fetching products/phones with cache tags.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'lib/webcore.ts')
      return ok
        ? pass('webcore-lib', 'lib/webcore.ts exists')
        : fail('webcore-lib', 'lib/webcore.ts exists', 'Missing lib/webcore.ts — site is not on the cache-tag data layer')
    },
  },
  {
    group: 'Webcore data layer', id: 'revalidate-route', name: '/api/revalidate route',
    help: "API endpoint the admin panel calls to refresh cached pages.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/api/revalidate/route.ts')
      return ok
        ? pass('revalidate-route', '/api/revalidate route')
        : fail('revalidate-route', '/api/revalidate route', 'Missing app/api/revalidate/route.ts')
    },
  },
  {
    group: 'Webcore data layer', id: 'no-forbidden-libs', name: 'No forbidden lib/* files',
    help: "Old standalone Supabase helpers must be deleted — use webcore instead.",
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
    help: "Pages invalidate by tag, not by time — DB edits show up instantly.",
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
    help: "Loads the analytics snippet that records visitor events.",
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
    help: "Analytics events are tagged with this site's actual domain.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!c) return fail('data-website-match', 'data-website matches domain', 'layout.tsx missing')
      // Resolve the data-website value, accepting either a literal string or
      // `{siteConfig.domain}` interpolation. For the expression form we read
      // siteConfig.domain from config/site.ts.
      let dw: string | null = null
      const literal = c.match(/data-website=["']([^"']+)["']/)
      if (literal) dw = literal[1]
      else if (/data-website=\{[^}]*siteConfig\.domain[^}]*\}/.test(c)) {
        const cfg = await readProjectFile(ctx, 'config/site.ts')
        const mm = cfg?.match(/domain\s*:\s*['"]([^'"]+)['"]/)
        if (mm) dw = mm[1]
      }
      if (!dw) return fail('data-website-match', 'data-website matches domain', 'no data-website attribute on tracking script')
      const domain = ctx.info.domain
      if (!domain) return skip('data-website-match', 'data-website matches domain', `data-website=${dw} but project domain unknown`)

      // Build the set of acceptable bucket keys:
      //   - the Vercel .vercel.app domain itself
      //   - its auto-derived .utopiaai.my alias
      //   - the deploy-url.txt host (the alias actually serving traffic, which
      //     may have an ad-hoc shape like electrician-24hour.utopiaai.my
      //     instead of electrician-24-hour.utopiaai.my)
      const acceptable = new Set<string>([domain, domain.replace(/\.vercel\.app$/, '.utopiaai.my')])
      if (ctx.info.deployUrl) {
        try { acceptable.add(new URL(ctx.info.deployUrl).host) } catch { /* ignore */ }
      }

      return acceptable.has(dw)
        ? pass('data-website-match', 'data-website matches domain', dw)
        : fail('data-website-match', 'data-website matches domain', `data-website=${dw}, expected one of: ${[...acceptable].join(', ')}`)
    },
  },
  {
    // Catches typos & broken aliases that `data-website-match` lets through.
    // Example: `data-website="electrician-24-hour.utopiaai.my"` (with extra
    // dash) matches the auto-derived alias but DNS doesn't resolve — every
    // tracker event lands in a bucket nobody is watching.
    group: 'Tracking', id: 'data-website-reachable', name: 'data-website resolves to a live URL',
    help: "The domain on the tracking script resolves — events reach a live bucket.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!c) return fail('data-website-reachable', 'data-website resolves to a live URL', 'layout.tsx missing')
      // Same dual-form resolution as data-website-match.
      let dw: string | null = null
      const literal = c.match(/data-website=["']([^"']+)["']/)
      if (literal) dw = literal[1]
      else if (/data-website=\{[^}]*siteConfig\.domain[^}]*\}/.test(c)) {
        const cfg = await readProjectFile(ctx, 'config/site.ts')
        const mm = cfg?.match(/domain\s*:\s*['"]([^'"]+)['"]/)
        if (mm) dw = mm[1]
      }
      if (!dw) return fail('data-website-reachable', 'data-website resolves to a live URL', 'no data-website attribute on tracking script')
      const url = `https://${dw}`
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(5000) })
        if (res.ok || (res.status >= 300 && res.status < 400)) {
          return pass('data-website-reachable', 'data-website resolves to a live URL', dw)
        }
        return fail('data-website-reachable', 'data-website resolves to a live URL', `${url} returned ${res.status} — events will land in a dead bucket`)
      } catch {
        return fail('data-website-reachable', 'data-website resolves to a live URL', `${url} unreachable — events will land in a dead bucket`)
      }
    },
  },
  {
    group: 'Tracking', id: 'uwc-typedef', name: 'window.uwc type declaration',
    help: "TypeScript knows about the tracking function so calls compile.",
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
    help: "Records every WhatsApp button click in analytics.",
    run: async (ctx) => {
      const ok = await grepProject(ctx, /uwc\(['"]click['"][^)]*whatsapp-/)
      return ok
        ? pass('whatsapp-click-track', 'WhatsApp click tracked')
        : fail('whatsapp-click-track', 'WhatsApp click tracked', "no uwc('click', { label: 'whatsapp-…' }) call")
    },
  },
  {
    group: 'Tracking', id: 'product-impression-track', name: 'Product impression tracked',
    help: "Records when a product card scrolls into view.",
    run: async (ctx) => {
      const ok = await grepProject(ctx, /uwc\(['"]impression['"][^)]*product-/)
      return ok
        ? pass('product-impression-track', 'Product impression tracked')
        : fail('product-impression-track', 'Product impression tracked', "no uwc('impression', { label: 'product-…' }) call")
    },
  },
  {
    group: 'Tracking', id: 'blog-click-track', name: 'Blog article click tracked',
    help: "Records when a visitor opens a blog article.",
    run: async (ctx) => {
      const ok = await grepProject(ctx, /uwc\(['"]click['"][^)]*blog-/)
      return ok
        ? pass('blog-click-track', 'Blog article click tracked')
        : fail('blog-click-track', 'Blog article click tracked', "no uwc('click', { label: 'blog-…' }) call")
    },
  },
]

// Google Integration checks — the POST-DEPLOY Google/Ads layer (GA4 + GTM + GSC +
// Ads conversion). Only the on-site GTM injection is verifiable from the repo;
// the account-side pieces (GA4 property, Ads conversion, GSC domain property, and
// the manual GA4 Signals / Ads counting+import toggles) live in Google and are
// tracked in the runbook, not here. These are advisory: a site still in the build
// phase legitimately has no GTM yet — it's injected only once the paid domain is live.
const GOOGLE: Check[] = [
  {
    group: 'Google Integration', id: 'gtm-container', name: 'GTM container snippet in layout',
    help: "Post-deploy: the Google Tag Manager container that fires GA4 and the whatsapp_click Ads conversion. Injected into the locale layout once the paid domain is live.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!c) return fail('gtm-container', 'GTM container snippet in layout', 'layout.tsx missing')
      const hasLoader = /googletagmanager\.com\/gtm\.js/.test(c)
      const id = c.match(/GTM-[A-Z0-9]+/)
      return hasLoader && id
        ? pass('gtm-container', 'GTM container snippet in layout', id[0])
        : fail('gtm-container', 'GTM container snippet in layout', 'no googletagmanager.com/gtm.js + GTM-XXXX snippet — run the Google integration step after deploy')
    },
  },
  {
    group: 'Google Integration', id: 'gtm-noscript', name: 'GTM noscript fallback in layout',
    help: "The <noscript> GTM iframe placed right after <body> so tracking still works without JavaScript.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!c) return fail('gtm-noscript', 'GTM noscript fallback in layout', 'layout.tsx missing')
      return /googletagmanager\.com\/ns\.html/.test(c)
        ? pass('gtm-noscript', 'GTM noscript fallback in layout')
        : fail('gtm-noscript', 'GTM noscript fallback in layout', 'no googletagmanager.com/ns.html noscript iframe after <body>')
    },
  },
]

// Layout & Design checks — automated subset of docs/full-website-setup.md
// "Layout & Design Checklist (MANDATORY before Gate 1)". Visual judgment items
// (e.g. "headings on image-bg render white") are intentionally omitted.
const DESIGN: Check[] = [
  {
    group: 'Layout & Design', id: 'font-house-style', name: 'Uses Inter or Plus Jakarta Sans',
    help: "Body type uses the approved house fonts (Inter or Plus Jakarta).",
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
    group: 'Layout & Design', id: 'no-forbidden-serifs', name: 'No forbidden serif display fonts',
    help: "No old serif display fonts — the house style is sans-only.",
    run: async (ctx) => {
      const bad = await grepProject(ctx, /\b(Cormorant|Fraunces|Playfair|EB_Garamond|Garamond_EB)\b/)
      return bad
        ? fail('no-forbidden-serifs', 'No forbidden serif display fonts', 'found Cormorant/Fraunces/Playfair/EB Garamond — house style is sans only')
        : pass('no-forbidden-serifs', 'No forbidden serif display fonts')
    },
  },
  {
    group: 'Layout & Design', id: 'favicon', name: 'Favicon (app/icon.svg)',
    help: "The little icon shown in the browser tab.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/icon.svg')
      return ok
        ? pass('favicon', 'Favicon (app/icon.svg)')
        : fail('favicon', 'Favicon (app/icon.svg)', 'Missing app/icon.svg')
    },
  },

  // Alt text
  {
    group: 'Layout & Design', id: 'no-empty-img-alt', name: 'No <img alt=""> in app/ or components/',
    help: "Every image has a descriptive alt for screen readers and SEO.",
    run: async (ctx) => {
      const bad = await grepProject(ctx, /<img\b[^>]*\balt=["']\s*["']/)
      return bad
        ? fail('no-empty-img-alt', 'No <img alt=""> in app/ or components/', 'found <img alt=""> — every content image needs a descriptive alt')
        : pass('no-empty-img-alt', 'No <img alt=""> in app/ or components/')
    },
  },
  // (alt-translation-keys merged into `alt-keys-all-locales` below — that check
  // verifies the same logoAlt + imageAlt keys across en/ms/zh, a superset.)

  // Typography
  {
    group: 'Layout & Design', id: 'no-text-transform-capitalize', name: 'No CSS text-transform: capitalize',
    help: "Don't auto-capitalize headings — it breaks conjunctions. Title-case the source instead.",
    run: async (ctx) => {
      const bad = await grepProject(ctx, /text-transform\s*:\s*capitalize/, ['.tsx', '.ts', '.css'])
      return bad
        ? fail('no-text-transform-capitalize', 'No CSS text-transform: capitalize', 'breaks conjunction casing — title-case the source strings instead')
        : pass('no-text-transform-capitalize', 'No CSS text-transform: capitalize')
    },
  },
  {
    group: 'Layout & Design', id: 'homepage-h1-h2', name: 'Homepage has exactly one <h1> + one <h2>',
    help: "Homepage needs exactly one main title (H1) and one subtitle (H2) for SEO — all other section titles use H3–H6.",
    run: async (ctx) => {
      const c = await concatTsxInDir(ctx, 'app/[locale]')
      if (!c) return fail('homepage-h1-h2', 'Homepage has exactly one <h1> + one <h2>', 'homepage files missing')
      const h1 = countOccurrences(c, /<h1[\s>]/)
      const h2 = countOccurrences(c, /<h2[\s>]/)
      if (h1 === 1 && h2 === 1) return pass('homepage-h1-h2', 'Homepage has exactly one <h1> + one <h2>')
      return fail('homepage-h1-h2', 'Homepage has exactly one <h1> + one <h2>', `found ${h1} <h1> + ${h2} <h2> (expected 1 + 1)`)
    },
  },
  {
    group: 'Layout & Design', id: 'body-text-in-headings', name: 'Visible text wrapped in heading tags (no bare <p>)',
    help: "House rule: every visible text element sits inside a heading tag (h1–h6), even body copy (styled h5/h6) — not bare <p>. Keyword-rich headings everywhere is the SEO play. Blog article bodies are exempt (they're DB HTML). sewa-excavator follows this; pages with many <p> tags don't.",
    run: async (ctx) => {
      // Scope: homepage, location pages, blog listing — everything EXCEPT the
      // blog article (/blog/[slug]), whose body is markdown HTML from the DB.
      const groups: { label: string; src: string }[] = []
      groups.push({ label: 'homepage', src: await concatTsxInDir(ctx, 'app/[locale]') })
      const slug = ctx.info.productSlug
      if (slug) groups.push({ label: 'location page', src: await concatTsxInDir(ctx, `app/[locale]/${slug}/[location]`) })
      const listing = await readProjectFile(ctx, 'app/[locale]/blog/page.tsx')
      if (listing) groups.push({ label: 'blog listing', src: listing })

      const LIMIT = 4
      const offenders: string[] = []
      for (const g of groups) {
        if (!g.src) continue
        const n = countOccurrences(g.src, /<p[\s>]/)
        if (n > LIMIT) offenders.push(`${g.label} (${n} <p>)`)
      }
      return offenders.length === 0
        ? pass('body-text-in-headings', 'Visible text wrapped in heading tags (no bare <p>)')
        : fail('body-text-in-headings', 'Visible text wrapped in heading tags (no bare <p>)', `bare <p> body text (should be styled h5/h6): ${offenders.join(', ')}`)
    },
  },
  {
    // Informational only — ALWAYS passes. The detail reports how many section
    // H3s carry a primary keyword + lists the weak ones, so you can strengthen
    // headings. It never fails because generic section titles ("FAQ",
    // "Locations") and rating pills legitimately have no keyword.
    group: 'Layout & Design', id: 'heading-keyword-coverage', name: 'Section headings carry keywords (informational)',
    help: "How many section H3s contain a primary keyword (derived from the slug + hero copy). Higher is better for SEO, but this never fails — generic titles like FAQ/Locations and rating pills don't need a keyword. Use the detail to spot headings worth rewording.",
    run: async (ctx) => {
      const r = await analyzeHeadingKeywords(ctx)
      if (!r || r.total === 0) return skip('heading-keyword-coverage', 'Section headings carry keywords (informational)', 'no resolvable section H3s')
      const pct = Math.round((100 * r.hit) / r.total)
      const weak = r.misses.length ? ` · reword: ${r.misses.join(' | ')}` : ''
      // Always pass — purely a visibility signal.
      return pass('heading-keyword-coverage', 'Section headings carry keywords (informational)', `${r.hit}/${r.total} carry a keyword (${pct}%)${weak}`)
    },
  },

  // ICU placeholder pitfall
  {
    group: 'Layout & Design', id: 'no-replace-icu', name: "No .replace('{…}', …) on ICU strings",
    help: "Use t('key', {var}) instead of .replace() — ICU substitution prevents formatting crashes.",
    run: async (ctx) => {
      const bad = await grepProject(ctx, /\.replace\(\s*["']\{[a-zA-Z_]+\}["']/)
      return bad
        ? fail('no-replace-icu', "No .replace('{…}', …) on ICU strings", "found .replace('{…}', …) — use t('key', { var }) ICU substitution instead")
        : pass('no-replace-icu', "No .replace('{…}', …) on ICU strings")
    },
  },

  // NOTE: the scrolling MarketingMarquee is intentionally NOT a required check.
  // It doesn't suit every layout (e.g. electrician) — projects may include it
  // or not, by design.

  // Shared components exist
  {
    group: 'Layout & Design', id: 'page-styles', name: 'PageStyles shared style component',
    help: "Shared CSS block so homepage and location pages stay in sync.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'components/PageStyles.tsx')
      return ok
        ? pass('page-styles', 'PageStyles shared style component')
        : fail('page-styles', 'PageStyles shared style component', 'Missing components/PageStyles.tsx — homepage + location pages should share one style block')
    },
  },
  {
    group: 'Layout & Design', id: 'fomo-banner', name: 'FomoBanner component (+ live countdown)',
    help: "The red urgency banner at the very top of every page. This check verifies the component exists and contains a live countdown timer (CLAUDE.md mandatory). It CANNOT verify the two visual properties that static analysis gets wrong: (1) red/black background — the canonical pattern styles the bar via a globals.css class with a project-specific colour token, so a colour grep both misses it and false-flags good projects; (2) mobile compactness/centering — the gold-standard sewa-excavator uses the exact same flex-wrap+justify-center pattern correctly, so there is no static signal that distinguishes a compact banner from a sprawling one. Both MUST be confirmed in the Gate-1 mobile (≈360px) screenshot review.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'components/FomoBanner.tsx')
      if (c == null) return fail('fomo-banner', 'FomoBanner component (+ live countdown)', 'Missing components/FomoBanner.tsx')
      // Live countdown is mandatory (CLAUDE.md: ticking hours:minutes:seconds).
      // This is the one property we can verify reliably from source.
      const hasCountdown = /countdown|timeLeft|setInterval|seconds/i.test(c)
      return hasCountdown
        ? pass('fomo-banner', 'FomoBanner component (+ live countdown)', 'exists with a live countdown — confirm red/black bg + mobile compactness in the screenshot review')
        : fail('fomo-banner', 'FomoBanner component (+ live countdown)', 'FomoBanner has no live countdown timer (ticking hours:minutes:seconds is mandatory)')
    },
  },
  {
    // Merged SiteHeader + SiteFooter existence into one (both are the shared
    // site chrome) to make room for heading-keyword-coverage while staying at 100.
    group: 'Layout & Design', id: 'site-chrome-components', name: 'SiteHeader + SiteFooter components',
    help: "Shared site-wide top nav (logo, languages, WhatsApp) and footer (links, copyright) exist as components.",
    run: async (ctx) => {
      const missing: string[] = []
      if (!(await fileExists(ctx, 'components/SiteHeader.tsx'))) missing.push('SiteHeader.tsx')
      if (!(await fileExists(ctx, 'components/SiteFooter.tsx'))) missing.push('SiteFooter.tsx')
      return missing.length === 0
        ? pass('site-chrome-components', 'SiteHeader + SiteFooter components')
        : fail('site-chrome-components', 'SiteHeader + SiteFooter components', `missing: ${missing.join(', ')}`)
    },
  },

  // Header / footer usage on every page
  {
    // Merged 3 homepage chrome checks into one for consistency with the
    // location/blog chrome checks and to make room for the live-blog-renders
    // + homepage-product-ctas checks below.
    group: 'Layout & Design', id: 'homepage-chrome', name: 'Homepage renders SiteHeader + SiteFooter + FomoBanner',
    help: "Homepage actually renders all three shared site chrome components, not custom variants.",
    run: async (ctx) => {
      const c = await concatTsxInDir(ctx, 'app/[locale]')
      if (!c) return fail('homepage-chrome', 'Homepage renders SiteHeader + SiteFooter + FomoBanner', 'homepage files missing')
      const missing = (['SiteHeader', 'SiteFooter', 'FomoBanner'] as const).filter((tag) => !new RegExp(`<${tag}\\b`).test(c))
      return missing.length === 0
        ? pass('homepage-chrome', 'Homepage renders SiteHeader + SiteFooter + FomoBanner')
        : fail('homepage-chrome', 'Homepage renders SiteHeader + SiteFooter + FomoBanner', `missing: ${missing.join(', ')}`)
    },
  },
  {
    group: 'Layout & Design', id: 'homepage-product-ctas', name: 'Homepage has enough WhatsApp CTAs (≥3)',
    help: "Each product/service card on the homepage should have a WhatsApp CTA routing through /redirect-whatsapp-1. Pages with only the hero CTA leave every product card without a way to convert — roller-shutter shipped with 1 CTA total.",
    run: async (ctx) => {
      // Homepage as rendered: app/[locale] plus the non-chrome components it
      // imports — the product grid usually lives in PageShell / HomePageClient,
      // and reading only app/[locale] sees the hero CTA and nothing else.
      const body = await concatHomepageSource(ctx)
      if (!body) return skip('homepage-product-ctas', 'Homepage has enough WhatsApp CTAs (≥3)', 'homepage files missing')
      // Count all forms of CTA that route through the redirect page or use the
      // shared WhatsAppButton. SiteHeader/SiteFooter are excluded by
      // concatHomepageSource so the chrome's own CTA can't inflate the count.
      const ctas = countOccurrences(body, /waRedirect\(|<WhatsAppButton\b|\/redirect-whatsapp-1/)
      return ctas >= 3
        ? pass('homepage-product-ctas', 'Homepage has enough WhatsApp CTAs (≥3)', `${ctas} CTAs on homepage`)
        : fail('homepage-product-ctas', 'Homepage has enough WhatsApp CTAs (≥3)', `only ${ctas} WhatsApp CTA(s) on the homepage — product cards likely have no clickable conversion path`)
    },
  },
  {
    group: 'Layout & Design', id: 'no-blognav-usage', name: 'No <BlogNav> per-page variant used',
    help: "Old per-page nav variant — every page must use SiteHeader instead.",
    run: async (ctx) => {
      const bad = await grepProject(ctx, /<BlogNav\b/)
      return bad
        ? fail('no-blognav-usage', 'No <BlogNav> per-page variant used', 'found <BlogNav> — every page must use the shared SiteHeader instead')
        : pass('no-blognav-usage', 'No <BlogNav> per-page variant used')
    },
  },

  // Location page conformance
  {
    group: 'Layout & Design', id: 'location-uses-pagestyles', name: 'Location page imports PageStyles',
    help: "Location pages reuse homepage CSS via PageStyles — no duplicated style blocks.",
    run: async (ctx) => {
      const slug = ctx.info.productSlug
      if (!slug) return skip('location-uses-pagestyles', 'Location page imports PageStyles', 'unknown productSlug')
      const c = await readProjectFile(ctx, `app/[locale]/${slug}/[location]/page.tsx`)
      if (!c) return skip('location-uses-pagestyles', 'Location page imports PageStyles', 'location page file not found')
      return /\bPageStyles\b/.test(c)
        ? pass('location-uses-pagestyles', 'Location page imports PageStyles')
        : fail('location-uses-pagestyles', 'Location page imports PageStyles', 'location page should import + render <PageStyles /> to share the homepage styles')
    },
  },
  {
    group: 'Layout & Design', id: 'location-matches-homepage', name: 'Location page mirrors homepage sections',
    help: "A location page must be the same layout as the homepage — same hero, USP bar, products, gallery, reviews, etc. — with only the copy localised. Strips down sections like 'why-us' from 4 instances on the homepage to 1 on the location page = half-built page.",
    run: async (ctx) => {
      const slug = ctx.info.productSlug
      if (!slug) return skip('location-matches-homepage', 'Location page mirrors homepage sections', 'unknown productSlug')
      const home = await concatTsxInDir(ctx, 'app/[locale]')
      const loc = await concatTsxInDir(ctx, `app/[locale]/${slug}/[location]`)
      if (!home) return skip('location-matches-homepage', 'Location page mirrors homepage sections', 'homepage source missing')
      if (!loc) return skip('location-matches-homepage', 'Location page mirrors homepage sections', 'location page not found')
      // Compare OCCURRENCE COUNTS per section (not just presence) — the old
      // substring-only heuristic let roller-shutter pass with why-us reduced
      // from 4 instances to 1. Rule: if homepage uses a marker ≥3 times and the
      // location page has <50% of that count, the section is "stripped" (0/N
      // included — an entirely dropped section trips this too).
      //
      // NOTE on marker choice: only DISTINCTIVE structural class/id tokens that
      // appear iff the section is present belong here. Content tokens like "faq"
      // are deliberately excluded — a location FAQ with fewer questions has a
      // lower count but is NOT stripped, so counting them produced false fails.
      // The 'trusted-by logo strip' marker was the gap that let roller-shutter
      // ship a location page with no logo strip while this check stayed green.
      const markers: Record<string, string> = {
        'usp-': 'USP bar',
        'trust-strip|trustlogos|trusted by|logo-strip|brand-strip': 'trusted-by logo strip',
        gallery: 'gallery', review: 'reviews',
        process: 'process/how-it-works', calc: 'calculator', 'why-': 'why-us', product: 'products',
      }
      const stripped: string[] = []
      for (const [marker, label] of Object.entries(markers)) {
        const h = (home.match(new RegExp(marker, 'gi')) ?? []).length
        const l = (loc.match(new RegExp(marker, 'gi')) ?? []).length
        if (h >= 3 && l / h < 0.5) stripped.push(`${label} (${l}/${h})`)
      }
      return stripped.length === 0
        ? pass('location-matches-homepage', 'Location page mirrors homepage sections')
        : fail('location-matches-homepage', 'Location page mirrors homepage sections', `stripped vs homepage: ${stripped.join(', ')} — location page should mirror the homepage layout with only localised copy`)
    },
  },

  // Layout-breaking CSS — passes structural checks but renders broken
  {
    group: 'Layout & Design', id: 'no-undefined-css-vars', name: 'No undefined CSS variables referenced',
    help: "Every var(--x) must be defined somewhere in the project's CSS. Pages copied from another project often reference that project's variable names (--brand-charcoal, --gut, --radius-card…) — undefined, they silently collapse colours, padding, and radii into a broken layout.",
    run: async (ctx) => {
      const { orphans, firstFile } = await findUndefinedCssVars(ctx)
      if (orphans.length === 0) return pass('no-undefined-css-vars', 'No undefined CSS variables referenced')
      const sample = orphans.slice(0, 5).join(', ')
      return fail(
        'no-undefined-css-vars',
        'No undefined CSS variables referenced',
        `${orphans.length} undefined var(s)${firstFile ? ` (e.g. in ${firstFile})` : ''}: ${sample}${orphans.length > 5 ? ', …' : ''} — layout will render with missing colours/spacing`,
      )
    },
  },

  // WhatsApp CTA color
  {
    group: 'Layout & Design', id: 'whatsapp-green', name: 'Uses official WhatsApp green (#25D366)',
    help: "WhatsApp buttons use the official #25D366 green so users recognise them.",
    run: async (ctx) => {
      const ok = await grepProject(ctx, /#25D366/i, ['.tsx', '.ts', '.css'])
      return ok
        ? pass('whatsapp-green', 'Uses official WhatsApp green (#25D366)')
        : fail('whatsapp-green', 'Uses official WhatsApp green (#25D366)', 'no #25D366 found — WhatsApp CTAs must use the official green')
    },
  },

  // Language switcher invariants
  {
    group: 'Layout & Design', id: 'lsw-globals-css', name: 'Language switcher CSS lives in globals.css',
    help: "Language switcher CSS lives in globals.css with !important so resets don't clobber it.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/globals.css')
      if (!c) return skip('lsw-globals-css', 'Language switcher CSS lives in globals.css', 'app/globals.css missing')
      const hasLsw = /\.lsw-/.test(c)
      const hasImportant = /\.lsw-[\s\S]{0,400}!important/.test(c)
      if (hasLsw && hasImportant) return pass('lsw-globals-css', 'Language switcher CSS lives in globals.css')
      if (!hasLsw) return fail('lsw-globals-css', 'Language switcher CSS lives in globals.css', 'no .lsw-* rules in globals.css — element resets will beat <style jsx>')
      return fail('lsw-globals-css', 'Language switcher CSS lives in globals.css', '.lsw-* rules need !important on display/flex-direction')
    },
  },
  {
    group: 'Layout & Design', id: 'circle-flag-useid', name: 'CircleFlag uses useId() for clipPath',
    help: "Each flag needs a unique clipPath id, otherwise some flags render as squares.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'components/LanguageSwitcher.tsx')
      if (!c) return skip('circle-flag-useid', 'CircleFlag uses useId() for clipPath', 'LanguageSwitcher.tsx missing')
      if (!/\bCircleFlag\b/.test(c)) return skip('circle-flag-useid', 'CircleFlag uses useId() for clipPath', 'no CircleFlag in LanguageSwitcher')
      return /\buseId\s*\(/.test(c)
        ? pass('circle-flag-useid', 'CircleFlag uses useId() for clipPath')
        : fail('circle-flag-useid', 'CircleFlag uses useId() for clipPath', 'sharing one clipPath id across flags makes them render square')
    },
  },

  // Alt text (translation keys + role=img pairing)
  {
    group: 'Layout & Design', id: 'alt-keys-all-locales', name: 'Alt-text keys present in en/ms/zh',
    help: "Alt-text translation keys exist in all three languages — no hardcoded English fallback.",
    run: async (ctx) => {
      const required = ['logoAlt', 'imageAlt']
      const locales: Record<string, string[]> = {}
      for (const loc of ['en', 'ms', 'zh']) {
        const c = await readProjectFile(ctx, `messages/${loc}.json`)
        if (c == null) { locales[loc] = ['__file_missing__']; continue }
        locales[loc] = required.filter((k) => !c.includes(`"${k}"`))
      }
      const broken = Object.entries(locales).filter(([, missing]) => missing.length > 0)
      return broken.length === 0
        ? pass('alt-keys-all-locales', 'Alt-text keys present in en/ms/zh', 'logoAlt + imageAlt in all 3 locales')
        : fail('alt-keys-all-locales', 'Alt-text keys present in en/ms/zh', broken.map(([loc, miss]) => `${loc}: ${miss.join(', ')}`).join(' | '))
    },
  },
  {
    group: 'Layout & Design', id: 'image-alt-template-model', name: 'products.imageAltTemplate uses {model}',
    help: "Product alts use a {model} template so 'Volvo EC200' substitutes per card.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'messages/ms.json')
      if (!c) return skip('image-alt-template-model', 'products.imageAltTemplate uses {model}', 'messages/ms.json missing')
      if (!/"imageAltTemplate"\s*:/.test(c)) {
        return fail('image-alt-template-model', 'products.imageAltTemplate uses {model}', 'no imageAltTemplate key — hardcoded product alts will go untranslated')
      }
      const ok = /"imageAltTemplate"\s*:\s*"[^"]*\{model\}/.test(c)
      return ok
        ? pass('image-alt-template-model', 'products.imageAltTemplate uses {model}')
        : fail('image-alt-template-model', 'products.imageAltTemplate uses {model}', 'imageAltTemplate string is missing the {model} placeholder')
    },
  },
  {
    group: 'Layout & Design', id: 'gallery-alts-array', name: 'gallery.alts is a non-empty array per locale',
    help: "Gallery has a real alt per image per locale — not generic 'image 1', 'image 2'.",
    run: async (ctx) => {
      const missing: string[] = []
      for (const loc of ['en', 'ms', 'zh']) {
        const c = await readProjectFile(ctx, `messages/${loc}.json`)
        if (c == null) { missing.push(`${loc}:file`); continue }
        try {
          const obj = JSON.parse(c)
          const alts = obj?.gallery?.alts
          if (!Array.isArray(alts) || alts.length === 0) missing.push(`${loc}:not-array`)
          else if (alts.some((s: unknown) => typeof s !== 'string' || /^image\s*\d+$/i.test(String(s).trim()))) missing.push(`${loc}:generic`)
        } catch {
          missing.push(`${loc}:parse`)
        }
      }
      return missing.length === 0
        ? pass('gallery-alts-array', 'gallery.alts is a non-empty array per locale')
        : fail('gallery-alts-array', 'gallery.alts is a non-empty array per locale', missing.join(' | '))
    },
  },
  {
    group: 'Layout & Design', id: 'final-cta-bg-alt', name: 'finalCta.bgAlt key exists (ms.json)',
    help: "Final CTA section's background image has a translated alt.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'messages/ms.json')
      if (!c) return skip('final-cta-bg-alt', 'finalCta.bgAlt key exists (ms.json)', 'messages/ms.json missing')
      try {
        const obj = JSON.parse(c)
        const v = obj?.finalCta?.bgAlt
        return typeof v === 'string' && v.trim().length > 0
          ? pass('final-cta-bg-alt', 'finalCta.bgAlt key exists (ms.json)')
          : fail('final-cta-bg-alt', 'finalCta.bgAlt key exists (ms.json)', 'finalCta.bgAlt missing — Final CTA <img> bg must not have empty alt')
      } catch {
        return fail('final-cta-bg-alt', 'finalCta.bgAlt key exists (ms.json)', 'ms.json failed to parse')
      }
    },
  },
  {
    group: 'Layout & Design', id: 'bg-role-img-aria-label', name: 'CSS bg images attach role="img" + aria-label',
    help: "CSS-background sections announce themselves to screen readers via role=img + aria-label.",
    run: async (ctx) => {
      // Hero/why/reviews-style background sections must be announced. Require
      // at least one role="img" usage (the convention is `<div role="img"
      // aria-label={t('bgAlt')} />`) AND every role="img" we find sits next to
      // an aria-label.
      const c = await readProjectFile(ctx, 'app/[locale]/page.tsx')
      if (!c) return skip('bg-role-img-aria-label', 'CSS bg images attach role="img" + aria-label', 'homepage file missing')
      const roleMatches = c.match(/role=["']img["'][^>]*/g) ?? []
      if (roleMatches.length === 0) {
        return fail('bg-role-img-aria-label', 'CSS bg images attach role="img" + aria-label', 'no role="img" elements — hero/why/reviews bg sections need it for screen readers')
      }
      const unpaired = roleMatches.filter((m) => !/aria-label/.test(m))
      return unpaired.length === 0
        ? pass('bg-role-img-aria-label', 'CSS bg images attach role="img" + aria-label', `${roleMatches.length} role="img" element(s), all paired`)
        : fail('bg-role-img-aria-label', 'CSS bg images attach role="img" + aria-label', `${unpaired.length} role="img" element(s) missing aria-label`)
    },
  },

  // Typography / heading invariants beyond Inter + h1/h2 counts
  {
    group: 'Layout & Design', id: 'icu-placeholders-lowercase', name: 'ICU placeholder names are lowercase',
    help: "ICU placeholders like {price} stay lowercase — Title-Case scripts must not touch them.",
    run: async (ctx) => {
      const bad: string[] = []
      for (const loc of ['en', 'ms', 'zh']) {
        const c = await readProjectFile(ctx, `messages/${loc}.json`)
        if (c == null) continue
        const m = c.match(/\{[A-Z][a-zA-Z_]*\}/g)
        if (m && m.length > 0) bad.push(`${loc}: ${[...new Set(m)].slice(0, 3).join(', ')}`)
      }
      return bad.length === 0
        ? pass('icu-placeholders-lowercase', 'ICU placeholder names are lowercase')
        : fail('icu-placeholders-lowercase', 'ICU placeholder names are lowercase', `Title-Case script must not uppercase placeholders — ${bad.join(' | ')}`)
    },
  },
  {
    group: 'Layout & Design', id: 'pagestyles-font-weight-inherit', name: 'PageStyles normalises font-weight: inherit',
    help: "Reset rule so wrapping text in h5 doesn't accidentally turn huge and bold.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'components/PageStyles.tsx')
      if (!c) return skip('pagestyles-font-weight-inherit', 'PageStyles normalises font-weight: inherit', 'PageStyles.tsx missing')
      return /font-weight\s*:\s*inherit/.test(c)
        ? pass('pagestyles-font-weight-inherit', 'PageStyles normalises font-weight: inherit')
        : fail('pagestyles-font-weight-inherit', 'PageStyles normalises font-weight: inherit', 'no `font-weight: inherit` normaliser — h5 swaps will pick up huge default heading sizes')
    },
  },

  // Site chrome on every public page (location, blog listing, blog post)
  {
    group: 'Layout & Design', id: 'location-page-chrome', name: 'Location page renders SiteHeader + SiteFooter + FomoBanner',
    help: "Location pages include the header, footer, and FOMO banner.",
    run: async (ctx) => {
      const slug = ctx.info.productSlug
      if (!slug) return skip('location-page-chrome', 'Location page renders SiteHeader + SiteFooter + FomoBanner', 'unknown productSlug')
      const c = await readProjectFile(ctx, `app/[locale]/${slug}/[location]/page.tsx`)
      if (!c) return skip('location-page-chrome', 'Location page renders SiteHeader + SiteFooter + FomoBanner', 'location page not found')
      // Chrome rendered by app/[locale]/layout.tsx applies to every page
      // beneath it — that is better than repeating it per page, not worse.
      // oxihome moved <FomoBanner /> into the layout to fix a sticky-overlap
      // bug and these checks read it as 'missing'.
      const layoutSrc = (await readProjectFile(ctx, 'app/[locale]/layout.tsx')) ?? ''
      const chrome = c + '\n' + layoutSrc
      const missing = (['SiteHeader', 'SiteFooter', 'FomoBanner'] as const).filter((tag) => !new RegExp(`<${tag}\\b`).test(chrome))
      return missing.length === 0
        ? pass('location-page-chrome', 'Location page renders SiteHeader + SiteFooter + FomoBanner')
        : fail('location-page-chrome', 'Location page renders SiteHeader + SiteFooter + FomoBanner', `missing: ${missing.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-listing-chrome', name: 'Blog listing renders SiteHeader + SiteFooter + FomoBanner',
    help: "Blog index includes the header, footer, and FOMO banner.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/page.tsx')
      if (!c) return skip('blog-listing-chrome', 'Blog listing renders SiteHeader + SiteFooter + FomoBanner', 'blog listing not found')
      // Chrome rendered by app/[locale]/layout.tsx applies to every page
      // beneath it — that is better than repeating it per page, not worse.
      // oxihome moved <FomoBanner /> into the layout to fix a sticky-overlap
      // bug and these checks read it as 'missing'.
      const layoutSrc = (await readProjectFile(ctx, 'app/[locale]/layout.tsx')) ?? ''
      const chrome = c + '\n' + layoutSrc
      const missing = (['SiteHeader', 'SiteFooter', 'FomoBanner'] as const).filter((tag) => !new RegExp(`<${tag}\\b`).test(chrome))
      return missing.length === 0
        ? pass('blog-listing-chrome', 'Blog listing renders SiteHeader + SiteFooter + FomoBanner')
        : fail('blog-listing-chrome', 'Blog listing renders SiteHeader + SiteFooter + FomoBanner', `missing: ${missing.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-post-chrome', name: 'Blog post renders SiteHeader + SiteFooter + FomoBanner',
    help: "Blog article pages include the header, footer, and FOMO banner.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-chrome', 'Blog post renders SiteHeader + SiteFooter + FomoBanner', 'blog post page not found')
      // Chrome rendered by app/[locale]/layout.tsx applies to every page
      // beneath it — that is better than repeating it per page, not worse.
      // oxihome moved <FomoBanner /> into the layout to fix a sticky-overlap
      // bug and these checks read it as 'missing'.
      const layoutSrc = (await readProjectFile(ctx, 'app/[locale]/layout.tsx')) ?? ''
      const chrome = c + '\n' + layoutSrc
      const missing = (['SiteHeader', 'SiteFooter', 'FomoBanner'] as const).filter((tag) => !new RegExp(`<${tag}\\b`).test(chrome))
      return missing.length === 0
        ? pass('blog-post-chrome', 'Blog post renders SiteHeader + SiteFooter + FomoBanner')
        : fail('blog-post-chrome', 'Blog post renders SiteHeader + SiteFooter + FomoBanner', `missing: ${missing.join(', ')}`)
    },
  },

  // Nav translation completeness
  {
    group: 'Layout & Design', id: 'nav-keys-complete', name: 'nav.{home,products,calculator,locations,blog,whatsappCta} in ms.json',
    help: "All nav labels are translated — otherwise raw 'nav.home' shows on the live site.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'messages/ms.json')
      if (!c) return skip('nav-keys-complete', 'nav.{home,products,calculator,locations,blog,whatsappCta} in ms.json', 'messages/ms.json missing')
      try {
        const obj = JSON.parse(c)
        const nav = obj?.nav ?? {}
        const missing = ['home', 'products', 'calculator', 'locations', 'blog', 'whatsappCta'].filter((k) => typeof nav[k] !== 'string' || nav[k].length === 0)
        return missing.length === 0
          ? pass('nav-keys-complete', 'nav.{home,products,calculator,locations,blog,whatsappCta} in ms.json')
          : fail('nav-keys-complete', 'nav.{home,products,calculator,locations,blog,whatsappCta} in ms.json', `missing: ${missing.join(', ')} — raw "nav.<key>" will render on the live site`)
      } catch {
        return fail('nav-keys-complete', 'nav.{home,products,calculator,locations,blog,whatsappCta} in ms.json', 'ms.json failed to parse')
      }
    },
  },

  // CTA button copy length
  {
    group: 'Layout & Design', id: 'cta-button-word-limit', name: 'CTA button labels are ≤3 words',
    help: "WhatsApp/CTA button copy stays punchy — at most 3 words (e.g. 'WhatsApp Us Now'). Longer labels wrap and look cluttered on mobile. Counts every word, WhatsApp included. Applies to clickable button labels only — not headings, subtext, tags, or sentence-style closing CTAs.",
    run: async (ctx) => {
      const MAX = 3
      // A CTA *button label* key: name contains cta/bookNow, but NOT the
      // heading / subtext / tag / alt-text / closing-paragraph variants that
      // live next to a button without being one.
      const isButtonKey = (k: string) => /cta|booknow/i.test(k) && !/bgalt|closing|alt$|subtext|subhead|subtitle|heading|tag/i.test(k)
      // Sentence/paragraph CTAs (questions, long prose) aren't buttons.
      const isButtonValue = (v: string) => v.length <= 45 && !/[?!]/.test(v)
      // Count words; ignore decorative symbol-only tokens like → · — .
      const wordCount = (v: string) => v.trim().split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length
      const violations: string[] = []
      for (const loc of ['en', 'ms']) {
        const c = await readProjectFile(ctx, `messages/${loc}.json`)
        if (c == null) continue
        let obj: unknown
        try { obj = JSON.parse(c) } catch { return fail('cta-button-word-limit', 'CTA button labels are ≤3 words', `${loc}.json failed to parse`) }
        const walk = (node: unknown, pathStr: string) => {
          if (node && typeof node === 'object') {
            for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
              const p = pathStr ? `${pathStr}.${k}` : k
              if (typeof v === 'string') {
                if (isButtonKey(k) && isButtonValue(v) && wordCount(v) > MAX) {
                  violations.push(`${loc}:${p} ("${v}" = ${wordCount(v)} words)`)
                }
              } else {
                walk(v, p)
              }
            }
          }
        }
        walk(obj, '')
      }
      return violations.length === 0
        ? pass('cta-button-word-limit', 'CTA button labels are ≤3 words')
        : fail('cta-button-word-limit', 'CTA button labels are ≤3 words', `over the 3-word limit: ${violations.slice(0, 6).join(', ')}${violations.length > 6 ? ` (+${violations.length - 6} more)` : ''}`)
    },
  },

  // Pricing convention
  {
    group: 'Layout & Design', id: 'price-from-prefix', name: "Price strings use 'Dari RM' prefix (ms.json)",
    help: "Prices read 'Dari RM X' (From RM X), never bare numbers.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'messages/ms.json')
      if (!c) return skip('price-from-prefix', "Price strings use 'Dari RM' prefix (ms.json)", 'messages/ms.json missing')
      const hasFrom = /"Dari RM \{price\}/.test(c)
      const hasRawPrice = /"price[A-Za-z]*"\s*:\s*"[^"]*RM/.test(c)
      if (!hasRawPrice) return skip('price-from-prefix', "Price strings use 'Dari RM' prefix (ms.json)", 'no price keys present')
      return hasFrom
        ? pass('price-from-prefix', "Price strings use 'Dari RM' prefix (ms.json)")
        : fail('price-from-prefix', "Price strings use 'Dari RM' prefix (ms.json)", "found price keys without 'Dari RM {price}' prefix — single-number pricing is forbidden")
    },
  },

  // Styled-jsx pitfalls
  {
    group: 'Layout & Design', id: 'nav-cta-global-scope', name: 'Styled-jsx targets .nav-cta via :global(...)',
    help: "Styled-jsx scope hack so the .nav-cta rule actually reaches the WhatsApp button.",
    run: async (ctx) => {
      const usesNavCta = await grepProject(ctx, /className=["'][^"']*\bnav-cta\b/, ['.tsx'])
      if (!usesNavCta) return skip('nav-cta-global-scope', 'Styled-jsx targets .nav-cta via :global(...)', 'no .nav-cta class used')
      const ok = await grepProject(ctx, /:global\(\.nav-cta\)/, ['.tsx'])
      return ok
        ? pass('nav-cta-global-scope', 'Styled-jsx targets .nav-cta via :global(...)')
        : fail('nav-cta-global-scope', 'Styled-jsx targets .nav-cta via :global(...)', 'a `.nav-cta` rule inside <style jsx> will silently miss WhatsAppButton — wrap with :global(.nav-cta)')
    },
  },
  {
    group: 'Layout & Design', id: 'header-mobile-wa-hidden', name: 'Mobile header hides .nav-cta',
    help: "Mobile hides the header WhatsApp button so it doesn't overlap the language dropdown.",
    run: async (ctx) => {
      // The hide rule lives either in globals.css OR in SiteHeader's <style jsx>
      // block — both are valid (sewa-excavator uses the latter via
      // `:global(.nav-cta) { display: none !important }` inside a max-width
      // media query). Accept both shapes.
      const candidates = ['app/globals.css', 'components/SiteHeader.tsx']
      for (const rel of candidates) {
        const c = await readProjectFile(ctx, rel)
        if (!c) continue
        const mediaBlocks = c.match(/@media[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g) ?? []
        const hit = mediaBlocks.some((b) => /max-width\s*:/.test(b) && /\.nav-cta[\s\S]{0,200}display\s*:\s*none/.test(b))
        if (hit) return pass('header-mobile-wa-hidden', 'Mobile header hides .nav-cta', `via ${rel}`)
        // Some projects rely on hiding a wrapping `.site-nav--desktop` (default
        // display:none, shown only at min-width breakpoints) — accept that too.
        if (/\.site-nav--desktop\s*\{[^}]*display\s*:\s*none/.test(c) && /\bnav-cta\b/.test(c)) {
          return pass('header-mobile-wa-hidden', 'Mobile header hides .nav-cta', `via .site-nav--desktop wrapper in ${rel}`)
        }
      }
      return fail('header-mobile-wa-hidden', 'Mobile header hides .nav-cta', 'no rule hides `.nav-cta` on mobile — WA button will overlap the language dropdown')
    },
  },

  // USP bar convention
  {
    group: 'Layout & Design', id: 'usp-panel-class-used', name: 'USP bar uses single .usp-panel container',
    help: "USP bar is one container with 3 cells — not 3 separate cards.",
    run: async (ctx) => {
      const ok = await grepProject(ctx, /\busp-panel\b/, ['.tsx', '.ts', '.css'])
      return ok
        ? pass('usp-panel-class-used', 'USP bar uses single .usp-panel container')
        : fail('usp-panel-class-used', 'USP bar uses single .usp-panel container', 'no `.usp-panel` class — USP bar must be one contained panel with 3 .usp-cell children, not 3 separate cards')
    },
  },

  // Project hygiene — raw artwork must not enter git
  {
    group: 'Layout & Design', id: 'project-gitignore', name: 'Project .gitignore excludes brand_assets/ + temporary screenshots/',
    help: "Raw brand assets and screenshots stay out of git.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, '.gitignore')
      if (c == null) return fail('project-gitignore', 'Project .gitignore excludes brand_assets/ + temporary screenshots/', 'no .gitignore in project root')
      const hasBrand = /(^|\n)\s*brand_assets\/?\s*(\n|$)/.test(c)
      const hasScreens = /(^|\n)\s*temporary\s+screenshots\/?\s*(\n|$)/.test(c)
      if (hasBrand && hasScreens) return pass('project-gitignore', 'Project .gitignore excludes brand_assets/ + temporary screenshots/')
      const missing = [!hasBrand && 'brand_assets/', !hasScreens && 'temporary screenshots/'].filter(Boolean) as string[]
      return fail('project-gitignore', 'Project .gitignore excludes brand_assets/ + temporary screenshots/', `missing: ${missing.join(', ')}`)
    },
  },

  // CTA routing — every WhatsApp CTA must go through the redirect page so the
  // server picks the right phone from Supabase (per-location, per-mode, etc.).
  {
    group: 'Layout & Design', id: 'cta-uses-redirect-page', name: 'Every CTA routes through /redirect-whatsapp-1',
    help: "Every CTA goes through the redirect page so it picks the right phone from Supabase. Direct wa.me/ links — or pages that import getWhatsAppLink/waLink and render the URL inline — bypass the database and break rotation/location targeting.",
    run: async (ctx) => {
      // Two failure modes we need to catch:
      //   1. Hard-coded `wa.me/…` URLs in JSX (someone pasted a phone number).
      //   2. Pages that import `getWhatsAppLink` / `waLink` from webcore and
      //      pass the resolved URL into `<a href={…}>`. The wa.me string never
      //      appears in source, so the regex above misses it — but the call
      //      site bypasses the redirect just the same.
      // Only `lib/webcore.ts` (defines the helpers) and
      // `redirect-whatsapp-1/page.tsx` (the redirect itself) may use these.
      const hits = await scanProjectFiles(
        ctx,
        ['.tsx', '.ts'],
        (rel) => rel === 'lib/webcore.ts' || rel.includes('redirect-whatsapp-1/'),
        (text) => {
          const direct = text.match(/(?:https?:\/\/)?wa\.me\/[^\s"'`<>]*|api\.whatsapp\.com\/send/)
          if (direct) return direct[0].slice(0, 80)
          // Catch indirect bypass: importing or invoking the resolver outside webcore.
          const helper = text.match(/\b(?:getWhatsAppLink|waLink)\s*\(/)
          if (helper) return `${helper[0]} — moves wa.me out of redirect`
          return null
        },
      )
      if (hits.length === 0) {
        return pass('cta-uses-redirect-page', 'Every CTA routes through /redirect-whatsapp-1')
      }
      const first = hits[0]
      return fail(
        'cta-uses-redirect-page',
        'Every CTA routes through /redirect-whatsapp-1',
        `${hits.length} hit(s) — e.g. ${first.file}: ${first.sample}`,
      )
    },
  },
  // Live-domain alignment — siteConfig.domain is the key Supabase rows are
  // filtered on. If it drifts from the actual deploy host, the live site shows
  // no products / phone-numbers / blog posts even though everything looks fine
  // locally.
  {
    // Merged the deploy-url + tracking-data-website domain checks into one
    // (keeps the wizard at exactly 100). Both compare against config/site.ts
    // domain; fails if EITHER the deployed host or the tracking data-website
    // disagrees. Each leg skips silently if its source file isn't present yet.
    group: 'Layout & Design', id: 'domain-consistency', name: 'siteConfig.domain matches deploy URL + tracking data-website',
    help: "siteConfig.domain is the key Supabase rows, leads-mode, and the WhatsApp redirect all use. The deployed host (deploy-url.txt) and the tracking <script data-website> must both match it, or the live site looks 'disconnected' and analytics miss.",
    run: async (ctx) => {
      const config = await readProjectFile(ctx, 'config/site.ts')
      if (!config) return skip('domain-consistency', 'siteConfig.domain matches deploy URL + tracking data-website', 'config/site.ts not found')
      const m = config.match(/domain\s*:\s*['"]([^'"]+)['"]/)
      if (!m) return fail('domain-consistency', 'siteConfig.domain matches deploy URL + tracking data-website', 'no `domain:` field in config/site.ts')
      const configHost = m[1].toLowerCase().replace(/^www\./, '')
      const problems: string[] = []

      // 1) Deployed host (skip this leg if not deployed yet).
      const deploy = await readProjectFile(ctx, 'deploy-url.txt')
      if (deploy) {
        const deployHost = deploy.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '').toLowerCase()
        if (configHost !== deployHost) {
          problems.push(`deploy host="${deployHost}" ≠ siteConfig.domain="${configHost}" — Supabase rows keyed on "${configHost}" will be invisible on the live site`)
        }
      }

      // 2) Tracking data-website in layout.tsx. Accept a literal value or
      // `data-website={siteConfig.domain}` (string-interpolated).
      const layout = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (layout) {
        const literal = layout.match(/data-website=["']([^"']+)["']/)
        if (literal) {
          const v = literal[1].toLowerCase().replace(/^www\./, '')
          if (v !== configHost) problems.push(`data-website="${literal[1]}" ≠ siteConfig.domain="${configHost}"`)
        } else if (!/data-website=\{[^}]*siteConfig\.domain[^}]*\}/.test(layout)) {
          problems.push('no `data-website` attribute in layout.tsx — tracking will not match any project in webcore')
        }
      }

      return problems.length === 0
        ? pass('domain-consistency', 'siteConfig.domain matches deploy URL + tracking data-website', configHost)
        : fail('domain-consistency', 'siteConfig.domain matches deploy URL + tracking data-website', problems.join(' | '))
    },
  },
  {
    group: 'Layout & Design', id: 'cta-opens-new-tab', name: 'CTA links to redirect page open in new tab',
    help: "Tapping a CTA opens WhatsApp in a new tab so the website stays open behind it and visitors keep browsing.",
    run: async (ctx) => {
      // Find every <Link …> or <a …> opening tag that references
      // /redirect-whatsapp-1 or the waRedirect() helper. Each such tag must
      // carry target="_blank". <WhatsAppButton> is fine — that component sets
      // target internally — so we skip its call sites by only matching
      // lowercase `<a` and capitalised `<Link`.
      const hits = await scanProjectFiles(
        ctx,
        ['.tsx'],
        (rel) => rel.includes('redirect-whatsapp-1/'),
        (text) => {
          // [^>] already matches newlines, so we don't need the `s` (dotAll) flag.
          const tagRe = /<(?:Link|a)\b[^>]*>/g
          for (const m of text.matchAll(tagRe)) {
            const tag = m[0]
            if (!/(?:waRedirect\(|redirect-whatsapp-1)/.test(tag)) continue
            if (/target=["']_blank["']/.test(tag)) continue
            return tag.replace(/\s+/g, ' ').slice(0, 120)
          }
          return null
        },
      )
      if (hits.length === 0) {
        return pass('cta-opens-new-tab', 'CTA links to redirect page open in new tab')
      }
      const first = hits[0]
      return fail(
        'cta-opens-new-tab',
        'CTA links to redirect page open in new tab',
        `${hits.length} hit(s) — e.g. ${first.file}: ${first.sample}`,
      )
    },
  },

  // Blog layout — both blog listing and blog post must follow the same
  // canonical structure used by the reference projects (sewa-excavator,
  // electric-wheelchair-malaysia). Hanabi-generated posts assume this shape.
  {
    group: 'Blog', id: 'blog-post-h1', name: 'Blog post has exactly one <h1>',
    help: "Each article has exactly one main title (H1) — SEO ranks the H1 as the page topic, multiple H1s confuse search engines.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-h1', 'Blog post has exactly one <h1>', 'blog post page not found')
      const n = countOccurrences(c, /<h1[\s>]/)
      if (n === 1) return pass('blog-post-h1', 'Blog post has exactly one <h1>')
      return fail('blog-post-h1', 'Blog post has exactly one <h1>', `found ${n} <h1> in blog post page (expected 1)`)
    },
  },
  {
    group: 'Blog', id: 'blog-post-breadcrumb', name: 'Blog post shows a breadcrumb',
    help: "Tiny Home → Blog → Article trail at the top of every post so visitors know where they are and can step back.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-breadcrumb', 'Blog post shows a breadcrumb', 'blog post page not found')
      const ok = /breadcrumb|aria-label=["']Breadcrumb["']/i.test(c)
      return ok
        ? pass('blog-post-breadcrumb', 'Blog post shows a breadcrumb')
        : fail('blog-post-breadcrumb', 'Blog post shows a breadcrumb', 'no breadcrumb nav — add `<nav className="breadcrumb">` with Home → Blog → article')
    },
  },
  {
    group: 'Blog', id: 'blog-content-class', name: 'Blog post renders `blog-content` wrapper',
    help: "The shared `.blog-content` CSS class is what styles headings, lists, and links inside the article body — without it the markdown HTML looks unstyled.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-content-class', 'Blog post renders `blog-content` wrapper', 'blog post page not found')
      const ok = /className=["'][^"']*\bblog-content\b/.test(c)
      return ok
        ? pass('blog-content-class', 'Blog post renders `blog-content` wrapper')
        : fail('blog-content-class', 'Blog post renders `blog-content` wrapper', 'no `blog-content` className — article body will render with default UA styles')
    },
  },
  {
    group: 'Blog', id: 'blog-post-cta-banner', name: 'Blog post has a WhatsApp CTA banner',
    help: "Every article ends with a WhatsApp CTA so readers who finish a post can immediately convert — and it must be recognisably WhatsApp (official glyph icon + official green), not a bare brand-coloured link.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-cta-banner', 'Blog post has a WhatsApp CTA banner', 'blog post page not found')
      // (a) A CTA must exist: a <WhatsAppButton …> or a link to the redirect page.
      const hasCta = /<WhatsAppButton\b|waRedirect\(|\/redirect-whatsapp-1/.test(c)
      if (!hasCta) return fail('blog-post-cta-banner', 'Blog post has a WhatsApp CTA banner', 'no WhatsApp CTA in blog post — readers finish the article with no path to convert')

      // The shared <WhatsAppButton> owns its own icon + green, so if the page
      // delegates to it we trust the component and pass.
      if (/<WhatsAppButton\b/.test(c)) return pass('blog-post-cta-banner', 'Blog post has a WhatsApp CTA banner')

      // (b) A hand-rolled CTA must still be recognisable: the official WhatsApp
      //     glyph (24×24 svg / WA path) AND the official green (#25D366 / .wa-btn).
      const hasIcon = /<WhatsAppIcon\b/.test(c) || /<svg[^>]*viewBox=["']0 0 24 24["']/.test(c) || /<path[^>]*\bd=["']M1[0-9]\.\d{3}/.test(c)
      const hasGreen = /\bwa-btn\b|\bbtn-wa\b|#25D366|var\(--wa-green\b/i.test(c)
      const miss: string[] = []
      if (!hasIcon) miss.push('official WhatsApp icon (svg glyph)')
      if (!hasGreen) miss.push('official green (#25D366 / .wa-btn)')
      return miss.length === 0
        ? pass('blog-post-cta-banner', 'Blog post has a WhatsApp CTA banner')
        : fail('blog-post-cta-banner', 'Blog post has a WhatsApp CTA banner', `CTA present but not recognisable as WhatsApp — missing ${miss.join(' + ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-post-reading-time', name: 'Blog post shows reading time',
    help: "A small `X min read` indicator helps visitors decide whether to start reading and increases dwell time.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-reading-time', 'Blog post shows reading time', 'blog post page not found')
      const ok = /readingTime|minRead|min[\s_-]?read/i.test(c)
      return ok
        ? pass('blog-post-reading-time', 'Blog post shows reading time')
        : fail('blog-post-reading-time', 'Blog post shows reading time', 'no reading-time indicator — compute it from word count and display next to the title')
    },
  },
  {
    group: 'Blog', id: 'blog-listing-h1-h2', name: 'Blog listing has one <h1> + one <h2>',
    help: "Blog index page needs the same H1+H2 SEO structure as the homepage — one main title, one subtitle.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/page.tsx')
      if (!c) return skip('blog-listing-h1-h2', 'Blog listing has one <h1> + one <h2>', 'blog listing not found')
      const h1 = countOccurrences(c, /<h1[\s>]/)
      const h2 = countOccurrences(c, /<h2[\s>]/)
      if (h1 === 1 && h2 === 1) return pass('blog-listing-h1-h2', 'Blog listing has one <h1> + one <h2>')
      return fail('blog-listing-h1-h2', 'Blog listing has one <h1> + one <h2>', `found ${h1} <h1> + ${h2} <h2> (expected 1 + 1)`)
    },
  },
  {
    group: 'Blog', id: 'blog-listing-grid', name: 'Blog listing uses a card grid',
    help: "Articles render in a responsive card grid (3+ cols on desktop, 1 col on mobile) — never a vertical stack of full-width blocks.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/page.tsx')
      if (!c) return skip('blog-listing-grid', 'Blog listing uses a card grid', 'blog listing not found')
      // Accept either the canonical `blog-grid` className, a CSS rule with
      // `grid-template-columns: repeat(…)`, or its inline-style camelCase
      // counterpart (`gridTemplateColumns: 'repeat(…)'`).
      const ok = /\bblog-grid\b/.test(c)
        || /grid-template-columns\s*:\s*repeat\(/.test(c)
        || /gridTemplateColumns\s*:\s*['"`]repeat\(/.test(c)
      return ok
        ? pass('blog-listing-grid', 'Blog listing uses a card grid')
        : fail('blog-listing-grid', 'Blog listing uses a card grid', 'no `blog-grid` class or `grid-template-columns: repeat(...)` — listing must be a responsive card grid, not a vertical stack')
    },
  },
  {
    group: 'Blog', id: 'blog-listing-cover-image', name: 'Blog cards render cover image + excerpt',
    help: "Each card shows the blog post's cover image and a short excerpt — text-only cards look unfinished and tank click-through.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/page.tsx')
      if (!c) return skip('blog-listing-cover-image', 'Blog cards render cover image + excerpt', 'blog listing not found')
      const hasCover = /cover_image_url|coverImage|cover_image/.test(c)
      const hasExcerpt = /\bexcerpt\b/.test(c)
      const missing: string[] = []
      if (!hasCover) missing.push('cover_image_url')
      if (!hasExcerpt) missing.push('excerpt')
      return missing.length === 0
        ? pass('blog-listing-cover-image', 'Blog cards render cover image + excerpt')
        : fail('blog-listing-cover-image', 'Blog cards render cover image + excerpt', `missing: ${missing.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-post-metadata', name: 'Blog post exports metadata',
    help: "Each article exports its own `metadata` / `generateMetadata` so Open Graph titles, descriptions, and share images are unique per post.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-metadata', 'Blog post exports metadata', 'blog post page not found')
      const ok = /export\s+(?:const|async function)\s+(?:metadata|generateMetadata)/.test(c)
      return ok
        ? pass('blog-post-metadata', 'Blog post exports metadata')
        : fail('blog-post-metadata', 'Blog post exports metadata', 'no `metadata` / `generateMetadata` export — every post needs its own OG title + description')
    },
  },

  // Pre-deploy disk hygiene
  {
    group: 'Layout & Design', id: 'public-folder-size', name: 'public/ under 20 MB',
    help: "Public folder stays under 20 MB so Vercel deploys stay fast.",
    run: async (ctx) => {
      const bytes = await dirSizeBytes(path.join(ctx.info.projectDir, 'public'))
      if (bytes == null) return skip('public-folder-size', 'public/ under 20 MB', 'no public/ folder')
      const mb = bytes / (1024 * 1024)
      const fmt = `${mb.toFixed(1)} MB`
      return mb < 20
        ? pass('public-folder-size', 'public/ under 20 MB', fmt)
        : fail('public-folder-size', 'public/ under 20 MB', `${fmt} — audit large files (find public -type f -size +500k)`)
    },
  },
]

const DATABASE: Check[] = [
  {
    group: 'Database', id: 'db-site-id-domain', name: 'siteId pinned + matches webcore domain',
    help: "config/site.ts pins the stable company_websites.id (siteId). The live domain is resolved FROM that id, so renaming the domain in the webcore admin can never silently disconnect the site. Fails if siteId is missing on a registered site (add it), if the id isn't found in webcore (wrong id / row deleted), or if webcore's current domain for that id no longer matches config/site.ts (a rename happened — update config + redeploy).",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('db-site-id-domain', 'siteId pinned + matches webcore domain', 'Supabase not configured')
      const configDomain = (ctx.info.domain ?? '').toLowerCase().replace(/^www\./, '')
      const siteId = ctx.info.siteId
      if (!siteId) {
        // Only nag when the site is actually registered; brand-new scaffolds
        // with no company_websites row yet shouldn't fail this.
        const c = await getDomainCounts(ctx.info.domainCandidates)
        return c.companyWebsites && c.companyWebsites > 0
          ? fail('db-site-id-domain', 'siteId pinned + matches webcore domain', 'no `siteId` in config/site.ts — pin company_websites.id so a domain rename can never disconnect this site')
          : skip('db-site-id-domain', 'siteId pinned + matches webcore domain', 'no siteId and no webcore registration yet')
      }
      const row = await getWebsiteById(siteId)
      if (!row) return fail('db-site-id-domain', 'siteId pinned + matches webcore domain', `siteId ${siteId} not found in company_websites — wrong id or row deleted`)
      const dbDomain = row.domain.toLowerCase().replace(/^www\./, '')
      if (!configDomain) return fail('db-site-id-domain', 'siteId pinned + matches webcore domain', `siteId resolves to "${dbDomain}" but config/site.ts has no domain`)
      return dbDomain === configDomain
        ? pass('db-site-id-domain', 'siteId pinned + matches webcore domain', `${siteId} → ${dbDomain}`)
        : fail('db-site-id-domain', 'siteId pinned + matches webcore domain', `webcore renamed this site to "${dbDomain}" but config/site.ts still says "${configDomain}" — update domain + deploy-url.txt and redeploy`)
    },
  },
  {
    group: 'Database', id: 'db-company-website', name: 'company_websites row',
    help: "This site is registered in the company_websites table.",
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
    help: "At least one active phone number is configured for this site.",
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
    help: "Active products exist in Supabase — otherwise the site renders empty product grids.",
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
    group: 'Blog', id: 'db-blog-posts', name: '≥10 published blog posts',
    help: "At least 10 published blog posts exist for organic traffic.",
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
  {
    group: 'Blog', id: 'live-blog-renders', name: 'Live /blog page actually renders posts',
    help: "Fetches the deployed /en/blog and confirms post cards are rendered, not the 'no posts yet' empty state. Catches the case where the DB has posts but the live site shows nothing — usually a siteConfig.domain mismatch (roller-shutter shipped with 10 DB posts and a /blog that rendered zero).",
    run: async (ctx) => {
      if (!ctx.info.deployUrl) return skip('live-blog-renders', 'Live /blog page actually renders posts', 'no deploy URL')
      const url = `${ctx.info.deployUrl.replace(/\/$/, '')}/en/blog`
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' })
        if (!res.ok) return fail('live-blog-renders', 'Live /blog page actually renders posts', `${url} returned ${res.status}`)
        const html = await res.text()
        // Count <a href="[/<locale>]/blog/<slug>"> links — each post card has at
        // least one. /blog itself (no trailing slug) is excluded.
        //
        // The locale segment is OPTIONAL. next-intl's `localePrefix: 'as-needed'`
        // (the fleet default) leaves the default locale UNPREFIXED, so a correct
        // site links to /blog/<slug>, not /en/blog/<slug>. Requiring the prefix
        // made this blocking check fail on every such site while 15 posts were
        // rendering, and the failure text blamed siteConfig.domain — so the
        // "fix" was to corrupt a correct domain value.
        const postLinks = new Set<string>()
        for (const m of html.matchAll(/href=["']\/(?:[a-z]{2}\/)?blog\/([a-z0-9][a-z0-9-]*)["']/g)) postLinks.add(m[1])
        if (postLinks.size > 0) return pass('live-blog-renders', 'Live /blog page actually renders posts', `${postLinks.size} post card(s) rendered`)
        // No post links found — check whether the page is showing the empty state.
        //
        // Scoped to RENDERED text: next-intl serialises the whole message
        // catalogue into __NEXT_DATA__, so the `noPosts` string ("No articles
        // published yet.") is present in the HTML of every page regardless of
        // what rendered. Matching raw HTML reported "empty state" on a page
        // showing a full grid of posts.
        const rendered = html
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
        const empty = /no\s*post|no\s*articles|tiada\s*post|tiada\s*artikel|暂无|沒有.*文章/i.test(rendered)
        return fail(
          'live-blog-renders',
          'Live /blog page actually renders posts',
          empty
            ? `live /blog shows empty state (no posts) but DB has rows — siteConfig.domain probably doesn't match the website column`
            : `live /blog rendered 0 post cards — check listing query and siteConfig.domain`,
        )
      } catch {
        return fail('live-blog-renders', 'Live /blog page actually renders posts', `${url} unreachable`)
      }
    },
  },
]

const DEPLOYMENT: Check[] = [
  {
    group: 'Deployment', id: 'vercel-linked', name: 'Vercel project linked',
    help: "Project is linked to a Vercel deployment.",
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
    help: "The deployed URL responds — the site is actually online.",
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
    group: 'Deployment', id: 'vercel-domain-match', name: 'siteConfig.domain is served by Vercel',
    help: "Asks the Vercel API which domains the project actually serves and confirms siteConfig.domain is one of them. Catches a domain changed in another system (Vercel/DNS) that the repo still doesn't reflect — the failure mode where the site is unreachable but every repo-internal check passes. Skips when no VERCEL_TOKEN is available.",
    run: async (ctx) => {
      const configDomain = (ctx.info.domain ?? '').toLowerCase().replace(/^www\./, '')
      if (!configDomain) return skip('vercel-domain-match', 'siteConfig.domain is served by Vercel', 'no domain in config/site.ts')

      // .vercel/project.json is gitignored (absent in CI) — use it when present
      // for the real projectName + teamId, else fall back to slug + env.
      let teamId: string | undefined = process.env.VERCEL_TEAM_ID
      let projectName = ctx.info.slug
      const pj = await readProjectFile(ctx, '.vercel/project.json')
      if (pj) { try { const j = JSON.parse(pj); teamId = j.orgId ?? teamId; projectName = j.projectName ?? projectName } catch { /* ignore */ } }

      const result = await getProjectDomains(projectName, teamId)
      if (result.skipped) return skip('vercel-domain-match', 'siteConfig.domain is served by Vercel', result.skipped)
      if (!result.ok) return skip('vercel-domain-match', 'siteConfig.domain is served by Vercel', result.error)  // infra/auth → skip, don't fail
      if (result.productionDomains.includes(configDomain)) {
        return pass('vercel-domain-match', 'siteConfig.domain is served by Vercel', configDomain)
      }
      const actual = result.productionDomains.length ? result.productionDomains.join(', ') : '(no production domain assigned)'
      return fail('vercel-domain-match', 'siteConfig.domain is served by Vercel',
        `config/site.ts domain "${configDomain}" is NOT served by Vercel — Vercel serves: ${actual}. Update config/site.ts + deploy-url.txt + data-website (and the DB rows) to the real domain.`)
    },
  },
  {
    group: 'Deployment', id: 'live-db-connected', name: 'Live site reads phone from Supabase',
    help: "The live site reads phone numbers from Supabase, not falling back to a hardcoded number.",
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

      // Also probe the www/apex counterpart of every candidate. Sites commonly
      // canonicalise apex -> www (or vice versa); if the phone row is keyed to
      // one host and the site serves the other, the lookup silently falls back
      // to the config placeholder number. Probing both catches that mismatch
      // even when the redirect chain would otherwise hide it.
      for (const u of [...baseUrls]) {
        try {
          const url = new URL(u)
          url.host = url.host.startsWith('www.') ? url.host.slice(4) : `www.${url.host}`
          const alt = url.origin
          if (!baseUrls.includes(alt)) baseUrls.push(alt)
        } catch { /* non-URL deployUrl — skip */ }
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
  {
    group: 'Deployment', id: 'live-phone-is-own-number', name: 'Live phone belongs to THIS site',
    help: "Fetches the live redirect page and compares the wa.me number against the phone_numbers rows for this site's OWN domain only. live-db-connected matches against a WIDENED candidate domain list (expanded by fallback-phone and slug-keyword lookups), so a number belonging to a different site in the fleet can satisfy it — that is exactly how 24hourelectrician.my scored 100/100 while serving another client's number from a stale Data Cache entry. Redeploying does NOT clear that cache; only revalidateTag does.",
    run: async (ctx) => {
      const NAME = 'Live phone belongs to THIS site'
      if (!supabaseConfigured) return skip('live-phone-is-own-number', NAME, 'Supabase not configured')
      const domain = ctx.info.domain
      if (!domain) return skip('live-phone-is-own-number', NAME, 'no domain in config/site.ts')
      const rows = await getPhoneRowsForExactDomain(domain)
      if (rows == null) return skip('live-phone-is-own-number', NAME, 'phone lookup failed')
      const own = rows.filter((r) => r.is_active).map((r) => r.phone_number)
      if (own.length === 0) return fail('live-phone-is-own-number', NAME, `no active phone_numbers row for ${domain}`)

      const live = await livePrefill(domain)
      if (!live) return fail('live-phone-is-own-number', NAME, `redirect page on https://${domain} returned no wa.me link`)
      return own.includes(live.phone)
        ? pass('live-phone-is-own-number', NAME, `live=${live.phone}`)
        : fail('live-phone-is-own-number', NAME, `live site serves ${live.phone} but ${domain} owns ${own.join(', ')} — stale webcore Data Cache? purge webcore-phones via /api/revalidate (a redeploy alone will NOT clear it)`)
    },
  },
  {
    group: 'Deployment', id: 'wa-prefill-carries-domain', name: 'WhatsApp prefill names the originating domain',
    help: "The prefilled WhatsApp message must open with this site's domain, so an operator can tell which site produced a lead — one number is often registered against several domains. Also fails on a double greeting (\"Hi domain.my, Hi Brand, ...\"), which happens when whatsapp_text already starts with a greeting and the code prefixes another.",
    run: async (ctx) => {
      const NAME = 'WhatsApp prefill names the originating domain'
      const domain = ctx.info.domain
      if (!domain) return skip('wa-prefill-carries-domain', NAME, 'no domain in config/site.ts')
      const live = await livePrefill(domain)
      if (!live) return skip('wa-prefill-carries-domain', NAME, 'redirect page returned no wa.me link')
      if (!live.text) return fail('wa-prefill-carries-domain', NAME, 'wa.me link carries no ?text= prefill at all')
      if (!live.text.includes(domain)) return fail('wa-prefill-carries-domain', NAME, `prefill does not name the domain — "${live.text.slice(0, 70)}"`)
      const greets = (live.text.match(/\b(hi|hello|hai|salam|assalamualaikum)\b/gi) ?? []).length
      return greets > 1
        ? fail('wa-prefill-carries-domain', NAME, `prefill greets ${greets}x — "${live.text.slice(0, 70)}"`)
        : pass('wa-prefill-carries-domain', NAME, `"${live.text.slice(0, 48)}…"`)
    },
  },
]

const QUALITY: Check[] = [
  {
    group: 'Quality', id: 'wa-prefill-domain-in-source', name: 'webcore builds the WhatsApp prefill with the domain',
    help: "Static counterpart to wa-prefill-carries-domain. That check probes the LIVE site, so it lives in the Deployment group and is dropped by `gate.ts --source-only` — the pre-commit mode. Without this, a lib/webcore.ts that discards the domain can be committed and only fails after it is already serving traffic. Verifies toResult() composes whatsappText from the domain rather than returning row.whatsapp_text verbatim. 24hourelectrician.my and tablechairrentals.my both shipped the discarding version, taking the domain as `_domain`.",
    run: async (ctx) => {
      const NAME = 'webcore builds the WhatsApp prefill with the domain'
      const c = await readProjectFile(ctx, 'lib/webcore.ts')
      if (c == null) return skip('wa-prefill-domain-in-source', NAME, 'no lib/webcore.ts')
      const fn = c.match(/function toResult\([\s\S]*?\n\}/)
      if (!fn) return skip('wa-prefill-domain-in-source', NAME, 'no toResult() in lib/webcore.ts')
      const body = fn[0]

      // The domain param being underscore-prefixed is the tell that it is unused.
      const sig = body.match(/function toResult\(([^)]*)\)/)?.[1] ?? ''
      const lastParam = sig.split(',').pop()?.trim() ?? ''
      if (/^_/.test(lastParam)) {
        return fail('wa-prefill-domain-in-source', NAME, `toResult() takes the domain as \`${lastParam.split(':')[0]}\` and discards it — the prefill will not name the site`)
      }
      const assign = body.match(/whatsappText:\s*([^,\n]*)/)?.[1] ?? ''
      const paramName = lastParam.split(':')[0].trim()
      const usesDomain = assign.includes('${' + paramName + '}') || /\$\{(domain|host)\}/.test(assign) || /\bbody\b/.test(assign)
      return usesDomain
        ? pass('wa-prefill-domain-in-source', NAME, assign.trim().slice(0, 46))
        : fail('wa-prefill-domain-in-source', NAME, `whatsappText is built as \`${assign.trim().slice(0, 50)}\` — no domain in it`)
    },
  },
  {
    group: 'Quality', id: 'fallback-phone-is-own', name: 'fallbackPhone is this client\'s own number',
    help: "config/site.ts fallbackPhone must be THIS client's number. A fallback pointing at another site in the fleet is worse than none: when the DB lookup misses, leads route silently to the wrong business instead of failing visibly. 60174287801 (katilhospital) had been copy-pasted into seven projects as a default.",
    run: async (ctx) => {
      const NAME = "fallbackPhone is this client's own number"
      if (!supabaseConfigured) return skip('fallback-phone-is-own', NAME, 'Supabase not configured')
      const fb = ctx.info.fallbackPhone
      const domain = ctx.info.domain
      if (!fb) return skip('fallback-phone-is-own', NAME, 'no fallbackPhone in config/site.ts')
      if (!domain) return skip('fallback-phone-is-own', NAME, 'no domain in config/site.ts')
      const own = await getPhoneRowsForExactDomain(domain)
      if (own == null) return skip('fallback-phone-is-own', NAME, 'phone lookup failed')
      const ownNumbers = own.map((r) => r.phone_number)
      if (ownNumbers.includes(fb)) return pass('fallback-phone-is-own', NAME, fb)

      const all = await getAllPhoneOwners()
      const otherOwners = Array.from(new Set((all ?? []).filter((r) => r.phone_number === fb && r.website !== domain).map((r) => r.website)))
      if (otherOwners.length > 0) {
        return fail('fallback-phone-is-own', NAME, `fallback ${fb} belongs to ${otherOwners.slice(0, 3).join(', ')} — a DB miss would route this site's leads to another client`)
      }
      return ownNumbers.length === 0
        ? fail('fallback-phone-is-own', NAME, `fallback ${fb} but ${domain} has no phone_numbers row to compare against`)
        : fail('fallback-phone-is-own', NAME, `fallback ${fb} is not among ${domain}'s own numbers (${ownNumbers.join(', ')})`)
    },
  },
  {
    group: 'Quality', id: 'no-hardcoded-phones', name: 'No hardcoded phone numbers in app/, components/, or messages/',
    help: "Advisory — a hardcoded number is allowed; this reports where they are so you can confirm each one is intentional. Numbers that come from the database still rotate per location and per leads-mode; a hardcoded one does not. Covers app/ + components/ source AND messages/*.json translation copy (those values render on the page, so a placeholder number there is just as visible).",
    run: async (ctx) => {
      const codeHits = await findHardcodedPhones(ctx.info.projectDir)
      const msgHits = (await findMessageLeaks(ctx.info.projectDir)).filter((h) => h.kind === 'phone')
      const total = codeHits.length + msgHits.length
      const name = 'No hardcoded phone numbers in app/, components/, or messages/'
      if (total === 0) return pass('no-hardcoded-phones', name)
      const where = codeHits.length
        ? `${codeHits[0].file}:${codeHits[0].line} → ${codeHits[0].match}`
        : `${msgHits[0].file} [${msgHits[0].key}] → ${msgHits[0].match}`
      return fail('no-hardcoded-phones', name, `${total} hit(s) — e.g. ${where}`)
    },
  },
  {
    group: 'Quality', id: 'no-domains-in-copy', name: 'No domain/URL shown as visible text in copy',
    help: "CLAUDE.md forbids displaying any domain or URL as visible text — all contact goes through WhatsApp redirect buttons. Translation (messages/*.json) values are always rendered on the page, so a domain like `example.my` in footer copyright or any other string is a visible-text leak. Code (app/, components/) is NOT scanned here: canonical URLs, metadataBase, and JSON-LD schema legitimately carry the domain in non-rendered markup.",
    run: async (ctx) => {
      const hits = (await findMessageLeaks(ctx.info.projectDir)).filter((h) => h.kind === 'domain')
      if (hits.length === 0) return pass('no-domains-in-copy', 'No domain/URL shown as visible text in copy')
      const first = hits[0]
      return fail(
        'no-domains-in-copy',
        'No domain/URL shown as visible text in copy',
        `${hits.length} hit(s) — e.g. ${first.file} [${first.key}] → ${first.match}`,
      )
    },
  },
  {
    group: 'Blog', id: 'no-hardcoded-phones-blog', name: 'No hardcoded phone numbers in blog content',
    help: "Advisory — a hardcoded number in blog content is allowed; this reports which posts carry one. Links routed through the redirect still pick the right number from Supabase.",
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

  // Blog content quality — scans actual post HTML in Supabase to confirm
  // articles are properly formatted (TOC, headings, paragraphs, lists, bold).
  // A post that fails any of these is a wall of text that hurts dwell time.
  {
    group: 'Blog', id: 'blog-content-toc', name: 'Articles include a table of contents',
    help: "Every article opens with a list of in-page links to its sections — readers can jump to what they want, and Google rewards posts that look scannable.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-toc', 'Articles include a table of contents', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-toc', 'Articles include a table of contents', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-toc', 'Articles include a table of contents', 'query failed')
      if (rows.length === 0) return skip('blog-content-toc', 'Articles include a table of contents', 'no posts to check')
      const r = evaluateBlogPosts(rows, (s) => s.hasToc)
      if (r.total === 0) return skip('blog-content-toc', 'Articles include a table of contents', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-toc', 'Articles include a table of contents', `${r.passed}/${r.total} posts have a TOC`)
        : fail('blog-content-toc', 'Articles include a table of contents', `${r.passed}/${r.total} posts have a TOC — missing in: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-headings', name: 'Articles use section headings (≥3 H2s)',
    help: "Each article is broken into at least 3 H2 sections instead of running as one giant block of text — headings are how scanners read.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-headings', 'Articles use section headings (≥3 H2s)', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-headings', 'Articles use section headings (≥3 H2s)', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-headings', 'Articles use section headings (≥3 H2s)', 'query failed')
      if (rows.length === 0) return skip('blog-content-headings', 'Articles use section headings (≥3 H2s)', 'no posts to check')
      const r = evaluateBlogPosts(rows, (s) => s.h2Count >= 3)
      if (r.total === 0) return skip('blog-content-headings', 'Articles use section headings (≥3 H2s)', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-headings', 'Articles use section headings (≥3 H2s)', `${r.passed}/${r.total} posts have ≥3 H2s`)
        : fail('blog-content-headings', 'Articles use section headings (≥3 H2s)', `${r.passed}/${r.total} posts have ≥3 H2s — flat posts: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-bold', name: 'Articles use enough bold emphasis (≥1 per ~1800 chars)',
    help: "Bolded keywords break visual monotony and help skimmers — one lonely <strong> in an 8000-char article reads as no emphasis at all.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-bold', 'Articles use enough bold emphasis (≥1 per ~1800 chars)', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-bold', 'Articles use enough bold emphasis (≥1 per ~1800 chars)', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-bold', 'Articles use enough bold emphasis (≥1 per ~1800 chars)', 'query failed')
      if (rows.length === 0) return skip('blog-content-bold', 'Articles use enough bold emphasis (≥1 per ~1800 chars)', 'no posts to check')
      // Density-aware: long articles need proportionally more bold. 8000-char
      // article needs ≥4 bolds; 3000-char article still needs ≥1.
      const r = evaluateBlogPosts(rows, (s) => s.boldCount >= Math.max(1, Math.floor(s.contentChars / 1800)))
      if (r.total === 0) return skip('blog-content-bold', 'Articles use enough bold emphasis (≥1 per ~1800 chars)', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-bold', 'Articles use enough bold emphasis (≥1 per ~1800 chars)', `${r.passed}/${r.total} posts have density-appropriate bold`)
        : fail('blog-content-bold', 'Articles use enough bold emphasis (≥1 per ~1800 chars)', `${r.passed}/${r.total} posts have density-appropriate bold — sparse posts: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-paragraphs', name: 'Articles have ≥5 paragraphs',
    help: "Each article is broken into multiple paragraphs (at least 5) — a single giant block of text reads like an essay nobody finishes.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-paragraphs', 'Articles have ≥5 paragraphs', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-paragraphs', 'Articles have ≥5 paragraphs', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-paragraphs', 'Articles have ≥5 paragraphs', 'query failed')
      if (rows.length === 0) return skip('blog-content-paragraphs', 'Articles have ≥5 paragraphs', 'no posts to check')
      const r = evaluateBlogPosts(rows, (s) => s.paragraphCount >= 5)
      if (r.total === 0) return skip('blog-content-paragraphs', 'Articles have ≥5 paragraphs', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-paragraphs', 'Articles have ≥5 paragraphs', `${r.passed}/${r.total} posts have ≥5 paragraphs`)
        : fail('blog-content-paragraphs', 'Articles have ≥5 paragraphs', `${r.passed}/${r.total} posts have ≥5 paragraphs — sparse posts: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-lists', name: 'Articles use bullet or numbered lists',
    help: "Lists (bullet or numbered) make steps and feature lists scannable — every article should have at least one.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-lists', 'Articles use bullet or numbered lists', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-lists', 'Articles use bullet or numbered lists', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-lists', 'Articles use bullet or numbered lists', 'query failed')
      if (rows.length === 0) return skip('blog-content-lists', 'Articles use bullet or numbered lists', 'no posts to check')
      const r = evaluateBlogPosts(rows, (s) => s.ulCount + s.olCount >= 1)
      if (r.total === 0) return skip('blog-content-lists', 'Articles use bullet or numbered lists', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-lists', 'Articles use bullet or numbered lists', `${r.passed}/${r.total} posts use lists`)
        : fail('blog-content-lists', 'Articles use bullet or numbered lists', `${r.passed}/${r.total} posts use lists — list-less posts: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-readable-paragraphs', name: 'Average paragraph under 600 chars',
    help: "Average paragraph length stays under ~600 characters (≈100 words) — longer paragraphs become walls of text and visitors bounce.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-readable-paragraphs', 'Average paragraph under 600 chars', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-readable-paragraphs', 'Average paragraph under 600 chars', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-readable-paragraphs', 'Average paragraph under 600 chars', 'query failed')
      if (rows.length === 0) return skip('blog-content-readable-paragraphs', 'Average paragraph under 600 chars', 'no posts to check')
      const r = evaluateBlogPosts(rows, (s) => s.paragraphCount === 0 || s.avgParagraphChars < 600)
      if (r.total === 0) return skip('blog-content-readable-paragraphs', 'Average paragraph under 600 chars', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-readable-paragraphs', 'Average paragraph under 600 chars', `${r.passed}/${r.total} posts are readable`)
        : fail('blog-content-readable-paragraphs', 'Average paragraph under 600 chars', `${r.passed}/${r.total} posts under 600c avg — wall-of-text posts: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-images', name: 'Articles have enough inline images (≥1 per ~3500 chars)',
    help: "Long articles need visual breaks — one inline image per ~3500 chars (so an 8000-char article gets 2-3 photos, not just a cover).",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-images', 'Articles have enough inline images (≥1 per ~3500 chars)', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-images', 'Articles have enough inline images (≥1 per ~3500 chars)', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-images', 'Articles have enough inline images (≥1 per ~3500 chars)', 'query failed')
      if (rows.length === 0) return skip('blog-content-images', 'Articles have enough inline images (≥1 per ~3500 chars)', 'no posts to check')
      const r = evaluateBlogPosts(rows, (s) => s.imgCount >= Math.max(1, Math.floor(s.contentChars / 3500)))
      if (r.total === 0) return skip('blog-content-images', 'Articles have enough inline images (≥1 per ~3500 chars)', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-images', 'Articles have enough inline images (≥1 per ~3500 chars)', `${r.passed}/${r.total} posts have density-appropriate images`)
        : fail('blog-content-images', 'Articles have enough inline images (≥1 per ~3500 chars)', `${r.passed}/${r.total} posts have enough images — sparse posts: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-img-alt', name: 'Every <img> in articles has descriptive alt',
    help: "Inline article images all carry a non-empty alt — screen readers, broken-image fallbacks, and Google Images all need it.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-img-alt', 'Every <img> in articles has descriptive alt', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-img-alt', 'Every <img> in articles has descriptive alt', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-img-alt', 'Every <img> in articles has descriptive alt', 'query failed')
      if (rows.length === 0) return skip('blog-content-img-alt', 'Every <img> in articles has descriptive alt', 'no posts to check')
      // A post with no images can't fail this check — skip it. Otherwise every
      // <img> must have a non-empty alt.
      const r = evaluateBlogPosts(rows, (s) => s.imgCount === 0 || s.imgMissingAlt === 0)
      if (r.total === 0) return skip('blog-content-img-alt', 'Every <img> in articles has descriptive alt', 'no posts with content')
      return r.passed === r.total
        ? pass('blog-content-img-alt', 'Every <img> in articles has descriptive alt', `${r.passed}/${r.total} posts have alt on every image`)
        : fail('blog-content-img-alt', 'Every <img> in articles has descriptive alt', `${r.passed}/${r.total} posts have full alt coverage — missing-alt posts: ${r.offenders.join(', ')}`)
    },
  },
  {
    group: 'Blog', id: 'blog-content-internal-links', name: 'Articles include internal links (≥3)',
    help: "Each article links to at least 3 other internal pages (products, locations, other articles) — crawlers follow these to discover the site and visitors bounce less.",
    run: async (ctx) => {
      if (!supabaseConfigured) return skip('blog-content-internal-links', 'Articles include internal links (≥3)', 'Supabase not configured')
      if (ctx.info.domainCandidates.length === 0) return skip('blog-content-internal-links', 'Articles include internal links (≥3)', 'unknown domain')
      const rows = await getBlogContentRows(ctx.info.domainCandidates)
      if (rows == null) return skip('blog-content-internal-links', 'Articles include internal links (≥3)', 'query failed')
      if (rows.length === 0) return skip('blog-content-internal-links', 'Articles include internal links (≥3)', 'no posts to check')
      // Count <a href="/..."> — relative URLs that point at the same site.
      // External http(s):// links and in-page #anchors (TOC) are excluded.
      // Internal-link count is only meaningful here — keep its regex inline,
      // but reuse `canonicalTranslation` so we don't re-walk the translations
      // array for every blog-content check.
      const offenders: string[] = []
      let total = 0, passed = 0
      for (const post of rows) {
        const canonical = canonicalTranslation(post)
        if (!canonical) continue
        total++
        const internal = (canonical.content!.match(/<a\s+[^>]*href=["']\/[^"'#][^"']*["']/gi) ?? []).length
        if (internal >= 3) passed++
        else if (offenders.length < 3) offenders.push(`${post.slug}/${canonical.language}(${internal})`)
      }
      if (total === 0) return skip('blog-content-internal-links', 'Articles include internal links (≥3)', 'no posts with content')
      return passed === total
        ? pass('blog-content-internal-links', 'Articles include internal links (≥3)', `${passed}/${total} posts have ≥3 internal links`)
        : fail('blog-content-internal-links', 'Articles include internal links (≥3)', `${passed}/${total} posts have ≥3 internal links — under-linked: ${offenders.join(', ')}`)
    },
  },

  // Blog rendering CSS — the article HTML can be perfectly structured but if
  // there's no .blog-content CSS, every h2/h3/h4/ul renders at body-text size
  // with no spacing and the post reads as a wall of identical-looking lines.
  // (Real example: sewa-motor & tablechair both ship the right HTML and zero
  // CSS to make it look like an article.)
  {
    group: 'Blog', id: 'blog-content-headings-css', name: 'CSS styles .blog-content h2/h3/h4',
    help: "Without `.blog-content h2/h3/h4` font-size rules, every heading in the article renders at body-text size and the whole post reads as one undifferentiated wall of text.",
    run: async (ctx) => {
      // Combine the most likely CSS hosts: globals.css, PageStyles, and the
      // blog page files themselves (some projects inline blog styles).
      const sources = [
        'app/globals.css',
        'components/PageStyles.tsx',
        'app/[locale]/blog/page.tsx',
        'app/[locale]/blog/[slug]/page.tsx',
      ]
      let combined = ''
      for (const rel of sources) {
        const c = await readProjectFile(ctx, rel)
        if (c) combined += '\n' + c
      }
      if (!combined) return skip('blog-content-headings-css', 'CSS styles .blog-content h2/h3/h4', 'no CSS source files found')
      // A real heading rule has BOTH `.blog-content hN` selector AND a
      // font-size (or font-weight) declaration in the same rule body.
      const styled = (tag: string) => {
        const rule = new RegExp(`\\.blog-content[^{]*?\\b${tag}\\b[^{]*\\{[^}]*(?:font-size|font-weight)\\s*:`, 'i')
        return rule.test(combined)
      }
      const missing: string[] = []
      if (!styled('h2')) missing.push('h2')
      if (!styled('h3')) missing.push('h3')
      // h4 is common in checklists/listicles — flag if missing, but don't fail
      // solely on it. Only the h2/h3 absence is a hard fail.
      if (missing.length === 0) {
        const h4ok = styled('h4')
        return pass('blog-content-headings-css', 'CSS styles .blog-content h2/h3/h4', h4ok ? 'h2 + h3 + h4 styled' : 'h2 + h3 styled (h4 missing but optional)')
      }
      return fail('blog-content-headings-css', 'CSS styles .blog-content h2/h3/h4', `missing CSS for: ${missing.join(', ')} — article headings will render at body-text size`)
    },
  },
  {
    // Merged paragraph + list CSS into one check (keeps the total at 100 while
    // covering both). Fails if EITHER `.blog-content p` spacing OR
    // `.blog-content ul/ol` bullets/indent styling is missing.
    group: 'Blog', id: 'blog-content-body-css', name: 'CSS styles .blog-content p + ul/ol',
    help: "Article paragraphs need `.blog-content p` line-height/spacing and lists need `.blog-content ul/ol` padding + list-style. Without them paragraphs cramp together and lists lose their bullets (flat plain-text lines, like sewa-motor's TOC).",
    run: async (ctx) => {
      const sources = ['app/globals.css', 'components/PageStyles.tsx', 'app/[locale]/blog/page.tsx', 'app/[locale]/blog/[slug]/page.tsx']
      let combined = ''
      for (const rel of sources) {
        const c = await readProjectFile(ctx, rel)
        if (c) combined += '\n' + c
      }
      if (!combined) return skip('blog-content-body-css', 'CSS styles .blog-content p + ul/ol', 'no CSS source files found')
      const pOk = /\.blog-content\s+p\s*\{[^}]*(?:line-height|font-size|margin)\s*:/i.test(combined)
      const listOk = /\.blog-content\s+(?:ul|ol)\s*[,{][^}]*(?:padding|list-style|margin)\s*:/i.test(combined)
        || /\.blog-content\s+ul\s*,\s*\.blog-content\s+ol\s*\{[^}]*(?:padding|list-style|margin)/i.test(combined)
      const missing: string[] = []
      if (!pOk) missing.push('p (line-height/spacing)')
      if (!listOk) missing.push('ul/ol (bullets/padding)')
      return missing.length === 0
        ? pass('blog-content-body-css', 'CSS styles .blog-content p + ul/ol')
        : fail('blog-content-body-css', 'CSS styles .blog-content p + ul/ol', `missing CSS for: ${missing.join(', ')} — article body renders with default UA styling`)
    },
  },
  {
    group: 'Blog', id: 'blog-post-schema', name: 'Blog post emits Article / BlogPosting JSON-LD',
    help: "Every post emits structured data (Article or BlogPosting JSON-LD) so Google can show rich snippets — author, publish date, headline — in search results.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-schema', 'Blog post emits Article / BlogPosting JSON-LD', 'blog post page not found')
      // Accept three shapes: a <ArticleSchema /> / <BlogPostingSchema /> component,
      // an inline application/ld+json script with the right @type, or a direct
      // JSON-LD object referencing "Article" or "BlogPosting".
      const ok = /<(?:Article|BlogPosting)Schema\b/.test(c)
        || /application\/ld\+json/.test(c)
        || /["']@type["']\s*:\s*["'](?:Article|BlogPosting|NewsArticle)["']/.test(c)
      return ok
        ? pass('blog-post-schema', 'Blog post emits Article / BlogPosting JSON-LD')
        : fail('blog-post-schema', 'Blog post emits Article / BlogPosting JSON-LD', 'no Article/BlogPosting schema — add <ArticleSchema /> or an inline JSON-LD script')
    },
  },
  {
    group: 'Blog', id: 'blog-content-toc-css', name: 'CSS styles the TOC (.blog-content nav / .toc)',
    help: "TOC needs its own visual treatment — a bordered box, indented list, hover state — otherwise it renders as a flat string of section names with no affordance that they're links.",
    run: async (ctx) => {
      const sources = ['app/globals.css', 'components/PageStyles.tsx', 'app/[locale]/blog/page.tsx', 'app/[locale]/blog/[slug]/page.tsx']
      let combined = ''
      for (const rel of sources) {
        const c = await readProjectFile(ctx, rel)
        if (c) combined += '\n' + c
      }
      if (!combined) return skip('blog-content-toc-css', 'CSS styles the TOC (.blog-content nav / .toc)', 'no CSS source files found')
      // Accept any of: `.blog-content nav`, `.blog-toc`, `.toc` with any
      // declaration body. The point is "the author actually styled the TOC".
      const ok = /\.blog-content\s+nav\s*\{/i.test(combined)
        || /\.blog-toc\s*\{/i.test(combined)
        || /\.toc\s*\{/i.test(combined)
        || /\.blog-content\s+nav\s+(?:ul|ol|li|a)\s*\{/i.test(combined)
      return ok
        ? pass('blog-content-toc-css', 'CSS styles the TOC (.blog-content nav / .toc)')
        : fail('blog-content-toc-css', 'CSS styles the TOC (.blog-content nav / .toc)', 'no `.blog-content nav` / `.toc` rule — TOC renders as plain text with no bullets, no border, no hint that lines are links')
    },
  },
]

const ALL_CHECKS: Check[] = [
  ...STRUCTURE,
  ...SEO,
  ...I18N,
  ...WEBCORE,
  ...TRACKING,
  ...GOOGLE,
  ...DESIGN,
  ...DATABASE,
  ...DEPLOYMENT,
  ...QUALITY,
]

// Display order for the wizard UI. Lets us re-tag checks across groups without
// physically moving their definitions in ALL_CHECKS. Unknown groups fall to
// the end in alphabetical order.
const GROUP_ORDER = [
  'Structure',
  'SEO',
  'i18n',
  'Webcore data layer',
  'Tracking',
  'Google Integration',
  'Layout & Design',
  'Blog',
  'Database',
  'Deployment',
  'Quality',
] as const

export async function runChecksForProject(info: ProjectInfo): Promise<CheckGroup[]> {
  const ctx: Ctx = { info, fileCache: new Map(), grepCache: new Map() }
  const TIMING = process.env.CHECKLIST_TIMING === '1'
  const results = await Promise.all(ALL_CHECKS.map(async (c) => {
    if (!TIMING) return c.run(ctx)
    const t0 = performance.now()
    const r = await c.run(ctx)
    const ms = performance.now() - t0
    if (ms > 500) console.warn(`[checklist] slow check ${c.id}: ${ms.toFixed(0)}ms`)
    return r
  }))

  const byGroup = new Map<string, CheckResult[]>()
  ALL_CHECKS.forEach((c, i) => {
    if (!byGroup.has(c.group)) byGroup.set(c.group, [])
    // Attach the static layman `help` string from the check definition onto
    // the result. The runner is the single source of truth here so we don't
    // have to thread `help` through every pass/fail/skip helper call.
    byGroup.get(c.group)!.push({ ...results[i], help: c.help })
  })

  const groups = Array.from(byGroup.entries()).map(([name, items]) => ({ name, items }))
  groups.sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a.name as typeof GROUP_ORDER[number])
    const bi = GROUP_ORDER.indexOf(b.name as typeof GROUP_ORDER[number])
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
  return groups
}

export function totalCheckCount(): number {
  return ALL_CHECKS.length
}
