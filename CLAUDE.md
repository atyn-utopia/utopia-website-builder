# SEO Website System

# Project Overview

This project builds SEO-driven product websites using reusable architecture.

Primary example:
cpapmachine.my

Goals:

- Highlight products and services clearly
- Use strong SEO copywriting
- Generate dynamic location pages
- Store phone numbers in Supabase
- Allow multiple websites to share the same database
- Enable scalable generation of new SEO websites

The system should scale to:

- 100+ websites
- hundreds of location pages
- shared database infrastructure

## Directory Structure
- `agents/` — AI agent definitions and configurations
- `templates/` — Content and page templates
- `prompts/` — Prompt files for AI workflows
- `brand_assets/` — Brand assets (logos, colors, fonts, guidelines)
- `projects/` — Individual project files and outputs

## Conventions
- Keep prompts modular and reusable
- Store brand guidelines in `brand_assets/` before starting a project
- Each project gets its own subfolder under `projects/`


# Technology Stack

Frontend:
Next.js (App Router)

Styling:
Tailwind CSS

Database:
Supabase

Deployment:
Vercel


# Dynamic Product Data (CRITICAL)

Product data on every website MUST be fetched dynamically from the Supabase `products` + `product_photos` tables. NEVER hardcode product lists in config files for display.

## Rules
1. Homepage and location pages query `products` WHERE `website = domain` AND `is_active = true` ORDER BY `sort_order`, joined with `product_photos`
2. Use ISR with `revalidate = 3600` (1 hour) so DB changes propagate without redeploy
3. Grid layout must auto-adjust to any product count — use CSS grid auto-fill or responsive columns that handle 1, 6, or 20 products gracefully
4. Adding a product in the database → it appears on the site automatically (within revalidate window)
5. Setting `is_active = false` or deleting → it disappears automatically
6. `config/products.ts` may exist ONLY as a fallback if Supabase is unreachable — it is NOT the source of truth
7. Product images come from `product_photos.url` — never hardcode image URLs in frontend code

## Database schema
- `products`: id, website, parent_id, name, slug, description, sale_price, rental_price, sort_order, is_active
- `product_photos`: product_id (FK), url


# Agent Team

Alpha — System Architect  
Designs the technical architecture.

Cyclops — Database Engineer  
Designs Supabase schema and database logic.

Sora — SEO Strategist  
Plans keyword structure, page hierarchy, and internal linking.

Nana — Copywriter  
Writes all website copy — homepage sections, location page copy for every target city, and meta copy.

Kagura — UI Design Specialist
Reviews existing site layouts for duplicates, researches fresh design inspiration, and proposes a unique visual direction for each new project.

Kimmy — Technical Implementation Specialist
Implements metadata, schema markup, alt text, SEO optimization, full i18n (translations, routing, language switcher), and WhatsApp redirect lead tracking pages.

Hanabi — Blog Writer
Generates SEO-optimized blog articles with proper heading hierarchy (H1→H2→H3→H4→p), images with alt text, internal backlinks, meta descriptions, and excerpts. Inserts articles into Supabase (blog_posts + blog_translations tables). Can run independently at any time after the website is deployed.

Layla — QA & Deployment Specialist
Verifies phone number system integration with the shared database, pushes code to GitHub, and deploys to Vercel. Runs after user confirms the website design.

Gloo — Analytics & Growth Specialist (Google Integration)
Sets up the site's Google footprint — GA4 + GTM + Google Search Console + Google Ads conversion import — via the internal automation bundle (`scripts/google-automation/`). Runs LAST, after Layla deploys and the site's PAID domain is live. Separate from the Utopia Webcore `t.js` analytics; this is the Google/Ads layer. Driven by the `google-integration` skill.


# Agent Workflow

Agents are real subagents spawned via the Claude Agent tool — each runs as a separate subprocess with its own context. They are NOT role-play personas in the same session.

## How to invoke an agent
Use the Agent tool. Pass the contents of the agent's `.md` file as the prompt, plus the required project inputs.

See `prompts/orchestrate.md` for the full invocation guide.
See `prompts/new-website.md` for the step-by-step new project workflow.
See `docs/full-website-setup.md` for the complete setup reference (MANDATORY — follow this for every new website).

