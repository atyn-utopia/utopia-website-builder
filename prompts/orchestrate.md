# Orchestrator Guide

> **MANDATORY:** Before running any agents, read `docs/full-website-setup.md` for the complete step-by-step workflow (Steps 0–13).
> This guide covers agent invocation mechanics only. The full workflow includes non-agent steps (input gathering, codebase scaffolding, screenshot review, tracking setup, phone/company seeding, user approval gates) that are NOT listed here but are MANDATORY.

This guide explains how to run the SEO Website System agent team using Claude's Agent tool. Each agent is a real subagent spawned as a separate subprocess — not role-playing in the same session.

## How to spawn an agent

Use the Agent tool with the contents of the agent's `.md` file as the prompt. Pass all required inputs inline.

```
Agent tool:
  prompt: [contents of agents/alpha.md] + [your project inputs]
```

The agent runs independently, completes its task, and returns its output to you. You then pass that output as input to the next agent.

## Agent execution order

Run agents in this sequence. Some can run in parallel (marked ∥).

```
Step 0:   Gather inputs (company, product, domain, languages, phone, leads mode)
Step 1:   Create project folder

Step 2:   Alpha   — System architecture (confirms languages with user)

Step 3:   Diggie — Supabase schema        (needs: Alpha's output)
          ∥ Sora  — SEO plan               (needs: Alpha's output)
          ∥ Luo Yi — Logo + brand kit       (needs: Alpha's output, client brand assets)
                    → user picks a logo concept (visual gate, blocking before Step 5)

Step 4:   Cici    — Homepage + location copy (needs: Alpha + Sora's output)

Step 5:   Uranus  — UI design direction     (needs: Alpha + Cici's output + Luo Yi's brand kit)
          ∥ Terizla — Technical SEO + i18n + tracking + WhatsApp redirect (needs: Alpha + Sora + Cici's output)

Step 6:   Apply outputs to codebase + add tracking (see docs/full-website-setup.md)
Step 7:   Dev server + screenshot review (minimum 2 rounds)

── GATE 1: user confirms design ──

Step 9:   Diggie — Insert products into Supabase (MANDATORY before deploy)

Step 10:  Beatrix  — Generate 10+ blog articles + insert into Supabase (MANDATORY before deploy)

── GATE 2: user confirms products + blog + locales ──

Step 12:  Seed phone number + register website in company_websites
Step 13:  Dyrroth   — QA verification → GitHub push → Vercel deploy

── POST-DEPLOY: only after the PAID domain is live on Vercel (DNS pointed there) ──

Step 14:  Gloo    — Google integration: GA4 + GTM + GSC + Ads conversion import
                    (needs: paid domain live, project dir, supported locales)
```

Step 3 agents (Diggie + Sora + Luo Yi) run in parallel after Alpha. Luo Yi returns three logo concepts — publish a comparison page (logo on light, on dark, mark at 32px/16px) and let the user pick before Luo Yi finalises.
Step 5 agents (Uranus + Terizla) run in parallel after Cici.
Steps 9 (products) and 10 (blog) are MANDATORY before deploy — never skip or defer.
Both GATE 1 and GATE 2 must pass before Dyrroth deploys.

## What to pass each agent

| Agent   | Step | Required inputs |
|---------|------|----------------|
| Alpha   | 2 | Company, product name/slug, domain, target country, locations list, languages, special requirements |
| Diggie | 3 | Alpha's architecture doc, locations list |
| Sora    | 3 | Alpha's architecture doc, product name, locations list, languages |
| Luo Yi   | 3 | Brand name, product name/slug, domain, product category + target audience, brand tone, client brand assets (logo/colours/fonts) if any, the brief's logo wishes verbatim (colours, motif, reference logos — inspiration for her, never a reason to skip her), list of existing fleet sites |
| Cici    | 4 | Alpha's doc, Sora's SEO plan, product description, brand tone, full locations list, supported locales |
| Uranus  | 5 | Alpha's doc, Cici's homepage copy, Luo Yi's `brand-kit.md`, brand assets, existing site screenshots, product type, target audience, reference images (if any) |
| Terizla   | 5 | Alpha's doc, Sora's plan, Cici's homepage copy, Cici's location copy, confirmed languages, domain, existing codebase state |
| Diggie (Part 2) | 9 | Product list from config/products.ts or reference-research.md, Vercel domain, Supabase service role key |
| Beatrix  | 10 | Website domain, brand name, product niche, target languages, keyword list (optional), Supabase service role key |
| Dyrroth   | 13 | Completed website project, Supabase credentials, GitHub repo URL, Vercel project details |
| Gloo    | 14 | Live **paid** domain, project dir under `projects/`, supported locales, deploy method (git vs `vercel --prod`). Post-deploy only — paid domain must resolve 200 with DNS on Vercel. |

## Collecting outputs

After each agent completes, save its output to the project folder:

```
projects/{project-name}/
  architecture.md          ← Alpha's output
  database.md              ← Diggie's output
  seo-plan.md              ← Sora's output
  brand-kit.md             ← Luo Yi's output (logo, icon, palette, type)
  copy-homepage.md         ← Cici's output (homepage)
  copy-locations.md        ← Cici's output (location pages)
  design-direction.md      ← Uranus's output (UI design)
  technical-seo-i18n.md    ← Terizla's output (SEO + i18n)
```

Dyrroth does not produce a document — he runs integration tests, pushes to GitHub, and deploys to Vercel.

Gloo does not produce a document either — she runs the Google integration (GA4 + GTM + GSC + Ads) via the `google-integration` skill / `scripts/google-automation/` bundle and reports the created IDs + outstanding manual toggles. The per-site config is written to `scripts/google-automation/configs/<domain>.json`. **Gloo runs only after the paid domain is live** — never against a `*.vercel.app` preview URL.

## Parallelism

When spawning parallel agents, send both Agent tool calls in a single message. Do not wait for one to finish before starting the other when inputs are independent.

## Applying outputs to the codebase

After all agents complete (before Dyrroth), apply their outputs to the project codebase:
1. Diggie's SQL → run in Supabase SQL editor
2. Uranus's design direction → follow when building frontend components and pages
3. Terizla's metadata + schema → paste into Next.js page files
4. Terizla's i18n files → write `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/*.json`, `LanguageSwitcher.tsx`
5. Terizla's WhatsApp redirect → write `app/[locale]/redirect-whatsapp-1/page.tsx` + `RedirectClient.tsx`
6. Cici's location copy → populate `lib/locationCopy.ts`

Then get user confirmation on the design before running Dyrroth.
