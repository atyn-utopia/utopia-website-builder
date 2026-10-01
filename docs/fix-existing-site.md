# Fixing an existing site (CY / `utopia-starter` sites)

Use this flow when the job is to **bring an existing site up to the fleet
checklist** *and the site was not built by us*. Decide that first (below). Typical case: a site CY (`chokchunynh`)
built from `utopia-starter` — `src/app` layout, a client-side BM/EN toggle,
`wa.me/<number>` hardcoded in `src/lib/constants.ts`, no webcore, deployed by CLI.

New websites follow `docs/full-website-setup.md` instead. Its agent pipeline
(Alpha → Sora → Nana → …), keyword gate and design gates do **not** apply here:
the site already exists and its design is kept.

Reference fixes: **sewascissorlift.my** (`utopiagrowth/site-sewascissorlift.my`,
PRs #3–#23, wizard 100/100) and **lantaivinyl.my** (`site-lantaivinyl.my`).
When in doubt, read how the matching PR there did it.

---

## Was this site built by us? (decide before anything else)

**Built by us** = generated through this repo's new-website flow
(`docs/full-website-setup.md`). Fix it with **our docs**: `CLAUDE.md` fleet
rules, `docs/full-website-setup.md`, the `*-build.md` docs and the
`water-tank-malaysia` template. Do **not** use this file.

**Not built by us** (CY's `utopia-starter` sites, a teammate's other template,
a client repo) = use **this file**.

Check, in order — the first decisive hit wins:

| Check | Built by us | Not built by us |
|---|---|---|
| `inputs.md` in the project root (Step 1 output of our flow) | present | absent |
| First commit (`git log --reverse --format='%an %s' \| head -1`) | builder flow / `atyn-utopia` | `Initial commit: Utopia Starter Template`, `init from utopia-starter`, author `CY` / `chokchunynh` (in a standalone repo; inside this monorepo the first commit of a path is not meaningful) |
| `.claude/CLAUDE.md` in the project | absent, or a project brief | starts `# Utopia Starter Template` |
| Layout | `app/[locale]/`, `config/site.ts`, `components/SiteHeader.tsx` at the root | `src/app/` with no `[locale]`, `src/lib/language.tsx` BM/EN toggle, or a JSX template (`app/*.jsx`) |
| WhatsApp | CTAs go to `/redirect-whatsapp-1` | `wa.me/<number>` hardcoded in `constants` |

`package.json` `"name": "utopia-starter"` is **not** decisive — several of our
own sites kept that name. A site that was already fixed with this file
(reno.my, sewascissorlift.my, lantaivinyl.my) stays on this file's conventions
for later fixes: keep its `src/` layout, don't re-template it. The fleet rules
in `CLAUDE.md` (headings, WhatsApp green, phone from the DB, …) apply to both
kinds.

If the checks disagree, say what you found and ask the user.

## 0. Before touching code

1. **Ask the user three things, every time — never infer them:**
   - **Company** in webcore (look up candidates with
     `GET /api/public/companies?q=…` and offer them; never let
     `POST /api/public/sites` create a company from a typo).
   - **WhatsApp number** for the default `phone_numbers` row. The number
     hardcoded in the old code is often a generic fallback shared by other
     sites (e.g. `60146869468`) — don't reuse it without asking.
   - **Main domain.** The old code's `metadataBase` may name a domain that was
     never bought. Check what Vercel actually serves:
     `vercel api /v9/projects/<project>/domains --scope chokchunynh`.
2. Find the **live source**: the repo under `utopiagrowth/site-*.my` that the
   wizard grades, and the Vercel project it deploys to (often named after an
   older domain). Check `vercel api /v9/projects/<project> | jq .link` — if
   non-null, merge = production deploy.
3. Read the repo's open issues. Teammates often already own pieces (GTM, GSC,
   Ads, domain). Don't take those over; reference them.
4. Work in a git worktree (`git worktree add <scratch>/wt-<site> -b <branch>
   origin/<default>`), never in the shared checkout.

## 1. Keep the layout

- **Keep `src/app`.** The wizard maps non-template layouts
  (`utopia-wizard#48`), so moving `src/` to the root is churn, not a fix.
  Put new code where the site's own code lives: `src/config/site.ts`,
  `src/i18n/`, `src/middleware.ts`, `src/lib/webcore.ts`, `src/components/…`;
  `messages/{ms,en,zh}.json` at the repo root.
- **Keep the design.** Plumbing is rebuilt underneath it. Only change visuals a
  fleet rule requires (one h1 + one h2, FOMO banner, USP panel, fleet footer).

## 2. Seed webcore (after step 0 answers)

All through `docs/webcore-api.md` with `WEBCORE_API_KEY`:

1. `POST /api/public/sites { website, company_name }` → keep the returned id as
   `siteId` in `src/config/site.ts`.