## IMPORTANT: New Website Flow Enforcement
When the user asks to create a new website, you MUST follow `docs/full-website-setup.md` exactly. Do NOT skip steps, reorder steps, or improvise your own flow. Read the doc first, then execute step by step. Every checklist item must be completed before moving to the next step. Both user approval gates (Gate 1: design, Gate 2: content) are blocking — do not proceed without explicit user confirmation.

## Execution order

1. Alpha — design system architecture (confirms languages with user)
2. Cyclops + Sora — run in parallel (both need Alpha's output)
2b. **Keyword volume gate (MANDATORY, blocking)** — verify Sora's head terms against
   real Google search volume before any copy is written. `keyword-volume.mjs --plan
   <seo-plan.md>`; a head term with no volume propagates into every H1, meta title
   and slug on the site. See the `keyword-research` skill.
3. Nana — generate homepage + all location page copy (needs Alpha + Sora's output)
4. Kagura + Kimmy — run in parallel (both need Nana's output)
   Kagura — propose unique design direction (reviews existing sites, researches inspiration)
   Kimmy — implement technical SEO + i18n + WhatsApp redirect
   → run pre-review checklist (headings, mobile audit, orphaned text, images, colors)
5. Cyclops — insert product details into Supabase (MANDATORY, before deploy)
6. Hanabi — generate blog posts + insert into Supabase (MANDATORY, before deploy)
   → user confirms design + content
7. Layla — integration test → GitHub push → Vercel deploy (blog + products already live)
8. Gloo — Google integration (GA4 + GTM + GSC + Ads) — POST-DEPLOY, only after the PAID domain is live on Vercel. Uses the `google-integration` skill / `scripts/google-automation/` bundle.
9. **Keyword audit (T+60 days, recurring)** — `gsc-keyword-audit.mjs` compares the plan
   against real Search Console impressions: which planned keywords got zero, which
   unplanned queries are ranking, which sit in striking distance. Feed findings back
   into `seo-plan.md`. See the `keyword-research` skill.


# SEO Rules

Every page must include:

- clear H1 heading structure
- keyword placement in headings
- meta title
- meta description
- image alt text
- schema markup when relevant
- internal links

Avoid duplicate content.

Location pages must have unique copy.


# Frontend Design Rules

These rules apply to EVERY website. No exceptions.

## Heading Hierarchy
- One **H1** per page — the main title in the hero section
- One **H2** per page — the subtitle in the hero section
- All other section headings use **H3 through H6**
- Never use multiple H1s or H2s on a single page

## Section Backgrounds
- Use **image backgrounds** for some sections (hero, CTA, testimonials)
- Not every section should be flat solid color — mix image backgrounds with overlays for visual depth

## USP Bar
- **3-point USP bar** immediately below the hero section on every homepage
- Mandatory on every project

## Buttons
- All buttons must use the **same rounded button shape** across the entire site
- Only the **color** changes between variants (primary, secondary, CTA)
- Never mix rounded and square buttons on the same site

## CTA Button Copy — Max 3 Words
- Every clickable CTA button label is **3 words maximum** (e.g. `WhatsApp Us Now`, `Get a Quote`, `Book Now`). Punchy labels don't wrap on mobile.
- **Count every word, "WhatsApp" included** — `WhatsApp for a Quote` is 4 words (too long); shorten to `WhatsApp for Quote`, `Get a Quote`, or similar. The button already carries the WhatsApp icon, so dropping "WhatsApp" from the label is fine.
- Applies to **button labels only** — `cta`, `ctaButton`, `ctaPrimary`, `ctaSecondary`, `ctaLabel`, `ctaTemplate`, `whatsappCta`, `bookNow`, etc. It does **not** apply to CTA section headings, subtext/microcopy, badges/tags, image alt text, or sentence-style closing CTAs (those keep their full copy).
- Enforced for `en` + `ms` (word-delimited). `zh` is exempt (CJK isn't space-delimited) but keep its labels equally compact.
- The wizard checks this via `cta-button-word-limit`.

## No Phone Numbers or Domains on Site
- Do NOT display any phone number or domain/URL as visible text anywhere on the website
- All contact goes through WhatsApp redirect buttons only

## Mobile Layout (PRIMARY viewport)
- Most users come from mobile — design for mobile FIRST
- Most items should be **center-aligned** on mobile (headings, buttons, cards, icons)
- Left-aligned body text is acceptable but headings, buttons, and standalone elements must center
- Always review mobile layout before marking design as complete

## Images
- Always **re-check every image** to confirm it is the correct image for its context
- No mismatched or placeholder images left behind
- Add gradient overlay to improve text readability on image backgrounds
- **Never convert image formats automatically.** PNGs stay PNG, JPEGs stay JPEG. Do NOT re-encode PNG → JPEG when "optimizing" or fixing other tasks — it flattens alpha (breaks transparent cutouts and logos) and has corrupted live images in real projects. Resize in place if needed, but keep the original format. If a file is genuinely too large (>5 MB), flag it to the user instead of silently converting.

## Customer Gallery Grid — No Blank Slots
- The customer gallery grid must **never leave an empty / blank slot**. Every cell in the visible grid must contain an image
- Pick a column count that evenly divides the image count (e.g. 12 images → 3, 4, or 6 cols), or pad / trim the image list so the last row is fully filled
- No half-empty last row, no gaps caused by `auto-fill` stranding items
- Applies at every breakpoint — re-check desktop, tablet, and mobile columns

## FOMO Banner — Countdown + Urgent Colour
- FOMO banner at the very top of the page must include a **live countdown timer** (hours:minutes:seconds) that visibly ticks down
- Banner background must be **red or black** (never brand-colour, never yellow/green) — urgency colour only
- Text must remain readable on the chosen background (white or light text)
- Banner stays sticky/visible at the top of the first viewport

## WhatsApp CTA — Official Green Only
- Every WhatsApp CTA button must use the **official WhatsApp green** (`#25D366`, hover `#1EBE57`)
- Never theme WhatsApp buttons with brand colour, black, or any other tint — the green is an instantly-recognised affordance
- Applies to nav CTA, hero CTA, inline CTAs, sticky / floating FAB, final CTA, and the blog article CTA banner
- Icon inside the button stays white

## Heading Hierarchy (reminder + enforcement)
- Every page must have **exactly one H1** AND **exactly one H2** — do not ship a page that is missing either
- H1 = main hero title. H2 = hero subtitle / supporting line underneath. Both belong to the hero section
- All remaining section titles use H3–H6
- Lint every page before marking design complete: H1 count must equal 1, H2 count must equal 1

## Default Layout Template — `water-tank-malaysia`

**`projects/water-tank-malaysia` is the canonical reference for every new site.** Copy these five surfaces from it and change only the brand name, logo file path, colour tokens, and locale-aware labels. Do NOT design per-project variants of any of them.

| Surface | Copy from | What it already gets right |
|---|---|---|
| Header | `components/SiteHeader.tsx` | desktop nav + burger, `LanguageSwitcher`, WhatsApp CTA (`.nav-cta`), mobile-hidden CTA |
| Footer | `components/SiteFooter.tsx` | flat minimal footer — logo + horizontal nav + divider + copyright, "Built by Utopia" credit |
| WhatsApp redirect | `app/[locale]/redirect-whatsapp-1/` | see below — the most important one |
| Blog listing | `app/[locale]/blog/page.tsx` | full chrome, breadcrumb, one h1 + one h2, `.blog-card` grid |
| Blog article | `app/[locale]/blog/[slug]/page.tsx` | full chrome, `ArticleSchema` + `BreadcrumbSchema`, locale canonical + hreflang, `.blog-content` |

**The redirect page is the one to never simplify.** Each line in it exists because something broke without it:
- resolves the phone **server-side** and renders a real `wa.me` link into the HTML — a client-side handoff to the webcore endpoint fails the live DB check and breaks with JS disabled
- `page_slug` routing from `?page=` or the `Referer` path, so per-page numbers work
- `preferredRegion = 'sin1'` — the default US-East region pushed cold starts past the 7s liveness probe
- `robots: { index: false, follow: false }`, `dynamic = 'force-dynamic'`, `revalidate = 0`
- branded interstitial with a spinner and a plain `<a>` fallback for no-JS

- Per-page nav variants (e.g. `BlogNav`) are forbidden — every public page (home, location, blog listing, blog article) renders the same `<SiteHeader />` + `<SiteFooter />` + `<FomoBanner />`.
- Older projects still show the previous reference (`sewa-excavator`, dark footer with locations grid + social). When they disagree, **water-tank wins** — don't copy chrome out of an older site.
- The wizard checks this via `site-chrome-components`, `homepage-uses-site-header`, `location-page-chrome`, `blog-listing-chrome`, `blog-post-chrome`, `no-blognav-usage`.
- **`SiteFooter` must carry the "Built by Utopia AI" brand-CI credit** + the Utopia structural tokens (`--r-button/-card/-pill`, `--ease`, `--dur-*`) in `globals.css`. This is the CI *element* insertion only — keep the site's own palette, fonts, and button shape (no Utopia reskin, no forcing 8px radius onto existing pill buttons). See `docs/full-website-setup.md` → Step 5 → "Utopia Brand CI".

## Text Spacing — Default Line-Heights
- **Headings (h1–h6): `line-height: 1.2`** — tight tracking suits display type and keeps multi-line headings compact.
- **Body text (p, h5/h6 styled as body copy, list items, blockquote, blog content): `line-height: 1.4`** — comfortable reading without becoming airy.
- Set these as defaults in the project's `globals.css` so every component inherits them. Component-level overrides are allowed only when there's a specific design reason (e.g. an oversized hero subtitle).
- Apply identically to `.blog-content` headings + paragraphs so article body matches site type.

```css
/* globals.css — paste this near :root */
h1, h2, h3, h4, h5, h6 { line-height: 1.2; }
p, li, blockquote, .blog-content p, .blog-content li, .blog-content blockquote { line-height: 1.4; }
```


# Dynamic Location Pages

Location pages follow this structure:

/product/location

Example:

/cpap-machine/kuala-lumpur
/cpap-machine/petaling-jaya
/cpap-machine/shah-alam

Each page must include:

- unique introduction
- location-specific keywords
- FAQs
- call-to-action
- dynamic phone number from database

## Location Coverage Requirements
- Every project's `config/locations.ts` must contain **at least 10 sub-locations per state** that the project serves
- Total location count across all states must be **between 150 and 180 locations**
- Sub-locations must be real, populated towns/suburbs (never invented) — verify against reference
- `generateStaticParams` must emit a page for every location, and every location must appear in the sitemap


# Supabase Database Logic

## Shared Database

All projects use a single shared Supabase database. Credentials are stored in `/.env.local` at the repo root and symlinked into each project. Each project's `next.config.ts` loads env from the repo root via `loadEnvConfig` from `@next/env`.

**NEVER create a separate Supabase project per website.** All websites share the same database and are distinguished by the `website` column.

When setting up a new project:
1. Symlink the root `.env.local` into the project: `ln -sf ../../.env.local .env.local`
2. Add `loadEnvConfig(process.cwd() + '/../..')` to the project's `next.config.ts`
3. Add the same env vars to Vercel for production via `vercel env add`

## Phone Numbers & Leads Mode

Phone numbers are stored in the `phone_numbers` table. The `company_websites` table has a `leads_mode` column that controls how numbers are selected.

### 4 Leads Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `single` | One default number → always returned | New websites, single owner |
| `rotation` | Multiple numbers → weighted random by `percentage` | Multiple sales agents |
| `location` | Filter by `location_slug` → weighted random. Falls back to `all` | Regional sales teams |
| `hybrid` | Location pages → location numbers. Other pages → `all` numbers | Regional + national agents |

### How It Works

1. User clicks WhatsApp → redirected to `/redirect-whatsapp-1?loc={slug}`
2. Server reads domain from HTTP host header
3. Fetches `leads_mode` from `company_websites` WHERE `domain = host`
4. Fetches all active numbers from `phone_numbers` WHERE `website = host`
5. Applies mode logic:
   - **single**: Return first number
   - **rotation**: Pick from all numbers by weighted `percentage`
   - **location**: Filter by `location_slug`, pick by percentage. Falls back to `all`
   - **hybrid**: Location pages use location numbers only. Homepage/blog use `all` numbers only
6. Builds WhatsApp URL with `phone_number` + `whatsapp_text` from the selected row

### phone_numbers Table Columns

- `website` — Vercel domain (e.g. `electric-wheelchair-malaysia.vercel.app`)
- `location_slug` — city slug or `'all'` for default
- `phone_number` — full international format
- `whatsapp_text` — pre-filled WhatsApp message
- `percentage` — weight for random selection (relative, doesn't need to sum to 100)
- `label` — `'default'` for initial number, agent name for additional numbers
- `type` — `'default'` for initial setup, `'custom'` for additional numbers
- `is_active` — boolean

## Initial Phone Number Seeding (MANDATORY before deploy)

When creating a new website, always:

1. Insert one row in `phone_numbers`:
```sql
INSERT INTO phone_numbers (website, location_slug, phone_number, label, type, is_active, whatsapp_text, percentage)
VALUES ('domain.vercel.app', 'all', '60XXXXXXXXX', 'default', 'default', true, 'Hi, saya berminat...', 100);
```

2. Ensure `company_websites` row exists with `leads_mode = 'single'` (default).

3. Ask user to choose leads mode during project setup.

The phone number should be provided by the user during project setup. If not provided, ask for it before deployment.

## Blog Posts

Blog posts are also stored in Supabase, scoped by website, and managed through the centralized Blog CMS (admin panel at `projects/admin/`).

## Webcore Token API

`docs/webcore-api.md` is the full reference for writing content into webcore —
products (incl. multi-rate `prices[]`), phone numbers, blog posts, SEO
overrides, keyword research and integrations. **Prefer it over raw SQL /
PostgREST**: it validates input, keys writes to the registered site, and fires
the cache purge so a change reaches the live site without a redeploy.

- Key lives in the gitignored root `.env.local` as `WEBCORE_API_KEY`. Never
  commit it, never print it, never ship it to the client.
- `website` must be the **exact registered domain**. Some fleet sites are
  registered on their `*.vercel.app` host, so verify with a public read before
  writing — a wrong key returns 2xx and orphans the row.
- **`is_display`** on a `phone_numbers` row nominates the number shown as
  visible text in the header/footer. It is independent of lead routing, which
  still resolves per click. Consumed by `getDisplayPhone()`.
- Revalidation tags: `webcore-products`, `webcore-phones`, `webcore-blog`,
  `webcore-seo`. A site's `/api/revalidate` allow-list must contain all four —
  a missing tag is accepted with a 200 and silently dropped.


# Frontend Website Rules

## Always Do First
Invoke the `frontend-design` skill before writing any frontend code.

## Reference Images

If a reference image is provided:

- match layout exactly
- match spacing
- match typography
- match colors

Do not add or improve design.

If no reference image is provided:
design from scratch with high craft.

## Local Server

Always run the site on localhost.

Start the dev server:

node serve.mjs

Server runs at:

http://localhost:3000

Never screenshot file:/// URLs.

## Screenshot Workflow

Use Puppeteer to capture screenshots:

node screenshot.mjs http://localhost:3000

Screenshots are saved in:

temporary screenshots/

After screenshotting:

- compare with reference
- fix spacing differences
- fix typography differences
- fix color mismatches

Perform at least **two comparison rounds**.


# Output Defaults

Unless otherwise specified:

- Single index.html file
- Inline styles
- Tailwind CSS via CDN
- Placeholder images via https://placehold.co
- Mobile-first responsive


# Brand Assets

Always check the `brand_assets/` folder before designing.

If assets exist:

- use provided logos
- use provided color palettes
- use provided images

Do not replace real assets with placeholders.

## Logo Rules

- The logo can be any design (text, graphic, combination — designer's choice)
- The **icon** inside the logo MUST also be used as the **favicon** (`app/icon.svg`)
- The icon must be consistent — the same icon appears in the logo and the favicon
- Extract or design the icon so it works standalone at small sizes (16x16, 32x32)
- If the user provides a logo with an icon element, isolate that icon for the favicon
- If designing from scratch, design the icon first, then build the logo around it


# Anti-Generic Design Guardrails

## Colors
Never use default Tailwind blue or indigo.

Always choose custom brand colors.

## Shadows
Avoid flat shadows like shadow-md.

Use layered shadows with color tint.

## Typography

Do not use the same font for headings and body text.

Use:

display/serif font for headings  
clean sans font for body

Large headings should use tight tracking.

Body text should use generous line height.

## Gradients

Layer multiple gradients and depth effects.

## Animations

Animate only:

- transform
- opacity

Never use transition-all.

## Interactive States

Clickable elements must have:

- hover state
- focus state
- active state

## Images

Add gradient overlay to improve readability.

## Spacing

Use consistent spacing tokens.

## Depth

Design surfaces with layering:

base → elevated → floating