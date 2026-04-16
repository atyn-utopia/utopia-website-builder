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


# Agent Workflow

Agents are real subagents spawned via the Claude Agent tool — each runs as a separate subprocess with its own context. They are NOT role-play personas in the same session.

## How to invoke an agent
Use the Agent tool. Pass the contents of the agent's `.md` file as the prompt, plus the required project inputs.

See `prompts/orchestrate.md` for the full invocation guide.
See `prompts/new-website.md` for the step-by-step new project workflow.

## Execution order

1. Alpha — design system architecture (confirms languages with user)
2. Cyclops + Sora — run in parallel (both need Alpha's output)
3. Nana — generate homepage + all location page copy (needs Alpha + Sora's output)
4. Kagura + Kimmy — run in parallel (both need Nana's output)
   Kagura — propose unique design direction (reviews existing sites, researches inspiration)
   Kimmy — implement technical SEO + i18n + WhatsApp redirect
   → run pre-review checklist (headings, mobile audit, orphaned text, images, colors)
5. Cyclops — insert product details into Supabase (MANDATORY, before deploy)
6. Hanabi — generate blog posts + insert into Supabase (MANDATORY, before deploy)
   → user confirms design + content
7. Layla — integration test → GitHub push → Vercel deploy (blog + products already live)


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