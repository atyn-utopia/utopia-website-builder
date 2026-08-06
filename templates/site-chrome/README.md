# templates/site-chrome — Canonical site chrome (single source of truth)

These six components are the **canonical chrome** every Utopia site must use,
unchanged in structure. They are taken from **`projects/water-tank-malaysia`**,
the default layout reference (see CLAUDE.md → "Default Layout Template"). The
older `sewa-excavator` chrome — dark footer with a locations grid and social
buttons — is superseded; do not copy chrome out of an older project. They are brand-agnostic: brand name, nav labels, and
tagline come from `messages/*.json` (next-intl) and `config/site.ts`; the only
asset conventions are `/brand/logo-dark.png` (footer) and `/brand/bg-hero.jpg`
(hero bg). Swap those assets per project — do not edit the component structure.

| File | Role |
|------|------|
| `SiteHeader.tsx` | nav links + language switcher + WhatsApp CTA |
| `SiteFooter.tsx` | flat minimal footer — logo + horizontal nav + divider + copyright + "Built by Utopia" credit |
| `FomoBanner.tsx` | top sticky banner + live countdown (red/black) |
| `PageStyles.tsx` | shared `<style>` block for every section (hero…final CTA) |
| `LanguageSwitcher.tsx` | bordered flag pills (desktop) / dropdown (mobile) |
| `WhatsAppButton.tsx` | official-green CTA routing through the redirect page |
| `ogImage.ts` | → `lib/ogImage.ts` — social share card URLs, per locale |
| `og-shot.mjs` | → `scripts/og-shot.mjs` — generates the cards from the hero |

## Social share card (`ogImage.ts` + `og-shot.mjs`)

A shared link with no `og:image` renders as a bare text card. Most of the fleet
shipped that way — only 7 of 28 projects had a card at all — so these two files
are part of the canonical chrome, not an optional extra.

`og-shot.mjs` needs three per-project edits at the top (locales, port, and any
hero-foot element a 630 crop would slice). Its header comment explains why each
line exists; read it before changing the capture logic.

Owned by **Kimmy** (metadata). Generated at Step 8, when a built site is already
being served for screenshot review. Verified by the wizard check
`og-image-per-locale` and by Layla before deploy.

## How it's used

- **New sites:** `npm run scaffold` (in `utopia-wizard/`) copies these into
  `projects/{slug}/components/`. Editing a file here changes what every *future*
  scaffold gets.
- **Drift detection:** `cd utopia-wizard && npx tsx scripts/chrome-check.ts` reports any
  project whose chrome has diverged from these canonical files (normalised
  comparison that ignores per-project brand strings / asset paths). Re-sync
  intentionally — divergence is how broken chrome (e.g. a custom `BlogNav`) crept
  into older projects.

> This is **not** a runtime package — each project is its own per-folder Vercel
> deploy, so the chrome is copied in, not imported. The drift check is what keeps
> the copies honest. (To make it a true import-don't-copy dependency later would
> require publishing to npm or a workspace monorepo + Vercel root-dir changes.)

## Migrating a legacy site is a 3-layer refactor, not a file swap

`npm run chrome:sync -- --only={slug} --write` copies the canonical files in, but
on a heavily-divergent legacy site that is only **step 1**. A real migration
(verified on `katilhospital-24jam`) has three layers, each caught by a different
tool:

1. **CSS tokens** — canonical chrome uses `--brand-orange` / `--ink` / `--gut`;
   older sites use their own names (`--accent` / `--navy` / `--space-*`). The
   gate's `no-undefined-css-vars` flags this. Fix with a small token-alias shim
   in `globals.css` (map canonical → local), not by editing components.
2. **Export API** — canonical components use **named** exports
   (`export function WhatsAppButton`). A site importing them as **default**
   (`import WhatsAppButton from …`) breaks every importer. The static gate does
   NOT catch this — only `npm run build` does.
3. **Leftover old nav** — pages may still render old `Navbar` / `Footer` /
   `FomoBar`; those usages must be replaced with `SiteHeader` / `SiteFooter` /
   `FomoBanner`.

**Always run the gate AND a build after syncing.** Because of this cost, do NOT
bulk-migrate: sites already scoring 90+ are usually customised on purpose and
work — leave them. Sync is for new sites (via `scaffold`) and for a site you are
already actively reworking.
