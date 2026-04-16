# New Website Launch Workflow

Use this prompt as your starting point when spinning up a new SEO website project.

## Step 0 — Gather inputs

Before spawning any agents, collect the following from the user:

```
Project inputs checklist:
[ ] Product name (e.g. "CPAP Machine")
[ ] Product slug (e.g. "cpap-machine")
[ ] Domain (e.g. "cpapmachine.my")
[ ] Brand name (e.g. "CPAP Malaysia")
[ ] Target country (e.g. Malaysia)
[ ] Target locations list (city names + slugs)
[ ] Languages (ask: "English only, or also Bahasa Melayu and/or Mandarin?")
[ ] Special requirements (e.g. rental system, phone routing, multiple products)
[ ] Brand assets available? (logo, colors, fonts, reference images)
[ ] Competitor URLs to analyse? (optional)
```

Do not start the agent pipeline until all checked items are confirmed.

## Step 1 — Create project folder

```
projects/{project-slug}/
  inputs.md      ← paste collected inputs here
```

## Step 2 — Spawn Alpha (System Architect)

Prompt: contents of `agents/alpha.md` + all inputs from Step 0.

Alpha confirms languages with the user during this step.

Wait for Alpha's architecture document before proceeding.

Save output to: `projects/{project-slug}/architecture.md`

## Step 3 — Spawn Cyclops + Sora in parallel

Both need Alpha's output. Spawn simultaneously.

**Cyclops** (Database Engineer):
- Prompt: `agents/cyclops.md` + Alpha's architecture + locations list

**Sora** (SEO Strategist):
- Prompt: `agents/sora.md` + Alpha's architecture + product info + locations + languages

Save outputs to:
- `projects/{project-slug}/database.md`
- `projects/{project-slug}/seo-plan.md`

## Step 4 — Spawn Nana (Copywriter)

Needs: Alpha's architecture + Sora's SEO plan + product description + brand tone + full locations list + supported locales.

Nana writes both homepage copy and all location page copy in one pass.

Prompt: `agents/nana.md` + all inputs above.

Save outputs to:
- `projects/{project-slug}/copy-homepage.md`
- `projects/{project-slug}/copy-locations.md`

## Step 5 — Spawn Kagura + Kimmy in parallel

Both need Nana's output. Spawn simultaneously.

**Kagura** (UI Design Specialist):
- Prompt: `agents/kagura.md` + Alpha's doc + Nana's homepage copy + brand assets + existing site screenshots + product type + target audience + reference images (if any)

**Kimmy** (Technical Implementation):
- Prompt: `agents/kimmy.md` + Alpha's doc + Sora's plan + Nana's homepage copy + Nana's location copy + confirmed languages + domain + existing codebase state

Save outputs to:
- `projects/{project-slug}/design-direction.md`
- `projects/{project-slug}/technical-seo-i18n.md`

## Step 6 — Apply outputs to codebase

Work through each agent's output document and implement it:

1. **Cyclops** → Run schema SQL in Supabase → seed with test data
2. **Alpha** → Scaffold Next.js folder structure
3. **Kagura** → Follow design direction when building frontend components and pages
4. **Nana** → Write homepage copy into `app/[locale]/page.tsx` and message files
5. **Nana** → Populate `lib/locationCopy.ts` with location page copy
6. **Kimmy** → Add `generateMetadata()`, schema JSON-LD, sitemap, robots.txt
7. **Kimmy** → Write `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/*.json`, `LanguageSwitcher.tsx`
8. **Kimmy** → Write `app/[locale]/redirect-whatsapp-1/page.tsx` + `RedirectClient.tsx`

## Step 7 — Dev server + screenshot review

```bash
cd projects/{project-slug}
npm run dev
```

Screenshot: `node screenshot.mjs http://localhost:3000`

Compare against reference images. Fix spacing, typography, color mismatches. Run at least 2 comparison rounds.

## Step 8 — User confirms design

Present the website to the user. Do not proceed until the user confirms:
- Website structure is correct
- Layout matches expectations
- Design and styling are approved

## Step 9 — Spawn Layla (QA & Deploy)

Only run after user confirms the design in Step 8.

**Layla** (QA & Deployment Specialist):
- Prompt: `agents/layla.md` + completed project + Supabase credentials + GitHub repo URL + Vercel details

Layla will:
1. Verify phone number system is connected and working
2. Push code to GitHub
3. Deploy to Vercel
4. Report the live URL

## Step 10 — Insert product details into database (MANDATORY)

After deployment, insert all product/service details into Supabase so the website can pull dynamic product data.

**Inputs needed:**
- Product list with names, descriptions, prices, image URLs (from `reference-research.md` or `config/products.ts`)
- Vercel domain (website column value)
- Supabase service role key (for write access past RLS)

**What to insert:**
- All core products with: name (per locale), description (per locale), price, image URL, category, sort order
- All additional/supplementary products/services
- Follow `docs/PRODUCT-API-GUIDE.md` if available for the exact table schema and insert format

**Verification:**
- Query the products table filtered by website domain — confirm all products appear
- Verify product images load from the stored URLs

## Step 11 — Spawn Hanabi (Blog Writer)

Run after deployment. Can be done independently at any time.

**Hanabi** (Blog Writer):
- Prompt: `agents/hanabi.md` + website domain + brand name + product niche + target languages + Supabase credentials

Hanabi will:
1. Generate 5-10 SEO-optimized blog article titles relevant to the product niche
2. Write full articles (800-1500 words each) with proper heading hierarchy (H1→H2→H3→H4→p)
3. Include real images (Pexels/Unsplash, Asian/Malaysian subjects only), internal backlinks, WhatsApp CTAs
4. Insert into Supabase (`blog_posts` + `blog_translations` tables) for all supported locales
5. Run quality checklist per article

**Prerequisites:**
- Blog route must exist: `app/[locale]/blog/page.tsx` (listing) + `app/[locale]/blog/[slug]/page.tsx` (post)
- If blog routes don't exist yet, build them before running Hanabi
- `blog_posts` and `blog_translations` tables must exist in Supabase

**Output:** List of published blog URLs + Supabase row IDs

## Reusing this system for a new product

To launch a second website (e.g. `wheelchairmalaysia.my`):
1. Create `projects/wheelchair/` folder
2. Follow Steps 0–11 with new inputs
3. Cyclops reuses the same Supabase instance — add rows to `phone_numbers` with `website = 'wheelchairmalaysia.my'`
4. All agent prompts are reusable as-is — just change the inputs
5. Step 10 (product details) and Step 11 (blog posts) are mandatory — don't skip them
