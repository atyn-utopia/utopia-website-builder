/**
 * checkMeta.ts — Canonical guardrail registry.
 *
 * Single source of truth for WHAT each wizard check means and HOW HARD it bites.
 * Every check id produced by `lib/checklist.ts` must have exactly one entry here.
 *
 *  - `severity: 'blocking'`  → a failure must stop the pipeline (pre-commit / CI / deploy gate).
 *                              These break the site, its SEO, its data layer, or a hard brand rule.
 *  - `severity: 'advisory'`  → a failure is a warning. Polish, thresholds, and informational checks.
 *                              Counts against the score but does not block.
 *
 * `doc` links to the rule's authoritative explanation (relative to /docs).
 *
 * The split below is a sensible STARTING classification — tune `severity` freely;
 * nothing else needs to change. `scripts/check-meta-sync.ts` asserts this registry
 * stays 1:1 with the live checklist so the two can never silently drift.
 */

export type Severity = 'blocking' | 'advisory'

export interface CheckMeta {
  id: string
  group: string
  name: string
  severity: Severity
  /** Authoritative doc for this rule, relative to /docs (or ../ for repo root). */
  doc: string
}

const SETUP = 'full-website-setup.md'
const LAYOUT = 'full-website-setup.md#layout--design-checklist-mandatory-before-gate-1'
const BLOGSTEP = 'full-website-setup.md#13-step-11--generate-blog-posts'
const CORE = 'full-website-setup.md#7-step-5--build-core-files'
const TRACK = 'full-website-setup.md#9-step-7--add-tracking'
const DEPLOY = 'full-website-setup.md#16-step-14--deploy'
const FLOW = 'website-building-flow.md#layout-build-process'
const RULES = '../CLAUDE.md'

