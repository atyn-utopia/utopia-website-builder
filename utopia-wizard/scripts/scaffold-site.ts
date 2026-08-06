/**
 * scaffold-site.ts — Start a new site from the canonical reference (G2: prevent-by-construction).
 *
 *   npx tsx scripts/scaffold-site.ts \
 *     --slug=cleaning-malaysia --brand="Sparkle Clean" \
 *     --product="Cleaning Service" --product-slug=cleaning \
 *     --domain=cleaning-malaysia.vercel.app --phone=60123456789
 *
 * Clones projects/water-tank-malaysia (the canonical chrome + redirect page +
 * blog listing/article + PageStyles + i18n +
 * schema + tracking skeleton) into projects/{slug}, then fixes the machine-
 * critical bits so the new site starts ALREADY PASSING the structural guardrails:
 *   - config/site.ts        → new domain / brand / product / phone
 *   - app/[locale]/layout    → data-website = new domain
 *   - product route folder   → renamed to the new product slug
 *   - inputs.md              → fresh stub for the agent pipeline
 *
 * What it deliberately leaves for the agents: all copy (messages/*.json),
 * brand assets, the real locations list, and the project-unique special section.
 * Those are design/content decisions — the scaffold just guarantees the
 * structure is correct so whole failure classes (chrome, h1/h2, PageStyles,
 * i18n, schema) can't be built wrong.
 *
 * Excludes: node_modules, brand_assets, temporary screenshots, blog-seed,
 * screenshots, heavy public binaries, and BlogNav (forbidden per-page nav).
 */
import { execFileSync } from 'node:child_process'
import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const REF = 'water-tank-malaysia'

function arg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
}

const slug = arg('slug')
const brand = arg('brand')
const product = arg('product')
const productSlug = arg('product-slug')
const domain = arg('domain') ?? (slug ? `${slug}.vercel.app` : undefined)
const phone = arg('phone') ?? '60XXXXXXXXX'

function die(msg: string): never {
  console.error(`scaffold: ${msg}`)
  console.error('usage: --slug= --brand= --product= --product-slug= [--domain=] [--phone=]')
  process.exit(2)
}

if (!slug || !brand || !product || !productSlug) die('missing required flag')
if (!/^[a-z0-9-]+$/.test(slug)) die('slug must be kebab-case')
if (!/^[a-z0-9-]+$/.test(productSlug)) die('product-slug must be kebab-case')

const EXCLUDE = [
  /(^|\/)node_modules\//,
  /(^|\/)brand_assets\//,
  /temporary screenshots\//,
  /(^|\/)blog-seed\//,
  /screenshot.*\.mjs$/,
  /(^|\/)serve\.mjs$/,
  /tsbuildinfo$/,
  /(^|\/)deploy-url\.txt$/,             // deploy-specific — a fresh scaffold isn't deployed
  /(^|\/)\.vercel\//,                   // reference's Vercel linkage
  /components\/BlogNav\.tsx$/,          // forbidden per-page nav
  /(^|\/)public\/.*\.(png|jpg|jpeg|webp|gif)$/, // heavy binaries — agent adds real assets
  /(^|\/)inputs\.md$/,                  // we write a fresh stub
]

