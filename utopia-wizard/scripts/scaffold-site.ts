/**
 * scaffold-site.ts — Start a new site from the canonical reference (G2: prevent-by-construction).
 *
 *   npx tsx scripts/scaffold-site.ts \
 *     --slug=cleaning-malaysia --brand="Sparkle Clean" \
 *     --product="Cleaning Service" --product-slug=cleaning \
 *     --domain=cleaning-malaysia.vercel.app --phone=60123456789
 *
 * Clones projects/sewa-excavator (the canonical chrome + PageStyles + i18n +
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

const REF = 'sewa-excavator'

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
  // Canonical locale-URL helper → lib/ (single source for SEO URLs; the
  // seo-locale-url-helper check requires pages/sitemap go through it).
  const helperSrc = path.join(templateDir, 'localeHref.ts')
  if (existsSync(helperSrc)) {
    await mkdir(path.join(outDir, 'lib'), { recursive: true })
    await writeFile(path.join(outDir, 'lib', 'localeHref.ts'), await readFile(helperSrc))
  }
  console.log(`scaffold: copied ${copied} structural file(s) from ${REF} + ${chromeCopied} chrome + localeHref helper from templates/site-chrome → projects/${slug}`)

  // 2. Rename the product route folder: app/[locale]/excavator → app/[locale]/{productSlug}
  if (productSlug !== 'excavator') {
    const from = path.join(outDir, 'app', '[locale]', 'excavator')
    const to = path.join(outDir, 'app', '[locale]', productSlug)
    if (existsSync(from)) { await rename(from, to); console.log(`scaffold: route folder → app/[locale]/${productSlug}/`) }
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
    set('siteUrl', `https://${domain}`)
    set('brandName', brand!)
    set('productSlug', productSlug!)
    set('productName', product!)
    set('fallbackPhone', phone)
    await writeFile(siteCfgPath, cfg)
    console.log('scaffold: config/site.ts rewritten')
  }

  // 4. data-website tracking attribute → new domain (regardless of which ref
  //    alias it pointed at), in both layouts.
  for (const rel of ['app/[locale]/layout.tsx', 'app/layout.tsx']) {
    const p = path.join(outDir, rel)
    if (existsSync(p)) {
      const t = (await readFile(p, 'utf-8'))
        .replace(/data-website=["'][^"']*["']/g, `data-website="${domain}"`)
      await writeFile(p, t)
    }
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
