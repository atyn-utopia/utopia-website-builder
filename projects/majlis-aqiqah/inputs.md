# majlis-aqiqah — Project Inputs

**Created:** 2026-08-03
**Slug:** majlis-aqiqah
**Owner:** @atyn-utopia
**Scaffolded from:** sewa-excavator (canonical skeleton)

## Brief
A business offering **affordable aqiqah packages (pakej aqiqah)** in Malaysia. Aqiqah is the
Islamic sunnah of slaughtering livestock (goat/sheep — 2 for a boy, 1 for a girl) to celebrate a
newborn, with the meat cooked and distributed to family, neighbours and the needy. The business
handles the whole majlis end-to-end: livestock selection, slaughter (sembelih) according to
syariah, cooking, packaging, doa/tahnik ceremony arrangements, delivery, and distribution to
asnaf/orphanages on the customer's behalf.

Positioning: **affordable, complete, hassle-free** — "Kami Melengkapkan Majlis Aqiqah Anda"
(the tagline in the client's logo).

Packages are **placeholder data for now** — real pricing to be supplied by the client later.

## Confirmed Inputs (Step 0)

| Field | Value |
|-------|-------|
| **Company** | Kak Kenduri Sdn. Bhd. (`ce95071b-e575-4983-bdd4-66910f45fe34`) |
| **Brand name** | Majlis Aqiqah |
| **Product name** | Pakej Aqiqah |
| **Product slug** | `pakej-aqiqah` |
| **Domain** | `majlisaqiqah.my` |
| **Site URL** | `https://majlisaqiqah.my` |
| **Target country** | Malaysia |
| **Phone (WhatsApp)** | `60102529688` — the live Kak Kenduri catering line (see note below) |
| **Leads mode** | `single` |
| **Languages** | `ms` (default), `en`, `zh` — `localePrefix: 'as-needed'`, `localeDetection: false` |
| **Locations** | 150–180 across all Malaysian states, ≥10 per state |
| **Brand assets** | `brand_assets/aqiqah-dark-bg-logo.png` (white+gold wordmark, dark bg), `brand_assets/aqiqah-light-bg-logo.png` (green+gold wordmark, light bg) |
| **Reference images** | None supplied — design from scratch with high craft |
| **Competitor URLs** | None supplied |

## Brand palette (extracted from the client logo)

The logo is a crescent moon + baby cradle + lantern mark with a "MajlisAqiqah" wordmark.

| Token | Hex | Use |
|-------|-----|-----|
| Emerald (primary) | `#0C5B45` | Wordmark "Majlis", cradle, headings, dark surfaces |
| Emerald deep | `#073A2C` | Deepest surface / footer |
| Gold (accent) | `#C79A4B` | Wordmark "Aqiqah", crescent, lantern, CTAs, dividers |
| Gold light | `#E3C489` | Highlights, gradients |
| Cream | `#FBF7EF` | Page background / pale surfaces |
| WhatsApp green | `#25D366` (hover `#1EBE57`) | WhatsApp CTAs only — never themed |

Never use default Tailwind blue/indigo. Headings = display serif, body = Inter.

## Special requirements
- Packages are placeholders — must be **dynamic from Supabase** `products` + `product_photos`,
  never hardcoded, so the client's real pricing replaces them without a redeploy.
- Halal / syariah-compliance trust signals are the core conversion driver in this niche
  (certified slaughterman, JAKIM-compliant process, livestock health).
- Cultural sensitivity: this is a religious observance, not a party. Tone is warm, respectful,
  reassuring — never salesy-crass.
- The sewa-excavator rental **calculator** does not fit this niche — replace with a
  project-unique section (aqiqah package/gender selector or the 4-step majlis process).

## Still TODO (agent pipeline)

- [ ] Real `config/locations.ts` (150–180 real towns, ≥10/state) — currently the sewa-excavator list
- [ ] Brand assets in `public/brand/` (hero bg, logo, package photos, gallery)
- [ ] All copy in `messages/{ms,en,zh}.json` — currently sewa-excavator copy (placeholder)
- [ ] Brand colour tokens in `app/globals.css`
- [ ] Project-unique special section (replace the sewa-excavator calculator)
- [ ] Seed products + phone + company_websites in Supabase
- [ ] Generate blog posts (Hanabi)

## Supabase access note
The shared tables live in the **`webcore` Postgres schema**, not `public`. Every REST call must
send `Accept-Profile: webcore` (writes: `Content-Profile: webcore`) or PostgREST answers
`PGRST205 "table not found"`. `lib/webcore.ts` already does this. The credentials in the repo-root
`.env.local` (project `mazdcaibvhyqglfctdul`) are correct and working.

## Phone number — decision to confirm at Gate 1
The user asked to reuse "katering-auntyrokiah's number". Two candidates exist and they disagree:

- `60174287801` — the `fallbackPhone` hardcoded in `projects/katering-auntyrokiah/config/site.ts`.
  In the database this number is registered to **`katilhospitalmurah.com.my`** (a hospital-bed
  site), not to any catering domain. It is a stale shared fallback — exactly the anti-pattern
  `docs/full-website-setup.md` warns about.
- `60102529688` — the number actually registered in `phone_numbers` for **`katering.my`** and
  **`cateringservice.my`**, i.e. the live Kak Kenduri catering/kenduri lead line.

**Using `60102529688`.** The katering-auntyrokiah project itself has no `phone_numbers` row for its
own domain (`auntyrokiah-katering.utopiaai.my`), so its live site is running on that stale
fallback. Flag for the client to confirm before the paid domain goes live.

Also note: `company_websites` currently lists only `tablechairrentals.my` under Kak Kenduri
(`ce95071b-e575-4983-bdd4-66910f45fe34`); this site will be the second.
