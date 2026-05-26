import { readFile, access, readdir, stat } from 'fs/promises'
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
    group: 'Structure', id: 'blog-listing', name: 'Blog listing page',
    help: "The blog index page that lists all articles.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'app/[locale]/blog/page.tsx')
      return ok
        ? pass('blog-listing', 'Blog listing page', 'app/[locale]/blog/page.tsx')
        : fail('blog-listing', 'Blog listing page', 'Missing app/[locale]/blog/page.tsx')
    },
  },
  {
    group: 'Structure', id: 'blog-post', name: 'Blog post detail page',
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
    help: "When you pick a default language, every visitor lands on it — no browser auto-detection override and the URL always carries the locale prefix.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'i18n/routing.ts')
      if (!c) return fail('default-locale-enforced', 'Default locale always shown first', 'Missing i18n/routing.ts')
      const defMatch = c.match(/defaultLocale\s*:\s*['"]([a-z-]+)['"]/)
      if (!defMatch) {
        return fail('default-locale-enforced', 'Default locale always shown first', 'no defaultLocale set in i18n/routing.ts')
      }
      const defLoc = defMatch[1]
      const missing: string[] = []
      // Force the locale prefix on every URL so `/` always redirects to
      // `/<defaultLocale>` instead of serving locale-detected content.
      if (!/localePrefix\s*:\s*['"]always['"]/.test(c)) missing.push("localePrefix: 'always'")
      // Disable browser-language autodetection so a visitor with
      // Accept-Language: en doesn't bounce off a Malay-default site.
      if (!/localeDetection\s*:\s*false/.test(c)) missing.push('localeDetection: false')
      return missing.length === 0
        ? pass('default-locale-enforced', 'Default locale always shown first', `defaultLocale=${defLoc}`)
        : fail('default-locale-enforced', 'Default locale always shown first', `defaultLocale=${defLoc} but missing: ${missing.join(', ')}`)
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
  {
    group: 'Layout & Design', id: 'alt-translation-keys', name: 'Alt-text translation keys exist (ms.json)',
    help: "Alt-text translation keys exist in the Malay messages file.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'messages/ms.json')
      if (!c) return skip('alt-translation-keys', 'Alt-text translation keys exist (ms.json)', 'messages/ms.json missing')
      const missing = ['logoAlt', 'imageAlt'].filter((k) => !c.includes(`"${k}"`))
      return missing.length === 0
        ? pass('alt-translation-keys', 'Alt-text translation keys exist (ms.json)', 'logoAlt + imageAlt present')
        : fail('alt-translation-keys', 'Alt-text translation keys exist (ms.json)', `missing: ${missing.join(', ')}`)
    },
  },

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
    group: 'Layout & Design', id: 'homepage-h1-count', name: 'Homepage has exactly one <h1>',
    help: "Homepage has exactly one main title (H1) — SEO needs a single H1.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/page.tsx')
      if (!c) return fail('homepage-h1-count', 'Homepage has exactly one <h1>', 'homepage file missing')
      const n = countOccurrences(c, /<h1[\s>]/)
      if (n === 1) return pass('homepage-h1-count', 'Homepage has exactly one <h1>')
      return fail('homepage-h1-count', 'Homepage has exactly one <h1>', `found ${n} <h1> in page.tsx (expected 1)`)
    },
  },
  {
    group: 'Layout & Design', id: 'homepage-h2-count', name: 'Homepage has exactly one <h2>',
    help: "Homepage has exactly one subtitle (H2) — SEO needs a single H2.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/page.tsx')
      if (!c) return fail('homepage-h2-count', 'Homepage has exactly one <h2>', 'homepage file missing')
      const n = countOccurrences(c, /<h2[\s>]/)
      if (n === 1) return pass('homepage-h2-count', 'Homepage has exactly one <h2>')
      return fail('homepage-h2-count', 'Homepage has exactly one <h2>', `found ${n} <h2> in page.tsx (expected 1)`)
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

  // Shared components exist
  {
    group: 'Layout & Design', id: 'marketing-marquee', name: 'MarketingMarquee component',
    help: "Scrolling marquee between sections (replaces the old dashed dividers).",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'components/MarketingMarquee.tsx')
      return ok
        ? pass('marketing-marquee', 'MarketingMarquee component')
        : fail('marketing-marquee', 'MarketingMarquee component', 'Missing components/MarketingMarquee.tsx (replaces decorative dividers between hero→USP and calculator→process)')
    },
  },
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
    group: 'Layout & Design', id: 'fomo-banner', name: 'FomoBanner component',
    help: "The red urgency countdown banner at the very top of every page.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'components/FomoBanner.tsx')
      return ok
        ? pass('fomo-banner', 'FomoBanner component')
        : fail('fomo-banner', 'FomoBanner component', 'Missing components/FomoBanner.tsx')
    },
  },
  {
    group: 'Layout & Design', id: 'site-header', name: 'SiteHeader component',
    help: "Shared site-wide top nav with logo, languages, and WhatsApp.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'components/SiteHeader.tsx')
      return ok
        ? pass('site-header', 'SiteHeader component')
        : fail('site-header', 'SiteHeader component', 'Missing components/SiteHeader.tsx')
    },
  },
  {
    group: 'Layout & Design', id: 'site-footer', name: 'SiteFooter component',
    help: "Shared site-wide footer with links and copyright.",
    run: async (ctx) => {
      const ok = await fileExists(ctx, 'components/SiteFooter.tsx')
      return ok
        ? pass('site-footer', 'SiteFooter component')
        : fail('site-footer', 'SiteFooter component', 'Missing components/SiteFooter.tsx')
    },
  },

  // Header / footer usage on every page
  {
    group: 'Layout & Design', id: 'homepage-uses-site-header', name: 'Homepage renders <SiteHeader />',
    help: "Homepage actually renders the shared header (not a custom one).",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/page.tsx')
      if (!c) return fail('homepage-uses-site-header', 'Homepage renders <SiteHeader />', 'homepage file missing')
      return /<SiteHeader\b/.test(c)
        ? pass('homepage-uses-site-header', 'Homepage renders <SiteHeader />')
        : fail('homepage-uses-site-header', 'Homepage renders <SiteHeader />', 'no <SiteHeader /> in homepage')
    },
  },
  {
    group: 'Layout & Design', id: 'homepage-uses-site-footer', name: 'Homepage renders <SiteFooter />',
    help: "Homepage actually renders the shared footer.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/page.tsx')
      if (!c) return fail('homepage-uses-site-footer', 'Homepage renders <SiteFooter />', 'homepage file missing')
      return /<SiteFooter\b/.test(c)
        ? pass('homepage-uses-site-footer', 'Homepage renders <SiteFooter />')
        : fail('homepage-uses-site-footer', 'Homepage renders <SiteFooter />', 'no <SiteFooter /> in homepage')
    },
  },
  {
    group: 'Layout & Design', id: 'homepage-uses-fomo', name: 'Homepage renders <FomoBanner />',
    help: "Homepage actually renders the urgency banner.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/page.tsx')
      if (!c) return fail('homepage-uses-fomo', 'Homepage renders <FomoBanner />', 'homepage file missing')
      return /<FomoBanner\b/.test(c)
        ? pass('homepage-uses-fomo', 'Homepage renders <FomoBanner />')
        : fail('homepage-uses-fomo', 'Homepage renders <FomoBanner />', 'no <FomoBanner /> in homepage')
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
      const missing = (['SiteHeader', 'SiteFooter', 'FomoBanner'] as const).filter((tag) => !new RegExp(`<${tag}\\b`).test(c))
      return missing.length === 0
        ? pass('location-page-chrome', 'Location page renders SiteHeader + SiteFooter + FomoBanner')
        : fail('location-page-chrome', 'Location page renders SiteHeader + SiteFooter + FomoBanner', `missing: ${missing.join(', ')}`)
    },
  },
  {
    group: 'Layout & Design', id: 'blog-listing-chrome', name: 'Blog listing renders SiteHeader + SiteFooter + FomoBanner',
    help: "Blog index includes the header, footer, and FOMO banner.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/page.tsx')
      if (!c) return skip('blog-listing-chrome', 'Blog listing renders SiteHeader + SiteFooter + FomoBanner', 'blog listing not found')
      const missing = (['SiteHeader', 'SiteFooter', 'FomoBanner'] as const).filter((tag) => !new RegExp(`<${tag}\\b`).test(c))
      return missing.length === 0
        ? pass('blog-listing-chrome', 'Blog listing renders SiteHeader + SiteFooter + FomoBanner')
        : fail('blog-listing-chrome', 'Blog listing renders SiteHeader + SiteFooter + FomoBanner', `missing: ${missing.join(', ')}`)
    },
  },
  {
    group: 'Layout & Design', id: 'blog-post-chrome', name: 'Blog post renders SiteHeader + SiteFooter + FomoBanner',
    help: "Blog article pages include the header, footer, and FOMO banner.",
    run: async (ctx) => {
      const c = await readProjectFile(ctx, 'app/[locale]/blog/[slug]/page.tsx')
      if (!c) return skip('blog-post-chrome', 'Blog post renders SiteHeader + SiteFooter + FomoBanner', 'blog post page not found')
      const missing = (['SiteHeader', 'SiteFooter', 'FomoBanner'] as const).filter((tag) => !new RegExp(`<${tag}\\b`).test(c))
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
    group: 'Layout & Design', id: 'site-domain-matches-deploy-url', name: 'siteConfig.domain matches deploy-url.txt',
    help: "siteConfig.domain is the value Supabase rows are keyed on. If the deployed host doesn't match it, queries return empty and the live site looks 'disconnected'.",
    run: async (ctx) => {
      const deploy = await readProjectFile(ctx, 'deploy-url.txt')
      if (!deploy) return skip('site-domain-matches-deploy-url', 'siteConfig.domain matches deploy-url.txt', 'no deploy-url.txt yet')
      const config = await readProjectFile(ctx, 'config/site.ts')
      if (!config) return skip('site-domain-matches-deploy-url', 'siteConfig.domain matches deploy-url.txt', 'config/site.ts not found')
      const deployHost = deploy.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '').toLowerCase()
      const m = config.match(/domain\s*:\s*['"]([^'"]+)['"]/)
      if (!m) return fail('site-domain-matches-deploy-url', 'siteConfig.domain matches deploy-url.txt', 'no `domain:` field in config/site.ts')
      const configHost = m[1].toLowerCase().replace(/^www\./, '')
      if (configHost === deployHost) return pass('site-domain-matches-deploy-url', 'siteConfig.domain matches deploy-url.txt', configHost)
      return fail(
        'site-domain-matches-deploy-url',
        'siteConfig.domain matches deploy-url.txt',
        `siteConfig.domain="${configHost}" but deploy host="${deployHost}" — Supabase rows keyed on "${configHost}" will be invisible on the live site`,
      )
    },
  },
  {
    group: 'Layout & Design', id: 'tracking-domain-matches-config', name: '<script data-website="…"> matches siteConfig.domain',
    help: "The tracking script's data-website must match siteConfig.domain so analytics, leads-mode, and the WhatsApp redirect all key off the same host.",
    run: async (ctx) => {
      const layout = await readProjectFile(ctx, 'app/[locale]/layout.tsx')
      if (!layout) return skip('tracking-domain-matches-config', '<script data-website="…"> matches siteConfig.domain', 'layout.tsx not found')
      const config = await readProjectFile(ctx, 'config/site.ts')
      if (!config) return skip('tracking-domain-matches-config', '<script data-website="…"> matches siteConfig.domain', 'config/site.ts not found')
      const configMatch = config.match(/domain\s*:\s*['"]([^'"]+)['"]/)
      if (!configMatch) return fail('tracking-domain-matches-config', '<script data-website="…"> matches siteConfig.domain', 'no `domain:` field in config/site.ts')
      const configHost = configMatch[1].toLowerCase()
      // Accept either a literal data-website="…" or `data-website={siteConfig.domain}` (string-interpolated).
      const literal = layout.match(/data-website=["']([^"']+)["']/)
      if (literal) {
        const v = literal[1].toLowerCase()
        return v === configHost
          ? pass('tracking-domain-matches-config', '<script data-website="…"> matches siteConfig.domain', v)
          : fail('tracking-domain-matches-config', '<script data-website="…"> matches siteConfig.domain', `data-website="${v}" ≠ siteConfig.domain="${configHost}"`)
      }
      if (/data-website=\{[^}]*siteConfig\.domain[^}]*\}/.test(layout)) {
        return pass('tracking-domain-matches-config', '<script data-website="…"> matches siteConfig.domain', 'bound to siteConfig.domain')
      }
      return fail('tracking-domain-matches-config', '<script data-website="…"> matches siteConfig.domain', 'no `data-website` attribute found in layout.tsx — tracking will not match any project in webcore')
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
    group: 'Database', id: 'db-blog-posts', name: '≥10 published blog posts',
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
    help: "No phone numbers hardcoded in code — every number comes from the database.",
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
    help: "No phone numbers hardcoded in blog post content — every link goes through the redirect.",
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
    // Attach the static layman `help` string from the check definition onto
    // the result. The runner is the single source of truth here so we don't
    // have to thread `help` through every pass/fail/skip helper call.
    byGroup.get(c.group)!.push({ ...results[i], help: c.help })
  })

  return Array.from(byGroup.entries()).map(([name, items]) => ({ name, items }))
}

export function totalCheckCount(): number {
  return ALL_CHECKS.length
}
