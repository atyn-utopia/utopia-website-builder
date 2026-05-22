# sewa-excavator — Project Inputs

**Created:** 2026-05-22T07:46:23.410Z
**Updated:** 2026-05-22
**Slug:** sewa-excavator

## Prompt
I want to create a website for excavator rental business. the default language for the website is malay language. the product details will be daily and monthly rental and for excavator volvo 200 and volvo 400. i will attached the image later.

you can follow the same style and tweak a bit to be more attractive landing page to attract customer but based on this website https://www.mobilecrane.my/

i want you to use color palette that suitable with the logo, i also provided the logo for light and dark background. the brand name will be Abang Excavator.

---

## Confirmed Inputs (Step 0)

| Field | Value |
|-------|-------|
| **Company** | Utopia Holiday Sdn. Bhd. |
| **Company UUID** | `f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c` |
| **Brand name** | Abang Excavator |
| **Tagline** | Sewa Excavator No.1 Malaysia |
| **Product name** | Excavator Rental |
| **Product slug** | `excavator` |
| **Product variants** | Volvo EC200 (Volvo 200), Volvo EC400 (Volvo 400) — daily + monthly rental |
| **Project slug** | `sewa-excavator` |
| **Domain** | `sewa-excavator.vercel.app` |
| **Site URL** | `https://sewa-excavator.vercel.app` |
| **Target country** | Malaysia |
| **Target locations** | Nationwide — all 13 states + KL + Putrajaya + Labuan, 150–180 locations |
| **Languages** | `ms` (default), `en`, `zh` |
| **Phone (WhatsApp)** | `60174287801` |
| **Leads mode** | `single` |
| **Reference URL** | https://www.mobilecrane.my/ |

---

## Brand Identity (extracted from logo)

The logo is a bold, comic-style construction badge featuring an orange Volvo excavator over the wordmark "ABANG EXCAVATOR — Sewa Excavator No.1 Malaysia". The orange excavator silhouette is the brand's hero element and MUST also be the favicon.

### Colour palette

| Token | Hex | Role |
|-------|-----|------|
| `--brand-orange` | `#F26C1F` | Primary brand — buttons, accents, highlights |
| `--brand-orange-deep` | `#D8550E` | Hover / pressed orange |
| `--brand-orange-pale` | `#FFF1E6` | Tinted backgrounds, eyebrow pills |
| `--brand-charcoal` | `#0F0F0F` | Headings, dark surfaces (matches logo dark) |
| `--brand-steel` | `#2A2D33` | Secondary dark surface |
| `--brand-grey` | `#6B7280` | Body / muted text |
| `--brand-grey-light` | `#E5E7EB` | Borders, dividers |
| `--brand-white` | `#FFFFFF` | Base background |
| `--wa-green` | `#25D366` | WhatsApp CTA (mandatory per rules) |
| `--wa-green-hover` | `#1EBE57` | WhatsApp CTA hover |
| `--google-yellow` | `#FBBC04` | Google review stars |

### Typography

- **Display + body:** `Plus Jakarta Sans` (700/800 for H1/H2, 600 for sections, 400/500 for body)
- **Eyebrow / numerals:** `JetBrains Mono` (uppercase eyebrow tags, price + timer numerals)
- Single sans-only family per the anti-generic guardrails. Tight tracking on headings (-0.02em to -0.04em), 1.65 line-height on body.

---

## Brand Assets on Disk

`projects/sewa-excavator/brand_assets/`

| File | Use |
|------|-----|
| `excavator-dark-logo.png` | Logo for **light backgrounds** (dark wordmark + orange excavator) |
| `excavator-light-logo.png` | Logo for **dark backgrounds** (white wordmark + orange excavator) |
| `exc-ec200e-t4f-2-w-lf-1000x1000.jpg` | Product photo — Volvo EC200E (cutout) |
| `volvo-show-crawler-excavator-ec400f-sv-t4f-2324x1200.jpg` | Product photo — Volvo EC400F (lifestyle) |

The user will additionally drop background/hero images into this folder — check before the Build Pages step runs.

---

## Special Section (mandatory project-unique block)

**Inline rental calculator** — operator picks Volvo EC200 vs EC400, picks rental window (daily / weekly / monthly), enters number of days → live quote. Sits between the Products section and the Process section, on a charcoal panel with orange accents. Fits the trade-equipment buyer flow far better than a generic comparison table.

---

## Database Seed (for Step 13)

```sql
INSERT INTO company_websites (company_id, domain, leads_mode)
VALUES ('f58f6527-88fd-44bd-9c4d-9dbf59cd0c4c', 'sewa-excavator.vercel.app', 'single');

INSERT INTO phone_numbers (website, location_slug, phone_number, label, type, is_active, whatsapp_text, percentage)
VALUES ('sewa-excavator.vercel.app', 'all', '60174287801', 'default', 'default', true,
        'Hi Abang Excavator, saya berminat untuk sewa excavator. Boleh dapatkan sebut harga?', 100);
```