async function main() {
  const projectsDir = path.resolve(process.cwd(), '..', 'projects')
  const refDir = path.join(projectsDir, REF)
  const outDir = path.join(projectsDir, slug)

  if (!existsSync(refDir)) die(`reference project not found: ${refDir}`)
  if (existsSync(outDir)) die(`projects/${slug} already exists — refusing to overwrite`)

  // 1. Faithful file list from git (keeps us out of node_modules etc.)
  const tracked = execFileSync('git', ['-C', refDir, 'ls-files'], { encoding: 'utf-8' })
    .split('\n').map((s) => s.trim()).filter(Boolean)
    .filter((rel) => !EXCLUDE.some((re) => re.test(rel)))

  // Chrome comes from the canonical template (single source of truth), not from
  // the reference project — so editing templates/site-chrome/ updates new sites.
  const CHROME = ['SiteHeader', 'SiteFooter', 'FomoBanner', 'PageStyles', 'LanguageSwitcher', 'WhatsAppButton']
  const chromeRel = new Set(CHROME.map((c) => `components/${c}.tsx`))

  let copied = 0
  for (const rel of tracked) {
    if (chromeRel.has(rel)) continue   // handled from the template below
    const src = path.join(refDir, rel)
    try { if (!(await stat(src)).isFile()) continue } catch { continue }
    const dst = path.join(outDir, rel)
    await mkdir(path.dirname(dst), { recursive: true })
    await writeFile(dst, await readFile(src))
    copied++
  }

  const templateDir = path.resolve(process.cwd(), '..', 'templates', 'site-chrome')
  let chromeCopied = 0
  for (const c of CHROME) {
    const src = path.join(templateDir, `${c}.tsx`)
    if (!existsSync(src)) continue
    const dst = path.join(outDir, 'components', `${c}.tsx`)
    await mkdir(path.dirname(dst), { recursive: true })
    await writeFile(dst, await readFile(src))
    chromeCopied++
  }
  // Canonical non-component files from the template, each with its own
  // destination. Keep this table in sync with templates/site-chrome/README.md —
  // a file added to the template but not listed here silently never reaches a
  // new project, which is how og:image was missing from 21 of 28 sites.
  const TEMPLATE_FILES: [src: string, dest: string][] = [
    // single source for SEO URLs; the seo-locale-url-helper check requires
    // pages/sitemap go through it
    ['localeHref.ts', 'lib/localeHref.ts'],
    // social share card: URL helper + the generator (Step 8b, og-image-per-locale)
    ['ogImage.ts', 'lib/ogImage.ts'],
    ['og-shot.mjs', 'scripts/og-shot.mjs'],
  ]
  let helpersCopied = 0
  for (const [src, dest] of TEMPLATE_FILES) {
    const abs = path.join(templateDir, src)
    if (!existsSync(abs)) continue
    const dst = path.join(outDir, dest)
    await mkdir(path.dirname(dst), { recursive: true })
    await writeFile(dst, await readFile(abs))
    helpersCopied++
  }

  // og-shot.mjs talks to the project's own dev server, so its PORT must match
  // the `start` script. The template ships 3000; without this the very first
  // run fails with a connection refused for a reason nobody would guess.
  const ogShot = path.join(outDir, 'scripts', 'og-shot.mjs')
  if (existsSync(ogShot)) {
    const pkg = JSON.parse(await readFile(path.join(outDir, 'package.json'), 'utf8'))
    const port = /-p\s+(\d+)|--port[= ](\d+)/.exec(pkg.scripts?.start ?? '')
    const num = port?.[1] ?? port?.[2]
    if (num) {
      const body = await readFile(ogShot, 'utf8')
      await writeFile(ogShot, body.replace(/^const PORT = \d+;/m, `const PORT = ${num};`))
    }
  }
  console.log(`scaffold: copied ${copied} structural file(s) from ${REF} + ${chromeCopied} chrome + ${helpersCopied} helper(s) from templates/site-chrome → projects/${slug}`)

  // 2. Rename the product route folder → app/[locale]/{productSlug}.
  // Read the source folder from the reference's own productSlug rather than
  // hardcoding it: this silently no-opped when REF changed from sewa-excavator
  // ('excavator') to water-tank-malaysia ('water-tank'), leaving every new site
  // serving its product pages under the reference's slug.
  const refCfg = await readFile(path.join(refDir, 'config', 'site.ts'), 'utf-8')
  const refProductSlug = refCfg.match(/productSlug\s*:\s*['"](.*?)['"]/)?.[1]
  if (!refProductSlug) die(`could not read productSlug from ${REF}/config/site.ts`)
  if (productSlug !== refProductSlug) {
    const from = path.join(outDir, 'app', '[locale]', refProductSlug)
    const to = path.join(outDir, 'app', '[locale]', productSlug)
    if (!existsSync(from)) die(`expected reference route app/[locale]/${refProductSlug}/ not found`)
    await rename(from, to)
    console.log(`scaffold: route folder app/[locale]/${refProductSlug}/ → app/[locale]/${productSlug}/`)
  }

  // 3. Rewrite config/site.ts (machine-critical — what every page reads)
  const siteCfgPath = path.join(outDir, 'config', 'site.ts')
  if (existsSync(siteCfgPath)) {
    let cfg = await readFile(siteCfgPath, 'utf-8')
    const set = (key: string, val: string) => {
      const re = new RegExp(`(${key}\\s*:\\s*)(['\"])(.*?)\\2`)
      if (re.test(cfg)) cfg = cfg.replace(re, `$1'${val.replace(/'/g, "\\'")}'`)
    }
    set('domain', domain!)
    // Both spellings exist across the fleet: sewa-excavator used `siteUrl`,
    // water-tank-malaysia uses `url`. set() no-ops on a key that isn't present,
    // so writing both is safe — and missing one leaves the new site pointing its
    // canonical/OG URLs at the reference project's domain.
    set('siteUrl', `https://${domain}`)
    set('url', `https://${domain}`)
    set('brandName', brand!)
    set('productSlug', productSlug!)
    set('productName', product!)
    set('fallbackPhone', phone)
    // Drop the reference's pinned siteId. It is that project's
    // company_websites.id — copying it would point the new site's webcore
    // identity at the REFERENCE site, which is exactly the cross-wiring the pin
    // exists to prevent. It gets pinned for real once the webcore row exists
    // (docs/full-website-setup.md → Supabase seeding).
    cfg = cfg.replace(/^[ \t]*\/\/[^\n]*\n(?=[ \t]*siteId\s*:)/m, '')
             .replace(/^[ \t]*siteId\s*:\s*['"][^'"]*['"],[ \t]*\n/m, '')
    // Same for the comment above fallbackPhone — it names the REFERENCE site's
    // company ("TANKPRO's own WhatsApp number…"), which is actively misleading
    // sitting above a different client's number.
    cfg = cfg.replace(/^[ \t]*\/\/[^\n]*\n(?=[ \t]*fallbackPhone\s*:)/m, '')
    await writeFile(siteCfgPath, cfg)
    console.log('scaffold: config/site.ts rewritten (siteId cleared — pin it after webcore registration)')
  }

  // 4. Rewrite the two places a layout can still name the reference's domain:
  //    the data-website tracking attribute, and metadataBase (which Next uses to
  //    absolutise every canonical + OG URL — left unrewritten, a new site
  //    advertises the reference project's domain to search engines).
  for (const rel of ['app/[locale]/layout.tsx', 'app/layout.tsx']) {
    const p = path.join(outDir, rel)
    if (existsSync(p)) {
      const t = (await readFile(p, 'utf-8'))
        .replace(/data-website=["'][^"']*["']/g, `data-website="${domain}"`)
        .replace(/new URL\((['"])https?:\/\/[^'"]*\1\)/g, `new URL('https://${domain}')`)
      await writeFile(p, t)
    }
  }

  // 4b. package.json still carries the reference's name after a raw copy.
  const pkgPath = path.join(outDir, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = await readFile(pkgPath, 'utf-8')
    await writeFile(pkgPath, pkg.replace(/("name"\s*:\s*")[^"]*(")/, `$1${slug}$2`))
  }

  // 5. Fresh inputs.md stub (makes the project discoverable + starts the pipeline)
  const inputs = `# ${slug} — Project Inputs

**Slug:** ${slug}
**Scaffolded from:** ${REF} (canonical skeleton)

## Confirmed Inputs (Step 0)

| Field | Value |
|-------|-------|
| **Brand name** | ${brand} |
| **Product name** | ${product} |
| **Product slug** | \`${productSlug}\` |
| **Domain** | \`${domain}\` |
| **Site URL** | \`https://${domain}\` |
| **Phone (WhatsApp)** | \`${phone}\` |
| **Leads mode** | \`single\` |
| **Languages** | \`ms\` (default), \`en\`, \`zh\` |

## Still TODO (agent pipeline)

- [ ] Real \`config/locations.ts\` (150–180 real towns, ≥10/state) — currently the ${REF} list
- [ ] Brand assets in \`brand_assets/\` + \`public/brand/\` (hero bg, logo, product photos, gallery)
- [ ] All copy in \`messages/{ms,en,zh}.json\` — currently ${REF} copy (placeholder)
- [ ] Brand colour tokens in \`app/globals.css\`
- [ ] Project-unique special section (replace the ${REF} calculator if it doesn't fit)
- [ ] Seed products + phone + company_websites in Supabase
- [ ] Generate blog posts (Hanabi)
`
  await writeFile(path.join(outDir, 'inputs.md'), inputs)
  console.log('scaffold: inputs.md written')

  console.log(`\nscaffold: done. Next:`)
  console.log(`  1. cd projects/${slug} && ln -sf ../../.env.local .env.local && npm install`)
  console.log(`  2. run the agent pipeline (Nana copy, Kagura design, assets, locations)`)
  console.log(`  3. verify structural baseline:  cd utopia-wizard && npm run gate -- --source-only ${slug}`)
}

main().catch((e) => { console.error('scaffold: crashed —', e?.message ?? e); process.exit(1) })