2. `POST /api/public/phone-numbers` — one row, `label: 'default'`,
   `location_slug: 'all'`, `page_slug: 'all'`, `is_display: true`.
3. Products: one `POST /api/public/products` per service/product, photos as
   absolute URLs on the real domain. `sort_order` is ignored on POST — `PATCH`
   it afterwards.
4. `PUT /api/website-settings { website, revalidate_url: https://<d>/api/revalidate }`
   — webcore **generates** the secret and returns it; that value goes into
   Vercel Production as `WEBCORE_REVALIDATE_SECRET` at deploy time.

## 3. One issue + one PR per concern, in this order

Open each issue (assignee `atyn-utopia`, title = the problem), branch from the
default branch, PR with `Closes #n`, verify (`npm run build` + localhost check),
merge, then start the next from the updated default branch.

| # | Concern | sewascissorlift PR |
|---|---|---|
| 1 | **i18n** — next-intl, `localePrefix: 'as-needed'`, ms at `/` (existing URLs unchanged), `/en`, `/zh`, `localeDetection: false`, language switcher, `messages/*.json`. Inline `{ bm, en }` copy gets a `zh` key; translate with agents, then check the counts match. | #3 |
| 2 | **Webcore data** — `lib/webcore.ts` (tagged fetches), `/redirect-whatsapp-1` (server-resolved `wa.me`, `preferredRegion = 'sin1'`), `ContactNumber` from `getDisplayPhone(page)`, products grid from webcore, `/api/revalidate` with all four `webcore-*` tags. Remove every other `wa.me`. | #5 |
| 3 | **Tracking** — `t.js` with `data-website={siteConfig.domain}`, `global.d.ts` for `window.uwc`, `whatsapp-…` click, `product-…` impression, `blog-…` click. | #7 |
| 4 | **SEO plumbing** — `app/sitemap.ts` + `app/robots.ts` (delete `public/robots.txt`), JSON-LD, `app/icon.svg`, per-locale share cards `public/og-{locale}.png` via `scripts/og-shot.mjs`. | #9 |
| 5 | **Fleet layout rules** — exactly one h1 + one h2 (other sections h3+), FOMO banner with countdown, `.usp-panel` under the hero, steps section closes with a WhatsApp CTA, header WA hidden on mobile, ≥3 WhatsApp CTAs, fleet footer + Utopia credit, `.gitignore` gets `brand_assets/` and `temporary screenshots/`. | #11 |
| 6 | **Blog from webcore** — convert the old markdown articles to HTML, publish in ms/en/zh (`POST /api/public/blog`), pages read webcore with shared chrome, one h1, WhatsApp CTA banner, Article JSON-LD. | #13 |
| 7 | **Alt text** — translated alts, no caption-only alts. | #15 |
| 8 | GTM (`NEXT_PUBLIC_GTM_ID`) — skip if a teammate owns it. | #17 |
| 9 | GSC verification meta — skip if a teammate owns it. | #19 |
| 10 | **SEO overrides** — `lib/webcoreSeo.ts` (`templates/site-chrome/webcoreSeo.ts`), then push live titles after deploy. | #21 |
| 11 | Homepage title/description length. | #23 |

Never bundle two concerns in one PR, and never two sites in one branch.

## 4. Deploy (CLI projects)

Stop and ask before merging anything that touches env vars, `vercel.json` or
deploy scripts. When the user has said deploy:

```bash
vercel whoami                                   # must be chokchokchok
vercel env add NEXT_PUBLIC_SUPABASE_URL production --scope chokchunynh
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --scope chokchunynh
vercel env add WEBCORE_REVALIDATE_SECRET production --scope chokchunynh   # value from step 2.4
STAGE=<scratch>/stage-<site>
rsync -a --delete --exclude node_modules --exclude .next --exclude .git --exclude '.env*' <worktree>/ "$STAGE/"
mkdir -p "$STAGE/.vercel" && printf '{"projectId":"<prj_…>","orgId":"team_OgsGwzk7eYBdkT2ZOgd96Zbr","projectName":"<project>"}' > "$STAGE/.vercel/project.json"
[ "$(jq -r .projectName "$STAGE/.vercel/project.json")" = "<project>" ] || exit 1
cd "$STAGE" && vercel deploy --prod --yes --scope chokchunynh
```

The assert matters: an unlinked dir plus `--yes` silently creates a new project.

After deploy: open the live domain, check `/redirect-whatsapp-1` renders a
`wa.me` link for the seeded number, `POST /api/revalidate` with the secret
returns all four tags, and blog article URLs return 200 (a build made with 0
posts prerenders none — redeploy after publishing). Then re-run the wizard
checklist (`projects/utopia-wizard/scripts/local-check.ts`).