export const CHECK_META: CheckMeta[] = [
  // ── Structure ──────────────────────────────────────────────────────────────
  { id: 'homepage',                       group: 'Structure',  severity: 'blocking', doc: SETUP,  name: 'Homepage exists' },
  { id: 'location-page',                  group: 'Structure',  severity: 'blocking', doc: SETUP,  name: 'Location pages exist' },
  { id: 'whatsapp-redirect',              group: 'Structure',  severity: 'blocking', doc: CORE,   name: 'WhatsApp redirect page' },

  // ── SEO ────────────────────────────────────────────────────────────────────
  { id: 'sitemap',                        group: 'SEO',        severity: 'blocking', doc: SETUP,  name: 'Sitemap generator' },
  { id: 'robots',                         group: 'SEO',        severity: 'blocking', doc: SETUP,  name: 'robots.txt generator' },
  { id: 'schema-components',              group: 'SEO',        severity: 'blocking', doc: SETUP,  name: 'Schema markup components' },
  { id: 'homepage-metadata',             group: 'SEO',        severity: 'blocking', doc: SETUP,  name: 'Homepage exports metadata' },

  // ── i18n ───────────────────────────────────────────────────────────────────
  { id: 'i18n-routing',                   group: 'i18n',       severity: 'blocking', doc: CORE,   name: 'i18n routing config' },
  { id: 'middleware',                     group: 'i18n',       severity: 'blocking', doc: CORE,   name: 'next-intl middleware' },
  { id: 'translations',                   group: 'i18n',       severity: 'blocking', doc: CORE,   name: 'Translation files (en/ms/zh)' },
  { id: 'language-switcher',              group: 'i18n',       severity: 'blocking', doc: CORE,   name: 'Language switcher component' },
  { id: 'default-locale-enforced',        group: 'i18n',       severity: 'blocking', doc: CORE,   name: 'Default locale always shown first' },

  // ── Webcore data layer ───────────────────────────────────────────────────────
  { id: 'webcore-lib',                    group: 'Webcore data layer', severity: 'blocking', doc: SETUP, name: 'lib/webcore.ts exists' },
  { id: 'revalidate-route',               group: 'Webcore data layer', severity: 'blocking', doc: SETUP, name: '/api/revalidate route' },
  { id: 'no-forbidden-libs',              group: 'Webcore data layer', severity: 'blocking', doc: SETUP, name: 'No forbidden lib/* files' },
  { id: 'no-time-revalidate',             group: 'Webcore data layer', severity: 'blocking', doc: SETUP, name: 'No time-based ISR (export const revalidate = N)' },

  // ── Tracking ─────────────────────────────────────────────────────────────────
  { id: 'tracking-script',                group: 'Tracking',   severity: 'blocking', doc: TRACK,  name: 'Tracking script in layout' },
  { id: 'data-website-match',             group: 'Tracking',   severity: 'blocking', doc: TRACK,  name: 'data-website matches domain' },
  { id: 'data-website-reachable',         group: 'Tracking',   severity: 'advisory', doc: TRACK,  name: 'data-website resolves to a live URL' },
  { id: 'uwc-typedef',                    group: 'Tracking',   severity: 'blocking', doc: TRACK,  name: 'window.uwc type declaration' },
  { id: 'whatsapp-click-track',           group: 'Tracking',   severity: 'blocking', doc: TRACK,  name: 'WhatsApp click tracked' },
  { id: 'product-impression-track',       group: 'Tracking',   severity: 'advisory', doc: TRACK,  name: 'Product impression tracked' },
  { id: 'blog-click-track',               group: 'Tracking',   severity: 'advisory', doc: TRACK,  name: 'Blog article click tracked' },

  // ── Layout & Design ──────────────────────────────────────────────────────────
  { id: 'font-house-style',               group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Uses Inter or Plus Jakarta Sans' },
  { id: 'no-forbidden-serifs',            group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'No forbidden serif display fonts' },
  { id: 'favicon',                        group: 'Layout & Design', severity: 'blocking', doc: SETUP,  name: 'Favicon (app/icon.svg)' },
  { id: 'no-empty-img-alt',               group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: 'No <img alt=""> in app/ or components/' },
  { id: 'no-text-transform-capitalize',   group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'No CSS text-transform: capitalize' },
  { id: 'homepage-h1-h2',                 group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: 'Homepage has exactly one <h1> + one <h2>' },
  { id: 'body-text-in-headings',          group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Visible text wrapped in heading tags (no bare <p>)' },
  { id: 'heading-keyword-coverage',       group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Section headings carry keywords (informational)' },
  { id: 'page-styles',                    group: 'Layout & Design', severity: 'blocking', doc: FLOW,   name: 'PageStyles shared style component' },
  { id: 'fomo-banner',                    group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: 'FomoBanner component (+ live countdown)' },
  { id: 'site-chrome-components',         group: 'Layout & Design', severity: 'blocking', doc: FLOW,   name: 'SiteHeader + SiteFooter components' },
  { id: 'homepage-chrome',               group: 'Layout & Design', severity: 'blocking', doc: FLOW,   name: 'Homepage renders SiteHeader + SiteFooter + FomoBanner' },
  { id: 'homepage-product-ctas',          group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Homepage has enough WhatsApp CTAs (≥3)' },
  { id: 'no-blognav-usage',               group: 'Layout & Design', severity: 'blocking', doc: FLOW,   name: 'No <BlogNav> per-page variant used' },
  { id: 'location-uses-pagestyles',       group: 'Layout & Design', severity: 'blocking', doc: FLOW,   name: 'Location page imports PageStyles' },
  { id: 'location-matches-homepage',      group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: 'Location page mirrors homepage sections' },
  { id: 'no-undefined-css-vars',          group: 'Layout & Design', severity: 'blocking', doc: FLOW,   name: 'No undefined CSS variables referenced' },
  { id: 'whatsapp-green',                 group: 'Layout & Design', severity: 'blocking', doc: RULES,  name: 'Uses official WhatsApp green (#25D366)' },
  { id: 'lsw-globals-css',                group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Language switcher CSS lives in globals.css' },
  { id: 'circle-flag-useid',              group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'CircleFlag uses useId() for clipPath' },
  { id: 'alt-keys-all-locales',           group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Alt-text keys present in en/ms/zh' },
  { id: 'image-alt-template-model',       group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'products.imageAltTemplate uses {model}' },
  { id: 'gallery-alts-array',             group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'gallery.alts is a non-empty array per locale' },
  { id: 'final-cta-bg-alt',               group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'finalCta.bgAlt key exists (ms.json)' },
  { id: 'bg-role-img-aria-label',         group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'CSS bg images attach role="img" + aria-label' },
  { id: 'icu-placeholders-lowercase',     group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'ICU placeholder names are lowercase' },
  { id: 'pagestyles-font-weight-inherit', group: 'Layout & Design', severity: 'advisory', doc: FLOW,   name: 'PageStyles normalises font-weight: inherit' },
  { id: 'location-page-chrome',           group: 'Layout & Design', severity: 'blocking', doc: FLOW,   name: 'Location page renders SiteHeader + SiteFooter + FomoBanner' },
  { id: 'nav-keys-complete',              group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: 'nav.{home,products,calculator,locations,blog,whatsappCta} in ms.json' },
  { id: 'cta-button-word-limit',          group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'CTA button labels are ≤3 words' },
  { id: 'nav-cta-global-scope',           group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Styled-jsx targets .nav-cta via :global(...)' },
  { id: 'header-mobile-wa-hidden',        group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Mobile header hides .nav-cta' },
  { id: 'usp-panel-class-used',           group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'USP bar uses single .usp-panel container' },
  { id: 'project-gitignore',              group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'Project .gitignore excludes brand_assets/ + temporary screenshots/' },
  { id: 'cta-uses-redirect-page',         group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: 'Every CTA routes through /redirect-whatsapp-1' },
  { id: 'domain-consistency',             group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: 'siteConfig.domain matches deploy URL + tracking data-website' },
  { id: 'cta-opens-new-tab',              group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'CTA links to redirect page open in new tab' },
  { id: 'public-folder-size',             group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: 'public/ under 20 MB' },
  { id: 'no-replace-icu',                 group: 'Layout & Design', severity: 'blocking', doc: LAYOUT, name: "No .replace('{…}', …) on ICU strings" },
  { id: 'price-from-prefix',              group: 'Layout & Design', severity: 'advisory', doc: LAYOUT, name: "Price strings use 'Dari RM' prefix (ms.json)" },

  // ── Blog ──────────────────────────────────────────────────────────────────
  { id: 'blog-listing',                   group: 'Blog', severity: 'blocking', doc: BLOGSTEP, name: 'Blog listing page' },
  { id: 'blog-post',                      group: 'Blog', severity: 'blocking', doc: BLOGSTEP, name: 'Blog post detail page' },
  { id: 'blog-listing-chrome',            group: 'Blog', severity: 'blocking', doc: FLOW,     name: 'Blog listing renders SiteHeader + SiteFooter + FomoBanner' },
  { id: 'blog-post-chrome',               group: 'Blog', severity: 'blocking', doc: FLOW,     name: 'Blog post renders SiteHeader + SiteFooter + FomoBanner' },
  { id: 'blog-post-h1',                   group: 'Blog', severity: 'blocking', doc: BLOGSTEP, name: 'Blog post has exactly one <h1>' },
  { id: 'blog-post-breadcrumb',           group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog post shows a breadcrumb' },
  { id: 'blog-content-class',             group: 'Blog', severity: 'blocking', doc: BLOGSTEP, name: 'Blog post renders `blog-content` wrapper' },
  { id: 'blog-post-cta-banner',           group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog post has a WhatsApp CTA banner' },
  { id: 'blog-post-reading-time',         group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog post shows reading time' },
  { id: 'blog-listing-h1-h2',             group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog listing has one <h1> + one <h2>' },
  { id: 'blog-listing-grid',              group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog listing uses a card grid' },
  { id: 'blog-listing-cover-image',       group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog cards render cover image + excerpt' },
  { id: 'blog-post-metadata',             group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog post exports metadata' },
  { id: 'db-blog-posts',                  group: 'Blog', severity: 'blocking', doc: BLOGSTEP, name: '≥10 published blog posts' },
  { id: 'live-blog-renders',              group: 'Blog', severity: 'blocking', doc: BLOGSTEP, name: 'Live /blog page actually renders posts' },
  { id: 'no-hardcoded-phones-blog',       group: 'Blog', severity: 'blocking', doc: RULES,    name: 'No hardcoded phone numbers in blog content' },
  { id: 'blog-content-toc',               group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Articles include a table of contents' },
  { id: 'blog-content-headings',          group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Articles use section headings (≥3 H2s)' },
  { id: 'blog-content-bold',              group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Articles use enough bold emphasis (≥1 per ~1800 chars)' },
  { id: 'blog-content-paragraphs',        group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Articles have ≥5 paragraphs' },
  { id: 'blog-content-lists',             group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Articles use bullet or numbered lists' },
  { id: 'blog-content-readable-paragraphs', group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Average paragraph under 600 chars' },
  { id: 'blog-content-images',            group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Articles have enough inline images (≥1 per ~3500 chars)' },
  { id: 'blog-content-img-alt',           group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Every <img> in articles has descriptive alt' },
  { id: 'blog-content-internal-links',    group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Articles include internal links (≥3)' },
  { id: 'blog-content-headings-css',      group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'CSS styles .blog-content h2/h3/h4' },
  { id: 'blog-content-body-css',          group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'CSS styles .blog-content p + ul/ol' },
  { id: 'blog-post-schema',               group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'Blog post emits Article / BlogPosting JSON-LD' },
  { id: 'blog-content-toc-css',           group: 'Blog', severity: 'advisory', doc: BLOGSTEP, name: 'CSS styles the TOC (.blog-content nav / .toc)' },

  // ── Database ────────────────────────────────────────────────────────────────
  { id: 'db-company-website',             group: 'Database', severity: 'blocking', doc: SETUP, name: 'company_websites row' },
  { id: 'db-phone-number',                group: 'Database', severity: 'blocking', doc: SETUP, name: 'phone_numbers row (active)' },
  { id: 'db-products',                    group: 'Database', severity: 'blocking', doc: SETUP, name: 'Active products in Supabase' },

  // ── Deployment ──────────────────────────────────────────────────────────────
  { id: 'vercel-linked',                  group: 'Deployment', severity: 'blocking', doc: DEPLOY, name: 'Vercel project linked' },
  { id: 'deploy-url-live',                group: 'Deployment', severity: 'blocking', doc: DEPLOY, name: 'Deploy URL responds' },
  { id: 'live-db-connected',              group: 'Deployment', severity: 'blocking', doc: DEPLOY, name: 'Live site reads phone from Supabase' },

  // ── Quality ─────────────────────────────────────────────────────────────────
  { id: 'no-hardcoded-phones',            group: 'Quality', severity: 'blocking', doc: RULES, name: 'No hardcoded phone numbers in app/, components/, or messages/' },
  { id: 'no-domains-in-copy',             group: 'Quality', severity: 'blocking', doc: RULES, name: 'No domain/URL shown as visible text in copy' },
]

/** Fast id → meta lookup. */
export const CHECK_META_BY_ID: Record<string, CheckMeta> =
  Object.fromEntries(CHECK_META.map((m) => [m.id, m]))

export function severityOf(id: string): Severity {
  return CHECK_META_BY_ID[id]?.severity ?? 'advisory'
}

export const BLOCKING_IDS: ReadonlySet<string> =
  new Set(CHECK_META.filter((m) => m.severity === 'blocking').map((m) => m.id))
