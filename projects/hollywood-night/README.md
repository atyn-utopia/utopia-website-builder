# Hollywood Night — RSVP Microsite

Premium Red Carpet-themed RSVP website for the annual dinner event.
Built on Next.js 16 (App Router) + Supabase + Resend.

## What's inside

- **/** — Landing + RSVP form (name, phone, email, attending Y/N, plus-one, transportation)
- **/retrieve** — Phone lookup to reveal issued QR tickets
- **/admin** — Password-protected guest list (stats + table)
- **/admin/scan** — Camera QR scanner; marks tickets as checked-in; rejects reused tickets

Each RSVP can issue 1 or 2 tickets (main + optional plus-one), delivered as a themed PDF attachment via Resend.

## Tech

- Next.js 16 App Router, React 19, Tailwind CSS v4
- Supabase (new separate project for this site)
- Resend for transactional email
- `@react-pdf/renderer` for ticket PDFs
- `qrcode` for QR generation
- `html5-qrcode` for camera scanning
- `proxy.ts` (Next 16 — replaces `middleware.ts`) gates `/admin` and `/api/admin/*`

## Setup

### 1. Create a new Supabase project

Dashboard → New project. Then in the SQL editor, run:

```sql
-- file: supabase/schema.sql
```

(Paste the contents of `supabase/schema.sql`.)

Grab from Project Settings → API:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠ server-only)

### 2. Create a Resend account

- Sign up at https://resend.com with `design.utco@gmail.com`
- Create an API key → `RESEND_API_KEY`
- Verify a sending domain (or use the sandbox address for testing) → `RESEND_FROM_EMAIL`

### 3. Set env vars

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Generate a random admin session secret:

```bash
openssl rand -hex 32
```

### 4. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

- Visit `/admin/login` and use `ADMIN_PASSWORD` to reach the guest list and scanner.

## Database schema

See `supabase/schema.sql`.

- `guests` — one row per RSVP submission
- `tickets` — one row per issued QR pass (main + optional plus-one). The QR encodes `tickets.ticket_id`. Scanning atomically sets `checked_in = true`; the server rejects already-used tickets.

RLS is enabled with no public policies — all access is via the server using the service-role key.

## Deployment (Vercel)

1. Push this folder to a GitHub repo (or import the monorepo with the project root set to `projects/hollywood-night`).
2. Import in Vercel.
3. Add all env vars from `.env.example` in Project Settings → Environment Variables.
4. Deploy. Preview URL → `hollywood-night.vercel.app`.

Functions run on Fluid Compute (Node.js) with no Edge-only APIs.

## Event config

Edit `lib/event.ts` to update date, time, venue, dress code, organizer, contact email. The value flows to the landing page, PDF ticket, and emails automatically.
