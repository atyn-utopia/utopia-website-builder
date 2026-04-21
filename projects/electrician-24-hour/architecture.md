# Architecture — Electrician 24 Hours (Malaysia)

## Product model
This project sells **services**, not physical products. The Supabase `products` table is used to list services. Each service row represents an electrician offering (plug point, full rewiring, water heater installation, etc.).

## Stack
- Next.js 15 App Router (TypeScript)
- Tailwind CSS 4 + globals.css design tokens
- next-intl 4 for i18n (en, ms, zh) with `/[locale]` prefix always
- Supabase (shared repo DB) for products, phone numbers, blog posts, company_websites
- Deploy: Vercel (domain `electrician-24-hour.vercel.app`)
- Utopia Webcore tracking: `data-website="electrician-24-hour.vercel.app"`

## Routes
- `/[locale]` — homepage
- `/[locale]/electrician-service/[location]` — location page (14 cities)
- `/[locale]/blog` — blog listing
- `/[locale]/blog/[slug]` — blog post
- `/[locale]/redirect-whatsapp-1?loc={slug}` — WhatsApp redirect

## Data sources
- `products` table — WHERE website = 'electrician-24-hour.vercel.app' AND is_active = true ORDER BY sort_order
- `product_photos` table — joined by product_id
- `phone_numbers` — single default row via `getPhoneNumber.ts`
- `company_websites` — single row, `leads_mode = 'single'`
- `blog_posts` + `blog_translations` — 10+ posts inserted by Hanabi

## ISR
All pages use `export const revalidate = 3600;` so Supabase edits propagate within 1 hour.

## Emergency-service flavouring
Because this is a 24-hour electrician, the design emphasises:
- "Available 24/7" trust badge in hero
- "4-hour arrival" USP card
- Prominent floating WhatsApp CTA on mobile
- Phone-free UI (WhatsApp redirect only)
