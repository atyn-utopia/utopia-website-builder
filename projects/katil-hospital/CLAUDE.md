# Katil Hospital — Ibnu Sina Care
# Project CLAUDE.md
# Created: 2026-03-09

## Overview
Landing page for Ibnu Sina Care Sdn Bhd — hospital bed rental & sales business.
Brand: Ibnu Sina Care (filial piety, emotional, Malay audience)
Domain: sewakatilhospital.my
Stack: Next.js (App Router) + Tailwind v4 + next-intl + Supabase/webcore

**Rebuilt 2026-08-06** from the original static page (kept at `reference/static-site.html`)
as a 1:1 visual port. See `inputs.md` for the domain map, the deliberate deviations
from the static design, and outstanding follow-ups.

## BRAIN SYNC
Reads ~/utopia-brain/BRAIN.md at session start. Blue-collar design rules apply (Rubik headings, real photos, big bold text, conversational BM).

## SOUL SYNC
Reads ~/utopia-brain/SOUL.md at session start.

## Lifecycle
Status: Active
Last Active: 2026-08-06

## Key Details
- **Company:** Ibnu Sina Care Sdn Bhd (since 2016)
- **Brand Color:** Teal #0f766e + Amber/Gold #d97706
- **Target:** Malay families, blue-collar, primary BM
- **WhatsApp:** +60146869468
- **Products:** Hospital beds (2/3/6-function), ripple mattress, wheelchair, O2 concentrator, CPAP (ResMed authorized)
- **USPs:** 5 showrooms, 2hr delivery, buyback guarantee 50%, zero deposit, 24/7 support, rent-to-own
- **Pricing:** Slightly below competitor (RM139/229/649 monthly rental)
- **Showrooms:** KL (HQ), Penang, Melaka, Johor, Langkawi
- **Competitor:** katil-hospital-bed.my (AA Alive Sdn Bhd)

## Image Generation
**Always use `utopia-image-gen` skill for product/lifestyle images in this project.**
- Skill: `~/.claude/skills/user/utopia-image-gen/SKILL.md`
- Script: `~/.claude/skills/user/utopia-image-gen/scripts/generate-image.sh`
- Brand preset: Teal #0f766e + Amber #d97706, Malaysian home, elderly care, gray hospital beds, Malay families
- Default model: `nb2` (Gemini Flash) for quality, `imagen-4` for bulk
- **Image sourcing priority:** (1) Real product photos → (2) AI-generated via this skill → (3) Stock ONLY for lifestyle/hero
- Before deploying, audit every `<img>` tag — does the image match the alt text?

## Roadmap
- [x] v1 landing page — full conversion-optimized page
- [x] Replace stock photos with real product photos (using competitor images)
- [ ] Add real showroom addresses
- [ ] Add Google Ads tracking (gtag)
- [ ] Add Facebook Pixel
- [ ] Schema.org structured data (MedicalBusiness, Product, FAQ)
- [ ] Blog section for SEO
- [ ] Location-specific pages (e.g. /kuala-lumpur, /penang)

## Known Gotchas
- Blog page must be "use client" for filter tabs (server components can't useState)
- Blog images by slug: `/images/blog/${post.slug}.jpg` — `INVALID_IMAGE_OPTIMIZE_REQUEST` = file missing
- Blog/lokasi inner pages need Navbar + FloatingWhatsApp imported directly
- Product images sourced from katil-hospital-bed.my in /public/images/products/
- Hero H1: "Sewa Katil / Hospital / Dari RM129 / /bulan." with bed-3-function.webp

## Changelog
- 2026-03-09 | Home | Initial build — full landing page with hero, products, buyback USP, showrooms, testimonials, FAQ, deployed to Vercel
- 2026-03-09 | Home | Major upgrade — 4 AI-generated images (hero, elderly, delivery, showroom), How It Works section, clinical benefits section, Schema.org structured data
