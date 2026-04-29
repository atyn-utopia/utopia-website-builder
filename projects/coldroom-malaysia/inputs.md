# coldroom-malaysia — Project Inputs

**Created:** 2026-04-27T01:52:00.526Z
**Updated:** 2026-04-27 (inputs gathering completed)
**Slug:** coldroom-malaysia

## Original Prompt
> I want to create a website for cold room rental services. Follow the exact product listing, customer gallery, hero photo and location list same as https://www.coldroommalaysia.com.my/

## Project Inputs (CONFIRMED)

### Company / Ownership
- **Company:** Cold Truck Malaysia Sdn. Bhd.
- **Company UUID:** `99e92ff1-d776-4154-9346-426e3cb91936`

### Product
- **Product name:** Cold Room Rental
- **Product slug:** `cold-room`
- **Brand name:** Cold Room Malaysia
- **Tagline:** Refrigerated Cold Room Delivery & Rental Malaysia

### Domain
- **Vercel domain:** `coldroom-malaysia.vercel.app`
- **Site URL:** `https://coldroom-malaysia.vercel.app`

### Languages
- English (default) — `en`
- Bahasa Melayu — `ms`
- Mandarin (中文) — `zh`

### Phone & Leads Mode
- **Phone (international format):** `60192799832`
- **Leads mode:** `single`
- **Default WhatsApp text:** `Hi, saya berminat dengan Cold Room Rental. Boleh saya dapatkan info lanjut?`

## Reference Site Analysis (https://www.coldroommalaysia.com.my/)

### Hero / Messaging
- **Headline:** Refrigerated Cold Room Delivery & Rental Malaysia
- **Subheadline:** Cold Chain Logistic Refrigerated Cold Room For Rent — Available delivery
- **Tagline / social proof:** "5-Stars Cold Room Rental Service, Over 256,800 Tonnes Delivered!"
- **USPs to mirror:** same-day delivery, 5-min WhatsApp response, 100% HALAL, full Peninsular Malaysia coverage, 99% on-time, 1,730+ customers

### Product Listing (4 temperature tiers)
| Slug | Name | Temperature | Use cases |
|------|------|-------------|-----------|
| `frozen-storage-minus-18` | -18°C Frozen Cold Room | -18°C | Frozen meat, chicken, seafood, frozen fruits & veg |
| `freezer-minus-5-to-minus-10` | -5°C to -10°C Freezer Cold Room | -5°C to -10°C | Bread, pizza dough, pastry, ice cream |
| `chiller-2-to-4` | 2°C to 4°C Chiller Cold Room | 2°C to 4°C | Dairy, milk, cheese, butter, fresh flowers |
| `cool-storage-7-to-10` | 7°C to 10°C Cool Storage | 7°C to 10°C | Pharmaceuticals, beverages, sauces |

**Pricing reference:** From RM5/pallet/day; RM0.50/box/day for smaller quantities. Cold truck rental from RM600.

### Customer Gallery
- Mirror style: 12+ project photos showing stored goods + warehouse operations.
- Grid must have NO blank cells (per CLAUDE rules) — pick column count that divides evenly.

### Service Locations (13 Peninsular states + key cities)
**States (must each have ≥10 sub-locations, total 150–180):**
- Kuala Lumpur (cities: Cheras, Setapak, Pudu, Kepong, Bangsar, Sri Petaling, Brickfields, Wangsa Maju, TTDI, Seputeh, Mont Kiara, Bukit Bintang, Sentul, Ampang, Batu Caves)
- Selangor (Petaling Jaya, Shah Alam, Klang, Port Klang, Subang Jaya, Puchong, Cyberjaya, Kajang, Bangi, Sepang, Hulu Selangor, Rawang, Selayang, Setia Alam, Semenyih, Serdang, Bukit Kemuning, Kota Kemuning, Sungai Buloh, Serendah, Rasa)
- Putrajaya
- Johor (Johor Bahru, Pasir Gudang, Iskandar Puteri, Kulai, Skudai, Senai, Muar, Batu Pahat, Kluang, Pontian, Segamat, Tangkak, Mersing, Yong Peng)
- Penang (George Town, Bayan Lepas, Butterworth, Bukit Mertajam, Seberang Perai, Tanjung Tokong, Air Itam, Jelutong, Tanjung Bungah, Balik Pulau, Nibong Tebal)
- Perak (Ipoh, Taiping, Teluk Intan, Sitiawan, Lumut, Manjung, Kampar, Tanjung Malim, Parit Buntar, Bagan Serai, Kuala Kangsar, Batu Gajah)
- Negeri Sembilan (Seremban, Nilai, Port Dickson, Bahau, Rembau, Tampin, Kuala Pilah, Senawang, Mantin, Lukut)
- Melaka (Melaka City, Ayer Keroh, Bukit Beruang, Klebang, Alor Gajah, Jasin, Masjid Tanah, Merlimau, Batu Berendam, Cheng)
- Kedah (Alor Setar, Sungai Petani, Kulim, Langkawi, Jitra, Pendang, Yan, Kuala Kedah, Baling, Kubang Pasu)
- Kelantan (Kota Bharu, Tumpat, Pasir Mas, Bachok, Tanah Merah, Kuala Krai, Pasir Puteh, Machang, Wakaf Bharu, Pengkalan Chepa)
- Terengganu (Kuala Terengganu, Kemaman, Dungun, Marang, Hulu Terengganu, Setiu, Besut, Chukai, Paka, Jerteh)
- Pahang (Kuantan, Temerloh, Bentong, Raub, Mentakab, Pekan, Jerantut, Cameron Highlands, Kuala Lipis, Maran)
- Perlis (Kangar, Arau, Padang Besar, Kuala Perlis, Beseri, Simpang Empat, Sanglang, Mata Ayer, Kaki Bukit, Wang Kelian)

**Total target:** ≥150 locations, ≤180.

## Special Requirements
- **Rental system:** Yes — show rental pricing (per-pallet/day, per-box/day, per-cubic-meter or per-room).
- **Phone routing:** Single mode (one default number). May upgrade later to rotation/hybrid.
- **HALAL emphasis:** Mention HALAL compliance prominently (key trust signal in MY market).
- **Cold truck cross-sell:** Reference cold truck rental availability (parent company is Cold Truck Malaysia).

## Brand Assets
- `brand_assets/pasted-image-1777254709725.png` — warehouse + pallets (orange-highlighted pallet vs grey/white pallet, white industrial warehouse). Suggests brand colours: **deep orange (#F57C00 / #FF8A00) accent + cool steel grey (#3A3F45) + crisp white**. Custom palette only — never default Tailwind blue/indigo.
- No logo provided yet — design icon-first per CLAUDE.md (must double as `app/icon.svg` favicon).

## Competitor URLs
- Reference: https://www.coldroommalaysia.com.my/

## Design Guardrails (must enforce)
- One H1 + one H2 per page (hero only).
- 3-point USP bar below hero.
- FOMO countdown bar (red OR black bg, never brand colour) with live ticking timer.
- WhatsApp CTAs in **official #25D366 green** only — never themed.
- Inter font globally (no serif) — per user feedback memory.
- No phone/email/domain visible as text. WhatsApp-redirect CTA only.
- Customer gallery grid: no blank slots at any breakpoint.
- Mobile center-aligned for headings, buttons, icons, cards.
- Floating pill nav (Kak Kenduri pattern) considered for visual differentiation.
- Dynamic products: read from Supabase `products` + `product_photos` (NEVER hardcoded).
- Blog: must match electric-wheelchair-malaysia layout exactly.
- 150–180 sub-locations across 13 states (≥10 per state).
