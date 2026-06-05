# templates/site-chrome — Canonical site chrome (single source of truth)

These six components are the **canonical chrome** every Utopia site must use,
unchanged in structure. They are brand-agnostic: brand name, nav labels, and
tagline come from `messages/*.json` (next-intl) and `config/site.ts`; the only
asset conventions are `/brand/logo-dark.png` (footer) and `/brand/bg-hero.jpg`
(hero bg). Swap those assets per project — do not edit the component structure.

| File | Role |
|------|------|
| `SiteHeader.tsx` | nav links + language switcher + WhatsApp CTA |
| `SiteFooter.tsx` | quick links, locations grid, copyright, social |
| `FomoBanner.tsx` | top sticky banner + live countdown (red/black) |
| `PageStyles.tsx` | shared `<style>` block for every section (hero…final CTA) |
| `LanguageSwitcher.tsx` | bordered flag pills (desktop) / dropdown (mobile) |
| `WhatsAppButton.tsx` | official-green CTA routing through the redirect page |

## How it's used

- **New sites:** `npm run scaffold` (in `utopia-wizard/`) copies these into
  `projects/{slug}/components/`. Editing a file here changes what every *future*
  scaffold gets.
- **Drift detection:** `cd utopia-wizard && npm run chrome:check` reports any
  project whose chrome has diverged from these canonical files (normalised
  comparison that ignores per-project brand strings / asset paths). Re-sync
  intentionally — divergence is how broken chrome (e.g. a custom `BlogNav`) crept
  into older projects.

> This is **not** a runtime package — each project is its own per-folder Vercel
> deploy, so the chrome is copied in, not imported. The drift check is what keeps
> the copies honest. (To make it a true import-don't-copy dependency later would
> require publishing to npm or a workspace monorepo + Vercel root-dir changes.)
