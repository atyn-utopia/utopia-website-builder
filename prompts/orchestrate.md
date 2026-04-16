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

Step 3:   Cyclops — Supabase schema        (needs: Alpha's output)
          ∥ Sora  — SEO plan               (needs: Alpha's output)

Step 4:   Nana    — Homepage + location copy (needs: Alpha + Sora's output)

Step 5:   Kagura  — UI design direction     (needs: Alpha + Nana's output)
          ∥ Kimmy — Technical SEO + i18n + tracking + WhatsApp redirect (needs: Alpha + Sora + Nana's output)

Step 6:   Apply outputs to codebase + add tracking (see docs/full-website-setup.md)
Step 7:   Dev server + screenshot review (minimum 2 rounds)

── GATE 1: user confirms design ──

Step 9:   Cyclops — Insert products into Supabase (MANDATORY before deploy)

Step 10:  Hanabi  — Generate 10+ blog articles + insert into Supabase (MANDATORY before deploy)

── GATE 2: user confirms products + blog + locales ──

Step 12:  Seed phone number + register website in company_websites
Step 13:  Layla   — QA verification → GitHub push → Vercel deploy
```

Steps 3 agents (Cyclops + Sora) run in parallel after Alpha.
Step 5 agents (Kagura + Kimmy) run in parallel after Nana.
Steps 9 (products) and 10 (blog) are MANDATORY before deploy — never skip or defer.
Both GATE 1 and GATE 2 must pass before Layla deploys.

## What to pass each agent

| Agent   | Step | Required inputs |
|---------|------|----------------|
| Alpha   | 2 | Company, product name/slug, domain, target country, locations list, languages, special requirements |
| Cyclops | 3 | Alpha's architecture doc, locations list |
| Sora    | 3 | Alpha's architecture doc, product name, locations list, languages |
| Nana    | 4 | Alpha's doc, Sora's SEO plan, product description, brand tone, full locations list, supported locales |
| Kagura  | 5 | Alpha's doc, Nana's homepage copy, brand assets, existing site screenshots, product type, target audience, reference images (if any) |
| Kimmy   | 5 | Alpha's doc, Sora's plan, Nana's homepage copy, Nana's location copy, confirmed languages, domain, existing codebase state |
| Cyclops (Part 2) | 9 | Product list from config/products.ts or reference-research.md, Vercel domain, Supabase service role key |
| Hanabi  | 10 | Website domain, brand name, product niche, target languages, keyword list (optional), Supabase service role key |
| Layla   | 13 | Completed website project, Supabase credentials, GitHub repo URL, Vercel project details |

## Collecting outputs

After each agent completes, save its output to the project folder:

```
projects/{project-name}/
  architecture.md          ← Alpha's output
  database.md              ← Cyclops's output
  seo-plan.md              ← Sora's output
  copy-homepage.md         ← Nana's output (homepage)
  copy-locations.md        ← Nana's output (location pages)
  design-direction.md      ← Kagura's output (UI design)
  technical-seo-i18n.md    ← Kimmy's output (SEO + i18n)
```

Layla does not produce a document — she runs integration tests, pushes to GitHub, and deploys to Vercel.

## Parallelism

When spawning parallel agents, send both Agent tool calls in a single message. Do not wait for one to finish before starting the other when inputs are independent.

## Applying outputs to the codebase

After all agents complete (before Layla), apply their outputs to the project codebase:
1. Cyclops's SQL → run in Supabase SQL editor
2. Kagura's design direction → follow when building frontend components and pages
3. Kimmy's metadata + schema → paste into Next.js page files
4. Kimmy's i18n files → write `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/*.json`, `LanguageSwitcher.tsx`
5. Kimmy's WhatsApp redirect → write `app/[locale]/redirect-whatsapp-1/page.tsx` + `RedirectClient.tsx`
6. Nana's location copy → populate `lib/locationCopy.ts`

Then get user confirmation on the design before running Layla.
